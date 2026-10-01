# pi-personal — git save of a full pi setup (pi v0.86.1)

Snapshot of a working pi installation + personal configuration, taken 2026-10-01
from a Windows 11 machine (Node v24.12.0, PowerShell 5.1, git 2.52).

| Folder | Content |
|---|---|
| `harness/` | The pi program itself — npm package `@earendil-works/pi-coding-agent` **v0.86.1**, including the locally patched runtime in `dist/bundle/` (see Notes) |
| `dot-pi/` | The personal configuration (a copy of `~/.pi/agent`): skills, agents, extensions, memory files, provider/model settings |

**Excluded by design** (see table at the bottom): session data, all API keys and
credential stores, development tools, the npm package cache and
`harness/node_modules` (fetched by `npm install`).

---

## Prerequisites (one-time, on the new machine)

- Windows 10/11 (PowerShell 5.1+ ships with the OS)
- Node.js LTS (source machine runs v24.12.0): `winget install OpenJS.NodeJS.LTS`
- git: `winget install Git.Git`
- Open a **new** PowerShell window after installing Node.

## Install — from the harness folder to a working session

All commands below are PowerShell.

```powershell
# 0) Get this folder somewhere, e.g. C:\pi-personal  (git clone or copy)

# 1) Install the EXACT same pi version from the saved harness
cd C:\pi-personal\harness
npm install -g .
pi --version            # expected: 0.86.1
#   (zero-install check: node .\dist\bundle\cli.js --version — the bundle is self-contained)

# 2) Restore the personal configuration into ~/.pi
Copy-Item -Recurse -Force .\..\dot-pi\* $env:USERPROFILE\.pi\

# 3) Put YOUR OWN API key in (masked in this save)
notepad $env:USERPROFILE\.pi\agent\models.json
#   -> replace "sk-REMPLACEZ_PAR_VOTRE_CLE" with your key
#   (or use a built-in provider instead: pi login, then set
#    defaultProvider / defaultModel in $env:USERPROFILE\.pi\agent\settings.json)

# 4) Reinstall the pi packages (excluded from the save; they auto-load at
#    startup because settings.json carries the "packages" key)
pi install npm:pi-okf
pi install npm:pi-tps-live@1.0.1

# 5) Start a working session
pi
```

## Verify the session is complete

- Footer shows a live **tok/s** line (pi-tps-live package)
- `/` completion offers: `/okf-validate`, `/okf-inspect`, `/okf-diff`, `/okf-init`,
  `/okf-capture`, `/okf-update`, `/goal`, `/task`, `/clear`, `/skill:<name>`
- Skills available: `ALAN`, `ansys`, `fedoo`, `matplotlib`, `goal`, `task`
- Subagents available: `ANSYS`, `FEDOO`, `researcher`, `sum`
- The `bash` tool runs PowerShell commands (extension `bash-to-powershell.ts`)

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
| `alan-connector/` | `/ALAN_connector` — probes the ALAN OpenAI-compatible model service and writes `defaultModel` to settings.json (**secrets excluded**) |

### Skills (`dot-pi/agent/skills/`)

`ALAN` (ALAN model-service wiring) · `ansys` (ANSYS APDL adviser, OKF-backed) ·
`fedoo` (fedoo FEA-library adviser, OKF-backed) · `goal` (gauntlet-loop task bar) ·
`matplotlib` (plotting, needs Python 3.10+ / matplotlib 3.10.x) · `task` (minimal-bar task loop)

### Agents (`dot-pi/agent/agents/`)

`ANSYS` · `FEDOO` (domain advisers, OKF workflow per call) · `researcher` (read-only
investigation) · `sum` (VERIFIED_FACTS consolidation, used by the memory workflow)

### Memory & configuration (root of `dot-pi/agent/`)

`AGENTS.md` (session rules read by every pi session) · `AGENTS2.md` (longer variant) ·
`VERIFIED_FACTS.md` (verified environment facts) · `SAFE_LAUNCH.md` (safe-launch
procedure — references a launch script that is NOT part of this save) ·
`settings.json` (provider/model/packages/defaultTools) · `models.json`
(ALAN provider, **apiKey masked**) · `models.json.example` · `prompts/`
(`goal.md`, `task.md`) · `bin/` (`fd.exe`, `rg.exe` — used by pi's find/grep when present)

### Pi npm packages (reinstalled in step 4)

`npm:pi-okf` (okf_* tools, /okf-* commands, okf skill) · `npm:pi-tps-live@1.0.1`
(footer tok/s)

## What was excluded, and why

| Excluded | Why |
|---|---|
| `sessions/` (~175 MB) | Private session history, regenerable |
| `auth.json`, `models-store.json` (×2) | Credential stores |
| `models.json` apiKey, `alan-connector/config.local.ps1`, `alan-connector/probe_result.json` | API keys (masked/replaced by `sk-REMPLACEZ_PAR_VOTRE_CLE` in `models.json`; the other two are simply absent) |
| `*.bak*`, `models_back.json`, `*.log` | Backups and logs |
| `dot-pi/agent/npm/` (package cache) | Reinstalled via `pi install` (step 4) |
| `harness/node_modules` (~364 MB) | Fetched by `npm install`; the patched runtime lives in `dist/bundle/` and IS kept |
| **Dev tools — skills:** `creating-pi-tools`, `github`, `okf-agent-workflow` | Harness/agent development workflows, not part of the working setup |
| **Dev tools — agents:** `coder`, `reviewer`, `injection-screen`, `ps`, `shell`, `Storage_future_service/` | Code-implementation / code-review / security-scan / shell-glue subagents and a dev workbench |
| **Dev tools — extension:** `git_it.ts` | Git-workflow extension under development |
| `.pi/jsonl_to_messages.py` + `Readme_jsonl_to_messages.txt`, `.pi/scratch/` | Session-processing utility + scratch area |

To re-add any dev tool later: copy the file/folder back into `dot-pi/agent/…` —
top-level `.ts` extensions, agent `.md` files and skill folders are auto-discovered
on the next pi start.

## Notes

- **The saved harness carries a local fix**: the `/skill:` autocomplete fix lives in
  `dist/bundle/chunks/chunk-CMRUVXTE.js`. Installing from the npm registry instead
  (`npm install -g @earendil-works/pi-coding-agent@0.86.1`) gives the same version
  but **loses that fix**.
- **ALAN provider**: `models.json` points at `https://alan.univ-grenoble-alpes.fr/api`
  — the source user's own OpenAI-compatible model service. If it is not reachable
  from your machine, set `defaultProvider`/`defaultModel` in
  `$env:USERPROFILE\.pi\agent\settings.json` to any provider you have access to
  (e.g. after `pi login`), or edit/replace the `alan` entry in `models.json`.
- The ANSYS and FEDOO skills/agents reference OKF knowledge bundles on the source
  machine (`Doc_tech_ANSYS/okf`, `Doc_tech_fedoo/okf`) — those bundles are not part
  of this save; the agents still work, they just start with an empty local bundle.
