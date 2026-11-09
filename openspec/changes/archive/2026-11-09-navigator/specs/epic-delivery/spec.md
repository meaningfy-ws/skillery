## ADDED Requirements

### Requirement: The build-tier workflow is data
`epic-delivery` SHALL host the build-tier workflow file, with its exploratory and brownfield
variants: the phases, each phase's owning skill, the skills expected to run, the gates, the review
set per appetite and how reviewers, checkers and testers are recognised. It SHALL cite skills by
name (DEC-1, DEC-13). The file SHALL be the single source of the review set per appetite.

#### Scenario: The review set the band checks
- **WHEN** navigator checks a SMALL EPIC's reviewer count
- **THEN** it reads the count from the build-tier workflow file in `epic-delivery`

## MODIFIED Requirements

### Requirement: The loop scales with the appetite
The loop of a stage SHALL be Prepare, Build, Challenge, Decide and fix, Check, Merge, and the
Challenge and Check steps SHALL scale with the EPIC's appetite (align-agent-team-delivery DEC-7,
DEC-10) as the review set of the build-tier workflow file in `epic-delivery` states for each
appetite.
That file SHALL be the only statement of which review set each appetite gets; `epic-delivery`, its
references, `meaningfy-code-review`, `guardrails` and the docs SHALL point to it, and worked
examples and tests MAY illustrate it.

#### Scenario: A SMALL EPIC
- **WHEN** a SMALL EPIC's stage is built
- **THEN** one review pass covering spec and structure runs, and no checker or tester is dispatched

#### Scenario: A LARGE EPIC with screens
- **WHEN** a stage of a LARGE EPIC that changed screens is built
- **THEN** the adversarial tester, the five lenses and the UX lens run in parallel, followed by one fresh checker

#### Scenario: The scaling has one source
- **WHEN** a contributor looks up the review set of a MEDIUM EPIC in `epic-delivery`
- **THEN** the skill points to the build-tier workflow file, which states five lenses and a checker, and no table in the skill repeats it
