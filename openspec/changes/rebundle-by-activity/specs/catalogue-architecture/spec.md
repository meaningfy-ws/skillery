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
