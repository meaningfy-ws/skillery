---
name: epic-delivery
description: Use this skill when a gated PLAN is ready and the work must be delivered by a lean agent team, or when a question comes up about how that delivery runs — "run this epic", "deliver the PLAN with agents", "who does what in the stage loop", "how many reviewers for a SMALL EPIC", "can I work around this library", "acceptance demo", "validation review", "can the agent commit and merge". It owns the epic session, the team and its briefs, the six-step stage loop scaled by appetite, the lead's authority, the question format, the acceptance demo and the validation review, and the rule for our own and external libraries. Not for shaping the EPIC or deriving the PLAN (epic-planning).
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

1. **Prepare.** The lead checks no library change is pending. The sharpened rule changes a use
   case but adds no new scenario, so there is nothing to sign off.
2. **Build.** Three tasks. Per task the lead runs impact, briefs one builder (template in
   [`references/team-and-briefs.md`](references/team-and-briefs.md)), reads the diff and the
   report (the *implementing* fields of `guardrails`), runs the change check and commits. All
   three reports agree with their diffs, so the lead re-runs nothing.
3. **Challenge.** The lead runs the full gates once, records the report in the PR body and opens
   the PR. Then one `code-reviewer` pass covers spec and tests (L2) and structure (L3). The
   reviewer reads that gate report and does not re-run the suite.
4. **Decide and fix.** The lead records the one Critical finding in `design.md` and lists two
   Warnings "under the floor"; a fixer fixes it, its failing test re-run alone until green, then
   the full gates once more.
5. **Check.** No checker at SMALL: the stage's full gates and CI are the check.
6. **Merge.** The note, then watch-and-merge. The rule changed a use case, so the demo is offered;
   the developer skips it (`evidence/acceptance.md`). No docs owed (`evidence/docs-owed.md`);
   archive.

Output: one PR, two full-gates runs, one review pass, the developer touched at the gate and at the
merge.

## Sessions

| Session | When | What it leaves behind |
|---|---|---|
| **Shaping** (run by `epic-planning`'s shaping session) | One per initiative | Architecture pages, ADRs, use cases, model changes; one change per EPIC with its `inputs/` and `evidence/` (walkthrough, spikes, model validation); upstream issues for library needs |
| **Epic** | One per EPIC, from a gated PLAN | Merged PRs, each ending with its hand-over note; the acceptance verdict; the change archived; docs current (the docs stage, `technical-writing`); upstream issues linked from `design.md` |
| **Validation review** *(provisional)* | One per iteration (a group of EPICs) | ADR status changes where a decision did not hold; findings in the next shaping session's `inputs/` |

An epic session plans nothing: it starts from a gated PLAN (one not gated returns to shaping), or
from the last stage's hand-over note, and reads what that names. A missing decision goes to the
developer, with a recommendation; a missing library capability goes upstream (*Dependencies*);
neither goes into the code.

## The team

Two people, one lead, five working roles. The lead is the main session; it may be started as the
`team-lead` agent. Who plays each role, and the brief each gets, are in
[`references/team-and-briefs.md`](references/team-and-briefs.md).

| Who | Does |
|---|---|
| **Developer** (person) | Sets direction, decides, signs off scenarios, accepts the EPIC |
| **Domain expert** (person) | Validates the model, when the model changes |
| **Lead** (the main session) | Talks to the developer, records decisions, writes briefs, runs impact and change checks, reads every diff and report (re-runs a gate only on a trigger), runs the stage's full gates, commits, files upstream issues, keeps the spine and docs current, archives, runs the validation review |
| **Architect** | Shaping: C4, ADRs, use cases, the walkthrough |
| **Planner** | Shaping only (an `epic-planner` session): EPIC and PLAN to the clarity gate |
| **Builder** | One task, test-first: model, code, the docs it changed, an accepted fix, a spike |
| **Reviewer** | Read-only findings through one lens |
| **Checker** | One fresh second pass per stage against the briefs and the decisions |

The lead stays small: one EPIC per session; never a builder's task, even a one-line fix (that is a
fixer brief); several known files read in one call, wider reading handed to an exploring subagent
(`guardrails` §5, §6).

Conditional briefs, not standing roles: an **adversarial tester** (a builder brief that writes only
tests, on its condition) and a **UX designer** (when screens change).

Members never talk to the developer, never commit and never file issues. A member that needs a
decision, or meets a library problem, stops that part of its task and reports it to the lead. If
the lead cannot write a member's brief, the task is not ready: fix the PLAN first.

## The loop of a stage

A stage is a group of tasks that ends in one PR. The PLAN cuts the tasks into stages.

1. **Prepare.** Your first reply of the stage, before any read, brief or question, holds on its
   own line `mark: change=<id> phase=deliver stage=<n>`, in the reply, never in a file; repeat it
   in the last message of a turn that briefs a worker (`references/team-and-briefs.md`). Library changes
   merged, lock refreshed; the tester condition judged and recorded.
   A scenario changed since the PLAN gate is re-signed alone.
2. **Build.** Per task: the lead runs impact, briefs one builder (test-first; parallel only on
   disjoint files), reads the diff and the report, runs the change check, commits. A gate is
   re-run only on a trigger (T1–T3).
3. **Challenge.** The lead runs the full gates once and opens the PR with the report; the
   reviewers, and the tester on its condition, read it in parallel.
4. **Decide and fix.** Only Critical findings are fixed, each a decision in `design.md` first; the
   rest are listed "under the floor". One fix pass, the full gates once more, CI.
5. **Check.** The checker's single pass, or the full gates and CI. An unmet item goes to the
   developer; no second fix pass.
6. **Merge.** The hand-over note as the last commit, one watch-and-merge command, the session ends.

The detail and the check ledger: [`references/stage-loop.md`](references/stage-loop.md).

The review set of each appetite is data: the `reviews` of
[`assets/workflows/epic-delivery.workflow.json`](assets/workflows/epic-delivery.workflow.json),
which the navigator mod also reads. MEDIUM takes two reviewers (L1 with L2; L3 with L4 and L5) by
default, the five lenses when a risk is recorded for the stage (a PLAN `RISK-` row naming the
stage or its files, or a `D-n` from Prepare). From LARGE up, a `small_stage` lets a low-risk stage
at or under its added-lines limit (`git diff`, generated files included) take the small set, once
the lead records a `D-n` under `## Delivery decisions` with the size and the reason. The small set
is an allowance, not a ceiling.

## After the last build stage

The order is accept, then the docs stage, then archive. The acceptance demo, the docs-stage
decision and the `tasks.md` checkboxes are in
[`references/stage-loop.md`](references/stage-loop.md).

Between stages the session ends after the merge and the next stage starts fresh from the hand-over
note; after the archive, the next task too (`guardrails`, *Session hygiene*).

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

The definition of verification and validation, the questions and the matrix are owned by
`test-strategy`. Validation always ends with a person, and an agent never marks it done. The
demo, by appetite, the evidence folder and the provisional steps:
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
authority, the question format, the acceptance demo
and the validation review, and the rule for our own and external libraries.

**Delegates:** the brief and report mechanics and the four-eyes rule → `guardrails` (§5);
scenario sign-off and the traceability check → `bdd-gherkin`; the walkthrough and the spike →
`architecture`; model validation → `conceptual-modelling`; the cold reader and the docs stage → `technical-writing`;
the review lenses → `meaningfy-code-review`; archiving the change → `spec-stewardship`; the testing
checklist → `cosmic-python` (`references/testing-checklist.md`); the definition of verification and
validation, the questions and the matrix → `test-strategy`.

**Related:** `epic-planning` (shapes the EPIC and derives the PLAN this skill delivers),
`clarity-gate` (the PLAN gate), `meaningfy-git-workflow` (commit body and PR mechanics).

Answers `VAL, VER, ADQ, ROB, RSK` in `test-strategy`'s matrix (`references/software.md`, `references/shaping.md`, `references/cross-cutting.md`).
