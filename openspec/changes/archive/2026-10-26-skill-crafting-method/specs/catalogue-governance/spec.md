## ADDED Requirements

### Requirement: Skill frontmatter follows the Agent Skills specification

Every `skills/<name>/SKILL.md` frontmatter SHALL use only the top-level keys of the agentskills.io
specification (`name`, `description`, `license`, `compatibility`, `metadata`, `allowed-tools`) or a
key on the recorded Claude-only list (`argument-hint`, `disable-model-invocation`), and every
`metadata` value SHALL be a string. A description longer than 1,024 characters SHALL fail
validation. Descriptions longer than 600 characters and `SKILL.md` bodies over 500 lines or about
5,000 tokens SHALL be reported as advisory notes.

#### Scenario: A skill declares a version at the top level

- **WHEN** a skill's frontmatter has `version: 1.2.0` as a top-level key
- **THEN** validation fails and names the key, and `metadata.version` is accepted instead

#### Scenario: A description is too long

- **WHEN** a skill description has 1,025 characters
- **THEN** validation fails for that skill

#### Scenario: A long body is reported

- **WHEN** a `SKILL.md` body has 520 lines
- **THEN** validation passes and the advisory notes list the skill

### Requirement: Authoring guidance has one home

Step-by-step authoring guidance for this repository SHALL live in `spec/CREATING_SKILLS.md` as
Meaningfy deltas plus citations of the adopted methods. `CONTRIBUTING.md` SHALL be a short entry page
that links to that guide and to the Definition of Done. `spec/agent-skills-spec.md` SHALL cite the
agentskills.io specification and carry only skillery's field notes.

#### Scenario: A contributor opens CONTRIBUTING.md

- **WHEN** a contributor reads `CONTRIBUTING.md`
- **THEN** it links to `spec/CREATING_SKILLS.md` and to `docs/development-method.md` §9, and holds no
  authoring steps of its own

#### Scenario: Boundary and related skills are described correctly

- **WHEN** `AGENTS.md` or the Definition of Done describes a skill's boundary and related skills
- **THEN** it names the body section `## Boundary & Related Skills`, not frontmatter keys
