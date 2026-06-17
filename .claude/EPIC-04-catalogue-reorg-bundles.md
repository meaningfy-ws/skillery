# EPIC-04: Catalogue Reorg & Bundle Re-cut

> Part of the Skillery v2 series. See [EPIC-00](EPIC-00-master-index.md). **Tier:** foundation.
> **Depends on:** EPIC-01 (CLAUDE-canonical, constitution). Coordinates with EPIC-02 (spine bundle).

## 1. Purpose & goals (the shaped bet)

**Appetite:** small. A mechanical-but-careful restructure: move skills into a legible, phase-aligned
layout and re-cut the marketplace along the value chain, then teach the validator and the front-door
docs about the new shape.

**Problem.** The flat `skills/` directory and 3 generic bundles do not express the consulting→delivery
value chain the system now models (Research B §7.1). As the catalogue grows (new consulting, modelling
skills), a flat list becomes illegible and bundle membership becomes arbitrary.

**Solution outline.** Nest `skills/` into **phase subfolders**, re-cut
`.claude-plugin/marketplace.json` into **7 bundles total** (6 phase bundles + the `meaningfy-spine`
meta-bundle — DEC-6), **shipping 6 now** (`meaningfy-modelling` is deferred to EPIC-06 to avoid an
empty bundle), and update the validator, README, and install docs. This EPIC also owns the **R-DOCS** rows for README + `environment-setup.md` install
sections and the init-script removal flagged by EPIC-01.

**Non-goals.** Authoring the new skills (EPIC-06/07/08) — they slot into the subfolders created here;
the methodology rewrite (EPIC-05).

---

## 2. Requirements

### 2.1 Phase-aligned skill layout (Research B §7.1, DEC-6)

- **R1** Move the **existing** skills into subfolders (use `git mv`; C2). Inline tags `(NN)` mark the
  EPIC that *adds* a not-yet-existing skill — those are added by their EPIC, not here:
  ```
  skills/
  ├── consulting/      # semantic-consulting-coach  [+ decision-package(07), proposal-writing(08), estimation(08) — added later]
  ├── communication/   # executive-communication, technical-writing
  ├── architecture/    # architecture
  ├── engineering/     # project-setup, cosmic-python, meaningfy-git-workflow
  └── ai-coding/       # epic-planning, clarity-gate, bdd-gherkin, meaningfy-code-review
  ```
  The **`modelling/`** subfolder is **not created here** — it has no existing skill to move; EPIC-06
  creates `skills/modelling/` when it adds `conceptual-modelling`. So this EPIC creates **5**
  populated subfolders.
- **R2** Skill `name:` frontmatter is unchanged (the skill name is not the path); only directory
  location changes. Verify no skill references another skill by *path* (must be by name).
- **R3** Frozen skills (`executive-communication`, `semantic-consulting-coach`) are **moved only**,
  content byte-identical except path (RISK-6).

### 2.2 Bundle re-cut (DEC-6)

- **R4** Re-cut `.claude-plugin/marketplace.json` (PLAN-04 T3 is the **sole editor** of this file —
  EPIC-02 only defines the spine bundle's contents). The **target** value-chain is **7 bundles**:
  `meaningfy-consulting`, `meaningfy-communication`, `meaningfy-modelling`, `meaningfy-architecture`,
  `meaningfy-engineering`, `meaningfy-ai-coding`, `meaningfy-spine`. **This EPIC ships 6** —
  every bundle except `meaningfy-modelling`, which is **added by EPIC-06** together with the
  `conceptual-modelling` skill (no empty bundle ships). Bump the marketplace `version`.
- **R5** Each bundle's skill list points to the new subfolder paths. (The not-yet-existing skills
  from EPIC-06/07/08 are added to their bundles by those EPICs.)
- **R6** Document the bundle→phase mapping in `docs/environment-setup.md` so a consumer installs only
  the phases they need.

### 2.3 Validator extension (R8 of EPIC-01 keeps the tool; here we teach it)

- **R7** Extend `tools/repo_lint` + `tests/` to validate the **new structure**:
  - marketplace↔dirs consistency with the **nested** layout (every bundle's skills resolve to an
    existing subfolder; no bundle ships with an empty skill list — hence `meaningfy-modelling` is
    absent until EPIC-06);
  - frontmatter `name`==dir-basename still holds under subfolders;
  - **no orphan references** to the deleted init script (EPIC-01) or `template/` (now under `spec/`);
  - **CLAUDE-canonical**: `prompts/` ships a single `CLAUDE.md.template`; no divergent
    `AGENTS.md.template`; if a root/template `AGENTS.md` exists it must be a symlink to `CLAUDE.md`;
  - **spine presence**: the `meaningfy-spine` assets exist and are referenced;
  - (golden-thread parent-ID check — stub here, fully specified in EPIC-02 R9, enable when artifacts
    exist).
- **R8** Negative tests added for each new rule (the repo already keeps `test_repo_lint_negative.py`).

### 2.4 Front-door docs (R-DOCS owner)

- **R9** Rewrite `README.md`: the catalogue table by bundle/phase, the new install commands, the
  repository-structure tree (subfolders + `spine/`), **CLAUDE.md-canonical (+ optional AGENTS
  symlink)**, projection via `project-setup` only (no init script), and an OpenSpec mention.
- **R10** Update `docs/environment-setup.md`: re-cut bundle install commands; add **OpenSpec** as a
  mandatory dependency (EPIC-02) with install + `/opsx`; **drop** the init-script projection path
  (DEC-5); CLAUDE.md-canonical note.
- **R11** **User-level vs project-level install clarity (DEC-12).** `environment-setup.md` (and the
  README "Getting started") MUST present two explicit columns/sections:
  - **User/machine level (install once):** which plugins/bundles and external skills are installed
    globally via `/plugin` (`superpowers`, `stream-coding`, `ponytail`, optional `commit-commands`,
    `code-review`, `gitnexus`, `context7`, **OpenSpec**); and what belongs in the global
    `~/.claude/CLAUDE.md` (the durable coding prompt / standards — the constitution, EPIC-01 R11).
  - **Project/repo level (per repo):** which bundles are pinned per project; the `openspec/` wiring
    (`project-setup`, EPIC-09); and what belongs in the repo `./CLAUDE.md` (repo operating manual +
    routing, complementing — not duplicating — the global file).
  State **what goes where and why** for both **skills** and **`CLAUDE.md` content**.

---

## 3. Constraints

- **C1** `git mv` for every relocation (C2/history). No content edits to frozen skills (C1/RISK-6).
- **C2** The repo must not spend a commit self-inconsistent: move + marketplace + validator update
  land together so `make validate` passes (A0.3).
- **C3** Plugin-install instructions everywhere must match the new bundle names exactly.

---

## 4. Acceptance criteria

- **A1** `skills/` is nested into the **5** populated phase subfolders (`modelling/` arrives with
  EPIC-06); frozen skills are byte-identical except path (R1–R3).
- **A2** `.claude-plugin/marketplace.json` exposes **6** bundles (the 7-bundle target minus
  `meaningfy-modelling`, which EPIC-06 adds); all paths resolve; version bumped (R4–R6).
- **A3** `make validate` passes with the extended rules + negative tests (R7–R8).
- **A4** README + `environment-setup.md` describe the new structure, bundles, OpenSpec dependency,
  CLAUDE.md-canonical, no init script, **and the user-level vs project-level install split for both
  skills and `CLAUDE.md` content (R11/DEC-12)** (R9–R11); no broken links.
- **A5** Trigger-precision probes for moved skills still fire (no regressions from the move).

---

## 5. Added / changed / deleted

| Action | Artifact |
|---|---|
| **Changed** | every `skills/*` path (→ subfolders); `.claude-plugin/marketplace.json` (6 value-chain bundles incl. spine, version bumped); `tools/repo_lint` + `tests/`; `README.md`; `docs/environment-setup.md` |
| **Added** | the 5 populated phase subfolders (`consulting`, `communication`, `architecture`, `engineering`, `ai-coding`) |
| **Deleted** | the flat-`skills/` layout; the 3-bundle marketplace; init-script + `template/` references in docs (files themselves deleted in EPIC-01) |

**R-DOCS (cross-cutting):** this EPIC **owns** the README and `environment-setup.md` install/bundle
rows and resolves the init-script doc rows flagged by EPIC-01.
