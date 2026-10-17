# RAG Injection Race — Final Selection Verdict

Goal: gauntlet v3 (speed < 10 s, completeness ≥ D-reference grid coverage, ≤ 5% false positives).
Date: 2026-10-16. Status: **DECISION RECORDED — fast branches deferred; production stays A.**

## Reference
- **Union grid (frozen, P2-R13):** 741 facts = 50 original verified grid facts + 691 D-facts
  (critic-verified: 629 pass / 62 line-fix / 5 evidenced drops / 3 corpus defects / 89 duplicates of original).
  `grid/final-grid.json`. D itself covered 37/50 of the original grid — the 13 D-missed facts
  (rectangle_mesh G2–G4, fkn G1, large_deflection G1/G2/G6, contact G5, plasticity G3/G5/G6,
  weakform G6, transient G2) are in the grid and count for every competitor.

## Results (10 relevant ids; 2 unrelated controls all EMPTY on every fast method)

| Method | Coverage | Byte-FPR | Mean per-payload FPR | Wall (max) | Tokens (typ.) | Deterministic |
|---|---|---|---|---|---|---|
| A (agentic, 5 workers) | **24.6%** (182/741) | **7.8%** | 12.8% | **49–356 s ✗** | 2–3 k in / 0.1–0.2 k out | no |
| **EF** (B + cross-encoder E + gated planner F) | **10.7%** (79/741) | **59.9%** | 62.9% | **0.4–7.9 s ✓** (12/12 < 10 s) | 0 (strong) / ~300 in · 20–40 out (weak) | yes on strong path |
| B:none | 9.2% (68/741) | 62.6% | 65.1% | 0.2–4.7 s ✓ | 0 | yes |
| B:single | 6.9% (51/741) | 47.2% (mean 38.4%) | — | 0.4–6.6 s ✓ | ~300 in · ~20 out | no (LLM select) |
| C (v5 corpus-gated fan-out) | 0.5% (4/741) | 75.4% | 81.7% | 0.3–5.5 s ✓ | ~5×300 in | no |

A leads or co-leads on all 10 ids. C is structurally unable to serve the grid (0 hits on 7/10 ids).
B:single's LLM selection round net-deletes coverage (6.9% vs 9.2% for B:none).

## Bar analysis
- **Speed < 10 s:** met by B:single, B:none, C, EF (12/12 each; A fails at 49–356 s).
- **Completeness ≥ D's grid coverage:** A reaches 24.6% of the 741-fact inventory; D's own
  single-shot answers never produced that (D's generator found the 691 grid facts over 12
  agentic runs + extraction). No < 10 s method approaches it.
- **≤ 5% false positives:** unreachable for any < 10 s method against a corpus-INVENTORY grid
  (A, the precision leader, only reaches 7.8% byte-FPR). The bar was written for payload-vs-
  question fidelity on a 4–6 fact grid; on a 27–141 fact per-id inventory, "off-topic bytes"
  dominate structurally for any payload small enough to be fast.

## Decision (user, 2026-10-16)
> "coverage is very too low. it is a no go for now"

- **Production stays on A** (`ragSubprocess: "A"`, `ragEnabled: true`). A is the only method
  with usable coverage (24.6%) and near-bar precision (7.8%); its cost is the 49–356 s wall.
- **EF is parked** as the best fast branch (dominates B:none/B:single on coverage AND FPR,
  0 tokens on strong questions). Config plumbing exists (`ragSubprocess: "EF"`), not wired.
- **No method is declared a full-bar winner.** The gauntlet's FINAL SELECTION rule
  ("among bar-met subprocesses…") has an empty set under the strict bar.

## Why the fast branches fall short (root causes, evidenced)
1. **POOL-RECALL, not ranking.** The missing facts (NLGEOM command entry L51992–52008,
   PZER row, nlsolve, rectangle_mesh def, Simcoon props, OUTRES) are absent from B's
   deterministic pool entirely; E (rerank) can only reorder what the pool/caps selected.
   F (LLM planner) recovered some on weak ids but is gated OFF on the strong ids where the
   big gaps sit (gate/location mismatch — measured, P2-R15).
2. **No corpus gating in the B pipeline.** EF inherited B's cross-corpus flooding: the
   modelingspace judge counted ~17.3 KB of ANSYS chunks inside a fedoo payload (90.2% FPR
   there). C v5's folder-affinity gating (0 ANSYS files in fedoo payloads, R11) is the proven
   fix and the first EF v2 lever.
3. **Index hygiene** (logged R11): 2–3× corpus duplication, .dat BM25 flooding, FKN table
   extraction defect, no stemming — all cap pool recall.

## Parked next steps (if the race resumes)
1. **EF v2:** port C v5 corpus-gating into EF (deterministic, proven, attacks the biggest
   FPR contributor) + CE-confidence F gate (fire F on strong ids when top CE logit <
   threshold — the recall lever for the strong-id gap class).
2. **Pool-coverage work:** index dedup, .dat exclusion/filtering, light stemming,
   section-aware chunking of Command Reference entries — raises every fast branch's ceiling.
3. **Hybrid fallback (if A's latency stays unacceptable):** serve EF immediately and
   background-append A's deeper result (two-stage UX), or A on a latency budget with EF as
   the timeout path.

## Artifacts
- Grids: `grid/<id>.json` (10), `grid/final-grid.json` (741).
- Judge outputs: `judge-union/<id>__{X1..X4}.json` (P2-R14, 4 methods) + `<id>__EF.json` (P2-R15).
- Payloads: `results/{A,B,C,EF}/<runDir>/<id>.md`; per-run `meta.json` (wall/tokens/fFired/eMs).
- Subprocess: `subprocessEF.ts` (+ `agents/rag-query-planner.md`, ONNX model in `research/cache`).
- History: `PROGRESS.md` P2-R13 → P2-R16.
