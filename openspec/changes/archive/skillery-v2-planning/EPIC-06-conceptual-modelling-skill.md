# EPIC-06: `conceptual-modelling` Skill

> Part of the Skillery v2 series. See [EPIC-00](EPIC-00-master-index.md). **Tier:** new skill.
> **Depends on:** EPIC-02 (spine/golden thread), EPIC-04 (the nested-skills layout + bundle re-cut).
> **Note:** EPIC-04 deferred `skills/modelling/` and the `meaningfy-modelling` bundle to this EPIC
> (no empty bundle ships earlier) — so this EPIC **creates** both.
> **Gated by:** the dogfood gate (EPIC-00 §6).

## 0. Revisions absorbed (from QUESTIONS-EPIC-06 + the EPIC-04 reshape)

- **Placement reconciled with Q4.1.** EPIC-04's Q4.1 answer folded `modelling`
  into **`meaningfy-engineering`** (next to `architecture`). So this EPIC does
  **NOT** create `skills/modelling/` or a `meaningfy-modelling` bundle — the skill
  lives at **`skills/engineering/conceptual-modelling/`** and is registered in the
  **`meaningfy-engineering`** bundle. (R10's separate-bundle plan is superseded.)
- **Q6.1=A:** scaffold an in-project `model/` by default (own-repo mode is the
  deliberate exception EPIC-09 offers when a model is shared across repos).
- **Q6.2=A:** ship **Pydantic + JSON Schema + OWL + SHACL** wired-first-class;
  document TS / SQL-ORM / HTML / custom-generator authoring as on-demand patterns.
- **Q6.3=A + note:** LinkML is the wired default; other ontology tooling is
  documented. **model2owl** can be an occasional *prerequisite* (it generates the
  LinkML, which then drives the other generators) and has strong OWL/SHACL/HTML
  generators. No source-adapter abstraction (YAGNI).
- **Light-touch R10:** generation/living-model **ownership** moved to this skill;
  `architecture` keeps LinkML as a contract notation and now cross-points here.
- **Provisional** pending the dogfood gate (Q0.1=B / Q0.3=C): the engineering
  generation core is real; the consulting-facing depth refines after a real
  model-building engagement. See HARD-QUESTIONS HQ-00.1.

## 1. Purpose & goals (the shaped bet)

**Appetite:** medium. Elevate conceptual modelling from a buried section of `architecture` into a
first-class, broad skill — central to Meaningfy's semantic positioning — while keeping the
deterministic generation layer **out of the LLM path**.

**Problem.** The DDD / living-model machinery (LinkML as the canonical domain-entity contract;
`make generate-models` as the codegen bridge) exists only as a fragment inside `architecture`. None
of the SDD tools do formal domain modelling with deterministic generation. And the user's intent is
broader than "LinkML → Pydantic": it spans ontology engineering, multiple target representations, and
terminology management.

**Solution outline.** A `conceptual-modelling` skill (Research B #3, DEC-10) that owns the
conceptual model as a **living, generative, representation-agnostic** asset, defaulting to rich
LinkML but not limited to it, with deterministic multi-target generation and conceptual-modelling
craft (diagrams, terminology, definitions). **Conditional: product-development projects only.**

**Non-goals.** System/solution architecture (stays in `architecture` — C4/ADRs/contracts);
making it mandatory for non-product repos; running generation inside the LLM loop.

---

## 2. Requirements

### 2.1 Conditionality & home (DEC-10)

- **R1** The skill applies **only to product-development (programming) projects**. A doc-only or
  non-product repo does not need it; the skill states this and the trigger reflects it.
- **R2** **Default home: in-project `model/`** directory. The skill also supports the model living in
  **its own repo** (better lifecycle control) and being imported as a library — document both modes
  and the golden-thread implications (model-entity IDs cited across repos).

### 2.2 Representation-agnostic core, LinkML default (DEC-10)

- **R3** Lock the principle: **"some sort of conceptual model"** is the contract; **LinkML is the
  default** source. The skill must not hard-assume LinkML-only — it accommodates `model2owl` and
  other ontology-engineering tooling (the work legitimately extends into ontology engineering).
  Decision points (LinkML vs other) are surfaced as explicit choices, not silently defaulted.
- **R4** Apply **ontology-engineering best practices**: stable **URIs/IRIs** for entities, naming and
  modularity conventions, reuse of existing vocabularies where appropriate.

### 2.3 Deterministic multi-target generation

- **R5** From the (LinkML) source, generate **multiple target artefacts deterministically**:
  - Python classes (Pydantic), **TypeScript** classes/types,
  - JSON Schema, **SQL DDL** (and/or SQLAlchemy/ORM models — pick per project),
  - **OWL** and **SHACL** artefacts,
  - Markdown/HTML schema documentation.
- **R6** Support **building customised generators** keyed to the target representation (the skill
  guides authoring/configuring generators per output, not just running stock ones).
- **R7** Generation is **deterministic and outside the LLM-generation path** (Research B §6,
  Layer 1): the schema→artifacts step is a `make generate-models`-style bridge, the principled answer
  to spec-drift and the failed-MDD critique. Document the seam to `cosmic-python` (`entrypoints/api`
  consumes the generated contract).

### 2.4 Conceptual-modelling craft

- **R8** Support **Mermaid** (and other) diagrams for conceptual models — generate/maintain diagrams
  alongside the formal model.
- **R9** Support **terminology management, disambiguation, and definitions management** — the glossary
  / ubiquitous-language layer that specs reference (ties to OpenSpec specs using model classes as
  ubiquitous language, Research B §6 Layer 2).

### 2.5 Reconciliation & placement

- **R10** Move the LinkML/codegen material **out of `architecture`** into this skill; leave a
  cross-pointer in `architecture` at the contract seam. **Create `skills/modelling/`** (deferred by
  EPIC-04), place the skill there, and **add the `meaningfy-modelling` bundle** to
  `.claude-plugin/marketplace.json` (taking the marketplace from 6 → 7 bundles).

---

## 3. Constraints

- **C1** Deterministic generation stays out of the LLM path (C2 of EPIC-02; Research B principle).
- **C2** `SKILL.md` ≤ 500 lines; generators/best-practice detail in `references/`.
- **C3** Reference `cosmic-python` and `architecture` by name at the seams; do not restate layering.
- **C4** Trigger precision: must fire on conceptual-modelling/LinkML/ontology probes without
  colliding with `architecture`; record probes.

---

## 4. Acceptance criteria

- **A1** The skill is conditional (product-dev only), documents in-project and own-repo modes (R1–R2).
- **A2** LinkML-default-but-not-only is explicit, with ontology-engineering best practices + URIs
  (R3–R4).
- **A3** Multi-target generation (Python/TS/JSON-schema/DB/OWL/SHACL/docs) + custom-generator guidance
  + deterministic-out-of-LLM-path are documented with the `cosmic-python` seam (R5–R7).
- **A4** Mermaid diagrams + terminology/disambiguation/definitions management are covered (R8–R9).
- **A5** LinkML material is removed from `architecture` (cross-pointer left); `skills/modelling/` and
  the `meaningfy-modelling` bundle are created (marketplace 6 → 7); `make validate` passes (R10).

---

## 5. Added / changed / deleted

| Action | Artifact |
|---|---|
| **Added** | `skills/modelling/` (subfolder, deferred by EPIC-04) + `skills/modelling/conceptual-modelling/` (SKILL.md + references: generators, ontology-engineering practices, terminology mgmt); the `meaningfy-modelling` bundle in `.claude-plugin/marketplace.json` (6 → 7 bundles) |
| **Changed** | `skills/architecture/` (LinkML/codegen extracted, cross-pointer left) |
| **Deleted** | the buried LinkML-as-fragment inside `architecture` |

**R-DOCS (cross-cutting):** `architecture` skill + any methodology mention of LinkML must point to
the new skill; flag for EPIC-05 if a methodology mention exists.
