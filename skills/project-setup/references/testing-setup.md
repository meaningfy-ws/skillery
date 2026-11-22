# Testing setup

Tests are a sibling of the package, by tier: `tests/unit/` (mirrors the code tree),
`tests/feature/<capability>/` (pytest-bdd, steps next to the `.feature`; mirrors the business
capabilities, which hint at import-linter components), `tests/e2e/`, `tests/integration/`,
`tests/test_data/`, `tests/manual/` (`@manual` features, `bdd-gherkin`).

- **Markers by path** (D5): `pytest_collection_modifyitems` in `tests/conftest.py` stamps each
  test's marker from its folder. Never a per-file `pytestmark` (a `conftest.py` ignores it).
  Register every marker (`--strict-markers`).
- **Lanes**: `make test-unit`, `test-feature`, `test-integration`, `test-e2e` filter with `-m`;
  `make test` runs all with coverage. `make test-fast` skips slow tests (CI runs them);
  `make test-changed` runs the changed files' unit and feature tests. `ci-quick` each push,
  `ci-full` on merge.
- **UI tests**: rules in `ui-testing`; `scaffold.sh --ui-tool` sets them up.
- **Test data**: `test_data/` only for fixtures awkward to build in code; model objects follow
  rule 6 of `cosmic-python`'s testing-checklist.md. A tree's fixture lives in its nearest `conftest.py`.
- **Timeouts**: under xdist, pytest-timeout uses `timeout_method = signal` (a thread timeout kills
  the worker, CI hangs). Prove a new limit or dist mode on the PR's hosted runner.
- **Datastores**: testcontainers in a module-scoped fixture, flushed per test, marked by path
  (integration or e2e, outside the fast lane).
- **Coverage** ≥ 80 % on the package. Drop the `__main__.py` stub's `# pragma: no cover` when you replace it.
