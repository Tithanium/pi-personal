#!/usr/bin/env node
/**
 * e-loadtest.mjs — minimal de-risk: load the cross-encoder via
 * @xenova/transformers (local flat cache, env.cacheDir + allowLocalModels, the
 * same pattern embed.ts uses for all-MiniLM-L6-v2), score ONE (query, passage)
 * pair, print raw + sigmoid score + per-pair latency. Confirms score semantics
 * before the full e-rerank.mjs harness (config: sbert_ce_default_activation
 * = Identity → the pipeline returns a raw LOGIT; sigmoid → [0,1]).
 */
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const MODEL = "cross-encoder/ms-marco-MiniLM-L-6-v2";
const cacheDir = join(__dirname, "cache");
const onnx = join(cacheDir, "cross-encoder", "ms-marco-MiniLM-L-6-v2", "onnx", "model.onnx");

const { pipeline, env } = await import("@xenova/transformers");
env.cacheDir = cacheDir;
env.allowLocalModels = true;
env.useBrowserCache = false;

console.log(`[e-loadtest] cacheDir=${cacheDir}`);
console.log(`[e-loadtest] loading ${MODEL} (onnx: ${onnx}) ...`);
const t0 = Date.now();
// quantized:false → use the local fp32 onnx/model.onnx (the repo ships no
// model_quantized.onnx; transformers.js defaults to the quantized name and
// would 404 trying to fetch it). allowLocalModels + cacheDir → no network.
const clf = await pipeline("text-classification", MODEL, { quantized: false });
console.log(`[e-loadtest] pipeline ready in ${Date.now() - t0} ms`);

// Warm-up (first forward pass compiles the graph) — not measured.
await clf(["warm up query", "warm up passage text"], { truncation: true });

const pairs = [
  ["What does the NLGEOM,ON command do in ANSYS?",
   "NLGEOM,Key — includes large-deflection effects in a static or full transient analysis. Key=OFF ignores large-deflection effects; Key=ON includes large-deflection (large rotation) effects."],
  ["What does the NLGEOM,ON command do in ANSYS?",
   "The General Postprocessor (POST1) — minimum values, maximum values, sum all the active entries in the element table."],
];
for (const [q, p] of pairs) {
  const ts = Date.now();
  const out = await clf([q, p], { truncation: true });
  const dt = Date.now() - ts;
  const logit = out[0].score;
  const prob = 1 / (1 + Math.exp(-logit));
  console.log(`[e-loadtest] pair dt=${dt} ms rawLogit=${logit.toFixed(4)} sigmoid=${prob.toFixed(4)} :: ${(q + " | " + p).slice(0, 70)}...`);
}
console.log("[e-loadtest] OK");
process.exit(0);
