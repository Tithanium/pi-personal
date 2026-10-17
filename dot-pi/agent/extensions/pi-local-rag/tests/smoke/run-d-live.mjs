#!/usr/bin/env node
// run-d-live.mjs — proof-of-detection for the D-path LIVE display freeze
// (hook-spawned subagent `rag-d` shows only the static call header +
// `(no output)` + pending row, never grows, in a REAL interactive session).
//
// WHY EXISTING CHECKS MISS IT (headless ≠ real session):
//   * run-live-display.mjs renders with a no-op THEME stub whose arrow-function
//     `fg` ignores `this` — but the real pi `Theme.fg` reads `this.fgAnsi`
//     (dist/modes/interactive/theme/theme.js:202 `tokenAnsi`) and THROWS
//     `Cannot read properties of undefined (reading 'tokenAnsi')` when the
//     method is invoked detached (`subagentRender.ts:290/322` pass bare
//     `theme.fg`; the reference renderer passes `theme.fg.bind(theme)`,
//     extensions/subagent/index.ts:946/978/1061/1152);
//   * the smoke child has NO tools → no toolCall display item → the broken
//     call site is never reached; the D child (read/grep/find/ls/bash) emits a
//     toolCall message_end on its FIRST assistant turn → every later widget
//     frame throws inside the setWidget factory. The real harness invokes that
//     factory SYNCHRONOUSLY inside ctx.ui.setWidget (interactive-mode.js:1870
//     `component = content(this.ui, theme)`); the throw lands in
//     runVisibleSubagent.render()'s silent `catch {}` → the widget component
//     is never replaced → frozen first snapshot.
//
// WHAT THIS CHECK DOES (the D path, not the smoke path):
//   1. spawns a DETERMINISTIC fake pi CLI that emits the REAL captured D child
//      event shapes (rag-probe-raw.jsonl: message_start/update(toolcall_delta/
//      text_delta)/message_end with content part {type:"toolCall",id,name,
//      arguments} + usage, then agent_end);
//   2. drives `runSubprocessD` — the production D entry point — against a stub
//      ctx that executes the widget factory EXACTLY like the real harness
//      (synchronously, with the REAL pi Theme, stripped ANSI for comparison);
//   3. asserts the widget content GROWS frame-by-frame, renders the D tool
//      output, never throws out of the factory, and reports any render failure
//      through the `[pi-local-rag:live-render]` stderr tag (machine rule);
//   4. re-checks the R5 abort/escape contract + ONE final frame entry.
//
// Run: node tests/smoke/run-d-live.mjs   (cwd = extension dir)   exit 0 = pass
import { readFileSync, writeFileSync, unlinkSync, mkdirSync, rmSync } from "node:fs";
import { tmpdir, homedir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

// ── results plumbing (runner convention) ─────────────────────────────────────
const results = [];
let failed = 0;
const check = (name, pass, detail) => {
  results.push(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
  if (!pass) failed += 1;
};

// ── 1. DETERMINISTIC fake pi CLI: REAL D-child event shapes ─────────────────
// Shapes copied from the captured real stream (%TEMP%/rag-probe-raw.jsonl):
// assistant message_start carries usage/stopReason:"pending"; tool call deltas
// flow as message_update/assistantMessageEvent{type:"toolcall_*"}; the
// assistant message_end carries the content part {type:"toolCall",id,name,
// arguments}; deltas are message_update with text_delta; run ends at agent_end.
const FAKE_CLI = `import { writeSync, writeFileSync } from "node:fs";
const emit = (o) => writeSync(1, JSON.stringify(o) + "\\n");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const zeroUsage = () => ({ input: 0, output: 0, cacheRead: 0, cacheWrite: 0, totalTokens: 0, cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 } });
const PAYLOAD = [
  "# /rag compare — documented options (research payload)",
  "",
  "compare accepts the flags --top-k and --alpha as documented in the command reference; the guide adds that alpha blends BM25 and vector scores and top-k caps candidates".repeat(4),
  "",
  "### details",
  "- --alpha P (0..1) blends BM25 and vector ranking :: rag/guide.md:120",
  "- --top-k N caps candidates before the cross-encoder :: rag/guide.md:144",
  String.fromCharCode(96).repeat(3) + "\\n/rag compare --alpha 0.7 --top-k 20\\n" + String.fromCharCode(96).repeat(3),
].join("\\n");

// T1 argv capture: what the spawner REALLY invoked this child with.
try { writeFileSync(process.argv[1] + ".argv.json", JSON.stringify(process.argv)); } catch (e) {}
// Thinking stream helpers: the thinkmark file stamps Date.now() at the FIRST
// thinking delta (T2 latency anchor); THINK2 lines carry the unique "ORDLINE2"
// marker used by the T3 ordering assertion.
const THINK1 = "Step 1: locate the compare options in the corpus guides.";
const THINK2 = "ORDLINE2: second-pass verification before the next tool call.";
let markerDone = false;
const emitThinking = async (text, chunks, gapMs) => {
  for (let i = 0; i < text.length; i += chunks) {
    if (!markerDone) {
      markerDone = true;
      try { writeFileSync(process.argv[1] + ".thinkmark", String(Date.now())); } catch (e) {}
    }
    emit({ type: "message_update", usage: zeroUsage(), assistantMessageEvent: { type: "thinking_delta", contentIndex: 0, delta: text.slice(i, i + chunks) } });
    await sleep(gapMs);
  }
};

emit({ type: "agent_start" });
emit({ type: "turn_start" });
emit({ type: "message_start", message: { role: "assistant", content: [], api: "openai-completions", provider: "alan", model: "alan/qwen-3.8-27b", usage: zeroUsage(), stopReason: "pending", timestamp: Date.now() } });
// turn 1: reasoning THEN the tool call — real D first-turn shape
// (assistant message_end blocks = [thinking, toolCall]).
await emitThinking(THINK1, 14, 40);
emit({ type: "message_update", usage: zeroUsage(), assistantMessageEvent: { type: "toolcall_start", contentIndex: 0, id: "chatcmpl-tool-fake1", toolName: "grep" } });
emit({ type: "message_update", usage: zeroUsage(), assistantMessageEvent: { type: "toolcall_delta", contentIndex: 0, delta: "{\\"pattern\\": \\"compare|top-k|alpha\\"," } });
emit({ type: "message_update", usage: zeroUsage(), assistantMessageEvent: { type: "toolcall_delta", contentIndex: 0, delta: " \\"path\\": \\"C:/corpus/ref\\"}" } });
emit({ type: "message_update", usage: zeroUsage(), assistantMessageEvent: { type: "toolcall_end", contentIndex: 0 } });
emit({ type: "message_end", message: { role: "assistant", content: [{ type: "thinking", thinking: THINK1 }, { type: "toolCall", id: "chatcmpl-tool-fake1", name: "grep", arguments: { pattern: "compare|top-k|alpha", path: "C:/corpus/ref" } }], api: "openai-completions", provider: "alan", model: "alan/qwen-3.8-27b", usage: { input: 712, output: 41, cacheRead: 0, cacheWrite: 0, totalTokens: 753, cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 } }, stopReason: "toolUse", timestamp: Date.now() } });
await sleep(80);
// turn 2: DEVELOPING reasoning while turn-1's tool lines are already in the
// transcript — the T3 ordering window (the developing ✻ line must render
// ABOVE the → tool lines).
emit({ type: "turn_start" });
emit({ type: "message_start", message: { role: "assistant", content: [], api: "openai-completions", provider: "alan", model: "alan/qwen-3.8-27b", usage: zeroUsage(), stopReason: "pending", timestamp: Date.now() } });
await emitThinking(THINK2, 12, 65);
emit({ type: "message_end", message: { role: "assistant", content: [{ type: "thinking", thinking: THINK2 }, { type: "toolCall", id: "chatcmpl-tool-fake2", name: "read", arguments: { path: "C:/corpus/ref/guide.md" } }], api: "openai-completions", provider: "alan", model: "alan/qwen-3.8-27b", usage: { input: 780, output: 55, cacheRead: 0, cacheWrite: 0, totalTokens: 835, cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 } }, stopReason: "toolUse", timestamp: Date.now() } });
await sleep(80);
// turn 3: streamed final text (original shape)
emit({ type: "turn_start" });
emit({ type: "message_start", message: { role: "assistant", content: [], api: "openai-completions", provider: "alan", model: "alan/qwen-3.8-27b", usage: zeroUsage(), stopReason: "pending", timestamp: Date.now() } });
emit({ type: "message_update", usage: zeroUsage(), assistantMessageEvent: { type: "text_start", contentIndex: 0 } });
// slow streamed answer (16 ms cadence ≈ 2 s) so multiple 160 ms widget ticks observe growth
let sent = 0;
const STEP = 24;
while (sent < PAYLOAD.length) {
  const delta = PAYLOAD.slice(sent, sent + STEP);
  sent += STEP;
  emit({ type: "message_update", usage: { input: 900, output: Math.floor(sent / 4), cacheRead: 0, cacheWrite: 0, totalTokens: 900, cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 } }, assistantMessageEvent: { type: "text_delta", contentIndex: 0, delta } });
  await sleep(16);
}
emit({ type: "message_update", usage: zeroUsage(), assistantMessageEvent: { type: "text_end", contentIndex: 0 } });
emit({ type: "message_end", message: { role: "assistant", content: [{ type: "text", text: PAYLOAD }], api: "openai-completions", provider: "alan", model: "alan/qwen-3.8-27b", usage: { input: 900, output: 1700, cacheRead: 0, cacheWrite: 0, totalTokens: 2600, cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 } }, stopReason: "stop", timestamp: Date.now() } });
emit({ type: "turn_end" });
await sleep(30);
emit({ type: "agent_end" });
await sleep(30);
process.exit(0);
`;
const fakeCli = join(tmpdir(), `pi-fake-d-${process.pid}.mjs`);
writeFileSync(fakeCli, FAKE_CLI, "utf-8");
process.on("exit", () => {
  for (const f of [fakeCli, fakeCli + ".argv.json", fakeCli + ".thinkmark"]) {
    try { unlinkSync(f); } catch { /* best effort */ }
  }
});
// resolvePiInvocation(): PI_CLI_PATH wins (spawnRagSubagent.ts resolvePiInvocation)
process.env.PI_CLI_PATH = fakeCli;

// ── 2. REAL pi theme (what the real harness passes to the widget factory) ────
const pkg = join(homedir(), "AppData", "Roaming", "npm", "node_modules",
  "@earendil-works", "pi-coding-agent");
let realTheme = null;
try {
  const pc = await import("@earendil-works/pi-coding-agent"); // resolves from extension dir
  pc.initTheme("dark");
  const themeMod = await import(pathToFileURL(join(pkg, "dist", "modes", "interactive", "theme", "theme.js")).href);
  themeMod.initTheme("dark");
  realTheme = themeMod.theme;
  check("real pi theme loaded (Theme.fg bound to this)", typeof realTheme?.fg === "function");
} catch (e) {
  check("real pi theme loaded (Theme.fg bound to this)", false, String(e));
}

let strip, smoke, spawn, dmod, StdinBuffer, renderResultFrame;
try {
  ({ stripTerminalSequences: strip, StdinBuffer } = await import("@earendil-works/pi-tui"));
  smoke = await import("../../subprocessSmoke.ts");
  ({ renderResultFrame } = await import("../../subagentRender.ts"));
  spawn = await import("../../spawnRagSubagent.ts");
  dmod = await import("../../subprocessD.ts");
  check("imports — subprocessD/subprocessSmoke/spawnRag headless", true);
} catch (e) {
  check("imports — subprocessD/subprocessSmoke/spawnRag headless", false, String(e));
}

// ── 3. capture the runner's stderr log lines (machine rule: render errors
//       must be REPORTED with the [pi-local-rag:live-render] tag) ─────────────
const errLog = [];
const origErrWrite = process.stderr.write.bind(process.stderr);
process.stderr.write = (chunk, ...rest) => {
  errLog.push(String(chunk));
  return origErrWrite(chunk, ...rest);
};

// ── 4. stub ctx — EXACT real-harness widget semantics ────────────────────────
// interactive-mode.js setExtensionWidget: content is a factory → invoked
// SYNCHRONOUSLY with (this.ui, theme) (line ~1870); a throw propagates back to
// the extension caller (runVisibleSubagent's render() try/catch). We record
// every committed frame's rendered text and every factory throw.
const WIDGET_TAG = "[pi-local-rag:live-render]";
const widgetHistory = [];   // committed widget frames (rendered, ANSI-stripped)
const factoryThrows = [];   // factory invocations that threw (freeze detector)
let lastInputHandler = null; // runner's onTerminalInput listener (D7/D8 input probes)
// ctx.model STUB (this round): the real ExtensionContext.model accessor
// (core/extensions/types.d.ts:227 `model: Model<any> | undefined`). Only the
// TEST provides it — intentionally a provider/id DISTINCT from D_MODEL so the
// argv assertion proves the SESSION model drove the spawn, not the hard-code.
const STUB_MODEL = { provider: "stubprov", id: "session-stub", reasoning: true };
const makeCtx = () => {
  const ui = {
    setWidget: (key, content, options) => {
      if (content === undefined) {
        widgetHistory.push({ text: null, t: Date.now() }); // widget cleared (end of run)
        return;
      }
      try {
        const comp = content(ui, realTheme); // real harness call signature
        const text = comp.render(110).map((l) => strip(l).trimEnd()).join("\n");
        widgetHistory.push({ text, t: Date.now() });
      } catch (e) {
        factoryThrows.push(e instanceof Error ? e.message : String(e));
        throw e; // real harness does NOT catch — the extension must
      }
    },
    setStatus: () => {},
    notify: () => {},
    onTerminalInput: (h) => { lastInputHandler = h; return () => {}; },
    getToolsExpanded: () => false,
    setToolsExpanded: () => {},
  };
  return { ui, model: STUB_MODEL };
};
const ctx = makeCtx();

// ── 5. drive the PRODUCTION D path ───────────────────────────────────────────
const PROMPT = "List every documented option of /rag compare (file:line citations).";
let frame = null;
let res = null;
try {
  res = await dmod.runSubprocessD({
    prompt: PROMPT,
    ctx,
    trackedPaths: ["C:/corpus/ref"],
    timeoutMs: 30_000,
    appendFrame: (f) => { frame = f; },
  });
} catch (e) {
  check("runSubprocessD completed without throwing", false, String(e));
}
process.stderr.write = origErrWrite; // restore capture

// ── 6. assertions ────────────────────────────────────────────────────────────
const texts = widgetHistory.map((h) => h.text).filter((t) => t !== null);
const growthSteps = (() => {
  let prevMax = -1;
  let n = 0;
  const lens = [];
  for (const t of texts) {
    const len = t.length;
    if (len > prevMax) { n++; prevMax = len; lens.push(len); }
  }
  return { n, lens };
})();
const logLines = errLog.join("");
const tagCount = (logLines.match(new RegExp(WIDGET_TAG.replace(/[[\]]/g, "\\$&"), "g")) ?? []).length;

check("D1 live widget GROWS on the D path (real theme, D event shapes)", growthSteps.n >= 4,
  growthSteps.n >= 4
    ? `${growthSteps.n - 1} growth steps over ${texts.length} committed frames: ${growthSteps.lens.slice(0, 6).join(" < ")}${growthSteps.lens.length > 6 ? " < …" : ""}`
    : `FROZEN — only ${growthSteps.n} growing frame(s) of ${texts.length} committed: lengths ${growthSteps.lens.join(" < ")} — widget stays at its first snapshot like the reported session`);

check("D2 no factory render throw (a throw = frozen widget in the real TUI)", factoryThrows.length === 0,
  factoryThrows.length === 0
    ? undefined
    : `${factoryThrows.length}× factory threw, first: ${JSON.stringify(factoryThrows[0])}`);

check("D3 first frame self-describing: call header + prompt + pending row", (() => {
  const t = texts[0] ?? "";
  return t.includes("subagent rag-d [user]") && t.includes(PROMPT.slice(0, 40)) &&
    t.includes("escape cancels only the subagent");
})(), JSON.stringify((texts[0] ?? "").split("\n").map(s => s.slice(0, 60)).join(" | ").slice(0, 160)));

check("D4 mid-run frames carry D tool output + growing text (NOT `(no output)`)", (() => {
  const withTool = texts.find((t) => t.includes("→ grep") && t.includes("compare|top-k|alpha"));
  const withText = texts.find((t) => t.includes("/rag compare — documented options"));
  return !!withTool && !!withText;
})(), (() => {
  const withTool = texts.findIndex((t) => t.includes("→ grep"));
  const withText = texts.findIndex((t) => t.includes("documented options"));
  return `→ grep frame #${withTool}, text frame #${withText}, no-output frames ${texts.filter((t) => t.includes("(no output)")).length}/${texts.length}`;
})());

check("D5 done: ok + payload + ONE frame + widget cleared (final single frame kept)",
  res?.ok === true && typeof res?.content === "string" && res.content.includes("/rag compare") &&
  frame?.outcome === "done" && frame?.single?.messages?.length > 0 &&
  widgetHistory[widgetHistory.length - 1]?.text === null,
  `ok=${res?.ok} outcome=${frame?.outcome ?? "null"} msgs=${frame?.single?.messages?.length ?? 0} note=${res?.note ?? "-"}`);

check("D6 every factory throw is REPORTED with the live-render tag on stderr",
  factoryThrows.length === 0 || tagCount >= factoryThrows.length,
  factoryThrows.length === 0
    ? `no throws; tag lines=${tagCount}`
    : `${factoryThrows.length} throws vs ${tagCount} logged "${WIDGET_TAG}" line(s) — silent swallow`);

// ── 6b. THINKING SUITE T0–T5 — the METHOD-D reasoning gap ───────────────────
// Real-child evidence this guards (live-display.log, 2026-10-16 real runs
// 17:56:14 / 17:57:58 / 18:00:44 + capture-before.raw.jsonl): assistant
// message_end blocks arrived as ONLY [toolCall…]/[text] and ZERO
// thinking/reasoning events reached the panel. Root cause chain: pi only sends
// thinking when models.json declares the capability AND the spawn passes
// --thinking (openai-completions: `compat.thinkingFormat==="qwen" &&
// model.reasoning`), and the child-only before_provider_request hook in
// index.ts forced chat_template_kwargs.enable_thinking=false (the field the
// ALAN gateway actually honors). T-suite asserts the request side (T0/T1),
// the live panel side (T2/T3), the final render (T4) and the permanent trace
// (T5).
const T_THINK1 = "Step 1: locate the compare options in the corpus guides.";
const T_THINK2 = "ORDLINE2: second-pass verification before the next tool call.";
const readOpt = (p) => { try { return readFileSync(p, "utf8"); } catch { return null; } };
const renderFrameText = (single, expanded) => {
  const comp = renderResultFrame(single, { expanded }, realTheme);
  return comp.render(110).map((l) => strip(l).trimEnd()).join("\n");
};
let modelsDoc = null;
try { modelsDoc = JSON.parse(readFileSync(join(homedir(), ".pi", "agent", "models.json"), "utf8").replace(/^\uFEFF/, "")); } catch { /* reported below */ }
{
  const qwen = modelsDoc?.providers?.alan?.models?.find((m) => m?.id === "qwen-3.8-27b");
  const compat = modelsDoc?.providers?.alan?.compat;
  check("T0 D model declares the reasoning capability + no reasoning_effort (400-class) leak",
    qwen?.reasoning === true && compat?.supportsReasoningEffort === false,
    `reasoning=${qwen?.reasoning} compat=${JSON.stringify(compat)} — pi gates thinking on model.reasoning (getSupportedThinkingLevels → [\"off\"] otherwise) and the gateway rejects reasoning_effort=high with HTTP 400`);
  const idxSrc = readOpt(join(homedir(), ".pi", "agent", "extensions", "pi-local-rag", "index.ts")) ?? "";
  check("T0b child hook gates the thinking suppression on the request (not unconditional)",
    /enable_thinking[\s\S]{0,120}true/.test(idxSrc) && idxSrc.includes("enable_thinking: false"),
    idxSrc.includes("enable_thinking: true") ? "hook both honors requested thinking AND keeps the default suppression" : "index.ts still forces chat_template_kwargs.enable_thinking=false unconditionally for every child");
}
{
  const argv = readOpt(fakeCli + ".argv.json");
  const hasFlag = !!argv && argv.includes("--thinking") && argv.includes("high");
  check("T1 D spawn passes --thinking to the child (argv recorded by the fake CLI)", hasFlag,
    argv ? `argv=${JSON.stringify(JSON.parse(argv).slice(1, 14))}` : "no .argv.json written by the child");
}
{
  const markAt = Number(readOpt(fakeCli + ".thinkmark") ?? 0);
  const idx = widgetHistory.findIndex((h, i) => i > 0 && !!h.text && h.text.includes("✻") && widgetHistory[i - 1].text !== h.text);
  const h = idx >= 0 ? widgetHistory[idx] : null;
  const dt = h && markAt ? h.t - markAt : NaN;
  check("T2 collapsed live view shows ✻ and CHANGES within ≤490 ms of the first thinking delta",
    !!h && Number.isFinite(dt) && dt >= 0 && dt <= 490,
    h ? `first ✻ frame #${idx} at +${dt} ms after thinkmark (changed=${h.text !== widgetHistory[idx - 1].text})` : `markAt=${markAt || "missing"} — no ✻ frame captured`);
}
{
  const orderFrames = widgetHistory.filter((h) => h.text && h.text.includes("ORDLINE2"));
  let ok = false; let detail = `no frame with developing ORDLINE2 line (${orderFrames.length} candidates)`;
  for (const f of orderFrames) {
    const lines = f.text.split("\n");
    const i = lines.findIndex((l) => l.includes("ORDLINE2"));
    const j = lines.findIndex((l) => l.includes("→ grep") || l.includes("→ read"));
    if (i >= 0 && j >= 0 && i < j) { ok = true; detail = `✻ line ${i} above tool line ${j} (frame ${f.text.length} chars)`; break; }
    if (i >= 0 && j >= 0) detail = `REGRESSION: developing ✻ line at ${i} BELOW tool line ${j}`;
  }
  check("T3 developing ✻ reasoning line renders ABOVE the tool lines (live collapsed)", ok, detail);
}
{
  const msgs = frame?.single?.messages ?? [];
  const blockMsg = msgs.find((m) => Array.isArray(m.content) && m.content[0]?.type === "thinking" && m.content[1]?.type === "toolCall");
  let collapsed = ""; let expanded = "";
  try { collapsed = renderFrameText(frame.single, false); expanded = renderFrameText(frame.single, true); } catch (e) { collapsed = `THREW ${e}`; }
  check("T4 final frame renders message_end [thinking,toolCall]: collapsed ✻ + expanded ─── Reasoning ───",
    !!blockMsg && collapsed.includes("✻") && expanded.includes("─── Reasoning ───") &&
      expanded.includes(T_THINK1.split(":")[0]) && expanded.includes("→ "+"grep"),
    blockMsg
      ? `blocks=[${blockMsg.content.map((p) => p.type).join(",")}] collapsed✅=${collapsed.includes("✻")} reasoningSection=${expanded.includes("─── Reasoning ───")}`
      : `no [thinking,toolCall] message_end among ${msgs.length} stored messages`);
}
{
  const traceTail = readOpt(join(homedir(), ".pi", "rag", "logs", "live-display.log")) ?? "";
  // Only lines AFTER this run's own `run start` marker count (stale history
  // from earlier runs of this suite must not satisfy the check).
  const runStart = traceTail.lastIndexOf("run start label=rag-d");
  const tail = runStart >= 0 ? traceTail.slice(runStart) : "";
  const hit = tail.lastIndexOf("role=assistant blocks=2 [thinking,toolCall]");
  check("T5 permanent trace logs the assistant block TYPE LIST (blocks=2 [thinking,toolCall])",
    hit > -1,
    hit > -1 ? `found after run start (tail ${tail.length} chars)` : "no block-type list after THIS run start — step-1 trace missing");
}

// ── 6c. USER CONTROLS: /rag effort [level] + SESSION-MODEL default ──────────
// Required seams (this round), stubbed ONLY here in the harness:
//   U1 spawn argv carries the SESSION model (ctx.model) — precedence
//      opts.model > ctx.model > D_MODEL;
//   U2 trace `run start` gained model=… thinking=… (extend, not replace);
//   U3 index.ts wires config.ragThinkingLevel into runSubprocessD + has the
//      /rag effort branch (the /rag reasoning command is REMOVED); config.ts
//      carries the schema-typed default;
//   U4/U5 ragThinkingLevel default "high" + save/load round-trip (TEMP
//      PI_RAG_DIR — the live ~/.pi/rag config is never touched);
//   U7–U10 resolveReasoning reducer: bogus → error listing the valid enum
//      for the model the next D run uses; off|HIGH → set + model-named
//      confirmation; no arg → current + supported in one line;
//   U6 config "off" → spawn argv reflects `--thinking off`.
{
  const argvMain = (() => { try { return JSON.parse(readOpt(fakeCli + ".argv.json") ?? ""); } catch { return null; } })();
  check("U1 D spawn argv carries the SESSION model (ctx.model), not D_MODEL",
    Array.isArray(argvMain) && argvMain.includes("--model") && argvMain.includes("stubprov/session-stub") &&
      !argvMain.includes("alan/qwen-3.8-27b"),
    argvMain ? `argv=${JSON.stringify(argvMain.slice(1, 16))}` : "no .argv.json written by the child");

  const traceLog = readOpt(join(homedir(), ".pi", "rag", "logs", "live-display.log")) ?? "";
  const rsIdx = traceLog.lastIndexOf("run start label=rag-d");
  const rsLine = rsIdx >= 0 ? traceLog.slice(rsIdx, traceLog.indexOf("\n", rsIdx)) : "";
  check("U2 trace `run start` extended with model=… thinking=… (line carries both)",
    /model=\S+/.test(rsLine) && /thinking=\S+/.test(rsLine) &&
      rsLine.includes("stubprov/session-stub") && rsLine.includes("thinking=high"),
    JSON.stringify(rsLine.slice(0, 240)));

  {
    const extDir = join(homedir(), ".pi", "agent", "extensions", "pi-local-rag");
    const idxSrc2 = readOpt(join(extDir, "index.ts")) ?? "";
    const cfgSrc = readOpt(join(extDir, "config.ts")) ?? "";
    // REMOVAL round (user decision): `/rag reasoning` is GONE — `/rag effort`
    // is the ONLY interface editing ragThinkingLevel (bare = picker, arg form
    // `/rag effort <level>`). Fail-first: this check FAILED while the old
    // `cmd === "reasoning"` branch still existed in index.ts.
    const reasoningGone = !/cmd === "reasoning"/.test(idxSrc2);
    const hasCmd = /cmd === "effort"/.test(idxSrc2);
    const hasWiring = idxSrc2.includes("thinkingLevel: config.ragThinkingLevel");
    const hasSave = idxSrc2.includes("ragThinkingLevel = outcome.level");
    const hasDefault = /ragThinkingLevel:\s*"high"/.test(cfgSrc);
    check("U3 /rag effort branch wired (reasoning command REMOVED): command + config pass-through + save + default \"high\"",
      reasoningGone && hasCmd && hasWiring && hasSave && hasDefault,
      `reasoning-gone=${reasoningGone} cmd=${hasCmd} thinkingLevel-pass=${hasWiring} save=${hasSave} config-default=${hasDefault}`);
  }

  {
    const rr = typeof dmod.resolveReasoning === "function" ? dmod.resolveReasoning : null;
    const MODEL_ID = "stubprov/session-stub";
    let supported = null;
    let supportedErr = "";
    try {
      const ai = await import("@earendil-works/pi-ai");
      supported = [...ai.getSupportedThinkingLevels({ reasoning: true })];
    } catch (e) {
      // harness-only fallback so the checks still produce a LISTED failure
      supported = ["off", "minimal", "low", "medium", "high"];
      supportedErr = ` (${e})`;
    }
    check("U7 resolveReasoning exported by subprocessD.ts",
      !!rr, `supported(real enum, reasoning model)=${supported.join(", ")}${supportedErr}`);
    if (rr) {
      const bad = rr("bogus", supported, "high", MODEL_ID);
      check("U8 /rag effort bogus → CLEAR error listing every valid level + model",
        bad.kind === "error" && bad.line.includes("bogus") &&
          supported.every((l) => bad.line.includes(l)) && bad.line.includes(MODEL_ID),
        JSON.stringify(bad));
      const s1 = rr("off", supported, "high", MODEL_ID);
      const s2 = rr("HIGH", supported, "high", MODEL_ID);
      check("U9 off|HIGH accepted case-insensitively → set + confirmation naming the model",
        s1.kind === "set" && s1.level === "off" && s2.kind === "set" && s2.level === "high" &&
          typeof s1.line === "string" && s1.line.includes("off") && s1.line.includes(MODEL_ID),
        JSON.stringify({ s1, s2 }));
      const show = rr(undefined, supported, "high", MODEL_ID);
      check("U10 /rag effort (no arg) → current level + supported enum, one line",
        show.kind === "show" && show.line.includes("high") &&
          supported.every((l) => show.line.includes(l)) && show.line.includes(MODEL_ID),
        JSON.stringify(show?.line ?? show));
    } else {
      check("U8 /rag effort bogus → CLEAR error listing every valid level + model", false, "resolveReasoning missing (pre-fix)");
      check("U9 off|HIGH accepted case-insensitively → set + confirmation naming the model", false, "resolveReasoning missing (pre-fix)");
      check("U10 /rag effort (no arg) → current level + supported enum, one line", false, "resolveReasoning missing (pre-fix)");
    }
  }

  // U4/U5/U6 — config schema + round-trip + the OFF spawn, all in a TEMP store.
  {
    const prevDir = process.env.PI_RAG_DIR;
    const tmpCfgDir = join(tmpdir(), `pi-rag-cfg-${process.pid}`);
    process.env.PI_RAG_DIR = tmpCfgDir;
    try {
      mkdirSync(tmpCfgDir, { recursive: true });
      // Seed the file WITH a BOM (the live config.json shape — R5 lesson).
      writeFileSync(join(tmpCfgDir, "config.json"), "\uFEFF{}", "utf8");
      const cmod = await import("../../config.ts");
      const fresh = cmod.loadConfig();
      const schemaOk = fresh.ragThinkingLevel === "high";
      check("U4 config schema: fresh load carries ragThinkingLevel default \"high\" (BOM file)",
        schemaOk, `ragThinkingLevel=${JSON.stringify(fresh.ragThinkingLevel)}`);
      fresh.ragThinkingLevel = "off";
      cmod.saveConfig(fresh);
      const reloaded = cmod.loadConfig();
      const bomKept = readFileSync(join(tmpCfgDir, "config.json"), "utf8").startsWith("\uFEFF");
      check("U5 config round-trip: ragThinkingLevel=off survives save/load, BOM preserved",
        reloaded.ragThinkingLevel === "off" && bomKept,
        `reloaded=${JSON.stringify(reloaded.ragThinkingLevel)} bom=${bomKept}`);
      // (b) spawn with the value AS LOADED FROM CONFIG — the production wiring
      // shape (index.ts passes config.ragThinkingLevel into runSubprocessD).
      await dmod.runSubprocessD({
        prompt: PROMPT,
        ctx: makeCtx(),
        trackedPaths: ["C:/corpus/ref"],
        timeoutMs: 30_000,
        thinkingLevel: cmod.loadConfig().ragThinkingLevel,
      });
      const argvOff = (() => { try { return JSON.parse(readOpt(fakeCli + ".argv.json") ?? ""); } catch { return null; } })();
      check("U6 config off → spawn argv carries `--thinking off` (always emitted, never omitted)",
        schemaOk && Array.isArray(argvOff) && argvOff.includes("--thinking") && argvOff.includes("off"),
        argvOff
          ? `argv=${JSON.stringify(argvOff.slice(1, 16))}${schemaOk ? "" : " — schema key missing (config default absent)"}`
          : "no .argv.json written by the child");
    } catch (e) {
      check("U4/U5/U6 config round-trip + off-spawn block", false, String(e));
    } finally {
      if (prevDir === undefined) delete process.env.PI_RAG_DIR;
      else process.env.PI_RAG_DIR = prevDir;
      try { rmSync(tmpCfgDir, { recursive: true, force: true }); } catch { /* best effort */ }
    }
  }
}

// ── 7. R5 abort/escape contract (kept by the fix) ────────────────────────────
try {
  const escFrame = { out: null };
  const ctrl = new AbortController();
  ctrl.abort(); // pre-aborted → child SIGTERM'd at once → escaped (run-live-display R5 pattern)
  const esc = await smoke.runVisibleSubagent({
    prompt: PROMPT,
    ctx: makeCtx(),
    timeoutMs: 30_000,
    label: "rag-d",
    agent: { systemPrompt: dmod.buildDSystemPrompt(["C:/corpus/ref"]), tools: dmod.D_TOOLS, model: dmod.D_MODEL, filePath: "" },
    taskBody: dmod.buildDTask(PROMPT),
    signal: ctrl.signal,
    appendFrame: (f) => { escFrame.out = f.outcome; },
  });
  check("R5 escape: pre-aborted D run → escaped=false ok + escaped frame (no injection)",
    esc.ok === false && esc.escaped === true && escFrame.out === "escaped",
    `ok=${esc.ok} escaped=${esc.escaped} frame=${escFrame.out}`);
} catch (e) {
  check("R5 escape: pre-aborted D run → escaped=false ok + escaped frame (no injection)", false, String(e));
}

// ── 8. ROUND-3: a lone-\u001b INPUT sequence killed live runs at +1.5 s ──────
// HARD EVIDENCE (real trace):
//   live-display.log 17:30:43.366 `run start` → 17:30:44.834 toolcall_start →
//   17:30:44.911 LAST toolcall_delta → 17:30:44.935 `last=escaped` — the run
//   (pid=20688, current HEAD, NO caller signal: the D path passes none,
//   subprocessD.ts / index.ts:216-222) died 1.5 s in, mid-first-toolcall.
// MWE (temp folder, real pi-tui StdinBuffer) proved WHICH trigger: of
// ENTER/printable/chunked-arrow/Ctrl+O NOTHING aborts (all done); only an input
// sequence `"\u001b"` escapes. pi-tui's StdinBuffer COMMITS a lone "\u001b" —
// flushed after its 10 ms escape timeout — as the PREFIX of an ESC sequence
// split across two stdin reads (itself documenting this: stdin-buffer.js:4-10
// "Event 1: \x1b / Event 2: [<35 …"), so an innocent arrow/Home/paste at +1.5 s
// ends as `escaped` with "subagent cancelled by escape" — user-visible failure.
// Chain under test = exactly MWE S5: raw bytes → REAL StdinBuffer → listener.
try {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const driveRealInput = async (rawBytes, delayMs) => {
    const t0d = Date.now();
    while (!lastInputHandler) { if (Date.now() - t0d > 5000) throw new Error("onTerminalInput handler never registered"); await sleep(5); }
    while (Date.now() - t0d < delayMs) await sleep(5);
    const sb = new StdinBuffer(); // the very reassembly the live TUI runs
    sb.on("data", (d) => lastInputHandler(d));
    if (Array.isArray(rawBytes)) {
      sb.process(rawBytes[0]);
      await sleep(rawBytes[1]); // > StdinBuffer's 10 ms escape timeout → lone ESC flush
      sb.process(rawBytes[2]);
    } else {
      sb.process(rawBytes);
    }
    return Date.now() - t0d;
  };

  // D7: split sequence — user presses an arrow key MID-RUN; the ESC prefix is
  // flush-committed as a lone "\u001b" 10 ms later. PRE-FIX the runner aborts
  // immediately → outcome=escaped (the regression). POST-FIX: the follow-up tail
  // cancels the pending escape → the run must SURVIVE and finish done.
  lastInputHandler = null; // only this run's handler
  const d7Frames = [];
  // fake child lives ≈1.2 s end-to-end → feed MID-RUN (the MWE proves the exact
  // +1.5 s fidelity separately); the check reproduces the input class: a key
  // pressed while the child is mid-stream.
  const p7 = dmod.runSubprocessD({
    prompt: PROMPT, ctx: makeCtx(), trackedPaths: ["C:/corpus/ref"], timeoutMs: 30_000,
    appendFrame: (f) => d7Frames.push(f),
  });
  const fedAt = await driveRealInput(["\u001b", 25, "[A"], 600);
  const r7 = await p7;
  check("D7 split-sequence input (arrow key mid-run) does NOT kill the live run",
    r7.ok === true && r7.escaped === false && d7Frames[0]?.outcome === "done",
    `fed@+${fedAt}ms → ok=${r7.ok} escaped=${r7.escaped} outcome=${d7Frames[0]?.outcome ?? "null"} childWall=${r7.wallMs}ms${r7.escaped ? "  ← REGRESSION: lone-ESC flush of a split key aborts the run (live-display.log 17:30:44.935)" : ""}`);

  // D8: a GENUINE lone Escape (no follow-up input) must still cancel the
  // subagent only → escaped (the user-validated gate; guard rail next to R5).
  lastInputHandler = null;
  const d8Frames = [];
  const p8 = dmod.runSubprocessD({
    prompt: PROMPT, ctx: makeCtx(), trackedPaths: ["C:/corpus/ref"], timeoutMs: 30_000,
    appendFrame: (f) => d8Frames.push(f),
  });
  const fed8 = await driveRealInput("\u001b", 600);
  const r8 = await p8;
  check("D8 genuine lone Escape still cancels ONLY the subagent (escape gate kept)",
    r8.ok === false && r8.escaped === true && d8Frames[0]?.outcome === "escaped",
    `fed@+${fed8}ms → escaped=${r8.escaped} outcome=${d8Frames[0]?.outcome ?? "null"} childWall=${r8.wallMs}ms`);
} catch (e) {
  check("D7 split-sequence input (arrow key mid-run) does NOT kill the live run", false, `threw — ${e instanceof Error ? e.message : String(e)}`);
}

console.log("\n=== d-live pre-check (D path, real theme, D-shaped child stream) ===");
console.log(results.join("\n"));
console.log(failed === 0 ? "\nALL PASS" : `\n${failed} CHECK(S) FAILED`);
process.exit(failed === 0 ? 0 : 1);
