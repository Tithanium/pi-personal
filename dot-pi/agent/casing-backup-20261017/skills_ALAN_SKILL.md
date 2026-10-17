---
name: alan
description: Operates the ALAN (UGA) OpenAI-compatible model service from pi — the single-file /ALAN_connector extension (probe + model picker + pi provider wiring + hot-apply), the verified Alan gateway API surface, and the model-creation path (Open WebUI POST /api/v1/models/create). Use when choosing or connecting an ALAN model, running /ALAN_connector, adding a new model to Alan, writing or restoring the alan provider config in models.json/settings.json, or recovering pi config after a bad write.
---

# ALAN (UGA) service — connector, gateway surface, model creation, rollback

## Ground truth

**Active implementation** = one self-contained TypeScript extension:
`C:\Users\connessn\.pi\agent\extensions\ALAN_connector\index.ts` (~25.6 KB).
It is a **single file**. No PowerShell, no `probe_result.json`, no `config.ps1`, no
external log files. It may create exactly one local secret at runtime:
`api_config.json` **next to `index.ts`** (inside the same `ALAN_connector/` folder).

**Reference / legacy** (the TS code is derived from these; they are NOT executed by the
command today) = the ALAN toolkit folder:
`C:\Users\connessn\Datas\02_RECHERCHE\11_all_AI\00_Harnesses_launch_ALAN`
- `PROBE_RECIPE.md` — original deterministic probe recipe (the TS `fetchModels`/`extractModels` mirror it)
- `PI_PROVIDER_WIRING.md` — pi custom-provider schema, verbatim from the pi docs
- `alan_probe.ps1`, `alan_config_writer.ps1` — the legacy PowerShell probe + config writer
  (`alan_config_writer.ps1 -Restore` is still a valid restore path, see §5)
- `config.ps1` + `config.local.ps1` — legacy `$baseUrl`/`$apiKey`/`$preferredModelIds` source

Never print, log, or commit the API key. It lives in `api_config.json` (extension folder),
travels into `~/.pi/agent/models.json`, and the key value must never appear in any log,
widget line, or TUI output.

---

## 1. The /ALAN_connector command (single-file TypeScript)

Folder: `~/.pi/agent/extensions/ALAN_connector/` (name is **`ALAN_connector`**, uppercase `ALAN`,
underscore — NOT `alan-connector`). Auto-discovered (`*/index.ts`); apply with `/reload` or a pi restart.

### 1.1 Invocation

`/ALAN_connector [<apiKey>]`

The ONLY accepted argument is an optional API key (a single token that does not start with `-`).
Any other argument or a flag throws: `no arguments accepted — /ALAN_connector [<apiKey>]`.

> There are NO subcommands. The historical `--list`, `--model <id|N>`, `--dry-run`,
> `--restore`, `--help` are **gone** in the current single-file implementation. Do not
> document or "restore" them.

### 1.2 API-key resolution (first hit wins)

1. `<apiKey>` passed as the command argument
2. `ALAN_API_KEY` environment variable
3. `api_config.json` next to `index.ts` (the stored key)
4. existing `providers.alan.apiKey` already in `~/.pi/agent/models.json`
5. interactive prompt (`ctx.ui.input`, TUI only)

A key that came from (1) or (5) is **persisted to `api_config.json`** so later runs need no key.
If the probe is rejected with 401/403 and the key was not user-supplied, the command re-prompts
for a new key (TUI) and retries once.

Base URL: `ALAN_BASE_URL` env var, else the built-in default
`https://alan.univ-grenoble-alpes.fr/api` (trailing slashes stripped).

### 1.3 Probe (pure Node `fetch`, no shell)

- Call: `GET {baseUrl}/models`, `Authorization: Bearer <key>` (header only if a key is present),
  20 s `AbortController` timeout. Non-2xx → throws `Alan API request failed with HTTP <status>`.
- Response list extraction: `resp.data` → `resp.models` → the body itself if it is an array.
  Empty / no entry with a non-blank string `id` → hard error.
- Per model:
  - `id` (string), `name` (optional string)
  - `contextWindow` — first positive int among aliases `context_length, context_window,
    contextWindow, max_context_length, n_ctx, max_model_len, max_position_embeddings`,
    else the same search inside sub-objects `meta, info, model_info, params, parameters, openai`,
    else **32768**. **The real Alan field is `max_model_len`** (e.g. 262144 for Qwen3.8-27B).
  - `maxTokens` — first positive int among `max_tokens, max_completion_tokens, max_output_tokens,
    maxTokens, max_new_tokens` (+ same sub-objects), else **32768**. **Never found on Alan today**
    → the 32768 fallback is what actually gets written.

### 1.4 Model selection

- TUI (`ctx.hasUI` and more than one model): a `ctx.ui.custom` picker, 10 visible rows,
  `↑/↓` navigate, `Enter` select, `Esc` cancel (cancel = "nothing written", no error).
  Label per row: `<name>  (<id>) (<Nk>)` or `<id> (<Nk>)` when name==id.
- Headless, or exactly one model: selects index 0.

### 1.5 Config write (merge, backup, verify)

Agent-dir resolution: `OBSERVATION_ONLY_DIR` → `PI_CODING_AGENT_DIR` →
`$USERPROFILE\.pi\agent` → `$HOME\.pi\agent` (throws if all unset).

Into `~/.pi/agent/models.json` (merge — other providers preserved byte-for-byte):
```json
"providers": { "alan": {
  "baseUrl": "<baseUrl>", "api": "openai-completions", "apiKey": "<key>",
  "models": [ { "id": "...", "name": "<display>", "contextWindow": N, "maxTokens": N } ]
}}
```
- `name` is `displayModelName`: `<name>  (<id>) (<Nk>)` (or `<id> (<Nk>)` when name==id);
  any pre-existing `(<Nk>)` suffix is stripped first (idempotent). **The `(Nk)` is display-only**;
  `contextWindow` (tokens) is the source of truth.
- The previous `alan` provider object is shallow-copied then its `baseUrl/api/apiKey/models`
  keys are deleted and re-set (other unknown `alan` keys survive).

Into `~/.pi/agent/settings.json` (merge — all other keys preserved):
```json
{ "defaultProvider": "alan", "defaultModel": "<selectedId>" }
```

Safety sequence: pre-write validation (non-empty list, every `contextWindow`/`maxTokens` > 0)
→ **backup** `models.json` + `settings.json` to `.bak_yyyyMMdd_HHmmss` → write both →
**post-write verification** (re-parse both, check `alan.baseUrl/api/models[selected]` and
`defaultProvider/defaultModel`) → on any failure, restore the just-taken backups and throw.

Backup rule: a backup is taken only if the file exists AND is not already byte-identical to the
latest `.bak_*` (avoids stacking redundant backups). A file with no prior state gets no backup,
and restore removes it in that case.

### 1.6 Hot-apply + output

- Hot-apply: `ctx.modelRegistry.refresh()` → `registry.find("alan", <selectedId>)` →
  `pi.setModel(live)`. On success the live session switches immediately (no restart).
  Any exception here is non-fatal — the config is already written; `/model` can select it.
- Output: TUI → one line via `ctx.ui.setWidget("ALAN_connector", [line], {placement:"belowEditor"})`
  (rendered **under the editor**, never in the message area):
  - applied:  `[ALAN_connector] ALAN active: <id> — no restart needed`
  - not applied: `[ALAN_connector] ALAN config written: <id> — open /model to select`
- Headless → the same line via `console.log`. There is no external log file.
- Errors always `throw new Error(...)` (they surface as extension errors), and name what failed.

### 1.7 Live state snapshot (2026-10-14)

`~/.pi/agent/models.json` → `providers.alan.baseUrl=https://alan.univ-grenoble-alpes.fr/api`,
`api=openai-completions`, 15 models written; `settings.json` `defaultModel=qwen-3.8-27b`.

---

## 2. How the ALAN provider is wired in pi

Authoritative source: `PI_PROVIDER_WIRING.md` (pi docs). Route A = config-only via
`~/.pi/agent/models.json` (recommended for OpenAI-compatible endpoints) — no code, reloaded on
every `/model` open.

Rules that matter (models.md):
- The key under `providers` is the provider id (`alan`) used by `--provider alan`,
  `defaultProvider`, and `provider/modelId` strings.
- `baseUrl` + `api` are load-time requirements for a non-built-in provider. `apiKey` is NOT
  required to load — it only gates availability in `/model` / `--list-models` (no auth → models
  load but stay hidden from the picker).
- `api` selects the streaming dialect; Alan is `openai-completions` (OpenAI Chat Completions) —
  the most compatible flavor for vLLM / Open WebUI-style proxies.
- No network validation at load: pi never probes `{baseUrl}` at startup and never auto-fetches
  `/v1/models`; the connection is exercised only on the first real request.
- **Schema-perfect JSON is mandatory**: an unreadable/ill-formed `models.json` or `settings.json`
  drops the file (providers not recovered, only a warning). The connector therefore validates its
  output by re-parsing before and after writing and restores backups on any failure.
- Per-model defaults when omitted: `name`→`id`, `reasoning`→false, `input`→["text"],
  `contextWindow`→128000, `maxTokens`→16384, `cost`→zeros. The connector always writes explicit
  `id/name/contextWindow/maxTokens`.
- Model references are by `id` (may contain slashes); there is NO `aliases` field.

`settings.json` — only `defaultProvider` and `defaultModel` are touched; everything else
(`packages`, `theme`, `defaultTools`, …) is preserved by the merge-write.

Launch wiring: pi's config dir resolves as `PI_CODING_AGENT_DIR` → `$env:USERPROFILE\.pi\agent`.
Without the env var set, pi silently ignores written files. The Observation_only harness points
`OBSERVATION_ONLY_DIR` at its own mirror, and the connector resolves that **first**.

---

## 3. Alan gateway — verified API surface (2026-10-14)

Origin `https://alan.univ-grenoble-alpes.fr`; the pi `baseUrl` is the origin + `/api`.
The public endpoint is a **curated gateway** in front of Open WebUI — it exposes inference and
model listing only. What was probed (with the API key, `curl`/Node `fetch`):

| Request | Result | Meaning |
|---|---|---|
| `GET /health` | `200 {"status":true}` | liveness, no auth |
| `GET /api/models` | `200` JSON list | **what the connector uses** |
| `GET /api/v1/models` | `200` JSON list | same list, `/v1` spelling |
| `POST /api/chat/completions` | `200` completion | inference works with the key |
| `GET /api/v1/pipelines` | `401` "no permission" | route exists; this key is **not** admin |
| `POST /api/v1/models` / `/api/v1/models/` | `405` Method Not Allowed | **creation blocked** (see §4) |
| `POST /api/v1/models/{id}` | `405` | creation/update blocked |
| `POST /api/v1/pipelines/` | `405` | function creation blocked |
| `GET /api/v1/config`, `/v1/config`, `/v1/models`, `/api/v1/models/{id}`, `/api/v1/pipelines`, `/api/v1/users`, `/api/v1/profile`, `/api/v1/version`, `/api/v1/functions` | `200` but **Open WebUI HTML SPA** | NOT JSON — per-model detail and admin routes are **not exposed** on the curated gateway |

Consequences:
- There is **no per-model detail endpoint** on Alan (a `GET {baseUrl}/models/{id}` returns the
  HTML SPA with HTTP 200). The connector therefore never calls it; all limits come from the list.
- The curated gateway allows **GET list + POST inference** and nothing else. Any POST that is not
  chat completion returns 405, unconditionally (browser-like `Origin`/`Referer`/`sec-*` headers do
  not change this — verified).
- `max_model_len` is the only real context field; there is no `max_tokens` in the list.

---

## 4. Creating a new model on Alan (the working process)

The public gateway **cannot** create models (`POST /api/v1/models…` → 405, verified 2026-10-14).
The normal working path is **Alan's Open WebUI web interface** (admin login), which calls the
Open WebUI backend create endpoint. If you have access to the **full (non-curated) Open WebUI API
root** (admin context / internal network), the same thing can be done directly by the API.

### 4.1 The real endpoint + schema (current `open_webui` source)

`POST {fullApiBase}/api/v1/models/create`  (admin or `workspace.models` permission)

Body is a `ModelForm` (`open_webui/models/models.py`):
```json
{
  "id": "<model id: ^\\S+$, non-empty, ≤256 chars, no whitespace>",
  "name": "<display name>",
  "base_model_id": "<an existing model id, e.g. gpt-oss-120b>",
  "meta":   { },
  "params": { },
  "access_grants": [],
  "is_active": true,
  "commit_message": "optional"
}
```
- `id` must match `^\S+$`, be non-empty, ≤ 256 chars, contain no whitespace (`is_valid_model_id`).
  A model cannot have itself as `base_model_id`.
- **Permissions:** `admin` role, OR the `workspace.models` permission. A **non-admin MUST set
  `base_model_id`** (derivative models only) and may not reuse another user's preset id.
- `{fullApiBase}` is the full Open WebUI API root (the origin, e.g.
  `https://alan.univ-grenoble-alpes.fr`), reachable only where the admin API is exposed — NOT the
  curated `/api` gateway the pi provider uses.

Direct call (only where the full API is reachable and you hold an admin key):
```powershell
curl.exe -X POST "https://alan.univ-grenoble-alpes.fr/api/v1/models/create" `
  -H "Authorization: Bearer <admin-key>" -H "Content-Type: application/json" `
  --data @model.json
```

### 4.2 Observed example

`albator` (base_model_id `gpt-oss-120b`, `preset:true`, owned_by `openai`) is the product of such a
create — a derivative model an admin added, which then appears in `GET /api/models` and becomes
selectable by `/ALAN_connector`.

### 4.3 Honest current state

From this machine only the **curated public gateway** is reachable (creation = 405). To actually
add a model to Alan you must either (a) use the **Alan web UI with an admin account**, or (b) reach
the **full internal Open WebUI API** and call `/api/v1/models/create`. After any model is created
by either path, re-run `/ALAN_connector` to probe the fresh list and wire/pick it.

---

## 5. BACKUP-IF-PI-BREAKS procedure

### 5.1 What the connector backs up

Every real write of `/ALAN_connector` creates `models.json.bak_yyyyMMdd_HHmmss` +
`settings.json.bak_yyyyMMdd_HHmmss` in the resolved pi agent dir **before** writing (skipped only
when byte-identical to the latest). The connector touches NOTHING else — skills, agents,
extensions, `auth.json`, sessions are out of scope.

### 5.2 Restore config after a bad write

The connector has **no `--restore` flag** (removed in the single-file rewrite). Two valid restores:

```powershell
# (A) Legacy toolkit writer — restores the latest .bak pair, verifies by SHA-256, errors if none
pwsh C:\Users\connessn\Datas\02_RECHERCHE\11_all_AI\00_Harnesses_launch_ALAN\alan_config_writer.ps1 -Restore

# (B) Manual — copy the newest backup pair over the live files
$dir = Join-Path $env:USERPROFILE ".pi\agent"
Copy-Item "$dir\models.json.bak_<newest>"   "$dir\models.json"   -Force
Copy-Item "$dir\settings.json.bak_<newest>" "$dir\settings.json" -Force
```

Both target the same agent dir (the writer resolves `OBSERVATION_ONLY_DIR` → `PI_CODING_AGENT_DIR`
→ `$USERPROFILE\.pi\agent`). The writer prints `SHA256 backup` vs `SHA256 restored` per file and
exits 1 on any mismatch; a file with no backup in that timestamp is removed (it did not exist
before that write) to restore the prior state exactly. Verify manually with:
```powershell
Get-FileHash "$env:USERPROFILE\.pi\agent\models.json", "$env:USERPROFILE\.pi\agent\models.json.bak_*" -Algorithm SHA256
```

### 5.3 Full pi-installation backup (roll back a broken pi version)

The connector only ever covers `models.json`/`settings.json`. To roll back a broken **pi version**,
keep a full snapshot:
```powershell
$stamp = Get-Date -Format 'yyyyMMdd_HHmmss'
Copy-Item -Recurse -Force "$env:USERPROFILE\.pi" "$env:USERPROFILE\.pi.backup_$stamp"
npm ls -g --json > "$env:USERPROFILE\.pi.backup_$stamp\npm-global-list.json"
# rollback: npm install -g @earendil-works/pi-coding-agent@<previous-version>
```
Rollback order after a broken `pi update`: (1) reinstall the known-good version from the snapshot's
npm list; (2) restore `~/.pi` from the snapshot if config was also damaged; (3) verify `pi -v` and
`pi --list-models`. `auth.json` lives in `~/.pi/agent/` — covered by the `~/.pi` copy, NOT by the
connector's backup pair.

---

## 6. Verification checklist after any connect/write

- [ ] `~/.pi/agent/models.json` parses; `providers.alan.baseUrl`/`api`/`apiKey`/`models[]` present;
      other providers untouched
- [ ] `~/.pi/agent/settings.json` parses; `defaultProvider=alan`, `defaultModel=<selected>`;
      other keys value-identical
- [ ] A `.bak_yyyyMMdd_HHmmss` pair exists for the timestamp (unless it was byte-identical to the
      latest and skipped)
- [ ] `pi --list-models` (or `/model`) shows the alan models after `/reload` — the file reloads on
      every `/model` open
- [ ] Hot-apply happened (no restart): the session switched to the picked model; if it did not,
      open `/model` to select — a pi restart is only a fallback
- [ ] Model id with slashes: reference it exactly as in `models.json`, e.g.
      `pi --model ARES/Qwen3.8-27B -p "…"`; full form `alan/ARES/Qwen3.8-27B` also resolves
- [ ] No API key leaked into any log, widget line, or TUI output
