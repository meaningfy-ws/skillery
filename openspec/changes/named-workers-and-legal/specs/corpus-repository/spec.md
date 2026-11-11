## ADDED Requirements

### Requirement: A worker operates a material repository by its own instructions
`meaningfy-core` SHALL ship a generic `corpus-repository` skill: a worker uses an external repository
that holds house material by that repository's own instructions — it works in the repository the
session runs in or one the person names, reads its `AGENTS.md` and docs before acting, uses the
repository's own commands, stops when the repository's checks fail, never edits what the repository
declares immutable, and reports what the instructions left unclear. The skill SHALL name no
repository, domain, command or layout (DEC-13, D-8, D-9).

#### Scenario: Instructions first
- **WHEN** a worker with `corpus-repository` is asked to add material to a repository it has not read
- **THEN** it reads the repository's `AGENTS.md` and the docs it points to before writing anything

#### Scenario: A failing check stops the work
- **WHEN** the repository's own check fails on the worker's change
- **THEN** the worker stops, reports the failure and does not bypass or disable the check

#### Scenario: Immutable material
- **WHEN** the repository declares a file released or signed and the task would change it
- **THEN** the worker adds what the repository's instructions prescribe instead (a new version, an
  amendment) or returns the question

#### Scenario: No instructions
- **WHEN** the repository has no `AGENTS.md` or README describing how to work in it
- **THEN** the worker says so and asks the person before writing
