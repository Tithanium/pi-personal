# Retrieval methods survey — process E & F for pi-local-rag

Research subagent — gauntlet STREAM E/F (2026-10-15). Assessed against the
project's hard constraints and existing local infra, then smoke-tested the two
winners. No production files touched.

## Constraints (from goal.md v3)
- **Wall** < 10 s per question (30 s acceptable); empty edge must not stall.
- **Local-only** — no cloud; ONNX via `@xenova/transformers` on CPU (Windows).
- **Existing infra** = SQLite FTS5 (BM25) + sqlite-vec (vector) + `@xenova/transformers`
  ONNX (embeddings already local) + ONE 27B LLM round ≈ 2–5 s (`alan/qwen-3.8-27b`,
  capped alias `alan-ragcap`).
- **Corpus** = PDF-converted ANSYS manuals (`.txt`, 60k-line flat files) + Sphinx
  per-attribute HTML + Python (`fedoo`) example/source, indexed 2–3× (duplicate copies).
- **Objective** = completeness ≥ reference D's grid with ≤ 5 % false positives, **thin
  payload**. Reference A is demoted to a competitor; the deterministic B (two-arm
  prefetch, 12 structural regions) is the current fast baseline (max 6.6 s, ~8 k in/q).

## Embedding model in use (recorded in INSTALLS.md)
`embed.ts` → `EMBEDDING_MODEL = Xenova/all-MiniLM-L6-v2` (`constants.ts`), cached
**outside** the HF hub at the global `~/.pi/rag-models/Xenova/all-MiniLM-L6-v2/`
(`env.cacheDir` + `allowLocalModels`, embed.ts pattern). ONNX `model_quantized.onnx`
= **22,972,370 B (21.9 MB)**; `tokenizer.json` 711 KB. NOT in
`~/.cache/huggingface/hub` (which holds only gpt-oss-20b-GGUF / clip / Qwen3.8-27B-GGUF /
moonshine).

## Verdict table (12 methods)

| # | Method | Verdict | Rationale (1–3 lines) |
|---|--------|---------|----------------------|
| 1 | **Cross-encoder rerank (MiniLM/Marco ONNX)** | **WINNER (E)** — smoke-tested | Local ONNX, CPU, 0 LLM tokens, deterministic. E-smoke: ~0.5 s to rerank 12 candidates (42–50 ms/pair fp32). Ranks *recovered* candidates (promoted a fedoo region 9→5; kept LNSRCH at 2). **Cannot** fix retrieval-level pool misses (chunk not in the two-arm pool). Caveat: the `cross-encoder/ms-marco-MiniLM-L-6-v2` ONNX export's HF pipeline path returns a constant 1.0 (1-class softmax) — must score the raw logit via the direct tokenizer+model pair path (proven: relevant 0.93 vs irrelevant 0.00). |
| 2 | ColBERT / late interaction | Weak | Per-token max-overlap is heavier and has **no clean `@xenova/transformers` path** (transformers.js is single-vector feature-extraction + classification; ColBERT needs custom onnxruntime late-interaction code). Marginal gain over a MiniLM cross-encoder on a 12-candidate set; not worth the new runtime. |
| 3 | HyDE (hypothetical doc) | Moderate (redundant w/ F) | LLM writes a hypothetical passage, embed it, retrieve. Bridges the NL-question→doc vocab gap, but costs a full doc-generation round (more tokens than F's 5 short queries) and overlaps F's value. Only worth it if F's query-variants prove insufficient. |
| 4 | **Query-rewrite/planner (Self-RAG/FLARE/RQ-RAG/adaptive-RAG)** | **WINNER (F)** — core smoke-tested | The single-round "emit 3–5 diverse queries" planner (F-smoke) captured most of the value in ~3.2 s and recovered the NLGEOM definition at rank 1 (the topical-discoverability gap B structurally cannot). The full frameworks (Self-RAG reflection, FLARE iterative, RQ-RAG decomposition, adaptive-RAG routing) add **multiple LLM rounds we cannot afford** under the 10 s bar. |
| 5 | RAPTOR (recursive abstractive tree) | Weak | Offline LLM summarization of the whole corpus + a tree index. Our objective is **precise facts** (command/API definitions, example scripts), which abstraction blurs; the corpus is already structurally chunked. High one-time LLM cost, unclear gain here. |
| 6 | LightRAG / nano-graphrag / GraphRAG | Weak | Heavy offline LLM entity/relation extraction + graph traversal + community summaries. Built for multi-hop relational queries; our answers are usually **one section/file**. Latency + infra + LLM cost for marginal gain on command/API references. |
| 7 | Aider repo-map / tree-sitter symbol index | **Moderate-niche — best fix for the fedoo gap** | tree-sitter symbol map (functions/classes) does exact symbol-name matching. F-misscheck: even an exact-name query reaches `2DplasticBending_from_scratch.py` only at **rank 17** because **FTS5 indexes chunk content, not filenames**, and the example's content is generic. A symbol/example-file index (and filename/path in FTS5) would reach the pool-missed fedoo files. Does **not** help the non-Python ANSYS docs. |
| 8 | BM25 Porter stemming on FTS5 | Moderate (index hygiene) | Current FTS5 has **no stemming** (logged index-hygiene issue). Porter (built into FTS5) improves English-topic recall (deflection/deflections). Cheap, index-time only, local. But it's a **re-index production change** (out of smoke scope); ANSYS acronyms (NLGEOM/LNSRCH) are unaffected. Two-arm + F already compensate. |
| 9 | CRAG / speculative retrieval | Moderate (as the E+F gate) | CRAG's "retrieve → confidence-gate → corrective re-query" maps cleanly onto **B's raw-relevance verdict gate → fire F's planner only when verdict is weak** (pay the planner LLM round only on demand). Speculative (always-parallel E+F) costs both. Recommended as the combination pattern, not a standalone method. |

*(Rows cover the 9 method families named in the task; #4 and #7 each bundle the
sub-variants.)*

## Top-2 choice — and why
- **#1 E (cross-encoder rerank):** deterministic, **0 tokens**, ~0.5 s, local ONNX.
  It is the drop-in, zero-LLM replacement for B's non-deterministic single-LLM
  *selection* round — which is exactly the bar's tie-breaker ("most deterministic with
  the fewest tokens"). Fastest + fewest tokens of anything assessed.
- **#2 F (single-round LLM query planner):** one 27B round (~3.2 s, ~680 in / ~48 out),
  emits 3–5 corpus-vocabulary queries. It is the **only** method smoke-proven to reach
  the answering section that B's deterministic prefetch structurally misses (NLGEOM →
  rank 1). Thin payload (queries, not docs) — cheaper than HyDE/Self-RAG/FLARE.

The two are **complementary, not competing**: E *ranks* what the deterministic prefetch
already retrieved; F *retrieves* what the prefetch never saw (topical/definition gaps).
A **CRAG-style gate** (item 9) combines them cheaply: run E always (0 tokens), fire F
only when B's raw-relevance verdict is weak/empty-ish.

## E-smoke evidence (tests/ab2/e-rerank.mjs → research/e-rerank-results.json)
- **Model** `cross-encoder/ms-marco-MiniLM-L-6-v2`, ONNX fp32 `model.onnx`
  **91,011,230 B (86.8 MB)** in `research/cache/cross-encoder/...` (downloaded
  4.8 s). Scored via direct pair path (`quantized:false`, raw logit → sigmoid).
- **Latency** (12 candidates, the two-arm set B actually builds):
  - `ansys_large_deflection`: rerank 12 pairs in **594 ms** (avg **49.5 ms/pair**, max 68).
  - `fedoo_plasticity`: rerank 12 pairs in **506 ms** (avg **42.2 ms/pair**, max 51).
- **Token-region before/after** (token matched by NAME across occurrences; key = the
  specific answer file/region the keyFacts cite):

| id | token | in B's final 12 today? | region (B-rank → CE-rank) | key answer present? |
|----|-------|------------------------|---------------------------|---------------------|
| ansys_large_deflection | LNSRCH | **YES** | SAG L14850-15096 (2 → 2, ce 0.655) | SAG file YES, but the **Table 2.3 def (L1656-1704) is per-file-capped out** of the 12 |
| fedoo_plasticity | nlsolve | **YES** | spring.py L1-192 (9 & 10 → 5 & 6, ce 0.208) | **NO** — `2DplasticBending_from_scratch.py` is a **true pool miss** (0 chunks in the two-arm pool); CE can't fix it |

**Reading:** E is a clean speed/determinism win (replaces B's LLM selection, 0 tokens).
On these two hard ids the tokens are already *present* in B's 12 (via a co-occurring
region), so E's marginal completeness gain here is neutral — its value is the
deterministic 0-token ranking. The two deepest gaps (Table 2.3 def, the fedoo example
file) are **retrieval-level** (per-file cap / cross-corpus saturation), which a reranker
structurally cannot recover — that is F's (and a symbol index's) job.

## F-smoke evidence (tests/ab2/f-planner.mjs → research/f-planner-results.json)
- **Planner** = `alan-ragcap/qwen-3.8-27b`, NO tools, final-text-only, one round.

| id | planner wall | in/out | variants (≤ 8 words/line) | answer hit? | which variant |
|----|--------------|--------|---------------------------|-------------|---------------|
| ansys_nlgeom_cmd | **3237 ms** | 676/48 | `NLGEOM ON command ANSYS APDL`; `NLGEOM option geometric nonlinearity`; `NLGEOM command Mechanical APDL reference`; `geometric nonlinearity NLGEOM APDL`; **`NLGEOM large deflection ANSYS`** | **HIT** | variant 5 → **rank 1** = Command_Reference **L51992-52034** (the NLGEOM def: "Includes large-deflection effects in a static or full transient analysis") |
| fedoo_plasticity | **3192 ms** | 729/46 | `von Mises J2 plasticity hardening constitutive`; `isotropic plasticity material model fedoo`; `elasto-plastic von Mises weak form`; `Newton-Raphson nonlinear solver iteration loop`; `plane strain plastic bending example` | **MISS** | — (no variant's top-10 contains `2DplasticBending_from_scratch.py`) |

- **ansys_nlgeom_cmd: F recovers the NLGEOM-class topical-discoverability gap** that
  B's deterministic prefetch cannot (PROGRESS.md R11: "NLGEOM is not topically
  discoverable"). The winning variant uses the corpus's own phrase ("large deflection"),
  which is exactly what the deterministic v1/v2/v3 variants never emit.
- **fedoo_plasticity: MISS is fundamental, not a planner failure.** `f-misscheck.mjs`:
  even the **exact-name** query `2DplasticBending_from_scratch` reaches the example file
  only at **rank 17** (FTS5 indexes chunk *content*, not filenames; the example's content
  — `nlsolve`, `rectangle_mesh`, `ElastoPlasticity`, `Dirichlet` — is shared with many fedoo
  files + ANSYS docs). No planner phrasing fixes a file whose retrievable content is
  generic. **Root fix = filename/path-aware FTS5 indexing or a tree-sitter symbol/example
  index (survey #7)** — not more query variants.

## Production design + cost estimate (vs B:single today: max 6.6 s, ~8 k in/q)
Recommended pipeline = **B-deterministic prefetch → E cross-encoder rerank → (if verdict
weak) F planner + F's variant searches → deterministic merge** (CRAG-style gate):
- **E-only (strong verdict):** prefetch ~0.5–1 s + rerank ~0.5 s (fp32) / ~0.2 s
  (quantized) = **~1–1.5 s, 0 tokens.** Strictly faster + thinner than B:single.
- **F added (weak verdict):** + planner ~3.2 s (~680 in / 48 out) + ~5 variant searches
  (~0.3–1 s, embeddings) = **~4.5–6 s, ~0.8 k in / ~48 out.** Comparable wall to
  B:single's 6.6 s but **~10× fewer input tokens** and recovers the NLGEOM-class gap.
- Token cost of the planner round (~700 in) is ~9× **less** than B:single's selection
  child (~8 k in), because the child emits 5 short queries (~48 out) and the parent runs
  the deterministic searches (0 tokens) instead of an LLM re-reading a 30 KB candidate.

**Net:** E is the deterministic 0-token selection core; F is the gated, thin, LLM-backed
retrieval-diversity layer that closes the topical gap; a filename/symbol index is the
separate fix for the generic-content example-file gap.
