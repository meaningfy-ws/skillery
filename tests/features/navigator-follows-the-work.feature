# Traces to: openspec/changes/navigator-follows-the-work (DEC-2, DEC-3, DEC-11; design D-2, D-3, D-16, worked example 1);
# specs/session-navigation "The navigator follows the worktree being worked";
# specs/drift-detection "Deviations are recorded in the change".
# Run by hand per CLI on synthetic repositories; no step definitions (skillery runs no model in CI).
# Later stages add their scenarios to this file, grouped under a Rule each.
Feature: The navigator follows the work, not the launch directory
  The navigator reads the git working tree the lead works in and the change its branch names.

  Background:
    Given a repository with a main checkout
    And a session started in the main checkout

  Rule: The followed worktree is the one the lead writes in, within the same repository

    # Traces to: session-navigation, "A session moves into a worktree" and "A sibling worktree"
    Scenario Outline: The lead writes into a worktree of the same repository
      Given a worktree <place> of the same repository on branch "feature/tenant-dump-restore"
      And the open change "tenant-dump-restore" has 4 of 8 tasks ticked
      When the lead writes a file in that worktree
      Then after the turn the line and the band show "tenant-dump-restore" with 4 of 8
      # Stage 3 (tasks 3.3, 3.5) draws Details; until then this step is checked by hand on the status line only.
      And Details names that worktree as the checkout read

      Examples:
        | place                                  |
        | inside the main checkout               |
        | beside the main checkout as a sibling  |

    # Traces to: session-navigation, "A write elsewhere"
    Scenario Outline: A write outside the repository changes nothing
      Given the session follows the main checkout's branch and change
      When the lead writes a file <where>
      Then the followed worktree and change do not change

      Examples:
        | where                              |
        | outside any repository             |
        | in another repository              |

    # Traces to: session-navigation, "A subagent in its own worktree"
    Scenario: A subagent's write does not move the lead
      Given the lead follows the change "tenant-dump-restore"
      And a subagent works in its own worktree
      When the subagent writes files there
      Then its writes are matched against file gates relative to its own worktree
      And the lead's followed change does not change

    # Traces to: session-navigation, "A session moves into a worktree" (design worked example 1, step 5)
    Scenario: The followed worktree survives clearing the conversation
      Given the lead follows a worktree on branch "feature/tenant-dump-restore"
      When the conversation is cleared
      Then the band stays on "tenant-dump-restore"

  Rule: The followed change is the one the followed branch names

    # Traces to: session-navigation, "A branch that names no change"
    Scenario: A branch that names no change
      Given the open changes are "aggregate-events" and "release-pipeline"
      And the followed branch is "docs/shape-backlog"
      # The "no change for branch" wording is drawn in stage 3 (tasks 3.3, 3.5); checked there.
      Then the line says there is no change for branch "docs/shape-backlog"
      And no change's tasks, gates or warnings are shown

    # Traces to: session-navigation, "The followed change SHALL be the open change the followed branch names,
    # matched on whole name segments (the longest wins)"
    Scenario Outline: Branches are matched to open changes on whole name segments
      Given the open changes are <changes>
      When the followed branch is "<branch>"
      Then the followed change is <followed>

      Examples:
        | changes                                            | branch                                  | followed                      |
        | "tenant-dump-restore", "aggregate-events"          | feature/tenant-dump-restore             | "tenant-dump-restore"         |
        | "atomic-commit", "atomic"                          | feature/atomic-commit-stage-1           | "atomic-commit"               |
        | "fix"                                              | prefix-x                                | none                          |

    # Traces to: session-navigation, "SHALL NOT pick a change by modification time"
    Scenario: The most recently modified change is not chosen
      Given the open changes are "aggregate-events" and "release-pipeline"
      And "release-pipeline" was modified most recently
      When the followed branch is "feature/aggregate-events"
      Then the followed change is "aggregate-events"

  Rule: A deviation is recorded in the change of the worktree being worked

    # Traces to: drift-detection, "Accepting a deviation"
    Scenario: Accepting a deviation
      Given the followed change has a plan-drift warning
      When a person accepts the deviation with a reason
      Then the warning's key, the date and the reason are recorded in the change
      And the archive check passes and lists the deviation

    # Traces to: drift-detection, "Accepting in a worktree"
    Scenario: Accepting in a worktree
      Given the lead works in a worktree of the change "tenant-dump-restore"
      And the main checkout also holds an open change
      When the lead accepts a warning
      Then the deviation is written to that worktree's "tenant-dump-restore" change
      And no other change or checkout is written
