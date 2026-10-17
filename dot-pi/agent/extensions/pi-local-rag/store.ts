import { existsSync, mkdirSync, renameSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

// Legacy lens→rag rename target. Overridable via env for tests.
export const LEGACY_DIR = process.env.PI_RAG_LEGACY_DIR ?? join(homedir(), ".pi", "lens");

/** Global fallback store. Lazily evaluated so tests can override $HOME. */
export const GLOBAL_RAG_DIR = () => join(homedir(), ".pi", "rag");

/**
 * Resolve the active RAG store directory.
 *
 * Contract: the store is ALWAYS the global dir `${homedir()}/.pi/rag/`
 * (created if missing, with lens→rag migration handled by ensureDir),
 * UNLESS `$PI_RAG_DIR` is set, in which case that path wins (created if
 * missing). There is no cwd walk-up and no per-cwd store creation, ever.
 */
export function getRagDir(): string {
  const override = process.env.PI_RAG_DIR;
  if (override) {
    if (!existsSync(override)) mkdirSync(override, { recursive: true });
    return override;
  }
  const global = GLOBAL_RAG_DIR();
  ensureDir(global);
  return global;
}

/** SQLite database file (post-migration). */
export function dbFile(ragDir: string): string { return join(ragDir, "rag.db"); }
/** Legacy JSON index, kept for the one-shot auto-migration in openDb. */
export function legacyIndexFile(ragDir: string): string { return join(ragDir, "index.json"); }
/** @deprecated use dbFile/legacyIndexFile. Kept temporarily for callers that still reach for the JSON path. */
export function indexFile(ragDir: string): string { return join(ragDir, "index.json"); }
export function configFile(ragDir: string): string { return join(ragDir, "config.json"); }

export function ensureDir(ragDir: string) {
  if (existsSync(ragDir)) return;
  // Lens→rag migration only applies at the home-dir global store.
  if (ragDir === GLOBAL_RAG_DIR() && existsSync(LEGACY_DIR)) {
    try {
      renameSync(LEGACY_DIR, ragDir);
      return;
    } catch { /* fall through to mkdir */ }
  }
  mkdirSync(ragDir, { recursive: true });
}
