## MODIFIED Requirements

### Requirement: The adversarial tester runs on its condition
The adversarial tester SHALL NOT run at TINY or SMALL. At MEDIUM and above, when the PLAN has an
`## Invariants` section, it SHALL run when the stage changed code and a row of that section for
that code has the tester as its test (its Test cell starts with `tester`). A PLAN without an
`## Invariants` section SHALL keep today's rule: the tester on every stage from LARGE up, none
below. In Prepare the lead SHALL judge the condition and record the answer in one line of the PR
body. From LARGE up, when the condition holds, the lead SHALL also name in Prepare the stage's
riskiest task (the one that adds an invariant, a write order, concurrent writes or a security
boundary); the tester SHALL run on that task's diff right after its commit, and at Challenge
again only if the rest of the stage still meets the condition. Its findings SHALL be decided at
step 4 with the others, except a Critical one that blocks the next task, which goes to a fixer
before the next brief (issue #144). This requirement and the stage loop's Prepare SHALL be the one
definition of the condition; the workflow file's `tester` wording SHALL only point to Prepare
(DEC-3, D-5).

#### Scenario: A stage with a tester invariant
- **WHEN** a MEDIUM stage changed code and an invariant row for that code names the tester
- **THEN** the tester runs with the reviewers and the lead records "tester: yes" with the invariant in the PR body

#### Scenario: A stage without a tester invariant
- **WHEN** a LARGE stage changed code, the PLAN has an `## Invariants` section and no row for that code names the tester
- **THEN** no tester runs and the lead records "tester: no" with the reason in the PR body

#### Scenario: A PLAN without an Invariants section
- **WHEN** a LARGE stage is built from a PLAN that has no `## Invariants` section
- **THEN** the tester runs, as it does today, and a MEDIUM stage of the same PLAN has none

#### Scenario: A TINY or SMALL stage
- **WHEN** a stage of a TINY or SMALL EPIC changed code with a tester invariant
- **THEN** no tester runs

#### Scenario: The riskiest task of a LARGE stage
- **WHEN** a LARGE stage of six tasks meets the condition and task 3 adds an invariant with a two-step write order
- **THEN** the lead names task 3 in Prepare, the tester runs on task 3's diff right after its commit, and at Challenge it runs again only if tasks 4 to 6 still meet the condition

#### Scenario: A blocking finding after the riskiest task
- **WHEN** the tester's run after the riskiest task finds a Critical defect that the next task builds on
- **THEN** the lead sends a fixer before briefing the next task, and every other finding waits for step 4
