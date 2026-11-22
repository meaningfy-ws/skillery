# CI and infra

## CI philosophy

CI is a light lint; the heavy checks run locally, in parallel (CI takes 1 minute, the local gate 5).

- **CI** (`ci.yaml`): the spec check and the linters only (`validate-spine`, `lint`,
  `check-bindings`), each one `make` target (D12); `install-lint` installs the lint group only. No
  tests, builds or uploads.
- **Local**: everything else, with `make check-all`: `$(MAKE) -k -O -j$(JOBS) $(CHECKS)`, one
  target per check (`JOBS` defaults to the core count). Only `test` writes `coverage.xml`; a target
  that writes the same file (`coverage-report`) stays out of `CHECKS`, serial.
- **Pull request**: the body carries the result line of `make check-all`.

The `SKILL.md` archetype table lists the gates; all but the CI three are local. A `doc-only` repo
gets a spec-check `ci.yaml` and a `docs.yaml` that only publishes to Pages (default branch). Deploy and release are `ci-cd-delivery`'s. `_reusable-tests.yml` stays opt-in.

## The CD seam

Deploy is `ci-cd-delivery`'s. A deployable product gets a marked `deploy.yaml` TODO stub, never a
guessed workflow, until DevOps ratifies its §6; then render its templates and delete the stub. A
library or doc-only repo gets none. No secrets in the repo.

## Infra

`infra/` at the root (D11), multistage `docker/Dockerfile` (uv builder → slim non-root runtime).
Two gotchas: the dockerignore is `infra/docker/Dockerfile.dockerignore` (a nested Dockerfile
ignores a root one); `.env` is `infra/.env`, every Make docker target passes `--env-file
infra/.env`, and `make check-env` fails early with the fix. Committed: `infra/.env.example`, an
optional `infra/.env.common` (non-secret values), `.secrets.example`. Ignored by git and the
dockerignore: the real `infra/.env` and `.secrets`. Commit only what is safe in a public PR.
