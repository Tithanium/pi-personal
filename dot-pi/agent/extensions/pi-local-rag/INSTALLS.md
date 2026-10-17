# INSTALLS — trim ledger

Everything installed/added by the RAG gauntlet (phases 1–2). After the final subprocess is chosen, delete what the winner does not need. Pre-existing project deps (not added by the gauntlet) are listed for reference only — do NOT delete.

## Pre-existing (baseline, keep unless told otherwise)
- npm (package.json): @xenova/transformers ^2.17.2, better-sqlite3 ^12.10.0, sqlite-vec ^0.1.9, onnxruntime-node (transitive), pdf-parse, mammoth, turndown, sharp, ignore
- HF cache `~/.cache/huggingface/hub` (pre-existing, other projects): ggml-org/gpt-oss-20b-GGUF, openai/clip-vit-large-patch14-336, unsloth/Qwen3.8-27B-GGUF, UsefulSensors/moonshine
- RAG embedding model used by `embed.ts` (identified STREAM E/F 2026-10-15): **`Xenova/all-MiniLM-L6-v2`** (`constants.ts` `EMBEDDING_MODEL`), cached **outside** the HF hub at the global `~/.pi/rag-models/Xenova/all-MiniLM-L6-v2/` (`env.cacheDir` + `allowLocalModels` — embed.ts pattern). ONNX `model_quantized.onnx` = **22,972,370 B (21.9 MB)** + `tokenizer.json` 711,661 B. (NOT in `~/.cache/huggingface/hub` — that dir holds only gpt-oss-20b-GGUF / clip / Qwen3.8-27B-GGUF / moonshine.)
- pi provider alias `alan-ragcap` in `~/.pi/agent/models.json` (capped 120-maxTokens copy of the ALAN base model — used by B:single + C workers)

## Added by the gauntlet
| Item | Type | Version / size | Where | Added by (round) | Needed by winner? |
|---|---|---|---|---|---|
| `cross-encoder/ms-marco-MiniLM-L-6-v2` (ONNX) | model (cross-encoder reranker) | `onnx/model.onnx` **91,011,230 B (86.8 MB)** fp32 + `tokenizer.json` 711,396 B + `config.json` 794 B + `tokenizer_config.json` 1,330 B + `special_tokens_map.json` 132 B (repo ships NO `model_quantized.onnx` — only platform qint8 variants) | `research/cache/cross-encoder/ms-marco-MiniLM-L-6-v2/` (local flat cache, loaded via `env.cacheDir`+`allowLocalModels`, `quantized:false`) | STREAM E/F (research 2026-10-15) | **E (rerank) — top-2 winner #1.** Caveat: its HF text-classification pipeline path returns a constant 1.0 (1-class softmax); score the raw logit via the direct tokenizer+model pair path (e-diag2.mjs). |
| `@xenova/transformers` (reranker runtime) | npm — **REUSED, no new install** | ^2.17.2 (resolves to global `~/.pi/agent/npm/node_modules/@xenova/transformers`; same copy embed.ts uses for all-MiniLM-L6-v2) | no change — the existing transformers.js drives the ONNX text-classification pair scoring | STREAM E/F (research) | E + embeddings (pre-existing) |
| `download-reranker.mjs` | tool (research) | — (fetches the 5 cross-encoder files from `huggingface.co/.../resolve/main/`; idempotent, size-checked; reuses existing files) | `research/download-reranker.mjs` | STREAM E/F (research) | one-time model fetch (keep to restore the cache) |
| E/F smoke harnesses | tool (test) | `e-rerank.mjs` (B-prefetch top-30 → CE rerank), `e-diag2.mjs` (raw-logit pair proof), `e-diag3.mjs` (pool-depth), `f-planner.mjs` (LLM planner + per-variant hybrid search), `f-misscheck.mjs` (fedoo retrievability), `e-loadtest.mjs` | REMOVED `tests/ab2/e-*.mjs` + `tests/ab2/f-*.mjs` etc. (deleted with processes EF/A/B/C in goal v3 PART 4 step 3); `research/e-loadtest.mjs` + `research/e-diag*.mjs` KEPT as frozen research probes; results → `tests/ab2/e-rerank-results.json`, `tests/ab2/f-planner-results.json` (frozen, kept) | STREAM E/F (research) | diagnostic (no production dep) |
| HF reachability (E/F connectivity probe) | fact | `api.github.com` 200 (rate 60/60), `huggingface.co` 200 (214 ms), HF model API 200 | n/a (network) | STREAM E/F (research 2026-10-15) | E model download + (HF not needed at runtime — local cache) |
| (none yet — pre-E/F placeholder) | | | | | |
