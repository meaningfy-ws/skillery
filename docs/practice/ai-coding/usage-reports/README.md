# Usage reports

A series of dated pages that count where agent-session tokens, time and calls went, so a change to
the method can be judged against a number and not a feeling. The procedure that produces a page
belongs to the [`session-retrospective`](../../../../skills/session-retrospective/SKILL.md) skill
(`references/langfuse-report.md`); this folder holds the results.

## What a page holds

- **Window and work mix**: the dates, the sessions, the repositories and the appetites seen.
- **Numbers only**: totals, context per call, floors, calls, verification share, time, cost,
  caveats. Never a prompt, a subagent report or a command; the pre-PR review rejects a page that
  quotes one.
- **Gates passed**: the share of merged pull requests whose first CI run was green, and the
  Critical findings per stage, so a saving that costs quality shows.
- **The pinned fields**: a page whose query lost a pinned field is headed "not comparable".

## Naming and stage pages

A page is named `<date>.md` (the day the report was taken, `YYYY-MM-DD`). A stage page is not a
separate file: it is a `§Stage n` section of the dated page taken within seven days of that stage's
release, over the traces tagged `skillery:<version>`, next to the baseline. The closing page of the
EPIC is taken after fourteen days and carries its four numbers. An inventory of a machine is a
page named `inventory-<host>-<date>.md`.

## Add a page

1. Run the eight queries of `references/langfuse-report.md` over the window; set the window first.
2. Copy the section order of the latest page; fill each section with numbers.
3. Compare each stage proxy and the gates passed with the baseline page; state the direction.
4. Add the page to the list below and open a pull request.

## The series

| Page | Window | Source |
|---|---|---|
| [`2026-11-09.md`](2026-11-09.md) | about two weeks to 2026-11-09, skillery only | Transcripts and `gh`; the first evidence, linked not copied |
| [`2026-11-22.md`](2026-11-22.md) | 2026-11-08 to 2026-11-23, all projects | Langfuse; the baseline of the performance EPIC |
| [`inventory-lps-desktop-2026-11.md`](inventory-lps-desktop-2026-11.md) | 2026-11-08 to 2026-11-22, one machine | Local config and the window's tags; used, unused, undecided; nothing disabled |
