/**
 * subprocessD.ts — PRODUCTION process D (goal PART 4, step 3: "serve D").
 *
 * D is the chosen served process: the thorough, corpus-grounded RESEARCHER
 * (the completeness reference of the phase-2 race). Unlike the research
 * runner (tests/ab2/run-d.mjs), the production child does NOT write a facts
 * JSON — its FINAL MESSAGE IS the injection payload: a Markdown context
 * (≤ 15 KB) with file:line citations, served through the same
 * <rag-context> contract as every other subprocess.
 *
 * Runtime shape:
 *   - spawned through the SHARED visible runner (subprocessSmoke.ts), so it
 *     gets the classical-subagent panel AND the user-validated escape gate
 *     (escape kills only the child; the conversation resumes without it);
 *   - system prompt built DYNAMICALLY from config.trackedPaths (corpus list
 *     always current — no stale agent file), raw tools only, NO rag_* tools
 *     (a RAG tool would be circular for a research pass);
 *   - model: explicit opts.model > the stored /rag model assignment
 *     (ragModel, re-validated against the registry every run) > the CURRENT
 *     SESSION model > D_MODEL (resolveDModel below);
 *   - thinking level: config.ragThinkingLevel via opts.thinkingLevel
 *     (default D_THINKING_LEVEL; `/rag effort` changes it — bare = picker,
 *     `/rag effort <level>` = the arg form);
 *   - the exact answer "UNRELATED" is the empty-payload edge: run completes,
 *     the panel shows ✓, the hook injects nothing.
 */
import type { ExtensionContext } from "@earendil-works/pi-coding-agent";
import { getSupportedThinkingLevels } from "@earendil-works/pi-ai";
import type { RagQueryAgent } from "./spawnRagSubagent.ts";
import type { RagRowTheme } from "./config.ts";
import type { SubagentFrameData } from "./subagentFrame.ts";
import { runVisibleSubagent, type SmokeRunResult } from "./subprocessSmoke.ts";

/**
 * The phase-2 D reference model (run-d.mjs MODEL). NO LONGER THE DEFAULT
 * choice — kept exported as the LAST-RESORT fallback in resolveDModel (and
 * for explicit callers such as the R5 escape probe).
 */
export const D_MODEL = "alan/qwen-3.8-27b";

/**
 * `(…k)` context-length tag for a `/rag model` picker row — BYTE-FOR-BYTE the
 * ALAN connector tool's format (ALAN_connector/index.ts:119-121 `contextKText`):
 * round to ONE decimal FIRST, THEN the whole-number check — so 131072 →
 * "(128k)", 130560 → "(127.5k)", 130000 → "(127k)". PURE: callers must omit
 * the suffix entirely (no empty parens) when contextWindow is unknown / absent
 * / non-positive — never pass 0/undefined here.
 */
export function contextKText(contextWindow: number): string {
  const k = Math.round((contextWindow / 1024) * 10) / 10;
  return Number.isInteger(k) ? `(${k}k)` : `(${k.toFixed(1)}k)`;
}

/** The minimal model shape the pure model reducers need (pi-ai BaseModel
 *  carries provider + id — every registry entry satisfies this structurally).
 *  `contextWindow` is OPTIONAL: some models may legitimately omit it — it is
 *  carried ONLY when the registry Model exposes a positive finite number, and
 *  every matcher/completion below reads provider/id only (the extra field is
 *  ignored; nothing throws when it is absent). */
export interface ModelRefLike { provider: string; id: string; contextWindow?: number }

/**
 * Registry snapshot for matching/completion, defensively read: returns []
 * when the context or its modelRegistry cannot enumerate (so callers never
 * crash on a stale/stub ctx). Each ref keeps provider/id and — only when the
 * Model exposes a positive finite contextWindow — that number (the picker
 * rows suffix ` (…k)`; absent/non-positive stays ABSENT, never 0/null).
 */
export function availableModelRefs(ctx?: ExtensionContext): ModelRefLike[] {
  try {
    const available = ctx?.modelRegistry?.getAvailable?.() ?? [];
    return available.map((m) => {
      const ref: ModelRefLike = { provider: m.provider, id: m.id };
      const contextWindow = m.contextWindow; // typed number on pi Model; still guarded at runtime
      if (typeof contextWindow === "number" && Number.isFinite(contextWindow) && contextWindow > 0) {
        ref.contextWindow = contextWindow; // some models may legitimately omit it → field stays absent
      }
      return ref;
    });
  } catch {
    return [];
  }
}

/**
 * WHY the registry cannot answer right now — undefined when HEALTHY. Keeps
 * "registry BROKEN" (getAvailable threw, or getError() reports a load
 * failure) distinguishable from "registry legitimately EMPTY"
 * (availableModelRefs returns [] for both); probes both surfaces and
 * absorbs every throw — this probe NEVER throws.
 */
export function registryUnavailable(ctx?: ExtensionContext): string | undefined {
  try {
    const registry = ctx?.modelRegistry;
    if (!registry) return "no model registry on this context";
    const registryError = typeof registry.getError === "function" ? registry.getError() : null;
    if (registryError) return String(registryError);
    if (typeof registry.getAvailable !== "function") return "registry cannot enumerate models";
    registry.getAvailable();
    return undefined;
  } catch (err) {
    return err instanceof Error ? err.message : String(err);
  }
}

/**
 * Exact model-reference matcher — a faithful local replica of pi's
 * `findExactModelReferenceMatch` (dist/core/model-resolver.js — NOT exported
 * from the package root, so re-implemented here):
 *   1. exact `provider/id` (case-insensitive) wins;
 *   2. an explicit `provider/id` with spaces around the slash matches on the
 *      trimmed halves — BOTH halves must be non-empty;
 *   3. a bare `id` matches ONLY when unambiguous across providers.
 * Returns undefined on NO match and on AMBIGUOUS matches (never guesses).
 */
export function matchModelReference(
  modelReference: string,
  available: readonly ModelRefLike[],
): ModelRefLike | undefined {
  const trimmedReference = modelReference.trim();
  if (!trimmedReference) return undefined;
  const normalizedReference = trimmedReference.toLowerCase();
  const canonicalMatches = available.filter(
    (m) => `${m.provider}/${m.id}`.toLowerCase() === normalizedReference,
  );
  if (canonicalMatches.length === 1) return canonicalMatches[0];
  if (canonicalMatches.length > 1) return undefined;
  const slashIndex = trimmedReference.indexOf("/");
  if (slashIndex !== -1) {
    const provider = trimmedReference.substring(0, slashIndex).trim();
    const modelId = trimmedReference.substring(slashIndex + 1).trim();
    if (provider && modelId) {
      const providerMatches = available.filter(
        (m) => m.provider.toLowerCase() === provider.toLowerCase()
          && m.id.toLowerCase() === modelId.toLowerCase(),
      );
      if (providerMatches.length === 1) return providerMatches[0];
      if (providerMatches.length > 1) return undefined;
    }
  }
  const idMatches = available.filter((m) => m.id.toLowerCase() === normalizedReference);
  return idMatches.length === 1 ? idMatches[0] : undefined;
}

/** Up to `max` "close candidates" for a rejected /rag model input: substring
 *  hits first (provider/id or bare id), else the first registry entries — so
 *  the error line always names real models from the SAME registry /rag model
 *  validates against. */
export function closeModelCandidates(
  modelReference: string,
  available: readonly ModelRefLike[],
  max = 5,
): string[] {
  const q = modelReference.trim().toLowerCase();
  const hits = available.filter((m) =>
    `${m.provider}/${m.id}`.toLowerCase().includes(q) || m.id.toLowerCase().includes(q));
  const pool = hits.length ? hits : available;
  return [...new Set(pool.map((m) => `${m.provider}/${m.id}`))].slice(0, max);
}

/**
 * The ONE composer of the `/rag model` no-match error line — the exact
 * strings (`no model matches "…" — close candidates: …`) used to be spelled
 * out TWICE (this reducer + index.ts's bare-pick re-validation after
 * ctx.ui.select). Both sites now share this builder, so the pinned text
 * cannot drift between the arg path and the popup path (WAVE-4 critic NIT).
 * Same ≤ 5 candidates and the same "(registry empty)" healthy-empty marker.
 */
export function noModelMatchLine(
  modelReference: string,
  available: readonly ModelRefLike[],
): string {
  const candidates = closeModelCandidates(modelReference, available, 5);
  const list = candidates.length ? candidates.join(", ") : "(registry empty)";
  return `no model matches "${modelReference}" — close candidates: ${list} (use /rag model provider/id; /rag model session clears)`;
}

/** One `/rag model ` autocomplete item — `value` is the FULL argument pi
 *  puts back on the command line (it MUST carry the `model ` prefix plus
 *  `provider/id`: a bare id would render as `/rag alan/qwen…`). */
export interface ModelCompletionItem { value: string; label: string; description: string }

/**
 * Pure `/rag model <query>` completion builder — extracts the exact filtering
 * + value composition index.ts's `getArgumentCompletions` used inline, so
 * tests/smoke/run-rag-commands.mjs can pin the `model ${provider}/${id}`
 * full-argument replacement contract. Same registry source /rag model
 * validates against, ≤ 50 items, null on no match (pi then shows nothing).
 */
export function buildModelCompletionItems(
  modelQuery: string,
  available: readonly ModelRefLike[],
): ModelCompletionItem[] | null {
  const query = modelQuery.toLowerCase();
  const items = available
    .filter((m) => `${m.provider}/${m.id}`.toLowerCase().includes(query))
    .map((m) => ({ value: `model ${m.provider}/${m.id}`, label: m.id, description: m.provider }));
  return items.length > 0 ? items.slice(0, 50) : null;
}

/** What the effective model for the NEXT D run is + WHY. */
export type DModelSource = "opts" | "rag-model" | "session" | "default";
export interface DModelResolution {
  model: string;
  source: DModelSource;
  /** Set ONLY when a STORED ragModel failed registry re-validation (the
   *  fallback that keeps an unavailable model from ever being spawned). */
  fallbackNote?: string;
}

/**
 * Pure per-run model resolution — precedence:
 *   explicit caller `opts.model`  >  stored `opts.ragModel` IF it still
 *   re-validates against the registry  >  CURRENT SESSION model (ctx.model)
 *   >  D_MODEL.
 *
 * The stored assignment is re-validated on EVERY run (user requirement): an
 * unknown/ambiguous/un-enumerable ragModel yields `fallbackNote` + the session
 * model — never a crash, never an unknown model spawned.
 */
export function resolveDModelDetail(opts: {
  model?: string;
  ctx?: ExtensionContext;
  ragModel?: string;
}): DModelResolution {
  // 1 — explicit caller override (trusted, pre-existing contract).
  if (opts.model) return { model: opts.model, source: "opts" };

  // String() coercion: a hand-edited config can store a JSON number/boolean
  // (e.g. "ragModel": 123) — `.trim()` on it would throw a TypeError and
  // abort the whole D dispatch instead of falling back.
  const stored = String(opts.ragModel ?? "").trim();
  const session = opts.ctx?.model;
  const sessionRef = session ? `${session.provider}/${session.id}` : undefined;

  // 2 — stored registry assignment, re-validated against the registry.
  if (stored) {
    const match = matchModelReference(stored, availableModelRefs(opts.ctx));
    if (match) return { model: `${match.provider}/${match.id}`, source: "rag-model" };
    return {
      model: sessionRef ?? D_MODEL,
      source: sessionRef ? "session" : "default",
      fallbackNote: `ragModel "${stored}" unavailable in the model registry — falling back to ${sessionRef ?? D_MODEL}`,
    };
  }

  // 3 — current session model.
  if (sessionRef) return { model: sessionRef, source: "session" };
  // 4 — built-in last resort.
  return { model: D_MODEL, source: "default" };
}

/**
 * resolveDModel — the string form runSubprocessD consumes. Precedence:
 *   opts.model > ragModel (if valid) > ctx.model > D_MODEL.
 * Exactly ONE stderr line is logged when a stored ragModel is skipped
 * (runtime fallback requirement); everything else is silent.
 */
export function resolveDModel(opts: {
  model?: string;
  ctx?: ExtensionContext;
  ragModel?: string;
}): string {
  const detail = resolveDModelDetail(opts);
  if (detail.fallbackNote) {
    process.stderr.write(`\r\x1b[2K[rag] ${detail.fallbackNote}\n`);
  }
  return detail.model;
}

/** Human-readable source phrase for /rag model + /rag status display. */
export function modelSourceText(
  source: DModelSource,
): "explicit override" | "registry assignment" | "session model" | "built-in default" {
  switch (source) {
    case "opts":         return "explicit override";
    case "rag-model":    return "registry assignment";
    case "session":      return "session model";
    case "default":      return "built-in default";
  }
}

/**
 * The `/rag status` "D model" row, extracted verbatim from the status widget
 * composition so run-rag-commands.mjs asserts the COMPOSED row (label + value
 * + source phrase + assignment) — wiring previously untested. `th` is
 * ctx.ui.theme (tests use a pass-through stub).
 */
export function buildDModelStatusRow(
  th: RagRowTheme,
  dModel: { model: string; source: DModelSource },
  storedAssignment: string,
): string {
  const label = (k: string) => th.fg("dim", k.padEnd(18));
  const val = (v: string | number) => th.fg("success", String(v));
  return "  " + label("D model:") + val(dModel.model) +
    th.fg("dim", `  source: ${modelSourceText(dModel.source)}  assignment: ${storedAssignment || "(none)"}`);
}

/**
 * The `/rag help` footer sentence (REMOVAL round: `/rag effort` is the ONLY
 * interface editing `ragThinkingLevel` — bare = the picker of the CHILD
 * model's supported levels, `/rag effort <level>` = the arg form; both facts
 * are about EFFORT alone). Exported so run-rag-commands.mjs pins the exact
 * wording instead of the wiring going unasserted; the pre-wave denial of the
 * effort command's very existence must stay GONE from this constant, as must
 * the removed level-subcommand alias (the test asserts both absences).
 */
export const RAG_HELP_EFFORT_FOOTER =
  "/rag effort edits ragThinkingLevel = the D child thinking level — bare = picker of the levels the CHILD model supports, /rag effort <level> sets it directly";

/**
 * Result of `/rag model [assignment]` — the pure reducer unit-tested by
 * tests/smoke/run-rag-commands.mjs; every branch carries one printable line.
 */
export type ModelOutcome =
  | { kind: "show"; line: string }
  | { kind: "set"; ref: string; line: string }
  | { kind: "clear"; line: string }
  | { kind: "error"; line: string };

/** State the no-arg `/rag model` line reports. */
export interface ModelAssignmentContext {
  /** Stored ragModel (already trimmed; empty/undefined = none). */
  assigned?: string;
  /** What resolveDModelDetail picked for the next D run. */
  effective: string;
  source: "registry assignment" | "session model" | "built-in default" | "explicit override";
}

/**
 * Pure `/rag model [assignment]` reducer (accepts the same model references
 * pi's /model does — exact `provider/id` case-insensitive, or an unambiguous
 * bare id; see matchModelReference = findExactModelReferenceMatch replica):
 *   no arg      → show effective model for the NEXT D run + source;
 *   session|default → clear the stored assignment;
 *   match       → set: persist `provider/id` ("applies from the next D run");
 *   no match    → error listing up to 5 close candidates — NEVER a silent
 *                 fallback on assignment (machine rule);
 *   registryError (4th arg, from registryUnavailable) → the error line SAYS
 *                 the registry is unavailable instead of implying "(registry
 *                 empty)" — broken and empty stay distinguishable, still a
 *                 non-throwing error outcome.
 */
export function resolveModelAssignment(
  input: string | undefined,
  available: readonly ModelRefLike[],
  current: ModelAssignmentContext,
  registryError?: string,
): ModelOutcome {
  const raw = (input ?? "").trim();
  if (!raw) {
    const assigned = current.assigned ? ` [assigned: ${current.assigned}]` : "";
    return {
      kind: "show",
      line: `rag model: ${current.effective} (source: ${current.source})${assigned}`,
    };
  }
  const arg = raw.toLowerCase();
  if (arg === "session" || arg === "default") {
    return {
      kind: "clear",
      line: "rag model assignment cleared — next D run uses the session model (built-in default outside a session)",
    };
  }
  if (registryError) {
    // Registry BROKEN/errored (registryUnavailable): say so — never present
    // a broken registry as "(registry empty)" candidates. Non-throwing.
    return {
      kind: "error",
      line: `model registry UNAVAILABLE (${registryError}) — cannot validate "${raw}", no candidates to show (fix the registry; /rag model session clears the stored assignment)`,
    };
  }
  const match = matchModelReference(raw, available);
  if (match) {
    const ref = `${match.provider}/${match.id}`;
    return { kind: "set", ref, line: `rag model: ${ref} saved (ragModel → applies from the next D run)` };
  }
  // The no-match line comes from the SHARED builder (index.ts pops it verbatim
  // after a bare-picker pick) — one string, one place (WAVE-4 critic NIT).
  return { kind: "error", line: noModelMatchLine(raw, available) };
}

// ── WAVE 4 (user revision): bare-invocation POPUP pickers ───────────────────
// pi's `/model` bare invocation opens the INTERNAL ModelSelectorComponent —
// that TUI component is NOT on the extension API surface (the only dialogs an
// extension gets are ctx.ui.select / confirm / input / notify, no preselect
// and no HTML). "Exactly like /model" therefore means: SAME model source
// (availableModelRefs — the synchronous facade over the SAME
// modelRuntime.getAvailable() `/model` reads) + a ctx.ui.select POPUP on bare
// invocation, with the entries ordered by hand because the dialog has no
// preselect: entry 0 is what Enter selects.
//
// Entry 0: the CURRENT EFFECTIVE model, annotated with the unique marker
//          " — current (Enter keeps it)" (the picker must SHOW which entry is
//          open); entry 1: THE CLEAR entry, whose label ends with the unique
//          marker "(clear ragModel)" so parseModelPick never mistakes a
//          provider/id ref for it; entry 2+: every remaining registry ref,
//          sorted provider asc then id asc (case-insensitive, raw-string
//          tiebreak) → deterministic ordering run-rag-commands.mjs pins.
export const MODEL_SELECT_CURRENT_MARKER = " — current (Enter keeps it)";
export const MODEL_SELECT_CLEAR_ENTRY = "session — use the main-session model (clear ragModel)";
export const MODEL_SELECT_CLEAR_MARKER = "(clear ragModel)";

/** Pure `/rag model` popup option builder — effective model first, THE clear
 *  entry second, the remaining refs sorted provider asc / id asc (on the
 *  BARE ref — sort first, then suffix, so a ` (…k)` tag can never influence
 *  ordering), duplicates (case-insensitive) removed, the effective model never
 *  listed twice. Every MODEL row gets the trailing ALAN-format ` (…k)` context
 *  tag when its contextWindow is known and positive; unknown/absent/
 *  non-positive → the plain ref (no empty parens, no null). The CLEAR entry is
 *  not a model → NEVER suffixed. */
export function buildModelSelectOptions(
  effective: string,
  available: readonly ModelRefLike[],
): string[] {
  const effRef = String(effective ?? "").trim();
  const effKey = effRef.toLowerCase();
  const rest: ModelRefLike[] = [];
  const seen = new Set<string>();
  let effModel: ModelRefLike | undefined;
  for (const m of available) {
    const key = `${m.provider}/${m.id}`.toLowerCase();
    if (key === effKey) { effModel ??= m; continue; }
    if (seen.has(key)) continue;
    seen.add(key);
    rest.push(m);
  }
  // Ordering stays on the BARE `provider/id` (identical to the pre-suffix
  // comparand) — the ` (…k)` tag is appended only AFTER this sort.
  const bareRef = (m: ModelRefLike) => `${m.provider}/${m.id}`;
  rest.sort((a, b) => {
    const ar = bareRef(a);
    const br = bareRef(b);
    const ap = ar.slice(0, ar.indexOf("/")).toLowerCase();
    const bp = br.slice(0, br.indexOf("/")).toLowerCase();
    if (ap !== bp) return ap < bp ? -1 : 1;
    const ai = ar.slice(ar.indexOf("/") + 1).toLowerCase();
    const bi = br.slice(br.indexOf("/") + 1).toLowerCase();
    if (ai !== bi) return ai < bi ? -1 : 1;
    return ar < br ? -1 : ar > br ? 1 : 0; // raw tiebreak → deterministic
  });
  const contextTag = (m: ModelRefLike | undefined): string => {
    const w = m?.contextWindow;
    // absent / non-positive → "" — caller OMITS the suffix (never "(0k)", never "()")
    return typeof w === "number" && Number.isFinite(w) && w > 0 ? ` ${contextKText(w)}` : "";
  };
  const current = `${effRef}${contextTag(effModel)}${MODEL_SELECT_CURRENT_MARKER}`;
  return [current, MODEL_SELECT_CLEAR_ENTRY, ...rest.map((m) => `${bareRef(m)}${contextTag(m)}`)];
}

/** What a `/rag model` popup pick MEANS — ctx.ui.select answers with the
 *  LABEL, so the unique markers are the only safe way back: clear entry →
 *  {kind:"clear"} (ragModel → ""), annotated current entry → its bare
 *  `provider/id` (with the builder's ` (…k)` context tag stripped), anything
 *  else → the string as-is minus a trailing ` (…k)` tag (validated by
 *  matchModelReference in the handler — never trusted blindly). */
export type ModelPick = { kind: "clear" } | { kind: "ref"; ref: string };

/** The model-row context suffix appended by buildModelSelectOptions — the
 *  strip only hits a TRAILING " (digits[.digits]k)" with whitespace before
 *  the paren, so it undoes exactly what the builder appended. DEGENERATE-REF
 *  ASSUMPTION: the builder controls every label and only ever appends this
 *  suffix itself — a model id literally ending in ` (123k)` would be
 *  pathological (and still needs the "\s+" prefix, which ids never end in). */
const MODEL_CONTEXT_SUFFIX = /\s+\(\d+(?:\.\d+)?k\)$/;

function stripContextSuffix(label: string): string {
  return label.replace(MODEL_CONTEXT_SUFFIX, "");
}

export function parseModelPick(picked: string): ModelPick {
  const raw = String(picked ?? "").trim();
  // ORDER IS CRITICAL: the two marker checks run FIRST and the context suffix
  // is stripped only AFTER they are handled — both markers are themselves
  // parenthesised ("…(Enter keeps it)" / "(clear ragModel)"), so marker
  // detection must own the parentheses before any suffix logic touches the
  // label; the strip below runs on the marker-free remainder, handing wave-4
  // validation (matchModelReference / shouldPinModelPick) the CLEAN ref.
  if (raw.endsWith(MODEL_SELECT_CLEAR_MARKER)) return { kind: "clear" };
  if (raw.endsWith(MODEL_SELECT_CURRENT_MARKER)) {
    const ref = raw.slice(0, raw.length - MODEL_SELECT_CURRENT_MARKER.length).trim();
    return { kind: "ref", ref: stripContextSuffix(ref) };
  }
  return { kind: "ref", ref: stripContextSuffix(raw) };
}

/**
 * BLOCKER fix (WAVE-4 critic round) — should the bare `/rag model` pick of
 * entry 0 (the EFFECTIVE model, labelled with MODEL_SELECT_CURRENT_MARKER)
 * be PINNED = answered "unchanged" WITHOUT writing config?
 *
 * YES exactly when there is NO stored assignment (`stored` trims to "" — the
 * default config state, and the same trim rule resolveDModelDetail applies to
 * stored ragModel) AND the picked ref is the effective model, case-
 * insensitively. The old guard compared `was = fresh.ragModel || "(none)"`
 * against the ref, so "(none)" never matched and Enter silently WROTE the
 * effective model into config.ragModel — pinning a session model as a
 * registry assignment. A STORED assignment keeps today's behavior: equal →
 * unchanged, different → write (this helper returns false for it either way),
 * and a pick that differs from the effective model is a genuine new
 * assignment (also false → written). PURE — unit-tested in
 * tests/smoke/run-rag-commands.mjs.
 */
export function shouldPinModelPick(
  stored: string | undefined,
  pickedRef: string,
  effectiveRef: string,
): boolean {
  if (String(stored ?? "").trim()) return false; // stored assignment owns the decision
  const picked = String(pickedRef ?? "").trim().toLowerCase();
  if (!picked) return false;
  return picked === String(effectiveRef ?? "").trim().toLowerCase();
}

/** Ordering of the `/rag effort` popup options: ONLY the supported levels,
 *  the stored ragThinkingLevel FIRST when it is one of them (case-insensitive,
 *  label unchanged — so Enter keeps it), otherwise the natural enum order pi
 *  returns ("off" first). Never invents a level: an unsupported stored value
 *  leaves the list untouched. */
export function buildEffortSelectOptions(supported: readonly string[], stored: string): string[] {
  const options = [...supported];
  const want = String(stored ?? "").trim().toLowerCase();
  if (!want) return options;
  const at = options.findIndex((l) => l.toLowerCase() === want);
  if (at > 0) options.unshift(options.splice(at, 1)[0]);
  return options;
}

/** The `/rag effort` select TITLE, truthfully parametrized (WAVE-4 critic
 *  MINOR 1): buildEffortSelectOptions hoists the stored level to entry 0 ONLY
 *  when it IS one of the supported levels — so "Enter keeps it" may only be
 *  claimed in that case. Otherwise the options keep the natural order (entry
 *  0 ≠ stored → Enter CHANGES the level) and the title says so instead of
 *  making a false promise. Both variants exist for the pick dialog; the
 *  `storedInSupported` probe mirrors buildEffortSelectOptions' own
 *  case-insensitive match. PURE — asserted in run-rag-commands.mjs. */
export function buildEffortSelectTitle(
  modelId: string,
  stored: string,
  supported: readonly string[],
): string {
  const want = String(stored ?? "").trim().toLowerCase();
  const storedInSupported = supported.some((l) => l.toLowerCase() === want);
  return storedInSupported
    ? `RAG effort — ${modelId} (current: ${stored} — Enter keeps it)`
    : `RAG effort — ${modelId} (current: ${stored} — not offered by this model)`;
}

/**
 * WAVE 4 — the effort/reasoning context for THE MODEL THE NEXT D CHILD WILL
 * RUN. The known gap this fixes: reasoningContext used to evaluate
 * `getSupportedThinkingLevels` on `ctx.model` (the SESSION model), but the D
 * child runs the stored `ragModel` override when one is set (resolveDModel
 * precedence opts > ragModel > ctx.model > D_MODEL) — so the levels shown must
 * come from THE CHILD'S model.
 *
 * Resolution: modelId via resolveDModelDetail (same precedence the child
 * uses), then the Model OBJECT: `ctx.modelRegistry.find(provider, id)` first;
 * when that misses and the id is the session model, `ctx.model` (keeps the
 * session model's real capability data instead of an empty answer); when
 * NEITHER resolves → `supported: []` + a `sourceNote` saying why — callers
 * must then show an ERROR line, never pop an empty list (machine rule).
 */
export interface EffortContext {
  modelId: string;
  supported: string[];
  /** Why `supported` is empty / why the stored ragModel fell back (may be undefined). */
  sourceNote?: string;
}

export function effortContext(
  ctx: ExtensionContext | undefined,
  ragModel: string,
): EffortContext {
  const detail = resolveDModelDetail({ ctx, ragModel: String(ragModel ?? "") });
  const modelId = detail.model;
  const registry = ctx?.modelRegistry;
  let model: NonNullable<ExtensionContext["model"]> | undefined;
  if (registry) {
    try {
      const slash = modelId.indexOf("/");
      if (slash > 0) model = registry.find(modelId.slice(0, slash), modelId.slice(slash + 1));
    } catch {
      model = undefined; // broken registry → the session-model fallback below decides
    }
  }
  const session = ctx?.model;
  if (!model && session && `${session.provider}/${session.id}`.toLowerCase() === modelId.toLowerCase()) {
    model = session;
  }
  if (!model) {
    return {
      modelId,
      supported: [],
      sourceNote: detail.fallbackNote ?? `model ${modelId} not found in the model registry`,
    };
  }
  return {
    modelId,
    supported: [...getSupportedThinkingLevels(model)],
    sourceNote: detail.fallbackNote,
  };
}

/**
 * Reasoning context: NOW an alias for effortContext (WAVE 4 correctness fix)
 * so `/rag effort` shows the levels of THE CHILD model too. Signature kept
 * (2nd argument optional, defaults to no ragModel assignment); the return
 * shape `{ modelId, supported }` is unchanged — `supported: []` still means
 * "no model resolved / not found" (graceful: never guess a list).
 */
export function reasoningContext(ctx?: ExtensionContext, ragModel = ""): { modelId: string; supported: string[] } {
  const effort = effortContext(ctx, ragModel);
  return { modelId: effort.modelId, supported: effort.supported };
}

/** Result of `/rag effort` — the pure reducer unit-tested by
 *  tests/smoke/run-d-live.mjs (U8–U10); every branch carries a full line. */
export type ReasoningOutcome =
  | { kind: "show"; line: string }
  | { kind: "set"; level: string; line: string }
  | { kind: "error"; line: string };

/**
 * Pure `/rag effort` reducer (case-insensitive, validated against
 * the PER-MODEL supported enum — never against a hard-coded list). Every
 * outcome carries one printable line; the error branch lists EVERY valid
 * value (machine rule: a rejected input must say exactly what would work).
 */
export function resolveReasoning(
  input: string | undefined,
  supported: string[],
  current: string,
  modelId: string,
): ReasoningOutcome {
  const raw = (input ?? "").trim();
  const arg = raw.toLowerCase();
  if (!arg) {
    const sup = supported.length
      ? supported.join(", ")
      : `unknown — no session model resolved (D fallback ${modelId})`;
    return { kind: "show", line: `reasoning: ${current} (supported: ${sup}) — next D run model: ${modelId}` };
  }
  if (supported.includes(arg)) {
    return {
      kind: "set",
      level: arg,
      line: `reasoning ${arg} saved (ragThinkingLevel → applies to ${modelId} from the next D run)`,
    };
  }
  const list = supported.length
    ? supported.join(", ")
    : `(none — no session model resolved; retry inside an active session)`;
  return { kind: "error", line: `invalid reasoning level "${raw}" for model ${modelId} — valid: ${list} (case-insensitive)` };
}

/**
 * D thinking level → spawn flag `--thinking high` (spawnRagSubagent pushes it
 * iff `agent.thinkingLevel` is set). PI ONLY SENDS reasoning when BOTH this
 * flag is present AND models.json declares the model capability
 * `reasoning: true` (openai-completions request builder:
 * `compat.thinkingFormat === "qwen" && model.reasoning` → top-level
 * `enable_thinking`; without the capability `getSupportedThinkingLevels` clamps
 * every level to "off" and the flag is a no-op). The child-only
 * `before_provider_request` hook in index.ts then maps the request onto the
 * template-level switch the ALAN endpoint honors. Scoped: the MAIN session is
 * untouched (no capability flag ⇒ no payload change; `compat.
 * supportsReasoningEffort:false` keeps `reasoning_effort` — which the gateway
 * rejects with HTTP 400 for "high" — out of every payload).
 */
export const D_THINKING_LEVEL = "high";

/** Raw corpus tools only — never rag_* (research defines what IS in the corpus). */
export const D_TOOLS = ["read", "grep", "find", "ls", "bash"];

/** The exact final message meaning "off-corpus question → inject nothing". */
export const D_UNRELATED = /^UNRELATED[.!]*$/i;

/**
 * The production D system prompt: the thorough researcher, but deliverable
 * = CONTEXT PAYLOAD (not a facts file). Adapted from the phase-2 reference
 * prompt (tests/ab2/run-d.mjs freshSystemPrompt).
 */
export function buildDSystemPrompt(trackedPaths: string[]): string {
  const corpus = trackedPaths.length
    ? trackedPaths.map((p) => `- ${p}`).join("\n")
    : "- (no tracked paths configured — run /rag index)";
  return `You are METHOD D — a deep, corpus-grounded research subagent for a local-RAG setup. Your complete answer is INJECTED as context into a parent conversation that will use it to answer the user well. You have FULL RAW access to the documentation corpus and NO retrieval/RAG tools. Be the THOROUGH researcher: find every part of the corpus that serves the question, and hand over the substance, not a summary of it.

CORPUS (your ONLY sources of truth):
${corpus}
Explore it with the read / grep / find / ls / bash tools. Do NOT use any rag_* tool — you research the corpus itself.

MISSION
1. First decide relevance. If the question is unrelated to this corpus (no relevant content exists), your FINAL MESSAGE must be EXACTLY the single word UNRELATED — nothing else.
2. Research THOROUGHLY before you stop. A complete payload must cover:
   - EVERY sub-ask in the question (split it into sub-questions and address each);
   - EVERY relevant API section — check the guides AND the command reference AND the example scripts before concluding you are done;
   - EVERY relevant example/script file demonstrating the asked topic.
   Use grep to locate candidates, then read the surrounding context. Do not stop at the first hit — exhaust the topic across all three source classes (guide, command reference, examples).
3. FINAL MESSAGE = THE PAYLOAD, in Markdown, ≤ 15 KB: exactly what the parent model needs to answer — real signatures and parameter lists, short exact code excerpts, concrete steps and constraints — organized by sub-ask stated in the user's words. Cite every excerpt as \`file:line\` (path relative to where you read it). Quote source lines verbatim rather than paraphrasing important details.

RULES
- The corpus is READ-ONLY. Research only: never write, edit, or create files and never run commands that modify anything — even an "improvement" to the corpus is out of scope.
- Ground everything in what you actually read; never invent file:line.
- Prefer showing the exact passage over describing it.
- No query/round/tool budget, but once every sub-ask is served, stop.
- The payload IS your final message — no preamble, no report about your process.`;
}

/** Production D task body (the user prompt, verbatim, plus deliverable terms). */
export function buildDTask(userPrompt: string): string {
  return [
    `USER PROMPT (verbatim):`,
    `<<<PROMPT`,
    userPrompt,
    `PROMPT`,
    `>>>`,
    ``,
    `Begin the research now. FINAL MESSAGE = the context payload (or exactly UNRELATED).`,
  ].join("\n");
}

export interface SubprocessDOptions {
  prompt: string;
  ctx: ExtensionContext;
  /** config.trackedPaths — the corpus the child may read. */
  trackedPaths: string[];
  /** config.ragSubagentHookTimeoutMs — hard cap (research may take minutes). */
  timeoutMs: number;
  model?: string;
  /** config.ragModel — the persistent "/rag model [assignment]" value. It is
   *  re-validated against ctx.modelRegistry on every run inside resolveDModel
   *  and falls back to ctx.model (one stderr line) when it no longer exists. */
  ragModel?: string;
  /**
   * Override for the child `--thinking <level>` flag (off…max). Production
   * passes config.ragThinkingLevel (the `/rag effort` key, default/high);
   * absent ⇒ D_THINKING_LEVEL. The flag is emitted for EVERY truthy value
   * including "off" (consistent: always explicit `--thinking <level>`, never
   * omitted) — for a session model without the reasoning capability pi
   * clamps to off itself (getSupportedThinkingLevels → ["off"]) and the
   * child-only hook keeps the template-level suppression, so nothing breaks.
   */
  thinkingLevel?: string;
  /** Classical-subagent result frame (see subagentFrame.ts). */
  appendFrame?: (frame: SubagentFrameData) => void;
}

/**
 * Serve D for one user prompt. Never throws: degrades to { ok: false } + note
 * (the hook then injects nothing and the conversation proceeds).
 */
export async function runSubprocessD(opts: SubprocessDOptions): Promise<SmokeRunResult> {
  // Precedence: opts.model > ragModel IF still valid > CURRENT SESSION model
  // (ctx.model) > D_MODEL — see resolveDModel (stderr line on ragModel fallback).
  const model = resolveDModel(opts);
  const thinkingLevel = opts.thinkingLevel ?? D_THINKING_LEVEL;
  const agent: RagQueryAgent = {
    systemPrompt: buildDSystemPrompt(opts.trackedPaths),
    tools: D_TOOLS,
    model,
    // Reasoning in the D child: without it the child harness suppresses
    // thinking (index.ts hook) and no thinking_delta ever reaches the panel.
    thinkingLevel,
    filePath: "",
  };
  return runVisibleSubagent({
    prompt: opts.prompt,
    ctx: opts.ctx,
    timeoutMs: opts.timeoutMs,
    // D is a deep dive: allow longer silent stretches than the 45 s default
    // (a heavy grep/read round against big reference files can pause output).
    stallMs: Math.min(120_000, Math.max(45_000, Math.floor(opts.timeoutMs / 4))),
    label: "rag-d",
    agent,
    // One-line call-header suffix: `model · thinking <level>` (renderCallFrame).
    meta: `${model} · thinking ${thinkingLevel}`,
    taskBody: buildDTask(opts.prompt),
    isVoidPayload: (t) => D_UNRELATED.test(t.trim()),
    appendFrame: opts.appendFrame,
  });
}
