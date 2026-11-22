---
kind: memo
date: YYYY-MM-DD
audience: self
last_run: YYYY-MM-DD HH:MM
---
# YYYY-MM-DD HHMM grooming session - intake <source>

<!-- Only when halted, as the first line: HALT: <rule broken> on <record in words (#id)>; check <what>; write "Owner: resume" to clear. -->

## Decisions needed

Decision cards (`executive-communication`, decision request), each followed by `Answer:`:
- **The plan.** "Create and update the records planned below?" Its facts: counts by record type
  (companies, people, leads, opportunities; new and existing), the new tags it needs, and the two or
  three rows the agent is least sure of, each with why. "Yes" covers the creations it lists; the
  owner may answer with exceptions ("yes except 7 and 12").
- **One card per ambiguous identity**: each candidate in words (name, employer, role) with `(#id)`,
  the key that agrees and the one that disagrees, the agent's best guess.
- **One card per merge**: the records, the keys that agree and disagree, which to keep and why, what
  moves.

## Watch

Rows the plan could not place, and what continues in the next session.

## Done by the agent

One line per record: record in words (#id) · what changed, before → after · why.

## Owner's notes

(The owner writes here, after an `Answer:`, or on lines starting `Owner:`. The agent never writes in this section.)

## Scout

Sources read: <vault project and notes, mail since …, calendar, files>.

| Count | Value |
|---|---|
| People in the source | |
| Organisations in the source | |
| Already in Odoo as contacts (people · companies) | |
| Already in Odoo as leads or deals | |
| Tier A: two-way positive signal | |
| Tier B: fits our buyer, no positive signal yet | |
| Tier C: no fit now (left in the source) | |

## Shared context

Written once here; records link it through the event tag and one line naming the vault project: what
the source is, when, what we pitched and with which material, who from Meaningfy was there.
Tag: `Event: <name> <year>` · source · medium.

## Plan

One bullet per record, in execution order (companies, then people, then leads and deals; higher
scores first within a tier):
- `n` · tier · company (#id or NEW) · person (#id or NEW) · lead or opportunity · pipeline and stage
  · score and stars · tags, source, medium · why · open question.

Budget: the per-run budget of goal-loop, every planned record counting as one in depth; the rest
continue in the next intake session.

## Audit

One bullet per record, after re-reading it from Odoo: record in words (#id) · verdict · what failed,
if anything (exists once; linked person, company and deal; type, pipeline, stage, tags; profile or
dossier sourced; personal details within the rules; notes internal, on the right record, not
duplicated; next step set). Then the cross-checks: plan rows against records created; no new
duplicates; no fact repeated across person, company and deal; nothing sent.

## Log (for the verifier; fold it)

### Objective

Every person and company from <source> in tiers A and B exists once in Odoo, linked, with a current
profile, the right record type, pipeline and tags, and a next step; the audit finds no duplicate,
wrong link or unsourced fact.
- [ ] Scout and shared context done.
- [ ] Plan card answered yes.
- [ ] Plan executed, record by record.
- [ ] Audit passed.
- [ ] Report written (planned against done, deviations and why, what is OPEN, what continues).

### Iteration 1

Writes: one line per write: system · model · record (#id) · field · old → new · source; one line per resolution: keys · candidates (#id) · decision.

Verification: (goal verifier, guardrail auditor last)

Decision:
