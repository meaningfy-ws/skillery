# Root Config Files — Precise Specification

Per-file spec for every tool-config file the scaffold drops at the **repository root**. This
implements decisions **D1** (no `/src`), **D2** (config in dedicated root files; minimal
`pyproject.toml`), **D3** (Poetry + dependency groups), **D4** (Ruff), **D5** (test pyramid,
coverage out of `pytest.ini`).

The golden rule: **`pyproject.toml` stays minimal; each tool owns one root file.** A new
contributor finds any tool's config by its filename — no `[tool.*]` archaeology.

## Template → rendered-path map

Templates that render to a dotfile carry a `dot-` prefix. Templates needing placeholder
substitution end in `.tmpl`. Plain-named templates are copied verbatim.

| Template (under `assets/templates/root/`) | Renders to (repo root) | Substitution? |
|-------------------------------------------|------------------------|---------------|
| `pyproject.toml.tmpl`                      | `pyproject.toml`       | yes (`.tmpl`) |
| `ruff.toml.tmpl`                           | `ruff.toml`            | yes (`.tmpl`, `<<PYTHON_VERSION_NODOT>>`) |
| `mypy.ini.tmpl`                            | `mypy.ini`             | yes (`.tmpl`, `<<PYTHON_VERSION>>`) |
| `pytest.ini`                               | `pytest.ini`           | verbatim      |
| `dot-coveragerc`                           | `.coveragerc`          | yes (`<<PACKAGE>>`) |
| `dot-pre-commit-config.yaml`               | `.pre-commit-config.yaml` | verbatim   |
| `dot-importlinter.tmpl`                    | `.importlinter`        | yes (`.tmpl`) |
| `sonar-project.properties.tmpl`            | `sonar-project.properties` | yes (`.tmpl`) |
| `dot-gitignore`                            | `.gitignore`           | verbatim      |
| `Makefile.tmpl`                            | `Makefile`             | yes (`.tmpl`) |
| `VERSION`                                  | `VERSION`              | verbatim      |
| `LICENSE`                                  | `LICENSE`              | verbatim      |

> `.importlinter` **is** rendered here, as part of the root config block (scaffold step 1).
> Only its *content* rationale — the layer/tier contracts — lives in
> `architecture-guardrails.md`.

### Placeholders (double-angle) — canonical registry

This is the **single canonical set** of placeholders the scaffolder substitutes (see
`scripts/scaffold.sh` `render()`). Other references link here rather than re-listing them.

| Placeholder | Meaning | Example |
|-------------|---------|---------|
| `<<PACKAGE>>` | Top-level import package | `myproject` |
| `<<PROJECT_NAME>>` | Human project name | `My Project` |
| `<<PROJECT_SLUG>>` | Distribution / repo slug | `my-project` |
| `<<PYTHON_VERSION>>` | Minimum Python (dotted) | `3.12` |
| `<<PYTHON_VERSION_NODOT>>` | Python version, no dot (Ruff `target-version`) | `312` |
| `<<GITHUB_ORG>>` | GitHub org | `meaningfy-ws` |
| `<<DEFAULT_BRANCH>>` | PR target branch | `develop` |
| `<<DESCRIPTION>>` | One-line description | `Order processing REST API` |
| `<<YEAR>>` | Current year (licence headers) | `2026` |

A simple `sed` swap of these placeholders must yield an immediately-working file.

## Per-file specification

### `pyproject.toml` (from `pyproject.toml.tmpl`)

- **Purpose:** packaging metadata + dependency declaration only.
- **Responsibilities:** `[project]` (name=`<<PROJECT_SLUG>>`, version, description,
  `requires-python = ">=<<PYTHON_VERSION>>,<4.0"`, Apache-2.0 licence, classifiers, authors,
  maintainers); `[project.dependencies]` (runtime, pinned `==`); `[dependency-groups]`
  (`dev`/`test`/`lint`, PEP 735); `[tool.poetry]` packages; `[build-system]` poetry-core.
- **Key settings & why:**
  - `packages = [{ include = "<<PACKAGE>>" }]` — **no-src adaptation**: NO `from = "src"`. The
    package sits at the repo root, so Poetry discovers it directly.
  - Three dependency groups mirror D3. `lint` = ruff, mypy, import-linter, radon, xenon. `test` =
    pytest, pytest-bdd, pytest-cov, pytest-asyncio, testcontainers, polyfactory, httpx. `dev` =
    pre-commit, linkml.
  - **No `[tool.ruff]`/`[tool.mypy]`/`[tool.pytest]`/`[tool.coverage]`** — every tool is configured
    in its own root file (D2). `[tool.poetry]` stays because it is packaging metadata, not tool config.
- **No-src adaptation:** drop `from = "src"`; the version lives in `VERSION` and is mirrored here.

### `ruff.toml` (from `ruff.toml.tmpl`)

- **Purpose:** single config surface for formatting + linting (replaces black + isort + flake8 +
  pylint, D4).
- **Key settings & why:** `line-length = 100` (house style);
  `target-version = "py<<PYTHON_VERSION_NODOT>>"` (rendered from `--python`, so it tracks the
  project interpreter automatically — no more hardcoded `py312`); `lint.select` = the D4 set
  `["E","F","I","B","UP","SIM","C90","N","RUF100"]`; `lint.mccabe.max-complexity = 10` (per-function
  gate; radon/xenon cover trends); `ignore = ["E501"]` (formatter owns line length — avoid
  double-flagging); `[format]` double quotes, space indent. A commented `[lint.per-file-ignores]`
  example shows the justified-exception pattern (e.g. `N802` on a config module).
- **No-src adaptation:** none in the file; the Makefile passes the package path
  (`ruff check <<PACKAGE>> tests`) instead of an `src/`-rooted path.

### `mypy.ini` (from `mypy.ini.tmpl`)

- **Purpose:** strict-ish static type checking.
- **Key settings & why:** `python_version = <<PYTHON_VERSION>>` (rendered from `--python`, so it
  tracks the project interpreter automatically — no more hardcoded `3.12`); `check_untyped_defs`,
  `no_implicit_optional`,
  `warn_unused_configs`, `warn_unused_ignores`, `warn_return_any`, `warn_unreachable`,
  `implicit_reexport = False`, `pretty` — a strict strictness profile. `[mypy-tests.*]` relaxes
  `disallow_untyped_defs` for fixtures. A commented per-module override block shows how to suppress
  third-party typing gaps narrowly (preferred over a blanket `ignore_missing_imports`).
- **No-src adaptation:** `mypy_path = .` + `explicit_package_bases = True` +
  `namespace_packages = True` resolve the flat root package without an `src/` prefix.

### `pytest.ini`

- **Purpose:** test discovery, markers, async mode, log format.
- **Key settings & why:** `testpaths = tests`; `markers` = `unit`, `feature`, `e2e`, `integration`
  (applied automatically by `tests/conftest.py` via `pytest_collection_modifyitems` — **never**
  per-file `pytestmark`); `addopts = -v --strict-markers --tb=short`; `asyncio_mode = auto`;
  structured `log_format`. **No `--cov`** (D5) — coverage lives only in the Makefile `test` and
  `coverage-report` targets so a bare `pytest` stays fast.
- **No-src adaptation:** `pythonpath = .` makes the root-level package importable without an `src/`
  entry on the path.

### `.coveragerc` (from `dot-coveragerc`)

- **Purpose:** coverage measurement + the ≥80% gate.
- **Key settings & why:** `branch = True`; `source = <<PACKAGE>>` (**no-src**: the package, not
  `src`); `omit = */__init__.py`; `fail_under = 80`; `exclude_lines` skip `pragma: no cover`,
  `TYPE_CHECKING`, `...` stubs, `__repr__`, `raise NotImplementedError`.
- **No-src adaptation:** `source = <<PACKAGE>>` instead of a package rooted under `src/`.

### `.pre-commit-config.yaml` (from `dot-pre-commit-config.yaml`)

- **Purpose:** fast local guard before each commit.
- **Key settings & why:** Ruff only — `ruff-check --fix` then `ruff-format`, pinned `rev`
  (keep in sync with the ruff pin in `pyproject.toml`). mypy + import-linter run in CI / `make
  check-quality`, not on every commit, to keep commits snappy.

### `sonar-project.properties` (from `sonar-project.properties.tmpl`)

- **Purpose:** SonarCloud project + report wiring.
- **Key settings & why:** `projectKey = meaningfy-ws_<<PROJECT_SLUG>>`,
  `organization = meaningfy-ws`; `sources = <<PACKAGE>>/`, `tests = tests/`;
  `python.coverage.reportPaths = coverage.xml`, `python.xunit.reportPath = test-results.xml`
  (both produced by `make test`); exclusions for tests, docs, infra.
- **No-src adaptation:** `sonar.sources = <<PACKAGE>>/` instead of `src/`.

### `.gitignore` (from `dot-gitignore`)

- **Purpose:** keep generated artifacts **and secrets** out of git.
- **Key settings & why:** standard Python ignores **plus** the hard-won set: `.venv`, `data/`,
  `reports/`, `.coverage`, `coverage.xml`, `test-results.xml`, `.import_linter_cache`,
  `.mypy_cache`, `.ruff_cache`, `.pytest_cache`, plus `.gitnexus`, `docs/build/`,
  `node_modules/`, and local agent overrides.
- **Secrets / layered-env hygiene:** ignores `.env`, `.env.*`, `.secrets`, `*.secrets`, and the
  infra-local `infra/.env` / `infra/.secrets`, while **re-including** the committed templates via
  negations (`!.env.example`, `!*.secrets.example`). The layered-env contract: `.env.example` and
  `.secrets.example` are **committed** (placeholders, structure, no real values); the real `.env`
  and `.secrets` are **git-ignored** developer-local files. A value safe in a public PR may live in
  an `*.example` file; anything sensitive lives only in the ignored counterparts.

### `Makefile` (from `Makefile.tmpl`)

- **Purpose:** the central developer UX; CI calls these targets verbatim (D12).
- **Responsibilities (sections):**
  - **Install/build:** `install-poetry`, `install` (all groups, does **not** lock), `lock`, `build`.
  - **Mutating quality:** `format`, `lint-fix`, `pre-commit`.
  - **Validation:** `lint`, `typecheck`, `check-architecture`, `test`, `test-unit`,
    `test-feature`, `test-e2e`, `test-integration`.
  - **Aggregates:** `check-quality` (lint+typecheck+architecture), `check-all` (+test),
    `ci-quick` (quality+unit), `ci-full` (check-all+clean-code).
  - **Run:** `run` (`poetry run python -m <<PACKAGE>>`; tailor per archetype).
  - **Reports (opt-in):** `coverage-report`, `quality-report`.
  - **Clean code (separate):** `complexity`, `maintainability`, `clean-code`.
  - **Docs (live):** `install-antora`, `build-docs`, `preview-docs`, `clean-docs`.
  - **Docker (live):** `up`, `down`, `rebuild`, `logs`, `watch`, `check-env`.
  - **Utilities:** `clean`.
- **Key settings & why:** every Python tool runs through `poetry run`. `COV_FLAGS` is appended only
  in coverage-aware targets (mirrors D5). `help` is **auto-generated** from `## ` comments via a
  `grep`/`awk` one-liner — adding a documented target needs no edit to a manual help block.
- **No-src adaptation:** no `cd src` anywhere; `PACKAGE_NAME = <<PACKAGE>>` at the root,
  `TEST_PATH = $(REPO_ROOT)/tests`, config referenced by its dedicated root file
  (e.g. `--config $(REPO_ROOT)/.importlinter`).

### `VERSION`

- **Purpose:** single source of truth for the project version (seed `0.1.0`).
- **Why a file:** decouples the version from `pyproject.toml` and lets tooling/CI read it
  trivially. Keep `pyproject.toml`'s `version` in sync (or add a poetry version plugin).

### `LICENSE`

- **Purpose:** the project licence text, rendered verbatim to the repo root.
- **Key settings & why:** full **Apache-2.0** text. Matches the `license = { text = "Apache-2.0" }`
  field in `pyproject.toml` and the `Apache-2.0` badge in the README. Copied verbatim (no
  placeholders).

### `.importlinter` (from `dot-importlinter.tmpl`)

- **Purpose:** architecture-boundary contracts enforced by `make check-architecture` (D7).
- **Rendered here**, in the root config block — but its **content rationale** (layer contracts per
  component, tier `forbidden`/`independence` contracts) lives in `architecture-guardrails.md`.
  Optional layer names keep an empty skeleton green.

## Migrating an existing repo's `pyproject.toml`

> Part of the brownfield workflow — `modernizing-existing-projects.md` step 3 sequences this
> among the other migrations. When normalising a repo that crammed everything into `pyproject.toml`:

1. **Extract each `[tool.*]` block into its dedicated root file**, translating the table syntax:
   - `[tool.ruff]` / `[tool.ruff.lint]` → `ruff.toml` (`[lint]`, `[format]` sections).
   - `[tool.mypy]` → `mypy.ini` (`[mypy]`; per-module `[[tool.mypy.overrides]]` → `[mypy-pkg.mod]`).
   - `[tool.pytest.ini_options]` → `pytest.ini` (`[pytest]`).
   - `[tool.coverage.run]` / `[tool.coverage.report]` → `.coveragerc` (`[run]`, `[report]`).
2. **Delete the moved `[tool.*]` blocks** from `pyproject.toml`, leaving only `[project]`,
   `[tool.poetry]`, `[dependency-groups]`, `[build-system]`.
3. **Drop the `/src` layout:** move `src/<pkg>/` → `<pkg>/`; in `pyproject.toml` change
   `packages = [{ include = "<pkg>", from = "src" }]` to `{ include = "<pkg>" }`; set
   `pythonpath = .` in `pytest.ini`, `source = <pkg>` in `.coveragerc`, `sonar.sources = <pkg>/`.
4. **Re-point the Makefile:** remove every `cd src`; reference config by root filename.
5. **Verify:** `make install && make check-all` must pass green on the migrated tree.
