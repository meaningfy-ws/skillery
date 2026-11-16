# Assessment: linkml-engineering
Before: body 5055 bytes, references 28994 bytes. After: body 5671, references 17715.

Total 34049 → 23386 bytes, under the 24576 budget. File names kept: `test-strategy`'s inventory
(CHK-74) cites `quality-gates.md` and `owl-shacl-completeness.md`, and the `linkml-engineering`
spec cites `generation-and-templates.md`. Scripts and their tests untouched. LinkML is not a
registered dependency, so general LinkML knowledge is sorted as drop.

## SKILL.md body

| # | Passage (heading or lines, before) | Class | Where it went | Note |
|---|---|---|---|---|
| 1 | Title | keep | title | |
| 2 | § Overview, pivot artefact, l. 18-21 | keep | intro sentences | the bias |
| 3 | § Overview, not greenfield, l. 23-25 | keep | intro; Boundary | |
| 4 | § Overview, reuses modelling-conventions, OWL in mind, l. 27-31 | owner, keep | Boundary (Reuses); Workflow step 3 | |
| 5 | § 1 Derive, l. 35-39 | keep | Workflow step 1, pointer sentence | |
| 6 | § 2 Author, l. 41-47 | keep | Workflow step 2, pointer sentence; SEMIC/model2owl authority in `authoring-mechanics.md` | |
| 7 | § 2 Complete OWL/SHACL, l. 49-52 | keep | Workflow step 3, pointer sentence | |
| 8 | § 3 Generate & guard, l. 54-60 | keep | Workflow steps 4-5, pointer sentences | gates chosen with the user |
| 9 | § The working loop, l. 62-70 | keep | Workflow, closing paragraph | |
| 10 | § Boundary, l. 72-101 | keep | Boundary (Owns, Reuses, Delegates, related) | "Delegates" label kept: the inventory parses it |
| 11 | test-strategy matrix line | keep | unchanged | |
| 12 | (new) Quick Start | keep | Quick Start | worked example built from the reference examples |
| 13 | (new) Common mistakes | keep | Rules | from `quality-gates.md` STOP anti-patterns (row 47) and the identity rule |
| 14 | (new) Quick diagnostic | keep | Before you hand over | from the gates and the header rule |

## references/authoring-mechanics.md

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 15 | Intro: mechanism here, principle in modelling-conventions | keep | intro | |
| 16 | Reference links list (seven LinkML spec pages) | drop, keep | one metamodel link; model2owl conventions and checkers links kept | the cited authority stays |
| 17 | Schema header YAML and its three rules | keep | § Schema header | comments shortened |
| 18 | Reusable slots, two YAML examples | keep, drop | § Reusable slots, prose only | examples were generic LinkML syntax |
| 19 | Implicit URIs, explicit for reused terms, `subproperty_of` | keep | § Identity | YAML examples reduced to inline code |
| 20 | `default_range: string` smell audit | keep | § Identity | |
| 21 | URI-as-datatype artifice | keep | § URI-as-datatype | |
| 22 | Every element defined, title/aliases/examples | keep | § Every element defined | definition rule cited to modelling-conventions |
| 23 | Slot contract | keep | § Slot contract | |
| 24 | Enums as SKOS, YAML example | keep, drop | § Enums | example dropped |
| 25 | Class design | keep | § Class design | |
| 26 | Modularity vs profiling | keep | § Modularity is not profiling | |

## references/deriving-linkml.md

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 27 | Intro, no upstream → conceptual-modelling | keep | intro | |
| 28 | From UML (model2owl first, mapping, identities) | keep | § From a UML model | "future dedicated skill" note shortened |
| 29 | From text spec | keep | § From a text specification | |
| 30 | From model2owl output | keep | § From a model2owl output | |
| 31 | From another model | keep | § From another existing model | |
| 32 | After derivation | keep | § Done when | |

## references/owl-shacl-completeness.md

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 33 | Intro: first-class outcome, author even for JSON-only | keep | intro | |
| 34 | OWL MUST list | keep | § OWL | tightened |
| 35 | SHACL MUST list | keep | § SHACL | tightened |
| 36 | Rule of thumb | keep | § Rule of thumb | "checkable function" sentence dropped as restatement |

## references/generation-and-templates.md

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 37 | Intro: deterministic, never hand-edit | keep | intro | |
| 38 | `make generate-models` bridge, temp-then-mv, makefile | keep | § bridge | |
| 39 | Pin LinkML version | keep | § bridge | |
| 40 | Custom templates, strict base, Jinja + Python examples | keep | § Custom generator templates | short form kept: a house convention a model cannot guess |
| 41 | Custom generator for any language | keep | § Custom generator templates | |
| 42 | Automation incl. diagrams, makefile | keep, drop | § Automation, prose | makefile example dropped |
| 43 | Per-module artefacts, makefile, path rule | keep | § Per-module artefacts | |
| 44 | Enable-on-demand target matrix | keep | § Enable-on-demand targets | |
| 45 | Neo4j generators: behaviour, profiles, neomodel names | keep | § Neo4j | |
| 46 | Neo4j Installing table (scaffold flags, Q4.5/Q5.1) | owner | `project-setup`; one sentence kept (`--neo4j`, `--force`, snapshot) | |
| 47 | Neo4j Using block, wiring, test suite note | keep | § Neo4j | repetition of pin/refresh cut |
| 48 | Architectural boundary for generated modules | keep, owner | § Generated modules stay in the architecture; layering is `cosmic-python`'s | |

## references/quality-gates.md

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 49 | Intro, selection process, table, record the choice | keep | intro and table | |
| 50 | Schema lint without muting, rules list | keep | § Schema lint | |
| 51 | Link to LinkML validation spec | drop | | general |
| 52 | Codegen freshness | keep | § Codegen freshness | |
| 53 | Example round-trip | keep | § Example round-trip | |
| 54 | Coverage and architecture | keep | § Coverage and architecture | |
| 55 | Non-negotiable working loop | drop | | repetition of the body loop |
| 56 | STOP anti-patterns | keep | body Common mistakes | |
| 57 | Scaffolding is project-setup's | keep | closing sentence | |

Second reader: general-purpose subagent (fresh), 2026-11-15. Verdict: nothing lost
Other fixes: none needed; the Neo4j install rows (Q5.1, `--neo4j`, `--skip-existing`) were checked in `project-setup` (`interview.md`, `SKILL.md`, `modernizing-existing-projects.md`), and the spec's citation of `generation-and-templates.md` and CHK-74 hold.
