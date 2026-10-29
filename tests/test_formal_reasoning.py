"""formal-reasoning scripts: check_env reports engines, run_rules runs a test-first, paraphrased loop.

Fixtures under tests/fixtures/formal-reasoning/ are the recorded failure cases (F-1 clingo-dead-rule,
F-2 prolog-closure) plus one fixture per refusal. Exit codes (design D-8): 0 pass, 1 a test failed,
2 input refused, 3 engine missing. Engine tests skip when the engine is absent, unless
REQUIRE_ENGINES=1 (CI sets it), so CI cannot skip them silently.
"""
import importlib.util
import json
import os
import shutil
import subprocess
import sys
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]
SCRIPTS = ROOT / "skills/formal-reasoning/scripts"
FIX = ROOT / "tests/fixtures/formal-reasoning"
TEMPLATES = ROOT / "skills/formal-reasoning/templates/reasoning-project"
REQUIRE = os.environ.get("REQUIRE_ENGINES") == "1"

needs_clingo = pytest.mark.skipif(
    importlib.util.find_spec("clingo") is None and not REQUIRE, reason="clingo not installed")
needs_swipl = pytest.mark.skipif(
    shutil.which("swipl") is None and not REQUIRE, reason="swipl not on PATH")


def run(script, *args, env=None):
    return subprocess.run([sys.executable, str(SCRIPTS / script), *map(str, args)],
                          capture_output=True, text=True, env=env, timeout=120)


def rules(*args):
    return run("run_rules.py", *args)


# --- Installation is separate from use -------------------------------------------------------

def test_missing_swipl_prints_hint_and_exits_nonzero():
    r = run("check_env.py", "--need", "prolog", env={**os.environ, "PATH": ""})
    assert r.returncode == 3, r.stdout + r.stderr
    assert "swipl" in r.stdout and "missing" in r.stdout
    assert "dependencies.yaml" in r.stdout  # the hint names the entry, not an install procedure


@needs_swipl
def test_present_swipl_is_reported_with_version():
    r = run("check_env.py", "--need", "prolog")
    assert r.returncode == 0, r.stdout + r.stderr
    assert "SWI-Prolog" in r.stdout and "present" in r.stdout


def test_run_on_prolog_without_swipl_exits_3():
    r = run("run_rules.py", FIX / "prolog-closure", env={**os.environ, "PATH": ""})
    assert r.returncode == 3, r.stdout + r.stderr
    assert "dependencies.yaml" in r.stdout + r.stderr


# --- Every run is test-first and paraphrased back ---------------------------------------------

@needs_clingo
def test_all_expected_answers_hold():
    r = rules(FIX / "clingo-conflict")
    assert r.returncode == 0, r.stdout + r.stderr
    assert "PASS T1: [conflict]" in r.stdout
    assert "PASS T2:" in r.stdout  # whitespace in `pricing( tm )` is normalised
    assert "A public client is priced at a fixed price." in r.stdout
    assert "pricing(fixed) :- client(public)." in r.stdout
    assert "ground rules 5" in r.stdout


@needs_clingo
def test_a_failing_test_reports_expected_and_actual():
    r = rules(FIX / "clingo-fail")
    assert r.returncode == 1, r.stdout + r.stderr
    assert 'FAIL T1 ["Is the pricing free of conflicts?"]: expected [] got [conflict]' in r.stdout


@needs_clingo
def test_dead_rule_is_missing_from_brave_consequences():
    r = rules(FIX / "clingo-dead-rule")
    assert r.returncode == 0, r.stdout + r.stderr
    assert "wins(r9)" not in r.stdout.split("PASS DEAD-1:")[1].splitlines()[0]
    assert "PASS CONFLICT-1: [conflict(r5,r6,pricing)]" in r.stdout


@needs_clingo
def test_unsat_expectation():
    r = rules(FIX / "clingo-unsat")
    assert r.returncode == 0, r.stdout + r.stderr
    assert "PASS U1: UNSAT" in r.stdout


def test_rule_without_paraphrase_is_refused_with_its_line():
    r = rules(FIX / "no-paraphrase")
    assert r.returncode == 2, r.stdout + r.stderr
    assert "rules.lp:3" in r.stderr and "paraphrase" in r.stderr


def test_impure_prolog_is_refused_naming_construct_and_line():
    r = rules(FIX / "impure")
    assert r.returncode == 2, r.stdout + r.stderr
    assert "rules.pl:2" in r.stderr and "!" in r.stderr
    assert "rules.pl:4" in r.stderr and "assertz" in r.stderr
    assert r.stderr.count("rules.pl:") == 2  # the quoted '!' and the comment are not findings


def test_malformed_tests_file_is_refused():
    r = rules(FIX / "bad-tests")
    assert r.returncode == 2, r.stdout + r.stderr
    assert "tests.toml" in r.stderr


def test_unknown_rules_extension_is_refused(tmp_path):
    (tmp_path / "rules.txt").write_text("a.\n")
    (tmp_path / "tests.toml").write_text('[[test]]\nid="T"\nquery="a/0"\nexpect=["a"]\n')
    assert rules(tmp_path).returncode == 2


@needs_swipl
def test_prolog_unknown_procedure_is_an_error_not_no_solutions():
    r = rules(FIX / "prolog-error")
    assert r.returncode == 2, r.stdout + r.stderr
    assert "direct_part_of" in r.stderr


@needs_clingo
def test_row_scale_facts_warn_but_run(tmp_path):
    shutil.copy(FIX / "clingo-conflict/rules.lp", tmp_path)
    shutil.copy(FIX / "clingo-conflict/tests.toml", tmp_path)
    facts = "client(public). channel(tender).\n" + "".join(f"row({i}).\n" for i in range(10_001))
    (tmp_path / "facts.lp").write_text(facts)
    r = rules(tmp_path)
    assert r.returncode == 0, r.stdout + r.stderr
    assert "row-scale" in r.stdout + r.stderr


@needs_clingo
def test_json_output_and_repeatability():
    first = rules(FIX / "clingo-conflict", "--json")
    data = json.loads(first.stdout)
    assert data["engine"] == "clingo" and data["summary"] == {"passed": 2, "failed": 0}
    assert data["grounding"]["rules"] == 5
    second = json.loads(rules(FIX / "clingo-conflict", "--json").stdout)
    assert [t["actual"] for t in second["tests"]] == [t["actual"] for t in data["tests"]]


# --- Competency questions are tests with answers agreed beforehand ----------------------------

@needs_swipl
def test_competency_questions_pass_on_the_closure():
    r = rules(FIX / "prolog-closure")
    assert r.returncode == 0, r.stdout + r.stderr
    assert "PASS CQ-1:" in r.stdout and "part_of(item3,t1)" in r.stdout
    assert "A part of a part is a part of the whole." in r.stdout


@needs_swipl
def test_model_change_breaking_a_cq_names_it(tmp_path):
    for name in ("facts.pl", "tests.toml"):
        shutil.copy(FIX / "prolog-closure" / name, tmp_path)
    # the model change: the transitive rule is dropped
    text = (FIX / "prolog-closure/rules.pl").read_text().split("%% A part of a part")[0]
    (tmp_path / "rules.pl").write_text(text)
    r = rules(tmp_path)
    assert r.returncode == 1, r.stdout + r.stderr
    assert 'FAIL CQ-1 ["Which items belong to tender t1?"]' in r.stdout


# --- The templates run as shipped -------------------------------------------------------------

@needs_clingo
def test_clingo_template_runs():
    assert rules(TEMPLATES / "clingo").returncode == 0


@needs_swipl
def test_prolog_template_runs():
    assert rules(TEMPLATES / "prolog").returncode == 0
