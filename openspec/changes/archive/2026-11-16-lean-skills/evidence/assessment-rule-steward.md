# Assessment: rule-steward
Before: body 6818 bytes, references 3119 bytes. After: body 6835, references 3119.

Under budget before and after; the skill failed pointers only. Sorted by section; the reference is
unchanged (all keep). Line numbers are those of `SKILL.md` before the rewrite.

## SKILL.md body

| # | Passage (heading or lines, before) | Class | Where it went | Note |
|---|---|---|---|---|
| 1 | Title and § Overview, l. 14-25 | keep | body bias sentences | |
| 2 | § Quick Start, l. 27-56 | keep | unchanged | |
| 3 | § The script, l. 58-64 | keep | head of Workflow: the weekly procedure | tests need `rulebook/scripts/rules.py`, no `/../` |
| 4 | § Weekly procedure, l. 66-86 | keep | body Workflow (name kept; CHK-113, CHK-119 cite it); the `langfuse.md` pointer now in step 1 | `lint --store vault` kept (test) |
| 5 | § Flags and proposals, l. 88-104 | keep | body Rules (name kept; CHK-119) | "never as the only reason to retire" kept in the table row; the repeat after the table dropped |
| 6 | § Proposals the owner can choose, l. 106-114 | keep | body Rules | |
| 7 | § Gotchas, three rows | keep | body Common mistakes | |
| 8 | § Gotchas, opencode not traced (pointer) | keep | Workflow step 2 sentence and the step 1 pointer | |
| 9 | § Boundary & Related Skills | keep | unchanged | "Repository rules belong to that repository's team" kept (test) |

## references/langfuse.md

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 10 | Whole file (settings, events, counts, opencode gap, confirmed shape) | keep | unchanged | now also the owner of the Langfuse variable names cut from `rulebook`'s `commands.md` |

Second reader: general-purpose subagent (fresh), 2026-11-16. Verdict: nothing lost. No other fixes;
citers (CHK-113, CHK-119: Weekly procedure, Flags and proposals) still true.
