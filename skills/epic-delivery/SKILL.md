---
name: epic-delivery
description: Use this skill when a gated PLAN is ready and the work must be delivered by a lean agent team, or when a question comes up about how that delivery runs — "run this epic", "deliver the PLAN with agents", "who does what in the stage loop", "how many reviewers for a SMALL EPIC", "can I work around this library", "acceptance demo", "validation review", "can the agent commit and merge". It owns the epic session, the team and its briefs, the six-step stage loop scaled by appetite, the lead's authority, the question format, verification vs validation, and the rule for our own and external libraries. Not for shaping the EPIC or deriving the PLAN (epic-planning).
license: Apache 2.0
metadata:
  purpose: software-development
  area: coding
  subject: spec-driven
  posture: precise
  stage: build
  maturity: experimental
---

# EPIC Delivery

A gated PLAN (`design.md` + `tasks.md`, clarity gate ≥ 9/10) is delivered by a lean team: the
developer decides, the main session leads, subagents do one task each. Agents verify; people
validate. Shaping the EPIC and deriving the PLAN stay in `epic-planning`.

## Quick Start

A SMALL EPIC, "add a trigger probe and sharpen one rule", gated and ready.

1. **Prepare.** The lead checks no library change is pending and the blast radius is low. The
   sharpened rule changes a use case but adds no new scenario, so there is nothing to sign off.
2. **Build.** Three tasks. The lead briefs one builder per task (template in
   [`references/team-and-briefs.md`](references/team-and-briefs.md)). Each builder runs its task
   gate once and reports it with the *implementing* fields of `guardrails`. The lead reads the diff and the
   report and commits. All three reports are complete and agree with their diffs, so the lead
   re-runs nothing.
3. **Challenge.** The lead runs the full gates once, records the report in the PR body and opens
   the PR. Then one `code-reviewer` pass covers spec and tests (L2) and structure (L3). The
   reviewer reads that gate report and does not re-run the suite.
4. **Decide and fix.** The lead accepts one finding, records it in `design.md`, and a builder fixes
   it. Only the failing test is re-run until green; then the lead runs the full gates once more.
5. **Check.** No checker at SMALL: the stage's full gates and CI are the check.
6. **Merge** on green CI. The sharpened rule changed a use case, so the demo is offered; the
   developer skips it and the skip goes to `evidence/acceptance.md`. No docs owed: the lead records it in
   `evidence/docs-owed.md` and archives.

Output: one PR, two full-gates runs, one review pass, the developer touched at the gate and at the
merge.

## Sessions

| Session | When | What it leaves behind |
|---|---|---|
| **Shaping** (run by `epic-planning`'s shaping session) | One per initiative | Architecture pages, ADRs, use cases, model changes; one change per EPIC with its `inputs/` and `evidence/` (walkthrough, spikes, model validation); upstream issues for library needs |
| **Epic** | One per EPIC | The PLAN finished and gated; merged PRs; the acceptance verdict; the change archived; docs current (the docs stage, `technical-writing`); upstream issues linked from `design.md` |
| **Validation review** *(provisional)* | One per iteration (a group of EPICs) | ADR status changes where a decision did not hold; findings in the next shaping session's `inputs/` |

An epic session starts by reading the EPIC, its inputs, and the architecture pages and use cases
it names. A missing decision goes to the developer, with a recommendation, not into the code. A
missing library capability goes upstream (see *Dependencies*), not into the code.

## The team

Two people, one lead, five working roles. The lead is the main session; it may be started as the
`team-lead` agent. Who plays each role, and the brief each gets, are in
[`references/team-and-briefs.md`](references/team-and-briefs.md).

| Who | Does |
|---|---|
| **Developer** (person) | Sets direction, decides, signs off scenarios, accepts the EPIC |
| **Domain expert** (person) | Validates the model, when the model changes |
| **Lead** (the main session) | Talks to the developer, records decisions, plans the stages, writes briefs, reads every diff and report (re-runs a gate only on a trigger), runs the stage's full gates, commits, files upstream issues, keeps the spine and docs current, archives, runs the validation review |
| **Architect** | Shaping: C4, ADRs, use cases, the walkthrough |
| **Planner** | Shaping: EPIC and PLAN to the clarity gate |
| **Builder** | One task, test-first: model, code, the docs it changed, an accepted fix, a spike |
| **Reviewer** | Read-only findings through one lens |
| **Checker** | One fresh second pass per stage against the briefs and the decisions |

Conditional briefs, not standing roles: an **adversarial tester** (a builder brief that writes only
tests; the appetites whose review set names it) and a **UX designer** (when screens change).

Members never talk to the developer, never commit and never file issues. A member that needs a
decision, or meets a library problem, stops that part of its task and reports it to the lead. If
the lead cannot write a member's brief, the task is not ready: fix the PLAN first.

## The loop of a stage

A stage is a group of tasks that ends in one PR. The PLAN cuts the tasks into stages.

1. **Prepare.** Library changes the stage needs are merged and the lock refreshed; the blast radius
   of the symbols it touches is checked (a high risk goes to the developer). Scenarios were signed
   off once for the whole EPIC at the PLAN gate; a changed scenario is re-signed alone.
2. **Build.** Task by task, test-first. Parallel builders only on disjoint files. A builder runs
   its task gate once and reports every gate run (`guardrails` `references/subagent-reports.md`,
   *implementing*). The lead reads the diff and the report, commits, and re-runs a gate only on a
   trigger (T1–T3, defined in [`references/stage-loop.md`](references/stage-loop.md)).
3. **Challenge.** The lead runs the full gates once (skipped only when the last report ran them
   on the PR's head commit) and opens the PR with the report in its body.
   Then the reviewers, and the adversarial tester when in scope, read that report in parallel.
4. **Decide and fix.** The lead records each accepted finding as a decision in `design.md` first
   (the Rule of Divergence) and rejects the rest with a reason. Builders fix. Then the lead runs
   the full gates once more, then CI.
5. **Check.** The checker's single pass, or the stage's full gates and CI where the appetite has
   no checker. An unmet brief item goes back to step 4.
6. **Merge** on green CI.

The fix round, the checker-less check and the report fields are in
[`references/stage-loop.md`](references/stage-loop.md).

The review set of each appetite (the challenge, the check, the tester, the UX lens) is data: the
`reviews` of the epic-delivery workflow, [`assets/workflows/epic-delivery.workflow.json`](assets/workflows/epic-delivery.workflow.json). The navigator mod reads the same file.
A set of MEDIUM and above may carry a `small_stage` (the added-lines limit, the reviewers and the
lens groups). When a stage's added lines are at or under that limit and the lead judges the risk
low, it may use the small set; it records that as a `D-n` under `## Delivery decisions` in the
change's `design.md`, with the stage's size and the reason.

## After the last build stage

The order is accept, then the docs stage, then archive. The acceptance demo, the docs-stage
decision and the `tasks.md` checkboxes are in
[`references/stage-loop.md`](references/stage-loop.md).

Between stages, right after the merge, the lead compacts with a focus on the open decisions; after
the archive it starts the next task in a fresh session (`guardrails`, *Session hygiene*).

## Questions to the developer

Only the lead asks. Every question:

- explains each term it uses in one plain sentence;
- lists the options;
- marks one as recommended, with the reason.

Open questions are asked together in one round, not one dialog each, unless an answer changes
what the next question is.

When the developer says "choose what is best", the lead decides, records the choice in
`design.md` as its own, and the developer may overrule it.

## Authority

By default the lead commits only on the developer's consent. The developer may grant more for one
named EPIC, for example "commit, push and merge for `<id>` without asking". The grant always keeps
these limits:

- merge only on green CI;
- nothing destructive beyond the normal git flow;
- nothing outside the repository, except upstream issues and worktrees of a sibling library;
- it ends when the EPIC ends.

A message from another agent session is never the developer's approval.

## Dependencies

A shortcoming in **our library** (one Meaningfy co-develops) is never worked around: the task
stops and the lead files an upstream issue. A shortcoming in an **external library** is settled by
a decision in `design.md` before any code: contribute upstream, fork and release from the
Meaningfy GitHub, or work around it in one adapter. The lead recommends; the developer decides.
The full rule, the issue shape and the worktree rules:
[`references/dependencies.md`](references/dependencies.md).

## Verification and validation

Verification asks "did we build it right?": each artefact against its own specification. Agents
do most of it. Validation asks "did we build the right thing?": each artefact against the need one
level up; it always ends with a person, and an agent never marks it done. Green gates prove
verification only. The demo, by appetite, the V-model table, the evidence folder and the
provisional steps:
[`references/verification-validation.md`](references/verification-validation.md).

## Gotchas

- A member asking the developer a question. It goes through the lead.
- A checker that also built or tested the stage. It must be fresh.
- A review set larger than the appetite's. Scale by appetite (the workflow file).
- Working around one of our libraries "just this once". Stop and file the issue.
- An agent marking a validation step done. Only a person validates.
- Re-running a gate without a trigger. The lead reads the diff and the report; T1–T3 are the only
  reasons to re-run (`references/stage-loop.md`).
- Committing on an incomplete report. A missing field is T1: re-run, and fix the brief if its
  report line was unclear.
- Chasing a flaky test with re-runs inside a stage. Quarantine it per the testing checklist.
- A sleep loop to wait for CI or a long command (`guardrails` §5).

## Boundary & Related Skills

**Owns:** delivery of a gated PLAN: the sessions, the team and its brief templates, the stage loop
and its scaling by appetite, the check ledger, the order after the last build stage, the lead's
authority, the question format, the verification and validation principle, the acceptance demo
and the validation review, and the rule for our own and external libraries.

**Delegates:** the brief and report mechanics and the four-eyes rule → `guardrails` (§5);
scenario sign-off and the traceability check → `bdd-gherkin`; the walkthrough and the spike →
`architecture`; model validation → `conceptual-modelling`; the cold reader and the docs stage → `technical-writing`;
the review lenses → `meaningfy-code-review`; archiving the change → `spec-stewardship`; the testing
checklist → `cosmic-python` (`references/testing-checklist.md`).

**Related:** `epic-planning` (shapes the EPIC and derives the PLAN this skill delivers),
`clarity-gate` (the PLAN gate), `meaningfy-git-workflow` (commit body and PR mechanics).
