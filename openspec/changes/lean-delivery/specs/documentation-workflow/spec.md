## ADDED Requirements

### Requirement: The docs stage runs on its condition
The documentation workflow, owned by `technical-writing`, SHALL run as the last stage of an epic
session, after acceptance and before archive, when the EPIC changed a use case, the architecture,
installation or user-facing behaviour, and MAY run on demand. It SHALL end in one PR reviewed with
the appetite's review set (lean-delivery DEC-9).

#### Scenario: The docs stage after acceptance
- **WHEN** a LARGE EPIC that changed installation is accepted
- **THEN** the lead runs the docs stage before archiving, and it ends in one PR

### Requirement: Five phases
The workflow SHALL run inventory (the pages owed: missing, false, stale), write, verify (snippets
run, the project's docs gate), cold-read and publish, in its own workflow file in `technical-writing`.

#### Scenario: The band in a docs stage
- **WHEN** the lead loads `technical-writing` in the docs stage
- **THEN** the band shows inventory, write, verify, cold-read and publish

### Requirement: Architecture pages are recorded as built, never re-decided
The docs stage SHALL bring C4 views and the architecture index page up to date as built through
`architecture`'s method, copying none of it, and SHALL NOT change an ADR's status or take a new
decision; an as-built fact that contradicts an ADR SHALL go to the lead as a finding.

#### Scenario: As built contradicts an ADR
- **WHEN** the docs stage finds the code departs from an Accepted ADR
- **THEN** it reports a finding to the lead and leaves the ADR unchanged

### Requirement: The cold reader runs where a page changed
The cold reader SHALL run on every task-oriented page (how-to, tutorial, installation manual) the docs
stage writes, and on any how-to or tutorial page a build stage changed; explanation and reference
pages SHALL get the lightweight clarity check.

#### Scenario: A reference page
- **WHEN** the docs stage updates a reference page
- **THEN** it applies the lightweight clarity check and no cold reader
