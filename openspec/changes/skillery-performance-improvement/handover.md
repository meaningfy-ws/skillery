# Hand-over: skillery-performance-improvement, after stage 2

<!-- Five headings, nothing else. Point, never copy: decisions stay in design.md.
     Saved as openspec/changes/<change-id>/handover.md, the last commit of the stage's PR. -->

## Done
Stage 2 (end sessions), PR #329 (merged by the watch-and-merge command after this note); stage 1
was PR #328. Tasks 2.1 to 2.4 done; 2.5 (the stage-2 measurement) runs within seven days of the
release that carries this stage; 1.4's interactive half is still owed (D-23).

## Decided since the PLAN
D-19 to D-33 (design.md, Delivery decisions). D-33: epic-planning points to P-0006's appetite
scoping before 3.1 writes it; 3.1 closes it first in stage 3.

## Open
- Task 1.4's interactive half (D-23) and task 2.5: both need a fresh session after the release.
- The owner's approval of the inventory's disable list (D-22); the second machine (D-20).
- The rule approval card from the planning session (three rows) is unanswered.
- Under-the-floor findings: D-25 (stage 1), D-30 T2/T3/T5, D-31, D-32 S1 to S3; D-31's W1, S1,
  S2 are the refactoring candidates when stage 4 touches the navigator.
- The engine's `usage.context` fields (`tokens`, `window`) are unverified (D-28); 1.4 settles it.
- The governance change on dual-CLI parity (DEC-10) is outside this EPIC.

## Next
Stage 3 (scale verification), task 3.1. **First, in this fresh session, finish task 1.4 (D-23):**
run `/context`, then spawn one `implementer` and one `code-reviewer` with a one-line brief that
asks each to report its `/context` composition; record the three compositions in
`docs/practice/ai-coding/usage-reports/2026-11-22.md` §Floors, and whether `usage.context`
carries `tokens` or `window` (D-28). Then read: tasks.md §3, design.md D-4, D-6, D-7, D-8, D-19;
the deltas specs/epic-delivery, specs/pr-review-modes, specs/epic-shape;
`skills/epic-delivery/assets/workflows/epic-delivery.workflow.json`, `mods/navigator/lib/dispatch.ts`,
`skills/meaningfy-code-review/SKILL.md`, `docs/rules/` P-0006 and the vault's R-0004 (task 3.1
goes through `rule-learner` with the owner).

## Prompt
Act as the team lead. Deliver stage 3 of openspec/changes/skillery-performance-improvement from
handover.md; start with the owed half of task 1.4 as the note says.
