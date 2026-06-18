# Meaningfy Agent-Skills Reorganization — Master Implementation Plan

> **For agentic workers:** This is the index. Execute the four workstream plans in order. Each is a standalone plan with checkbox steps; use `superpowers:subagent-driven-development` or `superpowers:executing-plans` per workstream.

**Goal:** Reorganize this repository into the company-wide home for AI-assisted working — a validated catalog of skills, thin agents, human methodology canon, and binding templates.

**Spec:** [`EPIC-setup.md`](EPIC-setup.md) (requirements R1–R26, constraints C1–C4, acceptance A1–A8).

**Authoritative addenda (apply on top of the four plan files):**
- [`EPIC-setup-review-decisions.md`](EPIC-setup-review-decisions.md) — adopted decisions D1–D10 from the four-reviewer pass (notably D1: thin-wrapper hybrid, not full agent-drop).
- [`EPIC-setup-quality-gates.md`](EPIC-setup-quality-gates.md) — the DoD / G-* gate charter and per-workstream verify+validate checks. This is the TDD harness for implementation.

Where these addenda conflict with the four plan files, **the addenda win**.

**Prerequisite fixes (do first in WS1, before any "Expected: PASS" gate):** author top-of-file frontmatter for `skills/architecture/SKILL.md` (+ R3 Boundary + R6 ADR/codegen cross-pointer); make WS1 Task 1.2 verify-only (`.idea/` already ignored+untracked); build the validator with the D4 checks **and a negative test that proves it bites**.

---

## Workstream plans (execute in this order)

| # | Plan file | Builds | Depends on |
|---|---|---|---|
| 1 | [`EPIC-setup-plan-1-structure.md`](EPIC-setup-plan-1-structure.md) | Top-level dirs, `.gitignore`, `Makefile`, validation script + CI, marketplace bundles, README/CONTRIBUTING fixes | — |
| 2 | [`EPIC-setup-plan-2-skills.md`](EPIC-setup-plan-2-skills.md) | Promote `clarity-gate` to a real skill; de-dup buried `stream-coding` files (external is canonical); new `meaningfy-git-workflow`; cosmic-python boundary touch-ups | 1 |
| 3 | [`EPIC-setup-plan-3-agents.md`](EPIC-setup-plan-3-agents.md) | Extract `bdd-gherkin`, `meaningfy-code-review`, `epic-planning`, `technical-writing` skills; capture implementer residue; **delete the `agents/` dir** | 1, 2 |
| 4 | [`EPIC-setup-plan-4-docs-prompts.md`](EPIC-setup-plan-4-docs-prompts.md) | `docs/engineering-standards/`, `docs/philosophy/`, `environment-setup.md`, `dod-quality-gates.md`, `prompts/` templates, bootstrap `scripts/`; relocate the coding prompt | 1 |

## Sequencing rationale

- **1 first:** the validation harness (`make validate`) is the safety net every later workstream commits against; the directory skeleton must exist before anything moves into it.
- **2 before 3:** agents reference skills (`implementer` loads `cosmic-python`; `code-reviewer` references the review checklist), so the skills must exist before agents are slimmed to point at them.
- **4 parallel-safe with 2/3** after 1, but listed last to keep review batches small.

## Definition of done (whole EPIC)

All of A1–A6 in the spec hold; each workstream plan's own acceptance check passes; `make validate` is green; final commit on a `skill/repo-reorg` branch with a PR opened (not merged) for human review.

## Cross-cutting conventions (apply in every workstream)

- **Branch:** create `skill/repo-reorg` before task 1; never commit to `main` directly.
- **Moves preserve history:** use `git mv`, never delete-and-recreate (C2).
- **Never delete or `git rm` a gitignored folder** (e.g. `.idea/`) — add the ignore rule only (user directive).
- **External skills are referenced, never vendored** (stream-coding, superpowers, commit-commands, gitnexus, code-review, context7) — see `docs/environment-setup.md`.
- **Frozen artifacts (C1):** `executive-communication`, `semantic-consulting-coach`, `docs/ai-coding/` — `git mv` only; never edit their bytes. Verify with `git diff --stat -M` showing pure renames.
- **Commit cadence:** one commit per completed task; conventional-commit messages (imperative, no trailing period).
- **After each workstream:** run `make validate` and stop for the review checkpoint.
