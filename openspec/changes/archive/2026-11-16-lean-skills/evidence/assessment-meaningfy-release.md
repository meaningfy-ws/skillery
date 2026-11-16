# Assessment: meaningfy-release
Before: body 6524 bytes, references 7181 bytes. After: body 7403, references 7029.

Under budget before and after; pending for `pointers` only, so sorted by section (D-19). Measured
with `lean_check.py`. The body grew by the shape's Quick Start, Workflow and Quick diagnostic; no
reference was deleted or moved. Line numbers are those of the file before the rewrite.

## SKILL.md body

| # | Passage (heading or lines, before) | Class | Where it went | Note |
|---|---|---|---|---|
| 1 | § Overview, l. 16-20 | drop | body intro sentence (the bias) | restated the description |
| 2 | § Overview authority table, l. 22-27 | owner | Boundary (`meaningfy-git-workflow`, `ci-cd-delivery`, `project-setup`) | repetition of Boundary |
| 3 | § 1 SemVer MAJOR/MINOR/PATCH definitions, semver.org link, l. 31-32 | drop | | general knowledge |
| 4 | § 1 Public API (leading `_`, decidable surface), l. 33-35 | keep | Rules, Versioning | |
| 5 | § 1 Pre-release identifiers `-rc.N`, `-beta.N`, `-alpha.N`, l. 36-37 | keep | Rules, Versioning | "sorts below its final" → Common mistakes |
| 6 | § 1 Version of record = git tag, one bumper, l. 38-39 | keep | Rules, Versioning | |
| 7 | § 2 GitFlow for public/client repos, mechanics in git-workflow, l. 43-46 | keep, owner | Rules, Branches; mechanics cited to `meaningfy-git-workflow` | |
| 8 | § 2 release/hotfix bullets, l. 48-49 | keep | Workflow step 1 pointer to the runbook (which holds them in full); Branches names both | repetition of the runbook |
| 9 | § 2 navigator mod, l. 51 | keep | Workflow intro, with the phase gates | |
| 10 | § 3 Keep a Changelog, Unreleased, stub from project-setup, l. 55-56 | keep | Rules, Changelog | |
| 11 | § 3 auto-generation is the starting point, l. 57-58 | keep | Rules, Changelog; Quick Start step 2 | |
| 12 | § 3 CHANGELOG vs GitHub Release body, l. 59-60 | keep | Rules, Changelog; Quick diagnostic | |
| 13 | § 4 release-please, diagram, free-tier, l. 62-78 | keep | Rules, The release engine (prose instead of diagram); Quick Start | |
| 14 | § 5 PyPI Trusted Publishing, l. 82-85 | keep | Rules, Publishing, pointer sentence | inventory CHK-48 now cites "(Publishing)" |
| 15 | § 5 GHCR image via ci-cd-delivery, l. 86-87 | owner | Rules, Publishing (cites `ci-cd-delivery`) | |
| 16 | § 6 Supply-chain, opt-in, l. 89-94 | keep | Rules, Supply-chain, pointer sentence | layer list lives in the reference |
| 17 | § 7 SECURITY.md, advisories, l. 98-99 | keep | Rules, Governance | |
| 18 | § 7 Yank, don't delete, l. 100-101 | keep | Rules, Governance; Common mistakes | |
| 19 | § 7 Deprecate before you break, l. 102-103 | keep | Rules, Governance | |
| 20 | § Error / decision matrix, l. 105-114 | keep | Rules, Common mistakes (all six rows) | |
| 21 | § Boundary & Related Skills, l. 116-125 | keep | Boundary | |
| 22 | test-strategy matrix line, l. 127 | keep | unchanged | |

## references/

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 23 | `gitflow-release-runbook.md`, whole | keep | stays | "SKILL §4" and the wrong link to `pypi-publishing.md` replaced by "the release engine in `SKILL.md`" |
| 24 | `pypi-publishing.md`, whole | keep | stays | "SKILL §4" reworded; the illustrative `python -m build` corrected to `uv build`, which its own invariants prescribe |
| 25 | `supply-chain.md`, § Why opt-in, first sentence | drop | | "why" restating the rule |
| 26 | `supply-chain.md`, rest | keep | stays; the rung rule under "Which rung" | |

Citers: `skills/test-strategy/references/inventory.md` CHK-48 "(5. Publishing)" → "(Publishing)".
`agents/release-manager.md`, `docs/development/releasing.md`, `docs/development/workflows.md` stay
true (skill name, asset path and scope unchanged).

Second reader: general-purpose subagent (fresh), 2026-11-15. Verdict: nothing lost
Other fixes: none needed; the release and hotfix branch rules live in full in `gitflow-release-runbook.md`, all six decision-matrix rows are in Common mistakes, and no file still cites "SKILL §N" or the old section numbers.
