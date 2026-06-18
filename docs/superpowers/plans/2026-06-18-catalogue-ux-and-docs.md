# Catalogue UX & Docs Onboarding — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reorganise the catalogue into 4 role bundles with a flat `skills/` layout, gloss "spine"/drop "dogfood", and rewrite the README onboarding (install, getting-started, uninstall/conflicts, docs map).

**Architecture:** Role bundles (`core`/`consulting`/`architecture`/`building`) with a small `core` so every skill lives in exactly one bundle — no overlays. Disk flattened to `skills/<skill>/`; bundles defined only in `marketplace.json`. README and ripple docs updated to the new names.

**Tech Stack:** Markdown, JSON (marketplace), Python validator (`tools/repo_lint`), `make validate`.

## Global Constraints

- The guardrail is `make validate` (lint + pytest). It MUST be green at the end of every task.
- Every skill MUST be registered in exactly one bundle; the README MUST list every skill by name (enforced by `test_readme_lists_every_skill`).
- 18 skills total: `technical-writing, meaningfy-git-workflow, guardrails` (core); `semantic-consulting-coach, decision-package, proposal-writing, estimation, executive-communication` (consulting); `architecture, conceptual-modelling` (architecture); `epic-planning, spec-stewardship, clarity-gate, bdd-gherkin, meaningfy-code-review, cosmic-python, project-setup, ci-cd-delivery` (building).
- Use `git mv` for all relocations (preserve history). Frozen skills (`executive-communication`, `semantic-consulting-coach`) move byte-identical.
- Conventional Commits; commit at the end of each task.
- Branch: `feat/catalogue-ux-and-docs` (already created).

---

### Task 1: Flatten `skills/` + re-cut marketplace to 4 role bundles + validator

**Files:**
- Modify (move): all 18 `skills/<phase>/<skill>/` → `skills/<skill>/`
- Modify: `.claude-plugin/marketplace.json` (4 bundles, version → 2.2.0)
- Modify: `tools/repo_lint/lint.py` (EXPECTED_BUNDLES → 4 roles; delete META_BUNDLES + overlay logic)
- Modify: `tests/test_repo_lint.py`, `tests/test_repo_lint_negative.py` (drop meta-bundle tests)
- Modify: any markdown link broken by the move (spine/, CLAUDE.md, README placeholders fixed in later tasks)

- [ ] **Step 1: Flatten the skill directories**

```bash
cd /home/lps/work/workspace-charm/agent-skills
for p in skills/*/*/SKILL.md; do d=$(dirname "$p"); n=$(basename "$d"); git mv "$d" "skills/$n"; done
# remove now-empty phase dirs
rmdir skills/consulting skills/communication skills/engineering skills/ai-coding 2>/dev/null
find skills -name SKILL.md | sort   # expect 18 at skills/<skill>/SKILL.md
```

- [ ] **Step 2: Rewrite `EXPECTED_BUNDLES` and delete `META_BUNDLES`**

In `tools/repo_lint/lint.py`, replace the `EXPECTED_BUNDLES`/`META_BUNDLES` blocks with:

```python
EXPECTED_BUNDLES = {
    "meaningfy-core": {"technical-writing", "meaningfy-git-workflow", "guardrails"},
    "meaningfy-consulting": {
        "semantic-consulting-coach", "decision-package", "proposal-writing",
        "estimation", "executive-communication",
    },
    "meaningfy-architecture": {"architecture", "conceptual-modelling"},
    "meaningfy-building": {
        "epic-planning", "spec-stewardship", "clarity-gate", "bdd-gherkin",
        "meaningfy-code-review", "cosmic-python", "project-setup", "ci-cd-delivery",
    },
}
```

Then in `expected_bundle_membership`, remove the `META_BUNDLES`/`is_meta` branch so it is pure 1:1 ownership:

```python
def expected_bundle_membership(repo: Path) -> list[str]:
    reverse = {s: b for b, skills in EXPECTED_BUNDLES.items() for s in skills}
    out: list[str] = []
    for plugin in _marketplace(repo).get("plugins", []):
        bundle = plugin.get("name")
        if bundle not in EXPECTED_BUNDLES:
            out.append(f"unknown bundle '{bundle}' (not in EXPECTED_BUNDLES)")
            continue
        for raw in plugin.get("skills", []):
            skill = raw.replace("./skills/", "").strip("/").split("/")[-1]
            want = reverse.get(skill)
            if want is None:
                out.append(f"skill '{skill}' is not in EXPECTED_BUNDLES")
            elif want != bundle:
                out.append(f"skill '{skill}' in '{bundle}', expected '{want}'")
    return out
```

Delete the `META_BUNDLES = {...}` definition.

- [ ] **Step 3: Rewrite `marketplace.json`**

4 plugins, `metadata.version` → `2.2.0`, all paths flat `./skills/<skill>`:
- `meaningfy-core`: technical-writing, meaningfy-git-workflow, guardrails
- `meaningfy-consulting`: semantic-consulting-coach, decision-package, proposal-writing, estimation, executive-communication
- `meaningfy-architecture`: architecture, conceptual-modelling
- `meaningfy-building`: epic-planning, spec-stewardship, clarity-gate, bdd-gherkin, meaningfy-code-review, cosmic-python, project-setup, ci-cd-delivery

Give each a one-line `description` matching its role.

- [ ] **Step 4: Fix tests referencing META_BUNDLES / old bundles**

In `tests/test_repo_lint.py`: delete `test_spine_meta_bundle_overlay_is_allowed`. Keep `test_skills_are_nested_in_phase_subfolders`? No — rename/replace it with a flat-layout assertion:

```python
def test_skills_are_flat():
    paths = lint._skill_paths(REPO)
    assert "cosmic-python" in paths
    assert paths["cosmic-python"].parts[-2:] == ("cosmic-python", "SKILL.md")
```

In `tests/test_repo_lint_negative.py`: delete `test_meta_bundle_with_unowned_skill_is_flagged`. Update `test_wrong_bundle_is_flagged`/`test_clean_fixture_passes_all` if they used old bundle names (they use `meaningfy-engineering`/`meaningfy-consulting` with `cosmic-python` — change engineering→core-or-building consistent with the new map: cosmic-python now lives in `meaningfy-building`, so the wrong-bundle test should put it in `meaningfy-consulting` and expect `meaningfy-building`; the clean fixture should use `meaningfy-building`).

- [ ] **Step 5: Fix spine/ + CLAUDE.md links broken by the flatten**

```bash
# spine docs linked ../skills/<phase>/<skill>; flatten to ../skills/<skill>
sed -i -E 's#\(\.\./skills/(ai-coding|engineering|consulting|communication)/#(../skills/#g' spine/*.md
# CLAUDE.md linked skills/<skill>
sed -i -E 's#\(skills/(ai-coding|engineering|consulting|communication)/#(skills/#g' CLAUDE.md
grep -rnE '\]\(\.\.?/?skills/(ai-coding|engineering|consulting|communication)/' spine/ CLAUDE.md || echo "no stale phase links"
```

- [ ] **Step 6: Run validate**

```bash
make validate
```
Expected: `OK — repository self-consistent.` and pytest all green. Fix any `broken_links`/`expected_bundle_membership`/test failures before continuing.

- [ ] **Step 7: Commit**

```bash
git add -A skills tools/repo_lint/lint.py tests .claude-plugin/marketplace.json spine CLAUDE.md
git commit -m "refactor(catalogue): flatten skills + re-cut into 4 role bundles"
```

---

### Task 2: Terminology pass (gloss "spine", drop "dogfood")

**Files:** `README.md`, `spine/README.md`, `CLAUDE.md`, `docs/ai-coding/openspec-setup-guide.md` (spine gloss); `spine/lessons-loop.md`, `spine/epic-change-memory-mapping.md`, README + any skill/doc with "dogfood" (drop term). NOT `.claude/` planning docs.

- [ ] **Step 1: Find occurrences**

```bash
git grep -n "dogfood" -- '*.md' ':!.claude/*' ':!docs/superpowers/*'
git grep -n "the spine" -- spine/README.md CLAUDE.md docs/ai-coding/openspec-setup-guide.md
```

- [ ] **Step 2: Gloss "spine" on first use** in each entry-point file: replace the first "the spine" with "the spine (the durable, traceable spec backbone)". (Manual per file; only the FIRST mention per file.)

- [ ] **Step 3: Replace "dogfood"/"dogfooding"** in published docs/skills/spine with plain phrasing, e.g. "skillery runs its own method on itself (the live reference example)" / "running the spine on this series is the method applied to itself". Re-grep to confirm none remain outside `.claude/`.

- [ ] **Step 4: Validate + commit**

```bash
make validate   # broken_links must stay green
git add -A README.md spine docs/ai-coding/openspec-setup-guide.md CLAUDE.md skills
git commit -m "docs: gloss 'spine' at entry points; drop 'dogfood' jargon"
```

---

### Task 3: Rewrite the README (9 sections)

**Files:** `README.md`. Content per spec §3.4. Must keep every skill name listed (test) and all links resolving.

- [ ] **Step 1: Write the new README** with sections: What this is (gloss spine) · Who it's for (3 roles) · What's inside (4-bundle table, every skill named, + the 3 agents) · Installation (prereqs; mandatory `superpowers`/`stream-coding`/`ponytail`/OpenSpec + optional `commit-commands`/`code-review`/`gitnexus`/`context7`; 4 bundle install commands; user-vs-project summary → `docs/environment-setup.md`) · Getting started (agents-vs-skills rule of thumb; task→tools table; **step-by-step epic loop** naming skill/agent + `/opsx` verb per step, cross-link `spine/workflows.md`) · Uninstall & conflicts (check-what-you-have command + worked example: old 3 bundles → migrate to 4; `feature-dev` agent overlap → optional disable; `code-review`+`commit-commands` complementary keep; missing `stream-coding`+`ponytail` install) · Documentation (map of `docs/` + reading order + Pages-follow-up note) · Repository structure (flat `skills/`, 4 bundles, `spine/`+`openspec/`) · Contributing/Licensing/Support.

- [ ] **Step 2: Validate + commit**

```bash
make validate   # readme_inventory_gaps test + broken_links must pass
git add README.md && git commit -m "docs(readme): role bundles, install, getting-started, conflicts, docs map"
```

---

### Task 4: Ripple — update remaining docs to the 4 bundles + spine-as-capability

**Files:** `docs/environment-setup.md`, `CONTRIBUTING.md`, `spec/CREATING_SKILLS.md`, `prompts/global-prompt.md`, `skills/project-setup/{SKILL.md,references/agentic-setup.md,references/checklists.md}`, `docs/ai-coding/two-tier-methodology.md`, `spine/meaningfy-spine-bundle.md` (rewrite → "the spine is a capability `building` carries + assets `project-setup` projects; not a bundle").

- [ ] **Step 1: Update bundle names** everywhere they appear (`meaningfy-engineering`/`-ai-coding`/`-communication`/`-spine` → the 4 role names; map skills to their new home). `environment-setup.md` §1 bundle install commands → the 4 bundles with correct membership.

- [ ] **Step 2: Rewrite `spine/meaningfy-spine-bundle.md`** as `spine/meaningfy-spine.md` (or rewrite in place) describing the spine as capability + projected assets, not a marketplace bundle. Fix inbound links.

- [ ] **Step 3: Validate + commit**

```bash
make validate
git add -A docs spec prompts skills/project-setup spine CONTRIBUTING.md
git commit -m "docs: update bundle names to 4 roles; spine is a capability, not a bundle"
```

---

### Task 5: Log the AsciiDoc/Pages follow-up + final verification

**Files:** `.claude/HARD-QUESTIONS.md`.

- [ ] **Step 1: Append HQ** recording the deferred hybrid AsciiDoc + Antora + GitHub Pages migration of the durable canon (`engineering-standards/`, `philosophy/`, architecture/ADRs) as a future EPIC, per spec D7.

- [ ] **Step 2: Final full verification**

```bash
make validate && make validate-spine
python3 -c "import json;[print(p['name'], len(p['skills'])) for p in json.load(open('.claude-plugin/marketplace.json'))['plugins']]"
find skills -name SKILL.md | wc -l   # 18
```

- [ ] **Step 3: Commit**

```bash
git add .claude/HARD-QUESTIONS.md && git commit -m "docs: log deferred AsciiDoc+Antora+Pages canon migration (HARD question)"
```

---

## Self-review notes

- Spec coverage: D1–D4 → Task 1; D5 → Task 2; D6 → Task 3; ripple/D3 spine-doc → Task 4; D7 → Task 5. All acceptance criteria A1–A7 mapped.
- Each task ends `make validate`-green and is independently reviewable.
- Frozen-skill byte-identity preserved (move-only).
