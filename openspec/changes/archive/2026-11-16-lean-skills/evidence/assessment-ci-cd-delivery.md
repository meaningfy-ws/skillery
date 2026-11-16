# Assessment: ci-cd-delivery
Before: body 7765 bytes, references 12292 bytes. After: body 6985, references 12034.

Under budget before and after; pending for `pointers` only, so sorted by section (D-19). Measured
with `lean_check.py`. No reference was deleted or moved: the two templates are illustrative
teaching prose around a short YAML job, not files filled in by copying, so they stay references.
Line numbers are those of the file before the rewrite.

## SKILL.md body

| # | Passage (heading or lines, before) | Class | Where it went | Note |
|---|---|---|---|---|
| 1 | § Overview, l. 16-26 | drop, keep | body intro (the bias); CI split → Boundary | restated the description |
| 2 | C1, C2 callouts, l. 28-31 | keep | body, under the intro | cited as C1/C2 by the references |
| 3 | § The three-repo model, table, l. 33-41 | keep | Rules, The three repos (shortened); detail in `delivery-model.md` | pointer in Workflow step 1 |
| 4 | § The three-repo model, rsync not git-pull, l. 43-44 | keep | Rules, The three repos | |
| 5 | § The secrets model, invariants, l. 46-57 | keep | Rules, Secrets (source of truth, deployment copy, only place `.env` is assembled); rotation and break-glass by the pointer to `secrets-model.md` | repetition of the reference |
| 6 | § CD standard intro, l. 59-62 | drop | | signposting |
| 7 | § 1 Deploy-trigger contract, l. 64-74 | keep | Rules, Deploy trigger | "R3" label dropped; no file cites it |
| 8 | § 2 Deploy request, l. 76-87 | keep | Rules, Deploy trigger; Workflow step 3 pointer | "R4" label dropped |
| 9 | § 3 Release + image standard, l. 89-98 | keep | Rules, Release and image; Workflow step 2 pointer | "R5" dropped; "no repo pushes today" stays in `delivery-model.md` |
| 10 | § §6 DevOps decisions, l. 100-111 | keep | Rules, "§6: DevOps decisions to confirm" | heading keeps "§6", cited by `project-setup` (`ci-and-infra.md`, `interview.md`, `scaffold.sh`) |
| 11 | § Migration runbook, l. 113-118 | keep | Workflow step 4 pointer | |
| 12 | § Projection seam, l. 120-126 | keep | Rules, end of §6 (stub until ratified; content here, projection in `project-setup`) | "EPIC-09" label dropped |
| 13 | § Boundary & Related Skills, l. 128-144 | keep | Boundary | |
| 14 | test-strategy matrix line, l. 146 | keep | unchanged | |
| — | (new) Quick Start, Common mistakes, Triggers, Quick diagnostic | keep | body | built from rows 3-12 and the references; no new rule |

## references/

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 15 | `delivery-model.md`, whole | keep | stays | inventory CHK-28 cites its "Application repos" section |
| 16 | `deploy-workflow-template.md`, whole | keep | stays | |
| 17 | `migration-runbook.md`, whole | keep | stays | inventory CHK-47 cites its "Verify" section |
| 18 | `release-image-template.md`, whole | keep | stays | its link to `SKILL.md` §6 still resolves to the kept heading |
| 19 | `secrets-model.md`, § Why this shape | drop | | "why" restating the rules above it |
| 20 | `secrets-model.md`, rest | keep | stays | |

Citers: none changed. `project-setup`'s mentions of `ci-cd-delivery` §6 stay true (heading kept);
the `test-strategy` inventory rows CHK-28 and CHK-47 cite reference sections that are unchanged.

Second reader: general-purpose subagent (fresh), 2026-11-15. Verdict: nothing lost
Other fixes: none needed; the §6 citers in `project-setup` (stub template, `ci-and-infra.md`, `scaffold.sh`) and `release-image-template.md` cite "§6" by text, not anchor, and stay true; rotation and break-glass remain in `secrets-model.md`.
