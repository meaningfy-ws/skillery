# Open Questions — EPIC-07: `decision-package` Skill

> Questions for [EPIC-07](EPIC-07-decision-package-skill.md) · [PLAN-07](PLAN-07-decision-package-skill.md). Answer inline on the **Answer:** lines.

### Q7.1 — Does the Decision Package as a "first-class spine spec" (R7) fit the OpenSpec spec model?
R7 lands the Decision Package in `openspec/specs/` as the golden-thread *root*. But OpenSpec `specs/`
are capability behaviour contracts (RFC-2119 SHALL + Given/When/Then). A Decision Package is an
executive narrative (recommendation, scope, roadmap, buy/build/defer) — it may not naturally be a
behaviour spec.
- **A) ★** Land the Decision Package as a *durable artifact in the spine* (its own artifact type/home, e.g. `openspec/decisions/` or a `decision-package` artifact in the schema) that the first `specs/` entries *cite as parent* — rather than forcing it into the behaviour-spec shape. — Preserves it as the golden-thread root without distorting OpenSpec's behaviour-contract semantics.
- **B)** Force it into `specs/` as a special spec with narrative sections. — Honours R7 literally, but pollutes the behaviour-contract store with non-behavioural content.
- **C)** Keep it in `docs/engagement/` (durable canon) and make it the thread root *by ID reference* only, not by living in `openspec/`. — Cleanest fit for a narrative doc, but weakens the "in the spine, not dead in Confluence" intent of R7.

**Answer:** A

### Q7.2 — Absorbing `strategic-blueprint-checklist` (R5) — fold wholesale, or reconcile two genuinely different frames?
R5 absorbs the internal `strategic-blueprint-checklist` (MVP/personas/metrics) into `decision-package`
so there is one discovery framework. But product-blueprint framing (MVP/personas) and consulting
decision-readiness framing (buy/build/defer, pilot→scale) are not obviously the same lens; a naive fold
may produce an incoherent checklist.
- **A) ★** Fold by *mapping* the blueprint's still-relevant items into the Decision Package's discovery flow (R3) and explicitly dropping the items that don't serve decision-readiness — a reconciliation, not a paste. — Yields one coherent framework instead of two stapled together; honours R5's "one framework" intent.
- **B)** Fold wholesale into `references/` and let the skill present both lenses. — Fastest, but risks the "two frameworks in one file" smell R5 warns against.
- **C)** Keep the blueprint as a *referenced* optional lens for product-shaped engagements, pointer-reduced as planned but not merged. — Avoids a bad merge, but arguably leaves two frameworks (the thing R5 forbids).

**Answer:** A 
