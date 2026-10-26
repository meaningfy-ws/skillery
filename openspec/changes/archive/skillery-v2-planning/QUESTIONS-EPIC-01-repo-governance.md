# Open Questions — EPIC-01: Repo Governance & Self-Alignment

> Questions for [EPIC-01](EPIC-01-repo-governance.md) · [PLAN-01](PLAN-01-repo-governance.md). Answer inline on the **Answer:** lines.

### Q1.1 — Symlink vs remove for `AGENTS.md` — revisiting because PLAN-01 T2 leaves it genuinely open.
DEC-4 locks "CLAUDE.md canonical; AGENTS.md *may* be a symlink." PLAN-01 explicitly records the
symlink-vs-remove choice as an unresolved per-filesystem decision, so this is open by design, not a
re-litigation. The choice ripples to templates (R7) and project-setup output (EPIC-09 R6).
- **A) ★** Ship the `AGENTS.md → CLAUDE.md` symlink everywhere by default; document the Windows/zip-export caveat. — Serves Codex/AGENTS-reading tools at zero drift cost; the caveat is rare.
- **B)** Remove `AGENTS.md` entirely; add the symlink only on explicit request. — Simplest, but silently drops AGENTS-tool users.
- **C)** Ship a *generated* (non-symlink) `AGENTS.md` stub that just says "see CLAUDE.md" + a validator rule that it stays a one-liner. — Filesystem-portable, but reintroduces a second file the validator must police.

**Answer:** 
C

### Q1.2 — What is the actual authority relationship in the one-constitution chain (R9)?
R9 declares `~/.claude/CLAUDE.md` ≡ `docs/engineering-standards/coding-prompt.md` ≡ projected
`openspec/project.md`, saying which is "operational" vs "narrating" — but does not fix which file is
the *editable source* and which are derived. This determines whether they can drift.
- **A) ★** `coding-prompt.md` (the human canon, in-repo, version-controlled) is the single editable source; the global `~/.claude/CLAUDE.md` is a developer's *installed copy* of it; `openspec/project.md` *points to* it. — One reviewable source under git; copies are explicitly derivative.
- **B)** The global `~/.claude/CLAUDE.md` is the source of truth (it is what actually loads for the human); the repo doc is a published mirror. — Matches load reality but puts the canon outside version control.
- **C)** Treat all three as peers bound by a validator that diffs them and fails on divergence. — Strongest guarantee, most tooling cost.

**Answer:** 
A 

### Q1.3 — Should the canonical `CLAUDE.md` retain the GitNexus block at all?
R1 mandates retaining the harness-injected GitNexus block "demarcated below" the operating manual.
But that block is tool-specific and high-churn; mixing it with the durable operating manual couples
two very different lifecycles in the one file the harness loads.
- **A) ★** Retain it but clearly fenced under a `<!-- GitNexus (harness-managed, do not edit) -->` marker so humans never hand-edit it and the operating-manual content stays stable above. — Honours R1, prevents accidental edits, keeps lifecycles visually separate.
- **B)** Move GitNexus guidance into a referenced `docs/` page and keep `CLAUDE.md` purely the operating manual. — Cleanest separation, but the harness may re-inject the block anyway, causing churn.
- **C)** Accept the block inline as-is (status quo). — Zero work, but invites hand-edits and drift.

**Answer:** 
this GitNExus snipped is installed in every claude.md and agent.md per project. This code is NOT needed in the user level claude.md as it is auto generated in every tprojects. we want to only indicate high level hints that gitnexus is useful, but not more than that. also make sure gitnexus cli and mcp is installed and mcp auto-running on the project and user setup. 