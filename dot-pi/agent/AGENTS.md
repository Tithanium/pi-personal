# AGENTS.md — pi memory (global, Windows machine, user connessn)

> Read by EVERY pi session on this machine, any folder.

**
When working onto an existing project, create a backup using git.

EVERY TIME the user send a prompt, consider generating a subagent to perform the task=> reduce context length.

### RAG via subagent (replaces auto-injection, disabled in rag config)
EVERY TIME the user sends a prompt, FIRST launch the `rag-query` subagent:
`subagent(agent: "rag-query", task: "User prompt: <the user's prompt, verbatim>")`.
It returns the raw output(s) of up to 3 `rag_query` searches (or `NO QUERIES`).
Use its returned chunks as candidate context for the task; if it returns `NO QUERIES` or `NO RESULTS`, proceed without RAG. Do not call `rag_query` yourself.

Environment facts are verified via the shortest read-only command, not supposed. Check rather than guess.

When a bash execution of a function fails, make the function log out a clear error message that contains all required debugging information.
When three successive failures occurs on such a function, generate a subagent to check a minimum working example in a specific temporary test folder. Prefer a step by step validation from a working example (using low cpu power as the situation is simple) rather than trying a complex one-shot build. 
Once a conclusion is reached, the agent should remove the temporary folder.
**

What counts as a "fact": file/dir existence, listing content, tool existence
+ version, installed package, pi version, resource path.

Flow:
1. **BEFORE** asserting: read `VERIFIED_FACTS.md` (global config, next to this file).
   If fact present → reuse it.
   (Archive `VERIFIED_FACTS_HISTORY.md` is NOT a check target — ignore it when asserting.)
2. **ELSE**: run ONE short read-only command (1 fact = 1 command, no long script).
3. **AFTER**: write result/update stall facts into `VERIFIED_FACTS.md` (format described in that file).
   A DISPROVEN hypothesis leads to update `VERIFIED_FACTS.md`.
4. `VERIFIED_FACTS.md` carries a header variable `synthetized: true|false`.
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

