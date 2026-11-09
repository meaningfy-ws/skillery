# epic-delivery Specification

## Purpose
How a gated PLAN is delivered by a lean agent team: the main session leads and alone talks to the
developer, the loop of a stage scales with the EPIC's appetite, people validate once per EPIC, and a
library gap is handled by who owns the library.
## Requirements
### Requirement: One lead talks to the developer
In an epic session the main session SHALL act as the lead: it alone SHALL talk to the developer,
record decisions, write briefs, read each diff and each member's report, commit, file issues in our
libraries, keep the spine and docs current and archive the change. A member subagent SHALL NOT ask
the developer, commit or file an issue; it SHALL report what it needs to the lead (DEC-1, DEC-5).
Open questions SHALL go to the developer together in one round, unless an answer changes the next
question (lean-delivery DEC-6).

#### Scenario: A member needs a decision
- **WHEN** a builder meets an open decision during its task
- **THEN** it reports the question to the lead and does not ask the developer
- **AND** the lead asks the developer with each term explained, the options, and one recommended

#### Scenario: Several open questions
- **WHEN** the lead holds three open questions, none depending on another's answer
- **THEN** it asks them in one round

### Requirement: The loop scales with the appetite
The loop of a stage SHALL be Prepare, Build, Challenge, Decide and fix, Check, Merge, and the
Challenge and Check steps SHALL scale with the EPIC's appetite (align-agent-team-delivery DEC-7,
DEC-10) as the review set of the epic-delivery workflow file in `epic-delivery` states for each
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
- **THEN** the skill points to the epic-delivery workflow file, which states five lenses and a checker, and no table in the skill repeats it

### Requirement: People validate once per EPIC
Scenario sign-off SHALL happen once per EPIC at the PLAN gate and again only for a changed
scenario. The acceptance demo SHALL be offered once per EPIC that delivers or changes a use case,
after its last build stage and before the docs stage and the archive. Below LARGE the developer MAY
skip it, and the skip (who, why, date) SHALL be recorded in `evidence/acceptance.md`; at LARGE,
VERY LARGE and HUGE it SHALL run. Agents SHALL NOT mark a validation step as done on the
developer's behalf. The demo is provisional until its first run is recorded; the validation review
stays provisional until an iteration ends (lean-delivery DEC-8).

#### Scenario: Acceptance after the last stage
- **WHEN** the last build stage of a LARGE EPIC that delivers a use case is merged
- **THEN** the lead demonstrates it against the success measure and records the developer's verdict in `evidence/acceptance.md` before the docs stage and the archive

#### Scenario: A SMALL EPIC's demo is skipped
- **WHEN** the developer skips the demo of a SMALL EPIC that changed a use case
- **THEN** `evidence/acceptance.md` records who skipped it, why and when, and the lead archives

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

### Requirement: The delivery workflow is data
`epic-delivery` SHALL host the epic-delivery workflow file, with its brownfield variant (apply,
accept, archive): the phases ready, apply, accept and archive, each phase's owning skill, the skills expected to run, the gates,
the review set per appetite and how reviewers, checkers and testers are recognised. Its full-gates
gate SHALL be named `full-gates` and SHALL match the target `project-setup` scaffolds; a repository
SHALL set its own command through `extends`. It SHALL cite skills by name (DEC-1, DEC-13;
lean-delivery DEC-13, DEC-16). The file SHALL be the single source of the review set per appetite.

#### Scenario: The review set the band checks
- **WHEN** navigator checks a SMALL EPIC's reviewer count
- **THEN** it reads the count from the epic-delivery workflow file in `epic-delivery`

#### Scenario: Acceptance is a phase
- **WHEN** every task of a change is ticked
- **THEN** the band shows `accept`, and the phase's gate passes when `evidence/acceptance.md` is written

### Requirement: Builders own their quality
A builder SHALL work test-first, run the project's narrow checks while working and its task gate
once before reporting, and SHALL report each gate run with its command, exit code, test counts and
duration. The lead SHALL read the diff and the report and SHALL re-run a gate only when the report
is incomplete or contradicts the diff, when parallel builders touched a shared file, or after a fix
round, naming the trigger in the commit body (lean-delivery DEC-4).

#### Scenario: A complete report
- **WHEN** a builder's report names every gate run with its fields and agrees with the diff
- **THEN** the lead commits the task without re-running any gate

#### Scenario: A report that contradicts the diff
- **WHEN** the diff adds two tests and the reported count is unchanged
- **THEN** the lead re-runs the task gate and the commit body names the trigger

### Requirement: Each check runs once, at its moment, with one owner
`epic-delivery` SHALL list every check of a delivery in one table with its moment and its owner.
The full gates SHALL run once per stage before the PR and once after the fix round; after a red
run only the failing tests SHALL be re-run until green. A reviewer SHALL read the stage's gate
report and SHALL NOT re-run the suite. No workflow phase SHALL repeat a check of the stage loop
(lean-delivery DEC-5).

#### Scenario: One fix after review
- **WHEN** a stage's review leads to one fix that turns a test red and then green
- **THEN** only that test is re-run until green, then the full gates run once, then CI

### Requirement: Docs have two homes
Docs a change makes false SHALL be fixed within the build stage that made them false, before its PR, and the L2 review lens
SHALL check that changed docs agree with the code. Manuals and architecture pages SHALL be brought
up to date in a docs stage, the last stage before archive, run through `technical-writing`'s
documentation workflow when the EPIC changed a use case, the architecture, installation or
user-facing behaviour; otherwise the lead SHALL record "no docs owed" (lean-delivery DEC-9).

#### Scenario: No docs owed
- **WHEN** an accepted EPIC changed none of a use case, the architecture, installation or user-facing behaviour
- **THEN** the lead records "no docs owed" in `evidence/docs-owed.md` and archives without a docs stage

