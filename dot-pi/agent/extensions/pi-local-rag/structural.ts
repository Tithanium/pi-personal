/**
 * structural.ts — deterministic structural expansion for rag_expand (R4) and
 * the phase-2 B/C subprocesses.
 *
 * When an anchor line falls inside a code function/class (or a short example
 * script) or inside a documentation section, the WHOLE enclosing block/section
 * is returned (capped) instead of a padded window — one call yields a full
 * function, signature or section, never a window cut mid-signature.
 *
 * Extracted from index.ts so BOTH the production hook (index.ts, loaded under
 * pi's esbuild loader) and the headless 3-way harness (tests/ab2/run-all.mjs,
 * plain `node` type-stripping) can import `structuralRegion` WITHOUT pulling in
 * index.ts's import chain (which reaches search.ts/indexing.ts/build.ts — not
 * value-safe under plain node). This module imports only node built-ins.
 */

export const STRUCTURAL_BLOCK_CAP = 200;  // max lines for an enclosing code block / doc section
export const STRUCTURAL_SHORT_FILE = 250; // files at or under this many lines are returned whole (short example scripts)
export const CODE_EXTS = new Set([".py", ".js", ".mjs", ".cjs", ".ts", ".tsx", ".jsx", ".c", ".h", ".cc", ".cpp", ".cxx", ".hpp", ".hxx", ".cs", ".go", ".rs", ".java", ".rb", ".php", ".swift", ".kt", ".scala", ".json"]);

const lineIndent = (l: string): number => {
  let i = 0;
  while (i < l.length && (l[i] === " " || l[i] === "\t")) i++;
  return i;
};

/**
 * Enclosing Python def/class block (0-based inclusive [start, end]).
 * The anchor line must BE the def/class line or sit at a deeper indent than
 * it. The block ends at the first non-blank line at an indent <= the def's
 * indent; decorator lines immediately above the def are included.
 */
function findPythonBlock(allLines: string[], anchorIdx: number): [number, number] | null {
  const DEF_RE = /^\s*(def|class)\s+[\w$]/;
  const anchor = allLines[anchorIdx];
  const anchorIndent = anchor.trim() ? lineIndent(anchor) : Infinity;
  let defIdx = -1;
  for (let i = anchorIdx; i >= 0; i--) {
    if (!DEF_RE.test(allLines[i])) continue;
    if (i === anchorIdx || lineIndent(allLines[i]) < anchorIndent) { defIdx = i; break; }
  }
  if (defIdx < 0) return null;
  const defIndent = lineIndent(allLines[defIdx]);
  let endIdx = allLines.length - 1;
  for (let i = defIdx + 1; i < allLines.length; i++) {
    const l = allLines[i];
    if (!l.trim()) continue;
    if (lineIndent(l) <= defIndent) { endIdx = i - 1; break; }
  }
  let startIdx = defIdx;
  while (startIdx > 0 && allLines[startIdx - 1].trim().startsWith("@")) startIdx--;
  return [startIdx, endIdx];
}

/**
 * Enclosing brace-delimited block (0-based inclusive [start, end]) for
 * brace-based languages: the nearest brace pair still open at the anchor
 * line. Naive per-line brace counting (strings/comments are not stripped —
 * the caps downstream make a miscount harmless).
 */
function findBraceBlock(allLines: string[], anchorIdx: number): [number, number] | null {
  const n = allLines.length;
  const depthAfter = new Int32Array(n);
  let d = 0;
  for (let i = 0; i < n; i++) {
    const l = allLines[i];
    for (let c = 0; c < l.length; c++) {
      if (l[c] === "{") d++;
      else if (l[c] === "}") d--;
    }
    depthAfter[i] = d;
  }
  // Opening line: the largest i <= anchorIdx whose brace stays open across
  // the whole span i..anchorIdx — depth never returns to depthBefore[i].
  // (i = anchorIdx counts when the anchor line itself opens a net brace.)
  let openIdx = -1;
  let minDepth = Infinity; // min(depthAfter[i..anchorIdx-1]) as the walk descends
  for (let i = anchorIdx; i >= 0; i--) {
    const before = i === 0 ? 0 : depthAfter[i - 1];
    const ok = i === anchorIdx ? depthAfter[i] > before : minDepth > before;
    if (ok) { openIdx = i; break; }
    if (i > 0) minDepth = Math.min(minDepth, depthAfter[i - 1]);
  }
  if (openIdx < 0) return null;
  const beforeOpen = openIdx === 0 ? 0 : depthAfter[openIdx - 1];
  let closeIdx = n - 1;
  for (let k = Math.max(openIdx, anchorIdx); k < n; k++) {
    if (depthAfter[k] === beforeOpen) { closeIdx = k; break; }
  }
  return [openIdx, closeIdx];
}

/** Markdown section enclosing the anchor: nearest preceding heading up to
 *  the next heading of the same or higher level. */
function findMarkdownSection(allLines: string[], anchorIdx: number): [number, number] | null {
  const MD_HEAD_RE = /^(#{1,6})\s+/;
  const n = allLines.length;
  let headIdx = -1, level = 0;
  for (let i = anchorIdx; i >= 0; i--) {
    const m = allLines[i].match(MD_HEAD_RE);
    if (m) { headIdx = i; level = m[1].length; break; }
  }
  if (headIdx < 0) return null;
  let endIdx = n - 1;
  for (let i = headIdx + 1; i < n; i++) {
    const m = allLines[i].match(MD_HEAD_RE);
    if (m && m[1].length <= level) { endIdx = i - 1; break; }
  }
  return [headIdx, endIdx];
}

/** RST section: heading = title line followed by an underline of 3+ identical
 *  punctuation chars at least as long as the title; the section ends at the
 *  next heading with the SAME underline char (same level). P2-R7: the title
 *  must contain an alphanumeric — PDF-converted docs carry literal "..." /
 *  "---" noise lines that otherwise match (title + same-char underline) and
 *  hijack every anchor below them into a bogus section (measured on
 *  SAG.txt: noise "..." at L7037–7039 swallowed anchors 7000+ lines lower).
 */
function findRstSection(allLines: string[], anchorIdx: number): [number, number] | null {
  const n = allLines.length;
  const isHeading = (i: number): boolean => {
    const title = allLines[i].trim();
    if (!title || i + 1 >= n) return false;
    if (!/[A-Za-z0-9]/.test(title)) return false; // P2-R7: "..."/"---" is not a title
    const ul = allLines[i + 1].trim();
    return /^([=\-~^"#+*_.`|\\])\1{2,}$/.test(ul) && ul.length >= title.length;
  };
  let headIdx = -1, headChar = "";
  for (let i = anchorIdx; i >= 0; i--) {
    if (isHeading(i)) { headIdx = i; headChar = allLines[i + 1].trim()[0]; break; }
  }
  if (headIdx < 0) return null;
  let endIdx = n - 1;
  for (let i = headIdx + 1; i < n; i++) {
    if (isHeading(i) && allLines[i + 1].trim()[0] === headChar) { endIdx = i - 1; break; }
  }
  return [headIdx, endIdx];
}

/** A real numbered section (PDF-converted guides): heading line (1-based),
 *  number of dotted components ("3.9.4.2" → 4), the numeric prefix, and the
 *  section's last line (1-based inclusive — the line before the next real
 *  header with the same or fewer components). */
export interface NumberedSection {
  line: number;
  comps: number;
  num: string;
  /** 1-based inclusive last line of the section. */
  end: number;
}

/**
 * Enumerate ALL real numbered sections of a file (P2-R11). Same heading
 * detection as findNumberedSection (2+ dotted components, short line, no dot
 * leaders, dense listing clusters skipped) — shared so the definition-
 * neighbor pass (subprocessShared) and structuralRegion cannot drift apart.
 */
export function listNumberedSections(allLines: string[]): NumberedSection[] {
  const n = allLines.length;
  const NUM_HEAD_RE = /^\s*(\d+(?:\.\d+)+)\.?\s{1,3}(\S.*)$/;
  const compsOf = (i: number): { c: number; num: string } | null => {
    const l = allLines[i];
    if (l.length > 70 || /\.{3,}/.test(l)) return null;
    const m = l.match(NUM_HEAD_RE);
    return m ? { c: m[1].split(".").length, num: m[1] } : null;
  };
  const heads: Array<{ i: number; c: number; num: string }> = [];
  for (let i = 0; i < n; i++) {
    const h = compsOf(i);
    if (h) heads.push({ i, ...h });
  }
  // Mark listing clusters: 3+ header-like lines within a 7-line span.
  const inListing = new Uint8Array(n);
  let lo = 0;
  for (let hi = 0; hi < heads.length; hi++) {
    while (heads[hi].i - heads[lo].i > 6) lo++;
    if (hi - lo + 1 >= 3) for (let k = lo; k <= hi; k++) inListing[heads[k].i] = 1;
  }
  const real = heads.filter((h) => !inListing[h.i]);
  return real.map((h, idx) => {
    let endExcl = n; // 0-based exclusive
    for (let j = idx + 1; j < real.length; j++) {
      if (real[j].c <= h.c) { endExcl = real[j].i; break; }
    }
    return { line: h.i + 1, comps: h.c, num: h.num, end: endExcl };
  });
}

/** Numbered plain-text section (PDF-converted guides): headers look like
 *  "2.2.2.2. Using the Basic Tab" — 2+ dotted number components, short line,
 *  no dot leaders. Dense clusters of such lines (TOC / list-of-sections
 *  pages) are not real section heads and are skipped. The section ends at
 *  the next real header with the same or fewer components. */
function findNumberedSection(allLines: string[], anchorIdx: number): [number, number] | null {
  const secs = listNumberedSections(allLines);
  if (!secs.length) return null;
  const byLine = new Map(secs.map((s) => [s.line, s]));
  let found: NumberedSection | null = null;
  for (let line = anchorIdx + 1; line >= 1; line--) {
    const s = byLine.get(line);
    if (s) { found = s; break; }
  }
  if (!found) return null;
  return [found.line - 1, found.end - 1];
}

/**
 * The structural region enclosing the anchor line (1-based inclusive), or
 * null when the anchor is not inside a recognizable block/section:
 *   code files  → enclosing def/class, else enclosing brace scope, else the
 *                 WHOLE file when it is a short example script;
 *   documents   → markdown section, else RST section, else numbered section.
 * Blocks/sections are capped at STRUCTURAL_BLOCK_CAP lines; whole short
 * files are returned as-is (the byte cap is applied downstream).
 */
export function structuralRegion(allLines: string[], ext: string, anchorLine: number): { start: number; end: number; kind: string } | null {
  const n = allLines.length;
  const anchorIdx = anchorLine - 1;
  if (n === 0 || anchorIdx < 0 || anchorIdx >= n) return null;
  let region: [number, number] | null = null;
  let kind = "";
  if (ext === ".py") {
    region = findPythonBlock(allLines, anchorIdx);
    kind = "enclosing function/class";
  } else if (CODE_EXTS.has(ext)) {
    region = findBraceBlock(allLines, anchorIdx);
    kind = "enclosing code block";
  }
  if (!region && CODE_EXTS.has(ext) && n <= STRUCTURAL_SHORT_FILE) {
    return { start: 1, end: n, kind: "whole file (short script)" };
  }
  if (!region) {
    region = findMarkdownSection(allLines, anchorIdx) ?? findRstSection(allLines, anchorIdx) ?? findNumberedSection(allLines, anchorIdx);
    kind = "enclosing doc section";
  }
  if (!region) return null;
  return { start: region[0] + 1, end: Math.min(region[1], region[0] + STRUCTURAL_BLOCK_CAP - 1) + 1, kind };
}
