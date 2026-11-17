# Spine projection

`scripts/scaffold.sh` projects `openspec/` into every repo (D13); the conventions are OpenSpec's
and the `meaningfy` schema's, the golden thread `epic-planning`'s.

- `config.yaml` (from `assets/templates/openspec/`): `schema: meaningfy`, the project `context:`,
  three thin rules: proposal no-gos, specs SHALL + GWT, tasks cite their parent EPIC first.
- `schemas/meaningfy/`: copied from `assets/openspec-schema/meaningfy/`, pinned per repo.
- `specs/` (the truth) and `changes/` with `archive/`; `changes/<id>/inputs/` holds seeds, never
  groomed. The repo `AGENTS.md` carries a "Golden thread" note (EPIC → PLAN → specs → commit).

The commands come from OpenSpec, core profile, at `OPENSPEC_PIN` in the scaffolder (in step with
skillery's `openspec/openspec-version.txt`); expanded verbs are opt-in.

**Refresh the schema** by re-running `project-setup`: `--dry-run` shows the diff, `--skip-existing`
keeps an existing schema, authored `specs/` and `changes/` are never touched. Review the diff in
its own commit and re-run `openspec validate --strict`. The pinned Neo4j generators in `scripts/`
refresh with `--force`; review the diff. No `--upgrade-schema` tool until repos need a joint bump.

## Validation

`openspec validate --strict` is structural and runs in CI as a `make` target; the clarity gate
never does (`ci-and-infra.md`).
