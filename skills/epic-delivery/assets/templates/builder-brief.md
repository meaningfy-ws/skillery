# Builder brief: <change-id>, <task-id or finding ids>

<!-- The card every builder and fixer brief is built from. Fill each line; point, never copy. -->

**Goal:** <task `n.m` of `openspec/changes/<id>/tasks.md`, or the accepted findings>, test-first. Update the docs it changes.
**Read:** `design.md#d-<n>`; `tests/features/<f>.feature`; the task's spec requirement.
**Decided:** <DEC-n, D-n ids>.
**Out of scope:** <...>.
**Gate:** `<the project's task gate command>`.
**Worktree:** `<path>` at `<sha>`; run `git rev-parse HEAD` first, stop if it differs.
**Rules:** <paste `rules.py load --brief` output>. No workaround of our library: stop and report it.
**Impact:** <at most 10 lines from the lead>.
**Edits:** Edit or Serena only; Bash runs commands and never writes a file.
**Tools:** read with Read, Grep and Serena. Serena essentials: `get_symbols_overview`, `find_symbol`,
`find_referencing_symbols`, `replace_symbol_body`, `insert_after_symbol`. Do not call `initial_instructions`.
**Principles:** <`cosmic-python` ids this task touches, e.g. `PR-SURVEY-FIRST`>; read those entries in
`references/principles-and-anti-patterns.md`, not the whole catalogue.
**Fixer only:** `max_red_runs: <n>` (default 3, `fixer_max_red_runs`; the PLAN may set another) and one
pass: fix the named findings once, no second round. At the bound, stop and return the base report with
`result: blocked`, the failing check verbatim (one line), your hypothesis and what you tried (at most
five lines); run no further gate.
**Report:** base report + the *implementing* fields (`guardrails` `references/subagent-reports.md`) +
Upstream findings (each *ours* or *external*, with a reproduction, or "none"), at most
`<subagent_report_max_lines>` lines.
