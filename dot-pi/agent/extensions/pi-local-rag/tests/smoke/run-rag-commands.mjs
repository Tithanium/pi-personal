#!/usr/bin/env node
/**
 * run-rag-commands.mjs — headless pre-check of the pure /rag command reducers
 * (goal v3 PART 5, tasks 1 + 4 + 2). Fail-first style: every check is written
 * against the REQUIRED behavior first, the file exits 0 only when all pass.
 *
 * Covers (unit-testable logic, no network / no gateway / no live config write):
 *
 *   1. /rag model matching — exact `provider/id` case-insensitive, unambiguous
 *      bare id, AMBIGUOUS bare id rejected, no-match error with ≤ 5 close
 *      candidates (NO silent fallback), `session` / `default` clears, no-arg
 *      show line (effective model + source);
 *   2. /rag subagent profile validation — valid (case-insensitive), invalid →
 *      error listing the names, stored-value read-time fallback to all-grep
 *      (+ warn flag), absent key → default WITHOUT warning;
 *   3. resolveDModel precedence — opts.model > ragModel (if valid) > ctx.model
 *      > D_MODEL, incl. an INVALID stored ragModel falling back to the session
 *      model with a fallbackNote (never an unknown model spawned);
 *   3. resolveDModel precedence — opts.model > ragModel (if valid) > ctx.model
 *      > D_MODEL, incl. an INVALID stored ragModel falling back to the session
 *      model with a fallbackNote (never an unknown model spawned), and a
 *      NUMBER-typed stored value coerced instead of throwing a TypeError;
 *   4. config defaults — defaultConfig() + loadConfig() fill the ABSENT
 *      ragModel/ragProfile keys, asserted HERMETICALLY against defaultConfig()
 *      in a temp PI_RAG_DIR (the live ~/.pi/rag/config.json is never read or
 *      written by this test — deriving the expectation from it was
 *      tautological);
 *   5. registry-broken signal — a BROKEN model registry (getAvailable throws /
 *      getError() set) yields a \"registry UNAVAILABLE\" error, never
 *      \"(registry empty)\" candidates, and the probe never throws;
 *   6. wiring contracts — the factored pure builders index.ts composes:
 *      completion value = full `model ${provider}/${id}` argument, the help
 *      footer sentence, the two /rag status rows, plus an index.ts source
 *      check that those builders are the ones actually used.
 *   8. WAVE-4 CRITIC FIX ROUND (1 blocker + 2 minor + 3 nit): the bare
 *      /rag model pick of entry 0 (the EFFECTIVE model) with NO stored
 *      assignment must NOT write config (pure shouldPinModelPick guard +
 *      source ordering BEFORE the write), the /rag effort select title must
 *      only claim "Enter keeps it" when the stored level IS offered, an
 *      effort pick equal to the stored level must not write, the unknown-sub
 *      comment sample must be genuinely unknown, the save-failure notice
 *      must exist as ONE factored helper (NOT-persisted template ≤ 1), and
 *      the bare-pick no-match line must be the ONE shared builder.
 *   7. WAVE-4 bare-invocation popups (user revision): /rag model bare →
 *      ctx.ui.select with [current effective, clear-entry, sorted rest];
 *      /rag effort bare → ctx.ui.select with ONLY the CHILD model's supported
 *      levels (stored first IF supported); effortContext resolution
 *      (ragModel > session > D_MODEL) incl. the reasoningContext fix (levels
 *      must follow the CHILD model, not the session one); index.ts source
 *      dispatch/completion/footer wiring. Fail-first: every check below was
 *      written against the required behavior BEFORE the implementation.
 *
 * Usage:  node tests/smoke/run-rag-commands.mjs
 * Exit 0 = all checks passed.
 */
import { mkdtempSync, writeFileSync, rmSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

// HERMETIC (critic finding): pin the RAG store to a fresh temp dir BEFORE any
// config read — expectations must come from defaultConfig(), never from the
// LIVE ~/.pi/rag/config.json. Removed again right before exit.
const PI_RAG_TEST_DIR = mkdtempSync(join(tmpdir(), "pi-rag-cmds-"));
process.env.PI_RAG_DIR = PI_RAG_TEST_DIR;

const { RAG_PROFILES, DEFAULT_RAG_PROFILE, resolveProfileChoice, normalizeRagProfile, normalizeRagSubprocess, defaultConfig, loadConfig, buildProfileStatusRow, buildSubprocessStatusTag, effectiveFrom } =
  await import("../../config.ts");
const { matchModelReference, resolveModelAssignment, resolveDModel, resolveDModelDetail, modelSourceText, D_MODEL,
  buildModelCompletionItems, buildDModelStatusRow, RAG_HELP_EFFORT_FOOTER, registryUnavailable } =
  await import("../../subprocessD.ts");
// Namespace handle for the WAVE-4 exports: checked with typeof FIRST so a
// pre-wave subprocessD.ts yields LISTED failures instead of an import crash.
const dsub = await import("../../subprocessD.ts");
// NEW footer module — guarded import so a PRE-FEATURE tree yields LISTED
// failures instead of an import crash (fail-first convention, same as dsub).
let ragFooter = null;
try {
  ragFooter = await import("../../ragFooter.ts");
} catch {
  ragFooter = null; // module absent → every unit check below fails, none crash
}
const { configFile, getRagDir } = await import("../../store.ts");

const results = [];
let failed = 0;
const check = (name, pass, detail) => {
  results.push(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
  if (!pass) failed += 1;
};

// Registry stub — the SAME shape ctx.modelRegistry.getAvailable() returns
// (provider/id pairs, pi Models also carry contextWindow); duplicated ids
// across providers exercise ambiguity. Context values DERIVED from the ALAN
// formula (ALAN_connector/index.ts:119-121, round FIRST then integer check):
//   131072/1024 = 128 exactly            → "(128k)"
//   130560/1024 = 127.5 exactly          → "(127.5k)" (the one-decimal case)
//   135168/1024 = 132 exactly            → "(132k)"
// mirror/qwen-3.8-27b OMITS contextWindow → plain picker row (no empty parens).
const REGISTRY = [
  { provider: "alan", id: "qwen-3.8-27b", contextWindow: 131072 },
  { provider: "alan", id: "gpt-oss-120b", contextWindow: 130560 },
  { provider: "mirror", id: "qwen-3.8-27b" }, // same id as alan → bare id AMBIGUOUS; NO contextWindow
  { provider: "anthropic", id: "claude-sonnet-4-5", contextWindow: 135168 },
];
const stubCtx = (model) => ({
  model,
  modelRegistry: { getAvailable: () => REGISTRY },
});
const SESSION_MODEL = { provider: "sess", id: "current-model" };

// ── 1. /rag model matching ───────────────────────────────────────────────────
{
  const exact = matchModelReference("ALAN/QWEN-3.8-27B", REGISTRY);
  check("model match: exact provider/id case-insensitive",
    exact?.provider === "alan" && exact?.id === "qwen-3.8-27b", JSON.stringify(exact));

  const spaced = matchModelReference(" mirror / qwen-3.8-27b ", REGISTRY);
  check("model match: explicit provider/id with spaces around '/'",
    spaced?.provider === "mirror" && spaced?.id === "qwen-3.8-27b", JSON.stringify(spaced));

  const bareOk = matchModelReference("claude-sonnet-4-5", REGISTRY);
  check("model match: bare id accepted when UNAMBIGUOUS",
    bareOk?.provider === "anthropic", JSON.stringify(bareOk));

  const bareAmbiguous = matchModelReference("qwen-3.8-27b", REGISTRY);
  check("model match: bare id REJECTED when ambiguous across providers",
    bareAmbiguous === undefined, JSON.stringify(bareAmbiguous));

  const outSet = resolveModelAssignment("Anthropic/Claude-Sonnet-4-5", REGISTRY, {
    effective: "sess/current-model", source: "session model",
  });
  check("assignment: set resolves provider/id + names the next run",
    outSet.kind === "set" && outSet.ref === "anthropic/claude-sonnet-4-5" &&
    outSet.line.includes("applies from the next D run"), JSON.stringify(outSet));

  const outErr = resolveModelAssignment("totally-unknown-model", REGISTRY, {
    effective: "sess/current-model", source: "session model",
  });
  const candPart = outErr.kind === "error"
    ? (outErr.line.split("close candidates: ")[1] ?? "").split(" (use ")[0]
    : "";
  const candCount = candPart.split(")")[0].split(",").filter((s) => s.trim()).length;
  check("assignment: NO match → error, NO silent fallback (no ref)",
    outErr.kind === "error" && !("ref" in outErr), JSON.stringify(outErr));
  check("assignment: error lists ≤ 5 close candidates",
    candCount > 0 && candCount <= 5, `count=${candCount} → ${candPart.slice(0, 80)}`);

  const ambiguity = resolveModelAssignment("qwen-3.8-27b", REGISTRY, {
    effective: "sess/current-model", source: "session model",
  });
  check("assignment: ambiguous bare id → error (never a guess)",
    ambiguity.kind === "error", JSON.stringify(ambiguity));

  const clearSession = resolveModelAssignment("session", REGISTRY, {
    assigned: "alan/gpt-oss-120b", effective: "alan/gpt-oss-120b", source: "registry assignment",
  });
  const clearDefault = resolveModelAssignment("DEFAULT", REGISTRY, {
    effective: "sess/current-model", source: "session model",
  });
  check("assignment: `session` clears the stored value",
    clearSession.kind === "clear" && clearSession.line.includes("cleared"), JSON.stringify(clearSession));
  check("assignment: `default` (any case) clears too",
    clearDefault.kind === "clear", JSON.stringify(clearDefault));

  const show = resolveModelAssignment(undefined, REGISTRY, {
    assigned: "alan/gpt-oss-120b",
    effective: "alan/gpt-oss-120b",
    source: modelSourceText("rag-model"),
  });
  check("assignment: no-arg → ONE line, effective model + source",
    show.kind === "show" &&
    show.line.startsWith("rag model: alan/gpt-oss-120b (source: registry assignment)"),
    JSON.stringify(show));

  // 1b — BROKEN registry (4th arg from registryUnavailable) must be
  // distinguishable from a healthy-but-EMPTY registry (never both
  // "(registry empty)"), and the probe itself must never throw.
  const broken = resolveModelAssignment("ghost-model", [], {
    effective: "sess/current-model", source: "session model",
  }, "registry read failed");
  check("assignment: BROKEN registry → error says registry UNAVAILABLE, not '(registry empty)'",
    broken.kind === "error" && !broken.line.includes("(registry empty)") &&
    broken.line.includes("UNAVAILABLE") && broken.line.includes('"ghost-model"'),
    JSON.stringify(broken));
  const healthyEmpty = resolveModelAssignment("ghost-model", [], {
    effective: "sess/current-model", source: "session model",
  });
  check("assignment: healthy-but-EMPTY registry still '(registry empty)' (distinguishable)",
    healthyEmpty.kind === "error" && healthyEmpty.line.includes("(registry empty)"),
    JSON.stringify(healthyEmpty));
  const probeOk = registryUnavailable(stubCtx(SESSION_MODEL));
  const probeThrows = registryUnavailable({ modelRegistry: { getAvailable() { throw new Error("registry read failed"); } } });
  const probeGetError = registryUnavailable({ modelRegistry: { getAvailable: () => REGISTRY, getError: () => "models.json parse error" } });
  const probeNoCtx = registryUnavailable(undefined);
  check("registry probe: healthy → undefined; throw / getError() / no ctx → message (never throws)",
    probeOk === undefined && probeThrows === "registry read failed" &&
    probeGetError === "models.json parse error" && typeof probeNoCtx === "string",
    JSON.stringify({ probeOk, probeThrows, probeGetError, probeNoCtx }));
}

// ── 2. /rag subagent profile validation ──────────────────────────────────────
{
  const set = resolveProfileChoice("OKF-ONLY", "all-grep");
  check("profile: valid name accepted case-insensitively → canonical name",
    set.kind === "set" && set.profile === "okf-only", JSON.stringify(set));

  const err = resolveProfileChoice("bogus", "all-grep");
  const names = RAG_PROFILES.map((p) => p.name);
  check("profile: invalid name → error listing ALL valid names",
    err.kind === "error" && names.every((n) => err.line.includes(n)), JSON.stringify(err));

  const show = resolveProfileChoice(undefined, "grep5");
  check("profile: no-arg → show current + valid names",
    show.kind === "show" && show.profile === "grep5" &&
    names.every((n) => show.line.includes(n)), JSON.stringify(show));

  const storedBad = normalizeRagProfile("weird-profile");
  check("profile: invalid STORED value → auto-fallback all-grep + warn flag",
    storedBad.profile === "all-grep" && storedBad.fellBack === true, JSON.stringify(storedBad));

  const storedOk = normalizeRagProfile("GREP5");
  check("profile: valid stored value (any case) kept, no warn",
    storedOk.profile === "grep5" && storedOk.fellBack === false, JSON.stringify(storedOk));

  const absent = normalizeRagProfile(undefined);
  const empty = normalizeRagProfile("");
  check("profile: absent/empty key → default WITHOUT warning (fresh config)",
    absent.profile === DEFAULT_RAG_PROFILE && absent.fellBack === false &&
    empty.profile === DEFAULT_RAG_PROFILE && empty.fellBack === false,
    JSON.stringify({ absent, empty }));

  // Number/boolean-typed STORED values (a hand-edited JSON config):
  // String() coercion at the boundary, never a TypeError abort.
  const numeric = normalizeRagProfile(5);
  const boolish = normalizeRagProfile(true);
  check("profile: NUMBER/BOOLEAN-typed stored value coerced (no TypeError) → default + fallback",
    numeric.profile === DEFAULT_RAG_PROFILE && numeric.fellBack === true &&
    boolish.profile === DEFAULT_RAG_PROFILE && boolish.fellBack === true,
    JSON.stringify({ numeric, boolish }));
}

// ── 3. resolveDModel precedence + invalid-ragModel fallback ─────────────────
{
  const ctx = stubCtx(SESSION_MODEL);

  const optsWins = resolveDModelDetail({ model: "explicit/override", ctx, ragModel: "alan/qwen-3.8-27b" });
  check("D model: opts.model beats ragModel + session",
    optsWins.model === "explicit/override" && optsWins.source === "opts", JSON.stringify(optsWins));

  const ragWins = resolveDModelDetail({ ctx, ragModel: "anthropic/claude-sonnet-4-5" });
  check("D model: valid ragModel beats session model",
    ragWins.model === "anthropic/claude-sonnet-4-5" && ragWins.source === "rag-model" &&
    ragWins.fallbackNote === undefined, JSON.stringify(ragWins));

  const ragCase = resolveDModelDetail({ ctx, ragModel: "ALAN/GPT-OSS-120B" });
  check("D model: stored ragModel re-validated case-insensitively + normalized",
    ragCase.model === "alan/gpt-oss-120b" && ragCase.source === "rag-model", JSON.stringify(ragCase));

  const invalid = resolveDModelDetail({ ctx, ragModel: "ghost/removed-model" });
  check("D model: INVALID stored ragModel → falls back to SESSION model + note",
    invalid.model === "sess/current-model" && invalid.source === "session" &&
    typeof invalid.fallbackNote === "string" && invalid.fallbackNote.includes("ghost/removed-model"),
    JSON.stringify(invalid));

  const invalidNoSession = resolveDModelDetail({ ragModel: "ghost/removed-model" });
  check("D model: invalid ragModel without session → D_MODEL (last resort) + note",
    invalidNoSession.model === D_MODEL && invalidNoSession.source === "default" &&
    typeof invalidNoSession.fallbackNote === "string", JSON.stringify(invalidNoSession));

  const sessionOnly = resolveDModelDetail({ ctx });
  check("D model: no ragModel → session model",
    sessionOnly.model === "sess/current-model" && sessionOnly.source === "session", JSON.stringify(sessionOnly));

  const nothing = resolveDModelDetail({});
  check("D model: nothing available → D_MODEL", nothing.model === D_MODEL && nothing.source === "default",
    JSON.stringify(nothing));

  // String form consumed by runSubprocessD (same precedence; stderr note stripped here).
  const strFallback = resolveDModel({ ctx, ragModel: "ghost/removed-model" });
  check("D model: resolveDModel(string) applies the same fallback",
    strFallback === "sess/current-model", strFallback);

  const sourceTexts = ["opts", "rag-model", "session", "default"].map(modelSourceText);
  check("D model: source phrases for /rag model + status",
    JSON.stringify(sourceTexts) === JSON.stringify(["explicit override", "registry assignment", "session model", "built-in default"]),
    JSON.stringify(sourceTexts));

  // NUMBER-typed stored ragModel: coerced at the boundary instead of
  // aborting the whole D dispatch (TypeError on .trim()).
  const numericStored = resolveDModelDetail({ ctx, ragModel: 123 });
  check("D model: NUMBER-typed stored ragModel coerced (no TypeError) → session fallback + note",
    numericStored.model === "sess/current-model" && numericStored.source === "session" &&
    typeof numericStored.fallbackNote === "string" && numericStored.fallbackNote.includes("123"),
    JSON.stringify(numericStored));
}

// ── 4. config defaults cover ABSENT keys — HERMETIC (temp PI_RAG_DIR) ───────
{
  const def = defaultConfig();
  check("config: defaultConfig() carries ragModel \"\" + ragProfile all-grep",
    def.ragModel === "" && def.ragProfile === "all-grep",
    JSON.stringify({ ragModel: def.ragModel, ragProfile: def.ragProfile }));

  // Critic finding: NEVER read the live ~/.pi/rag/config.json to derive this
  // check's own expectation (tautological + non-hermetic) — write a config
  // WITHOUT the keys into the temp PI_RAG_DIR and assert defaultConfig().
  const cfgFile = configFile(getRagDir());
  writeFileSync(cfgFile, JSON.stringify({ ragEnabled: true }, null, 2));
  const loaded = loadConfig();
  check("config: ABSENT ragModel/ragProfile keys filled from defaultConfig() (hermetic temp dir)",
    loaded.ragModel === def.ragModel && loaded.ragProfile === def.ragProfile &&
    loaded.ragEnabled === true,
    JSON.stringify({ ragDir: getRagDir(), ragModel: loaded.ragModel, ragProfile: loaded.ragProfile }));
}

// ── 5. wiring contracts — the factored pure builders index.ts composes ──────
{
  // Completion `value` contract: FULL argument replacement — bare id would
  // render as `/rag alan/qwen…` on the command line (critic's example).
  const items = buildModelCompletionItems("alan/qw", REGISTRY);
  check("completion: model value = FULL argument `model provider/id` (never bare id)",
    Array.isArray(items) && items.length === 1 &&
    items[0].value === "model alan/qwen-3.8-27b" &&
    items[0].label === "qwen-3.8-27b" && items[0].description === "alan",
    JSON.stringify(items));
  const all = buildModelCompletionItems("", REGISTRY);
  check("completion: every value carries `model ` prefix + provider/id slash",
    Array.isArray(all) && all.length === REGISTRY.length &&
    all.every((it) => it.value.startsWith("model ") && it.value.includes("/") &&
      it.label.length > 0 && it.description.length > 0),
    JSON.stringify(Array.isArray(all) ? all.map((it) => it.value) : all));
  check("completion: no match → null (pi shows nothing, no dangling item)",
    buildModelCompletionItems("no-such-model", REGISTRY) === null,
    String(buildModelCompletionItems("no-such-model", REGISTRY)));

  // Help footer — REMOVAL round (user decision): /rag effort is the ONLY
  // interface editing ragThinkingLevel (bare = picker, /rag effort <level> =
  // arg form); the old 'NO /rag effort' denial AND the /rag reasoning mention
  // must BOTH be gone.
  check("help footer: effort-only (bare = picker + arg form) + ragThinkingLevel named + '/rag reasoning' GONE",
    RAG_HELP_EFFORT_FOOTER.includes("/rag effort") &&
    RAG_HELP_EFFORT_FOOTER.includes("ragThinkingLevel") &&
    RAG_HELP_EFFORT_FOOTER.includes("<level>") &&
    !RAG_HELP_EFFORT_FOOTER.includes("/rag reasoning") &&
    !RAG_HELP_EFFORT_FOOTER.includes("NO /rag effort command"),
    RAG_HELP_EFFORT_FOOTER);

  // The two /rag status rows, composed against a pass-through theme.
  const flat = { fg: (_color, text) => text };
  const prow = buildProfileStatusRow(flat, { profile: "okf-only", fellBack: false }, "okf-only", "OKF-only tuned");
  check("status row: Subagent profile (label + value + profile meta)",
    prow.includes("Subagent profile:") && prow.includes("okf-only") && prow.includes("(OKF-only tuned)"),
    JSON.stringify(prow));
  const drow = buildDModelStatusRow(flat, { model: "sess/current-model", source: "session" }, "");
  check("status row: D model (label + value + source phrase + assignment)",
    drow.includes("D model:") && drow.includes("sess/current-model") &&
    drow.includes("source: session model") && drow.includes("assignment: (none)"),
    JSON.stringify(drow));

  // The tested builders must be the ones index.ts ACTUALLY composes
  // (guards against a refactor drift where both sides pass independently).
  const indexSrc = readFileSync(new URL("../../index.ts", import.meta.url), "utf-8");
  check("index.ts wires the tested builders (completion/help/status)",
    indexSrc.includes("buildModelCompletionItems(") &&
    indexSrc.includes("RAG_HELP_EFFORT_FOOTER") &&
    indexSrc.includes("buildProfileStatusRow(") &&
    indexSrc.includes("buildDModelStatusRow("),
    "index.ts source");

  // REMOVAL round (user decision — confusing next to /rag effort): the
  // command name `/rag reasoning` must be GONE from PRODUCTION text. This test
  // file may still mention the old command; only index.ts + subprocessD.ts
  // production sources count — fail-first: failed pre-removal.
  const prodSubSrc = readFileSync(new URL("../../subprocessD.ts", import.meta.url), "utf-8");
  const countReasoningCmd = (s) => (s.match(/\/rag reasoning/g) || []).length;
  check("removal: ZERO `/rag reasoning` occurrences in index.ts + subprocessD.ts production text",
    countReasoningCmd(indexSrc) === 0 && countReasoningCmd(prodSubSrc) === 0,
    `index.ts=${countReasoningCmd(indexSrc)} subprocessD.ts=${countReasoningCmd(prodSubSrc)}`);

  // Critic finding 4 — COMPOSED `/rag status` subprocess tag: the status row
  // reads through the SAME shared effectiveFrom() helper the hook dispatches
  // on, and the tag itself carries the two truthfulness markers (findings 1/4).
  const okfActive = buildSubprocessStatusTag(
    { ragProfile: "okf-only", ragSubprocess: "D", ragSubagentHookBlocking: true });
  check("status tag: okf-only wins + override note when the hook WOULD run it",
    okfActive === "subprocess=Okf (ragSubprocess=D overridden by profile)", okfActive);
  const okfDormant = buildSubprocessStatusTag(
    { ragProfile: "okf-only", ragSubprocess: "D", ragSubagentHookBlocking: false });
  check("status tag: blocking off → (hook inactive), Okf NEVER printed as active (finding 1)",
    okfDormant ===
      "subprocess=Okf (ragSubprocess=D overridden by profile) (hook inactive)", okfDormant);
  const nullEdit = buildSubprocessStatusTag(
    { ragProfile: "all-grep", ragSubprocess: null, ragSubagentHookBlocking: true });
  check("status tag: hand-edited ragSubprocess null → subprocess=D, no bogus override (hook parity)",
    nullEdit === "subprocess=D", nullEdit);
  const dDormant = buildSubprocessStatusTag(
    { ragProfile: "grep5", ragSubprocess: "D", ragSubagentHookBlocking: false });
  check("status tag: blocking off marks ANY subprocess (here D) hook-inactive",
    dDormant === "subprocess=D (hook inactive)", dDormant);
  check("shared reader: hook and status use the ONE effectiveFrom() composition",
    effectiveFrom({ ragProfile: "all-grep", ragSubprocess: null }).effective === "D" &&
    effectiveFrom({ ragProfile: "okf-only", ragSubprocess: "D" }).effective === "Okf",
    "effectiveFrom");
  check("index.ts composes the tested subprocess tag into the status row",
    indexSrc.includes("const subTag = buildSubprocessStatusTag(config)") &&
    indexSrc.includes("${subTag}"), "index.ts source");
}

// === 7. normalizeRagSubprocess back-compat (goal v3 PART 4 step 3) =========
// The A/B/C/EF dispatch branches were REMOVED: a stored legacy value must be
// treated as "D" (one fallback note, never a removed branch), D/S pass through,
// null/absent defaults quietly, garbage/number-typed values never throw.
{
  const legacy = [
    normalizeRagSubprocess("A"), normalizeRagSubprocess("a"),
    normalizeRagSubprocess("EF"), normalizeRagSubprocess("ef"),
    normalizeRagSubprocess("B"), normalizeRagSubprocess("C"),
  ];
  const legacyFrom = effectiveFrom({ ragProfile: "all-grep", ragSubprocess: "A" });
  check("norm: legacy A/B/C/EF (any case) → D + fallback note",
    legacy.every((r) => r.sub === "D" && r.fellBack === true) &&
    legacyFrom.effective === "D" && legacyFrom.subFellBack === true,
    JSON.stringify({ legacy, hook: legacyFrom }));
  check("norm: D/S pass through case-insensitively, no note",
    normalizeRagSubprocess("D").sub === "D" && normalizeRagSubprocess("D").fellBack === false &&
    normalizeRagSubprocess("d").fellBack === false &&
    normalizeRagSubprocess("S").sub === "S" && normalizeRagSubprocess("S").fellBack === false &&
    normalizeRagSubprocess("s").sub === "S" &&
    normalizeRagSubprocess(" D ").fellBack === false,
    JSON.stringify([normalizeRagSubprocess("S"), normalizeRagSubprocess(" D ")]));
  check("norm: null/absent/empty → D quietly (never a removed branch, no note)",
    normalizeRagSubprocess(null).sub === "D" && normalizeRagSubprocess(null).fellBack === false &&
    normalizeRagSubprocess(undefined).fellBack === false &&
    normalizeRagSubprocess("").fellBack === false,
    JSON.stringify([normalizeRagSubprocess(null), normalizeRagSubprocess(undefined)]));
  check("norm: unknown garbage / number-typed value → D with a note, never throws",
    normalizeRagSubprocess("bogus").sub === "D" && normalizeRagSubprocess("bogus").fellBack === true &&
    normalizeRagSubprocess(5).sub === "D" && normalizeRagSubprocess(5).fellBack === true &&
    normalizeRagSubprocess(5).stored === "5",
    JSON.stringify([normalizeRagSubprocess("bogus"), normalizeRagSubprocess(5)]));
  check("norm: default config carries ragSubprocess D (A removed — PART 4 step 3)",
    defaultConfig().ragSubprocess === "D",
    JSON.stringify(defaultConfig().ragSubprocess));
}

// === 8. config schema shrink (goal v3 PART 4 step 5) ========================
// The schema carries ONLY the D/S/Okf-surface keys. A stored config that still
// carries REMOVED/unknown stale keys must load fine (BOM preserved) and yield
// EXACTLY the shrunken default key set (stale keys ignored, known overrides
// applied); the dead keys must never re-enter defaultConfig().
{
  const cfgPath = configFile(getRagDir());
  const stale = {
    ...defaultConfig(),
    ragTopK: 9,                 // known override that MUST survive the load
    ragSwarmMaxN: 6,            // stale — removed in earlier waves
    ragBVariant: "single",      // stale — removed in earlier waves
    ragFPlannerQueries: 2,      // stale — removed with EF (step 1)
    ragRelevanceRawMin: 0.47,   // stale — removed with the legacy path (step 2)
    ragPrefetchTopChunks: 12,   // stale — removed with B/C (step 5)
    ragArmFolderCap: 4,         // stale — removed with B/C (step 5)
    ragDefNeighborBudget: 6144, // stale — removed with B (step 5)
    ragSubagentHook: false,     // stale — removed in step 5 (zero live reads)
  };
  writeFileSync(cfgPath, "\uFEFF" + JSON.stringify(stale, null, 2));
  const loaded = loadConfig();
  check("stale config: loads (BOM) and yields EXACTLY the shrunken default key set",
    JSON.stringify(Object.keys(loaded).sort()) === JSON.stringify(Object.keys(defaultConfig()).sort()) &&
    loaded.ragTopK === 9 &&
    !["ragSwarmMaxN", "ragBVariant", "ragFPlannerQueries", "ragRelevanceRawMin",
      "ragPrefetchTopChunks", "ragArmFolderCap", "ragDefNeighborBudget",
      "ragSubagentHook"].some((k) => k in loaded),
    JSON.stringify({ nKeys: Object.keys(loaded).length, ragTopK: loaded.ragTopK }));
  const defKeys = Object.keys(defaultConfig());
  const dead = ["ragSubagentHook", "ragPrefetchTopChunks", "ragPrefetchMaxBytes",
    "ragPrefetchPerFileCap", "ragArmFolderCap", "ragDefNeighborBudget",
    "ragRelevanceRawMin", "ragRelevanceSpreadMin", "ragERerankMaxPairs", "ragFPlannerQueries"];
  const survivors = ["ragEnabled", "ragTopK", "ragScoreThreshold", "ragAlpha",
    "extraExtensions", "excludeExtensions", "trackedPaths", "excludePatterns",
    "ragSubagentHookBlocking", "ragSubagentHookTimeoutMs", "ragSubprocess",
    "ragThinkingLevel", "ragModel", "ragProfile"];
  check("schema: dead keys ABSENT from defaultConfig(), every survivor present",
    dead.every((k) => !defKeys.includes(k)) && survivors.every((k) => defKeys.includes(k)) &&
    defKeys.length === survivors.length,
    JSON.stringify({ nKeys: defKeys.length, deadPresent: dead.filter((k) => defKeys.includes(k)),
      missingSurvivors: survivors.filter((k) => !defKeys.includes(k)) }));
  rmSync(cfgPath, { force: true }); // leave the temp dir without a config file
}

// === 9. WAVE 4 — bare-invocation POPUPS (/rag model | /rag effort | /rag subagent)
// Fail-first: written against the REQUIRED wave-4 behavior first — against the
// pre-wave code the export check fails (builders absent), the footer check
// fails ("NO /rag effort" denial), and the source-wiring checks fail (no
// effort dispatch, no select on the model bare branch).
{
  const need = ["buildModelSelectOptions", "parseModelPick", "buildEffortSelectOptions", "effortContext"];
  const missing = need.filter((n) => typeof dsub[n] !== "function");
  check("w4 exports: buildModelSelectOptions/parseModelPick/buildEffortSelectOptions/effortContext",
    missing.length === 0, missing.length ? `missing ${missing.join(", ")} (pre-wave)` : "all 4 present");
  if (missing.length) {
    check("w4 model select order (effective first + clear entry + sorted rest)", false, "pre-wave: builder missing");
    check("w4 effort select order (stored-first, supported-only)", false, "pre-wave: builder missing");
    check("w4 effortContext resolves the CHILD model (ragModel-aware)", false, "pre-wave: helper missing");
    check("w4 reasoningContext re-pointed at the child model", false, "pre-wave: helper missing");
  } else {
    // — A. /rag model option builder (dialog has NO preselect → current first). —
    check("w4 model: clear-entry label = the documented unique-marker string",
      dsub.MODEL_SELECT_CLEAR_ENTRY === "session — use the main-session model (clear ragModel)",
      JSON.stringify(dsub.MODEL_SELECT_CLEAR_ENTRY));
    const effOpts = dsub.buildModelSelectOptions("mirror/qwen-3.8-27b", REGISTRY);
    // CONTEXT-LENGTH feature: MODEL rows carry a trailing " (…k)" (mirrors the
    // ALAN connector); mirror/qwen-3.8-27b has NO contextWindow → entry 0 is
    // plain (also the omission pin). Sorted on the BARE ref, THEN suffixed.
    check("w4 model: [0]=effective+marker+[…k], [1]=clear (never suffixed), rest BARE-sorted then suffixed (no dup)",
      JSON.stringify(effOpts) === JSON.stringify([
        "mirror/qwen-3.8-27b — current (Enter keeps it)",
        "session — use the main-session model (clear ragModel)",
        "alan/gpt-oss-120b (127.5k)",
        "alan/qwen-3.8-27b (128k)",
        "anthropic/claude-sonnet-4-5 (132k)",
      ]), JSON.stringify(effOpts));
    const effOutside = dsub.buildModelSelectOptions("sess/current-model", REGISTRY);
    check("w4 model: effective NOT in registry → still first (no ctx → plain), then clear, then ALL refs sorted + suffixed",
      effOutside.length === 6 && effOutside[1] === dsub.MODEL_SELECT_CLEAR_ENTRY &&
      effOutside.slice(2).join(",") === "alan/gpt-oss-120b (127.5k),alan/qwen-3.8-27b (128k),anthropic/claude-sonnet-4-5 (132k),mirror/qwen-3.8-27b",
      JSON.stringify(effOutside));
    const dupOpts = dsub.buildModelSelectOptions("alan/qwen-3.8-27b",
      [...REGISTRY, { provider: "alan", id: "qwen-3.8-27b" }]);
    check("w4 model: duplicate registry refs deduped (case-insensitive)",
      dupOpts.filter((o) => o.toLowerCase().startsWith("alan/qwen-3.8-27b")).length === 1,
      JSON.stringify(dupOpts));

    // — the returned STRING → action (ctx.ui.select answers with the label). —
    check("w4 model pick: clear entry → {kind:'clear'} (ragModel → \"\")",
      JSON.stringify(dsub.parseModelPick(dsub.MODEL_SELECT_CLEAR_ENTRY)) === JSON.stringify({ kind: "clear" }),
      JSON.stringify(dsub.parseModelPick(dsub.MODEL_SELECT_CLEAR_ENTRY)));
    const curPick = dsub.parseModelPick("mirror/qwen-3.8-27b — current (Enter keeps it)");
    check("w4 model pick: annotated current entry → bare provider/id (fed to matchModelReference)",
      curPick.kind === "ref" && curPick.ref === "mirror/qwen-3.8-27b", JSON.stringify(curPick));
    const plainPick = dsub.parseModelPick("anthropic/claude-sonnet-4-5");
    check("w4 model pick: plain registry ref passes through untouched",
      plainPick.kind === "ref" && plainPick.ref === "anthropic/claude-sonnet-4-5", JSON.stringify(plainPick));

    // — B. /rag effort option builder: ONLY supported levels, stored first IF supported. —
    const LV = ["off", "minimal", "low", "medium", "high", "xhigh", "max"];
    check("w4 effort: stored IN supported → [0]=stored, rest natural (off next)",
      JSON.stringify(dsub.buildEffortSelectOptions(LV, "medium")) ===
        JSON.stringify(["medium", "off", "minimal", "low", "high", "xhigh", "max"]),
      JSON.stringify(dsub.buildEffortSelectOptions(LV, "medium")));
    check("w4 effort: stored match case-insensitive (HIGH → first, label unchanged)",
      dsub.buildEffortSelectOptions(LV, "HIGH")[0] === "high",
      JSON.stringify(dsub.buildEffortSelectOptions(LV, "HIGH")));
    check("w4 effort: stored NOT in supported → natural order untouched (off first)",
      JSON.stringify(dsub.buildEffortSelectOptions(LV, "bogus")) === JSON.stringify(LV),
      JSON.stringify(dsub.buildEffortSelectOptions(LV, "bogus")));
    check("w4 effort: off-only (non-reasoning) model → exactly ['off'], never an empty list",
      JSON.stringify(dsub.buildEffortSelectOptions(["off"], "high")) === JSON.stringify(["off"]));

    // — effortContext: THE CHILD model's levels (ragModel > session > D_MODEL).
    // Duck-typed fakes: pi-ai getSupportedThinkingLevels (dist/models.js) reads
    // ONLY model.reasoning + model.thinkingLevelMap → these fields (+ ids) are
    // a faithful Model stand-in; probed once, documented here (never skipped).
    const fakeReasoning = { provider: "mirror", id: "qwen-3.8-27b", reasoning: true,
      thinkingLevelMap: { xhigh: "xhigh", max: "max" } };
    const fakeSession = { provider: "sess", id: "current-model", reasoning: false };
    const fakeCtx = {
      model: fakeSession,
      modelRegistry: { getAvailable: () => REGISTRY,
        find: (p, i) => `${p}/${i}` === "mirror/qwen-3.8-27b" ? fakeReasoning : undefined },
    };
    const child = dsub.effortContext(fakeCtx, "mirror/qwen-3.8-27b");
    check("w4 effortContext: ragModel set → CHILD model's levels (7 incl. xhigh/max, off first)",
      child.modelId === "mirror/qwen-3.8-27b" && child.supported.length === 7 &&
      child.supported[0] === "off" && child.supported.includes("xhigh") && child.supported.includes("max"),
      JSON.stringify(child));
    const sess = dsub.effortContext(fakeCtx, "");
    check("w4 effortContext: no ragModel → session model (find miss → ctx.model fallback)",
      sess.modelId === "sess/current-model" && JSON.stringify(sess.supported) === JSON.stringify(["off"]),
      JSON.stringify(sess));
    const ghost = dsub.effortContext(fakeCtx, "ghost/removed");
    check("w4 effortContext: invalid stored ragModel → session fallback + sourceNote naming it",
      ghost.modelId === "sess/current-model" && ghost.supported.length === 1 &&
      typeof ghost.sourceNote === "string" && ghost.sourceNote.includes("ghost/removed"),
      JSON.stringify(ghost));
    const orphan = dsub.effortContext(
      { model: undefined, modelRegistry: { getAvailable: () => [], find: () => undefined } }, "");
    check("w4 effortContext: no ctx.model + empty registry → D_MODEL + supported [] + sourceNote (handler ERRORs, no empty popup)",
      orphan.modelId === D_MODEL && orphan.supported.length === 0 && typeof orphan.sourceNote === "string",
      JSON.stringify(orphan));

    // THE task-B correctness fix: reasoningContext must follow the CHILD model
    // (the D child runs the ragModel override — pre-wave it read ctx.model only).
    const rcChild = dsub.reasoningContext(fakeCtx, "mirror/qwen-3.8-27b");
    check("w4 reasoningContext re-pointed: ragModel changes modelId + levels (pre-wave bug)",
      rcChild.modelId === "mirror/qwen-3.8-27b" && rcChild.supported.length === 7 &&
      rcChild.supported.includes("xhigh"), JSON.stringify(rcChild));
    const rcSession = dsub.reasoningContext(fakeCtx, "");
    check("w4 reasoningContext: no ragModel → session model (old graceful behavior kept)",
      rcSession.modelId === "sess/current-model" && JSON.stringify(rcSession.supported) === JSON.stringify(["off"]),
      JSON.stringify(rcSession));
  }

  // — source wiring (index.ts is NOT headlessly importable — source scan). —
  const src = readFileSync(new URL("../../index.ts", import.meta.url), "utf-8");
  const iReasoning = src.indexOf('if (cmd === "reasoning")');
  const iEffort = src.indexOf('if (cmd === "effort")');
  const iModel = src.indexOf('if (cmd === "model")');
  const iSubagent = src.indexOf('if (cmd === "subagent")');
  const iRebuild = src.indexOf('if (cmd === "rebuild")');
  const iUnknown = src.indexOf('unknown /rag subcommand');

  check("w4 wiring: RAG_SUBCOMMANDS carries the effort entry",
    src.includes('value: "effort"') && src.includes('label: "effort"'),
    `value-entry=${src.includes('value: "effort"')}`);
  // OFFERED-LIST ORDER (user request): `/rag subagent` must be FIRST in all
  // three offered surfaces — completion array, command description, help rows.
  // Fail-first verified against `git show HEAD:index.ts` (pre-reorder):
  // sub=28218 > idx=26804 → array assertion FALSE on the old source.
  // pi passes getArgumentCompletions results through in ARRAY order
  // (chunk-6MWTY2OB: `{items: argumentSuggestions}` — no re-sort), so the
  // array position IS the popup position.
  const arr0 = src.indexOf("RAG_SUBCOMMANDS: {");
  const arrSub = src.indexOf('{ value: "subagent"', arr0);
  const arrIdx = src.indexOf('{ value: "index"', arr0);
  const help0 = src.indexOf("const cmds: [string, string][]");
  const helpSub = src.indexOf('["/rag subagent [name]"', help0);
  const helpIdx = src.indexOf('["/rag index <path>"', help0);
  check("order wiring: /rag subagent is FIRST in completion array + help rows + leads the description",
    arr0 > 0 && arrSub > arr0 && arrSub < arrIdx
      && help0 > 0 && helpSub > help0 && helpSub < helpIdx
      && src.includes("pi-local-rag: /rag subagent|effort|model"),
    `arr sub=${arrSub} idx=${arrIdx} | help sub=${helpSub} idx=${helpIdx} | arrays+help+desc`);
  // REMOVAL round: the `reasoning` branch must be GONE (iReasoning === -1);
  // `effort` is the ONLY level command and stays BEFORE the unknown fall-through.
  check("w4 wiring: /rag reasoning branch REMOVED + /rag effort dispatched BEFORE the unknown-subcommand fall-through",
    iReasoning === -1 && iEffort > 0 && iEffort < iModel && iEffort < iUnknown,
    `reasoning=${iReasoning} effort=${iEffort} model=${iModel} unknown=${iUnknown}`);
  const effortW4Block = iEffort > 0 && iModel > iEffort ? src.slice(iEffort, iModel) : "";
  check("w4 wiring: /rag effort passes the CHILD ragModel into effortContext (task-B fix, via the effort command)",
    effortW4Block.includes("effortContext(ctx, cfg.ragModel"), "index.ts source");

  const modelBlock = iModel > 0 && iSubagent > iModel ? src.slice(iModel, iSubagent) : "";
  const bareAt = modelBlock.indexOf("if (!parts[1])");
  const guardAt = modelBlock.indexOf("registryUnavailable(ctx)");
  const selectAt = modelBlock.indexOf("await ctx.ui.select(");
  const argAt = modelBlock.indexOf("resolveModelAssignment(parts[1]");
  check("w4 wiring: /rag model bare → registry guard → ctx.ui.select BEFORE the with-arg reducer",
    bareAt > -1 && guardAt > -1 && guardAt < selectAt && bareAt < selectAt && selectAt < argAt,
    `bare@${bareAt} guard@${guardAt} select@${selectAt} arg@${argAt}`);
  const freshAt = modelBlock.indexOf("const fresh = loadConfig();");
  // WAVE-4 critic round: the try/catch bodies route through the ONE
  // factored notifyNotPersisted helper (NIT 2) — the raw template must no
  // longer be spelled out inside the handler blocks.
  check("w4 wiring: /rag model re-reads config AFTER the select (lost-update rule) + NOT-persisted helper call",
    selectAt > -1 && freshAt > selectAt && modelBlock.includes("notifyNotPersisted("),
    `select@${selectAt} fresh@${freshAt}`);

  const subBlock = iSubagent > 0 ? src.slice(iSubagent, iRebuild > iSubagent ? iRebuild : iUnknown) : "";
  const subBare = subBlock.indexOf("if (!parts[1])");
  const subSelect = subBlock.indexOf("await ctx.ui.select(");
  check("w4 wiring: /rag subagent STILL pops ctx.ui.select on bare invocation (behavior unchanged)",
    subBare > -1 && subBare < subSelect, `bare@${subBare} select@${subSelect}`);

  const effortBlock = iEffort > 0 && iModel > iEffort ? src.slice(iEffort, iModel) : "";
  const effSelectAt = effortBlock.indexOf("await ctx.ui.select(");
  const effFreshAt = effortBlock.indexOf("const fresh = loadConfig();");
  check("w4 wiring: effort handler = effortContext + bare select + NO empty popup + fresh re-read after select",
    effortBlock.includes("effortContext(ctx") && effortBlock.includes("if (!parts[1])") &&
    effSelectAt > -1 && effSelectAt < effFreshAt && effortBlock.includes("notifyNotPersisted(") &&
    effortBlock.includes('[rag] /rag effort: no thinking levels'),
    `effortBlock=${effortBlock.length}ch select@${effSelectAt} fresh@${effFreshAt}`);

  check("w4 wiring: /rag effort value completions are DYNAMIC (effortContext) — 'reasoning ' branch REMOVED",
    src.includes('prefix.startsWith("effort ")') && !src.includes('startsWith("reasoning ")') &&
    src.includes("effortContext(completionCtx"), "index.ts source");
  check("w4 wiring: /rag help carries the /rag effort row — '/rag reasoning [level]' row REMOVED",
    src.includes('["/rag effort') && !src.includes('["/rag reasoning') && !src.includes("effort lives here"),
    "index.ts source");
  check("w4 wiring: help renders RAG_HELP_EFFORT_FOOTER",
    src.includes("RAG_HELP_EFFORT_FOOTER"), "index.ts source");
}

// === 10. WAVE-4 CRITIC FIX ROUND — 1 BLOCKER + 2 MINOR + 3 NIT (fail-first) =
// Written against the PRE-FIX code first: the pure helpers do not exist yet
// (typeof-guarded → undefined, so each behavior check FAILS instead of the
// ESM import crashing), the index.ts source-ordering checks fail on their -1
// indexes, and the unfolded save-failure template is counted at its 7 old
// sites (required: ≤ 1 = ONE factored helper).
{
  const src = readFileSync(new URL("../../index.ts", import.meta.url), "utf-8");
  const dsubSrc = readFileSync(new URL("../../subprocessD.ts", import.meta.url), "utf-8");
  const iModel = src.indexOf('if (cmd === "model")');
  const iSubagent = src.indexOf('if (cmd === "subagent")');
  const iEffort = src.indexOf('if (cmd === "effort")');
  const modelBlock = iModel > -1 && iSubagent > iModel ? src.slice(iModel, iSubagent) : "";
  const effortBlock = iEffort > -1 && iModel > iEffort ? src.slice(iEffort, iModel) : "";
  const pin = (...args) => (typeof dsub.shouldPinModelPick === "function"
    ? dsub.shouldPinModelPick(...args) : undefined);
  const title = (...args) => (typeof dsub.buildEffortSelectTitle === "function"
    ? dsub.buildEffortSelectTitle(...args) : undefined);
  const noMatch = (...args) => (typeof dsub.noModelMatchLine === "function"
    ? dsub.noModelMatchLine(...args) : "");

  // ── BLOCKER — bare pick of entry 0 (effective model) with NO stored
  // assignment: old guard compared was="(none)" vs ref → fell through to a
  // REAL write, silently pinning the session model as a ragModel. ──
  check("blk: shouldPinModelPick(stored, pickedRef, effectiveRef) exported as a pure guard",
    typeof dsub.shouldPinModelPick === "function",
    typeof dsub.shouldPinModelPick === "function" ? "present (pure)" : "pre-fix: helper absent");
  check("blk: NO stored + pick == effective (case-insens.) → PIN (no config write)",
    pin("", "alan/qwen-3.8-27b", "ALAN/QWEN-3.8-27B") === true, "expected true");
  check("blk: undefined / whitespace-only stored coerces to (none) → PIN",
    pin(undefined, "alan/qwen-3.8-27b", "alan/qwen-3.8-27b") === true &&
    pin("   ", "alan/qwen-3.8-27b", "alan/qwen-3.8-27b") === true, "expected true,true");
  check("blk: a STORED assignment never pins (equal → unchanged / differ → write, as before)",
    pin("alan/gpt-oss-120b", "alan/gpt-oss-120b", "alan/gpt-oss-120b") === false &&
    pin("alan/gpt-oss-120b", "alan/qwen-3.8-27b", "alan/gpt-oss-120b") === false,
    "expected false,false");
  check("blk: NO stored + pick != effective → real write allowed (genuine assignment)",
    pin("", "alan/gpt-oss-120b", "alan/qwen-3.8-27b") === false, "expected false");
  const freshAt = modelBlock.indexOf("const fresh = loadConfig();");
  const pinAt = modelBlock.indexOf("shouldPinModelPick(");
  const writeAt = modelBlock.indexOf("fresh.ragModel = ref;");
  check("blk wiring: pin guard AFTER the post-select re-read and BEFORE the ragModel write",
    freshAt > -1 && pinAt > freshAt && writeAt > -1 && pinAt < writeAt,
    `fresh@${freshAt} pin@${pinAt} write@${writeAt}`);
  const pinMsgAt = modelBlock.indexOf("rag model unchanged: no assignment (session model applies)");
  check("blk wiring: pin notify = 'rag model unchanged: no assignment (session model applies)' + return before the write",
    pinAt > -1 && pinMsgAt > pinAt && pinMsgAt < writeAt &&
    modelBlock.slice(pinMsgAt, writeAt).includes("return;"),
    `pin@${pinAt} msg@${pinMsgAt} write@${writeAt}`);

  // ── MINOR 1 — the effort select title must only promise "Enter keeps it"
  // when the STORED level was hoisted to entry 0 (i.e. IS offered). ──
  check("minor1 title: stored IN supported → '(current: <lvl> — Enter keeps it)'",
    title("mirror/qwen-3.8-27b", "high", ["off", "low", "high"]) ===
      "RAG effort — mirror/qwen-3.8-27b (current: high — Enter keeps it)",
    String(title("mirror/qwen-3.8-27b", "high", ["off", "low", "high"])));
  check("minor1 title: stored NOT in supported → truthful 'not offered by this model' suffix",
    title("mirror/qwen-3.8-27b", "high", ["off", "low"]) ===
      "RAG effort — mirror/qwen-3.8-27b (current: high — not offered by this model)",
    String(title("mirror/qwen-3.8-27b", "high", ["off", "low"])));
  check("minor1 title: stored match is case-insensitive (HIGH offered by the model)",
    title("m/x", "HIGH", ["off", "high"]) ===
      "RAG effort — m/x (current: HIGH — Enter keeps it)",
    String(title("m/x", "HIGH", ["off", "high"])));
  check("minor1 wiring: effort select calls buildEffortSelectTitle — old always-true suffix GONE",
    effortBlock.includes("buildEffortSelectTitle(effort.modelId, stored, effort.supported)") &&
    !effortBlock.includes("current: ${stored} — Enter keeps it"), "index.ts source");

  // ── MINOR 2 (blocker partner) — the bare-pick no-match error line comes
  // from the ONE shared builder (the reducer's exact strings stay pinned). ──
  const reducerErr = resolveModelAssignment("totally-unknown-model", REGISTRY, {
    effective: "sess/current-model", source: "session model",
  });
  check("nit2b: noModelMatchLine output === the resolveModelAssignment no-match line (strings stored ONCE)",
    typeof dsub.noModelMatchLine === "function" && reducerErr.kind === "error" &&
    noMatch("totally-unknown-model", REGISTRY) === reducerErr.line &&
    reducerErr.line.startsWith('no model matches "totally-unknown-model" — close candidates: ') &&
    reducerErr.line.endsWith(" (use /rag model provider/id; /rag model session clears)"),
    noMatch("totally-unknown-model", REGISTRY) || "pre-fix: builder absent");
  check("nit2b wiring: /rag model bare pick notifies via noModelMatchLine (no duplicated literal)",
    modelBlock.includes("noModelMatchLine(picked.ref, refsNow)"), "index.ts source");

  // ── NIT 1 — the unknown-subcommand comment must show a GENUINELY unknown
  // sample; '/rag effort high' is live now (stale 'banned' phrasing gone). ──
  check("nit1: unknown-sub guard comment uses '/rag nonsense' — no stale 'banned' phrasing left",
    src.includes("`/rag nonsense`") &&
    !src.slice(src.indexOf("Unknown subcommand must NOT silently render"), src.indexOf("unknown /rag subcommand"))
      .includes("banned") &&
    !src.includes("/rag effort high` — a banned command") &&
    !/banned/i.test(dsubSrc), "index.ts/subprocessD.ts source");

  // ── NIT 2 — the save-failure notice is ONE factored helper: the raw
  // `NOT persisted — ` template must occur ≤ 1 time in index.ts. ──
  const templateHits = src.split("NOT persisted — ").length - 1;
  check("nit2: NOT-persisted template occurs ≤ 1× (factored notifyNotPersisted helper)",
    templateHits <= 1, `occurrences=${templateHits}`);
  const helperDefs = src.split("const notifyNotPersisted = ").length - 1;
  const helperCalls = src.split("notifyNotPersisted(").length - 1;
  // ≥6 (was ≥7): the reasoning handler's save-failure site went away WITH the
  // removed `/rag reasoning` command — effort ×1 + model ×3 + subagent ×2
  // remain, each wrapping its saveConfig in try/catch.
  check("nit2: notifyNotPersisted defined ONCE + used at every save-failure site (≥6)",
    helperDefs === 1 && helperCalls >= 6, `defs=${helperDefs} calls=${helperCalls}`);

  // ── NIT 3 — an effort pick equal to the STORED level must not write. ──
  const effortUnchangedAt = effortBlock.indexOf("rag effort unchanged:");
  const effortWriteAt = effortBlock.indexOf("fresh.ragThinkingLevel = outcome.level;");
  check("nit3: effort pick == stored notify 'rag effort unchanged: <level>' BEFORE the write + return",
    effortUnchangedAt > -1 && effortWriteAt > -1 && effortUnchangedAt < effortWriteAt &&
    effortBlock.slice(effortUnchangedAt, effortWriteAt).includes("return;"),
    `unchanged@${effortUnchangedAt} write@${effortWriteAt}`);
  check("nit3 wiring: no saveConfig runs on the unchanged effort pick (guard closes the write path)",
    effortUnchangedAt > -1 && effortBlock.indexOf("saveConfig(fresh)") > effortUnchangedAt &&
    effortBlock.slice(effortUnchangedAt, effortBlock.indexOf("saveConfig(fresh)")).includes("return;"),
    `save@${effortBlock.indexOf("saveConfig(fresh)")}`);
}

// === 11. CONTEXT-LENGTH ` (…k)` suffix in /rag model picker rows (fail-first)
// Format = BYTE-FOR-BYTE the ALAN connector tool (ALAN_connector/index.ts:
// 119-121): round to ONE decimal FIRST, then whole-number check. Every
// expected string below is DERIVED from that formula, never guessed:
//   131072/1024 = 128 exactly             → integer        → "(128k)"
//   135168/1024 = 132 exactly             → integer        → "(132k)"
//   130000/1024 = 126.953125 →×10=1269.53… → round 1270 /10 = 127 → "(127k)"
//   130500/1024 = 127.44140625 →×10=1274.41… → round 1274 /10 = 127.4 (NOT
//     an integer)                                → "(127.4k)"
//   130560/1024 = 127.5 exactly → round 1275 /10 = 127.5 (NOT an integer)
//                                                 → "(127.5k)"
{
  const ckt = typeof dsub.contextKText === "function" ? dsub.contextKText : () => "PRE-FEATURE";
  check("ctx: contextKText exported (pure function)",
    typeof dsub.contextKText === "function", typeof dsub.contextKText);
  check("ctx: 131072 → (128k) (classic pi window, /1024 exact)",
    ckt(131072) === "(128k)", ckt(131072));
  check("ctx: 135168 → (132k) (/1024 exact)", ckt(135168) === "(132k)", ckt(135168));
  check("ctx: 130000 → (127k) (ALAN's verified example — rounds blindly to 127)",
    ckt(130000) === "(127k)", ckt(130000));
  check("ctx: 130500 → (127.4k) (127.44… → ONE decimal 127.4, not an integer)",
    ckt(130500) === "(127.4k)", ckt(130500));
  check("ctx: 130560 → (127.5k) (the one-decimal case: 127.5 exactly)",
    ckt(130560) === "(127.5k)", ckt(130560));

  // — builder: suffix on MODEL rows only; ordering is BARE-ref, then suffixed. —
  const ctxRows = dsub.buildModelSelectOptions("alan/qwen-3.8-27b", REGISTRY);
  check("ctx picker: exact rows — current row suffixed, clear entry NEVER suffixed, missing ctx → plain row",
    JSON.stringify(ctxRows) === JSON.stringify([
      "alan/qwen-3.8-27b (128k) — current (Enter keeps it)",
      "session — use the main-session model (clear ragModel)",
      "alan/gpt-oss-120b (127.5k)",
      "anthropic/claude-sonnet-4-5 (132k)",
      "mirror/qwen-3.8-27b", // no contextWindow → plain (no empty parens, no null)
    ]), JSON.stringify(ctxRows));
  const noCtx = dsub.buildModelSelectOptions("x/y", [
    { provider: "p", id: "m", contextWindow: 0 }, // non-positive → caller omits the suffix
    { provider: "q", id: "n" },                     // absent → plain
  ]);
  check("ctx picker: contextWindow 0 / absent → plain rows at the BUILDER level (no '()' tails, no 'null')",
    JSON.stringify(noCtx) === JSON.stringify([
      "x/y — current (Enter keeps it)",
      "session — use the main-session model (clear ragModel)",
      "p/m",
      "q/n",
    ]), JSON.stringify(noCtx));
  check("ctx picker: clear entry carries NO (…k) context tag (it is not a model)",
    ctxRows[1] === dsub.MODEL_SELECT_CLEAR_ENTRY &&
    !/\s\(\d+(?:\.\d+)?k\)/.test(ctxRows[1]), JSON.stringify(ctxRows[1]));

  // — round-trips: parseModelPick must hand wave-4 validation the CLEAN ref. —
  const bareCtx = dsub.parseModelPick("alan/qwen-3.8-27b (128k)");
  check("ctx pick: 'provider/id (128k)' → clean ref",
    bareCtx.kind === "ref" && bareCtx.ref === "alan/qwen-3.8-27b", JSON.stringify(bareCtx));
  const curCtx = dsub.parseModelPick("alan/qwen-3.8-27b (128k) — current (Enter keeps it)");
  check("ctx pick: current marker + context suffix → clean ref (marker checked FIRST, suffix stripped)",
    curCtx.kind === "ref" && curCtx.ref === "alan/qwen-3.8-27b", JSON.stringify(curCtx));
  check("ctx pick: clear entry (a marker containing parens) → {kind:'clear'} still",
    JSON.stringify(dsub.parseModelPick(ctxRows[1])) === JSON.stringify({ kind: "clear" }),
    JSON.stringify(dsub.parseModelPick(ctxRows[1])));
  const noParens = dsub.parseModelPick("anthropic/claude-sonnet-4-5");
  check("ctx pick: label WITHOUT parentheses byte-identical (back-compat)",
    JSON.stringify(noParens) === JSON.stringify({ kind: "ref", ref: "anthropic/claude-sonnet-4-5" }),
    JSON.stringify(noParens));

  // — completions UNCHANGED: `value` stays `model provider/id`, never suffixed. —
  const ctxItems = buildModelCompletionItems("", REGISTRY);
  check("ctx completions: value NEVER carries a (…k) tag (still exactly 'model provider/id')",
    Array.isArray(ctxItems) &&
    ctxItems.every((it) => !/\(\d/.test(it.value)) &&
    ctxItems.some((it) => it.value === "model alan/qwen-3.8-27b"),
    JSON.stringify(Array.isArray(ctxItems) ? ctxItems.map((it) => it.value) : ctxItems));

  // — wiring: the handler revalidates the PARSED (stripped) ref; the BLOCKER
  //   unchanged-guard receives it too (no handler change needed for the suffix). —
  const ctxSrc = readFileSync(new URL("../../index.ts", import.meta.url), "utf-8");
  const ctxIM = ctxSrc.indexOf('if (cmd === "model")');
  const ctxIS = ctxSrc.indexOf('if (cmd === "subagent")');
  const ctxBlock = ctxIM > 0 && ctxIS > ctxIM ? ctxSrc.slice(ctxIM, ctxIS) : "";
  check("ctx wiring: handler revalidates the PARSED (stripped) ref — matchModelReference(picked.ref, …)",
    ctxBlock.includes("matchModelReference(picked.ref, refsNow)") &&
    ctxBlock.includes("noModelMatchLine(picked.ref, refsNow)"), "index.ts source");
  check("ctx wiring: BLOCKER unchanged-guard gets the stripped ref — shouldPinModelPick(fresh.ragModel, ref, effectiveNow)",
    ctxBlock.includes("shouldPinModelPick(fresh.ragModel, ref, effectiveNow)"), "index.ts source");
}

// === 12. RAG FOOTER status — injection-outcome summary moved OUT of the
// prompt zone (raw `process.stderr.write` lines) INTO the pi harness FOOTER
// via ctx.ui.setStatus(RAG_STATUS_KEY, …) (user decision). Fail-first: every
// pin below was written against the REQUIRED behavior BEFORE ragFooter.ts /
// the index.ts call sites existed. =========================================
{
  const rf = ragFooter ?? {};
  const { RAG_STATUS_KEY, RAG_STATUS_MAX } = rf;
  const b = typeof rf.buildRagStatusText === "function" ? rf.buildRagStatusText : null;
  const build = (input) => {
    if (!b) return "PRE-FEATURE: ragFooter.ts absent";
    try { return b(input); } catch (e) { return `THREW: ${e instanceof Error ? e.message : String(e)}`; }
  };

  check("footer: ragFooter.ts exports RAG_STATUS_KEY=\"rag\" + RAG_STATUS_MAX=72 + buildRagStatusText",
    RAG_STATUS_KEY === "rag" && RAG_STATUS_MAX === 72 && typeof b === "function",
    b ? `key=${RAG_STATUS_KEY} max=${RAG_STATUS_MAX}` : "absent — read ../../ragFooter.ts");

  // ── exact strings for all 4 kinds (THE format spec) ──
  const inj = build({ kind: "injected", label: "D", ms: 723, tokensIn: 1500, tokensOut: 200 });
  check("footer kind injected: exact string",
    inj === "RAG D 723ms 1500↑/200↓", JSON.stringify(inj));
  const noth = build({ kind: "nothing", label: "Okf", ms: 1200, why: "timeout after 30000 ms" });
  check("footer kind nothing: exact string (why carried verbatim)",
    noth === "RAG Okf 1200ms none — timeout after 30000 ms", JSON.stringify(noth));
  const fail = build({ kind: "failed", label: "D", message: "exec refused" });
  check("footer kind failed: exact string",
    fail === "RAG D FAILED — exec refused", JSON.stringify(fail));
  const inact = build({ kind: "inactive", reason: "okf-only profile inactive" });
  check("footer kind inactive: exact string",
    inact === "RAG — okf-only profile inactive", JSON.stringify(inact));

  // ── control-char defense — footer contract = single line (pi-tps-live
  //    also sanitizes, but the BUILDER must never emit CR/LF itself) ──
  const ctrl = build({ kind: "nothing", label: "D", ms: 10, why: "a\nb\rc" });
  check("footer control chars: why \"a\\nb\\rc\" → spaces, NO CR/LF/control in output",
    ctrl === "RAG D 10ms none — a b c" && !/[\u0000-\u001f\u007f]/.test(ctrl), JSON.stringify(ctrl));

  // ── timeout-safe truncation: overlong message → EXACTLY RAG_STATUS_MAX ──
  const long = build({ kind: "failed", label: "D", message: "x".repeat(500) });
  check("footer truncation: 500-char message → length === RAG_STATUS_MAX with … tail",
    long.length === RAG_STATUS_MAX && long.endsWith("…"),
    `len=${long.length} (want ${RAG_STATUS_MAX}) tail=${JSON.stringify(long.slice(-3))}`);

  // ── non-finite numbers → "?" fallback (CHOSEN behavior — never NaN/Infinity text) ──
  const nf = build({ kind: "injected", label: "D", ms: NaN, tokensIn: NaN, tokensOut: Infinity });
  check("footer non-finite: NaN/Infinity → \"?\" fallback (no literal NaN/Infinity in output)",
    nf === "RAG D ?ms ?↑/?↓" && !/NaN|Infinity/.test(nf), JSON.stringify(nf));
  const nf2 = build({ kind: "nothing", label: "D", ms: NaN, why: "run not ok" });
  check("footer non-finite: nothing-kind ms NaN → ?ms (no NaN text)",
    nf2 === "RAG D ?ms none — run not ok" && !nf2.includes("NaN"), JSON.stringify(nf2));

  // ── malformed input — never throws, footer-safe string ──
  for (const bad of [null, undefined, "x", 42, {}, { kind: "bogus", reason: "z" }]) {
    const out = build(bad);
    check(`footer malformed (${JSON.stringify(bad) ?? "undefined"}) → never throws, footer-safe string`,
      typeof out === "string" && out.length > 0 && !/[\u0000-\u001f\u007f]/.test(out),
      typeof out === "string" ? JSON.stringify(out) : typeof out);
  }
  check("footer malformed: null and {} fall back to the \"RAG\" sentinel",
    build(null) === "RAG" && build({}) === "RAG",
    `${JSON.stringify(build(null))} / ${JSON.stringify(build({}))}`);

  // ── SOURCE PINS: rename-safe — the summary lives in ctx.ui.setStatus, the
  //    four prompt-zone `[rag] subagent …` stderr writes are GONE (the `why`
  //    computation strings like "empty payload (nothing to inject)" STAY:
  //    they are arguments, not writes). ──
  const fSrc = readFileSync(new URL("../../index.ts", import.meta.url), "utf-8");
  const callPrefix = "setStatusSafe(buildRagStatusText(";
  const callCount = fSrc.split(callPrefix).length - 1;
  check("footer wiring: index.ts has ≥ 5 setStatusSafe(buildRagStatusText( outcome sites (fix6 wrap)",
    callCount >= 5, `occurrences=${callCount} (read ../../index.ts)`);

  const legacyWrites = fSrc.split("\\r\\x1b[2K[rag] subagent").length - 1;
  check("footer wiring: ZERO legacy `\\r\\x1b[2K[rag] subagent` prompt-zone writes in index.ts",
    legacyWrites === 0, `occurrences=${legacyWrites} (read ../../index.ts)`);

  const legacyMarkers = [
    "[rag] subagent ${runLabel} injected —",
    "[rag] subagent ${runLabel} injected nothing",
    "[rag] subagent ${runLabel} FAILED",
    "[rag] okf-only profile inactive",
  ];
  for (const m of legacyMarkers) {
    check(`footer wiring: legacy write string GONE from index.ts: ${m}`,
      !fSrc.includes(m), "STILL PRESENT (read ../../index.ts)");
  }
  check("footer wiring: why-args KEPT (empty payload / run not ok / timeout — arguments, not writes)",
    fSrc.includes("empty payload (nothing to inject)") &&
    fSrc.includes("run not ok") &&
    fSrc.includes("timeout after ${config.ragSubagentHookTimeoutMs} ms"),
    "index.ts source");
  check("footer wiring: index.ts imports RAG_STATUS_KEY + buildRagStatusText from ./ragFooter.ts",
    fSrc.includes('from "./ragFooter.ts"'), "index.ts source");

  // ═══ FIX ROUND (critic findings 1–6) — fail-first pins written BEFORE the
  // source changes they guard; each is RED against the pre-fix index.ts /
  // ragFooter.ts. ═════════════════════════════════════════════════════════

  // finding 1 — the DEFAULT profile (ragSubagentHookBlocking=false, non-Okf;
  // the Okf profile takes its own dormant edge above) must reach a footer
  // write BEFORE the blocking gate, and must NOT abort the hook: control
  // continues to the stale-index detection (only staleness runs, gate skipped).
  const gateOffReason = 'reason: "auto-injection gate off (ragSubagentHookBlocking=false) — nothing injected"';
  const okfReasonAt = fSrc.indexOf('reason: "okf-only profile inactive (ragSubagentHookBlocking=false)');
  const gateOffAt = fSrc.indexOf(gateOffReason);
  const gateOnAt = fSrc.indexOf("if (config.ragSubagentHookBlocking === true");
  check("fix1: non-Okf GATE-OFF outcome written to the footer BEFORE the blocking gate (default config never footer-silent)",
    okfReasonAt !== -1 && gateOffAt !== -1 && okfReasonAt < gateOffAt && gateOffAt < gateOnAt,
    `okfReason@${okfReasonAt} gateOff@${gateOffAt} gate@${gateOnAt} (read ../../index.ts)`);
  const gateOffBranchAt = fSrc.indexOf("if (config.ragSubagentHookBlocking !== true) {");
  const between = gateOffBranchAt !== -1 && gateOnAt > gateOffBranchAt ? fSrc.slice(gateOffBranchAt, gateOnAt) : "";
  check("fix1: gate-off branch sets the status but does NOT bail — flow continues to stale-index detection",
    between.length > 0 && !between.includes("return"),
    `branchLen=${between.length} hasReturn=${between.includes("return")} (read ../../index.ts)`);

  // findings 2 + 3 — ragEnabled=false: the footer line ALWAYS; the stderr
  // `rag hook: injection disabled (ragEnabled=false)` write is PRINT-MODE ONLY
  // (stderr = non-TUI fallback). Both source-pinned so the disabled branch can
  // never be silently refactored away or its stderr write made unguarded.
  const disAt = fSrc.indexOf("if (!config.ragEnabled) {");
  const disEnd = disAt === -1 ? -1 : fSrc.indexOf("return;", disAt);
  const disBlock = disAt !== -1 && disEnd > disAt ? fSrc.slice(disAt, disEnd) : "";
  check("fix2+3: ragEnabled=false → footer line ALWAYS + stderr 'rag hook: injection disabled (ragEnabled=false)' ONLY under ctx.mode === \"print\"",
    disBlock.length > 0 &&
      (disBlock.includes('ctx.ui.setStatus(RAG_STATUS_KEY, "RAG — auto-injection off")') ||
        disBlock.includes('setStatusSafe("RAG — auto-injection off")')) &&
      disBlock.includes('if (ctx.mode === "print")') &&
      disBlock.includes("rag hook: injection disabled (ragEnabled=false)"),
    `blockLen=${disBlock.length} printGated=${disBlock.includes('if (ctx.mode === "print")')} (read ../../index.ts)`);

  // finding 4 — status-key collision: "rag" is RESERVED for injection
  // outcomes; index/build/refresh progress (EVERY write AND its matching
  // clear, incl. the bg-refresh finally) lives under RAG_BUILD_STATUS_KEY =
  // "rag-build"; both keys render in the footer, so progress stays visible
  // while the turn's outcome survives a /rag index|rebuild|refresh.
  check("fix4: ragFooter.ts exports RAG_BUILD_STATUS_KEY=\"rag-build\" (second footer slot for progress)",
    rf.RAG_BUILD_STATUS_KEY === "rag-build", `got=${rf.RAG_BUILD_STATUS_KEY} (read ../../ragFooter.ts)`);
  const litStatusRag = fSrc.split('Status("rag"').length - 1;
  check("fix4: ZERO setStatus/safeStatus writes or clears on the reserved literal \"rag\" key (progress cannot wipe the outcome)",
    litStatusRag === 0, `occurrences=${litStatusRag} (read ../../index.ts)`);
  const buildKeySites = fSrc.split("Status(RAG_BUILD_STATUS_KEY,").length - 1;
  check("fix4: ALL progress writes+clears on RAG_BUILD_STATUS_KEY (≥ 19 sites incl. bg-refresh finally clear)",
    buildKeySites >= 19 && fSrc.includes("safeStatus(RAG_BUILD_STATUS_KEY, undefined)"),
    `sites=${buildKeySites} bgFinallyClear=${fSrc.includes("safeStatus(RAG_BUILD_STATUS_KEY, undefined)")} (read ../../index.ts)`);
  check("fix4: index.ts imports RAG_BUILD_STATUS_KEY next to RAG_STATUS_KEY from ./ragFooter.ts",
    fSrc.includes("RAG_STATUS_KEY, RAG_BUILD_STATUS_KEY, buildRagStatusText"), "index.ts source");

  // finding 6 — ONE guarded footer writer for the hook outcomes: exactly one
  // direct setStatus(RAG_STATUS_KEY, …) call site in the whole file (the
  // helper body); every outcome call routes through setStatusSafe.
  const helperDecl = "const setStatusSafe = (text: string | undefined): void => { try { ctx.ui.setStatus(RAG_STATUS_KEY, text); } catch { /* footer must never break a turn */ } };";
  const helperDecls = fSrc.split(helperDecl).length - 1;
  const statusKeyCalls = fSrc.split("setStatus(RAG_STATUS_KEY,").length - 1;
  check("fix6: setStatusSafe helper declared ONCE + is the ONLY direct setStatus(RAG_STATUS_KEY, …) call",
    helperDecls === 1 && statusKeyCalls === 1,
    `decls=${helperDecls} directCalls=${statusKeyCalls} (read ../../index.ts)`);
}

rmSync(PI_RAG_TEST_DIR, { recursive: true, force: true });

console.log("\n=== /rag model + effort + subagent command smoke (headless) ===");
console.log(results.join("\n"));
console.log(failed === 0 ? "\nALL PASS" : `\n${failed} CHECK(S) FAILED`);
process.exit(failed === 0 ? 0 : 1);
