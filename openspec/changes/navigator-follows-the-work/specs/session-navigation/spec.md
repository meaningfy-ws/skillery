## ADDED Requirements

### Requirement: The navigator follows the worktree being worked
The `navigator` mod SHALL read every repository fact (open changes, branch, tasks, deviations, the
plan-drift diff, the clean-tree check) in the git working tree the lead works in: the session's
root at start, then the working tree of the lead's latest file write when that tree belongs to the
same repository, whether it lies inside or beside the main checkout. It SHALL NOT use the main
working tree of a worktree session. A subagent's events SHALL use the subagent's own directory, and
a subagent's write SHALL NOT change what the lead follows. The followed change SHALL be the open
change the followed branch names, matched on whole name segments (the longest wins), else the
archived change it names; with neither, the mod SHALL follow no change and say so. It SHALL NOT
pick a change by modification time (navigator-follows-the-work DEC-2, DEC-3, #185).

#### Scenario: A session moves into a worktree
- **WHEN** a session started in the main checkout writes a file in a worktree of the same repository on branch `feature/tenant-dump-restore`, where that change has 4 of 8 tasks ticked
- **THEN** after the turn the line and band show `tenant-dump-restore` with 4 of 8, and Details names the worktree as the checkout read

#### Scenario: A sibling worktree
- **WHEN** the session writes into a worktree that lies beside the main checkout (`../repo-topic`) of the same repository
- **THEN** the navigator follows that worktree's branch and change

#### Scenario: A branch that names no change
- **WHEN** the followed branch is `docs/shape-backlog` and the open changes are `aggregate-events` and `release-pipeline`
- **THEN** the line says there is no change for branch `docs/shape-backlog`, and no change's tasks, gates or warnings are shown

#### Scenario: A write elsewhere
- **WHEN** the lead writes a file outside any repository, or in another repository
- **THEN** the followed worktree and change do not change

#### Scenario: A subagent in its own worktree
- **WHEN** a subagent spawned with its own worktree writes files there
- **THEN** its writes are matched against file gates relative to its worktree, and the lead's followed change does not change

## MODIFIED Requirements

### Requirement: The status line shows where the work stands
The `navigator` mod SHALL pin one status line that names the followed change, its appetite, the
phase and task progress of the current stage and of the whole change, and `● strict` when strict
mode is on; it SHALL NOT repeat what Claude Code already shows (the model) (DD-35). The mode SHALL
show in the band's Details (navigator-follows-the-work DEC-10). With no followed change and no
active workflow it SHALL say so, naming the branch when one is checked out, and raise no workflow
warning. In a DevOps session it SHALL show the intervention kind and its phase; in a sales session
the sales phase, marked provisional (DEC-7, DEC-9).

#### Scenario: A repo with an open change
- **WHEN** a session works on a branch that names one open change of appetite VERY LARGE in its apply phase with 12 of 40 tasks ticked
- **THEN** the status line shows the change id, `VERY LARGE`, the current stage with its phase and progress, and the change's progress

#### Scenario: A repo with no open change
- **WHEN** a session starts in a repo with no open change and no workflow is active
- **THEN** the status line says there is no open change and the band shows no workflow warning

#### Scenario: A DevOps or sales session
- **WHEN** a DevOps incident is being worked, or a sales offer is being written
- **THEN** the status line shows `devops`, `incident` and the phase, or `sales (provisional)` and the phase

### Requirement: The band shows who runs what
The band SHALL show, folded, three lines: what runs now (the phase, the current stage and its
progress, and each running subagent as its task, its agent type without plugin prefix and its
elapsed time, at most two and then a count); the next step with its action; the most severe open
warning with the count of the others. Unfolded (Details), it SHALL show the checkout and branch
read, the stage-loop progress, the phases, the appetite against the actual, the lead's skill trail,
the subagents grouped by type with their tokens, every open warning in severity order with its
Accept action labelled by the warning's message, the mode and the actions. Each fact SHALL appear
once; a model SHALL show only when it differs from the parent's (DEC-7; navigator-follows-the-work
DEC-8, DEC-9).

#### Scenario: A subagent during apply
- **WHEN** a subagent is spawned during apply with the description `Task 3.1 dump and restore`
- **THEN** the folded band shows `Task 3.1 dump and restore → implementer` with its elapsed time while it runs
- **AND** when it finishes it leaves the folded band and Details counts it as done with its token cost

#### Scenario: Many warnings
- **WHEN** twelve warnings are open, none of them an unused-skill heuristic, and one of them a gate warning
- **THEN** the folded band shows `⚠ 12 warnings` and the gate warning, and Details lists all twelve with gate warnings first
