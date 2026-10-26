# EPIC-01: Repo Governance & Self-Alignment

> Part of the Skillery v2 series. See [EPIC-00](EPIC-00-master-index.md) for the governing thought,
> decisions register (DEC-*), and risk register (RISK-*). **Tier:** foundation. **Depends on:** —.

## 1. Purpose & goals (the shaped bet)

**Appetite:** small — a few days. This is the unblocking foundation: make the repo *practise what
it preaches* before we extend it. It carries low implementation risk but one verification risk
(RISK-1).

**Problem.** The repo's own agentic governance is inconsistent with the standard it ships:
- `CLAUDE.md` and `AGENTS.md` at the root are **byte-identical GitNexus blocks** — neither tells an
  agent how to *operate on this repo* (maintain/extend skills, run the validator, the four-artifact
  governance, Meaningfy practices).
- Two agentic files duplicate each other (drift risk), while `project-setup` standardised on the
  *wrong* canonical (`AGENTS.md`, which Claude Code does **not** load — DEC-4/RISK-1). The standard is
  split-brained and the loaded file is empty of guidance.
- Structural cruft the user flagged: `scripts/init-meaningfy-project.sh` overlaps `project-setup`;
  `template/` holds a lone `SKILL.md` separate from its governance in `spec/`.
- Three candidate "constitutions" (global `~/.claude/CLAUDE.md`, engineering-standards, a future
  `openspec/project.md`) risk drifting (RISK-5).

**Solution outline.** Initialise the canonical `CLAUDE.md` as this repo's operating manual (offer
`AGENTS.md` as a symlink → `CLAUDE.md`); apply the structural-cleanup verdicts; adopt the
split-by-churn doc standard as a governance doc; reconcile to one constitution (including the
user-level vs repo-level `CLAUDE.md` split).

**Non-goals.** Authoring new skills; the catalogue reorg (EPIC-04); OpenSpec wiring (EPIC-02). This
EPIC only fixes *this repo's* governance and layout.

---

## 2. Requirements

### 2.1 The canonical `CLAUDE.md` as the operating manual

- **R1** Replace the GitNexus-only **`CLAUDE.md`** (the file Claude Code actually loads — DEC-4) with
  a real operating manual for *this repo*, whose own content is thin and routes to the canon. It MUST
  cover:
  - **What this repo is** (the four artifact types: Skill / Agent / Doc / Binding — from
    `spec/skill-repo-governance.md`) and the single-source-of-authority rule.
  - **How to maintain/extend the catalogue**: where a new skill goes (→ `spec/CREATING_SKILLS.md`),
    how bundles are assigned (→ `.claude-plugin/marketplace.json`), the boundary/related-skills rule.
  - **How to validate**: `make validate` is the guardrail; run before every PR; CI runs it too.
  - **Common Meaningfy practices**: cosmic-python self-alignment, conventional commits
    (→ `meaningfy-git-workflow`), the spine conventions (→ EPIC-02 once landed).
  - The GitNexus block is **retained** (it is harness-injected) but clearly demarcated below the
    operating-manual content.
- **R2** `CLAUDE.md` carries **no reusable knowledge** that belongs in a skill or doc — it
  *mandates and routes* (it is a Binding per the four-artifact model).

### 2.2 Canonical agentic file: `CLAUDE.md` (+ optional `AGENTS.md` symlink) — DEC-4

- **R3** **`CLAUDE.md` is canonical** (Claude Code loads it; `AGENTS.md` is not loaded — RISK-1
  resolved). The operating-manual content lives in `CLAUDE.md`. The pre-existing root `AGENTS.md`
  becomes either an **`AGENTS.md` → `CLAUDE.md` symlink** (offered for AGENTS-reading tools such as
  Codex) or is removed. There is exactly **one source of truth**; the symlink, if present, never
  diverges.
- **R4** This decision is **company-wide** (DEC-4): the rule "`CLAUDE.md` is the canonical agentic
  file; `AGENTS.md` may be a symlink to it" is recorded in the constitution (R9) and applied to
  templates (R7) and `project-setup` output (EPIC-09). The prior `project-setup` "`AGENTS.md`
  canonical + `CLAUDE.md` symlink" choice is **inverted** and reconciled in EPIC-09.

### 2.3 Structural cleanup (the flagged items)

- **R5** **Delete `scripts/init-meaningfy-project.sh`** (DEC-5). Its capability folds into
  `project-setup` (EPIC-09). Remove the `scripts/` directory only if it is empty afterward (a future
  `scripts/scaffold.sh` for `project-setup`, EPIC-09, may re-create it). This EPIC removes the *file*
  and flags the `README.md` / `docs/environment-setup.md` rows that mention it for EPIC-04 (which
  owns those doc rewrites).
- **R6** **Consolidate `template/` into `spec/`.** Move the skill template `template/SKILL.md` →
  `spec/skill-template.md` so "how to author a skill" (the template + `CREATING_SKILLS.md` +
  `agent-skills-spec.md` + governance) lives in one home. Update `CONTRIBUTING.md` and
  `CREATING_SKILLS.md` references. Use `git mv` (C2).
- **R7** **Collapse `prompts/` to one canonical template.** Replace the two templates with a single
  **`CLAUDE.md.template`** (the canonical file); document the optional `AGENTS.md` → `CLAUDE.md`
  symlink rather than shipping a divergent `AGENTS.md.template`. `global-prompt.md` is retained but
  trimmed to route to the constitution.
- **R8** **Keep `tools/repo_lint` + `tests/`** — they are the `make validate` guardrail and the
  embodiment of "self-consistency, enforced". No relocation. (Their *extension* to validate the new
  structure is owned by EPIC-04.)

### 2.4 One constitution & the doc-format standard

- **R9** **One-constitution reconciliation** (RISK-5). Establish a single governing source for
  coding/standards governance and make the others point to it (do not restate). Define the
  authority chain explicitly: the global coding prompt (`~/.claude/CLAUDE.md`) ≡
  `docs/engineering-standards/coding-prompt.md` (the human canon) ≡ the future
  `openspec/project.md` in a projected repo (EPIC-09). State which is *operational* and which
  *narrate*. Record in `docs/engineering-standards/`.
- **R10** **Adopt the split-by-churn doc-format standard** (DEC-3) as an explicit governance rule in
  a new `docs/engineering-standards/documentation-standard.md`: Markdown for high-churn agent-loop
  artifacts and `.claude/`; AsciiDoc/Antora for durable published canon. This rule governs both this
  repo and projected repos.
- **R11** **User-level vs repo-level split** (DEC-12). Document, as part of the constitution chain,
  what belongs in the **user-level global `~/.claude/CLAUDE.md`** (the durable, cross-project coding
  prompt / standards — installed once per developer) versus the **repo-level `./CLAUDE.md`**
  (repo-specific operating manual + routing, committed per project). The two **complement, never
  duplicate** (the repo file points to the global standard, not restates it). This split is the
  governance half of DEC-12; the install-instructions half is owned by EPIC-04.

---

## 3. Constraints

- **C1** Frozen content is not edited (RISK-6): `executive-communication`, `semantic-consulting-coach`,
  `docs/ai-coding/` — relocation/additive only. (EPIC-05 is the one place `docs/ai-coding/` content
  is superseded, and it says so explicitly.)
- **C2** Preserve git history with `git mv` for all relocations (R5, R6).
- **C3** Do not delete `.idea/` or other gitignored folders from disk (standing rule).
- **C4** `make validate` must pass at the end of this EPIC.

---

## 4. Acceptance criteria

- **A1** The canonical `CLAUDE.md` is a real operating manual (R1) carrying no skill-owned knowledge
  (R2); the GitNexus block is demarcated and retained.
- **A2** Exactly one agentic source exists: `CLAUDE.md` is canonical; root `AGENTS.md` is either an
  `AGENTS.md` → `CLAUDE.md` symlink or removed (R3); the CLAUDE-canonical rule is in the constitution
  (R4, R9).
- **A3** `scripts/init-meaningfy-project.sh` is deleted; `template/` is absorbed into `spec/`;
  `prompts/` ships a single `CLAUDE.md.template`; `tools/`+`tests/` are unchanged (R5–R8).
- **A4** One constitution exists with an explicit authority chain (R9) **and the user-level vs
  repo-level split (R11, DEC-12)**; the split-by-churn standard is recorded (R10).
- **A5** `make validate` passes; no broken internal links; README/environment-setup rows flagged for
  EPIC-04 are listed in the implementation log.

---

## 5. Added / changed / deleted

| Action | Artifact |
|---|---|
| **Changed** | `CLAUDE.md` (now the operating manual), `docs/engineering-standards/*` (one-constitution + user/repo split + doc-format rule), `CONTRIBUTING.md` + `spec/CREATING_SKILLS.md` (template path), `prompts/` (single `CLAUDE.md.template`), `global-prompt.md` (trimmed) |
| **Added** | `spec/skill-template.md` (from `template/SKILL.md`); optional `docs/engineering-standards/documentation-standard.md`; root `AGENTS.md` → `CLAUDE.md` symlink (optional) |
| **Deleted** | `scripts/init-meaningfy-project.sh`; `template/` directory; `prompts/AGENTS.md.template`; the duplicate GitNexus-only root `AGENTS.md` (replaced by symlink or removed) |

**R-DOCS (cross-cutting, EPIC-00 §9):** this EPIC flags the README and `environment-setup.md`
init-script rows for EPIC-04; it owns the constitution and prompts-template rows.
