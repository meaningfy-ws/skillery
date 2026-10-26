# EPIC-setup — Definition of Done & Quality Gates

The test charter for the reorg. Answers, for every aspect: **"how will we know X was built right?"** (verification) and **"how will we know the *right* X was built?"** (validation). Layer tags: **REPO** (this repository), **CONSUMING** (downstream projects), **ABSTRACT** (methodology). Companion to `EPIC-setup-review-decisions.md`.

## Gate index

| Gate | Question | Auto? | Layer | When |
|---|---|---|---|---|
| G-FM | every skill SKILL.md has top-of-file frontmatter (incl. `architecture`); validator never crashes | yes | REPO | WS1 |
| G-NAME | `name` == dir | yes | REPO | WS1 |
| G-MKT | marketplace skills ↔ skill dirs set-equal | yes | REPO | WS1 |
| G-BUNDLE | bundles == the R1 3-bundle map exactly | yes | REPO | WS1–3 |
| G-LINK | no broken internal links, full repo (no ai-coding skip) | yes | REPO | WS1→ |
| G-LEN | no SKILL.md > ~500 lines | yes | REPO | WS2/3 |
| G-DANGLE | no prose mentions of moved/removed files (non-frozen) | yes | REPO | WS2 |
| G-AGENTS | only the 3 thin wrappers remain; no orphan refs to dropped agents (excl. frozen ai-coding) | yes | REPO | WS3 |
| G-THIN | each surviving agent carries no reusable knowledge (only role/model/tools/skills/glue) | manual | REPO | WS3 |
| G-README | README lists every skill | yes | REPO | WS4 |
| G-MIRROR | CLAUDE.md.template & AGENTS.md.template reference identical skill sets | yes | CONSUMING | WS4 |
| G-IDEA | `.idea/` ignored, on disk, never deleted/untracked | yes | REPO | WS1 |
| G-FROZEN | frozen paths: pure renames + one additive file, zero content deltas | yes (git) | REPO | end |
| G-DUP | each canonical fact has one authority; others point by name | assist+manual | ABSTRACT | end |
| G-TRIG | skills fire on intended probes; no collision with external neighbours | manual | CONSUMING | end |
| G-BOOTSTRAP | scratch-repo bootstrap is idempotent; README new-employee walk works | manual | CONSUMING | end |
| G-EXT | external deps documented w/ install cmds + drift note | manual | CONSUMING | WS4 |
| G-PROCESS | git mv preserves history; all commits/GH at the very end | yes (git log) | REPO | end |

## Per-workstream DoD

### WS1 — structure & validator
- **DoD:** target dirs exist; `.idea/` verified-ignored (no change); `THIRD_PARTY_NOTICES.md` created; CONTRIBUTING realigned; `architecture` skill has frontmatter + R3/R6; `dod-quality-gates.md` authored; validator (CLI + all D4 checks + tests) green; Makefile + CI; marketplace bundles for existing skills.
- **Verify:** `make validate` green; `python -m tools.repo_lint` exits 0; `git check-ignore .idea/workspace.xml` prints the path; `git ls-files .idea` empty; `test -f THIRD_PARTY_NOTICES.md`; `head -1 skills/architecture/SKILL.md` is `---`.
- **Validate:** the validator *fails* on a deliberately broken fixture (frontmatter removed, skill unregistered, bad link, wrong bundle) — i.e. the gate actually bites. Add a `tests/test_repo_lint_negative.py` using a tmp copy.
- **Self-check:** run `make validate` after every task; if red, stop and fix before next task.
- **Risk (High):** validator passes vacuously (checks nothing real) → mitigate with the negative test above.
- **Built right?** green validate + negative test bites. **Right thing?** the checks map 1:1 to R2/R19/A1 and the new D4 gaps.

### WS2 — skills: promote/dedup/extend
- **DoD:** `clarity-gate` real+registered; buried stream-coding files de-duped (relocated-as-delta or removed) with referrers repointed **in the same step**; `meaningfy-git-workflow` authored+bundled; cosmic-python vocabulary + Boundary done.
- **Verify:** `make validate` green after each task (G-LINK never breaks → atomic move+repoint); `! test -f skills/cosmic-python/references/stream-coding-methodology.md`; G-LEN passes.
- **Validate (G-TRIG subset):** P5 "score this spec against the clarity gate" → `clarity-gate`; P7 "name this branch/commit" → `meaningfy-git-workflow`; P8 "structure the layers" → `cosmic-python` not `architecture`.
- **Risk (High):** move-before-repoint dangling link → atomic step. **(Med):** stream-coding delta lost on delete → diff against external skill first; relocate any Meaningfy delta to docs.
- **Built right?** validate green, no orphan path mentions. **Right thing?** G-TRIG subset fires correctly; cosmic-python no longer restates TDD.

### WS3 — agents → skills + thin wrappers
- **DoD:** skills `bdd-gherkin`, `meaningfy-code-review`, `epic-planning`, `technical-writing` authored+bundled; `gherkin-writer`+`documenter` removed; `implementer`/`code-reviewer`/`epic-planner` reduced to thin wrappers loading skills; implementer residue in its wrapper.
- **Verify:** `grep -L` shows the 3 wrappers contain no layer rules/TDD/checklist prose (G-THIN manual + `orphan_agent_references`==[]); `ls agents/` shows exactly 3 files; G-BUNDLE green.
- **Validate (G-TRIG):** P1 Work Shape→`epic-planning` (not stream-coding); P3 "Meaningfy review checklist"→`meaningfy-code-review`; P6 Gherkin→`bdd-gherkin`. Capability check (A8): `code-reviewer` still read-only (`disallowedTools`), `implementer` still sonnet + gitnexus gate.
- **Risk (High):** thin wrapper silently re-imports knowledge → G-THIN read + `skill_too_long` on any accidentally-fat wrapper. **(Med):** description collisions → D5 anchoring + G-TRIG.
- **Built right?** 3 wrappers + 4 skills, validate green, no orphan refs. **Right thing?** probes route correctly; model/tool guarantees preserved.

### WS4 — docs / prompts / projection
- **DoD:** `docs/engineering-standards/*` + `docs/philosophy/*` authored (narrate+point, R15); coding-prompt relocated (atomic); `environment-setup.md` (mandatory/optional + drift note); `prompts/` 3 templates (version-stamped, mirrored); `scripts/init-meaningfy-project.sh` (idempotent); `spec/skill-repo-governance.md` (D9); README full rewrite (R20).
- **Verify:** `make validate` green incl. G-MIRROR, G-README, `*.template` links; `wc -l prompts/global-prompt.md` ≤ 40; `bash scripts/init-meaningfy-project.sh --help`.
- **Validate:** **G-BOOTSTRAP/E2E** (below); **G-DUP** matrix signed; R15 manual read (docs point, don't restate).
- **Risk (High):** global-prompt balloons → line assert. **(Med):** templates diverge → G-MIRROR. **(Med):** bootstrap clobbers local edits → write-if-absent + diff-confirm, tested.
- **Built right?** validate green incl. mirror/readme/template-links. **Right thing?** E2E walk passes; G-DUP matrix ticked.

## G-DUP — single-authority matrix (sign at end)

| Canonical fact | Sole authority | Others must |
|---|---|---|
| Layer rules (models/adapters/services/entrypoints) | `cosmic-python` | point by name |
| Red-green-refactor TDD | external `superpowers:test-driven-development` | point by name |
| Conventional commits + branch naming | `meaningfy-git-workflow` | point by name |
| Clarity gate (13 items + scoring) | `clarity-gate` | point by name |
| EPIC.md structure | `epic-planning/references/epic-template.md` | point by name |
| Review checklist | `meaningfy-code-review` | point by name |
| Quality-gate table | `docs/ai-coding/dod-quality-gates.md` (mirrors methodology §8.3) | reference |
| Coding prompt (full text) | `docs/engineering-standards/coding-prompt.md` (canon) + `cosmic-python` (operational) | header marks operational |

Pass = `duplicate_fact_candidates` report has no *unexplained* multi-home fact AND every row's "others point by name" holds on manual read.

## G-TRIG — probe set (manual, run once at end)

Issue each probe with all 3 bundles + external skills installed; pass = intended skill fires/offered first.

| # | Probe | Intended | Must NOT instead |
|---|---|---|---|
| P1 | "Turn this Work Shape into an implementation-ready EPIC" | epic-planning | stream-coding |
| P2 | "Build a feature from this spec" | external stream-coding | epic-planning |
| P3 | "Run the Meaningfy pre-PR review checklist on this diff" | meaningfy-code-review | external code-review |
| P4 | "Review this pull request" | external code-review (overlap OK — document) | — |
| P5 | "Score this spec against the clarity gate" | clarity-gate | epic-planning |
| P6 | "Write Gherkin scenarios for this AC" | bdd-gherkin | stream-coding |
| P7 | "How should I name this branch and commit?" | meaningfy-git-workflow | commit-commands (delegation OK) |
| P8 | "Structure the layers for this Python service" | cosmic-python | architecture |

Mis-fire → sharpen the losing skill's `description` WHEN-clause (D5), re-run. Record pass/fail in the PR body.

## G-BOOTSTRAP / E2E (CONSUMING acceptance, A6 + R26)

1. `mkdir /tmp/mf-consumer && git init` there.
2. Run `scripts/init-meaningfy-project.sh` → writes `CLAUDE.md`+`AGENTS.md`, creates `.claude/memory/`, prints the 3-bundle + external install commands.
3. Re-run → "exists, no changes" / safe diff (idempotence).
4. Edit `CLAUDE.md`, re-run → shows diff, asks before overwrite; declining preserves the edit.
5. Printed install commands match `docs/environment-setup.md` exactly.
6. README-only new-employee walk (A6): from README alone reach install / learn (`docs/ai-coding/`) / standards (`docs/engineering-standards/`+`prompts/`) / contribute (`spec/`+`template/`) in ≤2 hops; no `agents/` in the public "what's inside".
7. Routing walk: generated `CLAUDE.md` routes the canonical task types to the right skills (cross-check G-TRIG).

## EPIC-level DoD
All G-* gates pass (manual ones recorded in PR body); A1–A8 hold; G-FROZEN clean; single squashed-or-logical commit set + draft PR created **only at the very end**; nothing merged.
