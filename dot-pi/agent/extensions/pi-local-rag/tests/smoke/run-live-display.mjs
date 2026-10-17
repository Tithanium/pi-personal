#!/usr/bin/env node
/**
 * CONTRACT (builder must satisfy) — headless display-state seam for the
 * hook-spawned subagent's LIVE view (the feature under test). This file is the
 * TEST HARNESS ONLY: it must never implement the seam, only assert it.
 *
 * WHERE : extension dir = C:/Users/connessn/.pi/agent/extensions/pi-local-rag/
 *   Implement in : subprocessSmoke.ts  (ADD the export; do NOT change the
 *                   existing runVisibleSubagent escape/phase logic).
 *   Consumed by   : tests/smoke/run-live-display.mjs (this file) — run:
 *                   node tests/smoke/run-live-display.mjs  (cwd = extension dir)
 *   Types from    : ./subagentRender.ts — all already exported there:
 *                   FgTheme { fg(color,text), bold(text) }   (subagentRender.ts:33)
 *                   SubagentSingleResult                     (subagentRender.ts:44)
 *                   renderCallFrame / renderResultFrame / addAssistantUsage /
 *                   newSingleResult — reuse them so the live view stays
 *                   byte-consistent with the classical renderer.
 *
 * SIGNATURE (export from subprocessSmoke.ts):
 *
 *   export function createLiveDisplay(opts: {
 *     label: string;   // call header → `subagent <label> [user]`
 *     task: string;    // classical call preview + `─── Task ───` body
 *   }): {
 *     /** Feed child `pi --mode json` events VERBATIM — NO real child spawned.
 *      *  Shapes consumed today by runVisibleSubagent (subprocessSmoke.ts:264-289):
 *      *    { type: "message_update", usage?, assistantMessageEvent:
 *      *        { type: "text_delta" | "thinking_delta", delta: string } }
 *      *    { type: "message_end", message: MsgLike }   // MsgLike { role, content,
 *      *                                                  //   model?, usage?, stopReason? }
 *      *    { type: "tool_result_end", message: MsgLike }  // reference subagent/index.ts:411-414
 *      *                                                   //   → push into messages;
 *      *                                                   //   UNVERIFIED in this pi's
 *      *                                                   //   json-event stream (absent from
 *      *                                                   //   captured *.raw.jsonl)
 *     onEvent(ev: unknown): void;
 *     /** Flatten-ready rendered lines of the LIVE view at current state.
 *      *  expanded:false = classical collapsed sections + pending row while running;
 *      *  expanded:true  = whole process (─── Task ─── / ─── Reasoning ─── once a
 *      *  completed thinking message exists / ─── Output ─── / every `→ toolCall`
 *      *  line / full text). width defaults to 110. NEVER truncate the transcript
 *      *  (the 2400-char live tails at subprocessSmoke.ts:269,272 are the defect).
 *     lines(expanded: boolean, theme: FgTheme, width?: number): string[];
 *     /** Mirror of runVisibleSubagent's closure phase (subprocessSmoke.ts:102),
 *     *  extended with "error". While "running", lines() MUST include the pending
 *     *  row `⠋ <wall>s — escape cancels only the subagent` (the widget line,
 *     *  subprocessSmoke.ts:179-186); final states must NOT (✓/✗ header only).
 *     phase(): "running" | "done" | "escaped" | "error";
 *     /** LIVE transcript accumulator (SubagentSingleResult) — valid at any time;
 *     *  after finish() it is the final transcript (what SubagentFrameData.single
 *     *  would carry). message_end → messages.push + addAssistantUsage, exactly
 *     *  like the existing onEvent (subprocessSmoke.ts:275-285).
 *     single(): SubagentSingleResult;
 *     /** Leave "running": "done" | "void" → phase "done" (✓ header),
 *     *  "escaped" → "escaped", "error" → "error" (✗/Error line from single).
 *     finish(outcome: "done" | "void" | "escaped" | "error", note?: string): void;
 *   };
 *
 * ASSERTIONS (check names in this file):
 *   R1 growth    lines() STRICTLY grows across ≥4 canned snapshots
 *                (thinking_delta → message_end → text_delta → message_end)
 *   R2 thinking  developing thinking visible mid-run in lines(false) ("✻ ")
 *   R3 expand    lines(true) vs lines(false) materially differ; expanded shows
 *                Task/Reasoning/Output/→ lines/full text, collapsed ≤3-line previews
 *   R4 pending   running → phase()="running" + self-describing header + escape/spinner
 *                row; finish("done") → phase()="done" + "✓ rag-d (user)", no marker
 *   R5 escaping  EXISTING runVisibleSubagent path unchanged (pre-aborted signal →
 *                classic escaped frame) — already true today, must keep passing
 *   R6 ingest    canned {type:"tool_result_end", message} lands in single().messages
 *
 * CURRENT STATE: createLiveDisplay is NOT exported anywhere (grep: 0 hits) →
 * this script prints exactly
 *   FAIL  seam missing — createLiveDisplay not found in subprocessSmoke.ts
 * for R1-R4/R6, still runs the always-on wiring + R5 checks (they PASS), exits 1,
 * and never throws.
 */

// ── run-live-display.mjs ─────────────────────────────────────────────────────
// Headless check of the LIVE hook-spawned subagent display. Deterministic: the
// live render is driven by a CANNED child-event script through the seam above —
// NO real pi child is spawned for R1-R4/R6. The ONLY real spawn is R5's
// pre-aborted runVisibleSubagent (child is SIGTERM'd at once, same pattern as
// run-smoke-child.mjs §5) — required to prove the classic escaped frame.
//
// Exit 0 = all checks passed (after the builder implements the seam).
import { existsSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

// Pin the same global pi the main session runs (runner convention, run-smoke-child.mjs:17-20)
const cli = join(homedir(), "AppData", "Roaming", "npm", "node_modules",
  "@earendil-works", "pi-coding-agent", "dist", "bundle", "cli.js");
if (!process.env.PI_CLI_PATH && existsSync(cli)) process.env.PI_CLI_PATH = cli;

const results = [];
let failed = 0;
const check = (name, pass, detail) => {
  results.push(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
  if (!pass) failed += 1;
};

const SEAM_MISSING = "seam missing — createLiveDisplay not found in subprocessSmoke.ts";
const THEME = { fg: (_c, t) => String(t ?? ""), bold: (t) => String(t ?? "") }; // no-op FgTheme (run-widget-panel.mjs:26)
const WIDTH = 110;
const SPINNER = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
const PENDING_ROW = "escape cancels only the subagent"; // widget line, subprocessSmoke.ts:185
const TASK = "find fedoo mesh doc";

// ── 0. wiring: imports + classical frames headless (always on, must PASS now) ─
let strip, renderResultFrame, renderCallFrame, newSingleResult, smoke, spawn, flatten;
try {
  const pc = await import("@earendil-works/pi-coding-agent"); // resolves from the extension dir only
  pc.initTheme("dark"); // subagentRender's expanded branch uses getMarkdownTheme() → needs a theme
  ({ stripTerminalSequences: strip } = await import("@earendil-works/pi-tui"));
  ({ renderResultFrame, renderCallFrame, newSingleResult } = await import("../../subagentRender.ts"));
  smoke = await import("../../subprocessSmoke.ts");
  spawn = await import("../../spawnRagSubagent.ts");
  flatten = (comp) => comp.render(WIDTH).map((l) => strip(l).trimEnd()).filter((l) => l !== "").join("\n");
  check("imports — extension + pi-tui/pi load headless", true);
} catch (e) {
  check("imports — extension + pi-tui/pi load headless", false, String(e));
}

if (flatten) {
  const emptySingle = newSingleResult("rag-d", TASK, "user");
  let collapsedText = "", expandedText = "", callText = "";
  try { collapsedText = flatten(renderResultFrame(emptySingle, { expanded: false }, THEME)); } catch (e) { collapsedText = `THREW ${e.message}`; }
  try { expandedText = flatten(renderResultFrame(emptySingle, { expanded: true }, THEME)); } catch (e) { expandedText = `THREW ${e.message}`; }
  try { callText = flatten(renderCallFrame("rag-d", TASK, THEME)); } catch (e) { callText = `THREW ${e.message}`; }
  check("port renders classical collapsed frame headless",
    collapsedText.includes("✓ rag-d (user)") && collapsedText.includes("(no output)"),
    JSON.stringify(collapsedText.replace(/\n/g, " | ")));
  check("port renders classical expanded frame headless",
    expandedText.includes("─── Task ───") && expandedText.includes(TASK) && expandedText.includes("─── Output ───"),
    JSON.stringify(expandedText.split("\n")[1] ?? ""));
  check("port renders classical call frame headless",
    callText.includes("subagent rag-d [user]") && callText.includes(TASK), "");
}

// ── 1. seam probe (the feature under test) ───────────────────────────────────
const hasSeam = typeof smoke?.createLiveDisplay === "function";
if (!hasSeam) check(SEAM_MISSING, false); // ← the correct current-state output

// ── 2. canned child-event script → snapshots (only via the seam) ─────────────
// Event shapes cited from code (see CONTRACT): message_update deltas and
// message_end — subprocessSmoke.ts:264-289; tool_result_end — reference
// extensions/subagent/index.ts:411-414 (UNVERIFIED for this pi's stream).
const THINKING = "Step 1: locate the fedoo meshing guide.";
const TEXT7 = Array.from({ length: 7 }, (_, i) => `line${i + 1}`).join("\n");
const upd = (type, delta) => ({
  type: "message_update",
  usage: { input: 500, output: 8 },
  assistantMessageEvent: { type, delta },
});
const STEPS = [
  // S1 — pure thinking deltas (transient developing reasoning, deltas ×3)
  [upd("thinking_delta", "Step 1: locate the fedoo"), upd("thinking_delta", " meshing"), upd("thinking_delta", " guide.")],
  // S2 — completed thinking message
  [{ type: "message_end", message: { role: "assistant", content: [{ type: "thinking", thinking: THINKING }], model: "m-test", usage: { input: 500, output: 10, cost: { total: 0.0001 } }, stopReason: "toolUse" } }],
  // S3 — text deltas ×3
  [upd("text_delta", "See"), upd("text_delta", " the"), upd("text_delta", " guide")],
  // S4 — final assistant message (toolCall + 7-line text)
  [{ type: "message_end", message: { role: "assistant", content: [{ type: "toolCall", name: "grep", arguments: { pattern: "rectangle", path: "." } }, { type: "text", text: TEXT7 }], usage: { input: 400, output: 60, cost: { total: 0.0005 } }, stopReason: "stop" } }],
];
// UNVERIFIED shape (reference subagent/index.ts:411): `type:"tool_result_end"` + `.message`
const TOOL_RESULT_END = { type: "tool_result_end", message: { role: "toolResult", toolCallId: "t1", name: "grep", content: [{ type: "text", text: "hit" }] } };

let obs = null;
let obsErr = null;
if (hasSeam) {
  try {
    const live = smoke.createLiveDisplay({ label: "rag-d", task: TASK });
    const norm = (v) => (Array.isArray(v) ? v.map((x) => String(x)) : [String(v)]).join("\n");
    const snaps = [];
    const snap = () => snaps.push({ collapsed: norm(live.lines(false, THEME, WIDTH)), expanded: norm(live.lines(true, THEME, WIDTH)) });
    for (const step of STEPS) { for (const ev of step) live.onEvent(ev); snap(); }
    const phaseMid = live.phase();
    const n0 = live.single?.()?.messages?.length ?? -1;
    live.onEvent(TOOL_RESULT_END);
    const n1 = live.single?.()?.messages?.length ?? -1;
    live.finish?.("done");
    const donePhase = live.phase?.();
    const doneCollapsed = norm(live.lines(false, THEME, WIDTH));
    // 2400-truncation probe: a 3000-char single-line thinking delta must reach
    // SOME live view un-truncated (Text.render wraps — chars survive wrapping).
    const probe = smoke.createLiveDisplay({ label: "rag-d", task: TASK });
    probe.onEvent(upd("thinking_delta", "z".repeat(3000)));
    const countZ = (s) => (s.match(/z/g) ?? []).length;
    const zCount = Math.max(countZ(norm(probe.lines(false, THEME, WIDTH))), countZ(norm(probe.lines(true, THEME, WIDTH))));
    obs = { snaps, phaseMid, n0, n1, donePhase, doneCollapsed, zCount };
  } catch (e) {
    obsErr = e instanceof Error ? e.message : String(e);
  }
}

// Feature gate: seam-absent → SEAM_MISSING detail; seam-threw → clear detail.
const feature = (name, fn) => {
  if (!hasSeam) return check(name, false, SEAM_MISSING);
  if (obsErr) return check(name, false, `seam block threw — ${obsErr}`);
  try {
    const detail = fn(obs);
    check(name, true, detail || undefined);
  } catch (e) {
    check(name, false, `assert threw — ${e instanceof Error ? e.message : String(e)}`);
  }
};

// ── 3. R1: strictly growing live view over ≥4 snapshots ──────────────────────
feature("R1 live view STRICTLY GROWS over ≥4 canned snapshots", (o) => {
  const lens = o.snaps.map((s) => s.collapsed.length);
  const grew = lens.length >= 4 && lens.every((n, i) => i === 0 || lens[i - 1] < n);
  if (!grew) throw new Error(`collapsed lengths not strictly increasing: ${lens.join(" < ")}`);
  return `collapsed lens ${lens.join(" < ")}`;
});

// ── 4. R2: developing thinking visible mid-run ───────────────────────────────
feature("R2 developing THINKING visible mid-run (✻ in collapsed live view)", (o) => {
  const s1 = o.snaps[0].collapsed;
  if (!s1.includes("✻")) throw new Error("no ✻ marker in running collapsed view");
  if (!s1.includes("Step 1: locate the fedoo")) throw new Error(`thinking text absent: ${JSON.stringify(s1.slice(0, 120))}`);
  const s2exp = o.snaps[1].expanded;
  if (!s2exp.includes("─── Reasoning ───") || !s2exp.includes(THINKING))
    throw new Error("expanded view lacks ─── Reasoning ─── / full thinking after message_end");
  return "";
});

// ── 5. R3: expansion honored — whole process vs classical collapsed ──────────
feature("R3 expansion honored: expanded mid-run shows whole process", (o) => {
  const exp = o.snaps[3].expanded;
  for (const want of ["─── Task ───", TASK, "─── Output ───", "/rectangle/", "line7"]) {
    if (!exp.includes(want)) throw new Error(`expanded missing ${JSON.stringify(want)}`);
  }
  if (!/→.*\/rectangle\//.test(exp)) throw new Error("expanded missing `→ grep /rectangle/` toolCall line");
  if (o.snaps[1].expanded.indexOf("─── Task ───") < 0) throw new Error("mid-run expanded view lacks Task section");
  return "";
});

feature("R3 expanded vs collapsed materially differ (3-line preview kept)", (o) => {
  const { collapsed, expanded } = o.snaps[3];
  if (collapsed === expanded) throw new Error("expanded === collapsed");
  if (expanded.length <= collapsed.length) throw new Error(`expanded (${expanded.length}) not longer than collapsed (${collapsed.length})`);
  if (!collapsed.includes("line3")) throw new Error("collapsed missing text preview line3");
  if (collapsed.includes("line4")) throw new Error("collapsed leaks line4+ (preview must be ≤3 lines, subagentRender.ts:279)");
  return `collapsed ${collapsed.length} < expanded ${expanded.length} chars`;
});

// ── 6. R4: pending running state vs done state ───────────────────────────────
feature("R4 running state pending: phase + self-describing header + escape/spinner row", (o) => {
  if (o.phaseMid !== "running") throw new Error(`phase()=${o.phaseMid} while child fed`);
  const s1 = o.snaps[0].collapsed;
  if (!s1.includes("subagent rag-d [user]")) throw new Error("running view not self-describing (missing call header)");
  if (!s1.includes(PENDING_ROW)) throw new Error(`missing pending marker "${PENDING_ROW}"`);
  if (!SPINNER.some((g) => s1.includes(g))) throw new Error("no spinner glyph in running view");
  return "";
});

feature("R4 done state distinct after finish(): ✓ header, no pending row/spinner", (o) => {
  if (o.donePhase !== "done") throw new Error(`phase()=${o.donePhase} after finish("done")`);
  if (!o.doneCollapsed.includes("✓ rag-d (user)")) throw new Error(`no ✓ header: ${JSON.stringify(o.doneCollapsed.slice(0, 80))}`);
  if (o.doneCollapsed.includes(PENDING_ROW)) throw new Error("escape row still present after done");
  if (SPINNER.some((g) => o.doneCollapsed.includes(g))) throw new Error("spinner glyph still present after done");
  return "";
});

// ── 7. no private 2400-char tail (subprocessSmoke.ts:269,272 defect) ─────────
feature("R1b live delta NOT truncated to the old 2400-char tail", (o) => {
  if (o.zCount < 3000) throw new Error(`only ${o.zCount} of 3000 chars of the delta visible — 2400-truncation (or discard) persists`);
  return `3000/3000 chars visible`;
});

// ── 8. R6: tool_result_end ingested ──────────────────────────────────────────
feature("R6 canned tool_result_end ingested into single().messages", (o) => {
  if (o.n0 < 0 || o.n1 < 0) throw new Error("seam exposes no single() — cannot observe transcript");
  if (o.n1 !== o.n0 + 1) throw new Error(`messages ${o.n0} → ${o.n1} (expected +1)`);
  return `${o.n0} → ${o.n1} messages`;
});

// ── 9. R5: classic escaped frame via the EXISTING runVisibleSubagent path ────
// (already true today — run-smoke-child.mjs §5; proves THIS script's wiring)
try {
  const agent = spawn.loadAgentFile("rag-smoke.md");
  const stubCtx = {
    ui: {
      setWidget: () => {},
      setStatus: () => {},
      notify: () => {},
      onTerminalInput: () => () => {},
    },
  };
  let frame = null;
  const ctrl = new AbortController();
  ctrl.abort(); // pre-aborted → child SIGTERM'd at once, run not ok → escaped
  const visible = await smoke.runVisibleSubagent({
    prompt: "build a rectangle mesh in fedoo",
    ctx: stubCtx,
    timeoutMs: 30_000,
    label: "rag-smoke",
    agent,
    taskBody: spawn.buildSmokeTask("build a rectangle mesh in fedoo"),
    signal: ctrl.signal,
    appendFrame: (f) => { frame = f; },
  });
  check("R5 pre-aborted runVisibleSubagent → escaped frame (existing path)",
    visible.ok === false && visible.escaped === true && frame?.outcome === "escaped",
    `ok=${visible.ok} escaped=${visible.escaped} frame=${frame?.outcome ?? "null"} wall=${visible.wallMs}ms`);
  check("R5 escaped frame carries classic abort fields",
    frame?.single?.stopReason === "aborted" && frame.single.exitCode !== 0,
    `stopReason=${frame?.single?.stopReason} exitCode=${frame?.single?.exitCode}`);
  let escapedText = "";
  try { escapedText = flatten(renderResultFrame(frame.single, { expanded: false }, THEME)); }
  catch (e) { escapedText = `THREW ${e.message}`; }
  check("R5 classic escaped rendering ✗ … [aborted] + Error line",
    escapedText.includes("✗ rag-smoke (user) [aborted]") &&
      escapedText.includes("Error: aborted by user (escape)"),
    JSON.stringify(escapedText.split("\n").slice(0, 2).join(" | ")));
} catch (e) {
  check("R5 pre-aborted runVisibleSubagent → escaped frame (existing path)", false, `threw — ${e instanceof Error ? e.message : String(e)}`);
}

// ── 10. INTEGRATION (P2): live view INSIDE runVisibleSubagent (real child) ──
// Contract for the wiring under test:
//   • ONE live position only: the widget re-set on the SAME key at ticker
//     cadence (setExtensionWidget replaces the existing component in place —
//     harness interactive-mode.js:1853-1884) — no transcript spam mid-run;
//   • the classical result FRAME is appended exactly ONCE at the end
//     (appendSubagentFrame → pi.appendEntry); appendEntry is append-only with
//     NO update-in-place API (agent-session.js:2753-2759 →
//     session-manager.js:901-912 → entry_appended → addCustomEntryToChat
//     interactive-mode.js:2776-2781/3132-3148 builds a NEW component each
//     call), hence the live position cannot be an updated entry;
//   • expansion rides the harness Ctrl+O state: keybindings.js:37
//     ("app.tools.expand": ctrl+o) → interactive-mode.js:2458/3734-3735
//     (toggleToolOutputExpansion → toolOutputExpanded) → ctx.ui.getToolsExpanded
//     (types.d.ts:192-195, wired interactive-mode.js:2101). The Ctrl+O PUSH
//     cannot reach widget containers — setToolsExpanded loops only header +
//     loadedResourcesContainer + chatContainer (interactive-mode.js:3741-3747)
//     while widgetContainerAbove/Below are separate mount roots
//     (interactive-mode.js:691-698) — so the widget POLLS that state instead,
//     and the raw \x0f byte is never consumed (tui.js input-listener loop
//     passes unconsumed input on to the editor keybindings).
// Detection: everything below renders the captured setWidget factory with the
// stub theme — pre-wiring the factory hard-codes expanded:false, so I3 FAILS.
try {
  const I_PROMPT = "build a rectangle mesh in fedoo";
  const agent = spawn.loadAgentFile("rag-smoke.md");
  let toolsExpanded = false;
  let inputHandler = null;
  const widgetCalls = []; // every setWidget(key, content, options) in order
  const stub = {
    ui: {
      setWidget: (key, content, options) => { widgetCalls.push({ key, content, options }); },
      setStatus: () => {},
      notify: () => {},
      onTerminalInput: (h) => { inputHandler = h; return () => {}; },
      // ExtensionUIContext contract (types.d.ts:192-195); in the real TUI this
      // reads the very flag Ctrl+O flips (interactive-mode.js:2101, 3735).
      getToolsExpanded: () => toolsExpanded,
      setToolsExpanded: (v) => { toolsExpanded = !!v; },
    },
  };
  const iFrames = [];
  const runPromise = smoke.runVisibleSubagent({
    prompt: I_PROMPT, ctx: stub, timeoutMs: 30_000, label: "rag-smoke", agent,
    taskBody: spawn.buildSmokeTask(I_PROMPT),
    appendFrame: (f) => iFrames.push(f),
  });
  // Render the LAST captured widget factory — the exact object the harness
  // would invoke (setExtensionWidget calls the factory synchronously).
  const latestText = () => {
    for (let i = widgetCalls.length - 1; i >= 0; i--) {
      const content = widgetCalls[i].content;
      if (content === undefined) continue; // cleared (run over) → keep the LAST real factory (same closure → final state)
      try { return flatten(content(null, THEME)); }
      catch (e) { return `THREW ${e.message}`; }
    }
    return null;
  };
  const samples = []; // successive DISTINCT live-view snapshots (headless ticker read)
  // TIGHT sampler: the child boots ~1 s then emits its whole answer in ~38 ms,
  // and ALL growth of the collapsed view happens inside that burst — a 5 ms
  // interval (or any fixed window) can sleep past a 5–8 ms state and lose a
  // growth step. So read the widget factory on EVERY event-loop turn
  // (no sleep), dedupe consecutive duplicates, and bound the loop by the RUN'S
  // OWN COMPLETION (runPromise) plus a short drain — never by a fixed end-time.
  let lastSampled = null;
  const takeSample = () => {
    const text = latestText();
    if (text === null || text === lastSampled) return; // dedupe consecutive duplicates
    lastSampled = text;
    samples.push({ text, len: text.length, expanded: toolsExpanded });
  };
  takeSample(); // sampler STARTS at/before the first render (t≈0)
  let samplingDone = false;
  const sampler = (async () => {
    while (!samplingDone) {
      takeSample();
      await new Promise((r) => setImmediate(r)); // one sample per event-loop turn
    }
    for (let i = 0; i < 100; i++) { // short drain AFTER the run's completion
      takeSample();
      await new Promise((r) => setImmediate(r));
    }
  })();
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const icheck = (name, fn) => {
    try { const d = fn(); check(name, true, d || undefined); }
    catch (e) { check(name, false, `${e instanceof Error ? e.message : String(e)}`); }
  };

  const early = latestText(); // t≈0, child just spawned — running state
  await sleep(300);
  const collapsedMid = latestText();
  toolsExpanded = true; // ← harness Ctrl+O state ON (mid-run)
  const expandedMid = latestText();
  toolsExpanded = false; // ← Ctrl+O back OFF
  const collapsedBack = latestText();
  await sleep(150);
  const ctrlO = inputHandler ? inputHandler("\x0f") : "no-handler";

  const visible = await runPromise;
  samplingDone = true; // sampling bound = the run's own completion + short drain
  await sampler;

  icheck("I1 live view ≥3 STRICT growth steps mid-run (real rag-smoke child)", () => {
    if (samples.length < 3) throw new Error(`only ${samples.length} snapshots captured`);
    const lens = []; let prev = -1;
    for (const s of samples) if (s.len > prev) { lens.push(s.len); prev = s.len; }
    if (lens.length < 4) throw new Error(`only ${lens.length - 1} growth steps — lens ${lens.join(" < ")}`);
    return `${lens.length - 1} steps over ${samples.length} samples: ${lens.slice(0, 6).join(" < ")}${lens.length > 6 ? " < …" : ""}`;
  });

  icheck("I2 early snapshot carries running/pending marker + call header", () => {
    if (early === null || early.startsWith("THREW")) throw new Error(`no live snapshot — ${early}`);
    if (!early.includes("subagent rag-smoke [user]")) throw new Error("missing call header");
    if (!early.includes("escape cancels only the subagent")) throw new Error("missing pending row");
    if (!SPINNER.some((g) => early.includes(g))) throw new Error("missing spinner glyph");
    return `${early.length} chars`;
  });

  icheck("I3 mid-run expansion reachable: Ctrl+O state → lines(true) whole process", () => {
    for (const [name, v] of [["expandedMid", expandedMid], ["collapsedBack", collapsedBack]]) {
      if (v === null || v.startsWith("THREW")) throw new Error(`${name} unavailable — ${v}`);
    }
    if (!expandedMid.includes("─── Task ───")) throw new Error("expanded live view lacks ─── Task ─── (renderer never invoked expanded:true)");
    if (!expandedMid.includes(I_PROMPT)) throw new Error("expanded live view lacks the full task");
    if (!expandedMid.includes("escape cancels only the subagent")) throw new Error("expanded probe not taken mid-run (no pending row)");
    const excess = expandedMid.length - (collapsedMid ?? "").length;
    const ratio = expandedMid.length / Math.max(1, (collapsedMid ?? "").length);
    // calibrated on the real child: empty state +60 chars / 1.45×, mid-stream +60 / 1.43×
    if (excess < 50 || ratio < 1.2) throw new Error(`expanded +${excess} chars, ×${ratio.toFixed(2)} (${collapsedMid?.length} → ${expandedMid.length}) — not material`);
    if (collapsedBack.includes("─── Task ───")) throw new Error("collapse not honored (Task section still rendered)");
    if (collapsedBack.length >= expandedMid.length) throw new Error("collapsed back not shorter than expanded");
    return `collapsed ${(collapsedMid ?? "").length} < expanded ${expandedMid.length} (+${excess}, ×${ratio.toFixed(2)}); collapse → ${collapsedBack.length}`;
  });

  icheck("I4 raw Ctrl+O byte NOT swallowed (harness key keeps working)", () => {
    if (typeof inputHandler !== "function") throw new Error("onTerminalInput handler never registered");
    if (ctrlO && typeof ctrlO === "object" && ctrlO.consume === true)
      throw new Error(`handler consumed \\x0f — ${JSON.stringify(ctrlO)}`);
    if (typeof ctrlO === "string" && ctrlO.startsWith("THREW")) throw new Error(ctrlO);
    return ctrlO === undefined ? "passthrough (undefined)" : `passthrough ${JSON.stringify(ctrlO)}`;
  });

  icheck("I5 ONE live position + ONE final frame (no transcript spam)", () => {
    const keys = [...new Set(widgetCalls.map((c) => c.key))];
    if (keys.length !== 1) throw new Error(`${keys.length} widget keys: ${keys.join(",")}`);
    const last = widgetCalls[widgetCalls.length - 1];
    if (last.content !== undefined) throw new Error("live widget never cleared after run");
    if (visible.ok !== true) throw new Error(`run not ok — ${visible.note ?? "-"}`);
    if (iFrames.length !== 1) throw new Error(`${iFrames.length} frames appended (want 1)`);
    if (iFrames[0].outcome !== "done") throw new Error(`frame outcome=${iFrames[0].outcome}`);
    return `${widgetCalls.length} widget re-sets on '${keys[0]}', 1 frame done, wall=${visible.wallMs}ms`;
  });
} catch (e) {
  check("I1 live view ≥3 STRICT growth steps mid-run (real rag-smoke child)", false,
    `integration threw — ${e instanceof Error ? e.message : String(e)}`);
}

console.log("\n=== live-display pre-check (headless, canned events) ===");
console.log(results.join("\n"));
console.log(failed === 0 ? "\nALL PASS" : `\n${failed} CHECK(S) FAILED`);
process.exit(failed === 0 ? 0 : 1);