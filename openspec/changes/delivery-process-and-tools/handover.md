# Hand-over: delivery-process-and-tools, after stage 1

## Done
Stage 1, PR #247 (merged by the watch-and-merge command after this note).

## Decided since the PLAN
D-21, D-22, D-23, D-24, and the findings under the floor (design.md, Delivery decisions).

## Open
- For the developer: the scenario "A note that copies the design" (spec `epic-delivery`,
  `tests/features/epic-delivery.feature`) has the checker read the note, but the note is written
  after the check (D-1). Recommended: the cold-start check (D-11) judges the note; drop the
  checker clause from the scenario in stage 2.
- `team-and-briefs.md` points to `guardrails` `references/activity-tools.md`, which stage 2
  creates (task 2.1); no release before stage 2 merges.
- Under-the-floor items for `lean-skills` or later: the CHK-17 and CHK-65 wording in
  `test-strategy`, the sample band in `docs/environment/navigator.md`, the unused `clarity` gate.

## Next
Stage 2, task 2.0 (cold-start check of this note into `evidence/cold-start.md`), then 2.1.
Read first: tasks.md §2, design.md D-9, D-10, D-15, D-16, specs/activity-tools.

## Prompt
Act as the team lead. Deliver stage 2 of openspec/changes/delivery-process-and-tools in skillery
from its handover.md. Commit, push and merge without asking; merge only on green CI.
