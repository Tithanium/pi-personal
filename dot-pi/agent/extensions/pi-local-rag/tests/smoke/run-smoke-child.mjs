#!/usr/bin/env node
/**
 * run-smoke-child.mjs — headless pre-check of the SMOKE subagent child
 * (goal "process in service", step 1). Validates the SAME spawn path the
 * production hook uses (subprocessSmoke.ts → spawnRagSubagent) WITHOUT the
 * harness UI, so failures surface before an interactive session:
 *
 *   1. agents/rag-smoke.md loads (frontmatter parse, tools: [] → --no-tools);
 *   2. the child answers ONE line starting with "SMOKE OK";
 *   3. it answers RAPIDLY (< 10 s wall, incl. child pi boot);
 *   4. abort wiring: a pre-aborted signal marks the run aborted, ok=false.
 *
 * Escape-in-the-harness (requirement 2) can only be validated INTERACTIVELY
 * in a real TUI session — see the checklist in the goal report.
 *
 * Usage:  node tests/smoke/run-smoke-child.mjs
 * Exit 0 = all checks passed.
 */
import { existsSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

// Pin the SAME global pi the main session runs (runner convention, run-d.mjs).
const cli = join(homedir(), "AppData", "Roaming", "npm", "node_modules",
  "@earendil-works", "pi-coding-agent", "dist", "bundle", "cli.js");
if (!process.env.PI_CLI_PATH && existsSync(cli)) process.env.PI_CLI_PATH = cli;

const { spawnRagSubagent, loadAgentFile, allocateRagTmpFile, buildSmokeTask } =
  await import("../../spawnRagSubagent.ts");

const PROMPT = "build a rectangle mesh in fedoo";
const results = [];
let failed = 0;
const check = (name, pass, detail) => {
  results.push(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
  if (!pass) failed += 1;
};

// ── 1. agent file loads, no tools ────────────────────────────────────────────
let agent;
try {
  agent = loadAgentFile("rag-smoke.md");
  check("agent loads", true, `tools=[${agent.tools.join(",")}] model=${agent.model ?? "(default)"}`);
  check("agent has NO tools (fast single round)", agent.tools.length === 0);
} catch (err) {
  check("agent loads", false, String(err));
  console.log(results.join("\n"));
  process.exit(1);
}

// ── 2+3. clean run: starts, answers fast ────────────────────────────────────
const run = await spawnRagSubagent({
  prompt: PROMPT,
  tmpPath: allocateRagTmpFile(),
  timeoutMs: 30_000,
  agent,
  taskBody: buildSmokeTask(PROMPT),
});
check("child completed (agent_end, ok)", run.ok,
  `${run.wallMs} ms, exit=${run.exitCode}, err=${run.errorMessage ?? "-"}`);
check("answer starts with SMOKE OK", (run.finalText ?? "").trimStart().startsWith("SMOKE OK"),
  JSON.stringify((run.finalText ?? "").slice(0, 80)));
check("answers rapidly (< 10 s wall)", run.wallMs < 10_000, `${run.wallMs} ms`);

// ── 4. abort wiring (the escape-cancels-subagent-only mechanism) ────────────
const ctrl = new AbortController();
ctrl.abort(); // pre-aborted: child must be killed immediately, run not ok
const aborted = await spawnRagSubagent({
  prompt: PROMPT,
  tmpPath: allocateRagTmpFile(),
  timeoutMs: 30_000,
  agent,
  taskBody: buildSmokeTask(PROMPT),
  signal: ctrl.signal,
});
check("pre-aborted signal → run.aborted", aborted.aborted === true, `ok=${aborted.ok}`);
check("aborted run is NOT ok (no injection possible)", aborted.ok === false,
  `wallMs=${aborted.wallMs}`);

// ── 5. visible runner: panel headless + classical-subagent RESULT frame ────
const { runVisibleSubagent } = await import("../../subprocessSmoke.ts");
const stubCtx = {
  ui: {
    setWidget: () => {},
    setStatus: () => {},
    notify: () => {},
    onTerminalInput: () => () => {},
  },
};

let frameDone = null;
const visible = await runVisibleSubagent({
  prompt: PROMPT,
  ctx: stubCtx,
  timeoutMs: 30_000,
  label: "rag-smoke",
  agent,
  taskBody: buildSmokeTask(PROMPT),
  appendFrame: (f) => { frameDone = f; },
});
check("visible runner completes headless (ui stubbed)", visible.ok === true, `wallMs=${visible.wallMs}`);
check("result frame emitted (outcome=done)", frameDone !== null && frameDone.outcome === "done",
  `frame=${frameDone ? frameDone.outcome : "null"}`);
const doneMsgs = frameDone?.single?.messages ?? [];
const doneAssistantText = doneMsgs.find((m) => m.role === "assistant" && Array.isArray(m.content)
  && m.content.some((b) => b.type === "text"))?.content?.find((b) => b.type === "text")?.text ?? "";
check("frame carries the classical SingleResult messages",
  doneMsgs.length >= 1 && doneAssistantText.trimStart().startsWith("SMOKE OK"),
  `messages=${doneMsgs.length} firstText=${JSON.stringify(doneAssistantText.slice(0, 40))}`);
check("frame payload/agent/task/usage complete for the classical renderer",
  frameDone?.payload?.trimStart().startsWith("SMOKE OK") &&
  frameDone?.single?.agent === "rag-smoke" && (frameDone.single.usage?.turns ?? 0) >= 1 &&
  frameDone?.task === PROMPT && typeof frameDone.single.model === "string",
  `agent=${frameDone?.single?.agent} turns=${frameDone?.single?.usage?.turns} model=${frameDone?.single?.model}`);

let frameEscaped = null;
const ctrl2 = new AbortController();
ctrl2.abort();
const visibleAborted = await runVisibleSubagent({
  prompt: PROMPT,
  ctx: stubCtx,
  timeoutMs: 30_000,
  label: "rag-smoke",
  agent,
  taskBody: buildSmokeTask(PROMPT),
  signal: ctrl2.signal,
  appendFrame: (f) => { frameEscaped = f; },
});
check("cancelled visible run emits frame outcome=escaped",
  visibleAborted.ok === false && frameEscaped !== null && frameEscaped.outcome === "escaped",
  `ok=${visibleAborted.ok} frame=${frameEscaped ? frameEscaped.outcome : "null"}`);
check("escaped frame carries classical abort fields (≥ [aborted] header)",
  frameEscaped?.single?.stopReason === "aborted" && frameEscaped.single.exitCode !== 0,
  `stopReason=${frameEscaped?.single?.stopReason} exitCode=${frameEscaped?.single?.exitCode}`);

console.log("\n=== smoke child pre-check (headless) ===");
console.log(results.join("\n"));
console.log(failed === 0 ? "\nALL PASS" : `\n${failed} CHECK(S) FAILED`);
process.exit(failed === 0 ? 0 : 1);