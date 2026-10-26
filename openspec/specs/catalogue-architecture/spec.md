# catalogue-architecture Specification

## Purpose
How the catalogue describes what it serves and how its parts fit: one file per use case, a generated gap map, foundation skills instead of cross-skill paths, and documentation entered through three doors (Install, Use, Develop).
## Requirements
### Requirement: Use cases are catalogued one file each

Each use case the catalogue serves SHALL be one file `use-cases/<id>-<slug>.md`, a White use case in the
Cockburn convention of the `architecture` skill, with frontmatter `id` (`UC-W<n>`, matching the file
name), `title`, `primary_actor`, `trigger`, `success_guarantee`, `area`, `served_by` and `status`,
and optionally `change`, with a body holding at least a Brief Description. `area` SHALL be a term of
the `area` facet, and every name in `served_by` SHALL exist in the catalogue. Validation SHALL fail otherwise.

#### Scenario: Adding a use case

- **WHEN** a contributor adds `use-cases/UC-W22-<slug>.md` with valid frontmatter
- **THEN** validation passes and the regenerated `docs/use-cases.md` lists it under its area, with no
  other file edited by hand

#### Scenario: A use case naming a skill that does not exist

- **WHEN** a use case's `served_by.skills` names `offer-writer` and no such skill exists
- **THEN** validation fails, naming the use case and the unknown skill

### Requirement: The use-case view is generated

`docs/use-cases.md` SHALL be generated from the use-case files by the catalogue map generator, showing
each use case by area with its status and, where set, the follow-on change that closes it. Drift between
the files and the view SHALL fail validation.

#### Scenario: A stale view

- **WHEN** a use case's `status` changes and `docs/use-cases.md` is not regenerated
- **THEN** validation fails and names the regeneration command

### Requirement: Shared resources live in foundation skills, cited by name

A resource used by more than one skill SHALL live in a foundation skill that holds the resource and no
method, placed in a bundle that every bundle using it
contains or requires. No file under `skills/<a>/` SHALL link to a path under `skills/<b>/`; a skill
SHALL cite another skill by name.

#### Scenario: A cross-skill path

- **WHEN** `skills/explanatory-writing/SKILL.md` links to `../executive-communication/references/company-voice.md`
- **THEN** validation fails, naming both skills and the link

#### Scenario: A core-only install

- **WHEN** a user installs only `meaningfy-core`
- **THEN** every resource that `explanatory-writing` cites is installed with it

### Requirement: Documentation has three doors

The README's documentation section SHALL route by intention through three doors: Install (setup per
CLI), Use (the use-case view to the agent or skill and its Quick Start) and Develop (the method and
the catalogue architecture). Every link in the three doors SHALL resolve.

#### Scenario: A colleague who wants to use the catalogue

- **WHEN** a colleague opens the README to find help for writing a proposal
- **THEN** the Use door leads to `docs/use-cases.md`, where the proposals use case names the skills or
  agent that serve it

