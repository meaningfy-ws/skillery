# Traces to: skills/technical-writing/SKILL.md (documentation workflow); openspec/changes/lean-delivery (DEC-9, design D-6..D-8).
# Run by hand per CLI on a real EPIC; no step definitions (skillery runs no model in CI).
Feature: The docs stage brings manuals and architecture pages up to date
  The last stage of an epic session, owned by technical-writing, run only when docs are owed.

  Background:
    Given an accepted EPIC whose docs are owed

  Scenario: The five phases
    When the lead starts the docs stage
    Then the stage runs inventory, write, verify, cold-read and publish in that order
    And it ends in one PR reviewed with the appetite's review set

  Scenario Outline: The check a page gets depends on its kind
    Given the docs stage wrote a <kind> page
    When the page is checked
    Then it gets <check>

    Examples:
      | kind           | check                          |
      | how-to         | a cold reader                  |
      | tutorial       | a cold reader                  |
      | install manual | a cold reader                  |
      | explanation    | the lightweight clarity check  |
      | reference      | the lightweight clarity check  |

  Scenario: Architecture pages are recorded as built
    Given the code departs from an accepted architecture decision
    When the docs stage updates the architecture pages
    Then the decision's status is left unchanged
    And the departure goes to the lead as a finding
