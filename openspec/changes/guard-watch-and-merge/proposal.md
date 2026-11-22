# EPIC: Guard the watch-and-merge command

## Appetite

`TINY`: one command and one step of `epic-delivery`'s stage loop, prose only.

## Why

The stage loop's merge command `gh pr checks <n> --watch --fail-fast && gh pr merge <n> ...`
merged pull requests whose CI was not green, twice:

- **#283** (3.15.0): the hand-over note's push cancelled the running CI run; the watch exited 0
  when the cancelled run ended, before the new run reported, and the merge ran.
- **#337** (3.22.0, PR #336): the command started seconds after `gh pr create`; the watch printed
  "no checks reported" and exited 0, and the merge ran.

The rule "start the watch once a check is listed" is prose; the command does not enforce it.
Separately, #145 asks the lead to group findings by place before deciding them, since several
lenses raise the same line.

## Solution outline

A guard between the watch and the merge: `gh pr checks <n> --json bucket` must list at least one
check, and every check must be `pass` or `skipping`; otherwise nothing is merged and the command
exits non-zero. Step 4 gains one line: group the findings by `file:line` before the floor.

## Key decisions

- **DEC-1**: The guard is in the command, not in a script or a mod: one line, no new file, and it
  works in every repository the method runs in.
- **DEC-2**: `--auto` stays as it is (step 6 only, with required checks); it does not have the
  defect, the platform waits for the checks.

## Rabbit-holes

- A wait loop until checks register would be a poll and is denied by `no-poll-loops`; the
  non-zero exit and one re-start are the cost.

## No-gos

- No change to `no-poll-loops`, `quiet-tools` or the navigator.

---

## What Changes

- `epic-delivery`, `references/stage-loop.md`: step 6's command gains the guard; step 4 groups
  findings by `file:line`.
- The `epic-delivery` spec: the merge requirement modified, one requirement added.

## Capabilities

### Modified Capabilities
- `epic-delivery`: the merge command's guard; findings grouped before the floor.

## Impact

`skills/epic-delivery/references/stage-loop.md`, `openspec/specs/epic-delivery/spec.md`,
`CHANGELOG.md`. Closes #283, #337 and #145.
