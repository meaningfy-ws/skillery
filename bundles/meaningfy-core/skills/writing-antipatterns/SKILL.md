---
name: writing-antipatterns
description: The register/genre-conditional catalogue of how writing fails — a genre map (Tutorial, How-to, Reference, Explanation, Decision, Decision record, Contract/specification, Coaching dialogue), a short list of defects that apply regardless of genre, and an inversion matrix of antipatterns whose correctness depends on genre (a rhetorical question is craft in an explainer and a defect in an ADR). Use when reviewing prose for a specific genre, when a rule from one writing skill seems to be misapplied in another context, or when asked "why does this read badly" for a document that mixes genres. Trigger on "antipattern", "why is this hard to read", "review this document/plan", "does this rule apply here", "genre mismatch". Cited by every writing-family skill; never restated by them.
license: Apache 2.0
metadata:
  purpose: content
  area: cross-cutting
  subject: generic
  posture: reusable
  stage: any
  maturity: stable
---

# Writing Antipatterns

Writing advice is usually stated as universal, and it is not: "lead with a concrete example" is
craft in an explainer and a defect in an API reference, where the example is mistaken for the rule.
The unit that decides whether a move is craft or a defect is the **genre**. A competent writer's
unreadable document almost always applies a move that is right in the genre they know to a genre
that inverts it. This skill is the negative space: what not to do, per genre.

## Quick Start

Draft ADR: "**We adopt PostgreSQL.** Studies show relational stores scale better. The decision
should probably be revisited."

1. Genre: a Decision record (reader: a future engineer reconstructing why).
2. Unguarded: "Studies show" is U5, a weasel word; name the source and the figure or drop it.
3. Guarded, Decision record column: opening with the outcome is A9, **harmful**; no rejected option
   fails A12, **required** here; "probably" is A6, **harmful** in a record.
4. Rewrite: context, the options considered (PostgreSQL, MongoDB) with why MongoDB lost, the
   outcome, the consequences, all stated declaratively.

## Workflow

1. Name the single genre and its reader's job (genre map below). No one-word answer means the
   artefact may already be fused (U1).
2. Apply U1–U8 without further judgement: they hold in every genre.
3. Read `references/inversion-matrix.md` when a move's verdict depends on the genre: it holds the
   compact matrix (one column per genre) and entries A1–A14, each with where the move fails, where
   it is required, the guard question, the cue and the fix. Use the genre's column; open an entry
   only for a move you flag.
4. When a rule from another genre seems to apply, ask the entry's guard question before acting on it.

## Rules

**The genre map.** Diátaxis gives the first four; the other four are those the Meaningfy skills imply.

| Genre | Reader's job | Owning skill | Register signature |
|-------|--------------|---------------|--------------------|
| Tutorial | learn by doing | `technical-writing` | second person, literal steps, low surprise |
| How-to | complete a known task | `technical-writing` | terse, imperative, goal stated first |
| Reference | look something up | `technical-writing` | agentless declarative, tables, exhaustive |
| Explanation | build understanding | `explanatory-writing` | one metaphor, example beside claim, rhythm |
| Decision (persuasive) | choose and commit now | `executive-communication`, `proposal-writing` | answer first, MECE pyramid, hedging banned |
| Decision record | reconstruct the reasoning later | `architecture` (ADR) | context first, options visible, consequences named |
| Contract / specification | be held to it | `proposal-writing` (SoW), `architecture` (OpenAPI/LinkML/use cases) | enumerated, precise, no persuasion, no metaphor |
| Coaching dialogue | think before committing | `semantic-consulting-coach` | questions over statements, no structure until asked |

- **Decision is two genres that invert each other.** Persuasive decision writing leads with the
  answer and suppresses rejected options; a decision record gives context, options, outcome,
  consequences. An ADR that opens with the outcome has lost its only reason to exist.
- **Coaching inverts the executive method.** In `semantic-consulting-coach`'s Exploration mode a
  governing thought, pyramid or canvas before alignment is a defection, not craft.
- **Domain is not genre.** A sales pitch is Decision; a BI memo is Explanation or Decision by its
  job. Check the eight before adding a ninth. The one known gap is the team's **internal working
  plan**: no skill owns it, it defaults to Reference and reads as inventory (a future
  `plan-writing` skill is the fix).
- **Prose, not model structure.** Free strings where a controlled vocabulary belongs, god-classes,
  unlabelled duplication in a C4 diagram belong to `modelling-conventions` and `architecture`.
- **A new antipattern** is one entry in the inversion matrix, with a status for all eight genres;
  never prose copied per genre.

**Unguarded defects (U1–U8): every genre.**

| Id | Defect | Cue | Fix |
|---|---|---|---|
| U1 | Genre fusion: two genres in one artefact, one register | name the single reader and job; "and also" means fused | split, then link. Paired artefacts (proposal + SoW, a White use case and its Blue realisation) are separate documents with single-sourced shared content and a named reader each: pairing is not fusion |
| U2 | The bland sentence | swap in a competitor's name; if nothing breaks, cut it | Reference may be dry (precision without ornament), never bland (ornament without content) |
| U3 | Non-parallel enumeration | first word of every item: same part of speech? | one grammatical form per list |
| U4 | Prose compensating for missing structure (a comma-spliced sentence doing three table rows' work) | meaning carried by a label or sentence the artefact has no element for | create the element: one relationship per modality, one row per decision, one sentence per claim |
| U5 | Weasel words: "studies show", "significant", a claim laundered through nobody | for "X shows Y", can you name X? | name the source and the figure, or drop the claim. Distinct from guarded Hedging (A6), which qualifies the author's own claim |
| U6 | Terminology drift (feature/tool/functionality; capitalisation) | near-synonyms for one referent | one term, defined once (when to define it is A5) |
| U7 | Claim exceeds the mechanism: an outcome, intensifier ("exactly"), vague evaluative word ("defensible", "seamless") or category the method cannot deliver or an outsider cannot check ("our mapping shows where meaning breaks down"; "a seamless AI assistant") | can an outsider check it, and does the method deliver it? | name the mechanism or checkable property ("shows where meaning conflicts or is poorly specified"; "answers from your own documents and cites them") |
| U8 | Impossible predicate ("the data disagrees"; "the assistant understands your business") | could this subject literally do this verb? | the literal verb or the real actor ("the two datasets give conflicting values"; "retrieves answers from your documents") |

## Before you hand over

Quick diagnostic for prose you checked, and for a writing review you deliver:

| Question | If not | Action |
|---|---|---|
| Is the single genre named before any rule was applied? | rules from the wrong genre | name it (Workflow 1) |
| Does each fix come from the guard question, not from a genre you are more fluent in? | a correct move flagged as a defect | re-read the entry's guard |
| Does the review rewrite at least one page beside the original? | diagnosis without a specimen (A3) | add the worked specimen |
| Are the numbers counted ("25 tables"), not estimated? | an estimate presented as a measurement | count, or mark it as an estimate |
| Does it name the cause (accretion, unseparated readers, author is not the decider), not only the symptom? | the next version has the same shape | name the cause |
| Does each recommendation carry a cost and a triage ("two hours before Friday")? | nothing gets acted on | add cost and order |
| Is there an observable acceptance test ("a new reader states the next decision in five minutes")? | "it reads better" | state one |
| Was any reader asked where they stopped reading? | the cheapest signal is missing | ask one, or say it was not done |
| With several variants for different audiences, is exactly one marked the source of record? | the fan-out is A1 | mark one |

## Boundary & Related Skills

**Owns:** the genre map, the unguarded defects U1–U8 and the inversion matrix A1–A14.

**Does NOT own:** the voice profile (`meaningfy-voice`), the Diátaxis quadrant definitions or the
craft moves that realise them (`explanatory-writing`), doc placement and form (`technical-writing`),
the persuasive structure method and the decision card (`executive-communication`), or
model/diagram-structure antipatterns (`modelling-conventions`, `architecture`).

**Related:** `meaningfy-voice`, `technical-writing`, `explanatory-writing`, `executive-communication`,
`proposal-writing`, `decision-package`, `architecture`, `semantic-consulting-coach`.

Answers `CLR` in `test-strategy`'s matrix (`references/generic-writing.md`).
