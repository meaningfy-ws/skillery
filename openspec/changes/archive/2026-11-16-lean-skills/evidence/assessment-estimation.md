# Assessment: estimation
Before: body 6181 bytes, references 4269. After: body 4743, references 2010.

Measured with `lean_check.py` (the lint's body rule). Under budget before and after; the rewrite
fixes the four pointer errors and puts the body in the standard shape. Line numbers are those of
`SKILL.md` before the rewrite.

## SKILL.md body

| # | Passage (heading or lines, before) | Class | Where it went | Note |
|---|---|---|---|---|
| 1 | Provisional note, l. 16-17 | keep | body intro, last sentence | owner's gate on the skill's authority |
| 2 | § Overview, l. 21-25 (light: checklist + method; breakdown, PERT, ranges, assumptions, contingency) | keep | body intro sentence (the bias corrected) | |
| 3 | § Overview, l. 27-32 (independently triggerable; composes with epic-planning, decision-package) | drop | | repeats the description and § Boundary |
| 4 | § What it covers (R4), steps 1-5, l. 36-48 | keep | body Workflow steps 1-5 | worksheet link in step 4 dropped (Quick Start points to it) |
| 5 | § Techniques, l. 52-53 (PERT favoured, why) | drop | | "why it works" restating the rule |
| 6 | § Techniques, PERT formulae and O/M/P, l. 55-63 | keep | body Rules, first bullet | the house default; one-unit rule taken from the worksheet |
| 7 | § Techniques, contingency from SD, l. 64-65 | keep | body Rules, second bullet, with k ≈ 1 / ≈ 2 from the worksheet | |
| 8 | § Techniques, alternatives table + triangulation, l. 67-76 | keep | body Rules, third bullet, compressed | parametric drivers (source system, ontology module) are Meaningfy's |
| 9 | § Gantt / scheduling is EXTERNAL, l. 80-85 | keep | body Rules, fourth bullet | Smartsheet / MS Project convention |
| 10 | § The checklist, l. 89-99 | drop | | repetition of `references/estimation-checklist.md`, which holds every item and more |
| 11 | § The checklist, l. 101-103 (closing pointers) | keep | body Before you hand over, pointer sentence (checklist); Quick Start (worksheet) | D-5 form |
| 12 | § Boundary & Related Skills, l. 105-122 | keep | unchanged | matrix line unchanged |
| 13 | § Tone & style, l. 126-128 | keep | body Rules, Voice bullet | |
| 14 | (new) Quick Start | keep | body | the worksheet's micro-example as input → output |

## references/

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 15 | `estimation-checklist.md` | keep | stays; pointed to from Before you hand over; worksheet link now `../assets/` | cited by `test-strategy` CHK-90 (section name updated there) |
| 16 | `pert-worksheet.md` | material | `assets/pert-worksheet.md` | the fillable table; its formulae and k rule also stand in body Rules |

Second reader: general-purpose subagent (fresh), 2026-11-15. Verdict: nothing lost
Other fixes: none; every dropped checklist item is in `references/estimation-checklist.md`, `assets/pert-worksheet.md` is the fillable table (its formulae also in body Rules), CHK-90 updated.
