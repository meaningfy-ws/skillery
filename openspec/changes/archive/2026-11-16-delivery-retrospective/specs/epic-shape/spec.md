## ADDED Requirements

### Requirement: The lead marks shaping and the PLAN
`epic-planning` SHALL cite the mark line defined in `epic-delivery`. The lead SHALL write it with
`phase=shape` at the start of shaping and with `phase=plan` at the start of the PLAN (proposal
DEC-3). Archive and release SHALL write no mark (proposal DEC-4).

#### Scenario: Shaping starts
- **WHEN** the lead starts shaping change `x`
- **THEN** it writes `mark: change=x phase=shape stage=-`

#### Scenario: The PLAN starts
- **WHEN** the lead starts deriving the PLAN of change `x`
- **THEN** it writes `mark: change=x phase=plan stage=-`

#### Scenario: A change is archived
- **WHEN** a change is archived or released
- **THEN** no mark line is written and the report labels that work `guessed`
