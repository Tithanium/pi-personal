/**
 * subprocessOkf.ts — the `Okf_only_rag` child (goal v3 PART 5, task 5 STEP 2).
 *
 * The STRICT OKF-ONLY profile (config.ragProfile === "okf-only", selected by
 * effectiveSubprocess in config.ts). Unlike D (which researches the indexed
 * corpus), this child draws ONLY from the OKF knowledge bundles — the
 * `okf/` directories under config.trackedPaths. The bundles are EXCLUDED from
 * the vector index by design (`excludePatterns: ["okf/*"]`, enforced at index
 * time in chunking.ts), so no rag_* tool can ever serve them: raw
 * read/grep/find/ls on the bundle files is the ONLY route (research/
 * okf-process-analysis.md §3).
 *
 * Division of labor (research §4 "Discovery + selection funnel"):
 *   PARENT (this module, deterministic, NO LLM):
 *     1. discoverOkfBundles(config.trackedPaths) — D1: dir entries only,
 *        missing/non-dir entries skipped without throwing;
 *     2. score every bundle's index.md against the question (D2: BM25-style
 *        length-normalized keyword counts over index.md — deterministic,
 *        no LLM; see scoreBundleIndexDocs);
 *     3. pick the dominant bundle (+ secondary only within OKF_SECONDARY_MARGIN);
 *     4. build the freshness header (D4: bundle path + index.md/log.md
 *        last-modified dates via fs.stat) and hand BOTH to the child prompt;
 *   CHILD (reads everything else): index.md map → frontmatter shortlist →
 *   targeted grep → curated synthesis with file:line cites.
 *
 * Edges (D3, STRICT — no fallthrough to D or any other resource):
 *   - NO bundle under trackedPaths / dominant affinity < OKF_MIN_AFFINITY
 *     → degraded { ok: false } result, nothing spawned, nothing injected;
 *   - the child answering exactly "UNRELATED" → isOkfUnrelated void predicate
 *     (shared runner shows ✓ + outcome "void", the hook injects nothing —
 *     the `if (sub === "S" || sub === "D" || okfOnly)` kill-switch in index.ts
 *     then returns before the legacy inline path).
 *
 * Runtime shape mirrors runSubprocessD: shared visible runner
 * (subprocessSmoke.ts → panel + escape gate), resolveDModel model precedence,
 * config thinking level, payload = the child's FINAL MESSAGE (≤ 10 KB,
 * freshness header as its first line), timeout = config.ragSubagentHookTimeoutMs.
 */
import type { ExtensionContext } from "@earendil-works/pi-coding-agent";
import { readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import type { RagQueryAgent } from "./spawnRagSubagent.ts";
import type { SubagentFrameData } from "./subagentFrame.ts";
import { runVisibleSubagent, type SmokeRunResult } from "./subprocessSmoke.ts";
import { D_THINKING_LEVEL, D_UNRELATED, resolveDModel } from "./subprocessD.ts";

/** Raw, read-only tool allowlist for the Okf child ONLY (critic finding 6):
 *  the deterministic funnel (index.md → frontmatter → targeted grep) never
 *  needs `bash`, and a mutating capability held behind prose-only prohibition
 *  is the wrong default for a strict read-only child. D keeps its own
 *  D_TOOLS (`…, bash`) unchanged. ONE source shared by
 *  agents/okf-only-rag.md frontmatter, the runtime `--tools` argv
 *  (spawnRagSubagent: agent.tools → args) and the tests. */
export const OKF_TOOLS: string[] = ["read", "grep", "find", "ls"];

/** Payload budget for the child's final message (research §4: D allows 15 KB,
 *  ≤ 10 KB recommended here for merge headroom under the <rag-context> wrapper). */
export const OKF_PAYLOAD_MAX_BYTES = 10 * 1024;

/** The exact final message meaning "off-bundle question → inject nothing".
 *  Shared with D — the SAME void contract (`UNRELATED[.!]*`). */
export const OKF_UNRELATED = D_UNRELATED;

/** D3 void predicate wired into the shared runner. */
export function isOkfUnrelated(text: string): boolean {
  return OKF_UNRELATED.test(text.trim());
}

// ─── payload budget enforcement (critic finding 3) ───────────────────────────

/** The truncation marker appended when the child's final message exceeds
 *  OKF_PAYLOAD_MAX_BYTES — the cap was asserted but never enforced before. */
export const OKF_TRUNCATION_MARKER =
  "\n…[truncated to 10 KB — full answer available on request]";

export interface OkfPayloadCap {
  content: string;
  truncated: boolean;
  note?: string;
}

/**
 * Enforce OKF_PAYLOAD_MAX_BYTES on a child's final message (pure, unit-tested
 * both sides): at or under the cap → returned UNTOUCHED; over the cap →
 * truncate at a UTF-8-safe boundary (a cut multi-byte char decodes as
 * U+FFFD and is dropped so the re-encode never exceeds the budget), append
 * the marker and return a note for the runner/hook log. The returned content
 * is guaranteed ≤ maxBytes bytes.
 */
export function capOkfPayload(content: string, maxBytes: number = OKF_PAYLOAD_MAX_BYTES): OkfPayloadCap {
  const buf = Buffer.from(content, "utf-8");
  if (buf.length <= maxBytes) return { content, truncated: false };
  const budget = Math.max(0, maxBytes - Buffer.byteLength(OKF_TRUNCATION_MARKER, "utf-8"));
  const head = buf.subarray(0, budget).toString("utf-8").replace(/\uFFFD+$/, "");
  return {
    content: head + OKF_TRUNCATION_MARKER,
    truncated: true,
    note: `okf payload over cap — ${buf.length} B > ${maxBytes} B — truncated to 10 KB`,
  };
}

// ─── D1 — bundle discovery (pure, deterministic, never throws) ────────────────

/**
 * Discover OKF bundles given config.trackedPaths. SCOPE (user decision D1):
 * a bundle is `<entry>/okf` for every trackedPaths entry that IS a directory —
 * file entries, missing paths and okf-less directories are skipped silently
 * (the live config carries a since-deleted temp FILE entry; statSync inside a
 * try/catch keeps discovery total). Skills bundles and the MWE playground are
 * deliberately OUT of scope: config-following only.
 */
export function discoverOkfBundles(trackedPaths: readonly string[]): string[] {
  const found: string[] = [];
  for (const entry of trackedPaths) {
    try {
      if (!statSync(entry).isDirectory()) continue; // file entry (D1: skipped)
      const bundle = join(entry, "okf");
      if (!statSync(bundle).isDirectory()) continue; // no okf/ child
      found.push(bundle);
    } catch {
      // missing/unreadable entry — skip, never throw (discovery is total)
    }
  }
  // Dedupe on the NORMALIZED absolute path, case-folded (critic finding 10):
  // on Windows the same bundle can arrive as case/relative variants of one
  // path — raw-string dedupe would let it enter the ranking (and score) twice.
  const seen = new Map<string, string>();
  for (const p of found) {
    const key = resolve(p).toLowerCase();
    if (!seen.has(key)) seen.set(key, p);
  }
  return [...seen.values()];
}

// ─── D2 — dominant-bundle affinity (deterministic keyword overlap) ┍───────────

/**
 * Question stopwords — generic words that fire in BOTH indexes and carry no
 * bundle discrimination. Words shorter than 3 chars are filtered regardless
 * (they cannot discriminate either). Deliberately small: everything else is
 * evidence (including corpus names such as "fedoo"/"ansys").
 */
export const OKF_STOPWORDS: ReadonlySet<string> = new Set([
  "the", "and", "for", "with", "this", "that", "these", "those", "from",
  "are", "was", "were", "been", "being", "what", "when", "where", "which",
  "while", "whose", "how", "why", "does", "did", "doing", "have", "has",
  "had", "you", "your", "can", "could", "cannot", "not", "any", "all",
  "its", "into", "than", "then", "them", "they", "their", "there", "here",
  "also", "just", "only", "much", "many", "more", "most", "some", "such",
  "very", "will", "would", "should", "shall", "may", "might", "must",
  "about", "after", "before", "between", "under", "over", "through",
  "during", "without", "within", "get", "got", "make", "made", "need",
  "needs", "want", "wants", "use", "uses", "using", "used", "give", "given",
  "please", "tell", "show", "example", "examples",
]);

/** Diacritic fold (critic finding 2): NFKD-normalize then strip combining
 *  marks, so `élasticité` → `elasticite` instead of the mangled `lasticit`
 *  the raw /[^a-z0-9]+/ split produced. Applied to BOTH sides of the affinity
 *  scoring (question terms and index tokens). */
export function foldDiacritics(s: string): string {
  return s.normalize("NFKD").replace(/\p{M}/gu, "");
}

/** Distinct discriminating terms of a question (lowercased, diacritics
 *  folded, ≥ 3 chars, stopword-free, deduped — order follows first
 *  occurrence). */
export function okfQueryTerms(question: string): string[] {
  const seen = new Set<string>();
  const terms: string[] = [];
  for (const t of foldDiacritics(question.toLowerCase()).split(/[^a-z0-9]+/)) {
    if (t.length < 3 || OKF_STOPWORDS.has(t) || seen.has(t)) continue;
    seen.add(t);
    terms.push(t);
  }
  return terms;
}

/** One bundle's `index.md` as scored input. */
export interface OkfIndexDoc { path: string; text: string }

/**
 * Term hit counts of one question against one index.md — the scoring core:
 * one map term → occurrences, zero for terms the index never carries (so a
 * caller can sum every entry without filtering). A hub token W matches term T
 * iff `W === T` or (`T.length ≥ 5` && `W.startsWith(T)` — the light stem,
 * catching "problem(s)" but never a bare 3–4-char prefix like
 * "mesh" ⊄ "meshing"). Both question terms and index tokens are
 * diacritic-folded first (foldDiacritics, critic finding 2), so
 * `élasticité` in an index answers an `elasticite` question term.
 */
export function countQuestionHits(question: string, indexText: string): Map<string, number> {
  const counts = new Map<string, number>();
  for (const t of okfQueryTerms(question)) counts.set(t, 0);
  if (!counts.size) return counts;
  for (const w of foldDiacritics(indexText.toLowerCase()).split(/[^a-z0-9]+/)) {
    if (!w) continue;
    for (const [t, c] of counts) {
      if (w === t || (t.length >= 5 && w.startsWith(t))) counts.set(t, c + 1);
    }
  }
  return counts;
}

/** BM25 length-normalization strength (the classic b). */
export const OKF_BM25_B = 0.75;

/**
 * D2 affinity — DETERMINISTIC keyword overlap of ONE question across the
 * discovered bundle indexes (pure, NO LLM):
 *   score(b) = Σ_t c_b(t) / (1 − b + b · |index.md_b| / mean|index.md|)
 * — the BM25 length normalization (b = OKF_BM25_B) applied to the RAW per-term
 * hit counts of countQuestionHits (hub token W matches term T iff
 * `W === T` or `T.length ≥ 5 && W.startsWith(T)`).
 *
 * Two deliberately UN-BM25 choices, both empirically calibrated on the real
 * bundle pair × the 12 suite questions (tests/ab2/questions.json — printed by
 * tests/smoke/run-okf-subprocess.mjs expectations):
 *   - NO tf saturation (k1 → ∞): saturating repeat counts flattens the
 *     dense-generic signature that lets an unrelated question (suite
 *     "unrelated_quantum") score as high as a real one (calibration: sat
 *     variants leave only a 1.06× gap; raw counts keep a ~2× gap);
 *   - NO cross-bundle idf: with 1–3 bundles df has no resolution (df ∈ {1,N})
 *     and it dilutes corpus-identity vocabulary (fedoo's index cross-references
 *     "ANSYS APDL", so idf wrongly splits the *apdl* signal), which flipped
 *     2 of 12 suite dominants.
 * The length term is what removes the big-index bias (fedoo index ≈ 8.4 KB vs
 * ANSYS ≈ 2 KB raw counts always favour fedoo). Scores are comparable ONLY
 * across bundles for the SAME question — the only thing callers do with them.
 */
export function scoreBundleIndexDocs(
  question: string,
  docs: readonly OkfIndexDoc[],
): OkfBundleScore[] {
  const perDoc = docs.map((d) => countQuestionHits(question, d.text));
  const n = docs.length;
  if (!n) return [];
  const avgLen = docs.reduce((s, d) => s + d.text.length, 0) / n;
  return docs.map((d, i) => {
    let hits = 0;
    for (const c of perDoc[i].values()) hits += c;
    const lenNorm = 1 - OKF_BM25_B + OKF_BM25_B * (d.text.length / (avgLen || 1));
    return { path: d.path, score: hits / lenNorm };
  });
}

/**
 * Minimum dominant-bundle affinity (in length-normalized keyword-hit units,
 * scoreBundleIndexDocs). Below it NOTHING is topically relevant → D3's
 * UNRELATED edge. Calibrated on the real bundle pair × the 12 suite questions
 * (tests/ab2/questions.json; asserted by tests/smoke/run-okf-subprocess.mjs,
 * which PRINTS the per-question scores): in-topic dominant scores run ≥ 12.36
 * (suite min, fedoo_stresseq_nlgeom) while the two "unrelated" suite
 * questions reach ≤ 6.18 (max TOTAL across both bundles) — 10 sits between
 * with ≥ 18 % headroom on the low side and ≥ 38 % on the high side; RE-RUN
 * after critic finding 2 (diacritic fold) kept both bounds (min 12.36 /
 * max 6.18, identical to one decimal), so the floor stays 10. It also
 * holds for a single-bundle config (N=1 scores = raw hits: unrelated ≤ 9,
 * in-topic ≥ 18).
 */
export const OKF_MIN_AFFINITY = 10;

/**
 * D2 margin: the secondary bundle contributes only when its score is within
 * OKF_SECONDARY_MARGIN × the dominant's score — a documented, deterministic
 * gate; below it the bundle is topically distant and dropped. On the current
 * suite × corpus pair the runner-up ratio tops out at 0.64
 * (ansys_large_deflection), so no question earns a secondary today at 0.7 —
 * the rule fires only for genuinely even matchups (the margin is pinned both
 * sides by tests/smoke/run-okf-subprocess.mjs).
 */
export const OKF_SECONDARY_MARGIN = 0.7;

export interface OkfBundleScore {
  path: string;
  score: number;
  /** Why the score is 0 despite a readable bundle (e.g. oversized index.md —
   *  critic finding 7). Surfaced in planOkfRun's degraded note. */
  note?: string;
}

/** Max bytes of a bundle index.md read on the hook's event loop (critic
 *  finding 7): unbounded readFileSync before the panel exists is a stall
 *  risk — above this cap the bundle scores 0 (the same degradation as a
 *  missing index: it can never win the dominant slot), with an explanatory
 *  note on the score. 16 KB ≈ 2× the biggest real index (fedoo ≈ 8.4 KB). */
export const OKF_INDEX_SCAN_CAP = 16 * 1024;
export interface OkfSelection {
  dominant: string;
  secondary?: string;
  /** Every bundle score, sorted by score DESC, then path ASC (deterministic
   *  tie-break — paths are stable, no hash/ordering surprises). */
  scores: OkfBundleScore[];
}

/**
 * D2 selector (pure, given the ranking): dominant = best score (ties →
 * lexicographically smallest path — rankOkfBundles pre-sorts), secondary =
 * the best REMAINING bundle only when
 * `score ≥ OKF_MIN_AFFINITY && score ≥ OKF_SECONDARY_MARGIN × dominant`.
 * Returns undefined when NO bundle reaches OKF_MIN_AFFINITY (→ UNRELATED).
 */
export function selectOkfBundlesFromScores(
  scores: readonly OkfBundleScore[],
): OkfSelection | undefined {
  if (!scores.length) return undefined;
  const dominant = scores[0];
  if (dominant.score < OKF_MIN_AFFINITY) return undefined;
  const secondary = scores.slice(1).find(
    (s) => s.score >= OKF_MIN_AFFINITY && s.score >= OKF_SECONDARY_MARGIN * dominant.score,
  );
  return { dominant: dominant.path, secondary: secondary?.path, scores: [...scores] };
}

/** fs ranking: read every bundle's `index.md` (a missing/unreadable map
 *  scores 0 — a bundle without its map can never win the dominant slot,
 *  which correctly degrades toward the UNRELATED edge; an index.md above
 *  OKF_INDEX_SCAN_CAP is likewise NOT read — scored 0 with a note, critic
 *  finding 7), then the mini-BM25 above; sorted score DESC, path ASC
 *  (deterministic tie-break). */
export function rankOkfBundles(
  bundles: readonly string[],
  question: string,
): OkfBundleScore[] {
  const notes = new Map<string, string>();
  const docs = bundles.map((path) => {
    let text = "";
    try {
      const indexFile = join(path, "index.md");
      if (statSync(indexFile).size > OKF_INDEX_SCAN_CAP) {
        // Oversized map — never scan it unbounded on the hook event loop.
        notes.set(
          path,
          `index.md exceeds the ${OKF_INDEX_SCAN_CAP} B scan cap — not read, scored 0`,
        );
        return { path, text };
      }
      text = readFileSync(indexFile, "utf-8");
    } catch {
      // no map — leave empty, score 0 (never throws)
    }
    return { path, text };
  });
  return scoreBundleIndexDocs(question, docs)
    .map((s) => (notes.has(s.path) ? { ...s, note: notes.get(s.path) } : s))
    .sort((a, b) => (b.score - a.score) || a.path.localeCompare(b.path));
}

/** rankOkfBundles + selectOkfBundlesFromScores in one call. */
export function selectOkfBundles(
  bundles: readonly string[],
  question: string,
): OkfSelection | undefined {
  return selectOkfBundlesFromScores(rankOkfBundles(bundles, question));
}

// ─── D3 — the run plan (what the parent decides BEFORE spawning) ──────────────

export type OkfPlan =
  | { kind: "no-bundles"; note: string }
  | { kind: "unrelated"; note: string }
  | { kind: "run" } & OkfSelection;

/**
 * Pure plan: discovery + affinity in one deterministic step. `kind:
 * "run"` = spawn the child with this selection; the other two kinds are the
 * D3 edges — the caller returns a degraded { ok: false } result WITHOUT
 * spawning (nothing to read, nothing to inject; no fallthrough to D or the
 * legacy inline path).
 */
export function planOkfRun(trackedPaths: readonly string[], question: string): OkfPlan {
  const bundles = discoverOkfBundles(trackedPaths);
  if (!bundles.length) {
    return {
      kind: "no-bundles",
      note: "no okf bundle under the tracked paths — nothing to inject (OKF-only edge)",
    };
  }
  const scores = rankOkfBundles(bundles, question);
  const selection = selectOkfBundlesFromScores(scores);
  if (!selection) {
    return {
      kind: "unrelated",
      note: `nothing topically relevant in the okf bundles (affinity < ${OKF_MIN_AFFINITY}: ${scores.map((s) => `${s.path} ${s.score.toFixed(2)}${s.note ? ` [${s.note}]` : ""}`).join(", ")}) — nothing to inject (UNRELATED edge)`,
    };
  }
  return { kind: "run", ...selection };
}

// ─── D4 — freshness header (payload line 1) ───────────────────────────────────

function bundleStamp(filePath: string): string {
  try {
    return statSync(filePath).mtime.toISOString().slice(0, 10);
  } catch (err) {
    // Degrade to "unknown", but never INVISIBLY (critic finding 11): one
    // stderr line, never a throw (a missing log.md is a normal absence — the
    // line disambiguates it from a permission/stat failure on index.md).
    process.stderr.write(
      `[rag] okf freshness stamp unavailable — ${filePath}: ${err instanceof Error ? err.message : String(err)}\n`,
    );
    return "unknown";
  }
}

/**
 * D4 payload header — ONE line: every selected bundle's path plus the
 * last-modified dates of its `index.md` and `log.md` (fs.stat), so the parent
 * model can weigh staleness without opening the bundle. The child is told to
 * start its final message with EXACTLY this line.
 */
export function buildOkfFreshnessHeader(bundles: readonly string[]): string {
  const parts = bundles.map(
    (b) => `${b} (index.md ${bundleStamp(join(b, "index.md"))}, log.md ${bundleStamp(join(b, "log.md"))})`,
  );
  return `OKF bundles: ${parts.join(" | ")}`;
}

// ─── prompt builders (dynamic — bundle paths live in config, not in the agent md)

/**
 * The production OKF system prompt — built DYNAMICALLY at spawn time (mirror
 * of buildDSystemPrompt: the bundle list + freshness header come from the
 * config-driven discovery, so agents/okf-only-rag.md stays the static identity
 * spec and never carries stale paths). The whole discovery/shortlist/grep
 * strategy is described TO THE CHILD here: the child does the reading.
 */
export function buildOkfSystemPrompt(selection: OkfSelection, header: string): string {
  const primary = `- ${selection.dominant}  (DOMINANT — start here)`;
  const secondary = selection.secondary
    ? `\n- ${selection.secondary}  (secondary — cross-check/extend only where it adds to the dominant)`
    : "\n- (no secondary bundle within the affinity margin)";
  return `You are OKF-ONLY — the knowledge-bundle researcher subagent of a local-RAG setup. Your complete answer is INJECTED as context into a parent conversation that will use it to answer the user well. Your ONLY sources of truth are the OKF knowledge bundles below — reached with the raw read / grep / find / ls tools. NO rag_* / retrieval tools, NO web, NO other corpus: OKF bundles are excluded from the vector index by design, so the bundle FILES are everything you have.

OKF BUNDLES (your ONLY sources of truth):${primary}${secondary}

BUNDLE ANATOMY (read the map first, never the whole bundle)
- \`index.md\` — the concept map: bullet links + one-line synopses. Read the DOMINANT bundle's index.md FIRST; read the secondary bundle's index.md only to judge cross-relevance.
- \`log.md\` — append-only history, may be HUGE (hundreds of KB): read only its headings/dates if you need status history, NEVER inline or quote it at length.
- concept/topic/example files — Markdown with YAML frontmatter; \`description:\` (often + \`tags:\`, \`type:\`, \`status:\`, \`verified:\`) on essentially every non-reserved file.

METHOD (the funnel — do the reading YOURSELF; the parent only routed you here)
1. Read the dominant bundle's index.md as the map; locate the bullets that serve each sub-ask of the question.
2. Shortlist concept/topic files by their frontmatter (\`description\`/\`tags\`/\`type\`) against the question terms.
3. Targeted grep + read of ONLY the shortlisted files — extract the exact passages (signatures, parameter tables, steps, constraints). Never dump a whole file blindly.
4. Optionally cross the question against the secondary bundle's index.md (step above) and pull ONLY what genuinely extends the dominant bundle's answer.
5. Curate: organize per sub-ask IN THE USER'S WORDS, quote the decisive lines verbatim. Wisdom over volume — synthesis of what serves the question, not a directory listing.

PAYLOAD (= your FINAL MESSAGE), Markdown, ≤ 10 KB
- LINE 1 must be EXACTLY this freshness header (the parent shows it for staleness): 
${header}
- Then \`## <sub-ask>\` sections covering EVERY sub-ask; every fact carries a \`file:line\` cite (path relative to the bundle you read, e.g. \`concepts/foo.md:12\`).
- Prefer quoting the exact passage over describing it. When bundle evidence is thin or self-declared unverified (e.g. no \`verified:\` stamp, a stub file, FR/EN mix), SAY SO inline — never present curated-but-unverified content as confirmed.

RELEVANCE EDGE (STRICT)
- If the bundles contain NOTHING topically relevant to the question, your FINAL MESSAGE must be EXACTLY the single word UNRELATED — nothing else. There is NO fallback corpus; do not answer from your own knowledge.

RULES
- The bundles are READ-ONLY. Never write, edit or create files, never author/validate bundles (okf_capture and the okf_* tools are NOT yours), never run commands that modify anything.
- Ground everything in what you actually read; never invent a file:line or a bundle path.
- No query/round/tool budget, but once every sub-ask is served, stop.
- The payload IS your final message — no preamble, no report about your process.`;
}

/** Production OKF task body (the user prompt, verbatim, plus deliverable terms).
 *  FENCE SAFETY (critic finding 8): a user-prompt line EQUAL to one of the
 *  heredoc tokens (`<<<PROMPT`, `PROMPT`, `>>>`) would otherwise terminate
 *  the fence early and let the trailing instruction be read as user text —
 *  each such inner line gets a zero-width space (U+200B) appended: minimal,
 *  deterministic, visually verbatim (the real fences stay untouched).
 *  Parity with D is inherited; only the Okf path is fixed here. */
const OKF_TASK_FENCES = ["<<<PROMPT", "PROMPT", ">>>"];

export function buildOkfTask(userPrompt: string): string {
  const body = userPrompt
    .split("\n")
    .map((line) => (OKF_TASK_FENCES.includes(line.trim()) ? line + "\u200B" : line))
    .join("\n");
  return [
    `USER PROMPT (verbatim):`,
    `<<<PROMPT`,
    body,
    `PROMPT`,
    `>>>`,
    ``,
    `Begin the research now. FINAL MESSAGE = the context payload starting with the freshness header (or exactly UNRELATED).`,
  ].join("\n");
}

// ─── the subprocess (mirror of runSubprocessD) ────────────────────────────────

export interface SubprocessOkfOptions {
  prompt: string;
  ctx: ExtensionContext;
  /** config.trackedPaths — the ONLY scope bundle discovery looks at (D1). */
  trackedPaths: string[];
  /** config.ragSubagentHookTimeoutMs — hard cap. */
  timeoutMs: number;
  model?: string;
  /** config.ragModel — re-validated each run by resolveDModel (shared with D). */
  ragModel?: string;
  /** config.ragThinkingLevel → child `--thinking <level>` (off…max). */
  thinkingLevel?: string;
  /** Classical-subagent result frame (see subagentFrame.ts). */
  appendFrame?: (frame: SubagentFrameData) => void;
}

/**
 * Serve the OKF-only profile for one user prompt. Never throws: degrades to
 * { ok: false } + note (the hook then injects nothing and the conversation
 * proceeds — NO fallthrough to D or the legacy inline path, index.ts owns the
 * kill-switch). Pre-spawn decisions (discovery/affinity) are the pure helpers
 * above, so tests cover them without spawning anything. On a clean run the
 * payload budget is ENFORCED here (capOkfPayload, critic finding 3): content
 * flows verbatim from runVisibleSubagent → buildRagInjectionText otherwise.
 */
export async function runSubprocessOkfOnly(opts: SubprocessOkfOptions): Promise<SmokeRunResult> {
  const plan = planOkfRun(opts.trackedPaths, opts.prompt);
  if (plan.kind !== "run") {
    // D3 edge: no bundle / nothing relevant → degraded result, NO spawn.
    return {
      ok: false,
      escaped: false,
      content: null,
      wallMs: 0,
      tokensIn: 0,
      tokensOut: 0,
      note: plan.note,
    };
  }
  // Same model/thinking precedence as D (opts.model > ragModel if valid >
  // ctx.model > D_MODEL — one stderr line when a stored ragModel is skipped).
  const model = resolveDModel(opts);
  const thinkingLevel = opts.thinkingLevel ?? D_THINKING_LEVEL;
  const header = buildOkfFreshnessHeader(
    plan.secondary ? [plan.dominant, plan.secondary] : [plan.dominant],
  );
  const agent: RagQueryAgent = {
    systemPrompt: buildOkfSystemPrompt(plan, header),
    tools: OKF_TOOLS,
    model,
    thinkingLevel,
    filePath: "",
  };
  const run = await runVisibleSubagent({
    prompt: opts.prompt,
    ctx: opts.ctx,
    timeoutMs: opts.timeoutMs,
    // Same silent-stretch budget as D: a grep round over 80+ bundle files can
    // pause output longer than the 45 s default.
    stallMs: Math.min(120_000, Math.max(45_000, Math.floor(opts.timeoutMs / 4))),
    label: "rag-okf-only",
    agent,
    meta: `${model} · thinking ${thinkingLevel}`,
    taskBody: buildOkfTask(opts.prompt),
    isVoidPayload: isOkfUnrelated,
    appendFrame: opts.appendFrame,
  });
  if (run.content === null) return run;
  // Payload budget (critic finding 3): under OKF_PAYLOAD_MAX_BYTES the
  // content is returned untouched; over it, truncate at a UTF-8-safe
  // boundary, append the marker and surface a note (merged with any existing
  // one) so the hook's "injected" line shows why the payload shrank.
  const capped = capOkfPayload(run.content);
  if (!capped.truncated) return run;
  return {
    ...run,
    content: capped.content,
    note: run.note ? `${run.note} · ${capped.note}` : capped.note,
  };
}