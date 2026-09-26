#!/usr/bin/env python3
"""
scorer_template.py — the deterministic judge for a /goal_deterministic loop.

This is a CONTRACT, not a finished solution. The coder subagent adapts the three
marked spots (score / better / make_mwe_artifacts) to the actual goal, then must pass
the MWE (minimum working example) self-test before the real loop starts.

Contract:
  python scorer.py <ours_path> <bar_path>                    # A/B compare -> JSON
  python scorer.py measure <ours_path> --threshold <float>   # single vs known number
  python scorer.py --mwe                                     # MWE self-test (exit 0 = pass)

Rules:
  - stdout is ONE JSON object; exit code 0 on success.
  - deterministic: fixed seed, no randomness, same input => same output.
  - error (missing path, not comparable) => JSON {"error": ...} on stderr, exit 1.
    NEVER silently pass a section it could not measure.
  - cheap: must be runnable many times per piece. If the goal's real benchmark is too
    slow for every round, score a cheap proxy here and run the full benchmark at the end.
"""
import argparse
import json
import os
import random
import sys
import tempfile
import time


# =====================================================================
# [ADAPT ME 1] score(): measure the quantity that defines "better".
# One artifact in  -> a dict of numeric quantities out.
# Example for model efficiency (tokens per second):
#   tokens   = count_tokens(read_artifact(path))
#   seconds  = time_run_on_device(path)          # load + generate N tokens
#   return {"tokens_per_second": tokens / seconds}
# Example for code: benchmark score / test pass rate.
#   return {"pass_rate": passes / total}
# =====================================================================
def read_artifact(path: str) -> str:
    """Read the artifact as text. Override for binaries (images, exe, logs)."""
    with open(path, "r", encoding="utf-8", errors="replace") as f:
        return f.read()


def count_informative_tokens(text: str) -> int:
    """Cheap proxy quantity so the template runs out of the box. Replace per goal."""
    return len(text.split())


def score(path: str) -> dict:
    if not os.path.exists(path) and not os.path.isdir(path):
        raise FileNotFoundError(f"no artifact at {path!r}")
    text = read_artifact(path)
    # Default: token count (bad/short artifacts score low, substantial > tiny).
    return {"tokens": float(count_informative_tokens(text))}


# =====================================================================
# [ADAPT ME 2] better(): decide the winner from the measured numbers.
# Same quantity on both sides; return "ours" | "bar" | "tie".
# Higher is better unless you flip the comparison.
# =====================================================================
def better(ours: dict, bar: dict, quantity: str) -> str:
    a, b = ours[quantity], bar[quantity]
    margin = getattr(better, "margin", 0.0)
    if a >= b * (1.0 + margin):
        return "ours"
    if a + margin < b:
        return "bar"
    return "tie"


# =====================================================================
# [ADAPT ME 3] make_mwe_artifacts(): two tiny fixtures for the self-test.
# One deliberately BAD, one GOOD. The scorer must rank BAD < GOOD (in the
# direction of "better"). This is the first line of defence against a
# metric that measures the wrong thing.
# =====================================================================
def make_mwe_artifacts(tmp: str):
    bad = os.path.join(tmp, "bad.txt")
    good = os.path.join(tmp, "good.txt")
    with open(bad, "w", encoding="utf-8") as f:
        f.write(".")
    with open(good, "w", encoding="utf-8") as f:
        f.write("the real thing with substance and detail, held to a real bar, " * 20)
    return bad, good


# =====================================================================
# MWE self-test — MANDATORY before the loop. Patches the default quantity.
# =====================================================================
def run_mwe() -> int:
    problems = []
    with tempfile.TemporaryDirectory() as tmp:
        bad, good = make_mwe_artifacts(tmp)
        try:
            s_bad = score(bad)
            s_good = score(good)
        except Exception as e:  # noqa: BLE001
            print(json.dumps({"mwe": "fail", "reason": f"score() crashed: {e}"}))
            return 1

        try:
            quantity = "tokens"  # the default; a custom scorer picks its own
            verdict = better(s_good, s_bad, quantity)
            if verdict != "ours":
                problems.append(
                    f"better() ranked the GOOD sample as {verdict!r}, expected 'ours'"
                )
        except Exception as e:  # noqa: BLE001
            problems.append(f"better() crashed: {e}")

        # determinism: same input => same numbers
        try:
            if score(good) != s_good:
                problems.append("score() is not deterministic (same input, different output)")
        except Exception as e:  # noqa: BLE001
            problems.append(f"determinism check crashed: {e}")

        # JSON-serialisable + finite numbers
        try:
            json.dumps({"ours": s_good, "bar": s_bad})
        except Exception as e:  # noqa: BLE001
            problems.append(f"result is not JSON-serialisable: {e}")
        for d in (s_bad, s_good):
            for k, v in d.items():
                if not isinstance(v, float) or v != v or v in (float("inf"), float("-inf")):
                    problems.append(f"quantity {k!r} is not a finite float: {v!r}")

    if problems:
        print(json.dumps({"mwe": "fail", "problems": problems}))
        return 1
    print(json.dumps({
        "mwe": "pass",
        "bad": s_bad,
        "good": s_good,
        "note": "bad < good in the direction of 'better'; scorer is runnable, ranking and deterministic",
    }))
    return 0


def main() -> int:
    ap = argparse.ArgumentParser(description="Deterministic A/B scorer for /goal_deterministic")
    ap.add_argument("mode", choices=["compare", "measure", "mwe"], nargs="?")
    ap.add_argument("ours", nargs="?", help="path to our artifact")
    ap.add_argument("bar", nargs="?", help="path to the bar artifact (compare) -- or consumed by --threshold (measure)")
    ap.add_argument("--threshold", type=float, default=None)
    ap.add_argument("--mwe", action="store_true", help="run the MWE self-test and exit")
    args = ap.parse_args()

    if args.mwe or (args.mode or "") == "mwe":
        return run_mwe()

    try:
        if args.mode == "measure":
            if args.threshold is None:
                raise ValueError("measure mode needs --threshold <float>")
            s = score(args.ours)
            quantity = list(s.keys())[0]
            v = s[quantity]
            out = {
                "score": v, "quantity": quantity,
                "threshold": args.threshold, "passed": v >= args.threshold,
            }
        else:  # compare
            ours, bar = score(args.ours), score(args.bar)
            shared = set(ours) & set(bar)
            if not shared:
                raise ValueError(
                    "scorer returned different quantities for ours and the bar; "
                    "they must measure the SAME thing"
                )
            quantity = sorted(shared)[0]
            out = {
                "ours": ours[quantity], "bar": bar[quantity],
                "quantity": quantity, "verdict": better(ours, bar, quantity),
            }
        print(json.dumps(out))
        return 0
    except Exception as e:  # noqa: BLE001
        print(json.dumps({"error": str(e)}, ensure_ascii=False), file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
