## MODIFIED Requirements

### Requirement: The loop scales with the appetite
The loop of a stage SHALL be Prepare, Build, Challenge, Decide and fix, Check, Merge, and the
Challenge and Check steps SHALL scale with the EPIC's appetite (align-agent-team-delivery DEC-7,
DEC-10) as the review set of the epic-delivery workflow file in `epic-delivery` states for each
appetite. For MEDIUM and above, the file SHALL also state a small-stage set: when a stage's added
lines are at or under its limit and the lead judges the risk low, the lenses MAY run as two merged
reviewers, provided the lead records the choice as a decision in the change's `design.md`; the
adversarial tester and the checker SHALL stay separate (navigator-follows-the-work DEC-12, #148).
That file SHALL be the only statement of which review set each appetite and stage size gets;
`epic-delivery`, its references, `meaningfy-code-review`, `guardrails` and the docs SHALL point to
it, and worked examples and tests MAY illustrate it.

#### Scenario: A SMALL EPIC
- **WHEN** a SMALL EPIC's stage is built
- **THEN** one review pass covering spec and structure runs, and no checker or tester is dispatched

#### Scenario: A LARGE EPIC with screens
- **WHEN** a stage of a LARGE EPIC that changed screens is built
- **THEN** the adversarial tester, the five lenses and the UX lens run in parallel, followed by one fresh checker

#### Scenario: A small stage of a large EPIC
- **WHEN** a stage of a VERY LARGE EPIC adds 450 lines of low-risk change and the lead records a decision to merge the lenses
- **THEN** two reviewers run (L1 with L2, L3 with L4 and L5), followed by the adversarial tester's and the checker's separate runs

#### Scenario: The scaling has one source
- **WHEN** a contributor looks up the review set of a MEDIUM EPIC in `epic-delivery`
- **THEN** the skill points to the epic-delivery workflow file, which states five lenses and a checker, and no table in the skill repeats it
