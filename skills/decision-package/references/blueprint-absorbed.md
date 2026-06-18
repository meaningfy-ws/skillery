# Blueprint absorbed: reconciliation into the P1 discovery flow

The internal **strategic-blueprint checklist** (the product-blueprint "7 Questions" — MVP, personas,
metrics) predates this skill. Its job was to make *product implementation* obvious. The Decision
Package's job is different: **decision-readiness** — deciding *whether and what* to build, before a
build exists.

So we **reconcile, not staple** (Q7.2 = A): each still-relevant item is **mapped into** the
[`discovery-flow.md`](discovery-flow.md) where it serves decision-readiness, and the items that are
pure product-delivery mechanics are **dropped**. The result is one coherent discovery framework, not
two lenses running in parallel. This file records the mapping so the decision is auditable.

## Mapped IN (recast for decision-readiness)

| Blueprint item | Where it lands in the flow | How it is recast |
|----------------|---------------------------|------------------|
| **Q1 — exact problem / persona / outcome** | Step 1 (structured discovery) | Kept as **decision inputs**: who commits, the pain, the measurable outcome. Not as an MVP problem statement. |
| **Q2 — success metrics** | Step 1 (structured discovery) | The measurable outcome that constrains the recommendation. Targets/timeline frame *what "decided well" looks like*, not product KPIs to ship. |
| **Q3 — why will you win** | Step 1 (why now / why us) | A strategic decision input (timeliness, the client's edge), feeding option framing. Not a product moat claim. |
| **Q4 — core architecture decision (trade-off analysis)** | Step 4 (option framing) | The single most powerful absorbed item: the **trade-off discipline** becomes how options are framed — candidate first initiatives held as genuine choices with explicit trade-offs, *decided* in the package, not pre-chosen. |
| **Q6 — MVP features (3–5, ruthless cut)** | Step 5 (sequencing) | The discipline of a **tight first step** becomes the **pilot** in the pilot → scale roadmap. The "cut ruthlessly" instinct maps onto "smallest step that closes the blocking gaps". |
| **Q7 — what you are NOT building + risks** | Step 5 + Scope (explicit out) | Becomes the **explicit out-of-scope list** and the deferred-but-real roadmap items — load-bearing because it protects the P2 boundary. Risk/mitigation feeds the recommendation's "safe to commit" reasoning. |
| **Risk & mitigation framing** (Q7 close, Phase-1 risks) | Recommendation reasoning + boundary safeguard | Why the first step is *safe*, and the explicit stop/extend signal. |

## Dropped (pure product-delivery mechanics — not about deciding)

| Blueprint item | Why dropped |
|----------------|-------------|
| **Q5 — tech stack rationale** (language/framework/DB/DevOps/cost) | A build-tier (P2 / architecture) concern. The Decision Package decides *whether and what*, not the implementation stack; pulling it in pre-empts the architecture skill and blurs the P1/P2 boundary. The buy/build/defer step captures any *commercial* technology decision; the stack itself is deferred. |
| **Cosmic-Python layer-design implications** (the per-question "this becomes layer X in Phase 2" notes) | Implementation guidance for a repo that does not yet exist. It belongs to the build tier, downstream of this package. |
| **ADR authoring mechanics** (the blueprint's ADR template) | ADRs are an architecture-skill artefact in the build tier. A buy/build/defer *decision* may seed an ADR later, but the Decision Package records the commercial/strategic decision, not the architectural one. |
| **The "Phase 1 = 40% of project time" / exit-criteria framing** | Project-execution mechanics for a product build. The P1 Decision Phase has its own shape and commercial model (coach's `engagement-model.md`); the product-blueprint timings do not transfer. |

## Net effect

One discovery framework. The blueprint's *specificity discipline* (reject vague, demand numbers and
explicit trade-offs/exclusions) is preserved and is genuinely valuable for decision-readiness. The
blueprint's *product-build mechanics* (stack, layers, ADR plumbing, project-phase timings) are left
to the build tier where they belong.
