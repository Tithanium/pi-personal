/**
 * probe-bisect.mjs — TEMPORARY: which agent knob kills the child in 5 ms?
 */
import { existsSync } from "node:fs";
if (!process.env.PI_CLI_PATH) {
  const cli = "C:/Users/connessn/AppData/Roaming/npm/node_modules/@earendil-works/pi-coding-agent/dist/bundle/cli.js";
  if (existsSync(cli)) process.env.PI_CLI_PATH = cli;
}
const { spawnRagSubagent, loadAgentFile, allocateRagTmpFile } = await import("../../spawnRagSubagent.ts");

const stages = [
  ["smoke-baseline", loadAgentFile("rag-smoke.md"), "Reply with the single word PONG."],
  ["probe-agent-notools", { systemPrompt: "Reply with one heading.", tools: [], model: "alan/qwen-3.8-27b", filePath: "" }, "Say HI."],
  ["probe-agent-read", { systemPrompt: "Use the read tool on the file named in the task, then give its first heading.", tools: ["read"], model: "alan/qwen-3.8-27b", filePath: "" }, "Read C:/Users/connessn/.pi/agent/extensions/pi-local-rag/goal.md and reply with only its first markdown heading."],
  ["probe-agent-read-nomodel", { systemPrompt: "Answer briefly.", tools: ["read"], filePath: "" }, "Tell me: what tool do you have?"],
];

for (const [name, agent, task] of stages) {
  const t0 = Date.now();
  const run = await spawnRagSubagent({
    prompt: task,
    tmpPath: allocateRagTmpFile(),
    timeoutMs: 60_000,
    stallMs: 30_000,
    agent,
    taskBody: task,
  });
  console.log(
    `${name}: ok=${run.ok} exit=${run.exitCode} wall=${Date.now() - t0}ms events? final=${JSON.stringify((run.finalText || "").slice(0, 60))} err=${run.errorMessage ?? "-"} stderr=${JSON.stringify((run.stderr || "").slice(0, 120))}`,
  );
}
process.exit(0);