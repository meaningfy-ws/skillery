## ADDED Requirements

### Requirement: Warnings rank by severity
The mod SHALL rank open warnings in five tiers: workflow errors and process gates first, then plan
drift, then subagent rules, then hygiene, then heuristics (the unused-skill check); within a tier,
newest first. The folded band SHALL show the first warning of the first four tiers
(navigator-follows-the-work DEC-9).

#### Scenario: A heuristic never hides a gate
- **WHEN** an unused-skill warning arrives after a gate warning
- **THEN** the folded band shows the gate warning, and the unused-skill warning is listed last in Details

### Requirement: A skill's use is counted per agent
A loaded skill SHALL count as used when the same agent makes a tool call or spawns a subagent after
loading it, before that agent's turn ends; the lead's skills SHALL be judged at the end of the main
turn and a subagent's when it finishes. A subagent's skill load SHALL NOT enter the lead's skill
trail, activate a workflow or pass a skill gate (navigator-follows-the-work DEC-4, DEC-7).

#### Scenario: Skills loaded together, then used
- **WHEN** the lead loads `cosmic-python`, then `test-driven-development`, then makes a tool call
- **THEN** neither skill is reported unused

#### Scenario: A subagent's skill
- **WHEN** an implementer subagent loads `test-driven-development` and edits a file
- **THEN** the skill shows on the implementer's entry, not in the lead's trail, and is not reported unused

## MODIFIED Requirements

### Requirement: Deviations are recorded in the change
*Accept deviation* SHALL record the warning's key, the date and the person's reason in the followed
change, in the working tree the lead works in, once per key; *Archive check* SHALL then pass for
that warning and list the deviation (navigator-follows-the-work DEC-2).

#### Scenario: Accepting a deviation
- **WHEN** a person accepts a plan-drift warning with a reason
- **THEN** the reason is recorded in the change and *Archive check* passes, listing the deviation

#### Scenario: Accepting in a worktree
- **WHEN** the lead works in a worktree of change `tenant-dump-restore` and accepts a warning
- **THEN** the deviation is written to that worktree's `tenant-dump-restore` change, and no other change or checkout is written
