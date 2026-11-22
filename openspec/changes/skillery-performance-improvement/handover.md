# Hand-over: skillery-performance-improvement, after stage 4

<!-- Five headings, nothing else. Point, never copy: decisions stay in design.md.
     Saved as openspec/changes/<change-id>/handover.md, the last commit of the stage's PR. -->

## Done
Stage 4 (lower the floor), PR #331 (merged by the watch-and-merge command after this note);
stages 1 to 3 were PRs #328, #329, #330. Tasks 4.1 to 4.6 done; 4.7 (the stage-4 measurement),
3.5, 2.5 and 1.4's interactive half run in a fresh session after the release.

## Decided since the PLAN
D-19 to D-48 (design.md, Delivery decisions). D-41: the shipped variant without the A/B of 1.4;
D-44 W3: the one-preload rule applies to the delivery workers only in this stage; D-47: the
change check's critical count, accepted; D-48: the checker's seven items, fixed now.

## Open
- Tasks 1.4 (interactive half, now also the floors of the shipped variant), 2.5, 3.5, 4.7: a fresh
  session after the release; 4.7 lists the bundle-specific workers still carrying several preloads.
- The owner's approval of the inventory's disable list (D-22); the second machine (D-20).
- The rule approval card from the planning session (three rows) is unanswered.
- Under-the-floor findings: D-25, D-30, D-31, D-32, D-37, D-38 T1/T13, D-45 S14/S16a, D-46
  T3/T5; stage 5's navigator-free scope leaves the navigator refactorings (D-31, D-37) for the
  docs stage or a follow-up.
- The engine's `usage.context` fields (`tokens`, `window`) unverified (D-28).
- The governance change on dual-CLI parity (DEC-10) is outside this EPIC.

## Next
Stage 5 (quiet the tools), task 5.1. Read first: tasks.md §5, design.md D-10, D-13, D-18, D-19;
the deltas specs/activity-tools, specs/lean-project-templates (new capability), specs/epic-delivery
("A pull request is watched and merged by one command"); `skills/guardrails/SKILL.md` §6 and
`references/activity-tools.md`; `mods/` (how a PreToolUse mod is declared and tested, e.g.
`mods/no-shell-edits`, `docs/development/mods.md`); `skills/project-setup/assets/templates/`
(pytest.ini, AGENTS.md.tmpl, the Serena config, the Makefile template) and its quick start;
`skills/epic-delivery/references/stage-loop.md` step 6 (the merge command).

## Prompt
Act as the team lead. Deliver stage 5 of openspec/changes/skillery-performance-improvement from
handover.md.
