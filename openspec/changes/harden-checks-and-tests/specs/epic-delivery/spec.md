## MODIFIED Requirements

### Requirement: The loop scales with the appetite
The loop of a stage SHALL be Prepare, Build, Challenge, Decide and fix, Check, Merge, and the
Challenge and Check steps SHALL scale with the EPIC's appetite (align-agent-team-delivery DEC-7,
DEC-10) as the review set of the epic-delivery workflow file in `epic-delivery` states for each
appetite. The adversarial tester SHALL run from MEDIUM up (harden-checks-and-tests DEC-9). For
MEDIUM and above, the file SHALL also state a small-stage set: when a stage's added
lines are at or under its limit and the lead judges the risk low, the lenses MAY run as two merged
reviewers, provided the lead records the choice as a decision under `## Delivery decisions` in the
change's `design.md`, a section whose edits do not make the PLAN's gates stale; the
adversarial tester and the checker SHALL stay separate (navigator-follows-the-work DEC-12, #148).
That file SHALL be the only statement of which review set each appetite and stage size gets;
`epic-delivery`, its references, `meaningfy-code-review`, `guardrails` and the docs SHALL point to
it, and worked examples and tests MAY illustrate it.

#### Scenario: A SMALL EPIC
- **WHEN** a SMALL EPIC's stage is built
- **THEN** one review pass covering spec and structure runs, and no checker or tester is dispatched

#### Scenario: A MEDIUM EPIC
- **WHEN** a stage of a MEDIUM EPIC is built
- **THEN** the adversarial tester and the five lenses run in parallel, followed by one fresh checker

#### Scenario: A LARGE EPIC with screens
- **WHEN** a stage of a LARGE EPIC that changed screens is built
- **THEN** the adversarial tester, the five lenses and the UX lens run in parallel, followed by one fresh checker

#### Scenario: A small stage of a large EPIC
- **WHEN** a stage of a VERY LARGE EPIC adds 450 lines of low-risk change and the lead records a decision to merge the lenses
- **THEN** two reviewers run (L1 with L2, L3 with L4 and L5), followed by the adversarial tester's and the checker's separate runs

#### Scenario: The scaling has one source
- **WHEN** a contributor looks up the review set of a MEDIUM EPIC in `epic-delivery`
- **THEN** the skill points to the epic-delivery workflow file, which states five lenses, the adversarial tester and a checker, and no table in the skill repeats it

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
