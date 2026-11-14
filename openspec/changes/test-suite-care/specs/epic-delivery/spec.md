<!-- Shaping-level delta. The PLAN adds the rest when it is derived. -->

## ADDED Requirements

### Requirement: A stage's adversarial tests are distilled before the stage merges
The tester's report SHALL name the scenario each new adversarial test attacks. In step 4 of the
stage loop (Decide and fix) the lead SHALL distil them: a test that found a defect, a test that
alone covers a scenario and a property that states an invariant of the PLAN SHALL be kept in a
file named by feature; every other one SHALL be dropped with a recorded reason (test-suite-care
DEC-3).

#### Scenario: Deciding a stage's adversarial tests
- **WHEN** the lead decides the findings of a stage whose tester wrote forty adversarial tests, three of which found a defect
- **THEN** those three and any that alone cover a scenario are moved into files named by feature, and each dropped test has a recorded reason
