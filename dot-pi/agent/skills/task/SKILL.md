---
name: task
description: Defines ANY task with a one-line check, a tiny piece split, and a subagent loop with main-context verification — the pragmatic sibling of /goal. /goal chases a best-in-class bar you pick; /task auto-sets the minimal bar that only demands it WORKS — runs without error AND the output validates against the expected result. Use when the work is to deliver something functional, not to win a beauty contest. For builds, code, fixes, writing, research. Load and run Step 1 immediately.
---

# Task — the lean execution loop

Sibling of `/goal`, one difference: **goal** competes against a best-in-class bar you
choose; **task** only needs the thing to WORK — run without error and satisfy the
spec. The bar is auto-set, no user round-trip. Heavy work goes to fresh-context
subagents; you verify their reports cheaply and steer. That is what keeps the run
straight and your context thin.

## Trigger

`/task <the task>` or "make this work / fix this / deliver this". Load this file and
run Step 1 now. No waiting.

## Step 1 — Set the auto-bar: run it, then validate the output

If the deliverable is a function, script, or program, the bar is **run it** — never
read the code and infer that it "looks right". The check has TWO halves, both must pass:

1. **Executes** — runs clean: exit 0, no exceptions, no hang.
2. **Output validated** — the output is CORRECT, not just present. Feed a known
   input and compare against the expected result; for a report or artifact, spot-
   check that the required content is there and right.

| Deliverable | Minimal check |
|---|---|
| Function, script, program | Runs on a known input — exit 0 AND output matches expected |
| Pipeline, API, site | Endpoint answers AND payload/response has the right content |
| Doc, data, report | Opens/parses AND required sections, fields, schema present and correct |

Restate deliverable + check in ONE line:

```
Deliverable: <X> does <Y>. Check: run <command> on a known input — exits 0 and the
output matches the expected result (or spot-check the produced artifact).
```

The check is the bar — pick it yourself, keep it minimal. Ask the user only if the
deliverable itself is genuinely ambiguous, then move on.

## Step 2 — Split: a checklist, not a design

1–4 pieces, each with its own one-line check; the smallest units verifiable alone.
No architecture, stack, or file layout — subagents decide. Three or four lines is
the whole plan.

## Step 3 — The loop: dispatch → verify → steer

Per piece:
1. Dispatch one fresh-context subagent with the piece, its check, and "run the check
   yourself first; report pass/fail and the output paths".
2. On return, re-run the check yourself — execute it and validate the output, diff
   the result, look at the file. Trust nothing.
3. Pass → next piece. Fail or mislead (off-scope, invented success) → send the single
   failing line back to a fresh subagent and loop.
4. Keep only: the check line, per-piece pass/fail, the current failure line. No notes.

Mirror deliverable + status to `task.md` only if the user wants to watch; otherwise
keep it in context.

## What kills a run

- **No check** — "it runs" without validating output is still a fail. Both halves:
  executes AND output validated. Check first, always.
- **Trusting a "done"** — re-run the check yourself every time.
- **Building in main context** — context rot, loops, hesitation. Subagent or nothing.
- **A fat split** — a design doc nobody follows. Thin it.
