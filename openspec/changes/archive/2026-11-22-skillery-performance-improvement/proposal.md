<!-- STATUS: DRAFT, shaped 2026-11-22 from the Langfuse analysis
     (inputs/seeds/langfuse-analysis-2026-11-22.md). Round 1 answered (DEC-1 to DEC-4);
     the instruction audit added the same day (inputs/seeds/instruction-audit-2026-11-22.md);
     round 2 answered (DEC-5, DEC-6, DEC-8, DEC-9) and the stages added; the risk round answered
     (DEC-7, RISK-1 to RISK-6 in inputs/qa.md); round 3, the owner's inputs on the audit, answered
     (DEC-10 to DEC-17, the stages revised). DEC-10 conflicts with AGENTS.md's dual-CLI mandate;
     flagged, the governance change is outside this EPIC. Elicitation complete. Readiness-checked
     (pass); PLAN derived (design.md D-1 to D-18, tasks.md, nine spec deltas), attacked (15
     counterexamples folded in); gate run 1 at 8.3/10, run 2 at 9.15/10, pass. The log is
     evidence/clarity-gate.md. Scenarios await the developer's sign-off; delivery is epic-delivery's. -->

# EPIC: skillery performance improvement

**Parents:** the owner's request of 2026-11-22 and the Langfuse analysis
([`inputs/seeds/langfuse-analysis-2026-11-22.md`](inputs/seeds/langfuse-analysis-2026-11-22.md))
and the audit of the instructions behind it
([`inputs/seeds/instruction-audit-2026-11-22.md`](inputs/seeds/instruction-audit-2026-11-22.md));
the live capabilities [`subagent-dispatch`](../../specs/subagent-dispatch/spec.md),
[`epic-delivery`](../../specs/epic-delivery/spec.md),
[`activity-tools`](../../specs/activity-tools/spec.md),
[`session-navigation`](../../specs/session-navigation/spec.md) and
[`lean-skill-standard`](../../specs/lean-skill-standard/spec.md).

## Appetite

`LARGE` (DEC-1): several related capabilities change (dispatch, delivery, session hygiene, the
context footprint of the bundles) and existing skills and agents migrate. Delivered in stages,
measurement first.

## Why

Two weeks of coding (2026-11-08 to 2026-11-22) consumed 6.9 B tokens over 215 sessions and about
180 hours of model time. 96.5 % of those tokens are the same context read again on every call:
the cost is **calls x context**, and the skillery method drives both. Sessions run long (median
main-thread context 199 k, up to 980 k), every session and subagent starts at 32-88 k tokens
before any work, about 55 % of the 1,124 subagent spawns verify or repair rather than build, and
Bash round trips (32.6 k) multiply the calls. Nobody sees it, because Langfuse shows $0.

## Solution outline

The outcome is **the same delivered work for far fewer tokens and less waiting**, measured the
same way the problem was found.

1. **Measure first.** A repeatable usage report over a window (the queries of the seed, made a
   tool or a documented procedure), model prices set in Langfuse, and the seed's numbers as the
   baseline. Every later change is judged against it.
2. **Lower the floor.** Cut what skillery puts into every context: skill descriptions, the
   SessionStart hook output, the bindings; give each agent only the tools and skills its role
   needs, so a reviewer or fixer does not start at 80 k. Document which MCP servers a project
   should enable.
3. **Keep sessions short.** Make the existing session-hygiene rule happen rather than hoped for:
   a natural reset point at each stage and task boundary of `epic-delivery`, a hand-over note
   that makes a fresh session cheap, and a signal when the context passes a threshold.
4. **Spend verification where it pays.** Scale review lenses, cold readers, gate runs, attacks and
   fix passes to the appetite and the risk more strictly; let small findings be fixed without a
   fresh 80 k subagent; bound fix loops.
5. **Fewer, larger round trips.** Read and search with Read, Grep and Serena rather than Bash
   `sed`/`grep`/`cat`; batch commands; keep gate and CI output short; wait on background work
   with one notice, not repeated reads.
6. **Right model for the role.** Name a model per agent role so builders and reviewers use the
   cheaper model where it does the job and the largest model runs short, high-value turns.
7. **Projects set up lean.** `project-setup`'s templates give new and modernised repositories
   quiet gates, a thin AGENTS file, a working code-intelligence setup and no duplicated
   instructions, so the method's savings are not lost in each repository.

The audit (`inputs/seeds/instruction-audit-2026-11-22.md`) traces each outcome to the
instructions that cause it today; its ranked levers order the stages.

### Stages, in order (shaping altitude; the PLAN cuts the tasks)

1. **Measure and clean.** Model prices in Langfuse; the report procedure in
   `session-retrospective`; the baseline page (DEC-6); the composition of the ~70 k starting load
   measured with the CLI's context command for a session, an implementer and a reviewer; the
   sanitation inventory per machine and the owner-approved uninstall list (DEC-17).
2. **End sessions.** `guardrails`: absolute token thresholds in `session-thresholds.json` (the
   navigator reads them already); session hygiene wins over a conflicting repository rule, and
   `rule-learner` flags such a rule when it is proposed. `epic-planning`: shaping and planning of
   one EPIC in one session with a compaction once `proposal.md` is saved, a fresh session per EPIC
   of an initiative, question rounds capped by appetite. `epic-delivery`: the fixer bounded and
   its `blocked` report (DEC-12); the lead compacts at the safe points, reads `--stat` and
   spot-checks, the checker reads the diff (DEC-13).
3. **Scale verification.** P-0006 scoped by appetite with the attack folded into gate run 1;
   `meaningfy-code-review` defaults to two grouped lenses with combined goals and the five-lens
   set opt-in on a recorded risk; `epic-delivery` lets the lead apply a small finding itself,
   merges checker and cold reader when no how-to page changed, makes the tester opt-in, runs
   independent spawns in parallel (DEC-13); GitNexus at the two points of a piece of work, passed
   in the brief (DEC-11). R-0004 and P-0006 revised through `rule-learner` (DEC-3).
4. **Lower the floor.** Agents: skills preloaded instead of the `Skill` tool, exact MCP tool
   names instead of wildcards, the model matrix and agents that match it (DEC-15), a slim
   read-only `checker` agent; the `epic-planner` loses `stream-coding` (DEC-16) and the duplicate
   load. `clarity-gate`: the Meaningfy checklist and the `design.md` budget (DEC-9). Briefs: a
   short builder card instead of `team-and-briefs.md`, the principles catalogue read by id, rules
   passed in the brief instead of a rulebook load per subagent (a lead-only load mode in
   `rulebook`), Serena essentials in the brief instead of `initial_instructions`, the report shape
   named in every brief (DEC-13).
5. **Quiet the tools.** The tool-output principle in `guardrails` (DEC-14). `project-setup`
   templates: `pytest -q -rfE` and no terminal coverage table, a thin AGENTS template with
   repository-specific content only, the `no_polling` hook and the gate-shape table shipped, a
   Serena config that lists every language and is rooted per worktree, the GitNexus block never in
   `CLAUDE.md` and `--skip-agents-md` by default, no project copies of user-level skills.
   `epic-delivery`: CI by `gh pr merge --auto` or one background watch; one full gate per stage.
   A mod that warns on the noisy forms (`sed -n`/`cat`/`grep` file reads, `-v`).
6. **Measure again** (DEC-2) over two weeks after release, on the stage-1 procedure; the result
   page closes the EPIC or re-opens a stage.

## Key decisions

Round 1 answered by the owner on 2026-11-22 (`inputs/qa.md`).

- **DEC-1** (Q-1): one `LARGE` EPIC delivered in stages, measurement first — one bet keeps the
  levers comparable against one baseline; rejected: splitting now. Split only if stage 1's
  measurement shows one lever dominates.
- **DEC-2** (Q-2): success is measured on the seed's queries over a two-week window after
  release: tokens per user turn down at least 40 %, median main-thread context under 120 k,
  heaviest subagent floor under 40 k, with no drop in the gates passed — rejected: -25 % (too
  little to change the habit) and -60 % (needs a different method).
- **DEC-3** (Q-3): verification is scaled, not removed. Every gate stays (tests first, review
  before merge, the clarity gate); lenses and readers scale with appetite and risk, the lead fixes
  small findings in its own context, fix loops are bounded to one pass. R-0004 and P-0006 are
  revised to "when it pays", through `rule-learner` — rejected: lighter subagents only, and
  leaving it as is.
- **DEC-4** (Q-4): session hygiene is signalled by a mod that warns past a context threshold and
  at stage boundaries, with a hand-over note that makes a fresh session cheap; it never blocks —
  rejected: a blocking hook, and guidance only.
- **DEC-5** (Q-5): the model per role is named in the agent definition (builders and single-lens
  reviewers on the mid model, the lead and the merged review on the large model, the largest on
  request) so it holds on both CLIs; the owner overrides per session — rejected: choosing per
  brief, which no one does under load.
- **DEC-6** (Q-6): the usage report is a documented procedure owned by `session-retrospective`
  (its `references/`: the Langfuse queries and how to read them), and each report is a dated page
  under `docs/practice/ai-coding/usage-reports/`, this EPIC's seed being the first and the
  2026-11-09 evidence of `lean-delivery` re-filed as the one before it, so the series is
  comparable as skillery advances — rejected: a committed tool (built only if the report is run
  more than monthly) and a dashboard (F-7 is fixed by setting model prices in Langfuse).
- **DEC-7** (Q-7, risks): the EPIC guards against one harm explicitly, a weak PLAN passing the
  slimmer gate (RISK-3), and builds three mitigations: no stage starts until the previous one's
  effect is measured against the baseline and a stage that lowers gates-passed is rolled back
  (RISK-1, RISK-2); the five-lens review set and the full checklist stay one recorded-risk flag
  away (RISK-3, RISK-4); the report procedure pins the exact Langfuse queries and fields so a
  tracing change is detected (RISK-1). Accepted: misses a fifth lens would catch at SMALL and
  MEDIUM (RISK-4), a re-tuning pass after a CLI or model release (RISK-1, RISK-2), a noisy first
  measurement (RISK-5), existing repositories lagging the templates (RISK-6) — rejected: a single
  thresholds-and-models asset as a mitigation in its own right (it is a PLAN detail, not a bet).
  The risks are listed in `inputs/qa.md` Q-7 and go to the PLAN's Risks.
- **DEC-8** (Q-8): the repository-side causes found in rdf-persistence and MWB2 are filed as
  issues in those repositories (`inputs/qa.md` Q-8 lists them) and are not delivered here; this
  EPIC fixes the `project-setup` templates so a new or modernised repository does not repeat them
  — rejected: fixing the repositories from this EPIC (wrong owner, and the fixes pay at once).
- **DEC-9** (Q-9): the borrowed Stream Coding checklist is replaced by a Meaningfy clarity
  checklist of about 4 KB with minimums scaled by appetite, the `stream-coding` preload leaves the
  `epic-planner`, and `design.md` gets a size budget per appetite enforced by lint — rejected:
  keeping the checklist and trimming the PLANs by hand.
- **DEC-10** (Q-10): this EPIC targets Claude Code; opencode parity is not a requirement of its
  changes, and the opencode gates are not broken on purpose — rejected: keeping dual-CLI parity
  as a constraint (the owner: skillery is used mainly on Claude Code). **Conflict flagged:**
  `AGENTS.md` mandates parity; amending it is a governance decision outside this EPIC.
- **DEC-11** (Q-15): GitNexus runs at two points of a piece of work: once when the lead starts
  it (index, then impact on its symbols, passed in the brief) and once when it is done (re-index,
  `detect_changes`, impact, before the stage commit); builders and reviewers run it only when the
  brief asks — rejected: per edit (MWB2 today) and per lens (the review skill today).
- **DEC-12** (Q-12): a fixer is bounded: at most one pass and a number of red runs the PLAN sets
  (default three); past that it reports `blocked` with the failing check, its hypothesis and what
  it tried, and the lead decides: a fresh fixer with that report, or one question round to the
  owner with recommendations — rejected: letting it iterate to green.
- **DEC-13** (Q-14): the lead does the light chores itself (a finding under about ten lines, spine
  edits, commits, PR mechanics), delegates the heavy ones, runs independent spawns in parallel,
  names in every brief how the result comes back (the report shape and its line cap), and compacts
  itself at the safe points — rejected: "the lead never takes a builder's task".
- **DEC-14** (Q-20): one principle for tool output, owned by `guardrails`: a tool call returns a
  result, not a log; ask for the summary form, send long output to a file and read back only what
  decides the next step, never print a file to read it; briefs carry it, the `project-setup`
  templates make the quiet form the default, a mod warns on the noisy forms — rejected:
  per-tool rules.
- **DEC-15** (Q-19, refines DEC-5): one model matrix (role × task class → model) as a `guardrails`
  asset replaces `model_rank`; every agent's `model:` must match it (lint); workflow definitions
  name roles, not models — rejected: the model in each workflow definition.
- **DEC-16** (Q-18): `stream-coding` stays an external reference loaded on demand and leaves the
  planner's preload; the spine (EPIC → PLAN → Gherkin → TDD) is the spec-driven method, and the
  gate is `clarity-gate`'s (DEC-9) — rejected: dropping the dependency (its doc-first loop is
  still cited) and keeping the preload.
- **DEC-17** (Q-16): stage 1 includes a sanitation inventory per machine: installed plugins,
  skills and MCP servers against those the traces show loaded (about 36 of about 370 skills in
  the fortnight); the owner approves the uninstall and disable list; the inventory is a page
  beside the usage report — rejected: uninstalling by judgement without the trace data.

## Rabbit-holes

- Tuning Claude Code or opencode internals (caching, compaction): out of our hands; we change only
  what skillery ships.
- Shaving tokens at the cost of quality: every cut is checked against the gates the work still
  passes, not only against the token count.
- Re-instrumenting Langfuse: we use the traces as they are; a missing field is a caveat, not a
  sub-project.
- Per-project MCP configuration lives on each machine, not in skillery; we document it, we do not
  manage it.

## No-gos

- No removal of a gate: tests first, review before merge and the clarity gate stay.
- No per-person usage tracking or dashboards about people; the report is about the method.
- No third-party proxy or router in front of the model API.
- No deliberate breaking of the opencode gates; no new opencode work either (DEC-10).
- No change to the owner's rules except through `rule-learner` with the owner's approval
  (R-0004 and P-0006 by DEC-3).
- No blocking hook on context size (DEC-4).

---

## What Changes

- `guardrails`: session thresholds in absolute tokens, hygiene that wins over a conflicting
  repository rule, the model matrix asset, the tool-output principle; `rule-learner` flags a
  proposed rule that conflicts with session hygiene.
- `epic-planning` and `clarity-gate`: one session per EPIC with a compaction after the proposal,
  question rounds capped by appetite, the Meaningfy clarity checklist, a `design.md` budget per
  appetite checked by lint; the `epic-planner` agent without `stream-coding` and its duplicate load.
- `epic-delivery` and `meaningfy-code-review`: review sets scaled by appetite with two grouped
  lenses as the default, the lead's light chores and parallel spawns, a bounded fixer with a
  `blocked` report, checker and cold reader merged when no how-to page changed, the tester opt-in,
  GitNexus at the two points of a piece of work, a short builder card, the report shape in every
  brief, merge by `gh pr merge --auto`, one full gate per stage.
- Agents: skills preloaded instead of the `Skill` tool, exact MCP tool names, `model:` matching the
  matrix, a new read-only `checker`.
- `rulebook`: a brief-only load that prints the rules without the playbook; subagents stop loading
  the rulebook.
- `session-retrospective`: the Langfuse usage-report procedure and the sanitation inventory; the
  report pages under `docs/practice/ai-coding/usage-reports/`.
- `project-setup` templates: quiet pytest, thin AGENTS, Serena config per language and worktree,
  the `no_polling` hook and the gate-shape table, GitNexus never in `CLAUDE.md`.
- Mods: a warning on the noisy tool forms. **No BREAKING change**: every default has the previous
  behaviour one flag away (the five-lens set, the full checklist).
- `docs/rules` P-0006 and the vault's R-0004 revised through `rule-learner` with the owner.

## Capabilities

### New Capabilities
- `lean-project-templates`: what `project-setup`'s templates give a repository so the method's
  savings hold there (quiet gates, thin bindings, working code intelligence, no duplicated
  instructions).

### Modified Capabilities
- `session-retrospective` (the Langfuse report and the inventory), `subagent-dispatch` (thresholds
  in tokens, the model matrix, the lighter fresh start), `epic-delivery` (the scaled loop, the
  bounded fixer, the lead's chores, GitNexus cadence, merge by one command), `epic-shape` (one
  session per EPIC, capped rounds, the checklist and the design budget), `pr-review-modes` (the
  default review set, impact from the lead), `activity-tools` (the tool-output principle),
  `session-navigation` (warnings in tokens), `rules-first-routing` (rules reach subagents through
  the brief).

## Impact

`skills/guardrails`, `skills/epic-delivery`, `skills/epic-planning`, `skills/clarity-gate`,
`skills/meaningfy-code-review`, `skills/project-setup` (templates), `skills/rulebook`, the agents
in `agents/`, the `meaningfy` openspec schema, `docs/rules/` P-0006, `hooks.yaml` and `mods/`,
`tools/repo_lint`, `docs/environment/`; every project that installs the bundles. The
repository-side fixes in rdf-persistence and MWB2 (audit §8) are filed there, not delivered here
(DEC-8): rdf-persistence #280–#284, mapping-workbench-v2 #104–#108.
