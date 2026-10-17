#!/usr/bin/env node
/**
 * run-okf-subprocess.mjs — headless pre-check of the OKF-only subprocess
 * (goal v3 PART 5, task 5 STEP 2: `Okf_only_rag` build + `okf-only` profile
 * dispatch). Fail-first style: every check is written against the REQUIRED
 * behavior first; the file exits 0 only when all pass.
 *
 * Covers (all unit/headless — NO child spawn, NO network, NO live config):
 *
 *   1. bundle discovery (D1) — dir entries only: file trackedPath entries,
 *      missing paths and okf-less dirs are skipped WITHOUT throwing; bundles
 *      = `<dir>/okf`;
 *   2. dominant-bundle affinity (D2) — deterministic scoreBundleIndexDocs /
 *      rankOkfBundles (order-independence, path tie-break), the pure margin
 *      rule (secondary only at ≥ OKF_SECONDARY_MARGIN of the dominant AND
 *      ≥ OKF_MIN_AFFINITY) and the boundary of OKF_MIN_AFFINITY;
 *   3. UNRELATED edge (D3) — isOkfUnrelated = exact `UNRELATED[.!]*`, plus
 *      planOkfRun's two degraded kinds (no-bundles / unrelated) and the
 *      runSubprocessOkfOnly degraded results (never spawns, ok:false, no
 *      injection);
 *   4. payload freshness header (D4) — bundle path + index.md/log.md
 *      mtime dates, multi-bundle join, missing file tolerated;
 *   5. dispatch mapping (D5) — the EXPORTED pure effectiveSubprocess():
 *      okf-only → "Okf" (wins over ragSubprocess), all-grep → ragSubprocess,
 *      grep5 → ragSubprocess; fresh-config default = all-grep (no OKF
 *      surprises), asserted HERMETICALLY in a temp PI_RAG_DIR (the live
 *      ~/.pi/rag/config.json is never read) + the shared effectiveFrom()
 *      reader (null-ragSubprocess parity between hook and status);
 *   6. contract surface — agents/okf-only-rag.md loads (frontmatter tools ==
 *      the runtime OKF_TOOLS — read,grep,find,ls, NO bash (finding 6) — no
 *      write/edit/okf_*), prompt/task builders carry the funnel + UNRELATED +
 *      ≤10 KB + the header + the ESCAPED fence (finding 8), and index.ts/
 *      config.ts source scans pin the REAL wiring (dispatch order — finding
 *      5a, effective-before-gate + logged dormant edge — finding 1, truthful
 *      status tag, stale TODO/"unchanged for now" strings GONE);
 *   7. payload budget (finding 3) — capOkfPayload both sides (under =
 *      untouched, over = truncated + marker + note + UTF-8-safe boundary);
 *   8. bundle index scan cap (finding 7) — oversized index.md never read on
 *      the hook loop: score 0 + explanatory note, plan degrades to UNRELATED;
 *   9. REAL-bundle calibration (findings 2 + 5b) — existsSync-gated scoring of
 *      the real fedoo/ANSYS okf/ pair with the 12 suite questions: known
 *      in-topic dominant ≥ 10, unrelated_cooking total < 10 (+ the full
 *      min-in-topic / max-unrelated printout); graceful SKIP line when the
 *      bundles or tests/ab2/questions.json are absent.
 *
 * Usage:  node tests/smoke/run-okf-subprocess.mjs
 * Exit 0 = all checks passed.
 */
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, readFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { homedir } from "node:os";

// Pin the global pi the main session runs (runner convention) — needed to
// resolve getAgentDir() for the agents/*.md load below (run-smoke-child.mjs).
const cli = join(homedir(), "AppData", "Roaming", "npm", "node_modules",
  "@earendil-works", "pi-coding-agent", "dist", "bundle", "cli.js");
if (!process.env.PI_CLI_PATH && existsSync(cli)) process.env.PI_CLI_PATH = cli;

// HERMETIC: pin the RAG store to a fresh temp dir BEFORE any config import —
// expectations come from defaultConfig()/pure functions, never from the LIVE
// ~/.pi/rag/config.json. Removed again right before exit.
const PI_RAG_TEST_DIR = mkdtempSync(join(tmpdir(), "pi-rag-okf-"));
process.env.PI_RAG_DIR = PI_RAG_TEST_DIR;

const { effectiveSubprocess, effectiveFrom, normalizeRagProfile, defaultConfig, loadConfig, RAG_PROFILES, DEFAULT_RAG_PROFILE } =
  await import("../../config.ts");
const {
  OKF_TOOLS, OKF_PAYLOAD_MAX_BYTES, OKF_MIN_AFFINITY, OKF_SECONDARY_MARGIN, OKF_UNRELATED,
  OKF_INDEX_SCAN_CAP, OKF_TRUNCATION_MARKER,
  discoverOkfBundles, okfQueryTerms, countQuestionHits, scoreBundleIndexDocs, rankOkfBundles,
  selectOkfBundlesFromScores, selectOkfBundles, planOkfRun, isOkfUnrelated,
  buildOkfFreshnessHeader, buildOkfSystemPrompt, buildOkfTask, capOkfPayload, runSubprocessOkfOnly,
} = await import("../../subprocessOkf.ts");
const { D_TOOLS } = await import("../../subprocessD.ts");
const { loadAgentFile } = await import("../../spawnRagSubagent.ts");
const { getRagDir } = await import("../../store.ts");

const results = [];
let failed = 0;
const check = (name, pass, detail) => {
  results.push(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
  if (!pass) failed += 1;
};

// ── fixture: a fake tracked config tree (hermetic — no live corpus needed) ────
const ROOT = mkdtempSync(join(tmpdir(), "pi-rag-okf-tree-"));
const DIR_A = join(ROOT, "CorpusA");
const DIR_B = join(ROOT, "CorpusB");
const FILE_ENTRY = join(ROOT, "loose-file.md");
const DIR_NO_OKF = join(ROOT, "no-okf-here");
const BUNDLE_A = join(DIR_A, "okf");
const BUNDLE_B = join(DIR_B, "okf");
mkdirSync(BUNDLE_A, { recursive: true });
mkdirSync(BUNDLE_B, { recursive: true });
mkdirSync(DIR_NO_OKF, { recursive: true });
writeFileSync(FILE_ENTRY, "just a tracked FILE entry — must be skipped\n");
// Same content in both bundles → equal affinity scores → pure path tie-break.
// 8 bullets so a natural "widget frobnicate" question clears the
// OKF_MIN_AFFINITY floor (≥ 10 length-normalized hits) on BOTH bundles.
const INDEX_BODY = [
  "---", 'okf_version: "0.2"', "---",
  "# Fixture bundle", "",
  ...Array.from({ length: 8 }, (_, i) =>
    `* [Widget frobnication ${i + 1}](/concepts/widgets${i + 1}.md) - widget assembly with frobnicate tuning`),
  "* [Gadget assembly](/concepts/gadgets.md) - gadget calibration steps",
].join("\n");
writeFileSync(join(BUNDLE_A, "index.md"), INDEX_BODY);
writeFileSync(join(BUNDLE_A, "log.md"), "## 2026-01-05\n- captured widgets\n");
writeFileSync(join(BUNDLE_B, "index.md"), INDEX_BODY); // no log.md on purpose

// ── 1. bundle discovery (D1) ──────────────────────────────────────────────────
{
  const found = discoverOkfBundles([DIR_A, DIR_B, FILE_ENTRY, DIR_NO_OKF, join(ROOT, "missing")]);
  check("discovery: only okf/ beneath DIRECTORY tracked entries",
    found.length === 2 && found.includes(BUNDLE_A) && found.includes(BUNDLE_B),
    JSON.stringify(found));
  check("discovery: file + missing + okf-less entries skipped, no throw",
    !found.some((p) => p.includes("loose-file") || p.includes("no-okf") || p.includes("missing")));

  const none = discoverOkfBundles([FILE_ENTRY, join(ROOT, "also-missing")]);
  check("discovery: NO bundle for a config with only file/missing entries",
    Array.isArray(none) && none.length === 0, JSON.stringify(none));

  check("discovery: deduplicates repeated tracked paths",
    discoverOkfBundles([DIR_A, DIR_A]).length === 1);

  // Critic finding 10: Windows case/relative variants of ONE path must not
  // enter the ranking twice (raw-string dedupe kept both).
  const caseVariant = discoverOkfBundles([DIR_A, DIR_A.toUpperCase()]);
  check("discovery: dedupe on NORMALIZED path (case variant of the same dir)",
    caseVariant.length === 1, JSON.stringify(caseVariant));

  const real = planOkfRun([FILE_ENTRY, DIR_NO_OKF], "any question at all");
  check("plan: no-bundle config → kind no-bundles (degraded edge)",
    real.kind === "no-bundles" && typeof real.note === "string" && real.note.includes("no okf bundle"),
    JSON.stringify(real));
}

// ── 2. dominant-bundle affinity (D2) ─────────────────────────────────────────
{
  check("terms: stopwords and short tokens dropped, distinct order kept",
    JSON.stringify(okfQueryTerms("How do I frobnicate the widget? widget"))
      === JSON.stringify(["frobnicate", "widget"]),
    JSON.stringify(okfQueryTerms("How do I frobnicate the widget? widget")));

  // Critic finding 2: NFKD + combining-mark strip — `élasticité` must fold to
  // `elasticite`, never mangle to `lasticit` (the old /[^a-z0-9]+/ split).
  check("terms: diacritics folded — élasticité → elasticite (no mangled stub)",
    JSON.stringify(okfQueryTerms("élasticité de la géométrie nonlinéaire"))
      === JSON.stringify(["elasticite", "geometrie", "nonlineaire"]),
    JSON.stringify(okfQueryTerms("élasticité de la géométrie nonlinéaire")));
  check("hits: QUESTION side folded — accented question matches ASCII index",
    (countQuestionHits("comment modéliser l'élasticité", "modeliser elasticite guide").get("modeliser") ?? 0) >= 1 &&
    (countQuestionHits("comment modéliser l'élasticité", "modeliser elasticite guide").get("elasticite") ?? 0) >= 1,
    JSON.stringify([...countQuestionHits("comment modéliser l'élasticité", "modeliser elasticite guide")]));
  check("hits: INDEX side folded — ASCII question matches accented index",
    (countQuestionHits("elasticite nonlinearite", "Élasticité Nonlinéarité du matériau").get("elasticite") ?? 0) >= 1 &&
    (countQuestionHits("elasticite nonlinearite", "Élasticité Nonlinéarité du matériau").get("nonlinearite") ?? 0) >= 1,
    JSON.stringify([...countQuestionHits("elasticite nonlinearite", "Élasticité Nonlinéarité du matériau")]));

  const m = countQuestionHits("assemble the widget", INDEX_BODY);
  check("hits: exact term counted, absent term kept at 0",
    (m.get("widget") ?? 0) >= 1 && (m.get("giraffe") ?? 0) === 0, JSON.stringify([...m]));

  const stem = countQuestionHits("frobnication gadgets", INDEX_BODY);
  check("hits: light stem (≥5-char prefix) matches frobnication/gadgets",
    (stem.get("frobnication") ?? 0) >= 1 && (stem.get("gadgets") ?? 0) >= 1,
    JSON.stringify([...stem]));

  // Smaller index with the SAME single hit must score HIGHER (length
  // normalization is what stops the big index from always winning: the
  // padding text carries no query term, so raw hits are equal at 1).
  const long = "gadget assembly calibration line.\n".repeat(4000) + "widget";
  const small = "widget";
  const [sLong, sSmall] = scoreBundleIndexDocs("widget", [
    { path: "long", text: long },
    { path: "small", text: small },
  ]);
  check("affinity: BM25 length norm — small doc with same hits outscores big",
    sSmall.score > sLong.score, `${sSmall.score.toFixed(3)} vs ${sLong.score.toFixed(3)}`);

  // Determinism: same input → identical selection; input ORDER does not matter
  // (rank sorts score DESC, path ASC — the tie-break).
  const sel1 = selectOkfBundles([BUNDLE_A, BUNDLE_B], "widget frobnicate guide");
  const sel2 = selectOkfBundles([BUNDLE_B, BUNDLE_A], "widget frobnicate guide");
  check("affinity: identical content → deterministic tie → lexicographic path",
    sel1?.dominant === sel2?.dominant && sel1?.dominant === BUNDLE_A,
    `${sel1?.dominant} vs ${sel2?.dominant}`);
  check("affinity: tie at ratio 1.0 ≥ margin → secondary included",
    sel1?.secondary === BUNDLE_B, JSON.stringify(sel1?.secondary));

  // The margin rule, exactly (pure scores — no fs involved).
  const withSecondary = selectOkfBundlesFromScores([
    { path: "d", score: 20 }, { path: "s", score: 14 },
  ]);
  check("margin: runner-up at exactly 70% of dominant → secondary",
    withSecondary?.secondary === "s" && withSecondary?.dominant === "d",
    JSON.stringify(withSecondary?.secondary));
  const belowMargin = selectOkfBundlesFromScores([
    { path: "d", score: 20 }, { path: "s", score: 13.99 },
  ]);
  check("margin: runner-up below 70% → dropped (dominant only)",
    belowMargin?.dominant === "d" && belowMargin?.secondary === undefined,
    JSON.stringify(belowMargin?.secondary));
  const belowFloor = selectOkfBundlesFromScores([
    { path: "d", score: 20 }, { path: "s", score: 9.99 },
  ]);
  check("margin: runner-up below OKF_MIN_AFFINITY never enters (even inside margin)",
    belowFloor?.secondary === undefined, JSON.stringify(belowFloor?.secondary));

  // Threshold boundary semantics: `< OKF_MIN_AFFINITY` = nothing relevant.
  const atFloors = selectOkfBundlesFromScores([{ path: "d", score: OKF_MIN_AFFINITY }]);
  const justBelow = selectOkfBundlesFromScores([{ path: "d", score: OKF_MIN_AFFINITY - 0.01 }]);
  check(`threshold: score == ${OKF_MIN_AFFINITY} is runnable, just below is UNRELATED`,
    atFloors?.dominant === "d" && justBelow === undefined,
    JSON.stringify({ atFloors, justBelow }));
  check("threshold constants pinned (documented calibration)",
    OKF_MIN_AFFINITY === 10 && OKF_SECONDARY_MARGIN === 0.7,
    `MIN=${OKF_MIN_AFFINITY} MARGIN=${OKF_SECONDARY_MARGIN}`);
}

// ── 3. UNRELATED edge (D3) ────────────────────────────────────────────────────
{
  check("void predicate: exact UNRELATED accepted (case/punct tolerant)",
    isOkfUnrelated("UNRELATED") && isOkfUnrelated("  unrelated.  ") &&
    isOkfUnrelated("UNRELATED!!") && OKF_UNRELATED.test("U N R E L A T E D".replace(/ /g, "")));
  check("void predicate: prose around it is NOT a void",
    !isOkfUnrelated("UNRELATED — see log.md") && !isOkfUnrelated("not UNRELATED"),
    "«UNRELATED — see log.md» must stay a real payload");

  const plan = planOkfRun([DIR_A, DIR_B], "zoological sludge accounting paradigms");
  check("plan: bundles exist but nothing relevant → kind unrelated (no spawn)",
    plan.kind === "unrelated" && plan.note.includes("UNRELATED edge"),
    JSON.stringify(plan).slice(0, 160));

  // Degraded entry points: NEVER spawn (no ctx.ui needed), ok:false, note set.
  const ctx = {};
  const degraded = await runSubprocessOkfOnly({
    prompt: "anything", ctx, trackedPaths: [FILE_ENTRY], timeoutMs: 1000,
  });
  check("runSubprocessOkfOnly: no bundles → ok:false, null content, explanatory note",
    degraded.ok === false && degraded.content === null &&
    (degraded.note ?? "").includes("no okf bundle"),
    JSON.stringify({ ok: degraded.ok, note: degraded.note }));
  const degraded2 = await runSubprocessOkfOnly({
    prompt: "zoological sludge accounting paradigms", ctx, trackedPaths: [DIR_A, DIR_B], timeoutMs: 1000,
  });
  check("runSubprocessOkfOnly: nothing relevant → ok:false UNRELATED edge (no spawn)",
    degraded2.ok === false && degraded2.content === null &&
    (degraded2.note ?? "").includes("UNRELATED edge"),
    JSON.stringify({ ok: degraded2.ok, note: degraded2.note }));
}

// ── 4. payload freshness header (D4) ─────────────────────────────────────────
{
  const header = buildOkfFreshnessHeader([BUNDLE_A, BUNDLE_B]);
  check("header: one line carrying both bundle paths",
    !header.includes("\n") && header.startsWith("OKF bundles: ") &&
    header.includes(BUNDLE_A) && header.includes(BUNDLE_B),
    header);
  check("header: index.md + log.md mtime dates per bundle (YYYY-MM-DD)",
    /index\.md \d{4}-\d{2}-\d{2}/.test(header) && /log\.md \d{4}-\d{2}-\d{2}/.test(header),
    header);
  check("header: bundle without log.md → \"log.md unknown\", never throws",
    buildOkfFreshnessHeader([BUNDLE_B]).includes("log.md unknown") &&
    buildOkfFreshnessHeader([BUNDLE_B]).includes(BUNDLE_B),
    buildOkfFreshnessHeader([BUNDLE_B]));
}

// ── 5. dispatch mapping (D5) ─────────────────────────────────────────────────
{
  check("dispatch: okf-only → Okf even when ragSubprocess says D",
    effectiveSubprocess("okf-only", "D") === "Okf");
  check("dispatch: okf-only WINS over any ragSubprocess value (profile precedence)",
    effectiveSubprocess("okf-only", "A") === "Okf" &&
    effectiveSubprocess("okf-only", "EF") === "Okf" &&
    effectiveSubprocess("okf-only", "S") === "Okf");
  check("dispatch: all-grep → ragSubprocess (D unchanged)",
    effectiveSubprocess("all-grep", "D") === "D");
  check("dispatch: grep5 → ragSubprocess (D unchanged — divergence NOT wired)",
    effectiveSubprocess("grep5", "D") === "D");

  // Critic finding 4 — ONE shared reader: the hook dispatch and the /rag
  // status row both derive through effectiveFrom(config) (profile-normalize +
  // normalizeRagSubprocess back-compat + effectiveSubprocess), so a hand-edited
  // `"ragSubprocess": null` can never show status `null` vs hook "D" (the
  // PART 4 step-3 normalized default).
  check("shared reader: okf-only wins for BOTH hook and status (single source)",
    effectiveFrom({ ragProfile: "okf-only", ragSubprocess: "D" }).effective === "Okf" &&
    effectiveFrom({ ragProfile: "all-grep", ragSubprocess: "D" }).effective === "D");
  check("shared reader: hand-edited ragSubprocess null → \"D\" on both sites (no null/D divergence)",
    effectiveFrom({ ragProfile: "all-grep", ragSubprocess: null }).effective === "D" &&
    effectiveFrom({ ragProfile: "okf-only", ragSubprocess: null }).effective === "Okf",
    JSON.stringify(effectiveFrom({ ragProfile: "all-grep", ragSubprocess: null })));

  const fresh = normalizeRagProfile(undefined);
  check("fresh config: default profile all-grep without warning (no OKF surprise)",
    fresh.profile === "all-grep" && fresh.fellBack === false &&
    fresh.profile === DEFAULT_RAG_PROFILE,
    JSON.stringify(fresh));
  check("loadConfig hermetic: resolves inside the temp PI_RAG_DIR (never live ~/.pi/rag)",
    getRagDir() === PI_RAG_TEST_DIR, getRagDir());
  const cfg = loadConfig();
  check("fresh config: loadConfig fills ragProfile default → effective subprocess = ragSubprocess",
    cfg.ragProfile === defaultConfig().ragProfile &&
    effectiveSubprocess(normalizeRagProfile(cfg.ragProfile).profile, cfg.ragSubprocess) === cfg.ragSubprocess,
    JSON.stringify({ ragProfile: cfg.ragProfile, ragSubprocess: cfg.ragSubprocess }));
  check("RAG_PROFILES still names exactly okf-only / all-grep / grep5",
    JSON.stringify(RAG_PROFILES.map((p) => p.name)) ===
    JSON.stringify(["okf-only", "all-grep", "grep5"]),
    JSON.stringify(RAG_PROFILES));
}

// ── 6. contract surface (agent file, prompt, wiring source scans) ────────────
{
  let agent = null;
  try {
    agent = loadAgentFile("okf-only-rag.md");
  } catch (err) {
    check("agents/okf-only-rag.md loads via the child loader", false, String(err));
  }
  if (agent) {
    const tools = agent.tools.join(",");
    check("agents/okf-only-rag.md loads (frontmatter + body)",
      tools.length > 0 && agent.filePath.endsWith(join("agents", "okf-only-rag.md")) &&
      agent.systemPrompt.length > 500, `tools=[${tools}] body=${agent.systemPrompt.length}B`);
    check("agent tools = runtime OKF_TOOLS read,grep,find,ls — NO bash (finding 6; D unchanged)",
      tools === "read,grep,find,ls" && OKF_TOOLS.join(",") === tools &&
      D_TOOLS.join(",") === "read,grep,find,ls,bash", tools);
    check("agent is read-only: no write/edit/okf_* / rag_* in the allowlist",
      !/(^|,)(write|edit|okf_\w+|rag_\w+)(,|$)/.test(tools), tools);
    check("agent body states the read-only + UNRELATED contract",
      agent.systemPrompt.includes("READ-ONLY") &&
      agent.systemPrompt.includes("UNRELATED") &&
      /Funnel/ .test(agent.systemPrompt));
  }

  const selection = { dominant: BUNDLE_A, secondary: BUNDLE_B, scores: [] };
  const header = buildOkfFreshnessHeader([BUNDLE_A, BUNDLE_B]);
  const sys = buildOkfSystemPrompt(selection, header);
  check("system prompt: lists DOMINANT + secondary bundle paths",
    sys.includes(BUNDLE_A) && sys.includes(BUNDLE_B) && sys.includes("DOMINANT"), sys.slice(0, 100));
  check("system prompt: embeds the freshness header verbatim for line 1",
    sys.includes(header), header);
  check("system prompt: funnel + STRICT UNRELATED edge + ≤10 KB payload rule",
    sys.includes("index.md") && sys.includes("frontmatter") &&
    sys.includes("EXACTLY the single word UNRELATED") &&
    sys.includes(`≤ 10 KB`) && OKF_PAYLOAD_MAX_BYTES === 10 * 1024);
  const task = buildOkfTask("how do I frobnicate?");
  check("task: user prompt verbatim (heredoc) + payload/UNRELATED terms",
    task.includes("<<<PROMPT") && task.includes("how do I frobnicate?") &&
    task.includes("UNRELATED"), JSON.stringify(task.slice(0, 80)));

  // Critic finding 8 — HOSTILE fixture: inner fence-line lookalikes must be
  // escaped (U+200B appended) so exactly ONE real opener/closer each survives.
  const hostile = ["line one", "PROMPT", "<<<PROMPT", ">>>", "line two"].join("\n");
  const hostileTask = buildOkfTask(hostile);
  const hostileLines = hostileTask.split("\n");
  check("task: hostile inner fence lines escaped — exactly ONE real fence each survives",
    hostileLines.filter((l) => l === "PROMPT").length === 1 &&
    hostileLines.filter((l) => l === "<<<PROMPT").length === 1 &&
    hostileLines.filter((l) => l === ">>>").length === 1 &&
    hostileLines.filter((l) => l === "PROMPT\u200B").length === 1 &&
    hostileLines.filter((l) => l === "<<<PROMPT\u200B").length === 1 &&
    hostileLines.filter((l) => l === ">>>\u200B").length === 1,
    JSON.stringify(hostileLines));
  check("task: escaped fence lines keep their text (only a ZWSP appended)",
    hostileTask.includes("line one") && hostileTask.includes("line two") &&
    hostileTask.includes("PROMPT\u200B"), JSON.stringify(hostileTask.slice(0, 120)));

  // The tested pieces must be the ones index.ts ACTUALLY wires (source scan —
  // index.ts cannot be imported headless: direct type-strip import fails on
  // './db.ts' named exports).
  const indexSrc = readFileSync(new URL("../../index.ts", import.meta.url), "utf-8");
  check("index.ts wires runSubprocessOkfOnly behind the okf-only profile branch",
    indexSrc.includes("runSubprocessOkfOnly(") &&
    indexSrc.includes('effective === "Okf"') &&
    indexSrc.includes("effectiveFrom(config)"),
    "index.ts source");
  check("index.ts kill-switch covers the OKF profile (no fallthrough to legacy path)",
    indexSrc.includes('if (sub === "S" || sub === "D" || effective === "Okf") return;'),
    "index.ts source");
  check("index.ts status row composes the SHARED status tag (truthful /rag status)",
    indexSrc.includes("const subTag = buildSubprocessStatusTag(config)") &&
    indexSrc.includes("${subTag}"), "index.ts source");

  // Critic findings 1 + 5a — DISPATCH ORDER, not just strings.
  const gateAt = indexSrc.indexOf("if (config.ragSubagentHookBlocking === true");
  const dispatchAt = indexSrc.indexOf("const dispatch = effectiveFrom(config)");
  check("find.1: effective dispatch computed BEFORE the blocking gate",
    dispatchAt !== -1 && gateAt !== -1 && dispatchAt < gateAt,
    `dispatch@${dispatchAt} gate@${gateAt}`);
  // FOOTER move (user decision): the dormant outcome is NO LONGER a prompt-
  // zone stderr write — it is ONE ctx.ui.setStatus line whose text is built by
  // buildRagStatusText({ kind: "inactive", … }) and rendered in the pi footer.
  // The ordering intent is UNCHANGED: the setStatus + return sit BEFORE the
  // blocking gate, and the legacy write is gone (never legacy).
  const dormantStatusAt = indexSrc.indexOf(
    'setStatusSafe(buildRagStatusText({ kind: "inactive"');
  const dormantReturnAt = dormantStatusAt === -1 ? -1 : indexSrc.indexOf("return;", dormantStatusAt);
  const legacyDormantGone = !indexSrc.includes("[rag] okf-only profile inactive");
  check("find.1: okf-only + blocking off → ONE footer setStatus (kind inactive) + return BEFORE the gate (never legacy)",
    dormantStatusAt !== -1 && dormantReturnAt !== -1 && dormantReturnAt < gateAt && legacyDormantGone,
    `status@${dormantStatusAt} return@${dormantReturnAt} gate@${gateAt} legacyGone=${legacyDormantGone}`);
  // FIX ROUND finding 5 — the REASON must never be blankable: content pin on
  // the exact dormant reason string ("" or a dropped reason fails here).
  check("find.1: okf dormant REASON pinned verbatim — reason must not be blanked",
    indexSrc.includes('reason: "okf-only profile inactive (ragSubagentHookBlocking=false)'),
    "index.ts source");
  const okfBranchAt = indexSrc.indexOf('if (effective === "Okf")');
  const dBranchAt = indexSrc.indexOf('else if (sub === "D")');
  check("find.5a: profile precedence dead-code guard — Okf branch BEFORE the D branch",
    okfBranchAt !== -1 && dBranchAt !== -1 && okfBranchAt < dBranchAt,
    `okf@${okfBranchAt} d@${dBranchAt}`);
  check("index.ts TODO dispatch marker GONE (replaced by the real branch)",
    !indexSrc.includes("TODO(goal v3 PART 5, task 4)"), "index.ts source");
  const configSrc = readFileSync(new URL("../../config.ts", import.meta.url), "utf-8");
  check("config.ts: stale 'dispatch unchanged for now' success line GONE",
    !configSrc.includes("dispatch unchanged for now"), "config.ts source");
  check("config.ts: effectiveSubprocess pure mapping exported",
    configSrc.includes("export function effectiveSubprocess("), "config.ts source");
  check("config.ts: shared effectiveFrom + status tag carry the (hook inactive) marker",
    configSrc.includes("export function effectiveFrom(") &&
    configSrc.includes("export function buildSubprocessStatusTag(") &&
    configSrc.includes('" (hook inactive)"'), "config.ts source");
}

// ── 7. payload budget ENFORCED (finding 3) ─────────────────────────────────
{
  const under = "x".repeat(OKF_PAYLOAD_MAX_BYTES - 10);
  const rUnder = capOkfPayload(under);
  check("cap: payload UNDER the cap returned untouched (no note, not truncated)",
    rUnder.content === under && rUnder.truncated === false && rUnder.note === undefined,
    JSON.stringify({ len: rUnder.content.length, truncated: rUnder.truncated }));

  const over = "y".repeat(OKF_PAYLOAD_MAX_BYTES + 5000);
  const rOver = capOkfPayload(over);
  check("cap: payload OVER the cap truncated + marker + note + ≤ 10 KB",
    rOver.truncated === true && rOver.content.endsWith(OKF_TRUNCATION_MARKER) &&
    Buffer.byteLength(rOver.content, "utf-8") <= OKF_PAYLOAD_MAX_BYTES &&
    typeof rOver.note === "string" && rOver.note.includes("truncated") &&
    rOver.note.includes(String(OKF_PAYLOAD_MAX_BYTES)) && rOver.note.includes(String(over.length)),
    JSON.stringify({ bytes: Buffer.byteLength(rOver.content, "utf-8"), note: rOver.note }));

  // UTF-8-safe boundary: the cut point (budget) falls in the middle of the
  // first 3-byte char; the whole input MUST exceed the cap.
  const budget = OKF_PAYLOAD_MAX_BYTES - Buffer.byteLength(OKF_TRUNCATION_MARKER, "utf-8");
  const straddle = "a".repeat(budget - 1) + "中".repeat(64);
  const rStraddle = capOkfPayload(straddle);
  check("cap: multi-byte cut at a UTF-8-safe boundary (no U+FFFD, no overrun)",
    !rStraddle.content.includes("\uFFFD") && rStraddle.content.endsWith(OKF_TRUNCATION_MARKER) &&
    Buffer.byteLength(rStraddle.content, "utf-8") <= OKF_PAYLOAD_MAX_BYTES,
    JSON.stringify({ bytes: Buffer.byteLength(rStraddle.content, "utf-8") }));

  const okfSrc = readFileSync(new URL("../../subprocessOkf.ts", import.meta.url), "utf-8");
  check("wiring: runSubprocessOkfOnly ENFORCES the cap on the runner content (not just asserted)",
    okfSrc.includes("capOkfPayload(run.content)") &&
    okfSrc.includes("OKF_PAYLOAD_MAX_BYTES = 10 * 1024"), "subprocessOkf.ts source");
}

// ── 8. bundle index scan CAP on the hook event loop (finding 7) ─────────────
{
  check("scan cap: OKF_INDEX_SCAN_CAP pinned at 16 KB", OKF_INDEX_SCAN_CAP === 16 * 1024,
    String(OKF_INDEX_SCAN_CAP));
  const bigCorpus = join(ROOT, "BigCorpus");
  const bigBundle = join(bigCorpus, "okf");
  mkdirSync(bigBundle, { recursive: true });
  writeFileSync(join(bigBundle, "index.md"),
    "* [Widget frobnication](/concepts/widgets.md) - widget assembly\n".padEnd(OKF_INDEX_SCAN_CAP + 2048, "f"));
  const ranked = rankOkfBundles([bigBundle], "widget frobnicate guide");
  check("scan cap: oversized index.md NOT read — scored 0 with explanatory note",
    ranked.length === 1 && ranked[0].score === 0 &&
    typeof ranked[0].note === "string" && ranked[0].note.includes("scan cap"),
    JSON.stringify(ranked));
  const bigPlan = planOkfRun([bigCorpus], "widget frobnicate guide");
  check("scan cap: oversize-only config degrades to the UNRELATED edge, note carried",
    bigPlan.kind === "unrelated" && bigPlan.note.includes("scan cap"),
    JSON.stringify(bigPlan).slice(0, 220));
}

// ── 9. REAL-bundle calibration on the 12 suite questions (findings 2 + 5b) ──
{
  const suitePath = new URL("../ab2/questions.json", import.meta.url);
  const corporaRoots = [
    "C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo",
    "C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS",
  ];
  if (!existsSync(suitePath)) {
    console.log("SKIP  real-bundle calibration — tests/ab2/questions.json absent");
  } else {
    const suite = JSON.parse(readFileSync(suitePath, "utf-8"));
    const roots = Object.values(suite.corpora ?? {}).length
      ? Object.values(suite.corpora)
      : corporaRoots;
    const bundles = roots.map((p) => join(p, "okf")).filter((p) => existsSync(join(p, "index.md")));
    if (!bundles.length || !(suite.questions ?? []).length) {
      console.log("SKIP  real-bundle calibration — fedoo/ANSYS okf bundles or suite questions absent");
    } else {
      const rows = [];
      for (const qq of suite.questions) {
        const scores = rankOkfBundles(bundles, qq.text);
        rows.push({
          id: qq.id,
          corpus: qq.corpus,
          dominant: scores[0]?.score ?? 0,
          total: scores.reduce((s, x) => s + x.score, 0),
        });
      }
      const inTopic = rows.filter((r) => r.corpus !== "unrelated");
      const unrel = rows.filter((r) => r.corpus === "unrelated");
      const minIn = Math.min(...inTopic.map((r) => r.dominant));
      const maxUnDom = Math.max(...unrel.map((r) => r.dominant));
      const maxUnTot = Math.max(...unrel.map((r) => r.total));
      console.log(`CALIBRATION real okf pair × ${rows.length} suite questions:` +
        ` min in-topic dominant=${minIn.toFixed(2)}` +
        ` · max unrelated dominant=${maxUnDom.toFixed(2)}` +
        ` · max unrelated total=${maxUnTot.toFixed(2)}` +
        ` · OKF_MIN_AFFINITY=${OKF_MIN_AFFINITY}`);
      for (const r of rows) {
        console.log(`  ${String(r.id).padEnd(26)} dom=${r.dominant.toFixed(2)}  total=${r.total.toFixed(2)}`);
      }
      const rmesh = rows.find((r) => r.id === "fedoo_rectangle_mesh");
      const cook = rows.find((r) => r.id === "unrelated_cooking");
      check("find.5b: REAL fedoo_rectangle_mesh dominant ≥ OKF_MIN_AFFINITY (diacritic-fold calibration)",
        !!rmesh && rmesh.dominant >= OKF_MIN_AFFINITY,
        rmesh ? `dom=${rmesh.dominant.toFixed(2)}` : "question missing");
      check("find.5b: REAL unrelated_cooking TOTAL < OKF_MIN_AFFINITY",
        !!cook && cook.total < OKF_MIN_AFFINITY,
        cook ? `total=${cook.total.toFixed(2)}` : "question missing");
      check("find.2: ALL in-topic dominants ≥ 10 AND unrelated totals < 10 (floor 10 keeps headroom)",
        minIn >= OKF_MIN_AFFINITY && maxUnTot < OKF_MIN_AFFINITY,
        `minIn=${minIn.toFixed(2)} maxUnTot=${maxUnTot.toFixed(2)}`);
    }
  }
}

rmSync(ROOT, { recursive: true, force: true });
rmSync(PI_RAG_TEST_DIR, { recursive: true, force: true });

console.log("\n=== OKF-only subprocess smoke (headless) ===");
console.log(results.join("\n"));
console.log(failed === 0 ? "\nALL PASS" : `\n${failed} CHECK(S) FAILED`);
process.exit(failed === 0 ? 0 : 1);
