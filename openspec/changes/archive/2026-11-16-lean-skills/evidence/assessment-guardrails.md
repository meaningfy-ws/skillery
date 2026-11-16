# Assessment: guardrails
Before: body 12596 bytes, references 5618 bytes. After: body 12818, references 5618.

Under budget before and after; the skill failed pointers only, so it is sorted by section and only
the two pointers changed (batch scope: pointers only). Section names that other files cite stay:
§5 Subagent dispatch, §6 Session hygiene, `references/activity-tools.md` (read by the
`activity_tools_table` lint), `references/subagent-reports.md`, `assets/session-thresholds.json`
(read by navigator and the bundle generator). The body stays over the 6 KB advisory target; a
section-level lean rewrite of §1-§6 is left for a later pass.

## SKILL.md body

| # | Passage (heading or lines, before) | Class | Where it went | Note |
|---|---|---|---|---|
| 1 | § What this is for, l. 16-29 | keep | unchanged | |
| 2 | § Guardrail types 1-4, l. 31-67 | keep | unchanged | |
| 3 | § 5 Subagent dispatch, l. 69-110 | keep | unchanged except two pointers | l. 94-95 and l. 100 rewritten to the D-5 form |
| 4 | § 6 Session hygiene, l. 112-142 | keep | unchanged | threshold keys are navigator's contract |
| 5 | § Quick Start, l. 144-168 | keep | unchanged | |
| 6 | § How to use it, How to automate it, l. 170-185 | keep | unchanged | |
| 7 | § Boundary & Related Skills | keep | unchanged | |

## references/subagent-reports.md, references/activity-tools.md

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 8 | Both files whole | keep | unchanged | |

Second reader: general-purpose subagent (fresh), 2026-11-16. Verdict: nothing lost. No other fixes;
every heading and reference file other files cite is unchanged.
