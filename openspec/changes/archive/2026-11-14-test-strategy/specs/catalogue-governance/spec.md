## ADDED Requirements

### Requirement: The bindings mandate the founding principle
`AGENTS.md` and `project-setup`'s agentic `AGENTS.md` template SHALL mandate that every activity
states how it succeeds and how it fails before the work, and SHALL route to `test-strategy` for the
method, without restating it (test-strategy DEC-2).

#### Scenario: A new project's binding
- **WHEN** `project-setup` scaffolds a project
- **THEN** its `AGENTS.md` carries the mandate and a route to `test-strategy`, and no copy of the questions or the stances
