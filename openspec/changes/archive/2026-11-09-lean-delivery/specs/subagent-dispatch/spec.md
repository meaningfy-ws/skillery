## ADDED Requirements

### Requirement: An implementing report is verifiable
An implementing subagent's report SHALL name, for each gate run, the command, the exit code, the
test counts (passed, failed, skipped) and the duration, and SHALL list the narrow checks it ran
(lean-delivery DEC-4).

#### Scenario: A gate run in a report
- **WHEN** a builder ran the project's task gate before reporting
- **THEN** its report names the command, exit code, counts and duration of that run

### Requirement: Long commands are awaited without polling
A command that fits the tool's timeout SHALL run in the foreground; a longer one SHALL run in the
background and be awaited by one completion notice or one blocking wait. A sleep loop SHALL NOT be
used. A hook shipped in the bundle every Meaningfy session installs, with the same check in the
catalogue's opencode plugin, SHALL deny sleep loops only, SHALL allow a single sleep and a blocking wait,
SHALL fail open on its own error, and its message SHALL offer the foreground first
(lean-delivery DEC-12).

#### Scenario: A polling loop is denied
- **WHEN** an agent runs a shell loop that sleeps until a CI run completes
- **THEN** the hook denies it with a message that offers the foreground first

#### Scenario: A blocking wait is allowed
- **WHEN** an agent runs one blocking command that waits for CI checks
- **THEN** the hook allows it
