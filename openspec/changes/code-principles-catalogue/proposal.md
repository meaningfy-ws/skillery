<!-- The EPIC — the shaped bet. In Meaningfy the EPIC *is* the OpenSpec proposal. -->

# EPIC: Single-source code-principles catalogue; cosmic-python as the core reference cited by reused phase disciplines

## Appetite

**Large.** A skill-content + governance refactor across `cosmic-python`, `meaningfy-code-review`,
`project-setup`, `bdd-gherkin`, `epic-planning`, `technical-writing`, the agent wrappers, the spine workflow
doc, and **the validator (`tools/repo_lint/lint.py`)**, plus a global-prompt audit and a cross-skill audit
(`inputs/skill-audit-findings.md`). **No new skill.** The only code is the validator hardening (DEC-12).
Bounded by: do not fork or rewrite external plugins; do not edit the user's private global file; do not
rewrite skill *content* beyond boundaries/citations and the catalogue.

## Why

Code produced via the Meaningfy skills in the sibling project **eds4jinja2** shipped recurring
defects that the planning skills passed clean (the OpenSpec PLANs scored ≥9/10): duplicated
SPARQL-JSON constants across sibling adapters, literal dict keys that *already existed as constants
next door*, raw dicts where Pydantic models belong, free strings inside adapters, and reusable infra
(`SPARQLClientPool`) buried in one adapter. The specs were reuse-aware at **module** level (golden
thread, "build on the sibling adapter") but the implementation reused nothing at **symbol** level.

Two root causes: **(a)** there is no "survey existing code for reuse before implementing" discipline
anywhere; **(b)** the principles / best-practices / anti-patterns are scattered and partially
restated, and `meaningfy-code-review`'s checklist exempts adapters ("no raw dicts / magic strings in
models **or services**") — so the rules that would catch these either don't fire at implement-time or
aren't applied at review-time. Why now: the same skills are being reused across sibling projects, so
the defect pattern compounds.

## Solution outline

Make **cosmic-python the single core *reference* skill** — it owns a living catalogue of code
principles, best-practices, and anti-patterns plus the four-layer vocabulary and per-layer standards,
and it carries **knowledge, not ritual**. Every phase *discipline* is **reused from existing plugins**
and **cites** the catalogue at its phase: planning (`epic-planning` + `brainstorming` +
`clarity-gate`), implementing (`superpowers:test-driven-development` / `executing-plans` /
`subagent-driven-development` + the meaningfy `implementer` agent), testing (`superpowers:TDD` +
`bdd-gherkin`), reviewing (`meaningfy-code-review` + external `code-review` + the `code-reviewer`
agent). The "survey-&-reuse-first" rule is a *catalogue practice*; its enforcement hook lands on the
surfaces we own (the implementer agent wrapper, the opsx implement phase, `spine/workflows.md`).
`meaningfy-code-review` and the global prompt cite the catalogue instead of restating it. The outcome:
**one place to maintain the standard; the right discipline fires at the right opsx phase, reading that
one place.**

## Key decisions

- **DEC-1**: `cosmic-python` is the **core reference skill** — it owns the catalogue + structural
  vocabulary + per-layer *standards*, and is cited by every phase discipline. It does **not** own any
  ritual (TDD, plan-execution, the review run) — those are reused from existing plugins. — *removes the
  duplication of disciplines already provided elsewhere; matches cosmic-python's existing boundary.*
- **DEC-2**: The catalogue lives in **`skills/cosmic-python/references/principles-and-anti-patterns.md`**
  (SKILL.md cites it; never inline-bloats). — *user-chosen; pure single-source-of-authority, append-friendly.*
- **DEC-3**: The catalogue is **append-friendly** and is the designated landing place for future
  review findings. The eds4jinja2 findings seed it. — *closes the loop from review back to the standard.*
- **DEC-4**: Phase disciplines are **reused, not re-authored**, each citing the catalogue:
  **plan/design**→`epic-planning`/`brainstorming`/`clarity-gate` **+ `bdd-gherkin` (scenario + edge-case
  authoring as a PLAN artifact)**; **implement**→`superpowers:TDD`/`executing-plans`/
  `subagent-driven-development` + `implementer` agent (**step definitions written here**);
  **test**→`superpowers:TDD`; **review**→`meaningfy-code-review`/external `code-review`/`code-reviewer`
  agent. — *DRY across the catalogue.*
- **DEC-11**: **BDD scenario thinking is a design-phase activity, not a test-phase one.** `epic-planning`'s
  elicitation gains a **test-scenario / assertion / edge-case interview** (help the human enumerate what the
  EPIC must prove); `bdd-gherkin` authors the `.feature` scenarios as a **PLAN artifact** so `clarity-gate`
  can score scenario coverage. **Step definitions and production code remain in the implement phase** (TDD).
  Sample/synthetic test-data fabrication stays an *optional* design output (already owned by `bdd-gherkin`).
  Moving the phase requires fixing **all three** surfaces that currently disagree (audit D1): add `bdd-gherkin`
  to `agents/epic-planner.md`, reorder `spine/workflows.md`, and add the reciprocal `bdd-gherkin`↔`clarity-gate`
  Related link (A9). — *the spec must say what to prove before code exists; testing the assertions is implementation.*
- **DEC-12 (the keystone — make SSOT enforceable)**: harden `tools/repo_lint/lint.py` so the
  single-source-of-authority property is **checked in CI**, not merely asserted in prose. The audit proved the
  duplication recurs precisely because nothing enforces it. **Blocking** checks: (a) every `skills/*/SKILL.md`
  has a `## Boundary …` section (E2); (b) every skill named in an `agents/*.md` list exists
  (local/external/namespaced) (E3/E8). **Advisory** reports (refined during implementation — see log):
  (c) **reciprocal `Related` links** (E1); (d) the **ownership tripwire** extended to guard catalogue
  regression (E5).
  > **Decision log (DEC-12 refined, implementation):** reciprocity + ownership land **advisory**, not
  > blocking. Empirically 18 `Related` asymmetries exist, most spanning consulting↔building where relatedness
  > is a judgment call (a hub reference is cited by more skills than it lists back). A forced-symmetry gate
  > would be flaky over-reach — the very risk the design names — and beyond this EPIC's no-go. The advisory
  > report still catches drift; the in-scope building/core asymmetries were fixed. Full sweep = possible follow-up.
  — *without this, the cleanup erodes; with it, divergence fails the build.*
- **DEC-13 (standard boundaries everywhere, starting with the core)**: every skill — **`cosmic-python` first**
  (audit A8: it is cited 9+ times but has only a non-standard boundary) — carries a standard
  `## Boundary & Related Skills` (Owns / Delegates / Related). The asymmetries the audit flagged
  (`executive-communication`, `semantic-consulting-coach` missing sections; `estimation`↔`decision-package`)
  are fixed so DEC-12's reciprocal check passes. — *the core reference must declare its graph.*
- **DEC-14 (sweep the other confirmed SSOT violations)**: `technical-writing` **cites** `clarity-gate`'s
  lightweight check instead of restating it; the **coverage rule is owned once** (catalogue, *with the
  per-layer nuance* cosmic-python carries) and `meaningfy-code-review` / `project-setup` cite it — closing the
  per-layer-vs-overall divergence (audit A/B). — *same de-duplication discipline, applied to every hit the audit found.*
- **DEC-5**: **Survey-&-reuse-first** is a catalogue *practice*; its *enforcement hook* is added to the
  `implementer` agent wrapper + the opsx implement phase + `spine/workflows.md` — **not** a new
  cosmic-python workflow. — *put the behaviour where the harness can honour it.*
- **DEC-6**: `meaningfy-code-review` **cites** the catalogue and stops restating layer/free-string/SRP
  rules; it keeps only review-specific concerns (priority/report format, security, spec conformance,
  test presence) and gains a **"Reuse & DRY across files"** check group. — *one source of the rules.*
- **DEC-7**: The free-strings + models-over-dicts rule applies to **all layers** (adapters and
  entrypoints included), correcting the models/services narrowing. — *the eds4jinja2 defects were all in adapters.*
- **DEC-8**: The global `~/.claude/CLAUDE.md` is **audited**; every code-structure rule it carries must
  be captured in the catalogue, leaving the global file to **route, never restate**. The deliverable is
  a gap list under `inputs/`; the private global file is **not edited** in this change. — *skills are the SSOT.*
- **DEC-9**: `project-setup` Definition-of-Done gains a **"version has a single source of truth"** tick. — *seed objection #5.*
- **DEC-10**: OpenSpec wiring — `CLAUDE.md` routing, `spine/workflows.md` (verb↔artifact / phase↔skill
  map), and `agents/{implementer,code-reviewer,epic-planner}.md` are updated so each phase cites
  cosmic-python and fires appropriately. — *"called appropriately when needed."*

## Rabbit-holes

- **Do not create a new "reuse" skill** — extend cosmic-python (its remit is the code-structure
  standard). A new skill would re-fragment the single source. (Honours [[prefer-small-focused-skills]] *and* SSOT.)
- **Do not fork or rewrite external plugins** (superpowers, code-review command). Reuse and cite them.
- **Do not re-derive the whole coding-prompt** into the catalogue — seed from the existing cosmic-python
  tables + the eds4jinja2 findings + the global-prompt gap list.
- Avoid letting cosmic-python keep step-by-step *ritual* workflows that compete with superpowers; reframe
  Workflows 1–4 as reference ("what good looks like"), not procedure.

## No-gos

- **No new skill.**
- **No runtime/code changes to eds4jinja2** — it is the evidence; any fix there is a separate change.
- **No rule restated in more than one skill** — the catalogue is the single source; others cite it.
- **No editing the user's private global `~/.claude/CLAUDE.md`** as part of this change (audit + capture only).
- **No forking external plugins.**

---

## What Changes

- **`skills/cosmic-python/`**: new `references/principles-and-anti-patterns.md` (the catalogue, seeded
  with the eds4jinja2 findings + survey-&-reuse practice + models-over-dicts/all-layers free-strings);
  `SKILL.md` reframed as the **core reference** that cites the catalogue and delegates all rituals to
  the reused phase disciplines (Workflows 1–4 become reference, not procedure).
- **`skills/meaningfy-code-review/SKILL.md`**: cites the catalogue; broadened to all layers; new
  "Reuse & DRY across files" check group; restated layer/free-string/SRP rules trimmed.
- **`skills/project-setup/`**: DoD checklist gains a version-SSOT tick (`references/checklists.md`).
- **`skills/bdd-gherkin/SKILL.md`**: repositioned as a **plan/design** discipline (scenario + edge-case
  authoring as a PLAN artifact), not a between-spec-and-impl bridge; cites the catalogue.
- **`skills/epic-planning/SKILL.md`**: elicitation gains a **test-scenario / assertion / edge-case interview**
  step (DEC-11); the PLAN's design half references the authored `.feature` coverage.
- **`agents/{implementer,code-reviewer,epic-planner}.md`**: cite cosmic-python at their phase; the
  implementer wrapper gains the survey-&-reuse hook; `epic-planner` gains `bdd-gherkin` in its skills list (D1).
- **`skills/technical-writing/SKILL.md`**: cites `clarity-gate`'s lightweight check instead of restating it (DEC-14).
- **All `skills/*/SKILL.md`**: standard `## Boundary & Related Skills` section with reciprocal links —
  `cosmic-python` first, plus the audit-flagged gaps (`executive-communication`, `semantic-consulting-coach`,
  `estimation`↔`decision-package`, `clarity-gate`↔`bdd-gherkin`) (DEC-13).
- **`tools/repo_lint/lint.py`** (+ `tests/` + `ownership.yaml`): new blocking SSOT checks (DEC-12).
- **`spine/workflows.md`** + **root `CLAUDE.md` / `prompts/` routing**: phase↔skill map updated so the
  catalogue is read at plan/implement/test/review.
- **`inputs/global-prompt-gap-analysis.md`** (deliverable): the audit of global `~/.claude/CLAUDE.md`
  vs the catalogue.

## Capabilities

### New Capabilities
- `code-principles-governance`: the catalogue is the single source; citers cite by id; free-strings/
  models-over-dicts hold in all layers; survey-&-reuse before implementing; BDD scenarios authored in
  design; **and the validator enforces single-source-of-authority** (boundary sections, reciprocal links,
  agent/skill alignment, blocking ownership claims).

### Modified Capabilities
- *(none — no pre-existing `openspec/specs/` capability changes; affected artifacts are skills/agents/docs/validator.)*

## Impact

Skills (`cosmic-python`, `meaningfy-code-review`, `project-setup`, `bdd-gherkin`, `epic-planning`,
`technical-writing`, + boundary sections on all), agent wrappers, the spine workflow doc, routing, **and the
validator (`tools/repo_lint/lint.py` + `tests/` + `ownership.yaml`)**. The only executable change is the
validator. `make validate` must stay green and now enforces SSOT. Golden thread: derives from the **eds4jinja2
code-review findings** (`inputs/seeds.md`), the **cross-skill audit** (`inputs/skill-audit-findings.md`), the
**global-prompt gap analysis** (`inputs/global-prompt-gap-analysis.md`), and the repo's
**single-source-of-authority** rule (`spec/skill-repo-governance.md`).
