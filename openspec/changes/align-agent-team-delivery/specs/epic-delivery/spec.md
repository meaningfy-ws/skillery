## ADDED Requirements

### Requirement: One lead talks to the developer
In an epic session the main session SHALL act as the lead: it alone SHALL talk to the developer,
record decisions, write briefs, re-run the gates after each task, read each diff, commit, file
issues in our libraries, keep the spine and docs current and archive the change. A member subagent
SHALL NOT ask the developer, commit or file an issue; it SHALL report what it needs to the lead
(DEC-1, DEC-5).

#### Scenario: A member needs a decision
- **WHEN** a builder meets an open decision during its task
- **THEN** it reports the question to the lead and does not ask the developer
- **AND** the lead asks the developer with each term explained, the options, and one recommended

### Requirement: The loop scales with the appetite
The loop of a stage SHALL be Prepare, Build, Challenge, Decide and fix, Check, Merge, and the
Challenge and Check steps SHALL scale with the EPIC's appetite: TINY and SMALL run one combined
review pass and no separate checker; MEDIUM runs the five review lenses and one checker per stage;
LARGE and larger add the adversarial tester and, when screens changed, the UX lens (DEC-7, DEC-10).

#### Scenario: A SMALL EPIC
- **WHEN** a SMALL EPIC's stage is built
- **THEN** one review pass covering spec and structure runs, and no checker or tester is dispatched

#### Scenario: A LARGE EPIC with screens
- **WHEN** a stage of a LARGE EPIC that changed screens is built
- **THEN** the adversarial tester, the five lenses and the UX lens run in parallel, followed by one fresh checker

### Requirement: People validate once per EPIC
Scenario sign-off SHALL happen once per EPIC at the PLAN gate and again only for a changed
scenario; the acceptance demo SHALL happen once per EPIC that delivers or changes a use case,
after its last stage and before archive, with its verdict in `evidence/`. Agents SHALL NOT mark a
validation step as done on the developer's behalf. Both steps are provisional until first run (DEC-9).

#### Scenario: Acceptance after the last stage
- **WHEN** the last stage of an EPIC that delivers a use case is merged
- **THEN** the lead demonstrates it against the success measure and records the developer's verdict in `evidence/acceptance.md` before archiving

### Requirement: Dependencies are handled by ownership
A shortcoming in one of our libraries SHALL stop the affected task, be reported upstream as an
issue and SHALL NOT be worked around. A shortcoming in an external library SHALL be resolved by a
decision recorded in `design.md` among contributing upstream, forking and releasing from the
Meaningfy GitHub, or a local workaround isolated in one adapter with a removal issue; the developer
decides on the lead's recommendation (DEC-8).

#### Scenario: Our library lacks a capability
- **WHEN** a builder finds that a Meaningfy library lacks a needed capability
- **THEN** the task is marked blocked by the upstream issue and no workaround is written

#### Scenario: An external library lacks a capability
- **WHEN** an external library lacks a needed capability
- **THEN** the lead records the three options with a recommendation in `design.md` before any code, and the developer chooses
