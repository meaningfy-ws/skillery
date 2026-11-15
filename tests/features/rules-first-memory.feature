# Traces to: openspec/changes/rules-first-memory (DEC-1, DEC-2, DEC-5, DEC-7, DEC-11; design D-2, D-6, worked example);
# specs/rules-first-routing "Every Claude Code session starts with a rules block",
# specs/rules-first-routing "The 2026-11-11 failure no longer reproduces".
# Run by hand in a fresh Claude Code session; no step definitions (skillery runs no model in CI).
Feature: A stated preference reaches the rulebook, not the CLI's memory
  A session with the Meaningfy core bundle tells the agent where rules live and where preferences go.

  Rule: A session with missing rules setup says so once

    # Traces to: rules-first-routing, "Setup visible"
    Scenario: Setup visible
      Given a session starts with no vault found
      And the global instructions do not carry the routing sentence
      When the agent receives the rules block at the start of the session
      Then the block names the missing vault and the missing routing policy
      And the agent's first reply says once that rules are not loaded and how to set them up
      And later replies do not repeat it

  Rule: A stated preference reaches the rulebook

    # Traces to: rules-first-routing, "Acceptance replay" (the 2026-11-11 failure)
    Scenario: The 2026-11-11 failure no longer reproduces
      Given a fresh session with an empty Claude Code config folder and only this branch's core bundle
      And automatic memory is switched on
      When the owner says "in this repo never ask for commit, pr, or merge, just do these actions"
      And the agent finishes a small requested change
      Then the statement is a row of the rule approval card before the final summary
      When the owner approves the rule
      Then the rule is written to the repository's rules by default
      And no new memory note of any type appears in the session's memory
