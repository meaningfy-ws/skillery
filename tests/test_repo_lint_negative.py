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
    _marketplace(tmp_path, [{"name": "meaningfy-building", "skills": ["./skills/cosmic-python"]}])
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


def test_skill_in_multiple_bundles_is_flagged(tmp_path):
    # Single-home invariant: a skill registered in two bundles is an error.
    _skill(tmp_path, "cosmic-python")
    _marketplace(tmp_path, [
        {"name": "meaningfy-core", "skills": ["./skills/cosmic-python"]},
        {"name": "meaningfy-building", "skills": ["./skills/cosmic-python"]},
    ])
    assert any("multiple bundles" in e for e in lint.expected_bundle_membership(tmp_path))


def test_unregistered_skill_dir_is_flagged(tmp_path):
    # Every skill dir must be placed in some bundle (marketplace.json is the truth).
    _skill(tmp_path, "cosmic-python")
    _marketplace(tmp_path, [{"name": "meaningfy-core", "skills": []}])
    assert any("not registered" in e for e in lint.expected_bundle_membership(tmp_path))


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


def test_claude_dir_excluded_from_prose_checks(tmp_path):
    # .claude/ is agent/tool working-state, not the catalogue: content there that
    # would otherwise trip prose checks (orphan agents, broken links) must be ignored.
    claude = tmp_path / ".claude"
    claude.mkdir()
    (claude / "EPIC-x.md").write_text("ask the documenter and gherkin-writer", encoding="utf-8")
    (claude / "notes.md").write_text("see [x](missing-file.md)", encoding="utf-8")
    assert lint.orphan_agent_references(tmp_path) == []
    assert lint.broken_links(tmp_path) == []


def _nested_skill(root: Path, phase: str, name: str):
    d = root / "skills" / phase / name
    d.mkdir(parents=True)
    (d / "SKILL.md").write_text(f"---\nname: {name}\ndescription: x\n---\nbody\n", encoding="utf-8")


def test_nested_skill_is_discovered(tmp_path):
    # EPIC-04: a phase-nested skill must be found and keyed by basename.
    _nested_skill(tmp_path, "engineering", "cosmic-python")
    assert "cosmic-python" in lint._skill_paths(tmp_path)
    assert lint._skill_dirs(tmp_path) == ["cosmic-python"]


def test_ownership_tripwire_flags_a_non_owner_claim(tmp_path):
    # A non-owner skill that re-specifies an owned capability must be flagged.
    _nested_skill(tmp_path, "ai-coding", "clarity-gate")
    _nested_skill(tmp_path, "engineering", "impostor")
    (tmp_path / "skills" / "engineering" / "impostor" / "SKILL.md").write_text(
        "---\nname: impostor\ndescription: x\n---\nWe use a 6-criterion rubric here.\n", encoding="utf-8")
    (tmp_path / "tests").mkdir()
    (tmp_path / "tests" / "ownership.yaml").write_text(
        "capabilities:\n  - tag: clarity-rubric\n    owner: clarity-gate\n"
        "    claim_patterns: [\"6-criterion rubric\"]\n", encoding="utf-8")
    notes = lint.ownership_claim_report(tmp_path)
    assert any("impostor" in n and "clarity-gate" in n for n in notes)


def test_missing_boundary_section_is_flagged(tmp_path):
    # DEC-12: a SKILL.md without a Boundary section must be flagged.
    _skill(tmp_path, "cosmic-python", body="# body, no boundary heading")
    assert lint.boundary_section_present(tmp_path)


def test_boundary_section_present_passes(tmp_path):
    _skill(tmp_path, "cosmic-python", body="## Boundary & Related Skills\n**Owns:** x.")
    assert lint.boundary_section_present(tmp_path) == []


def test_agent_unknown_skill_is_flagged(tmp_path):
    # DEC-12: an agent listing a non-existent, non-external, non-namespaced skill is flagged.
    (tmp_path / "agents").mkdir()
    (tmp_path / "agents" / "implementer.md").write_text(
        "---\nname: implementer\nskills:\n  - cosmic-python\n  - ghost-skill\n"
        "  - superpowers:tdd\n  - stream-coding\n---\nbody\n", encoding="utf-8")
    _skill(tmp_path, "cosmic-python")
    out = lint.agent_skill_alignment(tmp_path)
    assert any("ghost-skill" in e for e in out)
    assert not any("superpowers:tdd" in e or "stream-coding" in e or "cosmic-python" in e for e in out)


def test_reciprocal_related_asymmetry_is_flagged(tmp_path):
    # DEC-12 advisory: A lists B as Related but B does not list A back.
    _skill(tmp_path, "clarity-gate", body="## Boundary\n**Related:** `bdd-gherkin`.")
    _skill(tmp_path, "bdd-gherkin", body="## Boundary\n**Related:** `epic-planning`.")
    notes = lint.reciprocal_related_report(tmp_path)
    assert any("clarity-gate" in n and "bdd-gherkin" in n for n in notes)


def test_reciprocal_related_symmetry_passes(tmp_path):
    _skill(tmp_path, "clarity-gate", body="## Boundary\n**Related:** `bdd-gherkin`.")
    _skill(tmp_path, "bdd-gherkin", body="## Boundary\n**Related:** `clarity-gate`.")
    assert lint.reciprocal_related_report(tmp_path) == []


def test_clean_fixture_passes_all(tmp_path):
    _skill(tmp_path, "cosmic-python")
    _skill(tmp_path, "project-setup")
    _marketplace(tmp_path, [{"name": "meaningfy-building",
                             "skills": ["./skills/cosmic-python", "./skills/project-setup"]}])
    assert lint.missing_skill_dirs(tmp_path) == []
    assert lint.unregistered_skill_dirs(tmp_path) == []
    assert lint.frontmatter_present_errors(tmp_path) == []
    assert lint.expected_bundle_membership(tmp_path) == []
    assert lint.broken_links(tmp_path) == []
