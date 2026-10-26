# Decision Package — template

The fillable template for the deliverable. It is an **executive artefact**: write it answer-first
with the [`../../../communication/executive-communication/SKILL.md`](../../../communication/executive-communication/SKILL.md)
skill (Governing Thought → SCQA → Minto pyramid). The five R1 parts are the fixed structure; the
cover label MAY be relabelled per engagement (see SKILL.md, R8). It lands at
`openspec/decisions/<id>.md` (golden-thread root).

Keep it tight. Every section earns its place; cut anything that could appear in any consultancy's
deck about any client.

---

```markdown
# Decision Package: <client / initiative>   <!-- or the engagement label, e.g. "Semantic Readiness & Direction" -->

- **ID:** DEC-<n>            <!-- human-readable, minted at authoring (golden-thread root) -->
- **Engagement:** <P1 Decision Phase, ref>
- **Date / version:**
- **Deciding persona:** <who commits, and to what>

## Recommendation  <!-- R1.1 -->

**Governing Thought:** <one actionable sentence — the first initiative to commit to>

<SCQA frame: Situation (the data/governance landscape, neutral) · Complication (the tension forcing
a decision) · Question (what to do first?) · Answer (restate the Governing Thought).>

<Why this is safe to commit to now — the reasoning, answer-first, drawn from the gap analysis.>

## Scope  <!-- R1.2 -->

**In scope (the first step covers):**
- <item> — <why it is in>

**Explicitly out of scope (load-bearing — protects the boundary with the build tier):**
- <item> — <why it is out / when it might return>

## Sequenced roadmap  <!-- R1.3 -->

| Step | What | Why now / trigger | Closes which blocking gap |
|------|------|-------------------|---------------------------|
| **Pilot** | <smallest first step> | <trigger> | <gap> |
| **Scale: next** | <follow-on> | <trigger> | <gap> |
| **Explicitly not first** | <deferred> | <revisit when> | — |

## Buy / build / defer  <!-- R1.4 -->

| Capability | Decision | Rationale |
|------------|----------|-----------|
| <capability> | Buy / Build / Defer | <one line> |

## Execution brief (ready to contract)  <!-- R1.5 -->

- **Chosen first initiative:** <the pilot, restated>
- **In / out scope for execution:** <pointer to Scope above>
- **Inputs & access required from the client:** <data, people, systems>
- **Buy/build/defer decisions to action:** <pointer above>
- **Boundary with execution:** execution is a **separate** P2 engagement with its own scope and
  budget. *"From here, we can execute, or you can take this and execute with someone else."*

## Appendix — first-cut conceptual model (optional)  <!-- R4 -->

<A sketch of key entities/relationships, if it surfaced in discovery. Produced with the
conceptual-modelling skill as a sketch in service of the decision — NOT a built model.>

---

## Golden-thread note

Downstream architecture/requirement artefacts cite this package as parent:
`DEC-<n> → requirement/architecture → conceptual model → EPIC → task → test → commit`. See
[`../../../../spine/golden-thread.md`](../../../../spine/golden-thread.md).
```
