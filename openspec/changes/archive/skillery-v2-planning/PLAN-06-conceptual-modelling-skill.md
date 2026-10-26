# PLAN-06: `conceptual-modelling` Skill

> Derived from [EPIC-06](EPIC-06-conceptual-modelling-skill.md). Clarity-gate before execution.
> **Deps:** PLAN-02 (golden thread), PLAN-04 (the `modelling/` subfolder + bundle). **Gated by** the
> dogfood gate.

## Approach (sequence)

**(T1) extract LinkML material from `architecture` → (T2) author skill core (conditional, CM-agnostic,
LinkML-default) → (T3) generation targets + custom generators → (T4) deterministic seam doc →
(T5) diagrams + terminology mgmt → (T6) place + bundle → (T7) trigger-precision + validate.**

## Task breakdown

### T1 — Create `modelling/`, extract LinkML/codegen from `architecture` *(EPIC R10)*
- **Deps:** PLAN-04 T1. **Files:** `skills/architecture/`, new `skills/modelling/conceptual-modelling/`.
- **Steps:** create `skills/modelling/` (EPIC-04 deferred it); move the LinkML-as-canonical-contract +
  `make generate-models` material out of `architecture` into the new skill; leave a cross-pointer at
  the contract seam in `architecture`.
- **Acceptance:** `skills/modelling/conceptual-modelling/` exists; `architecture` no longer owns LinkML
  depth; cross-pointer present.

### T2 — Skill core: conditional, CM-agnostic, LinkML-default *(EPIC R1–R4)*
- **Deps:** T1. **Files:** `conceptual-modelling/SKILL.md`.
- **Steps:** state the conditionality (**product-development projects only**; doc/non-product repos
  skip it) and the trigger; default home **in-project `model/`**, with own-repo-as-library mode
  documented (+ golden-thread cross-repo entity IDs); lock the principle "*some sort of CM*, LinkML
  default but not LinkML-only" (accommodate `model2owl`/ontology tooling; surface the choice, don't
  silently default); ontology-engineering best practices (stable **URIs/IRIs**, naming, modularity,
  vocabulary reuse).
- **Acceptance:** conditionality, both homes, LinkML-default-not-only, URIs/OE practices all explicit.

### T3 — Generation targets + custom generators *(EPIC R5, R6)*
- **Deps:** T2. **Files:** `references/generators.md`.
- **Steps:** document deterministic generation to **Python (Pydantic), TypeScript, JSON Schema, SQL
  DDL (and/or ORM models), OWL, SHACL, Markdown/HTML docs**; and how to **author/configure custom
  generators** per target representation (not just stock runs).
- **Acceptance:** all targets covered; custom-generator authoring guided.

### T4 — Deterministic seam (out of the LLM path) *(EPIC R7)*
- **Deps:** T3. **Files:** `references/generators.md` (same file as T3 — the "generation seam" section).
- **Steps:** specify schema→artifacts as a `make generate-models`-style deterministic bridge, outside
  the LLM-generation path (the answer to spec-drift / failed-MDD); document the seam to `cosmic-python`
  (`entrypoints/api` consumes the generated contract).
- **Acceptance:** determinism + the cosmic-python seam are explicit.

### T5 — Diagrams + terminology management *(EPIC R8, R9)*
- **Deps:** T2. **Files:** `references/terminology.md`.
- **Steps:** Mermaid (and other) conceptual diagrams alongside the formal model; terminology
  management, disambiguation, and definitions management (the glossary / ubiquitous-language layer
  that OpenSpec specs reference).
- **Acceptance:** `references/terminology.md` exists with a glossary/definitions template + a Mermaid
  example that an OpenSpec spec can cite as ubiquitous language.

### T6 — Place + bundle *(EPIC R10)*
- **Deps:** T1–T5; consumes the PLAN-04 layout. **Files:** `.claude-plugin/marketplace.json`.
- **Steps:** finalise the skill under `skills/modelling/`; add a `meaningfy-modelling` bundle to the
  marketplace (taking it 6 → 7 bundles — EPIC-04 deferred this so no empty bundle shipped).
- **Acceptance:** `meaningfy-modelling` bundle resolves to `skills/modelling/conceptual-modelling/`;
  `make validate` accepts the 7-bundle marketplace.

### T7 — Trigger precision + validate *(EPIC C4, A5)*
- **Deps:** T1–T6. **Steps:** record trigger probes for conceptual-modelling/LinkML/ontology that
  **don't collide** with `architecture` **in the PR body** (repo convention); keep `SKILL.md` ≤500
  lines (detail in `references/`); `make validate`.
- **Acceptance:** probes recorded in the PR body; `SKILL.md` ≤500 lines; validate green.

## Anti-patterns
- ❌ Hard-coding LinkML-only (must accommodate model2owl / ontology tooling).
- ❌ Making the skill mandatory for non-product repos.
- ❌ Running generation inside the LLM loop (must be deterministic).
- ❌ Duplicating `architecture` (system design) or `cosmic-python` (layers) — point at the seams.

## Verification
- Probe set distinguishes `conceptual-modelling` from `architecture`; `architecture` cross-pointer
  works; `make validate` green. (Generator behaviour itself is exercised in a product repo, not here.)

## Roadmap
- [x] T1 extract from architecture · [x] T2 skill core · [x] T3 targets+generators · [x] T4 deterministic seam
- [x] T5 diagrams+terminology · [x] T6 place+bundle · [x] T7 triggers+validate

## Execution status
Skill at `skills/engineering/conceptual-modelling/` (SKILL.md + references:
generators, ontology-practices, terminology-management). Placed in
**`meaningfy-engineering`** (Q4.1 fold-in, not a separate `meaningfy-modelling`
bundle). Wired-first-class targets: Pydantic + JSON Schema + OWL + SHACL (Q6.2=A);
TS/SQL/HTML/custom documented. LinkML default + model2owl-as-prerequisite note
(Q6.3=A). In-project `model/` default (Q6.1=A). `architecture` cross-points here
(light-touch R10). README/EXPECTED_BUNDLES/probe updated; `make validate` green.
Provisional pending the dogfood gate.

## Clarity-gate self-check
Scope matches the user's refinements verbatim (conditional, in-project default, LinkML-default-not-only,
OWL/SHACL/TS/DB targets, custom generators, Mermaid, terminology mgmt). Determinism-out-of-LLM-path is
explicit. The architecture/cosmic-python boundaries are named to prevent overlap.
