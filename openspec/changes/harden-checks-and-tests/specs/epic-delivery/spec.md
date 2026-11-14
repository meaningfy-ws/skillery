## MODIFIED Requirements

### Requirement: The loop scales with the appetite
The loop of a stage SHALL be Prepare, Build, Challenge, Decide and fix, Check, Merge, and the
Challenge and Check steps SHALL scale with the EPIC's appetite (align-agent-team-delivery DEC-7,
DEC-10) as the review set of the epic-delivery workflow file in `epic-delivery` states for each
appetite. From LARGE up the adversarial tester SHALL run on every stage; at MEDIUM it SHALL run
on a stage that changed code and for which the PLAN names an invariant, and on no other stage
(harden-checks-and-tests DEC-9, revised 2026-11-14). For
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
- **WHEN** a stage of a MEDIUM EPIC is built that changed code for which the PLAN names an invariant
- **THEN** the adversarial tester and the five lenses run in parallel, followed by one fresh checker

#### Scenario: A MEDIUM stage with nothing for the tester
- **WHEN** a stage of a MEDIUM EPIC is built that changed only skill text, or code for which the PLAN names no invariant
- **THEN** the five lenses run in parallel, followed by one fresh checker, and no tester is dispatched

#### Scenario: A LARGE EPIC with screens
- **WHEN** a stage of a LARGE EPIC that changed screens is built
- **THEN** the adversarial tester, the five lenses and the UX lens run in parallel, followed by one fresh checker

#### Scenario: A small stage of a large EPIC
- **WHEN** a stage of a VERY LARGE EPIC adds 450 lines of low-risk change and the lead records a decision to merge the lenses
- **THEN** two reviewers run (L1 with L2, L3 with L4 and L5), followed by the adversarial tester's and the checker's separate runs

#### Scenario: The scaling has one source
- **WHEN** a contributor looks up the review set of a MEDIUM EPIC in `epic-delivery`
- **THEN** the skill points to the epic-delivery workflow file, which states five lenses, the adversarial tester with its condition and a checker, and no table in the skill repeats it

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

### Requirement: A challenge or check result ends in one line
The report of the adversarial tester, of a reviewer and of the checker SHALL end in one result
line of a fixed form that a script can read. The line SHALL name the stage and the role, and
SHALL give the number of findings and the number of them the lead accepted; the tester's line
SHALL also give the number of tests written and the number that failed on their first run, a
reviewer's its lenses, and the checker's its verdict. The worker SHALL leave the accepted number
open, and the lead SHALL write the line again with that number when it decides the findings, in
the stage's pull request. `epic-delivery` SHALL hold the one definition of the line, and no
other skill SHALL define it (harden-checks-and-tests DEC-9, revised 2026-11-14; design D-29).

#### Scenario: A tester's result
- **WHEN** the tester wrote twelve tests on stage 2, three failed on their first run, and it reports three findings
- **THEN** its report ends in the line `result: stage=2 role=tester tests=12 failed-first=3 findings=3 accepted=-`

#### Scenario: The lead decides the findings
- **WHEN** the lead accepts two of the tester's three findings in step 4
- **THEN** the stage's pull request holds the same line with `accepted=2`

#### Scenario: A report without the line
- **WHEN** a reviewer's report does not end in the result line
- **THEN** the lead returns it as incomplete
