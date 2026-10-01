# AGENTS.md — pi memory (global, Windows machine)

> Portable save (2026-10-01): copied from a source machine whose user home was `C:\Users\connessn`;
> on THIS machine the same layout lives under `%USERPROFILE%\.pi\agent\`.

> Read by EVERY pi session on this machine, any folder.
> Priority: security rules + anti-waste below.
> The session payload already sends: tool list + descriptions, rules, pi docs paths,
> skills inventory (names, descriptions, locations), cwd. Keep ONLY what is not sent otherwise.

## HYPOTHESIS → CHECK RULE 

**
Optimize context by generating subagents.

Every environment fact is verified via the shortest read-only command
BEFORE being asserted. Check OFTEN: before every assertion,
before any implementation that relies on an assumption, and the moment a
command fails unexpectedly.

When error in a program, add a log output to clarify the location and reason an error occurs. The log should provide the information required to reduce guess need and provide evidence of what is needed.
When three successive failures occures, generate a subagent to check a minimum working examples in a specific temporary test folder, creating a minimalist situation to understand how a command works. Being too optimistic is usually detrimental to an answer efficiency. Prefer a step by step validation from a working example (using low cpu power as the situation is simple) rather than trying a complex one shot build. Once a conclusion is reached, the agent should remove the temporary folder.

**

What counts as a "fact": file/dir existence, listing content, tool existence
+ version, installed package, pi version, resource path.

Flow:
1. **BEFORE** asserting: read `VERIFIED_FACTS.md` (global config, next to this file).
   If fact present → reuse it.
   (Archive `VERIFIED_FACTS_HISTORY.md` is NOT a check target — ignore it when asserting.)
2. **ELSE**: run ONE short read-only command (1 fact = 1 command, no long script).
3. **AFTER**: write result/update stall facts into `VERIFIED_FACTS.md` (format described in that file).
   A DISPROVEN hypothesis leads to update the file, either by removing a previous wrong hypothesis, either by adding a new hypothesis.
4. `VERIFIED_FACTS.md` carries a header variable `synthetized: true|false`.
   NOTE (2026-09-21): the `facts-sum-hook` extension that maintained it was
   REMOVED — it crashed pi (`notify is not defined`, see crashes.json); file
   backed up at `disabled-extensions/facts-sum-hook.ts`. The flag is now inert
   (no auto-spawn/auto-flip). You may manage/summarize facts manually.

## MACHINE CONSTRAINTS 

1. **One attempt per tool**: on failure, move to the next priority item (see item 2).
2. **Winning mode** (all verified working):
   - files: `read` / `edit` / `write` with `C:/...` or `~` (forward slashes;
     `write` creates parents); copy = `read`(source) → `write`(dest) + partial re-read
   - dir listing: `read` a candidate path (`ENOENT` = free existence test);
     listing via `bash` → just `Get-ChildItem`
   - last resort: deliver a **copyable PowerShell** block + expected output,
     exploit pasted output (only if `bash` tool fails)
3. **Zero wasted turn**: one attempt per tool per error mode — on failure,
   move to the next priority option; reuse `VERIFIED_FACTS.md`.
4. **Parallelize independent `read`** in one block; sequence dependent actions.
   After write → partial re-read.
5. **Frontmatter YAML = compact parser.** Skills AND prompt
   templates are parsed by `parseFrontmatter` (`dist/utils/frontmatter.js`). A `: `
   (colon + space) inside a plain-scalar value — most often in `description:` — throws
   "Nested mappings are not allowed in compact mappings" and the SKILL.md / template is
   **silently dropped** (skills loader logs only a warning; the `/skill:x` command and
   `/x` template expansion just never appear). Fix: never write `: ` inside a frontmatter
   value string; use em-dashes or commas, or wrap the value. Verify after writing with the
   loader probe in `creating-pi-tools`.

## LOCATIONS (Windows)

| Role | Path |
|---|---|
| Global pi config | `~/.pi/agent/` (subdirs `agents/`, `extensions/`, `skills/`, `auth.json`) |
| Auto-detected extensions | `~/.pi/agent/extensions/` or `.pi/extensions/` (project) |
| Project AGENTS.md | read in the current working dir (e.g. `Harnesses_launch_GRICAD/AGENTS.md`) |
| Verified facts (hypothesis checks) | `~/.pi/agent/VERIFIED_FACTS.md` — read before asserting, fed after each check; superseded facts archived to `VERIFIED_FACTS_HISTORY.md` (append-only, NOT a check target) |

## ALREADY INSTALLED (reuse as-is — rebuilding wastes turns)

> **Index only.** Verification detail (dates, commands, results) lives in
> `VERIFIED_FACTS.md` (§ Shell / § Pi / § Agents) — update facts THERE, never here.
> Superseded facts → `VERIFIED_FACTS_HISTORY.md` (archive, NOT a check target).

**Shell & tools**
- Built-in tool set is fixed at startup (`defaultTools` in `~/.pi/agent/settings.json`) — changes need a pi restart.

**Extensions** (auto-discovered top-level `*.ts`; `/reload` applies)
- `subagent` — extra caps beyond the tool doc: parallel = 8 agents / conc. 4; `/agents:<name>` shortcuts exist; command NAMES fixed at load → `/reload` to pick up new agent files.
- `/clear` = exact alias of `/new` (extension `clear-command.ts`, VF §Pi "clear-command"). Pitfall: post-replacement work must run inside `newSession({ withSession: (freshCtx) => … })` — captured ctx is stale after session replacement/reload.
- facts-sum hook REMOVED 2026-09-21 (crash/backup details in §HYPOTHESIS → CHECK RULE). Agent `sum` still exists — invoke manually via `/agents:sum`; lint script `extensions/validate-verified-facts.mjs` exists, run manually, no auto-run.

**Pi packages** (registered in `settings.json` `packages` → auto-load on startup, restart pi, no `/reload`)
- `pi-tps-live` footer tok/s (VF §Pi "pi-tps-live"). Install pattern: `pi install npm:<pkg>`.

**Agents** → global dir (path already given in the `subagent` tool) — root `.md` only; subdir `Storage_future_service/` NOT auto-loaded (no recursion) (VF §Agents "agents dir"). One-liners:
- `researcher` read-only investigation/report · `coder` bounded implementation · `reviewer` verdict-first code review · `ANSYS` ANSYS APDL adviser (verify vs its docs; FULL syntax before replacing params) · `sum` fact consolidator · `ps`/`shell` raw command executors (`bash` tool covers these — prefer `bash`).

**Skills** — the payload `<skills>` block already sends every skill's name, description and location; here only notes NOT sent elsewhere (frontmatter pitfall: see MACHINE CONSTRAINTS §5):
- `creating-pi-tools` — **HARD RULE — read its SKILL.md BEFORE any pi-feature task; never from memory** (also `/skill:creating-pi-tools` to force-load).
- `matplotlib` (2026-09-21) — needs Python 3.10+ / matplotlib 3.10.x.
- `goal` — `goal-deterministic` skill + `/goal_deterministic` command removed 2026-09-21.

## UPDATING THIS MEMORY

If a behavior changes (WSL fixed, pi updated, new constraint),
update the concerned project AGENTS.md. **Facts flow**: verified
facts → `VERIFIED_FACTS.md`; superseded `[OUT]` beyond the latest per section →
`VERIFIED_FACTS_HISTORY.md`; refresh STATS; after any pi upgrade re-verify every
`[VOLATILE]` fact (guard fact in VF §Pi).
Golden rules: **the next session must work first-try, generate subagents to spare context**.
