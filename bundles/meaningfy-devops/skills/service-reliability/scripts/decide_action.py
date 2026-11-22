#!/usr/bin/env python3
"""Decide one unattended action from the policy data (assets/unattended-actions.yaml).

Usage: python decide_action.py --action <id> [--facts '<json>'] [--policy <yaml>]

Prints `<decision>\t<rule>`, decision one of act, park, never, escalate. Exits 2 when the policy or
the facts cannot be read; the caller then treats the action as park. Precedence is in the policy header.
"""
import argparse
import json
import sys
from pathlib import Path

import yaml

DEFAULT_POLICY = Path(__file__).resolve().parents[1] / "assets/unattended-actions.yaml"
TIERS = {"act", "park", "never"}


def decide(policy, action, facts):
    """Return (decision, rule) for one action and its facts."""
    thresholds = policy["thresholds"]
    known = set(policy["park_if"]) | set(policy["never_if"]) | set(thresholds)
    unknown = set(facts) - known
    if unknown:
        raise ValueError(f"unknown facts: {', '.join(sorted(unknown))}")
    for fact in policy["never_if"]:
        if facts.get(fact):
            return "never", fact
    if facts.get("attempts", 0) >= thresholds["attempts"]:
        return "escalate", f"attempts >= {thresholds['attempts']}"
    for fact, limit in thresholds.items():
        if fact != "attempts" and facts.get(fact, 0) > limit:
            return "park", f"{fact} > {limit}"
    for fact in policy["park_if"]:
        if facts.get(fact):
            return "park", fact
    entry = next((e for e in policy["actions"] if e["id"] == action), None)
    if entry is None:
        return "park", "unlisted"
    if entry["tier"] not in TIERS:
        raise ValueError(f"{action}: invalid tier {entry['tier']!r}")
    return entry["tier"], f"listed: {action}"


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--action", required=True)
    parser.add_argument("--facts", default="{}")
    parser.add_argument("--policy", default=str(DEFAULT_POLICY))
    args = parser.parse_args(argv)
    try:
        policy = yaml.safe_load(Path(args.policy).read_text(encoding="utf-8"))
        facts = json.loads(args.facts)
        decision, rule = decide(policy, args.action, facts)
    except Exception as exc:  # unreadable policy or facts: the caller parks
        print(f"error: {type(exc).__name__}: {exc}", file=sys.stderr)
        return 2
    print(f"{decision}\t{rule}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
