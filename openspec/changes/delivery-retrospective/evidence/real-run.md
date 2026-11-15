# Real run, old scripts against new (task 4.2, DEC-11)

Date: 2026-11-15. Numbers only (RISK-1).

Method: the transcripts modified in the last 14 days were copied (rsync, structure and modification
times kept, subagent files included) to a snapshot outside any git tree; 3446 files, 2.8 GB. The
old scripts come from git history (the parent of the commit that moved them); old and new digest
and report ran on that snapshot with `--root` and an explicit `--out` each, in separate folders
outside any git tree; the new run was timed as digest plus report.

## Counts, old against new

| Measure | Old | New | Equal |
|---|---|---|---|
| Sessions | 167 | 167 | yes |
| Subagents (session field) | 1002 | 1002 | yes |
| Subagent stream rows (agents.jsonl, nested included) | 1336 | 1336 | yes |
| Model calls, lead + subagent rows | 18453 + 31594 = 50047 | 18453 + 31594 = 50047 | yes |
| Input tokens | not shown | not shown | yes |
| Output tokens | not shown | not shown | yes |
| Cache read tokens | not shown | not shown | yes |
| Cache write tokens | not shown | not shown | yes |
| Total recorded cost | not shown | not shown | yes |
| Epic rows (epics.tsv) | 179 | 179 | yes |
| Estimated cost per phase (USD, rounded) | same 25 rows | same 25 rows, labelled `guessed:` | yes |

Absolute cost and token sums are kept out of this public file (RISK-1); they were equal.

Only the `repo` label of the rows differs (31 sessions, 12 subagent rows, 3 epic rows): the new
digest derives the repo name differently. No number differs.

## New run

| Measure | Value |
|---|---|
| Digest plus report, wall clock | 4 min 22 s (262 s); user CPU 65 s, system 6 s |
| Digest alone, second run (probe, warm cache) | 206 s wall; user CPU 54 s, system 14 s |
| Old digest, for comparison | 268 s |
| Lines read | 600622 |
| Unknown records (D-6) | 0 (no drift warning) |
| Malformed marks | 0 |
| Guessed share of cost | 100% (no session carried a mark yet; every phase is `guessed:`) |
| Sessions with assistant records and no usage | 0 |

## Verdict

- Invariant (design *Invariants*, first row): holds. Sessions, subagents, calls, token sums and
  cost are equal, old against new, on the same snapshot.
- Acceptance under 60 s wall clock for digest plus report: NOT met. 262 s measured; a second run of the digest alone took 206 s. CPU time is
  about 70 s of that; the rest is wall time spent reading 2.8 GB. The old digest was not faster (268 s), so
  task 2 did not slow it; the target is out of reach on a 14-day window of this size without a
  change of design (cache of parsed sessions, or a shorter default window).
