## ADDED Requirements

### Requirement: Every skill and agent serves a use case

Every skill under `skills/` and every agent under `agents/` SHALL be named in the `served_by` of at
least one use case in `use-cases/`. Validation SHALL fail for a skill or agent that no use case names.

#### Scenario: A new skill without a use case

- **WHEN** a contributor adds `skills/offer-writing/` and no use case names it in `served_by`
- **THEN** validation fails, naming the skill and telling the contributor to add it to a use case

#### Scenario: A repository without a use-case catalogue

- **WHEN** a repository that uses the method checks has no `use-cases/` directory
- **THEN** the coverage check reports nothing

### Requirement: Future features are listed in one file

`docs/future-features.md` SHALL list every feature still to be built in the catalogue, each with its
use cases, bundle, the agents and skills to build, the material it needs, whether that material is in
hand, and its change. Every use case whose `status` is `partial` or `missing` SHALL name in `change`
a change that appears in that file.

#### Scenario: A use case waiting for a feature

- **WHEN** UC-W17 has status `missing` and change `add-visual-design`
- **THEN** `docs/future-features.md` has a row for `add-visual-design` listing UC-W17

## MODIFIED Requirements

### Requirement: Use cases are catalogued one file each

Each use case the catalogue serves SHALL be one file `use-cases/<id>-<slug>.md`, a White use case in the
Cockburn convention of the `architecture` skill, with frontmatter `id` (`UC-W<n>`, matching the file
name), `title`, `primary_actor`, `trigger`, `success_guarantee`, `area`, `served_by` and `status`,
and optionally `change`, with a body holding every section of
`docs/development/use-case-template.md` in its order: Brief Description, Stakeholders and Interests,
Preconditions, Minimal Guarantees, Main Success Scenario, Extensions, Out of Scope, Artefacts,
Evidence, Feedback Loop, Slices and Open Points (the last opening with a confidence rating). `area` SHALL be a term of
the `area` facet, and every name in `served_by` SHALL exist in the catalogue. Validation SHALL fail otherwise.

#### Scenario: Adding a use case

- **WHEN** a contributor adds `use-cases/UC-W22-<slug>.md` with valid frontmatter
- **THEN** validation passes and the regenerated `docs/use-cases.md` lists it under its area, with no
  other file edited by hand

#### Scenario: A use case naming a skill that does not exist

- **WHEN** a use case's `served_by.skills` names `offer-writer` and no such skill exists
- **THEN** validation fails, naming the use case and the unknown skill

#### Scenario: A use case without its evidence

- **WHEN** a use case has no `## Evidence` section
- **THEN** validation fails, naming the use case and the missing section
