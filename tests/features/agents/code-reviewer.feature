# Traces to: agents/code-reviewer.md (Dispatch contract, Report); docs/development/agent-template.md; D-16.
# Run by hand per CLI (agent-template.md "Tests"); the validator checks the shape.
Feature: code-reviewer reviews one change through exactly one lens
  A caller fans out a full pre-PR review as five dispatches, one lens each,
  and the reviewer reports that lens's findings without changing anything.

  Background:
    Given the code-reviewer agent is installed with skills `meaningfy-code-review`, `cosmic-python`
    And a change with a diff, its specs and its covering scenarios

  Scenario Outline: One dispatch reviews one lens
    When the caller dispatches the code-reviewer with lens "<lens>"
    Then every finding reported is tagged with lens "<lens>"
    And each finding names a location, a catalogue entry, why it matters and a fix
    And no file in the change is modified
    And the run ends with the `guardrails` base report plus the reviewing fields

    Examples:
      | lens |
      | L1   |
      | L2   |
      | L3   |
      | L4   |
      | L5   |

  Scenario: No lens is refused
    When the caller dispatches the code-reviewer without naming a lens
    Then it returns "one lens required (L1–L5)"
    And it reviews nothing

  Scenario: Two lenses are refused
    When the caller dispatches the code-reviewer with lenses "L1" and "L3"
    Then it returns "one lens required (L1–L5)"
    And it reviews nothing

  Scenario: L2 runs the test suite
    Given the change has one failing test
    When the caller dispatches the code-reviewer with lens "L2"
    Then the findings report the failing test
