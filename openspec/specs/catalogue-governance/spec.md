# catalogue-governance Specification

## Purpose

Govern how the catalogue is organised: skills grouped into role bundles, plus one workflow bundle,
with single ownership, a
flat skill layout, and external method skills (superpowers) landing in the spine rather than a
parallel spec tree. The durable rules the validator and contributors hold the catalogue to.
## Requirements
### Requirement: Skills are organised into role bundles with single ownership

The catalogue SHALL group skills and agents into **bundles** declared in `bundles.yaml`: the role
bundles (today `meaningfy-core`, `meaningfy-consulting`, `meaningfy-architecture`,
`meaningfy-building`) and the workflow bundle (`vault-assistant`), which only people who keep a
personal vault install. Every skill SHALL belong to **exactly one** bundle and every agent SHALL
belong to **exactly one** bundle. The disk layout SHALL be flat (`skills/<skill>/`,
`agents/<agent>.md`); bundle grouping lives only in `bundles.yaml`, and the set of valid bundle
names is whatever `bundles.yaml` declares — the validator SHALL NOT pin a second list of names.

#### Scenario: A skill registered in two bundles is rejected

- **WHEN** the validator runs over `bundles.yaml`
- **THEN** any skill listed under more than one bundle is reported as a placement error

#### Scenario: An agent outside exactly one bundle is rejected

- **WHEN** the validator runs over `bundles.yaml` and `agents/`
- **THEN** an agent listed in no bundle, in two bundles, or listed without an `agents/<agent>.md` file is reported as a placement error

#### Scenario: A flat skill directory is discovered

- **WHEN** the validator enumerates `skills/`
- **THEN** each `skills/<skill>/SKILL.md` is discovered and keyed by its directory name

#### Scenario: A new bundle needs no validator change

- **WHEN** a change adds a bundle entry (e.g. `meaningfy-devops`) to `bundles.yaml`
- **THEN** the validator accepts the bundle name and checks its skills and agents like any other bundle's, with no edit to validator code

### Requirement: External method skills land in the spine

External method skills (`superpowers` brainstorming / writing-plans / executing-plans) SHALL NOT
create a parallel spec/plan tree. In a spine-wired repo their artifacts SHALL land in
`openspec/changes/<id>/`: a brainstorming design feeds the EPIC (`proposal.md`), `writing-plans` is
superseded by the PLAN (`design.md` + `tasks.md`), and execution is tracked via `/opsx:apply`.

#### Scenario: A brainstorming design is shaped as the EPIC

- **WHEN** a contributor uses `superpowers:brainstorming` in a spine repo
- **THEN** the resulting design is authored as the change's `proposal.md`, not as a separate
  `docs/superpowers/specs/` file

### Requirement: The repo work loop and the done-checklist are normative
The root `AGENTS.md` SHALL mandate the repo work loop — the change path (EPIC under `openspec/changes/` for a new, renamed, re-bounded or retired skill or agent; a direct PR from a feature branch for a change that moves no boundary), the branch flow (feature branch off `develop`, PR into `develop`), and the Definition of Done — and SHALL route to their substance rather than restate it. The Definition of Done SHALL exist as exactly one checklist, in `docs/development-method.md` §9; `CONTRIBUTING.md` SHALL link to it and SHALL NOT carry a second checklist.

#### Scenario: One checklist
- **WHEN** a contributor looks for what "done" means for a skill or agent change
- **THEN** `AGENTS.md` and `CONTRIBUTING.md` both route to `docs/development-method.md` §9, and no other file carries a done or submission checklist for changes to this repository's skills and agents (`docs/ai-coding/` defines the product-project Definition of Done and is out of scope)

#### Scenario: The checklist matches the tooling
- **WHEN** the Definition of Done names a command
- **THEN** that command is a `make` target that exists, and no step names `make generate-opencode`

### Requirement: External skills are referenced, vendored only with provenance
External skills SHALL be declared as dependencies and linked, not copied into `skills/`; this rule SHALL be stated in `spec/skill-repo-governance.md` and checked by the Definition of Done. A skill adopted into `skills/` from an external source SHALL carry a provenance note (source, commit, licence, date) and SHALL be reviewed in full before any upstream change is pulled.

#### Scenario: A vendored skill carries provenance
- **WHEN** a reviewer finds a skill under `skills/` whose content originates outside Meaningfy
- **THEN** it carries a provenance note naming source, commit, licence and date, or the review rejects it

### Requirement: Agents conform to the agent authoring standard
Every `agents/<name>.md` SHALL conform to the agent standard in `spec/agent-template.md` — its closed
frontmatter contract (including a declared `type` of `delegated`, `lead` or `scheduled`), its body cap,
its `## Dispatch contract` section with the labels **Input**, **Output**, **Side effects** and
**Refuses**, and CLI-agnostic body text — and the validator SHALL reject any agent that does not. The
bundle that lists an agent (per "Skills are organised into role bundles with single ownership") SHALL
also list the agent's primary skill, the first non-namespaced, non-external entry of its `skills:`
list. Each agent SHALL have `tests/features/agents/<name>.feature` containing a Scenario Outline with
Examples and a Background that names every entry of the agent's `skills:` list.

#### Scenario: An agent without a declared type is rejected
- **WHEN** the validator reads an agent whose frontmatter has no `type` field
- **THEN** it reports `missing required frontmatter field 'type'` for that agent

#### Scenario: A bundle field in agent frontmatter is rejected
- **WHEN** an agent's frontmatter carries `bundle: meaningfy-building`
- **THEN** the validator reports that `bundle` is not in the agent contract

#### Scenario: An unknown type or a pinned model name is rejected
- **WHEN** an agent declares `type: worker` or `model: claude-opus-4-8`
- **THEN** the validator reports the type as not a known agent type, or the model as not a family alias

#### Scenario: A description that does not say when to use the agent is rejected
- **WHEN** an agent's description lacks "Use when" or contains an `<example>` block
- **THEN** the validator reports the description defect for that agent

#### Scenario: A lead or scheduled agent that invites delegation is rejected
- **WHEN** an agent of type `lead` or `scheduled` has a description without "Not for delegation"
- **THEN** the validator reports the missing phrase for that agent

#### Scenario: A body over the cap is rejected
- **WHEN** an agent body is one line longer than the validator's agent body cap
- **THEN** the validator reports the body as over the cap, and a body exactly at the cap passes

#### Scenario: A missing dispatch-contract part is rejected
- **WHEN** an agent has no `## Dispatch contract` section, or the section lacks `**Refuses:**`
- **THEN** the validator names the missing section or label

#### Scenario: A CLI-specific path in an agent body is rejected
- **WHEN** an agent body contains `.claude/memory/`
- **THEN** the validator reports the CLI-specific reference for that agent

#### Scenario: An agent in a bundle without its primary skill is rejected
- **WHEN** `code-reviewer` (primary skill `meaningfy-code-review`) is listed in a bundle that does not
  list `meaningfy-code-review`
- **THEN** the validator reports the bundle and the primary skill it lacks

#### Scenario: An agent without its Gherkin scenarios is rejected
- **WHEN** an agent has no feature file, or its feature file has no Scenario Outline with Examples, or
  its Background omits one of the agent's skills
- **THEN** the validator names the agent and the missing element

#### Scenario: The catalogue's own agents conform
- **WHEN** the validator runs over the repository
- **THEN** `code-reviewer`, `epic-planner` and `implementer` produce no agent-standard errors

