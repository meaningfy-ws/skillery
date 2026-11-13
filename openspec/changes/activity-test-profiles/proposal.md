<!-- STATUS: EPIC shaped 2026-11-13 from the owner's conversation (inputs/seed.md, inputs/qa.md).
     EPIC C of four: A test-strategy → B harden-checks-and-tests → C (this) → D
     generic-task-test-profiles. Readiness-checked 2026-11-13, the fixes folded in. PLAN not
     derived: it is derived when its epic session starts, after A and B are delivered. -->

# EPIC: activity test profiles

**Parents:** EPIC A [`test-strategy`](../test-strategy/proposal.md) (the matrix whose gap rows this
EPIC closes) and EPIC B [`harden-checks-and-tests`](../harden-checks-and-tests/proposal.md) (the
`quality/` folder and the tester this EPIC feeds); the owner's requests of 2026-11-13
(`inputs/seed.md`, `inputs/qa.md`); the first survey of gaps in
[`../test-strategy/inputs/inventory-draft.md`](../test-strategy/inputs/inventory-draft.md).

## Appetite

**VERY LARGE**, in five stages, one per family group, each shipping alone (Q-1, Q-4). It cuts across
six activities and their skills. A stage that finds no recorded failure for its family ships only
the accepted-gap records, and that is a valid, small stage. If a stage starts inventing checks
without a failure behind them, it has overrun: stop and record the gap as accepted.

## Why

`test-strategy`'s matrix will show, family by family, which questions nothing answers today. Outside
software and shaping almost every family is thin: UI has one check, DevOps has nothing that asks
whether a runbook can be followed, documentation has nothing for robustness or risk, and the
shaping interview never asks which invariants must hold, so the adversarial tester has to guess its
properties. Left as it is, the matrix would be an honest list of holes that nobody closes.

## Solution outline

Each stage takes one family group, in this order: documentation; shaping; DevOps; architecture and
modelling; UI. Every stage runs the same three steps.

1. **Survey the failures.** Collect real failures for the family: issues, review findings, the
   owner's examples. Each failure is written down with what would have caught it.
2. **Fill or accept.** For a gap with a failure behind it, add one technique or tool, in the skill
   that owns the activity. For a gap with none, record it as accepted, with the reason. Outcome: no
   row of the family is left as a plain gap.
3. **Show it catches the failure.** A fixture or worked example shows the new check catching the
   failure it cites.

The candidates already agreed, each still subject to step 1:

- **Documentation:** Vale with hand-picked external styles; ls-lint for docs folder and file names.
- **Shaping:** the test-scenario interview asks which invariants must hold; they travel through the
  PLAN to the tester's Hypothesis properties, and the PLAN's error matrix becomes the tester's
  target list.
- **DevOps:** ls-lint and checkmake on the stacks repositories' layout and Makefiles; the survey
  also asks whether a runbook has failed someone who tried to follow it.
- **Architecture, modelling, UI:** no candidate agreed; the survey decides.

## Key decisions

- **DEC-1**: One EPIC, five stages by family group, in the order documentation, shaping, DevOps,
  architecture and modelling, UI — the most used first, UI last because its skills are mostly
  external; rejected: three EPICs by nearness; one EPIC per family (Q-1, Q-4).
- **DEC-2**: A gap is filled only where a recorded failure exists, with one technique or tool per
  gap; otherwise its matrix row takes the status `accepted` and states why (the status A's PLAN
  D-2 defines) — rejected: filling every gap;
  re-using existing techniques only (Q-2).
- **DEC-3**: The failures come from a survey at each stage's start, kept in the change's
  `evidence/` folder — rejected: one survey up front; the owner listing them during shaping (Q-5).
- **DEC-4**: Tools in scope: Vale (external styles the owner hand-picks, no Meaningfy-own rules at
  first), ls-lint and checkmake for docs trees and the stacks repositories. Their configurations
  and source manifests live in `quality/` beside B's, under B's rules for external sources (its
  DEC-6) and for where `quality/`'s own tests run (its DEC-12) — rejected: formal
  methods (TLA+, Alloy) as optional architecture spikes (Q-3; B's DEC-6, DEC-7).
- **DEC-5**: The shaping interview gains the invariants question and the invariants reach the
  tester as its properties (Q-3). *(Proposed, the shaper's choice:)* they are recorded in the
  EPIC's PLAN, beside the error matrix, through the PLAN template. The tester's brief is B's and is
  not edited here: B's brief already takes its properties "from the PLAN as written" — rejected:
  the tester derives its own properties.
- **DEC-6**: Each technique lives in the skill that owns the activity; `test-strategy` gains only
  matrix rows (A's DEC-5, DEC-8) — rejected: techniques written into `test-strategy`.
- **DEC-7**: C proves four things (Q-6): every check a stage adds cites its failure and is shown
  catching it; after each stage the family's rows are `exists` or `accepted`; a shaped EPIC's
  invariants are traceable to the tester's stated properties; Vale, ls-lint and checkmake each run
  once on a real docs tree or stacks repository, with the findings recorded. That run is part of
  the stage's survey: its findings are failure evidence, and adopting a tool still needs one (Q-5).
- **DEC-8**: Mitigated risks (Q-7): checks that slow daily work (a new check is mandatory only
  where its stage says so, and each states its cost); external styles and tools that change or
  relicense (pinned in `quality/` manifests). The two reader risks of Q-7 belong to D (its DEC-7).

## Rabbit-holes

- **A survey that finds nothing.** That is a result, not a failed stage: record the accepted gaps
  and move on.
- **Vale noise.** External styles flag house terms and technical words. Start report-only on a real
  docs tree, then pick the rules that earn their place.
- **Invariants as boilerplate.** "The system stays consistent" is not an invariant. The interview
  asks for ones a property test could state, with an example each.
- **The stacks repositories are not this repository.** Stage 3 changes skills and `quality/` here;
  running the tools there is the proof, and adopting them there is the devops team's own change.
- **UI.** The design skills are external plugins. The stage may end with accepted gaps and pointers
  to those plugins, not with new checks.

## No-gos

- No formal methods (TLA+, Alloy; and CrossHair, as in B's No-gos); parked.
- No check without a recorded failure behind it.
- No Meaningfy-own Vale rules at first; no copying of external style text into skillery.
- No change to `test-strategy`'s questions, stances or matrix shape (A); only its rows.
- No software checks (B) and no profiles for offers, contracts, posts or messages (D).
- No new agent.
- No change inside the stacks repositories from this EPIC.

---

## What Changes

- `technical-writing`: documentation checks the survey supports (Vale, ls-lint), with their moments.
- `epic-planning` and the PLAN template: the invariants question in the test-scenario interview,
  and the invariants recorded in the PLAN.
- `stack-operations` (checks on the stacks repository) and `infrastructure-operations` (checks on
  the infrastructure repositories): the layout and Makefile checks the survey supports.
- `architecture` and `conceptual-modelling`: whatever the survey supports. UI: pointers to the
  external design plugins, kept in `test-strategy`'s `ui` rows.
- Repo rules: trigger probes for each description that changes. No agent's behaviour changes
  here (the tester's brief is B's), so no agent scenario is owed.
- `quality/`: Vale, and docs and stacks variants of the ls-lint and checkmake configurations, with
  their source manifests.
- `test-strategy`: the family files' gap rows become `exists` or accepted.

## Capabilities

### New Capabilities
<!-- None: every change lands in an existing capability. -->

### Modified Capabilities
- `test-strategy`: the documentation, shaping, DevOps, architecture, modelling and UI rows.
- `documentation-workflow`: the documentation checks and their moments.
- `epic-shape`: a new requirement, the shaping interview asks for invariants (the interview is in
  no spec today).
- `operations-practice`: the layout and Makefile checks for stacks.
- Stage 4 names its capability when its survey shows where a check lands (`modelling-conventions`,
  `linkml-engineering`, or none).
- `quality-checks` (from B): Vale and the docs and stacks configurations.

## Impact

- Skills: `technical-writing`, `epic-planning`, `infrastructure-operations`, `stack-operations`,
  `architecture`, `conceptual-modelling`, `test-strategy`.
- Repo: `quality/`; the PLAN template; the documentation, DevOps and epic-shaping workflow files,
  only where a check gains a gate.
- Order: after A and B (the documentation, shaping and DevOps stages need B's `quality/` and
  tester). Independent of D. Each stage ships alone.
