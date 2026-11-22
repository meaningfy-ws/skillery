# PLAN (tasks half): Guard the watch-and-merge command

> Derived from EPIC "Guard the watch-and-merge command"

## 1. Stage 1: the guard and the grouping

- [x] 1.1 Step 6 of `skills/epic-delivery/references/stage-loop.md`: the command with the guard and the reading on a non-zero exit (design.md#d-1, design.md#d-3).
- [x] 1.2 Step 4: group the findings by `file:line` before the floor (spec, "Findings are grouped by place before the floor").
- [x] 1.3 CHANGELOG line under Unreleased.

## Roadmap

- [x] 1.1 · [x] 1.2 · [x] 1.3

## Verification

`make validate` and `make validate-spine` green; this change's own PR merged by the guarded
command, with CI registered and green before the merge.
