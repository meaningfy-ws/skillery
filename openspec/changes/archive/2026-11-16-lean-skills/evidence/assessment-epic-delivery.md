# Assessment: epic-delivery
Before: body 10859 bytes, references 25968 bytes. After: body 9549, references 23150.

Measured with `lean_check.py` (the lint's body measure) on the worktree before and after the
rewrite. Total 36827 → 32699, over the 24576 budget: the kept text is the delivery method itself
(four brief templates, the stage steps with their triggers, the check ledger, the library rule),
Meaningfy's own and cited by about 25 `CHK-` rows of `test-strategy`'s inventory. Recommended:
an `over_budget` entry (the lead decides). File names and the sections other files cite are kept.

## SKILL.md body

| # | Passage (heading or lines, before) | Class | Where it went | Note |
|---|---|---|---|---|
| 1 | Title and intro, l. 14-18 | keep | title + bias sentence | the mistake it corrects named |
| 2 | § Quick Start, l. 20-42 | keep | body Quick Start | pointer to the brief template dropped (the team section points) |
| 3 | § Sessions table, l. 46-50 | keep, owner | body Workflow, *Sessions* | shaping row shortened: its outputs are `epic-planning`'s |
| 4 | § Sessions, l. 52-55 | keep | *Sessions* paragraph | |
| 5 | § The team, l. 59-61 | keep | *The team*, pointer sentence | |
| 6 | § The team table, l. 63-72 | keep | *The team* paragraph (who does what); who plays it → `team-and-briefs.md` table | table rows merged into prose, same duties |
| 7 | § The team, lead stays small, l. 74-76 | keep, owner | *The team* paragraph; reading in one call → `guardrails` §5, §6 | |
| 8 | § The team, conditional briefs and members, l. 78-83 | keep | *The team* paragraph | |
| 9 | § The loop of a stage, steps, l. 87-101 | keep, drop | one-sentence summary in *The loop of a stage*; detail stays in `stage-loop.md` | the per-step bullets repeated `stage-loop.md` |
| 10 | § The loop of a stage, pointer, l. 103 | keep | pointer sentence | |
| 11 | § Review sets, l. 105-112 | keep | Rules, *Review sets* (CHK-136 cites it) | |
| 12 | § After the last build stage, l. 116-118 | drop | | repeats `stage-loop.md` § After the last build stage; pointer names the order |
| 13 | § After the last build stage, session end, l. 120-121 | keep | *Sessions* paragraph | |
| 14 | § Questions to the developer, l. 125-135 | keep | Rules, *Questions to the developer* | list folded into one sentence |
| 15 | § Authority, l. 139-148 | keep | Rules, *Authority* | |
| 16 | § Dependencies, l. 152-157 | keep | Rules, *Libraries and validation*; pointer sentence | |
| 17 | § Verification and validation, l. 161-164 | keep, owner | *Libraries and validation*; definitions → `test-strategy` (Boundary) | |
| 18 | § Gotchas: member asks developer; checker not fresh; agent marks validation | drop | | repeat *The team* and *Libraries and validation* |
| 19 | § Gotchas: review set larger; re-run without trigger; incomplete report | keep | Before you hand over (Quick diagnostic) | |
| 20 | § Gotchas: working around our library | keep | *Libraries and validation* ("not even just this once") | |
| 21 | § Gotchas: flaky test; sleep loop | keep | `stage-loop.md` steps 4 and 6 | |
| 22 | § Boundary & Related Skills, matrix line | keep | unchanged | |

## references/stage-loop.md

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 1 | Intro, l. 3-5 | drop | one sentence | restated the skill |
| 2 | § The steps 1-6, l. 9-75 | keep | unchanged | T1 example moved in from l. 125-127; sleep loop and quarantine marker added from the body and the situation table |
| 3 | § After the last build stage, l. 77-96 | keep | unchanged | ADR contradiction and navigator band joined from the situation table |
| 4 | § When a situation goes wrong, rows 1-4 (brief, our library, external library, rejection) | drop | | repeat *The team*, `dependencies.md`, the acceptance bullet |
| 5 | § When a situation goes wrong, row 5 (no task gate named) | keep | `team-and-briefs.md` brief item 5 | |
| 6 | § When a situation goes wrong, rows 6-8 | keep | step 4; *After the last build stage* | |
| 7 | § Two examples, SMALL EPIC | drop | | repeats the body Quick Start |
| 8 | § Two examples, LARGE EPIC | keep | paragraph after the steps | |
| 9 | § Two examples, inconsistent report | keep | step 2, T1 | |
| 10 | § The check ledger | keep | unchanged | cited by CHK-20..24, 108, 114 |

## references/team-and-briefs.md

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 1 | Intro | keep | unchanged | |
| 2 | Role table, Developer and Domain expert rows | drop | one sentence pointing to *The team* | repeat the body |
| 3 | Role table, other rows; agents and model paragraph | keep | unchanged | |
| 4 | "The tester and the checker both look for problems, differently" | drop | | lead-in sentence; the distinction stays |
| 5 | § What every brief names, mark and result lines | keep | unchanged | plus the no-task-gate rule |
| 6 | § Builder, Adversarial tester, Reviewer, Checker | keep | unchanged | cited by CHK-1, 17, 18, 19, 33, 109 |

## references/dependencies.md

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 1 | Intro, the two kinds | keep | unchanged | |
| 2 | "Every workaround hides a shortcoming...", l. 11-12 | drop | | a "why it works" restating the rule |
| 3 | Never / Do lists, blocked stage | keep | unchanged | CHK-27 |
| 4 | § The shape of the issue, rules | keep | unchanged | |
| 5 | § The shape of the issue, the issue body | material | `assets/templates/upstream-issue.md` | filled in by copying |
| 6 | § Working on both at once | keep | unchanged | |
| 7 | § External library, table and record | keep | unchanged | |
| 8 | Example, l. 106-108 | drop | | restates the table and the record |

## references/verification-validation.md

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 1 | Intro | keep | unchanged | |
| 2 | § Acceptance demo, definition and appetite table | keep | unchanged | procedure sentence → pointer to `stage-loop.md` |
| 3 | § Acceptance demo, first-run record | keep | § Provisional steps | |
| 4 | § Validation review | keep | unchanged | CHK-69 |
| 5 | § The evidence folder | keep | unchanged | CHK-72, CHK-78 |
| 6 | § Provisional steps | keep | merged with row 3 | |

Second reader: general-purpose subagent (fresh), 2026-11-15. Verdict: lost: the mark-line duty at Prepare in the body's loop (delivery-retrospective D-10 cites it there; its timing stays in `team-and-briefs.md`); restored in the second reading.
Other fixes: citers in `openspec/changes/delivery-retrospective/handover.md` (*After the last build stage* → `references/stage-loop.md`) and `design.md` D-10 (`##` heading form dropped).
