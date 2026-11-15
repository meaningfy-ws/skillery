# Hand-over: delivery-process-and-tools, after stage 3

## Done
Stage 3, PR #258 (merged by the watch-and-merge command after this note). All three build stages
are merged; cold-start check of stage 2's note: pass (`evidence/cold-start.md`).

## Decided since the PLAN
D-21 to D-32 (design.md, Delivery decisions); the stage-3 items under the floor are listed there.

## Open
- Issue #261: `hooks.yaml`'s GitNexus intents still say "before editing a symbol" and cite the
  cut `CLAUDE.md` rules (stage 3, L1+L2 W1, under the floor).
- The agent scenarios of stage 2 (`implementer.feature`, `code-reviewer.feature`) are run by hand
  per CLI; not yet recorded.
- The GitNexus index is stale; re-index only with `npx gitnexus analyze --skip-agents-md`.

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
