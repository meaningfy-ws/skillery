# Deeper audit — repetitions, overlaps, divergence & orchestration across ALL skills (SECONDARY input)

Three parallel read-only audits (engineering/spec cluster, orchestration/citation graph, consulting/comms
cluster). Findings that strengthen this EPIC, with file evidence.

## A. Repetitions / overlaps confirming the EPIC (citers restate what the catalogue should own)

- `meaningfy-code-review` restates cosmic-python's **SOLID** (§Code-quality L27,L30), **magic-strings**
  (L29), **no-I/O-in-models** (L23), **coverage ≥80%** (L39) — should cite catalogue ids (DEC-6).
- `technical-writing` §Lightweight check (L25–31) restates `clarity-gate`'s lightweight check (L32–39)
  — **NEW**: technical-writing should cite clarity-gate, not restate.
- `project-setup` repeats coverage / layering vocabulary instead of citing cosmic-python.

## B. Divergence risks

- **Coverage rule diverges**: cosmic-python = "80%+ **per layer**" (L86,L147,L187); meaningfy-code-review
  & project-setup = "≥80%" with **no per-layer nuance**. A repo can pass overall and fail per-layer.
  → the coverage rule (with the per-layer nuance) must be owned once (catalogue) and cited.
- **CI/CD seam** (project-setup owns CI, ci-cd-delivery owns CD) is stated but the image-build boundary is
  fuzzy — out of scope here; note for a follow-up.

## C. Orchestration / boundary gaps (the keystone)

- **A8 (HIGH)**: `cosmic-python` has **no standard `## Boundary & Related Skills` section** (it has a
  non-standard "Boundary & Canonical Vocabulary"), yet is cited by 9+ skills. As the new core reference it
  MUST declare Owns / Delegates / Related in the standard shape.
- **D1 (HIGH)**: `agents/epic-planner.md` skills = `[epic-planning, clarity-gate, stream-coding]` — does
  **not** list `bdd-gherkin`, though epic-planning delegates Gherkin to it; `spine/workflows.md` orders
  bdd-gherkin **after** clarity-gate. Moving BDD into design (DEC-11) must fix all three.
- **A9**: `clarity-gate` Related omits `bdd-gherkin` though bdd-gherkin lists clarity-gate (asymmetric).
- **A4/A5**: `executive-communication` and `semantic-consulting-coach` have **no Boundary section** though
  delegated-to by 2+ skills. **A6/estimation↔decision-package**: asymmetric delegation.
- Step-definitions and the "implementer" role: bdd-gherkin defers step-defs to "the implementer" — make
  explicit that the **implement phase** owns step-defs (consistent with DEC-11).
- Minor: cosmic-python references ADRs (architecture owns the template) and does not echo
  `conceptual-modelling`'s `make generate-models` seam — add cross-link citations.

## D. Validator gaps that let SSOT erode silently (`tools/repo_lint/lint.py`)

- **E1**: no reciprocal-citation check (asymmetries A4/A5/A6/A9 accumulate unseen).
- **E2**: no check that each SKILL.md has a Boundary & Related Skills section (A8 slips through).
- **E3/E8**: no check that an `agents/*.md` skills list aligns with the skill's declared delegations / the
  `workflows.md` phase map (D1 slips through).
- **E5**: `ownership.yaml` claim report is **non-blocking** and covers only ~5 capabilities — a skill can
  re-specify a canonical fact and CI stays green.

**Implication:** the EPIC must not only de-duplicate once; it must **harden the validator** so the
single-source-of-authority property is enforced, or the duplication returns (it already has).
