# Testing Standard (Engineering Standard)

Human-readable canon for how Meaningfy projects test. This document **narrates and points** — the
operational rules live in the skills it links. It carries no rule those skills own.

Authorities:

- [`project-setup`](../../skills/engineering/project-setup/SKILL.md) — wires the test layout,
  markers, CI lanes, and the coverage gate ([`references/testing-setup.md`](../../skills/engineering/project-setup/references/testing-setup.md)).
- [`cosmic-python`](../../skills/engineering/cosmic-python/SKILL.md) — per-layer test patterns
  ([`references/example-testing-patterns.md`](../../skills/engineering/cosmic-python/references/example-testing-patterns.md)).
- [`bdd-gherkin`](../../skills/ai-coding/bdd-gherkin/SKILL.md) — `.feature` authoring and test data.

## The test taxonomy

Four test types, each with its own marker and CI lane. The marker is applied **by directory path**,
not by per-file decorators (the scaffold's conftest hook — see the `project-setup` testing-setup
reference for the mechanism).

| Type | Marker | May do | May NOT do | CI lane |
|------|--------|--------|------------|---------|
| **Unit** | `unit` | Test one module in isolation; mirrors the code tree. | No I/O, no network, no datastore. | fast lane (every push) |
| **Feature (BDD)** | `feature` | pytest-bdd `.feature` + step defs; mirrors business capabilities. | No implementation detail in the `.feature` (no SQL/API paths/class names). | fast lane |
| **Integration** | `integration` | Exercise an adapter against a real dependency (datastore, queue). | Not the place for business-logic assertions. | integration lane (needs a running datastore / testcontainers) |
| **e2e** | `e2e` | Drive a near-real stack end to end. | Kept few; slow. | slow lane |

Which layer gets which test is owned by
[`cosmic-python`](../../skills/engineering/cosmic-python/SKILL.md) (models/adapters/services/
entrypoints each test their own responsibilities). BDD scenario authoring is owned by
[`bdd-gherkin`](../../skills/ai-coding/bdd-gherkin/SKILL.md).

## Test data & conftest conventions

- **`test_data/`** holds fixtures/sample files, used sparingly; load them via the `load_text_file`
  helper rather than inlining large blobs.
- **conftest scope** — shared fixtures and the marker-injection hook live in `tests/conftest.py`;
  keep fixture scope as narrow as the tests need.
- **polyfactory** for fabricating model instances; **testcontainers** for spinning up real
  dependencies in the integration lane.

The exact layout, the conftest hook, and the fixture wiring are owned by
[`project-setup`](../../skills/engineering/project-setup/references/testing-setup.md) — this doc does
not restate them.

## Tools

`pytest` + `pytest-bdd` (runner + BDD), `polyfactory` (test-data factories), `testcontainers`
(real dependencies for integration/e2e), `pytest-cov` (coverage), `tox` (environments),
`import-linter` (architecture boundaries, not a test type but a CI gate).

## The coverage gate

Coverage is **≥ 80%** on production code, higher on new/critical code, and must not drop below the
prior level. It runs in CI; the gate definition is shared with
[dod-quality-gates.md](../ai-coding/dod-quality-gates.md) and owned operationally by
[`project-setup`](../../skills/engineering/project-setup/SKILL.md).
