# Modernizing an Existing Project (brownfield)

How to bring an **existing** repo up to the Meaningfy standard — the *brownfield* mode of this
skill. The brownfield method (R9, Q9.2=B) is: **audit the existing repo, imagine the ideal target
appropriate to it, and propose the upgrade as a shaped EPIC + PLAN — an OpenSpec change — for human
review, then apply it in safe slices.** It is **not** in-place big-bang patching.

This **applies the spine to the brownfield repo itself**: the modernization is authored as
`openspec/changes/<id>/` (`proposal.md` = the EPIC, `design.md` + `tasks.md` = the PLAN, with
`specs/` deltas where behaviour is touched). The human reviews and approves the change before any
slice lands. The detailed migration *recipes* live in the pillar references; this doc sequences them
into the change.

> **Scope.** Even a small/young repo's modernization is shaped as a change — the change may be tiny
> and applied in one or two commits. A large, busy codebase is a **migration project**: the same
> shaped EPIC + PLAN, landed in reviewable slices behind tests, this doc as the task checklist.
> **Never big-bang.**

## Brownfield-as-a-shaped-change (the method, R9)

1. **Audit** the existing repo (the gap rubric below + `scaffold.sh --dry-run`). Capture the result
   as an analysis brief under the change's `inputs/` (preserved, never groomed).
2. **Imagine the ideal target** appropriate to *this* project (its archetype, its constraints) — not
   a generic ideal. What would the conformant repo look like?
3. **Propose the upgrade as a shaped change** with `/opsx:propose`:
   - **EPIC** (`proposal.md`) — the bet: appetite, why-now, the solution outline (the migration
     slices), key decisions (e.g. "lift `/src` last"), rabbit-holes, no-gos.
   - **PLAN** (`design.md` + `tasks.md`) — the ordered, reviewable migration steps (the "Plan —
     order the gaps safely" sequence below becomes the `tasks.md`). The clarity gate scores the
     pair ≥9/10.
4. **Human reviews / approves** the change. Only then →
5. **Apply in safe slices** with `/opsx:apply`, gating each behind `make check-all`; archive into
   `openspec/specs/` when done.

The mechanical gap-fill (`scaffold.sh --skip-existing`) and the per-file migration recipes below are
the *content* the PLAN's tasks reference — not a separate, un-shaped path.

## The orchestration loop (feeds the PLAN's tasks)

`scaffold.sh` is idempotent and never overwrites without asking; the detailed migration recipes live
in the pillar references. This doc is the **orchestrator** that sequences them — it does not restate
them, it links. Each numbered step below becomes a task in the shaped change's `tasks.md`.

## The loop: assess → plan → apply → verify

### 1. Assess — produce a gap report

Run the scaffolder in **`--dry-run`** mode against the existing repo. It writes nothing and prints
`+ create` for every missing standard file and `= keep` for every one already present — a precise,
mechanical gap list:

```bash
scripts/scaffold.sh -p <existing_package> -n "<Project Name>" -a <archetype> --dry-run
```

`--dry-run` also flags the agent file specifically: it tells you whether `AGENTS.md` is already a
symlink to the canonical `CLAUDE.md`, a divergent copy needing reconciliation (DEC-4 —
CLAUDE-canonical), or absent.

Then assess the dimensions a file-presence check **cannot** see, using this rubric (✅ conformant /
⚠️ partial / ❌ missing):

| Dimension | What to check | Owner reference |
|-----------|---------------|-----------------|
| **Layout** | `/src` present? package at top level? `from = "src"` in pyproject? | `layout.md`, `config-files.md` |
| **pyproject** | `[tool.*]` sprawl vs minimal? Poetry + `[dependency-groups]`? | `config-files.md` |
| **Tool configs** | dedicated `ruff.toml`/`mypy.ini`/`pytest.ini`/`.coveragerc` at root? | `config-files.md` |
| **Lint/format** | Ruff, or legacy black/isort/flake8/pylint? | `decisions.md` D4 |
| **Tests** | type-split dirs + marker hook? pytest-bdd? coverage gate ≥80%? | `testing-setup.md` |
| **Architecture** | `.importlinter` present and enforced in CI? layers respected? | `architecture-guardrails.md` |
| **Agent file** | canonical `CLAUDE.md` + `AGENTS.md` symlink, or two divergent files? (DEC-4) | `agentic-setup.md` |
| **Spine** | `openspec/` present (config + pinned schema + specs/ + changes/)? `/opsx:*` installed? | `spine-projection.md` |
| **Memory** | `.claude/memory/MEMORY.md` a ≤200-line regenerable INDEX (truth = `openspec/specs/`)? | `agentic-setup.md` |
| **Docs** | Antora component with the Diátaxis IA? | `antora-docs.md` |
| **Infra** | top-level `infra/`, multistage non-root Dockerfile, layered env? | `ci-and-infra.md` |
| **CI** | workflows that call `make` targets, mirroring `check-all`? | `ci-and-infra.md` |
| **Versions** | `requires-python` bound? ruff/mypy track the interpreter? | `config-files.md` |

Write the result as a short gap report (the `code-anatomy.md`-style prose, if architecture is
involved). That report is the input to the plan.

### 2. Plan — order the gaps safely (least risk first)

Sequence the work so each step is independently reviewable, reversible, and leaves the build green.
The recommended order (skip steps already conformant):

1. **Additive, zero-risk first** — drop in the missing *standalone* files that touch nothing
   existing: `ruff.toml`, `mypy.ini`, `pytest.ini`, `.coveragerc`, `.importlinter` (start with a
   permissive contract), `.pre-commit-config.yaml`, `sonar-project.properties`, `LICENSE`,
   `CHANGELOG.md`, the `.claude/` index, CI workflows. One `--skip-existing` run does all of
   these. Commit.
2. **Spine projection** — project `openspec/` (config + the PINNED meaningfy schema + `specs/` +
   `changes/`) and install the `/opsx:*` core profile. Additive; never touches code. This is also
   what lets you *author the modernization itself* as a change. Recipe: `spine-projection.md`. Commit.
3. **Agent file reconciliation** — collapse two divergent `CLAUDE.md`/`AGENTS.md` into the canonical
   `CLAUDE.md` + an `AGENTS.md` symlink (DEC-4 — CLAUDE-canonical). Split the content: the global
   standard stays in `~/.claude/CLAUDE.md` (DEC-12); the repo `CLAUDE.md` routes + carries "Project
   specifics" + the spine pointers. Commit.
4. **pyproject normalization** — strip `[tool.*]` blocks into the dedicated files now present,
   leaving pyproject minimal. Recipe: `config-files.md` §"Migrating an existing repo's
   `pyproject.toml`". Commit.
5. **Tooling swap** — replace black/isort/flake8/pylint with Ruff; fix the lint debt it surfaces
   in its own commit(s). Add mypy if absent. Commit.
6. **Test reorganization** — introduce the type-split `tests/` tree + the marker-injection
   `conftest.py`; move existing tests under `unit/`/`feature/`/etc.; wire the coverage gate.
   `testing-setup.md`. Commit.
7. **The `/src` lift (highest blast radius — do it alone)** — move `src/<pkg>/` → `<pkg>/` and
   re-point every config. Recipe: `layout.md` §"Contrast: the `/src` layout" +
   `config-files.md` migration steps. This rewrites import roots and touches every path-based
   config — isolate it in one commit, run the full suite, and expect noisy diffs. Commit.
8. **Architecture tightening** — once layers are stable, harden `.importlinter` from permissive to
   the real per-component/tier contracts (`architecture-guardrails.md`, two-step method). Fix
   violations in dedicated commits. Commit.
9. **Pillars** — add the Antora docs and/or `infra/` pillar, and the conditional `model/` (product)
   / CD stub (deployable) if missing and wanted.

Steps 1–3 are safe in almost any repo. Steps 4–8 grow in blast radius; gate each behind
`make check-all`. This ordered list **is** the modernization change's `tasks.md` (the PLAN) when the
repo is non-trivial.

### 3. Apply — fill gaps without clobbering

```bash
# Add ONLY the missing files; existing ones are left untouched (no prompts):
scripts/scaffold.sh -p <package> -n "<Project Name>" -a <archetype> --skip-existing

# Or review each collision interactively (prompts per existing file):
scripts/scaffold.sh -p <package> -n "<Project Name>" -a <archetype>
```

`--skip-existing` is the workhorse of step 1: it realizes every `+ create` from the gap report and
silently keeps every `= keep`. The per-file *migrations* (steps 3, 5, 6) are deliberate manual
edits guided by the recipes — the scaffolder adds files, it does not rewrite your code.

### 4. Verify — green after every step

After each commit: `make check-all` (lint + types + architecture + tests). The point of small steps
is that a regression is attributable to one change and trivially reverted. Don't proceed to the next
step on red.

## Safety rules

- **Branch + reviewable slices.** One concern per commit/PR; never mix the `/src` lift with a tooling
  swap. Use the `meaningfy-git-workflow` skill.
- **`--dry-run` before every apply.** Know exactly what will change.
- **Never let the scaffolder overwrite blindly.** Default mode prompts; `--skip-existing` only adds;
  reserve `--force` for files you have explicitly decided to regenerate.
- **Preserve git history on moves.** Use `git mv` for the `/src` lift so blame survives.
- **Tests are the safety net.** If the repo has no tests, add the smoke/marker harness (step 5)
  *before* the riskier moves (steps 6–7).

## Where the detailed recipes live (don't duplicate — follow the link)

| Migration task | Recipe |
|----------------|--------|
| Strip `[tool.*]` from `pyproject.toml` into dedicated files | `config-files.md` §"Migrating an existing repo's `pyproject.toml`" |
| Lift `src/<pkg>/` → top-level `<pkg>/` and re-point configs | `layout.md` §"Contrast: the `/src` layout" + `config-files.md` |
| Reconcile two `CLAUDE.md`/`AGENTS.md` files → canonical `CLAUDE.md` + symlink | `agentic-setup.md` §"CLAUDE-canonical" |
| Project the spine (`openspec/`, pinned schema, `/opsx:*`) | `spine-projection.md` |
| Migrate legacy `.claude/memory/epics/` → `openspec/changes/` + `specs/` | `spine-projection.md` + `agentic-setup.md` |
| Author `.importlinter` from a prose dependency spec | `architecture-guardrails.md` §"The two-step method" |
| Reorganize tests + add the marker hook | `testing-setup.md` |

## Migrating a legacy agentic bootstrap

A repo bootstrapped by the older convention (two mirrored `CLAUDE.md`/`AGENTS.md` files, or
AGENTS-canonical, with a hand-maintained `.claude/memory/epics/` tree) is brought up to standard by
the steps above: collapse to **canonical `CLAUDE.md` + `AGENTS.md` symlink** (DEC-4), and migrate the
local epics into the spine (`openspec/changes/` for in-flight work; `openspec/specs/` for preserved
truth; `openspec/config.yaml: context:` for orientation). See `agentic-setup.md` and
`spine-projection.md`.
