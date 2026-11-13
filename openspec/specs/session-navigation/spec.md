# session-navigation Specification

## Purpose
What the `navigator` mod shows over a Claude Code session: the status line and the band (who runs what, the stage and phase, appetite against actual, warnings), the actions that run the person's own commands, and the session-hygiene prompts. Archived from the `navigator` change (2026-11-09).
## Requirements
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

### Requirement: Band and line are toggled by command and defaulted by settings
The band and the status line SHALL each be shown and hidden by a command for the session; the
plugin's settings SHALL hold their display defaults, which every new session starts from; there
SHALL be no hotkeys (DEC-7, DEC-10). The band SHALL draw other mods' trees below its own.

#### Scenario: Hiding the band
- **WHEN** a person hides the band
- **THEN** the status line still carries change, appetite, stage, phase and progress, and `● strict` when strict mode is on
- **AND** ponytail's band, when installed, still draws

#### Scenario: Hiding the line and the next session
- **WHEN** a person hides the status line in a session whose settings show it
- **THEN** the line disappears for that session
- **AND** the next session starts with the line shown, as the settings say

### Requirement: Both Claude Code surfaces
The mod SHALL draw on the Claude Code CLI and desktop app (DEC-4). Whether the pinned line draws on
the desktop SHALL be proven by hand in stage 1 and recorded in the change; if it does not, the
folded band SHALL lead with the line's text on the desktop.

#### Scenario: The desktop surface
- **WHEN** the scenarios of the status line, the subagent in the band, the process drift at commit and hiding the band are checked on the desktop app
- **THEN** they hold as on the terminal, and the check is recorded in the change's evidence

### Requirement: Actions are commands
Every action of the band SHALL run a command a person could type, visible in the transcript as if
typed; the mod SHALL hold no decision logic beyond matching events to workflow phases (DEC-6). An
action whose command is not installed SHALL say so and run nothing.

#### Scenario: Reconcile EPIC
- **WHEN** a person presses *Reconcile EPIC*
- **THEN** the change-update command runs, then the clarity-gate command, each in the transcript as typed

#### Scenario: Report to skillery (cut line)
- **WHEN** the *Report to skillery* action is built and a person presses it on a warning
- **THEN** the skillery-feedback command runs with the warning's evidence, in the transcript as typed
- **AND** if the action is cut (EPIC *Cut line*), its absence does not fail this requirement

#### Scenario: A command that is not installed
- **WHEN** a person presses *Review* and the review skill is not installed
- **THEN** the band says the skill is not installed and nothing runs

### Requirement: Documented for two audiences
The change SHALL ship a user guide for the CLI and the desktop (install, what the line and band
show, the two modes, every action, show and hide, settings, disable and uninstall, a worked example
of a drift caught and fixed) and a developer guide (the Mod type, the mod's structure and state
contract, the workflow-file schema and repo files, adding a check or an action, hand checks on both
surfaces, bundling) (DEC-11).

#### Scenario: A cold reader installs navigator
- **WHEN** a fresh reader given only the user guide installs and disables navigator on the CLI
- **THEN** they succeed without other help

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

