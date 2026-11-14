# EPIC: Delivery process and tools — a smaller lead, bounded rounds, tools that exist

## Appetite

LARGE. Several related rules change in three skills, two worker agents and the instruction
template; living specs are modified; delivered in stages.

## Why

Two weeks of sessions show where delivery spends its tokens: the lead reads a large context again
on every call, a stage boundary is not a reset an unattended lead can perform, gate and fix rounds
have no limit above SMALL, and the instructions ask for tools under names the sessions do not have.
The owner wants the same results for less time and fewer tokens. The measurements are in the
retrospective's inputs:
[`findings`](../delivery-retrospective/inputs/findings-2026-11-14.md) and
[`second pass`](../delivery-retrospective/inputs/second-pass-2026-11-14.md). The questions and
answers of the shaping session are in
[`inputs/elicitation-2026-11-14.md`](inputs/elicitation-2026-11-14.md).

Golden-thread parents: the living specs `epic-delivery`, `epic-shape` and `subagent-dispatch`, and
the retrospective seed (decisions 6, 8, 9, 11, 14, 15, 16).

## Solution outline

1. **The lead stays small.** A stage ends with a hand-over note and the end of the session; the
   next stage starts fresh from the note. One session delivers one EPIC. The lead does not build,
   and it batches or delegates its reading.
2. **Rounds have a limit.** The clarity gate runs at most twice at any appetite. Review findings
   pass a severity floor before they become fixes, and a stage gets one fix pass. A MEDIUM stage
   takes the small review set unless a risk is recorded. The adversarial tester runs on its
   condition at every size. Watching and merging a PR is one background command.
3. **Tools by activity.** One table says which tools are recommended for each activity, under the
   names each CLI really exposes, with the fallback. Serena is taught and encouraged for everything
   it supports. The workers' briefs and the instructions point to the table.
4. **Lighter starts.** The implementer preloads less. The instruction template gets one short
   habits block, one impact check per task instead of one per edit, and a size budget.

**It succeeds when** each new rule has a passing agent scenario; a fresh session given only a
hand-over note and the change folder starts the next stage without asking what was decided; the
first call of an implementer and of a main session is measured smaller than before, against a
saving the PLAN states; and the next EPIC delivered under the new rules shows no session holding
two stages and no PLAN with a third gate run, with the lead's peak context reported against the
old runs.

**It fails when** the lead's context is as large as before because the note is not enough and the
new session reads everything again; when a limit is met by renaming a round (a "re-check" that is
a third gate run); when the tool table names a tool an agent cannot call; or when a defect that
the removed review work would have caught reaches `develop` and cannot be traced to a rejected
finding.

## Key decisions

- **DEC-1**: At a stage boundary the lead writes a hand-over note in the change folder and ends the
  session. The developer starts the next stage in a fresh session; the note ends with the prompt to
  use. An unattended lead cannot compact, and one overnight run reached about one million tokens of
  context. Rejected: compacting between stages (the rule today); a stage lead subagent per stage; a
  runner script; the lead launching its successor.
- **DEC-2**: The clarity gate runs at most twice on a PLAN at every appetite, and on any re-gate. A
  second run reads only the gaps the first one listed. After the second run the remaining gaps go
  to the developer as one question round, as the rule for TINY and SMALL already says. Rejected: a
  higher limit for larger EPICs.
- **DEC-3**: The adversarial tester runs on a condition at every appetite. This EPIC defines the
  condition once, taking it from `harden-checks-and-tests` D-28, which then cites it. Rejected: a
  tester on every stage from MEDIUM up.
- **DEC-4**: A review finding becomes a fix only at or above a severity floor, and a stage has one
  fix pass, checked by the stage's gate. Findings under the floor are rejected with a reason and
  stay listed in `design.md`. In the most expensive delivery the fixers used more tokens than the
  builders. Rejected: every finding becomes a fix; a verifier round after the fix pass.
- **DEC-5**: A MEDIUM stage takes the small review set by default; a risk recorded for the stage
  restores the full set. Today the small set is an allowance the lead must justify. Rejected:
  keeping the full set as the default.
- **DEC-6**: The lead watches and merges a PR with one background command and its completion
  notice. Rejected: separate calls to check and to merge (about seven per PR today).
- **DEC-7**: One session delivers one EPIC. The lead does not build. It reads several files in one
  call or hands wide reading to a worker. Rejected: leaving this to the lead's judgement.
- **DEC-8**: The recommended tools per activity are one table in `guardrails`, cited by the agents,
  the briefs of `epic-delivery` and the instruction template. Tools are recommended, each with its
  fallback, under the names each CLI exposes; "mandatory" goes. The home is the agent's proposal.
  Rejected: a list in each activity's skill; the list in the binding, which carries no standard.
- **DEC-9**: Serena is actively encouraged for every operation it supports: symbol and reference
  search, file overviews, symbol-level edits, rename, safe delete, diagnostics. The guidance
  teaches the way in that exists, one tool that runs these operations and can run several per call.
  The owner's words: "encourage active usage". Rejected: listing it without teaching it; repairing
  its setup in this EPIC; dropping it.
- **DEC-10**: The implementer preloads only the test-first discipline and loads the other skills
  when the task needs them; the Python skill only in a Python repository. The five preloaded skills
  are 35% of its first call. Rejected: the preload as it is.
- **DEC-11**: The impact check and the change check run once per task, by the lead, in place of
  "before every edit" and "before every commit", in the template and in this repository's
  `AGENTS.md`. They are followed for about 7% and 5% of edits today. Rejected: removing them.
- **DEC-12**: The instruction template gains one short habits block (no polling, Edit not a script,
  Read with a range, batched reads) and a size budget for `AGENTS.md`, checked by lint in this
  repository and stated in the template. Rejected: a longer rule list; no budget.
- **DEC-13**: No new hook. The reading habits change through the table and the habits block, and
  the next retrospective measures whether they did. The agent's proposal. Rejected: a hook that
  denies shell reads, which would also deny the searches the sessions have no other tool for.
- **DEC-14**: Proof of done is the four checks under "It succeeds when". Rejected: scenarios alone.
- **DEC-15**: Released as usual, to every repository at once; a rule that hurts is fixed in a patch
  release. Rejected: a trial in skillery first; two releases.
- **DEC-16**: The instructions of the other repositories are not edited here. Each has its issue
  (rdf-persistence #111, rdf-fingerprinter #86, mapping-workbench-v2 #85, legal-agreements #17).
- **DEC-17**: This EPIC is delivered before `lean-skills` and before the four test EPICs. It
  absorbs the tester condition (DEC-3). It leaves the result line to `harden-checks-and-tests`
  D-29 and shorter descriptions to `lean-skills`.

## Rabbit-holes

- **A note that is too thin or too thick.** Too thin and the new session reads the whole change
  again; too thick and it is the old context on disk. What the note must hold is settled by the
  cold-start check, not by a long template.
- **The floor needs a scale.** The severity floor must use the priority scale the review already
  reports by. Inventing a second scale is the trap. The level is left to the PLAN.
- **Serena's reach on opencode** is not verified. The table names what each CLI exposes; a gap is
  recorded as a gap, not papered over.
- **The condition of DEC-3 at SMALL and TINY.** D-28 was written for MEDIUM; the review sets of the
  smaller sizes may name no tester at all. "On a condition at every size" must not add a tester
  where there is none.
- **The owner's own rule on gate scores** (accept a score close to 9 without a new run) is personal
  and stays in the owner's rules; the skill states only the limit.
- **Navigator** reads the review sets and the session thresholds from the same files. A changed
  default there changes what it shows.
- Left vague on purpose: the name and place of the hand-over note, the figure of the `AGENTS.md`
  budget, the exact rows of the tool table, and the form of the watch-and-merge command.
- Order of stages, for the PLAN to confirm: the process rules; then the tool table and the agents;
  then the instruction template and this repository's own instructions.

## No-gos

- No runner, no session that starts another session, no stage lead subagent (DEC-1).
- No new hook or mod, and no change to the `no-poll-loops` mod (DEC-13).
- No result line for reviews, testers and checkers, and no phase or stage in the traces. Those
  belong to `harden-checks-and-tests` D-29 and to the retrospective tooling EPIC.
- No change to the two retrospective scripts and no new home for them. They are used as they are
  to measure.
- No description changes to skills or agents, and no shrinking of skill bodies (`lean-skills`).
- No edits in other repositories (DEC-16).
- No repair of Serena's or any other tool's setup, and no change to the installed plugins and
  connectors of the owner's machine.
- No new agent and no new skill.
- No change to how many reviewers the LARGE and larger review sets carry.

---

## What Changes

- `epic-delivery`: the stage boundary (DEC-1), the fix rule (DEC-4), the MEDIUM default (DEC-5),
  the tester condition (DEC-3), watch-and-merge (DEC-6), the lead's duties (DEC-7); its workflow
  file carries the changed review sets. **BREAKING** for a lead that relied on compacting between
  stages or on the full review set at MEDIUM.
- `guardrails`: Session hygiene follows DEC-1; a new table of recommended tools per activity
  (DEC-8, DEC-9); batched reads (DEC-7).
- `epic-planning`: the two-run gate limit at every appetite (DEC-2).
- `agents/implementer.md`: a shorter preload (DEC-10). Both workers point to the tool table.
- `project-setup`'s agentic templates, and this repository's `AGENTS.md` and `CLAUDE.md`: the
  habits block, the code-navigation text for tools that exist, one impact check per task, the size
  budget (DEC-11, DEC-12).
- `tools/repo_lint`: the budget check, and the check of the table against the agents' tool lists.
- Agent scenarios under `tests/features/` for each new rule.

## Capabilities

### New Capabilities

- `activity-tools`: the recommended tools for each activity, by the names each CLI exposes, with
  fallbacks, and the check that keeps the table true.

### Modified Capabilities

- `epic-delivery`: stage boundary, fix rule, review default at MEDIUM, tester condition, lead's
  duties, watch-and-merge.
- `epic-shape`: the gate limit at every appetite.
- `subagent-dispatch`: session hygiene at a stage boundary, and batched reads.
- `workflow-definitions`: the review sets. To confirm when the PLAN is derived, together with the
  spec that owns the instruction template.

## Impact

- Skills `epic-delivery`, `guardrails`, `epic-planning`, `project-setup`; agents `implementer` and
  `code-reviewer`; the generated `bundles/` tree and the inventory that follow them.
- `AGENTS.md`, `CLAUDE.md`, `tools/repo_lint`, `tests/features/`, the navigator mod's inputs.
- Every repository that installs skillery gets the new delivery rules at the next release; a
  repository scaffolded before it keeps its old instructions until its own issue is done.
- `harden-checks-and-tests`, `activity-test-profiles`, `generic-task-test-profiles`,
  `test-suite-care` and `lean-skills` are delivered after this EPIC and rebase on it.
