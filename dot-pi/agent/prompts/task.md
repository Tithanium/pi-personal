---
description: Start the check-based task loop. Use the "task" skill — auto one-line check, tiny split, subagent loop with main-context verification.
argument-hint: "<task>"
---
Define this task using the `task` skill — load SKILL.md and start now.

The task: $@

Step 1, set the auto-bar — write the one-line check that proves it works: run it and validate the output is correct (exit 0 is not enough), no user pick. Step 2, split into 1–4 judgeable pieces with their own checks. Step 3, loop — subagent builds a piece, you re-run the check yourself, pass or one-line feedback to a fresh subagent. Keep the main context light. Go now.
