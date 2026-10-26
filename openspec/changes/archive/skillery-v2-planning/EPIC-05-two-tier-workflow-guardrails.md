# EPIC-05: Two-Tier AI-Coding Workflow & Guardrails

> Part of the Skillery v2 series. See [EPIC-00](EPIC-00-master-index.md). **Tier:** method.
> **Depends on:** EPIC-02 (spine, workflows, EPIC↔change mapping), EPIC-03 (authoring flow).

## 0. Revisions absorbed (from QUESTIONS-EPIC-05)

- **Q5.1=C — keep v1 live behind a banner.** The frozen `docs/ai-coding/` v1 docs
  are **retained** with a top banner pointing to the v2 two-tier canon
  (`two-tier-methodology.md`, `opsx-runbook.md`, `openspec-setup-guide.md`);
  v1 is deleted once the dogfood engagement closes. (Not an in-place overwrite.)
- **Q5.2=B — ownership tripwire.** The single-owner table is backed by a
  machine-readable map (`tests/ownership.yaml`) + a **non-blocking** validator
  check (`lint.ownership_claim_report`) that flags a non-owner skill re-specifying
  an owned capability. Cheap automated tripwire, no semantic analysis.
- **Q5.3=C — guardrails is a skill.** Built `skills/ai-coding/guardrails` with a
  clear purpose, how-to-use, and how-to-automate, each guardrail type mapped to a
  concrete enforcement home (agent wrapper/permissions; tests+validate+clarity-gate;
  decision-bounds for injection).
- Inherited: artifacts are OpenSpec-native (EPIC ≡ proposal.md, PLAN ≡
  design.md+tasks.md); the docs narrate-and-point, they do not restate skills.

## 1. Purpose & goals (the shaped bet)

**Appetite:** medium. Rewrite the *human canon* of the AI-coding method to match the system the
foundations built, and make the composition of tools (OpenSpec / stream-coding / superpowers /
Meaningfy skills) unambiguous and non-redundant.

**Problem.** `docs/ai-coding/` describes a single-tier flow with a now-superseded agent roster, no
guardrails concern, no OpenSpec, and no resolution of which tool owns which artifact. Research A
provides the build-tier model and the guardrails/agentic-requirements material that is currently
unrepresented.

**Solution outline.** Rewrite the methodology + runbook to the **two-tier** model (Project tier +
Epic tier), add the **guardrails** cross-cutting concern, document the **redundancy resolutions**
(DEC-8 and RISK-4), add the **agentic-requirements** references (SEED, AgOCQs++), and reconcile the
DoD/quality-gates. This is where the frozen `docs/ai-coding/` content is **explicitly superseded**
(the one allowed break — RISK-6).

**Non-goals.** Engagement-level commercial stage gates (EPIC-08); building skills (EPIC-06/07/08);
the schema itself (EPIC-02).

---

## 2. Requirements

### 2.1 The two-tier workflow (Research A §2)

- **R1** Rewrite `docs/ai-coding/ai-coding-methodology.md` around two nested tiers:
  - **Project tier (upfront, human-led):** requirements & use-case elicitation → architecture &
    system design (stable, first) → work breakdown into shaped Epics → project & repo setup.
  - **Epic tier (one Epic at a time):** shape the Epic (EPIC=proposal) → derive PLAN (clarity-gated)
    → BDD features + test data → implement (TDD) → review (agent + peer + human) → documentation →
    Epic delivered.
- **R2** State the **deliberate divergence** from canonical Shape Up: architecture is front-loaded
  and kept stable (defensible for semantic/knowledge-graph work where the conceptual model must
  stabilise before Epics can be carved). Label it as a chosen divergence.
- **R3** Rewrite `ai-coding-runbook.md` to the **`/opsx` day-to-day workflow** (EPIC-02 R5–R7): the
  command sequences, who drives each (skill/discipline), and the seed→EPIC→PLAN authoring from
  EPIC-03. Remove the "Confluence work shape is the only input" framing.
- **R4** Update `ai-coding-setup-guide.md` to the `openspec/` layout + `.claude/` (memory as a
  regenerable index) + AGENTS.md. (Scaffolding mechanics are EPIC-09; this is the *description*.)

### 2.2 Guardrails (Research A §5, cross-cutting)

- **R5** Document **guardrails** as a cross-cutting concern applied to every agentic step: decision
  bounds, output validation, and prompt-injection defence. Clarify the distinction: guardrails
  validate agent *behaviour*; the clarity gate, tests, and review validate *content*.
- **R6** Pin the **definition of an agent** (an LLM with specific instructions + access to data/tools
  operating under guardrails) in the methodology, and the **model-tiering** (Opus
  planning/analysis/review; Sonnet implementation/BDD; Haiku docs/summaries).

### 2.3 Redundancy resolutions (DEC-8, RISK-4 — the single-owner map)

- **R7** Document, in one authoritative table, who owns what across OpenSpec / stream-coding /
  superpowers / Meaningfy skills, so no behaviour is specified twice:
  - **OpenSpec** — artifact lifecycle: `specs/` store, change/delta, `validate --strict`, archive,
    `/opsx` workflow.
  - **stream-coding** — the doc-first philosophy + the generate-verify-integrate **execution loop**
    + the framing that clear docs make codegen automatic.
  - **superpowers** — `brainstorming` (elicitation), TDD, systematic-debugging,
    verification-before-completion, subagent-driven-development. **`writing-plans` is superseded** by
    `PLAN.md`/`tasks.md` inside a spine repo.
  - **Meaningfy skills** — `epic-planning` (authoring), `clarity-gate` (semantic ≥9/10), `bdd-gherkin`
    (real `.feature` + test-data fabrication), `cosmic-python` (layers + per-layer test strategy),
    `meaningfy-code-review`.
  - **Testing taxonomy, data & CI lanes** — `project-setup` (`testing-setup.md`: test-type
    classification + marker hook, `test_data/` + `load_text_file`, conftest scope, coverage gate) +
    `cosmic-python` (per-layer strategy) + `bdd-gherkin` (feature tests). The **CI test/lint/
    guardrail/docs-publish workflows** are owned by `project-setup` (`ci-and-infra.md`).
  - **CD, release & the delivery contract** — `ci-cd-delivery` (EPIC-10): image build+push, release/
    versioning, the reusable deploy mechanism, the app-repo→`infrastructure-stacks` trigger. (CI vs
    CD: `project-setup` owns CI; `ci-cd-delivery` owns CD — they do not overlap.)
- **R8** **Normative-requirements layering (no double-spec):** spec deltas carry RFC-2119 `SHALL` +
  Given/When/Then (OpenSpec native); `bdd-gherkin` carries executable `.feature` acceptance; the PLAN
  carries sequencing. **EARS is dropped** (DEC-8) — explicitly note this divergence from Research A
  and why (OpenSpec already carries the normative layer; EARS would be a third notation).
- **R9** Reconcile the **agent roster** with the thin-wrapper reality: the methodology's old
  five-agent table is updated to the surviving wrappers (`epic-planner`, `implementer`,
  `code-reviewer`) + the skills that replaced `gherkin-writer`/`documenter`
  (`bdd-gherkin`/`technical-writing`).

### 2.4 Agentic requirements (Research A P1/E1)

- **R10** Add **SEED** (LLM + behaviour ontology, surfaces edge-case interaction scenarios) and
  **AgOCQs++** (competency questions from a corpus, scopes the ontology) as a named subsection of
  `ai-coding-methodology.md` ("Optional Project-tier elicitation aids"). They are **references only**
  — no skill, no required artifact; inputs to elicitation and edge-case test-data generation.

### 2.5 DoD & quality gates

- **R11** Update `dod-quality-gates.md` for the build tier: the gate set is clarity-gate (≥9/10,
  semantic) + `openspec validate --strict` (structural) + tests-green + coverage ≥80% + architecture
  check (importlinter) + code review + Definition of Done. **Pin the automation boundary once here**
  (the single source other EPICs reference): `openspec validate --strict` is **CI-automated**;
  `clarity-gate` is a **human/agent** gate, **not** CI-automated (it is a judgement, not a script).
  Engagement-level stage gates are added *upward* by EPIC-08 — this EPIC **owns** `dod-quality-gates.md`
  and writes the build half first; EPIC-08 appends the engagement ladder (cross-reference).

### 2.6 Testing standard (consolidating doc + skill fold-ins)

- **R12** Author **`docs/engineering-standards/testing-standard.md`** as human canon that **narrates
  and points** (does not restate): the **test taxonomy + per-type rulesets** (unit / feature(BDD) /
  integration / e2e — markers, what each may/may not do, which CI lane runs it), the **test-data &
  conftest conventions** (`test_data/` + `load_text_file`, polyfactory, testcontainers, conftest
  scope), the **tool list**, and the **coverage gate**. It links to the authorities —
  `project-setup` `testing-setup.md`, `cosmic-python` `example-testing-patterns.md`, `bdd-gherkin` —
  per the four-artifact model. **Fold operational detail into the owning skills where a gap exists**
  (test-data fabrication conventions → `bdd-gherkin`; per-layer strategy → `cosmic-python`; layout/
  markers/data → `project-setup`); the doc itself carries no rules those skills should own.

- **C1** This EPIC is the **only** sanctioned supersession of frozen `docs/ai-coding/` content
  (RISK-6); every superseded section says so and links to the new model. Preserve the practitioner
  experience notes that remain valid.
- **C2** Docs **narrate and point** (four-artifact model) — do not restate skill rules; route to the
  skills and the spine.
- **C3** Split-by-churn (DEC-3): these method docs may stay Markdown (human canon that changes with
  the method); the durable architecture canon remains AsciiDoc/Antora.
- **C4** `make validate` passes (no broken links after the rewrite).

---

## 4. Acceptance criteria

- **A1** `ai-coding-methodology.md` describes the two-tier model with the labelled divergence (R1–R2).
- **A2** `ai-coding-runbook.md` describes the `/opsx` workflow + seed→EPIC→PLAN authoring (R3).
- **A3** The single-owner redundancy table exists (incl. the testing-taxonomy/data/CI-lane and the
  CI-vs-CD `project-setup`↔`ci-cd-delivery` ownership rows) and EARS-drop is documented with
  rationale (R7–R9).
- **A4** Guardrails, agent definition, model-tiering, and agentic-requirements references are present
  (R5–R6, R10).
- **A5** `dod-quality-gates.md` reflects the clarity-gate/validate split and the full build gate set
  (R11); cross-references EPIC-08 for engagement gates.
- **A6** `docs/engineering-standards/testing-standard.md` exists, narrates-and-points to the owning
  skills, and any gap detail is folded into `bdd-gherkin`/`cosmic-python`/`project-setup` (R12).
- **A7** `make validate` passes; no doc still describes the old single-tier model or the old roster.

---

## 5. Added / changed / deleted

| Action | Artifact |
|---|---|
| **Changed (supersedes frozen content — sanctioned)** | `docs/ai-coding/ai-coding-methodology.md`, `ai-coding-runbook.md`, `ai-coding-setup-guide.md`, `dod-quality-gates.md` |
| **Added** | the single-owner redundancy table (incl. testing + CI/CD ownership rows); guardrails section; agentic-requirements references (SEED/AgOCQs++); `docs/engineering-standards/testing-standard.md` |
| **Deleted** | the EARS layer (never adopted — recorded as a divergence); the old five-agent roster framing; "Confluence work shape is the only input" |

**R-DOCS (cross-cutting):** this EPIC owns all `docs/ai-coding/*` rows of the ripple matrix.
