## MODIFIED Requirements

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

### Requirement: A pull request is watched and merged by one command
The Merge step SHALL hand the wait to one command: by default one background command `gh pr checks
<n> --watch --fail-fast && gh pr merge <n> --merge --delete-branch`, started once the pull request
lists its first check run and awaited by its completion notice only; at step 6 only, after the
hand-over note is committed and the approval (or the grant) is given, and where the repository has
required checks, `gh pr merge <n> --auto --merge --delete-branch` in its place, so that the platform
merges when the checks pass. The `--auto` form SHALL NOT run when the pull request opens. The lead SHALL NOT re-read a running task's output. On a
non-zero exit the lead SHALL first run `gh pr view <n> --json state,mergeStateStatus` to tell a red
check, a refused merge and a merge already done. The merge method SHALL follow the repository's
own. Without the developer's grant for the EPIC, the developer SHALL approve the merge before the
command runs (lean-delivery D-23). A fix after a red check SHALL be committed before the hand-over note, the note
re-committed as the last commit, and the command run again (lean-delivery DEC-6, D-7, D-24).

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
- **WHEN** the repository has no auto-merge and the pull request lists no check run
- **THEN** the lead does not start the watch command until one is listed

#### Scenario: No merge authority granted
- **WHEN** the developer has granted no merge authority for the EPIC
- **THEN** the lead asks the developer to approve the merge before either command runs

#### Scenario: A red check
- **WHEN** a check fails
- **THEN** nothing is merged and the lead reads the pull request's state and the failing check

#### Scenario: A fix after a red check
- **WHEN** a check fails and that failure is fixed
- **THEN** the fix is committed, the hand-over note is re-committed as the last commit, and the command runs again
