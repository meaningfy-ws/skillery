# PLAN (tasks): One orchestrator, pointing to skills kept elsewhere

> Derives from: the EPIC [`proposal.md`](proposal.md) (`orchestrate-external-skills`); the how is in
> [`design.md`](design.md). Every stage is one pull request into `develop`, merged on green CI;
> stage 1 is two (D-1).

## 1. Stage 1a: the book sets (wave 2; unblocks the `lean-skills` pilot)

- [x] 1.1 Check the installer (design, Algorithm step 1): with `DO_NOT_TRACK=1` and `HOME`,
  `CLAUDE_CONFIG_DIR` and `XDG_CONFIG_HOME` set to scratch folders, run
  `npx skills@1.8.1 add meaningfy-ws/agent-rules-books --list` and the same for
  `meaningfy-ws/wondel-ai-skills`; confirm the 24 names of D-3; install one skill per fork with the
  full-commit ref of the Context, once with `--agent claude-code` and once with `--agent opencode`,
  and note where the files land and whether any telemetry left; record the form that installs
  several skills in one command (space-separated after one `--skill`, or `--skill` repeated). Write
  `evidence/install-check.md` with each command and its result. Done when every error-matrix row
  that task 1.1 detects has an answer there.
- [x] 1.2 Write the failing tests. In `tests/test_repo_lint_negative.py`: TC-1 an entry whose
  `bundle` names no bundle (message `dependencies.yaml: '<name>' bundle '<b>' is not a bundle of
  bundles.yaml`); TC-2 a `bundle` on a non-`skill` entry (`… 'bundle' needs kind 'skill'`); TC-3 a
  `bundle` with an empty `skills:` list (`… 'bundle' needs a non-empty 'skills' list`). In
  `tests/test_skill_inventory.py`: TC-4 the `external-skills-claude` table and TC-5 the
  `external-skills-opencode` table rendered from a synthetic register, asserting the exact row
  text, for example ``| meaningfy-core | technical-documentation | `DO_NOT_TRACK=1 npx skills@1.8.1
  add … --agent claude-code --global --yes` |``, one two-skill row (`a, b`), and a register with no
  `bundle` entries (the header line only). Run them: they fail for the right reason.
- [x] 1.3 Implement D-8 in `tools/repo_lint/lint.py` (`bundle` in `_DEP_OPTIONAL`, its three rules)
  and D-7 in `tools/skill_inventory.py` (the two tables in `_DEP_TABLES`, the first-column and
  list-cell change in `render_dependencies`, both setup docs in `DEPENDENCY_DOCS`). The tests of 1.2
  pass and the existing tables render unchanged.
- [x] 1.4 Dispatch reader A (D-5) on the 8 book sets at `893a88a6fce3a80c565bf39ac65021b43a8b2990`.
  Done when `evidence/reading/` holds 8 records. Spec: `external-dependency-register`, "read in
  full".
- [x] 1.5 Check the 8 records: each file table against `find <folder> -type f` and `wc -c` in the
  fork; the 12-word overlap script (scratchpad, not committed); no links to fork files. Done when
  every record passes.
- [x] 1.6 If any record marks a conflict "not named", ask the owner in one question round, each
  with a recommendation (override with its wording, drop, or accept). Record the answers in
  `inputs/stage-1a-conflicts-<date>.md`; a drop is a new DEC in `proposal.md` (D-6). Done when
  every such conflict has an answer, or none was found.
- [x] 1.7 Add to `dependencies.yaml` the entries `agent-rules-books/meaningfy-building`,
  `agent-rules-books/meaningfy-architecture` (D-2, D-3) and `skills-cli`, with the commands and pin
  that task 1.1 proved, for the sets read and not dropped. Spec: `external-dependency-register`, "a
  skill source per fork and bundle".
- [x] 1.8 Add the heading "External skills of your bundles (per role)" with its generated marker
  after Step 4 of `docs/environment/dual-cli/setup-claude.md` and `setup-opencode.md`, with the
  POSIX-shell note and the "run only the claude-code command if you use both" note; add the sync
  paragraph of D-4 to `docs/environment/dual-cli/compatibility.md`; run `make skill-inventory`.
- [x] 1.9 Run `make lint` and `make validate` (which runs `make mods`, the navigator's TC-16 that
  reads the new `skills:` lists, and `pytest tests/test_dep_skills_adversarial.py`); CHANGELOG line
  under `[Unreleased]` for the installer; open the pull request, merge on green CI, tick 1.1 to
  1.9; tell the `lean-skills` pilot it can start
  ([its stage table](../archive/2026-11-16-lean-skills/design.md#stages-2-to-5-outline), row "2 pilot").

## 2. Stage 1b: the wondel skills (wave 2, after 1a)

- [ ] 1.10 Dispatch readers B to G (D-5) in parallel on the 16 skills at
  `c5265583b1a9740f06831e1d3e89b35bba3eb430`, top-level folders only. Done when
  `evidence/reading/` holds 16 more records.
- [ ] 1.11 Check the 16 records as in 1.5; a second reader re-reads `negotiation`,
  `hundred-million-offers` and `monetizing-innovation` and adds any missed conflict. Done when every
  record passes and the additions are in.
- [ ] 1.12 Ask the owner, in one question round, every conflict marked "not named", grouped by
  kind, as in 1.6; record `inputs/stage-1b-conflicts-<date>.md`. Done when every such conflict has
  an answer.
- [ ] 1.13 Add the entries `wondel-ai-skills/meaningfy-sales`, `wondel-ai-skills/meaningfy-consulting`
  and `wondel-ai-skills/meaningfy-core` (D-2, D-3), for the skills read and not dropped; run
  `make skill-inventory`.
- [ ] 1.14 `make lint`, `make validate` (with `make mods`); CHANGELOG line; open the pull
  request, merge on green CI, tick 1.10 to 1.14.

## 3. Stage 2: the orchestrator skill (wave 3, after `lean-skills` stage 1 and `generic-task-test-profiles`)

- [ ] 2.1 Write the failing tests of `orchestration_coverage` (D-11, its row reading and message
  shapes) in `tests/test_repo_lint_negative.py` on synthetic roots: TC-6 a `skills/` folder with no
  row; TC-7 a row naming an unregistered external skill; TC-8 an external skill in another bundle's
  reference; TC-9 a root without `skills/skill-orchestration` (check returns nothing); TC-10 an
  agent in column 2 passes; TC-11 a Meaningfy name after the colon in column 3 is not read as
  external; TC-13 a registered external skill in no row; TC-14 a column-2 name that is neither a
  skill nor an agent (both with D-11's message shapes). And in `tests/test_skill_inventory.py`,
  TC-12 the `external-skills-install` table (one row per skill, each command with that one
  `--skill`; an install field without `--skill` fails the render).
- [ ] 2.2 Implement `orchestration_coverage` in `tools/repo_lint/lint.py` and add it to
  `ALL_CHECKS`; add `external-skills-install` to `_DEP_TABLES` in `tools/skill_inventory.py`. The
  tests of 2.1 pass.
- [ ] 2.3 Write `skills/skill-orchestration/SKILL.md` (D-9, D-10): body near 6 KB including the nine
  pointer sentences in the `reference_pointers` form, the overrides
  of DEC-7, DEC-19, DEC-20, the PoEAA rule and tasks 1.6 and 1.12, the fallback rule, the
  no-house-rule sentence, Quick Start with one worked example, `## Boundary & Related Skills`, the
  six facets under `metadata`.
- [ ] 2.4 Write the nine `references/<bundle>.md` tables from the reading records of stage 1, and
  `assets/install.md` with its generated marker (added to `DEPENDENCY_DOCS`); run
  `make skill-inventory`. Spec: `skill-orchestration`, all requirements.
- [ ] 2.5 Add the probes of D-12 to `tests/trigger_probes.yaml` and the 20-query set
  `tests/evals/triggers/skill-orchestration.json` (10 positives, 10 near-misses).
- [ ] 2.6 Add the skill to `meaningfy-core` in `bundles.yaml` and to the `served_by` of
  `use-cases/UC-W13-negotiation-partner.md` (the first goal it routes); run `make bundles`,
  `make skill-inventory`.
- [ ] 2.7 README entry-point row, CHANGELOG line; `make validate` green with the positive
  `orchestration_coverage` test on the real tree; open the pull request, merge on green CI.

## 4. Stage 3: pointers and the sales cut (wave 3, after stage 2)

- [ ] 3.1 Add the pointer line of D-13 to each Meaningfy skill and agent named as owner in a row
  with external help (list from the stage 2 rows). Spec: `skill-orchestration`, "reached from a
  pointer line". *Revised 2026-11-16 (D-22):* `architecture` (24,576) and `sales-conversations`
  (24,564) have no room for the line; offset its bytes in the same pull request, or ask the owner (D-25).
- [ ] 3.2 First write the list of headings cut and kept per file (D-14); then cut the restatement
  of Voss and Hormozi in the three files, keeping every
  Meaningfy restriction; a second reader compares before and after and confirms nothing of ours
  was lost; update `skill-budget.yaml` if `prose_budget` asks. Spec: `sales-method-ownership`.
  *Revised 2026-11-16 (D-23, D-24):* no `skill-budget.yaml` step, nothing is pending; the cut is
  only the lines D-24 lists (owner's answer (b)), one pointer per file, and it pays for the 3.1
  line in `sales-conversations`.
- [ ] 3.3 Add a Gherkin scenario to the feature file of each agent that gained a line
  (`tests/features/agents/`), and write `tests/features/skill-orchestration.feature` with the
  routing, override and missing-skill scenarios of D-16.
- [ ] 3.4 Write the five missing trigger sets of D-16 (`sales-conversations`,
  `sales-qualification`, `semantic-consulting-coach`, `technical-writing`, `cosmic-python`), 10
  positives and 10 near-misses each, seeded from the probes, fixed before any run.
- [ ] 3.5 `make bundles`, `make skill-inventory`, `make validate`; CHANGELOG line; open the pull
  request, merge on green CI.

## 5. Stage 4: the proofs (wave 3, after stage 3)

- [ ] 4.1 Show the owner the estimate of the model runs of D-16 (routing, overrides, six trigger
  sets before and after) and get the yes.
- [ ] 4.2 Build the scratch configuration of D-16; run the routing scenarios with `claude -p`; fix
  a failure once in the reference row and rerun once; take a second failure to the owner; record
  `evidence/proof-routing.md`.
- [ ] 4.3 Run the override scenarios; fix a failure once in the orchestrator's wording and rerun
  once; take a second failure to the owner; record `evidence/proof-overrides.md`.
- [ ] 4.4 Run the six trigger sets before and after installing the external skills; record
  `evidence/proof-triggers.md` with the pass rule of
  [`tests/evals/README.md`](../../../tests/evals/README.md#trigger-sets).
- [ ] 4.5 Record opencode as a gap in the dual-CLI documents if it was not tried (DEC-14); open the
  pull request, merge on green CI. The change is then ready for `spec-stewardship` to archive.

## Roadmap

- [x] 1.1 · [x] 1.2 · [x] 1.3 · [x] 1.4 · [x] 1.5 · [x] 1.6 · [x] 1.7 · [x] 1.8 · [x] 1.9
- [ ] 1.10 · [ ] 1.11 · [ ] 1.12 · [ ] 1.13 · [ ] 1.14
- [ ] 2.1 · [ ] 2.2 · [ ] 2.3 · [ ] 2.4 · [ ] 2.5 · [ ] 2.6 · [ ] 2.7
- [ ] 3.1 · [ ] 3.2 · [ ] 3.3 · [ ] 3.4 · [ ] 3.5
- [ ] 4.1 · [ ] 4.2 · [ ] 4.3 · [ ] 4.4 · [ ] 4.5

In 1a, 1.1, 1.2 to 1.3 and 1.4 can run in parallel. 1.10 can start as soon as 1.1 is done; its
pull request waits for 1a's.

## Verification

Each pull request: `make validate` green and CI green on its head. The change: the three proofs of
DEC-14 recorded in `evidence/proof-*.md` and passing.
