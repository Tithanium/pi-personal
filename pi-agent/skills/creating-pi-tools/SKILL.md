---
name: creating-pi-tools
description: Add, install, port, create, and debug features (tools, commands, skills, hooks, agents) for the pi coding agent (@earendil-works/pi-coding-agent v0.85+). Use when the user asks to add a pi tool or feature, install a pi package ("pi install npm:…"), port a feature from another harness (e.g. omp), override a built-in tool (read/bash/edit/write/grep/find/ls/powershell), fix tool output truncation, concurrency, or prompt-injection issues, or to understand pi's tool contract from the harness's point of view.
---

# Adding Features to the pi Harness — Validated Workflow (2026-07-17)

Everything in this top section was validated against files actually read on this machine
(pi v0.85.1, Windows, user connessn). Follow the steps **in order** — the goal is a
first-time success, not iteration.

## Step 0 — Decide the strategy (do not skip)

| Strategy | When | Validated path |
|---|---|---|
| **Install existing** | A `pi-package` already exists | Step 1 (search) → Step 3 (test) → Step 4 (debug) |
| **Port from a donor harness** (omp, etc.) | Feature exists elsewhere, no pi package | Step 2 → write native pi extension → Step 3 → Step 4 |
| **Write from scratch** | Only last resort | rest of this skill (ToolDefinition contract) + Step 3 → Step 4 |

## Step 1 — Search for an EXISTING pi feature (try first)

Validated sources (from `docs/packages.md`, read 2026-07-17):

| Source | How |
|---|---|
| **pi package gallery** | `https://pi.dev/packages` — shows packages tagged `pi-package`, with video/image previews |
| **npm** | keyword `pi-package` (`npm search pi-package`, or npmjs.com search). Only packages declaring `"keywords": ["pi-package"]` show up here — this is THE search tag |
| **GitHub** | repo/code search: `pi.registerTool`, or `"keywords": ["pi-package"]` — catches git-installable packages not yet mirrored |
| **Local donor harnesses** (omp or other agent on this machine) | Step 2 |

**Security rule (stated in official docs):** pi packages run with full system access —
extensions execute arbitrary code. **Read the extension source before installing.**

### Install (all forms validated in `docs/packages.md`)

```powershell
pi install npm:@scope/pkg@1.2.3      # version pin (skipped by `pi update --extensions`)
pi install npm:pkg                   # latest, updatable
pi install git:github.com/user/repo@v1   # pinned ref; also https:// / ssh:// / git@host:path URLs
pi install C:\path\to\package        # local path: directory (package rules) or single .ts file — NOT copied
pi -e npm:@foo/bar                   # DRY RUN: temp dir, current run only — use to vet before real install
pi list                              # installed packages (read from settings)
pi remove npm:@foo/bar
pi update --extensions               # move packages (except pins) / reconcile git refs
```

Facts you can rely on (validated):
- `install`/`remove` write to `~/.pi/agent/settings.json` (array key `"packages"`) by
  default; add `-l` to write project `.pi/settings.json` instead.
- npm installs land under `~/.pi/agent/npm/`; git clones under
  `~/.pi/agent/git/<host>/<path>/`; pi runs `npm install` itself **in production mode —
  `devDependencies` are NOT available at runtime**.
- Project settings: pi auto-installs missing packages on startup **after the project is trusted**.
- Same package in global + project: project entry wins (unless `autoload: false`).
- Filtering per package (load only some resources): object form in settings `"packages"`,
  e.g. `"extensions": ["extensions/*.ts"]`, `"skills": []`. `pi config` toggles resources.

## Step 2 — Port a feature from a donor harness (omp, etc.)

### 2a. Locate the donor folder (Windows)

bash is dead on this machine (WSL broken) → run this PowerShell one-liner with the
`powershell` tool:

```powershell
Get-ChildItem $HOME, C:\Users\connessn\Datas -Recurse -Depth 3 -ErrorAction SilentlyContinue |
  Where-Object { $_.Name -match '^(omp|oh-my)' } | Select-Object -ExpandProperty FullName
```

**omp location on this box: ⚠️ NOT YET PINNED** — probe (2026-07-17) ruled out npm global
(`AppData\Roaming\npm\node_modules\omp`), `~\omp`, `~\.omp`, `~\Documents\omp`,
`~\Tools\omp`, `AppData\Local\Programs\omp`, scoop shims. When the path is confirmed,
edit this line and re-validate Step 3 against one real omp feature.

### 2b. What to look for in the donor folder

Once the folder is known, read in this order (relative names are the convention across
agent harnesses — confirm by reading, not by assuming):

1. `README.md` / `docs/` → how its plugin/extension/skill system works
2. `extensions/`, `plugins/`, `tools/` → the feature implementations
3. `skills/`, `prompts/` → instruction-style features
4. `settings.json` / `config.*` at the donor's user dir (`~/.<donor>/`) → which feature is actually enabled
5. `package.json` → entry points, dependency list (port the *logic*, not the deps)

### 2c. Mapping donor → pi (validated against `docs/extensions.md`)

| Donor concept | pi equivalent |
|---|---|
| Tool (model-callable function) | `pi.registerTool({ name, description, parameters: Type.Object, execute })` — see contract below |
| Skill / instruction file (`.md`) | drop verbatim at `~/.pi/agent/skills/<name>/SKILL.md` (frontmatter `name`+`description`) — usually the **only** donor type that ports with near-zero rewriting |

**Frontmatter pitfall (verified 2026-09-21):** skills AND prompt templates are parsed
by `parseFrontmatter`, a compact YAML parser. A **`: ` (colon + space) inside a
plain-scalar value** (typical culprits: `description:` values like "modes: AI, nor
hybrid") throws "Nested mappings are not allowed in compact mappings" and the whole
skill/template is **silently dropped** — the `/skill:x` command and `/x` expansion
never appear. No `: ` in frontmatter value strings; use em-dashes/commas. After
writing, probe the real loader:

```js
import { loadSkillsFromDir } from "file:///<pi-pkg>/dist/core/skills.js";
const { skills, diagnostics } = loadSkillsFromDir({ dir: "C:/Users/connessn/.pi/agent/skills", source: "user" });
console.log(skills.map((s) => s.name).join(", ")); console.log(diagnostics);
```
(check templates with `parseFrontmatter` from `…/dist/utils/frontmatter.js`)
| Slash command / hotkey | `pi.registerCommand("name", { description, handler })` |
| Pre-tool / post-tool hook (permissions, logging) | `pi.on("tool_call", …)` (can `{ block: true }`) / `pi.on("tool_result", …)` |
| Session lifecycle | `pi.on("session_start" / "session_shutdown", …)` |
| User prompt (confirm/select/input) | `ctx.ui.confirm(...)` / `ctx.ui.select(...)` / `ctx.ui.input(...)` |
| Durable state | `pi.appendEntry(...)` |
| Donor config values | read a settings file next to your extension, or `ctx.ui` prompts; never scrape donor runtime |

Porting rules:
- Write a **native TypeScript module**: `export default function (pi: ExtensionAPI) { … }`.
  Copy the *logic* from the donor code, rewrite the API calls against the pi contract.
- Allowed imports (validated): `@earendil-works/pi-coding-agent`,
  `@earendil-works/pi-ai` (`StringEnum`), `@earendil-works/pi-agent-core`,
  `@earendil-works/pi-tui`, `typebox` — these are **bundled by pi**: declare them in
  `peerDependencies` with `"*"`, never bundle them, never import them from your own
  `node_modules`. Everything else → `dependencies` (pi runs `npm install` for you).
- Put it at `~/.pi/agent/extensions/<name>.ts` or `~/.pi/agent/extensions/<name>/index.ts`
  (those two layouts are the ONLY auto-discovered shapes) → then `/reload`.

## Step 3 — Test, fastest signal first (validated order)

1. **Zero-install smoke test (fastest):** `pi -e .\my-extension.ts` — loads one file for
   one run, no settings touched. Confirms: loads? no import errors? tool appears? execute works?
   (Official docs "Quick Start" pattern.)
2. **Auto-discovered + hot reload:** move to `~/.pi/agent/extensions/<name>(\index).ts`,
   `/reload` inside a running pi. Confirms: discovery layout + persistence.
3. **Real install:** `pi install …` / `pi -e npm:…` dry-run first → `pi list` → verify
   `"packages"` entry in `~/.pi/agent/settings.json` → verify install tree exists at
   `~/.pi/agent/npm/<pkg>` (npm) or `~/.pi/agent/git/…` (git).
4. **Functional test in a session:**
   - tool → send a message that *forces* the tool ("use my_tool to …"); check the
     `tool_result` text in the TUI;
   - command → type `/mycommand`;
   - hook → trigger the event it watches (e.g. an `edit` call) and confirm the interception.
5. **Negative test:** give a bad argument → must come back as an **error tool_result**
   (i.e. the extension threw), not silently pass.

## Step 4 — When it fails, diagnose in this priority order

| Symptom | Most likely cause (validated) | Fix |
|---|---|---|
| Nothing happens, no error at all | Layout not auto-discovered (must be `*.ts` top-level or `*/index.ts`), or project-local and project **not trusted**, or settings `"packages"` entry malformed | move file; trust project; `pi list` + read `~/.pi/agent/settings.json` |
| Crash / import error at startup | Importing from packages pi does *not* bundle, or using `devDependencies` | allowed list above: peer-deps `"*"` for @earendil-works/* + typebox; real deps in `dependencies` |
| Works with `pi -e file.ts` but not after `pi install` | Package has no `pi` manifest AND no convention directories | `package.json`: `"keywords": ["pi-package"]` + `"pi": { "extensions": ["extensions"] }` (or use `extensions/` dir convention) |
| `Cannot find module` for sibling package | pi loads packages with **separate module roots** — your `node_modules` ≠ host's | never resolve `@earendil-works/*` locally; import from the host |
| Install fails (npm/git) | wrong package name / bad ref / git credentials | check exact name + version on npmjs.com; git: pin an explicit tag/commit; set `GIT_TERMINAL_PROMPT=0` for non-interactive |
| Installed but model never calls the tool | `description` too vague for the task (it IS the model's contract) | sharpen description: what it does, when to use it, what it returns |
| Registering seems to do nothing | name silently **replaced a built-in** (`read`, `bash`, `powershell`, `edit`, `write`, `grep`, `find`, `ls`) or another extension registered later | intended? keep + match built-in result shape exactly; otherwise unique name |
| In-session error from the tool | `execute` throws ⇒ error tool_result (by design) — read the error text shown | fix handler; honor `signal`; throw only for real errors |
| Tool sometimes corrupts a file | parallel writes racing with built-in `edit`/`write` | wrap in `withFileMutationQueue` (below) or `executionMode: "sequential"` |

Debugging on THIS machine (bash dead → all shell steps via the `powershell` tool;
pasteable blocks for the user = last resort only):

```powershell
pi list
pi -e .\C:\path\to\ext.ts          # isolated crash capture
Get-Content $HOME\.pi\agent\settings.json
Get-ChildItem $HOME\.pi\agent\npm   # did the install tree actually land?
```

## Machine note (Windows, connessn, updated 2026-07)

- `bash` tool fails systematically (WSL dead). **Never call it.**
- **`powershell` tool IS available** (built-in, enabled via `"defaultTools"` in
  `~/.pi/agent/settings.json`) → run all shell steps with it. Pasteable blocks
  for the user = last resort only.
- File work IS possible via `read`/`edit`/`write` (forward slashes or `C:/…`).
- Directory listing: `powershell` → `Get-ChildItem`; or probe candidate paths with
  `read` (`ENOENT` = free existence test); never re-read a path already known absent.

---
---

# Creating Tools for the pi Harness (ToolDefinition contract)

pi is not a "screen and exec anything command-like" harness. Tools are a **typed contract**:
the harness serializes your `parameters` JSON-Schema into the provider request (`tools` array),
the model answers with a *typed* `tool_use` block, and the harness validates, gates, executes,
and returns a `tool_result` tied to the call id. Your tool only ever sees **validated** arguments.

```
registerTool(ToolDefinition)
      │
      ├─► system prompt:    promptSnippet (Available tools) + promptGuidelines (Guidelines)
      ├─► provider payload:  { name, description, input_schema: {type:"object",properties,required} }
      │
model:  content_block { type:"tool_use", id, name, input }
      │
      ├─► prepareArguments(args)          ← optional, BEFORE validation
      ├─► TypeBox schema validation       ← failure ⇒ error tool_result, model may retry
      ├─► tool_call event (extensions can BLOCK: { block:true, reason })
      ├─► validate (unknown tool ⇒ "Tool X not found" error result)
      ├─► execute() in PARALLEL by default (see safeties)
      ├─► afterToolCall extensions can REPLACE result fields
      └─► tool_result { id, content[], details?, isError, usage? } → next LLM turn
```

## ToolDefinition contract (v0.85.1, `pi.coding-agent` → `dist/core/extensions/types.d.ts`)

```ts
import type { ExtensionAPI, ToolDefinition } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";

pi.registerTool({
  // ── Identity (sent to the model) ──────────────────────────────────────
  name: "my_tool",                       // used in LLM tool calls; snake/lowercase recommended
  label: "My Tool",                      // human label (UI)
  description: "What it does, when to use it. Document truncation/capabilities.", // sent to LLM

  // ── System-prompt injection (harness-side, active only while tool is in active set) ──
  promptSnippet: "One line in the 'Available tools' section. Omit ⇒ tool absent from that section.",
  promptGuidelines: [
    // Bullets appended FLAT to the 'Guidelines' section, no tool-name prefix.
    // MUST name the tool yourself: "Use my_tool for X", never "Use this tool for X".
    "Use my_tool when ...",
  ],

  // ── Parameters ──────────────────────────────────────────────────────────
  parameters: Type.Object({
    action: StringEnum(["list", "add"] as const)  // StringEnum from @earendil-works/pi-ai
    ,                                              // (Google API incompatible with Type.Union/Type.Literal)
    target: Type.String(),
  }),
  // Optional: run BEFORE schema validation to adapt legacy/resumed arguments.
  // Keep the public schema strict; return an object conforming to `parameters`.
  prepareArguments: (args) => (args as any)?.oldName ? { ...args, newName: (args as any).oldName } : args,

  // ── Execution ───────────────────────────────────────────────────────────
  executionMode: "parallel",   // or "sequential" to serialize with other tool calls
  async execute(toolCallId: string, params, signal, onUpdate, ctx) {
    // signal: AbortSignal — CHECK IT (user can abort mid-run)
    // onUpdate?: partial results (progress); ignored after the promise settles
    // ctx: ExtensionContext — ctx.ui (confirm/select/input/notify), ctx.cwd, ctx.sessionManager,
    //      ctx.model, ctx.signal, ctx.isIdle(), ...

    return {
      content: [
        { type: "text", text: "Human/model-readable output (sent to the LLM)" },
        // { type: "image", data: "base64...", mimeType: "image/png" },
      ],
      details: { /* structured payload for TUI renderers & session state (not sent to LLM) */ },
      // usage: { ...Usage }      // return nested-LLM usage if this tool made model calls
      // addedToolNames: []        // names of newly-activated tools (dynamic loading)
      // terminate: true           // request stop after this batch (only if ALL results terminate)
    };
  },

  // ── Optional rendering (TUI) ───────────────────────────────────────────
  // If omitted, a fallback renderer is used. Set renderShell:"self" to own the frame.
  // renderCall(args, theme, ctx) { return new Text(..., 0, 0); }
  // renderResult(result, { expanded, isPartial }, theme, ctx) { return new Text(..., 0, 0); }
});
```

`defineTool()` from the package preserves generic inference when a tool is stored in a variable/array.

## Harness safeties you MUST design around

1. **Parallel execution is the default.** Tool calls from one assistant message run concurrently
   unless `executionMode: "sequential"` (or the agent loop is configured sequential).

   **If your tool mutates files, you MUST use the shared per-file mutation queue**,
   or two parallel writers (yours + built-in `edit`/`write`) can read the same old contents and
   one overwrites the other:

   ```ts
   import { withFileMutationQueue } from "@earendil-works/pi-coding-agent";
   const abs = resolve(ctx.cwd, stripLeadingAt(params.path));   // see rule 4
   return withFileMutationQueue(abs, async () => {
     // read-modify-write window goes INSIDE the queue, not just the final write
     const cur = await readFile(abs, "utf8");
     await writeFile(abs, transform(cur), "utf8");
     return { content: [{ type: "text", text: `Updated ${params.path}` }], details: {} };
   });
   ```

2. **Errors = throw.** To set `isError: true` and report failure to the model, **throw** from
   `execute`. Returning `{ isError: true }` in the result object is ignored.

   ```ts
   if (bad(params)) throw new Error(`Invalid input: ${params.x}`);   // correct
   ```

3. **Truncation is mandatory.** Unbounded output breaks context + compaction. Built-in cap:
   **2000 lines / 50KB**, whichever first. Use the exported helpers and tell the model where the
   full output went:

   ```ts
   import { truncateHead, truncateTail, truncateLine, formatSize, DEFAULT_MAX_LINES, DEFAULT_MAX_BYTES }
     from "@earendil-works/pi-coding-agent";
   const t = truncateHead(output, { maxLines: DEFAULT_MAX_LINES, maxBytes: DEFAULT_MAX_BYTES });
   let text = t.content;
   if (t.truncated) text += `\n[Output truncated: ${t.outputLines}/${t.totalLines} lines, full output at ${fullPath}]`;
   ```
   `truncateHead` = content where the beginning matters (reads, search); `truncateTail` = logs.
   Document the cap in your `description`.

4. **Path hygiene:** models sometimes prepend `@` to paths. **Strip a leading `@`** and resolve
   against `ctx.cwd` (built-ins do this; you must too if you take paths).

5. **Abort awareness:** long work must honor `signal` (and the `ctx.signal` captured at entry).
   Return a partial/cancelled result when aborted; don't hang.

6. **Nested LLM calls:** if your tool internally calls a model, return aggregated `usage` on the
   result — pi folds it into footer/`/session`/RPC totals (not main context accounting).

7. **String enums:** use `StringEnum` from `@earendil-works/pi-ai`; `Type.Union`/`Type.Literal`
   break on the Google API.

8. **`promptGuidelines`** bullets have no tool-name prefix and are appended flat. Each bullet must
   name its tool. `promptSnippet` is the only reliable always-on hint — keep it one line.

9. **Dynamic tool loading (optional, advanced):** keep loaders active and make changes *additive*
   via `pi.setActiveTools([...active, ...new])`; pi records added names on the tool result and
   exposes them next turn (native deferred loading on Anthropic 4.5+/OpenAI where supported,
   simple active-list otherwise). Do not remove active tools in the same call. Lazy-loaded tools
   should rely on `description` and omit `promptSnippet`/`promptGuidelines` (activating them
   rebuilds the system prompt and can invalidate the cache prefix).

10. **State across calls:** one extension may register multiple tools sharing a closure (e.g. a
    connection pool). Close it on `pi.on("session_shutdown", ...)`.

## Overriding built-in tools

Built-ins: `read`, `bash`, `powershell`, `edit`, `write`, `grep`, `find`, `ls`.

- Registering a tool with the **same name replaces** the built-in (interactive mode warns).
  Use it for logging, access control, sandboxing, or remote execution (see
  `examples/extensions/tool-override.ts`: blocks `.env`, routes to SSH).
- **Match the built-in result shape exactly (including `details` type)** — UI and session logic
  depend on it.
- Rendering is inherited **per slot**: omit `renderCall`/`renderResult` to reuse the built-in
  renderer; `promptSnippet`/`promptGuidelines` are **not** inherited — redeclare them.
- Remote execution: `createReadTool(cwd, { operations: {...} })`, `createBashTool(cwd,
  { operations, spawnHook, exposeSessionEnvironment })` (interfaces `ReadOperations`,
  `BashOperations`, `EditOperations`, `WriteOperations`, `GrepOperations`,
  `FindOperations`, `LsOperations`).
- `--no-builtin-tools` starts with only extension tools.

## Minimal reference checklist before shipping a tool

- [ ] `description` is specific (when to use it, what it returns, any caps) — it is the model's contract.
- [ ] Every parameter has a `description`; enums via `StringEnum`; schema strict.
- [ ] `promptSnippet` (one line) present **and** every `promptGuidelines` bullet names the tool.
- [ ] `execute` throws on failure (never returns an error flag).
- [ ] Output truncated to ≤ 2000 lines / 50 KB with a pointer to the full output if cut.
- [ ] File mutation wrapped in `withFileMutationQueue` (absolute, `@`-stripped path); else `executionMode: "sequential"`.
- [ ] `signal` checked; long work cancellable.
- [ ] `details` shaped for the (future) TUI renderer; `renderCall`/`renderResult` optional.
- [ ] Nested model calls return `usage`.
- [ ] Shared state cleaned up on `session_shutdown`.
- [ ] `tool_call`/`tool_result` extension events respected — third parties can block or rewrite your tool.
- [ ] Tested with the Step 3 ladder (`pi -e` → auto-discover + `/reload` → `pi install` + `pi list` → functional + negative test).

## Where to look (installed v0.85.1 — all paths verified readable 2026-07-17)

- Authoritative docs:
  - `docs/packages.md` — `pi install` / sources / `pi config` / packaging rules:
    `C:/Users/connessn/AppData/Roaming/npm/node_modules/@earendil-works/pi-coding-agent/docs/packages.md` ✅
  - `docs/extensions.md` — extension locations, `/reload`, imports, custom tools:
    `C:/Users/connessn/AppData/Roaming/npm/node_modules/@earendil-works/pi-coding-agent/docs/extensions.md` ✅
- Canonical `ToolDefinition` type: `dist/core/extensions/types.d.ts` (same package)
- Loop / safety semantics: `node_modules/@earendil-works/pi-agent-core/dist/agent-loop.js` + `types.d.ts`
- Wire format per provider: `node_modules/@earendil-works/pi-ai/dist/api/anthropic-messages.js`
  (`convertTools`), `…/openai-completions.js`, `…/google-generative-ai.js`
- Runnable examples (same package, `examples/extensions/`):
  `tool-override.ts` (override + access control), `truncated-tool.ts` (ripgrep + truncation),
  `structured-output.ts` (terminate), `ssh.ts` (remote ops), `snake.ts` (stateful + rendering)
