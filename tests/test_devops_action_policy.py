"""The unattended-action policy decides act / park / never / escalate deterministically (TC-01).

Cases in tests/fixtures/devops/action_cases.yaml; the policy is
skills/service-reliability/assets/unattended-actions.yaml, read by scripts/decide_action.py.
"""
import importlib.util
import json
import subprocess
import sys
from pathlib import Path

import pytest
import yaml

ROOT = Path(__file__).resolve().parents[1]
SKILL = ROOT / "skills/service-reliability"
SCRIPT = SKILL / "scripts/decide_action.py"
POLICY = yaml.safe_load((SKILL / "assets/unattended-actions.yaml").read_text(encoding="utf-8"))
CASES = yaml.safe_load((ROOT / "tests/fixtures/devops/action_cases.yaml").read_text(encoding="utf-8"))["cases"]

_spec = importlib.util.spec_from_file_location("decide_action", SCRIPT)
decide_action = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(decide_action)


@pytest.mark.parametrize("case", CASES, ids=[c["case"] for c in CASES])
def test_case_gets_its_decision(case):
    assert decide_action.decide(POLICY, case["action"], case.get("facts", {})) == (case["decision"], case["rule"])


def test_every_entry_and_trigger_and_output_is_exercised():
    actions = {c["action"] for c in CASES}
    assert {e["id"] for e in POLICY["actions"]} <= actions
    triggers = {k for c in CASES for k in c.get("facts", {})}
    assert set(POLICY["park_if"]) | set(POLICY["never_if"]) | set(POLICY["thresholds"]) <= triggers
    assert {c["decision"] for c in CASES} == {"act", "park", "never", "escalate"}


def test_act_entries_name_an_operation():
    assert all(e.get("operation") for e in POLICY["actions"] if e["tier"] == "act")


def test_unknown_fact_is_rejected():
    with pytest.raises(ValueError):
        decide_action.decide(POLICY, "restart-container", {"touches_dta": True})


def _run(*args):
    return subprocess.run([sys.executable, str(SCRIPT), *args], capture_output=True, text=True)


def test_cli_prints_decision_and_rule():
    out = _run("--action", "restart-container", "--facts", json.dumps({"attempts": 2}))
    assert out.returncode == 0
    assert out.stdout.strip() == "escalate\tattempts >= 2"


def test_cli_invalid_policy_exits_non_zero(tmp_path):
    bad = tmp_path / "policy.yaml"
    bad.write_text("actions: [unclosed\n", encoding="utf-8")
    assert _run("--action", "restart-container", "--policy", str(bad)).returncode != 0


def test_cli_invalid_facts_exits_non_zero():
    assert _run("--action", "restart-container", "--facts", "{not json").returncode != 0
