# Traces to: skills/epic-delivery/SKILL.md; openspec/changes/align-agent-team-delivery (DEC-1, DEC-7, DEC-8, DEC-9, DEC-10);
# openspec/changes/lean-delivery (DEC-3..DEC-9, DEC-13; FC-1..FC-8).
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
      | SMALL    | does not change | one combined review pass (spec and structure)     | the stage's full gates and CI  |
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

  Scenario Outline: The demo follows the appetite
    Given the last build stage of a <appetite> EPIC that changed a use case is merged
    When the lead offers the acceptance demo and the developer <choice>
    Then <record> is written to the change's evidence folder
    And only then does the docs stage or the archive follow

    Examples:
      | appetite | choice           | record                                       |
      | SMALL    | skips it         | who skipped it, why and when                 |
      | MEDIUM   | watches it       | what was shown, the verdict and the date     |
      | LARGE    | cannot skip it   | what was shown, the verdict and the date     |

  Scenario Outline: The lead re-runs a gate only on a named trigger
    Given a builder reported its task gate run
    And <situation>
    When the lead takes the task
    Then the lead <action>

    Examples:
      | situation                                                    | action                                                       |
      | the report is complete and agrees with the diff              | commits without re-running any gate                          |
      | the diff adds two tests and the reported count is unchanged  | re-runs the task gate and names the trigger in the commit    |
      | a parallel builder touched the same file                     | re-runs the task gate and names the trigger in the commit    |
      | a fix round has just ended                                   | runs the full gates once and names the trigger in the commit |

  Scenario: Each check runs once in a stage
    Given a stage whose review led to one fix that turned a test red
    When the fixer works
    Then only the failing test is re-run until green
    And the full gates run once after the fix round, then CI
    And no reviewer re-runs the test suite

  Scenario: Questions go out in one round
    Given the lead holds three open questions, none depending on another's answer
    When it asks the developer
    Then it asks all three in one round, each with its options and one recommended

  Scenario: A small PLAN stops at two gate runs
    Given a SMALL PLAN scored below 9 on its second clarity-gate run
    When the planner reports
    Then the remaining gaps go to the developer in one round with a recommendation each
    And an accepted gap is recorded as a decision before the PLAN proceeds

  Scenario Outline: Docs owed after acceptance
    Given an accepted EPIC that <changed>
    When the lead closes the build stages
    Then <next>

    Examples:
      | changed                                         | next                                                 |
      | changed installation                            | the docs stage runs before the archive               |
      | changed none of use case, architecture, install or user-facing behaviour | the lead records "no docs owed" and archives |
