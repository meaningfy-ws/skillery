# Assessment: proposal-writing
Before: body 6062 bytes, references 7333. After: body 5913, references 1925.

Measured with `lean_check.py` (the lint's body rule). Under budget before and after; the rewrite
fixes the four pointer errors and puts the body in the standard shape. Line numbers are those of
`SKILL.md` before the rewrite.

## SKILL.md body

| # | Passage (heading or lines, before) | Class | Where it went | Note |
|---|---|---|---|---|
| 1 | Provisional note, l. 16-17 | keep | body intro, last sentence | owner's gate on the skill's authority |
| 2 | § Overview, l. 21-24 (proposal + SoW, Proof of Value, in/out, fixed frame) | keep | body intro sentence (the bias corrected) | rest repeats the description |
| 3 | § Overview, l. 26-29 (entry skill, frame → price → write, estimation stands alone) | drop | | repeats the description and the Boundary section |
| 4 | § Overview, l. 31-39 (composes by reference: decision-package, coach, estimation, executive-communication) | drop | | repetition of § Boundary DELEGATES |
| 5 | § Flow (R2), inputs/output, l. 43-44 | keep | body Workflow | |
| 6 | § Flow step 1 Qualify the need, l. 46-50 | keep | body Workflow step 1 | free→paid boundary |
| 7 | § Flow step 2 Frame the offer, l. 51-54 | keep | body Workflow step 2 | |
| 8 | § Flow step 3 Price via estimation, l. 55-58 | keep | body Workflow step 3; link to the checklist replaced by "the first rule below" | |
| 9 | § Flow step 4 Write, l. 59-63 | keep | body Workflow step 4; template links now into `assets/` | |
| 10 | § The scope boundary, l. 67-75 (two rules) | keep | body Rules, first two bullets | the discipline this skill owns |
| 11 | § The scope boundary, l. 77-78 (pointer to the checklist) | keep | body Before you hand over, pointer sentence | D-5 form |
| 12 | § Pricing as a fixed frame, l. 82-86 | keep | body Rules, third bullet; `engagement-model.md` named as `semantic-consulting-coach`'s engagement model | that file is the coach's, not ours |
| 13 | § Boundary & Related Skills, l. 88-106 | keep | unchanged | matrix line unchanged |
| 14 | § Tone & style, l. 110-113 | keep | body Rules, Voice bullet | Meaningfy voice rules |
| 15 | (new) Quick Start | keep | body | worked example built from the `estimation` worksheet's micro-example, so the two skills agree |
| 16 | (new) Quick diagnostic, three rows | keep | body Before you hand over | rows the checklist does not hold: free→paid, answer-first, price traced to `estimation` (restating step 1, Voice, step 3 as checks) |

## references/

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 17 | `proposal-template.md` | material | `assets/proposal-template.md` | a file filled in by copying |
| 18 | `sow-template.md` | material | `assets/sow-template.md`; its link to the checklist now `../references/` | a file filled in by copying |
| 19 | `scope-boundary-checklist.md` | keep | stays; pointed to from Before you hand over | cited by `test-strategy` CHK-91 and `generic-task-test-profiles` tasks, path unchanged |

Second reader: general-purpose subagent (fresh), 2026-11-15. Verdict: nothing lost
Other fixes: none; both `assets/` files are copy-and-fill templates, the stop/extend safeguard is in `semantic-consulting-coach` `engagement-model.md`, `agents/proposal-writer.md` stays true.
