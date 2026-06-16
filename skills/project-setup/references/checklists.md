# Checklists

Two checklists for the scaffold: **(a)** the ordered scaffolding steps, and **(b)** the
Definition of Done. Tick every box before handing off. Pillar-gated steps (docs, infra, CI,
multi-component) apply only if the interview selected them.

> **Existing repo?** This checklist is the greenfield path. To modernise an existing repo, follow
> `modernizing-existing-projects.md` (assess with `--dry-run` → plan → apply with `--skip-existing`
> → verify); the (b) Definition of Done below still applies once the gaps are closed.

## (a) Scaffolding checklist (ordered)

- [ ] **Interview** — run `references/interview.md`; resolve identity, archetype, runtime,
      frameworks, datastores, pillars, governance. Make no silent assumptions.
- [ ] **Confirm** — echo back the resolved profile + the file tree; get an explicit "yes".
- [ ] **Git** — ensure a git repo exists (`git init` if empty); set the default branch to
      `<<DEFAULT_BRANCH>>`.
- [ ] **Skeleton** — run `scripts/scaffold.sh -p <package> -n "<Project Name>" -a <archetype>`
      (the `-a` flag picks `service|library|pipeline|cli|docs-only`, which decides the
      entrypoints layer and any `<<PACKAGE>>_dags/`), or create the tree by hand from `layout.md`
      (single- or multi-component); add `__init__.py` to every package.
- [ ] **Root config** — render the root templates (`config-files.md`): `pyproject.toml`,
      `ruff.toml`, `mypy.ini`, `pytest.ini`, `.coveragerc`, `.pre-commit-config.yaml`,
      `sonar-project.properties`, `.gitignore`, `Makefile`, `VERSION`, `LICENSE`.
- [ ] **Architecture** — write `.importlinter` (`architecture-guardrails.md`); for
      multi-component, model `code-anatomy.md` first, then translate to contracts.
- [ ] **Tests** — drop the `tests/` tree with the marker-injecting `conftest.py` and one
      smoke unit test + one example feature (`testing-setup.md`).
- [ ] **Agentic** — render `AGENTS.md`; create the `CLAUDE.md` symlink (`ln -s AGENTS.md
      CLAUDE.md`); seed `.claude/memory/MEMORY.md`; render the blank `_templates/`
      (EPIC/PLAN/task); create the empty `.claude/memory/epics/` dir
      (`agentic-setup.md`).
- [ ] **Docs** (if selected) — Antora skeleton + playbooks (`antora-docs.md`).
- [ ] **Infra** (if selected) — `infra/` compose, Dockerfile, `Dockerfile.dockerignore`,
      `entrypoint.sh`, `.env.example` (`ci-and-infra.md`).
- [ ] **CI** (if selected) — `.github/workflows/ci.yaml` (+ `docs.yaml`), each calling `make`
      targets (`ci-and-infra.md`).
- [ ] **Install & verify** — `make install`; then `make check-all`.
- [ ] **First commit** — only on explicit developer consent; conventional message via the
      `meaningfy-git-workflow` skill.
- [ ] **Skillery + ponytail** — install the plugins so the `AGENTS.md` routing resolves:
      `/plugin marketplace add meaningfy-ws/skillery`;
      `/plugin install meaningfy-engineering meaningfy-ai-coding`;
      `/plugin install superpowers@claude-plugins-official`;
      `/plugin marketplace add DietrichGebert/ponytail && /plugin install ponytail@ponytail`.
- [ ] **First EPIC** (optional) — copy `_templates/EPIC.md` into
      `.claude/memory/epics/<name>/EPIC.md`, shape the bet, then derive `PLAN.md` (via
      `epic-planning`; gate the PLAN with `clarity-gate`).
- [ ] **Hand off** — summarise what was created, what is stubbed, and the next steps.

## (b) Definition of Done (the scaffold is complete when…)

- [ ] `make install` succeeds (all dependency groups; does **not** run `poetry lock`).
- [ ] `make check-all` is **green** on the empty skeleton (lint + types + architecture +
      placeholder test).
- [ ] `make lint` (ruff) and `make typecheck` (mypy) pass with no errors.
- [ ] `make check-architecture` passes — `.importlinter` contracts hold (optional layer names
      keep the empty skeleton green).
- [ ] `make test` runs and the placeholder unit test + example feature pass; coverage gate
      configured (≥80%).
- [ ] `AGENTS.md` exists and `CLAUDE.md` is a **symlink** to it (`ls -l CLAUDE.md` shows the
      arrow); the symlink is documented in the README.
- [ ] `.claude/memory/MEMORY.md` seeded (≤200 lines); `.claude/memory/_templates/`
      (EPIC/PLAN/task) rendered; the empty `.claude/memory/epics/` dir exists.
- [ ] **Skillery + ponytail installed** — the Meaningfy plugins and `ponytail` are present so the
      skill routing in `AGENTS.md` resolves (no unresolved skill references).
- [ ] **No `/src`** — the package is top-level; `pytest.ini` has `pythonpath = .`;
      `pyproject.toml` `packages` include has no `from`.
- [ ] `pyproject.toml` is **minimal** — only `[project]`, `[tool.poetry]`,
      `[dependency-groups]`, `[build-system]`; every other tool config is in its own root file.
- [ ] **Docs** (if selected): `make build-docs` produces a site under `docs/build/`.
- [ ] **Infra** (if selected): `infra/compose.yaml` validates (`docker compose … config`);
      `Dockerfile.dockerignore` co-located; `.env.example` present, real `.env` git-ignored.
- [ ] **CI** present: `ci.yaml` exists and calls `make` targets (mirrors the local gates).
- [ ] `README.md` is accurate — how to install, run, test, build docs; documents the symlink.
- [ ] `.gitignore` covers `.venv/`, caches, build artefacts, `infra/.env`, secrets.
- [ ] First commit is clean and conventional (only on developer consent).

## Smoke verification commands

Run from the repo root after scaffolding. These mirror the CI gates — green here means green in
CI.

```bash
make install                       # all dependency groups, no lock
make check-all                     # lint + typecheck + check-architecture + test (the umbrella gate)

# individual gates (if check-all is not yet defined or you want to isolate a failure)
make lint                          # ruff format --check + ruff check
make typecheck                     # mypy
make check-architecture            # poetry run lint-imports --config .importlinter
make test                          # pytest (markers stamped by tests/conftest.py)

# agentic + layout sanity
ls -l CLAUDE.md                    # → CLAUDE.md -> AGENTS.md
test -f .claude/memory/MEMORY.md && echo "MEMORY.md present"
ls -d <<PACKAGE>>/                 # top-level package exists (no src/)

# pillars (only if selected)
make build-docs                    # Antora site → docs/build/
docker compose -f infra/compose.yaml --env-file infra/.env config >/dev/null   # compose valid
```
