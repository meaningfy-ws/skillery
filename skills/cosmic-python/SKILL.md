---
name: cosmic-python
description: Clean Architecture and Cosmic Python guidance for well-tested, layered Python systems. Use for designing Python projects with layered architecture (models, adapters, services, entrypoints), enforcing Clean Code and SOLID principles, testing strategies (unit tests, BDD, Gherkin), CI/CD setup (pytest, tox, importlinter), and architectural decision-making (ADRs). Applicable to systems requiring strict boundary enforcement, clean separation of concerns, and comprehensive test coverage.
license: Apache 2.0
metadata:
  version: "1.0.0"
  purpose: software-development
  area: coding
  subject: python
  posture: precise
  stage: build
  maturity: stable
---

# Cosmic Python: code structure inside a service

This skill places code in the right layer of one Python service or package, keeps the imports
pointing inwards and tests each layer for what it owns. It is not system design: service
boundaries, deployment and C4 belong to `architecture`.

## Quick Start

Spec line: "a customer's tier follows from their yearly spend; the CLI shows it".

| Piece | Where it goes |
|---|---|
| `calculate_customer_tier(spend) -> CustomerTier`, a pure rule over an enum | `billing/models/customer.py` |
| `CustomerRepositoryABC` and `MongoDBCustomerRepository` | `billing/adapters/customer_repository.py` |
| `show_customer_tier(customer_id, repository: CustomerRepositoryABC)` | `billing/services/customer_tier.py` |
| a Typer command that parses the id, calls the service and prints the tier | `billing/entrypoints/cli.py` |
| a models test with no fake; a services test with an in-memory fake repository | `tests/unit/billing/models/`, `tests/unit/billing/services/` |

`make check-architecture` passes: no model imports an adapter, the CLI never touches the repository.

## Workflow

Implement from a spec (with Stream Coding, this is its build phase; its method is not restated here):

1. Survey the target package before writing (`PR-SURVEY-FIRST`): reuse, extend or refactor to fit.
2. Name the layer of each piece of the spec (the layer contract below).
3. Write `models/` first, with their tests; then `adapters/` (interface, implementation, fake);
   then `services/`; then `entrypoints/`. The red-green-refactor ritual is `superpowers:test-driven-development`'s.
4. Run `make check-architecture` and the tests with coverage per layer (`BP-COVERAGE-PER-LAYER`).

## Rules

Read `references/principles-and-anti-patterns.md` before you write or review code: it holds every
principle, best practice and anti-pattern by id, with the clean-code and SOLID table (`CC-`) that
other skills cite as `cosmic-python:<id>`. A recurring review finding becomes a new entry there.

**The layer contract.** Four layers, imports only inwards:

```
entrypoints → services → models
                 ↘
                 adapters → models
```

- `models/`: entities, value objects, enums and domain rules. No I/O, no framework but Pydantic.
- `adapters/`: every database, file system, API or external client is wrapped here. Abstract
  interfaces live here too (`BP-ABC-INTERFACES`). Imports `models/` only.
- `services/`: one function or class per use case; orchestrates models and adapters, owns
  transactions and the error policy. Receives adapters by injection (`BP-INJECT-ADAPTERS`).
- `entrypoints/`: CLI, API, schedulers, workers. Parse, call a service, format the answer. Every
  entrypoint goes through a service, never straight to an adapter.
- Input is validated once, at the boundary (`BP-VALIDATE-AT-BOUNDARY`).

**Component organisation** (`PR-COMPONENT-FIRST`). A small service stays one level: the four
layers. A larger project is component-first, layers inside each component:

```
<root>/
  core/           # or commons: imported by all, imports none, no entrypoints/
  <component>/    # e.g. loader/
    models/  adapters/  services/  entrypoints/
```

Never a top-level `services/<component>/` (`AP-PARALLEL-LAYOUTS`). The import-linter contracts that
enforce this, and their grooming, are `project-setup`'s.

**Folder vocabulary.** `models/`, `adapters/`, `services/`, `entrypoints/`, inside top-level
packages, never under `src/`. The book's `/domain` is `models/` and `/service_layer` is `services/`.
No semantic label exists only as a free string.

**What each layer's tests check.**

| Layer | Tests check | With |
|---|---|---|
| `models/` | rules, invariants, transformations | no I/O, no fake |
| `adapters/` | the translation to and from the external system | the real system in an integration test |
| `services/` | the use case, every branch | fakes of the adapters |
| `entrypoints/` | parsing, status or exit codes, response shape | the service replaced |

Read `references/testing-checklist.md` when you write a test or brief someone to write one: it
holds the rules every test follows, from where it lives to fakes, assertions and time.

**Observability.** Logging lives in `services/` and `entrypoints/`, structured, never `print`.
Tracing is a decorator on service functions and adapter classes, not spans written inline.

**Configuration.** Code reads settings without knowing their source (`PR-CONFIG-DECOUPLED`); the
resolver pattern is `project-setup`'s.

**When not to layer.** Spikes, throwaway prototypes and single-file scripts. Move a spike into the
layers once it is kept.

**Book rule sets.** The `clean-architecture`, `refactoring` and `a-philosophy-of-software-design`
sets inform design reasoning. Where they disagree with this skill on structure or size, this skill
wins. If the book rule sets (`agent-rules-books/meaningfy-building` in `dependencies.yaml`) are not
installed, offer to install them; if the person declines, say that you work without them and that
only this skill's rules apply.

## Before you hand over

| Question | If not | Action |
|---|---|---|
| Does each function or class sit in one named layer? | the architecture is drifting | move it to its layer |
| Does it import only inwards? | `make check-architecture` fails | invert through an interface in `adapters/` |
| Is it clear what depends on it? | a hidden coupling | make the caller explicit or split |
| Does it have the tests its layer needs? | an untested decision | add the test from the layer table |
| Does it have one reason to change (`CC-SRP`)? | it does two jobs | split it |

## Boundary & Related Skills

**Owns:** the code-principles catalogue, the single source for code principles, best practices
and anti-patterns; code structure inside a service: the four layers, the dependency law, component
organisation, what to test per layer.
**Delegates:** TDD ritual → `superpowers:test-driven-development`; system design, topology,
contracts and ADRs → `architecture`; domain model → `conceptual-modelling`; LinkML authoring and
`make generate-models` → `linkml-engineering`; tooling, CI and import-linter contracts →
`project-setup`; Gherkin → `bdd-gherkin`; commit and PR mechanics → `meaningfy-git-workflow`;
sensitive-data interaction safety → `guardrails`.
**Related:** `architecture`, `meaningfy-code-review`, `bdd-gherkin`, `guardrails`,
`conceptual-modelling`, `linkml-engineering`, `ci-cd-delivery`, `meaningfy-git-workflow`, `epic-delivery`.

Answers `VER, ADQ, ROB` in `test-strategy`'s matrix (`references/software.md`, `references/ui.md`).
