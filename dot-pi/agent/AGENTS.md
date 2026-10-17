# AGENTS.md — pi memory (global, Windows machine, user connessn)

> Read by EVERY pi session on this machine, any folder.

**
When working onto an existing project, create a backup using git.

EVERY TIME the user send a prompt, consider generating a subagent to perform the task=> reduce context length.

Environment facts are verified via the shortest read-only command, not supposed. Check rather than guess.

When a bash execution of a function fails, make the function log out a clear error message that contains all required debugging information.
When three successive failures occurs on such a function, generate a subagent to check a minimum working example in a specific temporary test folder. Prefer a step by step validation from a working example (using low cpu power as the situation is simple) rather than trying a complex one-shot build. 
Once a conclusion is reached, the agent should remove the temporary folder.

Every user prompt is catched by a hook and a documentation payload is automatically injected to help you better answer. Trust this injected payload. If you think the injected payload is insufficient, require the user validation before performing your own researches (grep, okf).
**

What counts as a "fact": file/dir existence, listing content, tool existence
+ version, installed package, pi version, resource path — plus durable box-specific
traps ("X breaks Y on this machine → do Z instead").
How/why history, timings, commit stories and research answers are NOT facts
(their rules: MANAGEMENT CONTRACT header of `VERIFIED_FACTS.md`).

Flow:
1. **BEFORE** asserting: read `VERIFIED_FACTS.md` (global config, next to this file).
   If fact present → reuse it.
   (Archives — `VERIFIED_FACTS_HISTORY.md`, `VERIFIED_FACTS.md.bak_*` — are NOT check targets.)
2. **ELSE**: run ONE short read-only command (1 fact = 1 command, no long script).
3. **AFTER**: record the result in `VERIFIED_FACTS.md` — ONE line per fact in the contract's
   format, distilling any incident to its rule + cmd (no narratives, no SHAs, no timelines).
   A DISPROVEN fact is DELETED or marked `[OUT]`, never rewritten as a story;
   a fact you can state better REPLACES the existing line instead of piling up next to it.
4. **Every edit ends closed-loop**: run
   `node $HOME\.pi\agent\extensions\validate-verified-facts.mjs` → PASS and update STATS.
   If the file exceeds the budget in its contract (60 facts / 25 KB), prune in the SAME turn
   (backup first: git commit or `VERIFIED_FACTS.md.bak_<date>`).
5. `VERIFIED_FACTS.md` carries a header variable `synthetized: true|false`.
   You may manage/summarize facts manually.

## MACHINE CONSTRAINTS 

1. **Zero wasted turn/learn from error**; reuse `VERIFIED_FACTS.md`.
2. **Parallelize independent `read`** in one block; sequence dependent actions.
   After write → partial re-read.

**Pi packages** (registered in `settings.json` `packages` → auto-load on startup, restart pi, no `/reload`)
- `pi-tps-live` footer tok/s (VF §Pi "pi-tps-live"). Install pattern: `pi install npm:<pkg>`.
**Skills** — 
- `creating-pi-tools` — **HARD RULE — read its SKILL.md BEFORE any pi-feature task; never from memory** (also `/skill:creating-pi-tools` to force-load).
- `matplotlib` — needs Python 3.10+ / matplotlib 3.10.x.

