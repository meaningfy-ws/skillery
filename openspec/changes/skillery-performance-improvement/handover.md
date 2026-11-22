# Hand-over: skillery-performance-improvement, after stage 3

<!-- Five headings, nothing else. Point, never copy: decisions stay in design.md.
     Saved as openspec/changes/<change-id>/handover.md, the last commit of the stage's PR. -->

## Done
Stage 3 (scale verification), PR #330 (merged by the watch-and-merge command after this note);
stages 1 and 2 were PRs #328 and #329. Tasks 3.1 to 3.4 done; 3.5 (the stage-3 measurement)
runs within seven days of the release that carries this stage; 2.5 likewise; 1.4's interactive
half is still owed (D-23).

## Decided since the PLAN
D-19 to D-39 (design.md, Delivery decisions). D-39: `catalogue-governance` gained a MODIFIED
delta in this stage; the spec sync at archive must take it.

## Open
- Tasks 1.4 (interactive half), 2.5 and 3.5: a fresh session after the release.
- The owner's approval of the inventory's disable list (D-22); the second machine (D-20).
- The rule approval card from the planning session (three rows) is unanswered; P-0006 and
  R-0004 were updated on the DEC-3 answer (D-34).
- Under-the-floor findings for stage 4's navigator work: D-31 (W1, S1, S2), D-37 (L3+L4+L5 W2
  `small_stage` retirement, S1 to S3); for the docs stage: D-25, D-30 T2/T3/T5, D-31 rest, D-32
  S1 to S3, D-37 rest.
- The engine's `usage.context` fields (`tokens`, `window`) unverified (D-28); 1.4 settles it.
- The governance change on dual-CLI parity (DEC-10) is outside this EPIC.

## Next
Stage 4 (lower the floor), task 4.1. **First, in this fresh session, finish task 1.4 (D-23):**
run `/context`, then spawn one `implementer` and one `code-reviewer` with a one-line brief that
asks each to report its `/context` composition; record the three compositions in
`docs/practice/ai-coding/usage-reports/2026-11-22.md` §Floors and which `usage.context` fields
the CLI provides (D-28); 1.4's three variants decide what 4.2 ships (D-3, RISK-8). Then read:
tasks.md §4, design.md D-2, D-3, D-9, D-14, D-15, D-16, D-31, D-37; the deltas
specs/subagent-dispatch, specs/epic-shape, specs/rules-first-routing; `agents/*.md`,
`tools/repo_lint/lint.py` (how a check is added and tested), `skills/clarity-gate/references/`,
`skills/rulebook/scripts/rules.py` (`cmd_load`), `skills/epic-delivery/assets/templates/`.

## Prompt
Act as the team lead. Deliver stage 4 of openspec/changes/skillery-performance-improvement from
handover.md; start with the owed half of task 1.4 as the note says.
