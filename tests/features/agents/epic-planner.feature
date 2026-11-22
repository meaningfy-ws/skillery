# Traces to: agents/epic-planner.md (Dispatch contract, Report, Glue); docs/development/agent-template.md;
# named-workers-and-legal D-6, D-15; delivery-process-and-tools DEC-2, DEC-19; D-17 (spec epic-shape).
# Run by hand per CLI (agent-template.md "Tests"); the validator checks the shape.
Feature: epic-planner shapes an EPIC and derives a gated PLAN with the person
  A lead works with the person in a session: it asks its open questions directly,
  one round at a time, and writes the change once no decision is open.

  Background:
    Given the epic-planner agent is installed with skills `epic-planning`, `clarity-gate`, `bdd-gherkin`
    And the person starts a session with seeds for a new change

  # Traces to: D-16, DEC-16; spec epic-shape (Planning effort follows the appetite).
  Scenario: The preload stands and the planner loads nothing twice
    When the person starts the session
    Then `epic-planning`, `clarity-gate` and `bdd-gherkin` are preloaded and `stream-coding` is not
    And the planner does not load `epic-planning` again with the Skill tool
    And it keeps the `Skill` tool to load a skill on demand, as a lead

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

  # DEC-2. Spec epic-shape: Planning effort follows the appetite.
  Scenario: A MEDIUM PLAN gets no third gate run
    Given a MEDIUM PLAN scores 8.7 out of 10 on its second clarity-gate run
    When the epic-planner finishes
    Then the remaining gaps go to the person in one round, each with a recommendation
    And no third revision or gate run is made
    And a gap the person accepts is recorded as a decision before the PLAN proceeds

  # DEC-19; D-17. Spec epic-shape: The PLAN is derived and gated while shaping.
  Scenario: The shaping session ends with the PLAN gated
    Given the person and the epic-planner have shaped an EPIC
    When the shaping session ends
    Then the EPIC's PLAN is derived and gated, not left "shaped, not planned"
    And each gate run's verdict is written to the change's `evidence/clarity-gate.md`, one line per run
    And the person signs off the PLAN's scenarios at that gate

  Scenario: A bounded survey is delegated, the shaping is not
    Given the EPIC touches code the person has not described
    When the epic-planner needs to know which modules the change reaches
    Then it may delegate that survey to a read-only subagent
    And it decides nothing on the subagent's report without asking the person

  Scenario Outline: Work outside shaping is refused
    When the person asks the epic-planner to <request>
    Then it refuses
    And it names <owner> as the place for that work

    Examples:
      | request                         | owner                  |
      | implement a task                | the implementer        |
      | commit the change               | the person             |
      | archive the finished change     | `spec-stewardship`     |
