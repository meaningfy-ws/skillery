# CI & Infra

How the scaffold wires Continuous Integration and local Docker infrastructure:
the thin-workflow philosophy, the `ci.yaml` walkthrough, service containers vs
testcontainers, the optional reusable-workflow pattern, SonarCloud + coverage,
the docs Pages deploy, and the `infra/` layout with its two gotchas.
Implements decisions **D11** (Docker + layered env) and **D12** (CI calls Make).

## Template → rendered-path map

Templates needing placeholder substitution end in `.tmpl`; the dockerignore is
copied verbatim (it has no placeholders and renders to a non-dot name).

| Template (under `assets/templates/`) | Renders to | Substitution? |
|--------------------------------------|------------|---------------|
| `ci/ci.yaml.tmpl`                     | `.github/workflows/ci.yaml`           | yes (code archetypes) |
| `ci/docs.yaml.tmpl`                   | `.github/workflows/docs.yaml`         | yes |
| `ci/deploy.yaml.stub.tmpl`            | `.github/workflows/deploy.yaml`       | yes (**deployable product only** — TODO stub) |
| `ci/_reusable-tests.yml.tmpl`         | `.github/workflows/_reusable-tests.yml` | yes (optional) |
| `infra/compose.yaml.tmpl`             | `infra/compose.yaml`                  | yes |
| `infra/docker/Dockerfile.tmpl`        | `infra/docker/Dockerfile`             | yes |
| `infra/docker/Dockerfile.dockerignore`| `infra/docker/Dockerfile.dockerignore`| verbatim |
| `infra/scripts/entrypoint.sh`         | `infra/scripts/entrypoint.sh`         | yes (placeholders inside) |
| `infra/env.example`                   | `infra/.env.example`                  | yes |

### Placeholders

These templates use the standard placeholders (chiefly `<<PACKAGE>>`, `<<PROJECT_NAME>>`,
`<<PROJECT_SLUG>>`, `<<PYTHON_VERSION>>`, `<<DEFAULT_BRANCH>>`, `<<GITHUB_ORG>>`). For the single
canonical registry of all placeholders, see **`config-files.md`** — don't maintain a divergent copy
here.

---

## CI philosophy: thin workflows that call Make (D12)

Every CI step invokes a `make` target — never an inline `ruff`/`mypy`/`pytest`
command — so "green locally" means "green in CI": you edit the Makefile once and
both sides follow. The workflow is the *trigger and environment*; the Makefile is
the *logic*.

**Baseline gates** wired into the scaffolded `Makefile`/`ci.yaml` for every
archetype:

```
check-quality  (lint + typecheck + check-architecture/import-linter)
+ test         (all markers + coverage ≥80%)
+ clean-code   (Xenon thresholds)
```

**Spine / archetype gates** — the target the gate set converges to as the spine
and product layers come online. These are **added per archetype** (they are not
all in the baseline template yet — wire them when the repo needs them):

```
+ validate-spine          (openspec validate --strict — STRUCTURAL; once openspec/ has changes)
+ generate-models + codegen-in-sync check   (PRODUCT archetype only)
+ code-review             (pre-PR review step)
```

`clarity-gate` is **never** a CI step — it is the human/agent semantic gate (see
[`dod-quality-gates.md`](../../../../docs/ai-coding/dod-quality-gates.md)); CI may
print a reminder that it must have passed, but does not score it.

### The CI-automatable gates (R8) — and the one that is NOT

CI runs the **CI-automatable** build-tier gates as `make` targets — this is the gate set, pinned
in [`../../../docs/ai-coding/dod-quality-gates.md`](../../../docs/ai-coding/dod-quality-gates.md):

| Gate | `make` target | Archetype |
|------|---------------|-----------|
| **`openspec validate --strict`** (structural — artifact shape + spec deltas) | `validate-spine` | all |
| **codegen-in-sync** (regenerate from `model/`, fail on diff) | `generate-models` + a diff check | **product** only |
| **architecture** (import-linter, layer direction) | `check-architecture` | code (product/library) |
| **coverage ≥80%** on production code | `test` (with `--cov-fail-under=80`) | code |
| **code review** (pre-PR review step) | `code-review` (or the meaningfy-code-review wrapper) | code |

> **`clarity-gate` is NOT a CI step.** It is the *semantic* gate that scores the PLAN (`design.md` +
> `tasks.md`) ≥9/10 — a human/agent judgement that cannot be reduced to a deterministic check. This
> is the **automation boundary** (single source:
> [`dod-quality-gates.md`](../../../docs/ai-coding/dod-quality-gates.md)). CI may **emit a reminder**
> ("confirm the PLAN passed clarity-gate before merge") but must never claim to enforce it.

A `doc-only` repo has no code CI: it gets `openspec validate --strict` (if it carries `openspec/`),
the docs build, and lightweight link/structure checks — no `ci.yaml`.

## `ci.yaml` job walkthrough

One `quality` job, on push and PR to `<<DEFAULT_BRANCH>>`:

| Step | Make target | Purpose |
|------|-------------|---------|
| Checkout (`fetch-depth: 0`) | — | full history for Sonar blame |
| Set up Python `<<PYTHON_VERSION>>` | — | pinned interpreter |
| Install Poetry (`pipx install poetry`) | — | dependency manager |
| Cache `~/.cache/pypoetry` | — | keyed on `poetry.lock` |
| Install | `make install` | all groups (dev, test, lint) |
| Lint | `make lint` | Ruff |
| Type check | `make typecheck` | mypy |
| Architecture | `make check-architecture` | import-linter |
| Test | `make test` | pytest + coverage → `coverage.xml` |
| Clean code | `make clean-code` | Xenon |
| Upload coverage | — | `coverage.xml`, `test-results.xml` artifacts |
| SonarCloud | — | only if `SONAR_TOKEN` is set |

`paths-ignore` skips runs for docs-only / metadata-only changes (`docs/**`,
`*.md`, `.claude/**`). A `concurrency` group cancels superseded runs on the same
branch/PR.

> **Fail-fast vs. report-all.** This template fails fast — the first red gate
> stops the job. An alternative runs each gate with `continue-on-error: true` and
> aggregates at the end, so one run surfaces *every* failure. Adopt the
> aggregation pattern if your reviewers prefer a single complete report; it
> costs a little more wall-clock but saves round-trips.

## Service containers vs testcontainers

Integration tests (`make test-integration`) need a live datastore. Two options:

| Approach | When | How |
|----------|------|-----|
| **Service containers** | The whole job shares one datastore; fast startup | `services:` block in `ci.yaml` (commented out by default); set `DATABASE_URL`/`REDIS_URL` env to reach `localhost:<port>` |
| **testcontainers** | Tests need isolated, disposable, or version-matrixed instances | `testcontainers` is in the `test` dependency group; tests spin up containers themselves — no YAML changes |

Default to **service containers** for a single shared dependency (the commented
`postgres` / `redis` blocks show this). Reach for **testcontainers** when each
test wants a clean instance or you want the same code path locally and in CI.

## The reusable-workflow option

`_reusable-tests.yml` is **optional** — delete it unless you need it. It factors
the test job behind `workflow_call` with a `test-target` input, so multiple
triggers can reuse one definition. This generalises a common
`_unit-tests.yml` / `_full-tests.yml` split, where a `tests.yml` dispatcher
chooses fast unit tests on feature branches and the full suite on PRs/`develop`.

| Use it when | Skip it when |
|-------------|--------------|
| Several triggers run the same tests (fast on push, full on PR) | One trigger, one test run (the inline `quality` job suffices) |
| You want a unit/full matrix split for fast feedback | Test suite is small/quick enough to always run whole |
| Multiple repos call a shared test workflow | Single repo |

Caller example (in a dispatcher workflow):

```yaml
jobs:
  unit:
    uses: ./.github/workflows/_reusable-tests.yml
    with: { test-target: test-unit }
    secrets: { SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }} }
```

## SonarCloud + coverage wiring

- `make test` writes `coverage.xml` (Cobertura) at the repo root; CI uploads it
  as an artifact and Sonar reads it.
- The Sonar step is **guarded by a secret check**: if `SONAR_TOKEN` is unset the
  step is skipped, so forks and brand-new repos stay green without Sonar config.
- `sonar-project.properties` (from the config-files pillar) points Sonar at the
  package and the coverage report. `fetch-depth: 0` gives Sonar full git history
  for accurate new-code/blame analysis.
- Coverage gate (`--cov-fail-under=80`) lives in the Makefile's `COV_FLAGS`, not
  in `pytest.ini` — so it fails the build via `make test` in CI too.

## Docs Pages deploy (`docs.yaml`)

A dedicated docs-deploy workflow. Triggered when `docs/**` (or the `Makefile`)
changes:

- **build** job: Node 22 → `make build-docs` → Antora site at `docs/build/site`.
  Runs on PRs too, so broken docs are caught before merge.
- **deploy** job: only on push to `<<DEFAULT_BRANCH>>`; uploads the Pages
  artifact and publishes via `actions/deploy-pages`. Needs `pages: write` +
  `id-token: write` and the `github-pages` environment.

Enable GitHub Pages with source = **GitHub Actions** (Settings → Pages). For
Read the Docs hosting instead, ship a `.readthedocs.yaml` that runs Antora to
`$READTHEDOCS_OUTPUT/html`.

## The CD seam (R10) — deploy is owned by `ci-cd-delivery`, not CI

CI (this pillar) covers build/test/lint/coverage/architecture/docs. **Continuous Delivery — the
deploy trigger, the reusable deploy mechanism, the release/image standard — is owned by the
[`ci-cd-delivery`](../../ci-cd-delivery/SKILL.md) skill**, and `project-setup` only *renders* its
templates. The two never overlap.

- **Deployable `product` →** the interview's deployable question (Q6.4) is **yes**. Per
  `ci-cd-delivery` §6, the §6 decisions (deploy-trigger standard, GHCR semver/sha images, the
  reusable mechanism home) are **not yet ratified by DevOps**. So `project-setup` scaffolds a
  clearly-marked **`deploy.yaml` TODO stub** (`ci/deploy.yaml.stub.tmpl`) plus the boundary docs —
  **never** a half-guessed runnable deploy workflow. Render the real template (and delete the stub)
  only after DevOps ratifies §6, via the `ci-cd-delivery` skill.
- **`library` / `doc-only` →** **no** deploy workflow at all.

Secrets never live in the repo; the stub carries placeholders + the three-repo boundary only.

---

## Infra layout (`infra/` at the repo root)

```
infra/
├── compose.yaml                       # local dev stack
├── .env.example                       # committed template (placeholders only)
├── .env                               # real, developer-local — GITIGNORED
├── docker/
│   ├── Dockerfile                     # multistage builder → slim runtime
│   └── Dockerfile.dockerignore        # co-located (the gotcha)
└── scripts/
    └── entrypoint.sh                  # optional seed + exec the app
```

A `src/`-based layout keeps infra under `src/infra/`; in the **no-src** layout it
moves to a **top-level `infra/`**, with a dedicated `docker/` subdir (cleaner than
a flat `src/infra/`).

### Two gotchas

1. **Dockerignore is co-located, not at the root.** Docker auto-discovers
   `<dockerfile>.dockerignore` next to the Dockerfile, so the ignore file is
   `infra/docker/Dockerfile.dockerignore`. A root `.dockerignore` would be
   ignored because the build context is the repo root but the Dockerfile is
   nested. Keep the build context small here (ship only the package + manifests).
2. **`.env` lives at `infra/.env`.** Compose is not run from the repo root, so
   every Make docker target passes `--env-file infra/.env` explicitly. The
   `check-env` guard target fails early with a copy-paste fix if it is missing.

### Multistage + non-root Docker rationale

| Choice | Why |
|--------|-----|
| **Builder stage** installs deps into an in-project `.venv` | dependency layer is cached unless `poetry.lock` changes; build tools (poetry) never reach the runtime image |
| **Runtime stage** is `python:<<PYTHON_VERSION>>-slim` | small attack surface; only the venv + package + entrypoint are copied in |
| **Non-root `appuser` (uid 1000)** | containers must not run as root (security baseline); writable `$HOME` for caches |
| **`PATH=/app/.venv/bin:...`** | the venv is active without `poetry run` at runtime |
| **No-src copy** (`COPY <<PACKAGE>> <<PACKAGE>>/`) | the package is at the repo root; build context is `../..` from `infra/` |
| **`ENTRYPOINT entrypoint.sh`** | one place for the optional seed step + `exec`-ing the app as PID 1 (clean signals) |

`ENVIRONMENT` build arg switches dependency installation: `development` pulls
all groups (for in-container tests/tooling), production installs `--only main`.

### Live development (`develop: watch:`)

`compose.yaml`'s `watch` block syncs `<<PACKAGE>>/` into the running container
(`make watch`) and triggers a rebuild when `pyproject.toml`/`poetry.lock` change,
so edits hot-reload without a manual rebuild.

## Layered env + secrets hygiene

Four roles, only sensitive values stay out of git:

| File | Committed? | Holds |
|------|-----------|-------|
| `infra/.env.example` | yes | placeholders, structure, NO real secrets |
| `infra/.env.common` (optional) | yes | non-secret shared values (ports, hostnames, flags) |
| `infra/.env` | **no — gitignored** | real, developer-local values |
| `.secrets.example` → `.secrets` | example yes, real no | CI / `act` tokens (`SONAR_TOKEN`, etc.) |

Rule of thumb: if a value would be safe in a public PR it may live in a committed
file; anything sensitive lives only in the gitignored `.env` / `.secrets`. The
dockerignore excludes `infra/.env`, `.env*`, and `*.secrets` so they never bake
into an image.

## Make docker targets

The `Makefile`'s Docker targets are **live**; all pass `--env-file infra/.env` (D11):

| Target | Action |
|--------|--------|
| `make check-env` | fail early if `infra/.env` is missing (prints the `cp` fix) |
| `make up` | `docker compose up -d` |
| `make down` | `docker compose down` |
| `make rebuild` | `up -d --build` |
| `make logs` | `logs -f` |
| `make watch` | `compose watch` (live sync / hot-reload) |
