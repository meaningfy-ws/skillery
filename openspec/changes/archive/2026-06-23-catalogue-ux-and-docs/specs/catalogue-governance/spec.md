# catalogue-governance

## ADDED Requirements

### Requirement: Skills are organised into role bundles with single ownership

The catalogue SHALL group skills into **role bundles** (`meaningfy-core`, `meaningfy-consulting`,
`meaningfy-architecture`, `meaningfy-building`), and every skill SHALL belong to **exactly one**
bundle. The disk layout SHALL be flat (`skills/<skill>/`); bundle grouping lives only in
`marketplace.json`.

#### Scenario: A skill registered in two bundles is rejected

- **WHEN** the validator runs over `.claude-plugin/marketplace.json`
- **THEN** any skill listed under more than one bundle, or under a bundle that is not its expected
  owner, is reported as a placement error

#### Scenario: A flat skill directory is discovered

- **WHEN** the validator enumerates `skills/`
- **THEN** each `skills/<skill>/SKILL.md` is discovered and keyed by its directory name

### Requirement: External method skills land in the spine

External method skills (`superpowers` brainstorming / writing-plans / executing-plans) SHALL NOT
create a parallel spec/plan tree. In a spine-wired repo their artifacts SHALL land in
`openspec/changes/<id>/`: a brainstorming design feeds the EPIC (`proposal.md`), `writing-plans` is
superseded by the PLAN (`design.md` + `tasks.md`), and execution is tracked via `/opsx:apply`.

#### Scenario: A brainstorming design is shaped as the EPIC

- **WHEN** a contributor uses `superpowers:brainstorming` in a spine repo
- **THEN** the resulting design is authored as the change's `proposal.md`, not as a separate
  `docs/superpowers/specs/` file
