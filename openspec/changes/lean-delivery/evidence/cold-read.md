# Cold read (task D.2) — lean-delivery docs stage

Date: 2026-11-10. Page: `skills/technical-writing/SKILL.md` *Quick Start* (the one task-oriented
page in `docs-owed.md`). Reader: a fresh agent given only that section, playing a lead after an
EPIC that changed an installation step.

## First read — usable with fixes

Where it got stuck (it had only the section, so some points are answered elsewhere in the skill):

| Step | Stuck point | Fix |
|---|---|---|
| 1 | "this skill" and "documentation workflow" not named | Named `technical-writing`, pointed to its workflow section |
| 2 | evidence folder and the columns of `docs-owed.md` not given | Folder `openspec/changes/<id>/evidence/`; columns path, what is owed, type, check, with example rows |
| 3 | "the version it was run against" ambiguous; README row had no write step | "the tool version you ran it with"; the README link fixed in the same step |
| 4 | "the project's docs gate" undefined; how to run snippets | Named where it lives (the project's `AGENTS.md` *Checks* block); "in a clean shell" |
| 5 | "published" before publish; who writes the file; re-read loop | "draft how-to"; "you write"; re-read until nothing is stuck |
| 6 | which evidence; no done condition | "both evidence files"; done when every row is written, gate green, no stuck point |

Not changed: the base branch and whether the PR carries code (the epic session's PR rules own
them, `epic-delivery`); a clean environment for the install (the project's own concern).

## Second read

Not run: every stuck point of the first read is answered by a direct sentence in the fixed page,
and the rest are owned elsewhere (above). The lead's call, recorded here.
