# AGENTS.md — pi memory (global, Windows machine)

> Portable save (2026-10-01): copied from a source machine whose user home was `C:\Users\connessn`;
> on THIS machine the same layout lives under `%USERPROFILE%\.pi\agent\` — re-verify machine-specific
> paths before use.

> Read by EVERY pi session on this machine, any folder.

**
EVERY TIME the user send a prompt, consider generating a subagent to perform the task.

Environment facts are verified via the shortest read-only command, not supposed. Check rather than guess.

When a bash execution of a function fails, make the function log out a clear error message that contains all required debugging information.
When three successive failures occurs on such a function, generate a subagent to check a minimum working examples in a specific temporary test folder. Prefer a step by step validation from a working example (using low cpu power as the situation is simple) rather than trying a complex one shot build. 
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

1. **Zero wasted turn**: one attempt per tool per error mode — on failure,
   move to the next priority option; reuse `VERIFIED_FACTS.md`.
2. **Parallelize independent `read`** in one block; sequence dependent actions.
   After write → partial re-read.

**Pi packages** (registered in `settings.json` `packages` → auto-load on startup, restart pi, no `/reload`)
- `pi-tps-live` footer tok/s (VF §Pi "pi-tps-live"). Install pattern: `pi install npm:<pkg>`.
**Skills** — the payload `<skills>` block already sends every skill's name, description and location; here only notes NOT sent elsewhere (frontmatter pitfall: see MACHINE CONSTRAINTS §5):
- `creating-pi-tools` — **HARD RULE — read its SKILL.md BEFORE any pi-feature task; never from memory** (also `/skill:creating-pi-tools` to force-load).
- `matplotlib` (2026-09-21) — needs Python 3.10+ / matplotlib 3.10.x.
- `goal` — `goal-deterministic` skill + `/goal_deterministic` command removed 2026-09-21.

