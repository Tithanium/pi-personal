---
description: Start a goal whose evaluation is a deterministic score (Python) when possible, plus optional AI critic. Use the "goal-deterministic" skill.
argument-hint: "<task>"
---
Set a deterministic goal for this task using the `goal-deterministic` skill — load SKILL.md and start the process now.

The task: $@

Run Step 1 (restate the goal in one line), then Step 2 (offer 2-3 candidate bars AND offer the evaluation choice: A) AI critic only, B) deterministic score only, C) hybrid — if B or C, pin the quantity, e.g. tokens per second for model efficiency, and whether the user provides the scoring program or a coder builds it — wait for my picks). Then Step 3 (write the three-part task definition: GOAL+BAR, THE SPLIT, EVALUATION+LOOP, including the MWE gate). After I approve it, have a coder subagent author and MWE-test the scorer, then launch builders, the scorer, and harsh critic subagents with minimal main-agent context, and maintain the live progress page.
