## ADDED Requirements

### Requirement: Every workflow phase declares how it succeeds and fails
Each phase of a default workflow file SHALL carry `criteria` with two non-empty one-line strings,
`succeeds` and `fails`, naming the evidence; `make validate` SHALL fail on a default phase without
them. In a repository's override file `criteria` SHALL be optional, and the navigator SHALL accept
it and reject only a malformed value (test-strategy DEC-10, design D-5).

#### Scenario: A default phase without criteria
- **WHEN** the `decide` phase of `epic-shaping.workflow.json` has no `criteria`
- **THEN** `make validate` fails, naming the file and the phase

#### Scenario: A repository file without criteria
- **WHEN** a repository's own workflow file has phases without `criteria`
- **THEN** the navigator loads it with no error

#### Scenario: Malformed criteria in a repository file
- **WHEN** a repository's workflow file has `"criteria": {"succeeds": ""}`
- **THEN** the navigator reports the file and the phase as a schema error
