# Traces to: UC-W6; agents/ops-watch.md (Dispatch contract);
# openspec/specs (unattended-operations, operations-practice), openspec/changes/archive/2026-10-27-add-devops-bundle/design.md TC-04, IT-2, IT-3.
# Run by hand per CLI (agent-template.md "Tests"); the validator checks the shape.
Feature: ops-watch checks the fleet and answers alerts with no human present
  It acts only where the unattended-action policy returns act, through allow-listed operations, and
  reports every run in `#infra-alerts` and on GitHub issues in `infrastructure-stacks`.

  Background:
    Given the ops-watch agent is installed with skills `service-reliability`, `stack-operations`, `infrastructure-operations`, `infrastructure-security`
    And it runs in a checkout of `infrastructure-stacks` with `../cloud-infrastructure` beside it
    And it holds no SSH key and no cloud token

  Scenario Outline: An alert is decided by the policy, not by judgement
    Given an alert reports <symptom> for `<service>`
    And the incident issue has <attempts> attempt comments
    When ops-watch proposes <action> and runs `decide_action.py`
    Then the decision is <decision>
    And it <does>

    Examples:
      | symptom                  | attempts | action            | decision | does                                                                                                     |
      | a restarting container   | 0        | restart-container | act      | invokes the named operation, comments the attempt, verifies, closes the issue, summarises in `#operations` |
      | a full disk              | 0        | resize-server     | park     | labels the issue `ops-parked`, comments a decision card with cost and downtime, changes nothing           |
      | a corrupted database     | 0        | restore-backup    | park     | labels the issue `ops-parked` and notifies `#infra-alerts`, whatever the urgency                          |
      | a hung server            | 0        | reboot-server     | park     | parks it as an action the policy does not list                                                            |
      | a restarting container   | 2        | restart-container | escalate | takes no action and posts an escalation naming both attempts                                              |

  Scenario Outline: An act decision without an operation is parked
    Given the policy returns act for <action>
    But `infrastructure-stacks` defines no workflow named <operation>
    When ops-watch would act
    Then it parks the action and reports the missing operation

    Examples:
      | action             | operation              |
      | renew-certificate  | ops-renew-certificate  |

  Scenario Outline: The daily check-up always reports
    Given <state>
    When the daily check-up runs
    Then it posts in `#infra-alerts` <post>
    And it comments the report on the pinned `Daily check-up log` issue
    And no file is changed

    Examples:
      | state                                              | post                                                                 |
      | every check passes                                 | a short report listing what was checked and found fine              |
      | the monitoring API is unreachable                  | "monitoring unreadable" as a finding, with no unattended action     |
      | it is Monday and a stack has no backup decision    | the stack named as missing a backup decision; no backup demanded    |
      | it is Monday and a Confluence page contradicts the repository | the drift and a proposed Confluence edit              |
      | `../cloud-infrastructure` does not exist           | the missing sibling, and the checks that need it skipped            |
