<!-- Delta of the PLAN (design.md D-12). Revised 2026-11-14 by owner decision (design D-35):
     the builder sorts and reports refactoring opportunities; the lead confirms. Revised
     2026-11-15 (design D-38): the sort is part of the stage's one fix pass, which
     delivery-process-and-tools DEC-4 defines. This delta adds one requirement and modifies none
     of the stage-loop requirements that EPIC changes. -->

## ADDED Requirements

### Requirement: A stage's adversarial tests are distilled before the stage merges
The tester's report SHALL name, for each new adversarial test, the scenario or error-matrix row it
attacks and whether it failed on its first run. In step 4 of the stage loop (Decide and fix),
after the lead has decided the findings, the builder of the stage's one fix pass SHALL sort them by this
rule and return the kept and the deleted list, and the lead SHALL confirm the lists. The
builder's report SHALL also list the refactoring opportunities it saw while sorting; it SHALL
implement none of them, and they SHALL NOT widen the stage. Kept: a test that failed on its first run and whose finding was accepted, a
test that alone covers a scenario or an error-matrix row, and one property per invariant the
PLAN's design names. Every other test SHALL be deleted in that pass, before the gate run that
checks it, and listed in the stage's pull request with its reason. The sort SHALL NOT add a fix
pass or a gate run to the stage. Kept tests SHALL be in
files named by feature (test-suite-care DEC-3, revised 2026-11-14; design D-12, D-35, D-38;
delivery-process-and-tools DEC-4).

#### Scenario: Deciding a stage's adversarial tests
- **WHEN** the lead decides the findings of a stage whose tester wrote forty adversarial tests, three of which found a defect
- **THEN** the builder of the stage's one fix pass moves those three and any that alone cover a scenario into files named by feature, returns the kept and the deleted list with a reason per dropped test, and the lead confirms the lists before the gate run that checks the pass

#### Scenario: A test that attacks nothing named
- **WHEN** the tester's report gives "none" as the scenario of a test that passed on its first run
- **THEN** the builder lists it as deleted, unless it is the one property kept for an invariant the PLAN's design names

#### Scenario: A refactoring opportunity seen while sorting
- **WHEN** the builder sees, while sorting, that four of the kept tests repeat the same set-up
- **THEN** its report lists that as a refactoring opportunity, and it changes nothing beyond moving the kept tests

#### Scenario: A rejected finding
- **WHEN** a tester's test failed on its first run and the lead rejects its finding as not a defect
- **THEN** the test is deleted and the pull request gives the rejection as its reason
