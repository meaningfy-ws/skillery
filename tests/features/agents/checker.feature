# Traces to: agents/checker.md (Dispatch contract, Report); skills/stage-check; docs/development/agent-template.md; D-2, D-3, D-14, D-41; spec subagent-dispatch (A subagent starts fresh from a brief).
# Run by hand per CLI (agent-template.md "Tests"); the validator checks the shape.
Feature: checker checks one finished stage against its briefs and reports a verdict
  The checker is the stage's four-eyes pass: read-only, it did not build, test or review the stage,
  and it ends its report with the result line for the lead to carry into the PR body.

  Background:
    Given the checker agent is installed with skills `stage-check`
    And a stage whose briefs, accepted findings, spec scenarios and diff range are named in the brief

  Scenario Outline: The verdict follows the items, with evidence
    Given <unmet> brief items are not met by the diff
    When the caller dispatches the checker on the stage
    Then each item carries a yes or a no with its evidence, a path and line or a command and its exit code
    And the verdict is <verdict>
    And the report names each unmet item with the evidence that it is unmet
    And no file in the change is modified and the checker fixes nothing
    And the report ends with `result: stage=<s> role=checker verdict=<verdict> findings=<unmet> accepted=-`

    Examples:
      | unmet | verdict |
      | 0     | pass    |
      | 1     | fail    |

  Scenario: The checker has no tool to edit, to load a skill or to start another agent
    When the caller dispatches the checker on the stage
    Then it has Read, Grep, Glob and Bash only
    And it has no `Skill` tool and no tool of any MCP server
