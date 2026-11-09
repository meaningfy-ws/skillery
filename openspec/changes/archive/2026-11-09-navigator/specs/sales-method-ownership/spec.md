## ADDED Requirements

### Requirement: The sales workflow is simple and provisional
`sales-operations` SHALL host one sales workflow file, marked provisional, built only from the
existing sales skills and agents: research and qualify, meeting, estimate and offer, pipeline kept
true. It SHALL NOT decide any open question of the sales method and SHALL be revised when that
method settles (DEC-9).

#### Scenario: A sales session
- **WHEN** a session loads `proposal-writing`
- **THEN** navigator shows the sales workflow, marked provisional, in its offer phase
