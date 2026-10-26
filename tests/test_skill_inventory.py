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


def test_use_cases_render_groups_by_area_in_facet_order():
    facets = {"area": {"coding": "c", "personal": "p", "legal": "l"}}
    ucs = [
        {"id": "UC-W2", "title": "B", "area": "coding", "status": "partial", "file": "UC-W2-b.md",
         "primary_actor": "dev", "served_by": {"skills": ["x"]}, "change": "add-x"},
        {"id": "UC-W1", "title": "A", "area": "personal", "status": "missing", "file": "UC-W1-a.md",
         "primary_actor": "owner", "served_by": {}},
    ]
    text = skill_inventory.render_use_cases(ucs, facets)
    assert text.index("## coding") < text.index("## personal")
    assert "## legal" not in text  # an area with no use case gets no table
    assert "| [UC-W2](../use-cases/UC-W2-b.md) B | dev | `partial` | `x` | `add-x` |" in text
    assert "| [UC-W1](../use-cases/UC-W1-a.md) A | owner | `missing` | — | — |" in text
    assert "| `coding` | 0 | 1 | 0 |" in text
