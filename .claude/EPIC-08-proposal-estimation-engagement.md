# EPIC-08: `proposal-writing` + `estimation` Skills + Engagement Docs

> Part of the Skillery v2 series. See [EPIC-00](EPIC-00-master-index.md). **Tier:** new skill
> (consulting/communication). **Depends on:** EPIC-07 (decision-package; the engagement frame).

## 0. Revisions absorbed (from QUESTIONS-EPIC-08)

- **Q8.1=B — two skills, one path.** `proposal-writing` is the **entry** skill and
  invokes `estimation` by reference; `estimation` stays independently triggerable.
  Estimation bakes in **PERT as the favoured technique** (three-point) among
  multiple methods; **Gantt/scheduling is produced in external tools** (Smartsheet
  / MS Project) from the work breakdown — the skill produces the WBS + estimates,
  not the Gantt.
- **Q8.2=A — one sectioned ladder.** Engagement gates added to
  `dod-quality-gates.md` as a clearly-sectioned **"Engagement gates (human/
  commercial)"** block *above* the build gates (enforcement table per R8). The
  wider **commercial mechanics** (qualification, pre-sale, sale, marketing, CRM,
  lead comms, service packaging, fit-for-market) are flagged **TODO — to be
  shaped** (HARD question), not invented.
- Both skills **provisional** pending the dogfood gate (a real paid engagement).

## 1. Purpose & goals (the shaped bet)

**Appetite:** medium. Complete the front-of-funnel and the *engagement-level* governance: the
proposal/SoW capability, fixed-cost scoping discipline, the P0–P3 engagement documentation, and the
stage gates that sit **above** the build-tier DoD.

**Problem.** Two named gaps remain after the spine and `decision-package`: there is no
**proposal/SoW** production skill (Research B #5) and no **estimation / fixed-cost scoping**
discipline to de-risk fixed-cost bids (#6). And the DoD only governs the build phase — there are no
**engagement-level stage gates** (proposal signed → decision accepted → architecture accepted → DoD),
which Research B flags as a reconciliation.

**Solution outline.** Add `proposal-writing` and `estimation` skills; author the `docs/engagement/`
(P0–P3) canon; extend `dod-quality-gates` **upward** with engagement stage gates and settle where
they are enforced (Research B open #5).

**Non-goals.** The Decision Package itself (EPIC-07); CRM/commercial mechanics (Odoo) beyond
referencing them; build-tier gates (owned by EPIC-05).

---

## 2. Requirements

### 2.1 `proposal-writing` skill (Research B #5)

- **R1** Produce a **proposal + SoW** with an **explicit scope boundary** (in/out), framing the
  Decision Phase offer and pricing it as a fixed frame. Composes by reference with
  `executive-communication` (SCQA/Minto) and pairs with `decision-package`.
- **R2** Document the flow: qualify need → frame the Decision Phase offer → price (fixed frame) →
  write proposal (Research B §4.1). Inputs: P0 notes/prospect context. Output: proposal + SoW.
- **R3** Place in `skills/consulting/` (per EPIC-04 R1, which already assigns `proposal-writing` and
  `estimation` to `consulting/`); add both to the `meaningfy-consulting` bundle.

### 2.2 `estimation` skill (Research B #6)

- **R4** Provide an **estimation / fixed-cost scoping** discipline that de-risks fixed-cost bids:
  decomposition, uncertainty ranges, assumptions/exclusions, contingency, and the link to the SoW
  scope boundary. Composes with `decision-package` (sequencing/roadmap) and `epic-planning` (the
  build breakdown).
- **R5** Keep it lightweight (Research B effort: S) — a checklist + method, not a heavy model.

### 2.3 Engagement documentation (P0–P3)

- **R6** Author `docs/engagement/` describing the four-phase engagement model (Research B §2.4):
  **P0 Orientation** (free, bounded), **P1 Decision** (paid; Decision Package), **P2 Execution**
  (paid; software — the build tier), **P3 Partnership** (paid, optional; governance/ops). Narrate and
  point (four-artifact model) — link to the skills, don't restate them.

### 2.4 Engagement-level stage gates (Research B reconciliation + open #5)

- **R7** Extend `docs/ai-coding/dod-quality-gates.md` **upward** with the engagement-level stage gates
  above the build DoD, as one ladder (not two). **EPIC-05 owns the file and writes the build half
  first; this EPIC appends the engagement rows** (build-order 05 → 08 per EPIC-00 §6, so no merge
  clash).
- **R8** Enforce each engagement gate per this table (settles Research B open #5):

  | Gate | Enforcement |
  |---|---|
  | Proposal signed | human sign-off (commercial) |
  | Decision accepted | human sign-off (client) |
  | Architecture accepted | human sign-off + `openspec validate --strict` on the architecture spec |
  | Build DoD | the automated build-tier gate set (EPIC-05 R11) |

---

## 3. Constraints

- **C1** Compose by reference with `executive-communication`, `decision-package`, `epic-planning`;
  no restatement.
- **C2** `SKILL.md` ≤ ~500 lines each; method/checklists in `references/`.
- **C3** Engagement docs are human canon — narrate and point; format per DEC-3.
- **C4** Trigger precision for the two new skills; record probes.

---

## 4. Acceptance criteria

- **A1** `proposal-writing` produces a proposal + SoW with explicit scope boundary and documented
  flow (R1–R3).
- **A2** `estimation` provides a fixed-cost scoping discipline linked to the SoW boundary (R4–R5).
- **A3** `docs/engagement/` describes P0–P3 and points to the owning skills (R6).
- **A4** `dod-quality-gates` defines the engagement stage-gate ladder, with enforcement settled per
  gate and cross-referenced to the build DoD (R7–R8).
- **A5** Both skills are bundled; `make validate` + trigger probes pass.

---

## 5. Added / changed / deleted

| Action | Artifact |
|---|---|
| **Added** | `skills/consulting/proposal-writing/`, `skills/consulting/estimation/`; `docs/engagement/` (P0–P3); bundle entries |
| **Changed** | `docs/ai-coding/dod-quality-gates.md` (engagement stage gates added upward — coordinate with EPIC-05) |
| **Deleted** | — |

**R-DOCS (cross-cutting):** the engagement-level gate ladder is added to the DoD doc owned with
EPIC-05; the methodology references `docs/engagement/` for the higher tier.
