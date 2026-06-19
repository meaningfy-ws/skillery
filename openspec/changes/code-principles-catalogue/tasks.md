<!-- PLAN (tasks half). PLAN = design.md + this file. The apply phase parses `- [ ]` checkboxes. -->

> Derived from EPIC `code-principles-catalogue` (proposal.md)  <!-- golden thread -->

## 1. Catalogue (the single source) — PLAN-D1

- [x] 1.1 Create `skills/cosmic-python/references/principles-and-anti-patterns.md` with Principles / Best-practices / Anti-patterns sections, each entry carrying a stable slug id
- [x] 1.2 Add the four named seed principles: `read-neighbours-before-implementing`, `single-source-of-truth-&-DRY`, `prefer-models-over-dicts`, `design-for-reuse-and-compactness` (compactness named explicitly — per the check)
- [x] 1.3 Add anti-patterns from the eds4jinja2 findings: `AP-DUP-CONST` (duplicated constants across siblings), `AP-DICT-AS-MODEL` (raw dict where a Pydantic model belongs), `AP-FREESTR-ANYLAYER` (free strings in any layer incl. adapters/entrypoints), `AP-MISPLACED-SHARED-INFRA` (reusable infra buried in one module)
- [x] 1.4 Add gaps from `inputs/global-prompt-gap-analysis.md`: G2 `AP-VERBATIM-EXTERNAL` + licence respect, G3 `AP-DUP-VALIDATION` (validate once at the boundary), G4 cross-sub-module / parallel-variant / one-way DAG→main import rules

## 2. cosmic-python as core reference — PLAN-D2, DEC-1

- [x] 2.1 Reframe `skills/cosmic-python/SKILL.md`: Workflows 1–4 → a short "What good looks like" reference + a named "Survey & reuse first" practice; delete ritual prose now delegated
- [x] 2.2 SKILL.md links the catalogue + carries the id index; inlines none of it
- [x] 2.3 Update the Boundary section to state cosmic-python is the reference cited by each reused phase discipline

## 3. Citers reference the catalogue — PLAN-D3, DEC-6/7, G5

- [x] 3.1 Rewrite `skills/meaningfy-code-review/SKILL.md` Architecture + Code-quality items to "review against the catalogue (`AP-*`/`BP-*`)"; remove restated rules
- [x] 3.2 Add the "Reuse & DRY across files" check group + keep report format (priority · file:line · principle id · fix)
- [x] 3.3 Apply the all-layers fix: free-strings/models-over-dicts cover adapters + entrypoints (DEC-7)
- [x] 3.4 Add gap G5 (sensitive-data interaction guidance) to `skills/guardrails/SKILL.md`; catalogue cross-links it

## 4. BDD into design — PLAN-D5, DEC-11, audit D1/A9

- [x] 4.1 Reframe `skills/bdd-gherkin/SKILL.md` as a plan/design discipline (`.feature` = PLAN artifact, clarity-gate scores coverage); step defs stay in implement
- [x] 4.2 Add a "test-scenario / assertion / edge-case interview" bullet to `skills/epic-planning/SKILL.md` Elicit step; note `.feature` coverage in the PLAN design half
- [x] 4.3 Add `bdd-gherkin` to `agents/epic-planner.md` skills list (D1); reorder the `spine/workflows.md` row so bdd-gherkin sits in design
- [x] 4.4 Add the reciprocal `bdd-gherkin`↔`clarity-gate` Related link (A9)

## 5. Wiring — DEC-5/10, PLAN-D4

- [x] 5.1 Add the survey-&-reuse hook (one-line gate) to `agents/implementer.md`
- [x] 5.2 Update `agents/{code-reviewer,epic-planner}.md` to cite the catalogue at their phase
- [x] 5.3 Update `spine/workflows.md` phase↔skill rows (catalogue read at plan/implement/test/review; bdd-gherkin in design)
- [x] 5.4 Update root `CLAUDE.md` / `prompts/` routing so the catalogue is the named reference

## 6. Sweep remaining SSOT hits + standard boundaries — DEC-13/14, audit A/B

- [x] 6.1 Own the coverage rule (with per-layer nuance) in the catalogue; make `meaningfy-code-review` + `project-setup` cite it (closes the overall-vs-per-layer divergence)
- [x] 6.2 Make `skills/technical-writing/SKILL.md` cite `clarity-gate`'s lightweight check instead of restating it
- [x] 6.3 Give `skills/cosmic-python/SKILL.md` a standard `## Boundary & Related Skills` section (Owns/Delegates/Related) — audit A8
- [x] 6.4 Add/repair Boundary sections + reciprocal links for the audit-flagged gaps (`executive-communication`, `semantic-consulting-coach`, `estimation`↔`decision-package`)

## 7. Make SSOT enforceable (validator) — DEC-12, PLAN-D6

- [x] 7.1 Add `boundary_section_present` check to `tools/repo_lint/lint.py` + negative test in `tests/`
- [x] 7.2 Add `reciprocal_related_report` (A lists B ⇒ B lists A) + negative test — **advisory** (DEC-12 refined; full symmetry is cross-cluster judgement)
- [x] 7.3 Add `agent_skill_alignment` check (every agent-listed skill exists / external / namespaced) + negative test — **blocking**
- [x] 7.4 Extend `tests/ownership.yaml` to guard catalogue **regression** (kept advisory, not blocking — id citations must not false-positive)
- [x] 7.5 Register the new checks in `ALL_CHECKS`; run `make validate` and fix until green

## 8. project-setup + close-out — DEC-9, DEC-8

- [x] 8.1 Add the "version single source of truth" tick to `skills/project-setup/references/checklists.md`
- [x] 8.2 Confirm every G1–G5 (global-prompt) and the cross-skill audit findings have landed; mark both audits resolved
- [x] 8.3 Run `make validate` (now SSOT-enforcing) green end-to-end

## 9. Second tranche — rdf-differ findings (DEC-15/16/17)

- [x] 9.1 Catalogue: add `PR-COMPONENT-FIRST`, `PR-CONFIG-DECOUPLED`, `BP-DOMAIN-REVEALING-NAMES`, `BP-EXCEPTIONS-MODULE`, `BP-CONSTANTS-HOME`, `AP-GENERIC-MODULE-NAMES`, `AP-OVER-FRAGMENTATION`, `AP-PARALLEL-LAYOUTS`, `AP-EXCEPTIONS-EMBEDDED`; extend `AP-DICT-AS-MODEL` with the entrypoint dict-return example
- [x] 9.2 cosmic-python SKILL.md: add the "Scaling up: component organization" section (root → components → layers + core/commons; import-linter + grooming cite)
- [x] 9.3 project-setup: add the import-linter **grooming cadence** to `references/architecture-guardrails.md`
- [x] 9.4 project-setup: new `references/settings-pattern.md` (the `PR-CONFIG-DECOUPLED` reference impl + mandated principle); wire it into the SKILL.md pillar list
- [x] 9.5 Archive `inputs/rdf-differ-findings.md`; `make validate` green

## Roadmap

- [x] 1.1 · 1.2 · 1.3 · 1.4 → [ ] 2.1 · 2.2 · 2.3 → [ ] 3.1 · 3.2 · 3.3 · 3.4 → [ ] 4.1 · 4.2 · 4.3 · 4.4 → [ ] 5.1 · 5.2 · 5.3 · 5.4 → [ ] 6.1 · 6.2 · 6.3 · 6.4 → [ ] 7.1 · 7.2 · 7.3 · 7.4 · 7.5 → [ ] 8.1 · 8.2 · 8.3
- Order rationale: catalogue first (citers need a target) → citers → BDD/wiring → boundary sweep (DEC-13) → **validator last** (so the new blocking checks land on an already-clean graph).

## Verification

`make validate` green **and SSOT-enforcing** (boundary sections present, reciprocal links, agent/skill
alignment, blocking ownership claims); every seed principle + G1–G5 + cross-skill finding is a named catalogue
entry, a cited link, or lands in its owner; no catalogue rule restated in a citer; `bdd-gherkin` reads and
routes as a design-phase discipline. Clarity gate scores this PLAN ≥9/10 before apply.
