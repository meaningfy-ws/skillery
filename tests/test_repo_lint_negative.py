"""Proves the guardrail BITES: each check must flag a deliberately broken repo.

A check that never fails is worse than no check. We build minimal synthetic
repos in tmp_path and assert each function reports the planted defect.
"""
import json
from pathlib import Path

import pytest
import yaml

from tools.repo_lint import lint


def _skill(root: Path, name: str, frontmatter_name: str | None = "USE_NAME", body: str = "body"):
    d = root / "skills" / name
    d.mkdir(parents=True)
    fm = ""
    if frontmatter_name is not None:
        nm = name if frontmatter_name == "USE_NAME" else frontmatter_name
        fm = f"---\nname: {nm}\ndescription: x\n---\n\n"
    (d / "SKILL.md").write_text(fm + body + "\n", encoding="utf-8")


def _bundles(root: Path, bundles: list[dict]):
    """Write a schema-valid bundles.yaml; each bundle is {name, skills[, agents]}."""
    doc = {"name": "m", "owner": {"name": "o", "email": "o@x"}, "description": "d",
           "bundles": [{"name": b["name"], "description": "d", "skills": b.get("skills", []),
                        "agents": b.get("agents", [])} for b in bundles]}
    (root / "bundles.yaml").write_text(yaml.safe_dump(doc, sort_keys=False), encoding="utf-8")


def _agent(root: Path, name: str, fm: dict | None = None, body: str = "body"):
    """An agents/<name>.md; without `fm`, the minimal name+description frontmatter."""
    (root / "agents").mkdir(exist_ok=True)
    fm = {"name": name, "description": "x"} if fm is None else fm
    (root / "agents" / f"{name}.md").write_text(
        f"---\n{yaml.safe_dump(fm, sort_keys=False, allow_unicode=True)}---\n{body}\n", encoding="utf-8")


def _feature(root: Path, name: str, skills: list[str], outline: bool = True):
    d = root / "tests" / "features" / "agents"
    d.mkdir(parents=True, exist_ok=True)
    named = ", ".join(f"`{s}`" for s in skills)
    scenario = ("Scenario Outline: one run\n    When it runs <x>\n\n    Examples:\n      | x |\n      | 1 |\n"
                if outline else "Scenario: one run\n    When it runs\n")
    (d / f"{name}.feature").write_text(
        f"Feature: {name}\n  Background:\n    Given the {name} agent is installed with skills {named}\n\n"
        f"  {scenario}", encoding="utf-8")


def _agent_map(root: Path):
    (root / "tools").mkdir(exist_ok=True)
    (root / "tools" / "opencode-agent-map.json").write_text(json.dumps({
        "modelAliases": {"opus": "o", "sonnet": "s", "haiku": "h"},
        "agentModes": {"delegated": "subagent", "lead": "primary", "scheduled": "subagent"},
        "toolNames": {}, "toolPermission": {}}), encoding="utf-8")


def test_missing_skill_dir_is_flagged(tmp_path):
    # TC-11: listed in bundles.yaml but the dir is absent.
    _bundles(tmp_path, [{"name": "meaningfy-building", "skills": ["cosmic-python"]}])
    assert any("cosmic-python" in e for e in lint.missing_skill_dirs(tmp_path))


def test_unbundled_skill_is_wip_and_passes(tmp_path):
    # rebundle-by-activity D-14: listed in no bundle = work in progress, allowed on develop.
    _skill(tmp_path, "cosmic-python")
    _bundles(tmp_path, [{"name": "meaningfy-core", "skills": []}])
    assert lint.expected_bundle_membership(tmp_path) == []
    assert lint.wip_isolation(tmp_path) == []


def test_missing_frontmatter_is_flagged(tmp_path):
    _skill(tmp_path, "architecture", frontmatter_name=None, body="# no frontmatter here")
    assert lint.frontmatter_present_errors(tmp_path)


def test_name_mismatch_is_flagged(tmp_path):
    _skill(tmp_path, "cosmic-python", frontmatter_name="wrong-name")
    assert lint.name_mismatch(tmp_path)


def test_skill_in_multiple_bundles_is_flagged(tmp_path):
    # TC-08 single-home invariant: a skill registered in two bundles is an error.
    _skill(tmp_path, "cosmic-python")
    _bundles(tmp_path, [
        {"name": "meaningfy-core", "skills": ["cosmic-python"]},
        {"name": "meaningfy-building", "skills": ["cosmic-python"]},
    ])
    # sibling review finding 7: same "a, b" form (file order) as the agent message
    assert lint.expected_bundle_membership(tmp_path) == [
        "skill 'cosmic-python' is in multiple bundles: meaningfy-core, meaningfy-building"]


def test_released_skill_delegating_to_wip_is_flagged(tmp_path):
    _skill_fm(tmp_path, "a", {"name": "a", "description": "x"},
              body="## Boundary & Related Skills\n\n**Delegates:** drafts → `b`.")
    _skill(tmp_path, "b")
    _bundles(tmp_path, [{"name": "core", "skills": ["a"]}])
    assert lint.wip_isolation(tmp_path) == [
        "skills/a is released but delegates to WIP skill 'b' (in no bundle); release 'b' or drop the hand-off"]


def test_released_agent_loading_wip_skill_is_flagged(tmp_path):
    _skill(tmp_path, "a")
    _skill(tmp_path, "b")
    _agent(tmp_path, "ag", {"name": "ag", "description": "x", "skills": ["a", "b", "ext:thing"]})
    _bundles(tmp_path, [{"name": "core", "skills": ["a"], "agents": ["ag"]}])
    assert lint.wip_isolation(tmp_path) == [
        "agents/ag is released but loads WIP skill 'b' (in no bundle); release 'b' or drop it"]


def test_new_bundle_name_is_not_flagged(tmp_path):
    # TC-12: bundle names are not pinned — a new bundle needs no lint edit.
    _bundles(tmp_path, [{"name": "meaningfy-devops", "skills": []}])
    assert lint.expected_bundle_membership(tmp_path) == []


def test_agent_bundle_membership_messages(tmp_path):
    # TC-10: the three exact messages (design.md D5).
    for a in ("lonely", "twice"):
        _agent(tmp_path, a)
    _bundles(tmp_path, [{"name": "b1", "agents": ["twice", "ghost"]}, {"name": "b2", "agents": ["twice"]}])
    assert sorted(lint.agent_bundle_membership(tmp_path)) == sorted([
        "agent 'twice' is in multiple bundles: b1, b2",
        "bundles.yaml lists agent 'ghost' but agents/ghost.md does not exist",
    ])


def test_agent_in_one_bundle_passes(tmp_path):
    _agent(tmp_path, "solo")
    _bundles(tmp_path, [{"name": "b1", "agents": ["solo"]}])
    assert lint.agent_bundle_membership(tmp_path) == []


def test_broken_link_is_flagged(tmp_path):
    (tmp_path / "doc.md").write_text("see [x](missing-file.md)", encoding="utf-8")
    assert lint.broken_links(tmp_path)


def test_too_long_skill_is_flagged(tmp_path):
    _skill(tmp_path, "cosmic-python", body="\n".join(str(i) for i in range(600)))
    assert lint.skill_too_long(tmp_path, limit=500)


def test_orphan_agent_reference_is_flagged(tmp_path):
    # implementer has no agents/ file here but a doc mentions it -> orphan
    (tmp_path / "guide.md").write_text("ask the implementer to write code", encoding="utf-8")
    assert any("implementer" in e for e in lint.orphan_agent_references(tmp_path))


def test_orphan_path_mention_is_flagged(tmp_path):
    (tmp_path / "guide.md").write_text("see references/MEANINGFY_PROMPT.md", encoding="utf-8")
    assert lint.orphan_path_mentions(tmp_path, ["MEANINGFY_PROMPT.md"])


def test_claude_dir_excluded_from_prose_checks(tmp_path):
    # .claude/ is agent/tool working-state, not the catalogue: content there that
    # would otherwise trip prose checks (orphan agents, broken links) must be ignored.
    claude = tmp_path / ".claude"
    claude.mkdir()
    (claude / "EPIC-x.md").write_text("ask the implementer and code-reviewer", encoding="utf-8")
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


# ---- dual-CLI foundation invariants (DEC-12/13) ----
def test_agents_symlink_is_flagged(tmp_path):
    (tmp_path / "AGENTS.md").write_text("canonical manual\n", encoding="utf-8")
    (tmp_path / "CLAUDE.md").symlink_to("AGENTS.md")  # the forbidden symlink
    assert any("symlink" in e for e in lint.agents_canonical_invariant(tmp_path))


def test_claude_not_pointing_to_agents_is_flagged(tmp_path):
    (tmp_path / "AGENTS.md").write_text("canonical\n", encoding="utf-8")
    (tmp_path / "CLAUDE.md").write_text("# unrelated, no pointer\n", encoding="utf-8")
    assert any("point to AGENTS" in e for e in lint.agents_canonical_invariant(tmp_path))


def test_claude_gitnexus_block_is_flagged(tmp_path):
    # TC-26: the GitNexus block lives in AGENTS.md only (D14).
    (tmp_path / "AGENTS.md").write_text("canonical\n", encoding="utf-8")
    (tmp_path / "CLAUDE.md").write_text("Read AGENTS.md.\n<!-- gitnexus:start -->\nx\n", encoding="utf-8")
    assert "CLAUDE.md contains a gitnexus block (it lives in AGENTS.md only)" in \
        lint.agents_canonical_invariant(tmp_path)


def test_agents_canonical_clean_passes(tmp_path):
    (tmp_path / "AGENTS.md").write_text("canonical\n", encoding="utf-8")
    (tmp_path / "CLAUDE.md").write_text("Read AGENTS.md first.\n", encoding="utf-8")
    assert lint.agents_canonical_invariant(tmp_path) == []


def test_hooks_inventory_bad_mechanism_is_flagged(tmp_path):
    (tmp_path / "VERSION").write_text("9.9.9\n", encoding="utf-8")
    (tmp_path / "hooks.yaml").write_text(
        'version: "9.9.9"\nhooks:\n'
        "  - id: h1\n    intent: x\n    provenance: {skill: s}\n"
        "    bindings: [{mechanism: nope, phase: quality}]\n", encoding="utf-8")
    assert any("bad mechanism" in e for e in lint.hooks_inventory_shape(tmp_path))


def test_hooks_inventory_version_mismatch_is_flagged(tmp_path):
    (tmp_path / "VERSION").write_text("1.0.0\n", encoding="utf-8")
    (tmp_path / "hooks.yaml").write_text(
        'version: "2.0.0"\nhooks:\n'
        "  - id: h1\n    intent: x\n    provenance: {skill: s}\n"
        "    bindings: [{mechanism: git, phase: quality}]\n", encoding="utf-8")
    assert any("!= VERSION" in e for e in lint.hooks_inventory_shape(tmp_path))


def test_body_agnosticism_new_claude_ism_is_flagged(tmp_path):
    _skill(tmp_path, "cosmic-python", body="Run /opsx:apply then edit .claude/settings.json")
    assert lint.body_agnosticism(tmp_path)  # not in the allowlist → flagged


def test_body_agnosticism_allowlisted_skill_passes(tmp_path):
    _skill(tmp_path, "epic-planning", body="Shape via /opsx:propose")  # allowlisted
    assert lint.body_agnosticism(tmp_path) == []


def test_clean_fixture_passes_all(tmp_path):
    _skill(tmp_path, "cosmic-python")
    _skill(tmp_path, "project-setup")
    _bundles(tmp_path, [{"name": "meaningfy-building", "skills": ["cosmic-python", "project-setup"]}])
    assert lint.missing_skill_dirs(tmp_path) == []
    assert lint.frontmatter_present_errors(tmp_path) == []
    assert lint.expected_bundle_membership(tmp_path) == []
    assert lint.broken_links(tmp_path) == []


def test_link_target_with_parentheses_resolves(tmp_path):
    # A filename containing parentheses, linked percent-encoded (as editors emit it)
    # and with unencoded parentheses, must resolve rather than be cut at the first ')'.
    inputs = tmp_path / "inputs"
    inputs.mkdir()
    (inputs / "Handbook (2026) (1).pdf").write_text("x", encoding="utf-8")
    (tmp_path / "doc.md").write_text(
        "see [a](inputs/Handbook%20(2026)%20(1).pdf) and [b](inputs/Handbook%20%282026%29%20%281%29.pdf)",
        encoding="utf-8",
    )
    assert lint.broken_links(tmp_path) == []


def test_link_with_parentheses_to_missing_file_is_flagged(tmp_path):
    (tmp_path / "doc.md").write_text("see [a](inputs/Missing%20(2026).pdf)", encoding="utf-8")
    assert lint.broken_links(tmp_path)


# ---- strict-YAML frontmatter (single-source-distribution D5/D18, TC-11b) ----
def test_frontmatter_strict_yaml_flags_unquoted_colon(tmp_path):
    d = tmp_path / "skills" / "x"
    d.mkdir(parents=True)
    (d / "SKILL.md").write_text("---\nname: x\ndescription: Use for: x\n---\nbody\n", encoding="utf-8")
    (tmp_path / "agents").mkdir()
    (tmp_path / "agents" / "a.md").write_text("---\nname: a\ndescription: Use for: x\n---\nbody\n",
                                              encoding="utf-8")
    out = lint.frontmatter_strict_yaml(tmp_path)
    assert len(out) == 2
    assert any(e.startswith("skills/x/SKILL.md: frontmatter is not strict YAML (") for e in out)
    assert any(e.startswith("agents/a.md: frontmatter is not strict YAML (") for e in out)


def test_frontmatter_strict_yaml_quoted_passes(tmp_path):
    d = tmp_path / "skills" / "x"
    d.mkdir(parents=True)
    (d / "SKILL.md").write_text('---\nname: x\ndescription: "Use for: x"\n---\nbody\n', encoding="utf-8")
    assert lint.frontmatter_strict_yaml(tmp_path) == []


def test_invalid_bundles_yaml_is_reported_once(tmp_path):
    # Review finding 4: an invalid bundles.yaml is one bundle_gates error, not a flood.
    _skill(tmp_path, "cosmic-python")
    _agent(tmp_path, "solo")
    (tmp_path / "bundles.yaml").write_text("bundles: {not: a list}\n", encoding="utf-8")
    assert lint.missing_skill_dirs(tmp_path) == []
    assert lint.expected_bundle_membership(tmp_path) == []
    assert lint.agent_bundle_membership(tmp_path) == []
    assert len(lint.bundle_gates(tmp_path)) == 1


# ------------------------------------------------ agent_conformance (agent-authoring-standard)
_GOOD_BODY = """You are the **X**. You do one job.

## Skills
- `cosmic-python` — followed for structure.

## Dispatch contract
- **Input:** a task.
- **Output:** a report.
- **Side effects:** none on files.
- **Refuses:** committing."""


def _good_fm(name: str = "x") -> dict:
    return {"name": name, "description": "Does one job. Use when a job is ready.", "type": "delegated",
            "model": "opus", "tools": ["Read", "Grep"], "skills": ["cosmic-python"]}


def _conforming(root: Path, fm_changes: dict | None = None, drop: tuple[str, ...] = (),
                body: str = _GOOD_BODY, feature: bool = True) -> list[str]:
    """A conforming agent `x` with one planted defect; returns agent_conformance(root)."""
    _agent_map(root)
    fm = {**_good_fm(), **(fm_changes or {})}
    for k in drop:
        fm.pop(k)
    _agent(root, "x", fm, body)
    if feature:
        _feature(root, "x", ["cosmic-python"])
    return lint.agent_conformance(root)


def test_agent_missing_field_is_flagged(tmp_path):
    assert _conforming(tmp_path, drop=("type",)) == ["agents/x.md: missing required frontmatter field 'type'"]


def test_agent_bundle_field_is_flagged(tmp_path):
    assert _conforming(tmp_path, {"bundle": "meaningfy-building"}) == [
        "agents/x.md: frontmatter field 'bundle' is not in the agent contract (docs/development/agent-template.md)"]


def test_agent_name_mismatch_is_flagged(tmp_path):
    assert _conforming(tmp_path, {"name": "y"}) == ["agents/x.md: name 'y' does not match the filename"]


def test_agent_bad_type_is_flagged(tmp_path):
    assert _conforming(tmp_path, {"type": "worker"}) == [
        "agents/x.md: type 'worker' is not one of delegated, lead, scheduled"]


def test_agent_tools_string_is_flagged(tmp_path):
    assert _conforming(tmp_path, {"tools": "Read, Grep"}) == ["agents/x.md: 'tools' must be a YAML list"]


def test_agent_bad_color_is_flagged(tmp_path):
    assert _conforming(tmp_path, {"color": "magenta"}) == [
        "agents/x.md: color 'magenta' is not a Claude agent colour"]


def test_agent_description_without_use_when_is_flagged(tmp_path):
    assert _conforming(tmp_path, {"description": "Does one job."}) == [
        "agents/x.md: description must say when to use the agent ('Use when …')"]


def test_agent_description_example_block_is_flagged(tmp_path):
    assert _conforming(tmp_path, {"description": "Does it. Use when ready. <example>hi</example>"}) == [
        "agents/x.md: description carries <example> blocks; examples belong in "
        "tests/features/agents/x.feature"]


def test_lead_without_not_for_delegation_is_flagged(tmp_path):
    assert _conforming(tmp_path, {"type": "lead"}) == [
        "agents/x.md: a lead agent's description must say 'Not for delegation'"]
    desc = "Leads. Use when starting. Not for delegation."
    assert _conforming(tmp_path, {"type": "scheduled", "description": desc}) == []


def test_agent_body_over_cap_is_flagged(tmp_path):
    cap = lint.MAX_AGENT_BODY_LINES
    filler = _GOOD_BODY.count("\n") + 1
    at_cap = "\n\n" + _GOOD_BODY + "\n" + "\n".join(["pad"] * (cap - filler)) + "\n\n"
    assert _conforming(tmp_path, body=at_cap) == []  # leading/trailing blank lines are not counted
    assert _conforming(tmp_path, body=at_cap.rstrip("\n") + "\npad") == [
        f"agents/x.md: body is {cap + 1} lines (> {cap})"]


def test_agent_without_dispatch_contract_is_flagged(tmp_path):
    body = _GOOD_BODY.replace("## Dispatch contract", "## Contract")
    assert _conforming(tmp_path, body=body) == ["agents/x.md: no '## Dispatch contract' section"]


def test_agent_contract_missing_refuses_is_flagged(tmp_path):
    # the label outside the section does not count
    body = _GOOD_BODY.replace("- **Refuses:** committing.", "") + "\n\n## Glue\n- **Refuses:** x"
    assert _conforming(tmp_path, body=body) == ["agents/x.md: dispatch contract has no '**Refuses:**'"]


def test_agent_body_cli_ism_is_flagged(tmp_path):
    assert _conforming(tmp_path, body=_GOOD_BODY + "\nWrite .claude/memory/x.md") == [
        "agents/x.md: body has a CLI-specific (/opsx: or .claude/) reference"]


def test_agent_without_feature_is_flagged(tmp_path):
    assert _conforming(tmp_path, feature=False) == ["agents/x.md: no tests/features/agents/x.feature"]


def test_agent_feature_without_outline_is_flagged(tmp_path):
    _agent_map(tmp_path)
    _agent(tmp_path, "x", _good_fm(), _GOOD_BODY)
    _feature(tmp_path, "x", ["cosmic-python"], outline=False)
    assert lint.agent_conformance(tmp_path) == [
        "tests/features/agents/x.feature has no Scenario Outline with Examples"]


def test_agent_feature_missing_skill_is_flagged(tmp_path):
    # TC-06: a skill whose name is a prefix of a named one does not count (backtick-delimited)
    _agent_map(tmp_path)
    _agent(tmp_path, "x", {**_good_fm(), "skills": ["cosmic-python", "clarity-gate"]}, _GOOD_BODY)
    _feature(tmp_path, "x", ["cosmic-python", "clarity-gate-lite"])
    assert lint.agent_conformance(tmp_path) == [
        "tests/features/agents/x.feature Background does not name skill 'clarity-gate'"]


def test_agent_primary_skill_in_other_bundle_is_flagged(tmp_path):
    # TC-07: the namespaced first skill is skipped; the primary skill is meaningfy-code-review
    _agent_map(tmp_path)
    _agent(tmp_path, "code-reviewer", {**_good_fm("code-reviewer"),
                                       "skills": ["superpowers:x", "meaningfy-code-review"]})
    _bundles(tmp_path, [{"name": "b1", "skills": ["cosmic-python"], "agents": ["code-reviewer"]},
                        {"name": "b2", "skills": ["meaningfy-code-review"]}])
    assert lint.agent_bundle_membership(tmp_path) == [
        "agent 'code-reviewer' is in bundle 'b1' but its primary skill 'meaningfy-code-review' is not"]


def test_agent_without_local_skill_is_flagged(tmp_path):
    _agent_map(tmp_path)
    _agent(tmp_path, "x", {**_good_fm(), "skills": ["stream-coding", "superpowers:x"]})
    _bundles(tmp_path, [{"name": "b1", "agents": ["x"]}])
    assert lint.agent_bundle_membership(tmp_path) == ["agent 'x' has no local primary skill"]


# ------------------------------------------------ review-implementation fixes (F-2…F-4)
def test_agent_non_string_type_and_color_are_flagged_not_crashing(tmp_path):
    # F-2: a list where a scalar belongs is a message, not a TypeError
    assert _conforming(tmp_path, {"type": ["delegated"], "color": ["yellow"]}) == [
        "agents/x.md: type '['delegated']' is not one of delegated, lead, scheduled",
        "agents/x.md: color '['yellow']' is not a Claude agent colour"]


def test_agent_map_without_agent_modes_is_reported_once(tmp_path):
    # F-3: error-matrix row — one message, M4 skipped
    _conforming(tmp_path)
    (tmp_path / "tools" / "opencode-agent-map.json").write_text(
        json.dumps({"modelAliases": {"opus": "o"}}), encoding="utf-8")
    assert lint.agent_conformance(tmp_path) == ["tools/opencode-agent-map.json has no 'agentModes'"]


def test_agent_unparsable_frontmatter_is_reported(tmp_path):
    # F-3: error-matrix row — the file is reported and skipped
    _agent_map(tmp_path)
    (tmp_path / "agents").mkdir()
    (tmp_path / "agents" / "x.md").write_text("---\nname: [unclosed\n---\nbody\n", encoding="utf-8")
    errs = lint.agent_conformance(tmp_path)
    assert len(errs) == 1 and errs[0].startswith("agents/x.md: frontmatter is rejected (")


def test_agent_pinned_model_is_left_to_bundle_gates(tmp_path):
    # F-3: the alias check is the sibling's (bundle_gen.agent_frontmatter via bundle_gates); not twice
    assert _conforming(tmp_path, {"model": "claude-opus-4-8"}) == []


def test_agent_fenced_heading_does_not_end_the_contract(tmp_path):
    # F-4: a `## ` line inside a fenced block is not a section boundary
    body = _GOOD_BODY.replace("- **Output:**", "```\n## not a heading\n```\n- **Output:**")
    assert _conforming(tmp_path, body=body) == []


def test_agent_contract_labels_out_of_order_are_flagged(tmp_path):
    # F-4: the template's "in this order" is checked
    body = _GOOD_BODY.replace("- **Input:** a task.\n- **Output:** a report.",
                              "- **Output:** a report.\n- **Input:** a task.")
    assert _conforming(tmp_path, body=body) == [
        "agents/x.md: dispatch contract labels are not in the order Input, Output, Side effects, Refuses"]


def test_agent_use_when_needs_word_boundaries(tmp_path):
    # F-4: "because when" is not "use when"
    assert _conforming(tmp_path, {"description": "Does it because whenever asked."}) == [
        "agents/x.md: description must say when to use the agent ('Use when …')"]


def test_agent_feature_skill_named_outside_background_is_flagged(tmp_path):
    # F-4: only the Background's installed-with-skills line counts
    _conforming(tmp_path)
    f = tmp_path / "tests" / "features" / "agents" / "x.feature"
    text = f.read_text(encoding="utf-8").replace("`cosmic-python`", "`other`")
    f.write_text(text + "\n  Scenario: aside\n    Given installed with skills `cosmic-python`\n", encoding="utf-8")
    assert lint.agent_conformance(tmp_path) == [
        "tests/features/agents/x.feature Background does not name skill 'cosmic-python'"]


def _skill_fm(root: Path, name: str, fm: dict, body: str = "## Boundary & Related Skills\n\nx"):
    d = root / "skills" / name
    d.mkdir(parents=True)
    (d / "SKILL.md").write_text(f"---\n{yaml.safe_dump(fm, sort_keys=False)}---\n\n{body}\n", encoding="utf-8")


def test_top_level_version_is_rejected(tmp_path):
    _skill_fm(tmp_path, "s", {"name": "s", "description": "x", "version": "1.0.0"})
    assert any("'version'" in e for e in lint.frontmatter_keys(tmp_path))


def test_non_string_metadata_is_rejected(tmp_path):
    _skill_fm(tmp_path, "s", {"name": "s", "description": "x", "metadata": {"version": 1}})
    assert any("string values" in e for e in lint.frontmatter_keys(tmp_path))


def test_claude_only_and_metadata_version_pass(tmp_path):
    _skill_fm(tmp_path, "s", {"name": "s", "description": "x", "argument-hint": "<x>",
                              "disable-model-invocation": True, "metadata": {"version": "1.0.0"}})
    assert lint.frontmatter_keys(tmp_path) == []


def test_description_over_1024_is_rejected(tmp_path):
    _skill_fm(tmp_path, "s", {"name": "s", "description": "x" * 1025})
    assert lint.description_too_long(tmp_path) and lint.description_too_long(tmp_path, 1025) == []


def test_method_checks_run_on_a_minimal_tree(tmp_path):
    # skill-crafting-method H-6: the method checks hold in any repo with only skills/.
    assert all(c in lint.ALL_CHECKS for c in lint.METHOD_CHECKS)
    _skill_fm(tmp_path, "foo", {"name": "foo", "description": "Use this skill when testing."})
    assert [e for c in lint.METHOD_CHECKS for e in c(tmp_path)] == []


# --------------------------------------------------- catalogue model (define-catalogue-model)
_VOCAB = {"facets": {"purpose": {"writing": "x"}, "posture": {"reusable": "x", "precise": "x"}}}


def _facets_repo(tmp_path, skill_meta, agent_meta=None):
    (tmp_path / "facets.yaml").write_text(yaml.safe_dump(_VOCAB), encoding="utf-8")
    _skill_fm(tmp_path, "s", {"name": "s", "description": "x", "metadata": skill_meta})
    if agent_meta is not None:
        _agent(tmp_path, "a", {"name": "a", "description": "x", "metadata": agent_meta})


def test_missing_facet_is_flagged(tmp_path):
    _facets_repo(tmp_path, {"purpose": "writing"})
    assert any("metadata.posture" in e for e in lint.facets_declared(tmp_path))


def test_list_facet_value_is_flagged(tmp_path):
    _facets_repo(tmp_path, {"purpose": ["writing"], "posture": "reusable"})
    assert any("'purpose'" in e for e in lint.facets_declared(tmp_path))


def test_unknown_facet_value_is_flagged(tmp_path):
    _facets_repo(tmp_path, {"purpose": "selling", "posture": "reusable"})
    assert any("allowed: writing" in e for e in lint.facets_declared(tmp_path))


def test_agent_without_facets_is_flagged(tmp_path):
    _facets_repo(tmp_path, {"purpose": "writing", "posture": "reusable"}, agent_meta={})
    errs = lint.facets_declared(tmp_path)
    assert errs and all(e.startswith("agents/a") for e in errs)


def _req_repo(tmp_path, bundles, delegations):
    """bundles: {name: (skills, requires)}; delegations: {skill: [delegated skills]}."""
    doc = {"name": "m", "owner": {"name": "o", "email": "o@x"}, "description": "d", "bundles": []}
    for name, (skills, req) in bundles.items():
        b = {"name": name, "description": "d", "skills": skills, "agents": []}
        if req:
            b["requires"] = req
        doc["bundles"].append(b)
        for s in skills:
            dels = " ".join(f"`{d}`" for d in delegations.get(s, []))
            _skill_fm(tmp_path, s, {"name": s, "description": "x"},
                      body=f"## Boundary & Related Skills\n\n**Delegates:** {dels or 'nothing'}.\n")
    (tmp_path / "bundles.yaml").write_text(yaml.safe_dump(doc), encoding="utf-8")


def test_undeclared_cross_bundle_edge_is_flagged(tmp_path):
    _req_repo(tmp_path, {"meaningfy-core": (["c"], []), "cons": (["e"], []), "build": (["p"], [])},
              {"e": ["p"]})
    assert any("does not require 'build'" in e for e in lint.bundle_requirements(tmp_path))


def test_declared_edge_passes(tmp_path):
    _req_repo(tmp_path, {"meaningfy-core": (["c"], []), "cons": (["e"], ["build"]), "build": (["p"], [])},
              {"e": ["p"], "p": ["c"]})
    assert lint.bundle_requirements(tmp_path) == []


def test_requirement_cycle_is_flagged(tmp_path):
    _req_repo(tmp_path, {"meaningfy-core": (["c"], []), "a": (["x"], ["b"]), "b": (["y"], ["a"])}, {})
    assert any("cycle" in e for e in lint.bundle_requirements(tmp_path))


def test_core_requiring_a_bundle_is_flagged(tmp_path):
    _req_repo(tmp_path, {"meaningfy-core": (["c"], ["b"]), "b": (["y"], [])}, {})
    assert any("must require nothing" in e for e in lint.bundle_requirements(tmp_path))


def test_core_skill_delegating_outward_is_flagged(tmp_path):
    _req_repo(tmp_path, {"meaningfy-core": (["c"], []), "b": (["y"], [])}, {"c": ["y"]})
    assert any("requires nothing" in e for e in lint.bundle_requirements(tmp_path))


def test_unknown_required_bundle_is_flagged(tmp_path):
    _req_repo(tmp_path, {"meaningfy-core": (["c"], []), "b": (["y"], ["ghost"])}, {})
    assert any("unknown bundle 'ghost'" in e for e in lint.bundle_requirements(tmp_path))


def _register(tmp_path, rows):
    (tmp_path / "docs" / "development").mkdir(parents=True, exist_ok=True)
    table = "\n".join(f"| `{r}` | hand-written | t | — |" for r in rows)
    (tmp_path / "docs" / "development" / "README.md").write_text(
        f"# M\n\n## 8. Where things live\n\n| View | Kind | Source or topic | Rendered by |\n|---|---|---|---|\n{table}\n\n## 9. Done\n",
        encoding="utf-8")


def test_unregistered_doc_is_flagged(tmp_path):
    _register(tmp_path, ["docs/development/README.md"])
    (tmp_path / "docs" / "new-guide.md").write_text("x", encoding="utf-8")
    assert lint.doc_register_complete(tmp_path) == ["docs/new-guide.md: not in the documentation register (docs/development/README.md §8)"]


def test_folder_prefix_covers_nested_docs(tmp_path):
    _register(tmp_path, ["docs/development/README.md", "docs/ai-sales/**"])
    (tmp_path / "docs" / "ai-sales" / "x").mkdir(parents=True)
    (tmp_path / "docs" / "ai-sales" / "x" / "y.md").write_text("x", encoding="utf-8")
    assert lint.doc_register_complete(tmp_path) == []


# ------------------------------------------- use-case catalogue (restructure-and-evaluate D-14)
_UC = {"id": "UC-W1", "title": "Vault work", "primary_actor": "the owner", "trigger": "t",
       "success_guarantee": "g", "area": "personal", "served_by": {"agents": [], "skills": ["s"]},
       "status": "covered"}


def _uc_repo(tmp_path, fm, name="UC-W1-vault-work.md", body="## Brief Description\n\nx"):
    (tmp_path / "facets.yaml").write_text(
        yaml.safe_dump({"facets": {"area": {"personal": "x"}}}), encoding="utf-8")
    if not (tmp_path / "skills" / "s").exists():
        _skill_fm(tmp_path, "s", {"name": "s", "description": "x"})
    (tmp_path / "use-cases").mkdir(exist_ok=True)
    (tmp_path / "use-cases" / name).write_text(
        f"---\n{yaml.safe_dump(fm, sort_keys=False)}---\n\n{body}\n", encoding="utf-8")


def test_valid_use_case_passes(tmp_path):
    _uc_repo(tmp_path, _UC)
    assert lint.use_case_catalogue(tmp_path) == []


def test_use_case_unknown_area_is_flagged(tmp_path):
    _uc_repo(tmp_path, {**_UC, "area": "selling"})
    assert any("area 'selling'" in e for e in lint.use_case_catalogue(tmp_path))


def test_use_case_missing_field_is_flagged(tmp_path):
    fm = {k: v for k, v in _UC.items() if k != "success_guarantee"}
    _uc_repo(tmp_path, fm)
    assert any("success_guarantee" in e for e in lint.use_case_catalogue(tmp_path))


def test_use_case_id_must_match_file_name(tmp_path):
    _uc_repo(tmp_path, _UC, name="UC-W2-vault-work.md")
    assert any("does not match" in e for e in lint.use_case_catalogue(tmp_path))


def test_use_case_duplicate_id_is_flagged(tmp_path):
    _uc_repo(tmp_path, _UC)
    _uc_repo(tmp_path, _UC, name="UC-W1-other.md")
    assert any("duplicate id" in e for e in lint.use_case_catalogue(tmp_path))


def test_use_case_unknown_served_by_name_is_flagged(tmp_path):
    _uc_repo(tmp_path, {**_UC, "served_by": {"agents": ["ghost"], "skills": ["nope"]}})
    errs = lint.use_case_catalogue(tmp_path)
    assert any("agent 'ghost'" in e for e in errs) and any("skill 'nope'" in e for e in errs)


def test_use_case_bad_status_is_flagged(tmp_path):
    _uc_repo(tmp_path, {**_UC, "status": "done"})
    assert any("status 'done'" in e for e in lint.use_case_catalogue(tmp_path))


def test_use_case_body_needs_brief_and_no_lifted_sections(tmp_path):
    _uc_repo(tmp_path, _UC, body="## Trigger\n\nx")
    errs = lint.use_case_catalogue(tmp_path)
    assert any("Brief Description" in e for e in errs) and any("'Trigger'" in e for e in errs)


# -------------------------------------------------- use-case coverage (rebundle-by-activity D-2)
def test_skill_serving_no_use_case_is_flagged(tmp_path):
    _uc_repo(tmp_path, _UC)
    _skill_fm(tmp_path, "orphan", {"name": "orphan", "description": "x"})
    assert lint.use_case_coverage(tmp_path) == [
        "skills/orphan: serves no use case (add it to a use case's served_by)"]


def test_agent_serving_no_use_case_is_flagged(tmp_path):
    _uc_repo(tmp_path, _UC)
    (tmp_path / "agents").mkdir()
    (tmp_path / "agents" / "lonely.md").write_text("x", encoding="utf-8")
    assert lint.use_case_coverage(tmp_path) == [
        "agents/lonely: serves no use case (add it to a use case's served_by)"]


def test_coverage_is_silent_without_use_cases(tmp_path):
    _skill_fm(tmp_path, "orphan", {"name": "orphan", "description": "x"})
    assert lint.use_case_coverage(tmp_path) == []


# --------------------------------------- use-case changes on the register (rebundle-by-activity D-12)
def _features(tmp_path, text="| Visual design | UC-W1 | `add-visual-design` |"):
    (tmp_path / "docs").mkdir(exist_ok=True)
    (tmp_path / "docs" / "future-features.md").write_text(text, encoding="utf-8")


def test_missing_use_case_with_unregistered_change_is_flagged(tmp_path):
    _uc_repo(tmp_path, {**_UC, "status": "missing", "change": "add-ghost"})
    _features(tmp_path)
    assert lint.use_case_changes_registered(tmp_path) == [
        "use-cases/UC-W1-vault-work.md: change 'add-ghost' is not in docs/future-features.md"]


def test_partial_use_case_without_change_is_flagged(tmp_path):
    _uc_repo(tmp_path, {**_UC, "status": "partial"})
    _features(tmp_path)
    assert lint.use_case_changes_registered(tmp_path) == [
        "use-cases/UC-W1-vault-work.md: status 'partial' needs a change listed in docs/future-features.md"]


def test_registered_change_and_covered_use_case_pass(tmp_path):
    _uc_repo(tmp_path, {**_UC, "status": "missing", "change": "add-visual-design"})
    _uc_repo(tmp_path, {**_UC, "id": "UC-W2"}, name="UC-W2-covered.md")
    _features(tmp_path)
    assert lint.use_case_changes_registered(tmp_path) == []


def test_changes_check_is_silent_without_the_register(tmp_path):
    _uc_repo(tmp_path, {**_UC, "status": "missing"})
    assert lint.use_case_changes_registered(tmp_path) == []


# ------------------------------------------------ foundation skills (restructure-and-evaluate D-15)
def test_link_into_another_skill_is_flagged(tmp_path):
    _skill_fm(tmp_path, "b", {"name": "b", "description": "x"})
    (tmp_path / "skills" / "b" / "references").mkdir()
    (tmp_path / "skills" / "b" / "references" / "r.md").write_text("x", encoding="utf-8")
    _skill_fm(tmp_path, "a", {"name": "a", "description": "x"},
              body="See [r](../b/references/r.md#top).")
    errs = lint.cross_skill_paths(tmp_path)
    assert len(errs) == 1 and "skills/a/SKILL.md" in errs[0] and "'b'" in errs[0]


def test_link_inside_own_skill_and_web_links_pass(tmp_path):
    _skill_fm(tmp_path, "a", {"name": "a", "description": "x"},
              body="[r](references/r.md) [w](https://x.org/skills/b/r.md)")
    assert lint.cross_skill_paths(tmp_path) == []


def test_link_out_of_the_skill_folder_is_flagged(tmp_path):
    # An installed skill has only its own folder (rebundle-by-activity D-13).
    _skill_fm(tmp_path, "a", {"name": "a", "description": "x"}, body="[m](../../docs/m.md)")
    assert lint.cross_skill_paths(tmp_path) == [
        "skills/a/SKILL.md: links outside its skill folder (../../docs/m.md); "
        "state the fact or name the owning skill"]


# --------------------------------------------- top-level folders (rebundle-by-activity D-13)
def test_unknown_top_level_folder_is_flagged(tmp_path):
    for d in ("skills", "docs", "spine", ".venv", "bundles"):
        (tmp_path / d).mkdir()
    assert lint.top_level_folders(tmp_path) == [
        "spine/: not an allowed top-level folder (allowed: skills, agents, use-cases, openspec, docs, "
        "tools, tests, .github, .claude-plugin)"]


# ------------------------------------------ external dependency register (rebundle-by-activity D-7)
_DEP = {"name": "obsidian-skills", "kind": "plugin", "source": "kepano/obsidian-skills",
        "pin": "unpinned: marketplace head", "provenance": "MIT, not reviewed", "used_by": "vault-*",
        "opencode_status": "unverified (plain SKILL.md files)", "claude_install": "x",
        "opencode_install": "y"}


def _deps(tmp_path, *entries):
    (tmp_path / "dependencies.yaml").write_text(yaml.safe_dump(list(entries)), encoding="utf-8")
    return lint.dependencies_register(tmp_path)


def test_valid_dependency_passes(tmp_path):
    assert _deps(tmp_path, _DEP) == []


def test_dependency_unknown_kind_is_flagged(tmp_path):
    errs = _deps(tmp_path, {**_DEP, "kind": "library"})
    assert errs and errs[0].startswith("dependencies.yaml: 'obsidian-skills' kind 'library'; allowed: ")


def test_dependency_missing_pin_is_flagged(tmp_path):
    assert _deps(tmp_path, {k: v for k, v in _DEP.items() if k != "pin"}) == [
        "dependencies.yaml: 'obsidian-skills' missing 'pin'"]


def test_dependency_status_without_keyword_is_flagged(tmp_path):
    assert _deps(tmp_path, {**_DEP, "opencode_status": "maybe"}) == [
        "dependencies.yaml: 'obsidian-skills' opencode_status must start with native, claude-compat,"
        " unsupported or unverified"]


def test_dependency_unknown_key_is_flagged(tmp_path):
    assert _deps(tmp_path, {**_DEP, "licence": "MIT"}) == [
        "dependencies.yaml: 'obsidian-skills' unknown key 'licence'"]


def test_register_check_is_silent_without_the_file(tmp_path):
    assert lint.dependencies_register(tmp_path) == []
