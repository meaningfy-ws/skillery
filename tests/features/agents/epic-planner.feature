# Traces to: agents/epic-planner.md (Dispatch contract, Report, Glue); docs/development/agent-template.md;
# named-workers-and-legal D-6, D-15.
# Run by hand per CLI (agent-template.md "Tests"); the validator checks the shape.
Feature: epic-planner shapes an EPIC and derives a gated PLAN with the person
  A lead works with the person in a session: it asks its open questions directly,
  one round at a time, and writes the change once no decision is open.

  Background:
    Given the epic-planner agent is installed with skills `epic-planning`, `clarity-gate`, `bdd-gherkin`, `stream-coding`
    And the person starts a session with seeds for a new change

  Scenario Outline: Open decisions are asked in the session, in one round
    Given the seeds leave <open_decisions> decisions open
    When the epic-planner reaches the decisions
    Then it <action>
    And the run ends with the `guardrails` base report plus the authoring fields

    Examples:
      | open_decisions | action                                                                  |
      | 0              | writes the EPIC, the PLAN and the clarity-gate scorecard                |
      | 1              | asks one question with options and a recommended answer, then writes   |
      | 3              | asks the three questions in one round, grouped by concern, then writes  |

  Scenario: The PLAN below 9/10 is revised, not reported Ready
    Given every decision is answered
    And the first PLAN draft scores 8 out of 10
    When the epic-planner finishes
    Then the PLAN scores at least 9 out of 10, or the open gaps are shown to the person
    And the PLAN is not reported Ready below 9 out of 10 unless the person accepts it

  Scenario Outline: Work outside shaping is refused
    When the person asks the epic-planner to <request>
    Then it refuses
    And it names <owner> as the place for that work

    Examples:
      | request                         | owner                  |
      | implement a task                | the implementer        |
      | commit the change               | the person             |
      | archive the finished change     | `spec-stewardship`     |
