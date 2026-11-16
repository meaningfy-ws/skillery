# Assessment: test-strategy
Before: body 7289 bytes, references 81430 bytes. After: body 9041, references 78423.

Measured with the lint's body rule (frontmatter not counted). Total 88719 → 87464 bytes, over the
24576 budget. Line numbers are those of `SKILL.md` before the rewrite. Recommended: an
`over_budget` entry. Reason: the matrix (nine family files, 34.9 KB) and the inventory (144 `CHK-`
rows, 43.5 KB) are tables of ids that about 40 skills' pointer lines, `tests/test_test_strategy.py`
(coverage, six-question rule, owner and status columns) and three open EPICs (B, C, D) rely on; every
row is a Meaningfy check with its owner path, and no row is drop.

## SKILL.md body

| # | Passage (heading or lines, before) | Class | Where it went | Note |
|---|---|---|---|---|
| 1 | Title and first rule, l. 14-19 | keep | body title and bias sentences | unchanged |
| 2 | § Quick Start, l. 21-36 | keep | body Quick Start | the two file links reworded as one pointer sentence (D-5); the `VAL` sentence kept word for word (generic-task-test-profiles D-10 edits it) |
| 3 | § The loop, l. 38-45 | keep | body `## Workflow: the loop` | unchanged |
| 4 | § What a test is, l. 47-52 | keep | body Rules | unchanged |
| 5 | § Verification and validation, l. 54-59 | keep | body Rules | the one home of the V&V definition (`test_test_strategy.py` one-home check) |
| 6 | § The six questions, l. 61-70 | keep | body Rules, table unchanged | ids `VAL VER ADQ ROB CLR RSK` unchanged |
| 7 | § The five stances, l. 72-85 | keep | body Rules, table unchanged | the two closing sentences folded into the intro sentence |
| 8 | § Reading the matrix, family table, l. 87-101 | keep | body Rules, one pointer sentence per file | each table cell became "Read … when …: it adds …" |
| 9 | § Reading the matrix, cross-cutting and inventory lines, l. 103-106 | keep | pointer sentences for `cross-cutting.md` and `inventory.md` | the columns list moved to the section intro |
| 10 | § Reading the matrix, decided-by, owner, status and gap-target legend, l. 107-116 | keep | body Rules, unchanged | the single statement of the gap targets; the family files no longer repeat them |
| 11 | § Gotchas, l. 118-124 | keep | body Rules, Common mistakes table | each gotcha with its reason and remedy |
| 12 | (new) Before you hand over | keep | body Quick diagnostic | built from the loop and the gap rule; no new rule |
| 13 | § Boundary & Related Skills, l. 126-end | keep | body, unchanged | |

## References

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 14 | Each family file's intro: scope sentence and V-model note | keep | stays, one sentence | |
| 15 | Each family file's intro: list of owning skills | drop | | repetition: the *Technique owner* column names each owner |
| 16 | Each family file's intro: "names them and does not restate their steps", "a check that answers two questions has two rows" | drop | | repetition: stated once in the body's Reading the matrix |
| 17 | Each family file's intro: which EPIC fills `gap → B/C/D` rows | drop | | repetition: the body's gap-target legend |
| 18 | `ui.md` intro: design skills are external plugins; a `gap → C` row may point to one | keep | stays | |
| 19 | `ui.md` intro: accessibility rule in `cosmic-python`, UX lens in `meaningfy-code-review` | drop | | repetition of rows CHK-58, CHK-59 |
| 20 | `cross-cutting.md` intro: exempt from the six-question rule, citations count as coverage | keep | stays, shorter | the test and the spec rely on it |
| 21 | `generic-writing.md` intro: house-rule check sits in `cross-cutting.md` | keep | stays | the cold-reader owner is in the table rows |
| 22 | Every table row of the nine matrix files | keep | unchanged | ids, owner and status columns read by `test_test_strategy.py` and the pointer lines of about 40 skills |
| 23 | `inventory.md` intro (scope, stable ids, gap rule, owner-as-path) | keep | unchanged | |
| 24 | `inventory.md` table, CHK-1 … CHK-144 | keep | unchanged | each row is a Meaningfy check with its owner path; harden-checks tasks 1.12, 1.14 and EPICs C, D edit these rows |

Second reader: general-purpose subagent (fresh), 2026-11-15. Verdict: nothing lost.
Other fixes: none needed; the re-pointed `inventory.md` and `architecture.md` cells name sections that exist, and `tests/test_test_strategy.py` passes.
