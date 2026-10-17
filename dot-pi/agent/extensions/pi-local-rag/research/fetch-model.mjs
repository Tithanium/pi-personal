#!/usr/bin/env node
/**
 * fetch-model.mjs — pre-download cross-encoder/ms-marco-MiniLM-L-6-v2 into
 * the transformers.js HF cache layout under research/cache (the gauntlet's
 * proxy returns 401 to @xenova/transformers' internal fetch, but plain
 * HTTPS GET of resolve/main files works — verified 2026-10-15).
 *
 * Layout created:
 *   research/cache/models--cross-encoder--ms-marco-MiniLM-L-6-v2/
 *     refs/main                          = <targetCommit sha>
 *     snapshots/<sha>/config.json
 *     snapshots/<sha>/tokenizer.json
 *     snapshots/<sha>/tokenizer_config.json
 *     snapshots/<sha>/special_tokens_map.json
 *     snapshots/<sha>/onnx/model.onnx
 */
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CACHE = join(__dirname, "cache");
const MODEL = "cross-encoder/ms-marco-MiniLM-L-6-v2";
const ORG = MODEL.split("/")[0];
const NAME = MODEL.split("/").slice(1).join("--");
const MODEL_DIR = join(CACHE, `models--${ORG}--${NAME}`);

// 1. Resolve the main-branch commit sha (snapshot dir name).
const refs = await (await fetch(`https://huggingface.co/api/models/${MODEL}/refs/main`, { timeout: 30_000 })).json();
const sha = refs.targetCommit;
if (!/^[0-9a-f]{40}$/.test(sha)) throw new Error(`bad sha from refs/main: ${sha}`);
console.log(`[fetch-model] main sha: ${sha}`);

const snapDir = join(MODEL_DIR, "snapshots", sha);
mkdirSync(join(snapDir, "onnx"), { recursive: true });

// 2. Download the files the text-classification pipeline needs.
const FILES = [
  "config.json",
  "tokenizer.json",
  "tokenizer_config.json",
  "special_tokens_map.json",
  "onnx/model.onnx",
];
for (const f of FILES) {
  const dest = join(snapDir, f);
  if (existsSync(dest)) { console.log(`[fetch-model] exists: ${f}`); continue; }
  const url = `https://huggingface.co/${MODEL}/resolve/${sha}/${f}`;
  const res = await fetch(url, { timeout: 120_000 });
  if (!res.ok) throw new Error(`download ${f}: HTTP ${res.status} ${res.statusText} (${url})`);
  const buf = Buffer.from(await res.arrayBuffer());
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, buf);
  console.log(`[fetch-model] ${f} ${buf.length} B`);
}

// 3. refs/main pointer (transformers.js v2 reads it to find the snapshot dir).
writeFileSync(join(MODEL_DIR, "refs", "main"), sha, "utf-8");
console.log(`[fetch-model] done → ${snapDir}`);
