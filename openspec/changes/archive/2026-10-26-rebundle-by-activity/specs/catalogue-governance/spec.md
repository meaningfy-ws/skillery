## ADDED Requirements

### Requirement: The development method has one home
The skillery development method SHALL have one home, `docs/development/`, covering how to build skills
and agents, governance, the catalogue model and how to work in this repository; its entry point is
`docs/development/README.md`. `AGENTS.md`, the README's Develop door and `CONTRIBUTING.md` SHALL point
to that entry point and restate nothing. The method SHALL NOT be a skill, SHALL be in no bundle and
SHALL never be installed.

#### Scenario: A contributor looks for how to write a skill
- **WHEN** a contributor follows the Develop door of the README or the pointer in `AGENTS.md`
- **THEN** they reach `docs/development/README.md`, which lists the authoring guide, the templates,
  governance and the catalogue model in the same folder

### Requirement: An installed skill links nothing outside its own folder
No link in a skill's files SHALL resolve outside that skill's folder: an installed skill has only its
own folder. A skill SHALL state a fact itself or name the skill that owns it. Validation SHALL fail
otherwise.

#### Scenario: A skill links into the repository's docs
- **WHEN** a skill's file links to `../../docs/<page>.md`
- **THEN** `make validate` fails, naming the file and the link

### Requirement: Only the agreed top-level folders exist
The repository's top level SHALL hold only the folders `skills/`, `agents/`, `use-cases/`,
`openspec/`, `docs/`, `tools/`, `tests/`, `.github/` and `.claude-plugin/`, besides root files, hidden
tool folders and the generated, git-ignored `bundles/`. Validation SHALL fail otherwise.

#### Scenario: A new top-level folder appears
- **WHEN** a change adds a top-level folder outside that list
- **THEN** `make validate` fails, naming the folder and the allowed list
