# Open Questions — EPIC-06: `conceptual-modelling` Skill

> Questions for [EPIC-06](EPIC-06-conceptual-modelling-skill.md) · [PLAN-06](PLAN-06-conceptual-modelling-skill.md). Answer inline on the **Answer:** lines.

### Q6.1 — In-project `model/` vs own-repo model — which is the *scaffolded* default (EPIC-09 seam)?
DEC-10 locks "in-project `model/` by default" but EPIC-06 R2 also supports an own-repo/library model
with cross-repo golden-thread IDs. The open part is what EPIC-09's `project-setup` interview should
*default to scaffolding*, since cross-repo IDs (Q2.3) and refresh/pinning differ sharply between modes.
- **A) ★** Scaffold in-project `model/` by default (per DEC-10); offer own-repo only when the interview detects a model meant to be shared across repos. — Honours the locked default; own-repo is the deliberate exception.
- **B)** Scaffold neither by default; ask every product-dev project which mode. — No silent assumption, but adds an interview step for the common case.
- **C)** Default in-project, but always write the model behind a `make`-published package boundary so promoting it to its own repo later is mechanical. — Future-proofs the promotion path, slightly more scaffolding now.

**Answer:** A

### Q6.2 — How many generation targets ship as first-class vs documented-but-not-wired?
R5 lists Python, TypeScript, JSON Schema, SQL DDL/ORM, OWL, SHACL, and HTML docs as deterministic
targets, plus custom generators (R6). Wiring and testing *all* of them is large; the dogfood
engagement likely needs only a couple.
- **A) ★** Ship Python (Pydantic) + JSON Schema + OWL/SHACL as wired-and-tested first-class (the semantic core Meaningfy actually sells); document TS/SQL/HTML + custom-generator authoring as patterns to enable on demand. — Matches Meaningfy's semantic positioning and the dogfood's likely needs; avoids gold-plating 7 generators.
- **B)** Wire all listed targets now. — Complete, but heavy and mostly untested-in-anger.
- **C)** Ship only LinkML→Pydantic wired (today's fragment) + document the rest. — Minimal, but under-delivers the "representation-agnostic, multi-target" bet.

**Answer:** A)

### Q6.3 — LinkML-default-but-not-only (R3) — does accommodating model2owl/ontology tooling need a real abstraction now?
R3 forbids hard-assuming LinkML-only and says decision points (LinkML vs other) are surfaced as
explicit choices. But building a genuine source-format abstraction (so non-LinkML sources flow through
the same generation seam) is a large design commitment vs simply *documenting* that other tools exist.
- **A) ★** Document LinkML as the wired default and other ontology tooling (model2owl etc.) as *named, supported-by-pattern* alternatives — no unifying abstraction until a real project needs a non-LinkML source. — Honours R3's "don't hard-assume" without over-engineering an abstraction the dogfood may never exercise (YAGNI).
- **B)** Build a source-adapter abstraction now so any supported source format reaches the generators uniformly. — Cleanest extensibility, significant upfront design for unproven demand.
- **C)** Pick LinkML as the only *wired* path and treat "not-only" as a future EPIC. — Simplest, but arguably under-honours the locked DEC-10 breadth.

**Answer:** choose option A) and documetn that otehr tools may exist to generate/derive artefacts. Note that model2owl is usedl in otehr projects to generate LinkML artefact, which then is used to generate the otehr ones. so model2owl may, seldom, play the role of a pre-requisite step, followed then by LinkML generators. Note that model2owl has atriong owl and shacl and html generators.    
