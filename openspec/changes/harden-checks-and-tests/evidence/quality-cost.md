# The cost of the shared checks (task 1.15, D-22)

Measured on 2026-11-15, on one Linux amd64 laptop, on projects scaffolded by `project-setup` from
the stage branch at commit `fbda288`, with `QUALITY_VERSION` set to that commit (D-19). The four
external sources approved for this release were fetched too (report-only).

| Archetype | `make check-quality`, first run (fetch, tool install) | `make check-quality`, warm `.quality/` |
|---|---|---|
| product | 50 s | 24 s |
| library | 49 s | 25 s |

The warm figure is the one a developer pays on each run: Ruff, mypy, import-linter, three Semgrep
passes, ls-lint and checkmake on the empty skeleton. The first-run figure adds the download of the
shared checks, the Semgrep virtual environment and the two binaries, once per pin.

The script that measured it, with the IT-04 and IT-05 cases, is quoted in the stage pull request.
