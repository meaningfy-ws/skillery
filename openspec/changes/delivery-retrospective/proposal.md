# EPIC: Retrospective tooling — a home for the scripts, phase and stage on the record

## Appetite

MEDIUM. One new capability: a lean skill that holds the two retrospective scripts, with their
tests and docs. Two delivery skills and the navigator are touched lightly so that phase and stage
are written down instead of guessed.

## Why

The review of 14 November measured where two weeks of sessions spent their time and tokens, with
two scripts that now sit in this change's `inputs/`. They have no home, so the review cannot be run
again, and `test-suite-care` needs their numbers for the cost of a check. Their weakest figures are
the guessed ones: phase follows the last skill loaded, about 9% of cost has no phase, and stage is
not known at all (findings F-15, recommendation R-9 and R-11). The owner wants the review to be a
routine "self-reflection" run.

Golden-thread parents: the retrospective seed (decisions 4, 10, 14, 15, 17), the reassessment of
2026-11-15 (S-8 and the order, wave 4), and `delivery-process-and-tools` DEC-1 and DEC-18, which
this EPIC reads. The question round is in
[`inputs/elicitation-2026-11-15.md`](inputs/elicitation-2026-11-15.md).

## Solution outline

1. **A skill for the review.** `session-retrospective` holds `session_digest.py` and
   `epic_report.py` in its `scripts/` folder and says, in a lean body, how to run them, how to read
   the result and what the numbers cannot say. It is born within the lean standard.
2. **Phase and stage on the record.** At the start of each phase and of each stage, the lead writes
   one plain mark line, of the same kind as the result line. It reaches the local transcripts and,
   where the Langfuse plugin runs, the trace, with no tool call.
3. **The scripts read what is written.** The report takes phase and stage from the marks and the
   round outcomes from the result lines; where a session has no mark it falls back to the old guess
   and says so.
4. **Safe to run anywhere.** The scripts find the repository from the git root, never write their
   output into a repository, and warn when the transcript format has moved under them.

**It succeeds when** the scripts' tests pass in `make validate` on synthetic transcripts; a session
with marks is reported by phase and stage with no "guessed" row, and one without is labelled and its
guessed share printed; one run over the owner's last 14 days is no slower than the old scripts and
gives totals equal to theirs on the same transcripts, recorded without transcript text (the first
target, under a minute, was set aside by the owner in D-27: the run is I/O-bound, 262 s against
268 s); the agent scenario for the mark is walked by the owner on the released plugins; and the
navigator warns when a stage's first worker starts without a mark.

**It fails when** a digest or its text lands in this public repository; when a format change in the
transcripts makes the numbers fall silently instead of warning; when leads skip the mark and the
report still presents guesses as facts; or when the skill grows past the lean budget by carrying the
findings instead of pointing to the run.

## Key decisions

- **DEC-1**: A new skill, `session-retrospective`, in the `meaningfy-building` bundle, holds the
  two scripts in `scripts/` (seed decision 17). Its body says how to run and read a review; it
  carries no findings, which belong to the run that made them. Rejected: scripts in `tools/` (a
  repository tool, not installed with the catalogue); scripts inside `epic-delivery`.
- **DEC-2**: Phase and stage are recorded by a plain mark line the lead writes in its own message:

  ```text
  mark: change=<id> phase=<shape|plan|deliver> stage=<n|->
  ```

  It is written at the start of shaping, of the PLAN, and of each delivery stage; a session that
  carries on from a hand-over note writes it before its first brief. It stands as a whole line,
  never inside a code block or a tool input, and a turn that dispatches a worker repeats it in its
  last message, the only text the navigator sees (D-22). Owner's choice. Rejected: a
  script command (a tool call and a permission rule per machine); deriving it from the hand-over
  prompt and the branch only (shaping and stage 1 stay guesses); the navigator writing it (Claude
  Code only).
- **DEC-3**: The mark's form is defined once, in `epic-delivery`, beside the result line of
  `delivery-process-and-tools` DEC-18. `epic-planning` cites it and gives its own two lines
  (`phase=shape`, `phase=plan`). Rejected: a definition in the new skill, which a lead does not load.
- **DEC-4**: Archive and release write no mark. Their skills are distinct, so the old guess holds
  for them, labelled "guessed". Rejected: marks in `spec-stewardship` and `meaningfy-release`
  (two more skills edited for little gain).
- **DEC-5**: The report takes phase and stage from the latest mark of the session and the outcome
  of each round from its result line. A session or a stretch with no mark keeps the skill-based
  guess, every such row is labelled `guessed`, and the share of cost that is guessed is printed.
- **DEC-6**: The scripts read the local transcripts, not Langfuse, which holds about a third fewer
  events (F-14). The mark and the result line are plain text, so a Langfuse reader written later
  finds them in the model outputs. Rejected: a Langfuse reader in this EPIC.
- **DEC-7**: Private text stays private. The digest is written outside any git working tree by
  default and the script refuses an output folder inside one; test fixtures are synthetic; the
  evidence of the real run holds numbers, never prompts, reports or commands. skillery is public.
- **DEC-8**: The digest counts every record type it does not know and warns when they pass a
  threshold, so that a change in the undocumented transcript format shows instead of lowering the
  numbers in silence.
- **DEC-9**: The repository of a session is the git root of its working directory (the main
  repository for a worktree), not a folder under `~/work/repos/`. Rejected: the owner's folder
  layout.
- **DEC-10**: The navigator warns when the lead dispatches its first worker in a session that has
  an open change and has shown no mark line. A warning, never a block. Claude Code only; on
  opencode the "guessed" label is the only signal, recorded as a parity gap.
- **DEC-11**: Proof of done is the five checks under "It succeeds when". The agent scenario is
  walked by hand, as the repository's other agent scenarios are.

## Rabbit-holes

- **The real run is the owner's data.** The 2026-11-14 window rolls out of the transcripts (Claude
  Code deletes old ones), so the run compares the new scripts with the old ones on the same
  transcripts, not with the published figures.
- **A mark the lead writes late.** Events before the first mark of a session are attributed by the
  guess, not back-filled from the mark; back-filling is the trap.
- **The two result-line writers.** The worker writes `accepted=-`, the lead writes the line again
  with the count in the pull request (`delivery-process-and-tools` DEC-18). The report must not
  count one round twice.
- **The lean budget.** The body near 6 KB; the old findings and the script docstrings stay out of
  it. The run and the report are the record.
- **`epic-delivery` is on the pending list** of the lean standard and over budget; adding the
  mark there is a few lines, and its lean rewrite comes later (`lean-skills`).
- Left to the PLAN: the threshold of DEC-8, the default output folder, and where in each skill the
  mark sentence sits.

## No-gos

- No change to the form or the owner of the result line (`delivery-process-and-tools` DEC-18).
- No Langfuse reader, no Langfuse prices, no change to the Langfuse plugin or its settings (seed
  decision 10).
- No opencode session reader; transcripts of Claude Code only, the gap recorded.
- No automatic run at archive or on a schedule; the skill says when to run it, a person runs it.
- No mark in `spec-stewardship` or `meaningfy-release` (DEC-4), and no new hook or mod.
- No new agent.
- No digest, transcript text or per-session figure committed to this repository.
- No rewrite of `epic-delivery` or `epic-planning` beyond the mark (`lean-skills` owns that).

---

## What Changes

- New skill `skills/session-retrospective/` with `scripts/session_digest.py` and
  `scripts/epic_report.py`, moved from this change's `inputs/scripts/` and changed for DEC-5 to
  DEC-9; declared in the `meaningfy-building` bundle.
- `epic-delivery`: the mark line's form and the lead's duty to write it at each stage (DEC-2,
  DEC-3).
- `epic-planning`: the lead writes the mark at the start of shaping and of the PLAN (DEC-3).
- Navigator mod: a warning for a first worker dispatched without a mark (DEC-10).
- `docs/environment/langfuse-setup.md`: the "phase, stage" row points to the mark.
- Tests: `tests/test_session_retrospective.py` with synthetic fixtures; a navigator unit test; an
  agent scenario under `tests/features/`.

## Capabilities

### New Capabilities

- `session-retrospective`: running the review over the local transcripts and reading phase,
  stage and round outcomes from what the sessions wrote.

### Modified Capabilities

- `epic-delivery`: the lead writes the mark line at each stage.
- `epic-shape`: the lead writes the mark line at shaping and at the PLAN.
- `session-navigation`: the warning for a first worker without a mark.

## Impact

- Skills `session-retrospective` (new), `epic-delivery`, `epic-planning`; the navigator mod; the
  generated `bundles/` tree and the inventory.
- `test-suite-care` takes its cost numbers from these scripts (reassessment, wave 4; its stage 3
  runs after this EPIC).
- Every repository that installs skillery: its leads write one more line per phase and stage.
- Delivered in wave 4, after `delivery-process-and-tools`, whose result line and hand-over notes it
  reads.
