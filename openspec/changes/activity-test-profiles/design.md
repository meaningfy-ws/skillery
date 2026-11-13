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
    (line 36); PLAN derivation: step 6 (line 59).
  - The tester's brief:
    [`team-and-briefs.md`](../../../skills/epic-delivery/references/team-and-briefs.md) § Adversarial
    tester (lines 68–73). Its **Read** list today is "the stage's tasks, scenarios and diff range":
    it does not name `design.md`. B changes this brief; C may not.
  - The PLAN template:
    [`skills/project-setup/assets/openspec-schema/meaningfy/templates/design.md`](../../../skills/project-setup/assets/openspec-schema/meaningfy/templates/design.md)
    and the section list in `schema.yaml` beside it (line 129). `make bundles` copies both to
    `openspec/schemas/meaningfy/` (`tools/bundle_gen/gen.py:42`).
  - The docs gate: `technical-writing`'s `verify` phase runs the snippets and the project's own
    docs gate. The gate is one command, `make build-docs`
    (`skills/technical-writing/assets/workflows/documentation.workflow.json:13`), a target
    `project-setup` scaffolds; C edits neither.
  - External tools the catalogue relies on are registered in `dependencies.yaml` (kind
    `cli-tool`; live spec `external-dependency-register`). Vale, ls-lint and checkmake are not
    there, and none is installed on the owner's machine today.
  - `technical-writing` has no `references/` folder; `repo-checks.md` is a list of *required*
    checks under a MUST; neither devops skill states a repository layout or a Makefile rule today.
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
  | *Test* | the test or scenario that proves it on each path; the cell starts with the exact word `tester` when the invariant is left to the adversarial tester |

  A PLAN with no invariant writes one line under the heading: "None: `<why>`". The section is
  never left empty and never removed. `epic-planning` step 6 states this rule; nothing mechanical
  enforces it (D-3). Rejected: a sub-table inside the error matrix (invariants and
  failure modes blur); spec deltas (B's brief reads the PLAN, and C may not edit that brief).
- **D-2 The template change is three edits and one render.** The heading and its comment in
  `templates/design.md`; one bullet in `schema.yaml`'s section list; the comment under the
  `## Error matrix` heading gains "the adversarial tester takes these rows as its targets" (DEC-5); then
  `make bundles`. `epic-shape`'s requirement *The EPIC and PLAN templates speak plain language*
  says the templates' headings stay as they are; its delta now names `## Invariants` as the one
  added heading.
- **D-3 Issue #143 is taken as the table's two last columns only** (Q-9). `epic-planning` step 6
  asks for them when it derives the PLAN. The `clarity-gate` checklist item #143 also asks for
  stays with #143 as its own change: `clarity-gate` is outside the frozen EPIC's Impact. So an
  empty or missing section is caught only by whoever derives or scores the PLAN; that gap is
  accepted here and named in #143. Task 2.7 comments on #143 to say what C delivered and what is
  left.
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
  3. *Decisions*, one line per gap row, plus one line in the same form per agreed candidate that
     has no gap row (Vale and the ls-lint and checkmake candidates answer `VER`, which may be no
     gap): `fill` with the failure ids and the one technique, or `accept` with the reason and the
     sources searched.

  A failure counts only if something real went wrong for a reader or user of the artefact and a
  source can be cited. A tool finding counts only when the developer marks its rule "would fix"
  in the owner round (D-7); a style preference is noise, not a failure.

  Units, for a tool with several rules: each rule marked "would fix" is one failure row
  `F-<group>-<n>` (source: the tool run, with the rule's name and count). One tool configuration
  is one technique, one decision line and one `CHK-<n>`, whatever the number of rules it enables;
  its decision line lists the failure ids of all its enabled rules.
- **D-6 No new workflow gate, and nothing blocking by default** (DEC-8). Each adopted check is
  written in its owning skill with three facts: when it runs, whether it blocks, what it costs (one
  line: the command and its typical run time on the proof tree). Defaults:

  | Check | Runs | Blocks |
  |---|---|---|
  | Vale | a step of `verify`, beside the docs gate, run by the writer from the fetched `quality/` | no; report in the PR description |
  | ls-lint, docs tree | the same step | the writer fixes a broken name before the PR; no gate enforces it |
  | ls-lint, stacks | on each pull request of a stacks repository, once that repository adopts it; written in `stack-operations`, `references/stack-standard.md`, a subsection *Recommended checks* | not until the devops team adopts it; the subsection points to #216 |
  | checkmake, stacks | the same moment; written in `infrastructure-operations`, `references/repo-checks.md`, a subsection *Recommended checks*, outside the file's MUST | the same, with the same pointer |
  | Invariants section | PLAN derivation (`epic-planning` step 6) | required by the skill's rule; not mechanically checked (D-3) |

  Both documentation tools run only in a project that has fetched `quality/` through B's `make`
  target (B's DEC-5); the commands are written in `technical-writing` against the fetched folder.
  In a project that has not fetched it, the writer skips the step and says so in one line of the
  PR description.
  C does not edit `make build-docs`, `project-setup`'s Makefile or any `*.workflow.json` file:
  `project-setup` is outside the EPIC's Impact. Wiring the tools into a project's docs gate is
  left to the project, and is noted as a follow-up in the stage's PR if the developer wants it.
  A stage states it if a survey shows a gate is needed; that is a PLAN revision, not a silent
  addition.

  A stacks check is written in two parts, in this order: the rule it encodes and why, in the
  owning skill (B's DEC-4: `quality/` holds only the executable file); then the configuration.
- **D-7 One owner round per stage**, asked by the lead at the end of the survey. No check is
  written before it is answered; the answers go to `inputs/qa.md`. The round is up to three
  question calls in sequence, because later questions depend on earlier answers (a call holds at
  most four questions, each with at most four options):

  | Call | Asked | In which stages |
  |---|---|---|
  | 1 | "Which failures have you seen in `<family>` work", with options derived from what the survey found; any gap row naming B or D (decide here, or move it) | all |
  | 2 | Rule marking, below | 1 and 3 (the stages with a tool run) |
  | 3 | The decision table built from calls 1 and 2, to confirm; the text of any conditional scenario rewritten from the recorded failure, or of a new delta, to sign off (D-16) | all |

  Rule marking: the unit is the rule, not the single finding. Each rule is shown with its count
  and three example findings. At most eight rules per tool are put to the developer: the eight
  with the most findings after the lead has dropped rules whose three examples are all house terms
  or code identifiers. They are asked as two multi-select questions of four rules each per tool
  ("which of these would you fix"); a rule not selected is "noise". Rules not shown default to
  "noise" and are listed in the tool-run summary, so the developer can pull one back. Two tools
  make four questions: one call.
- **D-8 Tool runs happen in a trial folder, not in `quality/`** (DEC-7, Q-10).
  - Stage 1: Vale and a docs ls-lint draft run on skillery's own `docs/` tree.
  - Stage 3: an ls-lint draft and checkmake run on a read-only checkout of
    `infrastructure-stacks` (Q-10). If it holds no Makefile, the lead asks the developer before
    the run, in one question: run checkmake on `cloud-infrastructure` instead (Q-10 did not choose
    that repository), or record "run, nothing to check".
  - What each draft holds, so the lead invents no convention:

    | Run | Draft |
    |---|---|
    | Vale | the four candidate packages of D-9, every rule at its default level |
    | ls-lint, docs | kebab-case for directories and for `.md` and `.adoc` files under `docs/`; `README.md` and `CHANGELOG.md` exempt |
    | ls-lint, stacks | the naming form most existing stack folders and their files already follow, counted in the checkout and stated in the summary; the findings are the ones that depart from it |
    | checkmake | its default rule set |
  - Each tool is installed as its latest stable release binary on the day of the run, into the
    scratch folder; the version goes into the summary and becomes the pin if the tool is adopted.
  - The draft configurations and the raw output stay in the session's scratch folder. Only the
    scrubbed summary (D-10) goes to `evidence/toolrun-<tool>.md`: version, command, counts per
    rule, three example findings, run time.
  - A configuration moves into `quality/` only when the stage's decision table says `fill`.
  - skillery adopts none of the checks on itself (B's DEC-12); the run is a one-off report.
- **D-9 Vale styles are picked in stage 1 from the report** (Q-11). Candidates, run report-only:
  Microsoft, Google, write-good, proselint. For each the manifest candidate records source, pinned
  version, licence and why. The developer picks packages and rules in the stage's owner round; a
  rule not marked "would fix" is not enabled. Vale's styles are fetched by `vale sync`; no style
  file is committed (No-gos; B's DEC-6). A pin is a versioned archive address in `vale.ini`'s
  `Packages` line (the package's release archive at one tag), never a bare package name, which
  fetches the latest.

  Vale's own layout constrains D-11, and the planner did not run Vale: the first step of task 1.3
  confirms three facts against the pinned Vale's documentation and a trial run, and a difference
  is a PLAN revision of D-9, D-11 and INV-3 before task 1.5. The facts assumed: `vale sync`
  writes each package to `<StylesPath>/<Package>/`; word lists are read only from
  `<StylesPath>/config/vocabularies/<Name>/accept.txt` and `reject.txt`; `Packages` accepts an
  archive address.
- **D-10 Public evidence is scrubbed.** Nothing in `evidence/` names a host, an address, a client,
  a person or a secret path from the infra repositories or from client work. Tool findings are
  quoted with the path reduced to its shape (`<stack>/Makefile`), failures with the system named by
  its kind ("a reverse-proxy stack"). The stage checker reads every evidence file for this before
  the PR.
- **D-11 Paths assumed in `quality/`** until B's PLAN fixes them (§ Re-check, R-B1):

  | Path | Holds |
  |---|---|
  | `quality/vale/manifest.yaml` | external styles: source, pin, licence, why picked |
  | `quality/vale/vale.ini` | `StylesPath = styles`, the pinned `Packages`, the picked styles and rules |
  | `quality/vale/styles/config/vocabularies/Meaningfy/` | `accept.txt` and `reject.txt`, house terms, the answer to noise; a word list is not a rule; committed |
  | `quality/vale/styles/<Package>/` | written by `vale sync`; never committed; ignored by the entry `quality/vale/styles/*` with the exception `!quality/vale/styles/config/` in the root `.gitignore` |
  | `quality/ls-lint/docs.yml` | docs folder and file names |
  | `quality/ls-lint/stacks.yml` | stacks repository layout |
  | `quality/checkmake/stacks.ini` | Makefile rules for stacks |
  | `quality/tests/` | one fixture pair per configuration: a bad case caught, a good case passing |
- **D-12 Showing the catch** (DEC-7, first proof), by kind of check:
  - a tool configuration: its fixture pair under `quality/tests/`, run by B's local `make validate`
    hook (B's DEC-12), written red first. The bad fixture holds one case per enabled rule, each
    the failure that rule cites, reduced and scrubbed, and the test asserts that every enabled
    rule fires on its case; the good fixture passes all of them. Vale's fixture test needs the
    styles synced, so the delivery session needs network for `vale sync`. Elsewhere a fixture test skips with a message when its tool, or Vale's synced
    styles, are missing (B's DEC-12); in the delivery session it must run: the pinned tool from
    the tool run is put on `PATH`, and a skipped test is not proof. One meta-test fails when a
    configuration file of D-11 has no fixture pair, and when a manifest entry lacks its source,
    pin, licence or reason; if B ships no meta-test to extend (R-B2), C writes it;
  - a technique in a skill: a worked example in a reference file of the owning skill that replays
    the cited failure.

  Either way, one line per fill goes to `evidence/catch-<group>.md`: failure id, check id, where
  the fixture or example is and, for a fixture, the test id with its red result before the
  configuration and its passed (not skipped) result after. The stage checker rejects a catch line
  whose test was skipped. An accept-only stage writes no catch file.
- **D-13 Matrix edits per stage.** For each `fill`: a new `CHK-<n>` in `inventory.md` (the next
  free number at the time of the stage's last rebase), and the gap row replaced by an `exists` row
  citing it. For each `accept`: the row's status becomes `accepted` and its *Check* cell holds a
  self-contained reason: the date, the sources searched and the change id as plain text, with no
  path or link into `openspec/` (a skill file may not point there, and the folder moves at
  archive). A check
  that answers a question which had no gap (Vale answers `VER`, not a documentation gap) is added
  as a new `exists` row; it closes no gap, and the family's real gap rows are still decided one by
  one. The owning skill's pointer line (A's D-8) gains the new question id if it is new there.

  The two row forms, in A's seven columns (*Question* · *Check* · *Technique owner* · *Tool* ·
  *Moment* · *Decided by* · *Status*):

  | Question | Check | Technique owner | Tool | Moment | Decided by | Status |
  |---|---|---|---|---|---|---|
  | `ROB` | `CHK-<n>` Invariants and their write paths | `epic-planning` | none | epic-shaping: decide, design | adversary | `exists` |
  | `CLR` | No recorded failure as of `<date>`; searched: `<sources>` (change activity-test-profiles). `<what covers it meanwhile, if anything>` | none | none | none | the developer | `accepted` |

  An `accepted` row keeps its question and writes "none" in the three middle columns; *Decided by*
  is the developer, who confirmed the acceptance.
- **D-14 The closed-family test.** `tests/test_test_strategy.py` (A's) gains one list,
  `CLOSED_FAMILIES`, and one test: a family file in the list has no row with status `gap`, and
  every `accepted` row has a non-empty reason. Each stage adds its families to the list in the same
  PR that closes them. The test is added with an empty list and its own fixture cases, so it is
  green from the start. Inside every stage's branch, accept-only or not, the close step first adds
  the family to the list, which is red, and then edits the rows until it is green. Section 0's tasks ride in the PR of the first stage delivered.
- **D-15 A stage that only accepts** ships: the survey file, the decision table, the rows as
  `accepted`, the family in `CLOSED_FAMILIES`, a CHANGELOG line, and the removal of that stage's
  conditional spec delta (D-16). It adds no skill text, no `quality/` file and no probe. Its PR is
  reviewed with the small review set (the small-stage rule:
  [`stage-loop.md`](../../../skills/epic-delivery/references/stage-loop.md) line 43, which points
  to the review sets in `epic-delivery`'s SKILL.md).
- **D-16 Conditional spec deltas.** The deltas for `documentation-workflow`, `operations-practice`
  and `quality-checks` are written now for the agreed candidates and are marked conditional in
  their header comment. Their scenarios name cases guessed before any survey (a docs file named
  with spaces, a stack folder not in kebab-case, a `deploy` target not declared phony). A
  stage whose candidate ends `accept` deletes its delta, or the unused requirement in it, in its
  own PR. A stage that fills from a different failure than the guessed one rewrites the scenario
  from the recorded failure, and the developer signs off the new text in that stage's owner
  round, before the check is written; a scenario the tool cannot express (ls-lint checks names,
  not where a file sits) is rewritten or dropped the same way. Stage 4 has no delta yet (the
  proposal names none): if its survey decides a `fill`, the lead drafts the delta for the
  capability the check lands in (`modelling-conventions` or `linkml-engineering`) and the
  developer signs off its scenarios in call 3 of that stage's owner round, before the check is
  written. A fill that lands in a skill with no capability in `openspec/specs/` (`architecture`,
  `conceptual-modelling`) writes no delta, as the proposal allows ("or none"): call 3 shows the
  developer the worked example's outline instead, and C creates no capability.
- **D-17 Stage 4 additions avoid `architecture`'s SKILL.md body.** Any text goes to a reference
  file of `architecture`; the pointer folds into an existing line (A's D-8).
- **D-18 The invariants trace** (DEC-7, third proof). It needs B's stage 2: the tester's report of
  stated properties, and a brief whose Read list names `design.md` § Invariants and § Error matrix
  (R-B4). The trace is run on the first PLAN that is derived after C's stage 2, changes code, and
  has at least one invariant whose *Test* cell starts with `tester`. This PLAN does not qualify:
  it ships no code and leaves no invariant to the tester. C's lead dispatches nothing: it reads
  the tester's report that the qualifying EPIC's own delivery produced, with B's brief unchanged. **Proven** means at least one such invariant exists and every one of them appears,
  by its `INV-<n>` id or its statement, among the properties the report states. The comparison
  goes to `evidence/invariants-trace.md`. Stage 2 ships without it when no such PLAN exists yet;
  task 6.1 holds the EPIC open. If none has appeared when the other four stages are closed, the
  developer decides: wait, or run the trace on a small sample PLAN written for it.
- **D-19 Descriptions do not change by default.** The new checks are steps inside triggers the
  skills already have. If a stage must change a description, it ships a positive and a near-miss
  probe with the before and after kept (`AGENTS.md`, *Proven triggers*).
- **D-20 Order and independence.** Stages run in DEC-1's order, one PR each into `develop`. "A is
  delivered" means A's stage 1 is merged (the family files); A's stage 2 matters only for R-A5.
  A stage needs its own preflight (§ Re-check): stages 1 and 3 need B's stage 1; stage 2 needs B's
  stage 2 for the brief (R-B4), not only for the trace; stages 4 and 5 need A alone. The proposal's
  Impact says "after A and B", and that is the default. A later stage overtakes an earlier one only
  when the earlier is blocked at preflight by B and the developer agrees; the deviation from
  DEC-1's order is recorded in `evidence/preflight.md`.
- **D-21 Definition of Done items** (`docs/development/README.md` §9) beyond the stage loop:
  - *Baseline, stage 2 only* (the invariants question is a discipline rule): a small sample EPIC
    that keeps one label in two stores, with create, rename and replace operations, is written
    once to `evidence/baseline-shaping-epic.md` (about twenty lines, no mention of invariants or
    write paths). Its PLAN is derived twice from that same file, once with today's `epic-planning`
    and once with the changed one, each by a fresh subagent; `evidence/baseline-shaping.md`
    records for each run whether the create path is named. Tool checks need no baseline; their fixture pair is the test.
  - *Issue referenced:* stage 1's PR names #212, stage 2's #143, stage 3's #216; stages 4 and 5
    name the EPIC, as A's D-11 does.
  - *External tools:* each adopted tool gets an entry in `dependencies.yaml` (kind `cli-tool`),
    unless B has already added it (R-B3); then `make skill-inventory`.
  - *Ownership:* `tests/ownership.yaml` gains `plan-invariants`, owner `epic-planning`,
    `claim_patterns: ["invariants? must hold"]`.
  - *Bodies stay CLI-agnostic:* the new text names no `/opsx:` form and no `.claude/` path.
  - *User-facing docs:* a CHANGELOG line per stage, written for the installer; no README row (no
    new entry point).
  - *Scenario sign-off:* the developer signs off this change's scenarios when accepting the gated
    PLAN (task 0.1); a scenario rewritten or added later is signed off in its stage's owner round
    (D-16). Both are recorded in `evidence/acceptance.md`.
  - *Acceptance:* at VERY LARGE the acceptance with the developer is mandatory (task 6.3), against
    DEC-7's four proofs (task 6.2).
  - *Follow-up issues:* stage 2 comments on #143 (D-3) and stage 3 on #216 (the proposal's
    follow-up: "revisit when stage 3 has recorded its findings"), each with what was delivered.
- **D-22 Handing B what C needs.** B's PLAN is being derived now. The description of the pull
  request that carries this PLAN states, for B's planner, the four things C relies on (done with
  that PR; no delivery task): the tester's Read list names `design.md` § Invariants
  and § Error matrix; the report lists stated properties by `INV-<n>` where one exists; the fetch
  target delivers every folder under `quality/`, `vale/` included; `quality/`'s meta-test can be
  extended to configurations. C edits nothing of B's; R-B2, R-B4 and R-B6 check each of the four
  when B lands, so the handoff is a courtesy and not what the PLAN relies on.
- **D-23 Archive order.** C is archived only after A and B are archived, so its deltas to
  `test-strategy` and `quality-checks` land on specs that exist with their Purpose.

## Algorithm / approach

**The stage loop**, the same for all five (DEC-2, DEC-3):

1. *Preflight.* Run the stage's re-checks (§ Re-check). A failed re-check stops the stage and is
   reported; it is not worked around.
2. *Gap rows.* Read the family file or files as delivered; copy every `gap` row into the survey
   file, whatever EPIC it names. C decides all of them (DEC-7: no row of the family stays a plain
   gap). A row naming B or D is put to the developer in the owner round: decide it here, or move
   it to that EPIC's family. An agreed candidate with no gap row for its question is still
   surveyed; if filled it becomes a new `exists` row (D-13).
3. *Survey.* Search, and record what was searched even when nothing is found:
   - skillery issues and PR review comments naming the family's skills, which are the skills in
     the *Technique owner* column of the family file (`gh issue list --search`,
     `gh pr list --search`, one search per skill name);
   - `openspec/changes/archive/*/evidence/` and `inputs/`, for findings and deviations;
   - for DevOps: issues and review comments of `infrastructure-stacks` and `cloud-infrastructure`,
     read-only, addressed by the checkout's own remote (`gh` run inside the checkout; no
     organisation is written here), and the question "has a runbook failed someone who followed
     it";
   - the tool run of the stage (D-8), stages 1 and 3 only.
4. *Owner round* (D-7), up to three calls: the developer adds failures, marks the rules, then
   confirms the decision table and signs off any rewritten or new scenario.
5. *Fill*, per `fill` line: the fixture or worked example first (D-12), then the check in the
   owning skill with its three facts (D-6), then the `quality/` file if it is a tool.
6. *Close.* Matrix edits (D-13); the family joins `CLOSED_FAMILIES` (D-14); the conditional delta
   is kept or deleted (D-16); CHANGELOG line; `make bundles`, `make skill-inventory`,
   `make validate`; the stage checker reads the evidence (D-10) and the decision table against the
   diff; one PR. If review leads to further commits, the checker reads the same two things again
   against the final diff before the merge.

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
> | INV-1 | An entity's label is the same in both stores | holds: rename updates both; breaks: create writes store A only | create, rename, replace, delete, bulk import | tester: a stateful property over all five paths; plus one scenario per path |
>
> The example shows the row as the failed PLAN had it (two paths) and as the question forces it
> (five), with create named. Matrix: new `CHK-<n>` "Invariants and their write paths", owner
> `epic-planning`, moment "epic-shaping: decide, design", decided by the adversary stance;
> `shaping.md`'s `ROB` gap row becomes `exists`.

**Worked example: an accept (stage 5).**

> Gap row (`ui.md`): `CLR` · gap · "nothing asks whether a user understands the screen" · C.
> Survey: no skillery issue, no archived finding, owner round: none seen.
> Decision: `accept`. Row: `CLR` · accepted · "No recorded failure as of `<date>`; searched:
> skillery issues, archived evidence, the owner (change activity-test-profiles). The external
> `design` plugin's `design-critique` and `ux-copy` skills cover this when a project installs
> them." No skill edited.

The external plugins a UI reason may name are the ones the session lists at stage 5: today the
`design` plugin (`design-critique`, `accessibility-review`, `ux-copy`, `user-research`,
`design-system`) and `frontend-design`. Task 5.2 records the names as installed then; a reason
names a skill only if it is in that record.

**Idempotency.** Every step is a file edit under review or a read-only run. Re-running a survey
appends failures under new ids and never renumbers. Re-running a tool run overwrites its summary.
A stage's PR can be rebuilt from its survey file and decision table alone.

### Anti-patterns

| Don't | Do instead | Why |
|---|---|---|
| Add a check because the candidate was agreed | Add it only with a failure id in the decision table | DEC-2; candidates are "subject to step 1" |
| Count every Vale finding as a failure | Count the ones the developer marks "would fix" | D-5; rabbit-hole *Vale noise* |
| Write "the system stays consistent" as an invariant | State what a property test could check, with an example and the write paths | Rabbit-hole *Invariants as boilerplate*; #143 |
| Edit the tester's brief so it reads the table | Leave the brief to B; check it at R-B4 | DEC-5 |
| Offer a skipped fixture test as the proof of a catch | Run it with the pinned tool on `PATH`; record red then passed | D-12 |
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
| INV-2 | Every check C adds names a failure id that exists in a survey file | holds: `CHK-<n>` ← `F-shaping-1` ← #143; breaks: Vale adopted with an empty failure table | a stage's fill step; a fix-up commit after review that adds a rule | the stage checker reads the decision table against the diff before the PR, and again against the final diff before the merge when review added commits (no automatic test: the survey lives in the change folder and moves at archive) |
| INV-3 | `quality/vale/` holds no style rule file | holds: `manifest.yaml`, `vale.ini`, the word lists under `styles/config/vocabularies/`; breaks: a `styles/Microsoft/*.yml` committed after `vale sync` | stage 1's fill; a fixture that copies a rule; a contributor committing the synced folder | a test in `quality/tests/` that fails on any tracked file under `quality/vale/` outside those three and on a missing `quality/vale/styles/*` ignore entry (D-11) |
| INV-4 | No evidence file names a host, address, client or person from the infra repositories | holds: "`<stack>/Makefile`: 3 findings of rule `minphony`"; breaks: a pasted finding line with a real path | the tool-run summary; a survey failure row quoting an infra issue; the owner round's answers copied to `inputs/qa.md`; a commit added after review | the stage checker reads each evidence and input file before the PR and again before the merge when review added commits (D-10); no automatic test |
| INV-5 | A PLAN's `## Invariants` section is never empty | holds: a table, or "None: `<why>`"; breaks: the heading with nothing under it | a new PLAN derived from the template; a PLAN revised after the gate | none automatic: `epic-planning` step 6 states the rule; the gap is accepted and named in #143 (D-3) |

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
| B's tester brief does not read `design.md`, so the invariants and the error matrix never reach it | Preflight R-B4 | Stage 2 stops; the developer decides: B revises its brief, or DEC-5 is re-shaped. C does not edit the brief |
| B's tester report does not list properties in a comparable form | The trace (task 6.1) cannot match an invariant | Report to B's lead; D-18 waits; task 6.1 holds the EPIC open |
| No PLAN that qualifies for the trace appears | Task 6.1 still open when the other stages are closed | D-18: the developer decides, wait or a sample PLAN |
| A tool is not installed where the run or a fixture test executes | The command is not found | The run installs it pinned into scratch (D-8); a fixture test skips with a message (D-12) |
| A re-check cannot be evaluated yet (R-A5 before A's stage 2 is merged) | The preflight has nothing to read | Record "not yet applicable" in `evidence/preflight.md`; re-run it in the stage's close step; if still not applicable, it carries to the next stage's preflight |
| No `gh` access to an infra repository's issues | The search command fails in task 3.2 | Survey from the checkout's history and the owner round; record the source as not searched |
| The recorded failure differs from the one a conditional scenario guessed, or the tool cannot express the scenario | The decision table against the delta, at the owner round | D-16: rewrite or drop the scenario; the developer signs off the new text in that round |
| More tool findings than one round can hold | The tool-run summary's rule counts | D-7: eight rules per tool, by count; the rest default to noise and stay listed |
| Vale's layout or pin form differs from D-9 and D-11 | The first step of task 1.3 | A PLAN revision of D-9, D-11 and INV-3 before task 1.5 |
| `infrastructure-stacks` has no Makefile | Stage 3's preflight lists none | D-8: one question to the developer before the run; on "nothing to check", checkmake is `accept`ed unless another failure backs it |
| A stage 5 survey decides a `fill`, but UI has no owning skill in the catalogue | The decision line cannot name an owning skill | No check is written: the failure is recorded as a skillery issue and the row is `accepted` with the issue number in its reason |
| A stage 4 `fill` lands in a skill with no capability in `openspec/specs/` | Call 3 of the owner round | D-16: no delta; the developer confirms the worked example's outline; C creates no capability |
| A gap row of the family names B or D | The gap-rows table of the survey | The owner round decides it (stage loop, step 2) |
| Two EPICs' branches take the same `CHK-<n>` | A's test if it catches duplicates (R-A2); otherwise the rebase conflict in `inventory.md` | Renumber C's id at the rebase; ids in an open PR are not final |
| An adopted tool is missing from `dependencies.yaml` | The stage checker, against D-21 (the lint checks shape only) | Add the entry |
| An `accepted` reason points into `openspec/` | A Markdown link: `cross_skill_paths` (blocking). A plain-text path: only the stage checker | D-13: neither; the change id as text |
| C is ready to archive before A or B | Task 6.4 | D-23: wait |
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
| R-A1 | The six family files exist under `skills/test-strategy/references/` with A's D-2 columns and the statuses `exists`, `gap`, `accepted` | A's stage 1, merged | all: once in task 0.2, and again in each stage's preflight for that stage's family file |
| R-A2 | `inventory.md` uses `CHK-<n>` ids; `tests/test_test_strategy.py` exists and is green; whether it accepts prose in the *Check* cell of an `accepted` row (if not, D-13's reason moves to the cell A's test allows); whether it catches a duplicate id | A's stage 1 | once, in task 0.2; a duplicate id is looked for again at each stage's close, after the rebase |
| R-A3 | Which rows are `gap` and which EPIC each names; the delivered rows replace the *Expected rows* guesses | the delivered family files | a first look in task 0.2 (recorded in `evidence/preflight.md`); per stage it is that stage's survey task (x.2), which copies the rows |
| R-A4 | The pointer-line wording in the owning skills (A's D-8), so new question ids are added in the same form | A's stage 1 | 1, 2, 3, 4 (stage 5 has no owning skill in the catalogue) |
| R-A5 | A's stage 2 `criteria` on `documentation`, `epic-shaping` and `devops` phases: C changes no workflow file, so nothing to edit; confirm no criterion contradicts D-6. If A's stage 2 is not merged: "not yet applicable", re-run at the close step | A's stage 2 | 1, 2, 3 |
| R-B1 | `quality/` exists; its layout, manifest format and test location match D-11, or D-11 is revised | B's PLAN and stage 1 | 1, 3 |
| R-B2 | How `quality/`'s tests run in `make validate` and skip in CI (B's DEC-12), so D-12's fixtures and INV-3's test sit in the right place; whether B ships a meta-test ("a rule without a fixture fails") that C can extend to configurations, or C writes its own | B's stage 1 | 1, 3 |
| R-B3 | B's ls-lint and checkmake configurations for scaffolded projects: C's docs and stacks variants are separate files and repeat none of their rules; whether B added ls-lint and checkmake to `dependencies.yaml` | B's stage 1 | 1, 3 |
| R-B4 | The tester brief's Read list names `design.md` § Invariants and § Error matrix, and its report lists the properties it stated | B's stage 2 | 2 (task 2.1) and 6 (task 6.1) |
| R-B6 | B's fetch target delivers every folder under `quality/` (so `vale/` and the docs configuration reach a project), and the folder it fetches into, which `technical-writing`'s commands name | B's stage 1 | 1 |
| R-B5 | `governance.md` names `quality/` as an artifact type and the top-level folder check allows it | B's stage 1 | 1, 3 |
| R-S1 | The live `epic-shape`, `documentation-workflow` and `operations-practice` requirements still read as the deltas assume | `openspec/specs/` on `develop` | 1, 2, 3 |
| R-S2 | The `test-strategy` and `quality-checks` capabilities exist in `openspec/specs/` or in their unarchived changes, so C's deltas have a base | A's and B's archive state | 1 |

## Attack record

A fresh subagent attacked the first draft (commit a4ddc57) on 2026-11-14. Findings and where they
went:

| Id | Finding | Folded into |
|---|---|---|
| X-1 | The tester's brief does not read `design.md`; C cannot edit it | Context, D-18, D-20, D-22, R-B4, error matrix |
| X-2 | The trace was empty on this PLAN (no invariant left to the tester); loose cell wording | D-1, D-18, the worked example, task 6.1 |
| X-3 | Gap rows naming another EPIC were left alone, against D-14 and DEC-7 | Stage loop step 2, error matrix |
| X-4 | "Inside the docs gate" had no wiring; `project-setup` is outside the Impact | Context, D-6, R-B6, the `documentation-workflow` delta |
| X-5 | The Invariants section "blocks" with nothing that blocks | D-1, D-3, D-6, INV-5, the `epic-shape` delta |
| X-6 | `accepted` reasons pointed into `openspec/` from a skill file | D-13, the accept example, R-A2, error matrix |
| X-7 | Stage 3 had no stated rule to encode; `repo-checks.md` is a MUST list; D-6 and the delta disagreed | Context, D-6, D-8, task 3.6, error matrix |
| X-8 | `dependencies.yaml` forgotten | Context, D-21, R-B3, tasks 1.6, 3.6 |
| X-9 | Two `quality-checks` scenarios had no delivering task | D-12, tasks 1.5, 3.5 |
| X-10 | Red-or-green of the closed-family test; section 0's PR; overtaking against DEC-1; what "A delivered" means | D-14, D-20, tasks |
| X-11 | Definition of Done: baseline, issue reference, no `references/` in `technical-writing` | D-12, D-21, tasks 2.4, 2.8 |
| X-12 | The three tools are not installed | Context, D-8, D-12, error matrix |
| X-13 | `CHK-<n>` numbers can collide across EPIC branches | D-13, R-A2, error matrix |
| X-14 | Archive order; the trace had no bound | D-18, D-23, task 6.4 |
| X-15 | Catch files asked of accept-only stages; no room for a house vocabulary; a wrong line number | D-11, D-12, INV-3, Context, tasks |

**Clarity gate, run 1 (independent scorer, on commit 2be08df): 8.7/10, FAIL.** Gaps folded in:

| Gap | Fix |
|---|---|
| G-1 | The owner round had no unit of marking and no bound → D-7 (the rule, ten per tool), D-9 |
| G-2 | A skipped fixture test could stand as proof → D-12, anti-patterns, tasks 1.5, 3.5 |
| G-3 | Guessed scenarios had no re-sign-off in stages 1 and 3 → D-16, tasks 1.4, 3.4 |
| G-4 | Vale's layout and pin form unspecified → D-9, D-11, INV-3, task 1.3 |
| G-5 | A re-check that cannot be evaluated yet → R-A5, error matrix |
| G-6 | No decision line for a candidate without a gap row → D-5 |
| G-7 | Small contradictions (R-A4 and stage 5, the stacks rows of D-6, red in accept-only stages, the skip note, the #216 pointer, B's meta-test) → R-A4, D-6, D-14, R-B2, tasks 1.6, 1.7, 3.6, 5.1 |
| G-8 | References without a location → Context, D-15, the UI plugin names, the infra repositories' address |
| G-9 | The baseline's sample EPIC undefined → D-21, task 2.4 |

**Clarity gate, run 2 (a second independent scorer, on commit d8e1d2e): 8.7/10, FAIL.** Gaps
folded in:

| Gap | Fix |
|---|---|
| 1 | The owner round did not fit one call and its questions depended on each other → D-7 (three calls), stage loop step 4, tasks x.3 and x.4 |
| 2 | The trial drafts had no rule source; no pin or install rule → D-8 |
| 3 | The unit of a check for a tool with several rules → D-5, D-12 |
| 4 | INV-2 and INV-4 named a write path their check missed → stage loop step 6, the two rows, the close tasks |
| 5 | The re-check table and the tasks disagreed → § Re-check, tasks 6.1 and the close tasks |
| 6 | No path for a fill in stage 5 or in a skill without a capability → D-16, error matrix |
| 7 | Tasks without a citation; two Definition of Done items; the #216 comment; D-22 → tasks, D-21, D-22 |
| 8 | A scenario ls-lint cannot express; a wrong file in another → the `operations-practice` delta |
| 9 | The checkmake fallback went against Q-10 → D-8, task 3.1 |
| 10 | Row forms and the survey's skill list left to the lead → D-13, stage loop step 3 |

The attacker did not check the contents of the two infra repositories, Vale's behaviour with the
four packages, or how `openspec archive` treats a delta to a capability with no live spec (D-23
avoids that case).

## Open Questions

None blocking. Stage 4's capability is open by design (D-16).
