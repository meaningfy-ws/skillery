# EPIC: Run the adversarial tester right after the riskiest task

## Appetite

`TINY`: one step of `epic-delivery`'s stage loop and its ledger row, prose only.

## Why

Issue #144: in a LARGE stage of six tasks the tester ran once, at Challenge. Both real defects sat
in the one task that added an invariant and a two-step write order. The fix was a large late pass
over code built hours earlier; a run right after that task would have given a small fix while the
builder's context was fresh.

## Solution outline

From LARGE up, when the tester condition holds, the lead names the riskiest task in Prepare; the
tester runs on that task's diff right after its commit, and again at Challenge only if the rest of
the stage still meets the condition.

## Key decisions

- **DEC-1**: The condition is unchanged and stays defined once (the requirement and Prepare); only
  the moment of the run changes.
- **DEC-2**: Findings still wait for step 4, except a Critical one that blocks the next task.
- **DEC-3**: MEDIUM keeps one run at Challenge.

## Rabbit-holes

- Running the tester after every task would multiply spawns; one run on the riskiest task is the
  bet.

## No-gos

- No change to the workflow file's `tester` wording, which only points to Prepare (D-5).

---

## What Changes

- `epic-delivery`: `references/stage-loop.md` steps 1 to 3 and the ledger row;
  `references/team-and-briefs.md` the tester brief's input.

## Capabilities

### Modified Capabilities
- `epic-delivery`: the tester's moment from LARGE up.

## Impact

`skills/epic-delivery/references/`, `openspec/specs/epic-delivery/spec.md`. Closes #144.
