<!-- STATUS: EPIC shaped 2026-11-09 from inputs/seed.md (owner decisions D-a, D-b; PR #162 folded),
     inputs/evidence-skillery-time.md, the rdf-persistence evidence in the seed and its cross-check
     (inputs/rdf-persistence-issue-agent-efficiency.md). Owner constraint: every rule is
     repository-independent; skillery and rdf-persistence are evidence only.
     Round 1 (Q-1..Q-12) answered 2026-11-09 (inputs/qa.md): appetite LARGE, docs workflow in scope.
     Round 2 (Q-13..Q-16, the documentation workflow's shape) answered the same day. FROZEN
     2026-11-09. PLAN derived the same day (design.md, tasks.md). Round 3 (R3-1, R3-2) confirmed
     design D-7 and D-4 as owner decisions, folded into DEC-4 and DEC-9. R3-3 (after the
     independent gate) moved the hook's home: DEC-12 amended, Appetite checked (logged there). -->

# EPIC: lean delivery — each check once, at its moment, with one owner

**Parents** (repositories named here are evidence only, never rule sources): the owner's positions and decisions of 2026-11-09 (`inputs/seed.md`: positions 1–7,
D-a, D-b; *Cross-check with rdf-persistence*); rdf-persistence's `agent-efficiency` change
(DEC-2..DEC-8, `inputs/rdf-persistence-issue-agent-efficiency.md`); PR #162 (closed, `inputs/pr162-efe7e39.diff`); the `epic-delivery` capability
(`openspec/specs/epic-delivery/spec.md`); the processes owned by `epic-delivery`, `epic-planning`,
`clarity-gate`, `meaningfy-code-review` and `guardrails` (*Subagent dispatch*).

## Appetite

**LARGE** (Q-7). Two related capabilities: the cost model of delivery, stated once in
`epic-delivery` with its neighbours (`epic-planning`, `clarity-gate`, `meaningfy-code-review`,
`guardrails`, the testing checklist) touched in one place each; and a new documentation workflow
owned by `technical-writing`. A boundary moves (docs beyond the change's own move out of the build),
workflow files follow, a phase is renamed, two agents' tool access changes, one hook is added, six
runbooks are re-pointed. Delivered in stages. LARGE's review set applies (five lenses per stage
PR, checker, adversarial tester) and the acceptance demo is mandatory. If the work needs new
navigator code beyond the phase rename, or a hook beyond the no-polling deny, stop and re-shape.
*Checked 2026-11-09 after R3-3:* shipping the hook as a hooks-only mod in `meaningfy-core`, with
its opencode handler, needs no navigator code and adds no other hook, so the rule is not
triggered; it does add catalogue tooling (the bundle generator, one lint check, the opencode
plugin), bounded by design D-5 *Tooling it needs*. Anything beyond that list stops the work for a
re-shape (design RISK-10).

## Why

The method is correct but pays for its checks several times. Measured: in skillery the full gates
ran 223 times (131 min) in 15 sessions and sit on three delivery phases; in rdf-persistence the
shell waits 3–5× longer than the model thinks, half of it polling loops, with the full suite run
4–6× per stage and each task's gates paid by the builder and again by the lead. A SMALL PLAN took
four clarity-gate runs and five question rounds. Meanwhile two checks are missing: validation has
no step in the workflow, and no review lens owns "the changed docs agree with the code"; manuals and
architecture pages have no process of their own, so the build either carries them or drops them. And the
builder and reviewer agents cannot reach the code-intelligence tools the method tells them to use:
their fixed tool lists exclude MCP tools, so builders read whole files and rewrite code through
heredocs, and a reviewer could not run the impact check.

## Solution outline

One rule runs through the change: **every gate, review and validation step survives, runs once, at
the moment the method names, with one owner.** Concretely:

- **Planning is proportional.** PLAN depth follows appetite; TINY/SMALL run the clarity gate at
  most twice, after which the developer decides each gap; questions go out in rounds (#162).
- **Builders own their quality.** Test-first, the project's narrow checks while working, the
  project's task gate once before reporting (its full gates unless its `AGENTS.md` names a narrower
  one), and a verifiable report. The lead reads diff and
  report and re-runs only on a named trigger (D-b).
- **Independence sits at the stage PR**: the full gates once, CI, and the appetite's review set,
  once per stage (D-a). Tests are re-run only where they failed.
- **Waiting is not polling.** A long command runs in the foreground when it fits the tool's
  timeout, or in the background with one completion notice; never a sleep loop. A hook denies the
  loop and fails open.
- **Members can use code intelligence.** The builder and reviewer agents may call the project's
  code-intelligence tools (symbol read and edit, impact) where the project installed them.
- **Validation gets its step**: the acceptance demo, offered at every appetite, mandatory from
  LARGE, a skip recorded; the delivery workflow's `accept` phase replaces `verify`.
- **Docs have two homes.** Docs the change makes false are fixed in the build and checked by L2;
  manuals and architecture pages get their own documentation workflow, owned by
  `technical-writing`, validated by the cold reader.
- **The method stays project-neutral.** Skills say "the project's narrow checks" and "the
  project's full gates"; each repo's `AGENTS.md` names its targets.

Outcome: on the next delivered EPIC the success measure below holds, and nothing the old loop
caught is lost (the stage-loop's coverage table proves it, check by check).

**Success measure** (Q-9, counts only): per stage, beyond one task-gate run per task, the full gates run locally at
most twice (before the PR, after the fix round), plus CI (wording clarified 2026-11-09 by design
D-4: a builder's per-task gate is counted apart); no sleep-polling call; every lead re-run names its trigger; a
TINY/SMALL PLAN reaches the gate in at most two runs. Measured from transcripts, as in the evidence.

## Key decisions

- **DEC-1**: Method first. Behaviour changes in the skills; the workflow files (epic-delivery,
  epic-shaping) are then made faithful to them; navigator only mirrors the files. — Rejected:
  tuning the workflow file or navigator to change behaviour.
- **DEC-2**: Project-neutral wording. Method skills name "the project's narrow checks", "the
  project's full gates", CI and the code-index refresh, never a repo's targets. Each repo's
  `AGENTS.md` names them; `project-setup`'s `AGENTS.md` template names the slot. The same holds
  for hooks, tools and decisions borrowed from any repository: they are evidence, and the method
  states the rule they illustrate. — Rejected: any repository's targets, hook or tool choice as a
  method rule.
- **DEC-3** (D-a, Q-8): The review set of the appetite runs once per stage, on the stage's PR;
  never continually, never per task, not only at EPIC end. The sets per appetite are unchanged:
  one combined L2+L3 pass at TINY/SMALL, five lenses from MEDIUM. — Rejected: per-task review;
  EPIC-end only; five lenses at every appetite.
- **DEC-4** (D-b, Q-10, R3-2): Builders own and guarantee their quality, run the project's task
  gate once per task (named in its `AGENTS.md`: the full gates by default, a narrower gate where the
  project says so; the full gates then run once at the stage PR, plus CI), and return a verifiable report
  (command, exit code, counts, time per gate run). The lead re-runs only when the report is
  incomplete or inconsistent, when parallel builders touched shared files, or after a fix round;
  otherwise it re-runs nothing per task, reading the diff and the report.
  Accepted residual risk: a bad report is found at the stage PR, bounded by stage size. Replaces
  the gotcha "trusting a member's report" and #162's per-task lead re-run. — Rejected: the lead
  re-running the project's fast quality gate per task (evidence: rdf-persistence).
- **DEC-5**: Each check has one moment and one owner, listed in one table in `epic-delivery`
  (the stage loop's coverage table, extended). The full suite runs once per stage before the PR
  and once after the fix round; between, only the failing tests are re-run until green. A reviewer
  reads the gate report instead of re-running the suite. — Rejected: re-running "to be sure".
- **DEC-6**: Questions go out in rounds, in shaping and in delivery, unless an answer changes the
  next question (#162).
- **DEC-7**: PLAN depth follows appetite. A TINY/SMALL EPIC runs the clarity gate at most twice;
  the gaps left go to the developer as one round; an accepted gap is a `DEC-` in `design.md` and
  `clarity-gate` names this one exception (#162).
- **DEC-8** (Q-2): The acceptance demo is offered whenever the EPIC delivers or changes a use case,
  skippable below LARGE, mandatory for LARGE, VERY LARGE and HUGE; a skip is recorded with who
  decided and why in `evidence/acceptance.md`. An agent never marks it done. The demo loses
  "(provisional)" once its first real run is recorded; the validation review stays provisional
  until an iteration ends.
- **DEC-11**: Builders and reviewers use the project's code-intelligence tools (symbol-level
  reading and editing, impact analysis) when the project has them: the builder reads and edits
  symbols, the reviewer reads symbols and runs the impact analysis; neither edits through
  whole-file rewrites where a symbol edit exists. These tools are for code only; the truth stays in
  the spine (`openspec/specs`), never in a tool's own memory. `implementer` and `code-reviewer`
  reach them by inheriting the session's tools (no tool allow-list, Q-12); `code-reviewer` stays
  read-only through disallowed edit tools and its brief. Dual-CLI parity holds or the gap is
  recorded. — Rejected: members on whole-file reads only (FC-11); per-product wildcard entries
  (they name products); a per-repo agent copy; the lead relaying results only.
- **DEC-12** (amended by R3-3): No-polling enforcement: the rule lives in `guardrails` §5; one hook denies
  sleep *loops* only (a single sleep and one blocking wait, for example on CI, stay allowed); the hook fails open on any error of its own; its deny
  message offers the foreground first (a subagent may get no completion notice, and most targets
  fit the tool timeout), the background with one notice second. It ships with the catalogue, not
  with a project: a plugin-level hook in `meaningfy-core`, the bundle every Meaningfy session
  installs (as navigator ships its `hooks.json`), and the same check in the catalogue's opencode
  plugin, or a recorded gap (R3-3). — Rejected: a `project-setup` template (Q-3's first answer,
  superseded: it reaches only newly scaffolded repos); a navigator rule; a rule with no hook.
- **DEC-9** (Q-1): Docs have two homes. (1) Docs the change makes false are fixed by the builder in
  the task that made them false; "the changed docs agree with the code" is an explicit L2 item.
  (Clarified by design D-17: within the stage that made them false, before its PR.)
  (2) Manuals (user, installation, developer) and architecture pages are written in a
  documentation workflow owned by `technical-writing`, with a workflow file in that skill and the
  cold reader as its validation. It runs as the last stage of the epic session, before archive,
  only when the EPIC changed a use case, the architecture, installation or user-facing behaviour;
  otherwise the lead records "no docs owed" (Q-13). It covers the manuals, the architecture pages,
  and the C4 views and ADRs brought up to date as built through `architecture`'s method, copying
  none of it and taking no new decision; it never changes an ADR's status, and an as-built fact
  that contradicts an ADR goes to the lead as a finding for the developer to decide (Q-14, R3-1). Its phases: inventory, write, verify, cold-read,
  publish (Q-15). The cold reader runs where a page changed: a how-to or tutorial changed in a build
  stage, and every task-oriented page the docs stage writes; explanation and reference pages get
  the lightweight clarity check (Q-16). — Rejected: all docs in the build; all docs out of it; a
  separate docs session; once per release.
- **DEC-13** (Q-6): The delivery workflow's phases are ready, apply, accept, archive. `accept`
  holds the acceptance demo or its recorded skip; `verify` is gone. **BREAKING** for a repo
  workflow file naming `verify`. — Rejected: keeping `verify` with or without its gates.
- **DEC-14** (Q-4): The project's code index is refreshed at Prepare and before Challenge, in the
  background; a failed refresh warns and the step falls back to reading. — Rejected: after every
  commit; a post-commit hook.
- **DEC-15** (Q-5): The flaky-test policy lives in the `cosmic-python` testing checklist (a flaky
  test is quarantined into its own task or issue, never chased by re-runs inside a stage);
  `epic-delivery` points to it.
- **DEC-16** (Q-11): The default delivery workflow names a neutral gate, `full-gates`; each repo
  sets its command with `extends` in its own workflow file. — Rejected: a repo target in a default
  file (FC-10).

## Recorded failure cases (acceptance tests)

Each becomes a scenario in `tests/features/epic-delivery.feature` or a check in the PLAN.

| Id | Failure (source) | Passes when |
|---|---|---|
| FC-1 | SMALL PLAN: 403-line design, 4 gate runs (navigator-workflows) | TINY/SMALL stops at 2 runs; gaps go to the developer |
| FC-2 | 10 one-at-a-time questions, 73 min blocked; 5 rounds (skillery evidence) | questions go out as one round |
| FC-3 | Full gates on apply, verify and archive (workflow file) | the full gates have one moment per stage |
| FC-4 | Full suite 4–6× per stage; task gates paid twice (rdf-persistence) | DEC-4, DEC-5 hold |
| FC-5 | Half the slow calls are sleep-polling loops, one polled 6× (rdf-persistence) | no polling; one blocking wait |
| FC-6 | `verify` re-asks the review the stage loop ran (workflow file) | no phase repeats a stage-loop check |
| FC-7 | Doc disagreement W2/W6 found only incidentally (navigator-workflows) | L2 owns doc agreement |
| FC-8 | Validation has no workflow step; demo never run (epic-delivery) | the demo or its recorded skip is a step |
| FC-9 | Re-index after every commit, failures 2–4 min (rdf-persistence) | refresh at Prepare and before Challenge (DEC-14) |
| FC-10 | The default workflow gate names `make validate` (workflow file) | no repo target in a default file |
| FC-11 | Builders read whole files and rewrite via heredocs; reviewer: "gitnexus MCP tools are not available" (rdf-persistence; navigator-workflows) | both agents reach the tools where installed |

## Rabbit-holes

- **Neutral becomes vague.** "The project's full gates" means nothing in a repo whose `AGENTS.md`
  does not name them. The brief must fail visibly then (the lead cannot write it), not guess.
- **Phase rename** (DEC-13) is BREAKING for a repo workflow file that `extends` epic-delivery and
  names `verify`; navigator tests name it too.
- **Flaky tests** tempt seed-chasing inside a stage; the policy must move them out, not hide them.
- **Agent tools differ per CLI.** Inheriting the session's tools must hold on opencode too
  (an agent with no tool list gets the MCP tools); a test proves it or the gap is recorded.
- **A docs stage in every EPIC.** The stage runs only on its condition (DEC-9); otherwise one
  line, "no docs owed", is the whole cost.
- **Docs time invents decisions.** The docs stage records C4 and ADRs as built; a decision it
  finds missing goes back to `architecture`, not into the page.
- **A deny hook that blocks real work.** A false positive stops a builder; hence loops only and
  fail open.
- **Measuring** the success measure needs transcripts; no new telemetry is built for it.

## No-gos

- No gate, review lens, checker, tester or validation step is dropped.
- No new navigator feature beyond what the phase rename and the new workflow file need; no hook
  beyond the no-polling deny (DEC-12); no re-index hook.
- No code-intelligence product named as a rule; no tool's own memory used as a source of truth;
  no MCP server installed by the catalogue.
- No repository's targets, hooks or tool choices in a method skill, agent body or default workflow
  file; no edit to skillery's `AGENTS.md` as part of the method (see Impact for the one flagged
  consistency edit).
- No change to the appetite sizes, the review set per appetite, or the five lenses' regions beyond
  the L2 doc-agreement item.
- No authoring of C4 views or ADRs by the documentation workflow beyond what Q-14 decides; no
  docs site tooling (build, publish pipeline) beyond the project's own docs gate.

---

## What Changes

- `epic-delivery` (SKILL, `stage-loop.md`, `team-and-briefs.md`, `verification-validation.md`):
  builder-owned quality and the report, re-run triggers, one-moment-per-check table, waiting rule,
  acceptance demo or recorded skip; gotcha replaced.
- `epic-delivery.workflow.json`: phases ready, apply, accept, archive (**BREAKING**), gate
  `full-gates`; `epic-shaping.workflow.json` checked against #162's rules (design D-15: no change).
- `technical-writing`: the documentation workflow section and its new workflow file; navigator
  default lists name it.
- `epic-planning` and `clarity-gate`: #162's rules.
- `meaningfy-code-review`: L2 owns doc agreement and reads the gate report.
- `guardrails` §5: the verifiable report fields; the no-polling rule (DEC-12).
- New hooks-only mod `no-poll-loops` in `meaningfy-core`; the opencode plugin's handler; the bundle
  generator, the mods target and one lint check accept a second, hooks-only mod; `hooks.yaml`
  intent; `docs/development/hook-bindings.md` corrected (it describes a projection that does not
  exist).
- Agents `implementer`, `code-reviewer`: no tool allow-list; `code-reviewer` disallows edits (DEC-11).
- `cosmic-python` testing checklist: the flaky-test policy (DEC-15).
- `project-setup` `AGENTS.md` template: the slot naming the project's narrow checks, fast
  quality gate, full gates and code-intelligence tools.
- Runbooks: `build-lifecycle`, `opsx-runbook`, `dod-quality-gates`, `working-with-agents`,
  playbooks `developer`, `solution-builder`. CHANGELOG.

## Capabilities

### New Capabilities

- `documentation-workflow`: when manuals and architecture pages are written, by whom, through which
  phases, and how the cold reader validates them (DEC-9).

### Modified Capabilities

- `epic-delivery`: builder-owned quality, re-run triggers, one moment per check, the acceptance
  demo's rule.
- `subagent-dispatch`: the verifiable report; waiting without polling (DEC-12).
- `dual-cli-distribution` (only if the opencode test shows a gap): agents without a tool list.
- `workflow-definitions`: the delivery phases and the `full-gates` gate (DEC-13, DEC-16); the
  documentation workflow file among the defaults.

## Impact

Nine skills (`epic-delivery`, `epic-planning`, `clarity-gate`, `meaningfy-code-review`,
`guardrails`, `cosmic-python`, `project-setup`, `technical-writing`, `architecture`; one place
each, `epic-delivery` and `technical-writing` more), two workflow files changed and one new,
navigator tests, a new hooks-only mod with its tests, `tools/` (bundle generator, lint, opencode
plugin and agent map), `package.json` `files`, two agents' frontmatter, the `project-setup`
`AGENTS.md` template, the feature files, six runbooks and the developer docs. The
catalogue's own regeneration and validation run after the edits.

**Flagged separately, not part of the method:** skillery's own `AGENTS.md` names "the narrow checks
per artifact" only if the rewritten `epic-delivery` makes its current text false (today it names
`make validate` as the full gate, which stays true). Proposed only as a consistency edit in the
delivering stage, with its own commit, and only if the PLAN finds such a contradiction. skillery's
repo-level workflow overrides setting its `full-gates` and `docs-gate` commands (DEC-16) are the
same kind of flagged edit.
