# PLAN-04: Catalogue Reorg & Bundle Re-cut

> Derived from [EPIC-04](EPIC-04-catalogue-reorg-bundles.md). Clarity-gate before execution.
> **Deps:** PLAN-01 (CLAUDE-canonical, init-script deletion). Coordinates with PLAN-02 (spine bundle).
> **Critical:** move + marketplace + validator land in **one commit** so the repo is never
> self-inconsistent.

## Approach (sequence)

**(T1) create subfolders + `git mv` skills → (T2) fix any path-based refs → (T3) re-cut marketplace
→ (T4) extend validator + negative tests → (T5) rewrite README → (T6) rewrite environment-setup w/
user-vs-project split → (T7) validate.** T1–T4 in one logical change; T5–T6 own the R-DOCS rows.

## Task breakdown

### T1 — Nest skills into phase subfolders *(EPIC R1–R3)*
- **Deps:** none. **Files:** all `skills/*`.
- **Steps:** `git mv` each existing skill into one of **5** subfolders
  `skills/{consulting,communication,architecture,engineering,ai-coding}/`. Map:
  consulting←semantic-consulting-coach; communication←executive-communication, technical-writing;
  architecture←architecture; engineering←project-setup, cosmic-python, meaningfy-git-workflow;
  ai-coding←epic-planning, clarity-gate, bdd-gherkin, meaningfy-code-review. **`modelling/` is NOT
  created here** (no existing skill to move; EPIC-06 creates it). Frozen skills moved byte-identical.
- **Acceptance:** 5 nested subfolders; all 11 existing skills moved; frozen content unchanged except
  path.

### T2 — Fix path-based references *(EPIC R2)*
- **Deps:** T1. **Steps:** run `grep -rn "skills/" skills/*/*/SKILL.md` and confirm no skill
  references another by *path* (must be by name); fix internal doc links to moved skills.
- **Acceptance:** the grep returns no cross-skill path refs; no broken links.

### T3 — Re-cut the marketplace (sole editor) *(EPIC R4–R6)*
- **Deps:** T1; consumes the spine-bundle contents defined by PLAN-02 T9 (which does **not** edit the
  file). **Files:** `.claude-plugin/marketplace.json`.
- **Steps:** re-cut into **6** bundles — `meaningfy-consulting`, `meaningfy-communication`,
  `meaningfy-architecture`, `meaningfy-engineering`, `meaningfy-ai-coding`, `meaningfy-spine`; point
  each to the new subfolder paths; bump `version`. **`meaningfy-modelling` is NOT added here** (it
  would be empty) — EPIC-06 adds it with the skill, taking the marketplace 6 → 7.
- **Acceptance:** 6 bundles, all paths resolve, version bumped; no empty bundle.

### T4 — Extend validator + negative tests *(EPIC R7, R8)*
- **Deps:** T1–T3. **Files:** `tools/repo_lint/lint.py`, `tests/`.
- **Steps:** add rules — marketplace↔nested-dirs consistency; **no bundle ships with an empty skill
  list** (so a phase with no skill yet, like modelling, simply has no bundle); `name`==dir-basename
  under subfolders; **no orphan refs** to the deleted init script or `template/`; **CLAUDE-canonical**
  (single `CLAUDE.md.template`, no divergent `AGENTS.md.template`; any `AGENTS.md` is a symlink);
  **spine presence**; golden-thread parent-ID check (stub, enabled when artifacts exist). Add a
  negative test per rule.
- **Acceptance:** `make validate` passes; each new rule has a failing-case test.

### T5 — Rewrite README *(EPIC R9, R-DOCS)*
- **Deps:** T1–T4. **Files:** `README.md`.
- **Steps:** catalogue table by bundle/phase; new install commands; structure tree (subfolders +
  `spine/`); CLAUDE.md-canonical (+ optional AGENTS symlink); projection via `project-setup` only
  (no init script); OpenSpec mention; **Getting started** shows the user-vs-project split (DEC-12).
- **Acceptance:** README matches the new structure; links resolve.

### T6 — Rewrite environment-setup with user/project split *(EPIC R10, R11, DEC-12)*
- **Deps:** T3. **Files:** `docs/environment-setup.md`.
- **Steps:** re-cut bundle install commands; add **OpenSpec** as a mandatory dependency (+ `/opsx`);
  **drop** the init-script projection path; add the two explicit sections — **user/machine level**
  (global plugins/skills incl. OpenSpec; what goes in `~/.claude/CLAUDE.md`) and **project level**
  (per-repo bundles; `openspec/` via `project-setup`; what goes in `./CLAUDE.md`). State what/where/why
  for both skills and `CLAUDE.md` content.
- **Acceptance:** both levels documented for skills *and* `CLAUDE.md` content.

### T7 — Validate *(EPIC A3, A5)*
- **Deps:** T1–T6. **Steps:** `make validate`; trigger-precision probes for moved skills (no
  regressions from the move).
- **Acceptance:** validate green; probes pass.

## Anti-patterns
- ❌ Landing moves without the marketplace+validator update (a broken intermediate commit).
- ❌ Editing frozen skill content during the move.
- ❌ Referencing skills by path instead of name.
- ❌ Leaving install docs without the explicit user/project split (the DEC-12 failure mode).

## Verification
- `make validate` green with new rules; the 3 bundles → 7+spine transition verified; a fresh reader
  can tell from `environment-setup.md` exactly what to install once vs per-repo.

## Roadmap
- [x] T1 subfolders · [x] T2 fix refs · [x] T3 marketplace · [x] T4 validator+tests
- [x] T5 README · [x] T6 environment-setup (user/project split) · [x] T7 validate

## Execution status (absorbed Q4.1/Q4.2/Q4.3)
- **Q4.1=A + reshape:** `modelling` is **folded into `meaningfy-engineering`** next
  to `architecture` (per the answer's note) — so there is **no separate
  `meaningfy-architecture` or `meaningfy-modelling` bundle**, and **4 phase
  subfolders** were created (`consulting`, `communication`, `engineering`,
  `ai-coding`) rather than 5. Shipped **5 bundles** (4 phase + `meaningfy-spine`
  meta-bundle), not 6. conceptual-modelling (EPIC-06) lands in `engineering/`.
- **Q4.2=B:** non-blocking trigger-probe harness added (`tests/trigger_probes.yaml`
  + `lint.trigger_probe_report`, surfaced in the assist section, never fails CI).
- **Q4.3=A:** landed as a stacked series on one branch — structural commit
  (moves+marketplace+validator+tests) then a docs commit; each commit is
  `make validate`-green (self-consistency preserved at every commit).
- Validator now discovers nested skills (flat+nested) and treats `meaningfy-spine`
  as an overlay (META_BUNDLES). README + environment-setup rewritten; CONTRIBUTING
  + CREATING_SKILLS + governance updated for the nested home.

## Clarity-gate self-check
Grounded; the one-commit constraint prevents a self-inconsistent state; DEC-12 split is concretely
specified (two sections, both skills and CLAUDE.md content). New-skill placement is deferred to their
EPICs without ambiguity (empty `modelling/` created now).
