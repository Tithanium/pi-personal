/**
 * build.ts — build-aside indexing + atomic reference-file swap.
 *
 * Instead of mutating the live `rag.db` in place (which exposes a half-built
 * index and makes every caller wait on the same file), a build:
 *
 *   1. creates a NEW database file whose name does not exist yet
 *      (`rag.db.build-<timestamp>-<rand>`),
 *   2. carries the current index over from the live DB (unless a from-scratch
 *      forced rebuild was requested),
 *   3. runs the normal indexFiles() pipeline against the NEW database,
 *   4. on success — moves the live reference file aside, renames the new file
 *      to `rag.db`, and DELETES the old reference file.
 *
 * The live index is therefore never modified during a build: searches keep
 * running against the old database the whole time, and the fresh index
 * appears atomically when the swap runs. If a build fails (or the process
 * dies) the live database is untouched — at worst an orphaned secondary file
 * is left behind, which the extension removes at startup
 * (cleanupOrphanedSecondaries).
 */
import { existsSync, readdirSync, renameSync, unlinkSync } from "node:fs";
import { join } from "node:path";
import { randomBytes } from "node:crypto";
import Database from "better-sqlite3";
import { load as loadVec } from "sqlite-vec";
import { dbFile, getRagDir } from "./store.ts";
import { initSchema } from "./db.ts";
import { indexFiles } from "./indexing.ts";
import { normalizePath } from "./chunking.ts";
import type { ProgressCallbacks } from "./indexing.ts";

export interface BuildOptions {
  /** Files to (re)index into the new database. */
  paths: string[];
  /** Force re-embed even when the content hash matches (full rebuild). */
  force?: boolean;
  /**
   * Carry existing rows over from the live database into the new one before
   * indexing (default: true). Pass false for a from-scratch build
   * (`/rag rebuild --force`).
   */
  copyExisting?: boolean;
  /** File paths to drop from the new database (deleted/pruned files). */
  deletePaths?: string[];
  /** Progress callbacks, forwarded to indexFiles(). */
  progress?: ProgressCallbacks;
}

export interface BuildResult {
  indexed: number;
  chunks: number;
  skipped: number;
  durationMs: number;
  /** Rows carried over from the live database. */
  copied: number;
  /** Chunk rows removed via `deletePaths`. */
  pruned: number;
  /** The secondary file that was renamed onto the live reference. */
  builtAt: string;
}

/** Prefix of in-flight secondary database files. */
export const SECONDARY_PREFIX = "rag.db.build-";

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/** Pick a secondary database path that does not exist yet. */
export function freshSecondaryPath(ragDir: string): string {
  for (let i = 0; i < 8; i++) {
    const p = join(ragDir, `${SECONDARY_PREFIX}${Date.now()}-${randomBytes(4).toString("hex")}`);
    if (!existsSync(p)) return p;
  }
  return join(ragDir, `${SECONDARY_PREFIX}${Date.now()}-${process.pid}-${Math.floor(Math.random() * 1_000_000)}`);
}

/** Remove the WAL/SHM sidecars of a database file (best effort). */
function removeSidecars(mainPath: string): void {
  for (const suffix of ["-wal", "-shm"]) {
    try {
      const p = mainPath + suffix;
      if (existsSync(p)) unlinkSync(p);
    } catch { /* best effort */ }
  }
}

/** Remove a secondary database file plus any sidecars it left behind. */
export function removeSecondary(path: string): void {
  removeSidecars(path);
  try {
    if (existsSync(path)) unlinkSync(path);
  } catch { /* best effort */ }
}

/**
 * Remove orphaned secondary databases and old-reference asides in `ragDir` —
 * leftovers of a build whose process died before (or during) the final swap.
 * The live reference file is only ever touched by the swap itself, so orphans
 * can never corrupt the index; they are just litter. Returns the count.
 */
export function cleanupOrphanedSecondaries(ragDir: string): number {
  let entries: string[] = [];
  try {
    entries = readdirSync(ragDir);
  } catch {
    return 0; // store dir does not exist yet
  }
  let removed = 0;
  for (const e of entries) {
    const isSecondary = e.startsWith(SECONDARY_PREFIX);
    const isOldAside = /^rag\.db\.old-/.test(e);
    if (isSecondary || isOldAside) {
      removeSecondary(join(ragDir, e));
      removed++;
    }
  }
  return removed;
}

// ── Build lock — serializes ALL builds (explicit commands + background) ─────

let chain: Promise<unknown> = Promise.resolve();
let active = false;
let kind: string | undefined;

/** True while any index build (background or explicit) is running. */
export function isBuildActive(): boolean {
  return active;
}

/** Label of the build currently running ("index", "rebuild", "refresh", "background refresh"). */
export function buildKind(): string | undefined {
  return kind;
}

/**
 * Run `fn` with all other builds serialized behind it. The lock is released
 * when `fn` settles (success or failure) and the queued build starts next.
 */
export async function withBuildLock<T>(newKind: string, fn: () => Promise<T>): Promise<T> {
  const prev = chain;
  let release!: () => void;
  chain = new Promise<void>((r) => {
    release = r;
  });
  await prev;
  active = true;
  kind = newKind;
  try {
    return await fn();
  } finally {
    active = false;
    kind = undefined;
    release();
  }
}

/**
 * Build a new index into a secondary database file and, on success, atomically
 * replace the live reference file with it (old file moved aside, new file
 * renamed to `rag.db`, old reference file deleted). See the module header for
 * the design. Throws on any failure (and cleans up the secondary file) — the
 * live database is never touched by a failed build.
 */
export async function buildAndSwapIndex(opts: BuildOptions): Promise<BuildResult> {
  const ragDir = getRagDir();
  const livePath = dbFile(ragDir);
  const secondary = freshSecondaryPath(ragDir);
  const startedAt = Date.now();
  // Stable path identity (forward slashes) so prune + index matches the
  // stored form regardless of how callers spelled the paths.
  const paths = opts.paths.map(normalizePath);
  const deletePaths = (opts.deletePaths ?? []).map(normalizePath);

  let newDb: Database.Database | null = null;
  try {
    // 1. Fresh secondary database — a name that does not exist yet.
    newDb = new Database(secondary);
    newDb.pragma("journal_mode = WAL");
    newDb.pragma("foreign_keys = ON");
    loadVec(newDb);
    initSchema(newDb);

    // 2. Carry the current index over (unless a from-scratch build) so that
    //    indexFiles' hash check skips unchanged files and previously indexed
    //    content is still served by the new database after the swap.
    let copied = 0;
    if (opts.copyExisting !== false && existsSync(livePath)) {
      const quoted = `'${livePath.replace(/'/g, "''")}'`;
      newDb.exec(`ATTACH DATABASE ${quoted} AS oldsrc`);
      try {
        const { c } = newDb.prepare("SELECT COUNT(*) AS c FROM oldsrc.chunks").get() as { c: number };
        if (c > 0) {
          newDb.transaction(() => {
            // Explicit rowids keep chunks↔chunks_vec alignment intact.
            // replace(..., '/',) normalizes path spelling at copy time so the
            // secondary is always in the stable slash form even if the live
            // database predates the backslash-to-slash migration.
            newDb.exec(`
              INSERT INTO chunks(rowid, id, file_path, chunk_content, line_start, line_end, chunk_hash, indexed_at, tokens)
              SELECT rowid, id, replace(file_path, '\\', '/'), chunk_content, line_start, line_end, chunk_hash, indexed_at, tokens
              FROM oldsrc.chunks
              ORDER BY rowid
            `);
            newDb.exec(`
              INSERT INTO chunks_vec(rowid, embedding)
              SELECT rowid, embedding
              FROM oldsrc.chunks_vec
            `);
            newDb.exec(`
              INSERT OR REPLACE INTO files(path, hash, chunks, indexed, size, embedded)
              SELECT replace(path, '\\', '/'), hash, chunks, indexed, size, embedded
              FROM oldsrc.files
            `);
            newDb.exec(`
              INSERT OR REPLACE INTO metadata(key, value)
              SELECT key, value
              FROM oldsrc.metadata
            `);
          })();
          copied = c;
        }
      } finally {
        newDb.exec("DETACH DATABASE oldsrc");
      }
    }

    // 3. Prune deleted files in the new database.
    let pruned = 0;
    if (deletePaths.length) {
      const delVec = newDb.prepare(
        "DELETE FROM chunks_vec WHERE rowid IN (SELECT rowid FROM chunks WHERE file_path = ?)",
      );
      const delChunk = newDb.prepare("DELETE FROM chunks WHERE file_path = ?");
      const delFile = newDb.prepare("DELETE FROM files WHERE path = ?");
      for (const fp of deletePaths) {
        delVec.run(fp);
        pruned += delChunk.run(fp).changes;
        delFile.run(fp);
      }
    }

    // 4. Index new/changed files into the NEW database (normal pipeline).
    const result = await indexFiles(paths, opts.progress, newDb, opts.force);

    // 5. Finalize the secondary: checkpoint the WAL into the main file, close,
    //    drop sidecars — the file is now a complete standalone database.
    newDb.pragma("wal_checkpoint(TRUNCATE)");
    newDb.close();
    newDb = null;
    removeSidecars(secondary);

    // 6. Atomic swap: live → aside, secondary → live, delete the aside.
    await swapIn(secondary, livePath);

    return {
      indexed: result.indexed,
      chunks: result.chunks,
      skipped: result.skipped,
      durationMs: Date.now() - startedAt,
      copied,
      pruned,
      builtAt: secondary,
    };
  } catch (err) {
    if (newDb) {
      try { newDb.close(); } catch { /* already closed */ }
    }
    removeSecondary(secondary);
    throw err;
  }
}

/**
 * Move the live reference file aside, rename `secondary` onto it, then delete
 * the old reference file. Retries while Windows holds short-lived locks on
 * the live file (concurrent readers); a partial swap is always rolled back so
 * the index is never left missing.
 */
async function swapIn(secondary: string, live: string): Promise<void> {
  let lastErr: unknown = null;
  for (let attempt = 0; attempt < 50; attempt++) {
    let aside: string | null = null;
    try {
      // The secondary's WAL was checkpointed+closed; drop any stale sidecars
      // of the live DB before renaming (a fresh open recreates what it needs).
      removeSidecars(live);
      if (existsSync(live)) {
        aside = `${live}.old-${Date.now()}-${attempt}`;
        renameSync(live, aside);
      }
      renameSync(secondary, live);
      // Swap done — delete the previous reference file. Retry briefly: the
      // file may still be held by a reader that opened it moments ago.
      for (let i = 0; i < 20; i++) {
        if (!aside || !existsSync(aside)) break;
        try {
          unlinkSync(aside);
          break;
        } catch {
          await sleep(50);
        }
      }
      return;
    } catch (err) {
      lastErr = err;
      // Roll back a partial swap — we must never leave the index missing.
      if (aside && existsSync(aside) && !existsSync(live)) {
        try {
          renameSync(aside, live);
          aside = null;
        } catch { /* retry loop will try again */ }
      }
      await sleep(100);
    }
  }
  throw new Error(
    `[pi-local-rag] atomic index swap failed after retries — live=${live} · secondary=${secondary} · last error: ${String(lastErr)}\n` +
    `The previous index was left in place (nothing was lost); rerun the index operation.`,
  );
}
