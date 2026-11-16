# Assessment: sales-operations
Before: body 8031 bytes, references 21536 bytes. After: body 6687, references 17885.

Measured with `lean_check.py` (the lint's own body). Total 29567 → 24572 bytes, under the 24576
budget (4 bytes of margin). No file deleted, moved or added. Line numbers are those of the files
before the rewrite.

## SKILL.md body

| # | Passage (heading or lines, before) | Class | Where it went | Note |
|---|---|---|---|---|
| 1 | Title + intro, l. 14-21 | keep / drop | body title + bias sentence | the per-skill glosses of the four called skills dropped (their Boundary lines say it) |
| 2 | § Quick Start, l. 23-34 | keep | unchanged | |
| 3 | § Workflow, l. 36-45 | keep | body Workflow, three pointer sentences (run-types, configuration, goal-loop) | step 4 ("reviewers, then decide") dropped: repetition of Rules |
| 4 | § Write rules, l. 47-58 | owner | one sentence citing `sales-pipeline-custody` write rules; the configuration pointer moved to Workflow | |
| 5 | § The goal loop, l. 60-70 | keep / drop | body Rules, one line; outcomes stated once in `goal-loop.md` § 5 | repetition of goal-loop |
| 6 | § Runs, table, l. 74-80 | keep | body Rules | "Details" column of five links dropped (one pointer in Workflow); intake "when" shortened |
| 7 | § Runs, run-note paragraph, l. 82 | keep | body Rules | "opens with Decisions needed, log last" moved to the Common mistakes row |
| 8 | § Independent reviewers, l. 84-91 | keep | body Rules (heading kept: CHK-94 cites it) | the unverified card detail stated once in goal-loop § 4 |
| 9 | § Priorities inside a run, l. 93-107 | keep | body Rules | |
| 10 | § Gotchas, l. 109-115 | keep | body *Common mistakes* table | "scheduled runs only propose" stated once in goal-loop § 2-3 |
| 11 | § Boundary & Related Skills, l. 117-132 | keep | unchanged | matrix line unchanged |

## references/goal-loop.md (6279 → 4524)

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 12 | Intro, ASCII diagram l. 3-10 | drop | — | repetition of the five steps and outcomes (body + § 5) |
| 13 | § Terms and numbers | keep | unchanged (ownership tag `run-note-shape`: "15 deals in depth") | |
| 14 | § 1 run-level example criteria, l. 31-37 | drop | pointer to the *Objective* block of `assets/templates/grooming-session.md` | repetition of the template's default criteria |
| 15 | § 1 work-item level, objective never changes, clarification rules | keep | unchanged | |
| 16 | § 2 Plan, § 3 Act | keep | merged into one section | "work through the four skills within the write rules" dropped (body) |
| 17 | § 4 Verify: input, findings pasted, auditor last | drop | body *Independent reviewers* + Common mistakes | repetition; verdicts and unverified card kept |
| 18 | § 5 Decide | keep | compressed to three bullets ("Not yet, can continue" kept) | |
| 19 | § Two levels | keep | one paragraph | |

## references/run-types.md (13113 → 11825)

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 20 | Intro: run folder, read-only vault notes | keep | compressed | "writes nowhere else" stated once in body |
| 21 | Tables paragraph: blank lines, separator row, `\|` | owner | `vault-conventions` (table check, cited) | the run-note limits (five columns, short cells, "None.") kept |
| 22 | Start of every run, steps 1-2 | keep | compressed; the HALT line stated once in configuration.md | |
| 23 | Start, step 3 owner's input, step 4 since | keep | compressed | |
| 24 | Open day 0-8 | keep | compressed (signals inline; carry-forward wording) | |
| 25 | Close day, step 3 tier examples | owner | `sales-pipeline-custody` tiers; the third-party won/lost rule kept | |
| 26 | Close day, other steps | keep | unchanged | |
| 27 | Weekly review, heading line "if both are missed" | drop | — | repetition of open-day step 0 |
| 28 | Weekly step 1 list, "No run ever edits a skill" | keep / drop | list inline; the no-edit rule is in body Common mistakes and write-rules § 3 | |
| 29 | Weekly step 4 sweep: oddity examples, note format | keep / owner | examples inline; note format → `sales-pipeline-custody` conventions; swept-date definition → goal-loop *Terms* | |
| 30 | Weekly steps 2, 3, 5, 6, 7 | keep | step 6 compressed | |
| 31 | Working session | keep | compressed | pointer note kept |
| 32 | Intake session, tiers A/B/C | keep | compressed; the signal definition cited from `sales-pipeline-custody` *Leads and opportunities* | |
| 33 | Intake steps 2-7 | keep | audit step compressed | |

## references/configuration.md (2144 → 1536)

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 34 | Intro, list of what belongs to an installation | drop | — | repetition of the key table |
| 35 | Key table, "Used by" column | drop | — | repetition: every user cites its key and `sales-operations` |
| 36 | Key table, keys and holds | keep | unchanged | |
| 37 | Odoo ids not configuration; examples in assets | keep | unchanged | |
| 38 | Offer ladder paragraph | owner / keep | one sentence: ladder → `semantic-consulting-coach`; the agent never edits the catalogue | "the weekly review raises what is missing" is in run-types weekly step 5 |

## Citers changed

None needed: no file renamed or removed; the cited headings (*Independent reviewers*, goal loop
*Terms*, the run-type sections) are kept. `agents/sales-agent.md` ("the goal loop, the run types
and the run notes") stays true.

Second reader: general-purpose subagent (fresh), 2026-11-15. Verdict: nothing lost
Other fixes: the run-level criteria are in the grooming-session template's *Objective*, the close-day tier examples in `sales-pipeline-custody` *Rot and exit criteria*, the sweep note format in its conventions; `openspec/changes/generic-task-test-profiles/design.md` cited goal-loop "lines 68–70", now *4. Verify*.
