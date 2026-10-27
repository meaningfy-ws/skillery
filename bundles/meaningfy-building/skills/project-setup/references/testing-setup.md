# Testing Setup

How the scaffold wires tests: the directory layout, the marker-injection hook,
how Make targets map to markers, the TDD+BDD loop, where features live, and the
coverage gate. Implements decisions **D5** (test pyramid + hook) and **D6**
(TDD+BDD) in `references/decisions.md`.

## Directory layout

Tests live in a **sibling** `tests/` directory (never inside the package — D1,
no `/src`). The tree is split by test type; each type has its own marker.

```
tests/
├── conftest.py        # marker-injection hook + shared fixtures + load_text_file
├── unit/              # marker: unit        — fast, no I/O; mirrors the CODE tree
│   └── test_smoke.py
├── feature/           # marker: feature     — pytest-bdd (.feature + step defs)
│   ├── example.feature                       # mirrors BUSINESS capabilities
│   └── test_example.py
├── e2e/               # marker: e2e         — near-real stack
├── integration/       # marker: integration — needs a running datastore
└── test_data/         # fixtures/sample files, used sparingly
```

Two trees, two mirroring rules:

- `tests/unit/` **mirrors the code tree** — `tests/unit/<component>/test_<module>.py`
  tracks `<<PACKAGE>>/<component>/<module>.py`.
- `tests/feature/` **mirrors business capabilities** — `tests/feature/<capability>/`
  holds the `.feature` files for one capability. These capability names also hint
  at the import-linter component names (see `architecture-guardrails.md`).

## The marker-injection hook (and the conftest gotcha)

Markers are applied **automatically by file path** — no per-file `pytestmark`,
no decorators on test functions. The hook lives in `tests/conftest.py`:

```python
def pytest_collection_modifyitems(items: list) -> None:
    for item in items:
        path = str(item.fspath)
        for directory, marker in _MARKER_BY_DIR.items():   # "/unit/" -> "unit", ...
            if directory in path:
                item.add_marker(getattr(pytest.mark, marker))
                break
```

**Gotcha (the whole reason the hook exists):** a `pytestmark = pytest.mark.unit`
at the top of a `conftest.py` is **silently ignored**. A `conftest.py` is loaded
as a *plugin*, not a *test module*, so module-level `pytestmark` never runs. The
collection hook is the supported way to tag a whole tree. (Putting `pytestmark`
in an actual `test_*.py` *does* work, but we avoid it: the hook keeps the rule in
one place.)

Register every marker in `pytest.ini` under `[pytest] markers` — with
`--strict-markers` on, an unregistered marker is an error:

```ini
[pytest]
pythonpath = .
testpaths = tests
addopts = -v --strict-markers --tb=short
asyncio_mode = auto
markers =
    unit: fast, no I/O; domain/service/adapter tests
    feature: BDD feature tests (pytest-bdd step definitions)
    e2e: end-to-end tests against a near-real stack
    integration: requires a running datastore
```

## Make targets map to markers

The Makefile filters with `-m` so each layer runs independently. Coverage flags
live **only** in `test` / `coverage-report`, never in `pytest.ini` (keeps a bare
`pytest` fast).

| Target | Command | Runs |
|--------|---------|------|
| `make test` | `pytest <cov flags>` | everything, with coverage |
| `make test-unit` | `pytest -m unit` | the fast layer |
| `make test-feature` | `pytest -m feature` | BDD scenarios |
| `make test-integration` | `pytest -m integration` | needs a datastore |
| `make test-e2e` | `pytest -m e2e` | near-real stack |

CI runs the cheap layer on every push (`ci-quick` → `test-unit`) and the full
stack on merge (`ci-full` → `test`). The path-based split is what makes this
bookkeeping-free.

## TDD + BDD workflow

- **TDD** — `superpowers:test-driven-development`. RED → GREEN → REFACTOR, one
  layer at a time. Write the failing unit test before the production code; let
  it drive the smallest implementation that passes.
- **BDD** — the `bdd-gherkin` skill. Write `.feature` files in business language
  from the EPIC's acceptance criteria **before** implementation. Prefer
  `Scenario Outline` + `Examples` for data-driven coverage. Step definitions sit
  next to the feature.

The two compose: BDD features pin the observable behaviour of a capability; unit
tests pin the internals of each layer. Features come from acceptance criteria;
unit tests come from the RED-GREEN loop.

## Where features and step defs live

A capability is a folder under `tests/feature/`. Each `.feature` file has a
matching `test_*.py` that binds its scenarios and provides the steps:

```python
from pytest_bdd import given, parsers, scenarios, then, when

scenarios("example.feature")          # binds every scenario in the sibling file

@given(parsers.parse('a visitor named "{name}"'), target_fixture="visitor_name")
def visitor_named(name: str) -> str:
    return name
```

Use `scenarios("file.feature")` to bind a whole file in one line; reach for the
explicit `@scenario(FEATURE, "scenario title")` form only when you need a
per-scenario test function (e.g. to mark or parametrise one scenario).

## Writing your first feature (worked example)

1. **State the capability in business language** —
   `tests/feature/greeting/visitor_greeting.feature`:

   ```gherkin
   Feature: Greeting a visitor
     As a service operator
     I want every visitor to receive a personalised greeting
     So that the service feels welcoming

     Scenario Outline: Greet visitors with different names
       Given a visitor named "<name>"
       When the visitor is greeted
       Then the greeting reads "<greeting>"

       Examples:
         | name | greeting    |
         | Ada  | Hello, Ada! |
   ```

2. **Write the steps** in `tests/feature/greeting/test_visitor_greeting.py`,
   pointing `@when` at the real service:

   ```python
   from pytest_bdd import given, parsers, scenarios, then, when
   from <<PACKAGE>>.greeting.services import greet

   scenarios("visitor_greeting.feature")

   @given(parsers.parse('a visitor named "{name}"'), target_fixture="name")
   def a_visitor(name): return name

   @when("the visitor is greeted", target_fixture="greeting")
   def greeted(name): return greet(name)

   @then(parsers.parse('the greeting reads "{expected}"'))
   def reads(greeting, expected): assert greeting == expected
   ```

3. **Run it** — `make test-feature`. RED until `greet` exists; implement the
   smallest `greet`, GREEN, then refactor.

The shipped `example.feature` + `test_example.py` are a runnable copy of this,
wired to an inline stub so the skeleton is green before any real code exists.

## Test-data and fixture conventions

- **`test_data/` sparingly** — only for fixtures awkward to build in code (real
  payloads, sample documents). Load via the `load_text_file(relative_path)`
  helper in the root conftest; do not scatter `open()` calls.
- **polyfactory** for domain objects — subclass `ModelFactory` per model and
  call `.build()`. Keeps tests resilient to model changes and free of brittle
  hand-built literals:

  ```python
  from polyfactory.factories.pydantic_factory import ModelFactory

  class UserFactory(ModelFactory):
      __model__ = User

  user = UserFactory.build(email="a@example.com")   # other fields auto-filled
  ```

- **testcontainers** for integration/e2e datastores — spin a real container in a
  module-scoped fixture, flush and close per test. The root conftest ships a
  commented Redis example to copy. These tests carry the `integration`/`e2e`
  marker (by path) and are excluded from the fast CI lane.
- **Scope** — fixtures local to one tree go in the nearest `conftest.py`; only
  truly shared fixtures go in `tests/conftest.py`.

## Coverage gate (≥80%)

`.coveragerc` measures the package; the `test` target enforces the threshold:

```ini
# .coveragerc
[report]
fail_under = 80
show_missing = true
```

CI fails when coverage on the package drops below 80%. New or critical code
should aim higher. Keep coverage flags in the `test`/`coverage-report` Make
targets so a plain `pytest` (and the TDD inner loop) stays fast.
