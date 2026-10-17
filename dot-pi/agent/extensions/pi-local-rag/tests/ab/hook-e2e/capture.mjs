#!/usr/bin/env node
/**
 * capture.mjs <out.jsonl> <prompt...> — E2E hook capture runner (R3 FIX 3).
 *
 * Spawns the GLOBAL pi print session exactly the way a user would
 * (`pi --mode json -p --no-session <prompt>` via node + the global cli.js,
 * same resolution the hook itself uses) and tees the RAW stdout bytes to
 * <out.jsonl> (true UTF-8 — no PowerShell re-encoding) and the raw stderr
 * bytes to <out.jsonl>.stderr.txt (the hook's "[rag] subagent retrieval …"
 * log lines land there). Prints a JSON summary (wall ms, exit code, byte
 * counts) at the end.
 */
import { spawn } from "node:child_process";
import { appendFileSync } from "node:fs";
import { existsSync } from "node:fs";
import process from "node:process";

const CLI_PATH = "C:/Users/connessn/AppData/Roaming/npm/node_modules/@earendil-works/pi-coding-agent/dist/bundle/cli.js";
const [outPath, ...promptParts] = process.argv.slice(2);
const prompt = promptParts.join(" ");
if (!outPath || !prompt) {
  console.error("usage: node capture.mjs <out.jsonl> <prompt...>");
  process.exit(2);
}
if (!existsSync(CLI_PATH)) {
  console.error(`global pi cli.js not found at ${CLI_PATH}`);
  process.exit(2);
}

const t0 = Date.now();
const proc = spawn(process.execPath, [CLI_PATH, "--mode", "json", "-p", "--no-session", prompt], {
  cwd: process.cwd(),
  shell: false,
  stdio: ["ignore", "pipe", "pipe"],
});
let stdoutBytes = 0, stderrBytes = 0, newlines = 0;
proc.stdout.on("data", (d) => {
  stdoutBytes += d.length;
  newlines += (d.toString().match(/\n/g) || []).length;
  appendFileSync(outPath, d);
});
proc.stderr.on("data", (d) => {
  stderrBytes += d.length;
  appendFileSync(outPath.replace(/\.jsonl$/, ".stderr.txt"), d);
});
const code = await new Promise((r) => proc.on("close", r));
console.log(JSON.stringify({
  outPath,
  exitCode: code,
  wallMs: Date.now() - t0,
  stdoutBytes,
  stderrBytes,
  approxLines: newlines,
}));
