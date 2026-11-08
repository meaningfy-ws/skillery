## ADDED Requirements

### Requirement: The status line shows where the work stands
The `navigator` mod SHALL pin one status line that names the open change, its appetite, the phase
and task progress, the driving agent and the mode (`● strict` or `○ loose`). With no open change and
no active workflow it SHALL say so and raise no workflow warning. In a DevOps session it SHALL show
the intervention kind and its phase; in a sales session the sales phase, marked provisional
(DEC-7, DEC-9).

#### Scenario: A repo with an open change
- **WHEN** a session starts in a repo with one open change of appetite VERY LARGE in its apply phase with 12 of 40 tasks ticked
- **THEN** the status line shows the change id, `VERY LARGE`, `apply 12/40`, the driving agent and the mode

#### Scenario: A repo with no open change
- **WHEN** a session starts in a repo with no open change and no workflow is active
- **THEN** the status line says there is no open change and the band shows no workflow warning

#### Scenario: A DevOps or sales session
- **WHEN** a DevOps incident is being worked, or a sales offer is being written
- **THEN** the status line shows `devops`, `incident` and the phase, or `sales (provisional)` and the phase

### Requirement: The band shows who runs what
The band SHALL show, folded, the running subagents, the last skill, the gate states and the warning
count, and, unfolded, the stage-loop progress, the skill trail, each subagent with its type, model
and tokens, the appetite against the actual, the open warnings and the actions (DEC-7).

#### Scenario: A subagent during apply
- **WHEN** a subagent is spawned during apply
- **THEN** it appears in the band with its type and model while it runs
- **AND** when it finishes it shows as done with its token cost

### Requirement: Band and line are toggled by command and defaulted by settings
The band and the status line SHALL each be shown and hidden by a command for the session; the
plugin's settings SHALL hold their display defaults, which every new session starts from; there
SHALL be no hotkeys (DEC-7, DEC-10). The band SHALL draw other mods' trees below its own.

#### Scenario: Hiding the band
- **WHEN** a person hides the band
- **THEN** the status line still carries change, appetite, phase, progress, driving agent and mode
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
