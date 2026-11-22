# Verification and validation

The definition of verification and validation, and the matrix of what each artefact is checked
against, are owned by `test-strategy`. In a delivery the developer validates; an agent prepares the
evidence and may recommend. This skill owns two rows of that matrix: the acceptance demo and the
validation review.

## Acceptance demo

Offered once per EPIC that delivers or changes a use case, after its last build stage and before
the docs stage and the archive; a purely technical EPIC has nothing to accept. The procedure is in
[`stage-loop.md`](stage-loop.md), *After the last build stage*.

| Appetite | The demo |
|---|---|
| Below LARGE | Offered; the developer may skip it. The skip (who, why, date) goes to `evidence/acceptance.md` |
| LARGE and above | Mandatory; the verdict, what was shown and the date go to `evidence/acceptance.md` |

The demo runs the `@manual` scenarios from the feature file in `tests/manual/`, not from a copied
list (`bdd-gherkin`).

## Validation review *(provisional)*

Once per iteration (a group of EPICs). The lead runs it with the developer. For each EPIC: did it
deliver its value and meet its success measure? For each ADR: did the decision hold in practice? An
ADR that did not hold gets its status changed and a new decision, through the architect. The
findings go to the next shaping session's `inputs/`. It runs the `@manual` scenarios from the
feature file too, not from a copied list.

## The evidence folder

Validation leaves evidence in the change's optional `evidence/` folder, archived with the change.
Each record names the person who decided and the date.

| File | Written by | Holds |
|---|---|---|
| `evidence/walkthrough.md` | Architect | The walkthrough's trace and verdict |
| `evidence/spike-<topic>.md` | Builder | The question, the yes or no, the evidence |
| `evidence/model-validation.md` | Lead, from the domain expert's verdict | What was reviewed and the verdict |
| `evidence/acceptance.md` | Lead | What was shown, the verdict, the date; or the skip: who, why, date |
| `evidence/docs-owed.md` | Lead | The pages owed by the docs stage, or "no docs owed" |

## Provisional steps

Scenario sign-off per EPIC, the acceptance demo and the validation review are provisional until
their first real run is recorded (what worked, what did not), which confirms them or reshapes them
through a change to this skill. The demo's first run is recorded (lean-delivery, accepted
2026-11-11); the validation review waits for an iteration to end.
