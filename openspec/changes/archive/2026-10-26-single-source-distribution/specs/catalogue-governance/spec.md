## ADDED Requirements

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

## MODIFIED Requirements

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
