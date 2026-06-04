"""Proves the guardrail BITES: each check must flag a deliberately broken repo.

A check that never fails is worse than no check. We build minimal synthetic
repos in tmp_path and assert each function reports the planted defect.
"""
import json
from pathlib import Path

import pytest

from tools.repo_lint import lint


def _skill(root: Path, name: str, frontmatter_name: str | None = "USE_NAME", body: str = "body"):
    d = root / "skills" / name
    d.mkdir(parents=True)
    fm = ""
    if frontmatter_name is not None:
        nm = name if frontmatter_name == "USE_NAME" else frontmatter_name
        fm = f"---\nname: {nm}\ndescription: x\n---\n\n"
    (d / "SKILL.md").write_text(fm + body + "\n", encoding="utf-8")


def _marketplace(root: Path, plugins: list[dict]):
    (root / ".claude-plugin").mkdir(parents=True, exist_ok=True)
    (root / ".claude-plugin" / "marketplace.json").write_text(
        json.dumps({"plugins": plugins}), encoding="utf-8")


def test_missing_skill_dir_is_flagged(tmp_path):
    _marketplace(tmp_path, [{"name": "meaningfy-engineering", "skills": ["./skills/cosmic-python"]}])
    assert lint.missing_skill_dirs(tmp_path)  # listed but dir absent


def test_unregistered_skill_is_flagged(tmp_path):
    _skill(tmp_path, "cosmic-python")
    _marketplace(tmp_path, [])
    assert lint.unregistered_skill_dirs(tmp_path)


def test_missing_frontmatter_is_flagged(tmp_path):
    _skill(tmp_path, "architecture", frontmatter_name=None, body="# no frontmatter here")
    assert lint.frontmatter_present_errors(tmp_path)


def test_name_mismatch_is_flagged(tmp_path):
    _skill(tmp_path, "cosmic-python", frontmatter_name="wrong-name")
    assert lint.name_mismatch(tmp_path)


def test_wrong_bundle_is_flagged(tmp_path):
    _skill(tmp_path, "cosmic-python")
    _marketplace(tmp_path, [{"name": "meaningfy-consulting", "skills": ["./skills/cosmic-python"]}])
    assert lint.expected_bundle_membership(tmp_path)  # cosmic-python belongs in engineering


def test_unknown_bundle_is_flagged(tmp_path):
    _marketplace(tmp_path, [{"name": "random-bundle", "skills": []}])
    assert lint.expected_bundle_membership(tmp_path)


def test_broken_link_is_flagged(tmp_path):
    (tmp_path / "doc.md").write_text("see [x](missing-file.md)", encoding="utf-8")
    assert lint.broken_links(tmp_path)


def test_too_long_skill_is_flagged(tmp_path):
    _skill(tmp_path, "cosmic-python", body="\n".join(str(i) for i in range(600)))
    assert lint.skill_too_long(tmp_path, limit=500)


def test_orphan_agent_reference_is_flagged(tmp_path):
    # documenter has no agents/ file but a doc mentions it -> orphan
    (tmp_path / "guide.md").write_text("ask the documenter to write docs", encoding="utf-8")
    assert any("documenter" in e for e in lint.orphan_agent_references(tmp_path))


def test_orphan_path_mention_is_flagged(tmp_path):
    (tmp_path / "guide.md").write_text("see references/MEANINGFY_PROMPT.md", encoding="utf-8")
    assert lint.orphan_path_mentions(tmp_path, ["MEANINGFY_PROMPT.md"])


def test_clean_fixture_passes_all(tmp_path):
    _skill(tmp_path, "cosmic-python")
    _skill(tmp_path, "architecture")
    _marketplace(tmp_path, [{"name": "meaningfy-engineering",
                             "skills": ["./skills/cosmic-python", "./skills/architecture"]}])
    assert lint.missing_skill_dirs(tmp_path) == []
    assert lint.unregistered_skill_dirs(tmp_path) == []
    assert lint.frontmatter_present_errors(tmp_path) == []
    assert lint.expected_bundle_membership(tmp_path) == []
    assert lint.broken_links(tmp_path) == []
