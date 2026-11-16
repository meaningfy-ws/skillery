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
appetite. A MEDIUM stage SHALL take the small set by default, two reviewers (L1 with L2; L3 with
L4 and L5), and the five lenses SHALL run only when a risk is recorded for the stage, that is a
`RISK-` row of the PLAN that names the stage or its files, or a decision the lead records in
Prepare (DEC-5, D-4). For LARGE and above, the file SHALL also state a small-stage set: when a
stage's added lines are at or under its limit and the lead judges the risk low, the lenses MAY run
as two merged reviewers, provided the lead records the choice as a decision under
`## Delivery decisions` in the change's `design.md`, a section whose edits do not make the PLAN's
gates stale; the adversarial tester and the checker SHALL stay separate (navigator-follows-the-work
DEC-12, #148). The adversarial tester SHALL be none at TINY and SMALL and SHALL run on its
condition at MEDIUM and above (DEC-3, D-5). That file SHALL be the only statement of which review
set each appetite and stage size gets; `epic-delivery`, its references, `meaningfy-code-review`,
`guardrails` and the docs SHALL point to it, and worked examples and tests MAY illustrate it.

#### Scenario: A SMALL EPIC
- **WHEN** a SMALL EPIC's stage is built
- **THEN** one review pass covering spec and structure runs, and no checker or tester is dispatched

#### Scenario: A MEDIUM stage with no recorded risk
- **WHEN** a MEDIUM stage is built and no risk is recorded for it
- **THEN** two reviewers run (L1 with L2, L3 with L4 and L5), followed by one fresh checker, with no justification to record

#### Scenario: A MEDIUM stage with a recorded risk
- **WHEN** a `RISK-` row of the PLAN names the stage or its files
- **THEN** the five lenses run, followed by one fresh checker

#### Scenario: A LARGE EPIC with screens
- **WHEN** a stage of a LARGE EPIC that changed screens is built
- **THEN** the five lenses and the UX lens run in parallel, with the adversarial tester when its condition holds, followed by one fresh checker

#### Scenario: A small stage of a large EPIC
- **WHEN** a stage of a VERY LARGE EPIC adds 450 lines of low-risk change and the lead records a decision to merge the lenses
- **THEN** two reviewers run (L1 with L2, L3 with L4 and L5), followed by the adversarial tester's (on its condition) and the checker's separate runs

#### Scenario: No small-stage allowance below LARGE
- **WHEN** a MEDIUM stage is small and low-risk
- **THEN** the default set already applies and no allowance or recorded decision is needed

#### Scenario: The scaling has one source
- **WHEN** a contributor looks up the review set of a MEDIUM EPIC in `epic-delivery`
- **THEN** the skill points to the epic-delivery workflow file, which states the small set by default and the five lenses on a recorded risk, and no table in the skill repeats it

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
The full gates SHALL run once per stage before the PR and once after the one fix pass; after a red
run only the failing tests SHALL be re-run until green (DEC-4). The lead SHALL run the impact check once per task, before the brief, on the task's
symbols, and the change check once before the task's commit (DEC-11, D-15). A reviewer SHALL read
the stage's gate report and SHALL NOT re-run the suite. No workflow phase SHALL repeat a check of
the stage loop (lean-delivery DEC-5).

#### Scenario: One fix after review
- **WHEN** a stage's review leads to one fix that turns a test red and then green
- **THEN** only that test is re-run until green, then the full gates run once, then CI

#### Scenario: Impact and change check
- **WHEN** the lead briefs a builder for a task
- **THEN** it has run the impact check once on the task's symbols before the brief, and runs the change check once before the task's commit, and the builder runs neither

### Requirement: Docs have two homes
Docs a change makes false SHALL be fixed within the build stage that made them false, before its PR, and the L2 review lens
SHALL check that changed docs agree with the code. Manuals and architecture pages SHALL be brought
up to date in a docs stage, the last stage before archive, run through `technical-writing`'s
documentation workflow when the EPIC changed a use case, the architecture, installation or
user-facing behaviour; otherwise the lead SHALL record "no docs owed" (lean-delivery DEC-9).

#### Scenario: No docs owed
- **WHEN** an accepted EPIC changed none of a use case, the architecture, installation or user-facing behaviour
- **THEN** the lead records "no docs owed" in `evidence/docs-owed.md` and archives without a docs stage

### Requirement: Verification and validation are defined in test-strategy
`epic-delivery` SHALL NOT define verification and validation nor hold the V-model table; it SHALL
point to `test-strategy` for both and keep the acceptance demo, the validation review, the evidence
folder and the provisional steps (test-strategy DEC-4, design D-4).

#### Scenario: Looking up verification versus validation during a delivery
- **WHEN** a lead looks up what "validation" means in `epic-delivery`
- **THEN** a pointer leads to `test-strategy`, and the acceptance demo procedure is still in `epic-delivery`

### Requirement: The lead marks phase and stage
`epic-delivery` SHALL define the mark line once, in the form
`mark: change=<id> phase=<shape|plan|deliver> stage=<n|->`, beside the result line. The lead SHALL
write it in its own message at the start of each delivery stage, and a session that carries on from
a hand-over note SHALL write it before its first brief (proposal DEC-2, DEC-3). The mark SHALL stand
as a whole line, not inside a code block or a tool input, and a turn that dispatches a worker SHALL
repeat it in its last message (design D-22).

#### Scenario: A stage starts
- **WHEN** the lead starts stage 2 of change `x`
- **THEN** it writes `mark: change=x phase=deliver stage=2` before it briefs a worker

#### Scenario: A session resumes from a hand-over note
- **WHEN** a new session picks up a change from its hand-over note
- **THEN** the lead writes the mark line for the current stage before its first brief

#### Scenario: The turn that briefs a worker ends
- **WHEN** the lead's turn dispatches a worker
- **THEN** the turn's last message holds the mark line again, as a whole line

### Requirement: A stage ends with a hand-over note and a fresh session
The lead SHALL write `openspec/changes/<id>/handover.md` as the last commit of the stage's pull
request, after the check and before the watch-and-merge command, so that it reaches `develop` with
the merge; it SHALL end the session after the merge, and the developer SHALL start the next stage
in a fresh session with the prompt the note ends with. The lead SHALL NOT compact between stages.
The note SHALL have five headings and nothing else: Done, Decided since the PLAN (the `D-n` ids
only), Open, Next and Prompt, last. It SHALL point to `design.md` and SHALL NOT copy decisions from
it. The template SHALL live once, as the file `skills/epic-delivery/assets/templates/handover.md`;
the stage loop, `epic-planning` and `guardrails` SHALL point to it (DEC-1, D-1).

#### Scenario: The end of a stage
- **WHEN** a stage's check has passed
- **THEN** the lead commits `handover.md` with the five headings as the last commit of the pull request, before the watch-and-merge command, and ends the session after the merge, without compacting

#### Scenario: A fresh session starts the next stage
- **WHEN** a new session is given only the note's prompt and the change folder
- **THEN** it reaches its first brief without asking what was decided and without reading `inputs/` or archived changes

#### Scenario: A note that copies the design
- **WHEN** a new session is started from a note that restates decisions of `design.md`
- **THEN** the cold-start record notes it and the note template is cut to `D-n` ids and pointers

### Requirement: Findings pass a severity floor and a stage has one fix pass
A review finding SHALL become a fix only when it is Critical on the scale of `meaningfy-code-review`.
Findings under the floor SHALL be rejected with the reason "under the floor" and listed, one line
each, under `## Delivery decisions` in `design.md`. A lead MAY re-label a finding Critical with a
recorded reason; the label, not the lens, decides, and the checker SHALL judge each re-label
(agree or not, one line), a disagreement going to the developer. A tester's test that failed on its first run for
a finding under the floor SHALL be deleted with the reason "under the floor". A stage SHALL have one
fix pass: the accepted findings fixed in one batch, then the full gates once and CI. An item the
checker finds unmet SHALL go to the developer in the question format, with a recommendation (fix it
now as a recorded decision, or a follow-up issue), and SHALL NOT start a second fix pass; the one
exception is the developer's word to fix it now, by one fixer and one full-gates run, accepting
nothing else. Findings that arrive after the fix pass, such as a late tester run, SHALL go to the
developer the same way. A red CI run or a refused merge SHALL NOT be a review round: only that
failure is fixed and no new finding is accepted on the way (DEC-4, D-2, D-3).

#### Scenario: A Warning is rejected
- **WHEN** a reviewer reports a Warning
- **THEN** the lead rejects it as "under the floor" and lists it in `design.md` under `## Delivery decisions`

#### Scenario: A Warning re-labelled
- **WHEN** the lead judges a Warning to be Critical
- **THEN** it re-labels it with a recorded reason and the finding is fixed in the one pass

#### Scenario: A tester test under the floor
- **WHEN** an adversarial test failed on its first run for a finding under the floor
- **THEN** the test is deleted with the reason "under the floor"

#### Scenario: The checker finds an unmet item
- **WHEN** the checker finds an item of the fix pass unmet
- **THEN** the lead sends it to the developer in the question format with a recommendation, and starts no second fix pass

#### Scenario: The checker disagrees with a re-label
- **WHEN** the checker does not agree that a re-labelled Warning is Critical
- **THEN** the lead sends the re-label to the developer and the floor stands until the developer decides

#### Scenario: A late tester finding
- **WHEN** the tester's report arrives after the fix pass
- **THEN** its findings go to the developer as an unmet item does, and no second fix pass starts

#### Scenario: A red CI run
- **WHEN** CI is red after the fix pass or the merge is refused
- **THEN** only that failure is fixed, the full gates run once, the hand-over note is re-committed last, and no new review finding is accepted

### Requirement: The adversarial tester runs on its condition
The adversarial tester SHALL NOT run at TINY or SMALL. At MEDIUM and above, when the PLAN has an
`## Invariants` section, it SHALL run when the stage changed code and a row of that section for
that code has the tester as its test (its Test cell starts with `tester`). A PLAN without an
`## Invariants` section SHALL keep today's rule: the tester on every stage from LARGE up, none
below. In Prepare the lead SHALL judge the condition and record the answer in one line of the PR
body. This requirement and the stage loop's Prepare SHALL be the one definition of the condition;
the workflow file's `tester` wording SHALL only point to Prepare (DEC-3, D-5).

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

### Requirement: A challenge or check result ends in one line
The report of a tester, a reviewer and the checker SHALL end in one result line, so that a script
can read what a round found. The worker SHALL write it with `accepted=-`; the lead SHALL write it
again under a `Results` heading in the stage's pull request with the number accepted. A report
without the line is incomplete and the lead SHALL return it without re-running anything. This
requirement SHALL be the one definition of the line (DEC-18, D-6):

```text
result: stage=<s> role=tester tests=<n> failed-first=<n> findings=<n> accepted=<n|->
result: stage=<s> role=reviewer lens=<L1+L2> findings=<n> accepted=<n|->
result: stage=<s> role=checker verdict=<pass|fail> findings=<n> accepted=<n|->
```

#### Scenario: A reviewer report
- **WHEN** a reviewer finishes
- **THEN** its report ends with its `role=reviewer` line and `accepted=-`

#### Scenario: The lead writes the lines again
- **WHEN** the lead has decided which findings to accept
- **THEN** the pull request body holds each line with `accepted=<n>` under `Results`

#### Scenario: A report with no result line
- **WHEN** a worker's report ends without the line
- **THEN** the lead returns it as incomplete and re-runs no gate

### Requirement: The lead stays small
One session SHALL deliver one EPIC. The lead SHALL NOT take a builder's task, even a one-line one;
a one-line fix SHALL be a fixer brief. The lead SHALL read several known files in one call, and
reading that would cross more than a few files SHALL go to an exploring subagent (DEC-7, D-8).

#### Scenario: A one-line fix
- **WHEN** a finding needs a one-line change
- **THEN** the lead briefs a fixer and does not edit the file itself

#### Scenario: Reading several known files
- **WHEN** the lead needs four known files
- **THEN** it reads them in one call

#### Scenario: Wide reading
- **WHEN** an answer needs reading across many files
- **THEN** the lead hands it to an exploring subagent

### Requirement: A pull request is watched and merged by one command
The Merge step SHALL watch and merge the pull request with one command run in the background, and
its completion notice SHALL be the only wait: `gh pr checks <n> --watch --fail-fast && gh pr merge
<n> --merge --delete-branch`. The lead SHALL start it only after the pull request lists its first
check run. On a non-zero exit the lead SHALL first run `gh pr view <n> --json
state,mergeStateStatus` to tell a red or missing check, a refused merge, and a merge done with
only the local branch left. The merge method SHALL follow the repository's own. The Merge step SHALL
run within the lead's authority: without the developer's grant for the EPIC, the developer SHALL
approve the merge before the command runs (D-23). A fix after a red check SHALL be committed before
the hand-over note, the note SHALL be re-committed as the last commit, and the command SHALL run
again (D-24) (DEC-6, D-7).

#### Scenario: Green checks
- **WHEN** the pull request's checks pass
- **THEN** the one command merges it and deletes the branch, and its notice is the only wait

#### Scenario: A red check
- **WHEN** a check fails
- **THEN** the command exits non-zero, nothing is merged and the lead reads the pull request's state and the failing check

#### Scenario: No check registered yet
- **WHEN** the pull request lists no check run
- **THEN** the lead does not start the command until one is listed

#### Scenario: No merge authority granted
- **WHEN** the developer has granted no merge authority for the EPIC
- **THEN** the lead asks the developer to approve the merge before starting the command

#### Scenario: A fix after a red check
- **WHEN** a check fails and that failure is fixed
- **THEN** the fix is committed, the hand-over note is re-committed as the pull request's last commit, and the command runs again

### Requirement: An epic session starts from a gated PLAN
An epic session SHALL start from a PLAN that is already gated and SHALL plan nothing. The Sessions
table SHALL NOT list "the PLAN finished and gated" as epic-session output, and the Planner row of
the team SHALL read "Shaping only (an `epic-planner` session)". The `ready` phase of the delivery
workflow SHALL stay and SHALL check that the PLAN arrived gated; the `apply` phase SHALL NOT list
`clarity` among its gates, because gate state is per session and a fresh delivery session would be
pushed toward a third clarity run (DEC-19, D-17).

#### Scenario: A session opens on a gated PLAN
- **WHEN** a lead opens an epic session
- **THEN** it reads the gated PLAN and starts Stage 1's Prepare, and derives no PLAN

#### Scenario: A fresh session at the apply phase
- **WHEN** a fresh delivery session reaches the `apply` phase of a PLAN gated in an earlier session
- **THEN** the band does not warn that the clarity gate has not run

#### Scenario: A PLAN that is not gated
- **WHEN** the `ready` phase finds the PLAN not gated
- **THEN** the epic session does not start and the change returns to shaping

