"""Adversarial tests of the lint check `workflow_criteria` (test-strategy D-5, D-16).

CASES is kept parallel to CASES in mods/navigator/lib/workflow-criteria-adversarial.test.ts: same labels,
same order. The last test runs the navigator itself on every case and compares verdicts.
"""
import json
import subprocess
from pathlib import Path

import pytest

from tools.repo_lint import lint

REPO = Path(__file__).resolve().parent.parent
WF = "skills/act/assets/workflows/act.workflow.json"
GOOD = {"succeeds": "tests pass", "fails": "a test is red"}
NEEDS = "needs criteria, an object with exactly the keys 'succeeds' and 'fails', each a non-empty string"


def s(succeeds, fails="b"):
    return {"succeeds": succeeds, "fails": fails}


# (label, criteria value, valid per D-5)
CASES = [
    ("good pair", GOOD, True),
    ("text padded with spaces", s("  a  ", " b "), True),
    ("non-ASCII text", s("é à 日本", "ünïcode"), True),
    ("very long strings (200000 chars)", s("x" * 200000, "y" * 200000), True),
    ("wrong pair (succeeds, passes)", {"succeeds": "x", "passes": "y"}, False),
    ("wrong pair (passes, fails)", {"passes": "x", "fails": "y"}, False),
    ("right pair plus a third key", {"succeeds": "a", "fails": "b", "extra": "c"}, False),
    ("keys differ in case", {"Succeeds": "a", "Fails": "b"}, False),
    ("key with a trailing space", {"succeeds ": "a", "fails": "b"}, False),
    ("key with a leading space", {"succeeds": "a", " fails": "b"}, False),
    ("only succeeds", {"succeeds": "a"}, False),
    ("only fails", {"fails": "b"}, False),
    ("empty object", {}, False),
    ("succeeds is an object", s({"a": 1}), False),
    ("fails is an object", s("a", {"a": 1}), False),
    ("succeeds is a list", s(["a"]), False),
    ("fails is a list", s("a", ["b"]), False),
    ("succeeds is a number", s(1), False),
    ("fails is a number", s("a", 0), False),
    ("succeeds is true", s(True), False),
    ("fails is false", s("a", False), False),
    ("succeeds is null", s(None), False),
    ("fails is null", s("a", None), False),
    ("criteria false", False, False),
    ("criteria true", True, False),
    ("criteria 0", 0, False),
    ("criteria 1", 1, False),
    ("criteria empty string", "", False),
    ("criteria text", "succeeds and fails", False),
    ("criteria empty list", [], False),
    ("criteria list of the two strings", ["succeeds", "fails"], False),
    ("criteria null", None, False),
    ("succeeds empty", s(""), False),
    ("fails empty", s("a", ""), False),
    ("both empty", s("", ""), False),
    ("succeeds spaces only", s("   "), False),
    ("fails spaces only", s("a", "   "), False),
    ("tab only", s("\t"), False),
    ("newline only", s("\n"), False),
    ("CRLF only", s("\r\n"), False),
    ("vertical tab and form feed only", s("\u000b\u000c"), False),
    ("non-breaking space only", s(" "), False),
    ("em space only", s(" "), False),
    ("ideographic space only", s("　"), False),
    ("line and paragraph separator only", s("  "), False),
    ("mixed ASCII and Unicode whitespace only", s(" \t\n 　 "), False),
    ("fails non-breaking space only", s("a", " "), False),
]

# D-16 says "whitespace-only counts as empty" and does not define whitespace. Python strip() and JS trim()
# differ on these; the verdict is unspecified, but it must be the same in both validators.
UNSPECIFIED = [
    ("BOM / zero-width no-break space only", s("﻿")),
    ("next line (U+0085) only", s("\u0085")),
    ("file separator (U+001C) only", s("\u001c")),
    ("group separator (U+001D) only", s("\u001d")),
    ("record separator (U+001E) only", s("\u001e")),
    ("unit separator (U+001F) only", s("\u001f")),
    ("zero-width space only", s("​")),
    ("Mongolian vowel separator only", s("᠎")),
    ("newline inside a text (D-5 says one line)", s("line one\nline two")),
]


# D-18 rejects whitespace parity on these six: kept in the no-crash checks, left out of the agreement assertion.
D18_REJECTED = UNSPECIFIED[:6]


def _wf(root: Path, text: str, rel: str = WF):
    p = root / rel
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(text, encoding="utf-8")


def _phases(root: Path, *phases, **top):
    _wf(root, json.dumps({"owner": "act", "phases": list(phases), **top}))


def _verdict(root: Path, criteria) -> bool:
    """True when the lint accepts a lone phase carrying `criteria`."""
    _phases(root, {"id": "p", "criteria": criteria})
    return lint.workflow_criteria(root) == []


@pytest.mark.parametrize("label,criteria,valid", CASES, ids=[c[0] for c in CASES])
def test_criteria_shape(tmp_path, label, criteria, valid):
    _phases(tmp_path, {"id": "p", "criteria": criteria})
    expected = [] if valid else [f"{WF}: phase 'p' {NEEDS}"]
    assert lint.workflow_criteria(tmp_path) == expected


def test_criteria_absent_is_flagged_in_a_default_file(tmp_path):
    _phases(tmp_path, {"id": "p"})
    assert lint.workflow_criteria(tmp_path) == [f"{WF}: phase 'p' {NEEDS}"]


@pytest.mark.parametrize("label,criteria", UNSPECIFIED, ids=[c[0] for c in UNSPECIFIED])
def test_unspecified_cases_never_crash(tmp_path, label, criteria):
    _verdict(tmp_path, criteria)


# ------------------------------------------------------------------ where the key sits
def test_criteria_at_the_top_level_does_not_satisfy_the_phase(tmp_path):
    _phases(tmp_path, {"id": "p"}, criteria=GOOD)
    assert lint.workflow_criteria(tmp_path) == [f"{WF}: phase 'p' {NEEDS}"]


def test_criteria_inside_enter_does_not_satisfy_the_phase(tmp_path):
    _phases(tmp_path, {"id": "p", "enter": {"criteria": GOOD}})
    assert lint.workflow_criteria(tmp_path) == [f"{WF}: phase 'p' {NEEDS}"]


def test_phase_without_id_is_still_flagged_and_names_the_file(tmp_path):
    _phases(tmp_path, {"criteria": {}})
    out = lint.workflow_criteria(tmp_path)
    assert len(out) == 1 and out[0].startswith(f"{WF}: phase ")


def test_duplicate_phase_ids_are_each_checked(tmp_path):
    _phases(tmp_path, {"id": "x"}, {"id": "x", "criteria": GOOD}, {"id": "x"})
    out = lint.workflow_criteria(tmp_path)
    assert out and all(m == f"{WF}: phase 'x' {NEEDS}" for m in out)


def test_a_bad_phase_next_to_good_ones_is_reported_alone(tmp_path):
    _phases(tmp_path, {"id": "a", "criteria": GOOD}, {"id": "b", "criteria": {}}, {"id": "c", "criteria": GOOD})
    assert lint.workflow_criteria(tmp_path) == [f"{WF}: phase 'b' {NEEDS}"]


def test_non_object_phases_are_skipped_and_the_good_ones_still_checked(tmp_path):
    _phases(tmp_path, "x", None, 3, [], {"id": "p"})
    assert lint.workflow_criteria(tmp_path) == [f"{WF}: phase 'p' {NEEDS}"]


@pytest.mark.parametrize("phases", ["x", {}, None, 3, []], ids=repr)
def test_phases_that_is_not_a_usable_list_is_skipped(tmp_path, phases):
    _wf(tmp_path, json.dumps({"owner": "act", "phases": phases}))
    assert lint.workflow_criteria(tmp_path) == []


def test_workflow_without_phases_key_is_skipped(tmp_path):
    _wf(tmp_path, json.dumps({"owner": "act"}))
    assert lint.workflow_criteria(tmp_path) == []


# ------------------------------------------------------------------ the file itself
@pytest.mark.parametrize("text", ["[]", '"x"', "3", "null", "true", "", "  \n", "{nope"],
                         ids=["list", "string", "number", "null", "true", "empty", "blank", "broken"])
def test_file_that_is_not_a_workflow_object_is_skipped(tmp_path, text):
    _wf(tmp_path, text)
    assert lint.workflow_criteria(tmp_path) == []


def test_file_with_a_utf8_bom_is_skipped_not_a_crash(tmp_path):
    _wf(tmp_path, "﻿" + json.dumps({"owner": "act", "phases": [{"id": "p"}]}))
    assert lint.workflow_criteria(tmp_path) == []


def test_file_that_is_not_utf8_is_skipped_not_a_crash(tmp_path):
    p = tmp_path / WF
    p.parent.mkdir(parents=True)
    p.write_bytes(b'{"phases": "\xff\xfe"}')
    assert lint.workflow_criteria(tmp_path) == []


def test_file_nested_100000_levels_deep_is_skipped_not_a_crash(tmp_path):
    _wf(tmp_path, "[" * 100000 + "]" * 100000)
    assert lint.workflow_criteria(tmp_path) == []


def test_criteria_nested_100000_levels_deep_is_skipped_not_a_crash(tmp_path):
    # the file cannot be parsed, so it is skipped like any unreadable file (D-18)
    _wf(tmp_path, '{"phases": [{"id": "p", "criteria": ' + "[" * 100000 + "]" * 100000 + "}]}")
    assert lint.workflow_criteria(tmp_path) == []


# ------------------------------------------------------------------ lint scope
BAD_WF = json.dumps({"owner": "x", "phases": [{"id": "p", "criteria": {}}]})


@pytest.mark.parametrize("rel", [
    "docs/navigator/own.workflow.json",
    ".claude/workflows/own.workflow.json",
    "skills/act/workflows/own.workflow.json",
    "skills/act/assets/own.workflow.json",
    "skills/act/assets/workflows/sub/own.workflow.json",
    "skills/act/assets/workflows/own.json",
    "skills/act/assets/workflows/own.workflow.json.bak",
    "assets/workflows/own.workflow.json",
])
def test_bad_criteria_outside_the_default_location_are_not_reported(tmp_path, rel):
    _wf(tmp_path, BAD_WF, rel)
    assert lint.workflow_criteria(tmp_path) == []


def test_default_file_whose_every_phase_is_fine_reports_nothing(tmp_path):
    _phases(tmp_path, {"id": "a", "criteria": GOOD}, {"id": "b", "criteria": GOOD})
    assert lint.workflow_criteria(tmp_path) == []


def test_message_names_the_file_and_the_phase_of_each_default_file(tmp_path):
    _wf(tmp_path, BAD_WF.replace('"p"', '"one"'), "skills/a/assets/workflows/a.workflow.json")
    _wf(tmp_path, BAD_WF.replace('"p"', '"two"'), "skills/b/assets/workflows/b.workflow.json")
    assert lint.workflow_criteria(tmp_path) == [
        f"skills/a/assets/workflows/a.workflow.json: phase 'one' {NEEDS}",
        f"skills/b/assets/workflows/b.workflow.json: phase 'two' {NEEDS}"]


def test_an_override_next_to_a_bad_default_does_not_hide_or_add_findings(tmp_path):
    _wf(tmp_path, BAD_WF, "docs/navigator/own.workflow.json")
    _wf(tmp_path, BAD_WF, WF)
    assert lint.workflow_criteria(tmp_path) == [f"{WF}: phase 'p' {NEEDS}"]


# ------------------------------------------------------------------ agreement with the navigator
_NODE = """
import { readFileSync } from 'node:fs'
import { resolveWorkflows } from %r
const cases = JSON.parse(readFileSync(0, 'utf8'))
const wf = c => JSON.stringify({ name: 'w', title: 'T', owner: 'o', activate: {},
  phases: [{ id: 'p', owner: 'o', expect: [], enter: {}, criteria: c }] })
console.log(JSON.stringify(cases.map(c => resolveWorkflows([], [{ path: 'f', text: wf(c) }]).errors.length === 0)))
"""


def test_navigator_and_lint_give_the_same_verdict_on_every_case(tmp_path):
    cases = [(label, crit) for label, crit, _ in CASES] + UNSPECIFIED
    ts = str(REPO / "mods" / "navigator" / "lib" / "workflow.ts")
    run = subprocess.run(
        ["node", "--experimental-strip-types", "--input-type=module", "-e", _NODE % ts],
        input=json.dumps([c for _, c in cases]), capture_output=True, text=True, cwd=REPO)
    assert run.returncode == 0, run.stderr
    navigator = json.loads(run.stdout)
    disagree = [(label, f"navigator={nav}", f"lint={_verdict(tmp_path, crit)}")
                for (label, crit), nav in zip(cases, navigator)
                if (label, crit) not in D18_REJECTED and nav != _verdict(tmp_path, crit)]
    assert disagree == []
