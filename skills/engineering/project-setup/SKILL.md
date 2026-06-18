---
name: project-setup
description: Scaffold a fresh Meaningfy-standard Python repository from scratch — top-level package (no src/), Poetry + dedicated tool configs in the root, cosmic-python layered architecture with import-linter guardrails, TDD+BDD test layout, a single AGENTS.md agentic setup with memory/epics, Antora documentation, infra, and CI. Use when starting a new repo or modernising an existing one to the latest Meaningfy standards. Trigger on "set up a new project", "scaffold a repo", "bootstrap a Python project", "new Meaningfy project", "initialise project structure", "add the standard tooling/docs/CI", "modernise/revamp an existing repo", "bring this project up to standard", "gap analysis against Meaningfy standards".
license: Apache 2.0
metadata:
  category: engineering
---

# Project Setup

## Overview

Interview the developer, then scaffold a complete Meaningfy-standard Python repository: a
**top-level package** (never `/src`), all tool config in the **repository root**, cosmic-python
layering enforced by **import-linter**, a **TDD+BDD** test layout, a **single agentic
instruction file** (`AGENTS.md`, with `CLAUDE.md` as a symlink), an **Antora** documentation
site, optional **Docker/infra**, and **GitHub Actions CI** that calls `make` targets.

This skill provides the *concrete scaffolding artifacts* (templates, checklists, precise file
specs). For the *knowledge* behind them it routes to the installed Meaningfy skills rather than
restating them:

| For… | Use skill |
|------|-----------|
| Layering, SOLID, the four patterns, CI tools | `cosmic-python` |
| Minimal code — YAGNI, avoid over-engineering | `ponytail` (third-party) |
| System design, C4, ADRs, contracts | `architecture` |
| EPIC (shaped bet) + PLAN, memory conventions | `epic-planning` |
| Docs writing, AsciiDoc/Antora prose | `technical-writing` |
| Commits, branches, PRs | `meaningfy-git-workflow` |
| TDD discipline while implementing | `superpowers:test-driven-development` |

It is **generic** — it works in any empty or existing git repo, with the Meaningfy skillery
installed or not (templates are self-contained).

## Two modes

- **Greenfield** — scaffold a clean repo from nothing (the default procedure below).
- **Brownfield (modernization)** — bring an *existing* repo up to the standard: assess the gaps,
  then fill the missing pieces and migrate non-conformant ones incrementally. `scaffold.sh --dry-run`
  prints a gap report (`+ create` / `= keep`) that writes nothing; `--skip-existing` then adds only
  what's missing, never clobbering. Full assess → plan → apply → verify workflow:
  **`references/modernizing-existing-projects.md`**.

## When to use / not use

- **Use** to bootstrap a new repo, or to bring an existing repo up to the standard — in place for
  small/young repos, or as a shaped EPIC + PLAN for a large, busy codebase (land it in
  reviewable slices; never big-bang).
- **Not for** non-Python repos (a docs-only repo uses only the Antora half).

> **Non-negotiables** (hardest to reverse, most-violated by default): no `/src`, all tool config in
> the root, a single `AGENTS.md` (`CLAUDE.md` symlinked to it), and a minimal `pyproject.toml`. See
> `references/decisions.md` — D1, D2, D8 — for these and the full rationale of every choice.

## Procedure

Work in phases. Confirm the plan before writing files; commit only on explicit consent.
**For an existing repo, follow `references/modernizing-existing-projects.md`** (assess with
`--dry-run` → plan safe slices → apply with `--skip-existing` → verify) instead of steps 1–3 below;
the pillar references in step 4 still govern each piece.

1. **Interview** — ask the grouped questions in `references/interview.md` (use `AskUserQuestion`).
   Resolve project name, package name(s), project archetype, frameworks, datastores, and which
   optional pillars to include (docs, infra, CI). Make no silent assumptions; echo back the
   resolved profile for confirmation.
2. **Plan** — present the resolved profile + the file tree you will create (from
   `references/layout.md`). Get a go-ahead.
3. **Scaffold the skeleton** — run the scaffolder (flags, not positional args):
   ```
   scripts/scaffold.sh -p <package> -n "<Project Name>" -a <archetype> \
       [--python 3.12] [--slug my-project] [--org meaningfy-ws] [--branch develop] \
       [--no-docs] [--no-infra] [--no-ci]
   ```
   It renders every template, creates the package/tests/.claude trees, symlinks
   `CLAUDE.md → AGENTS.md`, and runs `poetry lock`. Idempotent; never clobbers without
   asking (`--force` / `--skip-existing` for non-interactive). Or create files by hand from
   `assets/templates/` using `references/layout.md` + `references/config-files.md`.
4. **Fill the pillars**, each governed by a reference:
   - Code & architecture → `references/layout.md` + `references/architecture-guardrails.md`
   - Tooling & config files → `references/config-files.md`
   - Tests (TDD+BDD) → `references/testing-setup.md`
   - Agentic setup (AGENTS.md, memory, epics) → `references/agentic-setup.md`
   - Documentation (Antora) → `references/antora-docs.md`
   - CI & infra → `references/ci-and-infra.md`
5. **Verify** — run the Definition-of-Done checklist in `references/checklists.md`
   (`make install && make check-all` must pass on the empty skeleton).
6. **Hand off** — install the Meaningfy skillery so the `AGENTS.md` skill routing resolves, then
   summarise what was created, what is stubbed, and the next steps:
   ```
   /plugin marketplace add meaningfy-ws/skillery
   /plugin install meaningfy-engineering meaningfy-ai-coding
   /plugin install superpowers@claude-plugins-official
   /plugin marketplace add DietrichGebert/ponytail && /plugin install ponytail@ponytail
   ```
   Then shape the first EPIC (`.claude/memory/epics/<name>/EPIC.md`) and derive its `PLAN.md`
   via the `epic-planning` skill (gate the PLAN with `clarity-gate`).

## Canonical stack (recommended defaults)

These are the defaults the templates implement. Deviate only with a stated reason.

| Concern | Choice | Rejected (why) |
|---------|--------|----------------|
| Packaging / deps | **Poetry** + `[dependency-groups]` | requirements.txt (no lock/groups), setup.py (legacy) |
| Format + lint | **Ruff** (`ruff.toml`) | black+isort+flake8+pylint (4 tools, slow) |
| Types | **mypy** (`mypy.ini`) | — |
| Tests | **pytest** + **pytest-bdd** (`pytest.ini`) | behave (separate runner), nose (dead) |
| Coverage | **coverage.py** (`.coveragerc`, ≥80%) | — |
| Architecture | **import-linter** (`.importlinter`) | manual review (erodes silently) |
| Complexity | **radon** / **xenon** (CLI) | — |
| Hooks | **pre-commit** (ruff only) | — |
| Task runner | **Makefile** (the dev UX) | tox (env-matrix only; not needed) |
| Docs | **Antora** (AsciiDoc) | Sphinx (weaker cross-refs), bare MD |
| Agent file | **AGENTS.md** + `CLAUDE.md`→symlink | two divergent files |

See `references/decisions.md` for the full rationale behind each choice and when to override it.

## Definition of Done

The scaffold is done when every box in `references/checklists.md` is ticked — chiefly:
`make install` succeeds; `make check-all` is green on the empty skeleton (lint, types,
architecture, a placeholder test); `AGENTS.md` exists with `CLAUDE.md` symlinked to it;
`docs/` builds (`make build-docs`) if docs were selected; CI workflow is present.

## Boundary & Related Skills

**Owns:** the repository scaffold — directory layout, root tool configs, test harness, agentic
files, Antora skeleton, CI/infra templates, and the setup checklists.
**Delegates:** layering rationale → `cosmic-python`; system design/ADRs → `architecture`; EPIC &
memory content → `epic-planning`; doc prose → `technical-writing`; git mechanics →
`meaningfy-git-workflow`. This skill creates the *containers*; those skills fill them.
**Related:** all of the above, plus the external `superpowers` and `stream-coding` skills.
