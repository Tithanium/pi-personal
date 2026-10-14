# pi-personal — git save of a full pi setup (pi v1.2.0)

Snapshot of a working pi installation + personal configuration, taken **2026-10-14**
from a Windows 11 machine (Node v24.12.0, PowerShell 5.1, git 2.52).

| Folder | Content |
|---|---|
| `harness/` | The pi program itself — npm package `@earendil-works/pi-coding-agent` **v1.2.0** + its **complete `node_modules` dependency tree** (14 993 files, ~106 MB, 78 top-level deps), incl. the `@earendil-works` scoped packages (`chord`, `pi-agent-core`, `pi-ai`, `pi-telemetry`, `pi-tui`). This is the **pristine published** 1.2.0 (no local patches — see Notes). |
| `dot-pi/` | The personal configuration (a copy of `~/.pi/agent`): skills, agents, extensions, prompts, memory files, provider/model settings |

**Portable by design**: no path in this project is hard-coded to the source user
(`connessn`). Everything resolves relative to the installing user's profile:
pi config under `%USERPROFILE%\.pi\`, optional doc trees under `%USERPROFILE%\Datas\…`
(see [Path conventions](#path-conventions)).

**Excluded by design** (table at the bottom): session data, all API keys and
credential stores, the pi package cache (`dot-pi/agent/npm/`), and the
`pi-local-rag` local index (`~/.pi/rag/`, machine-specific, rebuilt on demand).
The full current set of extensions, skills and agents **is** included.

> **Re-run this save later**: the `comit_pi` subagent (in `dot-pi/agent/agents/`)
> automates the whole save-and-push. Ask pi to "run comit_pi" / "save the pi harness"
> and it rebuilds `harness/` + `dot-pi/agent/` from the live machine, masks the key,
> checks the safety gates, and pushes to `origin/main`.

---

## Prerequisites (one-time, on the new machine)

- Windows 10/11 (PowerShell 5.1+ ships with the OS)
- Node.js LTS (source machine runs v24.12.0)
- git

Install them (PowerShell, run as **normal user** — winget installs for the current user by default):

```powershell
winget install OpenJS.NodeJS.LTS
winget install Git.Git
# make PowerShell behave like cmd for npm/node: PS resolves `npm` to the npm.ps1
# script shim (blocked by the default Restricted execution policy), cmd uses
# npm.cmd. One-time, per-user, no admin needed:
Set-ExecutionPolicy -Scope CurrentUser -Force RemoteSigned
# close and reopen PowerShell so the new PATH (node, npm, git) is picked up, then check:
node --version    # v24.x expected (any recent LTS works)
npm --version
git --version
```

> **If `npm` works in `cmd` but not in PowerShell:** both shells see the same
> PATH, but they resolve `npm` to different shims — `cmd` runs `npm.cmd`, while
> PowerShell runs the `npm.ps1` script, which the default **Restricted**
> execution policy blocks ("running scripts is disabled"). One-time fix, no
> admin needed:
>
> ```powershell
> Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
> ```
>
> Same result without changing the policy: type `npm.cmd` instead of `npm` in
> PowerShell. If the error is instead "`npm` is not recognized", it is a stale
> PATH, not a shim issue — the terminal was opened before the winget install;
> close it and reopen it.

## Install — from the harness folder to a working session

All commands below are PowerShell and use the FIXED path `C:\pi-personal` —
no variables, so every command works in any window (even a freshly opened
one). If the repo is not there, run the one-time move in step 0.

```powershell
# ── 0) Get this folder ─────────────────────────────────────────────────────────
# Option A — clone the repo (private repo: you need access + a git credential,
# e.g. `gh auth login` first, or a personal access token):
git clone https://github.com/Tithanium/pi-personal C:\pi-personal
# Option B — you already have the folder (USB, sync, …) at another path:
#            move it to C:\pi-personal ONCE (adapt the source path):
#            Move-Item "C:\where\you\put\pi-personal" C:\pi-personal

# ── 1) Install the EXACT same pi version from the saved harness ───────────────
# (harness/ contains the full package incl. node_modules, so the installed copy
#  is byte-identical to the source machine's)
cd C:\pi-personal\harness
npm install -g .
pi --version            # expected: 1.2.0
# zero-install sanity check (the shipped bundle is self-contained):
node .\dist\bundle\cli.js --version        # also expected: 1.2.0

# ── 2) Restore the personal configuration into ~/.pi ──────────────────────────
# TWO CASES — the same three commands handle both:
#
#   CASE A — ~/.pi ALREADY EXISTS (pi was already used on this machine):
#            the copy MERGES into the existing ~/.pi; on file conflicts the
#            saved config (dot-pi) wins; your existing sessions stay untouched.
#            For a PRISTINE start instead, delete the old config FIRST:
#                Remove-Item $env:USERPROFILE\.pi -Recurse -Force
#
#   CASE B — ~/.pi DOES NOT EXIST (fresh machine):
#            the folder MUST be created BEFORE the copy. If you copy into a
#            non-existent destination, Copy-Item renames the single copied
#            folder (agent) TO .pi itself — the files then land one level too
#            high (.pi\settings.json instead of .pi\agent\settings.json).
#
# The New-Item line is what makes case B safe; it is a no-op in case A.
New-Item -ItemType Directory -Force $env:USERPROFILE\.pi | Out-Null
Copy-Item -Recurse -Force C:\pi-personal\dot-pi\* $env:USERPROFILE\.pi\
Test-Path $env:USERPROFILE\.pi\agent\settings.json    # expected: True (both cases)

# ── 3) Install the pi packages the config expects ─────────────────────────────
# (they are excluded from the save, so they are fetched from npm here; the
#  packages key in settings.json already lists them, but pi can only load a
#  package that is present in the local cache ~/.pi/agent/npm/)
pi install npm:pi-okf
pi install npm:pi-tps-live@1.0.1
pi install npm:pi-observational-memory

# ── 4) Start a working session ────────────────────────────────────────────────
pi
```

Then, in the pi session:

```
/ALAN_connector <your ALAN API key>   # connect the ALAN provider (key saved)
/model                                 # pick a model
```

(details in the ALAN section below)

## Verify the session is complete

- Footer shows a live **tok/s** line (`pi-tps-live` package, plus the local
  extension `token-rate.ts`)
- `/` completion offers: `/okf-validate`, `/okf-inspect`, `/okf-diff`, `/okf-init`,
  `/okf-capture`, `/okf-update`, `/ALAN_connector`, `/model-ctx`, `/wsl2ps`,
  `/convert_pdf`, `/clear`, `/goal`, `/task`, `/skill:<name>`, `/agents:<name>`
- Skills available: `ALAN`, `ansys`, `creating-pi-tools`, `fedoo`, `github`,
  `goal`, `matplotlib`, `okf-agent-workflow`, `task`
- Subagents available: `ANSYS`, `FEDOO`, `coder`, `comit_pi`,
  `fedoo-example-runner`, `fedoo-okf-merger`, `fedoo-report-writer`,
  `fedoo-run-critic`, `injection-screen`, `ps`, `rag-query`, `researcher`,
  `reviewer`, `shell`, `sum`
- The `bash` tool runs PowerShell commands (extension `bash-to-powershell.ts`)

**Troubleshooting — `Test-Path` from step 2 returned `False`:**
run `Get-ChildItem $env:USERPROFILE\.pi -Force -Name`. If the config files
(`settings.json`, `agents`, `skills`, …) appear directly under `.pi` with no
`agent` folder, the copy landed one level too high (case B trap). Redo step 2
case B: `Remove-Item $env:USERPROFILE\.pi -Recurse -Force` (only if `.pi` holds
nothing of your own) → `New-Item -ItemType Directory -Force $env:USERPROFILE\.pi | Out-Null`
→ copy again → retest.

## ALAN provider — the /ALAN_connector flow (key auto-save)

The ALAN (UGA) OpenAI-compatible service is wired through the `ALAN_connector`
extension (`~/.pi/agent/extensions/ALAN_connector/index.ts` — a single, fully
self-contained TypeScript file, shipped in `dot-pi/`). It uses **no** PowerShell
scripts, `probe_result.json`, or external log files. In a pi session:

```
/ALAN_connector            # or: /ALAN_connector <your ALAN API key>
```

1. **Probe**: it calls `GET https://alan.univ-grenoble-alpes.fr/api/models`
   directly from Node. The base URL can be overridden with the `ALAN_BASE_URL`
   environment variable.
2. **Key resolution (in order)**: (a) the argument `/ALAN_connector <key>`,
   (b) the `ALAN_API_KEY` environment variable, (c) `api_config.json` created
   next to `index.ts` after first use, (d) the existing `providers.alan.apiKey`
   in `models.json`, (e) an interactive prompt. The prompt only appears if the
   probe answers **HTTP 401/403** (or no key was found at all).
3. **Model picker**: a scrollable list of the live models appears below the prompt
   (↑/↓ navigate, Enter select, Esc cancel).
4. **Auto-save (no further questions)**: on select, the command
   - backs up `~/.pi/agent/models.json` + `settings.json` (`.bak_yyyyMMdd_HHmmss`;
     skipped when the newest backup already has identical content),
   - merges `providers.alan` **including the API key** into `models.json`,
   - sets `defaultProvider: alan` + `defaultModel: <picked>` in `settings.json`,
   - **hot-applies** to the running session (catalog reload + model switch —
     no restart needed),
   - persists the key to `api_config.json` (next to `index.ts`) when it was
     supplied as an argument or entered interactively, so it is not needed again.
5. The key is never printed and never written to any log.

So on a fresh install: start pi → `/ALAN_connector <your ALAN API key>` →
`/model` → pick a model → done.

**Rollback after a bad write** (no subcommand): the command always leaves
`models.json.bak_*` / `settings.json.bak_*` next to the originals — copy the
newest one back over the original in `~/.pi/agent/` and restart pi, or simply
re-run `/ALAN_connector <correct key>` to rewrite the config.

> **Note**: `api_config.json` is created at runtime and is **git-ignored** — it
> is never part of this repo. The committed `models.json` carries the masked
> placeholder `sk-REMPLACEZ_PAR_VOTRE_CLE`.

If the ALAN service is NOT reachable from your machine (it is the source user's
institutional service), skip it and set `defaultProvider`/`defaultModel` in
`$env:USERPROFILE\.pi\agent\settings.json` to any provider you have (see the
ALAN provider note in [Notes](#notes)); the ALAN skill and extension remain
inert but harmless.

## Path conventions

- `~` = your user profile = `%USERPROFILE%` (e.g. `C:\Users\<you>`).
- pi config: `%USERPROFILE%\.pi\agent\` (skills, agents, extensions, prompts,
  settings.json, models.json, memory files). All extensions/skills/agents in
  this save resolve their own files from there — nothing is hard-coded to the
  source user.
- Optional doc trees referenced by the `ansys` / `fedoo` skills and agents
  (ANSYS APDL documentation + examples, fedoo docs + examples + OKF bundles) live
  under `%USERPROFILE%\Datas\02_RECHERCHE\00_Biblio\…` **on the source machine only** —
  that research data is NOT part of this save. If the folders don't exist on your
  machine, the ANSYS/FEDOO advisers still load and work, but answer without local
  doc references (their OKF bundles start empty). To restore full behavior, place
  the `Doc_tech_ANSYS` / `Doc_tech_fedoo` trees under `%USERPROFILE%\Datas\02_RECHERCHE\00_Biblio\`.
- The ALAN skill's documentation artifacts lived in the source machine's dev folder
  `%USERPROFILE%\Datas\02_RECHERCHE\11_all_AI\00_Harnesses_launch_ALAN` — dev
  tooling, not part of this save; all runnable behavior is in the
  `ALAN_connector` extension folder instead.

## What is included

### Extensions (`dot-pi/agent/extensions/`)

| Item | Role |
|---|---|
| `subagent/` | The `subagent` tool — spawns the agents in `dot-pi/agent/agents/` as fresh `pi -p` sessions |
| `bash-to-powershell.ts` | Reroutes pi's `bash` tool onto the PowerShell backend (WSL bash was dead on the source machine) |
| `wsl-powershell.ts` | Translates WSL commands to PowerShell with a byte-identical syntax check + curated verified mapping; `/wsl2ps <cmd>` |
| `clear-command.ts` | `/clear` — exact alias of the built-in `/new` |
| `model-default-confirm.ts` | Asks "y?" before persisting a new startup default model |
| `model-context-picker.ts` | Context-length-aware `/model` picker (Enter on `/model`); fallback command `/model-ctx` |
| `token-rate.ts` | Footer token-rate (overlaps pi-tps-live; source machine keeps pi-tps-live) |
| `validate-verified-facts.mjs` | Lint of `VERIFIED_FACTS.md` (fact format) |
| `git_it.ts` | Git-workflow extension (`/git_it --github …`) |
| `ALAN_connector/` | `/ALAN_connector` — self-contained probe → key prompt (only on 401/403) → model picker → auto-save provider+key+default (see ALAN section). Runtime key file `api_config.json` is git-ignored |
| `convert-pdf/` | `/convert_pdf <folder> [--force] [--out DIR]` — recursive PDF→text via `python pdf2text.py` (needs Python + pymupdf) |
| `pi-local-rag/` | Local RAG index over the doc trees (`/rag index|rebuild|refresh`, `rag_query`/`rag_index` tools). **Disabled by default** in `settings.json`; the local index `~/.pi/rag/rag.db` is NOT shipped (see Notes) |

### Skills (`dot-pi/agent/skills/`)

`ALAN` (ALAN model-service wiring) · `ansys` (ANSYS APDL adviser, OKF-backed) ·
`creating-pi-tools` (authoring pi packages/extensions/commands — the harness
skill) · `fedoo` (fedoo FEA-library adviser, OKF-backed) · `github` (GitHub/gh
workflows) · `goal` (gauntlet-loop task bar) · `matplotlib` (plotting, needs
Python 3.10+ / matplotlib 3.10.x) · `okf-agent-workflow` (wiring OKF into agents) ·
`task` (minimal-bar task loop)

### Agents (`dot-pi/agent/agents/`)

`ANSYS` · `FEDOO` (domain advisers, OKF workflow per call) · `researcher`
(read-only investigation) · `sum` (VERIFIED_FACTS consolidation, used by the
memory workflow) · `coder` (code implementation) · `reviewer` (code review) ·
`injection-screen` (prompt-injection scan) · `ps` / `shell` (PowerShell/shell
glue) · `rag-query` (RAG search fan-out used by the memory workflow) ·
`fedoo-example-runner` / `fedoo-okf-merger` / `fedoo-report-writer` /
`fedoo-run-critic` (fedoo example + report pipeline) · `comit_pi` (this repo's
save-and-push runbook) · `Storage_future_service/` (a dev workbench subfolder)

### Memory & configuration (root of `dot-pi/agent/`)

`AGENTS.md` (session rules read by every pi session) · `AGENTS2.md` (longer
variant) · `VERIFIED_FACTS.md` (verified environment facts — a history of the
SOURCE machine, banner at the top; the live ALAN key prefix is scrubbed) ·
`SAFE_LAUNCH.md` (safe-launch procedure — source-machine provenance only, its
launch script is not part of this save) · `settings.json` (provider/model/
packages/defaultTools; `pi-local-rag` disabled) · `keybindings.json` ·
`models.json` (ALAN provider, **apiKey masked as `sk-REMPLACEZ_PAR_VOTRE_CLE`**) ·
`models.json.example` · `prompts/` (`goal.md`, `task.md`) ·
`bin/` (`fd.exe`, `rg.exe` — used by pi's find/grep when present)

### Pi npm packages

Registered in `settings.json` (`packages` key) and installed in step 3:
`npm:pi-okf` (okf_* tools, /okf-* commands, okf skill) · `npm:pi-tps-live@1.0.1`
(footer tok/s) · `npm:pi-observational-memory` (observational memory / recall).

## What was excluded, and why

| Excluded | Why |
|---|---|
| `sessions/` (~175 MB) | Private session history, regenerable |
| `auth.json`, `models-store.json` | Credential stores |
| `models.json` apiKey (masked as `sk-REMPLACEZ_PAR_VOTRE_CLE`), the live key prefix in `VERIFIED_FACTS.md` (scrubbed), `ALAN_connector/api_config.json` | API keys — masked/scrubbed; the runtime key file is git-ignored and simply absent |
| `*.bak*`, `models_back.json`, `*.log` | Backups and logs |
| `dot-pi/agent/npm/` (package cache) | Reinstalled via `pi install` (step 3) |
| `~/.pi/rag/rag.db` + `~/.pi/rag-models/` (the `pi-local-rag` local index + ONNX model, ~1 GB) | Machine-specific index over the source user's local doc trees — useless on another machine until rebuilt. Rebuild on demand with `/rag rebuild` after re-enabling `pi-local-rag` |

> **Note on dev tools**: an earlier save (2026-10-01) deliberately excluded a set of
> development tools (skills `creating-pi-tools`, `github`, `okf-agent-workflow`;
> agents `coder`, `reviewer`, `injection-screen`, `ps`, `shell`,
> `Storage_future_service/`; extension `git_it.ts`). This save is a faithful
> snapshot of the **current** harness, so **all of them are now included**. To
> re-exclude any of them later: delete the file/folder from `dot-pi/agent/…` —
> top-level `.ts` extensions, agent `.md` files and skill folders are
> auto-discovered on the next pi start.

## Notes

- **The saved harness is the pristine published 1.2.0** — no local patches. The
  earlier 0.86.1 save carried a local `/skill:` autocomplete fix in the bundle and
  in `pi-tui`; that fix was dropped when the source machine upgraded past 0.86.1
  and is not part of 1.2.0. `harness/node_modules` also ships the per-platform
  `@esbuild/*` binaries (needed by pi's toolchain; the win32-x64 one is the one
  actually used).
- **`pi-local-rag` is disabled by default**: `settings.json` carries
  `"extensions": ["-extensions/pi-local-rag/index.ts"]`. The extension code is
  shipped, but the local index (`~/.pi/rag/rag.db`) and the embedding model
  (`~/.pi/rag-models/`) are not. To use it on a new machine: remove that
  `extensions` exclusion line, then run `/rag rebuild` (it indexes the doc trees
  it is configured for and downloads the model on first run).
- **ALAN provider**: `models.json` points at `https://alan.univ-grenoble-alpes.fr/api`
  — the source user's institutional OpenAI-compatible model service. If it is not
  reachable from your machine, set `defaultProvider`/`defaultModel` in
  `$env:USERPROFILE\.pi\agent\settings.json` to any provider you have access to
  (e.g. after `pi login`), or edit/replace the `alan` entry in `models.json`.
- **Update cycle from this repo**: the `comit_pi` subagent does the whole job
  (rebuild `harness/` + `dot-pi/agent/`, mask the key, run the gates, push).
  Manually it is: change something in the live `~/.pi/agent/` or upgrade pi →
  ask pi to run `comit_pi`. The repo is **private** — keep it that way; it carries
  private configuration even though it holds no live keys.
