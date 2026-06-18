# Open Questions — EPIC-00: Master Index & Sequencing

> Questions for [EPIC-00](EPIC-00-master-index.md). Answer inline on the **Answer:** lines.

### Q0.1 — Is the dogfood gate one engagement, or one engagement *per extracted skill*?
The gate (§6) blocks EPIC-06 and EPIC-07 behind "one real engagement end-to-end." But EPIC-06
(conceptual-modelling) and EPIC-07 (decision-package) exercise very different parts of the spine —
modelling depth vs front-of-funnel decision discovery. A single small fixed-cost engagement may not
touch both.
- **A)** One engagement unlocks both — accept that one of the two skills is extracted from thinner evidence.
- **B) ★** One engagement unlocks EPIC-07 (decision/discovery is front-of-funnel and any engagement hits it); gate EPIC-06 separately on the first engagement that actually builds a domain model. — Matches where each skill's evidence really comes from; avoids extracting a modelling skill from an engagement that did no modelling.
- **C)** Require a single engagement deliberately chosen to exercise both (modelling + decision) before either is extracted — slower but strongest evidence.

**Answer:** 
B

### Q0.2 — Does "never spend a merge self-inconsistent" (A0.3) survive cross-EPIC dependencies?
A0.3 requires `make validate` green after *every* EPIC. But EPIC-02 defines the spine bundle while
EPIC-04 is the sole editor of `marketplace.json`; EPIC-05 writes the build half of `dod-quality-gates.md`
and EPIC-08 appends the engagement half. If these land out of order or partially, the repo is briefly
inconsistent.
- **A)** Keep strict per-EPIC green and enforce the documented build order rigidly (02 before 04, 05 before 08) — simple rule, but couples merges tightly.
- **B) ★** Define an explicit "EPIC may land across multiple PRs but each *PR* must be green" rule, and let the validator tolerate not-yet-created artifacts via the stub pattern already used (golden-thread check stubbed). — Matches how the work actually decomposes; the stub pattern is already in the plans.
- **C)** Relax A0.3 to "green at each EPIC boundary, not each commit" and accept transient red within an EPIC's PR series.

**Answer:** 
B


### Q0.3 — Is the build order resilient if the dogfood engagement never materialises?
Steps 3–6 (EPIC-05 method, 06, 07, 08, 09 projection) all sit downstream of a real paid engagement
that may be months away or may not happen on schedule. Projection (EPIC-09) is explicitly "do last,
after the schema stabilises on dogfood."
- **A)** Hold the line — no extraction or projection until a real engagement runs; the foundations (01–05) are still independently valuable.
- **B)** Add a synthetic dogfood fallback: run the spine on an *internal* skillery EPIC (this very series) as the stand-in engagement if no client one arrives within a set window. — Keeps momentum, but internal use under-tests the consulting tier.
- **C) ★** Split the gate: let EPIC-09 projection proceed on the *internal* dogfood (the spine is exercised by this series), but keep EPIC-06/07 extraction gated on a *real client* engagement. — Projection mostly needs the schema shape (which the internal run proves); the consulting skills genuinely need client evidence.

**Answer:** 
C