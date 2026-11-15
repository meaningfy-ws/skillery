---
name: project-setup
description: Scaffold or modernise a Meaningfy-standard repo and PROJECT the Meaningfy spine into it — a top-level package (no src/), uv + dedicated root tool configs, cosmic-python layering with import-linter guardrails, TDD+BDD tests, an AGENTS.md-canonical agentic setup (AGENTS.md is canonical; CLAUDE.md is a thin pointer that imports it, never a symlink), the openspec/ spine (config + pinned meaningfy schema + /opsx:* commands + golden thread), three archetypes (product/library/doc-only) with fixed gate profiles, conditional model/ and CD seam, Antora docs, infra, and CI. Use when starting a new repo or bringing an existing one up to standard. Trigger on "set up a new project", "scaffold a repo", "bootstrap a Python project", "new Meaningfy project", "initialise project structure", "add the standard tooling/docs/CI", "project the spine / set up openspec", "modernise/revamp an existing repo", "bring this project up to standard", "gap analysis against Meaningfy standards".
license: Apache 2.0
metadata:
  purpose: software-development
  area: coding
  subject: python
  posture: precise
  stage: build
  maturity: stable
---

# Project Setup

Left alone, an agent scaffolds a generic repo (`src/`, every tool in `pyproject.toml`, a lone
`CLAUDE.md`, no spine) and guesses the project's shape. This skill interviews first, scaffolds with
`scripts/scaffold.sh`, projects the `openspec/` spine, and modernises an existing repo as a shaped
change, never in place.

## Quick Start

"A REST API for order processing, on PostgreSQL, that we deploy." The interview resolves product,
service, FastAPI, LinkML, PostgreSQL, deployable, package `orders`; the developer confirms. Then
`scripts/scaffold.sh -p orders -n "Order Processing" -a product --deployable` writes a top-level
`orders/`, root tool files, `tests/` by tier, `AGENTS.md` with its `CLAUDE.md` pointer,
`openspec/`, `model/`, `docs/`, `infra/`, CI and a `deploy.yaml` stub; `make check-all` is green.

## Workflow

Confirm the plan before writing; commit only on explicit consent. Read
`references/modernizing-existing-projects.md` when the repo already exists, instead of steps 1 to 3:
it adds the `--dry-run` audit and its rubric, the upgrade as an EPIC and PLAN, the safe order of
slices and the adoption of the shared checks.

1. **Interview.** Read `references/interview.md` before the first question: it adds the seven
   groups with their defaults, the archetype filter, the doc-only elicitation and the echo-back.
2. **Plan.** Show the resolved profile and the file tree; wait for a yes. An empty folder gets
   `git init` on the chosen default branch.
3. **Scaffold.** `scripts/scaffold.sh -p <package> -n "<Name>" -a <product|library|doc-only>`, with
   `--deployable`, `--minimal` (agentic files and `.claude/` only), `--python`, `--slug`, `--org`,
   `--branch`, `--no-docs|--no-infra|--no-ci`, `--dry-run`, `--force|--skip-existing`. With
   `--neo4j`, pass `--linkml-generators <linkml-engineering folder>/scripts/linkml_neo4j`: skills
   install apart, so the scaffolder cannot find a sibling. Idempotent; never clobbers unasked.
4. **Fill the pillars.**
   - Read `references/config-files.md` when you edit or migrate a root tool file: it adds the rules
     the templates cannot show, the suppression rule and the `pyproject.toml` and `/src` migration.
   - Read `references/testing-setup.md` when you wire or move tests: it adds the tiers, the marker
     hook and its gotcha, the lanes and the coverage gate.
   - Read `references/architecture-guardrails.md` when you write or groom `.importlinter`: it adds
     the tiers, the two-step method and the peer-import gotcha.
   - Read `references/agentic-setup.md` when you write `AGENTS.md`, `CLAUDE.md` or `.claude/`: it
     adds the pointer rule, the global vs repo split and the index rules.
   - Read `references/spine-projection.md` when you project or refresh `openspec/`: it adds the
     config rules, the pins and the refresh path.
   - Read `references/ci-and-infra.md` when you wire CI, the CD stub or `infra/`: it adds the gates
     per archetype, the CD seam and the infra gotchas.
5. **Verify** with *Before you hand over*.
6. **Hand off.** Install what `AGENTS.md` routes to; summarise what is made, stubbed and next:
   ```
   npx -y @fission-ai/openspec@1.4.1 init --tools claude --profile core
   /plugin marketplace add meaningfy-ws/skillery#releases
   /plugin install meaningfy-core@meaningfy-skillery
   /plugin install meaningfy-building@meaningfy-skillery
   /plugin install superpowers@claude-plugins-official
   /plugin marketplace add DietrichGebert/ponytail && /plugin install ponytail@ponytail
   ```
   If the person declines one, say that you work without it and that its routes will not resolve.
   The first EPIC is `/opsx:propose`; its PLAN passes `clarity-gate` before `/opsx:apply`.

## Rules

**Archetypes.** The archetype fixes CI gates:

| Archetype | `model/` | Deploy | Gates |
|---|---|---|---|
| product | yes | conditional | `openspec validate --strict`, codegen in sync, `check-architecture`, coverage ≥ 80 %, code review |
| library | no | no | `openspec validate --strict`, `check-architecture` (domain, adapters), coverage ≥ 80 %, code review |
| doc-only | no | no | `openspec validate --strict`, docs build, link and structure checks |

- `model/` holds `conceptual-modelling`'s model. Only with LinkML, scaffold `linkml-engineering`'s
  layer (`make generate-models` with diagrams, custom templates, one artefact set per module, gates
  chosen with the user); otherwise no LinkML gates.
- Release seam (`meaningfy-release`'s content): a library gets a `release.yml` stub and
  `SECURITY.md`; a product gets `SECURITY.md` and `ci-cd-delivery`'s image path; doc-only, neither.
- `clarity-gate` is never a CI step.

**Decisions.** Deviate only with a stated reason; ✱ marks the non-negotiables.

| Id | Default |
|---|---|
| D1 ✱ | a top-level package per deployable unit, never `src/` (a published library needing src import isolation may) |
| D2 ✱ | each tool config in its own root file; `pyproject.toml` minimal |
| D3 | uv, PEP 735 groups, `uv.lock`, `uv_build`; not Poetry or `requirements.txt` |
| D4 | Ruff replaces black, isort, flake8, pylint; mypy; radon and xenon for trends |
| D5 | pytest + pytest-bdd, tests split by folder, marker stamped by path, coverage ≥ 80 % |
| D6 | TDD (`superpowers:test-driven-development`), BDD (`bdd-gherkin`) features before code |
| D7 | `cosmic-python` layers enforced by import-linter |
| D8 ✱ | canonical `AGENTS.md`, thin `CLAUDE.md` pointer, both regular files, never a symlink |
| D9 | `.claude/` a regenerable index; the spine holds work memory |
| D10 | Antora: Diátaxis plus requirements, ADR, user guide, develop; search needs `SITE_SEARCH_PROVIDER=lunr` at build |
| D11 | root `infra/`, multistage non-root image, layered env |
| D12 | CI calls `make` targets; the Makefile is the dev UX, no tox |
| D13 ✱ | the `openspec/` spine projected, schema pinned |

Shared checks: skillery's `quality/` at `QUALITY_VERSION`, never copied. `ponytail` keeps code
minimal.

**Settings.** With settings, `cosmic-python:PR-CONFIG-DECOUPLED` is the only way; start from the
settings pattern in `assets/settings/config_resolver.py`.

**Docs.** Drop a bucket that does not fit the archetype with its `nav.adoc` entry. `develop/`
pages point to the skills and keep only the project's slots. API reference is generated from
OpenAPI (`make openapi`, then `make api-docs` with the openapi-generator `asciidoc` generator; a
separate docs repo pulls it with `make update-api-docs`), never hand-written: ignored and
regenerated in CI, or committed with a codegen check. Prose is `technical-writing`'s.

## Before you hand over

| Question | If not | Action |
|---|---|---|
| `make install && make check-all` green on the skeleton, `check-quality` included? | broken scaffold | fix first |
| `test ! -L AGENTS.md && test ! -L CLAUDE.md && grep -qx '@AGENTS.md' CLAUDE.md`? | D8 broken | regular files; `AGENTS.md` routes, never restates the standard |
| `MEMORY.md` an index of ≤ 200 lines? | a second source | cut to pointers |
| `openspec/` complete, `openspec validate --strict` green, commands installed? | no spine | re-project |
| No `src/`, minimal `pyproject.toml`, one `VERSION` source? | D1, D2 broken | lift, strip `[tool.*]` |
| Selected pillars work (`make build-docs`, `docker compose … config`, `ci.yaml` on `make`)? | half a pillar | finish or remove it |
| `README.md` points to `AGENTS.md`; `.gitignore` covers `infra/.env` and secrets? | lost newcomer, leaked secret | fix |

## Boundary & Related Skills

**Owns:** the scaffold and the spine projection: layout, root configs, test harness, agentic
files, `openspec/`, docs, CI and infra templates, the `model/` home, the CD stub. It makes the
containers; other skills fill them.
**Delegates:** layering and the code catalogue → `cosmic-python`; ADRs → `architecture`; the model
→ `conceptual-modelling`; LinkML gates → `linkml-engineering`; deploy → `ci-cd-delivery`; release
→ `meaningfy-release`; EPIC and PLAN → `epic-planning`; the spine lifecycle → `spec-stewardship`;
delivery → `epic-delivery`; prose → `technical-writing`; git → `meaningfy-git-workflow`; test
policy → `test-strategy`.
**Related:** `ci-cd-delivery`, `meaningfy-release`, `linkml-engineering`; external `superpowers`,
`ponytail`, `stream-coding`.

Answers `VER, ADQ` in `test-strategy`'s matrix (`references/software.md`).
