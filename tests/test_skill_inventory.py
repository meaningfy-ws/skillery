"""Codegen-freshness gate for docs/skill-inventory.md — same pattern as
tools/bundle_gen's gate: regenerate and diff against the committed
file, so a skill/bundle change without regeneration fails the build."""

from pathlib import Path

from tools import skill_inventory

REPO = Path(__file__).resolve().parents[1]


def test_real_repo_generation_is_noop():
    assert skill_inventory.drift_errors(REPO) == []


def test_first_sentence_trims_dense_description():
    description = 'Use to do X. Trigger on "a", "b", "c". Not a greenfield skill.'
    assert skill_inventory._first_sentence(description) == "Use to do X."


def test_related_extracts_backticked_names_across_lines():
    body = (
        "## Boundary & Related Skills\n\n"
        "**Owns:** something.\n\n"
        "**Related:** `foo`, `bar`,\n`baz` (aside).\n\n"
        "## Next Section\n"
    )
    assert skill_inventory._related(body) == ["foo", "bar", "baz"]


def test_tolerant_frontmatter_survives_unquoted_colon():
    text = '---\nname: x\ndescription: A: b, C: d\n---\nbody\n'
    fm = skill_inventory._frontmatter(text)
    assert fm["name"] == "x"
    assert "description" in fm


def test_facet_gaps_names_missing_and_unknown_values():
    facets = {"purpose": {"writing": "x"}, "stage": {"any": "y"}}
    bundles = [{"skills": ["a", "ext"], "agents": ["ag"]}]
    skills = {"a": {"facets": {"purpose": "writing"}}}
    agents = {"ag": {"facets": {"purpose": "writing", "stage": "nope"}}}
    assert skill_inventory.facet_gaps(bundles, skills, agents, facets) == [
        "a: missing metadata.stage",
        "ag: metadata.stage 'nope' is not in facets.yaml",
    ]
