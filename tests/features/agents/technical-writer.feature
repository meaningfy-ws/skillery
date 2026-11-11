# Traces to: UC-W18; agents/technical-writer.md (Dispatch contract, Report);
# openspec/changes/named-workers-and-legal/design.md D-1, D-2, D-7, D-15, D-18.
# Run by hand per CLI (agent-template.md "Tests"); the validator checks the shape.
Feature: technical-writer writes documentation and has a cold reader test it
  The lead loads its writing workflow, drafts in the right genre and has a reader who has not seen
  the code test the draft. It changes documentation only.

  Background:
    Given the technical-writer agent is installed with skills `technical-writing`, `explanatory-writing`, `writing-antipatterns`, `meaningfy-voice`, `guardrails`
    And the person starts a session in the repository to document

  Scenario Outline: The lead writes, tests or refuses
    Given the person asks to <request>
    When the technical-writer handles the request
    Then it <does>
    And the run ends with the `guardrails` base report plus the authoring fields

    Examples:
      | request                              | does                                                                              |
      | document how a module works          | loads `technical-writing` first, reads the module and drafts the explanation      |
      | test the finished draft              | dispatches a cold-reader subagent given the draft only and reports what it missed |
      | fix a bug found while documenting    | refuses, changes no code and leaves a note for the person                        |
      | change a spec to match the docs      | refuses and leaves the spec unchanged                                             |
