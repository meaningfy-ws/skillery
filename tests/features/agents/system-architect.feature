# Traces to: UC-W19 (System architect): Main Success Scenario 2-5, Minimal Guarantees; agents/system-architect.md (Dispatch contract);
# spec/agent-template.md; rebundle-by-activity D-5.
# Run by hand per CLI (agent-template.md "Tests"); the validator checks the shape.
Feature: system-architect designs a new system with the user before code
  A lead agent is a thinking partner: it states its view and plan in a few lines,
  asks before deciding, then writes the architecture artefacts the use case names.

  Background:
    Given the system-architect agent is installed with skills `architecture`, `modelling-conventions`, `conceptual-modelling`
    And the user starts a session to design a new system

  Scenario Outline: Each step is announced, agreed and then produced
    Given the user has described <input>
    When the system-architect reaches the <step> step
    Then it first states its view and plan for that step in a few lines
    And it asks the user before deciding
    And once the user agrees it produces <artefact>

    Examples:
      | input                                   | step                    | artefact                                   |
      | the system's goal and its actors        | use cases               | the system's use cases                     |
      | two candidate integration approaches    | architectural decisions | a decision record naming the chosen option |
      | the agreed decisions                    | system diagrams         | the system's context and container views   |

  Scenario: Nothing unagreed is written, and agreed decisions stay recorded
    Given the user has agreed two architectural decisions
    When the user rejects the third decision the system-architect proposes
    Then no decision record is written for the rejected decision
    And the two agreed decision records are unchanged

  Scenario: The design is handed over, not implemented
    Given the use cases, decisions and diagrams are agreed and written
    When the system-architect finishes
    Then it hands the design over to the implementer

  Scenario Outline: Work outside the architecture is refused
    When the user asks the system-architect to <request>
    Then it refuses
    And it names <owner> as the place for that work
    And no <forbidden> is written

    Examples:
      | request                                  | owner                 | forbidden           |
      | implement a component of the system      | the implementer       | source code         |
      | build the detailed domain ontology       | the conceptual-modeller | ontology file     |
      | delegate the design to another agent     | the user's own session | delegated run      |
