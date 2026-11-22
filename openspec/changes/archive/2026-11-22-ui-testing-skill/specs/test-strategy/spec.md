## ADDED Requirements

### Requirement: The UI matrix has no open gap
The UI family file SHALL name `ui-testing` as the technique owner of its `VER`, `ROB`, `ADQ` and
`RSK` rows, with `ADQ` held by the broken-screen check and `RSK` by the browser and device matrix,
each with its own check id in the inventory; `CHK-58` SHALL point to `ui-testing` (DEC-3, DEC-4,
design D-7).

#### Scenario: Who checks that UI scenarios catch a broken screen
- **WHEN** someone reads the `ADQ` row of the UI matrix
- **THEN** it names the broken-screen check, its id, the owner `ui-testing` and status `exists`
