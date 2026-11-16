# Assessment: architecture
Before: body 35952 bytes, references 105371 bytes. After: body 8031, references 16449.

Measured with `lean_check.py` (the lint's own body measure). Total prose 141323 → 24480 bytes, under
the 24576 budget; no `over_budget` entry needed. Line numbers are those of `SKILL.md` before the
rewrite. Moved to `assets/` as material (D-1, D-20), not counted: `ADR_TEMPLATE.md`,
`use-case-template-white.adoc`, `use-case-template-blue.adoc`. `assets/workflows/architecting.workflow.json`
untouched.

## SKILL.md body

| # | Passage (heading or lines, before) | Class | Where it went | Note |
|---|---|---|---|---|
| 1 | Title and intro, l. 14-16 (contract-, documentation-, specification-first; EA, docs, data structures) | keep | body title + bias sentence | |
| 2 | § Boundary & Related Skills, l. 18-24 | keep | body Boundary (shortened; seams sentence cut as repetition) | ADR single-source sentence now names `assets/ADR_TEMPLATE.md`; added `project-setup` owns where files live; Related line kept, "`Smell:`/`Fix:`" reworded to "diagram mistakes"; matrix clause unchanged |
| 3 | § Final Deliverables, l. 26-47 | keep | body Workflow, "Deliverables" line (EA Sparks, index page with ADRs, specs versioned with code) | document contents → `architecture-index-page.md` (already owned there); data-structure list → Workflow step 3 |
| 4 | § Communication Style, l. 49-55 | keep | body intro sentence (end state in formal terms, call out wrong semantics) | "assume user understands" dropped (generic) |
| 5 | § Core Principles 1, C4 as zoom levels, l. 59-66 | drop | | C4 general knowledge |
| 6 | § Core Principles 2, notation by level, l. 68-75 | keep | body Workflow step 4 | house notation choice |
| 7 | § Core Principles 3, ArchiMate truth / UML design, l. 77-87 | drop | | restates row 6 plus ArchiMate/UML general knowledge |
| 8 | § Use Case Specifications, l. 89-114 | keep | `references/use-cases-cockburn.md` (already held there) | body copy was repetition |
| 9 | l. 116 references to use-case files | keep | body Workflow step 2 pointer + asset names | |
| 10 | § Workflow intro (navigator), l. 118-119 | keep | body Workflow intro | |
| 11 | § Step 0 drivers, l. 121-143 | keep | body Workflow step 1 (confirm drivers, no modelling without them); question list → `business-requirements-to-architecture.md` | |
| 12 | § Step 1-4, L1-L4 end results and "must not", l. 147-211 | keep | `references/diagram-checklists.md` (per level) | duplicated the checklists; merged once |
| 13 | § ADRs intro + docs-stage rule, l. 213-215 | keep | body Rules, ADRs | |
| 14 | § ADR granularity and typical counts, l. 217-233 | keep | body Rules, ADRs (counts) | examples per level dropped (generic); counts cited by `writing-antipatterns` |
| 15 | § ADR Template (inline), l. 235-271 | material | `assets/ADR_TEMPLATE.md` (single copy) | inline copy was a second, divergent template |
| 16 | § ADR Best Practices, l. 273-297 | keep | body Rules, ADRs (compress/split, 5–8 / 14+, explicit consequences in scope, no vague terms, link to models/specs/code, Confirmation) | CHK-84 |
| 17 | § Pattern 0, drivers, l. 301-317 | drop | | repeats Step 0 (row 11) |
| 18 | § Pattern 1, greenfield discovery, l. 321-334 | keep | body Workflow (order) and Before you hand over (trace to a driver) | steps repeated the workflow |
| 19 | § Pattern 2, decision exploration, l. 336-347 | keep | body Rules, Presenting a decision | |
| 20 | § Pattern 3, diagram review, l. 349-357 | keep | body Rules, Diagrams (review order) | CHK-80 |
| 21 | § Diagram Checklists ArchiMate L1/L2, UML L3/L4, l. 359-406 | keep | `references/diagram-checklists.md` | merged with the six checklist files |
| 22 | § Activity and BPMN checklists, l. 408-423 | keep | `references/diagram-checklists.md` | |
| 23 | § Behaviour and Interaction Patterns, l. 425-456 | keep, drop | sequence/BPMN/activity rules → `diagram-checklists.md`; list of five example diagrams dropped | |
| 24 | § Contract-first order, l. 458-478 | keep | body Workflow step 3 | |
| 25 | § Benefits of this order, l. 480-485 | drop | | "why it works" |
| 26 | § Anti-Patterns to Avoid (seven), l. 487-515 | keep | body Rules, Common mistakes table (seven rows) | CHK-85; Smell/Fix → Mistake/Why/Do instead |
| 27 | § Key Definitions, l. 517-525 | drop | | C4/ArchiMate general knowledge; "no protocol at L1–L2" kept in checklists |
| 28 | § When to create diagrams vs skip, l. 527-532 | keep | body Rules, Diagrams | |
| 29 | § Phase 0, l. 536-555 | keep, drop | body Workflow step 1; project folder setup dropped (row 34) | |
| 30 | § Phase 1, specify and decide, l. 559-566 | keep | body Workflow steps 3, 5 | |
| 31 | § Phase 2, model in EA, l. 568-576 | keep | body Workflow step 4, Deliverables | "map LinkML data flow" → step 6 (contracts and views name only model concepts) |
| 32 | § Phase 3, verify and trace, l. 578-585 | keep | body Workflow step 7; ADR → models/specs/code in Rules, ADRs | CHK-81 |
| 33 | § Practical Example Structure, l. 587-616 | drop | | repeats Deliverables; repo layout is `project-setup`'s |
| 34 | § Supporting Materials, l. 620-649 | drop | | closing list of references (D-5 b); pointers now at point of need |
| 35 | § References for Deeper Understanding, l. 653-661 | drop | | closing list; general notation knowledge; EA Sparks and contract-first kept in rows 3, 24 |

## references/

| # | File (bytes before) | Class | Where it went | Note |
|---|---|---|---|---|
| 36 | `ADR_TEMPLATE.md` (1405) | material | `assets/ADR_TEMPLATE.md` | filled in by copying |
| 37 | `use-case-template-white.adoc` (2959), `use-case-template-blue.adoc` (3399) | material | `assets/` | filled in by copying |
| 38 | `architecture-index-page.md` (3529) | keep | unchanged | CHK-78; cited by `project-setup` template |
| 39 | `use-cases-cockburn.md` (11061) | keep | condensed in place (5491) | honesty note, DRY, numbering, skeleton, conventions, derivation mapping (CHK-11), coverage floor all kept; prose explanations and the five-step build list reduced to rules |
| 40 | `business-requirements-to-architecture.md` (10513): question list, driver mapping | keep | condensed table "Questions to ask" | |
| 41 | same: red flags (not a driver), key principles 2-4 | keep | "What is not a driver" | |
| 42 | same: e-commerce worked example (Phase 3) | example | one line in the traceability chain; body Quick Start | |
| 43 | same: business-context template (Phase 4) | drop | | superseded by the index page's drivers table (`architecture-index-page.md`) |
| 44 | same: traceability matrix and "if you can't trace it" (Phase 5) | keep | "Traceability" | CHK-81 |
| 45 | same: questions to challenge requirements | drop | | generic |
| 46 | same: common requirements patterns (high-throughput, real-time, master data, multi-tenant) | drop | | general knowledge; "monotonic versioning" kept in body house defaults |
| 47 | same: checklist (twelve boxes) | keep | "Checklist before you design" | CHK-83 |
| 48 | `architecture-project-structure.md` (18684) | owner, drop | where architecture files live in a repo → `project-setup` (`layout.md`, `antora-docs.md`: `pages/architecture/`, `pages/adr/`); ADRs grouped by C4 level kept in body | the folder tree contradicted the index-page and Antora layout `project-setup` scaffolds |
| 49 | `checklist-archimate-l1.md`, `-l2.md`, `checklist-uml-component.md`, `-sequence.md`, `-class-domain.md`, `checklist-bpmn.md` (19250) | keep, drop | merged into `references/diagram-checklists.md` | Meaningfy criteria and thresholds kept (6–8 components, 10–15 messages, 15–20 classes, inheritance 2–3, 10–12 BPMN tasks, 2–3 gateways, LinkML expressibility, contract ownership); "questions to ask" and good/bad class example dropped as generic |
| 50 | `diagram-examples.md`, `diagram-examples-mermaid.md` (17834) | example | cut; body Quick Start carries one worked example | ERSys L1–L3 sample and Mermaid templates; conventions already in checklists |
| 51 | `sequence-diagram-examples.md` (10849) | example | cut | conventions kept in checklists (broker as participant, 202 + polling by version, `--x`, `par`) |
| 52 | `decision-pattern-examples.md` (5888) | keep, example | body Rules, Presenting a decision (one rejected alternative, one-sentence trade-off, premature decisions) and house defaults (consumer owns the contract; monotonic versions over status fields) | async-vs-sync and canonical-repository examples cut (context-dependent examples) |

Citers changed: `skills/test-strategy/references/inventory.md` (CHK-79, 80, 81, 83, 84, 85),
`skills/test-strategy/references/architecture.md` (tool column for CHK-80, 81, 83, 84),
`docs/practice/ai-consulting/methods/enterprise-process-modelling.md` (BPMN link),
`docs/practice/engineering-standards/architectural-guardrails.md` (ADR template path).

Second reader: general-purpose subagent (fresh), 2026-11-15. Verdict: lost: the secondary
notations (UML Component at L2; UML Use Case at L1 as a structural reference only) and "an ADR is
never deleted, only superseded"; restored in the second reading (`SKILL.md` Workflow step 4, Rules
ADRs), paid by trimming a repeated L4 line in `diagram-checklists.md`; total 24574. Not restored:
the per-level ADR numbering (ADR-00x L1, -01x L2, -02x L3, -03x L4) from
`architecture-project-structure.md`, which conflicts with `project-setup`'s sequential ADR-0001
template; the Quick Start's "ADR-010" still hints at it. Other fixes: none; citers all true.
