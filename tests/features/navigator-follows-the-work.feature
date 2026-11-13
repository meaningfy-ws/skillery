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

  Rule: The epic-delivery phase moves on what happens to the followed change

    # Traces to: workflow-definitions, "A merged pull request"
    Scenario: A merged pull request
      Given the followed change "tenant-dump-restore" has all its tasks ticked
      And its branch "feature/tenant-dump-restore" has an open pull request
      When the session runs "gh pr merge" and the pull request is then merged
      Then the phase is "archive"

    # Traces to: workflow-definitions, "A merged pull request" (D-5: --auto exits ok without merging)
    Scenario: A merge that waits for its checks moves nothing
      Given the followed branch "feature/tenant-dump-restore" has an open pull request
      When the session runs "gh pr merge --auto" and the pull request stays open
      Then the phase does not change

    # Traces to: workflow-definitions, "An archived change"
    Scenario: An archived change
      Given the followed change "tenant-dump-restore" has all its tasks ticked
      When its folder is moved into "openspec/changes/archive/" on the followed branch
      Then the navigator still follows "tenant-dump-restore" and the phase is "archive"

    # Traces to: navigator-follows-the-work D-21.5, session-navigation (archived change)
    Scenario: An archived change offers no Accept and no Archive check
      Given the followed change "tenant-dump-restore" is archived
      Then the band offers no Accept and no Archive check
      And accepting a deviation is refused, saying the change is archived

    # Traces to: workflow-definitions, "Moving to the next change"
    Scenario: Moving to the next change
      Given the lead followed a merged change
      When the lead moves to a worktree whose branch names "release-pipeline", with 2 of 5 tasks ticked
      Then the band follows "release-pipeline" in "apply"
      And none of the previous change's gates or warnings are shown
      And no leave or enter warning is raised

  Rule: Release commands start a release; a local tag does not

    # Traces to: workflow-definitions, "Release commands start a release"
    Scenario Outline: Release commands start a release
      Given the skill "meaningfy-release" is not loaded
      When the session <does>
      Then the release workflow activates
      And the band warns that "meaningfy-release" is not loaded

      Examples:
        | does                                   |
        | creates a branch "release/1.0.0"       |
        | runs "gh release create v1.0.0"        |
        | pushes the tag "v1.0.0"                |

    # Traces to: workflow-definitions, "A local tag is not a release"
    Scenario Outline: A local tag is not a release
      When the session <does>
      Then the release workflow does not activate

      Examples:
        | does                                   |
        | runs "git tag v1.0.0" without pushing  |
        | deletes a tag                          |

  Rule: Warnings rank by severity

    # Traces to: drift-detection, "A heuristic never hides a gate" (D-10)
    Scenario: A heuristic never hides a gate
      Given the band shows a process gate warning
      When an unused-skill warning arrives after it
      Then the folded band shows the gate warning
      And the unused-skill warning is listed last in Details

    # Traces to: drift-detection, "Warnings rank by severity" (D-10: within a tier, newest first)
    Scenario: Within a tier the newest warning comes first
      Given two plan-drift warnings are open
      When a third plan-drift warning arrives
      Then the third is listed before the other two

  Rule: A skill's use is counted per agent

    # Traces to: drift-detection, "Skills loaded together, then used" (D-9)
    Scenario: Skills loaded together, then used
      When the lead loads "cosmic-python", then "test-driven-development", then makes a tool call
      Then neither skill is reported unused

    # Traces to: drift-detection, "A skill's use is counted per agent" (D-9: another Skill call is not use)
    Scenario: A load followed by another load and no tool call
      When the lead loads "cosmic-python", then "test-driven-development", and the turn ends
      Then "cosmic-python" is reported unused for "main"

    # Traces to: drift-detection, "A subagent's skill" (D-9)
    Scenario: A subagent's skill
      When an implementer subagent loads "test-driven-development" and edits a file
      Then the skill shows on the implementer's entry, not in the lead's trail
      And it is not reported unused

    # Traces to: drift-detection, "A skill's use is counted per agent" (D-9: judged at its finish)
    Scenario: A background subagent is judged when it finishes, not at the lead's turn end
      Given a subagent loaded two skills and made no tool call
      When the lead's turn ends while the subagent still runs
      Then no unused-skill warning is raised
      When the subagent finishes
      Then its first skill is reported unused for that subagent

  Rule: A lead session shows its workflow

    # Traces to: workflow-definitions, "A lead session" (D-14, #188)
    Scenario Outline: A lead's primary skill shows its workflow
      When a session runs the lead worker "<lead>" and loads its primary skill "<skill>"
      Then the band shows the "<workflow>" workflow and a phase of it

      Examples:
        | workflow       | lead              | skill                   |
        | architecting   | system-architect  | architecture            |
        | modelling      | conceptual-modeller | conceptual-modelling  |
        | contract       | lawyer            | contract-practice       |
        | epic-delivery  | team-lead         | epic-delivery           |
        | epic-shaping   | epic-planner      | epic-planning           |
        | devops         | devops-engineer   | infrastructure-operations |
        | release        | release-manager   | meaningfy-release       |
        | documentation  | technical-writer  | technical-writing       |
        | sales          | sales-agent       | sales-operations        |
