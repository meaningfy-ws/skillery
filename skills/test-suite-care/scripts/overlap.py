"""Read a coverage data file recorded with per-test contexts and print the overlap between tests.

Usage:
  overlap.py <.coverage> [--phases <phases.jsonl>]   -> {"contained", "identical_cases", "no_lines"}
  overlap.py <after> --compare <before>              -> {"changed"}
  overlap.py <.coverage> --files                     -> {"files"}

The data file comes from a run with pytest-cov's --cov-context=test; only contexts ending in
"|run" (the test's call) are read. Lines are those of `arc` when the file measured branches,
else those of `line_bits`. Exit 2 when the file holds no per-test context.

- contained: a test whose lines are all covered by another test; the container is the one with
  the fewest lines, then the first by node id. Two tests with equal lines are listed once.
- identical_cases: per parametrised test function, the groups of case ids with the same lines.
- no_lines: tests that passed their call in --phases (phase_times.py) and have no context:
  coverage records no context for a test that runs no measured line.
- changed: tests whose lines differ between the two files, with the lines only in each.
- files: per test function (its parametrised cases merged), the measured files its call covered:
  the scenario map's "code it covers" evidence.

A missing or unreadable input exits 2 and names it. Standard library only; read-only.
"""
import argparse
import json
import re
import sqlite3
import sys
from collections import defaultdict


class NoContexts(Exception):
    pass


def _numbits_lines(blob):
    return [8 * i + j for i, byte in enumerate(blob) for j in range(8) if byte & (1 << j)]


def read_tests(path):
    """Map each test node id to the frozenset of "file:line" its call covered."""
    open(path, "rb").close()  # a missing file is named, not reported as an unopenable database
    db = sqlite3.connect(f"file:{path}?mode=ro", uri=True)
    try:
        meta = dict(db.execute("select key, value from meta"))
        files = dict(db.execute("select id, path from file"))
        contexts = {cid: name[: -len("|run")] for cid, name in db.execute("select id, context from context")
                    if name.endswith("|run")}
        lines = defaultdict(set)
        if meta.get("has_arcs") == "1":
            rows = db.execute("select file_id, context_id, fromno, tono from arc")
            for fid, cid, a, b in rows:
                if cid in contexts:
                    lines[contexts[cid]].update(f"{files[fid]}:{n}" for n in (a, b) if n > 0)
        else:
            for fid, cid, blob in db.execute("select file_id, context_id, numbits from line_bits"):
                if cid in contexts:
                    lines[contexts[cid]].update(f"{files[fid]}:{n}" for n in _numbits_lines(blob))
    finally:
        db.close()
    if not contexts:
        raise NoContexts("no per-test contexts: run with --cov-context=test")
    return {test: frozenset(lines.get(test, ())) for test in contexts.values()}


def contained(tests):
    out = []
    by_size = sorted(tests, key=lambda t: (len(tests[t]), t))
    for test in sorted(tests):
        mine = tests[test]
        if not mine:
            continue
        for other in by_size:  # fewest lines first, then node id: the first hit is the container
            if other == test or len(tests[other]) < len(mine) or not mine <= tests[other]:
                continue
            if tests[other] == mine and other > test:
                continue  # equal lines: only the later one is listed, contained in the earlier
            out.append({"test": test, "container": other, "lines": len(mine)})
            break
    return out


def identical_cases(tests):
    groups = defaultdict(lambda: defaultdict(list))
    for test in sorted(tests):
        m = re.fullmatch(r"(.*)\[(.*)\]", test)
        if m:
            groups[m[1]][tests[test]].append(m[2])
    return [{"test": func, "groups": same} for func, by_lines in groups.items()
            if (same := [ids for ids in by_lines.values() if len(ids) > 1])]


def no_lines(tests, phases_path):
    passed = set()
    with open(phases_path, encoding="utf-8") as f:
        for line in f:
            row = json.loads(line) if line.strip() else {}
            if not isinstance(row, dict):
                raise ValueError(f"{phases_path}: a line is not a JSON object")
            if row.get("phase") == "call" and row.get("outcome") == "passed":
                if "test" not in row:
                    raise ValueError(f"{phases_path}: a phase line has no test")
                passed.add(row["test"])
    return sorted(passed - set(tests))


def covered_files(tests):
    files = defaultdict(set)
    for test, lines in tests.items():
        files[test.split("[", 1)[0]].update(line.rsplit(":", 1)[0] for line in lines)
    return {func: sorted(files[func]) for func in sorted(files)}


def compare(after, before):
    return [{"test": t, "only_after": sorted(after.get(t, set()) - before.get(t, set())),
             "only_before": sorted(before.get(t, set()) - after.get(t, set()))}
            for t in sorted(set(after) | set(before)) if after.get(t) != before.get(t)]


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__.split("\n", 1)[0])
    parser.add_argument("coverage")
    parser.add_argument("--phases")
    mode = parser.add_mutually_exclusive_group()
    mode.add_argument("--compare", metavar="BEFORE")
    mode.add_argument("--files", action="store_true")
    args = parser.parse_args(argv)
    try:
        tests = read_tests(args.coverage)
        if args.compare:
            result = {"changed": compare(tests, read_tests(args.compare))}
        elif args.files:
            result = {"files": covered_files(tests)}
        else:
            result = {"contained": contained(tests), "identical_cases": identical_cases(tests),
                      "no_lines": no_lines(tests, args.phases) if args.phases else []}
    except NoContexts as exc:
        print(exc, file=sys.stderr)
        return 2
    except (OSError, sqlite3.DatabaseError, ValueError) as exc:  # JSONDecodeError is a ValueError
        print(f"cannot read the input: {exc}", file=sys.stderr)
        return 2
    json.dump(result, sys.stdout, indent=1)
    print()
    return 0


if __name__ == "__main__":
    sys.exit(main())
