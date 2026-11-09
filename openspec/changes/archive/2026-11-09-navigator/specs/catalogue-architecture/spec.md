## MODIFIED Requirements

### Requirement: Shared resources live in foundation skills, cited by name

A resource used by more than one skill SHALL live in a foundation skill that holds the resource and no
method, placed in a bundle that every bundle using it
contains or requires. No file under `skills/<a>/` SHALL link to a path under `skills/<b>/`; a skill
SHALL cite another skill by name. A workflow file is an asset of its host skill under
`assets/workflows/` and SHALL name other skills only by name. A mod SHALL read a skill asset only
through the links `make bundles` renders into its bundle, never through a path into another bundle.

#### Scenario: A cross-skill path

- **WHEN** `skills/explanatory-writing/SKILL.md` links to `../executive-communication/references/company-voice.md`
- **THEN** validation fails, naming both skills and the link

#### Scenario: A core-only install

- **WHEN** a user installs only `meaningfy-core`
- **THEN** every resource that `explanatory-writing` cites is installed with it

#### Scenario: The mod reads a workflow file

- **WHEN** navigator loads the build-tier workflow
- **THEN** it reads it under its own bundle's `data/workflows/`, a link `make bundles` rendered to `skills/epic-delivery/assets/workflows/`
