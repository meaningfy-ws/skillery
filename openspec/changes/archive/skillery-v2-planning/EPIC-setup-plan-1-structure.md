# Workstream 1 — Structure & Validation Harness — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Establish the target directory skeleton, remove cruft, and build the `make validate` safety net that every later workstream commits against.

**Architecture:** A small dependency-light Python lint tool (`tools/repo_lint/`) with pytest unit tests, wired through a `Makefile` and GitHub Actions. The repo validates itself the way a cosmic-python project does — single source of truth enforced by a guardrail.

**Tech Stack:** Python 3.11+, `pyyaml`, `pytest`, GNU Make, GitHub Actions.

**Spec coverage:** R18, R19, R20, R21, R24; bundle scaffolding for R1; constraints C1, C2.

---

### Task 1.1: Branch + directory skeleton

**Files:**
- Create: `skills/.gitkeep` is not needed (skills exist); create empty dirs via `.gitkeep`:
  `agents/.gitkeep` (exists), `docs/engineering-standards/.gitkeep`, `docs/philosophy/.gitkeep`, `prompts/.gitkeep`, `tools/repo_lint/.gitkeep`, `tests/.gitkeep`

- [ ] **Step 1: Create the working branch**

```bash
cd /home/lps/work/workspace-charm/agent-skills
git checkout -b skill/repo-reorg
```

- [ ] **Step 2: Create target directories**

```bash
mkdir -p docs/engineering-standards docs/philosophy prompts tools/repo_lint tests
touch docs/engineering-standards/.gitkeep docs/philosophy/.gitkeep prompts/.gitkeep tools/repo_lint/.gitkeep tests/.gitkeep
```

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "chore: scaffold target directory structure"
```

---

### Task 1.2: Add .idea to .gitignore (do NOT delete or untrack)

**Files:**
- Modify: `.gitignore`

> **Standing rule (user directive):** never delete or `git rm` a gitignored folder. `.idea/` stays exactly as-is on disk and in git history. We only add the ignore rule so *future* changes to it are not tracked.

- [ ] **Step 1: Append the ignore rule**

```bash
printf '\n# JetBrains IDE\n.idea/\n' >> .gitignore
```

- [ ] **Step 2: Verify**

Run: `git check-ignore .idea/workspace.xml` — Expected: prints `.idea/workspace.xml` (rule active). Do **not** run `git rm`.

- [ ] **Step 3: Commit**

```bash
git add .gitignore && git commit -m "chore: gitignore .idea"
```

---

### Task 1.3: Build the repo-lint validator (TDD)

**Files:**
- Create: `tools/repo_lint/__init__.py`
- Create: `tools/repo_lint/lint.py`
- Create: `tests/test_repo_lint.py`
- Create: `requirements-dev.txt`

- [ ] **Step 1: Pin dev dependencies**

Create `requirements-dev.txt`:

```
pyyaml>=6.0
pytest>=8.0
```

- [ ] **Step 2: Write failing tests**

Create `tests/test_repo_lint.py`:

```python
from pathlib import Path
from tools.repo_lint import lint

REPO = Path(__file__).resolve().parents[1]

def test_every_marketplace_skill_exists():
    assert lint.missing_skill_dirs(REPO) == []

def test_every_skill_is_registered():
    assert lint.unregistered_skill_dirs(REPO) == []

def test_all_skill_frontmatter_valid():
    assert lint.frontmatter_errors(REPO) == []

def test_skill_name_matches_dir():
    assert lint.name_mismatch(REPO) == []

def test_no_broken_internal_links():
    assert lint.broken_links(REPO) == []
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `python -m venv .venv && . .venv/bin/activate && pip install -r requirements-dev.txt && python -m pytest tests/test_repo_lint.py -v`
Expected: FAIL — `ModuleNotFoundError: tools.repo_lint.lint` / missing functions.

- [ ] **Step 4: Implement the validator**

Create `tools/repo_lint/__init__.py` (empty). Create `tools/repo_lint/lint.py`:

```python
"""Repository self-consistency checks. Single source of truth guardrail."""
from __future__ import annotations
import json
import re
from pathlib import Path
import yaml

SKILLS_DIR = "skills"
MARKETPLACE = ".claude-plugin/marketplace.json"
_FRONTMATTER = re.compile(r"^---\n(.*?)\n---", re.DOTALL)
_MD_LINK = re.compile(r"\[[^\]]+\]\(([^)]+)\)")


def _marketplace_skills(repo: Path) -> list[str]:
    data = json.loads((repo / MARKETPLACE).read_text())
    out: list[str] = []
    for plugin in data.get("plugins", []):
        for s in plugin.get("skills", []):
            out.append(s.replace("./skills/", "").strip("/").split("/")[-1])
    return out


def _skill_dirs(repo: Path) -> list[str]:
    root = repo / SKILLS_DIR
    return sorted(p.name for p in root.iterdir() if (p / "SKILL.md").exists())


def missing_skill_dirs(repo: Path) -> list[str]:
    dirs = set(_skill_dirs(repo))
    return sorted(s for s in _marketplace_skills(repo) if s not in dirs)


def unregistered_skill_dirs(repo: Path) -> list[str]:
    registered = set(_marketplace_skills(repo))
    return sorted(s for s in _skill_dirs(repo) if s not in registered)


def _frontmatter(path: Path) -> dict:
    m = _FRONTMATTER.match(path.read_text())
    if not m:
        raise ValueError(f"no frontmatter in {path}")
    return yaml.safe_load(m.group(1)) or {}


def frontmatter_errors(repo: Path) -> list[str]:
    errors: list[str] = []
    for name in _skill_dirs(repo):
        path = repo / SKILLS_DIR / name / "SKILL.md"
        try:
            fm = _frontmatter(path)
        except ValueError as exc:
            errors.append(str(exc))
            continue
        for field in ("name", "description"):
            if not fm.get(field):
                errors.append(f"{name}: missing '{field}'")
    return errors


def name_mismatch(repo: Path) -> list[str]:
    out: list[str] = []
    for name in _skill_dirs(repo):
        fm = _frontmatter(repo / SKILLS_DIR / name / "SKILL.md")
        if fm.get("name") != name:
            out.append(f"{name}: frontmatter name '{fm.get('name')}' != dir")
    return out


def broken_links(repo: Path) -> list[str]:
    out: list[str] = []
    for md in repo.rglob("*.md"):
        if ".venv" in md.parts or ".git" in md.parts:
            continue
        for target in _MD_LINK.findall(md.read_text()):
            if target.startswith(("http://", "https://", "#", "mailto:")):
                continue
            rel = target.split("#")[0]
            if not rel:
                continue
            if not (md.parent / rel).resolve().exists():
                out.append(f"{md.relative_to(repo)} -> {target}")
    return out
```

- [ ] **Step 5: Make the package importable from tests**

Create `tests/conftest.py`:

```python
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
```

- [ ] **Step 6: Fix the two known broken links so `broken_links` can pass**

Resolve R24 dead links surfaced by the validator:
- In `README.md`, remove the `THIRD_PARTY_NOTICES.md` link line (no such file).
- The `docs/ai-coding/` → `dod-quality-gates.md` link is fixed in Workstream 4 (the file is authored there). Until then, add `dod-quality-gates.md` to an allowlist OR run WS4 Task that creates it before enabling the link check on `docs/ai-coding/`.

> **Note for executor:** if WS4 has not run yet, the `docs/ai-coding/*` files reference `dod-quality-gates.md`. To keep WS1 green, the validator's `broken_links` is scoped to skip `docs/ai-coding/` via an added guard, removed in WS4 once the file exists.

Add to `broken_links`, inside the loop after the `.venv`/`.git` guard:

```python
        if md.parent.name == "ai-coding":  # lifted in WS4 once dod-quality-gates.md exists
            continue
```

- [ ] **Step 7: Run tests to verify they pass**

Run: `python -m pytest tests/test_repo_lint.py -v`
Expected: PASS (5 passed).

- [ ] **Step 8: Commit**

```bash
git add tools tests requirements-dev.txt README.md
git commit -m "feat: add repo self-consistency validator with tests"
```

---

### Task 1.4: Makefile

**Files:**
- Create: `Makefile`

- [ ] **Step 1: Write the Makefile**

```makefile
.PHONY: install validate lint test
install:
	python -m venv .venv && . .venv/bin/activate && pip install -r requirements-dev.txt
validate: test
test:
	. .venv/bin/activate && python -m pytest tests/ -v
lint:
	. .venv/bin/activate && python -m pytest tests/test_repo_lint.py -v
```

- [ ] **Step 2: Verify**

Run: `make validate`
Expected: pytest runs, all pass.

- [ ] **Step 3: Commit**

```bash
git add Makefile && git commit -m "build: add make targets for validation"
```

---

### Task 1.5: CI workflow

**Files:**
- Create: `.github/workflows/validate.yml`

- [ ] **Step 1: Write the workflow**

```yaml
name: validate
on: [push, pull_request]
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: "3.11" }
      - run: pip install -r requirements-dev.txt
      - run: python -m pytest tests/ -v
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/validate.yml
git commit -m "ci: run repo validation on push and PR"
```

---

### Task 1.6: Marketplace bundles (WS1 subset)

**Files:**
- Modify: `.claude-plugin/marketplace.json`

> Only skills that exist now are listed. The `meaningfy-ai-coding` bundle and `meaningfy-git-workflow` are added in their creating tasks (WS2/WS3) to keep `make validate` green at every step.

- [ ] **Step 1: Rewrite `plugins` to two domain bundles**

```json
{
  "name": "agent-skills",
  "owner": { "name": "Meaningfy", "email": "info@meaningfy.ws" },
  "metadata": { "description": "Meaningfy company-wide skills, agents, methodologies, and standards", "version": "2.0.0" },
  "plugins": [
    {
      "name": "meaningfy-engineering",
      "description": "Engineering standards: clean layered Python (cosmic-python) and system architecture",
      "source": "./", "strict": false,
      "skills": ["./skills/cosmic-python", "./skills/architecture"]
    },
    {
      "name": "meaningfy-consulting",
      "description": "Semantic-technologies consulting coaching and executive communication",
      "source": "./", "strict": false,
      "skills": ["./skills/semantic-consulting-coach", "./skills/executive-communication"]
    }
  ]
}
```

- [ ] **Step 2: Verify consistency**

Run: `make validate`
Expected: PASS — `missing_skill_dirs` and `unregistered_skill_dirs` both empty (all 4 skills present and registered).

- [ ] **Step 3: Commit**

```bash
git add .claude-plugin/marketplace.json
git commit -m "refactor: regroup marketplace into domain bundles"
```

---

### Task 1.7: README + CONTRIBUTING alignment

**Files:**
- Modify: `README.md`
- Modify: `CONTRIBUTING.md`

- [ ] **Step 1: Rewrite README inventory + structure**

Replace the Skills Inventory table to list all current skills (cosmic-python, architecture, semantic-consulting-coach, executive-communication) and update the Repository Structure block to the target tree (skills/, agents/, docs/, prompts/, spec/, template/). Replace the install examples with the 3 bundle names. Remove the dead `THIRD_PARTY_NOTICES.md` reference (done in 1.3 Step 6 — confirm).

- [ ] **Step 2: Re-align CONTRIBUTING checklist**

In `CONTRIBUTING.md`, replace the "Documentation ✓" block that mandates `REFERENCE.md`/`EXAMPLES.md`/`ADVANCED.md` with: "References live under `references/` with domain-meaningful names; SKILL.md ≤ ~500 lines; no duplicated content." Keep the rest.

- [ ] **Step 3: Verify and commit**

Run: `make validate` — Expected: PASS (no broken links).

```bash
git add README.md CONTRIBUTING.md
git commit -m "docs: sync README inventory and align CONTRIBUTING with practice"
```

---

## Workstream 1 acceptance check

- `make validate` is green.
- `.idea/` untracked and ignored; README inventory complete; no broken internal links (ai-coding scope temporarily skipped, lifted in WS4).
- Marketplace has 2 coherent bundles with all listed skills present.
- Branch `skill/repo-reorg` has one commit per task.
