# Assessment: writing-antipatterns
Before: body 10271 bytes, references 38041 bytes. After: body 8322, references 14779.

Measured with `lean_check.py` (the lint's own body measure). Total 48312 → 23101 bytes, under the
24576 budget; no `over_budget` entry needed. Line numbers are those of the files before the rewrite.
Ids U1–U8 and A1–A14 keep spelling and meaning; CHK-86 and CHK-103 still point to sections that hold
them.

## SKILL.md body

| # | Passage (heading or lines, before) | Class | Where it went | Note |
|---|---|---|---|---|
| 1 | § Overview, l. 18-22 (advice is not universal; genre decides) | keep | body intro | the bias the skill corrects |
| 2 | § Overview, l. 24-30 (what it owns / does not) | drop | | repeats Boundary |
| 3 | § Genre map intro, l. 34-36 (Diátaxis plus four) | keep | body Rules, one sentence | |
| 4 | Genre map table, l. 38-47 | keep | body Rules, unchanged | |
| 5 | Two consequences, l. 49-58 | keep | body Rules, two bullets, shortened | |
| 6 | Domain is not genre; internal working plan gap, l. 60-64 | keep | body Rules | |
| 7 | Model/diagram-structure axis, l. 65-68 | owner | body Rules, one line citing `modelling-conventions`, `architecture` | |
| 8 | U1–U8, l. 70-122 | keep | body Rules, U table (id, defect, cue, fix); both-domain examples of U7/U8 kept | spec: claim-accuracy requirement |
| 9 | § Guarded intro and per-genre table, l. 124-139 | keep (pointer) | body Workflow step 3, one pointer to `inversion-matrix.md` | per-genre files removed, see refs |
| 10 | Pointer-table-only restraint, l. 141-144 | keep | body Rules, "A new antipattern" bullet; spec delta | single-source rule |
| 11 | Explainer pointer, l. 146-148 | drop | | file removed |
| 12 | § Self-check, l. 150-159 | keep | body Before you hand over (first two rows); new-entry and new-genre lines → Rules bullets | |
| 13 | Boundary & Related, l. 161-177 | keep | Boundary; decision card named under `executive-communication` | |
| 14 | New: Quick Start (an ADR draft checked) | keep | body Quick Start | worked example the shape requires |

## references/inversion-matrix.md

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 15 | Header naming the per-genre files, l. 3-6 | drop | | files removed |
| 16 | Compact matrix, l. 8-27 | keep | unchanged; now the per-genre view | |
| 17 | A1–A14 entries | keep | unchanged except rows below | |
| 18 | A2 "zombie nouns" attribution (Sword, Pinker), l. 61-62 | drop | | provenance, no rule |
| 19 | A9 "burying the lede" corroboration, l. 202-203 | drop | | provenance, no rule |
| 20 | A13 Pinker attribution and source history, l. 258-259 | drop | | history (no history in a skill) |
| 21 | A12/A13 links to `decision.md` | keep | asynchronous approval request stated once above the matrix; entries say "(above)" | `agent-decision-requests` spec |

## references/ per-genre files (tutorial, how-to, reference, explanation, decision, decision-record, contract, coaching)

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 22 | Register signature + owning skill, each file | drop | | repeats the genre map |
| 23 | Pointer tables, each file | drop | | each is one column of the compact matrix; qualifiers repeat entry text |
| 24 | `decision.md` asynchronous approval request paragraph | keep | `inversion-matrix.md`, above the matrix | |
| 25 | `explanation.md` precedence (structure outranks texture) | owner | A9 entry and `explanatory-writing` (already there) | |

## references/explainer.md

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 26 | Why "good writing" is the wrong unit, l. 7-25 | drop | | repeats body intro and A3/A2/A9 |
| 27 | Diátaxis and executive communication; Decision splits; coaching inversion, l. 27-48 | drop | | repeats genre map consequences; "competent writer" point kept in body intro |
| 28 | Metaphor comparison table, l. 50-67 | owner | `explanatory-writing` (choosing the controlling metaphor) | one worked comparison for one idea |
| 29 | Using the catalogue, steps 1-4, l. 69-77 | keep | body Workflow | |
| 30 | Worked self-check for a review deliverable, l. 79-104 | keep | body Before you hand over, rows 3-9 | |

## Citers changed (D-14)

- `skills/test-strategy/references/inventory.md` CHK-86: "one matrix column per genre", section
  "Before you hand over; genre map".
- `skills/test-strategy/references/generic-writing.md` CHK-86: "the genre's matrix column".
- `docs/environment/communication.md` extension flowchart: a genre adds a matrix column, not a
  `GENRE.md` file.
- `openspec/changes/lean-skills/specs/writing-antipatterns/spec.md`: delta replacing the
  per-genre-files requirement with "single-sourced in the inversion matrix".

Second reader: general-purpose subagent (fresh), 2026-11-16. Verdict: nothing lost.
Other fixes: none; the per-genre qualifiers checked against the entries (all stated there), `make validate-spine` green (spec/writing-antipatterns passes).
