<!-- PLAN (tasks half), derived 2026-11-14; the attack (AT-1..AT-21) is folded in. Not yet gated. -->

> Derives from: EPIC `generic-task-test-profiles` ([`proposal.md`](proposal.md)); design in
> [`design.md`](design.md). Starts after EPIC A `test-strategy` is delivered.

## 1. Stage 1: the reader

- [ ] 1.0 The developer signs off the spec scenarios of this change (the PLAN gate), recorded in
  `evidence/acceptance.md` (D-14).
- [ ] 1.1 Confirm A is delivered and the branch is on current `develop`. Check R-1..R-11 of design
  § *Re-check once A is delivered* against `skills/test-strategy/`; fix this PLAN first where one
  fails. Re-read each spec delta against the live specs (RISK-7).
- [ ] 1.2 Write the five fixtures and `expected.yaml` under `tests/fixtures/readers/`, fabricated,
  the contract ones as term tables in plain words (D-11; live spec `legal-contract-practice`,
  scenario *No contract material in skillery*).
- [ ] 1.3 Write `evidence/baseline/inputs.md` (the five prompts, B-2's with the term table of 1.2
  inline, and the prompt sentence). Get the owner's approval of the estimate for the ten baseline
  runs. Run the five *without* runs, isolated, in an empty scratch directory, with the plugin
  built from the base commit; record the commit and O-1..O-4 and keep the drafts (D-11). Write
  `evidence/failure-case.md` from them and from A's inventory gap line (D-14).
- [ ] 1.4 Write `tests/test_generic_task_profiles.py` with the fixture checks and the stage-1
  assertions of D-11 (the three lines present in the reference and nowhere else), each with its
  passing and failing fixture line; red before 1.5, green after. Add the
  `adversarial-reader-brief` entry to `tests/ownership.yaml`.
- [ ] 1.5 Write `skills/guardrails/references/adversarial-reader.md` with the eight sections of D-1
  and the brief of design § *Algorithm*; add the bullet to § 5 of `guardrails`' SKILL.md and
  change its description as D-1 says, to 690 characters at most (D-1, D-3's rule, D-6..D-9; spec
  `subagent-dispatch`, both requirements).
- [ ] 1.6 Probes for `guardrails` in `tests/trigger_probes.yaml` (D-12); its description before
  and after in `evidence/probes.md`. Run `make skill-inventory`.
- [ ] 1.7 Planted-flaw proof: fifteen reader runs (five fixtures, three each), with the role and
  *Attacks* of D-3 passed in the brief, as the profiles are not written yet; the counts and the
  D-11 bar in `evidence/planted-flaw.md`. On a miss, sharpen and repeat all fifteen, twice at most;
  then the owner.
- [ ] 1.8 `make validate` green; the stage's PR.

## 2. Stage 2: the profiles

- [ ] 2.0 Add the stage-2 assertions of D-11 to the test file (the section in five files, the role
  allow-lists with the hyphen form); red before 2.1–2.5, green after. In 2.1–2.5 the *Attacks*
  bullets are those of D-3, word for word.
- [ ] 2.1 `proposal-writing`: the `## Test profile` section, the criteria sentence in *Flow* step
  1, the new step 5, the pointer line (D-2, D-3, D-10; spec `sales-method-ownership`, *The offer
  profile has one owner*).
- [ ] 2.2 `contract-practice`: the section, the fifth intake bullet, the *review* row and the
  sentence under *Lawyer-review flag* (a fail on a number or a term is an open point), the pointer
  line; the workflow file is not touched (D-2, D-3, D-6; spec `legal-contract-practice`).
- [ ] 2.3 `meaningfy-voice`: the section with its two step lines in
  `references/channels/linkedin.md`, the pointer and differences in `blog.md`, lines 23–24 of
  SKILL.md, the description's post trigger, the pointer line (D-2, D-3, D-14; spec
  `company-voice`, both requirements).
- [ ] 2.4 `executive-communication`: the section, the criteria and reader lines in *Start here*,
  the pointer line (D-2, D-3; spec `executive-communication`).
- [ ] 2.5 `sales-conversations`: the section, the subsection *At pick-up: criteria and a reader*
  under *Workflow*, the pointer line; `sales-operations` is not touched (D-2, D-3, D-4; spec
  `sales-method-ownership`, *The sales-message profile has one owner*).
- [ ] 2.6 Feature files: add the scenarios of design § *Scenarios* to the three files, with the
  `# Traces to:` line and the extra Given line in `proposal-writer.feature`; add `guardrails` to
  the Background skill lists of `proposal-writer.feature` and `sales-agent.feature` (D-5, D-11).
- [ ] 2.7 Agents: edit `agents/proposal-writer.md` and `agents/sales-agent.md` as D-5 lists, in the
  same commit as 2.6; run `make bundles`. Run the scenarios by hand on both CLIs and record per CLI
  what happened in `evidence/agent-scenarios.md`; force *No reader can be started* on Claude Code
  with `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH=1`, and on opencode record what the CLI allows (D-5,
  D-7, RISK-1).
- [ ] 2.8 Probes for `meaningfy-voice` (D-12) and its description before and after in
  `evidence/probes.md`. Write `tests/evals/triggers/meaningfy-voice.json`, get the owner's approval
  of the estimate, run it before and after the description change, and record the result in
  `inputs/evidence/triggers-meaningfy-voice.md` (RISK-6; spec `company-voice`, *A request for a
  post finds the profile*). Run `make skill-inventory`.
- [ ] 2.9 Repeat the fifteen planted-flaw runs once, the brief's "Attack along" line naming the
  skill's file; same bar, added to `evidence/planted-flaw.md` (D-11).
- [ ] 2.10 `make validate` green; the stage's PR.

## 3. Stage 3: the rows and the proofs

- [ ] 3.1 Add the stage-3 assertions of D-11 to the test file (red). Then
  `skills/test-strategy/references/inventory.md`: the five checks; `generic-writing.md`: the ten
  rows of D-10, no row left naming D; the Quick Start's quoted status if R-7 holds (green) (D-10;
  spec `test-strategy`).
- [ ] 3.2 Run the five *with* runs, isolated, from the head of stage 2, with the prompts of 1.3;
  complete `evidence/baseline.md` with the pairs and O-1..O-4.
- [ ] 3.3 Docs: the two CHANGELOG lines, the `docs/future-features.md` row, `guardrails` under
  `served_by.skills` of UC-W7, UC-W8, UC-W16 and UC-W24; the follow-up for `add-content-creation` named
  in the PR (D-14, RISK-11).
- [ ] 3.4 `make bundles`, `make validate`, `openspec validate generic-task-test-profiles --strict`.
- [ ] 3.5 Acceptance demo with the developer: one offer from request to hand-over, one pick-up of a
  sales draft, the baseline pairs with the owner's O-5 verdict, and the first week's scheduled run
  notes (RISK-2, RISK-3); recorded in `evidence/acceptance.md` (D-11, D-14; LARGE makes it
  mandatory).

## Roadmap

- [ ] 1.0 · [ ] 1.1 · [ ] 1.2 · [ ] 1.3 · [ ] 1.4 · [ ] 1.5 · [ ] 1.6 · [ ] 1.7 · [ ] 1.8 · [ ] 2.0
  · [ ] 2.1 · [ ] 2.2 · [ ] 2.3 · [ ] 2.4 · [ ] 2.5 · [ ] 2.6 · [ ] 2.7 · [ ] 2.8 · [ ] 2.9 · [ ] 2.10 · [ ] 3.1
  · [ ] 3.2 · [ ] 3.3 · [ ] 3.4 · [ ] 3.5

Tasks 2.1 to 2.5 touch different files and may run in parallel.

## Verification

`make validate` green at the end of each stage, which includes
`tests/test_generic_task_profiles.py`, the agent and agent-feature lint, the bundle gates and the
static probes. Also required: `openspec validate generic-task-test-profiles --strict`; the
planted-flaw bar met (`evidence/planted-flaw.md`); the baseline verdict (`evidence/baseline.md`);
the behavioural run of `meaningfy-voice` (`inputs/evidence/triggers-meaningfy-voice.md`); the agent
scenarios run on both CLIs (`evidence/agent-scenarios.md`); and the developer's verdict in
`evidence/acceptance.md`.
