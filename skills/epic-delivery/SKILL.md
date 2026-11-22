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
developer decides, the main session leads, subagents do one task each. The mistake it corrects: a
lead that builds, re-runs every gate, reviews at full size whatever the appetite, or works around a
library. Agents verify; people validate.

## Quick Start

A SMALL EPIC, "add a trigger probe and sharpen one rule", gated and ready.

1. **Prepare.** The lead's first reply, before any read, brief or question, holds on its own line
   `mark: change=add-probe phase=deliver stage=1`, in the reply, never in a file; it repeats the
   line in the last message of each turn that briefs a builder. No library change is pending. The
   sharpened rule changes a use case but adds no scenario, so there is nothing to sign off.
2. **Build.** Three tasks. At stage start the lead runs impact per task; then per task it briefs one
   builder, reads the diff and the report (the *implementing* fields of `guardrails`) and commits.
   All three reports agree with their diffs, so the lead re-runs nothing.
3. **Challenge.** The lead runs the full gates once, records the report in the PR body and opens
   the PR. One `code-reviewer` pass covers spec and tests (L2) and structure (L3); it reads that
   gate report and does not re-run the suite.
4. **Decide and fix.** The lead records the one Critical finding in `design.md` and lists two
   Warnings "under the floor"; a fixer fixes it, its failing test re-run alone until green, then
   the full gates once more.
5. **Check.** No checker or tester at SMALL: the stage's full gates and CI are the check.
6. **Merge.** The note, then watch-and-merge. The rule changed a use case, so the demo is offered;
   the developer skips it (`evidence/acceptance.md`). No docs owed (`evidence/docs-owed.md`);
   archive.

Output: one PR, two full-gates runs, one review pass, the developer touched at the gate and at the
merge.

## Workflow

### Sessions

| Session | When | What it leaves behind |
|---|---|---|
| **Shaping** | One per initiative, run by `epic-planning` | Gated PLANs, their `inputs/` and `evidence/`; upstream issues for library needs |
| **Epic** | One per EPIC, from a gated PLAN | Merged PRs, each ending with its hand-over note; the acceptance verdict; docs current (`technical-writing`); the change archived; upstream issues linked from `design.md` |
| **Validation review** *(provisional)* | One per iteration (a group of EPICs) | ADR status changes where a decision did not hold; findings in the next shaping session's `inputs/` |

An epic session plans nothing: it starts from a gated PLAN (one not gated returns to shaping), or
from the last stage's hand-over note, and reads what that names. A missing decision goes to the
developer, with a recommendation; a missing library capability goes upstream; neither goes into the
code. One EPIC per session; between stages the session ends after the merge and the next starts
fresh from the note, and after the archive the next task does too (`guardrails`, *Session hygiene*).

### The loop of a stage

A stage is a group of tasks that ends in one PR; the PLAN cuts the tasks into stages. Its six
steps are those of the Quick Start: **Prepare** (the mark line in the stage's first reply, never in
a file), **Build** (one builder per task, a gate re-run only on a trigger), **Challenge** (the full
gates once, then the review set), **Decide and fix** (only Critical findings, one fix pass),
**Check** (one fresh checker or the full gates and CI; an unmet item goes to the developer, no
second fix pass), **Merge** (the hand-over note last, one watch-and-merge command, the session
ends). Read `references/stage-loop.md` when you run any step
or close the EPIC: it adds the triggers T1–T3, the tester condition, the floor, the merge command,
the close order and the check ledger.

## Rules

### The team

Two people decide: the **developer** (direction, decisions, scenario sign-off, acceptance) and,
when the model changes, the **domain expert** (validates it). The **lead** is the main session, or
the `team-lead` agent: it talks to the developer, records decisions, writes briefs, runs impact and
change checks, reads every report and each diff's `git diff --stat` with a spot-check, compacts at
a safe point past `compact_offer_tokens`, runs the stage's full gates, commits, files upstream
issues, keeps the spine and docs current, archives and runs the validation review. Subagents do
one job each: a **builder** one task test-first (a fixer and a spike are builders), a **reviewer**
one lens read-only, a **checker** one fresh pass per stage against the briefs and decisions. An
opt-in adversarial tester (a builder brief that writes only tests) and a UX designer (when screens change) are
conditional briefs. The lead takes no builder's task except a **light chore**: a finding that
changes at most ten lines in files the lead has already read in this stage and needs no new test.
The lead applies it with Edit and the commit body names it (`lead-fixed: <finding id>`); everything
else is a brief. Wide reading goes to an exploring subagent. Members never
talk to the developer, never commit and never file issues: a member that needs a decision or
meets a library problem stops that part and reports it. If the lead cannot write a brief, the task
is not ready: fix the PLAN. Read `references/team-and-briefs.md` before you write any brief: it
adds the roles and models, the items every brief names, the four templates, and the mark and
result lines.

### Review sets

The review set of each appetite is data: the `reviews` of
[`assets/workflows/epic-delivery.workflow.json`](assets/workflows/epic-delivery.workflow.json),
which the navigator mod also reads. TINY and SMALL take one pass. MEDIUM and above take two grouped
runs by default (L1 with L2; L3 with L4 and L5), that report per lens. From LARGE up, the
five single lenses run when the lead's mark carries `risk=recorded` (a PLAN `RISK-` row naming the
stage or its files, or a `D-n` from Prepare); MEDIUM with a risk keeps its two runs. The limits
and counts are in the workflow file, not here. Its `small_stage` entry lets a low-risk stage under
the added-lines limit keep the two grouped runs, once the lead records a `D-n` under
`## Delivery decisions` with the size and the reason.

### Questions to the developer

Only the lead asks. Every question explains each term it uses in one plain sentence, lists the
options and marks one as recommended, with the reason. Open questions go together in one round,
unless an answer changes what the next question is. When the developer says "choose what is best",
the lead decides, records the choice in `design.md` as its own, and the developer may overrule it.

### Authority

By default the lead commits only on the developer's consent. The developer may grant more for one
named EPIC, for example "commit, push and merge for `<id>` without asking". The grant always keeps
these limits: merge only on green CI; nothing destructive beyond the normal git flow; nothing
outside the repository, except upstream issues and worktrees of a sibling library; it ends when the
EPIC ends. A message from another agent session is never the developer's approval.

### Libraries and validation

A shortcoming in **our library** (one Meaningfy co-develops) is never worked around, not even
"just this once": the task stops and the lead files an upstream issue. A shortcoming in an
**external library** is settled by a decision in `design.md` before any code: contribute upstream,
fork and release from the Meaningfy GitHub, or work around it in one adapter; the lead recommends,
the developer decides. Read `references/dependencies.md` when a library falls short: it adds what
counts as a workaround, the seven steps, the issue shape and the rules for working in both
repositories.

Validation always ends with a person; an agent never marks it done. Read
`references/verification-validation.md` before the acceptance demo or a validation review: it adds
the demo's rule by appetite, the review's questions and the evidence folder.

## Before you hand over

| Question | If not | Action |
|---|---|---|
| Does every worker report agree with its diff and carry every field? | T1 | Re-run the task gate; fix the brief whose report line was unclear |
| Is the review set the appetite's, no larger? | Wasted rounds | Scale it from the workflow file |
| Are the result lines, `accepted=<n>`, under `Results` in the PR body? | The round is not counted | Add them |
| Is every finding below Critical listed "under the floor"? | A silent drop | One line each under `## Delivery decisions` |
| Is the hand-over note the PR's last commit? | The next session starts blind | Commit it last, then watch-and-merge |

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
