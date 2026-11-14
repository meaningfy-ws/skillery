<!-- PLAN (design half), derived 2026-11-14 from proposal.md (DEC-1..DEC-15, frozen). Type:
     Implementation. Attacked the same day by a fresh subagent (F-1..F-22, folded in, see § Attack
     record); the developer's answers of round 8 (inputs/qa.md) are folded in. Written against EPIC
     A's design.md while A is being delivered: every point that must be re-checked against A's real
     matrix is marked [A] and listed in D-12. -->

> Derives from: EPIC `harden-checks-and-tests` ([`proposal.md`](proposal.md)), DEC-1..DEC-15; parent
> EPIC A [`test-strategy`](../test-strategy/proposal.md) and its PLAN
> ([`design.md`](../test-strategy/design.md)).

## Context

What exists today, checked on `develop` at 6a54619:

| Area | Today | Where |
|---|---|---|
| Ruff selection | `E F I B UP SIM C90 N RUF100`, `E501` ignored, pin `ruff==0.15.11` | [`ruff.toml.tmpl`](../../../skills/project-setup/assets/templates/root/ruff.toml.tmpl), [`pyproject.toml.tmpl`](../../../skills/project-setup/assets/templates/root/pyproject.toml.tmpl) |
| Catalogue | 6 principles, 7 best practices, 13 anti-patterns, no checker column | [`principles-and-anti-patterns.md`](../../../skills/cosmic-python/references/principles-and-anti-patterns.md) |
| Clean-code and SOLID rules | 5 + 5 bullets without ids | [`cosmic-python/SKILL.md` § Core principles](../../../skills/cosmic-python/SKILL.md#core-principles-from-meaningfy-engineering) |
| Testing checklist | 16 numbered items; Hypothesis is item 10 | [`testing-checklist.md`](../../../skills/cosmic-python/references/testing-checklist.md) |
| Tester | A brief for `implementer`, names targets and no method; runs at LARGE and above | [`team-and-briefs.md` § Adversarial tester](../../../skills/epic-delivery/references/team-and-briefs.md#adversarial-tester), [`epic-delivery.workflow.json`](../../../skills/epic-delivery/assets/workflows/epic-delivery.workflow.json) (`reviews.<appetite>.tester`) |
| Import contracts | A `layers` contract with full module names, no `exhaustive`; grooming is prose | [`dot-importlinter.tmpl`](../../../skills/project-setup/assets/templates/root/dot-importlinter.tmpl), [`architecture-guardrails.md` § grooming](../../../skills/project-setup/references/architecture-guardrails.md#keeping-the-contracts-living-grooming) |
| Scaffold | [`scaffold.sh`](../../../skills/project-setup/scripts/scaffold.sh) renders a fixed list of templates by name (lines 272–283, 412–431) and creates `<pkg>/commons/` and `<pkg>/__main__.py` (lines 297–306, 345); the Makefile is rendered for all three archetypes | — |
| Project CI | Calls `make lint`, `typecheck`, `check-architecture`, `test`, `clean-code` one by one, never `check-quality` | [`ci.yaml.tmpl`](../../../skills/project-setup/assets/templates/ci/ci.yaml.tmpl) (lines 105–118) |
| Top-level folders | `TOP_LEVEL_FOLDERS` has no `quality` | [`tools/repo_lint/lint.py`](../../../tools/repo_lint/lint.py) (line 462) |
| Artifact types | Five | [`governance.md`](../../../docs/development/governance.md#the-five-artifact-types), [`AGENTS.md`](../../../AGENTS.md) (line 11), [`CLAUDE.md`](../../../CLAUDE.md) (line 4) |
| External tools | Each has an entry in [`dependencies.yaml`](../../../dependencies.yaml), local-only engines included (clingo) | live spec `external-dependency-register` |
| Mutation testing, Semgrep, ls-lint, checkmake, Schemathesis | Nowhere in the catalogue | — |
| Releases | The `releases` branch holds the whole released tree, so a new top-level folder ships at every tag `vX.Y.Z`; the repository is public | [`releases.yml`](../../../.github/workflows/releases.yml) |
| skillery CI | Installs only `pyyaml` and `pytest`; `plugin-eval.yml` installs `requirements-dev.txt` | [`validate.yml`](../../../.github/workflows/validate.yml) |

The navigator accepts any string or `null` in `reviews.<appetite>.tester`
(`mods/navigator/lib/workflow.ts`, line 191) and no navigator test pins the MEDIUM value, so the
tester's new range needs no mod change.

### Files this plan names by short name

| Short name | File |
|---|---|
| `Makefile.tmpl`, `dot-gitignore`, `dot-pre-commit-config.yaml` | [`Makefile.tmpl`](../../../skills/project-setup/assets/templates/root/Makefile.tmpl), [`dot-gitignore`](../../../skills/project-setup/assets/templates/root/dot-gitignore), [`dot-pre-commit-config.yaml`](../../../skills/project-setup/assets/templates/root/dot-pre-commit-config.yaml) |
| `config-files.md` | [`project-setup/references/config-files.md`](../../../skills/project-setup/references/config-files.md) (§ `ruff.toml`; the template table at the top) |
| `decisions.md` | [`project-setup/references/decisions.md`](../../../skills/project-setup/references/decisions.md) (sections D2, D4, D12) |
| `ci-and-infra.md` | [`project-setup/references/ci-and-infra.md`](../../../skills/project-setup/references/ci-and-infra.md) |
| `layout.md`, `checklists.md` | [`layout.md`](../../../skills/project-setup/references/layout.md), [`checklists.md`](../../../skills/project-setup/references/checklists.md) |
| `modernizing-existing-projects.md` | [`project-setup/references/modernizing-existing-projects.md`](../../../skills/project-setup/references/modernizing-existing-projects.md) |
| `stage-loop.md` | [`epic-delivery/references/stage-loop.md`](../../../skills/epic-delivery/references/stage-loop.md) (the check ledger, line 136) |
| `example-testing-patterns.md` | [`cosmic-python/references/example-testing-patterns.md`](../../../skills/cosmic-python/references/example-testing-patterns.md) |
| The L3 lens | [`meaningfy-code-review/SKILL.md`](../../../skills/meaningfy-code-review/SKILL.md) (the lens table, line 74) |
| `working-with-agents.md` | [`docs/practice/ai-coding/working-with-agents.md`](../../../docs/practice/ai-coding/working-with-agents.md) (line 44) |
| The reviewer's scenarios | [`tests/features/agents/code-reviewer.feature`](../../../tests/features/agents/code-reviewer.feature) |
| `CONTRIBUTING.md`, `dependencies.yaml` | [`CONTRIBUTING.md`](../../../CONTRIBUTING.md), [`dependencies.yaml`](../../../dependencies.yaml) |
| `tests/test_quality.py`, `requirements-quality.txt`, `docs/development/quality.md`, everything under `quality/` and `skills/project-setup/assets/templates/quality/` | New files of this change |

### Issue #215: what Ruff really flags

Probed on 2026-11-14 with Ruff 0.17.5 on the fixtures in
[`inputs/ruff-probe/`](inputs/ruff-probe/) (`uvx ruff check --config inputs/ruff-probe/ruff.toml`).
`good.py` stays silent under every code below.

| Case | Code | Flags | Does not flag |
|---|---|---|---|
| HTTP call without a timeout | `S113` | `requests.get(url)`; `requests.post(url, timeout=None)`; `httpx.get(url, timeout=None)` | `requests.Session().get(url)`; `httpx.get(url)`, `httpx.Client().get(url)`, `httpx.AsyncClient().get(url)` (httpx has a 5 s default, so only the `Session` case is a real gap: accepted, D-2) |
| Naive `datetime` | `DTZ001`, `DTZ003`, `DTZ005`, `DTZ006`, `DTZ007`, `DTZ011` (select the family `DTZ`) | constructor, `utcnow()`, `now()`, `fromtimestamp()`, `strptime()` without `%z`, `date.today()` | — |
| Bare `except` | `E722` (already selected through `E`) | `except:` | `except Exception:` |
| Blind `except` | `BLE001` | `except Exception:`, `except BaseException:` | — |
| Env read outside config | `TID251` with `banned-api` for `os.getenv`, `os.environ` | both forms | — |
| Magic value in a comparison | `PLR2004` with `allow-magic-value-types = ["bytes"]` | `kind == "resource"`, `n > 42` | string dict keys, `hasattr(o, "name")` |
| `assert a and b` | `PT018` | composite assertion | — |
| Too many arguments | `PLR0913` | 7 arguments (limit 5) | — |
| SPARQL built from strings | none: `S608` flags only SQL with `FROM` | — | f-string and `+` SPARQL: needs Semgrep (DEC-3) |
| Deep nesting | none in stable: `PLR1702` is preview-only | — | review only |

### Tool facts the plan relies on

Verified on 2026-11-14 by running each tool (Semgrep 1.185.0, ls-lint 2.3.2, checkmake 0.3.2,
mutmut 3.8.1, Hypothesis 6.170.15, Schemathesis 4.33.4, import-linter 2.16), the second time on a
project scaffolded by `scaffold.sh`:

| Tool | Fact | Consequence |
|---|---|---|
| Semgrep | `semgrep scan --test <dir>` runs `x.yaml` against `x.py` beside it; a rule without a fixture exits 0 | Our own test checks fixture presence (D-8) |
| Semgrep | `--error` exits 1 on any finding, whatever the severity | Report-only rules live in their own folder and run without `--error` (D-3) |
| Semgrep | `# nosemgrep: id -- reason` suppresses; a reason cannot be required; a bare `# nosemgrep` also suppresses a rule that looks for it | The reason rule runs in its own pass with `--disable-nosem` (D-6) |
| Semgrep | Local rules need no login and no network with `--metrics=off` | Offline runs work after the fetch |
| Semgrep | Registry rules cannot be pinned; `semgrep/semgrep-rules` has no tags | External sources are pinned by commit id (D-7) |
| Semgrep | A rule with `paths: include:` does not match its fixture unless the fixture path matches too | A path-scoped rule also includes its own fixture file name |
| ls-lint | A negated regex on `.py` bans file names; rules joined with a pipe are alternatives, so "snake case and not banned" cannot be one rule; `exists` counts by extension, not by file name; `.dir: snake_case` fails on `.github`, `.claude` and kebab-case OpenSpec change folders | ls-lint bans names only; required files are `test -f` lines; snake case stays with Ruff `N999` (D-5) |
| checkmake | `[minphony] required = a,b` fails on a missing or non-phony target (undocumented key, works in 0.3.2); the only built-in finding on `Makefile.tmpl` is `maxbodylength` on `clean` | Required targets are checked; the body limit is set in the shared file (D-5) |
| mutmut | Config key `source_paths` in `[tool.mutmut]`; `mutmut run` exits 0 with survivors; no time budget option; state in `mutants/` makes reruns incremental; `mutmut results` is text only; the counts file is written only by `mutmut export-cicd-stats` | `timeout` wraps the run; a script writes the results (D-10) |
| mutmut | 3.8.1 needs `click>=8.4.2`; the template's `linkml==1.10.0` needs `click<8.2`, so the template does not lock with both | Task 3.6 resolves the lock first (D-10) |
| Hypothesis | The built-in `ci` profile (derandomised) loads when `CI` is set | No conftest wiring |
| Schemathesis | `schemathesis.openapi.from_asgi(...)`, `@schema.parametrize()`, `case.call_and_validate()` | Checklist item 10 names these (D-9) |
| import-linter | `exhaustive = true` works only on a `layers` contract with `containers` and fails on any module of the container that no layer lists, `__main__` and `commons` included; `exhaustive_ignores` lists exceptions | The template's contracts move to the container form and list both (D-11) |
| import-linter | A `forbidden` contract with `include_external_packages` is green on the skeleton and red on `import requests` in the forbidden layer | `AP-IO-IN-MODELS` is checked by import-linter (D-3) |
| import-linter | A comment line inside `ignore_imports` is dropped by the INI parser; an inline comment becomes part of the entry | The decision comment sits on the line above (D-11) |
| GitHub Actions | A workflow can open a pull request with `GITHUB_TOKEN` only when the repository setting "Allow GitHub Actions to create and approve pull requests" is on; such a pull request's CI runs wait for a person's approval | Setup note and error-matrix row (D-10) |

## Goals / Non-Goals

**Goals:** the five outcomes of the proposal's Solution outline, cut into the three stages of the
Appetite; the three proofs of DEC-15; the Definition of Done of
[`docs/development/README.md` §9](../../../docs/development/README.md#9-definition-of-done).

**Non-Goals:** the proposal's No-gos. In particular: no new catalogue entry besides
`AP-SPARQL-FROM-STRINGS`; no rule for something Ruff already flags; no check run on skillery's own
code; no tool installed in skillery's CI; no description change in any skill (so no new trigger
probe is owed); no change to `ci-cd-delivery` (the proposal's "possibly": the weekly workflow is a
CI template, which `project-setup` owns); nothing for the doc-only archetype (DEC-8 gives docs
folders to EPIC C). `Makefile.tmpl` is one file for all three archetypes, so a doc-only project
also gets the new targets; its `check-quality` already fails today at `lint`, which has no package
to read, and that stays as it is. The `scripts/quality/` templates and the weekly workflow are
rendered inside `scaffold.sh`'s `CODE` block, so a doc-only project does not get them.

## Decisions

New choices made while planning. Settled ones are cited by `DEC-n`. Four were the developer's, on
2026-11-14 (`inputs/qa.md`, round 8): Q-21 (D-2), Q-22 (D-13), Q-23 (D-1) and Q-24 (D-5).

### D-1 The `quality/` tree and the scripts' home

```
quality/
  README.md                         the one prose file: every check, its tool, its file, its owner
  semgrep/rules/<id>.yaml + <id>.py       gating rules, fixture beside the rule
  semgrep/report-only/<id>.yaml + <id>.py rules that print and never fail
  semgrep/suppressions/<id>.yaml + <id>.py the one rule of D-6, run in its own pass
  semgrep/external.json             manifest of external sources (D-7)
  ls-lint/python-project.yml        banned file names (D-5)
  checkmake/python-project.ini      Makefile hygiene and required targets (D-5)
```

The artifact type is named **Check**. `quality/` holds rule files and configurations only (DEC-4,
confirmed by the developer, Q-23). A repo lint `quality_files` (added to `ALL_CHECKS`) allows under
`quality/` only `README.md` at its root and files ending `.yaml`, `.yml`, `.json`, `.ini` and, as
Semgrep fixtures only, `.py` beside a rule of the same name; it skips `__pycache__`.
`TOP_LEVEL_FOLDERS` gains `quality`. EPIC C adds `quality/vale/` beside these (DEC-7); nothing here
blocks it.

**The three scripts and the tool checksums are `project-setup` templates** (Q-23), copied into
every scaffolded project by `scaffold.sh`:

| Template (`skills/project-setup/assets/templates/quality/`) | In the project | Decision |
|---|---|---|
| `check_contracts.py` | `scripts/quality/check_contracts.py` | D-11 |
| `mutation_report.py` | `scripts/quality/mutation_report.py` | D-10 |
| `external_sources.py` | `scripts/quality/external_sources.py` | D-7 |
| `tools.sha256` | `scripts/quality/tools.sha256` | D-4 |

All three are standard library only. A project upgrades them by copying the newer template
(`modernizing-existing-projects.md` says so); the drift between projects is the price the developer
accepted with Q-23.

### D-2 The Ruff selection

`ruff.toml.tmpl` adds exactly the codes that check a catalogued rule or a hygiene case of DEC-3.
The Ruff pin in `pyproject.toml.tmpl` and the `rev` in `dot-pre-commit-config.yaml` move together
to the version the stage builder verifies the fixtures with (0.17.5 or later).

```toml
select = [ ...the nine existing entries...,
    "S113",    # request without timeout (hygiene, #215)
    "DTZ",     # naive datetime (hygiene, #215)
    "BLE001",  # blind except (hygiene, #215; bare except is E722)
    "TID251",  # banned API: env reads outside config (PR-CONFIG-DECOUPLED)
    "PLR2004", # magic value in a comparison (BP-CONSTANTS-ENUMS, AP-FREESTR-ANYLAYER)
    "PLR0912", "PLR0913", "PLR0915",  # branches, arguments, statements (clean code: small functions)
    "PT018",   # composite assertion (testing checklist item 11)
]
[lint.pylint]
allow-magic-value-types = ["bytes"]
[lint.flake8-tidy-imports.banned-api]
"os.getenv".msg = "Read configuration through the typed config class (cosmic-python:PR-CONFIG-DECOUPLED)."
"os.environ".msg = "Read configuration through the typed config class (cosmic-python:PR-CONFIG-DECOUPLED)."
[lint.per-file-ignores]
"**/config_resolver.py" = ["TID251"]   # the one module that reads the environment
"tests/**/*.py" = ["PLR2004"]          # literal expected values are the point of a test
```

Thresholds stay at Ruff's defaults (5 arguments, 12 branches, 50 statements) and `C901` at 10: the
catalogue names a target ("<25 lines"), not a limit. Considered and left out: `T20`, the rest of
`S`, `PLR1702` (preview-only), `ARG`, `ERA`: none checks a rule in DEC-3's scope; a wider selection
belongs with the follow-up catalogue EPIC (#210). The selection is green on the scaffold skeleton
(checked 2026-11-14).

**The `Session` gap is accepted** (Q-21): `S113` does not flag `requests.Session().get(url)`. No
rule is added (DEC-3: no further catalogue entry); the gap is recorded on issue #215 and as RISK-9.

### D-3 The "Checked by" value and its lint

| Where | Form |
|---|---|
| The three catalogue tables | A last column `Checked by` |
| Testing checklist items 1–16 | The item ends with `*Checked by:* <value>` |
| Clean-code and SOLID bullets in `cosmic-python/SKILL.md` | The bullet ends with `*Checked by:* <value>` |

A value is one or more of the following, separated by `; `:

| Checker | Written as |
|---|---|
| Ruff | `Ruff` then one or more codes in backticks |
| import-linter | `import-linter` then the contract kind in words |
| Semgrep | `Semgrep` then the rule id in backticks |
| ls-lint | `ls-lint` (the tool DEC-8 gives file names to; DEC-2's order has no place for names) |
| A gate the template already has | `make` then the target in backticks (`make` `test` for the coverage gate, `make` `clean-code` for xenon) |
| None | `review only, because <reason>` (reason of at least 3 words; never combined with a tool) |

A tool that checks only part of a rule is written with the tool first, then `(partial: <what is left
to review>)`; it is the only parenthesis a value may hold. The word `make` is plain and its target
is in backticks. Two full values as they are written in the catalogue:

```
Ruff `PLR2004`; Semgrep `mfy-free-string-key` (partial: subscripts and attribute names are report-only)
review only, because duplication across files needs a reader
```

`tests/test_quality.py` (pure Python, runs in CI) fails when: an entry, item or bullet has no value;
a value does not parse; a named Semgrep id has no rule file under `quality/semgrep/rules/` or
`quality/semgrep/report-only/`; a rule id in those two folders is named by no value; a named Ruff
code is not covered by the `select` of `ruff.toml.tmpl` (a selected family such as `DTZ` covers
`DTZ005`); a named `make` target is not in `Makefile.tmpl`.

**What a rule's message cites** (DEC-4: the rule text has one home). One of three forms, checked by
the same test:

| The rule checks | The message holds |
|---|---|
| A catalogue entry | `cosmic-python:<ID>`, for example `cosmic-python:AP-SPARQL-FROM-STRINGS` |
| A testing checklist item | `cosmic-python:testing-checklist#<n>`, for example `cosmic-python:testing-checklist#12` |
| The suppression convention (D-6, the one rule in `semgrep/suppressions/`) | `project-setup:config-files#suppressions` |

**First assignment.** It is the stage builder's starting point; each tool row is confirmed by a
fixture that fails without the check, test-first, and a row whose fixture cannot be made to work
becomes `review only, because …` with the reason found (the proposal's rabbit-hole "ALL of them").
The table is shorthand: it names the checker of each entry, and its notes in parentheses explain
the choice to the builder. The builder writes each value in the grammar above; for a review-only
row the reason is the one in the table below this one.

| Entry | Checked by |
|---|---|
| `PR-SURVEY-FIRST`, `PR-SSOT-DRY`, `PR-REUSE-COMPACT` | review only (a working step or a judgement on meaning; no shape in the code) |
| `PR-MODELS-OVER-DICTS`, `AP-DICT-AS-MODEL` | Semgrep `mfy-dict-as-model` (report-only) |
| `PR-COMPONENT-FIRST`, `AP-CROSS-VARIANT-IMPORT` | import-linter, the tier and layer contracts with `exhaustive` (D-11) |
| `PR-CONFIG-DECOUPLED` | Ruff `TID251` |
| `BP-CONSTANTS-ENUMS`, `AP-FREESTR-ANYLAYER` | Ruff `PLR2004` (comparisons); Semgrep `mfy-free-string-key` (report-only; subscripts, `hasattr`, `getattr`) |
| `BP-DOMAIN-REVEALING-NAMES`, `AP-GENERIC-MODULE-NAMES` | ls-lint (partial: every name but the five banned ones is reviewed) |
| `BP-EXCEPTIONS-MODULE`, `AP-EXCEPTIONS-EMBEDDED` | ls-lint (no `errors.py`); Semgrep `mfy-exception-outside-exceptions-module` |
| `AP-IO-IN-MODELS` | import-linter, a `forbidden` contract on external I/O packages |
| `AP-SPARQL-FROM-STRINGS` (new, DEC-3) | Semgrep `mfy-sparql-built-from-strings` |
| `BP-COVERAGE-PER-LAYER` | `make` `test` (partial: the gate is overall, the per-layer split is reviewed) |
| `BP-VALIDATE-AT-BOUNDARY`, `BP-IDIOMATIC-SMALL`, `BP-CONSTANTS-HOME`, `AP-DUP-CONST`, `AP-MISPLACED-SHARED-INFRA`, `AP-VERBATIM-EXTERNAL`, `AP-DUP-VALIDATION`, `AP-LOGIC-IN-EDGES`, `AP-OVER-FRAGMENTATION`, `AP-PARALLEL-LAYOUTS` | review only (cross-file duplication, placement or licence judgement; Semgrep's free engine reads one file at a time) |
| Clean code: small functions | Ruff `C901`, `PLR0912`, `PLR0913`, `PLR0915`; `make` `clean-code` |
| Clean code: no magic strings | Ruff `PLR2004` |
| Clean code: names, nesting, DRY; SOLID: all five | review only |
| Checklist 3 (no network outside container and e2e tests) | Semgrep `mfy-test-network-call` |
| Checklist 7 (RDF compared as graphs) | Semgrep `mfy-test-rdf-string-compare` |
| Checklist 11 (one assert per idea) | Ruff `PT018` (partial: the message on each assert is reviewed) |
| Checklist 12 (no real sleeps) | Semgrep `mfy-test-real-sleep` |
| Checklist 1, 2, 4, 5, 6, 8, 9, 10, 13, 14, 15, 16 | review only |

Reasons for the review-only rows (the text after "because"):

| Rows | Reason |
|---|---|
| `PR-SURVEY-FIRST` | it is a working step that leaves no trace in the code |
| `PR-SSOT-DRY`, `PR-REUSE-COMPACT`, `AP-DUP-CONST`, `AP-DUP-VALIDATION`, clean code: DRY | duplication across files needs a reader |
| `BP-VALIDATE-AT-BOUNDARY`, `AP-LOGIC-IN-EDGES`, `AP-MISPLACED-SHARED-INFRA`, `BP-CONSTANTS-HOME` | where a rule or a helper belongs is a judgement on meaning |
| `BP-IDIOMATIC-SMALL`, `AP-VERBATIM-EXTERNAL` | the origin and licence of code are not visible in its shape |
| `AP-OVER-FRAGMENTATION`, `AP-PARALLEL-LAYOUTS` | whether files form one concern or one layout needs the component names |
| Clean code: names | a tool checks the case of a name, not what it reveals |
| Clean code: nesting | Ruff's nesting rule is preview-only; `C901` bounds complexity |
| SOLID: SRP, OCP, LSP, ISP, DIP | each is a judgement on responsibilities and contracts |
| Checklist 1, 2, 13 | the test folder layout below the tier is the project's own |
| Checklist 4, 5, 6 | which double or builder fits is a choice between correct options |
| Checklist 8, 9, 16 | whether every rule or example has its case needs the rule table |
| Checklist 10 | whether an invariant exists is a design judgement; the tester's report lists the properties |
| Checklist 14 | a flaky test shows only across runs |
| Checklist 15 | traceability is checked by reading, in the `bdd-gherkin` traceability check |

The `AP-IO-IN-MODELS` contract, added to `dot-importlinter.tmpl` in stage 1 (the catalogue says
`models/`; the scaffold's layer is `domain`, the divergence `decisions.md` D7 records):

```ini
[importlinter]
root_package = <<PACKAGE>>
include_external_packages = True

[importlinter:contract:domain-no-io]
name = The domain layer does no I/O (cosmic-python:AP-IO-IN-MODELS)
type = forbidden
source_modules =
    <<PACKAGE>>.domain
forbidden_modules =
    requests
    httpx
    urllib3
    aiohttp
    sqlalchemy
    psycopg
    pymongo
    redis
    boto3
    SPARQLWrapper
    fastapi
    flask
```

A project adds its own I/O packages to the list.

That is eight Meaningfy Semgrep rules: five gating in `rules/` (`sparql-built-from-strings`,
`exception-outside-exceptions-module`, `test-network-call`, `test-rdf-string-compare`,
`test-real-sleep`), two in `report-only/` (`dict-as-model`, `free-string-key`) and one in
`suppressions/` (D-6). A report-only rule moves to `rules/` by a pull request the owner approves,
after its findings on one real project have been read. In a "Checked by" value a report-only rule
is written `(partial: report-only)`.

What each rule flags, the near miss its fixture must leave alone, and its path scope (the SPARQL
rule is the worked example below):

| Rule | Bad case (`ruleid:`) | Near miss (`ok:`) | `paths` |
|---|---|---|---|
| `mfy-exception-outside-exceptions-module` | `class GraphStoreError(Exception):` in `graph_store.py` | The same class in `exceptions.py`; a class whose base is not an exception | Exclude `**/exceptions.py`, `**/tests/**` |
| `mfy-test-network-call` | A call to `requests.<method>`, `httpx.<method>` or `urllib.request.urlopen` | The same call under `tests/integration/` or `tests/e2e/`; `fake_client.get(url)` | Include `**/tests/unit/**`, `**/tests/feature/**` |
| `mfy-test-rdf-string-compare` | `assert g.serialize(format="turtle") == expected` | `assert isomorphic(g, expected)`; `assert len(g.serialize()) > 0` | Include `**/tests/**` |
| `mfy-test-real-sleep` | `time.sleep(1)`; `await asyncio.sleep(1)` | A call of an injected `sleep(1)` parameter; `await asyncio.sleep(0)` | Include `**/tests/**` |
| `mfy-dict-as-model` (report-only) | `return {"uid": uid, "dataset_name": name}, 200`; `return {"a": x, "b": y}` | `return {}`; `return Model(**row)`; a dict literal passed as an argument | Include `**/entrypoints/**`, `**/services/**` |
| `mfy-free-string-key` (report-only) | `row["status"]`; `hasattr(obj, "name")`; `getattr(obj, "name")` | `row[STATUS]`; `row[0]`; `getattr(obj, attr)` | Exclude `**/adapters/**`, `**/tests/**` |

A path-scoped rule also includes its own fixture file name (tool facts).

### D-4 Fetch and tools in a project

One pin, `QUALITY_VERSION`, in `Makefile.tmpl`. `make bundles` writes `v` + the root `VERSION` into
that line, as it does for its three other rendered files; the version-sync gate covers it and
`validate.yml`'s `git diff --exit-code` path list gains the file. A project raises the pin by hand.
The variable takes any git ref, which lets a sample project point at a merge commit before the
release exists. Between a stage's merge and its release the pin on `develop` names a tag without
that stage's `quality/` content; installs come from `releases` only, so only a scaffold made from a
checkout meets this, and it sets the ref by hand (task 1.15 does).

```make
QUALITY_VERSION   = v3.15.0
QUALITY_DIR       = $(REPO_ROOT)/.quality
SEMGREP_VERSION   = 1.185.0
LS_LINT_VERSION   = 2.3.2
CHECKMAKE_VERSION = 0.3.2

quality-fetch: ## Fetch the shared checks at the pinned skillery release
	@ if [ "$$(cat $(QUALITY_DIR)/.version 2>/dev/null)" != "$(QUALITY_VERSION)" ]; then \
	    tmp=$$(mktemp -d) && \
	    curl -fsSL https://github.com/meaningfy-ws/skillery/archive/$(QUALITY_VERSION).tar.gz \
	      | tar -xz -C $$tmp --strip-components=1 && \
	    test -d $$tmp/quality || { echo "$(ICON_ERROR) no quality/ at $(QUALITY_VERSION)"; rm -rf $$tmp; exit 1; } ; \
	    rm -rf $(QUALITY_DIR) && mv $$tmp/quality $(QUALITY_DIR) && rm -rf $$tmp && \
	    echo "$(QUALITY_VERSION)" > $(QUALITY_DIR)/.version ; fi
```

The template's `SHELL` already sets `pipefail`, so a failed download fails the recipe and an
existing `.quality/` is left as it was; `.version` is written last, so an interrupted run is
retried in full. No GNU-only `tar` flag is used. The recipe was run on 2026-11-14: a bad pin, a ref
without `quality/`, a rerun and an old folder all behaved as stated.

`make quality-tools` (depends on `quality-fetch`) installs into `.quality/`: Semgrep in its own
virtual environment (`python3 -m venv .quality/venv`, `pip install semgrep==$(SEMGREP_VERSION)`),
so its dependencies never meet the project's; the ls-lint and checkmake release binaries for the
machine's OS and architecture into `.quality/bin/`, each verified with `shasum -a 256 -c` against
`scripts/quality/tools.sha256` before it is made executable. The binaries come from the tools'
GitHub releases: `https://github.com/loeffel-io/ls-lint/releases/download/v$(LS_LINT_VERSION)/ls-lint-<os>-<arch>`
and `https://github.com/checkmake/checkmake/releases/download/v$(CHECKMAKE_VERSION)/checkmake-v$(CHECKMAKE_VERSION).<os>.<arch>`
(the `linux`/`amd64` names were run; the builder reads the other three asset names from the release
pages when writing the checksums). `uname -s` gives the OS in lower case; `uname -m` maps
`x86_64` to `amd64` and `aarch64` or `arm64` to `arm64`. Each binary is saved under a name that
carries tool, version, OS and architecture, and `tools.sha256` holds one `shasum` line per saved
name, for example `<64 hex>  ls-lint-2.3.2-linux-amd64`; `quality-tools` checks the one line of
the machine's platform and fails when there is none. The three tool versions are Makefile variables beside the pin, and the checksum file
sits in the same project (D-1), so a project moves a tool's version and its checksums in one commit.
After the installs `quality-tools` runs `python3 scripts/quality/external_sources.py fetch` (D-7). `.quality/` joins `dot-gitignore`. Hypothesis and
Schemathesis are pinned in the `test` group of `pyproject.toml.tmpl` (stage 2); mutmut in stage 3
(D-10).

CI (`ci.yaml.tmpl`): one `actions/cache` step on `.quality/`, keyed by the hash of `Makefile` and
`scripts/quality/tools.sha256`, then one step per new target (`make check-semgrep`,
`make check-layout`, `make check-makefile`) after the architecture step, in the template's
one-target-per-step style (`project-setup` D12).

`scaffold.sh` gains the render lines for the four D-1 templates and, in stage 3, the weekly
workflow (code archetypes only); `config-files.md`'s template table lists them.

### D-5 The checks a project runs

`check-quality` becomes `lint typecheck check-architecture check-semgrep check-layout
check-makefile`; `check-semgrep`, `check-layout` and `check-makefile` depend on `quality-tools`.

| Target | Command (abridged) | Fails on |
|---|---|---|
| `check-semgrep` | Pass 1: `semgrep scan --config .quality/semgrep/rules $(external gate paths) --error --metrics=off --quiet $(PACKAGE_NAME) $(TEST_PATH)`. Pass 2: the same with `--config .quality/semgrep/suppressions --disable-nosem`. Pass 3, without `--error`: `.quality/semgrep/report-only` and the external report-only paths | A finding of pass 1 or 2 |
| `check-layout` | `ls-lint --config .quality/ls-lint/python-project.yml`, then `test -f` for each required file | A banned file name; a missing required file |
| `check-makefile` | `checkmake --config .quality/checkmake/python-project.ini Makefile` | A missing or non-phony required target; a checkmake rule |
| `check-architecture` | `lint-imports`, then `python3 scripts/quality/check_contracts.py .importlinter` (D-11) | A contract; an uncovered package; an undecided ignore |

- **DEC-8 as narrowed by the developer (Q-24).** ls-lint does one thing: no `.py` file is named
  `utils`, `helpers`, `port`, `factory`, `manager` or `errors`, anywhere but in `.quality`, `.venv`,
  `mutants` and `node_modules`. Snake-case names stay with Ruff `N999` (selected through `N`).
  Folder names are not checked.
- **Required files** are four `test -f` lines in the `check-layout` recipe, each printing the
  missing path: `$(PACKAGE_NAME)/__init__.py`, `tests/conftest.py`, `ruff.toml`, `.importlinter`.
- **Required targets** (shared `checkmake` file): `install`, `lint`, `typecheck`,
  `check-architecture`, `check-quality`, `check-all`, `test`, `test-unit`, `quality-fetch`,
  `clean`. A skillery test fails when one of them is missing from `Makefile.tmpl`. The shared file
  sets `maxbodylength` to 15 lines, the longest recipe the template needs, and the README says why.

### D-6 Suppressions carry a reason

`quality/semgrep/suppressions/mfy-suppression-without-reason.yaml` (`languages: [generic]`) flags a
`# nosemgrep` comment that has no ` -- <reason>` and a `# noqa` comment that has no ` -- <reason>`.
It runs in its own pass with `--disable-nosem`, because a bare `# nosemgrep` would otherwise
suppress the rule that looks for it. The convention is stated once, in
`project-setup/references/config-files.md` under a new heading *Suppressions*, which the rule's
message cites (D-3). The rule sits outside `rules/` and `report-only/`, so the "a rule nothing
names" check of D-3 does not apply to it.

### D-7 External sources

`quality/semgrep/external.json` is a list of entries:

```json
{ "id": "semgrep-rules-python-requests", "repo": "https://github.com/semgrep/semgrep-rules",
  "commit": "<40 hex>", "paths": ["python/requests/security"], "licence": "Semgrep Rules License v1.0",
  "why": "…", "mode": "report-only" }
```

`mode` is `report-only` or `gate`. `scripts/quality/external_sources.py` reads
`.quality/semgrep/external.json` and has two commands:

| Command | Does | Output |
|---|---|---|
| `external_sources.py fetch` | For each entry whose folder `.quality/external/<id>/` is absent: downloads `<repo>/archive/<commit>.tar.gz`, unpacks it whole into a temporary folder and moves it into place | One line per source fetched; exit 1 on a failed download, leaving no folder for that source |
| `external_sources.py paths gate` (or `report-only`) | Nothing on disk | On one line, `--config .quality/external/<id>/<path>` for every path of every entry of that mode; an empty line when there is none |

`check-semgrep` takes its `$(external gate paths)` from
`$$(python3 scripts/quality/external_sources.py paths gate)` and skips pass 3's external part when
the `report-only` line is empty. The stage PR proposes at most five candidate sources, each with its licence and
reason; the owner approves each in the review and unapproved ones are removed before merge, so the
manifest may ship as an empty list. Raising a `commit` is a new approval (DEC-13).
`tests/test_quality.py` checks every field, the 40-character commit and the mode; that a new entry
starts `report-only` is a review finding, not a test (a test cannot see the base branch).

### D-8 skillery's own tests of `quality/` (DEC-12)

All in `tests/test_quality.py`, fixtures under `tests/fixtures/quality/`. The script templates are
loaded from `skills/project-setup/assets/templates/quality/` by path.

| Group | Needs | In CI |
|---|---|---|
| Fixture presence and marks, id prefix, message form (D-3), manifest fields, allowed files, "Checked by" (D-3), required targets exist in `Makefile.tmpl`, the three scripts' unit tests | Python only | Runs |
| The Ruff fixtures: each bad case flagged by its code, `good.py` silent | Ruff | Skips: "ruff not on PATH" |
| `semgrep scan --test` on the three rule folders | Semgrep | Skips: "semgrep not on PATH" |
| The shared ls-lint file on a good and a bad tree | ls-lint | Skips: "ls-lint not on PATH" |
| The shared checkmake file on the rendered `Makefile.tmpl` and on one with `test` removed | checkmake | Skips: "checkmake not on PATH" |
| Property tests of the scripts (D-13, proof 2) | Hypothesis | Skips through `pytest.importorskip("hypothesis")` |

The skip follows `tests/test_formal_reasoning.py` (`pytest.mark.skipif(shutil.which(...) is None)`).
Semgrep, Ruff and Hypothesis are installed locally from a new `requirements-quality.txt` that
`make install` reads and no workflow does (`plugin-eval.yml` installs `requirements-dev.txt`, so
they must not go there). `CONTRIBUTING.md` says how to install the two binaries.
`dependencies.yaml` gains entries for Semgrep, ls-lint, checkmake, mutmut, Hypothesis and
Schemathesis (kind, source, pin, used by `project-setup`'s templates and `quality/`), and
`make skill-inventory` regenerates the dependency tables that follow from it.

### D-9 The tester (stage 2)

- **Range:** `reviews.MEDIUM.tester` becomes `"Adversarial tester"` in
  `epic-delivery.workflow.json`; no other field of the file changes, and A's `criteria` fields are
  kept as found [A].
- **Brief** (`team-and-briefs.md`), replacing the current one:

  > **Goal:** break the behaviour of stage `<s>` of `<id>`, in the adversary stance of
  > `test-strategy` (`ROB`, `ADQ`). Write tests only, never production code. **Method:** state the
  > properties the stage must hold, taken from the PLAN's error matrix and the stage's spec
  > scenarios; test each by the methods of the testing checklist, item 10 (`cosmic-python`). Where
  > the stage changed no Python code, say so and test edge cases, bad input, failures and limits by
  > hand. **Read:** the stage's tasks, scenarios and diff range. **Standing rules:** as for the
  > builder. **Report:** base report + a table of properties (property, test, result) + each
  > failing test with what it shows + Upstream findings.

- **Technique** (DEC-14): checklist item 10 is extended, in `cosmic-python`, with: which invariants
  to look for (round trip, order independence, bounds, idempotence); a stateful test
  (`RuleBasedStateMachine`) for an object whose behaviour depends on the order of calls;
  Schemathesis (`schema.parametrize()`, `case.call_and_validate()`) where the project has an
  OpenAPI contract; CI runs under Hypothesis's built-in `ci` profile. `example-testing-patterns.md`
  gains one worked stateful test and one Schemathesis test.
- **Other statements of the range** are repointed, not restated:
  `docs/practice/ai-coding/working-with-agents.md` (line 44, "Larger EPICs add an adversarial
  tester") and [`tests/features/epic-delivery.feature`](../../../tests/features/epic-delivery.feature)
  (the MEDIUM row, line 21, and four new scenarios, one per scenario of the spec requirement *The
  adversarial tester works by stated methods*: a parser stage, a stage with an OpenAPI contract, a
  report without properties, a stage without Python). `stage-loop.md`'s worked examples are a
  SMALL and a LARGE one and stay true.
- **Report check:** the lead returns a Python-stage report without a properties table as
  incomplete; the tester's row in `stage-loop.md`'s check ledger (line 136) says so.

### D-10 The weekly mutation report (stage 3)

- **Lock first.** mutmut 3.8.1 and the template's `linkml==1.10.0` do not lock together (`click`).
  Task 3.6 starts by raising the `linkml` pin to its newest release and running `poetry lock` on a
  scaffold; if that still fails, it takes the newest mutmut 3.x that locks; if none does, it stops
  and brings the choice to the developer.
- **Config:** `[tool.mutmut]` in `pyproject.toml.tmpl` with `source_paths = ["<<PACKAGE>>"]` and
  `pytest_add_cli_args_test_selection = ["tests/unit", "tests/feature"]`. mutmut reads only
  `pyproject.toml` or `setup.cfg`, so this is a recorded exception to `project-setup` D2 (tool
  configuration in dedicated files), noted in `decisions.md`.
- **Target `mutation-report`** (CI on Linux is its home; stock macOS has no `timeout`, and
  `layout.md` says so):

  ```make
  mutation-report: ## Weekly mutation run (CI): write the survivors to tests/mutmut-results/
  	@ timeout $(MUTATION_BUDGET) poetry run mutmut run; rc=$$?; \
  	  [ $$rc -eq 0 ] || [ $$rc -eq 124 ] || exit $$rc; \
  	  poetry run mutmut export-cicd-stats && \
  	  poetry run python scripts/quality/mutation_report.py tests/mutmut-results $$([ $$rc -eq 124 ] && echo --incomplete)
  ```

  `MUTATION_BUDGET` defaults to `150m`.
- **`mutation_report.py`** runs `mutmut results` and `mutmut show <name>` as subprocesses (the
  tests replace the runner with canned text), takes as survivors the lines ending `: survived`,
  reads `mutants/mutmut-cicd-stats.json` and writes:
  `survivors.txt` (one survivor per line, sorted); `diffs/<mutant>.diff` from `mutmut show` for the
  first 200 survivors; `README.md` with the counts, the line "incomplete: the time budget was
  reached" when `--incomplete` is given, and the pick-up rule of DEC-10. It writes no date, no
  commit and no version, so the same survivors give the same files whatever `develop` did. With no
  survivor it removes the folder's content. It prints the commit and the mutmut version to standard
  output for the pull request's body.
- **Target `mutation-pr`** holds the git and `gh` steps, so the workflow stays thin (D12). It
  stops when the results equal what is already delivered: `git status --porcelain
  tests/mutmut-results` is empty (same as the default branch), or the branch `bot/mutmut-results`
  exists on the remote and `git diff --quiet origin/bot/mutmut-results -- tests/mutmut-results`
  succeeds (same as the open pull request). Otherwise it commits as `github-actions[bot]` (the
  identity `releases.yml` uses) to `bot/mutmut-results`, force-pushes it and, with `gh` (the
  workflow sets `GH_TOKEN: ${{ github.token }}`), edits the open pull request of that branch or
  creates one into the default branch. When the results equal the default branch while an older
  bot pull request is still open, that pull request is left for the person who picks it up
  (DEC-10); the target does not close it.
- **Workflow** `ci/mutation.yml.tmpl`: `schedule` (Monday 03:00 UTC) and `workflow_dispatch`;
  `permissions: contents: write, pull-requests: write`; `concurrency: mutation` without cancel;
  job `timeout-minutes: 180`; checks out `<<DEFAULT_BRANCH>>`; restores `mutants/` from
  `actions/cache`; `make install`, `make mutation-report`, `make mutation-pr`. No step fails on
  survivors. `mutants/` joins `dot-gitignore`.
- **Setup note** in `ci-and-infra.md`: turn on "Allow GitHub Actions to create and approve pull
  requests"; a person approves the bot pull request's CI run.

### D-11 The import-contract check (stage 3)

- **Coverage is import-linter's own.** `dot-importlinter.tmpl` moves to the container form, listing
  everything `scaffold.sh` creates at the package's top level:

  ```ini
  [importlinter:contract:layers]
  name = Cosmic-python layers
  type = layers
  containers = <<PACKAGE>>
  exhaustive = true
  layers =
      (__main__)
      (entrypoints)
      (services)
      (adapters)
      (domain)
      (commons)
  ```

  `commons` is the lowest layer: every layer may import it and it imports none. A top-level module
  a project adds (`exceptions.py`, `config.py`) is listed as a layer or in `exhaustive_ignores`
  with a decision comment. The commented multi-component block is rewritten the same way (tiers as
  layers of the root container). The import-linter pin moves to the version the builder verifies
  `exhaustive` with (2.16 or later).
- **`check_contracts.py`** (reads the raw lines of `.importlinter`) fails when: no `layers`
  contract has `exhaustive = true` with the root package among its `containers`; or an entry of
  `ignore_imports` or `exhaustive_ignores` has no comment line directly above it matching
  `\b(DEC|D|ADR)-\d+\b`. It prints `file:line: entry: reason` per failure and exits 1; a missing
  file exits 2.
- **Verified on the scaffold:** task 3.3 scaffolds the product and library archetypes and runs
  `make check-architecture` on each skeleton, green.
- **Per EPIC:** the L3 lens text in `meaningfy-code-review` gains the contract judgement (the
  `pr-review-modes` delta); `epic-delivery`'s reviewer brief and ledger name the moment (the last
  build stage); `architecture-guardrails.md` § grooming points to both and drops "periodically".
  Its proof is three scenarios in `tests/features/agents/code-reviewer.feature`, one per scenario
  of the spec requirement (the last build stage, an earlier stage, a repository without
  `.importlinter`); skillery has no import contracts, so this EPIC's own review cannot show it.

### D-12 What depends on EPIC A

B's delivery starts when A is merged (DEC-14). Each stage opens with a task that re-checks this list
against A as merged:

| # | Assumed from A's PLAN | Used by |
|---|---|---|
| A-1 | `skills/test-strategy/references/inventory.md` and `software.md` exist with the D-2 columns; a `gap` row names its EPIC | Tasks 1.14, 2.6, 3.7; the "gap left behind" test |
| A-2 | Next free `CHK-<n>`; the draft's software ids (`CHK-19`, `CHK-28`, `CHK-31`, `CHK-40`) may be renumbered | The new inventory rows |
| A-3 | Which software rows A marked `gap` for B | Rows to flip to `exists` |
| A-4 | `tests/test_test_strategy.py` fails on an uncited id and on its one-home patterns (`polyfactory`, `red…green`, `(verification\|validation) asks`) | New text in `cosmic-python`, `project-setup`, `epic-delivery` avoids them |
| A-5 | Checklist item 6 as A's DEC-9 rewrote it | Its "Checked by" value |
| A-6 | Stance and question ids (`adversary`, `ROB`, `ADQ`, `VER`) | The tester brief; the rows |
| A-7 | Every phase of `epic-delivery.workflow.json` has `criteria` | D-9 edits one field only |
| A-8 | The pointer line of A's D-8 in `cosmic-python`, `project-setup`, `epic-delivery`, `meaningfy-code-review` | Extended with the new question ids where a row was added |

New inventory rows [A]: the wider Ruff selection (`VER`); the Meaningfy Semgrep rules (`VER`); the
ls-lint and checkmake checks (`VER`); the weekly mutation report (`ADQ`); the import-contract check
(`VER`). Changed rows: the tester (`ROB`, now MEDIUM up, with methods); property-based tests
(`ROB`, with stateful tests and Schemathesis); L3 (`VER`, with the per-EPIC judgement). Owners per
DEC-14: `cosmic-python` (rules and techniques), `project-setup` (wiring), `epic-delivery` (the
brief and the moment).

### D-13 Definition of Done items

| Item | Where |
|---|---|
| Failure case | `evidence/failure-case.md`: the method-less tester (Q-2), and one antipattern that passed review unflagged, taken from a past PR |
| Docs | `governance.md` (six types), `AGENTS.md` (line 11 and the type table; "four rendered files"), `CLAUDE.md` (line 4), a new `docs/development/quality.md` (how to add a rule, a source, a tool; registered for `doc_register_complete`), `README.md` row, one `CHANGELOG.md` line per stage |
| `project-setup` references | `config-files.md` (Ruff, *Suppressions*, the template table), `decisions.md` (D4 selection, the mutmut exception), `ci-and-infra.md` (cache, the three steps, the weekly workflow, the setting), `architecture-guardrails.md`, `layout.md` (`.quality/`, `scripts/quality/`, `tests/mutmut-results/`), `checklists.md` |
| Existing projects | `modernizing-existing-projects.md`, a section *Adopting the shared checks*: one target per pull request, in the order Ruff (the four steps below this table), `check-makefile`, `check-layout` (rename the banned files first), `check-semgrep`, then the import contracts (move to the container form; give each existing `ignore_imports` entry its decision comment, with a new ADR where none exists). A target joins `check-quality` in the pull request that makes it green. Upgrading: copy the newer `scripts/quality/` templates |
| Register | `dependencies.yaml` (D-8) |
| Gherkin | `tests/features/epic-delivery.feature` (D-9); `tests/features/agents/code-reviewer.feature` (D-11) |
| Generated files | `make bundles`, `make skill-inventory` after every skill edit |
| Scenario sign-off | The developer signs off this change's spec scenarios when accepting the gated PLAN, recorded in `evidence/acceptance.md` |
| Proof 1 (DEC-15) | `tests/test_quality.py` green |
| Proof 2 | `evidence/tester-report.md`: stage 3's tester report with its properties table. The stage 3 lead briefs the tester with the brief text read from the repository (stage 2 is merged; the installed skill may be older). The tester's property tests target `check_contracts.py` and `mutation_report.py` and are guarded by `importorskip` (D-8) |
| Proof 3 | `evidence/sample-project.md`: the bot pull request's URL and the output of a failing and a passing `make check-architecture`. The sample repository is chosen by the developer at stage 3 (Q-22): the stage 3 lead asks before task 3.8, with the recommendation "a new private scratch repository scaffolded by `project-setup`, archived afterwards" |
| Acceptance demo | Mandatory at VERY LARGE: the three proofs shown to the developer, verdict in `evidence/acceptance.md` |

**Adopting the wider Ruff selection in an existing project** (the proposal's rabbit-hole; written
into the section *Adopting the shared checks*):

1. Add the new codes in three pull requests, quietest first: `S113`, `DTZ`, `BLE001`; then
   `PT018`, `TID251`; then `PLR0912`, `PLR0913`, `PLR0915`, `PLR2004`.
2. In each, run `ruff check --statistics` and fix the findings.
3. Where one code has more than 50 findings, list the files that still fail under that code in
   `[lint.per-file-ignores]` of `ruff.toml`, with a comment line above naming the issue that tracks
   their clean-up; remove a file from the list when it is clean.
4. Never use `ruff check --add-noqa`: it writes `# noqa` comments without a reason, which the
   suppression rule of D-6 then fails.

## Algorithm / approach

**Three stages, each its own PR into `develop`, each releasable.**

| Stage | Delivers | Proof |
|---|---|---|
| 1 | `quality/` and the Check type; the Ruff selection; the eight Semgrep rules; "Checked by"; fetch, tools and the three new `make` targets; ls-lint and checkmake | DEC-15 (1) |
| 2 | The tester's range, brief and report; checklist item 10 | DEC-15 (2), recorded in stage 3 |
| 3 | The weekly mutation report; the import-contract check; the L3 judgement | DEC-15 (3) |

Within a stage the order is test first: the failing test or fixture, then the artifact. Every
template change is run on a real scaffold before the stage's PR (IT-04, IT-06, task 3.3): the
attack showed that facts true on toy fixtures failed on the skeleton.

**Worked example: one gating rule and its fixture.**

`quality/semgrep/rules/mfy-sparql-built-from-strings.yaml`:

```yaml
rules:
  - id: mfy-sparql-built-from-strings
    languages: [python]
    severity: ERROR
    message: "SPARQL built from strings (cosmic-python:AP-SPARQL-FROM-STRINGS). Bind values through the store's query API."
    patterns:
      - pattern-either:
          - pattern: f"...{$X}..."
          - pattern: $A + $B
          - pattern: $A % $B
          - pattern: $A.format(...)
      - pattern-regex: (?is)\b(select|ask|construct|describe|insert\s+data|delete\s+(data|where))\b.*\{
```

`quality/semgrep/rules/mfy-sparql-built-from-strings.py`:

```python
def bad(name):
    # ruleid: mfy-sparql-built-from-strings
    return f"SELECT ?s WHERE {{ ?s rdfs:label '{name}' }}"

QUERY = "SELECT ?s WHERE { ?s a ex:Thing }"

def good():
    # ok: mfy-sparql-built-from-strings
    return QUERY

def also_good(d, name):
    # ok: mfy-sparql-built-from-strings
    return f"please select one of {d} or ask {{name}}"
```

The pattern above is a first draft and fails the third case (it flags the English sentence); the
builder tightens it until all three hold, for example by requiring a `?variable` or `WHERE`. A
gating rule's fixture always holds a near miss of this kind. A rule scoped by path
(`mfy-test-real-sleep`, `paths: include: ["**/tests/**", "**/mfy-test-real-sleep.py"]`) lists its
own fixture.

**Worked example: an ignored import.**

```ini
ignore_imports =
    ; ADR-7 legacy bridge, removed with the loader rewrite
    mypkg.loader.services -> mypkg.api.adapters
    mypkg.loader.services -> mypkg.api.models
```

`check_contracts.py` prints `.importlinter:14: mypkg.loader.services -> mypkg.api.models: no
decision comment on the line above` and exits 1: each entry needs its own line.

**Test specifications.** Unit tests in `tests/test_quality.py` unless named otherwise.

| Id | Under test | Input | Expected | Edge cases |
|---|---|---|---|---|
| TC-01 | `top_level_folders` | a repo with `quality/` | no finding | `quality` as a file; `Quality/` |
| TC-02 | `quality_files` lint | `quality/semgrep/notes.md` | names the file | `quality/README.md` passes; a nested `README.md` fails; a `.py` with no rule of its name fails; `__pycache__` is skipped; a rule or configuration file that `quality/README.md` does not name fails |
| TC-03 | Fixture presence and message form | `x.yaml` without `x.py` | names `x` | fixture with `ruleid:` only; with `ok:` only; rule id not `mfy-`; message with none of the three D-3 forms |
| TC-04 | "Checked by" parser | each of the three shapes | parsed value | empty cell; `review only` without reason; `review only` joined to a tool; two tools; `(partial: …)`; a `make` target |
| TC-05 | "Checked by" cross-check | a value naming `mfy-x` with no rule file; a rule in `rules/` no value names | names entry and id | the `suppressions/` rule is not required to be named; a Ruff family covering a code; a code not selected; a `make` target not in the template |
| TC-06 | Manifest check | entries with one field wrong each | names the entry and field | empty list; `commit` of 39 characters; unknown `mode` |
| TC-07 | `check_contracts.py` | `.importlinter` fixtures | exit code and `file:line` messages | no exhaustive root contract; comment two lines above; inline comment; `exhaustive_ignores` entry; file with no `ignore_imports`; missing file (exit 2, message) |
| TC-08 | `mutation_report.py` | canned `mutmut results` text and stats JSON | the three outputs | no survivor (content removed); 201 survivors (200 diffs); `--incomplete`; same survivors with another commit (identical files); stats file missing (exit 1, message) |
| TC-09 | `external_sources.py` | a manifest and a fake download function | fetches the absent source only; prints the paths of the asked mode | empty manifest; a source already present; a failed download (exit 1, nothing left behind) |
| TC-10 | Required targets | `checkmake` file against `Makefile.tmpl` | every required target present and phony | a target renamed in the template |
| TC-11 | Version pin | `Makefile.tmpl` after `make bundles` | `QUALITY_VERSION` equals `v` + `VERSION` | `tests/test_bundle_gen.py`: stale pin fails the gate |
| TC-12 | Gap rows [A] | `software.md` | no `gap` row names this EPIC after stage 3 | skipped with a message until A's file exists |
| TC-13 | Ruff fixtures | `tests/fixtures/quality/ruff/` under the template's selection | each bad case flagged by its code; `good.py` silent | skipped when Ruff is absent |

Integration tests:

| Id | Flow | Setup | Verification |
|---|---|---|---|
| IT-01 | Semgrep rule tests | Semgrep on PATH | `semgrep scan --test` exits 0 for the three rule folders; skipped otherwise |
| IT-02 | ls-lint on trees | ls-lint on PATH; a good tree and one with `pkg/utils.py` and `tests/helpers.py` | exit 0; exit 1 naming both |
| IT-03 | checkmake on the template | checkmake on PATH; `Makefile.tmpl` rendered with a package name | exit 0; exit 1 with `test` removed |
| IT-04 | Scaffold run | The product and the library archetype scaffolded from the stage's branch, `QUALITY_VERSION` set to the branch's commit | `make check-quality` green on each skeleton, and still green after adding the folders `openspec/changes/add-billing-component/` and `tests/mutmut-results/` and after adding only a `dict-as-model` case (printed, exit 0). Red after each of: `utils.py`; an f-string SPARQL query; `requests.get(url)`; `import requests` in `domain`; a bare `# nosemgrep`; `# nosemgrep: mfy-test-real-sleep` without a reason; deleting `ruff.toml`. Recorded in the stage PR |
| IT-05 | Fetch | The same project, after its first fetch | a second `make quality-fetch` offline exits 0; with the pin `v0.0.0` it exits non-zero and `.quality/` is unchanged; in a fresh clone with that pin `.quality/` is absent |
| IT-06 | Weekly workflow and contract check | The sample project (D-13); `poetry lock` succeeds | Three manual dispatches: the first opens the pull request; the second, with nothing changed, pushes nothing; the third, after a test is weakened on the default branch, updates the same pull request. Then a failing and a passing `make check-architecture`. All in `evidence/sample-project.md` |
| IT-07 | Tester report | Stage 3 of this EPIC | `evidence/tester-report.md` |

**Idempotency.** `quality-fetch` and `quality-tools` do nothing when the version file and the tools
are present. `mutation_report.py` is a pure function of the survivors. The weekly workflow
force-pushes one branch and edits one pull request, and runs in one concurrency group, so a re-run
or a manual dispatch cannot open a second one. `make bundles` rewrites the pin to the same value.
All checks are pure reads.

### Anti-patterns

| Don't | Do instead | Why |
|---|---|---|
| Write a Semgrep rule for what a Ruff code flags | Select the Ruff code | DEC-2's order; one tool per rule |
| Put the rule's explanation in the Semgrep `message` | Cite the owner in one of D-3's three forms | DEC-4: the rule text has one home |
| Ship a gating rule whose fixture has no near miss | Mark an `ok:` case that looks close to the bad one | The SPARQL draft flagged an English sentence |
| Add `semgrep` or `hypothesis` to `requirements-dev.txt` | `requirements-quality.txt`, read by `make install` only | `plugin-eval.yml` installs `requirements-dev.txt`; no heavy tool in CI |
| Put a script or a prose page under `quality/` | Scripts are `project-setup` templates; prose is `docs/development/quality.md` | DEC-4 and Q-23 |
| Force a brittle rule to give an entry a tool | `review only, because <reason>` | The proposal's rabbit-hole "ALL of them" |
| Promote a new rule or source straight to gating | Start it in `report-only` | DEC-13: noise makes teams ignore checks |
| Add Semgrep to the project's Poetry groups | Its own environment under `.quality/venv` | Semgrep pins many dependencies |
| Use ls-lint for snake case, folder names or required files | Ruff `N999`; `test -f` lines | It cannot combine rules, and it fails on `.github` and kebab-case folders |
| Put an inline comment after an `ignore_imports` entry | A comment line directly above it | The INI parser makes an inline comment part of the entry |
| Let the weekly workflow run on `pull_request` or fail on survivors | `schedule` and `workflow_dispatch` only; exit 0 | DEC-10 |
| Write a date or a commit into `tests/mutmut-results/` | Put them in the pull request's body | They make every run a new diff |
| Verify a template change on a toy fixture only | Scaffold a project and run the target | Four attack findings were of this kind |
| Move or delete `inputs/ruff-probe/` | Copy its cases to `tests/fixtures/quality/ruff/` | This file links to it; `broken_links` scans `openspec/changes/` |
| Restate the tester's methods in the brief | Point to checklist item 10 | DEC-14 |
| Edit other fields of `epic-delivery.workflow.json` | Change `reviews.MEDIUM.tester` only | A's `criteria` live in the same file |

## Error matrix

| Failure mode | How it is detected | Expected handling |
|---|---|---|
| A is not merged when a stage starts | The stage's first task (D-12) | Stop; B does not start before A |
| A's matrix differs from D-12's assumptions | The same task | Adjust the rows and ids to A as merged; a difference that changes a `DEC-` goes to the developer |
| A catalogue entry, item or bullet without a value; an unparsable value | TC-04 in `make validate` | Write the value; the test names the entry |
| A value names a missing Semgrep rule, an unselected Ruff code or a missing `make` target; a rule nothing names | TC-05 | Add the rule, the code or the target, or correct the value |
| A rule without a fixture, a fixture without both marks, a message without an owner | TC-03, in CI too | Add what is missing |
| A rule no longer matches its fixture | IT-01, local only | Fix the rule; CI cannot catch this (RISK-3) |
| A first-assignment row cannot be made to work as a rule | The builder's fixture stays red or flags the `ok:` case | Record `review only, because …` with the reason; tell the lead |
| A file that is not a check under `quality/` | TC-02 | Move prose to `docs/development/quality.md`, a script to the templates |
| Ruff, Semgrep, ls-lint, checkmake or Hypothesis missing on a skillery machine or in CI | `skipif`, `importorskip` | Skip with the tool's name; never fail |
| A new template is not rendered into the project | IT-04: the target fails on a missing `scripts/quality/` file | Add the `render` line to `scaffold.sh` |
| checkmake's built-in rules fire on `Makefile.tmpl` | IT-03 | Shorten the recipe, or raise the limit in the shared file and say why in the README |
| `quality-fetch`: no network, a missing ref, a ref without `quality/` | `curl -f` with `pipefail`; the `test -d` | Exit non-zero naming the pin; an existing `.quality/` is unchanged |
| `quality-fetch` interrupted | `.version` absent or old on the next run | Full retry |
| A downloaded binary does not match `tools.sha256` | `shasum -c` | Delete the file, exit non-zero naming the tool and version |
| An OS or architecture with no checksum listed | `quality-tools` | Exit non-zero naming the platform; `layout.md` lists the supported four (linux and darwin, amd64 and arm64) |
| Semgrep cannot be installed on the machine's Python | `pip` in `quality-tools` | Exit non-zero with pip's message; RISK-5 |
| A gating rule is too noisy on a real project | Findings in `check-semgrep` | Suppress with a reason, and open an issue on skillery (`skillery-feedback`); the fix is to tune the rule or move it to `report-only` |
| A suppression without a reason, bare `# nosemgrep` included | Pass 2 of `check-semgrep` | Add the reason |
| The shared checks flood an existing project | The first run of each target | The adoption order of D-13: one target per pull request |
| An external source disappears, or its licence changes at a new commit | `external_sources.py` exits 1; the review of a commit bump | The pinned commit keeps working while the repository exists; remove or replace the entry by PR |
| A tester report on a Python stage without the properties table | The lead reads it (D-9) | Return it as incomplete |
| The tester is dispatched on a stage without Python | The brief | It says so and tests by hand |
| A MEDIUM EPIC's lead skips the tester | The checker reads the review set | A finding |
| The tester's property tests fail on import in skillery's CI | CI is red on `hypothesis` | `pytest.importorskip("hypothesis")` at the top of the test module |
| mutmut does not lock with the template's pins | `poetry lock` in task 3.6 | D-10's order: raise `linkml`, else an older mutmut, else ask |
| mutmut reaches the budget | `timeout` exits 124 | Results delivered with `--incomplete`; the next run resumes from the cached `mutants/` |
| mutmut crashes or the suite is red on the default branch | `mutmut run` exits with another code | The step fails and no PR is opened; the run is not a build, so DEC-10 holds |
| The bot cannot create the pull request | `gh pr create` fails with a permission error | The step fails with a line pointing to the setup note (D-10) |
| The bot PR's CI waits for approval | GitHub shows the run as waiting | A person approves it; stated in the setup note |
| Two weekly runs overlap | The `concurrency` group | The later one waits |
| `lint-imports` fails on a top-level module no layer lists | The contract's own message, naming the module | List it as a layer, or in `exhaustive_ignores` with a decision comment |
| `.importlinter` is missing | `check_contracts.py` exits 2 with a message | `check-layout` and `lint-imports` already fail on it |
| The pin in `Makefile.tmpl` is stale after a version bump | The version-sync gate (TC-11); `validate.yml`'s diff | `make bundles` |
| A changed skill passes 650 lines | `skill_too_long` | Move detail to a reference |
| An edited skill's bundle copy is stale | `bundle_gates` | `make bundles` |

## Risks / Trade-offs

- **RISK-1** External sources change or relicense (DEC-13). Likelihood medium, impact medium.
  Mitigated: commit pins, a licence per entry, a new approval on every bump.
- **RISK-2** Noise makes teams ignore the checks (DEC-13). Likelihood high for the two
  free-string rules, impact high. Mitigated: they ship report-only; five gating rules only, each
  with a near-miss fixture; suppressions need a reason; the adoption order of D-13.
- **RISK-3** A rule rots unseen, because skillery's CI never runs Semgrep (DEC-12). Likelihood low,
  impact medium. Accepted with DEC-12; the local `make validate` before each PR and IT-04 at each
  stage catch it.
- **RISK-4** Nobody picks up the mutation results (DEC-13). Accepted by the owner (Q-11).
- **RISK-5** A tool does not support a project's platform or Python (Semgrep on a new Python,
  mutmut without `fork`, no binary for an architecture). Likelihood medium, impact medium.
  Mitigated: pinned versions verified by IT-04 on the template's Python; the error names the tool;
  a project may drop one target from `check-quality` with a recorded decision.
- **RISK-6** A's matrix lands differently from its PLAN. Likelihood medium, impact low. Mitigated:
  D-12 and the first task of each stage.
- **RISK-7** checkmake's `required` key is undocumented and may change. Likelihood low, impact low.
  Mitigated: the pinned version; IT-03 fails on an upgrade that drops it.
- **RISK-8** The tester from MEDIUM up costs one more dispatch per stage (the proposal's BREAKING
  note). Accepted with DEC-9.
- **RISK-9** `S113` misses `requests.Session` calls. Accepted by the developer (Q-21); recorded on
  issue #215.
- **RISK-10** The script copies in projects drift from the templates. Likelihood high over time,
  impact low. Accepted by the developer (Q-23); the modernisation guide names the upgrade.
- **RISK-11** A fact verified on a fixture fails on a real scaffold. Likelihood medium (it happened
  four times in the attack), impact high. Mitigated: every template change is run on a scaffold
  before its stage PR (IT-04, IT-06, task 3.3).
- **Trade-off:** `.quality/` is fetched, not vendored (DEC-5): a fresh clone needs the network once.

## Attack record

A fresh subagent attacked the first draft (commit 8c94c03) on 2026-11-14, with experiments on a
project scaffolded by `scaffold.sh`. Findings and where they went:

| Id | Finding | Folded into |
|---|---|---|
| F-1 | ls-lint cannot require a named file, cannot join two rules, fails on kebab-case and dot folders | Q-24; D-5 rewritten; tool facts; anti-patterns; IT-02 |
| F-2 | mutmut and `linkml` do not lock together | D-10 "Lock first"; error matrix; task 3.6 |
| F-3 | `exhaustive` is red on the scaffold's own `commons` and `__main__` | D-11's layer list; task 3.3 on real scaffolds |
| F-4 | The new targets never ran in the project's CI | D-4 (three steps) |
| F-5 | `scaffold.sh` renders a fixed file list; pre-commit `rev`; the template table | D-2, D-4; tasks 1.5, 1.13, 3.6 |
| F-6 | A bare `# nosemgrep` suppresses the rule that looks for it | D-6 (own pass, `--disable-nosem`); IT-04 |
| F-7 | A commit id in the results makes every week a new diff | D-10 (nothing volatile in the files); TC-08 |
| F-8 | Tool versions and checksums in two places | Dissolved by Q-23: both live in the project (D-4) |
| F-9 | The specs contradicted the allow-listed rule; checklist items have no ids | D-3 (message forms), D-6 (own folder); both spec requirements |
| F-10 | Moving the probe fixtures breaks this file's link | Copy, not move (anti-patterns, task 1.5) |
| F-11 | `dependencies.yaml` entries owed | D-8, D-13; task 1.4 |
| F-12 | Hypothesis tests have no home in skillery; the installed brief may be old | D-8, D-13 (proof 2) |
| F-13 | No adoption path beyond Ruff | D-13 *Existing projects*; task 1.13, 3.3 |
| F-14 | The pin on `develop` names a tag without the content until the release | D-4 |
| F-15 | IT-05 contradicted the error matrix | IT-05 |
| F-16 | The stats file needs `export-cicd-stats`; the budget flag | D-10 |
| F-17 | No `timeout` on macOS; bare `python` | D-10, D-4 (`python3`) |
| F-18 | Hard-coded `develop`; inline `git` and `gh`; `concurrency` | D-10 |
| F-19 | `CLAUDE.md` line 4; a sentence that does not exist; `validate.yml`'s diff list | D-13, D-4 |
| F-20 | No MEDIUM example exists in `stage-loop.md` | D-9 |
| F-21 | ls-lint as a checker; scripts in `quality/`; `ci-cd-delivery`; existing gates unnamed | D-3 (grammar), Q-23, Non-Goals |
| F-22 | The SPARQL draft flags an English sentence | Worked example; anti-patterns |

**Clarity gate, run 1 (independent scorer, on commit c64e432): 8.8/10, FAIL.** Twelve of thirteen
items passed. Gaps folded in:

| Gap | Fix |
|---|---|
| G1 | The `AP-IO-IN-MODELS` contract had no package list and no test → the contract block in D-3; IT-04; task 1.6 |
| G2 | "D-2's steps" for Ruff adoption did not exist → the four steps under D-13 |
| G3 | The L3 judgement had no test → three scenarios in `code-reviewer.feature` (D-11, D-13, task 3.4) |
| G4 | The first-assignment table did not follow the grammar; review-only rows had no reason → the shorthand note, two full examples, the reasons table (D-3) |
| G5 | `external_sources.py`'s commands, the tool versions and the binaries' sources were unstated → D-7, D-4 |
| G6 | The doc-only archetype → Non-Goals |
| G7 | Two tester scenarios had no test → four scenarios (D-9, task 2.2) |
| G8 | Same survivors with an open bot PR; the bot's identity → D-10, a spec scenario |
| G9 | IT-04 missed three spec scenarios → IT-04 |
| Item 12 | Files named without a path → the table *Files this plan names by short name* |

**Clarity gate, run 2 (a second independent scorer, on commit 2f3898c): 9.0/10, PASS**, all
thirteen items, with no margin. Its ten recommendations were folded in afterwards and not
re-scored: a row per Semgrep rule and the report-only form (D-3); three dispatches in IT-06; the
README completed and tested (task 1.16, TC-02); the checksum line and platform mapping (D-4); the
stale-pull-request case and the script's inputs (D-10); "the default branch" in the mutation
requirement; what the Gherkin scenarios prove (task 2.4); the new entry in the L1 lens (task 1.7).

## Open Questions

None blocking. Answered by the developer on 2026-11-14 (`inputs/qa.md`, round 8):

| Id | Question | Answer |
|---|---|---|
| Q-21 | `S113` misses `requests.Session` calls | Accept the gap (D-2, RISK-9) |
| Q-22 | Which repository is the sample project of DEC-15 | Decided at stage 3 (D-13, proof 3) |
| Q-23 | Do the scripts and the tool checksums live in `quality/` | No: in `project-setup`'s templates (D-1) |
| Q-24 | How far does the ls-lint check go | Banned names, plus required files as `test -f` lines in the make target (D-5) |

The type name **Check** (D-1) is a planning choice the developer may rename.
