"""The sales write policy classifies every action (TC-01) and every entry is exercised (TC-02).

The evaluator mirrors the matching rules stated in the policy file's header: every entry that matches
an action gives a tier, the most restrictive wins (never > ask > do), and an unmatched action gets
the default tier.
"""
import fnmatch
from pathlib import Path

import pytest
import yaml

ROOT = Path(__file__).resolve().parents[1]
POLICY = yaml.safe_load((ROOT / "skills/sales-pipeline-custody/assets/write-policy.yaml").read_text(encoding="utf-8"))
CASES = yaml.safe_load((ROOT / "tests/fixtures/sales/write_policy_cases.yaml").read_text(encoding="utf-8"))["cases"]
RANK = {"do": 0, "ask": 1, "never": 2}


def _list(value):
    if value is None:
        return []
    return value if isinstance(value, list) else [value]


def _matches(entry, action):
    if not any(fnmatch.fnmatchcase(action["tool"], p) for p in _list(entry.get("tool"))):
        return False
    model, method, fields = action.get("model"), action.get("method"), _list(action.get("fields"))
    model_ok = model is not None and any(fnmatch.fnmatchcase(model, p) for p in entry.get("models", []))
    method_ok = method is not None and any(fnmatch.fnmatchcase(method, p) for p in entry.get("methods", []))
    if entry.get("match_any_of"):
        return ("models" in entry and model_ok) or ("methods" in entry and method_ok)
    if "models" in entry and not model_ok:
        return False
    if "methods" in entry and not method_ok:
        return False
    if "methods_exclude" in entry and (method is None or method in entry["methods_exclude"]):
        return False
    if set(fields) & set(entry.get("fields_unless_with", [])):
        return False
    if "fields" in entry:
        if entry["fields"] == ["*"]:
            if not [f for f in fields if f not in entry.get("fields_exclude", [])]:
                return False
        elif not set(fields) & set(entry["fields"]):
            return False
    return True


def _tier(entry, facts):
    if any(f in facts for f in _list(entry.get("never_if"))):
        return "never"
    ok = all(f in facts for f in _list(entry.get("when_all")))
    if entry.get("when_any"):
        ok = ok and any(f in facts for f in entry["when_any"])
    tier = entry["tier"] if ok else entry.get("otherwise", "ask")
    if tier == "do" and any(f in facts for f in _list(entry.get("ask_if"))):
        tier = "ask"
    return tier


def classify(action, facts):
    """Return (tier, ids of the matching entries)."""
    hits = [e for e in POLICY["entries"] if _matches(e, action)]
    if not hits:
        return POLICY["default_tier"], []
    return max((_tier(e, set(facts)) for e in hits), key=RANK.get), [e["id"] for e in hits]


@pytest.mark.parametrize("case", CASES, ids=[c["case"] for c in CASES])
def test_action_gets_its_tier(case):
    got, hits = classify(case, case.get("facts", []))
    assert got == case["tier"], f"expected {case['tier']}, got {got} (matching: {', '.join(hits) or 'none'})"


def test_policy_is_well_formed():
    ids = [e["id"] for e in POLICY["entries"]]
    assert len(ids) == len(set(ids)), "duplicate policy ids"
    assert all(e.get("tier") in RANK for e in POLICY["entries"]), "an entry has no valid tier"
    assert POLICY["default_tier"] == "ask"


def test_every_entry_is_exercised_by_a_case():
    exercised = {i for c in CASES for i in classify(c, c.get("facts", []))[1]}
    missing = [e["id"] for e in POLICY["entries"] if e["id"] not in exercised]
    assert not missing, f"policy entries no case exercises: {missing}"


def test_unlisted_write_tool_is_ask():
    assert classify({"tool": "newconnector.write_record"}, []) == ("ask", [])


def test_stricter_entry_wins():
    # odoo.execute_kw unlink matches odoo-merge (never) whatever else matches
    assert classify({"tool": "odoo.execute_kw", "method": "unlink"}, [])[0] == "never"
