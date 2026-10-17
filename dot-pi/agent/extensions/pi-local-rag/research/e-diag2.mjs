#!/usr/bin/env node
/**
 * e-diag2.mjs — direct tokenizer+model PAIR scoring (bypass the pipeline's
 * softmax, which collapses the 1-class logit to a constant 1.0). Confirms the
 * cross-encoder DISCRIMINATES relevant vs irrelevant passages, and measures
 * per-pair latency.
 *
 * Pair tokenization: tokenizer(query, { text_pair: passage, truncation: true,
 *   max_length: 512 }) → [CLS] query [SEP] passage [SEP] (post_processor
 *   BertProcessing). Raw logit = model(inputs).logits.data[0] (config
 *   sbert_ce_default_activation = Identity → raw logit, not probability).
 */
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const MODEL = "cross-encoder/ms-marco-MiniLM-L-6-v2";
const { pipeline, env } = await import("@xenova/transformers");
env.cacheDir = join(__dirname, "cache");
env.allowLocalModels = true;
const clf = await pipeline("text-classification", MODEL, { quantized: false });
const tok = clf.tokenizer;
const model = clf.model;

async function scorePair(q, p) {
  const inputs = tok(q, { text_pair: p, truncation: true, max_length: 512, padding: false });
  const out = await model(inputs);
  const logit = out.logits.data[0];
  return { logit, prob: 1 / (1 + Math.exp(-logit)), len: inputs.input_ids.dims[1] };
}
// warm-up
await scorePair("warm up", "warm up passage");

const Q = "What does the NLGEOM,ON command do in ANSYS Mechanical APDL?";
const cases = [
  ["RELEVANT (NLGEOM def)",
   "NLGEOM,Key — includes large-deflection effects in a static or full transient analysis. Key=OFF ignores large-deflection effects (small-deflection analysis is specified); Key=ON includes large-deflection (large rotation) or large strain effects, according to the element type. Command Default: NLGEOM,OFF."],
  ["IRRELEVANT (POST1)",
   "The General Postprocessor (POST1) reports minimum and maximum values and sums all active entries in the element table for contour plotting of von Mises stress."],
  ["IRRELEVANT (mesh)",
   "A rectangular mesh with nx by ny nodes spanning the domain is built by the rectangle_mesh function which returns a Mesh object of quad4 elements by default."],
];
for (const [label, p] of cases) {
  const t0 = Date.now();
  const { logit, prob, len } = await scorePair(Q, p);
  const dt = Date.now() - t0;
  console.log(`[e-diag2] ${label.padEnd(22)} dt=${dt} ms logit=${logit.toFixed(4)} prob=${prob.toFixed(4)} tokens=${len}`);
}
console.log("[e-diag2] done");
process.exit(0);
