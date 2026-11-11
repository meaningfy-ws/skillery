# Traces to: UC-W18; agents/release-manager.md (Dispatch contract, Report);
# openspec/changes/named-workers-and-legal/design.md D-1, D-2, D-7, D-15, D-18.
# Run by hand per CLI (agent-template.md "Tests"); the validator checks the shape.
Feature: release-manager takes merged work to a published release
  The lead loads the release lifecycle, prepares the version, changelog and notes, and publishes only
  when the person says go. It never does feature work.

  Background:
    Given the release-manager agent is installed with skills `meaningfy-release`, `meaningfy-git-workflow`
    And the person starts a session in the repository to release

  Scenario Outline: The lead prepares, checks or refuses
    Given the person asks to <request>
    When the release-manager handles the request
    Then it <does>
    And the run ends with the `guardrails` base report plus the implementing fields

    Examples:
      | request                                | does                                                                           |
      | cut the next release                   | loads `meaningfy-release` first, proposes the version and the changelog        |
      | verify the prepared release            | dispatches a read-only checker subagent and reports its findings               |
      | publish the release                    | asks for the person's go and tags and publishes only after a yes               |
      | add a feature before the release       | refuses and names `team-lead`                                                  |
