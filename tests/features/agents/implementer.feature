# Traces to: agents/implementer.md (Dispatch contract, Report); docs/development/agent-template.md; D-7, D-14, D-15, D-16; openspec/changes/lean-delivery (DEC-4, DEC-11).
# Run by hand per CLI (agent-template.md "Tests"); the validator checks the shape.
Feature: implementer turns one ready task into tested code and reports back
  A delegated run cannot obtain consent, so it never commits: it reports,
  and the caller commits.

  Background:
    Given the implementer agent is installed with skills `superpowers:test-driven-development`
    And a change whose PLAN passed the clarity gate and whose scenarios are written

  # Traces to: DEC-11; D-15.
  Scenario Outline: The lead checks impact once per task, before the brief
    Given the upstream impact of the symbol the task changes is "<risk>"
    When the lead runs the impact check before briefing the implementer
    Then <outcome>
    And the implementer itself runs no impact check and refuses no edit on impact

    Examples:
      | risk     | outcome                                                           |
      | LOW      | the lead briefs the implementer on the task                       |
      | MEDIUM   | the lead briefs the implementer on the task                       |
      | HIGH     | the HIGH result goes to the developer through the lead, before the brief |
      | CRITICAL | the CRITICAL result goes to the developer through the lead, before the brief |

  # Traces to: DEC-11; D-15.
  Scenario: The report carries no impact summary
    When the implementer reports
    Then the report ends with the `guardrails` base report plus the implementing fields
    And its impact summary reads "none; impact is the lead's, per task"

  # Traces to: DEC-10; D-16.
  Scenario: It loads cosmic-python in a Python repository
    Given the task is in a Python repository
    When the implementer starts the task
    Then it loads `cosmic-python` with the Skill tool, as its preload holds only the TDD skill

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
    Then the report carries a proposed spec fix for the lead to apply
    And the code is not patched to hide the failure

  Scenario: The report carries each gate run
    Given the implementer ran the project's task gate before reporting
    When the implementer reports
    Then the report names the command, exit code, test counts and duration of that run

  Scenario: The implementer edits symbols with the project's code-intelligence tools
    Given the project has symbol-level editing tools
    When the task changes one function body
    Then the implementer replaces that symbol rather than rewriting the whole file

  Scenario: Asked to fan out, the implementer has no tool to start another agent
    When the caller asks the implementer to dispatch another agent for part of the task
    Then it has no tool to start one
    And it says so in its report

  # Failure case: delivery-retrospective finding F-5 (a worker carried the session's whole tool catalogue).
  Scenario: The implementer starts with its own tools, not the session's
    Given the session has connector tools the task does not need
    And the project has the code-intelligence servers `serena`, `ast-grep` and `gitnexus`
    When the caller dispatches the implementer on the task
    Then it can read, edit, search, run commands and load skills
    And it can load and call a tool of each code-intelligence server
    And no other connector tool is offered to it
    And its report reaches the caller
