# Change shapes

Infrastructure changes are specified in the `openspec/` spine of `infrastructure-stacks`, including a
change to `../cloud-infrastructure`, edited in the same change. Writing and gating an EPIC is
`epic-planning`'s; archiving is `spec-stewardship`'s.

## Does it need an OpenSpec change?

| Change | Path |
|---|---|
| A new stack or service, a new VM, a migration, a cutover, a retirement, downtime beyond the deploy's own container restart, data movement, a sweep of several bugs | An OpenSpec change, in one of the shapes below |
| A one-line fix, a pin bump, a doc fix, a restart, bringing one stack to the per-stack minimum | A branch and a PR; the PR is the record |

When the stacks repo's own rules ask for a change, they win. When unsure, open one.

## The three shapes

| Shape | For | Files |
|---|---|---|
| **A. Feature or stack** | a new or changed stack, VM or capability | `proposal.md` (Appetite, Why, decisions, Rabbit-holes, No-gos) · `design.md` (decisions, anti-patterns, error matrix, a phase table with an "idempotent?" column, clarity self-score) · `tasks.md` · the spec delta · `inputs/` |
| **B. Operation or migration** | moving data, a cutover, a resize or rebuild with downtime, a retirement | everything in A, plus an append-only `execution-log.md` ([template](../assets/templates/execution-log.md)) and `scripts/` (cutover, rollback, copy check, counts) |
| **C. Bug sweep** | several defects found together | `proposal.md`, one hypothesis file per bug with a "How to verify" section, a triage table, a small spec delta |

Every shape follows the safe-change protocol, with the baseline acceptance run and the reviewer's
rescoring before execution. Shape B's cutover and rollback scripts and the acceptance features follow
`stack-operations`.
