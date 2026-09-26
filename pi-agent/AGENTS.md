# AGENTS.md — pi memory (global, Windows machine, user connessn)

> Read by EVERY pi session on this machine, any folder.
> Priority: security rules + anti-waste below.

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

1. **Shell = `bash` tool, always.**
   One attempt per tool: on failure, move to the next priority item (see item 2).
2. **Winning mode** (all verified working):
   - **shell command (npm/git/test/versions/listing): `bash` tool**   
   - files: `read` / `edit` / `write` (paths `C:/...` or `~`,
     forward slashes; `write` creates parents)
   - file copy: `read`(source) → `write`(dest) + partial re-read
   - dir listing: `bash` → `Get-ChildItem`; else read the README/index,
     or `read` a candidate path (`ENOENT` = free existence test)
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
| Global pi config | `C:/Users/connessn/.pi/agent/` (subdirs `agents/`, `extensions/`, `skills/`, `auth.json`) |
| Auto-detected extensions | `C:/Users/connessn/.pi/agent/extensions/` or `.pi/extensions/` (project) |
| Pi (npm) + docs + examples | `C:/Users/connessn/AppData/Roaming/npm/node_modules/@earendil-works/pi-coding-agent/` (`docs/`, `examples/extensions/`) |
| Project AGENTS.md | read in the current working dir (e.g. `Harnesses_launch_GRICAD/AGENTS.md`) |
| Verified facts (hypothesis checks) | `C:/Users/connessn/.pi/agent/VERIFIED_FACTS.md` — read before asserting, fed after each check; superseded facts archived to `VERIFIED_FACTS_HISTORY.md` (append-only, NOT a check target) |

## ALREADY INSTALLED (reuse as-is — rebuilding wastes turns)

> **Index only.** Verification detail (dates, commands, results) lives in
> `VERIFIED_FACTS.md` (§ Shell / § Pi / § Agents) — update facts THERE, never here.
> Superseded facts → `VERIFIED_FACTS_HISTORY.md` (archive, NOT a check target).

**Shell & tools**
- `bash` pi tool = PowerShell backend via extension `bash-to-powershell.ts` (VF §Shell "bash tool"). No command rewriting; PowerShell syntax. Built-in `powershell` tool (VF §Shell "powershell tool") enabled via `defaultTools` in `~/.pi/agent/settings.json` — resolved at startup only.
- Native tools without shell: `read` (ENOENT = free existence test), `edit`, `write`, subagent `researcher` (VF §Pi "native tools").

**Extensions** (auto-discovered top-level `*.ts`; `/reload` applies)
- `subagent` — tool modes single / parallel (max 8, conc. 4) / chain (`{previous}`). `/agents:<name>` shortcuts exist; command NAMES fixed at load → `/reload` to pick up new agent files.
- `/clear` = exact alias of `/new` (extension `clear-command.ts`, VF §Pi "clear-command"). Pitfall: post-replacement work must run inside `newSession({ withSession: (freshCtx) => … })` — captured ctx is stale after session replacement/reload.
- facts-sum hook REMOVED 2026-09-21 (crashed pi: `notify is not defined` at facts-sum-hook.ts:340; backup at `disabled-extensions/facts-sum-hook.ts`). Agent `sum` still exists — invoke manually via `/agents:sum`. Lint script `extensions/validate-verified-facts.mjs` still exists; run manually (`node .../validate-verified-facts.mjs <file>`), no longer auto-runs.

**Pi packages** (registered in `settings.json` `packages` → auto-load on startup, restart pi, no `/reload`)
- `pi-tps-live` footer tok/s (VF §Pi "pi-tps-live"). Install pattern: `pi install npm:<pkg>`.

**Agents** → `C:/Users/connessn/.pi/agent/agents/` — root `.md` only; subdir `Storage_future_service/` NOT auto-loaded (no recursion) (VF §Agents "agents dir"). One-liners:
- `researcher` read-only investigation/report · `coder` bounded implementation · `reviewer` verdict-first code review · `ANSYS` ANSYS APDL adviser (verify vs its docs; FULL syntax before replacing params) · `sum` fact consolidator · `ps`/`shell` raw command executors (`bash` tool covers these — prefer `bash`).

**Skills** (frontmatter = compact `parseFrontmatter`, VF §Pi "parseFrontmatter" — never write `: ` inside a frontmatter value, else silently dropped; verify with creating-pi-tools probe)
- `creating-pi-tools` — full `registerTool` contract + pi harness guards (v0.85.1, all pi-feature work).
- `matplotlib` (2026-09-21) — k-dense-ai scientific-agent-skills: low-level matplotlib (pyplot + OO API), `references/` (api, issues, plot types, styling) + `scripts/` (plot_template.py, style_configurator.py); needs Python 3.10+ / matplotlib 3.10.x
- `goal` / `goal-deterministic` — 3-step task → gauntlet loop (AI-critic judge / deterministic Python scorer, can mix). Triggers: `/goal <task>`, `/goal_deterministic <task>`, `/skill:goal*` (+ prompt templates `prompts/goal*.md`).

**Official examples**: `examples/extensions/` in the npm package (see README index): plan_mode, handoff, permission_gate, protected_paths, confirm_destructive, dirty_repo_guard, todo, question, questionnaire, structured_output, sandbox (Anthropic), gondolin (microVM).
re
## UPDATING THIS MEMORY

If a behavior changes (WSL fixed, pi updated, new constraint),
update the concerned project AGENTS.md. **Facts flow**: verified
facts → `VERIFIED_FACTS.md`; superseded `[OUT]` beyond the latest per section →
`VERIFIED_FACTS_HISTORY.md`; refresh STATS; after any pi upgrade re-verify every
`[VOLATILE]` fact (guard fact in VF §Pi).
Golden rules: **the next session must work first-try, generate subagents to spare context**.
