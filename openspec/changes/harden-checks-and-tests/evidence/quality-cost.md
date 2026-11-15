# The cost of the shared checks (task 1.15, D-22)

Measured on 2026-11-15, on one Linux amd64 laptop, on projects scaffolded by `project-setup` from
the stage branch at commit `34d0a57` (after the fix pass), with `QUALITY_VERSION` set to that
commit (D-19). The four external sources approved for this release were fetched too
(report-only).

| Archetype | `make check-quality`, first run (fetch, tool install) | `make check-quality`, warm `.quality/` |
|---|---|---|
| product | 37 s | 15 s |
| library | 36 s | 16 s |

The first run at `fbda288`, before the fix pass, took 50 s and 49 s (warm 24 s and 25 s): it
downloaded the same external archive once per source; D-40 downloads it once.

The warm figure is the one a developer pays on each run: Ruff, mypy, import-linter, three Semgrep
passes, ls-lint and checkmake on the empty skeleton. The first-run figure adds the download of the
shared checks, the Semgrep virtual environment and the two binaries, once per pin.

The output of the run that measured it, with the IT-04 and IT-05 cases, is in the stage pull
request (#246); the figures above are from the run on the stage's final commit.
