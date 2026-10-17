/**
 * probe-research.mjs — TEMPORARY: does a research-grade prompt (A-style)
 * elicit thinking parts from the same model/gateway where the trivial probe
 * showed none? Keeps raw for part classification.
 */
import { existsSync } from "node:fs";
if (!process.env.PI_CLI_PATH) {
  const cli = "C:/Users/connessn/AppData/Roaming/npm/node_modules/@earendil-works/pi-coding-agent/dist/bundle/cli.js";
  if (existsSync(cli)) process.env.PI_CLI_PATH = cli;
}
const { spawnRagSubagent, loadRagQueryAgent, allocateRagTmpFile } = await import("../../spawnRagSubagent.ts");

const t0 = Date.now();
const agent = loadRagQueryAgent(); // rag-query.md — the process-A agent
const useFlag = process.argv.includes("--flag");
const modelArg = process.argv.find((a) => a.startsWith("--model="));
agent.model = modelArg ? modelArg.slice("--model=".length) : "alan/qwen-3.8-27b";
if (useFlag) agent.thinkingLevel = "high";
const rawOut = `C:/Users/connessn/AppData/Local/Temp/rag-probe-research${useFlag ? "-flag" : ""}${modelArg ? "-" + agent.model.replace(/[^a-z0-9]+/gi, "_") : ""}.raw.jsonl`;
const run = await spawnRagSubagent({
  prompt: "Enumerable toutes les API de construction de maillage fedoo guidding l'utilisateur sur rectangle_mesh et rectangle_layer.",
  tmpPath: allocateRagTmpFile(),
  timeoutMs: 240_000,
  stallMs: 90_000,
  agent,
  taskBody:
    "Recherche exhaustive dans le corpus fedoo: liste les API de construction de maillage (rectangle_mesh, rectangle_layer, ...) avec signatures file:line. Réponds uniquement avec le contexte documentaire.",
  rawPath: rawOut,
});
console.log(
  JSON.stringify({ ok: run.ok, wallMs: run.wallMs, model: run.model, stopReason: run.stopReason, tokensIn: run.tokensIn, tokensOut: run.tokensOut, err: run.errorMessage }, null, 2),
);

// classify parts
import fs from "node:fs";
const raw = rawOut;
const lines = fs.existsSync(raw) ? fs.readFileSync(raw, "utf8").split(/\r?\n/).filter(Boolean) : [];
const counts = {};
let thinkSample = "";
for (const l of lines) {
  let o;
  try {
    o = JSON.parse(l);
  } catch {
    continue;
  }
  const k = o.type + (o.assistantMessageEvent ? "/" + o.assistantMessageEvent.type : "");
  counts[k] = (counts[k] || 0) + 1;
  if (o.message && Array.isArray(o.message.content))
    for (const p of o.message.content) {
      counts["part:" + p.type] = (counts["part:" + p.type] || 0) + 1;
      if (p.type === "thinking" && !thinkSample) thinkSample = String(p.thinking || p.text || "").slice(0, 200);
    }
}
console.log(JSON.stringify(counts, null, 1));
if (thinkSample) console.log("THINK SAMPLE:", JSON.stringify(thinkSample));
process.exit(0);