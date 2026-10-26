# Traces to: UC-W20 (Conceptual modeller and ontology engineer): Main Success Scenario 2-6,
# Minimal Guarantees; agents/conceptual-modeller.md
# (Dispatch contract); spec/agent-template.md; rebundle-by-activity D-5.
# Run by hand per CLI (agent-template.md "Tests"); the validator checks the shape.
Feature: conceptual-modeller builds and evolves a domain's conceptual model with the user
  A lead agent is a thinking partner: it states its view and plan in a few lines,
  asks before deciding, then writes the conceptual model the use case names.

  Background:
    Given the conceptual-modeller agent is installed with skills `conceptual-modelling`, `modelling-conventions`, `linkml-engineering`
    And the user starts a session to model a domain

  Scenario Outline: The model is built step by step with the user's agreement
    Given the domain has <starting_point>
    When the conceptual-modeller proposes <proposal>
    Then it first states its view and plan in a few lines
    And it asks the user before deciding
    And once the user agrees the conceptual model <result>

    Examples:
      | starting_point                 | proposal                                   | result                                      |
      | no model yet                   | the model source and its rendering         | is created in the chosen source             |
      | a model and a new requirement  | a new entity and its relationships         | gains the entity, following the conventions |
      | a model with naming drift      | renaming terms to the shared conventions   | uses the agreed terms throughout            |

  Scenario: A rejected term change leaves the model whole
    Given an existing conceptual model
    When the user rejects a renaming the conceptual-modeller proposes
    Then the model is unchanged
    And no file of the model is left half-edited

  Scenario Outline: Work outside the conceptual model is refused
    When the user asks the conceptual-modeller to <request>
    Then it refuses
    And it names <owner> as the place for that work
    And no <forbidden> is written

    Examples:
      | request                                   | owner                  | forbidden            |
      | design the system's container architecture | the system-architect  | architecture diagram |
      | implement the generated data classes      | the implementer        | source code          |
      | delegate the modelling to another agent   | the user's own session | delegated run        |
