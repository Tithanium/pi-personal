---
name: goal
description: Defines any task in THREE steps and turns it into a gauntlet-loop goal — set a concrete quality bar, split the work into small judgeable pieces, save it in a goal.md file, and fan out builder + harsh critic subagents so the main agent stays light. Use the instant the user writes "/goal <task>", asks to "set a goal", "define this task", or "gauntlet loop" a piece of work. Works for builds, writing, code, research, design. Load this file and start Step 1 immediately.
---

# Goal — the three-step task definition (pi port of the gauntlet loop)

The user hands you a task. You are NOT doing the work yet. You define the goal in
three short steps, then launch specialized subagents that grind on it until it beats
a real reference — keeping the main context nearly empty.

## The trigger

The user types:

```
/goal <the task>
```

or says "set a goal / define this task / gauntlet this". When that happens:
load this file (you are reading it) and **run Step 1 now**. The process has started;
do not wait for anything else.

## Step 1 — Restate the goal (one line)

One sentence in your head first: the deliverable, and for whom. Write it out only if
it helps the user confirm. If the task is ambiguous, ask ONE clarifying question only:
what is the deliverable, exactly? Then move to Step 2. Do not over-ask.

## Step 2 — Set the bar (stop and wait here)

The bar is the whole trick. Everything else is scaffolding. A bar has to pass three
tests:

- **Named.** A specific thing, not a category. "Stripe's pricing page" works.
  "Award-winning SaaS sites" does not.
- **Fetchable.** The critic can actually get it — screenshot the live page, read the
  published piece, run the binary, open the repo. If the agent cannot obtain it, it
  will hallucinate the comparison.
- **Comparable.** Both can sit side by side and a judge can pick a winner. If you
  cannot imagine the A/B, it is not a bar.

If the user already gave a reference, use it and go to Step 3. If not, offer **2 or 3
candidate bars, one line each**, and stop. Wait for their pick. Do not write the task
definition before the pick.

Bars by goal type:

| Goal | Bar that works |
|---|---|
| Website, app, UI | The live site of a specific best-in-class product, screenshotted at the same viewport |
| Game, 3D, visual | Real footage or screenshots from a named shipped title |
| Writing | A specific published piece by a named author or publication, same length and format |
| Code, tooling | A named repo's implementation, plus its benchmark or test suite as the measurable half |
| Research, analysis | A named analyst report or a paper's methods section, judged on rigour and coverage |
| Deck, doc, deliverable | A real artifact from a firm known for it, same page count |

Prefer the hardest bar the agent can genuinely reach. A bar that is too easy makes
the loop exit on round one. If the goal has a measurable half (load time, token cost,
benchmark score, word count, pass rate), name it alongside the reference — taste plus
a number beats taste alone.

## Step 3 — Write the three-part task definition and save it into goal.md

A goal is exactly three parts, in one block, paste-ready and plain. No architecture,
no file layout, no decomposition pre-made, no stack choice unless the user demanded
it — the subagents decide those. Short: 120–180 words. No bullet lists inside parts 1
and 2. Say it like someone explaining what perfect looks like and refusing less.

```
PART 1 — GOAL + BAR
Build [GOAL].
The bar is [BAR]. Get the real thing first and compare against it directly,
not against a description of it. [Measurable half, if the user named one.]

PART 2 — THE SPLIT
Break this into the smallest pieces that can be improved and judged on their own
(e.g. hero, motion, type, colour, imagery, interaction, mobile — adapt per task).
Each piece is a unit of work with a single judgeable outcome.

PART 3 — THE LOOP
For each piece, run a builder and a separate harsh critic with fresh context.
The critic inspects the actual output, puts it next to the bar blind with labels
stripped, says which is better, and names the single biggest remaining gap. Then it
goes back to the builder.
Keep looping on each piece until the critic picks ours blind. Do not stop before
that. Praise is not useful; a soft critic approves everything.
Run the builders and critics as parallel subagents, and keep a live progress page
updated as the work evolves so the user can watch it.
```

Rules for what you fill in:
- Bake the bar in as a concrete, fetchable thing — URL, product name, repo, title.
- Add a budget or cost ceiling only if the user named one. No default cap.
- Add tool names only if the goal needs them (image/video gen, a browser, a deploy target).
- Everything else stays out. Do not pre-decide N rounds; the exit is winning the
  comparison, never a round count.

## Launch — the process, with minimum main-agent context

After the user approves the definition, you update the goal.md file, then orchestrate. Do NOT do the pieces yourself.

**Context discipline (the whole point):** keep in YOUR context only —
1. the three-part definition (short),
2. the current list of pieces with a ONE-LINE status each,
3. the live progress page you maintain.
All heavy work — reading the bar, building, criticizing — happens inside fresh-context
subagents via the `subagent` tool (installed: modes `single`, `parallel`, `chain`).
When a subagent returns, store only its one-line verdict + the path to its output, not
its full transcript.

**Per piece (one at a time or in small waves, never all heavy work in main context):**
1. Read the bar yourself only enough to know where it lives (URL/repo/artifact), then
   hand the details to the subagents — do not pull the whole reference into context.
2. `subagent { agent: "coder", task: "Build <piece N>. The bar is <bar> at <location>. Do not judge your own work." }` — the builder, fresh context.
3. `subagent { agent: "reviewer", task: "Harsh critic of <piece N> output at <path>. Fetch the bar at <location>. Compare blind, labels stripped: A (bar) vs B (ours). Say which is better and name the SINGLE biggest remaining gap. Be harsh — praise is never useful." }` — separate critic, fresh context, no access to the builder's thinking.
4. If the critic picked the bar (ours lost): loop — the critic's named gap (one line)
   goes back to a fresh builder for that piece. Repeat until the critic picks ours.
5. Update the progress page (see below); advance to the next piece.

Free agents are fine to reuse their **default** tools. The builder and critic for the
same piece must never be the same agent instance — the critic must not know how hard
the builder tried.

## The live progress page

Create `PROGRESS.md` (in the project or output dir) before any build starts. Keep it
(current) — updated after every subagent result:

```markdown
# Progress — <goal>
Bar: <one-line, fetchable>
| Piece | Status | Critic verdict (1 line) | Output path |
|---|---|---|---|
| 1 | running | — | … |
| 2 | passed | picks ours blind | … |
```

## What breaks a goal

- **A vague bar.** The critic invents a comparison and approves everything. Most
  common failure by far → go back to Step 2, do not proceed.
- **The builder judging its own work.** Critic must be a separate subagent with fresh
  context. It should not know how hard the builder tried.
- **A soft critic.** Demand explicit A/B verdicts. Scores out of 10 drift upwards;
  binary "which is better" does not.
- **Named exit after N rounds.** The exit is winning the comparison, or the user
  stopping the run. Never a round count.
- **Over-specifying.** Every extra instruction is one fewer decision the subagents
  make with their own judgement. Minimal wins.

## Portability note

The original gauntlet-loop prompt ends with `/loop` and `ultracode` (Claude Code
features). On pi those two lines are ALWAYS: "Keep looping until the critic picks ours.
Run the builders and critics as parallel subagents." That is what Part 3 already does
here — do not emit `/loop` or `ultracode` into a definition on this harness.
