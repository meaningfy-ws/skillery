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
Challenge and Check steps SHALL scale with the EPIC's appetite as the review set of the
epic-delivery workflow file in `epic-delivery` states for each appetite: TINY and SMALL one run
L2+L3; MEDIUM two grouped runs (L1+L2, L3+L4+L5), also when a risk is recorded; LARGE and above
the same two grouped runs by default, and the five single lenses (with the UX lens when screens
changed) only when a risk is recorded for the stage, that is a `RISK-` row of the PLAN that names
the stage or its files, or a decision the lead records in Prepare. A grouped run SHALL report its
findings per lens id. The
checker and the cold reader SHALL be one subagent when the stage changed no how-to page, and two
when it did. The adversarial tester SHALL be opt-in: none at TINY and SMALL, and at MEDIUM and
above only when its condition holds. That file SHALL be the only statement of which review set
each appetite gets; `epic-delivery`, its references, `meaningfy-code-review`, `guardrails` and the
docs SHALL point to it, and worked examples and tests MAY illustrate it (DEC-3, D-4).

#### Scenario: A SMALL EPIC
- **WHEN** a SMALL EPIC's stage is built
- **THEN** one run through L2 and L3 reviews it, and no checker or tester is dispatched

#### Scenario: A MEDIUM stage with no recorded risk
- **WHEN** a MEDIUM stage that changed no how-to page is built and no risk is recorded for it
- **THEN** two grouped runs (L1+L2, L3+L4+L5) review it, each reporting per lens id, followed by one checker that also reads as the cold reader

#### Scenario: A MEDIUM stage with a recorded risk
- **WHEN** a `RISK-` row of the PLAN names a MEDIUM stage's files
- **THEN** the two grouped runs (L1+L2, L3+L4+L5) still review it, and the brief names the risk as a focus; five single lenses apply from LARGE up only

#### Scenario: A LARGE EPIC with screens
- **WHEN** a stage of a LARGE EPIC that changed screens is built with a recorded risk
- **THEN** the five lenses and the UX lens run as single-lens subagents, the tester on its condition, followed by the checker

#### Scenario: A small stage of a large EPIC
- **WHEN** a stage of a VERY LARGE EPIC adds 450 lines of low-risk change
- **THEN** the two grouped runs review it as the default, with no decision to record

#### Scenario: No small-stage allowance below LARGE
- **WHEN** a MEDIUM stage is small and low-risk
- **THEN** the default set already applies and no allowance or recorded decision is needed

#### Scenario: A stage that changed a how-to page
- **WHEN** a stage of any appetite above SMALL changed a how-to page
- **THEN** the checker and the cold reader run as two separate subagents

#### Scenario: The scaling has one source
- **WHEN** a contributor looks up the review set of a MEDIUM EPIC in `epic-delivery`
- **THEN** the skill points to the workflow file, which states the two grouped runs by default and the five lenses on a recorded risk from LARGE up, and no table in the skill repeats it

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
The full gates SHALL run once per stage, after the one fix pass and before the pull request; before
that the lead SHALL rely on the builders' task gates, and the fix pass SHALL re-run only the narrow
checks and the tests it touched, a failing test re-run until green. The lead SHALL run GitNexus at
two points of a stage: at stage start, `analyze` once and then `impact` on each task's symbols,
pasting the result (at most ten lines per task) into that task's brief; before the stage commit,
`analyze`, `detect_changes` and `impact` once. Builders and reviewers SHALL run no GitNexus tool;
the L5 lens SHALL take blast radius from the brief. A further run is allowed when a task's scope
moves, never per edit or per lens. A reviewer SHALL read the stage's gate report and SHALL NOT
re-run the suite. No workflow phase SHALL repeat a check of the stage loop (DEC-4, DEC-11, D-7).

#### Scenario: One fix after review
- **WHEN** the fix pass turns one test red and then green
- **THEN** only that test and the narrow checks are re-run, the full gates run once, then CI

#### Scenario: Impact and change check
- **WHEN** the lead prepares a stage with three tasks and later commits it
- **THEN** at start it runs `analyze` once and `impact` three times, each brief carrying its task's impact in at most ten lines; before the commit it runs `analyze`, `detect_changes` and `impact` once

#### Scenario: A builder wants the blast radius
- **WHEN** a builder needs the impact of a symbol it changes
- **THEN** it reads it from the brief and calls no GitNexus tool

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
recorded reason; the label, not the lens, decides, and the checker SHALL judge each re-label, a
disagreement going to the developer. A tester's test that failed on its first run for a finding
under the floor SHALL be deleted with the reason "under the floor". A stage SHALL have one fix
pass: the accepted findings fixed in one batch, then the full gates once and CI. The fix pass SHALL
be one fixer whose brief carries `max_red_runs` (the PLAN MAY set it; default 3) and "one pass"; at
the bound the fixer SHALL stop and return the base report with `result: blocked`, the failing check
verbatim in one line, its hypothesis and what it tried in at most five lines. The lead SHALL then
choose one of two options: a fresh fixer briefed with that report, or one question round to the
developer with a recommendation per question; a third fixer SHALL NOT be dispatched on the same
finding. An item the checker finds unmet, and a finding that arrives after the fix pass, SHALL go
to the developer in the question format with a recommendation and SHALL NOT start a second fix
pass; the one exception is the developer's word to fix it now, by one fixer and one full-gates run.
A red CI run or a refused merge SHALL NOT be a review round: only that failure is fixed and no new
finding is accepted (DEC-4, DEC-12, D-5).

#### Scenario: A Warning is rejected
- **WHEN** a reviewer reports a Warning
- **THEN** the lead rejects it as "under the floor" and lists it in `design.md` under `## Delivery decisions`

#### Scenario: A Warning re-labelled
- **WHEN** the lead judges a Warning to be Critical
- **THEN** it re-labels it with a recorded reason and the finding is fixed in the one pass

#### Scenario: A tester test under the floor
- **WHEN** an adversarial test failed on its first run for a finding under the floor
- **THEN** the test is deleted with the reason "under the floor"

#### Scenario: The fixer reaches the bound
- **WHEN** a fixer's third gate run is red and the brief set no `max_red_runs`
- **THEN** it stops, and its report ends `result: blocked` with the failing check in one line, its hypothesis and what it tried in five lines at most

#### Scenario: A fresh fixer is also blocked
- **WHEN** the fresh fixer briefed with a `blocked` report returns `blocked` again
- **THEN** the lead asks the developer in one question round with a recommendation and dispatches no third fixer

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
- **THEN** only that failure is fixed, the hand-over note is re-committed last, and no new review finding is accepted

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
One session SHALL deliver one EPIC. The lead SHALL apply a light chore itself: a finding that
changes at most ten lines in files the lead has already read in this stage and needs no new test,
applied with Edit, the commit body naming it as `lead-fixed: <finding id>`. Every other finding
SHALL be a fixer brief. The lead SHALL run independent spawns in one message, and every brief
SHALL end with the report shape: the base report, its purpose extension and the line cap from
`session-thresholds.json`. The lead SHALL compact at a safe point once its context passes
`compact_offer_tokens`. The lead SHALL read a builder's diff as `git diff --stat` and spot-check
the files the report names; the checker reads the diff in full. The lead SHALL read several known
files in one call, and reading that would cross more than a few files SHALL go to an exploring
subagent (DEC-7, DEC-13, D-6, D-8).

#### Scenario: A one-line fix
- **WHEN** a finding changes one line of a file the lead read this stage and needs no new test
- **THEN** the lead applies it with Edit and the commit body carries `lead-fixed: <finding id>`

#### Scenario: A finding that needs a test
- **WHEN** a finding changes six lines but needs a new test
- **THEN** the lead briefs a fixer and does not edit the file itself

#### Scenario: Three independent builders
- **WHEN** a stage has three tasks that share no file
- **THEN** the lead dispatches the three builders in one message, each brief ending with the report shape and its line cap

#### Scenario: Context past the compaction offer
- **WHEN** the lead's context passes `compact_offer_tokens` during a stage
- **THEN** it compacts at the next safe point, after a commit, not mid-step

#### Scenario: Reading several known files
- **WHEN** the lead needs four known files
- **THEN** it reads them in one call

#### Scenario: Wide reading
- **WHEN** an answer needs reading across many files
- **THEN** the lead hands it to an exploring subagent

### Requirement: A pull request is watched and merged by one command
The Merge step SHALL hand the wait to one command: by default one background command
`gh pr checks <n> --watch --fail-fast && gh pr checks <n> --json bucket -q 'length > 0 and all(.[]; .bucket == "pass" or .bucket == "skipping")' | grep -qx true && gh pr merge <n> --merge --delete-branch`,
started once the pull request lists its first check run and awaited by its completion notice
only. The middle guard SHALL stand between the watch and the merge, because `gh pr checks
--watch` exits 0 when no check is registered yet and when a run is cancelled by a newer push: the
merge runs only when the pull request lists at least one check and every check passed or was
skipped. At step 6 only, after the hand-over note is committed and the approval (or the grant) is
given, and where the repository has required checks, `gh pr merge <n> --auto --merge
--delete-branch` MAY run in its place, so that the platform merges when the checks pass. The
`--auto` form SHALL NOT run when the pull request opens. The lead SHALL NOT re-read a running
task's output. On a non-zero exit the lead SHALL first run `gh pr view <n> --json
state,mergeStateStatus` and `gh pr checks <n>` to tell a red check, a check not yet registered or
still running, a refused merge and a merge already done. The merge method SHALL follow the
repository's own. Without the developer's grant for the EPIC, the developer SHALL approve the
merge before the command runs (lean-delivery D-23). A fix after a red check SHALL be committed
before the hand-over note, the note re-committed as the last commit, and the command run again
(lean-delivery DEC-6, D-7, D-24; issues #283, #337).

#### Scenario: Green checks
- **WHEN** at step 6 the hand-over note is committed, the approval or grant is given, and the repository has required checks
- **THEN** the lead runs `gh pr merge <n> --auto --merge --delete-branch` once, in place of the watch-and-merge command, and the platform merges and deletes the branch when the checks pass

#### Scenario: No auto-merge
- **WHEN** the repository has no auto-merge and the pull request lists its first check run
- **THEN** the lead starts the one background watch-and-merge command and its notice is the only wait

#### Scenario: A running watch
- **WHEN** the background command is still running
- **THEN** the lead reads none of its output until the completion notice arrives

#### Scenario: No check registered yet
- **WHEN** the command starts before the pull request lists any check run, and the watch exits 0 at once
- **THEN** the guard finds no check, nothing is merged, the command exits non-zero, and the lead starts it again once a check is listed

#### Scenario: A run cancelled by a newer push
- **WHEN** the hand-over note is pushed while CI runs, the first run is cancelled and the watch exits 0 before the new run reports
- **THEN** the guard finds the new head commit's checks missing or pending, nothing is merged, and the command exits non-zero

#### Scenario: No merge authority granted
- **WHEN** the developer has granted no merge authority for the EPIC
- **THEN** the lead asks the developer to approve the merge before either command runs

#### Scenario: A red check
- **WHEN** a check fails
- **THEN** nothing is merged and the lead reads the pull request's state and the failing check

#### Scenario: A fix after a red check
- **WHEN** a check fails and that failure is fixed
- **THEN** the fix is committed, the hand-over note is re-committed as the last commit, and the command runs again

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

### Requirement: A stage's adversarial tests are distilled before the stage merges
The tester's report SHALL name, for each new adversarial test, the scenario or error-matrix row it
attacks and whether it failed on its first run. In step 4 of the stage loop (Decide and fix),
after the lead has decided the findings, the builder of the stage's one fix pass SHALL sort them by this
rule and return the kept and the deleted list, and the lead SHALL confirm the lists. The
builder's report SHALL also list the refactoring opportunities it saw while sorting; it SHALL
implement none of them, and they SHALL NOT widen the stage. Kept: a test that failed on its first run and whose finding was accepted, a
test that alone covers a scenario or an error-matrix row, and one property per invariant the
PLAN's design names. Every other test SHALL be deleted in that pass, before the gate run that
checks it, and listed in the stage's pull request with its reason. The sort SHALL NOT add a fix
pass or a gate run to the stage. The severity floor of `delivery-process-and-tools` DEC-4 applies
to the tester's findings: a test that failed on its first run and whose finding is under the
floor SHALL be deleted with the reason "under the floor". When no finding is above the floor, the
sort SHALL be the whole fix pass. A deletion the lead does not confirm SHALL be restored by the
builder in the same pass. Kept tests SHALL be in
files named by feature (test-suite-care DEC-3, revised 2026-11-14; design D-12, D-35, D-38, D-46;
delivery-process-and-tools DEC-4).

#### Scenario: Deciding a stage's adversarial tests
- **WHEN** the lead decides the findings of a stage whose tester wrote forty adversarial tests, three of which found a defect
- **THEN** the builder of the stage's one fix pass moves those three and any that alone cover a scenario into files named by feature, returns the kept and the deleted list with a reason per dropped test, and the lead confirms the lists before the gate run that checks the pass

#### Scenario: A test that attacks nothing named
- **WHEN** the tester's report gives "none" as the scenario of a test that passed on its first run
- **THEN** the builder lists it as deleted, unless it is the one property kept for an invariant the PLAN's design names

#### Scenario: A refactoring opportunity seen while sorting
- **WHEN** the builder sees, while sorting, that four of the kept tests repeat the same set-up
- **THEN** its report lists that as a refactoring opportunity, and it changes nothing beyond moving the kept tests

#### Scenario: A finding under the floor
- **WHEN** a tester's test failed on its first run and its finding is under the severity floor
- **THEN** the test is deleted and the pull request gives "under the floor" as its reason

#### Scenario: A stage with no finding above the floor
- **WHEN** every finding of a stage is under the floor
- **THEN** the sort is the whole of the stage's fix pass, and the gate run checks it

#### Scenario: A deletion the lead does not confirm
- **WHEN** the lead does not confirm a deletion on the builder's deleted list
- **THEN** the builder restores that test in the same pass, and no second pass follows

#### Scenario: A rejected finding
- **WHEN** a tester's test failed on its first run and the lead rejects its finding as not a defect
- **THEN** the test is deleted and the pull request gives the rejection as its reason

### Requirement: Findings are grouped by place before the floor
In step 4 the lead SHALL group the findings of all reviewers and the tester by `file:line` before
deciding them, so that one defect raised by several lenses is decided once, under the highest
severity any lens gave it (issue #145).

#### Scenario: One line raised by three lenses
- **WHEN** L3, L4 and L5 each raise the same single-line simplification, one of them as a Warning
- **THEN** the lead records one decision for it, at Warning, naming the three finding ids

