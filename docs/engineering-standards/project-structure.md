# Project Structure (Engineering Standard)

Human-readable reference for how Meaningfy Python projects are laid out. The **operational**
guidance lives in the `cosmic-python` skill; this document is the readable canon.

> These are what folders **mean**, wherever they sit — not a fixed tree to copy verbatim.

## Root modules vs. /src

A repo contains one or more **root modules** (top-level packages, one per deployable unit)
rather than a single `/src`. The Cosmic Python book uses a single `/src` with `/domain` and
`/service_layer`; we map those onto our canonical names below.

## Scaling up: component-first for larger projects

A small service stays one level (just the layers below). A larger project is organised
**component-first** — `<root>/<component>/{models,adapters,services,entrypoints}` plus one inward-looking
`core`/`commons` component imported by all (`cosmic-python:PR-COMPONENT-FIRST`). Layers live *inside* each
component; never the reverse, and never two layouts in parallel (`cosmic-python:AP-PARALLEL-LAYOUTS`).
Component + tier boundaries are enforced and **groomed** by import-linter — see
[`project-setup` architecture guardrails](../../skills/project-setup/references/architecture-guardrails.md).

## Layers inside a module (or component)

| Folder | Holds | Depends on |
|--------|-------|-----------|
| `models/` | Domain entities, value objects, domain services. No I/O, no frameworks. | — |
| `adapters/` | Persistence and I/O (repositories, gateways, clients). | `models` |
| `services/` | Application/use-case orchestration; units of work, transaction boundaries. | `models`, `adapters` |
| `entrypoints/` | Primary/driving adapters that drive the app. | `services` |

**Dependency direction (strict):** `entrypoints → services → models`, and `adapters → models`.
`models` never imports from `services`/`adapters`/`entrypoints`.

**Canonical vocabulary:** `models/` = the book's `/domain`; `services/` = the book's
`/service_layer`. Use the canonical names in code.

### entrypoints/ sub-taxonomy
`api` (handlers) · `openapi` (OpenAPI v3, API-first via Connexion) · `ui` (Flask pages) ·
`crawlers` (Scrapy) · `dags` (Airflow) · `cli` (Click).

## Tests

`tests/` mirrors the code structure: `tests/unit/`, `tests/features/` (Gherkin `.feature` —
acceptance criteria), `tests/steps/` (step defs), `tests/test_data/` (sparingly). `conftest.py`
holds shared fixtures.

## Key files

`config.py` (env-var interface; logging) · `manage.py` (CLI to run/manage the app) ·
`Makefile` (common commands) · `Dockerfile` · `setup.cfg`/`pyproject.toml` · `README.md` ·
`docs/` (Antora/AsciiDoc or Sphinx).

## The four design patterns

- **Repository** — abstraction over persistent storage.
- **Unit of Work** — atomic operations / transaction boundary.
- **Service Layer** — where use cases begin and end (distinct from *domain* services).
- **Aggregate** — enforces invariants over a cluster of entities.

Source: *Architecture Patterns with Python* (Percival & Gregory) — https://www.cosmicpython.com/book.
Operational detail and enforcement: the `cosmic-python` skill and the `architecture` skill (for
system-level contracts).
