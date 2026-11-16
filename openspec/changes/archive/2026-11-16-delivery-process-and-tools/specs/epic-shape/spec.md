## MODIFIED Requirements

### Requirement: Planning effort follows the appetite
A PLAN's depth SHALL follow its appetite. At every appetite, and on any re-gate, the clarity gate
SHALL run at most twice; the second run SHALL read only the gaps the first one listed. Gaps left
after the second run SHALL go to the developer as one question round, and a gap the developer
accepts SHALL be recorded as a `DEC-` in `design.md`, the one case in which a PLAN proceeds below
9/10 (DEC-2). Elicitation SHALL ask its questions in rounds (lean-delivery DEC-6, DEC-7).

#### Scenario: A SMALL PLAN at 8.6 after two runs
- **WHEN** a SMALL PLAN scores 8.6 on its second clarity-gate run
- **THEN** the remaining gaps go to the developer in one round, and no third revision runs

#### Scenario: A LARGE PLAN at 8.8 after two runs
- **WHEN** a LARGE PLAN scores 8.8 on its second clarity-gate run
- **THEN** the remaining gaps go to the developer in one round, and no third run is made

#### Scenario: A re-gate
- **WHEN** a gated PLAN is changed and gated again
- **THEN** the gate runs at most twice for that re-gate, and its second run reads only the gaps the first listed

## ADDED Requirements

### Requirement: The PLAN is derived and gated while shaping
Deriving the PLAN and gating it SHALL be part of the shaping session, in one workflow owned by
`epic-planning`: seeds, the EPIC, the PLAN, the gate. A shaping session SHALL end with each EPIC's
PLAN gated, not "shaped, not planned". Between the EPIC and its PLAN the session MAY be reset with
a hand-over note whose template is the file in `epic-delivery`. Scenario sign-off SHALL happen at
the PLAN gate, which is now in shaping. A change shaped under the old split and half-way through
SHALL be read by the same phases (DEC-19, D-17).

#### Scenario: A shaping session ends
- **WHEN** a shaping session finishes an EPIC
- **THEN** its PLAN is derived and gated, and the session does not end with the EPIC "shaped, not planned"

#### Scenario: A reset between EPIC and PLAN
- **WHEN** the session is reset after the EPIC and before the PLAN
- **THEN** a hand-over note with the standard headings carries the work to the fresh session

#### Scenario: Scenarios are signed off at the gate
- **WHEN** a PLAN passes its clarity gate in shaping
- **THEN** the developer signs off its scenarios at that gate, and delivery does not ask again unless a scenario changes

#### Scenario: A change half-way through the old split
- **WHEN** a change was shaped under the old split and has an EPIC but no PLAN
- **THEN** the shaping phases derive and gate the PLAN, and delivery does not
