<!-- Delta of the PLAN (design.md D-13). -->

## ADDED Requirements

### Requirement: The matrix names the audit of a test suite and of a check
The software matrix SHALL hold an `ADQ` row for the test suite audit, owned
by `test-suite-care` (the UI matrix row is deferred with stage 2, design D-43), and the cross-cutting matrix SHALL hold an `ADQ` row for the assessment of a
check that is not code. The rows of the testing checklist SHALL name the developer's lanes among
their moments. An `ADQ` row of another family whose check is not code and whose status is no longer `gap`
SHALL name that assessment in its Check cell, and its status SHALL stay as its owner set it.
The matrix's questions, stances and columns SHALL NOT change (test-suite-care
DEC-9; design D-13).

#### Scenario: Which check says a suite is worth its cost
- **WHEN** someone reads the software matrix for the adequacy of the tests
- **THEN** a row names the test suite audit, its owner `test-suite-care` and "the developer" as the one who decides
