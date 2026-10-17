#!/usr/bin/env node
/**
 * e-diag.mjs — cross-encoder input-format + discrimination diagnostic.
 * Checks: (a) out.length for single vs 2-element-array input (is [q,p] a pair
 * or a batch of 2?); (b) whether the score DISCRIMINATES across clearly
 * relevant vs irrelevant passages. Prints raw logits.
 */
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const MODEL = "cross-encoder/ms-marco-MiniLM-L-6-v2";
const { pipeline, env } = await import("@xenova/transformers");
env.cacheDir = join(__dirname, "cache");
env.allowLocalModels = true;
const clf = await pipeline("text-classification", MODEL, { quantized: false });
await clf(["warm up query", "warm up passage text"], { truncation: true });

const Q = "What does the NLGEOM,ON command do in ANSYS Mechanical APDL?";
const REL = "NLGEOM,Key — includes large-deflection effects in a static or full transient analysis. Key=OFF ignores large-deflection effects (small-deflection analysis); Key=ON includes large-deflection (large rotation) or large strain effects according to the element type. Command Default: NLGEOM,OFF.";
const IRREL = "The General Postprocessor (POST1) reports minimum and maximum values and sums all active entries in the element table for contour plotting of von Mises stress across the model.";
const IRREL2 = "A rectangular mesh with nx by ny nodes spanning the domain is built by the rectangle_mesh function which returns a Mesh object of quad4 elements by default.";

function show(label, arr) {
  return Promise.resolve(clf(arr, { truncation: true })).then(out => {
    console.log(`\n== ${label} :: out.length=${out.length}`);
    out.forEach((r, i) => console.log(`   [${i}] raw=${r.score?.toFixed(4)} label=${r.label ?? "-"}`));
  });
}
await show("single sentence (REL alone)", REL);
await show("2-el array [Q, REL] (pair? or batch-2?)", [Q, REL]);
await show("2-el array [Q, IRREL]", [Q, IRREL]);
await show("2-el array [Q, IRREL2]", [Q, IRREL2]);
await show("nested [[Q,REL],[Q,IRREL]] (batch of pairs)", [[Q, REL], [Q, IRREL]]);
console.log("\n[e-diag] done");
process.exit(0);
