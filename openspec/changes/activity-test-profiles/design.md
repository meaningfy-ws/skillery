<!-- PLAN (design half). Type: Implementation. First derived 2026-11-13 before A and B existed;
     rewritten 2026-11-14 against A as delivered and archived and against B's gated PLAN (both on
     develop at 48dfc9c). The first version's attack and five gate runs are summarised in
     inputs/planning-record.md. -->

> Derives from: EPIC `activity-test-profiles` ([`proposal.md`](proposal.md)), DEC-1..DEC-8; the
> owner's answers Q-8..Q-11 in [`inputs/qa.md`](inputs/qa.md). Parents as delivered or planned:
> A [`test-strategy`](../archive/2026-11-14-test-strategy/design.md) (archived) and
> B [`harden-checks-and-tests`](../harden-checks-and-tests/design.md) (gated, not delivered).

## Context

**A is delivered.** The six family files C closes are in
[`skills/test-strategy/references/`](../../../skills/test-strategy/references/). They hold ten rows
with the status `gap → C`, and no other gap row:

| Family file | Question | The gap row's *Check* cell | *Technique owner* cell |
|---|---|---|---|
| `documentation.md` | `ADQ` | whether the docs checks would catch a bad page | none yet |
| `documentation.md` | `ROB` | how the docs hold when the code changes or the reader strays | none yet |
| `documentation.md` | `CLR` | a prose style check on docs (Vale) | `technical-writing` |
| `documentation.md` | `RSK` | what outside the docs can make them false or unsafe | none yet |
| `shaping.md` | `ROB` | which invariants must hold, and how they reach the tester | `epic-planning` |
| `devops.md` | `ADQ` | whether the stack and infrastructure checks would catch a broken change | none yet |
| `architecture.md` | `ROB` | how the architecture holds under failure, load and attack | none yet |
| `modelling.md` | `RSK` | what outside the model can go wrong (a vocabulary changes, a consumer breaks) | none yet |
| `ui.md` | `ADQ` | whether the UI scenarios would catch a broken screen | none yet |
| `ui.md` | `RSK` | what outside the screens can go wrong (browsers, devices, content) | none yet |

Other facts of A that C builds on:

- The columns are *Question · Check · Technique owner · Tool · Moment · Decided by · Status*; the
  statuses are `exists`, `gap` and `accepted` ("a gap the developer chose to leave open, with the
  reason":
  [`test-strategy` SKILL.md](../../../skills/test-strategy/SKILL.md), lines 110–113).
- [`tests/test_test_strategy.py`](../../../tests/test_test_strategy.py) fails on a `CHK-<n>` that
  is uncited or undefined, on a family without a row for one of the six questions, and when an
  owning skill's pointer line ("Answers `<ids>` in `test-strategy`'s matrix (`<files>`)") disagrees
  with the `exists` rows that name it. It reads only `exists` rows for owners, so the cells of a
  `gap` or `accepted` row are free text. It does not catch a duplicate id.
- The inventory's last id today is `CHK-144`. DevOps already has `CHK-57` Runbook test (`CLR`).

**B is planned, not delivered.** Its PLAN passed the gate at 9.0 and its scenarios are signed off.
What C uses, with the place in [B's design](../harden-checks-and-tests/design.md):

| Fact | Where in B |
|---|---|
| `quality/` holds rule files and configurations only, in one folder per tool; a lint `quality_files` allows there only `README.md` at the root and files ending `.yaml`, `.yml`, `.json`, `.ini` (and `.py` fixtures beside a Semgrep rule). "EPIC C adds `quality/vale/` beside these" | D-1 |
| `quality/README.md` is the one prose file and lists every check, its tool, its file and its owner | D-1 |
| The tests of `quality/` are in `tests/test_quality.py`, fixtures under `tests/fixtures/quality/`; a tool group skips with `pytest.mark.skipif(shutil.which(...) is None)`, so CI skips it and a local run with the tool does not | D-8 |
| An external source is a JSON entry with `id`, `repo`, `commit`, `paths`, `licence`, `why`, `mode`, checked field by field | D-7 |
| A project gets the whole `quality/` folder into `.quality/` by `make quality-fetch`; `make quality-tools` installs ls-lint and checkmake there. Vale is not installed by it | D-4 |
| B's ls-lint and checkmake files are `ls-lint/python-project.yml` and `checkmake/python-project.ini` | D-1, D-5 |
| B adds ls-lint and checkmake to `dependencies.yaml` | D-8 |
| The new tester brief takes its properties "from the PLAN's error matrix and the stage's spec scenarios" and reports "a table of properties (property, test, result)". It does not read a PLAN's other sections | D-9 |
| B's stage 1 delivers `quality/`; its stage 2 delivers the tester's brief | B's `tasks.md`, sections 1 and 2 |

**Other facts.**

- One recorded failure is known: issue
  [#143](https://github.com/meaningfy-ws/skillery/issues/143). A PLAN passed the gate at 9.25,
  stated the invariant "an entity has one label, held in two stores", covered the write paths
  rename and replace and missed create; the tester found it after the whole stage was built.
- The interview is step 2 of [`epic-planning`](../../../skills/epic-planning/SKILL.md) (line 36);
  PLAN derivation is step 6 (line 59).
- The PLAN template is
  [`templates/design.md`](../../../skills/project-setup/assets/openspec-schema/meaningfy/templates/design.md)
  with the section list in `schema.yaml` beside it (line 129); `make bundles` copies both to
  `openspec/schemas/meaningfy/` (`tools/bundle_gen/gen.py:42`).
- `technical-writing`'s `verify` phase runs the snippets and the project's docs gate, one command,
  `make build-docs` (`skills/technical-writing/assets/workflows/documentation.workflow.json:13`).
  The skill has no `references/` folder.
- `infrastructure-operations`' `references/repo-checks.md` is a list of required checks under a
  MUST. Neither devops skill states a naming rule or a Makefile rule today.
- `architecture`'s SKILL.md body is at its 650-line cap.
- Vale, ls-lint and checkmake are not installed on the owner's machine.
- skillery is a public repository: evidence written here is public.

## Goals / Non-Goals

**Goals:** five stages, each closing its families' `gap → C` rows as `exists` or `accepted`
(DEC-1, DEC-2); the invariants path from the interview to the tester (DEC-5); the four tool runs
of three tools (DEC-7); DEC-7's four proofs; the Definition of Done of a skill change
(`docs/development/README.md` §9).

**Non-Goals:** the proposal's No-gos. In particular: no check without a failure id; no change in
the stacks repositories; no edit to the tester's brief or to any file of `project-setup` other than
the PLAN template and its section list in `schema.yaml` (D-2); no new workflow gate; no `clarity-gate` checklist item (D-3); no word list or
Meaningfy-own rule for Vale (#212).

## Decisions

New choices made while planning. Settled ones are cited by `DEC-n`.

### D-1 Invariants are a section of `design.md`, and reach the tester through the error matrix

Confirms DEC-5 (Q-8). The PLAN template gains `## Invariants`, directly before `## Error matrix`,
with one table:

| Column | Holds |
|---|---|
| *Id* | `INV-<n>`, unpadded |
| *Invariant* | a statement a property test could state |
| *Example* | one case that holds and one that would break it |
| *Write paths that can break it* | every path that touches it: create, update, replace, delete, bulk or import, internal |
| *Test* | the test or scenario that proves it on each path; the cell starts with the word `tester` when the invariant is left to the adversarial tester |

Two rules go with it, stated in `epic-planning` step 6:

1. A PLAN with no invariant writes one line under the heading: "None: `<why>`". The section is
   never empty.
2. Each invariant whose *Test* cell starts with `tester` also has a row in the error matrix whose
   *Failure mode* cell names the breach and cites the id ("the label differs between the stores
   after a create (INV-1)"). B's tester takes its properties from the error matrix (B's D-9), so
   this row is how the invariant reaches it without a change to B's brief.

Rejected: a sub-table of the error matrix (Q-8); the spec deltas (Q-8); asking B to add the section
to the brief's reading list (B's PLAN is gated and signed off, and rule 2 needs no change there).
Nothing mechanical checks either rule; that gap is accepted and named in #143 (D-3).

### D-2 The template change

Three edits and one render, all in `skills/project-setup/assets/openspec-schema/meaningfy/`:

1. `templates/design.md`: the heading `## Invariants` with a comment giving the columns and rule 1.
2. The comment under `## Error matrix` gains: "The adversarial tester takes these rows as its
   targets. Give each invariant left to the tester a row that cites its `INV-` id."
3. `schema.yaml`: one bullet for the section in the list at line 129.
4. `make bundles`, which copies the folder to `openspec/schemas/meaningfy/`.

The live `epic-shape` requirement *The EPIC and PLAN templates speak plain language* says the
templates' headings stay as they are; its delta names `## Invariants` as the one added heading.
PLANs that exist already are not migrated.

### D-3 What C takes from issue #143

The table's last two columns, and the question that asks for them (Q-9). The `clarity-gate`
checklist item #143 also asks for stays with #143: `clarity-gate` is outside the frozen EPIC's
Impact. Task 2.7 comments on #143 with what was delivered and what is left.

### D-4 The interview question

`epic-planning` step 2 gains one sentence inside the test-scenario interview: which invariants
must hold, each stated so that a property test could check it, each with an example; "none" is a
valid answer, recorded with its reason. The answers are recorded with the rest of the interview,
in the change's `inputs/qa.md`, and step 6 reads them from there (the EPIC template gains no
field). Step 6 gains the two rules of D-1. SKILL.md grows by at
most five lines. The detail goes to a new reference,
`skills/epic-planning/references/invariants.md`: what an invariant is and is not, the write-path
list, the error-matrix row, and the #143 case replayed (§ Algorithm).

### D-5 The survey record and its units

One file per stage, `evidence/survey-<stage>.md` (`documentation`, `shaping`, `devops`,
`architecture-modelling`, `ui`), with three tables:

1. *Gap rows*: the stage's rows of the Context table, copied from the family file as it then is.
2. *Failures*: `F-<stage>-<n>` · what happened · source (an issue, a PR, a review finding, a tool
   run, or the owner's words with the date) · question id · what would have caught it.
3. *Decisions*, one line per gap row and one per agreed candidate that has no gap row (D-10):
   `fill` with the failure ids and the one technique, or `accept` with the reason and the sources
   searched.

A failure counts only if something went wrong for a reader or user of the artefact and a source
can be cited. For a tool, the unit is the rule: each rule the owner marks "would fix" (D-6) is one
failure row, with the rule's name and count; a rule not marked is noise. One tool configuration
is one technique, one decision line and one `CHK-<n>`, whatever the number of rules it enables.

### D-6 The owner round

One round per stage, asked by the lead after the survey. No check is written before it is
answered; the answers go to `inputs/qa.md`. "The owner" and "the developer" are the same person.
The question tool takes at most four questions per call, each with two to four options, and always
offers a free-text answer. The round has three kinds of call, in this order; a kind takes a
further call when it needs more than four questions.

| Kind | Asked | Options | Stages |
|---|---|---|---|
| 1 Failures | "Which of these went wrong in `<family>` work?", multi-select, one question per three failures the survey found | up to three failures, and "None of these". A failure not selected stays in the failures table marked "not confirmed" and backs no fill. The free-text answer adds a failure, recorded as "the owner's words, `<date>`". When the survey found nothing: "None seen" and "One I describe in the free text". Stage 3 adds one question, "Has a runbook failed someone who followed it?", with "No" and "Yes, described in the free text" | all |
| 2 Rules | "Which of these rules would you fix?", multi-select, per tool | up to three rules, each with its count and one example, and "None of these". At most six rules per tool, so two questions per tool: the six with the most findings after the lead drops rules whose examples are all house terms or code identifiers. A rule not selected or not shown is noise; the tool-run summary lists them all. Where two packages flag the same thing, they are one option, and the rule of the package listed first in D-8 is the one enabled | 1 and 3 |
| 3 Decisions | One question per decision table, the table in the question text; one more per scenario rewritten or added (D-14), with its text | "Confirm" and "Change". On "Change" the owner says which lines in the free text, the lead corrects them and asks once more | all |

A tool with no finding gets no question of kind 2 and its decision is `accept`. Stages 4 and 5
may be asked in one sitting and still write two survey files. In stage 2 the fill is fixed by
DEC-5 and #143: `F-shaping-1` is not put to the owner, and kind 1 there only asks for further
failures.

### D-7 The four tool runs

Each run happens in the session's scratch folder with a draft configuration; nothing is written to
`quality/` by a run (DEC-7: the run is part of the survey).

| Run | Stage | On | Draft |
|---|---|---|---|
| Vale | 1 | skillery's `docs/` (Q-10) | the four packages of D-8, every rule at its default level |
| ls-lint, docs | 1 | skillery's `docs/` | kebab-case for directories and for `.md` and `.adoc` files; `README.md`, `CHANGELOG.md` and `docs/rules/` exempt (the rulebook's tooling names those files) |
| ls-lint, stacks | 3 | a read-only checkout of `infrastructure-stacks` (Q-10) | the naming form most stacks already follow, counted in the checkout for directories at the stack level and one level below and for each file extension present in more than half of the stacks; the summary states each counted form; the findings are the names that depart from it |
| checkmake | 3 | the same checkout | its default rule set |

- ls-lint and checkmake are installed at the versions B pins in `Makefile.tmpl`
  (`LS_LINT_VERSION`, `CHECKMAKE_VERSION`; B's D-4), as task 0.2 finds them delivered, so a
  configuration is proven on the version projects run. Vale, which B does not pin, is installed as
  its latest stable release binary on the day of the run; that version goes into the summary and,
  if Vale is adopted, into its `dependencies.yaml` entry and the `technical-writing` section.
- The stacks summary states which directory depth it took as "the stack level".
- Only a scrubbed summary (D-17) is committed, as `evidence/toolrun-<run>.md`: version, command,
  counts per rule, three example findings, run time. Raw output stays in scratch.
- Both stacks tools only read; the checkout must be unchanged afterwards (`git status` there is
  clean).
- If the checkout holds no Makefile, the lead asks the owner one question before the run: run
  checkmake on `cloud-infrastructure` instead (Q-10 did not choose that repository), or record
  "no Makefile in the checkout". On the second answer `evidence/toolrun-checkmake.md` says so, and
  task 6.1 lists DEC-7's fourth proof as "not met for checkmake, accepted by the owner on
  `<date>`": a tool that had nothing to read did not run.
- skillery adopts none of these checks on itself (B's DEC-12). Fixing its docs after the report is
  a separate PR if the owner wants one.

### D-8 Vale's styles

Candidates, in this order, run report-only (Q-11): Microsoft, Google, write-good, proselint. The
owner picks packages and rules in the stage's round; a rule not marked "would fix" is not enabled.
No style file is committed (No-gos; B's DEC-6): `vale sync` fetches the packages named in
`vale.ini`.

Each adopted package is one entry of `quality/vale/external.json`, in the field form of B's D-7
with `tag` and `archive` in place of `commit` and `paths`: `id`, `repo`, `tag`, `archive` (the
address of the package's release archive at that tag, the same address `vale.ini`'s `Packages`
line holds), `licence`, `why`, `mode` (`report-only`; C adds no gating Vale rule).

The planner did not run Vale. The first step of task 1.3 confirms four facts against the pinned
Vale's documentation and a trial run: `vale --config <file> sync` reads that file and writes each
package to its `<StylesPath>/<Package>/`; `Packages` accepts an archive address; a bare package
name fetches the latest; a run with `--config <file>` uses the same `StylesPath`. A difference is a
correction of this decision and of D-9, confirmed by the owner in the stage's round before task
1.5 and recorded under `## Delivery decisions` (D-16).

If task 0.2 finds that B's manifest test covers every `external.json` under `quality/` and not
only Semgrep's, C's file is named `quality/vale/packages.json` instead; nothing else changes.

### D-9 Files in `quality/` and their tests

C follows B's tree and test home (B's D-1, D-8). A file is added only for a tool its stage adopted.

| File | Holds | Passes `quality_files` |
|---|---|---|
| `quality/vale/vale.ini` | `StylesPath = styles`, the pinned `Packages`, the enabled rules | yes, `.ini` |
| `quality/vale/external.json` | the manifest of D-8 | yes, `.json` |
| `quality/ls-lint/docs.yml` | docs folder and file names | yes, `.yml` |
| `quality/ls-lint/stacks.yml` | stacks repository names | yes, `.yml` |
| `quality/checkmake/stacks.ini` | Makefile rules for stacks | yes, `.ini` |
| `quality/README.md` | one row per file above: the check, its tool, its file, its owning skill | B's file, extended |

Nothing is ever synced into `quality/`: B's `quality_files` lint may read the folder as it is on
disk, and synced style files there would fail it. The Vale tool test copies `vale.ini` into
pytest's `tmp_path` and runs `sync` and the check there.

Four of these files are configurations and need a fixture pair: `vale/vale.ini`,
`ls-lint/docs.yml`, `ls-lint/stacks.yml` and `checkmake/stacks.ini`. A pair is
`tests/fixtures/quality/<tool>/<stem>/bad` and `.../good` (a tree for ls-lint, a file for the
others), for example `tests/fixtures/quality/ls-lint/stacks/bad/`. Tests, all in
`tests/test_quality.py`:

| Test | Needs | In CI |
|---|---|---|
| Each of the four configurations that exists has its fixture pair | Python only | runs |
| Each entry of `quality/vale/external.json` has every field of D-8, and `mode` is `report-only` | Python only | runs |
| `quality/vale/` holds exactly `vale.ini` and the manifest, on disk (INV-3) | Python only | runs |
| Per configuration: the bad fixture is flagged once per enabled rule, by that rule's name; the good one is silent | the tool; Vale also syncs its styles into `tmp_path`, so network | skips, in B's `skipif` form |

Adding a tool also touches B's two guides: `docs/development/quality.md` gains Vale and the second
manifest form, and `CONTRIBUTING.md` gains Vale's install note beside B's.

### D-10 Matrix edits and the two row forms

Which row a check gets: one row, for the question in this table. A candidate whose question has no
gap row adds a new row and closes no gap.

| Candidate | Question | Gap row it closes |
|---|---|---|
| Vale | `CLR` | `documentation.md`, `CLR` |
| ls-lint, docs | `VER` | none |
| Invariants and their write paths | `ROB` | `shaping.md`, `ROB` |
| ls-lint, stacks | `VER` | none |
| checkmake, stacks | `VER` | none |

For each `fill`: a new `CHK-<n>` in `inventory.md`, the next free number after the stage's last
rebase (two EPICs' branches may take the same number, and A's test does not see it; the id is
final only at merge), and an `exists` row. For each `accept`: the gap row's *Check* cell is
replaced by the reason and its status becomes `accepted`. The pointer line of the owning skill
gains the question id where A's test asks for it.

| Question | Check | Technique owner | Tool | Moment | Decided by | Status |
|---|---|---|---|---|---|---|
| `ROB` | `CHK-<n>` Invariants and their write paths | `epic-planning` | the `## Invariants` table of the PLAN | epic-shaping: the interview; PLAN derivation | the adversary | `exists` |
| `CLR` | `CHK-<n>` Prose style check on docs | `technical-writing` | Vale, `quality/vale/vale.ini` | docs stage, `verify` | the cold reader | `exists` |
| `VER` | `CHK-<n>` Docs file and folder names | `technical-writing` | ls-lint, `quality/ls-lint/docs.yml` | docs stage, `verify` | the verifier | `exists` |
| `VER` | `CHK-<n>` Stacks repository names | `stack-operations` | ls-lint, `quality/ls-lint/stacks.yml` | every PR of a stacks repository that adopted it | the verifier | `exists` |
| `VER` | `CHK-<n>` Stacks Makefile hygiene | `infrastructure-operations` | checkmake, `quality/checkmake/stacks.ini` | every PR of an infrastructure repository that adopted it | the verifier | `exists` |
| `RSK` | No recorded failure as of `<date>`; searched: `<sources>` (change activity-test-profiles). `<what covers it meanwhile, if anything>` | none yet | none yet | none yet | the developer | `accepted` |

The `inventory.md` row of a new check follows that file's five columns: the id, the check's name
as in the row above, what it checks in one clause, its owner file (the skill file of D-12 and the
`quality/` file), and the moment.

In the family files the question and status cells are written bare, as A's rows are (`ROB`,
`exists`, without the backticks this table shows them in): A's pointer check compares the status
cell to `exists` exactly. An `accepted` reason is self-contained plain text without a `|`: no path
and no link into `openspec/` (a skill file may not link there, and the folder moves at archive).
The middle three cells of an `accepted` row keep what the gap row had.

### D-11 The closed-family test

`tests/test_test_strategy.py` gains a list `CLOSED_FAMILIES` of family file names
(`documentation.md`), a pure function `closed_family_errors(name, text)` and one test: for a file
in the list, a row whose status cell is not exactly `exists` or `accepted`, or an `accepted` row
whose *Check* cell is empty, is an error naming the file and the row; a listed file that is
missing is an error too. So a `gap` row, a decorated or misspelt status and a row whose columns
shifted are all reported. The tester's property test for this function goes in its own file,
`tests/test_closed_families_properties.py`, which opens with
`pytest.importorskip("hypothesis")`, so CI, which installs no Hypothesis, skips it and still
collects A's tests. The list starts empty with the function's own fixture cases, so the test is green
when added. In every stage, accept-only or not, the close step first adds the family to the list,
which is red, and then edits the rows until it is green.

### D-12 Where each adopted check runs, whether it blocks, what it costs

No `*.workflow.json` file and no file of `project-setup` changes (DEC-8; No-gos). Each adopted
check is written in its owning skill with three facts: when it runs, whether it blocks, its cost
(the command and its run time on the proof tree).

| Check | Written in | Runs | Blocks |
|---|---|---|---|
| Vale | `technical-writing` SKILL.md, a step of the `verify` row and a short section | the writer runs `vale --config .quality/vale/vale.ini sync` then `vale --config .quality/vale/vale.ini docs/`, beside the docs gate (the form task 1.3 confirms, D-8) | no; findings go in the PR description |
| ls-lint, docs | the same section, the naming rule first | `ls-lint --config .quality/ls-lint/docs.yml`, with the binary `make quality-tools` put under `.quality/` (its path as B delivers it, task 0.2) | the writer fixes a broken name before the PR; no gate enforces it |
| ls-lint, stacks | `stack-operations`, `references/stack-standard.md`, a new subsection *Recommended checks* | on each pull request of a stacks repository, once that repository adopts it | not until then; the subsection points to #216 |
| checkmake, stacks | `infrastructure-operations`, `references/repo-checks.md`, a new subsection *Recommended checks*, outside the file's MUST | the same | the same |
| Invariants section | `epic-planning`, steps 2 and 6 | at the interview and at PLAN derivation | required by the skill's rule; not mechanically checked (D-3) |

- Both documentation checks need a project that ran `make quality-fetch`. Vale is not installed by
  `make quality-tools`: the section says how to install it and that `vale sync` needs network the
  first time. `make quality-tools` does not work in a doc-only project (B's Non-Goals: its scripts
  are rendered for code projects only); there the writer installs ls-lint as he does Vale. In a
  project without `.quality/`, or without the tool, the writer skips that step and says so in one
  line of the PR description.
- In the skill's text of every tool check, docs and stacks alike, the rule it encodes and why
  comes first, then the check (B's DEC-4: `quality/` holds only the executable file). A stacks
  repository reads the configuration from
  skillery at a release tag; how it does so is that repository's change (#216).
- Wiring a check into a project's docs gate is left to the project.

### D-13 The invariants trace (DEC-7's third proof)

The trace is taken on C itself, in the stage that carries task 0.3.

- C's own invariant INV-1 is left to the tester and has its error-matrix row (rule 2 of D-1).
- `closed_family_errors` (D-11) is Python, so the tester has something to state a property about.
- VERY LARGE carries the adversarial tester on every stage, small or not (the live `epic-delivery`
  spec: "the adversarial tester and the checker SHALL stay separate").
- C's first stage starts after B's stage 2 is merged (D-16). The lead dispatches the tester with
  the brief text read from `skills/epic-delivery/references/team-and-briefs.md` in the working
  tree, because the installed skill may still be the release before B's stage 2 (B's D-13 does the
  same). In filling the brief the lead names, as the PLAN's error matrix the brief's Method refers
  to, the path of this file and its `## Error matrix` section. That fills the brief; it does not
  edit it.
- The tester's property test goes in the file D-11 names.

**Proven** means: the tester's report on that stage has a row in its table of properties that
states the property of the error-matrix row citing INV-1, with a test and a result. The lead
copies that row, with the error-matrix row and the `## Invariants` row it came from, into
`evidence/invariants-trace.md`. If the report has no such row, the lead returns it to the tester
once, quoting B's brief; if it is still missing, that is a finding about B's brief, reported to the
owner, and the proof stays open until the owner decides.

The limit of this proof, stated so the owner accepts it knowingly at sign-off: it shows one
invariant of one PLAN reaching the tester through its error-matrix row. The tester also reads the
stage's tasks and scenarios, which mention the closed-family test, so the trace cannot show that
the row alone carried it.

### D-14 Stages that accept, fills outside the candidates, and the conditional deltas

- **An accept-only stage** (no `fill` line) ships: the survey file, the `accepted` rows, the family
  in `CLOSED_FAMILIES`, a CHANGELOG line, and the removal of its conditional delta. It adds no
  skill text beyond the family's rows, no `quality/` file and no probe. It may take the small
  review set under the small-stage rule of
  [`epic-delivery` SKILL.md](../../../skills/epic-delivery/SKILL.md) (lines 106–111); the lead
  first records that under `## Delivery decisions` in this file, with ids from `D-20`.
- **The conditional deltas** (`documentation-workflow`, `operations-practice`, `quality-checks`)
  are written now for the agreed candidates and say so in their header. Their scenarios name cases
  guessed before any survey. Each candidate has its own requirement in each delta, so a stage
  whose candidate ends `accept` deletes that candidate's requirement whole, and the delta file if
  nothing is left. A stage that fills from a different failure than
  the guessed one, or finds the tool cannot express the scenario, rewrites the scenario from the
  recorded failure; the owner signs off the new text in a call of kind 3.
- **A fill outside the agreed candidates** (any of the eight gap rows that have none: all but
  `documentation.md` `CLR` and `shaping.md` `ROB`): the check
  goes in a reference file of the family's owner, and the lead drafts one ADDED requirement with a
  scenario, signed off in a call of kind 3 before the check is written.

  | Family | Owner | Delta the requirement goes in |
  |---|---|---|
  | documentation | `technical-writing` (it gains a `references/` folder) | `documentation-workflow` |
  | devops | `infrastructure-operations`, or `stack-operations` for a check on one stack | `operations-practice` |
  | architecture | `architecture`, in a reference file only (its SKILL.md is at the cap) | none: no `architecture` capability exists, and C creates none (the proposal's "or none"); the owner confirms the worked example's outline instead |
  | modelling | `conceptual-modelling` | none, for the same reason; if the owner confirms `modelling-conventions` or `linkml-engineering` as the better owner, a new delta for that live capability |
  | ui | none in the catalogue | no check is written: the failure becomes a skillery issue, and the row is `accepted` with the issue number in its reason |

### D-15 Definition of Done items beyond the stage loop

- **Baseline, stage 2 only** (the invariants question is a discipline rule). A sample EPIC of
  about twenty lines that keeps one label in two stores and offers create, rename and replace is
  written once to `evidence/baseline-shaping-epic.md`; it mentions neither invariants nor write
  paths. Its PLAN is derived twice from that file by fresh subagents, each working in a checkout
  of a named commit (the stage's base commit, then its head) and told to follow that checkout's
  `skills/epic-planning/` and PLAN template, not the installed plugin. `evidence/baseline-shaping.md` records the observable for each run: **the PLAN ties create
  to both stores**, in an invariant row, a scenario or a test task that says the label must be the
  same in both stores after a create. A task that merely implements create does not count.
  Expected: no before, yes after. If the before-run is already yes, the result is recorded as it
  is, #143 stays the failure evidence and the owner is told in the stage's PR. If the after-run is
  no, tasks 2.5 and 2.6 are revised and the run repeated, at most twice; then it goes to the owner.
- **Failure case:** the survey files; for stage 2, #143.
- **Issue referenced:** stage 1's PR names #212 (the follow-up that waits on stage 1's Vale run),
  stage 2's #143, stage 3's #216; stages 4 and 5 name the EPIC.
- **Follow-up comments:** stage 2 comments on #143 and stage 3 on #216 (the proposal: "revisit
  when stage 3 has recorded its findings"), each with what was delivered.
- **External tools:** Vale gets an entry in `dependencies.yaml` (kind `cli-tool`) if adopted;
  ls-lint and checkmake are B's entries.
- **Ownership:** `tests/ownership.yaml` gains `plan-invariants`, owner `epic-planning`,
  `claim_patterns: ["invariants? must hold"]`.
- **Bodies stay CLI-agnostic:** the new text names no `/opsx:` form and no `.claude/` path.
- **User-facing docs:** a CHANGELOG line per stage, written for the installer; a row per adopted
  file in `quality/README.md`; no README row (no new entry point).
- **Scenario sign-off:** the owner signs off this change's scenarios when accepting the gated PLAN
  (task 0.1); a scenario rewritten or added later is signed off in its stage's round (D-14). Both
  are recorded in `evidence/acceptance.md`.
- **Acceptance** is mandatory at VERY LARGE (task 6.2), against DEC-7's four proofs (task 6.1).

### D-16 Order

- C's delivery starts when B's stages 1 and 2 are merged (the proposal's Impact: "after A and B").
  B's stage 3 is not needed; this reading of "after A and B" is the planner's, and the owner
  confirms it with the sign-off of task 0.1. Task 0.2 checks B as delivered against the Context
  table. A difference limited to a path, a file name or a command form is recorded as a `D-20+`
  entry under `## Delivery decisions` at the end of this file and noted in
  `evidence/preflight.md`; the navigator's plan hash leaves that section out, so the gate stays
  valid, and the text above is not edited. A difference that changes a decision or a scenario is a
  PLAN revision, gated again.
- Stages run in DEC-1's order, one PR each into `develop`. Section 0 rides in stage 1's PR. Stage
  3 may be overtaken by stages 4 and 5 only when no checkout of `infrastructure-stacks` is
  available and the owner agrees; the deviation is recorded in `evidence/preflight.md`.
- C is archived after B, so its deltas to `quality-checks` land on a spec that exists.

### D-17 Public evidence is scrubbed

Nothing in `evidence/` or `inputs/` names a host, an address, a client, a person or a secret path
from the infra repositories or from client work. Tool findings are quoted with the path reduced to
its shape (`<stack>/Makefile`), failures with the system named by its kind ("a reverse-proxy
stack"). The stage checker reads every evidence and input file for this before the PR, and again
on the final diff before the merge when review added commits. Text that leaves the repository's
files is covered the same way: a comment for #143 or #216 and the body of a stage's PR are written
to `evidence/` first (`evidence/comment-<issue>.md`, `evidence/pr-<stage>.md`), read by the
checker, and posted as written.

### D-18 Showing the catch (DEC-7's first proof)

- A tool configuration: its fixture pair of D-9, written red first. The bad fixture holds one case
  per enabled rule, each the failure that rule cites, reduced and scrubbed. In the delivery session
  the tool test must run, with the tool on `PATH` at the version of D-7: a skipped test is not
  proof.
- A technique in a skill: a worked example in a reference file of the owning skill that replays
  the cited failure.

One line per fill goes to `evidence/catch-<stage>.md`: failure ids, check id, where the fixture or
example is and, for a fixture, the test id with its red result before the configuration and its
passed result after. An accept-only stage writes no catch file.

### D-19 Descriptions do not change

The new checks are steps inside triggers the skills already have, so no probe is owed. If a stage
must change a description, it ships a positive and a near-miss probe with the before and after
kept (`AGENTS.md`, *Proven triggers*).

## Algorithm / approach

**The stage loop**, the same for all five (DEC-2, DEC-3):

1. *Preflight.* The branch is on current `develop`; the stage's gap rows still read as in the
   Context table; the live requirement its delta modifies or adds to still reads as the delta
   assumes. A difference is handled as D-16 says.
2. *Gap rows.* Copy the stage's rows into the survey file.
3. *Survey.* Search, and record each source even when it yields nothing:
   - skillery issues and PR review comments, one search per skill named in the family file's
     *Technique owner* column (`gh issue list --search`, `gh pr list --search`);
   - `openspec/changes/archive/*/evidence/` and `inputs/`, for findings and deviations;
   - stage 3 only: the issues and review comments of `infrastructure-stacks`, with `gh` run inside
     the checkout, and the question "has a runbook failed someone who followed it" in the owner
     round (a yes is a failure for the `ADQ` row: `CHK-57` did not catch it);
   - stages 1 and 3: the tool runs of D-7.
4. *Owner round* (D-6).
5. *Fill*, per `fill` line. For a tool: the fixture pair and its test, red (D-18); then the
   `quality/` file and its `README.md` row until the test passes; then the skill text with its
   three facts (D-12). For a technique: the worked example, then the skill text.
6. *Close.* The family joins `CLOSED_FAMILIES` (red), then the matrix edits (D-10) until green; the
   conditional delta is kept, rewritten or deleted (D-14); the catch file; the CHANGELOG line;
   `make bundles`, `make skill-inventory`, `make validate`,
   `openspec validate activity-test-profiles --strict`. The stage checker is the Checker of the
   `epic-delivery` review set, with two readings added to its brief: the decision table against
   the diff (INV-2) and the evidence with the texts to be posted (D-17); it also confirms no
   description changed without probes (D-19);
   then one PR. If review adds commits, the checker reads both again on the final diff before the
   merge.

**What each stage is expected to do** (the survey decides; this is not a commitment):

| Stage | Gap rows | Candidates | Expected |
|---|---|---|---|
| 1 documentation | `ADQ`, `ROB`, `CLR`, `RSK` | Vale; ls-lint, docs | the candidates filled if the owner marks a rule; `ADQ`, `ROB`, `RSK` accepted unless the survey finds a failure |
| 2 shaping | `ROB` | invariants, backed by #143 | filled |
| 3 devops | `ADQ` | ls-lint and checkmake, stacks | the candidates by the tool runs; `ADQ` by the runbook question |
| 4 architecture, modelling | `ROB`; `RSK` | none | accept-only |
| 5 ui | `ADQ`, `RSK` | none | accept-only, the reasons naming the external design skills |

**Worked example: a fill (stage 2).**

> Gap row (`shaping.md`): `ROB` · which invariants must hold, and how they reach the tester ·
> `epic-planning` · gap → C.
> Failure `F-shaping-1`: #143, the create path broke the one-label invariant and was found after
> the stage was built; `ROB`; caught by listing every write path beside the invariant.
> Decision: `fill`, `F-shaping-1`, technique "invariants with their write paths in the PLAN".
> The reference `invariants.md` replays the case. The PLAN that failed had, in effect:
>
> | Id | Invariant | Example | Write paths that can break it | Test |
> |---|---|---|---|---|
> | INV-1 | An entity's label is the same in both stores | holds: rename updates both | rename, replace | one scenario each |
>
> The column's list (create, update, replace, delete, bulk or import, internal) forces:
>
> | Id | Invariant | Example | Write paths that can break it | Test |
> |---|---|---|---|---|
> | INV-1 | An entity's label is the same in both stores | holds: rename updates both; breaks: create writes one store only | create, rename, replace, delete, bulk import | tester: a stateful property over the five paths; one scenario per path |
>
> and, because the cell starts with `tester`, the error-matrix row "The label differs between the
> stores after a create, rename, replace, delete or import (INV-1) · the tester's stateful
> property; the scenarios · fix the path; never relax the property".
> Matrix: a new `CHK-<n>`, and the `ROB` row in the form of D-10.

**Worked example: an accept (stage 5).**

> Gap row (`ui.md`): `RSK` · what outside the screens can go wrong (browsers, devices, content).
> Survey: no skillery issue, no archived finding; owner round, kind 1: "None seen".
> Decision: `accept`. The row's *Check* cell becomes: "No recorded failure as of `<date>`;
> searched: skillery issues, archived evidence, the owner (change activity-test-profiles). The
> external `design` plugin's `accessibility-review` skill covers part of this when a project
> installs it." Status `accepted`, decided by the developer. No skill is edited.

A reason names an external skill only if task 5.2 recorded it as installed in the session; today
those are the `design` plugin's `design-critique`, `accessibility-review`, `ux-copy`,
`user-research` and `design-system`, and `frontend-design`.

**Idempotency.** Every step is a file edit under review or a read-only run. Re-running a survey
appends failures under new ids and never renumbers. Re-running a tool run overwrites its summary.
A stage's PR can be rebuilt from its survey file and decision table.

### Anti-patterns

| Don't | Do instead | Why |
|---|---|---|
| Add a check because the candidate was agreed | Add it only with a failure id in the decision table | DEC-2; candidates are "subject to step 1" |
| Count every Vale finding as a failure | Count the rules the owner marks "would fix" | D-5; rabbit-hole *Vale noise* |
| Write "the system stays consistent" as an invariant | State what a property test could check, with an example and the write paths | Rabbit-hole *Invariants as boilerplate*; #143 |
| Leave an invariant for the tester only in the Invariants table | Give it an error-matrix row citing its id | D-1: the tester reads the error matrix |
| Edit the tester's brief | Leave it; it is B's | DEC-5 |
| Commit a Vale style, a word list or copied rule text | Pin the package in `external.json`; `vale sync` fetches it | No-gos; B's DEC-6; `quality_files` |
| Put a test or a fixture under `quality/` | `tests/test_quality.py` and `tests/fixtures/quality/` | B's D-1, D-8 |
| Offer a skipped tool test as the proof of a catch | Run it with the tool on `PATH`; record red then passed | D-18 |
| Open a PR or commit in a stacks repository | Run read-only; record scrubbed counts; #216 carries adoption | No-gos |
| Paste raw tool output or a host name into `evidence/` | The scrubbed summary of D-7 | D-17; the repository is public |
| Leave a gap row as `gap` "for later" | `accepted` with the reason, or `fill` | DEC-2, DEC-7 |
| Restate a technique in the family file | Cite the owning skill | A's DEC-5, DEC-8 |

## Invariants

| Id | Invariant | Example | Write paths that can break it | Test |
|---|---|---|---|---|
| INV-1 | In a family in `CLOSED_FAMILIES` every row's status is exactly `exists` or `accepted`, and each `accepted` row has a reason | holds: `ui.md` with every row `exists` or `accepted` with text; breaks: a later PR adds a `gap → D` row to `documentation.md` | a stage's close step; any later edit of a family file (D's rows, a new check); a status in bold or backticks, a misspelt one, a reason holding a pipe that shifts the columns | tester: a property over generated family tables, that `closed_family_errors` reports exactly the rows whose status is not `exists` or `accepted` and the `accepted` rows with an empty *Check* cell; plus the fixture cases of task 0.3 |
| INV-2 | Every check C adds names a failure id that exists in its stage's survey file | holds: `CHK-<n>` ← `F-shaping-1` ← #143; breaks: Vale adopted with no rule marked | a stage's fill; a commit added after review | the stage checker reads the decision table against the diff, before the PR and again before the merge when review added commits (no automatic test: the survey moves at archive) |
| INV-3 | `quality/vale/` holds no style file | holds: `vale.ini` and the manifest; breaks: `styles/Microsoft/Passive.yml` left there by a `vale sync` run in the folder | stage 1's fill; a contributor syncing inside `quality/vale/`; a fixture copied from a style | the exact-contents test of D-9, which reads the folder on disk |
| INV-4 | No evidence or input file names a host, address, client or person from the infra repositories | holds: "`<stack>/Makefile`: 3 findings of rule `minphony`"; breaks: a pasted finding line with a real path | a tool-run summary; a failure row quoting an infra issue; the owner's answers copied to `inputs/qa.md`; a commit added after review | the stage checker (D-17); no automatic test |
| INV-5 | A PLAN's `## Invariants` section is never empty | holds: a table, or "None: `<why>`"; breaks: the heading alone | a PLAN derived from the template; a PLAN revised after its gate | none automatic: the rule is in `epic-planning` step 6; the gap is accepted and named in #143 (D-3) |

## Error matrix

The adversarial tester takes these rows as its targets.

| Failure mode | How it is detected | Expected handling |
|---|---|---|
| A closed family's file holds a row whose status is not exactly `exists` or `accepted`, or an `accepted` row without a reason, and the test does not report it (INV-1) | The tester's property on `closed_family_errors`; the fixture cases | Fix the function; never relax the property |
| B's stages 1 and 2 are not merged when C is to start | Task 0.2 | C waits (D-16) |
| B as delivered differs from the Context table (a path, the test home, the manifest fields and which files B's manifest test covers, the lint's allowed endings and whether it reads the disk, the tool pins and where the binaries land, the brief's Method and Read lines) | Task 0.2 | D-16: a `D-20+` delivery decision for a path or a form; a changed decision is a PLAN revision, gated again |
| A stage's gap rows no longer read as in the Context table | The stage's preflight | Copy them as they are; if a row was already closed or a new gap row appeared, the survey covers what is there |
| A survey finds no failure | The failures table is empty and lists the sources searched | D-14: an accept-only stage; valid |
| A failure fits no single technique, or belongs to another family | The decision line cannot name one technique | A skillery issue; the row is `accepted` with the issue number in its reason |
| A fill grows past one technique per gap, or a check has no failure id | The stage checker (INV-2); the lead's reading of the diff | Cut it; the overrun rule of `proposal.md` § Appetite |
| The owner marks no Vale rule | The answers of kind 2 | Vale is not adopted: its row is `accepted`, its requirements are deleted (D-14), the summary stays; DEC-7's fourth proof holds |
| More rules with findings than six per tool | The tool-run summary | D-6: the six with the most findings are asked; the rest are noise and stay listed |
| Vale's layout, pin form or command form differs from D-8 | The first step of task 1.3 | A `D-20+` delivery decision, confirmed by the owner in the round, before task 1.5 |
| A package is unavailable, relicensed or changed at its tag | The run fails, or the manifest check at a pin bump | Drop it from the candidates and record why; never vendor it |
| A style file lies under `quality/vale/` (INV-3) | The exact-contents test; B's `quality_files` lint if it reads the disk | Remove it; sync only in `tmp_path` or in a project's `.quality/` |
| The tester's Hypothesis test breaks collection in CI | CI's `make validate`, which has no Hypothesis | D-11: its own file, opening with `importorskip` |
| A tool is not installed where a run or a tool test executes | The command is not found | The run installs it into scratch (D-7); elsewhere the test skips, which is not proof (D-18) |
| No checkout of `infrastructure-stacks` in the delivery session | Stage 3's preflight | Ask the owner for one; without it stage 3 waits, and stages 4 and 5 go first only with the owner's agreement (D-16) |
| No `gh` access to the checkout's issues | The search fails in task 3.2 | Survey from the checkout's history and the owner round; record the source as not searched |
| The checkout has no Makefile | Stage 3's preflight lists none | D-7: one question to the owner before the run; on "record it", the fourth proof is listed as not met for checkmake and accepted |
| A file in the stacks checkout changed during a run | `git status` there after the run | Discard the checkout and take a fresh one; find what wrote, since neither tool does |
| A doc-only project cannot run `make quality-tools` | The target fails there (B's Non-Goals) | D-12: the writer installs ls-lint himself, or skips with the note |
| Evidence names a host, a client or a person (INV-4) | The stage checker | Scrub before the PR; if already pushed, rewrite the file and tell the owner |
| The recorded failure differs from the one a conditional scenario guessed, or the tool cannot express the scenario | The decision table against the delta | D-14: rewrite the scenario; the owner signs it off |
| A stage 5 survey calls for a check, and UI has no owning skill | The decision line cannot name an owner | D-14: an issue; the row is `accepted` with its number |
| The template heading leaves the schema copy stale | `bundle_gates` in `make validate`; `tests/test_bundle_gen.py` | `make bundles`; commit the result |
| The `epic-shape` requirement was changed by another change since the delta was written | `openspec validate activity-test-profiles --strict`; stage 2's preflight | Rewrite the MODIFIED block from the live text |
| A new `exists` row names an owner whose pointer line lacks the question or the file | `tests/test_test_strategy.py` (pointer check) | Extend the pointer line |
| Two branches take the same `CHK-<n>` | The rebase conflict in `inventory.md`; the stage checker (A's test does not see a duplicate) | Renumber C's id at the rebase |
| An addition would push `architecture`'s SKILL.md over its cap | `skill_too_long` (blocking) | D-14: a reference file only |
| An `accepted` reason points into `openspec/` | A Markdown link: `cross_skill_paths` (blocking); a plain path: the stage checker | D-10: the change id as text |
| The tester's report has no property for the INV-1 row | The lead, against D-13 | Return it once; then a finding to the owner; the third proof stays open |
| The lead dispatches the tester with the installed, older brief | The report has no table of properties | D-13: dispatch again with the brief read from the working tree |
| The before-run of the baseline already ties create to both stores, or the after-run does not | `evidence/baseline-shaping.md` | D-15 |
| A description changes without probes | The stage checker, against D-19 | Add the probe pair, or revert the description |
| C is ready to archive before B | Task 6.3 | D-16: wait |

## Risks / Trade-offs

- **RISK-1** B is delivered differently from its PLAN. Likelihood medium; impact medium.
  Mitigation: task 0.2 and D-16's rule for a difference.
- **RISK-2** The surveys find almost nothing, and three or four of five stages only accept.
  Likelihood medium to high; impact low. Accepted: the EPIC names this a valid outcome, and the
  matrix then says honestly what nobody has been hurt by yet.
- **RISK-3** New checks slow daily work (DEC-8). Likelihood medium; impact medium. Mitigation:
  D-12, nothing blocks by default and each check states its cost.
- **RISK-4** External styles or tools change, vanish or relicense (DEC-8). Likelihood low per year;
  impact low. Mitigation: tags and licences in the manifest; a bump is a new approval (B's DEC-6).
- **RISK-5** Infra or client detail leaks into this public repository through evidence. Likelihood
  medium without a rule; impact high. Mitigation: D-7 (raw output stays in scratch), D-17, INV-4.
- **RISK-6** The invariants section becomes boilerplate ("None" everywhere). Likelihood medium;
  impact medium. Mitigation: "None" needs a reason; the reference shows a real one. Accepted
  beyond that; a lint waits for a recorded failure.
- **RISK-7** The owner rounds make the owner the bottleneck of every stage. Likelihood medium;
  impact low. Mitigation: one round per stage of at most three kinds of call; stages 4 and 5 in
  one sitting.
- **Trade-off:** Vale and ls-lint are not wired into a project's docs gate, because
  `project-setup` is outside the EPIC's Impact. The writer runs them; a project may wire them.
- **Trade-off:** findings on skillery's own `docs/` serve as failure evidence although skillery
  adopts no check on itself.

## Open Questions

None blocking. Whether stage 4 or 5 fills anything is open by the EPIC's design (D-14).

## Delivery decisions

None yet. The lead adds entries here from `D-20` during delivery (D-14, D-16).
