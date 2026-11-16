# Assessment: conceptual-modelling
Before: body 8328 bytes, references 7313 bytes. After: body 6776, references 5147.

Under budget before; the rewrite fixes the pointers and applies the shape. The "Model validation"
heading and its numbered steps are kept: `test-strategy`'s inventory cites them (CHK-70, 71, 72).

## SKILL.md body

| # | Passage (heading or lines, before) | Class | Where it went | Note |
|---|---|---|---|---|
| 1 | Title | keep | title | |
| 2 | Provisional banner, l. 16-17 | drop | | a status note, not a rule; belongs in an issue |
| 3 | § Overview, generative model, outside the LLM path | keep | intro | the bias |
| 4 | § Overview, conditional | keep | intro; Boundary | |
| 5 | § Overview, owns the model only | keep | Boundary | |
| 6 | § Where the model lives, two modes | keep | Rules, first rule | "EPIC-09" history dropped |
| 7 | § Golden-thread implication | keep | Rules, first rule (own-repo mode) | |
| 8 | § The source, LinkML default, model2owl prerequisite, YAGNI | keep | Rules, source rule, pointer sentence | table stays in `ontology-practices.md` |
| 9 | § Deterministic multi-target generation | keep, owner | Rules, generation rule; craft → `linkml-engineering` | |
| 10 | § Seam to cosmic-python | keep | Rules, generation rule; Boundary | |
| 11 | § Diagrams alongside | keep | Rules, diagrams rule | |
| 12 | § Terminology | keep | Rules, glossary rule, pointer sentence | |
| 13 | § Model validation 1-3, kept as tests, evidence | keep | Workflow § Model validation (unchanged) | |
| 14 | Navigator workflow link | keep | Workflow intro | |
| 15 | § Boundary | keep | Boundary | "Delegates" label kept: the inventory parses it |
| 16 | test-strategy matrix line | keep | unchanged | |
| 17 | (new) Quick Start, Workflow phases, Quick diagnostic | keep | new sections | from the workflow file's phases and criteria |

## references/generators.md (deleted)

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 18 | Generation outside the LLM path | drop | | repetition of the body |
| 19 | List of `linkml-engineering` reference files | owner | Boundary cites `linkml-engineering` | a pointer file only; no other file cited it |
| 20 | What stays here | drop | | repetition |

## references/ontology-practices.md

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 21 | Intro | keep | intro, shortened | |
| 22 | Stable-IRI policy: mint a namespace per model | keep | § Stable-IRI policy | |
| 23 | Identifiers opaque and permanent | owner | `modelling-conventions` `naming-and-identity.md` | single owner |
| 24 | Golden-thread style IDs, cross-repo citation | keep | § Stable-IRI policy | |
| 25 | Modularity | keep | § Modularity | |
| 26 | Vocabulary reuse: which vocabularies | keep | § Vocabulary reuse | the principle is modelling-conventions' |
| 27 | Source decision table, YAGNI, model2owl future skill | keep | § The source decision | |

## references/terminology-management.md

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 28 | Whole file | keep | unchanged | terminology-specific; the conceptual-definition principle is cited, not restated |

Second reader: general-purpose subagent (fresh), 2026-11-15. Verdict: nothing lost
Other fixes: none needed; no file cites the deleted `generators.md`, "opaque and permanent" and "reuse before minting" are in `modelling-conventions` `naming-and-identity.md`, and the dropped provisional banner is a status note (no spec or check requires it).
