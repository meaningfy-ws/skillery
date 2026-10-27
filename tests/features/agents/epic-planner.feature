# Traces to: agents/epic-planner.md (Dispatch contract, Report); docs/development/agent-template.md; D-7, D-8.
# Run by hand per CLI (agent-template.md "Tests"); the validator checks the shape.
Feature: epic-planner shapes an EPIC and derives a gated PLAN through question rounds
  A delegated run cannot ask the human, so open decisions come back to the caller
  as question rounds, and the caller re-dispatches with the answers.

  Background:
    Given the epic-planner agent is installed with skills `epic-planning`, `clarity-gate`, `bdd-gherkin`, `stream-coding`
    And the human's seeds for a new change

  Scenario Outline: Open decisions come back as a question round
    Given the seeds leave <open_decisions> decisions open
    When the caller dispatches the epic-planner with the seeds
    Then it returns <output>
    And the run ends with the `guardrails` base report plus the authoring fields

    Examples:
      | open_decisions | output                                                       |
      | 0              | the EPIC, the PLAN and the clarity-gate scorecard            |
      | 1              | a question round with options and a recommended answer       |
      | 3              | one question round grouped by concern                        |

  Scenario: The PLAN below 9/10 is revised, not reported Ready
    Given every decision is answered
    And the first PLAN draft scores 8 out of 10
    When the epic-planner finishes
    Then the PLAN it returns scores at least 9 out of 10, or the open gaps are reported
    And the PLAN is not reported Ready below 9 out of 10

  Scenario: Code is never written
    When the caller asks the epic-planner to implement a task
    Then it refuses
    And no source or step-definition file is written
