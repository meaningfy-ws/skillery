# Traces to: agents/code-reviewer.md (Dispatch contract, Report); docs/development/agent-template.md; D-16; openspec/changes/lean-delivery (DEC-5, DEC-9, DEC-11).
# Run by hand per CLI (agent-template.md "Tests"); the validator checks the shape.
Feature: code-reviewer reviews one change through one lens or one lens group, or several where a decision merges them
  A caller runs a full pre-PR review as two grouped dispatches (L1+L2, L3+L4+L5), or as five
  single-lens dispatches for the deep review on a recorded risk, and the reviewer reports its
  lenses' findings per lens id without changing anything.
  Other several-lens briefs are accepted only with a confirmed appetite or a recorded decision.

  Background:
    Given the code-reviewer agent is installed with skills `meaningfy-code-review`, `cosmic-python`
    And a change with a diff, its specs and its covering scenarios

  Scenario Outline: One dispatch reviews one lens
    When the caller dispatches the code-reviewer with lens "<lens>"
    Then every finding reported is tagged with lens "<lens>"
    And each finding names a location, a catalogue entry, why it matters and a fix
    And no file in the change is modified
    And the run ends with the `guardrails` base report plus the reviewing fields

    Examples:
      | lens |
      | L1   |
      | L2   |
      | L3   |
      | L4   |
      | L5   |

  Scenario: No lens is refused
    When the caller dispatches the code-reviewer without naming a lens
    Then it returns "a lens group of the review set (L1+L2 or L3+L4+L5), one lens, or the deep review as five runs"
    And it reviews nothing

  # Traces to: DEC-3; D-4 (pr-review-modes, "The default review is two grouped runs").
  Scenario Outline: The default review is two grouped runs, each reporting per lens id
    Given a MEDIUM change with no recorded risk
    When the caller dispatches the code-reviewer with the lens group "<group>"
    Then it reviews through each lens of the group without a recorded decision
    And every finding reported is tagged with its own lens id from the group
    And no file in the change is modified

    Examples:
      | group    |
      | L1+L2    |
      | L3+L4+L5 |

  Scenario: The deep review is five single-lens runs on a recorded risk
    Given a LARGE change whose PLAN records "RISK-2" naming the stage's files
    When the caller asks for the deep review, cites "RISK-2" and dispatches the code-reviewer once per lens
    Then each run reviews exactly its one lens and reports only its findings
    And the five reports are merged by the caller into one prioritised report

  Scenario: All five lenses in one run are refused
    When the caller dispatches the code-reviewer with lenses "L1", "L2", "L3", "L4" and "L5" in one run
    Then it returns "a lens group of the review set (L1+L2 or L3+L4+L5), one lens, or the deep review as five runs"
    And it reviews nothing

  Scenario: Two lenses are refused
    When the caller dispatches the code-reviewer with lenses "L1" and "L3"
    Then it returns "a lens group of the review set (L1+L2 or L3+L4+L5), one lens, or the deep review as five runs"
    And it reviews nothing

  Scenario: Several lenses are accepted for a SMALL appetite whose review set lists them
    Given the change's proposal.md records "SMALL" under "## Appetite"
    When the caller dispatches the code-reviewer with lenses "L2" and "L3" and names the appetite "SMALL"
    Then it reads the appetite in proposal.md to confirm it
    And every finding reported is tagged with its own lens "L2" or "L3"
    And no file in the change is modified

  # Traces to: DEC-5; D-4, D-22.
  Scenario: Several lenses are accepted for a MEDIUM appetite with a default group
    Given the change's proposal.md records "MEDIUM" under "## Appetite"
    When the caller dispatches the code-reviewer with lenses "L1" and "L2" and names the appetite "MEDIUM"
    Then it reads the appetite in proposal.md to confirm it
    And every finding reported is tagged with its own lens "L1" or "L2"
    And no file in the change is modified

  Scenario: Several lenses are refused when the brief's appetite disagrees with the proposal
    Given the change's proposal.md records "LARGE" under "## Appetite"
    When the caller dispatches the code-reviewer with lenses "L2" and "L3" and names the appetite "SMALL"
    Then it returns "a lens group of the review set (L1+L2 or L3+L4+L5), one lens, or the deep review as five runs"
    And it reviews nothing

  Scenario: Several lenses are accepted with a recorded small-stage decision
    Given the change's design.md records "D-3" under "## Delivery decisions" with lenses "L1" and "L2"
    When the caller dispatches the code-reviewer with lenses "L1" and "L2" and cites "D-3"
    Then it reads "D-3" in design.md to confirm the lenses
    And every finding reported is tagged with its own lens "L1" or "L2"

  Scenario: Several lenses are refused when the cited decision is not recorded
    Given the change's design.md records no "D-3" under "## Delivery decisions"
    When the caller dispatches the code-reviewer with lenses "L1" and "L2" and cites "D-3"
    Then it returns "a lens group of the review set (L1+L2 or L3+L4+L5), one lens, or the deep review as five runs"
    And it reviews nothing

  # Traces to: DEC-18; D-6.
  Scenario: The review ends with the result line
    When the caller dispatches the code-reviewer with lens "L1"
    Then the report ends with a line "result: stage=<s> role=reviewer lens=L1 findings=<n> accepted=-"

  Scenario: L2 reads the gate report instead of running the suite
    Given the stage's gate report shows one failing test
    When the caller dispatches the code-reviewer with lens "L2"
    Then the findings report the failing test from the gate report
    And the reviewer does not re-run the test suite

  Scenario: L2 checks that changed docs agree with the code
    Given the diff renames a phase that a how-to page still names
    When the caller dispatches the code-reviewer with lens "L2"
    Then the findings name the page and the stale name

  # Traces to: DEC-4, DEC-11; D-7 (pr-review-modes, "Refactor recommendations carry gitnexus blast radius").
  Scenario: The reviewer runs no GitNexus tool and reads the impact from the brief
    Given the brief carries the lead's upstream impact result for the stage's symbols
    When the caller dispatches the code-reviewer with lens "L5"
    Then the findings cite the brief's blast radius for each refactor candidate
    And the reviewer runs no GitNexus tool
    And the reviewer edits no file

  Scenario: Without an impact result the review says so and goes on
    Given the brief carries no impact result
    When the caller dispatches the code-reviewer with lens "L5"
    Then the report states that the blast radius was not computed
    And the review of the other entries proceeds

  Scenario: Asked to fan out, the reviewer has no tool to start another agent
    When the caller asks the code-reviewer to dispatch another agent for part of the review
    Then it has no tool to start one
    And it says so in its report

  # Failure case: delivery-retrospective finding F-5 (a worker carried the session's whole tool catalogue).
  Scenario: The reviewer starts with its own tools, not the session's
    Given the session has connector tools the review does not need
    And the project has the code-intelligence servers `serena`, `ast-grep` and `gitnexus`
    When the caller dispatches the code-reviewer with lens "L1"
    Then it can read, search, run commands and load skills
    And it can load and call a tool of the `serena` and `ast-grep` servers
    And it is offered no tool of the `gitnexus` server
    And no other connector tool and no file-editing tool is offered to it
    And its report reaches the caller
