# Assessment: project-setup
Before: body 12942 bytes, references 126995 bytes. After: body 8394, references 16178.

Measured with the stage's `lean_check.py` (the lint's own `_body`). Total prose 139937 → 24572
bytes, under the 24576 budget by 4 bytes; no `over_budget` entry asked. Five reference files
deleted (`antora-docs.md`, `checklists.md`, `decisions.md`, `layout.md`, `settings-pattern.md`);
eight kept and rewritten; the settings code moved to `assets/settings/config_resolver.py`
(material). `assets/templates/` was already material and is the source for every file content the
old prose restated (batch note: prose that repeats a template is drop). Line numbers are those of
the files before the rewrite.

## SKILL.md body

| # | Passage (before) | Class | Where it went | Note |
|---|---|---|---|---|
| 1 | § Overview, l. 16-24 | keep, drop | body intro (the bias) | the restated description dropped |
| 2 | § Overview, routing table, l. 26-43 | owner | body Boundary (Delegates) | each row names its owner skill |
| 3 | § Overview, spine sentence, l. 45-47 | keep | body Workflow pointer to `spine-projection.md` | |
| 4 | § Modes, l. 49-60 | keep | body Workflow (intro pointer for brownfield; step 3 `--minimal`, `--dry-run`) | "no second bootstrap path" folded into "(agentic files and `.claude/` only)" |
| 5 | § Archetypes table, l. 62-71 | keep | body Rules, Archetypes | CHK-28 cites it |
| 6 | § Archetypes, doc-only elicitation, l. 73-75 | keep | `interview.md` (Q2.2) | |
| 7 | § Archetypes, conditional `model/` and LinkML, l. 76-83 | keep | body Rules, first bullet | |
| 8 | § Archetypes, CD seam, l. 84-85 | keep | `ci-and-infra.md` (The CD seam) | |
| 9 | § Archetypes, release seam, l. 86-89 | keep, owner | body Rules bullet; content → `meaningfy-release` | |
| 10 | § Archetypes, clarity gate not CI, l. 90-91 | keep | body Rules bullet; `ci-and-infra.md`; `spine-projection.md` | |
| 11 | Non-negotiables box, l. 93-95 | keep | body Decisions table (✱ rows D1, D2, D8, D13) | |
| 12 | § Procedure intro and brownfield, l. 99-102 | keep | body Workflow intro | |
| 13 | § Procedure 1 Interview, l. 104-107 | keep | body step 1, pointer to `interview.md` | |
| 14 | § Procedure 2 Plan, l. 108-109 | keep | body step 2 | layout tree → `scripts/scaffold.sh` (drop, see row 60) |
| 15 | § Procedure 3 Scaffold, flags and `--neo4j`, l. 110-124 | keep | body step 3 (flags as one sentence) | "by hand from templates" dropped: the scaffolder is the path |
| 16 | § Procedure 4 pillars list, l. 125-133 | keep | body step 4, six pointer sentences | settings → body Rules (row 72) |
| 17 | § Procedure 5 Verify, l. 134-135 | keep | body step 5 → Before you hand over | |
| 18 | § Procedure 6 Hand off, install commands, l. 136-147 | keep | body step 6; fallback sentence (practice 5) added | |
| 19 | § Canonical stack table, l. 149-166 | keep | body Decisions table (ids D1-D13) | templates cite D2, D4, D5, D11, D12 |
| 20 | § Canonical stack, shared checks row | keep | body Rules, "Shared checks" line | |
| 21 | "See decisions.md for rationale", l. 168 | drop | | rationale file cut (rows 40-55) |
| 22 | § Definition of Done, l. 170-176 | keep | body Before you hand over | |
| 23 | § Boundary & Related Skills, l. 178-192 | keep | body Boundary | owners per batch note added (`spec-stewardship`, `test-strategy`) |
| 24 | matrix line, l. 194 | keep | unchanged | |

## references/interview.md (10186 → 2084)

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 25 | intro, order, archetype filter | keep | `interview.md` intro | |
| 26 | Group 1 identity, defaults | keep | table row 1 | placeholder names kept |
| 27 | Group 2 archetype table | drop | | repeats the body archetype table |
| 28 | Q2.1 old answers map to product; no default | keep | table rows 2 and 4 | |
| 29 | Q2.2 intention elicitation | keep | `interview.md` Q2.2 | |
| 30 | Groups 3-7 questions and recommended defaults | keep | table rows 3-7 | "drives" detail dropped: the scaffold shows what each answer renders |
| 31 | Q4.5 model source never defaulted; owner `conceptual-modelling` | keep, owner | row 4; body Rules | |
| 32 | Q5.1 Neo4j + LinkML projects the generators | keep | row 5 (`--neo4j`) | |
| 33 | Resolved-profile echo-back block | keep, drop | `interview.md` Echo back (rule kept, the 25-line block dropped) | a model renders a profile from the answers |

## references/config-files.md (13835 → 2119)

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 34 | golden rule, minimal pyproject | keep | intro | |
| 35 | template → path map; placeholder registry | drop | | `scripts/scaffold.sh` is the source |
| 36 | per-file specs: pyproject, ruff, mypy, pytest, coveragerc, pre-commit, sonar, gitignore, Makefile, VERSION, LICENSE, importlinter | drop, keep | the template is the source for content; kept: no-src adaptations, install and lock rule, versions from `--python`, `VERSION` single source, coverage flags outside `pytest.ini`, pre-commit Ruff-only | |
| 37 | § Suppressions | keep | unchanged (cited by `quality/` Semgrep message `project-setup:config-files#suppressions`) | |
| 38 | § Migrating `pyproject.toml` | keep | `config-files.md` migration, with Poetry → uv (from modernizing step 4) and the `/src` lift (from `layout.md`) | |

## references/decisions.md (14554 → 0, deleted)

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 39 | intro: derived from two repos, newer wins | drop | | history |
| 40 | non-negotiables | keep | body Decisions (✱) | |
| 41 | D1 decision, override | keep | body D1 | "why" restating the rule dropped |
| 42 | D2 | keep | body D2; `config-files.md` | |
| 43 | D3 groups table, install behaviour | keep, drop | body D3; `config-files.md` (install, lock); group contents → template | |
| 44 | D4 Ruff config | keep, drop | body D4; `config-files.md`; settings → template | |
| 45 | D5 | keep | body D5; `testing-setup.md` | |
| 46 | D6 TDD + BDD | owner | body D6 names `superpowers:test-driven-development`, `bdd-gherkin` | |
| 47 | D7 layers and tiers | keep, owner | body D7; `architecture-guardrails.md`; layers → `cosmic-python` | |
| 48 | D7 reconciliation `domain/` vs `models/` | keep | `architecture-guardrails.md` intro (scaffold names it `domain/`) | conflict with `cosmic-python` left open (see report) |
| 49 | D7 divergences from older cosmic-python text | drop | | history |
| 50 | D8 incl. DEC-4 superseded, DEC-12 | keep, drop | body D8; `agentic-setup.md`; DEC-4 history dropped | |
| 51 | D9 `.claude/` index | keep | body D9; `agentic-setup.md` | |
| 52 | D13 spine, pipeline Architecture → EPIC → Plan | keep, owner | body D13; `spine-projection.md`; EPIC/PLAN shape → `epic-planning` | |
| 53 | D10 Antora | keep | body D10 | "why Antora" dropped |
| 54 | D11, D12 | keep | body D11, D12; `ci-and-infra.md` | |
| 55 | Project archetypes table | drop | | repeats the body table |

## references/layout.md (10145 → 0, deleted)

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 56 | intro, layer direction | owner | `cosmic-python` | |
| 57 | single-component tree | drop | | `scripts/scaffold.sh` and the templates produce it |
| 58 | annotations: no-src, tests sibling, commons tier 0, optional layers | keep | `config-files.md` (no-src); `testing-setup.md`; `architecture-guardrails.md` | |
| 59 | multi-component tree, tier rules | keep | `architecture-guardrails.md` (When to add tiers) | tree itself dropped |
| 60 | pipeline `<pkg>_dags/` | keep | `architecture-guardrails.md` | |
| 61 | `/src` contrast and lift | keep | `config-files.md` migration step 3 | |

## references/architecture-guardrails.md (6671 → 2238)

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 62 | intro, every repo gets `.importlinter` | keep | intro | |
| 63 | layers and direction | owner | `cosmic-python` | |
| 64 | when to add tiers, tier table | keep | When to add tiers (prose) | |
| 65 | two-step method, `code-anatomy.md` skeleton, contract mapping | keep | The two-step method | |
| 66 | choosing the contract type: parentheses, pipes, containers | drop | | import-linter's own documentation; the peer-isolation rule kept |
| 67 | gotcha: layers miss same-tier peers | keep | kept | |
| 68 | enforcement: Make + CI snippet | drop, keep | the Makefile template is the source; "between typecheck and test" dropped as template | |
| 69 | recording the decision | owner | ADR → `architecture`; comment rule kept | |
| 70 | grooming | keep | Keeping the contracts living (heading kept; cited by `harden-checks-and-tests`) | |

## references/settings-pattern.md (3650 → 0, deleted)

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 71 | the principle | owner | `cosmic-python:PR-CONFIG-DECOUPLED` | |
| 72 | mandated when settings exist; only approach | keep | body Rules, Settings | |
| 73 | placement note, pydantic-settings alternative | keep | comment header of `assets/settings/config_resolver.py` | |
| 74 | reference implementation code | material | `assets/settings/config_resolver.py` | a starting point to copy; `cosmic-python`'s catalogue says it lives in `project-setup` (settings pattern): still true |

## references/testing-setup.md (7671 → 1382)

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 75 | directory layout, two mirroring rules | keep | intro | tree dropped (template) |
| 76 | marker hook and conftest gotcha | keep | Markers by path | hook code dropped (template `tests/conftest.py`) |
| 77 | `pytest.ini` block | drop | | template |
| 78 | Make targets ↔ markers, lanes | keep | Lanes | |
| 79 | TDD + BDD | owner | `superpowers:test-driven-development`, `bdd-gherkin` (body D6) | |
| 80 | `scenarios()` vs `@scenario` | drop | | pytest-bdd's documentation |
| 81 | worked first feature | example, drop | | the shipped `example.feature` is its runnable copy |
| 82 | test-data conventions | keep, owner | Test data, Datastores; model objects → `cosmic-python` testing checklist rule 6 | |
| 83 | coverage gate, pragma on the stub | keep | Coverage | |

## references/ci-and-infra.md (14225 → 2588)

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 84 | template map, placeholders | drop | | scaffold.sh |
| 85 | CI philosophy, baseline gates | keep | CI philosophy | |
| 86 | spine / archetype gates, CI-automatable table | keep | The CI-automatable gates (heading kept, CHK-28) | |
| 87 | clarity gate not CI; doc-only no `ci.yaml` | keep | kept | |
| 88 | `ci.yaml` job walkthrough | drop, keep | the template `ci.yaml.tmpl` is the source; Sonar-only-with-token kept | |
| 89 | fail-fast vs report-all | drop | | generic CI advice |
| 90 | service containers vs testcontainers | keep | one sentence | |
| 91 | reusable workflow, when to use | keep | one sentence; caller example dropped (template) | |
| 92 | SonarCloud + coverage wiring | keep, drop | CI philosophy (token guard, `COV_FLAGS`); rest template | |
| 93 | docs Pages deploy | keep, drop | one sentence; settings detail → template; Read the Docs dropped | |
| 94 | CD seam | keep, owner | The CD seam; content → `ci-cd-delivery` | |
| 95 | infra layout, two gotchas | keep | Infra | |
| 96 | multistage rationale table, live development | drop | | template and general Docker knowledge; non-root kept |
| 97 | layered env table, rule of thumb | keep | Infra | |
| 98 | Make docker targets | drop | | Makefile template |

## references/agentic-setup.md (8714 → 1542)

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 99 | templates table, retired templates | drop, keep | the retirement rule kept (no `.claude/memory/epics/`) | |
| 100 | D8 canonical, pointer, no symlink; gitignore | keep | D8 paragraph | |
| 101 | global vs repo split (DEC-12) | keep | kept | |
| 102 | `docs/rules/` and `rulebook` | keep | verbatim (`tests/test_rulebook.py` reads it) | |
| 103 | spine is the work memory, artifact table | drop | | repeats `spine-projection.md` and `epic-planning` |
| 104 | `.claude/` index (R7) | keep | `.claude/` paragraph | |
| 105 | how this complements the skills | owner | body Boundary | |
| 106 | install commands, ponytail note | keep | body step 6; body Rules ("ponytail keeps code minimal") | the duplicate install block dropped |
| 107 | § Pointers | drop | | closing list |

## references/spine-projection.md (5355 → 1764)

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 108 | what gets scaffolded, path table | keep | bullets | tree dropped |
| 109 | artifact shift table | drop | | repeats `agentic-setup.md`, owned by `epic-planning` |
| 110 | commands and profile, pin | keep | kept | |
| 111 | golden thread pre-wiring | keep, owner | kept; the thread → `epic-planning` | |
| 112 | schema refresh path, YAGNI | keep | kept; Neo4j generator refresh (from `checklists.md`) added | |
| 113 | Validation | keep | kept (CHK-29 cites it) | |

## references/antora-docs.md (10334 → 0, deleted)

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 114 | piece inventory, playbook vs descriptor | drop | | the `docs/` templates; Antora's documentation |
| 115 | Diátaxis IA table | keep, drop | body D10; the pages exist as templates | |
| 116 | develop pages point to skills; drop an irrelevant bucket with its nav entry | keep | body Rules, Docs | |
| 117 | Mermaid + Lunr, local vs production, Make targets | drop | | templates (`package.json`, playbooks, Makefile) |
| 118 | API reference from OpenAPI, never by hand; ignore or commit with codegen check | keep | body Rules, Docs | |
| 119 | GitHub Pages deploy, `.nojekyll` | drop | | `docs.yaml` and `ui.yml` templates |
| 120 | wiring a new page, pitfalls | drop | | Antora general knowledge |
| 121 | authoring conventions | owner | `technical-writing` | |
| 122 | file checklist | drop | | repeats the templates; `make build-docs` in Before you hand over |

## references/checklists.md (8466 → 0, deleted)

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 123 | (a) scaffolding checklist | drop, keep | repeats the Workflow; `git init` and the default branch kept (body step 2); Neo4j refresh → `spine-projection.md`; first commit on consent (body Workflow intro) | |
| 124 | (b) Definition of Done | keep | body Before you hand over | CHK-30 re-pointed |
| 125 | smoke commands | keep, drop | the agent-file check kept in the table; the rest are `make` targets already named | CHK-9 re-pointed |

## references/modernizing-existing-projects.md (13189 → 3752)

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 126 | method, scope, never big-bang | keep | intro | |
| 127 | orchestration loop intro | drop | | repetition |
| 128 | 1. Assess: `--dry-run`, 13-dimension rubric | keep | 1. Assess (rubric as one sentence; CHK-31) | |
| 129 | carry only detected gaps | keep | kept | |
| 130 | 2. Plan, nine steps | keep | 2. Plan | Poetry → uv detail → `config-files.md` |
| 131 | 3. Apply | keep | 3. Apply | |
| 132 | 4. Verify | keep | 4. Verify (CHK-29) | |
| 133 | adopting the shared checks | keep | kept | |
| 134 | safety rules | keep | 2. Plan and 3. Apply | |
| 135 | recipes table, legacy agentic bootstrap | drop, keep | table dropped (repetition); epics migration → step 3 | |

Second reader: general-purpose subagent (fresh), 2026-11-15. Verdict: lost: the D7 owner decision
that `domain/` is a deliberate divergence from `cosmic-python`'s `models/` and must not be renamed
back; restored in the second reading (`references/architecture-guardrails.md` intro), paid by
cutting the repeated clarity-gate sentence in `spine-projection.md` Validation (now points to
`ci-and-infra.md`); total 24576. Not restored for lack of budget: the Antora search gotcha (the
Lunr box shows only when `SITE_SEARCH_PROVIDER=lunr` is set at build; no template sets it, about
90 bytes) and the library archetype's layers "domain (+adapters)" (about 30 bytes). Other fixes:
`tests/test_test_strategy.py` no longer lists the deleted `decisions.md` as a dependency file.
