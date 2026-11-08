# Q&A record — round 1 (2026-11-08)

**Secondary input. Never groomed or deleted.**

## Question put to the owner

Are the 13-step loop and the 13 roles explained anywhere, and is any of it overkill?

Answer given: explained only in mapping-workbench-v2 `develop/agents.adoc` (roles table, "The loop
of a stage") and its `AGENTS.md`; rdf-persistence ran a 10-step loop over six stages of
`toolkit-v1-foundation` (~35 review/fix commits); MWB2's three added steps (dependency check,
scenario sign-off, acceptance demo) have never run (no `mwb2/` code yet). Critique: (1) no scaling
by work size; (2) three overlapping assurance passes plus double checks; (3) 13 roles are ~5 agents
with different briefs plus 2 people; (4) 7 reviewers per stage; (5) acceptance demo per stage;
(6) cold reader on every page; (7) durations table and question-led pages are project habits;
plus: unproven steps should be marked provisional.

## Owner's answers

- **Upstream rule.** No workarounds applies to *our* libraries. For an *external* library there is
  a decision: implement the feature in the foreign library and push it upstream, or at least release
  it from the Meaningfy GitHub, or indeed do the workaround, as it might be quicker.
- **(1)** Agreed: the loop scales with the size of the work.
- **(2)** Eliminate redundancies; leaner and equally effective.
- **(3)** Propose a leaner, clearer team with different tasks. Steward and product owner are the
  same, maybe the project manager too. The product manager is the owner (the developer), plus an
  assistant that walks them through the process and the decisions and maintains the documentation.
- **(4)** Address the seven-reviewer fan-out; leaner and more efficient, keep effectiveness.
- **(5)** Acceptance demo per EPIC only.
- **(6)** Cold reader only for how-to/tutorial pages: yes.
- **(7)** Durations table and question-led pages are project habits: yes.
- Unproven steps marked provisional: yes.
- Plan and adjust documentation pages as needed. Proceed with shaping.

## Still open from the first draft

Q-1 commit body, Q-2 docs layout, Q-3 UX lens, Q-4 dogfooding — carried into the EPIC with a
recommended default each.

## Round 2 (2026-11-08)

Owner: "I agree to 1-4 defaults, proceed with shaping and then implementing, in parallel with
subagents we will proceed with simplifying the development cycle in those sibling repos as well,
and commit in the sibling repos."

Recorded: Q-1..Q-4 accepted as their defaults. Sibling repos (mapping-workbench-v2,
rdf-persistence) are simplified to the lean practice in parallel, committed locally on a docs
branch in a worktree each (rdf-persistence's main clone holds another session's uncommitted work),
not pushed.
