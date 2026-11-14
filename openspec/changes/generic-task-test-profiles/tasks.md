<!-- PLAN (tasks half), derived 2026-11-14; the attack (AT-1..AT-21) is folded in; clarity
     gate 9.0/10 PASS (run 5); re-shaped the same day on DEC-11 (an assessment, not a test)
     and gated again, 9.1/10 PASS (run 7). Reconciled 2026-11-14 with the sibling changes and
     with A as delivered: design § Delivery decisions, D-15 to D-26. Revised 2026-11-14 by
     owner decision (D-27, the reader's tool list); not gated again. Revised 2026-11-15 after the
     owner's settlement of the open EPICs (design D-28 to D-32); not gated again. -->

> Derives from: EPIC `generic-task-test-profiles` ([`proposal.md`](proposal.md)); design in
> [`design.md`](design.md). EPIC A `test-strategy` is delivered (2026-11-14). Order (D-32): this
> EPIC is wave 2 of 2026-11-15, so it starts after R3 (the tool table) and after R1 stage 1 (the
> lean standard), and lands before the main part of R2 and before B, C and E.

## 1. Stage 1: the reader

- [ ] 1.0 The developer signs off the spec scenarios of this change (the PLAN gate), recorded in
  `evidence/acceptance.md` (D-14). At the same sign-off the owner answers three proposed points,
  and the answers are recorded there:
  - D-19: does the two-of-three bar of the planted-flaw check go, so that the counts are
    recorded and the owner judges?
  - D-21: does a post get two reads at most, like the other kinds, or one?
  - D-25: do `CHK-102` and `CHK-95` stay beside the new steps, as D-25 divides the work?
  - D-27 *(added 2026-11-14 by owner decision; superseded 2026-11-15 by D-28, which cites the
    tool table of `guardrails`: no question is left on it)*: is the reader's tool list carried by
    the brief only in stage 1, with the choice of a reader agent left until its starting context
    is measured?
- [ ] 1.1 Confirm the branch is on current `develop`. Read R-1..R-12 of design § *Checked against
  A as delivered* against `skills/test-strategy/` again; fix this PLAN first where one
  fails. Re-read each spec delta against the live specs (RISK-7). After each later rebase on
  `develop`, the lead reruns `make bundles` and `make skill-inventory` and takes the next free
  check ids (D-26).
  *Added 2026-11-15 (D-28, D-29, D-32):* confirm that R3 and R1 stage 1 are merged; read the tool
  table of `guardrails` and check that its row for reading prose is `Read`, `Grep` and `Glob`
  (the reader agent follows the table if it differs); measure `guardrails` with `wc -c`
  (`SKILL.md` and `references/`) and record the figure in `evidence/` as the starting size of
  D-29.
- [ ] 1.2 Write the two fabricated offers, `offer-planted.md` and `offer-clean.md`, under
  `evidence/planted-flaw/`; nothing under `tests/` (D-11, DEC-11). The planted flaw is the one of
  D-18, a claim about past work that names no work, and not the scope and price mismatch of D-11.
  Read the planted offer against `skills/proposal-writing/references/scope-boundary-checklist.md`
  (`CHK-91`) and record that every line of it passes.
- [ ] 1.3 Write `evidence/baseline/inputs.md` (the four prompts and the prompt sentence). Run the
  calibration call and get the owner's approval of the amount. Run the four *without* runs with
  the command of D-11, the plugin built from the base commit; record the commit and O-1..O-4 and
  keep the drafts (D-11). Write `evidence/failure-case.md` from them and from
  the three `gap → D` rows of A's `generic-writing.md` (D-14).
- [ ] 1.4 Write `tests/test_generic_task_profiles.py` with the stage-1 assertions of D-11 (the
  three lines present in the reference and nowhere else), each with its passing and failing
  example line; red before 1.5, green after. Add the
  `adversarial-reader-brief` entry to `tests/ownership.yaml`.
- [ ] 1.5 Write `skills/guardrails/references/adversarial-reader.md` with the eight sections of D-1
  and the brief of design § *Algorithm*; add the bullet to § 5 of `guardrails`' SKILL.md and
  change its description as D-1 says, from 681 to 687 characters by the lint's count (D-23); its
  pointer line for `test-strategy` stays as A wrote it (D-1, D-10, D-3's rule, D-6..D-9; spec
  `subagent-dispatch`, both requirements).
  *Reconciled 2026-11-14:* the `subagent-dispatch` delta now has three requirements, not two;
  `skills/guardrails/references/subagent-reports.md` (the reviewing fields, which list a
  verdict) gains the reader's exception.
  *Revised 2026-11-14 (D-27, DEC-13):* add the thin agent `agents/adversarial-reader.md`
  (`tools: [Read, Grep, Glob]`, no method in its body), declare it in `bundles.yaml` beside
  `guardrails`, add `tests/features/agents/adversarial-reader.feature`, and run `make bundles`.
  *Revised 2026-11-14 (D-27), changed 2026-11-15 (D-28):* section 5 of the reference states no
  tool list: it names the table of `guardrails`; the brief carries the line "Tools: `<the tools the
  table gives for this read>`, and no other."
  *Added 2026-11-15 (D-29):* the reference is written to the lean shape and is at most 5.5 KB;
  section 2 is one sentence; the body gains one pointer line (when to open the reference and what
  it adds) in place of the two-line bullet, at most 0.3 KB; the exception in
  `subagent-reports.md` is at most 0.2 KB. Measure `guardrails` again and record the growth, which
  must not pass 6 KB nor take the skill past 24 KB of prose; if it would, cut the reference.
- [ ] 1.6 Probes for `guardrails` in `tests/trigger_probes.yaml` (D-12); its description before
  and after in `evidence/probes.md`. Run `make skill-inventory`. The near-miss of D-12 ("have a
  cold reader test this installation manual", expects `technical-writing`) is the probe that
  keeps the adversarial reader apart from the cold reader (D-24).
- [ ] 1.7 The offer's planted-flaw check: tell the owner the number of runs, then six reader runs
  (the two offers of 1.2, three each), with the sceptical-buyer role, the *Attacks* bullets and
  the example criteria of D-3 quoted in the brief, plus the criterion of D-18; the bullets used,
  the counts and the D-11 bar (or the owner's answer on D-19) in `evidence/planted-flaw.md`. On
  a miss, sharpen and repeat all six, twice at most; then the owner.
  *Revised 2026-11-14 (D-27), changed 2026-11-15 (D-28, D-31):* each run is a start of the thin
  reader agent, whose tools are the table's; the *Attacks* bullets used are the cut ones of D-31
  (the general ones and those of `CHK-91` are not used); the tokens of each run's first call are
  recorded in the same file.
- [ ] 1.8 `make validate` green; the stage's PR.

## 2. Stage 2: the profiles

Tasks 2.1 to 2.5 leave each skill's pointer line for `test-strategy` as it is. A's test demands
that the line matches the skill's `exists` rows, and those rows arrive in 3.1 (D-15).

- [ ] 2.0 Add the stage-2 assertions of D-11 to the test file (the section in five files, the role
  allow-lists with the hyphen form); red before 2.1–2.5, green after.
- [ ] 2.1 `proposal-writing`: the `## Review profile` section, its *Attacks* bullets as they were
  used in 1.7 (`evidence/planted-flaw.md`; one to three, D-31; the other four skills follow D-31
  in 2.2 to 2.5, each section at most about 1 KB), the criteria sentence in *Flow* step
  1, the new step 5 (D-2, D-3; spec `sales-method-ownership`, *The offer
  profile has one owner*).
- [ ] 2.2 `contract-practice`: the section, the fifth intake bullet, the *review* row and the
  sentence under *Lawyer-review flag* (a finding on a number, or on a term that changes what a party can claim or must do, is an open
  point); the workflow file is not touched (D-2, D-3, D-6; spec `legal-contract-practice`).
- [ ] 2.3 `meaningfy-voice`: the section with its two step lines in
  `references/channels/linkedin.md`, the pointer and differences in `blog.md`, lines 23–24 of
  SKILL.md, the description's post trigger (D-2, D-3, D-14; spec
  `company-voice`, both requirements).
- [ ] 2.4 `executive-communication`: the section, the criteria and reader lines in *Start here*,
  (D-2, D-3; spec `executive-communication`).
- [ ] 2.5 `sales-conversations`: the section, the subsection *In an attended session: criteria and a reader* (pick-up included)
  under *Workflow*; `sales-operations` is not touched (D-2, D-3, D-4; spec
  `sales-method-ownership`, *The sales-message profile has one owner*).
  *Added 2026-11-15 (D-30, D-31):* add only after the passages R2 later cuts are left alone; the
  text restates no external sales method; the section is at most about 1 KB, with one to three
  *Attacks* bullets.
- [ ] 2.6 Feature files: add the scenarios of design § *Scenarios* to the three files, with the
  `# Traces to:` line and the extra Given line in `proposal-writer.feature`; add `guardrails` to
  the Background skill lists of `proposal-writer.feature` and `sales-agent.feature` (D-5, D-11).
- [ ] 2.7 Agents: edit `agents/proposal-writer.md` and `agents/sales-agent.md` as D-5 lists, in the
  same commit as 2.6; run `make bundles`. Run the scenarios by hand on both CLIs and record per CLI
  what happened in `evidence/agent-scenarios.md`, step by step and with no contract text (D-11); force *No reader can be started* on Claude Code
  with `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH=1`, and on opencode record what the CLI allows (D-5,
  D-7, RISK-1).
- [ ] 2.8 Static probes for `meaningfy-voice` (D-12) and its description before and after in
  `evidence/probes.md` (spec `company-voice`, *A request for a post finds the profile*). Run
  `make skill-inventory`.
- [ ] 2.9 Before 2.3: write `tests/evals/triggers/meaningfy-voice.json`, get the owner's approval
  of the estimate, and run the set twice on the skill as it is: "before" as is, "after" with
  `--description` and the candidate text. Record the result in
  `inputs/evidence/triggers-meaningfy-voice.md`; 2.3 writes the description that passed (D-12,
  RISK-6).
- [ ] 2.10 `make validate` green; the stage's PR.

## 3. Stage 3: the rows and the proofs

- [ ] 3.1 Add the stage-3 assertions of D-11 to the test file (red). Then, in one commit, so
  that `tests/test_test_strategy.py` stays green (D-10, D-15, D-17; spec `test-strategy`):
  - `skills/test-strategy/references/inventory.md`: the next five free ids (`CHK-145` to
    `CHK-149` only if B, C and E have taken none; where the design names `CHK-147`, read "the id
    the post's check received"; reconciled 2026-11-14);
  - `generic-writing.md`: the ten rows of D-10 and the `ADQ` row set to status `accepted` with
    its reason, no row left naming D. If `test-suite-care`'s stage 3 has added the words
    "assessed on request by `CHK-<m>`" to a row, they stay. In line 3, the sentence on
    "`gap → D` rows" goes;
  - the pointer line of each technique owner, as D-10 lists them: `proposal-writing` and
    `contract-practice` to `VAL, VER, ROB, RSK`, `meaningfy-voice` and `executive-communication`
    to `VAL, ROB, CLR`, and a new line with `VAL, ROB` in `sales-conversations`;
  - `skills/test-strategy/SKILL.md`: the Quick Start's sentence on the `VAL` row (lines 33–34),
    and the two cells "none yet (a gap)" in the column *Example in a post* (lines 67–68): the
    `ROB` cell names the adversarial reader's read, the `ADQ` cell says the gap is `accepted`.
- [ ] 3.2 Run the four *with* runs, isolated, from the head of stage 2, with the prompts of 1.3;
  complete `evidence/baseline.md` with the pairs and O-1..O-4.
- [ ] 3.3 Docs: the two CHANGELOG lines, the `docs/future-features.md` row, `guardrails` under
  `served_by.skills` of UC-W7, UC-W8, UC-W16 and UC-W24. File a GitHub issue for
  the follow-up of RISK-11 (a blog explainer written through `explanatory-writing` gets no
  criteria and no reader; `add-content-creation` owns the fix) and cite the issue in the PR
  (D-14, D-22).
- [ ] 3.4 `make bundles`, `make validate`, `openspec validate generic-task-test-profiles --strict`.
- [ ] 3.5 Acceptance demo with the developer: one offer from request to hand-over, one pick-up of a
  sales draft, the baseline pairs with the owner's O-5 answers, and the scheduled scenario's
  hand-run result from 2.7 (RISK-2, RISK-3); recorded in `evidence/acceptance.md` (D-11, D-14; LARGE makes it
  mandatory).

## Roadmap

- [ ] 1.0 · [ ] 1.1 · [ ] 1.2 · [ ] 1.3 · [ ] 1.4 · [ ] 1.5 · [ ] 1.6 · [ ] 1.7 · [ ] 1.8 · [ ] 2.0
  · [ ] 2.9 · [ ] 2.1 · [ ] 2.2 · [ ] 2.3 · [ ] 2.4 · [ ] 2.5 · [ ] 2.6 · [ ] 2.7 · [ ] 2.8 · [ ] 2.10 · [ ] 3.1
  · [ ] 3.2 · [ ] 3.3 · [ ] 3.4 · [ ] 3.5

Tasks 2.1 to 2.5 touch different files and may run in parallel, once 2.9 is done. The pointer
lines of the five skills change in 3.1, with the rows (D-15). This change lands in wave 2 (D-32),
after A, R3 and R1 stage 1; D-26 says what the lead reruns after each rebase.

## Verification

`make validate` green at the end of each stage, which includes
`tests/test_generic_task_profiles.py`, the agent and agent-feature lint, the bundle gates and the
static probes. Also required: `openspec validate generic-task-test-profiles --strict`; the
offer's planted-flaw check shown (`evidence/planted-flaw.md`); the baseline result, *Proven* or not (`evidence/baseline.md`);
the behavioural run of `meaningfy-voice` (`inputs/evidence/triggers-meaningfy-voice.md`); the agent
scenarios run on both CLIs (`evidence/agent-scenarios.md`); and the developer's verdict in
`evidence/acceptance.md`.

After the release that ships this change, and not a task of it: the owner reads the first week of
scheduled sales run notes (RISK-2).
