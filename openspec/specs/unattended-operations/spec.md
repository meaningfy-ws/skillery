# unattended-operations Specification

## Purpose
What an agent may do with no human present: decide each action from the written three-tier policy
(act and report, park and notify, never), stop after two failed attempts, act only through named
allow-listed operations, and leave a record of every run in Slack and GitHub issues.
## Requirements
### Requirement: Unattended actions follow a written three-tier policy
When no human is in the session, an agent SHALL decide each action from the unattended-action policy
data: *act and report* for listed reversible actions without consequence; *park and notify* for
anything that significantly raises cost, blocks something for long, risks critical data loss, touches
data, applies infrastructure code or changes security; *never* for destroying, deleting data, moving
or printing a secret, or opening exposure to the internet. An action the policy does not list SHALL be
parked (DEC-7).

#### Scenario: A container is crash-looping at night
- **WHEN** an alert reports a restarting container and the policy lists "restart a container" as act
  and report
- **THEN** the agent restarts it, verifies the alert clears, and posts what it did and the result to
  `#infra-alerts`

#### Scenario: The fix needs a bigger server
- **WHEN** the only fix the agent finds is resizing a server
- **THEN** it parks the action, posts the proposed fix with its cost and downtime as a decision card,
  and changes nothing

#### Scenario: The fix risks losing data
- **WHEN** the fix would restore, delete or overwrite data
- **THEN** it parks the action and notifies, whatever the urgency

#### Scenario: An action is not in the policy
- **WHEN** the agent considers an action the policy does not list
- **THEN** the action is parked, never taken

### Requirement: No loops
An agent SHALL stop acting on a symptom after two failed attempts within one incident and escalate
with what it tried (DEC-7).

#### Scenario: The restart did not help twice
- **WHEN** a restart has failed to clear the same alert twice
- **THEN** the agent takes no further action on it and posts an escalation naming both attempts

### Requirement: Unattended hands are named operations
Unattended, an agent SHALL act only by invoking operations the infrastructure repository defines as
idempotent, logged, allow-listed workflows, one per *act and report* action; it SHALL hold no SSH key
and no cloud token (DEC-9).

#### Scenario: An act-and-report action has no operation defined
- **WHEN** the policy allows an action but the stacks repository defines no operation for it
- **THEN** the agent parks the action and reports the missing operation

### Requirement: Every unattended run leaves a record
Each unattended run SHALL notify every alert and finding in `#infra-alerts` (what was checked, found,
done, parked); once work has been done, a summary of what was done SHALL be posted in `#operations`;
an incident SHALL be a GitHub issue in `infrastructure-stacks` (DEC-7, DEC-15).

#### Scenario: The daily check-up finds nothing wrong
- **WHEN** the daily check-up finds every check passing
- **THEN** it still posts a short report listing what it checked in `#infra-alerts`

#### Scenario: A restart fixed an incident
- **WHEN** the agent's action cleared an alert
- **THEN** it has notified the alert in `#infra-alerts`, recorded the incident issue, and posts a
  summary of what was done in `#operations`

