"""test-suite-care stage 1 (openspec/changes/test-suite-care, D-15): T-1 to T-12 and T-15.

The two audit scripts are run as a pytest plugin (T-1, T-2) and as a command on coverage data
files the tests build by hand (T-3 to T-6), or by a real coverage run when coverage is installed
(T-7). The lanes template runs on a temporary git repository (T-8), the scaffold into a temporary
folder (T-9). The rest reads the skill texts.
"""
import json
import re
import shutil
import sqlite3
import subprocess
import sys
from pathlib import Path

import pytest

pytest_plugins = ["pytester"]

ROOT = Path(__file__).resolve().parents[1]
SKILL = ROOT / "skills/test-suite-care"
SCRIPTS = SKILL / "scripts"
OVERLAP = SCRIPTS / "overlap.py"
CHECKLIST = ROOT / "skills/cosmic-python/references/testing-checklist.md"
STRATEGY = ROOT / "skills/test-strategy/references"
CHANGED_TMPL = ROOT / "skills/project-setup/assets/templates/tests/changed.py"
SCAFFOLD = ROOT / "skills/project-setup/scripts/scaffold.sh"
DELIVERY = ROOT / "skills/epic-delivery"

SLOW_MODULE = """
import time
import pytest

@pytest.fixture
def slow():
    time.sleep(0.05)
    return 1

def test_one(slow):
    assert slow == 1

def test_two(slow):
    assert slow == 1
"""


def _jsonl(paths):
    return [json.loads(line) for p in paths for line in p.read_text().splitlines() if line.strip()]


def _run_phase_times(pytester, monkeypatch, *extra, source=SLOW_MODULE, **outcomes):
    monkeypatch.setenv("PYTHONPATH", str(SCRIPTS))
    monkeypatch.setenv("PYTEST_DISABLE_PLUGIN_AUTOLOAD", "1")
    pytester.makepyfile(test_slow=source)
    out = pytester.path / "out" / "phases.jsonl"
    out.parent.mkdir()
    result = pytester.runpytest_subprocess("-p", "phase_times", f"--phase-times-out={out}", *extra)
    result.assert_outcomes(**(outcomes or {"passed": 2}))
    return _jsonl(sorted(out.parent.glob("phases.jsonl*")))


def _check_phase_lines(lines):
    fixtures = [x for x in lines if "fixture" in x]
    phases = [x for x in lines if "phase" in x]
    assert sorted((x["fixture"], x["scope"], x["test"].split("::")[1]) for x in fixtures) == [
        ("slow", "function", "test_one"),
        ("slow", "function", "test_two"),
    ]
    assert all(x["seconds"] >= 0.04 for x in fixtures), fixtures
    assert sorted((x["test"].split("::")[1], x["phase"]) for x in phases) == sorted(
        (t, p) for t in ("test_one", "test_two") for p in ("setup", "call", "teardown")
    )
    assert {x["outcome"] for x in phases} == {"passed"}


# T-1
def test_phase_times_writes_fixture_and_phase_lines(pytester, monkeypatch):
    _check_phase_lines(_run_phase_times(pytester, monkeypatch))


# Error matrix: a test fails during a run
def test_phase_times_failing_test_is_recorded_and_the_run_continues(pytester, monkeypatch):
    source = "def test_bad():\n    assert 0\n\ndef test_good():\n    pass\n"
    lines = _run_phase_times(pytester, monkeypatch, source=source, passed=1, failed=1)
    calls = {r["test"].rsplit("::", 1)[1]: r["outcome"] for r in lines if r.get("phase") == "call"}
    assert calls == {"test_bad": "failed", "test_good": "passed"}


# T-2
def test_phase_times_under_xdist_writes_each_line_once(pytester, monkeypatch):
    pytest.importorskip("xdist")
    _check_phase_lines(_run_phase_times(pytester, monkeypatch, "-p", "xdist", "-n", "2"))


def _numbits(lines):
    data = bytearray(max(lines) // 8 + 1)
    for n in lines:
        data[n // 8] |= 1 << (n % 8)
    return bytes(data)


def _coverage_db(path, contexts, arcs=False):
    """Write a coverage data file: contexts maps a context name to its covered lines in mod.py."""
    db = sqlite3.connect(path)
    db.executescript(
        "create table meta (key text, value text);"
        "create table file (id integer primary key, path text);"
        "create table context (id integer primary key, context text);"
        "create table line_bits (file_id integer, context_id integer, numbits blob);"
        "create table arc (file_id integer, context_id integer, fromno integer, tono integer);"
    )
    db.execute("insert into meta values ('has_arcs', ?)", ("1" if arcs else "0",))
    db.execute("insert into file values (1, '/src/mod.py')")
    for cid, (name, lines) in enumerate(contexts.items(), start=1):
        db.execute("insert into context values (?, ?)", (cid, name))
        if arcs:
            chain = [-1, *sorted(lines), -1]
            for a, b in zip(chain, chain[1:]):
                db.execute("insert into arc values (1, ?, ?, ?)", (cid, a, b))
        else:
            db.execute("insert into line_bits values (1, ?, ?)", (cid, _numbits(lines)))
    db.commit()
    db.close()
    return path


CONTEXTS = {
    "t.py::test_small|run": {1, 2},
    "t.py::test_big|run": {1, 2, 3, 4},
    "t.py::test_big|setup": {9},
    "t.py::test_p[a]|run": {5, 6, 7, 8, 10, 11},
    "t.py::test_p[b]|run": {5, 6, 7, 8, 10, 11},
    "t.py::test_p[c]|run": {5, 6, 7, 8, 10, 12},
}


def _overlap(*args):
    return subprocess.run([sys.executable, str(OVERLAP), *map(str, args)], capture_output=True, text=True)


def _phases_file(tmp_path):
    lines = [{"test": "t.py::test_empty", "phase": "call", "outcome": "passed", "seconds": 0.0},
             {"test": "t.py::test_failed", "phase": "call", "outcome": "failed", "seconds": 0.0},
             {"test": "t.py::test_small", "phase": "call", "outcome": "passed", "seconds": 0.0},
             {"fixture": "x", "scope": "function", "test": "t.py::test_small", "seconds": 0.0}]
    path = tmp_path / "phases.jsonl"
    path.write_text("".join(json.dumps(x) + "\n" for x in lines))
    return path


def _check_overlap(result):
    assert result.returncode == 0, result.stderr
    out = json.loads(result.stdout)
    contained = {(c["test"], c["container"]) for c in out["contained"]}
    assert ("t.py::test_small", "t.py::test_big") in contained
    assert ("t.py::test_p[b]", "t.py::test_p[a]") in contained  # equal lines: listed once
    assert ("t.py::test_p[a]", "t.py::test_p[b]") not in contained
    assert out["identical_cases"] == [{"test": "t.py::test_p", "groups": [["a", "b"]]}]
    assert out["no_lines"] == ["t.py::test_empty"]


# T-3
def test_overlap_reads_line_bits(tmp_path):
    db = _coverage_db(tmp_path / ".coverage", CONTEXTS)
    _check_overlap(_overlap(db, "--phases", _phases_file(tmp_path)))


# T-4
def test_overlap_reads_arcs_under_branch_coverage(tmp_path):
    db = _coverage_db(tmp_path / ".coverage", CONTEXTS, arcs=True)
    _check_overlap(_overlap(db, "--phases", _phases_file(tmp_path)))


# T-5
def test_overlap_without_per_test_contexts_exits_2(tmp_path):
    db = _coverage_db(tmp_path / ".coverage", {"": {1, 2}})
    result = _overlap(db)
    assert result.returncode == 2
    assert "no per-test contexts: run with --cov-context=test" in result.stderr


# T-6
def test_overlap_compare_lists_only_the_changed_test(tmp_path):
    before = _coverage_db(tmp_path / "before", CONTEXTS)
    after_contexts = dict(CONTEXTS, **{"t.py::test_big|run": {1, 2, 3, 13}})
    after = _coverage_db(tmp_path / "after", after_contexts)
    result = _overlap(after, "--compare", before)
    assert result.returncode == 0, result.stderr
    changed = json.loads(result.stdout)["changed"]
    assert changed == [{"test": "t.py::test_big", "only_after": ["/src/mod.py:13"],
                        "only_before": ["/src/mod.py:4"]}]


# T-7
def test_overlap_on_a_real_branch_coverage_run(pytester, monkeypatch):
    pytest.importorskip("coverage")
    pytest.importorskip("pytest_cov")
    monkeypatch.setenv("PYTEST_DISABLE_PLUGIN_AUTOLOAD", "1")
    monkeypatch.setenv("COVERAGE_FILE", str(pytester.path / ".coverage"))
    # the sysmon core (the default from Python 3.14) records a line once, under the first test only
    monkeypatch.setenv("COVERAGE_CORE", "ctrace")
    pytester.makepyfile(
        mod="def f(x):\n    if x:\n        return 1\n    return 0\n\ndef g():\n    return 2\n",
        test_mod="from mod import f, g\n\ndef test_a():\n    assert f(1) == 1\n\n"
                 "def test_b():\n    assert f(1) == 1\n    assert g() == 2\n",
    )
    pytester.runpytest_subprocess(
        "-p", "pytest_cov", "--cov=mod", "--cov-branch", "--cov-context=test", "--cov-report="
    ).assert_outcomes(passed=2)
    result = _overlap(pytester.path / ".coverage")
    assert result.returncode == 0, result.stderr
    contained = {(c["test"], c["container"]) for c in json.loads(result.stdout)["contained"]}
    assert ("test_mod.py::test_a", "test_mod.py::test_b") in contained


# T-8: the changed-files lane on a temporary git repository
REPO_FILES = [
    "pytest.ini", "uv.lock", "docs/a.md", "tests/__init__.py", "tests/conftest.py",
    "tests/unit/__init__.py", "tests/unit/test_top.py", "tests/unit/services/test_x.py",
    "tests/feature/x.feature", "tests/integration/test_i.py", "tests/e2e/test_e.py",
    "pkg/__init__.py", "pkg/services/x.py", "pkg/models/m.py",
]


def _git(repo, *args):
    subprocess.run(["git", *args], cwd=repo, check=True, capture_output=True)


@pytest.fixture
def lane_repo(tmp_path):
    repo = tmp_path / "repo"
    for name in REPO_FILES:
        (repo / name).parent.mkdir(parents=True, exist_ok=True)
        (repo / name).write_text("x = 1\n")
    (repo / "tests/changed.py").write_text(CHANGED_TMPL.read_text().replace("<<PACKAGE>>", "pkg"))
    (repo / ".gitignore").write_text("__pycache__/\n")  # as the scaffold's .gitignore does
    _git(repo, "init", "-q", "-b", "develop")
    _git(repo, "-c", "user.name=t", "-c", "user.email=t@t", "add", ".")
    _git(repo, "-c", "user.name=t", "-c", "user.email=t@t", "commit", "-qm", "init")
    _git(repo, "checkout", "-qb", "feature")
    return repo


def _changed(repo, base="develop"):
    return subprocess.run([sys.executable, "-m", "tests.changed", base], cwd=repo,
                          capture_output=True, text=True)


@pytest.mark.parametrize("path, code, out", [
    ("pytest.ini", 3, ""),
    ("uv.lock", 3, ""),
    ("tests/unit/services/test_x.py", 0, "tests/unit/services/\n"),
    ("tests/unit/test_top.py", 0, "tests/unit/test_top.py\n"),
    ("tests/feature/x.feature", 0, "tests/feature/\n"),
    ("tests/integration/test_i.py", 0, ""),
    ("tests/e2e/test_e.py", 0, ""),
    ("tests/conftest.py", 3, ""),
    ("tests/changed.py", 3, ""),
    ("pkg/services/x.py", 0, "tests/unit/services/\n"),
    ("pkg/models/m.py", 3, ""),
    ("pkg/__init__.py", 3, ""),
    ("docs/a.md", 0, ""),
])
def test_changed_lane_rules(lane_repo, path, code, out):
    with (lane_repo / path).open("a") as f:
        f.write("y = 2\n")
    result = _changed(lane_repo)
    assert (result.returncode, result.stdout) == (code, out), result.stderr
    if code == 3:
        assert path in result.stderr
    if path.startswith(("tests/integration", "tests/e2e")):
        assert "make test-" + path.split("/")[1] in result.stderr


def test_changed_lane_untracked_and_sorted_once(lane_repo):
    (lane_repo / "pkg/services/new.py").write_text("z = 3\n")
    (lane_repo / "tests/unit/services/test_x.py").write_text("y = 2\n")
    (lane_repo / "tests/feature/x.feature").write_text("y\n")
    result = _changed(lane_repo)
    assert (result.returncode, result.stdout) == (0, "tests/feature/\ntests/unit/services/\n")


def test_changed_lane_drops_a_deleted_path(lane_repo):
    (lane_repo / "tests/unit/test_top.py").unlink()
    result = _changed(lane_repo)
    assert (result.returncode, result.stdout) == (0, "")


@pytest.mark.parametrize("path", ["pkg/services/café.py", "tests/unit/services/test_é.py"])
def test_changed_lane_non_ascii_path_is_not_dropped(lane_repo, path):  # git quotes it by default
    (lane_repo / path).write_text("y = 2\n")
    result = _changed(lane_repo)
    assert (result.returncode, result.stdout) == (0, "tests/unit/services/\n"), result.stderr


def test_changed_lane_unknown_base_exits_2(lane_repo):
    assert _changed(lane_repo, "no-such-branch").returncode == 2


# T-9
@pytest.mark.skipif(shutil.which("bash") is None, reason="bash required to run scaffold.sh")
def test_scaffold_has_the_lanes(tmp_path):
    subprocess.run(
        ["bash", str(SCAFFOLD), "-p", "demo_pkg", "-n", "Demo", "-a", "product",
         "--no-lock", "--no-docs", "--no-infra", "--target", str(tmp_path), "--skip-existing"],
        cwd=ROOT, check=True, capture_output=True, text=True,
    )
    changed = (tmp_path / "tests/changed.py").read_text()
    assert "<<PACKAGE>>" not in changed and "demo_pkg" in changed
    assert re.search(r"^\s+slow: ", (tmp_path / "pytest.ini").read_text(), re.M)
    makefile = (tmp_path / "Makefile").read_text()
    phony = " ".join(re.findall(r"^\.PHONY:(.*)$", makefile, re.M)).split()
    for target in ("test-fast", "test-changed", "profile-tests"):
        assert re.search(rf"^{target}:", makefile, re.M), target
        assert target in phony, target


# T-10
def test_skill_names_no_repository_path_or_pin():
    assert (SKILL / "SKILL.md").is_file()
    for path in SKILL.rglob("*"):
        if not path.is_file() or "__pycache__" in path.parts:
            continue
        text = path.read_text(encoding="utf-8")
        assert "rdf-persistence" not in text, path
        assert not re.search(r"(?<![\w/])/home", text), path
        if path.suffix == ".md":
            assert not re.search(r"[\w.-]+==\d", text), path


def _rule_numbers(text):
    return [int(n) for n in re.findall(r"^(\d+)\. ", text, re.M)]


# T-11
def test_waste_rows_checklist_rules_and_cited_numbers():
    waste = (SKILL / "references/waste.md").read_text()
    rows = re.findall(r"^\| (W-\d+) \|.*\| ([123]) \|\s*$", waste, re.M)
    assert [r[0] for r in rows] == [f"W-{n}" for n in range(1, 9)]
    checklist = CHECKLIST.read_text()
    assert _rule_numbers(checklist) == list(range(1, 22))
    sources = checklist.split("## Sources", 1)[1]
    for n in (6, 14, 17, 18, 19, 20, 21):
        assert re.search(rf"^\| {n} \|", sources, re.M), n
    for path in SKILL.rglob("*.md"):
        for n in re.findall(r"\brules? (\d+)", path.read_text()):
            assert 1 <= int(n) <= 21, (path, n)


# T-12
def test_distilling_in_epic_delivery():
    briefs = (DELIVERY / "references/team-and-briefs.md").read_text()
    tester = briefs.split("## Adversarial tester", 1)[1].split("\n## ", 1)[0]
    assert "what it attacks" in tester and "failed on its first run" in tester
    ledger = (DELIVERY / "references/stage-loop.md").read_text()
    row = next(line for line in ledger.splitlines() if line.startswith("| Adversarial tester |"))
    assert row.rstrip(" |").endswith("Distilled in step 4")
    feature = (ROOT / "tests/features/epic-delivery.feature").read_text()
    assert "Scenario: A stage's adversarial tests are distilled" in feature


# T-15
def test_strategy_rows_rule_count_and_gherkin_box():
    software = (STRATEGY / "software.md").read_text()
    assert re.search(r"^\| ADQ \| CHK-\d+ Test suite audit \| `test-suite-care` \|", software, re.M)
    chk2 = [line for line in software.splitlines() if "| CHK-2 Testing checklist" in line]
    assert len(chk2) == 2
    for line in chk2:
        assert "`make test-fast`" in line and "`make test-changed`" in line, line
    assert software.count("rules 1-21") == 2
    assert "rules 1-21" in (STRATEGY / "inventory.md").read_text()
    for path in (ROOT / "skills").rglob("*.md"):
        assert "rules 1-16" not in path.read_text(encoding="utf-8"), path
    gherkin = (ROOT / "skills/bdd-gherkin/SKILL.md").read_text()
    checks = gherkin.split("## Quality checks", 1)[1].split("\n## ", 1)[0]
    assert "No step joins two actions with 'and'." in checks
