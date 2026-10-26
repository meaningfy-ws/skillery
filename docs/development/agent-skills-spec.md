# Agent Skills Specification — skillery field notes

The skill format is the [Agent Skills specification](https://agentskills.io/specification) (read
2026-10-26): the `SKILL.md` frontmatter fields, the `name` and `description` rules and limits, the
optional `scripts/`, `references/` and `assets/` directories, and progressive disclosure. Follow it
as written; this page does not restate it. How to write a skill in this repository is in
[`CREATING_SKILLS.md`](creating-skills.md).

## How skillery uses the format

- **`metadata` is a map of string to string.** A number or a list as a value fails validation; quote
  it.
- **`metadata` carries the six catalogue facets**, one value each from
  [`facets.yaml`](../../facets.yaml); see [`CREATING_SKILLS.md`](creating-skills.md#facets-and-requirements).
- **No top-level `version`.** Use `metadata.version` (a string) if a skill needs one. The catalogue's
  own version is the root [`VERSION`](../../VERSION) file.
- **Claude-only keys.** `argument-hint` and `disable-model-invocation` are allowed although the
  specification does not define them; they are Claude Code features. The list lives once, in
  `tools/repo_lint/lint.py` as `CLAUDE_ONLY_SKILL_KEYS`, because the validator reads it. Any other
  top-level key outside the specification fails validation.
- **Strict YAML.** Quote a `description` that contains `: `.
- **`## Boundary & Related Skills`** is a required body section, not a frontmatter key (see
  [`skill-template.md`](skill-template.md)).

How each field maps onto opencode is in
[`docs/environment/dual-cli/mapping.md`](../environment/dual-cli/mapping.md).
