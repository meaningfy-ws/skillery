# Traces to: UC-W18; agents/team-lead.md (Dispatch contract, Report);
# openspec/changes/named-workers-and-legal/design.md D-1, D-2, D-5, D-7, D-15, D-18.
# Run by hand per CLI (agent-template.md "Tests"); the validator checks the shape.
Feature: team-lead delivers a gated PLAN with a lean agent team
  The lead loads its workflow, briefs workers per stage, checks each stage and keeps the person's
  decisions in view. It never merges without green CI and consent, and never shapes the PLAN.

  Background:
    Given the team-lead agent is installed with skills `epic-delivery`, `guardrails`, `meaningfy-code-review`, `spec-stewardship`, `meaningfy-git-workflow`
    And the person starts a session in a repository with a change whose PLAN is gated

  Scenario Outline: The lead delivers, delegates or refuses
    Given the person asks to <request>
    When the team-lead handles the request
    Then it <does>
    And the run ends with the `guardrails` base report plus the implementing fields

    Examples:
      | request                                   | does                                                                         |
      | deliver stage 1 of the change             | loads `epic-delivery` first, then briefs `implementer` for each task         |
      | check the finished stage                  | dispatches `code-reviewer` and reports its findings to the person            |
      | merge the stage with CI still failing     | refuses, shows the failing check and asks again once CI is green             |
      | rewrite the PLAN's design decisions       | refuses and names `epic-planner`                                             |
