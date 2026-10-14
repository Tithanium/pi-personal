---
name: okf-agent-workflow
description: Wire the Open Knowledge Format workflow into a pi agent definition. Covers the three wiring depths (lite pointer, standard with okf tools, full autoload), the exact tools frontmatter allowlist, the copy-paste body contract to insert, and the 60-second verification pass. Use when you must add OKF capability to an existing or new agent, port the okf skill into a subagent, or you are asked to include the OKF workflow in an agent definition.
---

# Wiring the OKF workflow into an agent definition

## Mental model (read once, 30 s)

An agent definition is ONE `.md` file in `~/.pi/agent/agents/` (root-level only; nested folders are not loaded). It has two parts:

- **frontmatter** — `name`, `description`, `tools`, `model` (only these four are honored)
- **body** — everything below the frontmatter is the agent's system prompt

A subagent is spawned as a *fresh* pi session, so it already sees everything global:
the `pi-okf` package (`okf_spec`, `okf_inspect`, `okf_diff`, `okf_init`, `okf_validate`,
`okf_capture`) and the `okf` skill listed by name+description. Your only jobs are
(1) allowlist the `okf_*` tools in frontmatter and (2) tell the body *when* and *how*
to load the okf skill.

**Efficiency rule:** never paste the OKF spec into an agent body. It is a moving target
(`okf_spec` is the authority) and it bloats every spawn. Progressive disclosure does the
heavy lifting: the body only triggers the load, the skill carries the workflow.

## Step 1 — pick a wiring depth

| Depth | When | Frontmatter | Body |
|---|---|---|---|
| **Lite** | Any agent that may occasionally touch OKF work | no change | add the OKF contract (Step 3) |
| **Standard** | Agent that will actually run `okf_*` calls | add `tools:` allowlist (Step 2) | add the OKF contract |
| **Full** | A dedicated OKF agent (init/update/validate pipelines) | Standard, plus keep extra tools minimal | add contract + a lead line "When the task is OKF work, load the okf skill FIRST" |

Default to **Lite or Standard** — they cover 95% of cases. Full is only for a
purpose-built OKF curator agent.

## Step 2 — frontmatter

```yaml
---
name: my-agent
description: What it does, no colon-space inside this value.
tools: read, bash, ls, find, grep, write, edit, okf_spec, okf_inspect, okf_diff, okf_init, okf_validate, okf_capture
---
```

- Trim the list to the role: a report-only agent drops `write`, `edit`, and any
  `okf_*` it must not call (e.g. never `okf_init`).
- `model` is optional; omit it to inherit the session default.
- `pi` reload is required after adding/modifying an agent file (`/reload`), the
  command names are fixed at load.

## Step 3 — body contract (copy-paste block)

Insert this section into the agent body. It is the entire OKF surface:

```markdown
## OKF work (Open Knowledge Format)

When a task involves OKF bundles (an `okf/` directory, knowledge catalog, or any `okf_*` tool):

1. Load the OKF workflow first — run `/skill:okf`, or read the skill file at
   `~/.pi/agent/npm/node_modules/pi-okf/skills/okf/SKILL.md` (references inside are
   relative to that skill directory).
2. Fetch the current spec with `okf_spec`. Never rely on memory of the format.
3. Inspect evidenced sources with `okf_inspect` before authoring or updating.
4. Invariants: concepts are Markdown + YAML frontmatter with a non-empty `type`;
   `index.md` and `log.md` are reserved; use bundle-relative links; NEVER invent
   business rules, sources, or provenance — unanswered facts go to the nearest
   `log.md` under "Questions".
5. Match the workflow verb to the task: init / update (repo, diff, or session) /
   upgrade / compact / validate.
6. Run `okf_validate` before reporting done and fix every conformance error.
```

## Step 4 — verify (60 s)

1. Save the agent file, then `/reload` in pi.
2. Invoke the agent via `/agents:<name>` with a forced OKF task — e.g. "use okf
   tools to validate the bundle at PATH".
3. Confirm in the output: the `okf_*` tools were callable, the skill loaded
   (`/skill:okf` or the read of the SKILL.md happened), and it ended with a
   `okf_validate` result.
4. Rightsize: if the agent never triggered OKF, demote it to Lite (drop the tools)
   — keep spawning cost low.

## Anti-patterns

- **Duplicating the spec** into the body — stale on next `okf_spec`, wastes tokens.
- **Forgetting the `tools:` allowlist** — the okf_* tools exist but are hidden, and a
  fresh subagent cannot see them; the agent silently "cannot find tool".
- **`description:` with a colon-space** (`key: value` inside the value) — the compact
  frontmatter parser throws "Nested mappings are not allowed" and the whole agent is
  rejected. Use commas or em-dashes.
- **Nested agent folders** — `agents/sub/okf-agent.md` is never loaded; only root `.md`.
