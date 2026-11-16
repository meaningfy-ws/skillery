# CI and infra

## CI philosophy

Workflows are thin (D12): every step calls a `make` target, never an inline tool, so green locally
means green in CI. `ci.yaml` fails fast: `check-quality` (lint, typecheck, `check-architecture`,
the shared checks), `test` (coverage ≥ 80 % from the Makefile's `COV_FLAGS`), `clean-code`. Sonar
runs only when `SONAR_TOKEN` is set, so forks and new repos stay green.

## The CI-automatable gates

| Gate | `make` target | Archetype |
|---|---|---|
| `openspec validate --strict` | `validate-spine` | all, once `openspec/` has changes |
| codegen in sync (regenerate from `model/`, fail on a diff) | `generate-models` + diff | product |
| architecture; coverage ≥ 80 %; code review | `check-architecture`; `test`; `code-review` | product, library |

The clarity gate is never a CI step: CI may remind that the PLAN passed it, never claim to enforce
it. A `doc-only` repo has no `ci.yaml`: `docs.yaml`, the spine validate and its link checks.

Service containers when the job shares one datastore; testcontainers when each test needs a clean
instance. Keep `_reusable-tests.yml` only when several triggers or repos run the same tests;
otherwise delete it. `docs.yaml` builds on PRs, deploys to Pages only from the default branch.

## The CD seam

Deploy is `ci-cd-delivery`'s. A deployable product gets a marked `deploy.yaml` TODO stub, never a
guessed workflow, until DevOps ratifies its §6; then render its templates and delete the stub. A
library or doc-only repo gets none. Secrets never live in the repo.

## Infra

`infra/` at the root (D11), multistage `docker/Dockerfile` (uv builder → slim non-root runtime).
Two gotchas: the dockerignore is `infra/docker/Dockerfile.dockerignore`, since a root one is ignored
for a nested Dockerfile; `.env` is `infra/.env`, every Make docker target passes `--env-file
infra/.env`, and `make check-env` fails early with the fix. Committed: `infra/.env.example`, an
optional `infra/.env.common` (non-secret values), `.secrets.example`. Ignored by git and the
dockerignore: the real `infra/.env` and `.secrets`. Only a value safe in a public PR is committed.
