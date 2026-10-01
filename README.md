# pi-personal — git save of a full pi setup (pi v0.86.1)

Snapshot of a working pi installation + personal configuration, taken 2026-10-01
from a Windows 11 machine (Node v24.12.0, PowerShell 5.1, git 2.52).

| Folder | Content |
|---|---|
| `harness/` | The pi program itself — npm package `@earendil-works/pi-coding-agent` **v0.86.1** + its **complete `node_modules` dependency tree** (14 379 files, 364 MB), including the `@earendil-works` scoped packages (`chord`, `pi-agent-core`, `pi-ai`, `pi-telemetry`, `pi-tui` — the latter carrying the local `/skill:` autocomplete patch) and the locally patched runtime in `dist/bundle/` (see Notes) |
| `dot-pi/` | The personal configuration (a copy of `~/.pi/agent`): skills, agents, extensions, memory files, provider/model settings |

**Portable by design**: no path in this project is hard-coded to the source user
(`connessn`). Everything resolves relative to the installing user's profile:
pi config under `%USERPROFILE%\.pi\`, optional doc trees under `%USERPROFILE%\Datas\…`
(see [Path conventions](#path-conventions)).

**Excluded by design** (table at the bottom): session data, all API keys and
credential stores, development tools, the pi package cache (`dot-pi/agent/npm/`).

---

## Prerequisites (one-time, on the new machine)

- Windows 10/11 (PowerShell 5.1+ ships with the OS)
- Node.js LTS (source machine runs v24.12.0)
- git

Install them (PowerShell, run as **normal user** — winget installs for the current user by default):

```powershell
winget install OpenJS.NodeJS.LTS
winget install Git.Git
# close and reopen PowerShell so the new PATH (node, npm, git) is picked up, then check:
node --version    # v24.x expected (any recent LTS works)
npm --version
git --version
```

## Install — from the harness folder to a working session

All commands below are PowerShell. Copy them verbatim, changing only
`C:\pi-personal` if you cloned/copied the repo elsewhere.

```powershell
# ── 0) Get this folder ─────────────────────────────────────────────────────────
# Option A — clone the repo (private repo: you need access + a git credential,
# e.g. `gh auth login` first, or a personal access token):
git clone https://github.com/Tithanium/pi-personal C:\pi-personal
# Option B — you already have the folder (USB, sync, …): just cd into it below.

# ── 1) Install the EXACT same pi version from the saved harness ───────────────
# (harness/ contains the full package incl. node_modules, so the installed copy
#  is byte-identical to the source machine's — incl. the local patches)
cd C:\pi-personal\harness
npm install -g .
pi --version            # expected: 0.86.1
# zero-install sanity check (the shipped bundle is self-contained):
node .\dist\bundle\cli.js --version        # also expected: 0.86.1

# ── 2) Restore the personal configuration into ~/.pi ──────────────────────────
# (on a machine that already has a ~/.pi, this merges — dot-pi wins on conflicts;
#  if you want a pristine start, do:  Remove-Item $env:USERPROFILE\.pi -Recurse -Force)
Copy-Item -Recurse -Force C:\pi-personal\dot-pi\* $env:USERPROFILE\.pi\
Test-Path $env:USERPROFILE\.pi\agent\settings.json    # expected: True

# ── 3) Connect a model provider ───────────────────────────────────────────────
# You need ONE working provider before pi can answer. Two routes:

# Route A (recommended if you have access to the ALAN UGA service):
#   let /ALAN_connector do it — it asks for the key ONLY if the service requires
#   one, then SAVES EVERYTHING AUTOMATICALLY (provider + key + default model).
#   Start pi and run:   /ALAN_connector
#   (details in the ALAN section below)

# Route B (any other provider — e.g. a built-in one via OAuth/login):
pi login
# then set the defaults in the settings file:
notepad $env:USERPROFILE\.pi\agent\settings.json
#   -> "defaultProvider" / "defaultModel" to a provider+model you now have

# Route C (manual ALAN key entry, no pi session yet):
notepad $env:USERPROFILE\.pi\agent\models.json
#   -> replace "sk-REMPLACEZ_PAR_VOTRE_CLE" with your ALAN API key
#   (the masked models.json is pre-wired to https://alan.univ-grenoble-alpes.fr/api)

# ── 4) Reinstall the pi packages ──────────────────────────────────────────────
# (excluded from the save; they auto-load at startup because settings.json
#  carries the "packages" key — this step only fetches them onto disk)
pi install npm:pi-okf
pi install npm:pi-tps-live@1.0.1
pi list                 # expected: npm:pi-okf + npm:pi-tps-live@1.0.1

# ── 5) Start a working session ────────────────────────────────────────────────
pi
```

## Verify the session is complete

- Footer shows a live **tok/s** line (pi-tps-live package)
- `/` completion offers: `/okf-validate`, `/okf-inspect`, `/okf-diff`, `/okf-init`,
  `/okf-capture`, `/okf-update`, `/goal`, `/task`, `/clear`, `/ALAN_connector`, `/skill:<name>`
- Skills available: `ALAN`, `ansys`, `fedoo`, `matplotlib`, `goal`, `task`
- Subagents available: `ANSYS`, `FEDOO`, `researcher`, `sum`
- The `bash` tool runs PowerShell commands (extension `bash-to-powershell.ts`)

## ALAN provider — the /ALAN_connector flow (key auto-save)

The ALAN (UGA) OpenAI-compatible service is wired through the
`alan-connector` extension (`~/.pi/agent/extensions/alan-connector/`, shipped in `dot-pi/`).
In a pi session:

```
/ALAN_connector
```

1. **Probe**: it calls `GET https://alan.univ-grenoble-alpes.fr/api/models`.
   The API key is read from `config.local.ps1` in the extension folder if that
   file exists — otherwise the probe runs unauthenticated.
2. **Key prompt (only if required)**: if the service answers HTTP 401/403, pi asks
   you interactively for the **ALAN (UGA) API key** (input line under the prompt).
   You can also pass it directly — the only argument form: `/ALAN_connector <apiKey>`.
3. **Model picker**: a scrollable list of the live models appears below the prompt
   (↑/↓ navigate, Enter select, Esc cancel).
4. **Auto-save (no further questions)**: on select, the command
   - backs up `~/.pi/agent/models.json` + `settings.json` (`.bak_yyyyMMdd_HHmmss`),
   - merges `providers.alan` **including the API key** into `models.json`,
   - sets `defaultProvider: alan` + `defaultModel: <picked>` in `settings.json`,
   - **hot-applies** to the running session (live catalog reload + model switch —
     no restart needed).
5. The key is never printed and never written to any log.

So on a fresh install: start pi → `/ALAN_connector` → (paste key if asked) → pick
a model → done. Rollback after a bad write: `/ALAN_connector` has no subcommands
anymore — run the script directly:
`pwsh "$env:USERPROFILE\.pi\agent\extensions\alan-connector\alan_config_writer.ps1" -Restore`

If the ALAN service is NOT reachable from your machine (it is the source user's
institutional service), skip it and use Route B/C above with any provider you
have; the ALAN skill and extension remain inert but harmless.

## Path conventions

- `~` = your user profile = `%USERPROFILE%` (e.g. `C:\Users\<you>`).
- pi config: `%USERPROFILE%\.pi\agent\` (skills, agents, extensions, settings.json,
  models.json, memory files). All extensions/skills/agents in this save resolve
  their own files from there — nothing is hard-coded to the source user.
- Optional doc trees referenced by the `ansys` / `fedoo` skills and agents
  (ANSYS APDL documentation + examples, fedoo docs + examples + OKF bundles) live
  under `%USERPROFILE%\Datas\02_RECHERCHE\00_Biblio\…` **on the source machine only** —
  that research data is NOT part of this save. If the folders don't exist on your
  machine, the ANSYS/FEDOO advisers still load and work, but answer without local
  doc references (their OKF bundles start empty). To restore full behavior, place
  the `Doc_tech_ANSYS` / `Doc_tech_fedoo` trees under `%USERPROFILE%\Datas\02_RECHERCHE\00_Biblio\`.
- The ALAN skill's documentation artifacts (`PROBE_RECIPE.md`,
  `PI_PROVIDER_WIRING.md`) lived in the source machine's dev folder
  `%USERPROFILE%\Datas\02_RECHERCHE\11_all_AI\00_Harnesses_launch_ALAN` — dev
  tooling, not part of this save; all runnable behavior is in the
  `alan-connector` extension folder instead.

## What is included

### Extensions (`dot-pi/agent/extensions/`)

| Item | Role |
|---|---|
| `subagent/` | The `subagent` tool — spawns the agents in `dot-pi/agent/agents/` as fresh `pi -p` sessions |
| `bash-to-powershell.ts` | Reroutes pi's `bash` tool onto the PowerShell backend (WSL bash was dead on the source machine) |
| `wsl-powershell.ts` | Translates WSL commands to PowerShell with a byte-identical syntax check + curated verified mapping; `/wsl2ps <cmd>` |
| `clear-command.ts` | `/clear` — exact alias of the built-in `/new` |
| `model-default-confirm.ts` | Asks "y?" before persisting a new startup default model |
| `token-rate.ts` | Footer token-rate (overlaps pi-tps-live; source machine keeps pi-tps-live) |
| `validate-verified-facts.mjs` | Lint of `VERIFIED_FACTS.md` (fact format) |
| `alan-connector/` | `/ALAN_connector` — probes the ALAN OpenAI-compatible model service, asks for the key if required, saves provider+key+default (see ALAN section). **Secrets excluded** (`config.local.ps1`, `probe_result.json` git-ignored) |

### Skills (`dot-pi/agent/skills/`)

`ALAN` (ALAN model-service wiring) · `ansys` (ANSYS APDL adviser, OKF-backed) ·
`fedoo` (fedoo FEA-library adviser, OKF-backed) · `goal` (gauntlet-loop task bar) ·
`matplotlib` (plotting, needs Python 3.10+ / matplotlib 3.10.x) · `task` (minimal-bar task loop)

### Agents (`dot-pi/agent/agents/`)

`ANSYS` · `FEDOO` (domain advisers, OKF workflow per call) · `researcher` (read-only
investigation) · `sum` (VERIFIED_FACTS consolidation, used by the memory workflow)

### Memory & configuration (root of `dot-pi/agent/`)

`AGENTS.md` (session rules read by every pi session) · `AGENTS2.md` (longer variant) ·
`VERIFIED_FACTS.md` (verified environment facts — a history of the SOURCE machine,
banner at the top) · `SAFE_LAUNCH.md` (safe-launch procedure — source-machine
provenance only, its launch script is not part of this save) ·
`settings.json` (provider/model/packages/defaultTools) · `models.json`
(ALAN provider, **apiKey masked as `sk-REMPLACEZ_PAR_VOTRE_CLE`**) ·
`models.json.example` · `prompts/` (`goal.md`, `task.md`) ·
`bin/` (`fd.exe`, `rg.exe` — used by pi's find/grep when present)

### Pi npm packages (reinstalled in step 4)

`npm:pi-okf` (okf_* tools, /okf-* commands, okf skill) · `npm:pi-tps-live@1.0.1`
(footer tok/s)

## What was excluded, and why

| Excluded | Why |
|---|---|
| `sessions/` (~175 MB) | Private session history, regenerable |
| `auth.json`, `models-store.json` (×2) | Credential stores |
| `models.json` apiKey, `alan-connector/config.local.ps1`, `alan-connector/probe_result.json` | API keys (masked/replaced by `sk-REMPLACEZ_PAR_VOTRE_CLE` in `models.json`; the other two are simply absent and git-ignored) |
| `*.bak*`, `models_back.json`, `*.log` | Backups and logs |
| `dot-pi/agent/npm/` (package cache) | Reinstalled via `pi install` (step 4) |
| **Dev tools — skills:** `creating-pi-tools`, `github`, `okf-agent-workflow` | Harness/agent development workflows, not part of the working setup |
| **Dev tools — agents:** `coder`, `reviewer`, `injection-screen`, `ps`, `shell`, `Storage_future_service/` | Code-implementation / code-review / security-scan / shell-glue subagents and a dev workbench |
| **Dev tools — extension:** `git_it.ts` | Git-workflow extension under development |
| `.pi/jsonl_to_messages.py` + `Readme_jsonl_to_messages.txt`, `.pi/scratch/` | Session-processing utility + scratch area |

To re-add any dev tool later: copy the file/folder back into `dot-pi/agent/…` —
top-level `.ts` extensions, agent `.md` files and skill folders are auto-discovered
on the next pi start.

## Notes

- **The saved harness carries a local fix in BOTH runtime copies**: the `/skill:`
  autocomplete fix lives in `dist/bundle/chunks/chunk-CMRUVXTE.js` (the shipped
  bundle) AND in `node_modules/@earendil-works/pi-tui/dist/autocomplete.js` (the
  source dep). Both are included in this save. Installing from the npm registry
  instead (`npm install -g @earendil-works/pi-coding-agent@0.86.1`) gives the same
  version but **loses the fix**. Note: `harness/node_modules` also ships the
  per-platform `@esbuild/*` binaries (needed by pi's toolchain; ~120 MB of the
  364 MB — the win32-x64 one is the one actually used).
- **ALAN provider**: `models.json` points at `https://alan.univ-grenoble-alpes.fr/api`
  — the source user's institutional OpenAI-compatible model service. If it is not
  reachable from your machine, set `defaultProvider`/`defaultModel` in
  `$env:USERPROFILE\.pi\agent\settings.json` to any provider you have access to
  (e.g. after `pi login`), or edit/replace the `alan` entry in `models.json`.
- **Update cycle from this repo**: after changing anything in `dot-pi/` or
  `harness/`, `git add -A && git commit -m "..." && git push` (private repo —
  keep it that way; it carries private configuration even though no live keys).
