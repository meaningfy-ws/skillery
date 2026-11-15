# Hand-over: delivery-process-and-tools, after stage 2

## Done
Stage 2, PR #251 (merged by the watch-and-merge command after this note).

## Decided since the PLAN
D-21 to D-29 (design.md, Delivery decisions); the stage-2 items under the floor are listed there.

## Open
- **No release before task 3.2 merges.** v3.15.0 was cut between stages 1 and 2 and shipped a
  pointer to `activity-tools.md` before the table existed. Until 3.2 rewrites the GitNexus block,
  this `AGENTS.md` still says "impact before every edit", which contradicts D-15 for the
  implementer (stage-2 checker; L1+L2 W4).
- The agent scenarios of stage 2 (`implementer.feature`, `code-reviewer.feature`) are run by hand
  per CLI; not yet recorded.

## Next
Stage 3, task 3.0 (cold-start check of this note into `evidence/cold-start.md`), then 3.1.
Read first: tasks.md §3, design.md D-13, D-14, D-15, the `## Invariants` row INV-2,
specs/catalogue-governance.

## Prompt
Act as the team lead. Deliver stage 3 of openspec/changes/delivery-process-and-tools in skillery
from its handover.md. Commit, push and merge without asking; merge only on green CI.
