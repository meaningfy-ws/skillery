# Modernizing an existing project

The upgrade is a shaped change in the repo's own spine, never big-bang patching, even for a small
repo (then one or two commits): audit; imagine the ideal target for this repo's
archetype and constraints, not a generic one; propose the EPIC (`proposal.md`: appetite, slices,
key decisions such as "lift `/src` last", rabbit-holes, no-gos) and the PLAN (`design.md` +
`tasks.md`, the order below), gated by `clarity-gate`; the human approves before any slice lands;
apply in slices; archive into `openspec/specs/`.

## 1. Assess

`scripts/scaffold.sh -p <pkg> -n "<Name>" -a <archetype> --dry-run` writes nothing, prints
`+ create` per missing standard file and `= keep` per present one, and flags an `AGENTS.md` or
`CLAUDE.md` symlink. Keep the brief under the change's `inputs/`. Rate the 13 dimensions file presence cannot see
as conformant, partial or missing: layout (`/src`?), pyproject (`[tool.*]`
sprawl, uv and `uv.lock` or Poetry), root tool configs, lint (Ruff or black/isort/flake8/pylint),
tests (tiers, marker hook, pytest-bdd, coverage gate), architecture (`.importlinter` in CI), agent
files (D8), spine (pinned schema, commands), memory (`MEMORY.md` a ≤ 200-line index), docs (Antora
buckets), infra (root, multistage non-root, layered env), CI (on `make`, mirroring `check-all`),
versions (`requires-python` bound, Ruff and mypy track it).

Carry only detected gaps into the EPIC: naming a conformant dimension misreads as a constraint.
Cite the standard, do not recite it.

## 2. Plan: least risk first

1. Additive files that touch nothing (configs, a permissive `.importlinter`, `LICENSE`,
   `CHANGELOG.md`, `.claude/`, CI): one `--skip-existing` run.
2. The spine; the modernization itself is then a change.
3. Agent files: a symlink becomes a regular file, repo content merges into `AGENTS.md`, `CLAUDE.md`
   becomes the pointer, the standard stays global (DEC-12). `.claude/memory/epics/` moves to
   `openspec/changes/` (in flight), `openspec/specs/` (kept truth), `config.yaml`'s `context:`.
4. pyproject normalization, Poetry → uv.
5. Ruff replaces the old linters (lint debt in its own commits); add mypy.
6. Tests into tiers with the marker hook and the coverage gate.
7. The `/src` lift, alone, with `git mv`: the highest blast radius.
8. Tighten `.importlinter` to the real contracts; violations fixed in their own commits.
9. Pillars: docs, `infra/`, `model/`, the CD stub, if wanted.

Never mix the `/src` lift with a tooling swap. A repo without tests gets the smoke harness first.

## 3. Apply

`--dry-run` before every apply. The default mode prompts per collision, `--skip-existing` only
adds, `--force` only for files you chose to regenerate. Migrations are deliberate edits, one concern
per commit (`meaningfy-git-workflow`).

## Adopting the shared checks

One target per pull request; a target joins `check-quality` in the pull request that makes it
green.

1. Ruff's wider selection in three pull requests, quietest first: `S113`, `DTZ`, `BLE001`; then
   `PT018`, `TID251`; then `PLR0912`, `PLR0913`, `PLR0915`, `PLR2004`. Where one code has over 50
   findings, list the failing files in `[lint.per-file-ignores]` with a comment naming the tracking
   issue, and drop each file when clean. Never `ruff check --add-noqa`: its comments carry
   no reason.
2. `check-makefile`, then `check-layout` (rename the banned files first), then `check-semgrep`.

To upgrade, raise `QUALITY_VERSION` and copy the newer `scripts/quality/` templates in one commit.

## 4. Verify

After each commit, `make check-all`; never go on while it is red.
