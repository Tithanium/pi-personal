#!/usr/bin/env node
/**
 * download-reranker.mjs — fetch the cross-encoder/ms-marco-MiniLM-L-6-v2 files
 * that the text-classification pipeline needs into the LOCAL flat cache layout
 * that embed.ts-style loading uses (env.cacheDir + allowLocalModels →
 * <cacheDir>/<org>/<name>/...). Reuses any files already present (the tokenizer
 * triplet was fetched in a prior gauntlet step); only downloads what is missing.
 *
 * Why flat layout (not the HF models--org--name/snapshots/<sha> layout): the
 * repo's embed.ts loads from ~/.pi/rag-models/Xenova/all-MiniLM-L6-v2/ via
 * env.cacheDir + allowLocalModels — the same <cacheDir>/<org>/<name> pattern —
 * so research/cache/cross-encoder/ms-marco-MiniLM-L-6-v2/ is the correct target.
 */
import { existsSync, mkdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIR = join(__dirname, "cache", "cross-encoder", "ms-marco-MiniLM-L-6-v2");
const BASE = "https://huggingface.co/cross-encoder/ms-marco-MiniLM-L-6-v2/resolve/main/";

// fp32 ONNX (the only generic non-quantized build in the repo; the repo has no
// model_quantized.onnx — only platform-specific qint8 variants). 91 MB.
const FILES = [
  ["config.json", 794],
  ["tokenizer.json", 711396],
  ["tokenizer_config.json", 1330],
  ["special_tokens_map.json", 132],
  ["onnx/model.onnx", 91011230],
];

let failures = 0;
for (const [f, expected] of FILES) {
  const dest = join(DIR, f);
  mkdirSync(dirname(dest), { recursive: true });
  if (existsSync(dest) && statSync(dest).size === expected) {
    console.log(`[download-reranker] exists: ${f} (${statSync(dest).size} B)`);
    continue;
  }
  const t0 = Date.now();
  const res = await fetch(BASE + f);
  if (!res.ok) {
    console.error(`[download-reranker] FAIL ${f}: HTTP ${res.status} ${res.statusText} (${BASE + f})`);
    failures++;
    continue;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(dest, buf);
  const ok = expected ? (buf.length === expected ? "size-match" : `SIZE-MISMATCH got=${buf.length} want=${expected}`) : "ok";
  console.log(`[download-reranker] ${f} ${buf.length} B in ${Date.now() - t0} ms (${ok})`);
  if (expected && buf.length !== expected) failures++;
}

if (failures > 0) {
  console.error(`[download-reranker] ${failures} file(s) failed`);
  process.exit(1);
}
console.log(`[download-reranker] all files present → ${DIR}`);
