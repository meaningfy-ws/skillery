"""Adversarial tests of orchestrate-external-skills stage 1a: the `bundle:` register key (D-8) and the
two external-skills tables (D-7), against bad input and the real register."""
import re
from pathlib import Path

import pytest
import yaml

from tests.test_repo_lint_negative import _DEP, _bundles, _deps_text
from tools import skill_inventory
from tools.repo_lint import lint

REPO = Path(__file__).resolve().parent.parent
_BASE = {**_DEP, "kind": "skill"}


def _entry(**over):
    e = {**_BASE, **over}
    fields = "".join(f"  {k}: {v!r}\n" for k, v in e.items() if k not in ("name", "skills"))
    skills = e.get("skills")
    line = f"  skills: [{', '.join(skills)}]\n" if skills is not None else ""
    return f"- name: {e['name']}\n{fields}{line}"


def _repo(tmp_path, bundles_text, entries_text):
    if bundles_text is GOOD_BUNDLES:
        _bundles(tmp_path, [{"name": "meaningfy-core"}])  # a bundles.yaml the validator accepts
    elif bundles_text is not None:
        (tmp_path / "bundles.yaml").write_text(bundles_text, encoding="utf-8")
    return _deps_text(tmp_path, entries_text)


GOOD_BUNDLES = object()


# --- `bundle` value types: lint must report, never crash
@pytest.mark.parametrize("value", [["meaningfy-core"], {"a": 1}, 3, True])
def test_bundle_of_wrong_type_is_flagged_not_crashed(tmp_path, value):
    out = _repo(tmp_path, GOOD_BUNDLES, _entry(bundle=value, skills=["a"]))
    assert any("'bundle' must be a bundle name" in m for m in out)


@pytest.mark.parametrize("value", [None, "", "MEANINGFY-CORE"])  # None is written as the string 'None'
def test_bundle_of_wrong_value_is_flagged_not_crashed(tmp_path, value):
    out = _repo(tmp_path, GOOD_BUNDLES, _entry(bundle=value, skills=["a"]))
    assert any("is not a bundle of bundles.yaml" in m for m in out)


# --- bundles.yaml in bad shapes: lint must report, never crash
@pytest.mark.parametrize("text", [
    "",                      # empty file
    "bundles:\n",            # key with null value
    "bundles: []\n",         # no bundles
    "- meaningfy-core\n",    # a list at top level
    "bundles:\n- meaningfy-core\n",  # bundle entries that are strings
    "bundles: meaningfy-core\n",     # a string where a list is expected
    "bundles: [unclosed\n",  # malformed yaml
], ids=["empty", "null-list", "empty-list", "top-list", "string-items", "string-list", "malformed"])
def test_bundles_yaml_bad_shape_skips_membership_and_bundle_gates_reports_it(tmp_path, text):
    out = _repo(tmp_path, text, _entry(bundle="meaningfy-core", skills=["a"]))
    assert not any("is not a bundle of bundles.yaml" in m for m in out)
    assert lint.bundle_gates(tmp_path)


def test_missing_bundles_yaml_skips_membership_and_bundle_gates_reports_it(tmp_path):
    out = _repo(tmp_path, None, _entry(bundle="meaningfy-core", skills=["a"]))
    assert not any("is not a bundle of bundles.yaml" in m for m in out)
    assert lint.bundle_gates(tmp_path)


# --- skills of a bundle entry
def test_bundle_entry_without_skills_key_is_flagged(tmp_path):
    out = _repo(tmp_path, GOOD_BUNDLES, _entry(bundle="meaningfy-core"))
    assert any("needs a non-empty 'skills' list" in m for m in out)


def test_bundle_skills_a_string_is_flagged_once_each(tmp_path):
    text = _entry(bundle="meaningfy-core").rstrip("\n") + "\n  skills: abc\n"
    out = _repo(tmp_path, GOOD_BUNDLES, text)
    assert any("needs a non-empty 'skills' list" in m for m in out)


def test_bundle_skill_repeated_by_two_entries_is_flagged(tmp_path):
    text = _entry(name="one", bundle="meaningfy-core", skills=["a"]) + _entry(
        name="two", bundle="meaningfy-core", skills=["a"])
    out = _repo(tmp_path, GOOD_BUNDLES, text)
    assert any("skill 'a' is already listed by 'one'" in m for m in out)


def test_bundle_skill_repeated_inside_one_entry_is_flagged(tmp_path):
    out = _repo(tmp_path, GOOD_BUNDLES, _entry(bundle="meaningfy-core", skills=["a", "a"]))
    assert any("skill 'a' is already listed" in m for m in out)


def test_bundle_skill_shadowing_a_skills_folder_is_flagged(tmp_path):
    (tmp_path / "skills" / "refactoring").mkdir(parents=True)
    out = _repo(tmp_path, GOOD_BUNDLES, _entry(bundle="meaningfy-core", skills=["refactoring"]))
    assert any("is a skills/ directory of this catalogue" in m for m in out)


def test_bundle_on_wrong_kind_with_unknown_bundle_reports_both(tmp_path):
    out = _repo(tmp_path, GOOD_BUNDLES, _entry(kind="cli-tool", bundle="nope", skills=["a"]))
    assert len([m for m in out if "bundle" in m]) == 2


# --- rendering
_E = {"name": "x", "kind": "skill", "bundle": "meaningfy-core", "skills": ["a"],
      "claude_install": "`c`", "opencode_install": "`o`"}
TABLES = ("external-skills-claude", "external-skills-opencode")


@pytest.mark.parametrize("table", TABLES)
def test_one_element_skills_list_renders_without_separator(table):
    row = skill_inventory.render_dependencies([_E], table).splitlines()[2]
    assert row.startswith("| meaningfy-core | a | ") and ", " not in row


def test_pipe_in_a_skill_name_is_flagged_by_the_lint(tmp_path):
    out = _repo(tmp_path, GOOD_BUNDLES, _entry(bundle="meaningfy-core", skills=["a|b"]))
    assert any("is not kebab-case" in m for m in out)


@pytest.mark.parametrize("table", TABLES)
def test_missing_skills_key_on_a_bundle_entry_does_not_crash(table):
    e = {k: v for k, v in _E.items() if k != "skills"}
    assert skill_inventory.render_dependencies([e], table).count("\n") == 3


@pytest.mark.parametrize("table", TABLES)
def test_empty_skills_list_renders_an_empty_cell(table):
    row = skill_inventory.render_dependencies([{**_E, "skills": []}], table).splitlines()[2]
    assert row.startswith("| meaningfy-core |  | ")


@pytest.mark.parametrize("table", TABLES)
def test_bundle_null_renders_a_row_with_empty_bundle(table):
    # `bundle:` present but null is a lint error; rendering must still not crash
    assert skill_inventory.render_dependencies([{**_E, "bundle": None}], table).count("\n") == 3


def test_entries_keep_register_order_in_the_table():
    es = [{**_E, "bundle": "z"}, {**_E, "bundle": "a"}]
    rows = skill_inventory.render_dependencies(es, "external-skills-claude").splitlines()[2:]
    assert [r.split(" | ")[0] for r in rows] == ["| z", "| a"]


def test_existing_tables_ignore_bundle_entries_and_keep_the_bold_name():
    e = {**_E, "summary": "s", "opencode_status": "native", "used_by": "u"}
    out = skill_inventory.render_dependencies([e], "plugins")
    assert out.splitlines()[2] == "| **x** (s) | u | native | `c` | `o` |"


def test_existing_tables_render_a_list_cell_unchanged_for_scalars():
    e = {"name": "x", "kind": "mcp-server", "opencode_status": "native", "transport": "t", "notes": "n"}
    assert skill_inventory.render_dependencies([e], "mcp").splitlines()[2] == (
        "| **x** | t | native | n |")


# --- the real register
def _real():
    return yaml.safe_load((REPO / "dependencies.yaml").read_text(encoding="utf-8"))


def test_real_register_passes_the_lint():
    assert lint.dependencies_register(REPO) == []


def test_real_generated_docs_have_no_drift():
    assert skill_inventory.drift_errors(REPO) == []


def test_real_tables_have_one_row_per_bundle_entry_and_three_cells():
    bundled = [d for d in _real() if "bundle" in d]
    assert bundled
    for table in TABLES:
        rows = skill_inventory.render_dependencies(_real(), table).splitlines()[2:]
        assert len(rows) == len(bundled)
        assert all(len(re.split(r"(?<!\\)\|", r.strip("|"))) == 3 for r in rows)


@pytest.mark.parametrize("agent,field", [("claude-code", "claude_install"), ("opencode", "opencode_install")])
def test_real_install_commands_carry_pin_skills_and_agent(agent, field):
    for d in (x for x in _real() if "bundle" in x):
        cmd = d[field]
        sha = re.match(r"[0-9a-f]{40}", d["pin"]).group(0)
        assert "DO_NOT_TRACK=1 npx skills@1.8.1 add" in cmd and f"#{sha}" in cmd, d["name"]
        assert f"--agent {agent} --global --yes" in cmd and "--agent " + (
            "opencode" if agent == "claude-code" else "claude-code") not in cmd, d["name"]
        listed = re.search(r"--skill (.*?) --agent", cmd).group(1).split()
        assert listed == d["skills"], d["name"]


def test_real_bundle_entries_name_distinct_bundles_that_exist():
    names = {b["name"] for b in yaml.safe_load((REPO / "bundles.yaml").read_text())["bundles"]}
    bundled = [d["bundle"] for d in _real() if "bundle" in d]
    assert set(bundled) <= names and len(bundled) == len(set(bundled))


def test_real_book_skills_are_lowercase_kebab_and_unique():
    all_skills = [s for d in _real() if "bundle" in d for s in d["skills"]]
    assert len(all_skills) == len(set(all_skills))
    assert all(lint._KEBAB.match(s) for s in all_skills)


# --- generated drift when a bundle entry changes
def test_changing_a_bundle_entry_makes_the_setup_docs_stale():
    entries = _real()
    next(d for d in entries if "bundle" in d)["skills"].append("zzz-new")
    for rel in skill_inventory.DEPENDENCY_DOCS[2:]:
        text = (REPO / rel).read_text(encoding="utf-8")
        assert skill_inventory.splice_dependencies(text, entries) != text, rel
