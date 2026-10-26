# Batch C worktree leftovers (saved 2026-10-26)

Uncommitted work found in the `eval/C-exec-comm` agent worktree when it was pruned (rebundle-by-activity
D-13, owner's choice): `trigger_cases.py` turns a trigger set into a temporary plugin for
`claude plugin eval` (design D-13 of the archived restructure change), `test_trigger_cases.py` its
test, and `approvals-line.patch` one unrecorded line for the archived change's `inputs/approvals.md`.
None of it was reviewed or merged. When `evaluate-catalogue` starts, move the tool to `tools/` and its
test to `tests/` if it is still wanted.
