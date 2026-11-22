"""The model matrix check (D-2) and the design budget check (D-9) of tools/repo_lint."""
import json
from pathlib import Path

import yaml

from tools.repo_lint import lint

MATRIX = {"roles": {"builder": "sonnet", "lead": "opus", "explorer": "haiku"}}


def _matrix(root: Path, matrix: dict | None = None) -> None:
    (root / "skills" / "guardrails" / "assets").mkdir(parents=True, exist_ok=True)
    (root / "skills" / "guardrails" / "assets" / "model-matrix.json").write_text(
        json.dumps(MATRIX if matrix is None else matrix), encoding="utf-8")
    (root / "tools").mkdir(exist_ok=True)
    (root / "tools" / "opencode-agent-map.json").write_text(
        json.dumps({"modelAliases": {"opus": "o", "sonnet": "s", "haiku": "h"}}), encoding="utf-8")


def _agent(root: Path, name: str, model: str | None, role: str | None) -> None:
    fm: dict = {"name": name, "description": "x"}
    if model:
        fm["model"] = model
    if role:
        fm["metadata"] = {"role": role}
    (root / "agents").mkdir(exist_ok=True)
    (root / "agents" / f"{name}.md").write_text(
        f"---\n{yaml.safe_dump(fm, sort_keys=False)}---\nbody\n", encoding="utf-8")


def _fleet(root: Path) -> None:
    """One conforming agent per matrix role."""
    _matrix(root)
    _agent(root, "implementer", "sonnet", "builder")
    _agent(root, "team-lead", "opus", "lead")
    _agent(root, "scout", "haiku", "explorer")


def test_agents_matching_the_matrix_pass(tmp_path):
    _fleet(tmp_path)
    assert lint.agent_model_matrix(tmp_path) == []


def test_model_that_differs_from_the_matrix_names_agent_and_role(tmp_path):
    _fleet(tmp_path)
    _agent(tmp_path, "implementer", "opus", "builder")
    errors = lint.agent_model_matrix(tmp_path)
    assert len(errors) == 1 and "implementer" in errors[0] and "builder" in errors[0]


def test_unknown_role_is_an_error(tmp_path):
    _fleet(tmp_path)
    _agent(tmp_path, "implementer", "sonnet", "wizard")
    errors = lint.agent_model_matrix(tmp_path)
    assert any("implementer" in e and "wizard" in e for e in errors)


def test_missing_role_is_an_error(tmp_path):
    _fleet(tmp_path)
    _agent(tmp_path, "implementer", "sonnet", None)
    errors = lint.agent_model_matrix(tmp_path)
    assert any("implementer" in e and "metadata.role" in e for e in errors)


def test_matrix_role_no_agent_uses_is_a_note_not_an_error(tmp_path):
    # Some roles are workflow roles a spawn takes without a catalogue agent: advisory, never failing.
    _fleet(tmp_path)
    (tmp_path / "agents" / "scout.md").unlink()
    assert lint.agent_model_matrix(tmp_path) == []
    notes = lint.agent_model_matrix_report(tmp_path)
    assert len(notes) == 1 and "explorer" in notes[0]


def test_every_matrix_role_in_use_has_no_note(tmp_path):
    _fleet(tmp_path)
    assert lint.agent_model_matrix_report(tmp_path) == []


def test_the_matrix_check_is_registered():
    assert lint.agent_model_matrix in lint.ALL_CHECKS


# ------------------------------------------------------------ design budget
def _change(root: Path, cid: str, appetite_line: str, size: int, archived: bool = False) -> None:
    d = root / "openspec" / "changes" / ("archive/" + cid if archived else cid)
    d.mkdir(parents=True)
    (d / "proposal.md").write_text(f"# EPIC\n\n## Appetite\n\n{appetite_line}\n\n## Why\n\nx\n", encoding="utf-8")
    (d / "design.md").write_bytes(b"x" * size)


def _allow(root: Path, text: str) -> None:
    (root / "openspec" / "changes" / ".design-budget-exempt").write_text(text, encoding="utf-8")


def test_design_under_budget_passes(tmp_path):
    _change(tmp_path, "c1", "**SMALL.** one capability", 8192)
    assert lint.design_budget(tmp_path) == []


def test_design_over_budget_reports_size_and_budget(tmp_path):
    _change(tmp_path, "c1", "**SMALL.** one capability", 8193)
    errors = lint.design_budget(tmp_path)
    assert len(errors) == 1 and "c1" in errors[0] and "8193" in errors[0] and "8192" in errors[0]


def test_very_large_is_matched_before_large(tmp_path):
    _change(tmp_path, "c1", "VERY LARGE, in five stages", 24576)
    assert lint.design_budget(tmp_path) == []


def test_archived_change_is_exempt(tmp_path):
    _change(tmp_path, "c1", "**TINY.**", 99999, archived=True)
    assert lint.design_budget(tmp_path) == []


def test_allowlisted_change_is_exempt(tmp_path):
    _change(tmp_path, "c1", "**TINY.**", 99999)
    _allow(tmp_path, "# why\nc1\n")
    assert lint.design_budget(tmp_path) == []


def test_unparseable_appetite_is_an_error(tmp_path):
    _change(tmp_path, "c1", "Small, a teaching artifact", 100)
    errors = lint.design_budget(tmp_path)
    assert len(errors) == 1 and "c1" in errors[0] and "appetite" in errors[0]


def test_the_budget_check_is_registered():
    assert lint.design_budget in lint.ALL_CHECKS
