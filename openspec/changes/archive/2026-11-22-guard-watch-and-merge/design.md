# PLAN (design half): Guard the watch-and-merge command

> Parent: EPIC "Guard the watch-and-merge command" (proposal.md in this change)

## Context

Two ways the chain reached `gh pr merge` without green CI. `gh pr checks --watch` (gh 2.86)
exits 0 when a newer push cancels the run before the new run reports (#283). With no check
registered, `--watch` (gh 2.102) prints "no checks reported" and exits 1, but on PR #336 the lead
piped it into `tail`, whose exit 0 the `&&` saw (#337; re-checked on PR #339). Observed on PR #336
of skillery and in the #283 report.

## Decisions

- **D-1** The guard reads `gh pr checks <n> --json bucket` once after the watch and passes only
  `length > 0 and all(.[]; .bucket == "pass" or .bucket == "skipping")`; `grep -qx true` turns
  the printed boolean into the exit code. `bucket` is gh's own grouping of a check's state
  (`pass`, `fail`, `pending`, `skipping`, `cancel`).
- **D-2** Checked on 2026-11-22 with gh 2.102.0: the filter prints `true` on PR #338 (four checks
  passed), `false` on an empty list and on a list with one `fail`. `no-poll-loops` and
  `quiet-tools` let the full command run without a deny or a warning.
- **D-3** The lead's reading on a non-zero exit adds `gh pr checks <n>` to `gh pr view`, so it
  tells "no check yet" and "still pending" apart from a red check.

## Error matrix

| State after the watch | Guard | Command |
|---|---|---|
| no check registered | `false` | exits 1, nothing merged; restart once a check is listed |
| a check pending (new run after a cancel) | `false` | exits 1, nothing merged; restart |
| a check failed or cancelled | watch exits non-zero, or guard `false` | nothing merged; read the failing check |
| all checks pass or skipped | `true` | merges, deletes the branch |

## Risks / Trade-offs

- [The lead restarts the command once when it starts too early] → cheaper than a merge without
  CI; the rule to start once a check is listed stays.
