<!-- PLAN (design half), derived 2026-11-13 from proposal.md, before A and B are delivered.
     Written against A's gated PLAN and B's EPIC (B has no PLAN yet). Delivery does not start
     until the re-checks of § Re-check when A and B land are done. -->

> Derives from: EPIC `activity-test-profiles` ([`proposal.md`](proposal.md)), DEC-1..DEC-8; owner's
> answers Q-8..Q-11 in [`inputs/qa.md`](inputs/qa.md).

## Context

- **What C edits does not exist yet.** The family files
  `skills/test-strategy/references/<family>.md` and `inventory.md` are written by A's stage 1
  ([A's design](../test-strategy/design.md) D-1, D-2); the `quality/` folder, its manifests and the
  tester's report of stated properties are B's ([B's EPIC](../harden-checks-and-tests/proposal.md)
  DEC-4, DEC-6, DEC-9, DEC-12). A's PLAN is gated; B has only its EPIC. Every path this PLAN
  assumes about B is listed in § Re-check.
- **The gaps are provisional.** The only gap list today is the coarse one in
  [`../test-strategy/inputs/inventory-draft.md`](../test-strategy/inputs/inventory-draft.md)
  § Gaps. The real gap rows are the ones A's stage 1 writes with status `gap`.
- **One recorded failure is already known.** Issue
  [#143](https://github.com/meaningfy-ws/skillery/issues/143): a PLAN passed the gate at 9.25,
  stated the invariant "an entity has one label, held in two stores", covered the write paths
  rename and replace and missed create; the adversarial tester found it after the whole stage was
  built. It backs the shaping stage. No other family has a recorded failure yet.
- **Where the edited things live today.**
  - The interview: [`skills/epic-planning/SKILL.md`](../../../skills/epic-planning/SKILL.md) step 2
    (line 36); PLAN derivation: step 6 (line 60).
  - The PLAN template:
    [`skills/project-setup/assets/openspec-schema/meaningfy/templates/design.md`](../../../skills/project-setup/assets/openspec-schema/meaningfy/templates/design.md)
    and the section list in `schema.yaml` beside it (line 129). `make bundles` copies both to
    `openspec/schemas/meaningfy/` (`tools/bundle_gen/gen.py:42`).
  - The docs gate: `technical-writing`'s `verify` phase runs the project's own docs gate
    (`documentation.workflow.json`, gate `docs-gate`).
  - Stacks checks: [`stack-operations`](../../../skills/stack-operations/SKILL.md)
    (`references/stack-standard.md`) and
    [`infrastructure-operations`](../../../skills/infrastructure-operations/SKILL.md)
    (`references/repo-checks.md`; the runbook shape in `references/documentation.md` § Runbooks).
  - `architecture`'s SKILL.md has 649 body lines against a cap of 650 (A's D-8).
- **skillery is a public repository.** Evidence written here is public.

## Goals / Non-Goals

**Goals:** five stages, each closing one family group's `gap` rows as `exists` or `accepted`
(DEC-1, DEC-2); the invariants path from the interview to the tester (DEC-5); the three tool runs
(DEC-7); the four proofs of DEC-7; the Definition of Done of a skill change
(`docs/development/README.md` §9).

**Non-Goals:** the proposal's No-gos. In particular: no check without a failure id, no change in
the stacks repositories, no edit to the tester's brief, no new workflow gate (D-6), no
`clarity-gate` checklist item (D-3).

## Decisions

New choices made while planning. Settled ones are cited.

- **D-1 Invariants are recorded in a new `## Invariants` section of `design.md`** (confirms DEC-5,
  owner's answer Q-8), placed directly before `## Error matrix`. One table:

  | Column | Holds |
  |---|---|
  | *Id* | `INV-<n>`, unpadded |
  | *Invariant* | a statement a property test could state |
  | *Example* | one concrete case that holds and one that would break it |
  | *Write paths that can break it* | every path that touches it: create, update, replace, delete, bulk or import, internal |
  | *Test* | the test or scenario that proves it on each path, or "tester" when it is left to the adversarial tester |

  A PLAN with no invariant writes one line under the heading: "None: `<why>`". The section is
  never left empty and never removed. Rejected: a sub-table inside the error matrix (invariants and
  failure modes blur); spec deltas (B's brief reads the PLAN, and C may not edit that brief).
- **D-2 The template change is three edits and one render.** The heading and its comment in
  `templates/design.md`; one bullet in `schema.yaml`'s section list; the comment above
  `## Error matrix` gains "the adversarial tester takes these rows as its targets" (DEC-5); then
  `make bundles`. `epic-shape`'s requirement *The EPIC and PLAN templates speak plain language*
  says the templates' headings stay as they are; its delta now names `## Invariants` as the one
  added heading.
- **D-3 Issue #143 is taken as the table's two last columns only** (Q-9). `epic-planning` step 6
  asks for them when it derives the PLAN. The `clarity-gate` checklist item #143 also asks for
  stays with #143 as its own change: `clarity-gate` is outside the frozen EPIC's Impact. Task 2.7
  comments on #143 to say what C delivered and what is left.
- **D-4 The interview question** is added to `epic-planning` step 2, inside the test-scenario
  interview, in one sentence: which invariants must hold, each stated so that a property test
  could check it, each with an example; "none" is a valid answer and is recorded with its reason.
  The detail (the write-path list, the #143 worked example, what is not an invariant) goes to a new
  reference `skills/epic-planning/references/invariants.md`; SKILL.md gains at most four lines.
- **D-5 Survey record.** One file per family group, `evidence/survey-<group>.md`
  (`documentation`, `shaping`, `devops`, `architecture-modelling`, `ui`), with three tables:
  1. *Gap rows*, copied from the family file as A delivered it: question, row text.
  2. *Failures*: `F-<group>-<n>` · what happened · source (issue, PR, review finding, tool run,
     owner's words with the date) · question id · what would have caught it.
  3. *Decisions*, one line per gap row: `fill` with the failure ids and the one technique, or
     `accept` with the reason and the sources searched.

  A failure counts only if something real went wrong for a reader or user of the artefact and a
  source can be cited. A tool finding counts only when the developer marks it "would fix" in the
  survey round (D-7); a style preference is noise, not a failure.
- **D-6 No new workflow gate, and nothing blocking by default** (DEC-8). Each adopted check is
  written in its owning skill with three facts: when it runs, whether it blocks, what it costs (one
  line: the command and its typical run time on the proof tree). Defaults:

  | Check | Runs | Blocks |
  |---|---|---|
  | Vale | inside the project's docs gate, in `verify` | no; report in the PR description |
  | ls-lint, docs tree | inside the project's docs gate | yes, once adopted (a name either matches or not) |
  | ls-lint and checkmake, stacks | recommended in `repo-checks.md` as a PR check | not until the devops team adopts it (#216) |
  | Invariants section | PLAN derivation | yes: the section or its "None" line must exist |

  No `*.workflow.json` file changes. The stage states it if a survey shows a gate is needed, and
  that is a PLAN revision, not a silent addition.
- **D-7 One owner round per stage**, asked by the lead at the end of the survey, in one call. It
  holds: the general question "which failures have you seen in `<family>` work", with options
  derived from what the survey found; each tool finding to mark "would fix" or "noise"; and the
  fill-or-accept list to confirm. No check is written before this round is answered. The answers
  go to `inputs/qa.md`.
- **D-8 Tool runs happen in a trial folder, not in `quality/`** (DEC-7, Q-10).
  - Stage 1: Vale and a docs ls-lint draft run on skillery's own `docs/` tree.
  - Stage 3: an ls-lint draft and checkmake run on a read-only checkout of
    `infrastructure-stacks`.
  - The draft configurations and the raw output stay in the session's scratch folder. Only the
    scrubbed summary (D-10) goes to `evidence/toolrun-<tool>.md`: version, command, counts per
    rule, three example findings, run time.
  - A configuration moves into `quality/` only when the stage's decision table says `fill`.
  - skillery adopts none of the checks on itself (B's DEC-12); the run is a one-off report.
- **D-9 Vale styles are picked in stage 1 from the report** (Q-11). Candidates, run report-only:
  Microsoft, Google, write-good, proselint. For each the manifest candidate records source, pinned
  version, licence and why. The developer picks packages and rules in the stage's owner round; a
  rule with no "would fix" finding is not enabled. Vale's styles are fetched by `vale sync` at the
  pin; no style file is committed (No-gos; B's DEC-6).
- **D-10 Public evidence is scrubbed.** Nothing in `evidence/` names a host, an address, a client,
  a person or a secret path from the infra repositories or from client work. Tool findings are
  quoted with the path reduced to its shape (`<stack>/Makefile`), failures with the system named by
  its kind ("a reverse-proxy stack"). The stage checker reads every evidence file for this before
  the PR.
- **D-11 Paths assumed in `quality/`** until B's PLAN fixes them (§ Re-check, R-B1):

  | Path | Holds |
  |---|---|
  | `quality/vale/manifest.yaml` | external styles: source, pin, licence, why picked |
  | `quality/vale/vale.ini` | the picked styles and rules |
  | `quality/ls-lint/docs.yml` | docs folder and file names |
  | `quality/ls-lint/stacks.yml` | stacks repository layout |
  | `quality/checkmake/stacks.ini` | Makefile rules for stacks |
  | `quality/tests/` | one fixture pair per configuration: a bad case caught, a good case passing |
- **D-12 Showing the catch** (DEC-7, first proof), by kind of check:
  - a tool configuration: its fixture pair under `quality/tests/`, run by B's local `make validate`
    hook (B's DEC-12), written red first: the bad fixture is the failure it cites, reduced and
    scrubbed;
  - a technique in a skill: a worked example in the owning skill's reference that replays the
    cited failure, plus one line in `evidence/catch-<group>.md` naming failure id, check id and
    where the example is.
- **D-13 Matrix edits per stage.** For each `fill`: a new `CHK-<n>` in `inventory.md` (the next
  free number), and the gap row replaced by an `exists` row citing it. For each `accept`: the row's
  status becomes `accepted` and its *Check* cell holds the reason and the survey file. A check
  that answers a question which had no gap (Vale answers `VER`, not a documentation gap) is added
  as a new `exists` row; it closes no gap, and the family's real gap rows are still decided one by
  one. The owning skill's pointer line (A's D-8) gains the new question id if it is new there.
- **D-14 The closed-family test.** `tests/test_test_strategy.py` (A's) gains one list,
  `CLOSED_FAMILIES`, and one test: a family file in the list has no row with status `gap`, and
  every `accepted` row has a non-empty reason. Each stage adds its families to the list in the same
  PR that closes them. The test is written when stage 1 starts and is red for `documentation`
  until that stage closes its rows.
- **D-15 A stage that only accepts** ships: the survey file, the decision table, the rows as
  `accepted`, the family in `CLOSED_FAMILIES`, a CHANGELOG line, and the removal of that stage's
  conditional spec delta (D-16). It adds no skill text, no `quality/` file and no probe. Its PR is
  reviewed with the smallest review set (`epic-delivery`'s stage-size rule).
- **D-16 Conditional spec deltas.** The deltas for `documentation-workflow`, `operations-practice`
  and `quality-checks` are written now for the agreed candidates and are marked conditional in
  their header comment. A stage whose candidate ends `accept` deletes its delta, or the unused
  requirement in it, in its own PR. Stage 4 has no delta yet (the proposal names none): if its
  survey decides a `fill`, the stage writes the delta for the capability the check lands in, and
  the developer signs off its scenarios in that stage's owner round, before the check is written.
- **D-17 Stage 4 additions avoid `architecture`'s SKILL.md body.** Any text goes to a reference
  file of `architecture`; the pointer folds into an existing line (A's D-8).
- **D-18 The invariants trace** (DEC-7, third proof). After B's stage 2 delivers the tester's
  report of stated properties: take one PLAN that has an `## Invariants` table (this one), dispatch
  the tester with B's brief unchanged, and compare. **Proven** means every `INV-<n>` whose *Test*
  cell says "tester" appears among the properties the report states. The comparison goes to
  `evidence/invariants-trace.md`. If B's stage 2 has not landed when C's stage 2 is ready, stage 2
  ships without it and task 6.1 holds the EPIC open until it is done.
- **D-19 Descriptions do not change by default.** The new checks are steps inside triggers the
  skills already have. If a stage must change a description, it ships a positive and a near-miss
  probe with the before and after kept (`AGENTS.md`, *Proven triggers*).
- **D-20 Order and independence.** Stages run in DEC-1's order, one PR each into `develop`. A
  stage needs only its own preflight (§ Re-check): stages 4 and 5 need A alone; stages 1 and 3 need
  A and B's stage 1; stage 2 needs A, and B's stage 2 only for D-18.

## Algorithm / approach

**The stage loop**, the same for all five (DEC-2, DEC-3):

1. *Preflight.* Run the stage's re-checks (§ Re-check). A failed re-check stops the stage and is
   reported; it is not worked around.
2. *Gap rows.* Read the family file or files as delivered; copy every `gap` row into the survey
   file. A gap row naming D or "none yet" is left alone and noted.
3. *Survey.* Search, and record what was searched even when nothing is found:
   - skillery issues and PR review comments naming the family's skills (`gh issue list --search`,
     `gh pr list --search`);
   - `openspec/changes/archive/*/evidence/` and `inputs/`, for findings and deviations;
   - for DevOps: issues and review comments of `infrastructure-stacks` and `cloud-infrastructure`,
     read-only, and the question "has a runbook failed someone who followed it";
   - the tool run of the stage (D-8), stages 1 and 3 only.
4. *Owner round* (D-7). The developer adds failures, marks tool findings and confirms the
   decision table.
5. *Fill*, per `fill` line: the fixture or worked example first (D-12), then the check in the
   owning skill with its three facts (D-6), then the `quality/` file if it is a tool.
6. *Close.* Matrix edits (D-13); the family joins `CLOSED_FAMILIES` (D-14); the conditional delta
   is kept or deleted (D-16); CHANGELOG line; `make bundles`, `make skill-inventory`,
   `make validate`; the stage checker reads the evidence (D-10) and the decision table against the
   diff; one PR.

**Expected rows per stage** (provisional, from the draft inventory; the delivered files govern):

| Stage | Family | Gap questions expected | Candidate (DEC-4, DEC-5) | Likely outcome |
|---|---|---|---|---|
| 1 | documentation | `ROB`, `RSK`, thin `ADQ` | Vale (`VER`, `CLR`), ls-lint docs (`VER`) | new `exists` rows if findings are marked "would fix"; `ROB` and `RSK` accepted unless the survey finds a failure |
| 2 | shaping | `ROB`, thin `ADQ` | invariants (`ROB`, `ADQ`), backed by #143 | `ROB` filled; others by survey |
| 3 | devops | `ADQ`, `CLR`, thin `VAL` | ls-lint and checkmake stacks (`VER`); a runbook check (`CLR`) only if a runbook failure is recorded | by survey |
| 4 | architecture, modelling | `ADQ`, `ROB`, `RSK`; `CLR`, `RSK` | none agreed | by survey; accept-only is expected |
| 5 | ui | `VAL`, `ADQ`, `CLR`, `RSK` | none; pointers to the external design plugins in the `accepted` reasons | accept-only is expected |

**Worked example: a fill (stage 2, the one failure known today).**

> Gap row (`shaping.md`): `ROB` · gap · "nothing states which properties must hold" · C.
> Failure `F-shaping-1`: #143, the create path broke the one-label invariant; found after the
> stage was built; `ROB`; caught by listing every write path beside the invariant in the PLAN.
> Decision: `fill`, technique "invariants with write paths in the PLAN".
> Fill: `references/invariants.md` replays the case:
>
> | Id | Invariant | Example | Write paths that can break it | Test |
> |---|---|---|---|---|
> | INV-1 | An entity's label is the same in both stores | holds: rename updates both; breaks: create writes store A only | create, rename, replace, delete, bulk import | one scenario per path; property test by the tester |
>
> The example shows the row as the failed PLAN had it (two paths) and as the question forces it
> (five), with create named. Matrix: new `CHK-<n>` "Invariants and their write paths", owner
> `epic-planning`, moment "epic-shaping: decide, design", decided by the adversary stance;
> `shaping.md`'s `ROB` gap row becomes `exists`.

**Worked example: an accept (stage 5).**

> Gap row (`ui.md`): `CLR` · gap · "nothing asks whether a user understands the screen" · C.
> Survey: no skillery issue, no archived finding, owner round: none seen.
> Decision: `accept`. Row: `CLR` · accepted · "No recorded failure as of `<date>`
> (`evidence/survey-ui.md`). The external design plugin's critique and UX-copy skills cover this
> when a project installs them." No skill edited.

**Idempotency.** Every step is a file edit under review or a read-only run. Re-running a survey
appends failures under new ids and never renumbers. Re-running a tool run overwrites its summary.
A stage's PR can be rebuilt from its survey file and decision table alone.

### Anti-patterns

| Don't | Do instead | Why |
|---|---|---|
| Add a check because the candidate was agreed | Add it only with a failure id in the decision table | DEC-2; candidates are "subject to step 1" |
| Count every Vale finding as a failure | Count the ones the developer marks "would fix" | D-5; rabbit-hole *Vale noise* |
| Write "the system stays consistent" as an invariant | State what a property test could check, with an example and the write paths | Rabbit-hole *Invariants as boilerplate*; #143 |
| Edit the tester's brief so it reads the table | Leave the brief; it reads the PLAN as written | DEC-5; B's No-gos |
| Commit a Vale style or copy its rule text | Pin it in the manifest; `vale sync` fetches it | No-gos; B's DEC-6 |
| Open a PR or commit in a stacks repository | Run read-only; record scrubbed counts; #216 carries adoption | No-gos |
| Paste raw tool output or a host name into `evidence/` | The scrubbed summary of D-8 | D-10; the repository is public |
| Leave a gap row as `gap` "for later" | `accepted` with the reason, or `fill` | DEC-2, DEC-7 |
| Restate the technique in the family file | Cite the owning skill and section | A's DEC-5, DEC-8 |
| Work around a missing piece of A or B | Stop the stage at preflight and report | § Re-check |

## Invariants

| Id | Invariant | Example | Write paths that can break it | Test |
|---|---|---|---|---|
| INV-1 | A family in `CLOSED_FAMILIES` has no `gap` row, and each `accepted` row has a reason | holds: `ui.md` with six rows, all `exists` or `accepted` with text; breaks: a later PR adds a `gap` row to `documentation.md` | a stage's close step; any later edit of a family file (D's rows, a new check); A regenerating a family file | `tests/test_test_strategy.py`, the D-14 test |
| INV-2 | Every check C adds names a failure id that exists in a survey file | holds: `CHK-<n>` ← `F-shaping-1` ← #143; breaks: Vale adopted with an empty failure table | a stage's fill step; a fix-up commit after review that adds a rule | the stage checker reads the decision table against the diff (no automatic test: the survey lives in the change folder and moves at archive) |
| INV-3 | `quality/vale/` holds no style rule file | holds: `manifest.yaml`, `vale.ini`; breaks: a `styles/Microsoft/*.yml` committed after `vale sync` | stage 1's fill; a fixture that copies a rule; a contributor committing the synced folder | a test in `quality/tests/` that fails on any file under `quality/vale/` other than the two named and on a missing ignore entry for the synced folder |
| INV-4 | No evidence file names a host, address, client or person from the infra repositories | holds: "`<stack>/Makefile`: 3 findings of rule `minphony`"; breaks: a pasted finding line with a real path | the tool-run summary; a survey failure row quoting an infra issue; the owner round's answers copied to `inputs/qa.md` | the stage checker reads each evidence and input file before the PR (D-10); tester: none, no code |
| INV-5 | A PLAN's `## Invariants` section is never empty | holds: a table, or "None: `<why>`"; breaks: the heading with nothing under it | a new PLAN derived from the template; a PLAN revised after the gate | `epic-planning` step 6 states the rule; the clarity gate's scorer reads the section (no lint: C adds none without a failure) |

## Error matrix

The adversarial tester takes these rows as its targets.

| Failure mode | How it is detected | Expected handling |
|---|---|---|
| A stage starts before A's family files exist, or they differ from A's D-2 columns | Preflight R-A1, R-A2 | Stop the stage; report; revise this PLAN if the shape changed |
| `quality/` is missing or laid out differently from D-11 | Preflight R-B1 | Stop stages 1 and 3; adapt D-11 to B's layout as a PLAN revision |
| A survey finds no failure | The failures table is empty and lists the sources searched | D-15: an accept-only stage; valid |
| A survey finds a failure that fits no single technique, or one outside the family | The decision line cannot name one technique | Record it as an issue; the row is `accepted` with the issue number as reason |
| A fill grows past one technique per gap, or a check is proposed with no failure id | Stage checker, INV-2; the lead's diff reading | Cut it; the proposal's overrun rule: stop and accept the gap |
| The developer marks no Vale finding "would fix" | The owner round's answers | Vale is not adopted; its rows are not added; the `quality-checks` and `documentation-workflow` Vale requirements are deleted (D-16); the run summary stays as evidence; DEC-7's fourth proof still holds |
| Vale or a style package is unavailable, relicensed or changed at the pin | The run fails, or the manifest check at a pin bump | Drop that package from the candidates and record why; never vendor it |
| A style file or raw output is committed | INV-3's test; the stage checker (INV-4) | Remove it; add the ignore entry |
| No read access to `infrastructure-stacks` in the delivery session | The checkout fails in stage 3's preflight | Ask the developer for a checkout; without one, stage 3 waits and stages 4 and 5 may go first (D-20) |
| A tool run changes a file in the stacks checkout | `git status` there after the run, which must be clean | Discard the checkout; re-run with the tools' fix modes off |
| The template heading breaks a test or the schema copy | `tests/test_bundle_gen.py`, `bundle_gates` in `make validate` | `make bundles`; commit the result |
| An existing PLAN in `openspec/changes/` has no `## Invariants` | Nothing checks it, by design | Existing PLANs are not migrated; the section applies to PLANs derived after stage 2 |
| The `epic-shape` delta conflicts with the live requirement after another change edits it | `openspec validate activity-test-profiles --strict`; preflight R-S1 | Re-write the MODIFIED block from the live text |
| A family file gains a `gap` row after its stage closed | The D-14 test | The author fills or accepts it in the same PR |
| A new pointer or section pushes `architecture` over 650 body lines | `skill_too_long` (blocking) | D-17: a reference file |
| B's tester report does not list properties in a comparable form | Task 2.8 cannot match `INV-` ids | Report to B's lead; D-18 waits; task 6.1 holds the EPIC open |
| Evidence names a host or client | Stage checker (INV-4) | Scrub before the PR; if already pushed, rewrite the file and tell the developer |
| A description changes without probes | The stage checker; the DoD list | Add the probe pair, or revert the description (D-19) |

## Risks / Trade-offs

- **RISK-1** A or B lands differently from what this PLAN assumes (B has no PLAN yet).
  Likelihood high for B, medium for A; impact medium. Mitigation: § Re-check, run as each stage's
  preflight; a mismatch is a PLAN revision before the stage, never a workaround.
- **RISK-2** The surveys find almost nothing, and four of five stages only accept. Likelihood
  medium; impact low. Accepted: that is the EPIC's stated valid outcome (D-15), and the matrix then
  says honestly what nobody has been hurt by yet.
- **RISK-3** New checks slow daily work (DEC-8). Likelihood medium; impact medium. Mitigation: D-6,
  nothing blocks by default and each check states its cost.
- **RISK-4** External styles or tools change, vanish or relicense (DEC-8). Likelihood low per year;
  impact low. Mitigation: pins and licences in the manifest; a bump is re-approved (B's DEC-6).
- **RISK-5** Infra or client detail leaks into this public repository through evidence. Likelihood
  medium without a rule; impact high. Mitigation: D-8 (raw output stays in scratch), D-10, INV-4.
- **RISK-6** The invariants section becomes boilerplate ("None" everywhere). Likelihood medium;
  impact medium. Mitigation: "None" needs a reason the gate's scorer reads; the reference shows
  what a real one looks like. Accepted beyond that; a lint waits for a recorded failure.
- **RISK-7** The owner rounds make the developer the bottleneck of every stage. Likelihood medium;
  impact low. Mitigation: one round per stage, answerable in minutes; stages 4 and 5 can be
  surveyed in parallel and asked together.
- **Trade-off:** tool findings on skillery's own `docs/` are used as failure evidence although
  skillery adopts no check on itself. The run is a report; fixing those docs is a separate PR if
  the developer wants it.

## Re-check when A and B land

Each line is a preflight task of the stages named. "Holds" means this PLAN needs no change.

| Id | Re-check | Against | Stages |
|---|---|---|---|
| R-A1 | The six family files exist under `skills/test-strategy/references/` with A's D-2 columns and the statuses `exists`, `gap`, `accepted` | A's stage 1, merged | all |
| R-A2 | `inventory.md` uses `CHK-<n>` ids and `tests/test_test_strategy.py` exists and is green | A's stage 1 | all |
| R-A3 | Which gap rows name C; replace the *Expected rows* table's guesses in the survey file | the delivered family files | all |
| R-A4 | The pointer-line wording in the owning skills (A's D-8), so new question ids are added in the same form | A's stage 1 | 1, 2, 3, 4 |
| R-A5 | A's stage 2 `criteria` on `documentation`, `epic-shaping` and `devops` phases: C changes no workflow file, so nothing to edit; confirm no criterion contradicts D-6 | A's stage 2 | 1, 2, 3 |
| R-B1 | `quality/` exists; its layout, manifest format and test location match D-11, or D-11 is revised | B's PLAN and stage 1 | 1, 3 |
| R-B2 | How `quality/`'s tests run in `make validate` and skip in CI (B's DEC-12), so D-12's fixtures and INV-3's test sit in the right place | B's stage 1 | 1, 3 |
| R-B3 | B's ls-lint and checkmake configurations for scaffolded projects: C's docs and stacks variants are separate files and repeat none of their rules | B's stage 1 | 1, 3 |
| R-B4 | The tester's report lists the properties it stated, and the brief still says it takes them from the PLAN as written | B's stage 2 | 2 (D-18), 6 |
| R-B5 | `governance.md` names `quality/` as an artifact type and the top-level folder check allows it | B's stage 1 | 1, 3 |
| R-S1 | The live `epic-shape`, `documentation-workflow` and `operations-practice` requirements still read as the deltas assume | `openspec/specs/` on `develop` | 1, 2, 3 |
| R-S2 | The `test-strategy` and `quality-checks` capabilities exist in `openspec/specs/` or in their unarchived changes, so C's deltas have a base | A's and B's archive state | 1 |

## Attack record

Filled after the attack and the gate (see below in this file's history).

## Open Questions

None blocking. Stage 4's capability is open by design (D-16).
