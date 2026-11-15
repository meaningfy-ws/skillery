# Traces to: UC-W18; agents/team-lead.md (Dispatch contract, Report);
# openspec/changes/named-workers-and-legal/design.md D-1, D-2, D-5, D-7, D-15, D-18;
# openspec/changes/delivery-process-and-tools DEC-1, DEC-7; D-1, D-8 (spec epic-delivery).
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

  # DEC-7; D-8. Spec epic-delivery: The lead stays small.
  Scenario Outline: The lead stays small
    Given the person asks to <request>
    When the team-lead handles the request
    Then it <does>

    Examples:
      | request                                             | does                                                                     |
      | start a second EPIC in the same session             | declines and asks for a fresh session for that EPIC                       |
      | make a one-line fix the reviewer found              | briefs a fixer and does not edit the file itself                          |
      | look at four known files                            | reads them in one call                                                    |
      | find where a rule is stated across the repository   | hands the reading to an exploring subagent and takes its conclusion back  |

  # DEC-1; D-1. Spec epic-delivery: A stage ends with a hand-over note and a fresh session.
  Scenario: The note is committed before the merge
    Given a stage whose check has passed
    When the team-lead closes the stage
    Then it commits the hand-over note as the pull request's last commit
    And only then starts the watch-and-merge command
    And after the merge it ends the session instead of compacting, leaving the note's prompt for the next one
