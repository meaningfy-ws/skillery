# Verification and validation

Every artefact is checked twice, in two different ways. Going down (shaping), each level is
validated against the level above. Coming up (building), each artefact is verified against its own
specification. Validation always ends with a person; an agent prepares the evidence and may
recommend, but never validates on the developer's behalf.

## The V-model table

| Artefact | Validated against (right thing?) | Verified against (built right?) | When | Validation owned by |
|---|---|---|---|---|
| EPIC and PLAN | The need: the developer agrees the why, the appetite and the success measure | The clarity gate (≥ 9/10) | Shaping; before the first task | `epic-planning` |
| Architecture (C4, ADRs) | The use cases and drivers: the walkthrough; spikes for risky assumptions | Each ADR's Confirmation as a check; the architecture-conformance review lens | Walkthrough before an ADR is accepted; conformance every stage | `architecture` |
| Model | The domain: example instances, competency questions, the domain-expert review | The model's own checks and generated-code freshness | When the model changes, in shaping; every commit | `conceptual-modelling` |
| Scenarios | What the developer wants: scenario sign-off *(provisional)* | The traceability check | Sign-off once per EPIC at the PLAN gate; traceability before each PR | `bdd-gherkin` |
| Code | The EPIC's success measure: the acceptance demo | Tests, gates, the review lenses, the checker | Every task (verification); after the last stage (validation) | `epic-delivery` |
| Docs | A reader can act on them: the cold reader, on a page whose type is how-to or tutorial | Snippets run; the docs gate; the L2 lens checks changed docs agree with the code | Every stage that changes a how-to or tutorial page; every task-oriented page of the docs stage | `technical-writing` |
| The iteration | The validation review *(provisional)*: did each EPIC deliver its value, did each ADR hold | Every change archived, its specs merged | End of an iteration | `epic-delivery` |

The activities owned elsewhere are described in their skill. This skill owns two.

## Acceptance demo

Offered once per EPIC that delivers or changes a use case, after its last build stage and before
the docs stage and the archive. The lead shows the use case running against the EPIC's success
measure; the developer accepts it or names what is wrong. A purely technical EPIC has nothing to
accept.

| Appetite | The demo |
|---|---|
| Below LARGE | Offered; the developer may skip it. The skip (who, why, date) goes to `evidence/acceptance.md` |
| LARGE and above | Mandatory; the verdict, what was shown and the date go to `evidence/acceptance.md` |

The procedure is in [`stage-loop.md`](stage-loop.md). Its first real run is recorded (lean-delivery,
accepted 2026-11-11); the validation review stays provisional until an iteration ends.

## Validation review *(provisional)*

Once per iteration (a group of EPICs). The lead runs it with the developer. For each EPIC: did it
deliver its value and meet its success measure? For each ADR: did the decision hold in practice? An
ADR that did not hold gets its status changed and a new decision, through the architect. The
findings go to the next shaping session's `inputs/`.

## The evidence folder

Validation leaves evidence in the change's optional `evidence/` folder, archived with the change:

| File | Written by | Holds |
|---|---|---|
| `evidence/walkthrough.md` | Architect | The walkthrough's trace and verdict |
| `evidence/spike-<topic>.md` | Builder | The question, the yes or no, the evidence |
| `evidence/model-validation.md` | Lead, from the domain expert's verdict | What was reviewed and the verdict |
| `evidence/acceptance.md` | Lead | What was shown, the verdict, the date; or the skip: who, why, date |
| `evidence/docs-owed.md` | Lead | The pages owed by the docs stage, or "no docs owed" |

Each record names the person who decided and the date.

## Provisional steps

Scenario sign-off per EPIC, the acceptance demo and the validation review are provisional: the
practice they come from defined them but had not yet run them. Their first real run is recorded
(what worked, what did not), and either confirms them or reshapes them through a change to this
skill.
