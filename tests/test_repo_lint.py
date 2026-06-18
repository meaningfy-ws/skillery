"""Standing self-consistency checks — green at every task boundary."""
from pathlib import Path

from tools.repo_lint import lint

REPO = Path(__file__).resolve().parents[1]


def test_every_marketplace_skill_exists():
    assert lint.missing_skill_dirs(REPO) == []


def test_every_skill_is_registered():
    assert lint.unregistered_skill_dirs(REPO) == []


def test_all_skills_have_frontmatter():
    assert lint.frontmatter_present_errors(REPO) == []


def test_skill_frontmatter_required_fields():
    assert lint.frontmatter_errors(REPO) == []


def test_skill_name_matches_dir():
    assert lint.name_mismatch(REPO) == []


def test_bundle_placement_matches_spec():
    assert lint.expected_bundle_membership(REPO) == []


def test_no_broken_internal_links():
    assert lint.broken_links(REPO) == []


def test_no_skill_exceeds_max_lines():
    assert lint.skill_too_long(REPO) == []


def test_no_orphan_agent_references():
    assert lint.orphan_agent_references(REPO) == []


def test_readme_lists_every_skill():
    assert lint.readme_inventory_gaps(REPO) == []


def test_claude_agents_templates_mirrored():
    assert lint.templates_mirrored(REPO) == []


def test_skills_are_flat():
    # The catalogue is flat: skills/<skill>/SKILL.md. Bundles group only in
    # marketplace.json (role bundles), so there are no phase/role subfolders.
    paths = lint._skill_paths(REPO)
    assert "cosmic-python" in paths
    assert paths["cosmic-python"].parts[-2:] == ("cosmic-python", "SKILL.md")


def test_role_bundles_have_clean_placement():
    # 4 role bundles, every skill owned by exactly one — no overlays/meta-bundles.
    assert lint.expected_bundle_membership(REPO) == []
    assert set(lint.EXPECTED_BUNDLES) == {
        "meaningfy-core", "meaningfy-consulting", "meaningfy-architecture", "meaningfy-building",
    }


def test_trigger_probes_reference_real_skills():
    # Every probe's expected skill exists (the coverage-gap notes are advisory).
    notes = lint.trigger_probe_report(REPO)
    assert not any("unknown skill" in n for n in notes)


def test_ownership_tripwire_runs():
    # Non-blocking (Q5.2=B): it returns advisory strings, never raises.
    assert isinstance(lint.ownership_claim_report(REPO), list)


def test_cli_returns_zero():
    assert lint.main([str(REPO)]) == 0
