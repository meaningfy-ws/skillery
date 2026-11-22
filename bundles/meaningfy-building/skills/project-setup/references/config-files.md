# Root config files

Each tool owns one root file (D2); `pyproject.toml` holds only `[project]`, `[dependency-groups]`,
`[build-system]` and `[tool.uv.build-backend]`. The templates in `assets/templates/root/` hold
each file's content, `scripts/scaffold.sh` the placeholders. What they cannot show:

- **No-src** (D1): `module-root = ""`, `pythonpath = .`, `mypy_path = .`, `source = <pkg>` in
  `.coveragerc`, `sonar.sources = <pkg>/`, no `cd src` in the Makefile.
- **Install** (D3): runtime dependencies pinned `==`; `make install` runs `uv sync --all-groups
  --locked`, needs `uv` on PATH (else prints the install link, never installs uv) and never
  writes the lock: a stale `uv.lock` fails, `make lock` is the only writer.
- **Versions**: Ruff's `target-version` and mypy's `python_version` come from `--python`, never
  hard-coded; `VERSION` is the one version source (`cosmic-python:PR-SSOT-DRY`), mirrored in
  `pyproject.toml`.
- **Pin refresh**: also `ui/pyproject-playwright-deps.tmpl` (PyPI) and `ui/package-*.json.tmpl`
  (npm), from each registry's latest release.
- **Coverage flags** (D5) live only in the Makefile's `test` and `coverage-report` targets, never in
  `pytest.ini`. pre-commit runs Ruff only; mypy and import-linter run in `check-quality` and CI.

## Suppressions

A `# noqa` or `# nosemgrep` comment (also `# ruff: noqa` and `# flake8: noqa`) names the code or
rule it silences and ends with ` -- <reason>`: `# noqa: PLR2004 -- status code from the spec`.
`make check-semgrep` fails one without a reason (`mfy-suppression-without-reason`).

## Migrating an existing repo's `pyproject.toml`

1. Move each `[tool.*]` block into its root file (`ruff.toml`, `mypy.ini` with overrides as
   `[mypy-pkg.mod]`, `pytest.ini`, `.coveragerc`); delete the moved blocks.
2. Poetry → uv: dependency tables into `[project]` and `[dependency-groups]`, `[build-system]` to
   `uv_build`, `[tool.uv.build-backend]` with `module-name` and `module-root = ""`, drop
   `[tool.poetry]` and `poetry.lock`, run `uv lock`.
3. The `/src` lift: `git mv src/<pkg> <pkg>` (`src/dags/` becomes `<pkg>_dags/`, `src/infra/`
   becomes `infra/`), then re-point every no-src setting above.
4. `make install && make check-all` passes.
