<!-- PLAN (design half), derived 2026-11-13 from proposal.md; attacked the same day by a fresh
     subagent (A-1..A-11, all folded in, see § Attack record). Not yet gated. -->

> Derives from: EPIC `test-strategy` ([`proposal.md`](proposal.md)), DEC-1..DEC-12.

## Context

Checks exist across the catalogue but no skill says which check answers which question for which
activity (`inputs/seed.md`, inventory sketch). Three facts sit in the wrong place or in two places:

- Verification and validation are defined in `epic-delivery`: its description and Boundary claim
  them, SKILL.md [§ Verification and validation](../../../skills/epic-delivery/SKILL.md#verification-and-validation)
  defines them, and [`references/verification-validation.md`](../../../skills/epic-delivery/references/verification-validation.md#the-v-model-table)
  holds the V-model table, already an activity × question matrix for seven artefacts. Two docs point
  at that reference (`docs/development/README.md`, `docs/practice/ai-coding/dod-quality-gates.md`).
- Test data: [`testing-setup.md` § Test-data and fixture conventions](../../../skills/project-setup/references/testing-setup.md#test-data-and-fixture-conventions)
  ("polyfactory for domain objects") and `cosmic-python/references/testing-checklist.md` item 6
  ("small builder functions") disagree. [§ TDD + BDD workflow](../../../skills/project-setup/references/testing-setup.md#tdd--bdd-workflow) restates the loop
  owned by superpowers TDD and `bdd-gherkin`. `polyfactory` also appears, legitimately, in three
  dependency lists (`pyproject.toml.tmpl`, `config-files.md`, `decisions.md`).
- Workflow phases (`skills/*/assets/workflows/*.workflow.json`: nine files, 50 phases) carry `id`,
  `owner`, `expect`, `allow`, `gates`, `enter`; nothing says how a phase succeeds or fails. The
  navigator's `phaseError` (`mods/navigator/lib/workflow.ts`) rejects any other key; the `Phase`
  type is in `mods/navigator/types.d.ts`; the mod is copied into `bundles/meaningfy-navigator/` by
  `make bundles`.

The branch was rebased onto `develop` after `navigator-follows-the-work` was merged, released
(3.14.0) and archived; the deltas are written against the specs as they are after that archive.

## Goals / Non-Goals

**Goals:** the skill and its matrix (DEC-1..DEC-6); the moves (DEC-4, DEC-9); the criteria field and
its lint (DEC-10); the bindings (DEC-2); the four proofs (DEC-12); the Definition of Done of a new
skill and a boundary move (`docs/development/README.md` §9).

**Non-Goals:** the proposal's No-gos. In particular no new technique, no profile work beyond
marking gaps, no navigator display of the criteria.

## Decisions

New choices made while planning; settled ones are cited, not repeated.

- **D-1 Skill shape.** `skills/test-strategy/SKILL.md` holds the loop, the definition of a test
  (DEC-3), the six questions and five stances (D-3), how to read the matrix, the worked example and
  the boundary. `references/<family>.md`, one per family of DEC-6 (`software`, `documentation`,
  `devops`, `ui`, `shaping`, `modelling`, `architecture`, `generic-writing`), plus
  `references/cross-cutting.md` (D-10). `references/inventory.md` lists every check with an id of
  the form `CHK-` plus a number of any width, unpadded (`CHK-7`, `CHK-112`; pattern `CHK-\d+`). The V-model table moves into the family files; SKILL.md keeps the two-sentence
  definition.
- **D-2 Matrix row.** Each family file has one table: *Question* · *Check* (`CHK-<n>`) · *Technique
  owner* · *Tool* · *Moment* (workflow and phase, or "any") · *Decided by* (a person, or the agent
  stance; a `VAL` row is always a person, the V-model's "validation owned by") · *Status* (`exists`
  or `gap`). A `gap` row names the EPIC expected to fill it (B, C or D) or "none yet". Every family
  file has at least one row for each of the six questions, an `exists` or a `gap` (DEC-6).
  `cross-cutting.md` uses the same columns but is exempt from the six-question rule; its citations
  count as coverage of an inventory id.
- **D-3 The six questions**, with ids: `VAL` (are we building the right thing), `VER` (are we building
  it right), `ADQ` (are the checks representative and do they bite), `ROB` (does it hold at the edges
  and under attack), `CLR` (can its reader act on it), `RSK` (what outside the work can go wrong).
  **The five stances:** verifier, validator, adversary, cold reader, checker; each names the
  questions it asks. A review lens or a brief takes a stance; the stance does not own the brief
  (`epic-delivery`) or the dispatch mechanics (`guardrails`).
- **D-4 What stays in `epic-delivery`.** `references/verification-validation.md` keeps the acceptance
  demo, the validation review, the evidence folder and the provisional steps (when and who, DEC-5).
  The definition paragraph and the V-model table move, one pointer line replacing each. Its
  description and Boundary *Owns* drop "verification vs validation" and name "the acceptance demo and
  the validation review"; that description change ships with a positive and a near-miss probe.
- **D-5 Criteria field.** Each phase gains `criteria: {"succeeds": "<one line>", "fails": "<one
  line>"}`, both non-empty strings naming the evidence. Required in the nine **default** files (repo
  lint `workflow_criteria`, added to `ALL_CHECKS`); **optional in a repository's override file** (the
  navigator accepts it, validates its shape when present, never requires it). This narrows the
  proposal's *What Changes* bullet "BREAKING for repo workflow files": no repository file breaks. The
  navigator validates the field and does not display it. A criterion names evidence; it does not
  restate a skill's rule (requirement *Workflows are data that cite their owning skills* in
  [`openspec/specs/workflow-definitions/spec.md`](../../specs/workflow-definitions/spec.md)).
- **D-6 Facets.** `area: cross-cutting`, `subject: generic`, `posture: profiled`, `stage: any`
  (criteria are stated before the work and checked after it), `maturity: experimental`. `purpose`
  gains a new value in `facets.yaml`, `quality: "state and check how work succeeds and fails, in any
  activity"`.
- **D-7 Proof mechanics** (DEC-12).
  - *Inventory coverage:* `tests/test_test_strategy.py` fails if an id `CHK-\d+` in `inventory.md`
    is cited by no family file (nor `cross-cutting.md`), a reference file cites an undefined id, or
    one of the eight family files lacks a row for one of the six question ids.
  - *One home per fact:* the same test scans `skills/` line by line, case-insensitively, with
    per-fact allow-lists:
    - `vv-definition`, pattern `verification asks`: allowed only in `test-strategy/SKILL.md`.
    - `test-data`, pattern `polyfactory`: allowed anywhere in the checklist. In
      `pyproject.toml.tmpl`, `config-files.md` and `decisions.md` it is allowed only on a
      dependency line, meaning a line that also holds a version pin (`==`) or sits in the
      dependency table row naming the `test` group. In `testing-setup.md` it is allowed only on
      the pointer line to the checklist.
    - `tdd-loop`, pattern `red\W{0,5}green`: allowed only on a line naming
      `test-driven-development`. It catches "RED → GREEN → REFACTOR", "RED-GREEN loop" and
      "red/green".

    The test carries its own fixture cases: the arrow form, the hyphen form, a dependency line
    that passes and a prose line that fails.

    `tests/ownership.yaml` gains `vv-definition` (owner `test-strategy`) and `test-strategy` itself
    (DoD: ownership checked or updated). Its tripwire stays advisory.
  - *Triggers:*
    - Static: probes in `tests/trigger_probes.yaml`, two positives for `test-strategy`, plus
      near-misses for `clarity-gate`, `bdd-gherkin`, `technical-writing` and `meaningfy-code-review`,
      plus the `epic-delivery` pair of D-4.
    - Behavioural: one run with `skill-creator`, following the method in the
      `tests/trigger_probes.yaml` header. It uses 20 queries: 10 positives and 10 near-misses,
      including phrases aimed at the external superpowers TDD and `verification-before-completion`,
      plus the `epic-delivery` pair. Each query runs 3 times. **Proven** means every positive
      fires `test-strategy` in at least 2 of 3 runs, and no near-miss fires it in more than 1 of
      3. On a fail, sharpen the description and re-run the whole set. The before and after
      results go to `evidence/triggers.md`. The probe file cannot name external skills, so this
      run covers them (RISK-4).
  - *Non-code use:* SKILL.md's Quick Start takes a LinkedIn post through the loop with the
    `generic-writing` rows. It is the acceptance demo's script (D-11).
- **D-8 Pointer lines.** Each technique-owning skill gains one line in its `## Boundary & Related
  Skills`: "Answers `<question ids>` in `test-strategy`'s matrix (`references/<family>.md`)." Where a
  skill is within two lines of the 650-line cap (`architecture`, 644 body lines), the pointer is folded
  into its existing *Related* line instead of adding one.
- **D-9 Two stages, after the rebase.** Stage 1: the skill, inventory, matrix, moves, pointers,
  probes, use cases, docs. Stage 2: the criteria field (navigator schema and type, lint, the nine
  files' criteria, `make bundles` for the mod copy) and the bindings. `navigator-follows-the-work` is
  archived, so nothing waits on it.
- **D-10 Rows outside the eight families.** The V-model row *Scenarios* goes to `shaping`
  (sign-off, `VAL`) and `software` (traceability, `VER`); *The iteration* goes to `shaping`
  (validation review). Contract and sales checks go to `generic-writing`. Checks of agent behaviour
  that apply to every family go to `references/cross-cutting.md`: the four-eyes rule, subagent
  reports, evidence before a claim (`verification-before-completion`) and `rulebook check`. This adds
  a ninth file; it does not add a family.
- **D-11 Definition of Done items** (`docs/development/README.md` §9):
  - the recorded failure case goes to `evidence/failure-case.md`: Q-2 of `harden-checks-and-tests`
    and the two conflicting homes;
  - a baseline run goes to `evidence/baseline.md`: the same three tasks with and without the skill,
    a Python module change, a LinkedIn post and a contract clause, each judged by whether success
    and failure were stated before the work;
  - the acceptance demo is mandatory at LARGE and goes to `evidence/acceptance.md`;
  - the skill is registered in the `served_by` of these use cases (`use_case_coverage` blocks
    otherwise), one per family:

    | Family | Use case |
    |---|---|
    | software, shaping | UC-W18 |
    | architecture | UC-W19 |
    | modelling | UC-W20 |
    | devops | UC-W6 |
    | ui | UC-W17 |
    | documentation, generic-writing | UC-W24 |
    | generic-writing (offers) | UC-W8 |
    | generic-writing (contracts) | UC-W16 |
  - the docs that point at the old V&V home are repointed;
  - the `criteria` key is documented for override authors (`docs/environment/navigator.md`,
    `docs/development/workflows.md`).

## Algorithm / approach

**Inventory (task 1.2).** Scope: the catalogue, meaning `skills/` and the repo's own checks (trigger
probes, agent Gherkin under `tests/features/`, the `make validate` gates). For each check record id,
what it checks, its owner file, its moment. The seed's table is the starting list. The inventory
describes; it judges nothing.

**Worked example (Quick Start, abridged).**

> **Input:** "write a LinkedIn post announcing our new SHACL service."
> 1. *Succeeds:* a data engineer who has never heard of us understands what the service does and
>    clicks through. *Fails:* it reads as an advert, or as jargon (`CLR`, `VAL`).
> 2. Matrix, `generic-writing.md`: `CLR` → cold reader (`technical-writing`); house rules →
>    `rulebook check` (`cross-cutting.md`); genre defects → `writing-antipatterns`; `VAL` → the
>    owner approves the stated success before drafting (`gap` → D).
> 3. Draft; run the checks; a failed criterion goes back to the draft, not to the post.

**Criteria example (epic-shaping, phase `decide`).**

```json
"criteria": {
  "succeeds": "every open question has the developer's answer in inputs/qa.md",
  "fails": "a DEC- or a no-go rests on an assumption nobody answered"
}
```

**Idempotency.** All edits are file edits under review; the test and the lint are pure reads;
re-running a task rewrites the same files with the same content.

### Anti-patterns

| Don't | Do instead | Why |
|---|---|---|
| Copy a technique's steps into a family file | Cite the owning skill and its section | Single source (DEC-5, DEC-8) |
| Fill a gap row with a technique invented here | Mark it `gap` and name the EPIC | No-gos: no new technique |
| Write paragraph-long criteria, or a criterion that restates a skill's rule | One line naming the evidence | Boilerplate; the workflow-definitions requirement |
| Require `criteria` in repo override files | Require it only in defaults | D-5: no repo breaks |
| Exact-string marker checks | Case-insensitive patterns with per-file allow-lists | A-3: exact strings pass when they should fail |
| Claim the triggers are proven by the static probes | Static probes plus one behavioural run | A-4: the probe report is advisory |

## Error matrix

| Failure mode | How it is detected | Expected handling |
|---|---|---|
| A check exists but is missing from the inventory | The stage checker reads the seed table and `skills/` against `inventory.md`; the L2 lens reviewer (`meaningfy-code-review`) | Add the `CHK-<n>` and its row before merge |
| A `CHK-<n>` cited nowhere or undefined; a family without a row for a question | `tests/test_test_strategy.py` | Fix the family file or the inventory |
| A moved fact still stated outside its allow-list | `tests/test_test_strategy.py` | Replace the text with a pointer, or cite the owner on the line |
| The new skill serves no use case | `use_case_coverage` in `make validate` (blocking) | Task 1.9 registers it |
| A pointer line pushes a skill over 650 lines | `skill_too_long` (blocking) | D-8: fold into the existing *Related* line |
| A default phase without `criteria`, or an empty string | `workflow_criteria` in `make validate` | Write the line; the lint names file and phase |
| A repo override phase with malformed `criteria` | Navigator `phaseError` | The band reports file and key, as any schema error |
| Navigator tests compare whole phase objects and break on `criteria` | The full mod test suite in task 2.1 | Update the fixtures in the same task |
| The mod copy under `bundles/` is stale after 2.1 | `bundle_gates` in `make validate` | `make bundles`, commit the result |
| `test-strategy` fires for "write a Gherkin scenario" or for a TDD request | Near-miss probes; the behavioural run | Sharpen the description; re-run; record in `evidence/triggers.md` |
| `epic-delivery` still fires for "what is validation" | Its near-miss probe; the behavioural run | Sharpen its description |

## Risks / Trade-offs

- **RISK-1** A spec delta conflicts with a requirement changed by the archived
  `navigator-follows-the-work`. Likelihood low, impact low. Mitigation: task 1.1 re-reads every delta
  against the live specs after the rebase.
- **RISK-2** The matrix goes stale as skills change. Likelihood high over time, impact medium.
  Mitigation: the id test catches dangling ids; a new check without a row is caught only by review.
  Accepted; B, C and D add rows as they go.
- **RISK-3** Criteria for 50 phases read as boilerplate. Mitigation: one line naming the evidence;
  the L2 lens reviewer (`meaningfy-code-review`) rejects generic lines ("the phase is done").
- **RISK-4** The external neighbours (superpowers TDD, `verification-before-completion`) cannot be
  named in the probe file, so a collision with them is found only by the behavioural run. Likelihood
  medium, impact medium. Mitigation: D-7's run includes them; the description routes "how to write
  the test" away explicitly.
- **Trade-off:** keeping the Python checklist in `cosmic-python` (DEC-8) leaves `cosmic-python`'s
  SKILL.md as it is; the checklist is a reference, so the body budget is unaffected.

## Attack record

A fresh subagent attacked the first draft on 2026-11-13. Findings and where they went:

| Id | Finding | Folded into |
|---|---|---|
| A-1 | Concurrent change already archived on `develop`; branch behind | Rebased; Context, D-9, RISK-1, task 1.1 |
| A-2 | `use_case_coverage` blocks a skill no use case serves | D-11, error matrix, task 1.9 |
| A-3 | Marker checks wrong both ways; `ownership.yaml` not used | D-7, anti-patterns, task 1.10; spec scenario fixed |
| A-4 | Trigger proof static only; external neighbours unprobeable | D-7, RISK-4, task 1.11 |
| A-5 | `epic-delivery` description and Boundary left behind | D-4, task 1.6 |
| A-6 | Pointer line breaks the 650-line cap | D-8, error matrix |
| A-7 | V-model rows and some owners fit no family; "validation owned by" dropped | D-2, D-10 |
| A-8 | DoD items missing (failure case, baseline, acceptance demo) | D-11, tasks 1.12, 2.7 |
| A-9 | Docs pointing at the old V&V home; `criteria` undocumented | D-11, tasks 1.13, 2.5 |
| A-10 | Inventory scope; no six-question assertion; id width | Algorithm, D-2, D-7 |
| A-11 | `Phase` type location, `make bundles` for the mod, `ALL_CHECKS`, `stage` facet, rule restatement in criteria | Context, D-5, D-6, D-9, error matrix |

**Clarity gate, run 1 (independent scorer): 8.6/10, FAIL.** Gaps folded in:

| Gap | Fix |
|---|---|
| A | Wrong task numbers in the error matrix → 2.1 |
| B | Behavioural run's pass bar → D-7, task 1.11 |
| C | TDD pattern missed the arrow form → D-7, with fixture cases |
| D | Baseline tasks and use cases unnamed → D-11, tasks 1.9, 1.12 |
| E | Id width; `cross-cutting.md` coverage rule; *Decided by* missing from the spec → D-1, D-2, D-7, spec |
| F | Unlinked references → links |
| G | Allow-list per file let prose pass → D-7, per line |

## Open Questions

None blocking. The `purpose` facet value (D-6) is a planning choice the developer may rename.
