"""The model matrix check (D-2) and the design budget check (D-9) of tools/repo_lint."""
import json
import shutil
from pathlib import Path

import pytest
import yaml

from tools.repo_lint import lint

ROOT = Path(__file__).resolve().parents[1]
BUDGETS_ASSET = "skills/clarity-gate/assets/design-budgets.json"
BUDGETS = json.loads((ROOT / BUDGETS_ASSET).read_text(encoding="utf-8"))
MATRIX = {"roles": {"builder": "sonnet", "lead": "opus", "explorer": "haiku"}}
MATRIX_FILE = "skills/guardrails/assets/model-matrix.json"


def _matrix(root: Path, matrix: dict | None = None, raw: str | None = None) -> None:
    (root / "skills" / "guardrails" / "assets").mkdir(parents=True, exist_ok=True)
    (root / MATRIX_FILE).write_text(
        raw if raw is not None else json.dumps(MATRIX if matrix is None else matrix), encoding="utf-8")
    (root / "tools").mkdir(exist_ok=True)
    (root / "tools" / "opencode-agent-map.json").write_text(
        json.dumps({"modelAliases": {"opus": "o", "sonnet": "s", "haiku": "h"}}), encoding="utf-8")


def _agent(root: Path, name: str, model: str | None, role: object = None) -> None:
    fm: dict = {"name": name, "description": "x"}
    if model:
        fm["model"] = model
    if role is not None:
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


def test_role_as_a_list_is_an_error_not_a_crash(tmp_path):
    """probe of D-2: a malformed role must be reported, not raise TypeError (unhashable)."""
    _fleet(tmp_path)
    _agent(tmp_path, "implementer", "sonnet", ["builder"])
    errors = lint.agent_model_matrix(tmp_path)
    assert any("implementer" in e for e in errors)


def test_role_as_a_list_does_not_crash_the_advisory_report(tmp_path):
    """probe of D-2: the report builds a set of roles; a list role is unhashable."""
    _fleet(tmp_path)
    _agent(tmp_path, "implementer", "sonnet", ["builder"])
    assert isinstance(lint.agent_model_matrix_report(tmp_path), list)


def test_matrix_file_missing_is_one_error(tmp_path):
    _fleet(tmp_path)
    (tmp_path / MATRIX_FILE).unlink()
    errors = lint.agent_model_matrix(tmp_path)
    assert len(errors) == 1 and "model-matrix.json" in errors[0]
    assert lint.agent_model_matrix_report(tmp_path) == []


@pytest.mark.parametrize("raw", ["{not json", "[]", '{"roles": []}', '{"roles": "x"}'])
def test_malformed_matrix_is_one_error_not_a_crash(tmp_path, raw):
    """probe of D-2: a broken matrix file fails lint with one message, in both matrix checks."""
    _fleet(tmp_path)
    _matrix(tmp_path, raw=raw)
    errors = lint.agent_model_matrix(tmp_path)
    assert len(errors) == 1 and "model-matrix.json" in errors[0]
    assert lint.agent_model_matrix_report(tmp_path) == []


def test_matrix_without_roles_key_flags_every_agent(tmp_path):
    _fleet(tmp_path)
    _matrix(tmp_path, raw="{}")
    assert len(lint.agent_model_matrix(tmp_path)) == 3


def test_matrix_value_that_is_not_an_alias_names_role_and_value(tmp_path):
    """probe of D-2: a matrix model outside modelAliases is an error even when no agent uses the role."""
    _fleet(tmp_path)
    _matrix(tmp_path, {"roles": {**MATRIX["roles"], "attack": "gpt-5"}})
    errors = lint.agent_model_matrix(tmp_path)
    assert len(errors) == 1 and "attack" in errors[0] and "gpt-5" in errors[0]


def test_two_agents_may_share_a_role(tmp_path):
    """probe of D-2: sharing is allowed."""
    _fleet(tmp_path)
    _agent(tmp_path, "implementer-two", "sonnet", "builder")
    assert lint.agent_model_matrix(tmp_path) == []


# ------------------------------------------------------------ appetite parser
NAMES = {**BUDGETS}


def _appetite(text: str):
    return lint._appetite_of(text, NAMES)


@pytest.mark.parametrize("line,expected", [
    ("LARGE.", "LARGE"),
    ("`LARGE`", "LARGE"),
    ("**LARGE**", "LARGE"),
    ("VERY LARGE", "VERY LARGE"),
    ("LARGE, in two stages", "LARGE"),
    ("HUGE", "HUGE"),
    ("Large", None),
    ("SMALLER", None),
])
def test_appetite_line_forms(line, expected):
    """probe of D-9: the appetite line forms the navigator reads."""
    assert _appetite(f"# E\n\n## Appetite\n\n{line}\n\n## Why\n\nx\n") == expected


def test_appetite_names_come_from_the_budget_keys_plus_huge():
    """D-45 W2: the lint holds no list of names; a name only the file knows is read."""
    assert lint._appetite_of("## Appetite\n\nGIANT\n", {"GIANT": 1}) == "GIANT"
    assert lint._appetite_of("## Appetite\n\nLARGE\n", {"GIANT": 1}) is None


def test_appetite_range_takes_a_deterministic_documented_winner():
    """probe of D-9: `MEDIUM to LARGE` resolves by name length (MEDIUM), not by text order."""
    assert _appetite("## Appetite\n\nMEDIUM to LARGE\n") == "MEDIUM"


def test_appetite_structure_cases():
    """probe of D-9: the section, its level, its first paragraph, the next heading and CRLF."""
    assert _appetite("## Appetite\n\n## Why\n\nLARGE appears here\n") is None
    assert _appetite("# E\n\nLARGE\n") is None
    assert _appetite("### Appetite\n\nLARGE\n") is None
    assert _appetite("## Appetite\n\nsee below\n\nLARGE\n") is None
    assert _appetite("## Appetite\nSMALL\n## Why\nLARGE\n") == "SMALL"
    assert _appetite("## Appetite\r\n\r\nLARGE\r\n\r\n## Why\r\n") == "LARGE"


# ------------------------------------------------------------ design budget
def _budgets(root: Path) -> None:
    dest = root / BUDGETS_ASSET
    dest.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy(ROOT / BUDGETS_ASSET, dest)


def _change(root: Path, cid: str, appetite_line: str | None, size: int | bytes | None, archived: bool = False,
            proposal: bool = True) -> None:
    _budgets(root)
    d = root / "openspec" / "changes" / ("archive/" + cid if archived else cid)
    d.mkdir(parents=True)
    if proposal:
        body = "# EPIC\n\n" if appetite_line is None else f"# EPIC\n\n## Appetite\n\n{appetite_line}\n\n## Why\n\nx\n"
        (d / "proposal.md").write_text(body, encoding="utf-8")
    if size is not None:
        (d / "design.md").write_bytes(size if isinstance(size, bytes) else b"x" * size)


def _allow(root: Path, text: str | bytes) -> None:
    path = root / "openspec" / "changes" / ".design-budget-exempt"
    path.write_bytes(text if isinstance(text, bytes) else text.encode("utf-8"))


def test_design_under_budget_passes(tmp_path):
    _change(tmp_path, "c1", "**SMALL.** one capability", 8192)
    assert lint.design_budget(tmp_path) == []


def test_design_over_budget_reports_size_and_budget(tmp_path):
    _change(tmp_path, "c1", "**SMALL.** one capability", 8193)
    errors = lint.design_budget(tmp_path)
    assert len(errors) == 1 and "c1" in errors[0] and "8193" in errors[0] and "8192" in errors[0]


def test_medium_over_by_one_kilobyte_names_the_medium_budget(tmp_path):
    """D-44 S2: a 13 KB design under MEDIUM names 12288."""
    _change(tmp_path, "c1", "MEDIUM", 13 * 1024)
    errors = lint.design_budget(tmp_path)
    assert len(errors) == 1 and "13312" in errors[0] and "12288" in errors[0] and "MEDIUM" in errors[0]


def test_very_large_is_matched_before_large(tmp_path):
    _change(tmp_path, "c1", "VERY LARGE, in five stages", 24576)
    assert lint.design_budget(tmp_path) == []


def test_design_exactly_at_the_large_budget_passes_and_one_byte_over_fails(tmp_path):
    """probe of D-9: the budget is inclusive (16384)."""
    _change(tmp_path, "at", "LARGE", 16384)
    _change(tmp_path, "over", "LARGE", 16385)
    errors = lint.design_budget(tmp_path)
    assert len(errors) == 1 and "over" in errors[0] and "16385" in errors[0]


def test_budget_counts_bytes_not_characters(tmp_path):
    """probe of D-9: 8192 two-byte characters are 16384 bytes, over the SMALL budget."""
    _change(tmp_path, "c1", "SMALL", ("é" * 8192).encode("utf-8"))
    assert len(lint.design_budget(tmp_path)) == 1


def test_change_without_design_is_skipped(tmp_path):
    """probe of D-9: an EPIC not yet planned has no design.md; no error."""
    _change(tmp_path, "c1", "LARGE", None)
    assert lint.design_budget(tmp_path) == []


def test_change_without_proposal_is_an_error_not_a_crash(tmp_path):
    """probe of D-9, D-44 S2: no proposal means no appetite; the error names the change."""
    _change(tmp_path, "c1", None, 1, proposal=False)
    errors = lint.design_budget(tmp_path)
    assert len(errors) == 1 and "c1" in errors[0] and "proposal.md" in errors[0]


def test_huge_appetite_with_a_design_is_an_error(tmp_path):
    """probe of D-9, D-44 S2: HUGE has no PLAN, so no budget; the message says so."""
    _change(tmp_path, "c1", "HUGE", 1)
    errors = lint.design_budget(tmp_path)
    assert len(errors) == 1 and "HUGE" in errors[0] and "no PLAN" in errors[0]


def test_unparseable_appetite_is_an_error_naming_the_paragraph(tmp_path):
    """D-44 W4: the error quotes the paragraph it read, trimmed to 60 characters."""
    _change(tmp_path, "c1", "Small, a teaching artifact " + "y" * 80, 100)
    errors = lint.design_budget(tmp_path)
    assert len(errors) == 1 and "c1" in errors[0] and "appetite" in errors[0]
    assert "Small, a teaching artifact" in errors[0] and "y" * 40 not in errors[0]


def test_lowercase_appetite_is_an_error_naming_the_change(tmp_path):
    """probe of D-9: `Large` is not an appetite name."""
    _change(tmp_path, "c1", "Large", 1)
    errors = lint.design_budget(tmp_path)
    assert len(errors) == 1 and "c1" in errors[0]


def test_archived_change_is_exempt(tmp_path):
    _change(tmp_path, "c1", "**TINY.**", 99999, archived=True)
    assert lint.design_budget(tmp_path) == []


def test_archived_change_without_appetite_is_exempt(tmp_path):
    """probe of D-9: archive holds old EPICs with no `## Appetite`."""
    _change(tmp_path, "c1", None, 99999, archived=True)
    assert lint.design_budget(tmp_path) == []


def test_allowlisted_change_is_exempt(tmp_path):
    _change(tmp_path, "c1", "**TINY.**", 99999)
    _allow(tmp_path, "# why\nc1\n")
    assert lint.design_budget(tmp_path) == []


@pytest.mark.parametrize("data", [b"c1\r\n", b"c1 \n", b"c1   # why\n", b"\n\n# c1\nc1\n", b"\xef\xbb\xbfc1\n"])
def test_allowlist_forms_exempt_the_change(tmp_path, data):
    """probe of D-9, D-46 T6: CRLF, trailing space, inline comment, blank lines, a UTF-8 BOM."""
    _change(tmp_path, "c1", "TINY", 9999)
    _allow(tmp_path, data)
    assert lint.design_budget(tmp_path) == []


def test_allowlist_comment_containing_the_id_does_not_exempt(tmp_path):
    """probe of D-9: a comment is not an entry."""
    _change(tmp_path, "skillery-performance-improvement", "TINY", 9999)
    _allow(tmp_path, "# skillery-performance-improvement is exempt because it is big\n")
    assert len(lint.design_budget(tmp_path)) == 1


def test_allowlist_entry_that_is_a_prefix_does_not_exempt(tmp_path):
    """probe of D-9: exact ids only."""
    _change(tmp_path, "c10", "TINY", 9999)
    _allow(tmp_path, "c1\n")
    assert len(lint.design_budget(tmp_path)) == 1


def test_blank_and_missing_allowlist_exempt_nothing(tmp_path):
    """probe of D-9."""
    _change(tmp_path, "c1", "TINY", 9999)
    assert len(lint.design_budget(tmp_path)) == 1
    _allow(tmp_path, "")
    assert len(lint.design_budget(tmp_path)) == 1


def test_no_changes_folder_is_clean(tmp_path):
    """probe of D-9."""
    assert lint.design_budget(tmp_path) == []


@pytest.mark.parametrize("raw", [None, "{not json", "[]", '{"TINY": "big"}'])
def test_missing_or_malformed_budget_asset_is_one_error(tmp_path, raw):
    """D-45 W2: the asset is the one source; without it the check says so once."""
    _change(tmp_path, "c1", "TINY", 1)
    asset = tmp_path / BUDGETS_ASSET
    if raw is None:
        asset.unlink()
    else:
        asset.write_text(raw, encoding="utf-8")
    errors = lint.design_budget(tmp_path)
    assert len(errors) == 1 and "design-budgets.json" in errors[0]


def test_the_budget_check_is_registered():
    assert lint.design_budget in lint.ALL_CHECKS
