# Workstream 3 — Agents → Skills + Thin Wrappers — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax. Run `make validate` after each task.

**Goal:** Extract reusable knowledge from the agents into skills, capture the one project-specific residue into the CLAUDE.md template, then **delete the `agents/` directory entirely** (O2).

**Architecture:** For each knowledge-bearing agent, author a skill from its body and register it in `meaningfy-ai-coding`. The `implementer` needs no skill (its content = external `stream-coding` + `cosmic-python` + `superpowers:test-driven-development`); its Meaningfy-specific orchestration residue is captured for the CLAUDE.md template (Workstream 4). Finally, remove all agent files.

**Tech Stack:** Markdown skills; validation via `make validate`.

**Spec coverage:** R8, R9, R10, R11, R12. Depends on Workstreams 1 and 2 (skills must exist before agents are removed and before docs/templates reference them).

> **O2 resolved:** drop **all** agents. No thin wrappers remain in this repo; consuming repos define their own wrappers if needed.

---

### Task 3.1: Extract `bdd-gherkin` skill (from `gherkin-writer`)

**Files:**
- Create: `skills/bdd-gherkin/SKILL.md`
- Source: `agents/gherkin-writer.md` (body)
- Modify: `.claude-plugin/marketplace.json`

- [ ] **Step 1: Author the skill**

Frontmatter `name: bdd-gherkin`; `description:` write BDD Gherkin feature files and fabricate test data from a spec — business-language scenarios, `Scenario Outline` with `Examples:`, explicit edge cases. Use when writing `.feature` files or acceptance scenarios. Body (lifted from the agent's "Core Behaviour" + "Quality Checks"): feature-file conventions, Scenario-Outline pattern, sourcing edge cases from a spec's test-case/error tables, test-data fabrication, the quality checklist. **Boundary:** writes features and data; does NOT write step definitions or production code (→ implementer); does NOT plan (→ epic-planning). Related: `stream-coding`, `clarity-gate`.

- [ ] **Step 2: Register — append `"./skills/bdd-gherkin"` to `meaningfy-ai-coding`.**

- [ ] **Step 3: Validate & commit**

Run: `make validate` — Expected: PASS.
```bash
git add -A && git commit -m "feat: extract bdd-gherkin skill from gherkin-writer agent"
```

---

### Task 3.2: Extract `meaningfy-code-review` skill (from `code-reviewer`)

**Files:**
- Create: `skills/meaningfy-code-review/SKILL.md`
- Source: `agents/code-reviewer.md` (the review checklist + output format)
- Modify: `.claude-plugin/marketplace.json`

> **Name:** `meaningfy-code-review`, **not** `code-review` — avoids colliding with the external `code-review` plugin/command.

- [ ] **Step 1: Author the skill**

Frontmatter `name: meaningfy-code-review`; `description:` Meaningfy pre-PR review checklist — architecture conformance, Clean Code/SOLID, security, testing, and spec conformance, with prioritised findings. Body: the five checklist blocks + the Critical/Warnings/Suggestions output format with file:line + principle + fix. **Boundary:** defines *what to check*; references `cosmic-python` for layering rules rather than restating them; pairs with the external `code-review` command and `superpowers:requesting-code-review` for the read-only *enforcement* (or a consuming-repo wrapper). Related: `cosmic-python`.

- [ ] **Step 2: Register — append `"./skills/meaningfy-code-review"` to `meaningfy-ai-coding`.**

- [ ] **Step 3: Validate & commit**

Run: `make validate` — Expected: PASS.
```bash
git add -A && git commit -m "feat: extract meaningfy-code-review skill from code-reviewer agent"
```

---

### Task 3.3: Extract `epic-planning` skill (from `epic-planner`)

**Files:**
- Create: `skills/epic-planning/SKILL.md`
- Create: `skills/epic-planning/references/epic-template.md`
- Source: `agents/epic-planner.md` (EPIC.md structure + procedure)
- Modify: `.claude-plugin/marketplace.json`

- [ ] **Step 1: Move the EPIC.md template into a reference**

Author `skills/epic-planning/references/epic-template.md` from the `### EPIC.md Structure` block in the agent (two-part spec/implementation-log layout, all sections).

- [ ] **Step 2: Author the skill**

Frontmatter `name: epic-planning`; `description:` turn a Work Shape / architecture docs into an implementation-ready EPIC spec — ask before assuming, produce the EPIC.md, run the clarity gate. Body: the planning procedure (read inputs → ask → draft → gate), pointer to `references/epic-template.md`, the ≥9/10 rule. **Boundary:** owns the planning procedure + EPIC structure; delegates spec scoring to `clarity-gate` and the doc-first method to `stream-coding`; does NOT write code or Gherkin. Related: `stream-coding`, `clarity-gate`, `bdd-gherkin`.

- [ ] **Step 3: Register — append `"./skills/epic-planning"` to `meaningfy-ai-coding`.**

- [ ] **Step 4: Validate & commit**

Run: `make validate` — Expected: PASS.
```bash
git add -A && git commit -m "feat: extract epic-planning skill from epic-planner agent"
```

---

### Task 3.4: Extract `technical-writing` skill (from `documenter`)

**Files:**
- Create: `skills/technical-writing/SKILL.md`
- Source: `agents/documenter.md` (doc types, lightweight clarity check, style)
- Modify: `.claude-plugin/marketplace.json`

- [ ] **Step 1: Author the skill**

Frontmatter `name: technical-writing`; `description:` produce clear docs, explanations, summaries, and docstrings — AsciiDoc/Antora or Markdown, with a lightweight clarity check. Body: doc types, the lightweight clarity checklist (the *delta* from full `clarity-gate`), writing style (tables over prose, file:line refs, Antora conventions). **Boundary:** owns documentation; does NOT plan (→ epic-planning) or run the full gate (→ clarity-gate). Related: `clarity-gate`.

- [ ] **Step 2: Register — append `"./skills/technical-writing"` to `meaningfy-ai-coding`.**

- [ ] **Step 3: Validate & commit**

Run: `make validate` — Expected: PASS.
```bash
git add -A && git commit -m "feat: extract technical-writing skill from documenter agent"
```

---

### Task 3.5: Capture the `implementer` residue for the CLAUDE.md template

**Files:**
- Create: `.claude/implementer-residue.md` (scratch hand-off to Workstream 4 Task 4.7)

> The `implementer` gets **no skill** — its engineering content is the external `stream-coding` + `cosmic-python` + `superpowers:test-driven-development`. Only its project-specific orchestration is worth keeping, and that belongs in the CLAUDE.md project template, not a shipped artifact.

- [ ] **Step 1: Extract the orchestration residue**

From `agents/implementer.md`, copy into `.claude/implementer-residue.md` only: the gitnexus impact sequence (status → analyze → impact/context, HIGH/CRITICAL handling), the generate-verify-integrate loop *steps*, the memory-file paths/structure, and the `commit-commands:commit`-on-consent handoff. This file is consumed by WS4 Task 4.7 (CLAUDE.md template) and then deleted.

- [ ] **Step 2: Commit**

```bash
git add .claude/implementer-residue.md
git commit -m "chore: capture implementer orchestration residue for the CLAUDE.md template"
```

---

### Task 3.6: Delete the `agents/` directory (O2)

**Files:**
- Delete: `agents/implementer.md`, `agents/code-reviewer.md`, `agents/epic-planner.md`, `agents/gherkin-writer.md`, `agents/documenter.md` (the whole dir)

> Pre-req: Tasks 3.1–3.4 created the skills; Task 3.5 captured the residue. Only now is it safe to remove the agents.

- [ ] **Step 1: Remove all agent files**

```bash
git rm -r agents
```

- [ ] **Step 2: Repoint references in non-frozen files**

Run: `grep -rn "gherkin-writer\|documenter\|code-reviewer\|epic-planner\|implementer" docs/ skills/ prompts/ README.md`
For each hit in a **non-frozen** file: "the gherkin-writer agent" → "the `bdd-gherkin` skill"; "documenter" → "`technical-writing` skill"; "code-reviewer" → "`meaningfy-code-review` skill (+ external `code-review`)"; "epic-planner" → "`epic-planning` skill"; implementer orchestration → "the CLAUDE.md template". **Do not edit** `docs/ai-coding/` (frozen, C1) — its agent references are acceptable historical context; note them in `docs/environment-setup.md` instead.

- [ ] **Step 3: Validate & commit**

Run: `make validate` — Expected: PASS.
```bash
git add -A && git commit -m "refactor: drop agents directory (knowledge now lives in skills)"
```

---

## Workstream 3 acceptance check

- Four new skills (`bdd-gherkin`, `meaningfy-code-review`, `epic-planning`, `technical-writing`) exist, registered in `meaningfy-ai-coding`.
- The `agents/` directory is **gone** (A4); the implementer residue is captured for the CLAUDE.md template (WS4).
- Non-frozen references repointed to skills; `docs/ai-coding/` left untouched (frozen).
- `make validate` green; one commit per task.
