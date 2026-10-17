# Hook end-to-end evidence — R3 FIX 3

The production `before_agent_start` hook path was exercised for the first time
in a REAL main-session print run (`pi --mode json -p --no-session <prompt>`,
global pi, extension auto-loaded — NOT run-b.mjs). Both hook outcomes were
captured through the actual hook:

- **SUCCESS path** under the production `ragSubagentHookTimeoutMs = 120000`
  config (retrieval finished in 68.2 s < 120 s cap) → injection visible in the
  JSON stream.
- **TIMEOUT path** with the config temporarily set to `20000` ms (restored to
  `120000` afterwards, verified) → child killed at 20 s, **nothing injected**
  (validates the FIX 2 success gate).

Question (both runs, verbatim):
> Question: In fedoo, how do I create a rectangular mesh and use the
> StressEquilibrium weak form for a 2D nonlinear problem? Give the concrete
> API calls.

Cwd for both runs: `C:\Users\connessn\.pi\agent\extensions\pi-local-rag`
(walk-up finds no project `.pi/rag` → the hook's child resolves the GLOBAL rag
store where the test corpora are indexed). Model (main session and RAG child):
`qwen-3.8-27b` (ALAN).

## Run 1 — SUCCESS path (production 120 s config)

- Stream: `tests/ab/hook-e2e/2026-10-14T20-35-43Z-120s.jsonl` (4,474,847 bytes
  UTF-8, 11,678 lines; captured via PowerShell `>` which re-encodes to
  UTF-16LE — byte-identical content re-encoded to UTF-8 in place after the run)
  + `…-120s.stderr.txt`.
- **Main-session total wall time: 449.5 s** (PowerShell stopwatch around the
  `pi` invocation; includes 68.2 s hook-retrieval block + 17 agent turns of the
  answer).

### (a) Injected `<rag-context>` message in the JSON stream

Stream line 8 (`message_start`) and line 9 (`message_end`) —
`{"role":"custom","customType":"rag","content":"<rag-context>…"}`
(the hook's return value is `{customType:"rag", content, display:false}`;
`display` is not serialized into the stream — the custom message is what gets
injected below the user message, skill-injection style). It also appears in the
`agent_end` message array (line 11677). The 3 header lines of the injected
content:

```
<rag-context>
[pi-local-rag] RAG subagent: 6 sources, 68203 ms retrieval.
### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/tests/test_problem_constructor_keywords.py — minimal 2D StressEquilibrium API calls (lines 41-55)
```

Hook's own stderr log (in `…-120s.stderr.txt`):
`[rag] subagent retrieval injected — 68203 ms · 26526↑/2177↓ tokens`
(the stderr file also contains benign PowerShell `pi.ps1` wrapper noise).

### (b) Matching new temp file

- Path: `C:\Users\connessn\.pi\rag\tmp\rag-2026-10-14T20-35-44-749Z-9e92f4dc.md`
- Size: **5,508 bytes** (written 22:36:51 local, at the agent's ROUND-4 write;
  the file's timestamp prefix `20-35-44` matches the run start `20:35:43Z` —
  allocated by the hook via `allocateRagTmpFile()`).
- Pruning behaved: the run created the 11th file over the keep-10 set.

### (c) Header value

`6 sources, 68203 ms retrieval` (N=6 `###` source sections; M=68,203 ms
retrieval wall time to the child's `agent_end` — inside the 120 s production
cap, so the FIX 2 gate passed and the file was read via the shared
retry-loop `readRagTmpFile`).

### (d) Main-session wall time + token usage (from the stream)

- Wall: **449.5 s** (see above).
- Assistant usage summed over all 17 turns (50 messages, 30 tool executions):
  **input 176,895 · output 12,936 · cacheRead 583,296** (cost 0 — ALAN).
  (The main session answered with its own tools on top of the injected
  context — 17 turns; this run measures the hook path, not the B-pipeline
  A/B bar.)

## Run 2 — TIMEOUT path (temporary 20 s config, restored to 120000)

- `ragSubagentHookTimeoutMs` set to `20000` in
  `C:\Users\connessn\.pi\rag\config.json` for this run ONLY; restored to
  `120000` immediately after (verified by re-reading the file).
- Stream: `tests/ab/hook-e2e/2026-10-14T21-31-00Z-20s-timeout.jsonl`
  (3,927,853 bytes UTF-8, 10,227 lines — captured byte-exact by
  `hook-e2e/capture.mjs`, a node spawner that tees raw stdout; the 600 s
  re-run variant was NOT needed because Run 1 already took the success path
  under the production cap) + `…-20s-timeout.stderr.txt`.
- **Main-session total wall time: 329.8 s** (20.0 s hook block + 14 agent
  turns answering without RAG context).
- Hook stderr log: **`[rag] subagent retrieval injected nothing — timeout
  after 20000 ms · 20019 ms`** — the FIX 2 gate: on `timedOut` the hook reads
  nothing and injects nothing.
- Stream check: **0 occurrences of `rag-context`** in the whole 10,227-line
  stream — no injection, no partial file leaked.
- Temp file: the child was killed 20 s in (before its ROUND-4 write), so the
  allocated file was never created — nothing partial on disk (subsequent
  allocations pruned the oldest dev file to keep the 10-file cap).
- Main-session usage (14 turns): input 101,970 · output 11,618 ·
  cacheRead 483,728.

## Verdict

The production hook path now works end-to-end: real user prompt in a real
main session → hook spawns the rag-query child → on clean completion the
`<rag-context>` block is injected below the user message (visible in the JSON
stream, matching temp file on disk, correct header) and on timeout NOTHING is
injected. Both outcomes were produced by the actual hook, not the headless
runner.
