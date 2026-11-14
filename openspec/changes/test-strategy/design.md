<!-- PLAN (design half), derived 2026-11-13 from proposal.md; attacked the same day by a fresh
     subagent (A-1..A-11, all folded in, see § Attack record). Clarity gate: 8.6, 8.7, then
     9.1/10 PASS on the third run, each by an independent scorer. Ready for delivery. -->

> Derives from: EPIC `test-strategy` ([`proposal.md`](proposal.md)), DEC-1..DEC-12.

## Context

Checks exist across the catalogue but no skill says which check answers which question for which
activity (`inputs/seed.md`, inventory sketch). Three facts sit in the wrong place or in two places:

- Verification and validation are defined in `epic-delivery`: its description and Boundary claim
  them, SKILL.md [§ Verification and validation](../../../skills/epic-delivery/SKILL.md#verification-and-validation)
  defines them, and [`references/verification-validation.md`](../../../skills/epic-delivery/references/verification-validation.md#the-v-model-table)
  holds the V-model table, already an activity × question matrix for seven artefacts. Three docs
  point at that reference: `docs/development/README.md` (line 93),
  `docs/practice/ai-coding/dod-quality-gates.md` (line 35) and
  `docs/practice/ai-coding/working-with-agents.md` (line 75).
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
  owner* (a skill; the V-model's "validation owned by" lands here) · *Tool* · *Moment* (workflow and
  phase, or "any") · *Decided by* (the agent stance, or a person; a `VAL` row is always a person:
  "the developer", or a named role such as the domain expert) · *Status* (`exists`,
  `gap` or `accepted`). A `gap` row names the EPIC expected to fill it (B, C or D) or "none yet". An
  `accepted` row is a gap the developer chose to leave open and states why; A writes none, C and D
  may (added 2026-11-13 after C's readiness check, after the gate). Every family file has at least
  one row for each of the six questions, in any status (DEC-6).
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
  Three pieces of text move, one pointer line replacing each: the definition in SKILL.md
  § *Verification and validation* (lines 160–164), the intro of the reference (lines 3–6, which
  restates it without the word "asks", so the one-home test does not catch it and the stage
  checker confirms it), and the V-model table. Its
  description and Boundary *Owns* drop "verification vs validation" and name "the acceptance demo and
  the validation review"; that description change ships with a positive and a near-miss probe.
- **D-5 Criteria field.** Each phase gains `criteria: {"succeeds": "<one line>", "fails": "<one
  line>"}`, both non-empty strings naming the evidence. Required in the nine **default** files (repo
  lint `workflow_criteria`, added to `ALL_CHECKS`); **optional in a repository's override file** (the
  navigator accepts it, validates its shape when present, never requires it). This narrows the
  proposal's *What Changes* bullet "BREAKING for repo workflow files": no repository file breaks. The
  navigator validates the field and does not display it. One shape rule in both places: an object
  with exactly the keys `succeeds` and `fails`, each a non-empty string; anything else is an error.
  The navigator change is two edits: the phase key whitelist and a shape check in `phaseError`
  (`mods/navigator/lib/workflow.ts:129`, modelled on `gateError`), and `criteria?` on the `Phase`
  type (`mods/navigator/types.d.ts:34`). Nothing else reads phase keys and no schema file exists.
  **Order matters:** the validator and type land before any default file gains `criteria`, because
  about ten mod tests load the real default files and expect no schema errors. The lint, like
  `workflow_lead`, skips an unreadable or wrongly shaped workflow file without crashing (the
  navigator reports those). A default file's criteria are repository-neutral: they name the kind of
  evidence ("the version file is bumped"), not a file only skillery has (`VERSION`). A criterion
  names evidence; it does not
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
    - `vv-definition`, pattern `(verification|validation) asks`: allowed only in
      `test-strategy/SKILL.md`.
    - `test-data`, pattern `polyfactory`: allowed anywhere in the checklist. In
      `pyproject.toml.tmpl`, `config-files.md` and `decisions.md` it is allowed only on a
      dependency line, meaning a line that also holds a version pin (`==`) or also names `pytest`
      (the dependency lists name both; today `pyproject.toml.tmpl:49`, `config-files.md:67`,
      `decisions.md:46`). In `testing-setup.md` it is allowed only on the pointer line to the
      checklist.
    - `tdd-loop`, pattern `red\W{0,5}green`: allowed only on a line naming
      `test-driven-development`. It catches "RED → GREEN → REFACTOR", "RED-GREEN loop" and
      "red/green". Today two hits are on no such line: `testing-setup.md:102` and
      `project-setup/assets/templates/project/CONTRIBUTING.md.tmpl:39`; task 1.7 fixes both.

    The test carries its own fixture cases: the arrow form, the hyphen form, "Validation asks", a
    version-pin line and the wrapped `config-files.md` line that pass, and a prose line that fails.

    `tests/ownership.yaml` gains two entries (DoD: ownership checked or updated): `vv-definition`,
    owner `test-strategy`, `claim_patterns: ["(verification|validation) asks"]`; and
    `test-matrix`, owner `test-strategy`, `claim_patterns: ["which check answers which question"]`.
    Its tripwire stays advisory and reads SKILL.md only. The existing `tdd-loop` tag there (owner
    `external:superpowers`) is kept as it is; the new test's `tdd-loop` check complements it by
    also scanning references and templates.
  - *Triggers:*
    - Static: probes in `tests/trigger_probes.yaml`:
      - positive: "which checks does this LinkedIn post need before I publish it";
      - positive: "how do we know this contract review succeeded or failed";
      - near-miss of `test-strategy`, expects `bdd-gherkin`: "write Gherkin scenarios for this
        acceptance criterion";
      - near-miss, expects `clarity-gate`: "score this spec before implementation";
      - near-miss, expects `technical-writing`: "run a cold reader on this how-to page";
      - near-miss, expects `meaningfy-code-review`: "review this change against the cosmic-python
        layers";
      - the `epic-delivery` pair of D-4: positive "run the acceptance demo for this EPIC";
        near-miss of `epic-delivery`, expects `test-strategy`: "what is the difference between
        verification and validation".
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
  Skills`: "Answers `<question ids>` in `test-strategy`'s matrix (`references/<family>.md`)." The
  verified inventory's owner list governs which skills get the line; the ten skills in the
  proposal's Impact are the expected minimum. Where a
  skill is within two lines of the 650-line cap (`architecture`: 649 body lines, 1 below the cap),
  the pointer is folded into its existing *Related* line, adding no line.
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
  - the recorded failure case goes to `evidence/failure-case.md`: the two conflicting fixture rules,
    and verification and validation being out of reach of work outside an epic delivery (Q-2 of
    `harden-checks-and-tests`, the method-less tester, is B's failure case);
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
  - the three docs that point at the old V&V home (Context) are repointed;
  - scenario sign-off: the developer signs off the spec scenarios of this change when accepting the
    gated PLAN, before task 1.1, recorded in `evidence/acceptance.md`;
  - no GitHub issue exists for this change; the CHANGELOG line and the PR name the EPIC
    (`test-strategy`) instead;
  - the `criteria` key is documented where workflow files are described:
    `docs/development/mods.md` § *Workflow files* (the schema description),
    `docs/development/workflows.md` § *Workflow files* (the lint, beside `workflow_lead`) and
    `docs/development/creating-skills.md` (the edits that adding a workflow takes).
    `docs/environment/navigator.md` is untouched, since the band does not show the criteria.

## Delivery decisions

Taken by the lead during delivery (2026-11-13); the developer may overrule any of them.

- **D-12 Inventory rulings**, after three verifiers checked the 108 draft rows against their
  sources (84 confirmed, 23 corrected, 1 not found; 40 further checks proposed):
  - The inventory is numbered afresh, consecutively, grouped by family; the draft's ids are not
    kept, since nothing published cites them.
  - Dropped: the draft's terminology and ontology practice row (guidance with no pass or fail
    step). Declared-only items are not listed either: the `hooks.yaml` git-hook intents that have
    no implementation in the tree.
  - Merged: the diagram checklists with the diagram review; the Gherkin quality checks with the
    use-case traceability bullet (one row, cited from `software` and `architecture`). Folded into
    an existing row rather than added: the clarity gate's self-assessment, the archive delta merge
    (into `openspec validate --strict`), the archetype gate profiles (into CI on each push).
  - Split: the sales rubrics from the rot and exit criteria; the narrow checks and task gate (with
    its re-run triggers) from the lead's full gates.
  - Every other proposed row that carries a `path:line` enters the inventory.
  - Families: vault checks and customer outcome reviews go to `generic-writing`, read as the
    owner's "generic tasks" family (seed); the repository's own gates (`make validate`, `make
    mods`, CI jobs, mods that deny a command) go to `cross-cutting.md`. D-10 named neither.
- **D-13 Two proofs deferred to `evaluate-catalogue`** (the developer, 2026-11-14: "defer to that
  epic that aims for evaluations, add these tasks there"). The behavioural trigger run (task 1.11,
  D-7) and the baseline (task 1.12, D-11) move to tasks 6b.1 and 6b.2 of
  [`evaluate-catalogue`](../evaluate-catalogue/tasks.md). Three baseline runs without the skill
  were stopped by the model's safeguards and were not retried. Until 6b.1 runs, the triggers rest
  on the eight static probes and RISK-4 stays open. The trigger set is ready in
  `tests/evals/triggers/test-strategy.json`.
- **D-14 Task 1.13, two docs keep their link.** Of the three docs D-11 names, only
  `docs/development/README.md` is repointed. `working-with-agents.md` speaks of the provisional
  steps, which stay in `epic-delivery`. `dod-quality-gates.md` is split: who owns each validation
  point is in `test-strategy`'s matrix, where the evidence goes stays with `epic-delivery`.
- **D-15 Findings of the stage 1 review** (five lenses and the adversarial tester, PR #218; no
  critical finding). Accepted, fixed before merge:
  - *Decided by* is defined in SKILL.md: it names who judges pass or fail, a stance or a person;
    accepting a miss on any question is a person's decision. Each cell holds the stance the
    stance table gives its question, or the person the owning skill names (the author for the
    infra reviewer's report, the Terraform plan and the four-eyes rule; the person on duty for
    break-glass). The L2 lens, use-case coverage and plan drift have no `VAL` row.
  - The stage checker found one check missing from the inventory, the vault move and delete
    check; it enters as CHK-144 (error matrix, first row).
  - The V-model row *EPIC and PLAN* (the developer agrees the why, the appetite and the success
    measure) is held by `test-strategy` itself, in `references/shaping.md`: no other skill states
    it, and this change rewrites no other skill's technique.
  - Inventory ids are stable from this release on: a new check takes the next free number and is
    never renumbered. The range sentence in `inventory.md` goes.
  - The matrix's *Technique owner* column governs the D-8 pointer lines (one owner per row); a
    co-owner named only in the inventory gets none. `tests/test_test_strategy.py` checks each
    pointer line against the matrix, so later EPICs cannot let them drift.
  - `epic-delivery`'s reference keeps one pointer and its own rule (who signs, and when); the
    sentence left without its table is reworded.
  - SKILL.md gains a legend for `gap → B`, `C`, `D` with the EPIC ids, an evidence-based worked
    example (the § *Worked example* above is superseded on its two criteria lines: "a cold reader
    given only the post says in one sentence what the service does" and "the reader cannot, or
    the antipattern check flags an advert"), and the clearer stance sentence. A check carries its
    inventory name in every file; the generic-writing `ADQ` gap names D; `/opsx:verify` is
    phrased neutrally; the vault final check has seventeen lines.
  - The test: word boundaries on the definition and loop patterns, line numbers that match an
    editor, exact failure messages, one case per rule; the adversarial tests are kept.
  - The three verification records under `inputs/` drop the absolute local path.

  Rejected, with the reason:
  - *Move the repository's own gates out of the installed skill* (L3): the gated PLAN sets the
    inventory's scope to `skills/` plus the repository's own checks (§ Algorithm). The developer
    may reopen it.
  - *Load the patterns from `ownership.yaml`* (L5): D-7 keeps the advisory tripwire and the
    blocking test as two complementary checks.
  - *Move the polyfactory example into `example-testing-patterns.md`* (L4): the D-7 allow-list
    names the checklist as the only home.
  - *Write the pointer path as `test-strategy/references/…`* (L4): D-8 fixes the form, and the
    line names the skill.
  - *Drop the repeated intro sentence of the family files; shorten the description* (L4, L5):
    cosmetic; the "Not for" list is what keeps the neighbours apart (RISK-4).
- **D-16 Criteria rulings** (task 2.3; three builders checked each draft line against the owning
  skill: 14 kept, 36 corrected or rewritten).
  - A criterion describes what its phase produces, not what its gate matches. In `architecting`
    each gate matches the next phase's artefact; the criteria follow the skill's order.
  - Four pairs rest on thin skill text and are the lead's wording: `release` *validate* and the
    "gates are red" half of *merge* (the release skill names no validate step; the workflow's
    own gate is the basis), `epic-shaping` *variants* (no skill names where the choice is
    recorded; `inputs/qa.md` follows the gate) and `modelling` *elicit* (the skill has no
    elicitation step; the terminology rule is the basis).
  - Whitespace-only text counts as empty in both validators (the navigator and the lint).
  - Found on the way and left alone (no change to a gate or a phase, proposal No-gos): the
    `architecting` gates look one phase ahead; `meaningfy-release` describes no validate step
    although its workflow has one; the release `back` gate matches only `develop` while the
    runbook says every long-lived line. They are follow-ups for the developer to rule on.
- **D-17 Stage 2 takes the small review set.** The stage adds 285 lines against `develop`
  (generated files included), under the 600-line limit of the LARGE set's `small_stage`, and the
  risk is low: the impact analysis of `phaseError` shows one direct caller and four impacted
  symbols, the lint is a new function, and the rest is data and prose. Two reviewers (L1 with
  L2; L3 with L4 and L5), the adversarial tester and the checker.
- **D-18 Findings of the stage 2 review** (two reviewers and the adversarial tester, PR #222; no
  critical finding). Accepted, fixed before merge:
  - `workflow_criteria` joins the lint group of the inventory (CHK-127), the row the error matrix
    asks for.
  - Three criteria: `release` *publish* drops the dry run (only the package path has one);
    `contract` *review* names the lawyer-review list without copying the skill's categories;
    `epic-shaping` *revise* says "passes the clarity gate" and leaves the threshold to
    `clarity-gate`.
  - The nine workflow files use one layout for the new key: `succeeds` and `fails` each on its
    own line.
  - `phaseError` checks `criteria` after `id`, `owner` and `expect`, with its optional neighbours
    `allow` and `gates`.
  - The lint skips a workflow file too deeply nested to parse instead of crashing.
  - Tests: the navigator gains the two-wrong-keys case; the override-file test uses the real
    override path; the wrong-shape test asserts its findings. The adversarial tests are kept.

  Rejected, with the reason:
  - *The same whitespace set in both validators*: they agree on every ordinary and Unicode space;
    they differ only on six control or format characters (U+FEFF, U+0085, U+001C to U+001F) that
    no author types into a criterion. The gap is known and left; the agreement test covers the
    rest of the case list, which is also the guard against the two rules drifting apart.
  - *A shared file-walk helper with `workflow_lead`*: six lines, and it would widen the change to
    a check this EPIC does not touch.
  - *A shared fixture file for both test suites*: the agreement test already runs both validators
    over one case list.

## Algorithm / approach

**Inventory (task 1.2).** Scope: the catalogue, meaning `skills/` and the repo's own checks (trigger
probes, agent Gherkin under `tests/features/`, the `make validate` gates). For each check record id,
what it checks, its owner file, its moment. The seed's table is the starting list, and a first survey is
in [`inputs/inventory-draft.md`](inputs/inventory-draft.md) (108 checks, drawn from heading and
keyword searches; some rows are guessed and say so). It is a secondary input: task 1.2 verifies each
row against its source before it enters the skill. The inventory describes; it judges nothing.

**Criteria (task 2.3).** A first draft for all 50 phases is in
[`inputs/criteria-draft.md`](inputs/criteria-draft.md), with a list of the phases its author was
unsure of. It is a secondary input: task 2.3 checks each line against the owning skill and the two
D-5 rules (names evidence, restates no rule, repository-neutral).

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
| A default file gains `criteria` before the validator accepts it | `make mods`: about ten tests that load the default files report "unknown key" | Keep the order 2.1 then 2.3; no test compares whole phase objects (checked 2026-11-13) |
| The `Phase` type change does not typecheck | The `tsc` step of `make mods` | Fix in task 2.1 |
| The lint crashes on a malformed workflow file | The parametrised wrong-shape negative test, copied from `workflow_lead`'s | Skip the file; the navigator reports it |
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

**Clarity gate, run 2 (a second independent scorer): 8.7/10, FAIL.** Gaps folded in: the
dependency-line rule rejected the wrapped `config-files.md` line (D-7); task 1.7 used the old TDD
pattern (tasks); three docs, not two, point at the old home (Context, task 1.13); `architecture` has
649 body lines, not 644 (D-8); the V&V marker missed "Validation asks" (D-7); sign-off and the issue
reference had no home (D-11, tasks 1.0, 1.13).

**Clarity gate, run 3 (a third independent scorer, on commit ef334a9): 9.1/10, PASS.** Its four
recommendations were folded in afterwards: both definition paragraphs named (D-4, task 1.6);
*Decided by* separated from *Technique owner* (D-2); the `ownership.yaml` patterns and the existing
`tdd-loop` tag (D-7); the probe phrases written out and the pointer-line set pinned (D-7, D-8).

## Open Questions

None blocking. The `purpose` facet value (D-6) is a planning choice the developer may rename.
