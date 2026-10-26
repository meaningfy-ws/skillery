# Open Questions — EPIC-08: `proposal-writing` + `estimation` + Engagement Docs

> Questions for [EPIC-08](EPIC-08-proposal-estimation-engagement.md) · [PLAN-08](PLAN-08-proposal-estimation-engagement.md). Answer inline on the **Answer:** lines.

### Q8.1 — Is `estimation` its own skill, or a section of `proposal-writing`?
R4/R5 make `estimation` a separate lightweight skill (checklist+method) composing with
`decision-package` and `epic-planning`. But proposal-writing and estimation are tightly coupled (you
price what you scope); two thin skills may trigger-collide and fragment the front-of-funnel flow.
- **A)** Two skills as locked — estimation is reused independently of proposals (e.g. mid-engagement re-scoping). — Matches R3/R4; reuse justifies separation.
- **B) ★** Keep two skills but make `proposal-writing` the *entry* skill that explicitly invokes `estimation` by reference, so the common flow is one path and estimation stays independently triggerable. — Preserves independent reuse while keeping the price-what-you-scope flow coherent; reduces collision risk.
- **C) (scope-expanding — only if you want to re-shape)** Merge into one `proposal-and-estimation` skill. — Simplest flow, but loses standalone estimation reuse and changes EPIC-04's bundle assignment.

**Answer:** B) note that we may use multiple estimation techniques, with PERT as a favoured system for estimations, and we create gantt diagrams in external tools by doing a work breakdown such as smartsheet or msProject. It is explained 

### Q8.2 — Engagement stage gates (R7/R8) — appended to `dod-quality-gates.md`, or a separate engagement-gates doc?
R7 appends engagement-level gates *upward* into `dod-quality-gates.md` (one ladder), with EPIC-05
owning the build half and EPIC-08 appending. But engagement gates (proposal signed, decision accepted)
are commercial/human and have a very different audience and cadence than the build DoD; one file may
serve two audiences poorly.
- **A) ★** One ladder file as locked, but clearly sectioned: "Engagement gates (human/commercial)" above "Build gates (automated)" with the enforcement table. — Honours R7's one-ladder intent; sectioning handles the audience split without a second file.
- **B)** Separate `docs/engagement/stage-gates.md` for commercial gates, cross-linked to the build DoD. — Cleaner per-audience, but reintroduces the two-ladder smell R7/anti-patterns forbid.
- **C)** One ladder, but the engagement rows are pointers into `docs/engagement/` where each gate's procedure lives. — Keeps the unified ladder thin while detail lives with the engagement canon.

**Answer:** A, note that teh commercial (qualification, pre-sale, sale, marketing, CRM and lead communication, service packaging, fir for market, etc... ) aspects are till to be developped and brainstoremed and debated and cristalised. 
