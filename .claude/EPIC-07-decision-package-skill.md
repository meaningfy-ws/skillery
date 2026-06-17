# EPIC-07: `decision-package` Skill

> Part of the Skillery v2 series. See [EPIC-00](EPIC-00-master-index.md). **Tier:** new skill
> (consulting). **Depends on:** EPIC-04 (`consulting/` subfolder + bundle). **Gated by:** the
> dogfood gate (EPIC-00 §6).

## 1. Purpose & goals (the shaped bet)

**Appetite:** medium. Productise the **paid keystone deliverable** of the consulting engagement —
the front-of-funnel capability the catalogue currently only *coaches*.

**Problem (Research B §0, §2.4).** The engagement model defines the **Decision Package** as the
keystone paid deliverable of the P1 "Decision Phase", but `semantic-consulting-coach` only coaches
its *design* and explicitly refuses to *produce* it. **The revenue front of the funnel has no
production skill.** The unit of value is *decision-readiness*; the free→paid boundary must be
protected.

**Solution outline.** A `decision-package` skill that produces the Decision Package, sitting *above*
architecture (it justifies and scopes the build before a repo exists). It absorbs the internal
`strategic-blueprint-checklist` so there is one discovery framework, not two.

**Non-goals.** Replacing `semantic-consulting-coach` (which keeps coaching the *design* and protecting
the boundary); proposal/SoW writing (EPIC-08); architecture (the `architecture` skill).

---

## 2. Requirements

### 2.1 The deliverable

- **R1** The skill produces a **Decision Package** with these parts (Research B §2.4):
  - a **recommendation** for the first initiative,
  - **scope** — explicitly *in* and explicitly *out*,
  - a **sequenced roadmap** (pilot → scale),
  - **buy / build / defer** decisions,
  - a **ready-to-contract execution brief** (the hand-off to the build tier / P2a Architecture).
- **R2** Frame the deliverable around **decision-readiness** as the unit of value, and produce it as
  an **executive artifact** (compose with `executive-communication` — SCQA/Minto — by reference).

### 2.2 The discovery flow

- **R3** Document the P1 flow: structured discovery → landscape/data reading → **gap analysis** →
  option framing → sequencing → buy/build/defer → execution brief (Research B §4.1).
- **R4** A **first-cut conceptual model** often appears here — compose with `conceptual-modelling`
  (EPIC-06) by reference for that fragment, without pulling modelling depth into this skill.

### 2.3 Reconciliation & boundary

- **R5** **Absorb `strategic-blueprint-checklist`** (currently internal product framing —
  MVP/personas/metrics) into `decision-package` so there is one discovery framework. Fold its content
  into the skill's references; reduce
  `docs/engineering-standards/references/strategic-blueprint-checklist.md` to a 2-line pointer to the
  skill (do not leave two frameworks).
- **R6** **Protect the free→paid boundary** (Research B principle): orientation (P0) is free and
  shallow (`semantic-consulting-coach`); deciding (P1) is paid and is where this skill operates. The
  skill states the boundary and does not blur into free coaching.
- **R7** Lands the durable Decision Package as a **first-class spec** in the spine (EPIC-02): it
  becomes the top of the golden thread (`decision → architecture → model → epic → …`), not an
  artifact that dies in Confluence.

### 2.4 Naming (Research B open #4)

- **R8** **Default name: "Decision Package"** for both the internal asset (`decision-package`) and the
  client-facing deliverable — it is already the term used throughout the series, so adopt it rather
  than invent a brand. An engagement MAY relabel the *client-facing* artifact (e.g. *Semantic
  Readiness & Direction*, *Decision Foundation*, *Scope Definition*) without renaming the skill; the
  skill documents this as an allowed per-engagement override, not an open decision.

---

## 3. Constraints

- **C1** Compose by reference with `executive-communication`, `semantic-consulting-coach`,
  `conceptual-modelling`; do not restate their content.
- **C2** `SKILL.md` ≤ ~500 lines; templates/checklists in `references/`.
- **C3** Place in `skills/consulting/`; add to `meaningfy-consulting` (EPIC-04).
- **C4** Trigger precision against the neighbouring `semantic-consulting-coach` (coach vs produce).

---

## 4. Acceptance criteria

- **A1** The skill produces a complete Decision Package (R1) framed as an exec artifact (R2).
- **A2** The discovery flow incl. gap analysis and buy/build/defer is documented (R3–R4).
- **A3** `strategic-blueprint-checklist` is absorbed; one discovery framework remains (R5).
- **A4** The free→paid boundary is explicit and protected (R6); the package lands as a first-class
  spine spec and golden-thread root (R7).
- **A5** The P1/deliverable name is recorded (R8); `make validate` + trigger probes pass.

---

## 5. Added / changed / deleted

| Action | Artifact |
|---|---|
| **Added** | `skills/consulting/decision-package/`; bundle entry in `meaningfy-consulting` |
| **Changed** | `semantic-consulting-coach` cross-pointer (coach→produce hand-off); spine golden-thread root |
| **Deleted** | `strategic-blueprint-checklist` as a separate framework (absorbed/redirected) |

**R-DOCS (cross-cutting):** engagement docs (EPIC-08) and the methodology must reference the Decision
Package as the P1 deliverable and golden-thread root.
