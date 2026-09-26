---
name: goal-deterministic
description: Defines any task in THREE steps like /goal, but whenever possible the evaluation is a deterministic score (a small Python program built on purpose or supplied by the user) that measures a named quantity — tokens per second, benchmark, latency, accuracy, pass rate, load time. Offers three evaluation modes — AI critic only, deterministic score only, or hybrid where the score gates and an AI critic decides taste. A coder subagent authors the scorer and validates it on a minimum working example BEFORE the full loop runs, then builder and harsh critic subagents iterate with minimal main-agent context. Trigger on "/goal_deterministic <task>", "score this", "objective bar", "make it measurable", "gauntlet with a benchmark".
---

# Goal Deterministic — /goal where the judge can be a number

Same three-step goal definition as the `goal` skill, with one difference: the
evaluation part is, whenever possible, performed by **executing a Python program**
made for this purpose (or provided by the user). An AI critic stays available for
what a number cannot capture. The scorer is built and tested on a **minimum working
example** before the real loop ever runs.

You are NOT doing the work yet. You define the goal in three short steps, then launch
subagents that grind on it — keeping the main context nearly empty.

## The trigger

The user types:

```
/goal_deterministic <the task>
```

or says "score this / objective bar / make it measurable / gauntlet with a benchmark".
When that happens: load this file (you are reading it) and **run Step 1 now**.

## Step 1 — Restate the goal (one line)

One sentence in your head: the deliverable and for whom. One clarifying question if
genuinely ambiguous, then Step 2. Do not over-ask.

## Step 2 — Set the bar AND choose the judge (stop and wait here)

Two decisions, both required before Step 3.

**2a. The bar.** Same three tests as /goal — **named** (a specific thing, not a
category), **fetchable** (the critic or the scorer can actually obtain it), and
**comparable** (an A/B you can imagine). Same table:

| Goal | Bar that works |
|---|---|
| Website, app, UI | The live site of a specific best-in-class product, same viewport |
| Game, 3D, visual | Real footage or screenshots from a named shipped title |
| Writing | A specific published piece by a named author or publication |
| Code, tooling | A named repo's implementation + its benchmark or test suite |
| Research, analysis | A named analyst report or a paper's methods section |
| Efficiency, perf | A published number for a named system, or a reference run you can reproduce |

Offer 2–3 candidate bars, one line each, and **wait for the pick**.

**2b. The judge — offer the user the choice (this is what makes this skill different).**
Ask which evaluation they want:

- **A — AI critic only.** The original gauntlet way, for pure taste with no measurable
  half (rare here, but allowed).
- **B — Deterministic score only.** A number is the judge. The loop exits on the score.
  Use when the quality is objective: tokens per second, benchmark score, latency,
  accuracy, pass rate, load time, memory.
- **C — Hybrid.** The deterministic score enforces a hard floor (and can win rounds
  objectively), while a separate AI critic decides taste blind. Loop is done only
  when **both** pass. Best default for most goals.

If B or C, pin two things:

1. **The quantity.** One line: "which number captures 'better'?" Example from the
   prompt: *"tokens per second, if the aim is to improve a model's efficiency."*
2. **Where the scorer comes from.** Either the user already has a scoring program
   (use it — still MWE-checked, see below), or a **coder subagent writes one** for
   this goal. Offer: "I'll have the coder build and test a scorer. Is that ok, or do
   you have one?"

Do not write Step 3 until the bar and the judge (mode + quantity + source of scorer)
are fixed.

## Step 3 — Write the three-part task definition

Same shape as /goal, three parts, one plain block, 120–200 words. No bullets inside
parts 1 and 2. Say what perfect looks like and refuse less.

```
PART 1 — GOAL + BAR
Build [GOAL].
The bar is [BAR]. Get the real thing first and compare against it directly,
not against a description of it.

PART 2 — THE SPLIT
Break this into the smallest pieces that can be improved and judged on their own
(adapt the list to the task: hero, motion, type, colour, imagery, interaction, mobile;
or tokenizer, context handling, latency, throughput; or opening, each explanation,
diagrams, ending).

PART 3 — EVALUATION + LOOP
Winner is decided by [one of: the deterministic score | the AI critic | BOTH the
score AND the AI critic]. The score measures [QUANTITY] — a Python program
(located at [PATH], or to be written) run on the real artifacts, not a description.
A coder subagent must first author/validate the scorer on a minimum working example:
it must run end-to-end, print a comparable number for ours and the bar, rank a
deliberately-bad sample below the bar sample, and be cheap enough to run every round.
Only when that MWE passes does the loop start.
Then for each piece: a builder subagent produces the piece, [the scorer measures it
and/or] a harsh critic subagent with fresh context compares it to the bar blind with
labels stripped and names the single biggest remaining gap. It goes back to the builder.
Keep looping on each piece until [criterion: score passes / critic picks ours blind /
both]. Do not stop before that. Praise is not useful.
Run the builders, the scorer, and the critics as subagents, and keep a live progress
page updated so the user can watch it.
```

Fill-in rules (same as /goal): bake the bar as a concrete fetchable thing; add a
budget/cost ceiling only if the user named one; add tool names only if the goal needs
them; everything else stays out. The exit is winning the comparison, never a round
count.

## The scorer contract (references/scorer_template.py)

The deterministic score is a tiny Python program, stdlib-only, following this contract
(a runnable template ships in this skill's `references/scorer_template.py` — the coder
agent reads it and adapts the three marked spots: `score()`, `better()`,
`make_mwe_artifacts()`):

```
python scorer.py <ours_path> <bar_path>                  # A/B → JSON
python scorer.py measure <ours_path> --threshold <float> # single vs known number
python scorer.py --mwe                                  # MWE self-test (must exit 0)
```

- Standard output is ONE JSON object. Exit code 0 on success; non-zero + a message when
  an artifact is missing or not comparable (no silent pass).
- Deterministic: fixed seed, no randomness, same input ⇒ same score.
- Cheap with respect to the loop: must be runnable many times per piece. If a full
  benchmark is too slow for every round, score a cheap proxy in the loop and run the
  full benchmark at the end to confirm.
- If the user provided the scorer instead, it must satisfy the same contract — adapt
  the wrapper to it and do NOT silently change what the user's number means.

## The MWE gate — before the full loop, always

Before ANY real piece is built, the coder subagent must author/validate the scorer on a
**minimum working example**:

1. Build two tiny fixtures in a temp dir: one deliberately **bad** (broken / slow /
   empty / cut) and one **good** (a small proxy of the bar or a known-good sample).
2. Run the scorer on them and confirm: it **runs end-to-end and exits 0**; it **prints
   a comparable number for both**; it **ranks bad < good** (moves the right direction
   for the quantity); it finishes within a chosen time budget.
3. Report the MWE output, one line per assertion, and the exact scorer path.

The full loop does not start on a piece until the MWE passes. This catches wrong
metrics, hallucinated comparisons, and broken command paths before they poison fifty
rounds. If the MWE fails, the coder fixes the scorer, not the loop.

## Launch — minimum main-agent context

Same discipline as /goal. In YOUR context keep only: the three-part definition, the
piece list with a one-line status each, the latest score numbers, and the live progress
page. All heavy work happens in fresh-context subagents.

**Per piece:**
1. **Builder** — `subagent { agent: "coder", task: "Build <piece N>. The bar is <bar> at <location>. Do not judge your own work." }`. Fresh context.
2. **Deterministic score (B or C)** — you run `python scorer.py <ours> <bar>` via the
   bash tool yourself; only the returned JSON numbers enter your context. On a tie or a
   loss, the gap is the measured delta (which quantity, by how much) — that is the
   critic's message back to the builder.
3. **AI critic (A or C)** — `subagent { agent: "reviewer", task: "Harsh critic of
   <piece N> output at <path>. Fetch the bar at <location>. Compare blind, labels
   stripped, A (bar) vs B (ours). Say which is better and name the SINGLE biggest
   remaining gap. Be harsh — praise is never useful." }`. Fresh context, no access to
   the builder's thinking. Never the same instance as the builder.
4. **Verdict.** B: exit when ours ≥ bar (or threshold crossed) on the measured numbers.
   A: exit when the critic picks ours. C: keep looping until the scorer passes AND the
   critic picks ours blind. The builder and critic for the same piece must never be the
   same agent instance.
5. Update the progress page; advance to the next piece.

## The live progress page

Create `PROGRESS.md` before any scoring starts:

```markdown
# Progress — <goal>
Bar: <one-line, fetchable>
Judge: deterministic (tokens/sec) | AI critic | hybrid
Scorer: <path> (MWE: pass <date>)
| Piece | Status | Score ours vs bar | Critic verdict | Output path |
|---|---|---|---|---|
| 1 | MWE done | — | — | … |
```

Keep the score column updated with the raw numbers, not adjectives.

## What breaks a goal_deterministic

- **A vague bar.** The scorer or critic invents a comparison and approves everything.
  → back to Step 2.
- **A gamed or wrong metric.** Measuring something that correlates with "better" instead
  of being "better". The MWE's bad-vs-good fixture is the first line of defense; a human
  sanity check on the numbers is the second.
- **Skipping the MWE.** A scorer that "looks fine" but was never run on a bad sample
  will approve trash. The MWE gate is mandatory, for user-provided scorers too.
- **The builder judging its own work** (must be a separate fresh-context critic) and a
  **soft critic** (demand binary A/B verdicts, never scores out of 10).
- **Named exit after N rounds.** Exit = winning the comparison or the user stopping.
- **Over-specifying.** Every extra instruction is one fewer decision the subagents make.
