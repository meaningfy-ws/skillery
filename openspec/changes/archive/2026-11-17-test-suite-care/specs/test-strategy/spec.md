<!-- Delta of the PLAN (design.md D-13). Revised 2026-11-17 (design D-73): the cross-cutting row
     for checks that are not code is removed with stage 3. -->

## ADDED Requirements

### Requirement: The matrix names the audit of a test suite
The software matrix SHALL hold an `ADQ` row for the test suite audit, owned
by `test-suite-care` (the UI matrix row is deferred with stage 2, design D-43). The rows of the
testing checklist SHALL name the developer's lanes among their moments.
The matrix's questions, stances and columns SHALL NOT change (test-suite-care
DEC-9; design D-13).

#### Scenario: Which check says a suite is worth its cost
- **WHEN** someone reads the software matrix for the adequacy of the tests
- **THEN** a row names the test suite audit, its owner `test-suite-care` and "the developer" as the one who decides
