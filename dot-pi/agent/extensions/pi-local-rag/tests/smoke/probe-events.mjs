/**
 * probe-events.mjs — TEMPORARY diagnostic: what does the child event stream
 * actually look like (types, timing, thinking/tool deltas)? Read-only run:
 * the child only reads one local file. Delete after the display fix lands.
 */
const t0 = Date.now();
// Same trick as run-smoke-child.mjs: resolve the pi CLI explicitly, else the
// bare PATH fallback ('pi') cannot be spawned from node on this machine (ENOENT).
import { existsSync } from "node:fs";
if (!process.env.PI_CLI_PATH) {
  const cli = "C:/Users/connessn/AppData/Roaming/npm/node_modules/@earendil-works/pi-coding-agent/dist/bundle/cli.js";
  if (existsSync(cli)) process.env.PI_CLI_PATH = cli;
}
const { spawnRagSubagent } = await import("../../spawnRagSubagent.ts");

const AGENT = {
  systemPrompt:
    "You are a probe. Use the read tool exactly once on the file given in the task, then answer with its first heading.",
  tools: ["read"],
  model: "alan/qwen-3.8-27b",
  filePath: "",
};
const tlArg = process.argv.find((a) => a.startsWith("--thinking="));
if (tlArg) AGENT.thinkingLevel = tlArg.split("=")[1];
const mArg = process.argv.find((a) => a.startsWith("--model="));
if (mArg) AGENT.model = mArg.slice("--model=".length);

const counts = new Map();
let first20 = 0;

const run = await spawnRagSubagent({
  prompt: "Read C:/Users/connessn/.pi/agent/extensions/pi-local-rag/goal.md and give its first heading.",
  tmpPath: `C:/Users/connessn/AppData/Local/Temp/rag-probe-${Date.now()}.jsonl`,
  timeoutMs: 180_000,
  stallMs: 60_000,
  agent: AGENT,
  taskBody:
    "Read the file C:/Users/connessn/.pi/agent/extensions/pi-local-rag/goal.md with the read tool and reply with only its first markdown heading.",
  rawPath: "C:/Users/connessn/AppData/Local/Temp/rag-probe-raw.jsonl",
  onEvent: (e) => {
    const ms = Date.now() - t0;
    const sub = e?.assistantMessageEvent?.type ?? "";
    const key = `${e?.type}${sub ? "/" + sub : ""}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
    if (first20 < 20) {
      first20++;
      const extra =
        sub === "text_delta" || sub === "thinking_delta"
          ? ` delta=${JSON.stringify(String(e.assistantMessageEvent.delta ?? "").slice(0, 40))}`
          : e?.type === "tool_execution_start"
            ? ` tool=${e.toolName} args=${JSON.stringify(e.args ?? "").slice(0, 80)}`
            : "";
      console.log(`ms=${ms} type=${e?.type} sub=${sub}${extra}`);
    }
  },
});

// eslint-disable-next-line no-console
console.log("--- summary ---");
console.log(JSON.stringify(Object.fromEntries(counts), null, 2));
console.log(
  JSON.stringify(run, (k, v) => (k === "finalText" ? String(v ?? "").slice(0, 120) : v), 2),
);
process.exit(0);