<!-- Revised 2026-11-15 (design D-30, by the owner's S-6 in
     ../../../delivery-process-and-tools/inputs/reassessment-2026-11-15.md): the MODIFIED requirement
     "The loop scales with the appetite" (the tester at MEDIUM and its condition) and the ADDED
     requirement "A challenge or check result ends in one line" left this delta. Both are delivered
     by delivery-process-and-tools (its DEC-3 and DEC-18), which owns the stage loop and the review
     sets. What stays here is how the tester works. -->

## ADDED Requirements

### Requirement: The adversarial tester works by stated methods
The adversarial tester's brief SHALL take the adversary stance of `test-strategy` and SHALL name
its methods by pointing to the `cosmic-python` testing checklist: property-based tests and
stateful tests with Hypothesis, and Schemathesis where the project has an OpenAPI contract. The
tester SHALL take its properties from the PLAN's error matrix and the stage's spec scenarios, and
its report SHALL list every property it stated, each with the test that holds it and its result.
Where a stage changes no Python code, the tester SHALL say so and report the edge cases it tried
instead. The tester remains a brief for `implementer` (harden-checks-and-tests DEC-9, DEC-14).

#### Scenario: A stage that changes a parser
- **WHEN** the tester is dispatched on a stage that changed a parser and its serialiser
- **THEN** its report lists the round-trip property it stated, the Hypothesis test that holds it and whether it passed

#### Scenario: A stage with an OpenAPI contract
- **WHEN** the stage changed an endpoint of a service that has an OpenAPI contract
- **THEN** the tester runs Schemathesis against that contract and reports the result

#### Scenario: A report without properties
- **WHEN** a tester's report on a Python stage lists tests and names no property
- **THEN** the lead returns it as incomplete

#### Scenario: A stage without Python code
- **WHEN** the tester is dispatched on a stage that changed only skill files
- **THEN** its report says no property-based method applied and lists the edge cases it tried
