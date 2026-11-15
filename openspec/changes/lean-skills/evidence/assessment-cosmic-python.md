# Assessment: cosmic-python
Before: body 20705 bytes, references 105475 bytes. After: body 6638, references 13712.

Measured with the lint's own `_body` on `develop` `ad0518c` (before) and on the rewrite (after).
Total prose 126180 → 20350 bytes, under the 24576 budget; the skill leaves `pending` with no
`over_budget` entry. Line numbers are those of the file before the rewrite.

## SKILL.md body

| # | Passage (heading or lines, before) | Class | Where it went | Note |
|---|---|---|---|---|
| 1 | Title, l. 15 | keep | body title | renamed "code structure inside a service" |
| 2 | § Critical distinction, l. 17-27 (not system architecture; code structure) | keep | body intro sentences | the bias the skill corrects (D-9) |
| 3 | § Critical distinction, l. 29-32 (pairs with Stream Coding, architecture) | dependency, owner | body Workflow (Stream Coding named once); intro (`architecture`) | |
| 4 | § The catalogue is the single source, l. 36-42 | keep | body Rules, first pointer sentence | cite by id, add recurring findings there |
| 5 | § Survey & reuse before you write, l. 44-47 | keep | body Workflow step 1 (`PR-SURVEY-FIRST`); TDD ritual → `superpowers:test-driven-development` | rule text already in catalogue |
| 6 | § Meaningfy contract intro, l. 51-55 ("minimise WTFs per minute") | drop | | slogan, no rule |
| 7 | § 1 Layered architecture, l. 57-81 | keep | body Rules, the layer contract | test lines per layer → layer test table |
| 8 | § 2 Dependency direction, the law, l. 83-92 | keep | body Rules, diagram | |
| 9 | § 2 "When you violate this", l. 94-98 | drop | | "why it works" restating the rule |
| 10 | § 2 "How to enforce", l. 100-102 | owner | `project-setup` (import-linter contracts); body Workflow step 4 (`make check-architecture`) | |
| 11 | § 3 No clean code without tests: quote, l. 106 | drop | | quote (D-13) |
| 12 | § 3 80% coverage, tests per layer, l. 108-109 | keep | `BP-COVERAGE-PER-LAYER` (catalogue, existing); body Workflow step 4 | |
| 13 | § 3 TDD/BDD, l. 110 | owner | `superpowers:test-driven-development`, `bdd-gherkin` (Boundary) | |
| 14 | § 3 Test pyramid, FIRST, l. 111-112 | drop | | general knowledge (D-13) |
| 15 | § Clean code standards, l. 118-124 | keep | catalogue `CC-NAMES`, `CC-SMALL-FUNCTIONS`, `CC-NO-MAGIC-STRINGS`, `CC-SHALLOW-NESTING`, `CC-EXTRACT-THRESHOLD` | D-10; thresholds fixed by D-11 (5+ extract, 2-3 stay; three levels; under 25 lines) |
| 16 | § SOLID applied, l. 126-132 | keep | catalogue `CC-SRP`, `CC-OCP`, `CC-LSP`, `CC-ISP`, `CC-DIP` | reasoning in depth → book sets (dependency, named once in body) |
| 17 | § Observability, l. 134-139 | keep | body Rules, Observability | placement, structured, no `print`; OpenTelemetry "standard conventions" dropped as general |
| 18 | § Component organisation, l. 143-165 | keep | body Rules, Component organisation (`PR-COMPONENT-FIRST`, `AP-PARALLEL-LAYOUTS`); grooming cadence → `project-setup` (owner) | |
| 19 | § One-minute code structure check, l. 169-179 | keep | body Before you hand over (Quick diagnostic, CHK-6) | |
| 20 | § Workflow 1, implementing from specs, l. 185-196 | keep | body Workflow | layer order and `make check-architecture`; "mock external services" → testing checklist items 4-5 |
| 21 | § Workflow 2, code review questions, l. 198-222 | owner, drop | `meaningfy-code-review` lenses over the catalogue | duplicates of catalogue entries dropped (D-13) |
| 22 | § Workflow 3, test organisation per layer, l. 224-235 | keep | body Rules, layer test table | rewritten for fakes over mocks (testing checklist 4-5) |
| 23 | § Workflow 4, drift table, l. 237-248 | owner, drop | catalogue `AP-IO-IN-MODELS`, `AP-LOGIC-IN-EDGES`, `AP-CROSS-VARIANT-IMPORT`, `AP-FREESTR-ANYLAYER`, `BP-COVERAGE-PER-LAYER`; review → `meaningfy-code-review` | "clever one-liners" row: drop, general clean-code knowledge in the book sets |
| 24 | § Quality assurance and tooling: tool list, l. 254-262 | owner | `project-setup` (templates, `config-files.md`) | named pylint, flake8, tox, SonarCloud, which the scaffold no longer uses (D-13) |
| 25 | § Typical Makefile pattern, l. 264-273 | owner | `project-setup` (Makefile template, `ci-and-infra.md`) | |
| 26 | § CI/CD workflow, l. 275-281 | owner | `project-setup` (`ci-and-infra.md`); spec freshness → `clarity-gate` | |
| 27 | § Principles: on code structure, l. 287-293 | drop | | repeats rows 15, 18 (the second, looser thresholds were the D-11 defect) |
| 28 | § Principles: on testing, l. 295-301 | owner, drop | `BP-COVERAGE-PER-LAYER`; testing checklist (fakes, items 4-5; parametrised table, item 8); `bdd-gherkin` | fixtures and parametrize: drop (D-13) |
| 29 | § Principles: on architecture decisions, ADRs, contract-first, l. 303-307 | owner | `architecture` | |
| 30 | § Principles: "use dependency injection", l. 308 | keep | catalogue `BP-INJECT-ADAPTERS`; `CC-DIP` | |
| 31 | § Principles: on observability, l. 310-315 | drop | | repeats row 17 |
| 32 | § When not to use, l. 319-325 | keep | body Rules, When not to layer | "team discipline" paragraph dropped |
| 33 | § Cosmic Python + Stream Coding, l. 329-344 | dependency | Stream Coding named once in body Workflow | "update spec first" → `stream-coding`, `spec-stewardship` |
| 34 | § Reference materials, l. 348-374 | drop | pointers at the point of need (two sentences in Rules) | closing list (D-13); example files cut, see below |
| 35 | § Skill relationships, l. 378-383 | drop | Boundary | |
| 36 | § Boundary & Related Skills, l. 385-397 | keep | body Boundary | Related list unchanged; Delegates adds `project-setup` and `bdd-gherkin`; file name dropped from Owns |
| 37 | § Canonical vocabulary, does-not-own list, l. 401-407 | drop | Boundary Delegates | repetition |
| 38 | § Canonical vocabulary, folder names and synonyms, l. 409-412 | keep | body Rules, Folder vocabulary | no `src/`; `/domain` = `models/`, `/service_layer` = `services/` |

## references/principles-and-anti-patterns.md (the catalogue)

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 39 | Preamble, single source, id form | keep | unchanged | |
| 40 | Principles table, six `PR-` ids | keep | unchanged | |
| 41 | Best-practices table, seven `BP-` ids | keep | unchanged; three rows added (rows 48, 55, 64) | |
| 42 | Anti-patterns table, thirteen `AP-` ids | keep | unchanged | |
| 43 | Cross-links | keep | unchanged | |
| 44 | (new) `## Clean code and SOLID`, ten `CC-` ids | keep | catalogue | from rows 15-16 (D-10, D-11); no "Checked by" column yet |

## references/testing-checklist.md

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 45 | Intro, "Worked code is in example-testing-patterns.md" | drop | sentence removed | the file is deleted (D-14) |
| 46 | Items 1-16 and "The report" | keep | unchanged | numbering kept: Semgrep messages cite `testing-checklist#<n>` |

## references/example-models-layer.md (deleted)

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 47 | Pydantic base model with its config | example | docs page, Models (`core/models/pydantic.py`) | |
| 48 | Same, the house convention: one shared strict base (`extra="forbid"`, `validate_assignment`) | keep | catalogue `BP-STRICT-BASE-MODEL` (new) | a model would not add it unprompted |
| 49 | Domain enumerations, no magic strings | example | docs page, Models | rule already `BP-CONSTANTS-ENUMS`, `AP-FREESTR-ANYLAYER` |
| 50 | Aggregate root with invariants | example | docs page, Models | |
| 51 | Anti-patterns in models (I/O, ORM, HTTP) | drop | | repeats `AP-IO-IN-MODELS` |
| 52 | `fields(Model).name` instead of a field-name string | example | docs page, Models | rule already `AP-FREESTR-ANYLAYER` |
| 53 | Summary | drop | | repetition |

## references/example-adapters-layer.md (deleted)

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 54 | Extractor: abstract interface plus implementations | example | docs page, Adapters (`extractor.py`) | |
| 55 | Same, the house convention: interface named `<Thing>ABC` in `adapters/`, implementation named for what it wraps | keep | catalogue `BP-ABC-INTERFACES` (new); body layer contract (interfaces live in `adapters/`) | also the structure override of stage 1a |
| 56 | Generic repository with Mongo and in-memory implementations | example | docs page, Adapters (`repository.py`) | the override allowing a generic base is the orchestrator's (D-12) |
| 57 | In-memory repository used in tests | owner | testing checklist item 5 (one fake per port) | |
| 58 | Loader adapter (file parsing) | example | not linked | nothing house-specific |
| 59 | Anti-patterns in adapters (business logic, hard-coded config, adapter knowing services) | drop | | repeats `AP-LOGIC-IN-EDGES`, `PR-CONFIG-DECOUPLED`, the layer contract |
| 60 | Tracing decorator `traced_class` | example | docs page, Adapters (`tracer.py`) | |
| 61 | Same, the house convention: tracing as a decorator on services and adapters | keep | body Rules, Observability | |
| 62 | Summary | drop | | repetition |

## references/example-services-layer.md (deleted)

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 63 | Load services, one function per use case | example | docs page, Services | |
| 64 | Same, the house convention: adapters as parameters with a production default | keep | catalogue `BP-INJECT-ADAPTERS` (new) | reconciles the old body's "never import concrete implementations in services" with the real code |
| 65 | Precondition checks in services | owner | `BP-VALIDATE-AT-BOUNDARY` | |
| 66 | Log and skip in a batch (graceful degradation) | drop | | general knowledge |
| 67 | Serialisation and validation services | example | not linked | nothing house-specific |
| 68 | Anti-patterns in services | drop | | repeats `BP-INJECT-ADAPTERS`, the layer contract |
| 69 | Dependency-injection class pattern | drop | | repeats row 64 |
| 70 | Summary, "one function = one use case" | keep | body layer contract (`services/`: one function or class per use case) | |

## references/example-entrypoints-layer.md (deleted)

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 71 | Typer app with subcommands per module | example | docs page, Entrypoints (`mssdk.py`) | |
| 72 | Validate subcommands, exit codes, error messages | example | docs page, Entrypoints (`validate.py`) | exit-code mapping is general knowledge |
| 73 | FastAPI pattern | example | docs page says there is no API entrypoint | the code was invented, not from the project |
| 74 | Anti-patterns, "don't call adapters directly" | keep | body layer contract (every entrypoint goes through a service) | stage 1a structure override |
| 75 | Other anti-patterns (swallowed exceptions, mixed response types) | drop | | general knowledge |
| 76 | Testing entrypoints with patched services | example | docs page, Tests | rule in body layer test table |
| 77 | Summary | drop | | repetition |

## references/example-testing-patterns.md (deleted)

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 78 | Service tests, happy and error cases | example | docs page, Tests | |
| 79 | "One test = one assertion" | owner | testing checklist item 11 | |
| 80 | Testing strategy by layer (models, adapters, services, entrypoints) | keep | body layer test table | mock-everything advice replaced by fakes (testing checklist 4-5) |
| 81 | Test tree mirroring the code | owner | testing checklist item 1; `project-setup` `testing-setup.md` | |
| 82 | Fixtures with temporary folders and archives | example | docs page (`tests/conftest.py`) | |
| 83 | Summary, key principles | drop | | repetition or general knowledge; 80% is `BP-COVERAGE-PER-LAYER` |

## references/example-project-quality-ci.md (deleted)

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 84 | Makefile targets | owner | `project-setup` (Makefile template, `ci-and-infra.md`); docs page, Quality gates | |
| 85 | tox, coverage config, `fail_under = 80` | owner | `project-setup` `testing-setup.md` (Coverage gate); docs page (`.coveragerc`) | tox no longer used |
| 86 | Pylint config, good and bad names | owner, drop | `project-setup` (Ruff config); generic module names already `AP-GENERIC-MODULE-NAMES` | |
| 87 | Import-linter contracts | owner | `project-setup` `architecture-guardrails.md`; docs page (`.importlinter`) | |
| 88 | GitHub Actions workflow | owner | `project-setup` `ci-and-infra.md`; docs page (`ci.yaml`) | |
| 89 | Quality gates, exit codes, quality pyramid, local workflow | owner, drop | `project-setup` `ci-and-infra.md`, `checklists.md` | |

## references/example-advanced-patterns.md (deleted)

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 90 | Configuration with `env_property` and the resolver | owner | `PR-CONFIG-DECOUPLED`; `project-setup` `settings-pattern.md`; docs page, Configuration | |
| 91 | Exception hierarchy (base plus subclasses) | example | docs page, Exceptions | placement is `BP-EXCEPTIONS-MODULE`; a hierarchy is general knowledge |
| 92 | Chain of responsibility with a decorator | drop | | general pattern |
| 93 | Protocol instead of ABC | drop | | general knowledge; the house form is `BP-ABC-INTERFACES` |
| 94 | Version detection with matcher rules | drop | | project-specific |
| 95 | Cross-version dispatch service | drop | | project-specific; its if-chain contradicts `CC-OCP` |
| 96 | Hasher with line-ending normalisation | drop | | project-specific |
| 97 | Summary | drop | | repetition |

Second reader: pending
