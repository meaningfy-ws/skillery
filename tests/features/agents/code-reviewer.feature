# Traces to: agents/code-reviewer.md (Dispatch contract, Report); docs/development/agent-template.md; D-16; openspec/changes/lean-delivery (DEC-5, DEC-9, DEC-11).
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

  Scenario: L2 reads the gate report instead of running the suite
    Given the stage's gate report shows one failing test
    When the caller dispatches the code-reviewer with lens "L2"
    Then the findings report the failing test from the gate report
    And the reviewer does not re-run the test suite

  Scenario: L2 checks that changed docs agree with the code
    Given the diff renames a phase that a how-to page still names
    When the caller dispatches the code-reviewer with lens "L2"
    Then the findings name the page and the stale name

  Scenario: The reviewer uses the project's code-intelligence tools when present
    Given the project has an impact-analysis tool
    When the caller dispatches the code-reviewer with lens "L5"
    Then the findings cite the tool's blast radius for each refactor candidate
    And the reviewer edits no file

  Scenario: Asked to fan out, the reviewer has no tool to start another agent
    When the caller asks the code-reviewer to dispatch another agent for part of the review
    Then it has no tool to start one
    And it says so in its report
