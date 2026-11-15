# Reading: domain-driven-design
Fork `meaningfy-ws/agent-rules-books` at `893a88a6fce3a80c565bf39ac65021b43a8b2990`, read in full on 2026-11-15 by reader A.

| File | Bytes | What it adds |
|---|---|---|
| `SKILL.md` | 707 | Frontmatter and a short entry pointing to the mini set, with the full text for harder modelling trade-offs. |
| `domain-driven-design.md` | 42,424 | The full rule set, the largest of the eight: knowledge crunching, model-driven design, ubiquitous language, bounded contexts and context relationships, distillation, large-scale structure, the tactical patterns (entities, value objects, aggregates, domain services, specifications, repositories, factories), application and infrastructure layers, translation at boundaries, supple design, analysis patterns, testing, forbidden patterns and a review checklist. |
| `domain-driven-design.mini.md` | 5,683 | The working version: fifteen decision rules, nine triggers and a six-question final check. |
| `domain-driven-design.nano.md` | 2,266 | A compact reminder: one language per context, behaviour in the model, small aggregates, explicit translation. |

Total read: 51,080 bytes.

## Goals it serves
Modelling a complex business domain in code: settling the vocabulary inside a context, drawing
context boundaries and the relationships between them, choosing entity, value object or aggregate,
keeping invariants inside the model, and translating at every boundary. It fits domain-heavy design
and reviews of passive or persistence-shaped models. Do not use it for simple supporting areas or
CRUD; do not use it to name the folders of a Meaningfy service (that is `cosmic-python`); and never
load it beside `patterns-of-enterprise-application-architecture` as equal guidance: the fork's matrix
marks that pair as conflicting (`docs/COMPATIBILITY.md`, row "DDD"; the pair note
`docs/compatibility/domain-driven-design/patterns-of-enterprise-application-architecture.md`,
"Loading Decision", line 14), and `lean-skills` DEC-5 makes DDD the primary of the two (the override
in D-10).

## Conflicts with Meaningfy rules
| # | Their advice (file, heading, line) | The Meaningfy rule it meets (owner skill) | Named in DEC-7, DEC-19 or DEC-20? |
|---|---|---|---|
| 1 | `domain-driven-design.md`, "Associations and Modules" > "Anti-patterns", line 463: a structure dominated by `models`, `services`, `utils` and `helpers` folders is forbidden. | `cosmic-python` `SKILL.md`, "Canonical vocabulary", lines 409-412, and the four-layer contract, lines 57-81: `models/` and `services/` are the house folder names, and a small service stays one level with exactly those layers ("Scaling up", lines 145-146). The book would rename or regroup them. | not named |
| 2 | `domain-driven-design.md`, "Repositories" > "Rules", line 549: a repository interface is defined by the domain or application model that uses it. | `cosmic-python` `references/example-adapters-layer.md`, "Example: Repository Adapter", lines 115-146, and `SKILL.md`, "Dependency Direction", lines 85-90: the abstract repository lives in `adapters/` and services import it. The book would move it inward. | not named |
| 3 | `domain-driven-design.md`, "Bounded Contexts" > "Anti-patterns", line 239 (no `shared/domain` package), "Shared Model Everything", lines 857-859, and "Review Rules", line 778: shared domain abstractions across contexts are forbidden unless governed as a shared kernel. | `cosmic-python:PR-COMPONENT-FIRST` (catalogue line 19) and `cosmic-python:BP-CONSTANTS-HOME` (line 32): one `core`/`commons` component holds shared models and domain vocabulary for every component. This bites only where an agent reads each component as its own bounded context, but then it would split `commons`. | not named |
| 4 | `domain-driven-design.md`, "Repositories" > "Anti-patterns", line 564: a generic repository abstraction that erases domain meaning is forbidden; focused methods are preferred (line 557). | `cosmic-python` `references/example-adapters-layer.md`, lines 127-146: the house example is a generic repository over any model (find by id, save, list all). This is a reference example, not a catalogue entry, so the owner may judge it a difference of example rather than of rule. | not named |

Checked and not counted: invariants inside value objects and at the model boundary (lines 423-439,
738-739) agree with `cosmic-python:BP-VALIDATE-AT-BOUNDARY`, since house models are typed and validate
on construction. The preference for executable examples over long design documents (lines 89-99,
180-183) is emphasis beside the spec-first method of `architecture` and `epic-planning`, not a ban.
"Factories" as a domain concept does not contradict `cosmic-python:AP-GENERIC-MODULE-NAMES`, which
allows pattern allusions in names. The full text calls itself a binding policy (line 15); DEC-7
answers that.

## Trigger overlap
`conceptual-modelling` ("model the domain", ubiquitous-language glossary, terminology management) and
the `conceptual-modeller` agent; `modelling-conventions` (naming discipline); `architecture`
(boundaries, contracts); `cosmic-python` (the `models/` layer, entities and value objects). The
overlap with `conceptual-modelling` is the strongest: both claim "model the domain".

## Fallback sentence (draft)
If `domain-driven-design` is not installed, offer `DO_NOT_TRACK=1 npx skills@1.8.1 add meaningfy-ws/agent-rules-books#893a88a6fce3a80c565bf39ac65021b43a8b2990 --skill domain-driven-design --agent claude-code --global --yes` (the opencode command is in `assets/install.md`); if the person declines, carry on with `conceptual-modelling` and `cosmic-python` and say once that the DDD guidance was not used.
