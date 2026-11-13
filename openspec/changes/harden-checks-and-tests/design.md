<!-- PLAN (design half), derived 2026-11-14 from proposal.md (DEC-1..DEC-15, frozen). Type:
     Implementation. Written against EPIC A's design.md while A is being delivered: every point that
     must be re-checked against A's real matrix is marked [A] and listed in D-12. -->

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
| Top-level folders | `TOP_LEVEL_FOLDERS` has no `quality` | [`tools/repo_lint/lint.py`](../../../tools/repo_lint/lint.py) (line 462) |
| Artifact types | Five | [`governance.md`](../../../docs/development/governance.md#the-five-artifact-types), [`AGENTS.md`](../../../AGENTS.md) |
| Mutation testing, Semgrep, ls-lint, checkmake, Schemathesis | Nowhere in the catalogue | — |
| Releases | The `releases` branch holds the whole released tree, so a new top-level folder ships at every tag `vX.Y.Z`; the repository is public | [`releases.yml`](../../../.github/workflows/releases.yml) |
| skillery CI | Installs only `pyyaml` and `pytest`; `plugin-eval.yml` installs `requirements-dev.txt` | [`validate.yml`](../../../.github/workflows/validate.yml) |

The navigator accepts any string or `null` in `reviews.<appetite>.tester`
(`mods/navigator/lib/workflow.ts`, line 191), so the tester's new range needs no mod change.

### Issue #215: what Ruff really flags

Probed on 2026-11-14 with Ruff 0.17.5 on the fixtures in
[`inputs/ruff-probe/`](inputs/ruff-probe/) (`uvx ruff check --config inputs/ruff-probe/ruff.toml`).
`good.py` stays silent under every code below.

| Case | Code | Flags | Does not flag |
|---|---|---|---|
| HTTP call without a timeout | `S113` | `requests.get(url)`; `requests.post(url, timeout=None)`; `httpx.get(url, timeout=None)` | `requests.Session().get(url)`; `httpx.get(url)`, `httpx.Client().get(url)`, `httpx.AsyncClient().get(url)` (httpx has a 5 s default, so only the `Session` case is a real gap, see Open Questions) |
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
mutmut 3.8.1, Hypothesis 6.170.15, Schemathesis 4.33.4, import-linter 2.16):

| Tool | Fact | Consequence |
|---|---|---|
| Semgrep | `semgrep scan --test <dir>` runs `x.yaml` against `x.py` beside it; a rule without a fixture exits 0 | Our own test checks fixture presence (D-8) |
| Semgrep | `--error` exits 1 on any finding, whatever the severity | Report-only rules live in their own folder and run without `--error` (D-3) |
| Semgrep | `# nosemgrep: id -- reason` suppresses; a reason cannot be required | One rule checks the reason (D-6) |
| Semgrep | Local rules need no login and no network with `--metrics=off` | Offline runs work after the fetch |
| Semgrep | Registry rules cannot be pinned; `semgrep/semgrep-rules` has no tags | External sources are pinned by commit id (D-7) |
| Semgrep | A rule with `paths: include:` does not match its fixture unless the fixture path matches too | A path-scoped rule also includes its own fixture file name |
| ls-lint | Checks names by case and by negatable regex; `exists:1` requires a file; `--config` is repeatable | Names in the shared file, required files in the project's own (D-5) |
| checkmake | `[minphony] required = a,b` fails on a missing or non-phony target (undocumented key, works in 0.3.2) | Required targets are checked (D-5) |
| mutmut | Config key `source_paths` in `[tool.mutmut]`; `mutmut run` exits 0 with survivors; no time budget option; state in `mutants/` makes reruns incremental; `mutmut results` is text only | `timeout` wraps the run; a script writes the results (D-10) |
| Hypothesis | The built-in `ci` profile (derandomised) loads when `CI` is set | No conftest wiring |
| Schemathesis | `schemathesis.openapi.from_asgi(...)`, `@schema.parametrize()`, `case.call_and_validate()` | Checklist item 10 names these (D-9) |
| import-linter | `exhaustive = true` works only on a `layers` contract with `containers` and fails on a module of the container that no layer lists; `exhaustive_ignores` lists exceptions | The template's contracts move to the container form (D-11) |
| import-linter | A comment line inside `ignore_imports` is dropped by the INI parser; an inline comment becomes part of the entry | The decision comment sits on the line above (D-11) |
| GitHub Actions | A workflow can open a pull request with `GITHUB_TOKEN` only when the repository setting "Allow GitHub Actions to create and approve pull requests" is on; such a pull request's CI runs wait for a person's approval | Setup note and error-matrix row (D-10) |

## Goals / Non-Goals

**Goals:** the five outcomes of the proposal's Solution outline, cut into the three stages of the
Appetite; the three proofs of DEC-15; the Definition of Done of
[`docs/development/README.md` §9](../../../docs/development/README.md#9-definition-of-done).

**Non-Goals:** the proposal's No-gos. In particular: no new catalogue entry besides
`AP-SPARQL-FROM-STRINGS`; no rule for something Ruff already flags; no check run on skillery's own
code; no tool installed in skillery's CI; no description change in any skill (so no new trigger
probe is owed).

## Decisions

New choices made while planning. Settled ones are cited by `DEC-n`.

### D-1 The `quality/` tree

```
quality/
  README.md                         the one prose file: every check, its tool, its file, its owner entry
  semgrep/rules/<id>.yaml + <id>.py       gating rules, fixture beside the rule
  semgrep/report-only/<id>.yaml + <id>.py rules that print and never fail
  semgrep/external.json             manifest of external sources (D-7)
  semgrep/external.py               fetches the manifest's sources, prints their config paths
  ls-lint/python-project.yml        names (D-5)
  checkmake/python-project.ini      Makefile hygiene and required targets (D-5)
  import-contracts/check_contracts.py     D-11
  mutation/report.py                D-10
  tools.sha256                      checksums of the ls-lint and checkmake binaries (D-4)
```

The artifact type is named **Check**. The three scripts are executable checks in DEC-4's sense:
standard library only, no rule text, each named in the README with its owner skill. A repo lint
`quality_files` (added to `ALL_CHECKS`) allows under `quality/` only `README.md` at its root and
files ending `.yaml`, `.yml`, `.json`, `.ini`, `.py`, `.sha256`. `TOP_LEVEL_FOLDERS` gains
`quality`. EPIC C adds `quality/vale/` beside these (DEC-7); nothing here blocks it.

### D-2 The Ruff selection

`ruff.toml.tmpl` adds exactly the codes that check a catalogued rule or a hygiene case of DEC-3;
the pin moves to the Ruff version the stage builder verifies the fixtures with (0.17.5 or later).

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
`S`, `PLR1702` (preview-only), `ARG`, `ERA`: none checks a rule in DEC-3's scope.

**Existing projects** (the proposal's rabbit-hole): `modernizing-existing-projects.md` gains a
section *Adopting a wider Ruff selection*: add one code family per pull request; run
`ruff check --statistics`; fix the findings; where a family has more than 50 findings, a baseline
with `ruff check --add-noqa` is allowed when the pull request links an issue to remove it. A
scaffolded project is green from the first commit because the template skeleton has no finding.

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
| ls-lint | `ls-lint` |
| None | `review only, because <reason>` (reason of at least 3 words; never combined with a tool) |

A tool that checks only part of a rule is written with the tool first, then `(partial: <what is left
to review>)`.

`tests/test_quality.py` (pure Python, runs in CI) fails when: an entry, item or bullet has no value;
a value does not parse; a named Semgrep id has no rule file under `quality/semgrep/`; a rule id
under `quality/semgrep/` is named by no value (allow-list of one: `mfy-suppression-without-reason`,
D-6); a named Ruff code is not covered by the `select` of `ruff.toml.tmpl` (a selected family such
as `DTZ` covers `DTZ005`).

**First assignment.** It is the stage builder's starting point; each tool row is confirmed by a
fixture that fails without the check, test-first, and a row whose fixture cannot be made to work
becomes `review only, because …` with the reason found (the proposal's rabbit-hole "ALL of them").

| Entry | Checked by |
|---|---|
| `PR-SURVEY-FIRST`, `PR-SSOT-DRY`, `PR-REUSE-COMPACT` | review only (a working step or a judgement on meaning; no shape in the code) |
| `PR-MODELS-OVER-DICTS`, `AP-DICT-AS-MODEL` | Semgrep `mfy-dict-as-model` (report-only) |
| `PR-COMPONENT-FIRST`, `AP-CROSS-VARIANT-IMPORT` | import-linter, the tier and layer contracts with `exhaustive` (D-11) |
| `PR-CONFIG-DECOUPLED` | Ruff `TID251` |
| `BP-CONSTANTS-ENUMS`, `AP-FREESTR-ANYLAYER` | Ruff `PLR2004` (comparisons); Semgrep `mfy-free-string-key` (report-only; subscripts, `hasattr`, `getattr`) |
| `BP-DOMAIN-REVEALING-NAMES`, `AP-GENERIC-MODULE-NAMES` | ls-lint (the five banned file names; partial: every other name is reviewed) |
| `BP-EXCEPTIONS-MODULE`, `AP-EXCEPTIONS-EMBEDDED` | ls-lint (no `errors.py`); Semgrep `mfy-exception-outside-exceptions-module` |
| `AP-IO-IN-MODELS` | import-linter, a `forbidden` contract on external I/O packages (fallback: a path-scoped Semgrep rule, see task 1.6) |
| `AP-SPARQL-FROM-STRINGS` (new, DEC-3) | Semgrep `mfy-sparql-built-from-strings` |
| `BP-VALIDATE-AT-BOUNDARY`, `BP-COVERAGE-PER-LAYER`, `BP-IDIOMATIC-SMALL`, `BP-CONSTANTS-HOME`, `AP-DUP-CONST`, `AP-MISPLACED-SHARED-INFRA`, `AP-VERBATIM-EXTERNAL`, `AP-DUP-VALIDATION`, `AP-LOGIC-IN-EDGES`, `AP-OVER-FRAGMENTATION`, `AP-PARALLEL-LAYOUTS` | review only (cross-file duplication, placement or licence judgement; Semgrep's free engine reads one file at a time) |
| Clean code: small functions | Ruff `C901`, `PLR0912`, `PLR0913`, `PLR0915` |
| Clean code: no magic strings | Ruff `PLR2004` |
| Clean code: names, nesting, DRY; SOLID: all five | review only |
| Checklist 3 (no network outside container and e2e tests) | Semgrep `mfy-test-network-call` |
| Checklist 7 (RDF compared as graphs) | Semgrep `mfy-test-rdf-string-compare` |
| Checklist 11 (one assert per idea) | Ruff `PT018` (partial: the message on each assert is reviewed) |
| Checklist 12 (no real sleeps) | Semgrep `mfy-test-real-sleep` |
| Checklist 1, 2, 4, 5, 6, 8, 9, 10, 13, 14, 15, 16 | review only |

That is eight Meaningfy Semgrep rules: six gating (`sparql-built-from-strings`,
`exception-outside-exceptions-module`, `test-network-call`, `test-rdf-string-compare`,
`test-real-sleep`, `suppression-without-reason`) and two report-only (`dict-as-model`,
`free-string-key`). A report-only rule moves to `rules/` by a pull request the owner approves, after
its findings on one real project have been read.

### D-4 Fetch and tools in a project

One pin, `QUALITY_VERSION`, in `Makefile.tmpl`. `make bundles` writes `v` + the root `VERSION` into
that line, as it does for its three other rendered files, and the version-sync gate covers it; a
project raises the pin by hand. The variable takes any git ref, which lets a sample project point
at a merge commit before the release exists.

```make
QUALITY_VERSION = v3.15.0
QUALITY_DIR     = $(REPO_ROOT)/.quality

quality-fetch: ## Fetch the shared checks at the pinned skillery release
	@ if [ "$$(cat $(QUALITY_DIR)/.version 2>/dev/null)" != "$(QUALITY_VERSION)" ]; then \
	    tmp=$$(mktemp -d) && \
	    curl -fsSL https://github.com/meaningfy-ws/skillery/archive/$(QUALITY_VERSION).tar.gz \
	      | tar -xz -C $$tmp --strip-components=1 && \
	    test -d $$tmp/quality || { echo "$(ICON_ERROR) no quality/ at $(QUALITY_VERSION)"; rm -rf $$tmp; exit 1; } ; \
	    rm -rf $(QUALITY_DIR) && mv $$tmp/quality $(QUALITY_DIR) && rm -rf $$tmp && \
	    echo "$(QUALITY_VERSION)" > $(QUALITY_DIR)/.version ; fi
```

The template's `SHELL` already sets `pipefail`, so a failed download fails the recipe before
`.quality/` is touched; `.version` is written last, so an interrupted run is retried in full. No
GNU-only `tar` flag is used.

`make quality-tools` (depends on `quality-fetch`) installs into `.quality/`: Semgrep in its own
virtual environment (`python -m venv .quality/venv`, `pip install semgrep==$(SEMGREP_VERSION)`), so
its dependencies never meet the project's; the ls-lint and checkmake release binaries for the
machine's OS and architecture into `.quality/bin/`, each verified with
`shasum -a 256 -c` against `quality/tools.sha256` before it is made executable. The three versions
are variables beside the pin. `.quality/` and `mutants/` join `dot-gitignore`. Hypothesis,
Schemathesis and mutmut are pinned in the `test` group of `pyproject.toml.tmpl`.

CI (`ci.yaml.tmpl`): one `actions/cache` step on `.quality/`, keyed by the hash of `Makefile`, then
`make quality-tools`; a cache hit means no download (DEC-13).

### D-5 The checks a project runs

`check-quality` becomes `lint typecheck check-architecture check-semgrep check-layout
check-makefile`; each new target depends on `quality-tools`.

| Target | Command (abridged) | Fails on |
|---|---|---|
| `check-semgrep` | `semgrep scan --config .quality/semgrep/rules $(external gate paths) --error --metrics=off --quiet $(PACKAGE_NAME) $(TEST_PATH)`, then the same without `--error` for `.quality/semgrep/report-only` and the external report-only paths | A gating finding |
| `check-layout` | `ls-lint --config .quality/ls-lint/python-project.yml --config .ls-lint.yml` | A bad name; a missing required file |
| `check-makefile` | `checkmake --config .quality/checkmake/python-project.ini Makefile` | A missing or non-phony required target; a checkmake rule |
| `check-architecture` | `lint-imports`, then `python .quality/import-contracts/check_contracts.py .importlinter` (D-11) | A contract; an uncovered package; an undecided ignore |

- **Names** (shared file): `.py` files and directories are `snake_case`; no `.py` file is named
  `utils`, `helpers`, `port`, `factory`, `manager` or `errors`; ignored: `.quality`, `.venv`,
  `mutants`, `node_modules`, `docs`, `.git`.
- **Required files** (the project's own `.ls-lint.yml`, a new template with `<<PACKAGE>>`):
  `<<PACKAGE>>/__init__.py`, `tests/conftest.py`, `Makefile`, `ruff.toml`, `.importlinter`.
- **Required targets** (shared `checkmake` file): `install`, `lint`, `typecheck`,
  `check-architecture`, `check-quality`, `check-all`, `test`, `test-unit`, `quality-fetch`,
  `clean`. A skillery test fails when one of them is missing from `Makefile.tmpl`.
- If ls-lint does not merge two `--config` files as needed (task 1.9 checks first), the shared
  rules are kept in `quality/ls-lint/python-project.yml` and the project's `.ls-lint.yml` template
  carries a copy that a skillery test compares line by line.

### D-6 Suppressions carry a reason

One gating Semgrep rule, `mfy-suppression-without-reason` (`languages: [generic]`), flags a
`# nosemgrep` comment without ` -- <reason>` and a `# noqa: <code>` comment without ` -- <reason>`
or a following `# <reason>`. Its convention is stated once, in
`project-setup/references/config-files.md` § Ruff, which the rule's message cites; it is the one
rule no catalogue entry names (D-3 allow-list).

### D-7 External sources

`quality/semgrep/external.json` is a list of entries:

```json
{ "id": "semgrep-rules-python-requests", "repo": "https://github.com/semgrep/semgrep-rules",
  "commit": "<40 hex>", "paths": ["python/requests/security"], "licence": "Semgrep Rules License v1.0",
  "why": "…", "mode": "report-only" }
```

`mode` is `report-only` or `gate`. `quality/semgrep/external.py` (standard library; run by
`make quality-tools`) downloads each source's archive at its commit into
`.quality/external/<id>/` when absent and prints the config paths of one mode for `check-semgrep`.
The stage PR proposes at most five candidate sources, each with its licence and reason; the owner
approves each in the review and unapproved ones are removed before merge, so the manifest may ship
empty. Raising a `commit` is a new approval (DEC-13). `tests/test_quality.py` checks every field,
the 40-character commit and the mode; that a new entry starts `report-only` is a review finding,
not a test (a test cannot see the base branch).

### D-8 skillery's own tests of `quality/` (DEC-12)

All in `tests/test_quality.py`, fixtures under `tests/fixtures/quality/`.

| Group | Needs | In CI |
|---|---|---|
| Fixture presence and marks, id prefix, message cites an owner id, manifest fields, allowed files, "Checked by" (D-3), required targets exist in `Makefile.tmpl`, the three scripts' unit tests | Python only | Runs |
| `semgrep scan --test quality/semgrep/rules` and `…/report-only` | Semgrep | Skips: "semgrep not on PATH" |
| The shared ls-lint file on a good and a bad tree | ls-lint | Skips: "ls-lint not on PATH" |
| The shared checkmake file on the rendered `Makefile.tmpl` and on one with `test` removed | checkmake | Skips: "checkmake not on PATH" |

The skip follows `tests/test_formal_reasoning.py` (`pytest.mark.skipif(shutil.which(...) is None)`).
Semgrep is installed locally from a new `requirements-quality.txt` that `make install` reads and no
workflow does (`plugin-eval.yml` installs `requirements-dev.txt`, so Semgrep must not go there).
`CONTRIBUTING.md` says how to install the two binaries.

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
  [`stage-loop.md`](../../../skills/epic-delivery/references/stage-loop.md) (the worked examples,
  lines 108–113), `docs/practice/ai-coding/working-with-agents.md` (line 44),
  [`tests/features/epic-delivery.feature`](../../../tests/features/epic-delivery.feature) (the
  MEDIUM row, line 21, and a new scenario for the report).
- **Report check:** the lead returns a Python-stage report without a properties table as
  incomplete; `stage-loop.md`'s ledger row for the tester says so.

### D-10 The weekly mutation report (stage 3)

- **Config:** `[tool.mutmut]` in `pyproject.toml.tmpl` with `source_paths = ["<<PACKAGE>>"]` and
  `pytest_add_cli_args_test_selection = ["tests/unit", "tests/feature"]`. mutmut reads only
  `pyproject.toml` or `setup.cfg`, so this is a recorded exception to `project-setup` D2 (tool
  configuration in dedicated files), noted in `decisions.md`.
- **Target:** `make mutation-report` runs `timeout $(MUTATION_BUDGET) poetry run mutmut run`
  (default budget `150m`; exit 124 is not an error), then
  `python .quality/mutation/report.py tests/mutmut-results`.
- **`report.py`** reads `mutmut results` and `mutants/mutmut-cicd-stats.json` and writes:
  `survivors.txt` (one survivor per line, sorted); `diffs/<mutant>.diff` from `mutmut show` for the
  first 200 survivors; `README.md` with the commit, the mutmut version, the counts, "incomplete:
  budget reached" when the run was cut, and the pick-up rule of DEC-10. It writes no date, so the
  same commit gives the same files. With no survivor it removes the folder's content.
- **Workflow** `ci/mutation.yml.tmpl`: `schedule` (Monday 03:00 UTC) and `workflow_dispatch`;
  `permissions: contents: write, pull-requests: write`; job `timeout-minutes: 180`; checks out
  `develop`; restores `mutants/` from `actions/cache` (incremental runs); `make install`,
  `make mutation-report`. If `git status --porcelain tests/mutmut-results` is empty it stops.
  Otherwise it commits to the branch `bot/mutmut-results`, force-pushes it and, with `gh`, edits the
  open pull request of that branch or creates one into `develop`. No step fails on survivors.
- **Setup note** in `ci-and-infra.md`: turn on "Allow GitHub Actions to create and approve pull
  requests"; a person approves the bot pull request's CI run.

### D-11 The import-contract check (stage 3)

- **Coverage is import-linter's own.** `dot-importlinter.tmpl` moves to the container form:
  `containers = <<PACKAGE>>`, layer names relative (`(entrypoints)`, `(services)`, `(adapters)`,
  `(domain)`), `exhaustive = true`. A top-level subpackage that no layer lists then fails
  `lint-imports`. The commented multi-component block is rewritten the same way (tiers as layers of
  the root container). The import-linter pin moves to the version the builder verifies
  `exhaustive` with (2.16 or later).
- **`check_contracts.py`** (standard library, reads the raw lines of `.importlinter`) fails when:
  no `layers` contract has `exhaustive = true` with the root package among its `containers`; or an
  entry of `ignore_imports` or `exhaustive_ignores` has no comment line directly above it matching
  `\b(DEC|D|ADR)-\d+\b`. It prints `file:line: entry: reason` per failure and exits 1.
- **Per EPIC:** the L3 lens text in `meaningfy-code-review` gains the contract judgement (the
  `pr-review-modes` delta); `epic-delivery`'s reviewer brief and ledger name the moment (the last
  build stage); `architecture-guardrails.md` § grooming points to both and drops "periodically".

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
| Docs | `governance.md` (six types), `AGENTS.md` (type table, the allowed-folder sentence, "four rendered files"), a new `docs/development/quality.md` (how to add a rule, a source, a tool; registered for `doc_register_complete`), `README.md` row, one `CHANGELOG.md` line per stage |
| `project-setup` references | `config-files.md` (Ruff, suppressions), `decisions.md` (D4 selection, the mutmut exception), `ci-and-infra.md` (cache, weekly workflow, the setting), `architecture-guardrails.md`, `modernizing-existing-projects.md`, `layout.md` (`.quality/`, `.ls-lint.yml`, `tests/mutmut-results/`), `checklists.md` |
| Gherkin | `tests/features/epic-delivery.feature` (D-9) |
| Generated files | `make bundles`, `make skill-inventory` after every skill edit |
| Scenario sign-off | The developer signs off this change's spec scenarios when accepting the gated PLAN, recorded in `evidence/acceptance.md` |
| The three proofs (DEC-15) | (1) `tests/test_quality.py` green; (2) `evidence/tester-report.md`: one real tester report with its properties table, from this EPIC's stage 3 (which changes Python); (3) `evidence/sample-project.md`: the bot pull request's URL and the output of a failing and a passing `make check-architecture`, on the sample project (Open Questions) |
| Acceptance demo | Mandatory at VERY LARGE: the three proofs shown to the developer, verdict in `evidence/acceptance.md` |

## Algorithm / approach

**Three stages, each its own PR into `develop`, each releasable.**

| Stage | Delivers | Proof |
|---|---|---|
| 1 | `quality/` and the Check type; the Ruff selection; the eight Semgrep rules; "Checked by"; fetch, tools and the three new `make` targets; ls-lint and checkmake | DEC-15 (1) |
| 2 | The tester's range, brief and report; checklist item 10 | DEC-15 (2), recorded in stage 3 |
| 3 | The weekly mutation report; the import-contract check; the L3 judgement | DEC-15 (3) |

Within a stage the order is test first: the failing test or fixture, then the artifact.

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
```

The pattern above is a first draft; the fixture decides. A rule scoped by path (`mfy-test-real-sleep`,
`paths: include: ["**/tests/**", "**/mfy-test-real-sleep.py"]`) lists its own fixture.

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
| TC-02 | `quality_files` lint | `quality/semgrep/notes.md` | names the file | `quality/README.md` passes; a nested `README.md` fails |
| TC-03 | Fixture presence | `x.yaml` without `x.py` | names `x` | fixture with `ruleid:` only; with `ok:` only; rule id not `mfy-` |
| TC-04 | "Checked by" parser | each of the three shapes | parsed value | empty cell; `review only` without reason; `review only` joined to a tool; two tools; `(partial: …)` |
| TC-05 | "Checked by" cross-check | a value naming `mfy-x` with no rule file; a rule no value names | names entry and id | the allow-listed rule; a Ruff family covering a code; a code not selected |
| TC-06 | Manifest check | entries with one field wrong each | names the entry and field | empty list; `commit` of 39 characters; unknown `mode` |
| TC-07 | `check_contracts.py` | `.importlinter` fixtures | exit code and `file:line` messages | no exhaustive root contract; comment two lines above; inline comment; `exhaustive_ignores` entry; file with no `ignore_imports`; missing file (exit 2, message) |
| TC-08 | `report.py` | canned `mutmut results` text and stats JSON | the three outputs | no survivor (content removed); 201 survivors (200 diffs); budget flag; same input twice (identical output) |
| TC-09 | `external.py` | a manifest and a fake download function | fetches the absent source only; prints the paths of the asked mode | empty manifest; a source already present; a failed download (exit 1, nothing left behind) |
| TC-10 | Required targets | `checkmake` file against `Makefile.tmpl` | every required target present and phony | a target renamed in the template |
| TC-11 | Version pin | `Makefile.tmpl` after `make bundles` | `QUALITY_VERSION` equals `v` + `VERSION` | `tests/test_bundle_gen.py`: stale pin fails the gate |
| TC-12 | Gap rows [A] | `software.md` | no `gap` row names this EPIC after stage 3 | skipped with a message until A's file exists |

Integration tests:

| Id | Flow | Setup | Verification |
|---|---|---|---|
| IT-01 | Semgrep rule tests | Semgrep on PATH | `semgrep scan --test` exits 0 for both rule folders; skipped otherwise |
| IT-02 | ls-lint on trees | ls-lint on PATH; a good tree and one with `utils.py` and `Bad-Name/` | exit 0; exit 1 naming both |
| IT-03 | checkmake on the template | checkmake on PATH; `Makefile.tmpl` rendered with a package name | exit 0; exit 1 with `test` removed |
| IT-04 | Scaffold run | A project scaffolded from the stage's branch, `QUALITY_VERSION` set to the branch's commit | `make check-quality` green on the skeleton; red after adding `utils.py`, an f-string SPARQL query, and a `requests.get(url)`; recorded in the stage PR |
| IT-05 | Fetch | The same project | second `make quality-fetch` offline exits 0; with a pin `v0.0.0` exits non-zero and `.quality/` is absent |
| IT-06 | Weekly workflow and contract check | The sample project (DEC-15) | `evidence/sample-project.md` |
| IT-07 | Tester report | Stage 3 of this EPIC | `evidence/tester-report.md` |

**Idempotency.** `quality-fetch` and `quality-tools` do nothing when the version file and the tools
are present. `report.py` is a pure function of mutmut's state. The weekly workflow force-pushes one
branch and edits one pull request, so a re-run or a manual dispatch cannot open a second one.
`make bundles` rewrites the pin to the same value. All checks are pure reads.

### Anti-patterns

| Don't | Do instead | Why |
|---|---|---|
| Write a Semgrep rule for what a Ruff code flags | Select the Ruff code | DEC-2's order; one tool per rule |
| Put the rule's explanation in the Semgrep `message` | Cite the catalogue id and one pointer line | DEC-4: the rule text has one home |
| Ship a rule whose fixture has no `ok:` case | Mark a good case that looks close to the bad one | A rule that flags everything passes a `ruleid:`-only test |
| Add `semgrep` to `requirements-dev.txt` | `requirements-quality.txt`, read by `make install` only | `plugin-eval.yml` installs `requirements-dev.txt`; no heavy tool in CI |
| Force a brittle rule to give an entry a tool | `review only, because <reason>` | The proposal's rabbit-hole "ALL of them" |
| Promote a new rule or source straight to gating | Start it in `report-only` | DEC-13: noise makes teams ignore checks |
| Add Semgrep to the project's Poetry groups | Its own environment under `.quality/venv` | Semgrep pins many dependencies |
| Put an inline comment after an `ignore_imports` entry | A comment line directly above it | The INI parser makes an inline comment part of the entry |
| Let the weekly workflow run on `pull_request` or fail on survivors | `schedule` and `workflow_dispatch` only; exit 0 | DEC-10 |
| Write a date into `tests/mutmut-results/` | The commit id | A date makes every run a new diff and a new PR update |
| Restate the tester's methods in the brief | Point to checklist item 10 | DEC-14 |
| Edit other fields of `epic-delivery.workflow.json` | Change `reviews.MEDIUM.tester` only | A's `criteria` live in the same file |

## Error matrix

| Failure mode | How it is detected | Expected handling |
|---|---|---|
| A is not merged when a stage starts | The stage's first task (D-12) | Stop; B does not start before A |
| A's matrix differs from D-12's assumptions | The same task | Adjust the rows and ids to A as merged; a difference that changes a `DEC-` goes to the developer |
| A catalogue entry, item or bullet without a value; an unparsable value | TC-04 in `make validate` | Write the value; the test names the entry |
| A value names a missing Semgrep rule or an unselected Ruff code; a rule nothing names | TC-05 | Add the rule or the code, or correct the value |
| A rule without a fixture, or a fixture without both marks | TC-03, in CI too | Add the fixture |
| A rule no longer matches its fixture | IT-01, local only | Fix the rule; CI cannot catch this (RISK-3) |
| A first-assignment row cannot be made to work as a rule | The builder's fixture stays red or flags the `ok:` case | Record `review only, because …` with the reason; tell the lead |
| `AP-IO-IN-MODELS` cannot be expressed as a `forbidden` contract on external packages | The fixture project of task 1.6 | Use the path-scoped Semgrep rule `mfy-io-in-models`; update the value |
| A file that is not a check under `quality/` | TC-02 | Move the prose to `docs/development/quality.md` or the owning skill |
| Semgrep, ls-lint or checkmake missing on a skillery machine or in CI | `skipif` | Skip with the tool's name; never fail |
| ls-lint does not merge two config files | Task 1.9's first step | D-5's fallback: one project file, compared by a test |
| checkmake's built-in rules fire on `Makefile.tmpl` | IT-03 | Fix the template; where a rule fights the template's style, set its limit in the shared file and say why in the README |
| `quality-fetch`: no network, a missing ref, a ref without `quality/` | `curl -f` with `pipefail`; the `test -d` | Exit non-zero naming the pin; `.quality/` is unchanged |
| `quality-fetch` interrupted | `.version` absent or old on the next run | Full retry |
| A downloaded binary does not match `tools.sha256` | `shasum -c` | Delete the file, exit non-zero naming the tool and version |
| An OS or architecture with no binary listed | `quality-tools` | Exit non-zero naming the platform; the README lists the supported four (linux and darwin, amd64 and arm64) |
| Semgrep cannot be installed on the project's Python | `pip` in `quality-tools` | Exit non-zero with pip's message; RISK-5 |
| A gating rule is too noisy on a real project | Findings in `check-semgrep` | Suppress with a reason, and open an issue on skillery (`skillery-feedback`); the fix is to tune the rule or move it to `report-only` |
| A suppression without a reason | `mfy-suppression-without-reason` | Add the reason |
| The wider Ruff selection floods an existing project | `ruff check --statistics` | D-2's adoption steps |
| An external source disappears, or its licence changes at a new commit | `external.py` download fails; the review of a commit bump | The pinned commit keeps working while the repository exists; remove or replace the entry by PR |
| A tester report on a Python stage without the properties table | The lead reads it (D-9) | Return it as incomplete |
| The tester is dispatched on a stage without Python | The brief | It says so and tests by hand |
| A MEDIUM EPIC's lead skips the tester | The checker reads the review set | A finding |
| mutmut reaches the budget | `timeout` exits 124 | Results delivered, marked incomplete; the next run resumes from the cached `mutants/` |
| mutmut crashes or the suite is red on `develop` | `mutmut run` exits non-zero (not 124) | The workflow step fails and no PR is opened; the run is not a build, so DEC-10 holds |
| The bot cannot create the pull request | `gh pr create` fails with a permission error | The step fails with a line pointing to the setup note (D-10) |
| The bot PR's CI waits for approval | GitHub shows the run as waiting | A person approves it; stated in the setup note |
| Two weekly runs overlap | `concurrency` group on the workflow | The later one waits |
| `lint-imports` fails after the template moves to the container form on a project with extra top-level packages | The contract's own message | List the package in a layer, or in `exhaustive_ignores` with a decision comment |
| `.importlinter` is missing | `check_contracts.py` exits 2 with a message | The project has no contracts: `check-architecture` already fails in `lint-imports` |
| The pin in `Makefile.tmpl` is stale after a version bump | The version-sync gate (TC-11) | `make bundles` |
| A changed skill passes 650 lines | `skill_too_long` | Move detail to a reference |
| An edited skill's bundle copy is stale | `bundle_gates` | `make bundles` |

## Risks / Trade-offs

- **RISK-1** External sources change or relicense (DEC-13). Likelihood medium, impact medium.
  Mitigated: commit pins, a licence per entry, a new approval on every bump.
- **RISK-2** Noise makes teams ignore the checks (DEC-13). Likelihood high for the two
  free-string rules, impact high. Mitigated: they ship report-only; six gating rules only;
  suppressions need a reason; the adoption steps of D-2.
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
- **RISK-9** `S113` misses `requests.Session` calls, so "a request without a timeout" is flagged
  only for module-level calls. Open Questions, Q-A.
- **Trade-off:** `.quality/` is fetched, not vendored (DEC-5): a fresh clone needs the network once.
- **Trade-off:** three small scripts live in `quality/` (D-1) so that a project gets them at the
  same pin as the rules, at the price of Python files in a folder of rules.

## Open Questions

Asked to the developer in one round on 2026-11-14; the answers are folded in below when given.

| Id | Question | Recommendation |
|---|---|---|
| Q-A | `S113` does not flag `requests.Session().get(url)` (issue #215). DEC-3 says the hygiene rules come with Ruff and need no catalogue entry. | Accept the gap and record it on #215; a Semgrep rule would need a catalogue entry, which DEC-3 rules out. |
| Q-B | Which repository is the sample project of DEC-15 (the bot pull request needs a real GitHub repository)? | A new private scratch repository scaffolded by `project-setup`, archived after the evidence is recorded. |
| Q-C | DEC-4 says `quality/` holds "only executable rule files and configurations". Do the three standard-library scripts of D-1 belong there? | Yes: they are executable checks, and a project gets them at the same pin. The alternative is a copy in every scaffold, which drifts. |
| Q-D | The Ruff selection of D-2 adds only codes that check a catalogued rule or a DEC-3 hygiene case. Wider (for example `T20`, all of `S`)? | Keep it to D-2; a wider selection belongs with the follow-up catalogue EPIC (#210). |
