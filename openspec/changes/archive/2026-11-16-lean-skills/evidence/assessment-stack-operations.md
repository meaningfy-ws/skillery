# Assessment: stack-operations
Before: body 6611 bytes, references 19939 bytes. After: body 5944, references 18603.

Measured with the stage's `lean_check.py` (the lint's own `_body`). Total prose 26550 → 24547 bytes,
under the 24576 budget; the skill leaves `pending` with no `over_budget` entry. Line numbers are those
of the files before the rewrite. No file deleted, moved or added; `scripts/check_stack.py` and the
templates are untouched.

## SKILL.md body

| # | Passage (heading or lines, before) | Class | Where it went | Note |
|---|---|---|---|---|
| 1 | Intro: what a stack is, l. 16-21 | keep | body intro | bias sentence added; "this skill is the standard for…" list dropped (description and Boundary) |
| 2 | § Quick Start, l. 23-46 | keep | body Quick Start | step 3's link became a D-5 pointer sentence |
| 3 | § Workflow 1-2, the reference list, l. 50-62 | keep | body Workflow, nine pointer sentences | |
| 4 | § Workflow 3, templates, l. 63-64 | keep | body Workflow step 10 | |
| 5 | § Workflow 4-5, before the PR and after the merge, l. 65-67 | keep | body Before you hand over (Quick diagnostic) | |
| 6 | Gotcha: copying another stack, l. 71-72 | keep | body Common mistakes | |
| 7 | Gotcha: publishing on all interfaces, l. 73-74 | drop | | repetition of S7 in `stack-standard.md` |
| 8 | Gotcha: `docker system prune -af`, l. 75-76 | drop | | repetition of `rollback.md` MUST keep-3 |
| 9 | Gotcha: version in a CI variable, dispatch input or `.env`, l. 77-78 | drop | | repetition of `versions-and-promotion.md` § The version lives in git and S1 |
| 10 | Gotcha: addresses and secret tables by hand, l. 79-80 | keep | body Common mistakes | |
| 11 | Gotcha: secrets in a script or command line, `.env` edited on the VM, l. 81-82 | keep | `deploy-workflow.md` table (`.env` row) | secrets-in-command-line already there; "`.env` is rewritten by every deploy" added |
| 12 | Gotcha: the same status in several places, l. 83-84 | keep | body Common mistakes | |
| 13 | Gotcha: skeleton docs, l. 85 | owner | `infrastructure-operations` `documentation.md` ("a skeleton is not a doc") | |
| 14 | Gotcha: own log format, l. 86-87 | owner | `infrastructure-operations` (execution-log template), named in Boundary | |
| 15 | Gotcha: leftovers from experiments, l. 88-89 | keep | body Common mistakes | |
| 16 | Gotcha: backup by copying another stack's role, l. 90-91 | owner | `service-reliability`, named in Boundary ("the one parameterised backup role") | |
| 17 | Gotcha: checks not run in CI, l. 92-93 | keep | body Common mistakes | |
| 18 | Gotcha: S4 excepted without a daemon default, l. 94-95 | drop | | repetition of `stack-standard.md` § S4 and the Docker daemon default |
| 19 | Gotcha: tag-only database major upgrade, l. 96-97 | drop | | repetition of `upgrades-with-data.md` § PostgreSQL |
| 20 | § Boundary & Related Skills, l. 99-118 | keep | body | two owner facts from rows 14 and 16 named |
| 21 | Matrix line, l. 120 | keep | unchanged | |

## References

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 22 | `acceptance-tests.md` intro, l. 3-6 | keep | same file, shortened | "this file says how" dropped |
| 23 | `acceptance-tests.md` § Shape, § When they run | keep | same file | CHK-38; "a suite never run in CI decays" dropped (why restating the rule) |
| 24 | `cutover.md` intro | keep | same file, shortened | |
| 25 | `cutover.md` § The steps, and why; DNS switch | keep | same file | CHK-47 |
| 26 | `deploy-workflow.md` intro "this file says why" | drop | | meta sentence |
| 27 | `deploy-workflow.md` health gate, parts table, triggers | keep | same file | CHK-39 |
| 28 | `deploy-workflow.md` § One reusable workflow, its why | keep | same file, shortened | "copied workflows drift" merged into the why |
| 29 | `new-stack.md` intro, why another stack is not a pattern | keep | same file, shortened | |
| 30 | `new-stack.md` anatomy, steps, README sections | keep | same file | |
| 31 | `new-stack.md` "A README section left as TBD is a finding" | owner | `infrastructure-operations` `documentation.md` | |
| 32 | `rollback.md` MUST keep-3 and its why | keep | same file, why shortened | |
| 33 | `rollback.md` steps, when a revert is not enough, rehearse | keep | same file | CHK-39 Steps 3-4 unchanged |
| 34 | `shared-services.md` intro "its failure reaches every consumer" | drop | | why restating the rule |
| 35 | `shared-services.md` the five contract items, adding a consumer | keep | same file | CHK-51 |
| 36 | `stack-standard.md` MUST, why, `check_stack.py` paragraph | keep | same file, shortened | |
| 37 | `stack-standard.md` S1-S9 table with reasons, exceptions, S4 daemon default | keep | same file | CHK-37; reasons kept (spec: a rule with its reason) |
| 38 | `upgrades-with-data.md` intro example "PostgreSQL 15 to 16" | drop | | example |
| 39 | `upgrades-with-data.md` Before, PostgreSQL paths, After | keep | same file | CHK-52 |
| 40 | `upgrades-with-data.md` § Application schema migrations, expand then contract | drop | | repetition of `rollback.md` § When a revert is not enough; the section cites it |
| 41 | `versions-and-promotion.md` MUST and why, built once, version in git, digest | keep | same file, shortened | |
| 42 | `versions-and-promotion.md` § Changing a version, three steps | keep | same file, one paragraph | |
| 43 | `versions-and-promotion.md` § Rollback | drop | | repetition of `rollback.md`; one link kept in § Changing a version |
| 44 | `versions-and-promotion.md` § Promotion | keep | same file | |

Second reader: general-purpose subagent (fresh), 2026-11-16. Verdict: nothing lost. Drop and owner claims (rows 7-19, 31, 40, 43) verified in `stack-standard.md`, `rollback.md`, `versions-and-promotion.md`, `deploy-workflow.md`, `upgrades-with-data.md` and `infrastructure-operations` `documentation.md`; citers (CHK-37 to CHK-39, CHK-47, CHK-51, CHK-52) true.
