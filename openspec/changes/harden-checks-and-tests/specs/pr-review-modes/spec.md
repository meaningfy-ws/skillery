## ADDED Requirements

### Requirement: L3 judges the import contracts once per EPIC
The L3 lens SHALL judge, once per EPIC, whether the project's import-linter contracts still match
the layering and the ADRs the EPIC touched: every component and tier the EPIC added or renamed is
under a contract, no optional layer name stands for a package that now exists, and every
`ignore_imports` entry's decision still holds. `epic-delivery` SHALL ask for it in the EPIC's
last build stage, in the brief of the reviewer who takes L3 in that stage's review set; the
per-PR mechanical check does not replace it (harden-checks-and-tests DEC-11).

#### Scenario: The last build stage of an EPIC that added a component
- **WHEN** the L3 reviewer of the last build stage reads `.importlinter` after the EPIC added the component `billing`
- **THEN** its report states for each contract whether it still matches the layering, and a `billing` covered only by an optional layer name is a finding

#### Scenario: An earlier stage
- **WHEN** the L3 reviewer reviews the first of three build stages
- **THEN** it reviews the stage's diff and does not judge the contracts as a whole

#### Scenario: A project without import contracts
- **WHEN** the EPIC's repository has no `.importlinter`
- **THEN** the L3 reviewer of the last build stage says so in one line and reports no contract finding

#### Scenario: A SMALL EPIC
- **WHEN** the last build stage of a TINY or SMALL EPIC is reviewed by its one reviewer, briefed with lenses L2 and L3
- **THEN** that reviewer makes the contract judgement, and no further reviewer is dispatched for it

#### Scenario: A small stage with merged lenses
- **WHEN** the last build stage runs the small-stage set, with one reviewer taking L3, L4 and L5
- **THEN** that reviewer makes the contract judgement
