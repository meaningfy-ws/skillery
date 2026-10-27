"""The stack conformance check reports S1-S9 per service and fails on any missing rule (TC-02).

Fixtures under tests/fixtures/devops/compose/: `met` meets every rule; in `missing` and `excepted` each
service's name starts with the one rule it breaks (in `excepted` it also carries the exception comment).
"""
import importlib.util
import subprocess
import sys
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "skills/stack-operations/scripts/check_stack.py"
COMPOSE = ROOT / "tests/fixtures/devops/compose"
RULES = [f"S{n}" for n in range(1, 10)]

_spec = importlib.util.spec_from_file_location("check_stack", SCRIPT)
check_stack = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(check_stack)


def _rows(name):
    return check_stack.check_file(COMPOSE / name / "compose.yml")


def _by_service(rows):
    out = {}
    for row in rows:
        out.setdefault(row.service, {})[row.rule] = row.status
    return out


def test_every_rule_met():
    services = _by_service(_rows("met"))
    assert set(services) == {"proxy", "app", "db"}
    for service, rules in services.items():
        assert rules == {r: "met" for r in RULES}, service


@pytest.mark.parametrize("service,rules", _by_service(_rows("missing")).items())
def test_each_missing_service_misses_only_its_rule(service, rules):
    own = service.split("-")[0].upper()
    assert rules[own] == "missing"
    assert {r for r, s in rules.items() if s != "met"} == {own}


def test_every_rule_has_a_missing_case():
    services = _by_service(_rows("missing"))
    assert {s.split("-")[0].upper() for s in services} == set(RULES)


@pytest.mark.parametrize("service,rules", _by_service(_rows("excepted")).items())
def test_each_excepted_service_is_excepted_not_met(service, rules):
    own = service.split("-")[0].upper()
    if service.endswith("no-reason"):
        assert rules[own] == "missing", "an exception without a reason does not count"
    else:
        assert rules[own] == "excepted"
    assert {r for r, s in rules.items() if s != "met"} == {own}


def test_every_rule_has_an_excepted_case():
    services = _by_service(_rows("excepted"))
    assert {s.split("-")[0].upper() for s in services} == set(RULES)


def test_unreadable_file():
    rows = _rows("unreadable")
    assert [r.status for r in rows] == ["unreadable"]


def _run(*names):
    return subprocess.run([sys.executable, str(SCRIPT), *(str(COMPOSE / n / "compose.yml") for n in names)],
                          capture_output=True, text=True)


def test_cli_exit_codes():
    assert _run("met").returncode == 0
    assert _run("met", "missing").returncode == 1
    assert _run("unreadable").returncode == 1
    # excepted alone still fails: it holds one exception without a reason
    assert _run("excepted").returncode == 1


def test_cli_prints_a_table():
    out = _run("missing").stdout
    assert "stack" in out.splitlines()[0] and "status" in out.splitlines()[0]
    assert any("s7-no-bind-address" in line and "S7" in line and "missing" in line for line in out.splitlines())
