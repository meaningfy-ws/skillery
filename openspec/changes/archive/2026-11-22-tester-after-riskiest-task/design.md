# PLAN (design half): Run the adversarial tester right after the riskiest task

> Parent: EPIC "Run the adversarial tester right after the riskiest task" (proposal.md)

## Decisions

- **D-1** The riskiest task is the one that adds an invariant, a write order, concurrent writes or
  a security boundary. The lead records it in Prepare beside the tester line:
  `riskiest: T-n, <why>`.
- **D-2** The run after the task reads that task's commit range only; the tester brief says so.
- **D-3** The second run at Challenge is judged on the tasks after the riskiest one, by the same
  condition.

## Error matrix

| Case | Handling |
|---|---|
| no task matches the riskiest kinds | no early run; the tester runs at Challenge as before |
| a Critical finding blocks the next task | a fixer before the next brief |
| any other finding | decided at step 4, grouped by `file:line` |
