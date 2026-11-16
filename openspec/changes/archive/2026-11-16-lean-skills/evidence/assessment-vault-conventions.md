# Assessment: vault-conventions
Before: body 11818 bytes, references 8229 bytes. After: body 12957, references 8229.

Under budget and failing only pointers, so sorted by section. The other vault skills, the specs and
`docs/environment/` cite this skill by section name (Layout, Project homes, Moving and deleting,
Staging, Formatting, ...) and by anchor (`#moving-and-deleting`, `#staging`): every section keeps its
name, now as a `###` under Rules, so the anchors hold. The body stays above the 6 KB target: it is the
single home of the conventions nine skills cite, and none of it is drop. Line numbers are those of the
file before the rewrite.

## SKILL.md body

| # | Passage (heading or lines, before) | Class | Where it went | Note |
|---|---|---|---|---|
| 1 | § Overview l. 18-19 | keep | intro | one place, cited by the others |
| 2 | § Overview table l. 21-27 (syntax / conventions / AGENTS.md homes) | keep | intro, as one sentence each | |
| 3 | § Overview l. 29-30 (vault's AGENTS.md wins, report as skill-change) | keep | intro | |
| 4 | § Layout | keep | Rules › Layout, unchanged | the README asset and the final check compare it |
| 5 | § Project homes | keep | Rules › Project homes; project-files.md mention → pointer sentence | |
| 6 | § Every note, `kind` bullet | keep | Rules › Every note; kinds.md mention → pointer sentence | |
| 7 | § Every note, l. 84-85 (standing files have a fixed shape) | keep | pointer sentence under Project homes | merged with row 5's mention |
| 8 | § Links, tags and names | keep | unchanged | |
| 9 | § Formatting l. 100 ("table syntax comes from obsidian-skills") | drop | | repetition of the intro |
| 10 | § Formatting, the three checks | keep | unchanged; Before you hand over | CHK-107 |
| 11 | § Binaries | keep | unchanged | |
| 12 | § Moving and deleting | keep | unchanged; Before you hand over | CHK-144 |
| 13 | § Staging | keep | unchanged | |
| 14 | § The company memory l. 164-166 | keep | unchanged, minus "`memory` is never set in `07 Perso/`" | that clause is a repetition of Project homes |
| 15 | § The company memory l. 168-174, 179-183 | keep | unchanged | |
| 16 | § The company memory l. 176-177 (moving a shared note changes the memory) | drop | | repetition of Moving and deleting step 3 |
| 17 | § The company memory, Thought/Reality table | keep | Common mistakes table | same four rows |
| 18 | § Boundary & Related Skills | keep | unchanged | |
| 19 | (new) Quick Start, Before you hand over | keep | worked example; Quick diagnostic | |

## references/

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 20 | `kinds.md` | keep | stays | read by `tests/test_rulebook.py` |
| 21 | `project-files.md` | keep | stays | the standing files' shapes |

Second reader: general-purpose subagent (fresh), 2026-11-16. Verdict: nothing lost. No other fixes;
section anchors and names cited elsewhere hold.
