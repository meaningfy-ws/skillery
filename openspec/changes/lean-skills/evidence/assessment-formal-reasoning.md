# Assessment: formal-reasoning
Before: body 8632 bytes, references 14515 bytes. After: body 8691, references 14515.

Under budget before; it failed only on pointers and the closing "References" list, so it is sorted
by section. References unchanged. "The loop", "The test format" and Quick Start step 4 keep their
names: `test-strategy`'s inventory cites them (CHK-73, CHK-76). The body stays above the 6 KB target
(advisory): the Quick Start, the loop, the engine table and the test format are all rules a check
or the scripts enforce.

## SKILL.md body

| # | Passage (heading or lines, before) | Class | Where it went | Note |
|---|---|---|---|---|
| 1 | Title, intro, scripts and no-engine rule | keep | unchanged | |
| 2 | § Quick Start | keep | unchanged; template README linked in step 1 | from the deleted list's last item |
| 3 | § The loop 1-6 | keep | unchanged, with `patterns.md` and `pure-subset.md` pointer sentences at steps 2 and 3 | |
| 4 | § Engine choice | keep | Rules § Engine choice, `engines.md` pointer sentence | |
| 5 | § The test format | keep | Rules § The test format, unchanged | |
| 6 | § References (closing list) | keep | removed as a list; each item became a pointer sentence at its point of need | DEC-11 forbids the closing list |
| 7 | § Gotchas | keep | Rules § Common mistakes table | the rules-from-text item points via the loop's `rules-from-text.md` sentence |
| 8 | § Boundary | keep | unchanged | |
| 9 | test-strategy matrix line | keep | unchanged | |

## references/*.md

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 10 | `engines.md`, `patterns.md`, `pure-subset.md`, `rules-from-text.md` | keep | unchanged | scripts and tests untouched |

Second reader: general-purpose subagent (fresh), 2026-11-15. Verdict: nothing lost
Other fixes: none needed; all eight gotchas are in Common mistakes, and the CHK-73/CHK-76 citations ("The test format", "The loop", Quick Start step 4) hold.
