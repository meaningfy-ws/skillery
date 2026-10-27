# Traces to: agents/implementer.md (Dispatch contract, Report, Glue); docs/development/agent-template.md; D-7, D-14.
# Run by hand per CLI (agent-template.md "Tests"); the validator checks the shape.
Feature: implementer turns one ready task into tested code and reports back
  A delegated run cannot obtain consent, so it never commits: it reports,
  and the caller commits.

  Background:
    Given the implementer agent is installed with skills `cosmic-python`, `stream-coding`, `superpowers:test-driven-development`, `superpowers:systematic-debugging`, `superpowers:verification-before-completion`
    And a change whose PLAN passed the clarity gate and whose scenarios are written

  Scenario Outline: Impact decides whether editing proceeds
    Given the upstream impact of the symbol the task changes is "<risk>"
    When the caller dispatches the implementer on the task
    Then the implementer <outcome>
    And the run ends with the `guardrails` base report plus the implementing fields

    Examples:
      | risk        | outcome                                            |
      | LOW         | edits the symbol                                   |
      | MEDIUM      | edits the symbol                                   |
      | HIGH        | stops and returns the impact report                |
      | CRITICAL    | stops and returns the impact report                |
      | unavailable | edits the symbol and reports that no check ran     |

  Scenario: The task is ticked only when green
    Given the task's tests fail after the edit
    When the implementer reports
    Then the task's checkbox is not ticked

  Scenario: A commit request is refused
    When the caller asks the implementer to commit its work
    Then it refuses
    And it reports the changed files for the caller to commit

  Scenario: A design-level failure returns a spec fix
    Given the task cannot be implemented as specified
    When the implementer reports
    Then the report carries a proposed spec fix for the caller or the epic-planner to apply
    And the code is not patched to hide the failure
