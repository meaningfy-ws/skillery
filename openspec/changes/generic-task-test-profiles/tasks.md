<!-- PLAN (tasks half), derived 2026-11-14. Not yet attacked or gated. -->

> Derives from: EPIC `generic-task-test-profiles` ([`proposal.md`](proposal.md)); design in
> [`design.md`](design.md). Starts after EPIC A `test-strategy` is delivered.

## 1. Stage 1: the reader

- [ ] 1.0 The developer signs off the spec scenarios of this change (the PLAN gate), recorded in
  `evidence/acceptance.md` (D-14).
- [ ] 1.1 Confirm A is delivered and the branch is on current `develop`. Check R-1..R-10 of design
  § *Re-check once A is delivered* against `skills/test-strategy/`; fix this PLAN first where one
  fails. Re-read each spec delta against the live specs (RISK-7).
- [ ] 1.2 Write `evidence/baseline/inputs.md` (the five tasks and the one brief) and run the five
  *without* runs on the base commit, before any skill edit; record O-1..O-4 and keep the drafts
  (D-11). Write `evidence/failure-case.md` from them and from A's inventory gap line (D-14).
- [ ] 1.3 Write the four fixtures and `expected.yaml` under `tests/fixtures/readers/`, fabricated,
  the contract ones as term tables in plain words (D-11; spec `legal-contract-practice`, *No
  contract material in skillery*).
- [ ] 1.4 Write `tests/test_generic_task_profiles.py`, test-first: the fixture checks, the section
  check, the `brief`, `leaves-the-company` and role-name allow-lists with their own fixture lines,
  and the two checks that read `generic-writing.md`. Red now, green after 1.5, 2.1–2.5 and 3.1. Add
  the `adversarial-reader-brief` entry to `tests/ownership.yaml` (D-11).
- [ ] 1.5 Write `skills/guardrails/references/adversarial-reader.md` with the eight sections of D-1
  and the brief of design § *Algorithm*; add the bullet to § 5 of `guardrails`' SKILL.md and the
  two phrases to its description (D-1, D-6, D-7, D-8, D-9; spec `subagent-dispatch`, both
  requirements).
- [ ] 1.6 Probes for `guardrails` in `tests/trigger_probes.yaml`: the positive and the near-miss of
  D-12.
- [ ] 1.7 Planted-flaw proof: twelve reader runs (four fixtures, three each), with the role and
  attacks of D-3 passed in the brief, as the profiles are not written yet; results and the D-11 bar
  in `evidence/planted-flaw.md`. On a miss, follow the error matrix and run all twelve again.

## 2. Stage 2: the profiles

- [ ] 2.1 `proposal-writing`: the `## Test profile` section, the criteria sentence in *Flow* step
  1, the new step 5, the pointer line (D-2, D-3, D-10; spec `sales-method-ownership`, *The offer
  profile has one owner*).
- [ ] 2.2 `contract-practice`: the section, the fifth intake bullet, the *review* row and the
  sentence under *Lawyer-review flag*, the pointer line; the workflow file is not touched (D-2,
  D-3; spec `legal-contract-practice`).
- [ ] 2.3 `meaningfy-voice`: the section in `references/channels/linkedin.md`, the pointer and
  differences in `blog.md`, lines 23–24 of SKILL.md, the description's post trigger, the pointer
  line (D-2, D-3, D-14; spec `company-voice`, both requirements).
- [ ] 2.4 `executive-communication`: the section, the criteria and reader lines in *Start here*,
  the pointer line (D-2, D-3; spec `executive-communication`).
- [ ] 2.5 `sales-conversations`: the section, the subsection *At pick-up: criteria and a reader*
  under *Workflow*, the pointer line; `sales-operations` is not touched (D-2, D-3, D-4; spec
  `sales-method-ownership`, *The sales-message profile has one owner*).
- [ ] 2.6 Add the scenarios of design § *Scenarios* to the three feature files, with the
  `# Traces to:` line and the extra Given line in `proposal-writer.feature`, before 2.7 (D-11).
- [ ] 2.7 Agents: edit `agents/proposal-writer.md` and `agents/sales-agent.md` as D-5 lists; run
  `make bundles`. Run the scenarios of 2.6 by hand on both CLIs, the *No reader can be started*
  path included, and record per CLI what happened in `evidence/agent-scenarios.md` (D-5, D-7,
  RISK-1).
- [ ] 2.8 Probes for `meaningfy-voice` (D-12). Write `tests/evals/triggers/meaningfy-voice.json`,
  get the owner's approval of the estimate, run it before and after the description change, and
  record both in `evidence/triggers.md` (RISK-6; spec `company-voice`, *A request for a post finds
  the profile*).

## 3. Stage 3: the rows and the proofs

- [ ] 3.1 `skills/test-strategy/references/inventory.md`: the six checks; `generic-writing.md`: the
  ten rows of D-10, no row left naming D; the Quick Start's quoted status if R-7 holds (D-10; spec
  `test-strategy`, *The generic-writing matrix holds the profiles as rows*).
- [ ] 3.2 Run the five *with* runs with the briefs of 1.2; complete `evidence/baseline.md` with the
  pairs and the D-11 verdict.
- [ ] 3.3 Docs: the CHANGELOG line, the `docs/future-features.md` row, `guardrails` in the
  `served_by` of UC-W8, UC-W16 and UC-W24 (D-14). Run `make skill-inventory`.
- [ ] 3.4 `make bundles`, `make validate`, `openspec validate generic-task-test-profiles --strict`.
- [ ] 3.5 Acceptance demo with the developer: one offer from request to hand-over, one pick-up of a
  sales draft, the baseline pairs and the first week's scheduled run notes (RISK-2, RISK-3);
  recorded in `evidence/acceptance.md` (D-14; LARGE makes it mandatory).

## Roadmap

- [ ] 1.0 · [ ] 1.1 · [ ] 1.2 · [ ] 1.3 · [ ] 1.4 · [ ] 1.5 · [ ] 1.6 · [ ] 1.7 · [ ] 2.1 · [ ] 2.2
  · [ ] 2.3 · [ ] 2.4 · [ ] 2.5 · [ ] 2.6 · [ ] 2.7 · [ ] 2.8 · [ ] 3.1 · [ ] 3.2 · [ ] 3.3 · [ ] 3.4
  · [ ] 3.5

Tasks 2.1 to 2.5 touch different files and may run in parallel.

## Verification

`make validate` green, which includes `tests/test_generic_task_profiles.py`, the agent lint, the
bundle gates and the static probes. Also required: `openspec validate generic-task-test-profiles
--strict`; the planted-flaw bar met (`evidence/planted-flaw.md`); the baseline verdict
(`evidence/baseline.md`); the behavioural run of `meaningfy-voice` (`evidence/triggers.md`); the
agent scenarios run on both CLIs (`evidence/agent-scenarios.md`); and the developer's verdict in
`evidence/acceptance.md`.
