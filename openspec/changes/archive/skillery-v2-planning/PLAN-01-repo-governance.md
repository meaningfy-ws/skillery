# PLAN-01: Repo Governance & Self-Alignment

> Derived from [EPIC-01](EPIC-01-repo-governance.md). Clarity-gate this PLAN (≥9/10) before
> execution. **No code-divergence:** if a task reveals the EPIC is wrong, fix the EPIC, then
> re-derive. Each task lists deps · files · steps · acceptance.

## Approach (sequence)

Foundation work, low risk. Order so `make validate` stays green at each commit:
**(T1) canonical CLAUDE.md → (T2) reconcile AGENTS.md → (T3) prompts collapse → (T4) template→spec →
(T5) delete init script → (T6) constitution + user/repo split → (T7) doc-format standard →
(T8) validate + fix links.** T1–T2 first (they unblock the binding layer); T8 last.

## Task breakdown

### T1 — Make `CLAUDE.md` the canonical operating manual *(EPIC R1, R2)*
- **Deps:** none. **Files:** `CLAUDE.md`.
- **Steps:** author the operating-manual content into `CLAUDE.md` above the demarcated GitNexus
  block: (a) what this repo is (four-artifact model, single-source-of-authority — point to
  `spec/skill-repo-governance.md`); (b) how to maintain/extend the catalogue (point to
  `spec/CREATING_SKILLS.md`, boundary/related-skills rule); (c) `make validate` is the guardrail;
  (d) common practices (cosmic-python self-alignment, conventional commits → `meaningfy-git-workflow`,
  the spine conventions → EPIC-02). Keep it thin; route, don't restate.
- **Acceptance:** `CLAUDE.md` carries routing-only content + retained GitNexus block; no skill-owned
  knowledge inlined.

### T2 — Reconcile root `AGENTS.md` to a symlink (or remove) *(EPIC R3, R4)*
- **Deps:** T1. **Files:** `AGENTS.md`.
- **Steps:** replace the duplicate GitNexus-only `AGENTS.md` with a symlink `AGENTS.md → CLAUDE.md`
  (preferred — serves AGENTS-reading tools without divergence), or remove it if symlinks are
  undesirable on the target filesystems. Record the choice in the impl log.
- **Acceptance:** exactly one agentic source; if `AGENTS.md` exists it resolves to `CLAUDE.md`.

### T3 — Collapse `prompts/` to one canonical template *(EPIC R7)*
- **Deps:** T1. **Files:** `prompts/CLAUDE.md.template`, `prompts/AGENTS.md.template` (delete),
  `prompts/global-prompt.md`, `prompts/README.md`.
- **Steps:** keep/rewrite `CLAUDE.md.template` as the single binding template (route to OpenSpec +
  the spine once landed); delete `AGENTS.md.template`; document the optional `AGENTS.md → CLAUDE.md`
  symlink in `prompts/README.md`; trim `global-prompt.md` to route to the constitution.
- **Acceptance:** `prompts/` has one `CLAUDE.md.template`, no `AGENTS.md.template`.

### T4 — Absorb `template/` into `spec/` *(EPIC R6)*
- **Deps:** none. **Files:** `template/SKILL.md` → `spec/skill-template.md`; `CONTRIBUTING.md`,
  `spec/CREATING_SKILLS.md` (refs).
- **Steps:** `git mv template/SKILL.md spec/skill-template.md`; remove the empty `template/` dir;
  update every reference in `CONTRIBUTING.md` and `CREATING_SKILLS.md`.
- **Acceptance:** no `template/` dir; all references resolve to `spec/skill-template.md`.

### T5 — Delete the init script *(EPIC R5, DEC-5)*
- **Deps:** none (capability lands in EPIC-09). **Files:** `scripts/init-meaningfy-project.sh`.
- **Steps:** `git rm scripts/init-meaningfy-project.sh`; if `scripts/` is now empty, remove it (a
  future `scaffold.sh` for `project-setup` may re-create it in EPIC-09). Flag the README/
  `environment-setup.md` rows that mention it for EPIC-04 (log them; do not rewrite those docs here).
- **Acceptance:** init script gone; doc rows referencing it are listed in the impl log for EPIC-04.

### T6 — One constitution + user/repo split *(EPIC R9, R11, DEC-12)*
- **Deps:** none. **Files:** `docs/engineering-standards/coding-prompt.md` (+ a short authority-chain
  note).
- **Steps:** declare the authority chain (`~/.claude/CLAUDE.md` ≡ `coding-prompt.md` ≡ projected
  `openspec/project.md`), stating which is operational vs narrating; document what belongs at
  **user-level** (`~/.claude/CLAUDE.md` — durable coding prompt/standards) vs **repo-level**
  (`./CLAUDE.md` — repo operating manual + routing), and the "complement not duplicate" rule.
- **Acceptance:** one governing source with an explicit chain + the user/repo split documented.

### T7 — Record the split-by-churn doc-format standard *(EPIC R10, DEC-3)*
- **Deps:** none. **Files:** `docs/engineering-standards/documentation-standard.md` (new) or a section
  in `project-structure.md`.
- **Steps:** state the rule — Markdown for high-churn agent-loop artifacts + `.claude/`;
  AsciiDoc/Antora for durable published canon — governing this repo and projected repos.
- **Acceptance:** the standard is recorded and linked from the README docs map (row owned by EPIC-04).

### T8 — Validate & fix links *(EPIC A5, C4)*
- **Deps:** T1–T7. **Files:** repo-wide.
- **Steps:** run `make validate`; fix any broken internal links from the moves/deletes; record the
  EPIC-04-owned doc rows still describing the old state.
- **Acceptance:** `make validate` passes; no broken links introduced by this EPIC.

## Anti-patterns
- ❌ Deleting `AGENTS.md` content into the void — its operating-manual content must first exist in
  `CLAUDE.md` (T1 before T2).
- ❌ Restating skill rules in `CLAUDE.md` or the constitution — route, don't duplicate.
- ❌ Rewriting README/`environment-setup.md` here — those rows belong to EPIC-04; only *flag* them.
- ❌ `rm` instead of `git mv`/`git rm` (lose history).

## Verification
- `make validate` green; `tools/repo_lint` shows no orphan refs to `template/` or the init script
  (the rule that *enforces* this is added in EPIC-04 — here, verify manually).
- One agentic source (T2); one binding template (T3); one constitution chain (T6).

## Roadmap
- [ ] T1 canonical CLAUDE.md · [ ] T2 AGENTS symlink · [ ] T3 prompts collapse · [ ] T4 template→spec
- [ ] T5 delete init script · [ ] T6 constitution + user/repo split · [ ] T7 doc-format standard
- [ ] T8 validate + links

## Clarity-gate self-check
Grounded (every task names files + acceptance), no ungrounded claims, divergence rule stated. The one
external unknown (whether to symlink vs remove `AGENTS.md`, T2) is an explicit recorded choice, not a
hidden assumption.
