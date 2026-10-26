# Traces to: UC-W8 (Proposals and formal offers): Main Success Scenario 1-6, Minimal Guarantees; agents/proposal-writer.md (Dispatch contract);
# spec/agent-template.md; rebundle-by-activity D-5.
# Run by hand per CLI (agent-template.md "Tests"); the validator checks the shape.
Feature: proposal-writer turns client requirements into a sendable proposal or offer email
  A delegated run cannot ask the human, so missing answers come back to the caller
  as questions in its output, and sending is returned as a recommendation.

  Background:
    Given the proposal-writer agent is installed with skills `proposal-writing`, `estimation`, `executive-communication`
    And a client has stated requirements and asked for an offer

  Scenario Outline: The output depends on what the requirements answer
    Given the caller asks for <form>
    And the requirements leave <open_questions> questions open
    When the caller dispatches the proposal-writer with the requirements
    Then it returns <output>

    Examples:
      | form                | open_questions | output                                                          |
      | a formal proposal   | 0              | a proposal draft with scope, estimate and executive summary     |
      | a proposal email    | 0              | a sendable proposal email with the estimate                     |
      | a formal proposal   | 2              | the questions it needs answered, each with a recommended answer |

  Scenario Outline: Actions that need consent are refused
    When the caller asks the proposal-writer to <request>
    Then it refuses
    And it returns <instead>

    Examples:
      | request                                  | instead                                         |
      | send the proposal to the client          | the draft and a recommendation to send it       |
      | commit to a price below the estimate     | the estimate and the trade-off for the owner    |
      | decide the pricing strategy on its own   | the options, with the estimation skill's ranges |
