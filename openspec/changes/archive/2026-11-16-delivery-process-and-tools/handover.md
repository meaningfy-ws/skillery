# Hand-over: delivery-process-and-tools, after stage 3

## Done
Stage 3, PR #258 (merged by the watch-and-merge command after this note). All three build stages
are merged; cold-start check of stage 2's note: pass (`evidence/cold-start.md`).

## Decided since the PLAN
D-21 to D-32 (design.md, Delivery decisions); the stage-3 items under the floor are listed there.

## Open
- Reconciled after stage 3 (D-33, D-34): the proposal, design and spec deltas carry D-21 to D-32;
  #261 fixed; the stage-2 agent scenarios run by hand on Claude Code (`evidence/scenarios.md`),
  two failures fixed and re-run green. opencode runs are still owed.
- Issues outside this EPIC: #263 (project-side budget check), #265 (`apply` expects
  `cosmic-python` in a repository that is not Python).
- Loading a bundle with `--plugin-dir` from a checkout loads no agents (symlinks): use a
  dereferenced copy, `cp -rL bundles/<bundle> <dir>` (D-33).

## Next
1. Task 3.5: the start-weight measurement, on one day, from the base and the new checkout with
   `--plugin-dir` (D-12), into `evidence/start-weight.md`.
2. The acceptance demo (LARGE, mandatory; *After the last build stage* in tasks.md), verdict in
   `evidence/acceptance.md`; then the docs stage.
3. The release per `meaningfy-release` (DEC-15). The release block of stage 2 is lifted: 3.2 has
   merged.
Read first: tasks.md §3.5 and *After the last build stage*, design.md D-11, D-12.

## Prompt
Act as the team lead. Continue openspec/changes/delivery-process-and-tools in skillery from its
handover.md: task 3.5, then the acceptance demo with me. Commit, push and merge without asking;
merge only on green CI.
