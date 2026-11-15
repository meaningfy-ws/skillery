# Traces to: skills/epic-delivery/SKILL.md; openspec/changes/align-agent-team-delivery (DEC-1, DEC-7, DEC-8, DEC-9, DEC-10);
# openspec/changes/lean-delivery (DEC-3..DEC-9, DEC-13; FC-1..FC-8);
# openspec/changes/delivery-process-and-tools (DEC-1, DEC-3..DEC-7, DEC-18; D-1..D-8), each scenario
# below naming its DEC-/D- ids and the `epic-delivery` spec requirement it follows.
# Run by hand per CLI on a real EPIC; no step definitions (skillery runs no model in CI).
Feature: The lead delivers a gated PLAN with a team scaled to the appetite
  The main session leads; members build, review and check; people validate once per EPIC.

  Background:
    Given an EPIC whose PLAN passed the clarity gate
    And the developer has signed off its scenarios

  # DEC-3, DEC-5; D-4, D-5. Spec: The loop scales with the appetite.
  Scenario Outline: Challenge and check scale with the appetite
    Given the EPIC's appetite is <appetite>
    And a stage that <screens> screens, with <risk> recorded for it
    When the lead runs the stage
    Then the challenge step dispatches <challenge>
    And the adversarial tester runs <tester>
    And the check step is <check>

    Examples:
      | appetite | screens         | risk     | challenge                                          | tester           | check                         |
      | SMALL    | does not change | no risk  | one combined review pass (spec and structure)      | never            | the stage's full gates and CI |
      | MEDIUM   | does not change | no risk  | two reviewers (L1 with L2; L3 with L4 and L5)      | on its condition | one fresh checker             |
      | MEDIUM   | does not change | a risk   | the five review lenses in parallel                 | on its condition | one fresh checker             |
      | LARGE    | changes         | no risk  | the five lenses and the UX lens in parallel        | on its condition | one fresh checker             |

  # DEC-5; D-4. Spec: The loop scales with the appetite (no small-stage allowance below LARGE).
  Scenario Outline: The small-stage allowance exists only from LARGE up
    Given a <appetite> stage that adds 450 lines of low-risk change
    When the lead chooses its review set
    Then <outcome>

    Examples:
      | appetite   | outcome                                                                                              |
      | MEDIUM     | the two-reviewer default applies and no allowance or decision is recorded                            |
      | VERY LARGE | the lead may merge the lenses into two reviewers by a recorded decision; tester and checker stay separate |

  # DEC-4; D-2. Spec: Findings pass a severity floor and a stage has one fix pass.
  Scenario Outline: Only a Critical finding becomes a fix
    Given a reviewer reports a <label> finding
    And <lead_view>
    When the lead decides the findings
    Then <outcome>

    Examples:
      | label   | lead_view                                                  | outcome                                                                                   |
      | Warning | the lead agrees it is a Warning                            | it is rejected as "under the floor" and listed under Delivery decisions in the design     |
      | Warning | the lead judges it Critical and records why                | it is re-labelled Critical and fixed in the one fix pass                                  |
      | Warning | the lead re-labelled it Critical and the checker disagrees | the re-label goes to the developer and the floor stands until the developer decides       |

  # DEC-4; D-2. Spec: Findings pass a severity floor and a stage has one fix pass.
  Scenario: A tester's test under the floor is deleted
    Given an adversarial test failed on its first run for a finding under the floor
    When the lead decides the findings
    Then the test is deleted with the reason "under the floor"

  # DEC-4; D-3. Spec: Findings pass a severity floor and a stage has one fix pass.
  Scenario Outline: After the one fix pass, what is left goes to the developer
    Given the stage's one fix pass is done
    And <event>
    When the lead handles it
    Then <outcome>
    And no second fix pass starts

    Examples:
      | event                                          | outcome                                                                                              |
      | the checker finds an item of the pass unmet    | the developer gets one question with a recommendation: fix it now as a recorded decision, or an issue |
      | the tester's report arrives late with findings | its findings go to the developer the same way as an unmet item                                      |
      | CI is red or the merge is refused              | only that failure is fixed, the full gates run once and no new finding is accepted                  |

  # DEC-3; D-5. Spec: The adversarial tester runs on its condition.
  Scenario Outline: The tester runs on its condition
    Given a <appetite> stage that changed code
    And the PLAN <invariants>
    When the lead prepares the stage
    Then <tester>
    And the pull request body records the answer in one line

    Examples:
      | appetite | invariants                                                      | tester                                            |
      | MEDIUM   | has an invariant for that code whose test is the tester's        | the tester runs with the reviewers ("tester: yes", with the invariant) |
      | LARGE    | has an Invariants section with no tester row for that code       | no tester runs ("tester: no", with the reason)    |
      | LARGE    | has no Invariants section                                        | the tester runs, as before the condition existed  |
      | MEDIUM   | has no Invariants section                                        | no tester runs                                    |
      | SMALL    | has an invariant for that code whose test is the tester's        | no tester runs                                    |

  # DEC-18; D-6. Spec: A challenge or check result ends in one line.
  Scenario Outline: Each challenge or check report ends in one result line
    Given a <role>'s report that <ends>
    When the lead has decided its findings
    Then <outcome>

    Examples:
      | role     | ends                                                 | outcome                                                                          |
      | reviewer | ends with its result line, the accepted count open   | the lead writes the line again with the accepted count under Results in the pull request |
      | checker  | ends with its result line, the accepted count open   | the lead writes the line again with the accepted count under Results in the pull request |
      | tester   | ends without a result line                           | the lead returns it as incomplete and re-runs no gate                            |

  # DEC-6; D-7. Spec: A pull request is watched and merged by one command.
  Scenario Outline: One background command watches and merges the pull request
    Given a stage's pull request whose checks <state>
    When the lead reaches the Merge step
    Then <outcome>

    Examples:
      | state                     | outcome                                                                                      |
      | are not yet listed        | the lead waits until a first check is listed before starting the command                     |
      | pass                      | the command merges and deletes the branch, and its completion notice is the only wait        |
      | fail                      | nothing is merged and the lead reads the pull request's state and the failing check first   |

  # DEC-1; D-1. Spec: A stage ends with a hand-over note and a fresh session.
  Scenario: A stage ends with the note and a fresh session
    Given a stage whose check has passed
    When the lead closes the stage
    Then it commits the hand-over note, with Done, Decided since the PLAN, Open, Next and Prompt, as the pull request's last commit
    And it starts the watch-and-merge command only after that commit
    And it ends the session after the merge without compacting
    And the developer starts the next stage in a fresh session with the note's prompt

  # DEC-1; D-1, D-11. Spec: A stage ends with a hand-over note and a fresh session.
  Scenario: The fresh session starts from the note alone
    Given a new session holding only the note's prompt and the change folder
    When it prepares the next stage
    Then it reaches its first brief without asking what was decided
    And it reads neither the change's inputs nor archived changes

  # DEC-1; D-1. Spec: A stage ends with a hand-over note and a fresh session.
  Scenario: A note that copies the design is cut
    Given a hand-over note that restates decisions of the design
    When a new session is started from it for the cold-start check
    Then the cold-start record notes it and the note template is cut to decision ids and pointers

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
      | the one fix pass has just ended                              | runs the full gates once and names the trigger in the commit |

  # DEC-4; D-3. Spec: Each check runs once, at its moment, with one owner.
  Scenario: Each check runs once in a stage
    Given a stage whose review led to one fix that turned a test red
    When the fixer works
    Then only the failing test is re-run until green
    And the full gates run once after the fix pass, then CI
    And no reviewer re-runs the test suite

  Scenario Outline: Builders work through the code tools, not the shell
    Given a builder on a programming task in a session that <has>
    When it needs to <need>
    Then it uses <tool>

    Examples:
      | has                       | need                                   | tool                                                         |
      | Serena and ast-grep       | find and replace a function's body     | Serena, never sed or a python heredoc                        |
      | Serena and ast-grep       | change one call pattern in many files  | an ast-grep rewrite                                          |
      | Serena and ast-grep       | read a file                            | the CLI's file read tool, never cat or head                  |
      | Serena and ast-grep       | count failures in the test output      | a grep in the pipe, since no file is read or edited          |
      | neither Serena nor ast-grep | find a symbol's callers              | grep, and its report says the tools were unavailable         |

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
