<!-- Delta of the PLAN (design.md D-12). -->

## ADDED Requirements

### Requirement: A stage's adversarial tests are distilled before the stage merges
The tester's report SHALL name, for each new adversarial test, the scenario or error-matrix row it
attacks and whether it failed on its first run. In step 4 of the stage loop (Decide and fix) the
lead SHALL sort them. Kept: a test that failed on its first run and whose finding was accepted, a
test that alone covers a scenario or an error-matrix row, and one property per invariant the
PLAN's design names. Every other test SHALL be deleted in the fix round, before the second run of
the full gates, and listed in the stage's pull request with its reason. Kept tests SHALL be in
files named by feature (test-suite-care DEC-3; design D-12).

#### Scenario: Deciding a stage's adversarial tests
- **WHEN** the lead decides the findings of a stage whose tester wrote forty adversarial tests, three of which found a defect
- **THEN** those three and any that alone cover a scenario are moved into files named by feature, and each dropped test has a recorded reason

#### Scenario: A test that attacks nothing named
- **WHEN** the tester's report gives "none" as the scenario of a test that passed on its first run
- **THEN** the lead deletes it, unless it is the one property kept for an invariant the PLAN's design names

#### Scenario: A rejected finding
- **WHEN** a tester's test failed on its first run and the lead rejects its finding as not a defect
- **THEN** the test is deleted and the pull request gives the rejection as its reason
