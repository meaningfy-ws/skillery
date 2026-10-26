## ADDED Requirements

### Requirement: Project skills resolve projects by the shared rule

`vault-project`, `vault-resume`, `vault-capture` and `vault-planning` SHALL resolve and list projects
by the project-homes rule in `vault-conventions`, covering both `01 Projects/` and `07 Perso/`.
`vault-project new` SHALL ask whether the project is personal and, if so, create it in `07 Perso/`
with `private: true` on every file. `vault-project close` SHALL find the project in either home and
move it to `06 Archive/` by the procedure in `vault-conventions` (Moving and deleting), after the
owner's yes. `vault-capture` SHALL file a project's non-standing notes into its `artefacts/`.

#### Scenario: A personal project is created

- **WHEN** the owner runs `vault-project new` and answers that the project is personal
- **THEN** the folder is created in `07 Perso/` with its five standing files, each carrying
  `private: true`, and no `artefacts/` folder yet

#### Scenario: The weekly review sees personal projects

- **WHEN** `vault-planning` runs a weekly review while one active project is in `07 Perso/`
- **THEN** that project appears in the sweep of active projects
