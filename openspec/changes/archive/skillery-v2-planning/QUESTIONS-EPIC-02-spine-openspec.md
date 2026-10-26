# Open Questions — EPIC-02: The Spine (OpenSpec `meaningfy` schema)

> Questions for [EPIC-02](EPIC-02-spine-openspec.md) · [PLAN-02](PLAN-02-spine-openspec.md). Answer inline on the **Answer:** lines.

### Q2.1 — Forked schema vs convention-only lift — revisiting because it is the keystone *and* RISK-3.
DEC-2 locks "full OpenSpec adoption via a forked `meaningfy` schema." RISK-3 already records the
fallback (lift only `specs/`+`archive`+`validate` by hand). This deserves a pre-commit decision
because the *entire downstream series* (03, 05, 09) assumes the fork, and unforking later is
expensive. The question: how much do we bet on the fork *before* the dogfood proves it?
- **A) ★** Fork now but keep the fork *thin* — only the EPIC/PLAN templates + the 3 hard rules — and defer rich per-artifact `rules:` until after dogfood. — Honours DEC-2, but minimises sunk cost if upstream OpenSpec churns; matches "resist gold-plating before the gate."
- **B)** Fork fully now (all rules, golden-thread checks, profiles) so the dogfood tests the real thing. — Strongest dogfood signal, highest rework risk if the fork or upstream changes.
- **C)** Start convention-only (the RISK-3 fallback) and fork *after* dogfood proves the artifacts. — Lowest upfront risk, but downstream EPICs that assume `/opsx` + schema must then be re-sequenced.

**Answer:** A
(Note, however that we mai want to revisint the fork locig after all the epics have been implemented, just to check and do some housekppeing, and wonder whether worksflow is solid and everything is proper)  

### Q2.2 — Is `PLAN.md` one artifact, or `tasks.md` + `design.md` collapsed?
R2 says `PLAN.md` plays the `tasks.md` role *and* the `design.md` role. OpenSpec natively separates
proposal/design/tasks. Collapsing them simplifies authoring but loses OpenSpec's native validation of
each, and may make the clarity-gate target (the PLAN) carry two concerns.
- **A) ★** Keep one `PLAN.md` (tasks + design merged) — it is what the clarity gate scores and matches the existing Meaningfy PLAN shape. — One artifact to gate, matches current practice in these very PLAN files.
- **B)** Emit `tasks.md` and `design.md` as OpenSpec-native separate artifacts, with `PLAN.md` as a generated view. — Keeps OpenSpec's native validators, but adds a third file and a generation step.
- **C)** `PLAN.md` = tasks only; push "design"/algorithm into the EPIC or a `design.md`. — Cleaner clarity-gate target, but design rationale drifts from the plan that cites it.

**Answer:** 
B (stick to openspec conventions, apply this decission downstram and all its consequences)

### Q2.3 — Where do golden-thread IDs actually live and how are they assigned?
R8 defines the chain `requirement → ADR → model-entity → epic → change → task → test → commit` but
not the *ID format* or *who mints them*. This determines whether "cite your parent" is a `rule`, a
validator check, or a human convention — and whether IDs survive across repos (model in its own repo,
EPIC-06 R2).
- **A) ★** Human-readable structured IDs minted at authoring time (e.g. `DEC-`, `EPIC-`, `ADR-` prefixes already in use), cite-parent enforced as a validator check where structural. — Consistent with the IDs this series already uses; no new infra.
- **B)** Content-hash / UUID IDs auto-minted by the schema tooling. — Collision-proof and cross-repo stable, but opaque and unciteable by humans.
- **C)** Path-derived IDs (the file path *is* the ID). — Zero minting, but breaks on moves/renames and across repos.

**Answer:** (A); and side-note the following: 
Unless I misunderstood the meaning of it, I find the R8 chain possibly dangerous at the moment, and we shall hold back and think. ADRs, model-entity are only parts of architecture, and many more parts of teh arhcitecture documentation are not specified. So the thread shall be refined in the future. Also `epic` and `change` might be conflated (as almost the same thing, unless they are designed differently, epic shall have the text in teh form of a work shape, whereas the change may follow other text structure, not sure how to reconcile that, perhaps merge the two structures??? but keep one artefact? to prevent proliferation?) then the EPIC is broken down into tasks. So finally yes test and code review and finally commit, yes. 
So for now, lets stay on purpose a bit more vague and go something like this: Product requirement specifications (or anything like that) - architecture (including scenarios, ADRs, Use cases, C4 and Archi diagrams, and many more) - epic/change - task - test - commit  

### Q2.4 — Does `MEMORY.md` as a regenerable index need a generator, or is it hand-maintained?
R10 makes `.claude/memory/MEMORY.md` a regenerable cache "not truth," capped ≤200 lines (EPIC-03 R10).
"Regenerable" implies a deterministic generator from `specs/`/changes — but none is specified, and a
hand-maintained index will drift from the truth it indexes.
- **A) ★** Specify a deterministic `make regenerate-memory` that rebuilds `MEMORY.md` from `specs/` + open changes; CI checks it is in sync (like codegen). — Makes "regenerable" real and drift-proof, mirrors the model-codegen pattern.
- **B)** Hand-maintained with a validator that only enforces the ≤200-line cap and a freshness date. — Cheap, but the cache silently diverges from truth.
- **C)** Drop `MEMORY.md` entirely; let agents read `specs/`/changes directly. — No drift possible, but loses the cheap orientation index agents rely on.

**Answer:** option  C); if OpenSpec has a good way of managing and consolidating the project specs and memory, rely on that, and drop this mecasnism entirely. Otherwise option A)
