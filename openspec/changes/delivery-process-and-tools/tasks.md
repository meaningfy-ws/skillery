> Derives from: EPIC `delivery-process-and-tools` ([`proposal.md`](proposal.md)); design in [`design.md`](design.md).

Three build stages, each one PR into `develop`. Each stage's PR ends with its hand-over note as the
last commit (D-1), then the watch-and-merge command, then the end of the session. Appetite LARGE;
this PLAN has an `## Invariants` section, so the tester runs on the stages that change the lint
(D-5): stages 2 and 3. Every stage runs `make bundles` after a skill or agent edit,
`make skill-inventory` after a skill edit, `make lint` while editing and `make validate` as its full
gates, and reports the byte size of each skill it changed, before and after (D-19). Each stage's
CHANGELOG line is written for the installer. The scenarios of `specs/` are signed off on the PLAN's
pull request, before delivery (D-17).

## 1. Stage 1: the process rules

- [x] 1.1 `epic-delivery` stage loop (`references/stage-loop.md`, the six steps in `SKILL.md`):
  the floor, re-labels judged by the checker, and the one fix pass with unmet items and late
  findings going to the developer (D-2, D-3); the tester condition in Prepare, with the rule for a
  PLAN without `## Invariants` (D-5); impact per task in Build and the change check before the task
  commit (D-15); the note as the PR's last commit and watch-and-merge in Merge (D-1, D-7), replacing
  "the lead compacts"; the check ledger rows for the gate limit, impact, the floor and the fix pass.
  The note template as `assets/templates/handover.md` (D-1). Satisfies `epic-delivery` *A stage
  ends with a hand-over note and a fresh session*, *Findings pass a severity floor and a stage has
  one fix pass*, *The adversarial tester runs on its condition*, *A pull request is watched and
  merged by one command*, *Each check runs once, at its moment, with one owner*.
- [x] 1.2 `epic-delivery` workflow file: `reviews.MEDIUM` per D-4; `tester` from MEDIUM up per D-5;
  TINY and SMALL unchanged; `clarity` dropped from `apply.gates` and `ready`'s `criteria` naming
  `evidence/clarity-gate.md` (D-17). Two navigator tests follow the data, no navigator code: the
  expected data of "D-12 epic-delivery" in `mods/navigator/lib/workflow.test.ts` (the new MEDIUM
  set), and "PD-3 skill gate" in `mods/navigator/lib/phase.test.ts`, rewritten to cover PD-3 on a
  synthetic workflow with a skill gate and to assert that the default `apply` no longer warns.
  `make mods` green. Satisfies *The loop scales with the appetite* and *An epic session starts
  from a gated PLAN*.
- [x] 1.3 `epic-delivery` team and sessions: the result line in `references/team-and-briefs.md` and
  the three briefs' Report lines (D-6); the Lead row and the lead-stays-small sentence (D-8); the
  Sessions table and the Planner row per DEC-19 (D-17); the "MUST actively use" paragraph cut to a
  one-line pointer to `guardrails` (D-19); the review-set paragraph of `SKILL.md` rewritten for
  MEDIUM by default and the small-stage rule from LARGE up. Satisfies *A challenge or check result
  ends in one line*, *The lead stays small*, *An epic session starts from a gated PLAN*.
- [x] 1.4 `epic-planning`: step 8 holds the two-run limit at every appetite and on any re-gate, the
  second run reading only the listed gaps (DEC-2), each run's verdict written to
  `evidence/clarity-gate.md` (D-17); *The shaping session* ends with each PLAN gated
  and its scenarios signed off, with the note of D-1 allowed between an EPIC and its PLAN (D-17).
  Satisfies `epic-shape` *Planning effort follows the appetite* and *The PLAN is derived and gated
  while shaping*.
- [x] 1.5 `guardrails` §6: the stage boundary is a fresh session from the hand-over note, not a
  compaction (DEC-1); the "batch the reads" bullet (D-8). `agents/team-lead.md` body: questions
  between stages follow the note (no description change). Satisfies `subagent-dispatch` *A stage
  boundary is a fresh session* and *The coordinator batches its reads*.
- [x] 1.6 Agent scenarios, rewriting what goes stale and adding what is new:
  `tests/features/epic-delivery.feature` (the MEDIUM and LARGE rows of the appetite outline; the
  floor and a re-label; the one fix pass and an unmet item; the tester with and without an
  invariant, and with no `## Invariants` section; the result line; watch-and-merge; the note and
  the fresh session); `tests/features/agents/team-lead.feature` (one EPIC per session; no builder
  task; the note before the merge); `tests/features/agents/epic-planner.feature` (no third gate run
  at MEDIUM; the session ends with the PLAN gated). Each traces to its DEC- and requirement.
- [x] 1.7 Pages that describe the MEDIUM allowance or compaction between stages:
  `docs/development/workflows.md`, `docs/environment/navigator.md`, the small-stage lines of
  `skills/meaningfy-code-review/SKILL.md` (D-4).
- [x] 1.8 Close stage 1: CHANGELOG line (BREAKING for a lead that compacted between stages or relied
  on five lenses at MEDIUM); `make validate` green; the PR; the note committed; watch-and-merge; the
  session ends.

## 2. Stage 2: the tool table and the agents

- [ ] 2.0 Cold-start check of stage 1's note: the developer starts this session with the note's
  prompt and records the result in `evidence/cold-start.md` (D-11).
- [ ] 2.1 `skills/guardrails/references/activity-tools.md`: the table of D-9 and the Serena
  paragraph; the one-line pointer in §5. Satisfies `activity-tools` *One table recommends the tools
  for each activity* and *Serena is encouraged for everything it supports*.
- [ ] 2.2 `tools/repo_lint`: the `activity_tools_table` check (D-10, INV-1), with passing and
  failing fixtures in `tests/test_repo_lint.py` and `tests/test_repo_lint_negative.py`. Satisfies
  `activity-tools` scenario *The table names a tool an agent cannot call*.
- [ ] 2.3 opencode: one probe of whether Serena's REPL is reachable and under which name; the
  *opencode* cells give the name, or "unverified, gap" with the gap recorded in
  `docs/environment/dual-cli/compatibility.md`.
- [ ] 2.4 Agents: `agents/implementer.md` preload and the *Skills* "load when" list (D-16), Glue
  step 1 and the HIGH/CRITICAL refusal removed, and its Dispatch contract *Output* and *Report*
  no longer ask for an impact summary (D-15), a pointer to the table;
  `agents/code-reviewer.md` points to the table; `agents/team-lead.md` gains `mcp__gitnexus__*` and
  `ToolSearch` and a pointer to the table (D-15). No description changes. `make bundles`.
- [ ] 2.5 Agent scenarios, rewriting what goes stale: `tests/features/agents/implementer.feature`
  (the Background's five skills become one; "Impact decides whether editing proceeds" is replaced
  by the lead's per-task check; its report carries no impact summary; it loads `cosmic-python` in
  a Python repository);
  `tests/features/agents/code-reviewer.feature` (ends with the result line).
- [ ] 2.6 Close stage 2: CHANGELOG line; `make validate` green; the PR; the note committed;
  watch-and-merge; the session ends.

## 3. Stage 3: the instructions

- [ ] 3.0 Cold-start check of stage 2's note, recorded in `evidence/cold-start.md`.
- [ ] 3.1 `skills/project-setup/assets/templates/agentic/AGENTS.md.tmpl`: the budget comment
  (D-13), the habits block and the table pointer (D-14), "Code tools are mandatory" replaced by the
  pointer, impact and change check once per task by the lead with the re-index line carrying
  `--skip-agents-md` (D-15). Satisfies `catalogue-governance` *The instruction template carries the
  habits and a size budget* and *Code checks run once per task*.
- [ ] 3.2 This repository's `AGENTS.md`, cut per the list under D-13: the GitNexus block rewritten
  between its markers per D-15 (its re-index line included, about 700 characters), the *Dual-CLI
  authoring rules* as a pointer (about 400), the habits block added; at most 12,000 characters.
  `CLAUDE.md`: *Tool habits* cut to the Claude-only names, at most 1,000 characters.
- [ ] 3.3 `tools/repo_lint`: the `binding_size` check (D-13, INV-2), with both fixtures.
- [ ] 3.4 Close stage 3: CHANGELOG line; `make validate` green; the PR; the note committed (its
  *Next* is the measurement, the acceptance demo and the release); watch-and-merge; the session
  ends.
- [ ] 3.5 Start-weight measurement after the merge, on one day, from the base and the new checkout
  with `--plugin-dir` (D-12), into `evidence/start-weight.md`.

## After the last build stage

Acceptance demo (LARGE, mandatory): the developer is shown the cold-start record, the start-weight
record, both lint checks failing on a planted row and a planted oversize, and one stage loop walked
through on the new text; the verdict goes to `evidence/acceptance.md`. Docs stage: pages under
`docs/development/` that describe the stage loop or the tool habits beyond those of task 1.7, per
`technical-writing`; else "no docs owed". Release per `meaningfy-release` (DEC-15). Proof on the
next EPIC (DEC-14, check 4): the lead of the first EPIC delivered after the release records in
`evidence/measured-epic.md` the stages per session, the gate runs per PLAN, and the lead's peak
context against the old runs (`session_digest.py` `max_ctx`). Archive per `spec-stewardship` once
that record exists.

## Roadmap

- [x] 1.1 · [x] 1.2 · [x] 1.3 · [x] 1.4 · [x] 1.5 · [x] 1.6 · [x] 1.7 · [x] 1.8
- [ ] 2.0 · [ ] 2.1 · [ ] 2.2 · [ ] 2.3 · [ ] 2.4 · [ ] 2.5 · [ ] 2.6
- [ ] 3.0 · [ ] 3.1 · [ ] 3.2 · [ ] 3.3 · [ ] 3.4 · [ ] 3.5

## Verification

`make validate` green on each stage's head commit, `openspec validate delivery-process-and-tools
--strict`, the agent scenarios run by hand and recorded, and the four checks of DEC-14 in
`evidence/`.
