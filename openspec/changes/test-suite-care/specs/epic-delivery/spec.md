<!-- Shaping-level delta. The PLAN adds the rest when it is derived. -->

## ADDED Requirements

### Requirement: A stage's adversarial tests are distilled before the stage merges
The tester's report SHALL name, for each new adversarial test, the scenario or error-matrix row it
attacks and whether it failed on its first run. In step 4 of the
stage loop (Decide and fix) the lead SHALL distil them: a test that failed on its first run, a test that
alone covers a scenario or an error-matrix row and a property that states an invariant of the PLAN SHALL be kept in a
file named by feature; every other one SHALL be deleted and listed in the stage's pull request
with a reason (test-suite-care DEC-3; design D-12).

#### Scenario: Deciding a stage's adversarial tests
- **WHEN** the lead decides the findings of a stage whose tester wrote forty adversarial tests, three of which found a defect
- **THEN** those three and any that alone cover a scenario are moved into files named by feature, and each dropped test has a recorded reason

#### Scenario: A test that attacks nothing named
- **WHEN** the tester's report gives "none" as the scenario of a test that passed on its first run
- **THEN** the lead deletes it, unless it is a property that states an invariant of the PLAN
