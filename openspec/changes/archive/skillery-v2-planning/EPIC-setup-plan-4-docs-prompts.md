# Workstream 4 — Docs Canon & Binding Templates — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax. Run `make validate` after each task.

**Goal:** Create the human-facing engineering-standards and philosophy canon, resolve the frozen `ai-coding` dangling link additively, and ship the CLAUDE.md / AGENTS.md / global-prompt binding templates.

**Architecture:** Author Markdown docs that **narrate and point** to skills (never restate skill rules). Relocate the verbatim coding prompt out of the skill into docs canon. Add the missing `dod-quality-gates.md` as a new file (frozen files are not edited). Provide thin, mirrored binding templates.

**Tech Stack:** Markdown; validation via `make validate`.

**Spec coverage:** R13, R14, R15, R16, R17, R20, R22. Depends on Workstream 1 (skeleton + validator).

> **O3 decision:** this plan ships only the three prompt templates. If you want a full per-repo `.claude/` scaffold (settings, memory layout) in `prompts/`, add it as a follow-up task.

---

### Task 4.1: Relocate the coding prompt (R22)

**Files:**
- Move: `skills/cosmic-python/references/MEANINGFY_PROMPT.md` → `docs/engineering-standards/coding-prompt.md`
- Modify: `skills/cosmic-python/SKILL.md` (repoint if it links the old path)

- [ ] **Step 1: Move with history**

```bash
git mv skills/cosmic-python/references/MEANINGFY_PROMPT.md docs/engineering-standards/coding-prompt.md
```

- [ ] **Step 2: Add a header note marking it human canon**

Prepend a one-line note to `coding-prompt.md`: "Human canon. The operational version is the `cosmic-python` skill — edit there for agent behaviour; this document is the readable standard."

- [ ] **Step 3: Repoint cosmic-python**

Run: `grep -rn "MEANINGFY_PROMPT" skills/cosmic-python/`
For each hit, replace with prose: "see `docs/engineering-standards/coding-prompt.md`".

- [ ] **Step 4: Validate & commit**

Run: `make validate` — Expected: PASS (no broken links).
```bash
git add -A && git commit -m "refactor: relocate coding prompt to engineering-standards canon"
```

---

### Task 4.2: `project-structure.md`

**Files:**
- Create: `docs/engineering-standards/project-structure.md`

- [ ] **Step 1: Author from the project-structure source**

Folder taxonomy ("what folders mean, wherever they sit"): `/src` vs root-modules (note Meaningfy uses root-modules), `models/`/`adapters/`/`services/`/`entrypoints/` with the `entrypoints` sub-taxonomy (`api`, `openapi`, `ui`, `crawlers`, `dags`, `cli`); `tests/` layout; key files (`config.py`, `manage.py`, `Makefile`, `Dockerfile`, `setup.cfg`); the four patterns (Repository, UoW, Service Layer, Aggregate) as one-line definitions. End with: "Operational guidance lives in the `cosmic-python` skill; this is the readable reference." Include the canonical-vs-book vocabulary mapping.

- [ ] **Step 2: Validate & commit**

Run: `make validate` — Expected: PASS.
```bash
git add -A && git commit -m "docs: add project-structure engineering standard"
```

---

### Task 4.3: `architectural-guardrails.md` (tooling matrix as ADR)

**Files:**
- Create: `docs/engineering-standards/architectural-guardrails.md`

- [ ] **Step 1: Author as an ADR using the architecture skill's template**

Use `skills/architecture/references/ADR_TEMPLATE.md`. Decision: "import-linter in every repo for import-level boundaries; add CodeQL in CI for call/dataflow boundaries on critical repos; Ruff/MyPy are quality baselines, weak on architecture." Include the full support matrix as the evidence/Considered-Options section and the per-category scoring as Confirmation.

- [ ] **Step 2: Validate & commit**

Run: `make validate` — Expected: PASS.
```bash
git add -A && git commit -m "docs: add architectural-guardrails ADR (tooling matrix)"
```

---

### Task 4.4: `git-and-collaboration.md`

**Files:**
- Create: `docs/engineering-standards/git-and-collaboration.md`

- [ ] **Step 1: Author human canon, pointing to the skill**

Narrate the git/PR/dev-environment standard (commits, branch naming, workflow, PRs, free-tier constraints, WSL/RDF hygiene). End with: "Operational version: the `meaningfy-git-workflow` skill." Do **not** restate command mechanics — link the skill.

- [ ] **Step 2: Validate & commit**

Run: `make validate` — Expected: PASS.
```bash
git add -A && git commit -m "docs: add git-and-collaboration engineering standard"
```

---

### Task 4.5: `art-of-coding-with-an-llm.md` (philosophy)

**Files:**
- Create: `docs/philosophy/art-of-coding-with-an-llm.md`

- [ ] **Step 1: Author the philosophy page**

Capture: the LLM as a **guided peer who explores the problem space and proposes options** (not a fast junior — note the model-tiered nuance: frontier models = peer, cheaper models = junior); human sovereignty (you own the PR); shape work from Epic + Work Shape; tests non-negotiable; treat output as a reviewable PR. Point to the `stream-coding`, `cosmic-python`, and `superpowers:brainstorming` skills as the operational expression.

- [ ] **Step 2: Validate & commit**

Run: `make validate` — Expected: PASS.
```bash
git add -A && git commit -m "docs: add art-of-coding-with-an-llm philosophy page"
```

---

### Task 4.6: Resolve the frozen `ai-coding` dangling link (R16)

**Files:**
- Create: `docs/ai-coding/dod-quality-gates.md` (additive — frozen files untouched)
- Modify: `tools/repo_lint/lint.py` (lift the WS1 ai-coding guard)
- Modify: `tests/test_repo_lint.py` (no change expected; confirm green)

- [ ] **Step 1: Author the missing Definition-of-Done doc**

Create `docs/ai-coding/dod-quality-gates.md` consolidating the quality gates already referenced by the frozen methodology/runbook: Clarity Gate (≥9/10), tests green per cycle, code review pre-PR, architecture check (importlinter), ≥80% coverage. Mirror the gate table in `ai-coding-methodology.md §8.3` and `runbook §1`.

- [ ] **Step 2: Lift the temporary validator guard**

In `tools/repo_lint/lint.py` `broken_links`, delete the line:
```python
        if md.parent.name == "ai-coding":  # lifted in WS4 once dod-quality-gates.md exists
            continue
```

- [ ] **Step 3: Verify the previously-dangling links now resolve**

Run: `make validate`
Expected: PASS — the `docs/ai-coding/*` → `dod-quality-gates.md` links now resolve; full-repo link check active.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "docs: add dod-quality-gates and enable full link validation"
```

---

### Task 4.7: Binding templates (R17)

**Files:**
- Create: `prompts/CLAUDE.md.template`
- Create: `prompts/AGENTS.md.template`
- Create: `prompts/global-prompt.md`
- Create: `prompts/README.md`

- [ ] **Step 1: Author `CLAUDE.md.template`** (committed project binding)

Sections: project identity; memory conventions; the **implementer orchestration loop** (from `.claude/implementer-residue.md` — gitnexus impact sequence, generate-verify-integrate steps, commit-on-consent); **routing to skills by trigger** (Python code → cosmic-python; system design → architecture; any feature/bugfix → superpowers:test-driven-development; debugging → superpowers:systematic-debugging; commits/PRs → meaningfy-git-workflow; planning → epic-planning + external stream-coding; review → meaningfy-code-review + external code-review); pointers to `docs/`. Concise. Then delete the scratch file: `git rm .claude/implementer-residue.md`.

- [ ] **Step 2: Author `AGENTS.md.template`** as a tool-neutral mirror

Identical policy content to the CLAUDE.md template. Add a top note: "Single source with CLAUDE.md — keep them mirrored; do not let them diverge."

- [ ] **Step 3: Author `global-prompt.md`** (slim ~30-line personal default)

Identity (senior peer, minimise WTFs); the peer principle; routing to skills; non-negotiables (TDD-first, review-before-merge, human sovereignty). **Not** the 500-line prompt — link `docs/engineering-standards/coding-prompt.md` for depth.

- [ ] **Step 4: Author `prompts/README.md`** explaining the three tiers (personal global / committed project / cross-tool mirror).

- [ ] **Step 5: Validate & commit**

Run: `make validate` — Expected: PASS.
```bash
git add -A && git commit -m "feat: add CLAUDE.md, AGENTS.md, and global-prompt binding templates"
```

---

### Task 4.8: Environment-setup doc (external dependencies — R25)

**Files:**
- Create: `docs/environment-setup.md`

- [ ] **Step 1: Author the dependency manifest + setup guide**

Two tables — **Mandatory** (`superpowers`, external `stream-coding`) and **Optional/recommended** (`commit-commands`, `code-review`, `gitnexus-*`, `context7`). For each: what it is, why Meaningfy uses it, exact `/plugin install …` command. Add: how the Meaningfy bundles install (`meaningfy-engineering`, `meaningfy-ai-coding`, `meaningfy-consulting`); how to run `scripts/init-meaningfy-project.sh`; and a note that `docs/ai-coding/` predates the agents→skills move (its agent references map to the new skills).

- [ ] **Step 2: Validate & commit**

Run: `make validate` — Expected: PASS.
```bash
git add -A && git commit -m "docs: add environment-setup with mandatory/optional external dependencies"
```

---

### Task 4.9: Projection bootstrap script (R26)

**Files:**
- Create: `scripts/init-meaningfy-project.sh`

- [ ] **Step 1: Author the idempotent script**

Behaviour: (a) writes `CLAUDE.md` and `AGENTS.md` from `prompts/*.template` **only if absent**; if present, prints a `diff` and asks before overwriting (never clobbers local edits); (b) creates the `.claude/memory/` layout if missing; (c) prints the `/plugin install` commands from `docs/environment-setup.md`. Re-running refreshes templates the same safe way. Header comment documents both the initial-setup and refresh paths. `set -euo pipefail`; usage `--help`.

- [ ] **Step 2: Smoke-test in a temp dir**

Run: `bash scripts/init-meaningfy-project.sh --help` and a dry run into `/tmp/mf-test`.
Expected: creates CLAUDE.md/AGENTS.md in the empty target; second run reports "exists, no changes".

- [ ] **Step 3: Validate & commit**

Run: `make validate` — Expected: PASS.
```bash
git add -A && git commit -m "feat: add idempotent project bootstrap script"
```

---

### Task 4.10: Final README index + open PR

**Files:**
- Modify: `README.md`
- Modify: `tools/repo_lint/lint.py`, `tests/test_repo_lint.py` (add README-inventory check for A1)

- [ ] **Step 1: Add a README-inventory validator (closes A1)**

Append to `lint.py`:
```python
def readme_inventory_gaps(repo: Path) -> list[str]:
    readme = (repo / "README.md").read_text()
    return sorted(name for name in _skill_dirs(repo) if name not in readme)
```
Append to `tests/test_repo_lint.py`:
```python
def test_readme_lists_every_skill():
    assert lint.readme_inventory_gaps(REPO) == []
```

- [ ] **Step 2: Rewrite README to the full section set (R20)**

Sections: **What this is** · **Who it's for** · **What's inside** (skills inventory table across all 3 bundles — including `meaningfy-code-review` — plus docs/prompts/scripts) · **Getting started / install** (3 bundles + `scripts/init-meaningfy-project.sh` + link to `docs/environment-setup.md`) · **How to use it** (consumer → entry point: install → bundles; learn → `docs/ai-coding/`; standards → `docs/engineering-standards/` + `prompts/`; philosophy → `docs/philosophy/`; contribute → `spec/` + `template/`) · **Repository structure** (final tree — **no `agents/`**; include `scripts/`) · **Contributing** (link CONTRIBUTING) · **Licensing** (Apache 2.0 + per-skill LICENSE.txt) · **Support/contact**.

- [ ] **Step 3: Validate**

Run: `make validate`
Expected: PASS including `test_readme_lists_every_skill`.

- [ ] **Step 4: Commit and open PR (do not merge)**

```bash
git add -A && git commit -m "docs: finalize README index and add inventory validation"
git push -u origin skill/repo-reorg
gh pr create --fill --title "Reorganize agent-skills into company-wide skill/agent/docs catalog" --draft
```

---

## Workstream 4 acceptance check

- `docs/engineering-standards/` (coding-prompt, project-structure, architectural-guardrails, git-and-collaboration) and `docs/philosophy/` exist; docs point to skills, don't restate them (R15).
- `docs/ai-coding/dod-quality-gates.md` exists; full-repo link validation is active and green (R16, A1).
- `prompts/` ships CLAUDE.md / AGENTS.md / global-prompt templates (R17).
- README lists every skill (validator-enforced); a draft PR is open for human review.
- Frozen artifacts moved only / extended additively (A5, C1) — verify: `git diff --stat -M origin/main -- skills/executive-communication skills/semantic-consulting-coach docs/ai-coding` shows renames + the one new `dod-quality-gates.md`, no content edits.
