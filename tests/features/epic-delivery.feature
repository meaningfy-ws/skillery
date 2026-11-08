# Traces to: skills/epic-delivery/SKILL.md; openspec/changes/align-agent-team-delivery (DEC-1, DEC-7, DEC-8, DEC-9, DEC-10).
# Run by hand per CLI on a real EPIC; no step definitions (skillery runs no model in CI).
Feature: The lead delivers a gated PLAN with a team scaled to the appetite
  The main session leads; members build, review and check; people validate once per EPIC.

  Background:
    Given an EPIC whose PLAN passed the clarity gate
    And the developer has signed off its scenarios

  Scenario Outline: Challenge and check scale with the appetite
    Given the EPIC's appetite is <appetite>
    And a stage that <screens> screens
    When the lead runs the stage
    Then the challenge step dispatches <challenge>
    And the check step is <check>

    Examples:
      | appetite | screens         | challenge                                         | check                         |
      | SMALL    | does not change | one combined review pass (spec and structure)     | the lead's re-run of the gates |
      | MEDIUM   | does not change | five review lenses in parallel                    | one fresh checker             |
      | LARGE    | changes         | the tester, five lenses and the UX lens in parallel | one fresh checker           |

  Scenario: A member never asks the developer
    Given a builder meets an open decision
    When it finishes its task
    Then it reports the question to the lead
    And the lead asks the developer with the terms explained, the options and one recommended

  Scenario Outline: A library gap is handled by who owns the library
    Given a task needs a capability that <library> lacks
    When the gap is found
    Then <response>

    Examples:
      | library                 | response                                                                                      |
      | one of our libraries    | the task is marked blocked by an upstream issue and no workaround is written                  |
      | an external library     | the lead records contribute, fork or work around with a recommendation, and the developer decides |

  Scenario: Acceptance is per EPIC and decided by the developer
    Given the last stage of an EPIC that delivers a use case is merged
    When the lead demonstrates it against the success measure
    Then the developer's verdict is recorded in the change's evidence folder
    And only then does the lead archive the change
