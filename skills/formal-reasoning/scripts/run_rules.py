#!/usr/bin/env python3
"""Run a reasoning project's tests on its engine and print the paraphrase-back report.

    python run_rules.py <project-dir> [--facts FILE] [--tests FILE] [--json] [--timeout S]

The project holds exactly one rules file (rules.lp runs on clingo, rules.pl on SWI-Prolog), an
optional facts file with the same extension, and tests.toml. Every rule needs a `%%` paraphrase
comment directly above it; Prolog must keep to the pure subset (no cut, assert/retract, global
variables). Exit codes: 0 every test passed, 1 a test failed, 2 input refused, 3 engine missing.
Needs Python >= 3.11, the standard library, and the engine (clingo is imported only when used).
"""
import argparse
import json
import re
import shutil
import subprocess
import sys
import time
import tomllib
from dataclasses import dataclass
from pathlib import Path

from check_env import MISSING, missing_message

FAILED, REFUSED = 1, 2
ROW_SCALE = 10_000
ENGINES = {".lp": "clingo", ".pl": "prolog"}
IMPURE = re.compile(r"!|\b(?:assert|asserta|assertz|retract|retractall|nb_setval|b_setval)\b(?=\s*\()")
SIGNATURE = re.compile(r"^[a-z_][A-Za-z0-9_]*/\d+$")


class Refused(Exception):
    """Input the run will not reason over (exit 2)."""


class EngineMissing(Exception):
    """The engine for this rules file is not installed (exit 3)."""


@dataclass
class Test:
    id: str
    query: str
    expect: object  # "UNSAT" or a frozenset of normalised answers
    question: str = ""
    mode: str = "cautious"


def norm(text):
    return "".join(text.split())


def code_of(line):
    """The line with quoted text blanked and the comment cut, so lints see only code."""
    out, quote = [], None
    for ch in line:
        if quote:
            if ch == quote:
                quote = None
                out.append(ch)
            continue
        if ch == "%":
            break
        if ch in "'\"":
            quote = ch
        out.append(ch)
    return "".join(out)


def statements(lines):
    """(first line number, code) per statement. Shortcut: line-based, so a statement ends at a line
    ending in `.`; block comments are not recognised. Upgrade to a tokenizer if that bites."""
    out, buf, start = [], [], 0
    for no, line in enumerate(lines, 1):
        code = code_of(line).strip()
        if not code:
            continue
        if not buf:
            start = no
        buf.append(code)
        if code.endswith(".") and not code.endswith(".."):
            out.append((start, " ".join(buf)))
            buf = []
    return out


def is_rule(code, ext):
    if ext == ".pl":
        return ":-" in code and not code.startswith(":-")
    return not code.startswith("#") and any(t in code for t in (":-", ":~", "{"))


def lint(path):
    """Paraphrase table rows; raises Refused listing every finding (D-5, D-6)."""
    lines = path.read_text(encoding="utf-8").splitlines()
    ext, rows, findings = path.suffix, [], []
    for start, code in statements(lines):
        if not is_rule(code, ext):
            continue
        above, no = [], start - 1
        while no >= 1 and lines[no - 1].lstrip().startswith("%%"):
            above.insert(0, lines[no - 1].lstrip()[2:].strip())
            no -= 1
        if above:
            rows.append({"line": start, "rule": lines[start - 1].strip(), "paraphrase": " ".join(above)})
        else:
            findings.append(f"{path.name}:{start}: rule has no `%%` paraphrase comment above it: "
                            f"{lines[start - 1].strip()}")
    if ext == ".pl":
        for no, line in enumerate(lines, 1):
            for m in IMPURE.finditer(code_of(line)):
                findings.append(f"{path.name}:{no}: `{m.group(0)}` is outside the pure subset")
    if findings:
        raise Refused("\n".join(findings))
    return rows


def load_tests(path, engine):
    try:
        data = tomllib.loads(path.read_text(encoding="utf-8"))
    except (OSError, tomllib.TOMLDecodeError) as e:
        raise Refused(f"{path.name}: {e}") from e
    raw = data.get("test")
    if not isinstance(raw, list) or not raw:
        raise Refused(f"{path.name}: no [[test]] entries")
    tests, errors = [], []
    for i, t in enumerate(raw, 1):
        where = f"{path.name}: test {i}"
        missing = [k for k in ("id", "query", "expect") if k not in t]
        if missing:
            errors.append(f"{where}: missing {', '.join(missing)}")
            continue
        expect = t["expect"]
        if expect != "UNSAT" and not (isinstance(expect, list) and all(isinstance(x, str) for x in expect)):
            errors.append(f"{where}: expect must be \"UNSAT\" or a list of strings")
            continue
        mode = t.get("mode", "cautious")
        if engine == "clingo" and mode not in ("cautious", "brave"):
            errors.append(f"{where}: mode must be cautious or brave")
        if engine == "prolog" and "mode" in t:
            errors.append(f"{where}: mode applies to clingo only")
        if engine == "clingo" and not SIGNATURE.match(norm(t["query"])):
            errors.append(f"{where}: a clingo query is a signature name/arity")
        if engine == "prolog" and expect == "UNSAT":
            expect = []  # for Prolog, UNSAT and [] both mean: no solution
        tests.append(Test(str(t["id"]), t["query"], expect if expect == "UNSAT" else frozenset(map(norm, expect)),
                          t.get("question", ""), mode))
    if errors:
        raise Refused("\n".join(errors))
    return tests


def peak_mib(who):
    try:
        import resource
    except ImportError:  # Windows has no getrusage
        return None
    rss = resource.getrusage(who(resource)).ru_maxrss
    return round(rss / (1024 * 1024 if sys.platform == "darwin" else 1024), 1)


def run_clingo(rules, facts, tests):
    try:
        import clingo  # lazy: Prolog-only users need no clingo
    except ImportError as e:
        raise EngineMissing(missing_message("clingo")) from e
    report = {"engine": "clingo", "version": clingo.__version__, "time_s": 0.0,
              "grounding": {"rules": 0, "atoms": 0}, "warnings": [], "answers": {}}
    # `#show` limits which atoms clasp computes consequences for, so show every queried signature.
    shows = "".join(sorted({f"#show {norm(t.query)}." for t in tests}))
    for mode in sorted({t.mode for t in tests}):
        messages = []
        # optN: with #minimize, consequences range over the optimal answer sets only
        ctl = clingo.Control(["0", f"--enum-mode={mode}", "--opt-mode=optN"],
                             logger=lambda _code, msg: messages.append(msg))
        last = []
        try:
            for path in [rules] + ([facts] if facts else []):
                ctl.load(str(path))
            ctl.add("base", [], shows)
            ctl.ground([("base", [])])
            result = ctl.solve(on_model=lambda m: last.__setitem__(slice(None), m.symbols(atoms=True)))
        except RuntimeError as e:
            raise Refused("clingo: " + ("".join(messages).strip() or str(e))) from e
        report["warnings"] += [m.strip() for m in messages if m.strip() not in report["warnings"]]
        stats = ctl.statistics  # only meaningful after solve() (D-7)
        lp = stats["problem"]["lp"]
        report["grounding"]["rules"] = max(report["grounding"]["rules"], int(lp["rules"]))
        report["grounding"]["atoms"] = max(report["grounding"]["atoms"], int(lp["atoms"]))
        report["time_s"] += stats["summary"]["times"]["total"]
        for t in (t for t in tests if t.mode == mode):
            if result.unsatisfiable:
                report["answers"][t.id] = "UNSAT"
                continue
            name, arity = norm(t.query).split("/")
            report["answers"][t.id] = frozenset(
                norm(str(s)) for s in last if s.name == name and len(s.arguments) == int(arity))
    report["memory_mib"] = peak_mib(lambda r: r.RUSAGE_SELF)
    return report


def quoted(path):
    return "'" + str(path).replace("\\", "\\\\").replace("'", "\\'") + "'"


def run_prolog(rules, facts, tests, timeout):
    exe = shutil.which("swipl")
    if exe is None:
        raise EngineMissing(missing_message("prolog"))
    version = subprocess.run([exe, "--version"], capture_output=True, text=True, timeout=30).stdout.split()
    report = {"engine": "prolog", "version": version[2] if len(version) > 2 else "unknown",
              "time_s": 0.0, "grounding": None, "warnings": [], "answers": {}}
    load = f"consult({quoted(rules)}), " + (f"consult({quoted(facts)}), " if facts else "")
    for t in tests:
        goal = f"{load}forall(({t.query}), (writeq({t.query}), nl)), halt"
        began = time.perf_counter()
        try:
            out = subprocess.run([exe, "-q", "-g", goal, "-t", "halt(1)"], cwd=rules.parent,
                                 capture_output=True, text=True, timeout=timeout)
        except subprocess.TimeoutExpired:
            report["answers"][t.id] = f"timeout after {timeout} s"
            continue
        finally:
            report["time_s"] += time.perf_counter() - began
        # an unknown procedure or a syntax error must never read as "no solutions"
        if out.returncode != 0 or "ERROR:" in out.stderr or "Warning:" in out.stderr:
            raise Refused(f"swipl, test {t.id}: {out.stderr.strip() or f'exit {out.returncode}'}")
        report["answers"][t.id] = frozenset(norm(line) for line in out.stdout.splitlines() if line.strip())
    report["memory_mib"] = peak_mib(lambda r: r.RUSAGE_CHILDREN)
    return report


def shown(answer):
    if isinstance(answer, str):
        return answer
    return "[" + ", ".join(sorted(answer)) + "]"


def evaluate(tests, report):
    rows = []
    for t in tests:
        actual = report["answers"][t.id]
        rows.append({"id": t.id, "question": t.question, "passed": actual == t.expect,
                     "expected": t.expect if isinstance(t.expect, str) else sorted(t.expect),
                     "actual": actual if isinstance(actual, str) else sorted(actual)})
    return rows


def print_text(report, paraphrases, rows, rules):
    head = [f"{report['engine']} {report['version']}", f"time {report['time_s']:.3f} s"]
    if report["memory_mib"] is not None:
        head.append(f"memory {report['memory_mib']} MiB")
    if report["grounding"]:
        head.append(f"ground rules {report['grounding']['rules']}, atoms {report['grounding']['atoms']}")
    print(" | ".join(head))
    for w in report["warnings"]:
        print(f"warning: {w}")
    print("paraphrases:")
    for p in paraphrases:
        print(f"  {rules.name}:{p['line']}  {p['rule']}\n      means: {p['paraphrase']}")
    for r in rows:
        if r["passed"]:
            print(f"PASS {r['id']}: {shown(r['actual'])}")
        else:
            q = f' ["{r["question"]}"]' if r["question"] else ""
            print(f"FAIL {r['id']}{q}: expected {shown(r['expected'])} got {shown(r['actual'])}")
    passed = sum(r["passed"] for r in rows)
    print(f"summary: {passed} passed, {len(rows) - passed} failed")


def locate(project, facts, tests):
    found = [p for p in sorted(project.glob("rules.*")) if p.is_file()]
    if len(found) != 1 or found[0].suffix not in ENGINES:
        raise Refused(f"{project}: need exactly one rules.lp or rules.pl, found "
                      f"{', '.join(p.name for p in found) or 'none'}")
    rules = found[0]
    facts = Path(facts) if facts else project / f"facts{rules.suffix}"
    return rules, facts if facts.is_file() else None, Path(tests) if tests else project / "tests.toml"


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("project", type=Path)
    ap.add_argument("--facts")
    ap.add_argument("--tests")
    ap.add_argument("--json", action="store_true")
    ap.add_argument("--timeout", type=float, default=30, help="seconds per Prolog test (default 30)")
    args = ap.parse_args(argv)
    try:
        rules, facts, tests_path = locate(args.project.resolve(), args.facts, args.tests)
        engine = ENGINES[rules.suffix]
        paraphrases = lint(rules)
        tests = load_tests(tests_path, engine)
        warnings = []
        if facts and engine == "clingo":
            n = len(statements(facts.read_text(encoding="utf-8").splitlines()))
            if n > ROW_SCALE:
                warnings.append(f"{facts.name} has {n} statements: row-scale input grounds slowly in clingo; "
                                "consider SWI-Prolog")
        report = (run_clingo(rules, facts, tests) if engine == "clingo"
                  else run_prolog(rules, facts, tests, args.timeout))
        report["warnings"] = warnings + report["warnings"]
    except Refused as e:
        print(f"refused:\n{e}", file=sys.stderr)
        return REFUSED
    except EngineMissing as e:
        print(e, file=sys.stderr)
        return MISSING
    rows = evaluate(tests, report)
    if args.json:
        passed = sum(r["passed"] for r in rows)
        out = {k: v for k, v in report.items() if k != "answers"}
        out.update(paraphrases=paraphrases, tests=rows, summary={"passed": passed, "failed": len(rows) - passed})
        print(json.dumps(out, indent=2))
    else:
        print_text(report, paraphrases, rows, rules)
    return 0 if all(r["passed"] for r in rows) else FAILED


if __name__ == "__main__":
    sys.exit(main())
