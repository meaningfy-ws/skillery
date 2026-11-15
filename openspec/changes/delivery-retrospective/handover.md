# Hand-over: delivery-retrospective, after stage 2

## Done
Stage 1, PR #262. Stage 2 (tasks 3.1–3.3, 4.1), PR #269 (merged by the watch-and-merge command
after this note): the mark line in `epic-delivery` and `epic-planning`, the navigator warning, the
real run.

## Decided since the PLAN
D-12 to D-26 (design.md, Delivery decisions).

## Open, for the developer
- D-24, task 4.2: the invariant holds; the 60 s acceptance is not met (262 s, I/O bound, old
  scripts 268 s). Recommended: amend it to "no slower than the old scripts on the same snapshot".
- D-24, task 3.4: walk the mark scenarios by hand on Claude Code (stage start, hand-over session,
  shaping, PLAN) and sign them off.
- D-21 and D-26 under the floor stay for a later change.
- The worktree `../skillery-retro` links `.venv` and `node_modules` from the main checkout.

## Next
The developer's ruling on D-24, then the acceptance demo (MEDIUM), the docs stage and the archive
(`epic-delivery` `references/stage-loop.md`, *After the last build stage*). No build stage is left.

## Prompt
Act as the team lead. Close openspec/changes/delivery-retrospective in skillery from its
handover.md: record the developer's D-24 ruling, run the acceptance, the docs stage and the archive.
