# Testing setup

Tests are a sibling of the package, by tier: `tests/unit/` (mirrors the code tree),
`tests/feature/<capability>/` (pytest-bdd, steps next to the `.feature`; mirrors the business
capabilities, which hint at the import-linter components), `tests/e2e/`, `tests/integration/`,
`tests/test_data/`.

- **Markers by path** (D5): `pytest_collection_modifyitems` in `tests/conftest.py` stamps each
  test's marker from its folder. Never a per-file `pytestmark`: in a `conftest.py` it is silently
  ignored (a conftest is a plugin, not a test module). Register every marker (`--strict-markers`).
- **Lanes**: `make test-unit`, `test-feature`, `test-integration`, `test-e2e` filter with `-m`;
  `make test` runs all with coverage. `ci-quick` (quality and unit) on every push, `ci-full`
  (`check-all` and `clean-code`) on merge.
- **Test data**: `test_data/` only for fixtures awkward to build in code, loaded with the root
  conftest's `load_text_file`; model objects follow rule 6 of `cosmic-python`'s testing-checklist.md.
  A fixture used by one tree lives in its nearest `conftest.py`.
- **Datastores**: testcontainers in a module-scoped fixture, flushed per test, marked integration or
  e2e by path, so outside the fast lane.
- **Coverage** ≥ 80 % on the package. The skeleton's `__main__.py` stub carries
  `# pragma: no cover`; remove it when you replace the stub.
