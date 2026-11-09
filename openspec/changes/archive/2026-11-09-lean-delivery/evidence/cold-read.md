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

Run after review (DL-13), with the Quick Start and the two sections it points to. Stuck points left:

| Stuck point | Fix |
|---|---|
| How to find every owed page, not only the two examples | Step 2: search the docs for what the EPIC changed |
| Which tool version; run before writing? | Step 3: run the new command once; the tool's `--version` |
| "Clean shell" undefined; installs touch the machine | Step 4: a scratch environment (fresh container or config) |
| Format of `cold-read.md`; the reader's brief | Step 5: brief "carry it out"; one row per step: did, stuck, fix |
| Where the gate's output is recorded | Step 6 and the verify row: in the PR description |

## Third read

| Stuck point | Fix |
|---|---|
| Where the old and new command come from | Step 2: the EPIC's proposal names them |
| Whether step 3's run uses the scratch environment | Step 3: yes, as in step 4 |
| What "Clarity check" is | Answered by the skill's *Clarity check* section (not given to this reader) |

Left as is (minor, owned by the project): no container available; how many clean reads end the
loop (one with no stuck point). Verdict: no stuck point left that the page owns. Lead's close,
2026-11-10.
