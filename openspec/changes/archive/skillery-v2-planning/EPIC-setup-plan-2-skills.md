# Workstream 2 — Skill Catalog: Promote, De-dup, Extend — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax. Run `make validate` after each task; it must stay green.

**Goal:** Turn buried `cosmic-python/references/` knowledge into first-class skills, remove the resulting duplication, add the missing `meaningfy-git-workflow` skill, and tighten cosmic-python's boundaries.

**Architecture:** `git mv` reference files into new skill directories, then author a conforming `SKILL.md` for each (frontmatter + Overview + Quick Start + boundary + references). Every new skill is registered in `marketplace.json` in the same task so the validator stays consistent.

**Tech Stack:** Markdown skills per `spec/agent-skills-spec.md`; validation via `make validate`.

**Spec coverage:** R1, R2, R3, R4, R5, R7, R23. Depends on Workstream 1.

> **O1 resolved:** `stream-coding` is **external** — not vendored here. Task 2.1 de-dups the buried copies; the dependency is documented in `docs/environment-setup.md` (Workstream 4). `clarity-gate` (Task 2.2) is owned here because it is not available externally.

---

### Task 2.1: De-dup the buried `stream-coding` files (external skill is canonical)

**Files:**
- Source: `skills/cosmic-python/references/stream-coding-methodology.md`, `skills/cosmic-python/references/phase-1-strategic-blueprint-checklist.md`
- Possibly create: `docs/engineering-standards/stream-coding-notes.md` (only if Meaningfy-specific delta exists)

> Do not create a `stream-coding` skill — it is external (installed). Preserve any Meaningfy-specific delta; remove the rest.

- [ ] **Step 1: Diff the buried copies against the external skill**

Install/locate the external `stream-coding` skill and compare. Identify whether `stream-coding-methodology.md` / `phase-1-strategic-blueprint-checklist.md` contain Meaningfy-specific content not in the external skill.

- [ ] **Step 2a: If a delta exists — relocate it as human notes**

```bash
git mv skills/cosmic-python/references/stream-coding-methodology.md docs/engineering-standards/stream-coding-notes.md
```
Trim the file to only the Meaningfy-specific delta; add a header: "Meaningfy adaptation notes. The operational method is the external `stream-coding` skill."

- [ ] **Step 2b: If no delta — remove the duplicates**

```bash
git rm skills/cosmic-python/references/stream-coding-methodology.md
```

- [ ] **Step 3: Handle the phase-1 checklist the same way**

`phase-1-strategic-blueprint-checklist.md` belongs to stream-coding's Phase 1 → relocate-as-delta or `git rm` per Steps 2a/2b. (The Phase-2 checklist is handled in Task 2.2.)

- [ ] **Step 4: Validate & commit**

Run: `make validate` — Expected: PASS.
```bash
git add -A && git commit -m "refactor: de-dup buried stream-coding files (external skill is canonical)"
```

---

### Task 2.2: Promote `clarity-gate` to a real skill

**Files:**
- Create dir: `skills/clarity-gate/`
- Move: `skills/cosmic-python/references/phase-2-clarity-gate-checklist.md` → `skills/clarity-gate/references/clarity-gate-checklist.md`
- Create: `skills/clarity-gate/SKILL.md`
- Modify: `.claude-plugin/marketplace.json`

- [ ] **Step 1: Move the checklist**

```bash
mkdir -p skills/clarity-gate/references
git mv skills/cosmic-python/references/phase-2-clarity-gate-checklist.md skills/clarity-gate/references/clarity-gate-checklist.md
```

- [ ] **Step 2: Author `skills/clarity-gate/SKILL.md`**

Frontmatter `name: clarity-gate`; `description:` pre-ingestion quality gate for specs/docs — 13-item checklist + 6-criterion scoring (≥9/10 to proceed); epistemic check that surfaces hidden assumptions. Body: Overview; the full gate (detail in `references/clarity-gate-checklist.md`); a **lightweight variant** for routine docs; Boundary ("verifies spec readiness; does NOT plan — see stream-coding/epic-planning"); Related: `stream-coding`, `epic-planning`, `technical-writing`.

- [ ] **Step 3: Register — create the `meaningfy-ai-coding` bundle**

In `.claude-plugin/marketplace.json` `plugins`, add (this is the first skill in the bundle; later WS3 skills append to it):

```json
{
  "name": "meaningfy-ai-coding",
  "description": "Documentation-first AI-assisted development helpers: clarity gate, EPIC planning, BDD, code review, and technical writing (pairs with the external stream-coding + superpowers skills — see docs/environment-setup.md)",
  "source": "./", "strict": false,
  "skills": ["./skills/clarity-gate"]
}
```

- [ ] **Step 4: Validate & commit**

Run: `make validate` — Expected: PASS.
```bash
git add -A && git commit -m "feat: promote clarity-gate to a first-class skill"
```

---

### Task 2.3: De-dup confirmation in cosmic-python

**Files:**
- Modify: `skills/cosmic-python/SKILL.md` (and any reference index)

- [ ] **Step 1: Find dangling pointers to the moved files**

Run: `grep -rn "stream-coding-methodology\|phase-1-strategic\|phase-2-clarity-gate" skills/cosmic-python/`
Expected: lines in SKILL.md or references that referenced the now-moved files.

- [ ] **Step 2: Repoint them to the new skills**

Replace any in-skill links to the moved files with prose pointers: "see the `stream-coding` skill" / "see the `clarity-gate` skill" (skills reference each other by name, not by cross-directory path).

- [ ] **Step 3: Validate & commit**

Run: `make validate` — Expected: PASS (no broken links).
```bash
git add -A && git commit -m "refactor: repoint cosmic-python to stream-coding and clarity-gate skills"
```

---

### Task 2.4: cosmic-python boundary touch-ups

**Files:**
- Modify: `skills/cosmic-python/SKILL.md`

- [ ] **Step 1: Fix canonical vocabulary (R5)**

Add a short "Canonical vocabulary" note: `models/`, `adapters/`, `services/`, `entrypoints/` + root-modules are canonical; the Cosmic Python book's `/domain` and `/service_layer` are documented synonyms.

- [ ] **Step 2: Add boundary + cross-references**

Add a **Boundary** subsection: cosmic-python owns code structure (layers, SOLID, layer-tests, CI guardrails); it does NOT own the TDD ritual (→ `superpowers:test-driven-development`), system design (→ `architecture`), or commit/PR rules (→ `meaningfy-git-workflow`). Replace any inline restatement of red-green-refactor with a pointer to `superpowers:test-driven-development`.

- [ ] **Step 3: Validate & commit**

Run: `make validate` — Expected: PASS.
```bash
git add -A && git commit -m "docs: clarify cosmic-python boundaries and canonical vocabulary"
```

---

### Task 2.5: New skill `meaningfy-git-workflow`

**Files:**
- Create: `skills/meaningfy-git-workflow/SKILL.md`
- Create: `skills/meaningfy-git-workflow/references/dev-environment.md`
- Modify: `.claude-plugin/marketplace.json`

- [ ] **Step 1: Author the SKILL.md**

Frontmatter `name: meaningfy-git-workflow`; `description:` Meaningfy git/GitHub conventions — conventional commits, branch naming, rebase/merge etiquette, PR workflow, and dev-environment hygiene. Use when committing, branching, opening/maintaining PRs, or setting up a dev environment. Body sections:
- **Commits:** Conventional Commits; imperative-mood title, no trailing punctuation; blank line before body; granular commits; squash successive "fix X" commits.
- **Branching:** `<type>/<ticket-id>/<short-label>`; use the ticketing system to generate names.
- **Workflow:** GitFlow for client projects, lighter for internal; `pull --rebase` on shared feature branches; rebase to incorporate base changes (merge if numerous); notify peers before force-push after rebase.
- **Pull Requests:** author creates PR; meaningful title (not the branch name verbatim); assign ≥1 reviewer (exceptions for small/non-critical or sole-dev); `[WIP]`/draft handling; keep PR branch up to date.
- **Free-tier GitHub constraints:** max 1 reviewer, no draft PRs → use `[WIP]` title prefix.
- **Boundary:** owns VCS/PR/dev-env; does NOT own code structure (→ cosmic-python) or commit *mechanics* (delegates to `commit-commands`). Related: `cosmic-python`, `commit-commands`.

- [ ] **Step 2: Author `references/dev-environment.md`**

Capture: plugins for the stack (highlighting); **turn off auto-format for RDF/less-common stacks**; **do not store project copies on a Windows filesystem accessed via WSL** (store in WSL, open with Windows apps from WSL) — explains slow git/indexing; company-email commit identity; GitHub notification routing / daily check.

- [ ] **Step 3: Register — append to `meaningfy-engineering`**

Add `"./skills/meaningfy-git-workflow"` to the `meaningfy-engineering` bundle's `skills` array.

- [ ] **Step 4: Validate & commit**

Run: `make validate` — Expected: PASS.
```bash
git add -A && git commit -m "feat: add meaningfy-git-workflow skill"
```

---

## Workstream 2 acceptance check

- `clarity-gate` is a real, registered skill; the buried `stream-coding` files are de-duped (relocated-as-delta or removed); nothing stream-coding-related remains under `cosmic-python/references/` (R23). No `stream-coding` skill is created here (external).
- `meaningfy-git-workflow` exists and is bundled in `meaningfy-engineering`.
- cosmic-python states canonical vocabulary and boundaries; no restated TDD ritual.
- `make validate` green; one commit per task; marketplace lists exactly the skills present.
