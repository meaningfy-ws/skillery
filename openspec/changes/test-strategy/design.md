<!-- PLAN (design half), derived 2026-11-13 from proposal.md. Not yet attacked or gated. -->

> Derives from: EPIC `test-strategy` ([`proposal.md`](proposal.md)), DEC-1..DEC-12.

## Context

Checks exist across the catalogue but no skill says which check answers which question for which
activity (`inputs/seed.md`, inventory sketch). Three facts sit in the wrong place or in two places:

- Verification and validation are defined in `epic-delivery` (SKILL.md § *Verification and
  validation*, and the V-model table in `references/verification-validation.md`). The V-model table
  is already an activity × question matrix, for six artefacts.
- Test data: `project-setup/references/testing-setup.md` § *Test-data and fixture conventions*
  ("polyfactory for domain objects") and `cosmic-python/references/testing-checklist.md` item 6
  ("small builder functions") disagree. `testing-setup.md` § *TDD + BDD workflow* restates the loop
  owned by superpowers TDD and `bdd-gherkin`.
- Workflow phases (`skills/*/assets/workflows/*.workflow.json`, nine files) carry `id`, `owner`,
  `expect`, `allow`, `gates`, `enter`; nothing says how a phase succeeds or fails. The navigator's
  schema check (`mods/navigator/lib/workflow.ts`, `phaseError`) rejects any other phase key.

## Goals / Non-Goals

**Goals:** the skill and its matrix (DEC-1..DEC-6); the moves (DEC-4, DEC-9); the criteria field and
its lint (DEC-10); the bindings (DEC-2); the four proofs (DEC-12).

**Non-Goals:** the proposal's No-gos. In particular no new technique, no profile work beyond
marking gaps, no navigator display of the criteria.

## Decisions

New choices made while planning; settled ones are cited, not repeated.

- **D-1 Skill shape.** `skills/test-strategy/SKILL.md` holds the loop, the definition of a test
  (DEC-3), the six questions and five stances (DEC-4), how to read the matrix, the worked example
  and the boundary. `references/<family>.md`, one per family of DEC-6: `software`, `documentation`,
  `devops`, `ui`, `shaping`, `modelling`, `architecture`, `generic-writing`. `references/inventory.md`
  lists every check found, each with a stable id `CHK-nn`. The V-model table moves into the family
  files as their verification and validation rows; SKILL.md keeps the two-sentence definition.
- **D-2 Matrix row.** Every family file has one table with the columns *Question* · *Check* (with
  its `CHK-nn`) · *Technique owner* · *Tool* · *Moment* (workflow and phase, or "any") · *Status*
  (`exists` or `gap`). A `gap` row names the EPIC expected to fill it (B, C or D) or "none yet". A
  family with no check today still has its file, with its questions and `gap` rows (DEC-6).
- **D-3 The six questions**, each with a short id used in the matrix: `VAL` (are we building the
  right thing), `VER` (are we building it right), `ADQ` (are the checks representative and do they
  bite), `ROB` (does it hold at the edges and under attack), `CLR` (can its reader act on it), `RSK`
  (what outside the work can go wrong). **The five stances:** verifier, validator, adversary, cold
  reader, checker; each names the questions it asks. A review lens or a brief takes a stance; the
  stance does not own the brief (`epic-delivery`) or the dispatch mechanics (`guardrails`).
- **D-4 What stays in `epic-delivery`.** `references/verification-validation.md` keeps the
  acceptance demo, the validation review, the evidence folder and the provisional steps (all are
  when and who, DEC-5). Its V-model table and the SKILL.md definition paragraph move; one pointer
  line replaces each.
- **D-5 Criteria field.** Each phase gains `criteria: {"succeeds": "<one line>", "fails": "<one
  line>"}`, both non-empty strings naming the evidence. Required in the nine **default** files
  (repo lint); **optional in a repository's override file** (the navigator accepts it, validates its
  shape when present, and never requires it). This narrows the proposal's *What Changes* bullet
  "BREAKING for repo workflow files": no repository file breaks. The navigator reads and validates
  the field; it does not display it (Non-Goals).
- **D-6 Facets.** `area: cross-cutting`, `subject: generic`, `posture: profiled` (a core with one
  profile per family), `stage: verify`, `maturity: experimental`. `purpose` gains a new value in
  `facets.yaml`, `quality: "state and check how work succeeds and fails, in any activity"`, because
  no existing value fits an activity-agnostic skill.
- **D-7 Proof mechanics** (DEC-12).
  - *Inventory coverage:* `tests/test_test_strategy.py` reads every `CHK-nn` in `inventory.md`
    and fails if one is cited by no family file, or a family file cites an id the inventory lacks.
  - *One home per fact:* the same test asserts each moved fact's marker sentence occurs once in
    `skills/` and in its new home: the verification definition ("Verification asks"), the test-data
    rule (`polyfactory`, allowed in the checklist and in `testing-setup.md`'s install line only),
    the TDD loop ("RED → GREEN → REFACTOR", allowed only where the external skill is cited).
  - *Triggers:* probes in `tests/trigger_probes.yaml`: two positives for `test-strategy`, near-misses
    against `clarity-gate`, `bdd-gherkin`, `technical-writing` and `meaningfy-code-review`.
  - *Non-code use:* SKILL.md's Quick Start is a LinkedIn post taken through the loop with the
    `generic-writing` rows; the stage checker confirms each step cites a matrix row.
- **D-8 Pointer lines.** Each technique-owning skill gains one line in its `## Boundary & Related
  Skills`: "Answers `<question ids>` in `test-strategy`'s matrix (`references/<family>.md`)." No
  other change to those skills (No-gos).
- **D-9 Two stages.** Stage 1: the skill, the inventory, the matrix, the moves, the pointers, the
  probes, the docs. Stage 2: the criteria field (navigator schema, lint, the nine files' criteria)
  and the bindings. Stage 2 waits for, or rebases onto, `navigator-follows-the-work`'s changes to
  `mods/navigator/` and the workflow files.

## Algorithm / approach

**Inventory (task 1.1).** Search `skills/` for checks: gates, rubrics, review lenses, briefs that
challenge, scenario and probe practices, `check` commands. For each, record id, what it checks, its
owner file, its moment. The seed's table is the starting list. The inventory is descriptive; it
judges nothing.

**Worked example (Quick Start, abridged).**

> **Input:** "write a LinkedIn post announcing our new SHACL service."
> 1. *Succeeds:* a data engineer who has never heard of us understands what the service does and
>    clicks through. *Fails:* it reads as an advert, or as jargon (CLR, VAL).
> 2. Matrix, `generic-writing.md`: CLR → cold reader (`technical-writing`, CHK-nn); house rules →
>    `rulebook check` (CHK-nn); genre defects → `writing-antipatterns` (CHK-nn); VAL → the owner
>    approves the stated success before drafting (gap → D).
> 3. Draft; run the checks; a failed criterion goes back to the draft, not to the post.

**Criteria example (epic-shaping, phase `decide`).**

```json
"criteria": {
  "succeeds": "every open question has the developer's answer in inputs/qa.md",
  "fails": "a DEC- or a no-go rests on an assumption nobody answered"
}
```

**Idempotency.** All edits are file edits under review; the inventory test and the lint are pure
reads; re-running any task overwrites the same files with the same content.

### Anti-patterns

| Don't | Do instead | Why |
|---|---|---|
| Copy a technique's steps into a family file | Cite the owning skill and its section | Single source (DEC-5, DEC-8) |
| Fill a gap row with a technique invented here | Mark it `gap` and name the EPIC | No-gos: no new technique |
| Write paragraph-long criteria | One line each, naming the evidence | Rabbit-hole: boilerplate |
| Require `criteria` in repo override files | Require it only in defaults | D-5: no repo breaks |
| A test that greps prose loosely | Marker sentences with exact allowed homes | D-7: a stable proof |

## Error matrix

| Failure mode | How it is detected | Expected handling |
|---|---|---|
| A check exists but is missing from the inventory | The stage checker reads the seed table against `inventory.md`; the reviewer of L2 | Add the `CHK-nn` and its matrix row before merge |
| A `CHK-nn` cited nowhere, or cited but undefined | `tests/test_test_strategy.py` | Fix the family file or the inventory |
| A moved fact still stated in the old home | `tests/test_test_strategy.py` marker check | Replace the old text with the pointer |
| A default phase without `criteria`, or an empty string | Repo lint `workflow_criteria` in `make validate` | Write the line; the lint names file and phase |
| A repo override phase with malformed `criteria` | Navigator `phaseError` (schema) | The band reports the file and key, as for any schema error |
| The navigator rejects `criteria` after a rebase onto `navigator-follows-the-work` | `mods/navigator` tests (`workflow.test.ts`) | Re-apply D-5 to the rebased schema; re-run the mod tests |
| `test-strategy` fires for "write a Gherkin scenario" | Near-miss probe vs `bdd-gherkin` | Sharpen the description; re-run the probes |
| `make bundles` stale after the new skill | `bundle_gates` in `make validate` | Run `make bundles`, commit the result |

## Risks / Trade-offs

- **RISK-1** The two EPICs touching `mods/navigator/` collide. Likelihood medium, impact low (one
  key). Mitigation: D-9 puts the field in stage 2 and rebases it.
- **RISK-2** The matrix goes stale as skills change. Likelihood high over time, impact medium.
  Mitigation: the `CHK-nn` test catches dangling ids; a new check without a row is caught only by
  review. Accepted for now; B, C and D add rows as they go.
- **RISK-3** Criteria for about fifty phases read as boilerplate. Mitigation: one line naming the
  evidence; the L2 reviewer rejects generic lines ("the phase is done").
- **Trade-off:** keeping the Python checklist in `cosmic-python` (DEC-8) leaves `cosmic-python` over
  its body budget; that budget concerns SKILL.md, and the checklist is a reference, so nothing moves
  for it.

## Open Questions

None blocking. The `purpose` facet value (D-6) is a planning choice the developer may rename.
