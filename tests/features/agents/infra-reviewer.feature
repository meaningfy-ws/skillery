# Traces to: UC-W6; agents/infra-reviewer.md (Dispatch contract, Report);
# openspec/specs (operations-practice), openspec/changes/archive/2026-10-27-add-devops-bundle/design.md TC-04 and IT-4.
# Run by hand per CLI (agent-template.md "Tests"); the validator checks the shape.
Feature: infra-reviewer gives an infrastructure change its second reading
  A delegated, read-only review. It returns a report the caller posts on the PR; it never approves,
  merges or applies.

  Background:
    Given the infra-reviewer agent is installed with skills `infrastructure-operations`, `stack-operations`, `infrastructure-security`
    And `infrastructure-stacks` and `cloud-infrastructure` are checked out side by side

  # Traces to: D-2; spec subagent-dispatch (The subagent's agent and model are the cheapest that fit).
  Scenario: Its role and model follow the matrix
    When `agents/infra-reviewer.md` is read
    Then its `metadata.role` is `reviewer-single` and its `model:` is the mid model the matrix names for that role

  Scenario Outline: A change is reviewed at any point of its implementation
    Given <input>
    When infra-reviewer is dispatched on it
    Then it returns a report headed `## infra-reviewer report`
    And the report gives findings by severity with file and line, the plan summary, the blast radius, the undo path and the stack conformance result
    And no file is changed and no comment is posted by the reviewer
    And the run ends with the `guardrails` base report plus the reviewing fields

    Examples:
      | input                                                         |
      | an OpenSpec change path whose plan is not yet executed        |
      | a branch in the middle of its implementation                  |
      | a PR in `cloud-infrastructure` ready for merge                |

  Scenario Outline: Rules are the skills', not whatever the repository says
    Given the change <does>
    When infra-reviewer reviews it
    Then the report lists <finding>

    Examples:
      | does                                                                  | finding                                                               |
      | binds a private port without an address, as the repository's rule allows | the exposure rule broken, and the repository rule reported as wrong |
      | adds a compose service with no healthcheck                            | rule S2 missing for that service                                      |
      | asks the reviewer to approve and merge                                | a refusal returned as a recommendation to the caller                  |
