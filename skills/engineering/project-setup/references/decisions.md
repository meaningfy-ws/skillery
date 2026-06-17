# Canonical Decisions & Rationale

The defaults this skill scaffolds, why they were chosen, and when to override. Derived from two
mature Meaningfy repos (one modern, one battle-tested) and the `agent-skills` engineering
standards. Where the two repos disagree, the **newer conventions win** and the rationale is noted.

**The non-negotiables.** Most decisions below have an "override" path. Four do not — they are the
hardest to reverse and the most-violated by default, and getting any wrong yields a repo that looks
fine but is structurally off-standard: **no `/src`** (D1), **all tool config in the root** + a
**minimal `pyproject.toml`** (D2), and a **single `AGENTS.md`** with `CLAUDE.md` symlinked (D8).

## D1 — No `/src`; top-level package

**Decision.** The deployable unit is a top-level Python package: `myproject/`, not `src/myproject/`.
Multiple deployable units → multiple top-level packages (e.g. `myproject/`, `myproject_dags/`).

**Why.** The `/src` layout buys import-isolation during testing but costs a layer of indirection
in every path, tool config (`from = "src"`), and mental model. Meaningfy's engineering standard
(`docs/engineering-standards/project-structure.md`) is explicit: "A repo contains one or more
**root modules** (top-level packages, one per deployable unit) rather than a single `/src`."

**Consequence.** `pytest.ini` sets `pythonpath = .`; Poetry uses `packages = [{include="myproject"}]`
with no `from`. Tests live in a **sibling** `tests/` directory.

**Override.** Only if a published library genuinely needs the src-layout import guarantee — rare.

## D2 — All tool config in dedicated root files; minimal `pyproject.toml`

`pyproject.toml` holds only `[project]`, `[tool.poetry]`, `[dependency-groups]`, `[build-system]`.
Everything else gets its own root file: `ruff.toml`, `mypy.ini`, `pytest.ini`, `.coveragerc`,
`.importlinter`, `.pre-commit-config.yaml`, `sonar-project.properties`, `Makefile`.

**Why.** One purpose per file → "minimum confusion" (a new contributor finds each tool's config by
name). Avoids the `[tool.*]` sprawl that makes `pyproject.toml` unreadable. `[tool.poetry]` stays
because Poetry needs it for package discovery — that is packaging metadata, not tool config.

## D3 — Poetry + PEP 735 dependency groups

Use Poetry for dependency management and packaging. Group dependencies semantically:

| Group | Contents | Installed by |
|-------|----------|--------------|
| runtime (`[project.dependencies]`) | pydantic, fastapi, the actual deps | `poetry install` |
| `dev` | pre-commit, linkml, local helpers | `--with dev` |
| `test` | pytest, pytest-bdd, pytest-cov, pytest-asyncio, testcontainers, polyfactory, httpx | `--with test` |
| `lint` | ruff, mypy, import-linter, radon, xenon | `--with lint` |

**Why not requirements.txt** (the requirements.txt approach): no lockfile, no semantic groups, no extras. Pin in
one place with a resolver. `make install` installs all groups; `make install` must **not** run
`poetry lock` (locking is the explicit `make lock` target).

## D4 — Ruff replaces black + isort + flake8 + pylint

One fast Rust tool for formatting and linting. Config in `ruff.toml`: `line-length = 100`,
`target-version` matching the project, `lint.select = ["E","F","I","B","UP","SIM","C90","N","RUF100"]`,
`lint.mccabe.max-complexity = 10`. Use `[lint.per-file-ignores]` for justified exceptions (e.g.
`N802` on a config module that uses UPPER_CASE method names).

**Why.** Four tools → one; seconds → milliseconds; a single config surface. mypy still covers types
(Ruff does not). radon/xenon still cover complexity trends (Ruff's C90 only gates per-function).

## D5 — Test pyramid by directory + marker-injection hook

`tests/` is split by type — `unit/`, `feature/`, `e2e/`, `integration/` — and a
`pytest_collection_modifyitems` hook in `tests/conftest.py` stamps each test's marker **by path**.
So there is no per-file `pytestmark` (which a `conftest.py` silently ignores anyway). Make targets
filter with `-m`; coverage flags live only in the `test`/`coverage-report` targets, never in
`pytest.ini`.

**Why.** CI runs the cheap layer on every push (`ci-quick`) and the full stack on merge
(`ci-full`) with zero per-file bookkeeping. The full tree, the hook code, and the conftest gotcha
live in **`testing-setup.md`**.

## D6 — TDD + BDD together

- **TDD** (`superpowers:test-driven-development`): RED-GREEN-REFACTOR per layer. Unit tests precede
  production code.
- **BDD** (`bdd-gherkin` skill): `.feature` files in `tests/feature/<capability>/` in business
  language; `Scenario Outline` + `Examples` for data-driven coverage; step defs co-located. Features
  are written from the EPIC's acceptance criteria *before* implementation.

The `tests/feature/` tree mirrors the **business capabilities** (and hints at the import-linter
component names); `tests/unit/` mirrors the **code tree**.

## D7 — Cosmic-python layers + import-linter tiers

Inside each component package: `domain/` (the book's `models/` — canonical name here is **domain**),
`adapters/`, `services/`, `entrypoints/`. Strict direction
`entrypoints → services → domain`, `adapters → domain`; `domain` imports nothing upward.

When there are several components, add a **tier hierarchy**: `commons` (tier 0, shared, imports no
business component) < foundation (tier 1) < orchestration (tier 2) < entrypoint APIs (tier 3). A
component may import any **lower** tier, never same/higher; tier peers cannot import each other.

`.importlinter` encodes both: `layers` contracts per component + `forbidden`/`layers` contracts for
the tier graph. Checked by `make check-architecture` and in CI. See
`architecture-guardrails.md` for the contract-authoring procedure (model the spec first — a
code-anatomy.md dependency map — then translate to contracts).

**Note.** Convention-only layering erodes; the enforced approach stays clean. We
adopt the import-linter approach (`docs/engineering-standards/architectural-guardrails.md`: "import-linter
in every repo").

**Reconciliation — `domain/` vs `models/`.** The org standard
(`docs/engineering-standards/project-structure.md`) still mandates `models/` as the innermost
layer's code name, but this skill standardises on **`domain/`** going forward (matching the
agent instruction file: "the innermost layer is called `domain` (not `models`)"). **`domain/` wins**
here; `project-structure.md` should be updated upstream to match. This is a deliberate divergence,
not an oversight — don't "fix" templates back to `models/`.

### Divergences from the older cosmic-python skill text

A couple of choices here intentionally **modernise** the older cosmic-python skill prose rather
than contradict it by accident — flagged so they are not mistaken for errors:

- **Ruff supersedes pylint + flake8** (and black + isort). The older text recommends pylint/flake8;
  this skill uses one Ruff config surface (D4).
- **tox is intentionally dropped.** The older text leans on `tox` as a task runner; here the
  `Makefile` is the dev UX and CI calls its targets. Reach for an env-matrix tool only if you
  genuinely need to test across multiple interpreter versions — the single-version default does
  not.

## D8 — Single agent instruction file (AGENTS.md canonical, CLAUDE.md → symlink)

`AGENTS.md` is the tool-neutral standard and the single source. `CLAUDE.md` is a **symlink** to it
(`ln -s AGENTS.md CLAUDE.md`). The Meaningfy template ships both as mirrored copies that "must be kept
identical" — a symlink makes drift structurally impossible while remaining Claude-Code-compatible.

**Why.** The developer's explicit requirement ("only one"). Mirrored copies rot; a symlink cannot.
Document the symlink in the README so contributors don't "fix" it. Content follows
`prompts/AGENTS.md.template` from the skillery: skill-routing table, implementation loop, memory
conventions, project specifics. Carry the `meaningfy-template-version` stamp.

**Override.** If a tool on the team cannot follow symlinks on checkout (rare; some Windows setups),
fall back to two files + a pre-commit hook that copies AGENTS.md→CLAUDE.md. Note it in the README.

## D9 — Agentic memory layout + the specs-first pipeline

```
.claude/
├── agents/                 # optional thin wrappers (or rely on installed skillery agents)
├── skills/                 # project-specific skills only (don't vendor the skillery)
└── memory/
    ├── MEMORY.md           # auto-memory index, ≤200 lines, stable patterns only
    ├── _templates/         # blank skeletons rendered at scaffold time: EPIC.md, PLAN.md, task.md
    └── epics/<name>/        # starts empty — EPIC.md + PLAN.md + yyyy-mm-dd-<task>.md (on demand)
```

**Pipeline: Architecture → EPIC → Plan → Implement** (specifications-first). The **EPIC *is* the
work shape** (Shape Up style — one artifact, not a separate shape *and* epic):

- **EPIC.md** = the *shaped bet*: appetite, problem, solution outline, **key decisions**,
  rabbit-holes, no-gos. The specification at the right abstraction; FROZEN once shaped.
- **PLAN.md** = the *derived executable plan*: algorithm, examples, anti-patterns, test specs,
  error matrix, task breakdown, roadmap, plus a Part 2 implementation log. The **clarity gate
  scores the PLAN** (≥9/10) — gate the plan, not the shape. PLAN Part 1 freezes once gated; on a
  design-level failure fix the plan (and re-gate), not the code.
- Per-task outcomes accrue as `yyyy-mm-dd-<task>.md`.

**Why EPIC ≡ shape (not shape → epic).** Pure Shape Up has no separate "EPIC": the shaped pitch
*is* the spec and a cycle implements it. Folding them removes a redundant artifact; what AI agents
additionally need — an unambiguous, gated breakdown — is the **PLAN**, a distinct *stage*, not a
second copy of the bet. (This supersedes the older `ai-coding-methodology` framing of Work Shape as
a separate upstream input; reconcile upstream — see the divergence note pattern in D7.)

The scaffolder renders the blank forms into `_templates/` and creates an empty `epics/` dir;
`epic-planning` copies them into `epics/<name>/` on demand. Don't auto-load epic files — read the
relevant one on demand. See `agentic-setup.md` for the flow and `epic-planning` for content.

## D10 — Antora documentation with a Diátaxis-shaped IA

Docs are an Antora component under `docs/`. The information architecture follows the Diátaxis
quadrants — tutorials, how-to, reference, explanation (`architecture/`) — plus three Meaningfy
buckets: `requirements/`, `adr/`, `user-guide/`. Extensions: Mermaid (diagrams) + Lunr (search);
build via Make targets; deploy to GitHub Pages in CI.

**Why Antora over Sphinx/bare Markdown.** First-class cross-references, multi-repo aggregation, and
docs-as-code versioning. The piece inventory, the full IA table, and the build workflow live in
**`antora-docs.md`**.

## D11 — Docker multistage + layered env, co-located dockerignore

Infra lives at top-level `infra/` (compose, `docker/Dockerfile` multistage builder→slim non-root,
`scripts/entrypoint.sh`, `.env.example`). Two gotchas: the dockerignore is co-located as
`infra/docker/Dockerfile.dockerignore` (not a root file), and `.env` lives at `infra/.env` (compose
targets pass `--env-file` explicitly). Layered env model: commit the `*.example` templates,
never real secrets.

**Why.** Small, secure runtime images; a reproducible local stack; secrets stay out of git. The
full layout, both gotchas, and the multistage rationale live in **`ci-and-infra.md`**.

## D12 — CI calls Make targets

GitHub Actions workflows are thin: they call `make` targets, never inline tool commands. Minimum:
`ci.yaml` (lint → typecheck → check-architecture → test → coverage → Sonar) on push/PR to the
default branch; `docs.yaml` (build + deploy to Pages) when docs change. Mirror the Make quality
gates exactly so "green locally" means "green in CI".

## Project archetypes (what to include)

| Archetype | Package layers | Antora | Infra | Notable deps |
|-----------|----------------|--------|-------|--------------|
| **service** (REST API) | full 4 layers, ≥1 entrypoint | yes | yes (db+api) | fastapi, uvicorn, the db driver |
| **library** | domain (+adapters) | reference-only | no | minimal; publishable |
| **pipeline** (batch/Airflow) | domain+adapters+services, dags entrypoint | yes | yes (workers) | the orchestrator |
| **cli tool** | domain+services, cli entrypoint | tutorials+how-to | optional | click/typer |
| **docs-only** | — | yes (the whole repo) | no | none (Node/Antora) |

The interview picks the archetype; the archetype decides which pillars and templates apply.
