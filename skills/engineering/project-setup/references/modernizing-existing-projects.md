# Modernizing an Existing Project

How to bring an **existing** repo up to the Meaningfy standard — the *brownfield* mode of this
skill. Greenfield scaffolding writes a clean tree; modernization **assesses what's missing,
plans safe incremental steps, fills gaps without clobbering, and migrates non-conformant pieces**.

The skill is built for this: `scaffold.sh` is idempotent and never overwrites without asking, and
the detailed migration recipes already live in the pillar references. This doc is the **orchestrator**
that sequences them. It does not restate them — it links.

> **Scope.** Small/young repos can be modernized in place over a few commits. A large, busy
> codebase is a **migration project**: shape it as an EPIC + PLAN (the methodology), land it
> in reviewable slices behind tests, and use this doc as the task checklist. Never big-bang.

## The loop: assess → plan → apply → verify

### 1. Assess — produce a gap report

Run the scaffolder in **`--dry-run`** mode against the existing repo. It writes nothing and prints
`+ create` for every missing standard file and `= keep` for every one already present — a precise,
mechanical gap list:

```bash
scripts/scaffold.sh -p <existing_package> -n "<Project Name>" -a <archetype> --dry-run
```

`--dry-run` also flags the agent file specifically: it tells you whether `CLAUDE.md` is already a
symlink, a divergent copy needing reconciliation (D8), or absent.

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
| **Agent file** | single `AGENTS.md` + `CLAUDE.md` symlink, or two divergent files? | `agentic-setup.md` D8 |
| **Memory** | `.claude/memory/` (MEMORY.md, epics/ with EPIC.md+PLAN.md, _templates/)? | `agentic-setup.md` |
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
   `CHANGELOG.md`, the `.claude/` memory layout, CI workflows. One `--skip-existing` run does all of
   these. Commit.
2. **Agent file reconciliation** — collapse two divergent `CLAUDE.md`/`AGENTS.md` into
   `AGENTS.md` + symlink (D8). Reconcile any project content into "Project specifics". Commit.
3. **pyproject normalization** — strip `[tool.*]` blocks into the dedicated files now present,
   leaving pyproject minimal. Recipe: `config-files.md` §"Migrating an existing repo's
   `pyproject.toml`". Commit.
4. **Tooling swap** — replace black/isort/flake8/pylint with Ruff; fix the lint debt it surfaces
   in its own commit(s). Add mypy if absent. Commit.
5. **Test reorganization** — introduce the type-split `tests/` tree + the marker-injection
   `conftest.py`; move existing tests under `unit/`/`feature/`/etc.; wire the coverage gate.
   `testing-setup.md`. Commit.
6. **The `/src` lift (highest blast radius — do it alone)** — move `src/<pkg>/` → `<pkg>/` and
   re-point every config. Recipe: `layout.md` §"Contrast: the `/src` layout" +
   `config-files.md` migration steps. This rewrites import roots and touches every path-based
   config — isolate it in one commit, run the full suite, and expect noisy diffs. Commit.
7. **Architecture tightening** — once layers are stable, harden `.importlinter` from permissive to
   the real per-component/tier contracts (`architecture-guardrails.md`, two-step method). Fix
   violations in dedicated commits. Commit.
8. **Pillars** — add the Antora docs pillar and/or `infra/` pillar if missing and wanted.

Steps 1–2 are safe in almost any repo. Steps 3–7 grow in blast radius; gate each behind
`make check-all`. Capture the whole sequence as an EPIC roadmap when the repo is non-trivial.

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
| Reconcile two `CLAUDE.md`/`AGENTS.md` files into one + symlink | `agentic-setup.md` §"Single agent file" + §"Relationship to init-meaningfy-project.sh" |
| Author `.importlinter` from a prose dependency spec | `architecture-guardrails.md` §"The two-step method" |
| Reorganize tests + add the marker hook | `testing-setup.md` |

## Relationship to the skillery's `init-meaningfy-project.sh`

That script does a minimal agentic bootstrap (two template files + empty memory). For a repo it
already touched, this skill's modernization **supersedes** it: replace the two files with
`AGENTS.md` + symlink and run the full gap analysis above. See `agentic-setup.md`.
