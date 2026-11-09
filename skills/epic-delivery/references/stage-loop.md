# The stage loop in detail

The six steps of a stage, what each scales with, and how the loop covers every check of the longer
loop it replaces. The summary is in the skill, and the review set of each appetite is in
[`epic-delivery.workflow.json`](../assets/workflows/epic-delivery.workflow.json); this page adds the detail.

## The steps

1. **Prepare.**
   - Every change the stage needs in one of our libraries is merged upstream and the lock is
     refreshed. A missing one blocks the stage ([`dependencies.md`](dependencies.md)).
   - Every external-library decision the stage needs is recorded in `design.md`.
   - The lead checks the blast radius of the symbols the stage touches, with the project's impact
     tool where it has one. A high or critical risk goes to the developer before any build.
   - Scenarios: signed off once per EPIC at the PLAN gate *(provisional)*, per `bdd-gherkin`. A
     scenario changed since is re-signed alone. Nothing is built on an unsigned scenario.
2. **Build.**
   - Builders take the tasks one at a time, test-first. Parallel builders only on disjoint files;
     otherwise one after another, or in separate worktrees.
   - The builder also updates the docs its task changed. There is no separate writer.
   - After each task the lead re-runs the project's gates, reads the diff, reads the upstream
     findings and files the issues they call for, and commits the task.
3. **Challenge.** In parallel, scaled by appetite: the reviewers, and the adversarial tester where
   the appetite's review set names it ([`epic-delivery.workflow.json`](../assets/workflows/epic-delivery.workflow.json)). Reviewers are read-only.
4. **Decide and fix.**
   - The lead sorts the findings. Each accepted one becomes a decision in `design.md` before any
     code changes (the Rule of Divergence: the spec first, then the code). The rest are rejected
     with a reason.
   - A finding that belongs to one of our libraries becomes an upstream issue, not a fix here.
   - Fixers apply the decisions in batches: security first, then structure. The lead re-runs the
     gates.
5. **Check.** Where the appetite's review set has a checker ([`epic-delivery.workflow.json`](../assets/workflows/epic-delivery.workflow.json)), one fresh checker over the
   whole stage. Where it has none, the lead's re-run of the gates is the check, and the single
   review pass is the four-eyes pass. A
   cold reader runs on any how-to or tutorial page the stage changed, at any appetite. An unmet item
   goes back to step 4.
6. **Merge.** The lead opens the PR and merges it only on green CI, within its authority.

After the last stage:

- **Acceptance demo** *(provisional)*, for an EPIC that delivers or changes a use case: the lead
  runs the use case in the running system (or through the API) against the EPIC's success measure.
  The developer accepts it or names what is wrong. The verdict, what was shown and the date go to
  `evidence/acceptance.md`. A rejection is a decision in `design.md` and a fix stage (steps 4–6)
  before archive.
- **Archive.** The lead archives the change per `spec-stewardship`.

## When a situation goes wrong

| Situation | Response |
|---|---|
| A brief cannot be written | The task is not ready; fix the PLAN |
| Our library falls short | Stop the task; upstream issue; `blocked by`; other tasks go on |
| An external library falls short | A decision recorded in `design.md` before any code |
| The checker finds a brief item unmet | Back to Decide and fix |
| The developer rejects at acceptance | A decision in `design.md`; a fix stage before archive |
| A scenario changes after sign-off | Re-sign that scenario only |
| A member needs a decision | It reports to the lead; the lead asks the developer |

## Two examples

- **SMALL EPIC**, one stage: a builder, the lead re-runs the gates and commits, one review pass
  (L2 + L3), the lead decides and fixes inline, PR. No checker, no tester. No scenario sign-off if
  the EPIC adds no scenario.
- **LARGE EPIC** with screens, three stages: all scenarios signed off at the gate. Per stage:
  builder tasks, then the tester, five lenses and the UX lens in parallel, then decide and fix,
  then the checker, then the PR. After stage 3: the acceptance demo, `evidence/acceptance.md`,
  archive.

## How this loop covers the longer one

The loop replaces a thirteen-step loop that ran every check on every stage. Every check survives in
one place.

| Earlier step | Where it went | Change |
|---|---|---|
| 1 Library check | Prepare | Now any dependency, ours or external |
| 2 Scenario sign-off | Prepare, once per EPIC at the PLAN gate | Per stage → per EPIC |
| 3 Impact | Prepare | — |
| 4 Build | Build | The builder also updates the docs it changed |
| 5 Check and commit | Build | — |
| 6 Deep test | Challenge, where the review set names a tester | Conditional on appetite (the workflow file) |
| 7 Review (5–7 lenses) | Challenge, scaled | The appetite's review set (the workflow file); UX only when screens changed |
| 8 Decide | Decide and fix | — |
| 9 Fix | Decide and fix | — |
| 10 Verify (per fixer) | Check, once per stage | Per member → per stage |
| 11 Document (writer + cold reader) | Build (builder) + Check (cold reader on how-to/tutorial pages) | No separate writer |
| 12 Accept (per use-case stage) | After the last stage, per EPIC | Per stage → per EPIC |
| 13 Merge | Merge | — |

Three checks became conditional; three moved from per stage or per member to per EPIC or per
stage. No agent check runs twice, except the lead's cheap re-run of the gates after each task, kept
on purpose: it catches what reports claim.
