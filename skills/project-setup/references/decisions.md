# Canonical Decisions & Rationale

The defaults this skill scaffolds, why they were chosen, and when to override. Derived from two
mature Meaningfy repos (one modern, one battle-tested) and the `agent-skills` engineering
standards. Where the two repos disagree, the **newer conventions win** and the rationale is noted.

**The non-negotiables.** Most decisions below have an "override" path. A few do not — they are the
hardest to reverse and the most-violated by default, and getting any wrong yields a repo that looks
fine but is structurally off-standard: **no `/src`** (D1), **all tool config in the root** + a
**minimal `pyproject.toml`** (D2), a **canonical `CLAUDE.md`** with `AGENTS.md` symlinked (D8 —
CLAUDE-canonical, DEC-4), and the **`openspec/` spine projected** (D13).

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

## D8 — Single agent instruction file (CLAUDE.md canonical, AGENTS.md → symlink) — DEC-4

`CLAUDE.md` is the single source of truth — Claude Code loads it directly. `AGENTS.md` is an optional
**symlink** to it (`ln -s CLAUDE.md AGENTS.md`), so AGENTS.md-aware tools read the same canon. This
**inverts** the older AGENTS-canonical convention (DEC-4): a symlink makes drift structurally
impossible, and `CLAUDE.md` is Claude Code's first-class file, so making it the source removes a
layer of indirection while staying tool-neutral.

**The global vs repo split (DEC-12).** There are two `CLAUDE.md` files. The **global**
`~/.claude/CLAUDE.md` carries the company-wide standard. The **repo** `./CLAUDE.md` is the repo
operating manual: it **ROUTES** to the global standard and to the installed skills + the spine, and
records only repo-specific facts — it never restates the standard.

**Why.** The explicit requirement ("only one canonical file"). Mirrored copies rot; a symlink cannot.
Document the symlink in the README so contributors don't "fix" it. Content: skill-routing table, the
spine pointers, implementation loop, project specifics. Carry the `meaningfy-template-version` stamp.

**Override.** If a tool on the team cannot follow symlinks on checkout (rare; some Windows setups),
fall back to two files + a pre-commit hook that copies `CLAUDE.md → AGENTS.md`. Note it in the README.

## D9 — `.claude/` is a regenerable index; the spine holds the work memory

```
.claude/
├── agents/                 # optional thin wrappers (or rely on installed skillery agents)
├── skills/                 # project-specific skills only (don't vendor the skillery)
└── memory/
    └── MEMORY.md           # regenerable orientation INDEX, ≤200 lines, stable patterns only
```

The legacy `.claude/memory/epics/EPIC.md`+`PLAN.md`+`task.md` model is **superseded by the spine**
(D13): EPIC ≡ `openspec/changes/<id>/proposal.md`, PLAN ≡ `design.md` + `tasks.md`. The scaffolder no
longer renders those skeletons. `.claude/memory/MEMORY.md` is a **regenerable index, not authority** —
≤200 lines, stable patterns only; if it disagrees with `openspec/specs/`, **specs/ wins**. The
orientation index of record is `openspec/config.yaml`'s `context:` field. See `agentic-setup.md` and
`spine-projection.md`.

## D13 — Project the `openspec/` spine (the work-memory backbone)

The scaffolder projects `openspec/` into every repo: `config.yaml` (`schema: meaningfy` + injected
`context:` + the 3 thin per-artifact rules), the **pinned** `schemas/meaningfy/` (copied from
skillery, recorded against `../../../spine/openspec-version.txt`), durable `specs/`, and `changes/`
(+ `archive/`, with the `inputs/` seed convention). The `/opsx:*` commands install on the **core
profile** (`openspec init --tools claude --profile core`).

**Pipeline: Architecture → EPIC → Plan → Implement** (specifications-first). The **EPIC *is* the
work shape** (Shape Up style), now a native spine artifact:

- **EPIC ≡ `proposal.md`** — the *shaped bet*: appetite, why, solution outline, **key decisions**,
  rabbit-holes, no-gos. FROZEN once shaped.
- **PLAN ≡ `design.md` + `tasks.md`** — the derived executable pair the **clarity gate scores**
  (≥9/10). On a design-level failure fix the plan (and re-gate), not the code.
- normative requirements ≡ `specs/` deltas (SHALL + GWT); they merge into `openspec/specs/` on
  archive.

The schema is **pinned per repo**; refresh by re-running `project-setup` (shows a diff, never
clobbers authored specs) — a documented per-repo chore, not a heavy upgrade tool (YAGNI). See
`spine-projection.md`.

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

Three explicit archetypes, each with a **fixed gate profile** (R5/R8/R10). The basics
("automate almost everything" + TDD) hold for all; the archetype decides the *conditional* layers.

| Archetype | Package layers | `model/` | Antora | Infra | Deploy | Gate profile (CI-automatable) |
|-----------|----------------|----------|--------|-------|--------|-------------------------------|
| **product** (service/pipeline/cli) | full 4 layers, ≥1 entrypoint (flavour-dependent) | yes (LinkML) | yes | yes (flavour) | conditional (CD stub) | openspec-validate + codegen-sync + check-architecture + cov≥80 + review |
| **library** | domain (+adapters) | no | reference-only | no | no | openspec-validate + check-architecture + cov≥80 + review |
| **doc-only** (non-code) | — | no | yes (whole repo) | no | no | openspec-validate + docs build + link/structure checks |

The service/pipeline/cli *flavours* (entrypoint + framework) are resolved inside `product` by the
interview (Group 4). `clarity-gate` is in no profile as a CI step — it is a human/agent semantic gate.
The interview picks the archetype; the archetype decides which pillars, templates, and gates apply.
