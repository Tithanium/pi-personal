/**
 * subprocessShared.ts — shared deterministic (NO-LLM) helpers for the phase-2
 * B (one-shot) and C (fan-out + swarm) injection subprocesses.
 *
 * Everything here is deterministic and value-safe under plain `node x.mjs`
 * type-stripping: it imports only db.ts / embed.ts / search.ts / structural.ts
 * / spawnRagSubagent.ts (all value-safe) + node built-ins. It is imported both
 * by the extension hook (index.ts, esbuild loader) and by the headless 3-way
 * harness (tests/ab2/run-all.mjs, plain node) — the SAME code path either way.
 */
import { existsSync, readFileSync, readdirSync, rmSync, writeFileSync, copyFileSync, mkdirSync } from "node:fs";
import { join, extname } from "node:path";
import { randomBytes, createHash } from "node:crypto";
import type Database from "better-sqlite3";
import { openDb } from "./db.ts";
import { hybridSearch } from "./search.ts";
import { structuralRegion, listNumberedSections } from "./structural.ts";
import { getRagTmpDir } from "./spawnRagSubagent.ts";

// ─── Common result / options types (shared by B and C) ──────────────────────

/** Uniform subprocess outcome — the hook and the harness consume this shape. */
export interface SubprocessRunResult {
  /** Success gate (run.ok): the run finished cleanly (agent_end, no error, no timeout). */
  ok: boolean;
  /** True when a hard timeout fired somewhere in the run. */
  timedOut: boolean;
  /** The payload text to inject (already pruned/merged); null when nothing. */
  content: string | null;
  /** Total wall time (pre-fetch + children + merge) in ms. */
  wallMs: number;
  tokensIn: number;
  tokensOut: number;
  /** True when the payload is empty (nothing to inject). */
  empty: boolean;
  /** Diagnostics line. */
  note: string;
  /** Subprocess-specific counters (C: nTerms/nFiles/nChildren). */
  internals?: Record<string, unknown>;
}

/** Uniform subprocess invocation options. */
export interface SubprocessOptions {
  /** The user prompt (verbatim). */
  prompt: string;
  /** Child working directory. */
  cwd: string;
  /** Overall hard budget in ms (hook = ragSubagentHookTimeoutMs). */
  timeoutMs: number;
  /** Optional diagnostics base path (children's raw JSONL → <rawBase>.child-*.jsonl). */
  rawBase?: string;
}

// ─── Per-run workspace (temp dirs under the global rag tmp dir) ─────────────

/**
 * Allocate a fresh per-run workspace dir (`~/.pi/rag/tmp/run-<ts>-<rand>/`)
 * with `in/` and `out/` subdirs. B uses it for candidates + final; C uses
 * in/NNN.md (per grep) + out/NNN.md (per swarm child).
 */
export function allocateRunDir(): string {
  const dir = getRagTmpDir();
  const ts = new Date().toISOString().replace(/[:.]/g, "-");
  const path = join(dir, `run-${ts}-${randomBytes(4).toString("hex")}`);
  mkdirSync(join(path, "in"), { recursive: true });
  mkdirSync(join(path, "out"), { recursive: true });
  return path;
}

/** Best-effort recursive remove (Windows file locks after a child kill can
 *  briefly hold handles — retry a few times, then give up; litter only). */
export function removeRunDir(dir: string): void {
  for (let i = 0; i < 3; i++) {
    try {
      rmSync(dir, { recursive: true, force: true });
      return;
    } catch {
      // eslint-disable-next-line no-empty
    }
    // tiny sync yield is not available; a short busy-wait is cheap and bounded
  }
  try { rmSync(dir, { recursive: true, force: true }); } catch { /* give up — litter */ }
}

// ─── Tokenization / identifier extraction (deterministic) ────────────────────

/** Stopwords: common English filler + generic code noise (case-insensitive). */
const STOPWORDS = new Set([
  "the", "a", "an", "and", "or", "but", "if", "then", "else", "when", "while", "of", "to",
  "in", "on", "at", "by", "for", "with", "without", "from", "as", "is", "are", "was", "were",
  "be", "been", "being", "do", "does", "did", "have", "has", "had", "will", "would", "can",
  "could", "should", "may", "might", "must", "this", "that", "these", "those", "it", "its",
  "what", "which", "who", "whom", "how", "why", "where", "there", "here", "not", "no", "yes",
  "so", "such", "than", "too", "very", "just", "also", "only", "into", "over", "under",
  "using", "use", "used", "set", "get", "new", "default", "value", "values", "number",
  "name", "type", "kind", "way", "part", "parts", "case", "cases", "example", "examples",
  "function", "method", "class", "object", "array", "list", "true", "false", "null", "none",
  "and", "e", "t", "i", "s", "of", "to", "in", "on", "up", "an", "go", "it", "no", "off",
  // generic document boilerplate / vendor noise (corpus-agnostic — these are
  // copyright headers + filler, never the technical answer). They create
  // false-positive grep files on PDF-converted docs; filtering them is part of
  // "stopword-filtered" tokenization.
  "copyright", "release", "inc", "rights", "reserved", "proprietary", "confidential",
  "information", "subsidiary", "subsidiaries", "affiliate", "affiliates", "enterprise",
  "synopsys", "all", "build", "gives", "given", "exact", "exactly", "occur", "occurs",
  "differ", "differs", "needed", "required", "protect", "protects",
  // TERM FILTER v2 (P2-R3): English function words — common verbs/particles
  // that rank boilerplate sources highly when used as fan-out terms. With the
  // source filter in place, common TOPIC words ("mesh", "fedoo") are fine.
  "give", "form", "forms", "formed", "return", "returns", "returned",
  "add", "adds", "adding", "added", "call", "called", "calling", "create",
  "creates", "creating", "created", "make", "makes", "making", "made",
  "run", "runs", "show", "shows", "need", "needs", "want", "wants", "let",
  // Sphinx nav boilerplate words — repeated verbatim on every generated
  // page, so frequency-ranked ramification ranks them above real content
  // identifiers. As search terms they only retrieve nav pages or unrelated
  // display/viewer documentation.
  "view", "views", "page", "pages", "stable", "index.html",
]);

const IDENT_RE = /[A-Za-z_][A-Za-z0-9_.]+/g;

/**
 * Extract identifier-like tokens from text (regex `[A-Za-z_][A-Za-z0-9_.]+`),
 * stopword-filtered, deduplicated, in first-appearance order. This covers both
 * "identifiers" (command names, class names, `fd.mesh.rectangle_mesh`) and
 * "significant words" (a word like `temperature` matches the same pattern).
 */
export function extractIdentifiers(text: string): string[] {
  const toks = text.match(IDENT_RE) ?? [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const t of toks) {
    // trailing punctuation is regex noise ("call." → "call"); interior
    // dots stay ("index.html", "fd.mesh").
    const trimmed = t.replace(/[._]+$/g, "");
    if (!trimmed) continue;
    const low = trimmed.toLowerCase();
    if (low.length < 3) continue;
    if (STOPWORDS.has(low)) continue;
    if (!/[0-9]/.test(trimmed) && trimmed.length < 3) continue;
    if (seen.has(low)) continue;
    seen.add(low);
    out.push(trimmed);
  }
  return out;
}

// ─── SOURCE FILTER (deterministic, P2-R3) ─────────────────────────────────
// Shared by B (pre-fetch seed) and C (fan-out seed + per-term hits): a
// chunk is BOILERPLATE when its file path matches a Sphinx/build-artifact
// pattern, or (for HTML files) its visible text — tags + scripts/styles
// stripped — is under 200 characters (a nav/CSS-only page). Boilerplate
// chunks rank highly on common terms ("mesh", "fedoo") and flood the fan-
// out with nav pages / genindex / the flat Command_Reference listing.

const BOILERPLATE_PATH_RE = /genindex|searchindex|py-modindex|_static|_modules|doctrees|objects|\.js$|\.css$/i;

/** True when a chunk's file path looks like a Sphinx/build-artifact page. */
export function isBoilerplatePath(file: string): boolean {
  return BOILERPLATE_PATH_RE.test(file);
}

/**
 * Visible-text length of a document chunk: <script>/<style> blocks + all
 * HTML tags removed, markdown link/image markup removed (a nav-only page is
 * entirely links — its link text/URLs are not content), markdown
 * emphasis/code markers removed, whitespace collapsed. This corpus stores
 * HTML sources as Markdown-converted chunks (turndown), so markdown link
 * markup — not tags — is what inflates a nav-only page. For a nav/CSS-only
 * Sphinx page the visible text is well under 200 characters.
 */
export function visibleTextLen(content: string): number {
  const noScripts = content.replace(/<script\b[\s\S]*?<\/script>/gi, " ");
  const noStyles = noScripts.replace(/<style\b[\s\S]*?<\/style>/gi, " ");
  const noTags = noStyles.replace(/<[^>]*>/g, " ");
  const noLinks = noTags.replace(/!?\[[^\]]*\]\([^)]*\)/g, " ");
  const text = noLinks.replace(/[`*#>|=~_-]+/g, " ");
  return text.replace(/\s+/g, " ").trim().length;
}

/** True when a chunk should be skipped by the source filter. */
export function isBoilerplateChunk(file: string, content: string): boolean {
  if (isBoilerplatePath(file)) return true;
  if (/\.html?$/i.test(file) && visibleTextLen(content) < 200) return true;
  return false;
}

/**
 * HTML-SHELL HARDENING (P2-R11, B final): true when a REGION's raw text is
 * an HTML document shell rather than content — it starts with a doctype /
 * `<head` tag, or its visible (tag-stripped) alphanumeric content is under
 * 100 characters. The R3 source filter measures the INDEXED chunk content
 * (turndown-converted Markdown — visible text ≥ 200 passes), but the fedoo
 * per-attribute Sphinx pages leak it: structural expansion re-reads the RAW
 * file from disk, whose top is the HTML head (measured R10: 12 of the 13
 * B:none sections on fedoo_stresseq_nlgeom were `generated/*.html` shells
 * with 0–71 visible alnum chars). Applied to the region text (raw re-read),
 * which is where the shell actually appears.
 */
export function isHtmlShellText(text: string): boolean {
  if (/^\s*(<!doctype|<head)/i.test(text)) return true;
  const noBlocks = text
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ");
  const noTags = noBlocks.replace(/<[^>]*>/g, " ");
  return (noTags.match(/[A-Za-z0-9]/g) ?? []).length < 100;
}

// ─── Structural expansion of an indexed chunk (reuses R4 structuralRegion) ──

export interface ExpandedRegion {
  file: string;
  start: number;
  end: number;
  kind: string;
  text: string;
}

/**
 * Structural-expand an indexed chunk: read its file, apply `structuralRegion`
 * at the chunk's first line, and return the enclosing block/section (or the
 * chunk's own line range when no recognizable region exists). `fileCache`
 * avoids re-reading a file for multiple chunks.
 */
export function structuralExpandChunk(
  file: string,
  lineStart: number,
  lineEnd: number,
  fileCache: Map<string, string[]>,
): ExpandedRegion | null {
  if (!existsSync(file)) return null;
  let allLines = fileCache.get(file);
  if (!allLines) {
    let raw: string;
    try {
      raw = readFileSync(file, "utf-8");
    } catch {
      return null;
    }
    allLines = raw.split(/\r?\n/);
    fileCache.set(file, allLines);
  }
  const n = allLines.length;
  if (n === 0) return null;
  const ext = extname(file).toLowerCase();
  const anchor = Math.max(1, Math.min(n, lineStart));
  const region = structuralRegion(allLines, ext, anchor);
  let start: number, end: number, kind: string;
  if (region) {
    start = region.start; end = region.end; kind = region.kind;
  } else {
    // Fallback: the chunk's own line range (no recognizable block/section).
    start = Math.max(1, Math.min(n, lineStart));
    end = Math.max(start, Math.min(n, lineEnd));
    kind = "chunk range (no structural region)";
  }
  // CONTAINMENT GUARD (P2-R7): the chunk's own line range must be INSIDE the
  // returned window. Long sections (> STRUCTURAL_BLOCK_CAP) are capped from
  // the section TOP, which can leave the anchor's chunk partially OUTSIDE the
  // window (measured on SAG.txt: the Table 2.3 rows at L1656–1704 fell
  // outside the capped L1350–1549 window — the answering tokens LNSRCH/NEQIT
  // were never injected). Slide the window down (same size, ≤ cap, clamped
  // to the file) so the full chunk range is contained.
  if (end < lineEnd) {
    const size = Math.min(end - start + 1, n);
    start = Math.max(1, Math.min(lineEnd - size + 1, n - size + 1));
    end = start + size - 1;
  }
  const text = allLines.slice(start - 1, end).join("\n");
  if (!text.trim()) return null;
  return { file, start, end, kind, text };
}

// ─── Section building + byte cap ─────────────────────────────────────────────

/**
 * Build one numbered section: `## NNN <absolute path> (lines X–Y · kind)` +
 * exact source text. Numbering (001, 002, …) makes the C merge natural.
 */
export function buildSection(n: number, r: ExpandedRegion): string {
  const nnn = String(n).padStart(3, "0");
  return `## ${nnn} ${r.file} (lines ${r.start}-${r.end} · ${r.kind})\n\n${r.text}\n`;
}

/**
 * Cap an ordered list of sections to a total byte budget, dropping from the
 * END (lowest-ranked) until the joined text fits `maxBytes`.
 */
export function capSections(sections: string[], maxBytes: number): string[] {
  let total = 0;
  const keep: string[] = [];
  for (const s of sections) {
    const b = Buffer.byteLength(s, "utf-8") + 2; // +"\n"
    if (total + b > maxBytes && keep.length > 0) break;
    keep.push(s);
    total += b;
  }
  return keep;
}

/** sha256 of a string (chunk-hash dedup for the C merge). */
export function hashOf(s: string): string {
  return createHash("sha256").update(s).digest("hex");
}

// ─── FTS5 single-term grep (C step 1: one FTS5 search per term) ─────────────

/**
 * One FTS5 keyword search for a single term ("each = one grep"). Returns the
 * top-`limit` matching chunk rowids ranked by bm25. A term that matches
 * nothing (or a malformed FTS5 query) returns [] — the caller then writes no
 * file for that term.
 */
export function fts5TopHits(db: Database.Database, term: string, limit: number): number[] {
  const q = `"${term.replace(/"/g, '""')}"`;
  try {
    const rows = db
      .prepare(`SELECT rowid FROM chunks_fts WHERE chunks_fts MATCH ? ORDER BY bm25(chunks_fts) LIMIT ?`)
      .all(q, limit) as Array<{ rowid: number }>;
    return rows.map((r) => r.rowid);
  } catch {
    return [];
  }
}

/** Fetch a chunk's file/line range by rowid (for structural expansion). */
export function chunkByRowid(
  db: Database.Database,
  rowid: number,
): { file: string; lineStart: number; lineEnd: number } | null {
  try {
    const r = db
      .prepare(`SELECT file_path, line_start, line_end FROM chunks WHERE rowid = ?`)
      .get(rowid) as { file_path: string; line_start: number; line_end: number } | undefined;
    if (!r) return null;
    return { file: r.file_path, lineStart: r.line_start, lineEnd: r.line_end };
  } catch {
    return null;
  }
}

/**
 * Hybrid-search the prompt (top `k` chunks, sorted by hybrid score desc) —
 * shared by B (pre-fetch seed) and C (vector ramification + per-term hits).
 * Each result carries its `score` (hybrid, in [0,1]) so callers can apply the
 * `ragScoreThreshold` relevance gate. Opens NO db itself (caller passes one).
 *
 * P2-R3 SOURCE FILTER: the search pool is over-fetched (k x 4) and
 * boilerplate chunks (Sphinx nav pages, genindex, _static js/css, ... — see
 * isBoilerplateChunk) are dropped BEFORE the top-k slice, so the returned
 * top chunks come from non-boilerplate sources only.
 */
export interface ScoredResult {
  file: string;
  lineStart: number;
  lineEnd: number;
  content: string;
  /** Hybrid score in [0,1] (min-max normalized inside the search pool). */
  score: number;
  /** Raw vector cosine similarity (before min-max normalization, P2-R4). */
  rawCosine: number;
  /** Raw FTS5 bm25() score (P2-R7); null = vector-only hit (no FTS match).
   *  Negative; more negative = better. */
  rawBm25: number | null;
}

/**
 * Hybrid-search the prompt (top `k` chunks, sorted by hybrid score desc) —
 * shared by B (pre-fetch seed) and C (vector ramification + per-term hits).
 * Each result carries its `score` (hybrid, in [0,1]) and `rawCosine` (raw
 * vector cosine before min-max normalization, P2-R4 — the rawCosine is the
 * query-independent relevance signal used by the deterministic gate).
 * Opens NO db itself (caller passes one).
 *
 * P2-R3 SOURCE FILTER: the search pool is over-fetched (k x 4) and
 * boilerplate chunks (Sphinx nav pages, genindex, _static js/css, ... — see
 * isBoilerplateChunk) are dropped BEFORE the top-k slice, so the returned
 * top chunks come from non-boilerplate sources only.
 */
export async function hybridTopChunks(
  db: Database.Database,
  prompt: string,
  k: number,
  alpha: number,
): Promise<ScoredResult[]> {
  const indexMeta = { chunks: [], files: {}, lastBuild: "", embeddingModel: "" };
  const pool = Math.max(k * 4, 16); // over-fetch so top-k survive the filter
  const scored = await hybridSearch(prompt, indexMeta as never, pool, alpha, db);
  const kept = scored.filter((s) => !isBoilerplateChunk(s.chunk.file, s.chunk.content));
  return kept.slice(0, k).map((s) => ({
    file: s.chunk.file,
    lineStart: s.chunk.lineStart,
    lineEnd: s.chunk.lineEnd,
    content: s.chunk.content,
    score: s.hybrid,
    rawCosine: s.rawCosine,
    rawBm25: s.rawBm25,
  }));
}

// ─── RAW RELEVANCE SIGNAL (P2-R4) ─────────────────────────────────────────
// The hybrid score is min-max normalized inside the search pool → the top
// chunk of ANY query scores ≈ 0.4–1.0 → absolute thresholds on the hybrid
// score cannot discriminate unrelated from related. The RAW vector cosine
// (before normalization) IS query-independent: it measures how close the
// prompt embedding is to the chunk embedding in absolute terms. Combined
// with the pool-wide spread (topRaw − medianRaw), it separates the 5
// relevant smoke prompts from unrelated_cooking with margin.

export interface RelevanceStats {
  topRaw: number;
  medianRaw: number;
  spread: number;
  topRatio: number;
}

/**
 * Compute pool statistics from a set of scored results (P2-R4). The stats
 * describe the raw cosine distribution of the top-k non-boilerplate chunks
 * returned for a single query — the caller feeds them to relevanceVerdict.
 */
export function relevanceStats(chunks: Array<{ rawCosine: number }>): RelevanceStats {
  if (!chunks.length) return { topRaw: 0, medianRaw: 0, spread: 0, topRatio: 0 };
  const raws = chunks.map((c) => c.rawCosine).sort((a, b) => a - b);
  const topRaw = raws[raws.length - 1];
  const mid = Math.floor(raws.length / 2);
  const medianRaw = raws.length % 2 === 1
    ? raws[mid]
    : (raws[mid - 1] + raws[mid]) / 2;
  const spread = topRaw - medianRaw;
  const topRatio = topRaw / Math.max(medianRaw, 1e-9);
  return { topRaw, medianRaw, spread, topRatio };
}

/**
 * Deterministic relevance verdict from pool stats (P2-R4).
 *   "empty"  — the prompt is (deterministically) unrelated to the corpus.
 *   "weak"   — topRaw passes rawMin but spread is below spreadMin;
 *               still treated as potentially relevant (rescue fires).
 *   "strong" — topRaw and spread both clear their thresholds.
 *
 * Calibration (P2-R4, 6 smoke prompts, raw vector cosine before min-max):
 *   - relevant:  topRaw ∈ [0.56, 0.70], spread ∈ [0.02, 0.15]
 *   - cooking:   topRaw = 0.38,   spread = 0.10
 * The cleanest single discriminator is topRaw (0.38 vs 0.56 gap = 0.18).
 * Spread does NOT separate cooking (0.10) from fedoo_stresseq (0.02) —
 * it is a secondary signal for the weak/strong distinction only.
 */
export function relevanceVerdict(
  stats: RelevanceStats,
  rawMin: number,
  spreadMin: number,
): "empty" | "weak" | "strong" {
  // Calibration (P2-R4, 6 smoke prompts):
  //   relevant:  topRaw ∈ [0.56, 0.70], spread ∈ [0.02, 0.15]
  //   cooking:   topRaw = 0.38, spread = 0.10
  // topRaw is the primary discriminator; spread is secondary (it does NOT
  // separate cooking from fedoo_stresseq — cooking's spread is higher).
  // So the "empty" gate uses rawMin ALONE: any query whose top raw cosine
  // is below rawMin is treated as unrelated.
  if (stats.topRaw < rawMin) return "empty";
  if (stats.spread >= spreadMin) return "strong";
  return "weak"; // topRaw passes but spread is thin — still not unrelated
}

// ─── DETERMINISTIC MULTI-QUERY PREFETCH (P2-R6) ──────────────────────────
// Three NO-LLM query variants — v1 = prompt as-is, v2 = prompt identifiers
// joined, v3 = top-3 vector-ramified identifiers joined (ranked identifiers
// from v1's non-boilerplate chunks) — each run through hybridTopChunks,
// then MERGE all chunks, dedup (file, line range, best score wins), rank
// by score, structural-expand, region-dedup, keep the top `topRegions`
// structural regions.
//
// This is the deterministic mirror of A's 8-query agentic diversity: the
// extra coverage of re-querying with identifier-only strings, at a measured
// +1–2 s of extra embedding work.
//
// The raw relevance verdict gate (P2-R4 calibration) is computed from the
// FIRST 8 chunks of v1 ONLY — exactly as calibrated (C v4.1 used the same
// top-8 pool; B's R5 pool was top-6 — a strict superset, no empty→relevant
// flips observed on the suite). verdict == "empty" short-circuits: v2/v3
// are not executed (the unrelated edge stays a single embedding round).

/** A structural region from the prefetch pool, carrying the hybrid score of
 *  the best merged chunk that produced it (for caller-side gates) + the raw
 *  signals (P2-R7) used by the two-arm ranking. */
export interface PrefetchRegion {
  region: ExpandedRegion;
  score: number;
  /** Max rawCosine over the arm chunks that produced this region. */
  rawCosine: number;
  /** Best (min) raw BM25 over the arm chunks that produced this region; null = none. */
  rawBm25: number | null;
}

// ─── TWO-ARM MERGED RANKING (P2-R7) ─────────────────────────────────────────
// Per-variant min-max hybrid normalization inflates dense .dat BM25 spikes to
// ~0.75 and buries the answering doc sections (measured R6: L14428 at 0.324,
// L9315 at 0.400 → outside the top-12 region cut). The fix: rank on RAW
// signals that survive normalization. Each pool contributes TWO arms — top N
// by rawCosine (vector relevance) and top N by raw BM25 (lexical relevance).
// The .dat spikes win the BM25 arm only; the doc sections survive via the
// cosine arm. Final rank: max(rawCosine) desc, raw BM25 (more negative =
// better) tie-break, then first-seen order.

/** One pool chunk carrying both raw signals (the two-arm input). */
export interface ArmChunk {
  file: string;
  lineStart: number;
  lineEnd: number;
  rawCosine: number;
  rawBm25: number | null; // null = no FTS match (vector-only hit)
  score: number;          // hybrid (gates / diagnostics)
  order: number;          // first-seen (deterministic tie-break)
}

/** A structural region selected by the two-arm merge, carrying the raw
 *  signals of the (max/min) contributing arm chunks. */
export interface TwoArmRegion {
  region: ExpandedRegion;
  /** Max hybrid score over contributing arm chunks. */
  score: number;
  /** Max rawCosine over contributing arm chunks (the final-rank key). */
  rawCosine: number;
  /** Best (min) raw BM25 over contributing arm chunks; null = none. */
  rawBm25: number | null;
}

const armKey = (c: { file: string; lineStart: number; lineEnd: number }): string =>
  `${c.file}#${c.lineStart}-${c.lineEnd}`;

/** Merge arm chunks by (file, line range): max rawCosine, best (min) rawBm25,
 *  max score, min order. Deterministic. */
function mergeArmChunks(list: ArmChunk[]): ArmChunk[] {
  const m = new Map<string, ArmChunk>();
  for (const c of list) {
    const k = armKey(c);
    const p = m.get(k);
    if (!p) {
      m.set(k, { ...c });
    } else {
      p.rawCosine = Math.max(p.rawCosine, c.rawCosine);
      if (c.rawBm25 != null && (p.rawBm25 == null || c.rawBm25 < p.rawBm25)) p.rawBm25 = c.rawBm25;
      p.score = Math.max(p.score, c.score);
      p.order = Math.min(p.order, c.order);
    }
  }
  return [...m.values()];
}

/**
 * Two-arm selection (P2-R7). For EACH pool: keep the top `armSize` chunks by
 * rawCosine (desc) AND the top `armSize` by raw BM25 (asc = more negative
 * first; FTS-matched chunks only — vector-only hits have no BM25 signal and
 * can only enter via the cosine arm). Union all pools' arms, dedup by
 * (file, line range). The union is the candidate set for the region merge.
 *
 * P2-R9 PER-FOLDER ARM DIVERSIFICATION: when `lca` (the corpus LCA — see
 * computeCorpusLca) and `folderCap` (> 0) are given, EACH arm's top-`armSize`
 * selection is capped at `folderCap` chunks per TOP-LEVEL CORPUS FOLDER
 * (first path segment below the LCA — corpusFolderOf, same key as the C
 * cross-corpus cap) — but only when the arm's uncapped top-`armSize` spans
 * ≥ 2 folders (the cross-corpus saturation case; a single-folder top-8 keeps
 * its full top-`armSize`). A dominant corpus (ANSYS: denser BM25 + more
 * chunks) can no longer saturate a mixed arm — a fedoo prompt's arms keep
 * fedoo slots even when ANSYS chunks rank higher. Without lca/folderCap the
 * selection is exactly as before (plain top-`armSize` slices).
 */
export function twoArmSelect(
  pools: ArmChunk[][],
  opts: { armSize?: number; folderCap?: number; lca?: string } = {},
): ArmChunk[] {
  const armSize = opts.armSize ?? 8;
  const folderCap = opts.folderCap ?? 0;
  const lca = opts.lca ?? "";
  /** Cap a sorted arm at `armSize` with ≤ `folderCap` chunks per corpus
   *  folder (rank order preserved; deterministic). The cap only ENGAGES
   *  when the uncapped top-`armSize` spans ≥ 2 corpus folders — i.e. when a
   *  dominant corpus actually holds top-8 slots AND the other corpus is
   *  competing for the rest (the saturation case). On a single-folder top-8
   *  there is no cross-corpus saturation to break, and capping would only
   *  shrink the arm (measured: ansys_contact arms 18→13, fedoo_weakform_
   *  mesh arms 12→6 — both single-corpus pools, both harmful). */
  const capArm = <T extends ArmChunk>(sorted: T[]): T[] => {
    if (folderCap <= 0 || !lca) return sorted.slice(0, armSize);
    const top = sorted.slice(0, armSize);
    const foldersInTop = new Set(top.map((c) => corpusFolderOf(c.file, lca)));
    if (foldersInTop.size < 2) return top; // no cross-corpus competition → plain top-8
    const perFolder = new Map<string, number>();
    const out: T[] = [];
    for (const c of sorted) {
      if (out.length >= armSize) break;
      const f = corpusFolderOf(c.file, lca);
      const n = perFolder.get(f) ?? 0;
      if (n >= folderCap) continue; // dominant corpus's arm slots used up
      perFolder.set(f, n + 1);
      out.push(c);
    }
    return out;
  };
  const union: ArmChunk[] = [];
  const seen = new Set<string>();
  for (const pool of pools) {
    if (!pool.length) continue;
    const dedup = mergeArmChunks(pool);
    const cosArm = capArm(
      [...dedup].sort((a, b) => (b.rawCosine - a.rawCosine) || (a.order - b.order)),
    );
    const bm25Arm = capArm(
      dedup
        .filter((c): c is ArmChunk & { rawBm25: number } => c.rawBm25 != null)
        .sort((a, b) => (a.rawBm25 - b.rawBm25) || (a.order - b.order)),
    );
    for (const c of [...cosArm, ...bm25Arm]) {
      const k = armKey(c);
      if (!seen.has(k)) { seen.add(k); union.push(c); }
    }
  }
  return mergeArmChunks(union);
}

/** P2-R9 SAME-FILE REGION MERGE: two regions of the SAME file whose ranges
 *  overlap, or whose boundaries sit within this many lines of each other
 *  (gap = next.start − prev.end ≤ GAP), are ONE region (union of ranges),
 *  applied BEFORE the per-file cap. R8 diagnosis: the Contact Technology
 *  Guide's two overlapping 200-line §3.9.3/§3.9.4 windows (L2781-2980 /
 *  L2895-3094) counted as TWO distinct regions, pushing the PZER region
 *  (L2198-2397, rank 9) to the file's 5th — cap-dropped at per-file cap 3.
 *  Merged, the PZER region becomes the file's 2nd distinct region and
 *  survives. */
const SAME_FILE_MERGE_GAP = 40;

/**
 * Region merge of a two-arm candidate pool (P2-R7): structural-expand each
 * arm chunk, dedup by (file, region) — max rawCosine / best rawBm25 / max
 * score / min order wins — then SAME-FILE REGION MERGE (P2-R9: overlapping
 * or ≤ SAME_FILE_MERGE_GAP-line same-file regions → one region, union of
 * ranges), then FINAL RANK by max(rawCosine) desc with raw BM25 (more
 * negative = better) tie-break, cap `perFileCap` DISTINCT (post-merge)
 * regions per file, keep the top `maxRegions` regions (≤ 0 → []).
 */
export function twoArmMergeRegions(
  armPool: ArmChunk[],
  fileCache: Map<string, string[]>,
  maxRegions: number,
  perFileCap = 2,
): TwoArmRegion[] {
  if (maxRegions <= 0 || !armPool.length) return [];
  const byRegion = new Map<string, TwoArmRegion & { order: number }>();
  for (const c of armPool) {
    const region = structuralExpandChunk(c.file, c.lineStart, c.lineEnd, fileCache);
    if (!region) continue;
    const key = `${region.file}#${region.start}-${region.end}`;
    const p = byRegion.get(key);
    if (!p) {
      byRegion.set(key, { region, score: c.score, rawCosine: c.rawCosine, rawBm25: c.rawBm25, order: c.order });
    } else {
      p.score = Math.max(p.score, c.score);
      p.rawCosine = Math.max(p.rawCosine, c.rawCosine);
      if (c.rawBm25 != null && (p.rawBm25 == null || c.rawBm25 < p.rawBm25)) p.rawBm25 = c.rawBm25;
      p.order = Math.min(p.order, c.order);
    }
  }
  // Final rank: max(rawCosine) desc; raw BM25 asc (more negative first, nulls
  // LAST — no BM25 signal); first-seen order breaks the rest.
  const rankCmp = (
    a: TwoArmRegion & { order: number },
    b: TwoArmRegion & { order: number },
  ): number => {
    if (b.rawCosine !== a.rawCosine) return b.rawCosine - a.rawCosine;
    const aB = a.rawBm25, bB = b.rawBm25;
    if (aB == null && bB == null) return a.order - b.order;
    if (aB == null) return 1;
    if (bB == null) return -1;
    if (aB !== bB) return aB - bB;
    return a.order - b.order;
  };
  // SAME-FILE REGION MERGE (P2-R9, BEFORE the per-file cap): group the
  // deduped regions by file; within a file (start-line order) merge
  // consecutive regions that overlap or sit within SAME_FILE_MERGE_GAP
  // lines of the running union. A merged group inherits the max rawCosine /
  // best rawBm25 / max score / min order of its members — its final-rank
  // slot is its best member's (min order), and its text is the union range
  // re-read from the file (fileCache holds it — every member was
  // structural-expanded from it).
  const byFile = new Map<string, Array<TwoArmRegion & { order: number }>>();
  for (const r of byRegion.values()) {
    let arr = byFile.get(r.region.file);
    if (!arr) { arr = []; byFile.set(r.region.file, arr); }
    arr.push(r);
  }
  const merged: Array<TwoArmRegion & { order: number }> = [];
  for (const arr of byFile.values()) {
    arr.sort((a, b) => (a.region.start - b.region.start) || (a.region.end - b.region.end));
    let i = 0;
    while (i < arr.length) {
      let g: TwoArmRegion & { order: number } = arr[i];
      let j = i + 1;
      while (j < arr.length && arr[j].region.start - g.region.end <= SAME_FILE_MERGE_GAP) {
        const m = arr[j];
        g = {
          region: {
            file: g.region.file,
            start: Math.min(g.region.start, m.region.start),
            end: Math.max(g.region.end, m.region.end),
            kind: g.region.kind,
            text: g.region.text, // rebuilt from the union range below
          },
          score: Math.max(g.score, m.score),
          rawCosine: Math.max(g.rawCosine, m.rawCosine),
          rawBm25:
            g.rawBm25 == null ? m.rawBm25
              : m.rawBm25 == null ? g.rawBm25
                : Math.min(g.rawBm25, m.rawBm25),
          order: Math.min(g.order, m.order),
        };
        j++;
      }
      const lines = fileCache.get(g.region.file);
      if (lines && lines.length) {
        const n = lines.length;
        const s = Math.max(1, Math.min(g.region.start, n));
        const e = Math.max(s, Math.min(g.region.end, n));
        g.region.start = s;
        g.region.end = e;
        g.region.text = lines.slice(s - 1, e).join("\n");
      }
      merged.push(g);
      i = j;
    }
  }
  merged.sort(rankCmp);
  const out: TwoArmRegion[] = [];
  const perFile = new Map<string, number>();
  for (const r of merged) {
    const n = perFile.get(r.region.file) ?? 0;
    if (n >= perFileCap) continue; // per-file cap (distinct post-merge regions)
    perFile.set(r.region.file, n + 1);
    out.push({ region: r.region, score: r.score, rawCosine: r.rawCosine, rawBm25: r.rawBm25 });
    if (out.length >= maxRegions) break;
  }
  return out;
}

// ─── Vector ramification: identifier extraction with tier + relevance (P2-R6)
//
// The R5 residual gap: the top-8 vector seed is saturated by README/Sphinx
// pages whose identifiers are English topic words ("Simple", "start",
// "section"), so the frequency-ranked ramified terms never contained the
// answering API identifier (e.g. the prompt says "rectangular mesh" but the
// corpus identifier is `rectangle_mesh` — it sits at v1 rank 16–23, beyond
// the seed). P2-R6 fix (deterministic, corpus-agnostic):
//   1. TIER-0 ONLY — ramified candidates must look like API identifiers:
//      underscore, digit, camelCase, or ALL-CAPS (ANSYS command style).
//      English topic words are dropped (the prompt terms already carry them).
//   2. DOTTED SPLIT — "fd.mesh.rectangle_mesh" registers as `rectangle_mesh`
//      (last segment): the corpus writes call paths dotted, the bare name is
//      the canonical API term.
//   3. JUNK FILTER — Sphinx path fragments ("_sources"), file extensions
//      ("mesh.html", "foo.rst.txt"), leading-underscore tokens, >2 dots.
//   4. IDF GATE (kept from v4.1) — present in MORE than half the seed
//      chunks = page-wide boilerplate → dropped; identifiers present in
//      < 50% are ALWAYS kept.
//   5. RANK — prompt-relevance first (how many prompt terms the identifier
//      matches by segment stem/prefix), then pool frequency, then first-
//      seen. `rectangle_mesh` matches prompt terms "rectangular" (stem
//      rectangl) + "mesh" → scores 2 → outranks the frequency-noise.

const RAMIFY_JUNK_EXACT = new Set(["_sources", "_static", "_modules", "genindex", "searchindex"]);
const RAMIFY_FILE_EXT_RE = /\.(html?|rst|txt|py|js|css|md|ipynb|dat|csv|json|xml)$/i;
const STEM_SUFFIXES = ["ation", "ings", "ing", "ies", "ed", "es", "s", "ar", "al", "ous", "ic", "ly", "e"];

/** True for API-identifier-shaped tokens (tier 0): underscore / digit /
 *  camelCase / ALL-CAPS (len ≥ 2). */
function isTier0Identifier(t: string): boolean {
  return (
    /_/.test(t) ||
    /\d/.test(t) ||
    /[a-z][A-Z]/.test(t) ||
    (t.length >= 2 && t === t.toUpperCase() && /[A-Z]/.test(t))
  );
}

/** True for junk tokens (Sphinx artifacts, file names, path noise). */
function isRamifyJunk(low: string): boolean {
  return (
    RAMIFY_JUNK_EXACT.has(low) ||
    RAMIFY_FILE_EXT_RE.test(low) ||
    low.startsWith("_") ||
    (low.match(/\./g)?.length ?? 0) > 2
  );
}

/** Identifier → search segments: split on "_" and camelCase boundaries. */
function ramifySegments(id: string): string[] {
  return id
    .split("_")
    .flatMap((p) => p.replace(/([a-z0-9])([A-Z])/g, "$1 $2").split(" "))
    .map((p) => p.toLowerCase())
    .filter((p) => p.length >= 2);
}

/** A word plus its single-suffix-stripped stems ("rectangular" → {rectangular, rectangl}). */
function stemSet(w: string): Set<string> {
  const out = new Set([w]);
  for (const sfx of STEM_SUFFIXES) {
    if (w.length - sfx.length >= 3 && w.endsWith(sfx)) out.add(w.slice(0, -sfx.length));
  }
  return out;
}

/** Shared prefix length of two lowercased words. */
function commonPrefixLen(a: string, b: string): number {
  const n = Math.min(a.length, b.length);
  let i = 0;
  while (i < n && a[i] === b[i]) i++;
  return i;
}

/**
 * True when a search segment and a prompt term refer to the same concept:
 * exact, shared stem, or a long-enough common prefix ("rectangle" /
 * "rectangular" share "rectang" — single-suffix stemming misses this pair).
 */
function segMatchesPrompt(seg: string, p: string): boolean {
  if (seg === p) return true;
  const ss = stemSet(seg);
  for (const s of ss) if (stemSet(p).has(s)) return true;
  if (seg.length >= 4 && p.length >= 4) {
    const minLen = Math.min(seg.length, p.length);
    if (commonPrefixLen(seg, p) >= Math.max(4, Math.floor(0.6 * minLen))) return true;
  }
  return false;
}

export interface RamifiedTerm {
  term: string;
  /** Number of distinct prompt terms this identifier matches (segment stem/
   *  prefix) — the prompt-relevance key of the ranking. */
  promptScore: number;
  /** Chunks of the seed pool containing the identifier. */
  poolFreq: number;
  /** Files of the seed chunks containing the identifier (P2-R11: source of
   *  C v5's corpus-folder gate on the ramified half). */
  sourceFiles: string[];
}

/**
 * Deterministic vector ramification over a set of seed chunks (P2-R6):
 * tier-0 identifiers, dotted-split, junk-filtered, IDF-gated (kept when
 * present in ≤ half the seed chunks), ranked by (promptScore desc, poolFreq
 * desc, first-seen). NO db access, NO LLM.
 */
export function ramifyIdentifiers(
  promptTerms: string[],
  chunks: Array<{ content: string; file?: string }>,
): RamifiedTerm[] {
  const freq = new Map<string, number>();
  const origCase = new Map<string, string>();
  const firstSeen = new Map<string, number>();
  const srcFiles = new Map<string, Set<string>>();
  let ord = 0;
  const register = (id: string, file?: string) => {
    const low = id.toLowerCase();
    if (low.length < 3 || isRamifyJunk(low) || !isTier0Identifier(id)) return;
    if (!firstSeen.has(low)) firstSeen.set(low, ord++);
    freq.set(low, (freq.get(low) ?? 0) + 1);
    if (!origCase.has(low)) origCase.set(low, id);
    if (file) {
      if (!srcFiles.has(low)) srcFiles.set(low, new Set());
      srcFiles.get(low)!.add(file);
    }
  };
  for (const c of chunks) {
    for (const id of extractIdentifiers(c.content)) {
      if (id.includes(".")) {
        // Dotted call paths ("fd.mesh.rectangle_mesh") → the canonical bare
        // name (last segment). Undotted identifiers register as-is.
        const last = id.split(".").pop()!;
        register(last, c.file);
      } else {
        register(id, c.file);
      }
    }
  }
  // IDF gate: present in MORE than half the seed chunks = page-wide
  // boilerplate → dropped. Identifiers in < 50% are always kept.
  const maxBoilerFreq = Math.floor(chunks.length / 2);

  // Prompt-relevance: how many DISTINCT prompt terms does the identifier
  // match (any segment, by exact / shared stem / long common prefix)?
  const promptLow = promptTerms.map((p) => p.toLowerCase());
  const scoreOf = (id: string): number => {
    const matched = new Set<number>();
    for (const seg of ramifySegments(id)) {
      for (let pi = 0; pi < promptLow.length; pi++) {
        if (segMatchesPrompt(seg, promptLow[pi])) matched.add(pi);
      }
    }
    return matched.size;
  };

  const out: RamifiedTerm[] = [];
  for (const [low, f] of freq.entries()) {
    if (f > maxBoilerFreq) continue;
    out.push({
      term: origCase.get(low)!, promptScore: scoreOf(low), poolFreq: f,
      sourceFiles: [...(srcFiles.get(low) ?? [])],
    });
  }
  out.sort(
    (a, b) =>
      (b.promptScore - a.promptScore) ||
      (b.poolFreq - a.poolFreq) ||
      (firstSeen.get(a.term.toLowerCase())! - firstSeen.get(b.term.toLowerCase())!),
  );
  return out;
}

export interface MultiQueryPrefetch {
  /** Query strings actually executed (v1 always; v2/v3 when non-empty and
 *   the verdict is not "empty"). */
  queries: string[];
  /** The v1 pool (prompt as-is, top `v1K` non-boilerplate chunks, score
 *   desc) — exposed for C v5's corpus-folder affinity (P2-R11). */
  v1Pool: ScoredResult[];
  /** Merged + deduped chunks (key: file#lineStart-lineEnd, best score wins),
 *   ranked by score desc (first-seen variant order v1→v2→v3 breaks ties). */
  merged: ScoredResult[];
  /** Two-arm candidate pool (P2-R7): per-variant arms (top-8 rawCosine +
 *   top-8 raw BM25), unioned + deduped — the input of the region merge. */
  armPool: ArmChunk[];
  /** Structural regions of the two-arm pool, region-deduped, per-file cap 2,
 *   top `topRegions` kept in FINAL RANK order (max rawCosine desc, raw BM25
 *   tie-break; empty when topRegions ≤ 0 or earlyEmpty). */
  regions: PrefetchRegion[];
  /** Raw relevance stats from the first 8 chunks of v1 — the calibrated
 *   verdict gate input (P2-R4). */
  stats: RelevanceStats;
  /** The verdict gate (empty/weak/strong), exactly as calibrated. */
  verdict: "empty" | "weak" | "strong";
  /** extractIdentifiers(prompt) — first half of C's fan-out term set. */
  promptTerms: string[];
  /** Vector-ramified identifiers (P2-R6) from the v1 pool: tier-0,
 *   dotted-split, junk-filtered, IDF-gated, ranked (promptScore, poolFreq,
 *   first-seen). Second half of C's fan-out term set (capped by the caller
 *   at ragCFanoutMaxTerms) + source of the v3 query (top 3). */
  ramifiedTerms: RamifiedTerm[];
  /** True when the empty-verdict short-circuit fired (v2/v3 not executed). */
  earlyEmpty: boolean;
}

/** Verdict pool depth: the calibrated gate uses the top-8 v1 pool (C v4.1
 *  pool; B R5 used top-6 — a strict superset). */
const VERDICT_POOL_K = 8;

/**
 * Run the deterministic multi-query prefetch (P2-R6). NO LLM. Opens NO db
 * itself (caller passes one). Never throws on search-level failures (a
 * variant that errors contributes zero chunks — the others still merge).
 */
export async function multiQueryPrefetch(
  db: Database.Database,
  prompt: string,
  opts: {
    /** Top-k for the v2/v3 variants. */
    variantK: number;
    /** v1 pool depth (36: reaches the deep-pool answering chunks — the
     *  `rectangle_mesh` def sits at v1 rank 26–33 on this corpus; the
     *  calibrated verdict still uses only the first 8). */
    v1K: number;
    /** Max structural regions to return (≤ 0 → skip expansion entirely). */
    topRegions: number;
    /** Per-file cap on structural regions (P2-R8; default 2). The two-arm
     *  merge keeps at most this many regions of the SAME file. */
    perFileCap?: number;
    /** Per-top-corpus-folder cap on each two-arm selection (P2-R9; config
     *  ragArmFolderCap). A dominant corpus can hold at most this many
     *  chunks in a single arm. 0/undefined = disabled. */
    armFolderCap?: number;
    alpha: number;
    rawMin: number;
    spreadMin: number;
  },
): Promise<MultiQueryPrefetch> {
  const promptTerms = extractIdentifiers(prompt);
  const v2Query = promptTerms.join(" ");

  // Round 1 (parallel, independent): v1 = prompt as-is (depth v1K); v2 =
  // prompt identifiers joined. v3 depends on v1's chunks (ramification) →
  // round 2. Fixed merge order v1→v2→v3 keeps the result deterministic
  // regardless of which search resolves first.
  const [v1, v2] = await Promise.all([
    hybridTopChunks(db, prompt, opts.v1K, opts.alpha),
    v2Query
      ? hybridTopChunks(db, v2Query, opts.variantK, opts.alpha)
      : Promise.resolve([] as ScoredResult[]),
  ]);

  // Raw relevance verdict gate — from the FIRST 8 v1 chunks ONLY, exactly
  // as calibrated (P2-R4).
  const stats = relevanceStats(v1.slice(0, VERDICT_POOL_K));
  const verdict = relevanceVerdict(stats, opts.rawMin, opts.spreadMin);
  if (verdict === "empty") {
    return {
      queries: [prompt], v1Pool: v1, merged: [], armPool: [], regions: [], stats, verdict,
      promptTerms, ramifiedTerms: [], earlyEmpty: true,
    };
  }

  // Vector ramification from the v1 pool (P2-R6) — shared by the v3 query
  // (below) and C's fan-out term set (exposed on the result).
  const ramifiedTerms = ramifyIdentifiers(promptTerms, v1);

  // v3 = top-3 ramified identifiers from the v1 pool ONLY (spec: "from
  // v1's hybridTopChunks over filtered sources"), ranked by POOL FREQUENCY
  // (the most-repeated identifier directions in the vector pool) with exact
  // prompt-term matches excluded (v2 already re-queries those — v3's job is
  // DIVERSITY BEYOND THE PROMPT). Evidence (R6): fedoo_rectangle_mesh →
  // "hole_plate_mesh disk_mesh rectangle_mesh" (the mesh-module identifiers,
  // incl. the answering def at v1 rank 26–33); ansys_large_deflection →
  // "NLGEOM UNSYM NROPT" (the nonlinearity-control section with
  // LNSRCH/NEQIT) instead of "APDL SOLVE …" (redundant prompt vocabulary).
  const promptExact = new Set(promptTerms.map((t) => t.toLowerCase()));
  const v3Query = ramifiedTerms
    .filter((r) => !promptExact.has(r.term.toLowerCase()))
    .sort((a, b) => (b.poolFreq - a.poolFreq)) // stable: (promptScore, poolFreq, first-seen) breaks ties
    .slice(0, 3)
    .map((r) => r.term)
    .join(" ");
  const v3 = v3Query
    ? await hybridTopChunks(db, v3Query, opts.variantK, opts.alpha)
    : [];

  const queries = [
    prompt,
    ...(v2Query ? [v2Query] : []),
    ...(v3Query ? [v3Query] : []),
  ];

  // MERGE all chunks; dedup by (file, line range) — best score wins, fixed
  // first-seen order (v1 → v2 → v3) for the deterministic tie-break; rank
  // by score desc.
  const byKey = new Map<string, ScoredResult>();
  const firstSeen = new Map<string, number>();
  let ord = 0;
  for (const chunk of [...v1, ...v2, ...v3]) {
    const key = `${chunk.file}#${chunk.lineStart}-${chunk.lineEnd}`;
    const prev = byKey.get(key);
    if (!prev) {
      byKey.set(key, chunk);
      firstSeen.set(key, ord++);
    } else if (chunk.score > prev.score) {
      byKey.set(key, chunk); // same region reached via another variant
    }
  }
  const merged = [...byKey.entries()]
    .map(([key, c]) => ({ key, c }))
    .sort((a, b) => (b.c.score - a.c.score) || (firstSeen.get(a.key)! - firstSeen.get(b.key)!))
    .map(({ c }) => c);

  // TWO-ARM MERGED RANKING (P2-R7): per variant, keep two arms — top-8 by
  // rawCosine and top-8 by raw BM25 — union across variants, structural-
  // expand, region-dedup, per-file cap, final rank by max(rawCosine) with
  // raw BM25 tie-break, top `topRegions` (≤ 0 → skip the file I/O entirely).
  // The raw signals survive the per-variant min-max normalization that buried
  // the answering doc sections under dense .dat BM25 spikes (R6 root cause).
  // P2-R9: the per-folder arm cap (armFolderCap + corpus LCA) diversifies
  // each arm across top-level corpus folders — a saturated v1 pool (ANSYS
  // on fedoo prompts) can no longer starve the other corpus's chunks out of
  // the arms, which would also starve the vector ramification (the v3
  // identifiers are drawn from the saturated v1 pool).
  const lca = (opts.armFolderCap ?? 0) > 0 ? computeCorpusLca(db) : "";
  const toArm = (c: ScoredResult, order: number): ArmChunk => ({
    file: c.file, lineStart: c.lineStart, lineEnd: c.lineEnd,
    rawCosine: c.rawCosine, rawBm25: c.rawBm25, score: c.score, order,
  });
  // Deterministic global first-seen order: variant index v1→v2→v3, then
  // position inside the variant pool.
  const armPool = twoArmSelect(
    [v1, v2, v3].map((pool, vi) => pool.map((c, i) => toArm(c, vi * 10_000 + i))),
    { armSize: 8, folderCap: opts.armFolderCap ?? 0, lca: lca || undefined },
  );
  const fileCache = new Map<string, string[]>();
  const armRegions = opts.topRegions > 0
    ? twoArmMergeRegions(armPool, fileCache, opts.topRegions, opts.perFileCap ?? 2)
    : [];
  const regions: PrefetchRegion[] = armRegions.map((r) => ({
    region: r.region, score: r.score, rawCosine: r.rawCosine, rawBm25: r.rawBm25,
  }));

  return { queries, v1Pool: v1, merged, armPool, regions, stats, verdict, promptTerms, ramifiedTerms, earlyEmpty: false };
}

/** Re-exported so B/C open the index once per run through one shared module. */
export { openDb };

// ─── TOP-LEVEL CORPUS FOLDER (P2-R8, C cross-corpus saturation) ─────────────
// The index mixes multiple corpora under a common root (e.g.
// `…/00_Biblio/Doc_tech_ANSYS` + `…/00_Biblio/Doc_tech_fedoo`). For a fedoo
// prompt the vector pools can saturate on ANSYS .txt files, so the C file
// selection caps distinct files per TOP-LEVEL CORPUS FOLDER. The folder key is
// corpus-generic (no hardcoded names): the longest common ancestor (LCA)
// directory of ALL indexed files, then the first path segment below it
// (→ `Doc_tech_ANSYS` / `Doc_tech_fedoo`). db paths are forward-slash
// normalized (db.ts migratePathSpelling).

/** Longest common ancestor DIRECTORY of all indexed file paths ("" = no
 *  common prefix, e.g. a single file or disjoint roots). Deterministic. */
export function computeCorpusLca(db: Database.Database): string {
  let rows: Array<{ path: string }>;
  try {
    rows = db.prepare("SELECT path FROM files").all() as Array<{ path: string }>;
  } catch {
    return "";
  }
  if (!rows.length) return "";
  const segs = rows.map((r) => r.path.split("/"));
  const first = segs[0];
  let i = 0;
  while (i < first.length && segs.every((s) => s[i] === first[i])) i++;
  // The LCA is a directory: if the full first path is a common prefix down to
  // its last segment (all paths identical), back off one so the result is a
  // proper ancestor directory (keeps the first-below segment non-empty).
  const commonSegs = first.slice(0, i);
  if (commonSegs.length === first.length && segs.length <= 1) {
    return commonSegs.slice(0, -1).join("/");
  }
  return commonSegs.join("/");
}

/** The top-level corpus folder for a file given the corpus LCA ("" when the
 *  file is at/above the LCA or the LCA is empty — those all share one key,
 *  which is the safe degenerate case). */
export function corpusFolderOf(file: string, lca: string): string {
  if (!lca) return "(root)";
  const rel = file.startsWith(lca + "/") ? file.slice(lca.length + 1) : file;
  const seg = rel.split("/")[0];
  return seg || "(root)";
}

/**
 * P2-R11 C v5 — the set of indexed file paths whose path-below-folder is
 * indexed in 2+ top-level corpus folders (the "files present in both
 * folders" exception of the corpus-gated fan-out). Deterministic, corpus-
 * generic (no hardcoded names). Empty when the LCA is empty or no such
 * duplication exists (measured 0 on the current index).
 */
export function computeSharedFolderFiles(db: Database.Database, lca: string): Set<string> {
  const out = new Set<string>();
  if (!lca) return out;
  let rows: Array<{ path: string }>;
  try {
    rows = db.prepare("SELECT path FROM files").all() as Array<{ path: string }>;
  } catch {
    return out;
  }
  const byBelow = new Map<string, Map<string, string[]>>();
  for (const r of rows) {
    const p = r.path;
    if (!p.startsWith(lca + "/")) continue;
    const rel = p.slice(lca.length + 1);
    const folder = rel.split("/")[0];
    const below = rel.slice(folder.length + 1);
    if (!byBelow.has(below)) byBelow.set(below, new Map());
    const perFolder = byBelow.get(below)!;
    if (!perFolder.has(folder)) perFolder.set(folder, []);
    perFolder.get(folder)!.push(p);
  }
  for (const perFolder of byBelow.values()) {
    if (perFolder.size < 2) continue;
    for (const paths of perFolder.values()) for (const p of paths) out.add(p);
  }
  return out;
}

// ─── DEFINITION-NEIGHBOR PASS (P2-R11, B final, NO LLM) ───────────────────
// Deterministic mirror of A's "topic → definition" depth. R10 blind judge:
// the fast variants find the TOPIC sections A reaches, but miss the adjacent
// DEFINITION sections (§3.9.1.1 / §3.9.3 / §3.9.4.2 FKN details, SAG §5
// transient tabs, Solution Controls definitions). For each SELECTED region
// the pass enumerates the sibling sections of its file — same parent chapter
// (the heading one level above) for numbered docs, other top-level blocks
// for Python, same-parent sections for Markdown — keeps those whose text
// contains ≥ 2 significant prompt terms, and returns the best up to
// `maxNeighbors` (spawner rawCosine desc, matched-term count desc, file
// order) within the +`budgetBytes` additional byte budget.

export interface DefNeighbor {
  /** The sibling section (structured like any ExpandedRegion). */
  region: ExpandedRegion;
  /** rawCosine of the selected region that spawned this neighbor (the
   *  "best by rawCosine" key — neighbors inherit their spawner's signal). */
  viaRawCosine: number;
  /** Number of distinct significant prompt terms in the neighbor text. */
  nTerms: number;
  /** 1-based number of the selected region that spawned it. */
  viaSection: number;
}

const DEF_NEIGHBOR_MIN_TERMS = 2;
/** Neighbor sections are capped at 150 lines (half the structural cap):
 *  definition sections (real-constant tables, tab-option tables, NROPT,
 *  transient tabs) are short, and the +6 KB neighbor budget must fit up to
 *  3 of them — a 200-line slice of the ANSYS guides is ~14 KB alone. */
const DEF_NEIGHBOR_MAX_LINES = 150;

const escapeRe = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Run the definition-neighbor pass (P2-R11). NO db access, NO LLM. Files are
 * read on demand (a few per run; the pass is called once per B run).
 * Candidates are ranked by (spawner rawCosine desc, in-sibling-set IDF score
 * desc — a term present in every sibling (page headers: ANSYS/APDL) is worth
 * nothing, a rare term (FKN, Raphson, TIMINT) carries the signal — matched-
 * term count desc, file/line asc) and appended under the STRICT
 * +`budgetBytes` budget (a candidate that does not fit is skipped, never
 * truncated).
 */
export function definitionNeighborPass(
  selected: Array<{ region: ExpandedRegion; rawCosine: number }>,
  promptTerms: string[],
  opts: { maxNeighbors?: number; budgetBytes?: number } = {},
): DefNeighbor[] {
  const maxNeighbors = opts.maxNeighbors ?? 3;
  const budgetBytes = opts.budgetBytes ?? 6144;
  if (!selected.length || !promptTerms.length || maxNeighbors <= 0) return [];

  // Significant terms: the stopword-filtered prompt identifiers (word-
  // boundary, case-insensitive).
  const termRes = promptTerms
    .map((t) => t.trim())
    .filter((t) => t.length >= 3)
    .map((t) => ({ re: new RegExp(`\\b${escapeRe(t)}\\b`, "i") }));
  if (!termRes.length) return [];
  const matchTerms = (text: string): number[] => {
    const idxs: number[] = [];
    for (let ti = 0; ti < termRes.length; ti++) if (termRes[ti].re.test(text)) idxs.push(ti);
    return idxs;
  };

  const fileCache = new Map<string, string[] | null>();
  const readLines = (file: string): string[] | null => {
    let lines = fileCache.get(file);
    if (lines === undefined) {
      lines = null;
      if (existsSync(file)) {
        try { lines = readFileSync(file, "utf-8").split(/\r?\n/); } catch { lines = null; }
      }
      fileCache.set(file, lines);
    }
    return lines && lines.length ? lines : null;
  };

  const overlapsSelected = (file: string, s: number, e: number): boolean =>
    selected.some((x) => x.region.file === file && s <= x.region.end && x.region.start <= e);

  interface Candidate {
    region: ExpandedRegion;
    viaRawCosine: number;
    nTerms: number;
    viaSection: number;
    termIdxs: number[];
  }
  const candidates: Candidate[] = [];
  const seenKey = new Set<string>();

  for (let si = 0; si < selected.length; si++) {
    const sel = selected[si];
    const file = sel.region.file;
    const lines = readLines(file);
    if (!lines) continue;
    const n = lines.length;
    const selStart = sel.region.start;
    const selEnd = sel.region.end;

    const siblings: Array<{ s: number; e: number; kind: string }> = [];
    const ext = extname(file).toLowerCase();

    if (ext === ".py") {
      // Sibling sections = the OTHER top-level (indent-0) def/class blocks
      // of the file — the code analog of "same parent chapter".
      const DEF_RE = /^(def|class)\s+[\w$]/;
      for (let i = 0; i < n; i++) {
        if (!DEF_RE.test(lines[i])) continue;
        let e0 = n;
        for (let j = i + 1; j < n; j++) {
          const l = lines[j];
          if (!l.trim()) continue;
          if (/^\S/.test(l)) { e0 = j; break; }
        }
        const s = i + 1;
        if (overlapsSelected(file, s, e0 - 1)) continue;
        siblings.push({ s, e: Math.min(e0 - 1, i + DEF_NEIGHBOR_MAX_LINES), kind: "sibling function/class" });
      }
    } else {
      const secs = listNumberedSections(lines);
      if (secs.length >= 2) {
        // The selected section = the real numbered section with the greatest
        // line overlap with the selected region (merged/capped regions may
        // span several sections; the best overlap anchors the parent chapter).
        let best = -1;
        let bestOv = 0;
        for (let i = 0; i < secs.length; i++) {
          const s = secs[i];
          const ov = Math.min(s.end, selEnd) - Math.max(s.line, selStart) + 1;
          if (ov > bestOv) { bestOv = ov; best = i; }
        }
        if (best >= 0) {
          const selSec = secs[best];
          // Same parent chapter: sections whose numeric prefix shares the
          // chapter prefix — the selected section's first min(comps-1, 2)
          // components (the heading one level above, floored at the
          // 2-component chapter level: ANSYS guides number to 4–5 levels,
          // and the definition sections A reaches — §2.2.3.2 NROPT,
          // §5.3.3.3 Transient Tab — are children of SIBLINGS under the
          // 2-component chapter, not under the one-level-up parent).
          const parentPrefix = selSec.num
            .split(".")
            .slice(0, Math.min(selSec.comps - 1, 2))
            .join(".");
          for (let i = 0; i < secs.length; i++) {
            if (i === best) continue;
            const s = secs[i];
            if (!s.num.startsWith(parentPrefix + ".")) continue; // same chapter prefix
            // (Ancestors of the selected section are excluded by the overlap
            // check below — their range contains the selected region.)
            if (overlapsSelected(file, s.line, s.end)) continue;
            siblings.push({ s: s.line, e: Math.min(s.end, s.line + DEF_NEIGHBOR_MAX_LINES - 1), kind: "sibling doc section" });
          }
        }
      } else if (ext === ".md" || ext === ".markdown") {
        // Markdown: siblings = sections whose parent heading (nearest higher
        // heading above) is the same as the selected section's parent.
        const MD_RE = /^(#{1,6})\s+/;
        const heads: Array<{ line: number; level: number }> = [];
        for (let i = 0; i < n; i++) {
          const m = lines[i].match(MD_RE);
          if (m) heads.push({ line: i + 1, level: m[1].length });
        }
        if (heads.length >= 2) {
          const parentKey = (idx: number): string => {
            for (let j = idx - 1; j >= 0; j--) {
              if (heads[j].level < heads[idx].level) return `${heads[j].line}:${heads[j].level}`;
            }
            return "(root)";
          };
          let selIdx = -1;
          for (let j = heads.length - 1; j >= 0; j--) {
            if (heads[j].line <= selStart) { selIdx = j; break; }
          }
          if (selIdx >= 0) {
            const selKey = parentKey(selIdx);
            for (let j = 0; j < heads.length; j++) {
              if (j === selIdx) continue;
              if (parentKey(j) !== selKey) continue;
              const s = heads[j].line;
              const e0 = j + 1 < heads.length ? heads[j + 1].line - 1 : n;
              if (overlapsSelected(file, s, e0)) continue;
              siblings.push({ s, e: Math.min(e0, s + DEF_NEIGHBOR_MAX_LINES - 1), kind: "sibling doc section" });
            }
          }
        }
      }
      // RST (title + underline) is intentionally not handled: the corpus's
      // RST sources are stubs/quick-starts with no definition depth.
    }

    for (const sib of siblings) {
      const key = `${file}#${sib.s}-${sib.e}`;
      if (seenKey.has(key)) continue;
      seenKey.add(key);
      const text = lines.slice(sib.s - 1, sib.e).join("\n");
      if (!text.trim()) continue;
      const termIdxs = matchTerms(text);
      if (termIdxs.length < DEF_NEIGHBOR_MIN_TERMS) continue;
      candidates.push({
        region: { file, start: sib.s, end: sib.e, kind: sib.kind, text },
        viaRawCosine: sel.rawCosine, nTerms: termIdxs.length, viaSection: si + 1, termIdxs,
      });
    }
  }

  // In-sibling-set IDF (per file): a term present in every sibling section
  // (page headers carry ANSYS/APDL on every ANSYS section; the chapter title
  // carries "transient" through all of SAG §5) is worth nothing; a rare term
  // (FKN, Raphson, TIMINT, penalty) is the signal. score = Σ (nDocs − df_t)
  // / nDocs over the candidate's matched terms (deterministic).
  const byFile = new Map<string, Candidate[]>();
  for (const c of candidates) {
    if (!byFile.has(c.region.file)) byFile.set(c.region.file, []);
    byFile.get(c.region.file)!.push(c);
  }
  const idfScore = new Map<Candidate, number>();
  for (const [file, list] of byFile) {
    const nDocs = list.length;
    const df = new Map<number, number>();
    for (const c of list) for (const ti of new Set(c.termIdxs)) df.set(ti, (df.get(ti) ?? 0) + 1);
    for (const c of list) {
      let s = 0;
      for (const ti of new Set(c.termIdxs)) s += (nDocs - (df.get(ti) ?? 0)) / Math.max(nDocs, 1);
      idfScore.set(c, s);
    }
  }

  // Best first: spawner rawCosine desc (the spec's "best by rawCosine" —
  // neighbors inherit their spawner's signal), then IDF score desc, matched-
  // term count desc, (file asc, line asc) — deterministic.
  candidates.sort(
    (a, b) =>
      (b.viaRawCosine - a.viaRawCosine) ||
      ((idfScore.get(b) ?? 0) - (idfScore.get(a) ?? 0)) ||
      (b.nTerms - a.nTerms) ||
      (a.region.file < b.region.file ? -1 : a.region.file > b.region.file ? 1 : a.region.start - b.region.start),
  );

  // STRICT budget: a candidate that does not fit the remaining budget is
  // skipped (never truncated); the total stays ≤ budgetBytes.
  const out: DefNeighbor[] = [];
  let used = 0;
  for (const c of candidates) {
    if (out.length >= maxNeighbors) break;
    const b = Buffer.byteLength(c.region.text, "utf-8") + 64; // + section header overhead
    if (used + b > budgetBytes) continue; // try a cheaper candidate
    out.push({ region: c.region, viaRawCosine: c.viaRawCosine, nTerms: c.nTerms, viaSection: c.viaSection });
    used += b;
  }
  return out;
}
