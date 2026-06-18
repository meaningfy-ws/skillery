# Design — Catalogue UX, bundle reorg & docs onboarding

> Status: approved-in-brainstorm (awaiting written-spec review). Branch: `feat/catalogue-ux-and-docs`.
> Date: 2026-06-18.

## 1. Problem (the six critiques)

After Skillery v2 landed, the catalogue's **front door** is hard to read:

1. The `meaningfy-spine` meta-bundle is confusing — it re-lists 5 skills that already live in
   `meaningfy-ai-coding`, so it reads as duplication; its purpose is unclear.
2. `meaningfy-ai-coding` and `meaningfy-engineering` overlap/blur — some skills straddle them.
3. The README has **no installation section** (prerequisites + steps).
4. The README has **no getting-started** — no task → which-skill → in-what-order, and no guidance on
   **when to invoke an agent vs a skill**.
5. No guidance on **uninstalling / resolving conflicting skills**; a new employee can't tell what to
   remove or what overlaps with their existing setup.
6. The README lacks **pointers to the docs** and how to read them — and skillery does not yet
   publish its durable canon (should it adopt AsciiDoc + GitHub Pages, applying its own standard?).

**Root cause for 1–2:** bundles were serving two axes at once — a *phase/value-chain map* and a
*persona/install-intent* cut — so the persona cut (the spine overlay) collided with the phase cut.

## 2. Decisions (resolved in brainstorm)

| # | Decision | Rationale |
|---|----------|-----------|
| D1 | **Bundles are organised by ROLE** (persona you install), not by phase. | You install "the hat(s) you wear", not a workflow-stage map. |
| D2 | **Four bundles:** `meaningfy-core`, `meaningfy-consulting`, `meaningfy-architecture`, `meaningfy-building`. A small **core** holds the cross-cutting skills so **every skill lives in exactly one bundle** — no duplication, no overlays. | Role bundles' duplication risk is removed by extracting shared skills to `core`. |
| D3 | **Remove `meaningfy-spine` and `meaningfy-communication` bundles.** The spine becomes a *capability* `building` carries + *assets* `project-setup` projects, explained as a concept (not an install). `executive-communication`→consulting, `technical-writing`→core. | Kills the confusing overlay; dissolves a thin bundle. |
| D4 | **Flat disk layout:** `skills/<skill>/` — bundles group only in `marketplace.json`. | Decouples disk from install grouping; simplest structure; the validator already supports flat. |
| D5 | **Keep the term "spine"** but gloss it on first use at every entry point: *"the spine — the durable, traceable spec backbone"*. **Drop "dogfood"** in favour of plain phrasing (*"skillery runs its own method on itself — the live reference example"*). | Keep the short evocative term + clarity; remove insider jargon. |
| D6 | **README gains 4 new sections:** Installation, Getting started (agents-vs-skills + task flows + a step-by-step epic-loop walkthrough), Uninstall & conflicts (worked against a real setup), Documentation map. | Closes critiques 3–6's README half. |
| D7 | **Docs publishing = hybrid split-by-churn, as a FOLLOW-UP EPIC.** This branch only adds the README Documentation map (+ a "canon will be published" note). The AsciiDoc/Antora/GitHub-Pages migration of the durable canon (`engineering-standards/`, `philosophy/`, architecture/ADRs) is specced separately. | Keeps this branch focused; the migration is substantial and deserves its own spec. |

## 3. Design

### 3.1 Bundle taxonomy (D1–D4)

`marketplace.json` plugins (bump version → 2.2.0):

| Bundle | Skills (paths now flat: `./skills/<skill>`) | Install intent |
|---|---|---|
| **meaningfy-core** | technical-writing, meaningfy-git-workflow, guardrails | everyone |
| **meaningfy-consulting** | semantic-consulting-coach, decision-package, proposal-writing, estimation, executive-communication | advisory / front-of-funnel |
| **meaningfy-architecture** | architecture, conceptual-modelling | design / modelling |
| **meaningfy-building** | epic-planning, spec-stewardship, clarity-gate, bdd-gherkin, meaningfy-code-review, cosmic-python, project-setup, ci-cd-delivery | delivery / dev |

- 18 skills → 4 bundles, **1:1 ownership** (each skill in exactly one bundle).
- Disk: `git mv skills/<phase>/<skill> → skills/<skill>` for all 18 (flatten).

### 3.2 Validator changes

- `EXPECTED_BUNDLES` → the 4 role bundles above. **Delete `META_BUNDLES`** and its overlay logic in
  `expected_bundle_membership` (no more meta-bundle; pure 1:1 ownership again).
- `_skill_paths` already supports flat — verify it still discovers `skills/<skill>/SKILL.md`.
- Update tests (`test_repo_lint.py`, `test_repo_lint_negative.py`): drop the meta-bundle overlay
  tests; keep/adjust the flat-discovery + placement tests. `tests/trigger_probes.yaml` unchanged
  (probes are by skill name, not path). `tests/ownership.yaml` unchanged.

### 3.3 Terminology pass (D5)

- Add the gloss "*(the durable, traceable spec backbone)*" on first mention of "spine" in: `README.md`,
  `spine/README.md`, root `CLAUDE.md`, `docs/ai-coding/openspec-setup-guide.md`.
- Replace "dogfood"/"dogfooding" with plain phrasing in **published docs + skills + `spine/`**
  (e.g. `spine/lessons-loop.md`, `spine/epic-change-memory-mapping.md`, README). The `.claude/`
  EPIC/PLAN files are a **historical planning record** — left as-is (not rewritten).
- The folder stays `spine/` (no rename — D5 keeps the term).

### 3.4 README structure (D6)

Sections, in order:

1. **What this is** — one paragraph; gloss "spine" here.
2. **Who it's for** — the three roles (consultant / architect / builder) ↔ the bundles.
3. **What's inside** — the 4-bundle table (every skill listed by name) + the 3 thin agents.
4. **Installation**
   - Prerequisites: Claude Code; Node ≥18 (for OpenSpec).
   - External dependencies — **mandatory** (`superpowers`, `stream-coding`, `ponytail`, OpenSpec)
     and **optional** (`commit-commands`, `code-review`, `gitnexus`, `context7`), each with its
     install command (sourced from `docs/environment-setup.md`, which stays the detailed authority).
   - The 4 bundle install commands.
   - A one-paragraph **user-level vs project-level** summary → links to `environment-setup.md`.
5. **Getting started**
   - **Agents vs skills** rule of thumb: *skill = on-demand knowledge/method loaded into the current
     chat ("guide me through X"); agent = a delegated worker in its own fresh context with fixed
     role/tools ("go do X and report back"). skill = teach/guide; agent = delegate a whole task.*
   - **Task → tools (in order)** table: start a repo; build an epic; win a client; model a domain;
     write a board paper; (a few more).
   - **The epic loop, step by step** — name the exact skill/agent + `/opsx` verb at each step:
     `explore`→`propose` (epic-planner ◦ epic-planning) → clarity-gate → bdd-gherkin →
     `apply` (implementer ◦ cosmic-python + TDD) → `verify` (code-reviewer ◦ meaningfy-code-review) →
     `sync`/`archive` (spec-stewardship). Cross-link `spine/workflows.md`.
6. **Uninstall & conflicts**
   - "Check what you have" command (e.g. inspect enabled plugins).
   - Known-overlaps table + **a worked example against a real setup**: old 3 meaningfy bundles →
     migrate to the new 4 (drop old, add core/architecture/building; consulting content changed);
     official `feature-dev` agents overlap meaningfy's epic-planner/implementer/code-reviewer
     (redundant → optionally disable); `code-review` + `commit-commands` are **complementary** (keep);
     **missing** `stream-coding` + `ponytail` (mandatory → install). Conclusion: nothing needs hard
     uninstalling; it's mostly *migrate the bundle names* + *add the missing mandatory deps*.
7. **Documentation** — a map of `docs/` (ai-coding method, engineering-standards, philosophy,
   engagement) with a one-line "what + when to read" each, plus the in-repo `spine/` docs; note the
   durable canon will be published to **GitHub Pages** via the follow-up AsciiDoc EPIC.
8. **Repository structure** — updated tree (flat `skills/`, 4 bundles, `spine/` + `openspec/`).
9. **Contributing / Licensing / Support** — unchanged except bundle names.

### 3.5 Ripple (other files referencing old bundle names)

`grep -rl "meaningfy-engineering\|meaningfy-ai-coding\|meaningfy-communication\|meaningfy-spine"`:
`docs/environment-setup.md`, `CONTRIBUTING.md`, `spec/CREATING_SKILLS.md`, `prompts/global-prompt.md`,
`skills/project-setup/{SKILL.md,references/agentic-setup.md,references/checklists.md}`,
`docs/ai-coding/two-tier-methodology.md` (ownership table notes), and `spine/meaningfy-spine-bundle.md`
(**retire/rewrite** → the spine is a capability+assets, no longer a bundle). Each updated to the
4-bundle names. The `.claude/` planning docs are a historical record — left as-is. The `meaningfy-code-review` skill's
description references the external `code-review` command — unchanged.

## 4. Scope

**In this branch (`feat/catalogue-ux-and-docs`):** §3.1–§3.5 — bundle reorg + flat disk + validator +
terminology gloss + README rewrite + environment-setup/CONTRIBUTING bundle-name updates. `make
validate` green; README lists every skill; no broken links.

**Deferred to a follow-up EPIC (D7):** migrate the durable canon to AsciiDoc + Antora and publish to
GitHub Pages (CI workflow, Antora playbook, `.adoc` conversion of `engineering-standards/` +
`philosophy/` + architecture/ADRs). Logged in `.claude/HARD-QUESTIONS.md`.

## 5. Acceptance criteria

- **A1** `marketplace.json` exposes the 4 role bundles (1:1 skill ownership); version bumped; no
  `meaningfy-spine`/`meaningfy-communication`.
- **A2** `skills/` is flat (`skills/<skill>/`); all 18 skills discovered; frozen skills byte-identical
  except path.
- **A3** Validator: `EXPECTED_BUNDLES` = 4 roles, `META_BUNDLES` removed; `make validate` + tests
  green (negative tests adjusted).
- **A4** README has all 9 sections incl. Installation, Getting-started (agents-vs-skills + flows +
  epic-loop walkthrough), Uninstall & conflicts (worked example), Documentation map; every skill
  listed; no broken links.
- **A5** "spine" glossed at each entry point; no "dogfood" term remains.
- **A6** `environment-setup.md` + `CONTRIBUTING.md` reflect the 4 bundles; the spine is described as a
  capability/asset, not a bundle.
- **A7** The AsciiDoc/Pages follow-up is recorded as a HARD question, not silently dropped.

## 6. Out of scope

- The AsciiDoc/Antora/Pages migration itself (follow-up EPIC).
- Re-litigating the EPIC-02…10 skill content (only their bundle membership + paths move).
- Renaming "spine" (decided: keep + gloss).
