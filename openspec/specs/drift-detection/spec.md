# drift-detection Specification

## Purpose
How the `navigator` mod tells a person that the work has left its workflow (process drift: a skill or gate of the phase skipped, or run in the wrong phase) or its PLAN (plan drift: files changed that no task names, tasks ticked whose files did not change), how a deviation is accepted with a reason, and what strict mode blocks. Archived from the `navigator` change (2026-11-09).
## Requirements
### Requirement: Process drift
The mod SHALL warn when the active workflow is not respected: an expected skill or gate of the
phase did not run, a skill ran that belongs to another phase, or an external skill did a job a
Meaningfy skill owns. Each warning SHALL name its owning skill and, where one exists, the command
that puts the work back in line (DEC-8).

#### Scenario: A commit during apply without test-driven development
- **WHEN** a commit succeeds during apply and `test-driven-development` has not run in that phase
- **THEN** a process-drift warning names the missing skill and offers *Back on track*

#### Scenario: A DevOps apply without an answered consent card
- **WHEN** an infrastructure apply command runs in a DevOps intervention and no consent card was answered before it
- **THEN** a process-drift warning names the missing consent

### Requirement: Subagent rules
The mod SHALL warn when the subagent rules of `guardrails` and the review set of `epic-delivery`
are broken: a spawn that did not pay, a model above the caller's for an agent that declares no
model of its own, more reviewers than the appetite calls for, and a missing second check. An agent's
declared model SHALL never be flagged or rewritten where the spawn event shows it; where it does
not, an explicit `model` above the caller's is treated as undeclared, a recorded shortcut (DD-40.4).
The model order SHALL come from the guardrails data file.

#### Scenario: A MEDIUM EPIC without a checker
- **WHEN** a MEDIUM EPIC ran five review lenses and opens its PR with no checker spawned since
- **THEN** the band shows "second check missing"

#### Scenario: A SMALL EPIC with five lenses
- **WHEN** a SMALL EPIC spawns five reviewers in one turn
- **THEN** the band shows "over-spawn"

### Requirement: Plan drift
The mod SHALL warn when what was built differs from the EPIC and PLAN: a changed file no task or
design names, a ticked task whose named files did not change, a decision in code that `design.md`
does not record. *Archive check* SHALL fail while a plan-drift warning is open and not recorded as a
deviation (DEC-8).

#### Scenario: A file changed outside every task
- **WHEN** the branch changes a file that no task, design or proposal text names
- **THEN** a plan-drift warning names the file and offers *Reconcile EPIC*
- **AND** *Archive check* fails until the PLAN names it or the deviation is recorded

### Requirement: Deviations are recorded in the change
*Accept deviation* SHALL record the warning's key, the date and the person's reason in the change,
once per key; *Archive check* SHALL then pass for that warning and list the deviation.

#### Scenario: Accepting a deviation
- **WHEN** a person accepts a plan-drift warning with a reason
- **THEN** the reason is recorded in the change and *Archive check* passes, listing the deviation

### Requirement: Hygiene
The mod SHALL offer *compact now* only at a safe point (a commit that closes a phase or a task
group), and *fresh session* only at a task boundary (a commit, a merged PR or an archived change)
or after an idle gap with a clean working tree; it SHALL offer neither mid-step. It SHALL use the thresholds and the definitions of safe
point, task boundary and idle reset that `guardrails` states as data; the mod SHALL hold no
threshold or definition of its own.

#### Scenario: High context at a phase boundary
- **WHEN** a commit closes a phase and the context use is at or above the guardrails compact threshold
- **THEN** the band offers *compact now*

#### Scenario: High context mid-step
- **WHEN** the context use is above the threshold and no commit closed a phase or task group
- **THEN** the band offers neither compaction nor a fresh session

### Requirement: Strict mode
In loose mode the mod SHALL never block. In a strict repository it SHALL add phase reminders built
from the workflow file, block a commit while the phase's process drift is open and an archive while
any plan or process drift is open (a plan drift is reconciled or accepted before archive, not before
each commit, DD-42), and stop or correct a
subagent spawn that breaks the appetite's review set or the model rule; every block SHALL name its
reason and the way out. A person SHALL be able to drop to loose for the session in one action, and
the next session SHALL start strict again (DEC-5). A failure inside a strict check SHALL allow the
action.

#### Scenario: A blocked commit in strict mode
- **WHEN** the first commit is attempted in a strict repository during apply and `test-driven-development` has not run in that phase
- **THEN** the commit is blocked before it runs, with the reason, the command to run, the accept command and the drop-to-loose command

#### Scenario: The same commit in loose mode
- **WHEN** the same commit is attempted in a loose repository
- **THEN** the commit runs and only the warning is shown

#### Scenario: Dropping to loose
- **WHEN** a person drops to loose after a blocked commit and commits again
- **THEN** the commit runs
- **AND** the next session in that repository starts strict

