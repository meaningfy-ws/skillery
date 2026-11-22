<!-- PLAN (design half), 2026-11-22; attacked and gated per evidence/clarity-gate.md. DEC-n are the
     EPIC's, cited not re-explained; D-n are new. Kept under the LARGE budget of D-9 (16 KB). -->

> Derives from: EPIC `skillery-performance-improvement` ([proposal.md](proposal.md)), DEC-1 to DEC-17.

## Context

Evidence: `inputs/seeds/langfuse-analysis-2026-11-22.md` (F-1 to F-7) and
`inputs/seeds/instruction-audit-2026-11-22.md` (S-/D-/R-/M-). Cost is calls × context; the
method drives both.

The living specs already say much of the right thing ("A stage boundary is a fresh session", "The
lead stays small", "one fix pass", "merged by one command"). They do not bite: the **data** behind
them is wrong (percent thresholds on a 1 M window), the **defaults** point the other way (five
lenses always, a fresh fixer for one line, `Skill` in every agent), **repository rules** override
them (P-0016, P-0006). So this PLAN changes mechanisms (data, frontmatter, workflow JSON,
templates, lint) more than prose, and measures every stage (D-17).

Constraints: Claude Code first (DEC-10); every gate stays; `make validate` green at every merge.

## Goals / Non-Goals

**Goals:** DEC-2's four numbers after the last stage; every spawn and call cheaper, no gate
removed; the measurement repeatable and attributable (D-11).

**Non-Goals:** CLI internals, Langfuse instrumentation beyond one tag, repository fixes (DEC-8),
opencode parity (DEC-10), per-person tracking, a model router.

## Decisions

- **D-1 Thresholds in tokens.** `guardrails/assets/session-thresholds.json` gains
  `fresh_offer_min_tokens: 90000`, `compact_offer_tokens: 150000`, `context_warn_tokens: 250000`;
  the `*_percent` keys stay as fallback. The navigator (`mods/navigator/lib/hygiene.ts`,
  `state.ts`, `io.ts`, `lean.ts`) reads `$.session.usage().context.tokens` first, `window ×
  percent` second, and prints the number and unit it used. Why: windows differ by model (200 k to
  1 M), a percent is not stable. Rejected: percent of a fixed 200 k. Session hygiene wins over a
  repository rule that keeps a session past a stage boundary; `rule-learner` flags such a
  candidate on its approval card.
- **D-2 Model matrix.** `guardrails/assets/model-matrix.json`, `role → modelAliases key`
  (`opus`/`sonnet`/`haiku`, what `bundle_gen` accepts). Roles: lead, planner,
  reviewer-merged, attack, gate-run-1 → `opus`; builder, fixer, reviewer-single, checker,
  cold-reader, gate-run-2, spec-delta → `sonnet`; explorer → `haiku`. Each agent declares
  `metadata.role`; `tools/repo_lint` errors when its `model:` differs. `model_rank` stays for "one
  model up". The workflow JSON's `roles` reference matrix ids. (DEC-15)
- **D-3 The lighter fresh start.** Each agent preloads (`skills:`) one skill for its role (builder
  `cosmic-python`, reviewer `meaningfy-code-review`, checker `stage-check`); a preload injects the
  whole body, so it is a cost. Whether dropping `Skill` removes the ~230-skill listing, and whether
  exact MCP names load full definitions where globs + `ToolSearch` defer them, is undocumented:
  task 1.4 measures three variants (today; no `Skill` + one preload; exact names vs globs) and
  stage 4 ships the one under 40 k (DEC-2). GitNexus tools only on the lead (D-7). New read-only
  `checker` agent (Read, Grep, Glob, Bash); the lint wants a non-empty `skills:`, so the check
  references move into a thin `skills/stage-check` (≤ 2 KB body) it preloads. (DEC-5)
- **D-4 Review sets.** In `epic-delivery`'s workflow JSON, which the navigator's over-spawn
  ceiling reads (`mods/navigator/lib/dispatch.ts`): TINY/SMALL one pass L2+L3; MEDIUM and above two
  grouped runs with the grouping already live, L1+L2 and L3+L4+L5 (`reviewers: 2`, `lenses`); from
  LARGE up only, five single lenses (+UX) when the lead's mark carries `risk=recorded`
  (`risk_reviewers: 5`); MEDIUM with a risk keeps the two runs.
  `meaningfy-code-review` takes the same default and keeps the five-lens run as the deep review the
  caller asks for; "one combined subagent is a defect" is replaced by this rule. A grouped run
  reports per lens id, so findings stay traceable. (DEC-3)
- **D-5 The bounded fixer.** The brief carries `max_red_runs` (default 3; the PLAN may set it) and
  "one pass". At the bound the fixer returns the base report with `result: blocked`, the failing
  check (one line), its hypothesis and what it tried (≤ 5 lines). The lead chooses: a fresh fixer
  briefed with that report, or one question round to the owner with recommendations. Never a third
  fixer on one finding (ids in the stage's result lines). The bound is text; the navigator warns
  when one subagent runs `full-gates` more than `max_red_runs` times (RISK-7). (DEC-12)
- **D-6 The lead's light chores.** A finding is a light chore when it changes ≤ 10 lines in files
  the lead has read this stage and needs no new test; the lead applies it with Edit and the commit
  body says `lead-fixed: <finding id>`. Everything else is a brief. Independent spawns go in one
  message; every brief ends with the report shape (base report, purpose extension, line cap); the
  lead compacts at a safe point once past `compact_offer_tokens`. (DEC-13)
- **D-7 GitNexus at two points.** Stage start: the lead runs `analyze`, then `impact` per task's
  symbols, ≤ 10 lines pasted per brief. Before the stage commit: `analyze`, `detect_changes`,
  `impact` once. Builders and reviewers run none; L5 reads the brief. More runs only when a task's
  scope moves, never per edit or per lens. (DEC-11)
- **D-8 Planning cadence and P-0006.** Rounds per EPIC: TINY/SMALL ≤ 2, MEDIUM ≤ 3, LARGE+ ≤ 4,
  the confirmation inside the next round. The planner compacts once `proposal.md` is saved; each
  further EPIC of an initiative starts fresh from the hand-over. P-0006 proposed via `rule-learner`:
  TINY–MEDIUM do deltas, attack and gate inline; LARGE+ one subagent for attack + gate run 1, one
  for all deltas; gate run 2 inline on the listed gaps. (DEC-3, DEC-4)
- **D-9 Checklist and budget.** `clarity-gate/references/clarity-gate-checklist.md` rewritten: 13
  items, 6-criterion rubric, score reading, ≤ 4 KB; minimums per appetite (anti-pattern and
  error-matrix rows TINY 2 / SMALL 3 / MEDIUM 4 / LARGE 5; worked examples 1 / 1 / 2 / 3).
  `design.md` budget TINY 4 KB, SMALL 8, MEDIUM 12, LARGE 16, VERY LARGE 24 (KB = 1024 raw bytes,
  as `repo_lint` measures prose); `make lint` errors on a non-exempt active change; exempt: archived
  changes and an allowlist of the changes active when the check lands (today's four, 48–111 KB).
  Appetite parsed as the navigator's `appetiteOf` (workflow names, longest first, first paragraph under
  `## Appetite`); unparseable is an error. `tasks.md` cites design anchors. (DEC-9)
- **D-10 Tool-output principle and mod.** DEC-14's text in `guardrails` §Session hygiene and the
  `activity-tools.md` header; one line in the brief templates. Mod `quiet-tools` (PreToolUse on
  Bash) warns, never denies, on `sed -n`/`head`/`tail`/`cat` with a file, `grep` on a path,
  `pytest -v`, `--verbose`; it names the quiet form, delivered as
  `hookSpecificOutput.additionalContext` at exit 0 (stderr at exit 0 is not read). (DEC-14, DEC-4)
- **D-11 Usage report.** `session-retrospective/references/langfuse-report.md`: the seed's eight
  queries (totals; usage by type; by model with p50/p90 context; per day; top sessions; tool
  invocations; latency per name; tags → skills) with their `queryMetrics` arguments, reading notes
  and pinned fields (RISK-1). Two sources Langfuse lacks: **gates passed** = first-run CI green of
  the window's merged PRs (`gh`) plus Critical findings per stage from the `result:` lines;
  **attribution** = a `skillery:<version>` tag the Langfuse hook adds to every trace (1.6). Pages:
  `docs/practice/ai-coding/usage-reports/<date>.md` (new folder; the docs-register and
  top-level-folder lints must pass); first two: the seed, the 2026-11-09 evidence. Prices set in
  Langfuse from the current list (1.1). (DEC-6)
- **D-12 Sanitation inventory.** A procedure in the same reference: installed plugins, skills
  (`claude plugin list`, `SKILL.md` count) and MCP servers, against the window's `skill:` tags and
  tool names called → `usage-reports/inventory-<host>-<date>.md`, used / unused / undecided; the
  owner approves; disable with the CLI's commands. (DEC-17)
- **D-13 Templates.** `project-setup`: `pytest.ini` `addopts = -q -rfE`, coverage to xml; the
  `AGENTS.md` template cut to repository-specific sections with pointers; `.serena/project.yml`
  with the archetype's `language_servers`, a worktree activated as its own project; `no_polling`
  hook and gate-shape table shipped; re-index with `--skip-agents-md`; the "no GitNexus block in
  CLAUDE.md" lint shipped as a quality check. (DEC-8)
- **D-14 Rules through the brief.** `rulebook` `load --brief` prints the `R-`/`P-` lines with no
  `PLAYBOOK` block; the lead pastes them; agent bodies drop "load the rulebook"; 1.4 measures
  whether the `rules-first` block reaches subagents. (DEC-13)
- **D-15 Builder card.** `epic-delivery/assets/templates/builder-brief.md` (≤ 2 KB) replaces the
  pointer to `team-and-briefs.md`: task, design anchor, scenario file, gate command, worktree path,
  rules, report shape, the five Serena essentials; `cosmic-python` principles by id; no
  `initial_instructions` call.
- **D-16 Claude Code first.** The opencode renderer already handles `skills:`; `metadata.role`
  passes the facet lint; the gate that fires is "a behavioural agent change ships a Gherkin scenario
  under `tests/features/agents`" (3.4, 4.2, 4.3). An opencode gate failing on this EPIC is recorded
  in `docs/environment/dual-cli/compatibility.md`, not fixed. (DEC-10)
- **D-17 What each stage measures.** Releases are near-daily and other EPICs release inside any
  window, so stages 2–5 measure a proxy within seven days of release, on traces tagged with their
  version, each defined so two people compute the same number: stage 2 the median `inputTokens` of
  observations named `LLM Call` (the main thread; `Subagent LLM Call` excluded) and the share of
  them above 150 k; stage 3 spawns per stage and the verification share (roles reviewer, checker,
  cold-reader, fixer, tester) counted from the stage's `result:` lines in `handover.md`; stage 4
  the floors of 1.4 repeated; stage 5 `Tool: Bash` observations ÷ `Claude Code Turn` traces, and
  the share of Bash commands matching D-10's forms. Gates passed (D-11) is read at every stage;
  "worsen" = the first-run-green share or the Critical count below the baseline page's value.
  Only stage 6 takes fourteen days and DEC-2's four numbers. (DEC-7)
- **D-18 Merge and gates.** The lead runs `gh pr merge --auto --merge` as the PR opens, or one
  background `gh pr checks --watch` and waits for its notice; a running task's output is never
  read. Full gates once per stage, by the lead before the PR; the fix pass re-runs only the narrow
  checks and the failing tests. (DEC-13)

## Algorithm / approach

Six stages, one PR each into `develop`; stages 2–5 end with D-17's measurement, and a stage whose
gates passed worsen is reverted and re-planned with one question round. Every change is a file edit
checked by `make validate`; the report is read-only; re-running a task is safe (idempotent edits).

**A MEDIUM stage, three tasks.** Before: 3 builders + 2 reviewers (5 on a risk) + tester + fix-pass
builder + checker + cold reader = 9–12 spawns at ~81 k + 13 k tokens each, impact per lens. After:
3 builders (card, rules in the brief, the 1.4 variant) + 2 grouped reviewers + checker (merged with
the cold reader when no how-to changed) + a fixer only for a non-light finding = 6–7 spawns; impact
twice, by the lead. Spawns −35 %, start cost per spawn about −45 %.

**The planner.** Before: `stream-coding` 25 KB + three preloads + `epic-planning` loaded again
(~36 k tokens), one session over an initiative. After: three preloads (~6 k), the 4 KB checklist,
compaction after `proposal.md`, a fresh session per EPIC.

**The measurement gate (D-17).** Stage 2 ships as 3.22.0 on day 0; on day 5 the sessions tagged
`skillery:3.22.0` show a median `LLM Call` context of 140 k (baseline 199 k), 9 % of calls above
150 k (baseline 41 %), first-run CI green on 6 of 6 merged PRs (baseline page: 5 of 6) → stage 3.

### Anti-patterns
| Don't | Do instead | Why |
|---|---|---|
| Delete a gate to save tokens | Scale its fan-out; keep the deep form one flag away | no-go; RISK-3, RISK-4 |
| Tune percent thresholds | Tokens, percent as fallback | D-1 |
| Put the model in a brief or workflow | Role in the brief, model from the matrix | D-2 |
| Preload a skill "in case" | One preload per role; the rest on demand | D-3 |
| Let a fixer iterate to green | Bound it; `blocked` report; the lead decides | D-5 |
| Fix the repositories from this EPIC | Their issues (#280–284, #104–108) | DEC-8 |

## Error matrix
| Failure mode | How it is detected | Expected handling |
|---|---|---|
| The CLI reports no token count | no `usage.context.tokens` | `window × percent`, then percent keys; the warning says which |
| An agent's `model:` differs from the matrix | `make lint` | error; fix agent or matrix, never both silently |
| A `metadata.role` absent from the matrix, or a matrix role no agent uses | `make lint` | error naming the role |
| The hook cannot read the installed skillery version | tag missing on a fresh trace | tag with the worked repository's `VERSION` |
| A fixer reaches `max_red_runs` | its `result: blocked` line | fresh fixer with the report, or one question round |
| A fixer exceeds the bound anyway | navigator warning; retrospective count | the lead ends it and applies D-5; RISK-7 |
| Gates passed worsen after a stage | the stage's measurement page | revert the stage PR; re-plan with one question round |
| No merged PR or result line in the window | the gates-passed source is empty | page says "gates: no data"; the stage waits, never ships on tokens alone |
| A pinned Langfuse field is missing | the procedure's field check | page marked "not comparable"; RISK-1 to the owner |
| Traces without a version tag | the tag filter | listed "unattributed", excluded from the proxy |
| `design.md` over budget / appetite unparseable | `make lint` on a non-exempt change | error; the planner cuts, re-shapes or names the appetite |
| A template misfires in a new repository | that repository's `make validate` | fix the template, not the repository |

## Risks / Trade-offs

- **RISK-1** CLI changes to context or compaction: likely over a year, medium. Mitigation: stages
  gated by numbers, pinned queries; accepted: a re-tuning pass per release (D-1 keys in one file).
- **RISK-2** models or prices change: likely, medium. Mitigation: the matrix is one file (D-2).
- **RISK-3** a weak PLAN passes the slimmer checklist: possible, medium. Mitigation: full
  checklist on a recorded risk, budget by appetite, gates passed measured (D-9, D-11).
- **RISK-4** a grouped review misses what a fifth lens catches: possible, medium. Mitigation: five
  lenses on `risk=recorded` (D-4); accepted at SMALL and MEDIUM.
- **RISK-5** a window mixes other work and releases: likely, low–medium. Mitigation: the version
  tag (D-11); accepted: the page states the mix.
- **RISK-6** repositories lag the templates: certain, low. Accepted; their issues carry it.
- **RISK-7** the fixer bound and light-chore rule are text a fixer already ignored once: likely,
  medium. Mitigation: navigator warning, retrospective count (D-5); accepted: no hard stop.
- **RISK-8** the lighter fresh start lowers nothing because the listing is injected regardless:
  possible, high for stage 4. Mitigation: 1.4 decides the variant before stage 4 is built; if none
  is under 40 k, DEC-2's floor target goes to the owner as one question.
- Trade-off: warnings never block (DEC-4); a lead can ignore them; the retrospective shows it.

## Delivery decisions

- **D-19** (2026-11-22) The owner granted "work independently, without stopping to ask" for this
  EPIC: the lead commits, pushes, opens and merges its PRs on green CI, within the method's limits;
  decisions a question round would have carried are recorded here instead.
- **D-20** Version tag (task 1.6): the Langfuse plugin is Langfuse's own, so the tag is interim:
  `CC_LANGFUSE_TRACE_TAGS=skillery:<installed version>` in each machine's `~/.claude/settings.json`
  `env`, bumped by hand after an upgrade (set on this machine the same day). The upstream
  repository refused an issue from this account (2026-11-22), so the request goes as a pull
  request when it pays. Untagged sessions are "unattributed" in the report.
- **D-21** Stage 1 is docs only: builders run one after another in the main checkout on the
  feature branch (no worktrees), the tester condition is not met (`tester: no, no code changed`),
  and the stage takes the small review set (two grouped runs, L1+L2 and L3+L4+L5). The PR adds
  about 2,400 lines, above the `small_stage` limit of 600, but about 1,900 of them are the spine
  files the clarity gate already passed (proposal, design, tasks, nine deltas, two seeds); the
  reviewed surface (one reference, five pages, one pointer) is about 500 lines of documentation.
  The deviation is deliberate and follows DEC-3 (verification scaled to risk).
- **D-23** Task 1.4's interactive half (the `/context` composition of a fresh session, an
  implementer and a reviewer, and the three variants) cannot run inside a running session; it is
  the first step of the next session, named in the hand-over note, and stage 4 depends on it, not
  stage 2. The Langfuse-derived floors are on the baseline page now.
- **D-22** Inventory (task 1.5): the three lists and the exact disable commands are written to the
  inventory page; nothing is disabled until the owner approves the list (DEC-17).

- **D-24** Stage 1 review, accepted findings (one fix pass): C1 the baseline page carries no
  gates-passed value, so D-17's "worsen" could never fire: the first-run CI green share of the
  window's merged PRs is computed now across skillery, rdf-persistence and mapping-workbench-v2
  and the Critical count is "no data before stage 1"; r1-W2 re-labelled Critical (the page claims
  procedure-derived numbers that no query produces): the cache split and the main-thread p50 get
  their query arguments, the seed-only sections are labelled so; r1-W5 re-labelled Critical (a
  description change without trigger probes breaks the binding's "proven triggers"): one positive
  and one near-miss probe; r1-W6 re-labelled Critical (client and server names in a distributed
  catalogue): names become counts.
- **D-25** Under the floor, stage 1: r1-W1 "Critical findings" counts all findings (renamed in
  stage 2 when the result lines carry severity); r1-W3 the baseline's work mix is "not recorded"
  (accepted: appetites were not marked in the window); r1-W4 the dropped tag test (D-20 says so);
  r1-S1 1,159 calls vs 1,124 spawns (35 unnamed `Agent` calls); r1-S2 `gh` date bounds and run
  limits; r1-S3 attribution line (folded into C1's fix); r1-S4 "§Floor" vs "Floors"; r2-W1 proxies
  copied from D-17 (the reference will generalise when the EPIC archives); r2-W2 dated values in
  the method (same moment); r2-W3 README restates rules; r2-W4 inventory file name has a month,
  not a date; r2-W5 window forms differ; r2-W6 folded into C1; r2-W7 the docs register row's
  description; r2-S1 to S4. Each is a candidate for the docs stage of this EPIC.

- **D-26** Checker findings of stage 1 (pass, none Critical): F1 the CHANGELOG line, F2 the
  roadmap boxes, F3 the cost evidence (74 observations after 12:35Z carried 4.37 USD) and F7 the
  revert sentence are closed by the lead as light chores (under ten lines, files already read,
  commit body `lead-fixed:`), the pattern D-6 makes the rule in stage 3; F4 (pin `usageType`) and
  F5 (the spec's illustrative counts) go to the spec sync at archive; F6 is the hand-over commit.

- **D-27** Stage 2 runs three builders in parallel on disjoint files in the main checkout
  (navigator code + thresholds + guardrails §6; rule-learner + epic-planning; epic-delivery), on
  branch `feature/spi-stage-2`. GitNexus impact is not applicable: `mods/` is outside its index
  scope and the other files are prose; the change check is `make mods` and `make validate`. A
  new threshold key `fixer_max_red_runs: 3` carries D-5's default so the navigator can warn (2.4).
  Task 2.5 (the stage-2 measurement) runs after the release and is left open in this stage.
- **D-28** The navigator's offer is an action, not a text: the number and unit appear in the
  warnings (`context 152,300 tokens mid-step (context_warn_tokens)`), the compact and fresh offers
  stay buttons. The `session-navigation` scenario that quotes an offer text is read as the warning
  text at the spec sync. The fixer-bound warning is keyed per agent
  (`hygiene:fixer-bound:<agentId>`) so one agent's warning cannot hide another's; every
  `full-gates` run by a subagent counts, red or green. The engine's `usage.context` fields are read
  defensively (`tokens`, else `window × percent`), since no typing for `$.session.usage()` exists
  in the repository; task 1.4's measurement confirms which fields the CLI provides.
- **D-29** Stage 2 is a LARGE small stage: 190 added lines outside the spine and the generated
  bundles (`git diff develop --numstat`), under the workflow's `small_stage.max_added_lines` of
  600, low risk (a pure-function change in the navigator with its tests, and prose). The review
  set is the small stage's two grouped runs, L1+L2 and L3+L4+L5, as `epic-delivery.workflow.json`
  lists them; the tester runs (code changed, no `## Invariants` section); one checker.
- **D-30** Stage 2 tester findings. Accepted (fixed in the one pass): T1 `contextTokens` treats
  `window: 0` as a count of 0, so a 90 % session never warns (`hygiene.ts`, guard `> 0`, not
  `>= 0`); T4 a thresholds file without `fixer_max_red_runs` leaves the fixer unbounded (default
  3, D-5); T6 re-labelled Critical: `gateRuns[agentId]` and `agentCalls[agentId]` read
  `Object.prototype` for ids like `constructor` (own-property access or a `Map`). Under the floor:
  T2 the "no token count" suffix prints when a count was given but a key is missing (message
  only); T3 `fixer_max_red_runs: 0` warns at the first run (a bound of 0 is not a supported
  setting; the file ships 3); T5 the warning keeps its first count. Their failed-first tests are
  deleted in the sort, listed in the PR with the reason; the kept tests cover the two
  error-matrix rows and the accepted findings.
- **D-31** Under the floor, stage 2 review L3+L4+L5: W1 `fixerRun` sits in `lean.ts` rather than
  `dispatch.ts` and builds its warning by hand; W2 "default 3" repeated in two epic-delivery
  pages; W3 the key name `fixer_max_red_runs` counts every gate run, not only red ones; W4
  epic-delivery restates "compact at a safe point"; S1 the gate regex built in three places; S2
  `isCount` repeated and `offer()`'s shape; S3 a partial token-key set falls back silently; S4
  `agentCalls` never cleared; S5 guardrails §6 bullet holds two rules; S6, S7 pointers. W1, S1
  and S2 are the refactoring candidates for stage 4's navigator work (the checker agent); the rest
  for the docs stage.
- **D-32** Stage 2 review L1+L2, accepted (re-labelled Critical, each a scenario of this stage's
  deltas left without text or test): W1 the per-agent fixer-bound warning outlives the agent
  (cleared on `SubagentFinished`, with a test); W3 the lead notes a hygiene conflict with a
  repository rule under Open in `handover.md` (stage-loop step 6); W4 at the round cap the gaps
  left are recorded in the EPIC as assumptions for the developer and no further round is sent;
  W5 after `proposal.md` the planner compacts or resets with the hand-over note; W6 one
  strict-mode test past 250,000 tokens with a fixer-bound warning denies nothing. D-28 is extended
  to the `subagent-dispatch` scenario "A compaction offer in tokens": the number is in the warning,
  the offer stays a button (W2). Under the floor: S1 (same as T2), S2 `usage.context?.percent`
  (pre-existing code, docs stage), S3 (same as r2-W2).
- **D-33** Stage 2 checker (pass): F1 `epic-planning` steps 7 and 8 point to P-0006's appetite
  scoping, which task 3.1 writes with the owner in stage 3; until then the pointer is ahead of the
  rule. Accepted for one stage; 3.1 closes it.
- **D-34** Stage 3 on branch `feature/spi-stage-3`. Task 3.1's rule writes rest on the owner's
  recorded answer to Q-3 (DEC-3: "scale by appetite and risk; revise R-0004 and P-0006 to say
  when it pays"), given through the question dialog on 2026-11-22; no further card was answered
  (the owner asked for autonomous progress, D-19). P-0006 is updated in the repository store
  (this PR), R-0004 in the vault, both by `rules.py update`, sources quoting the answer. Two
  builders on disjoint files: A owns `epic-delivery.workflow.json`, `mods/navigator` (dispatch,
  mark, tests), `skills/meaningfy-code-review`, `agents/implementer.md`, `agents/code-reviewer.md`
  and their feature files (3.2, the agent and review-skill halves of 3.4); B owns the
  `epic-delivery` prose (3.3, the stage-loop half of 3.4, the review-set wording of D-4).
  GitNexus impact is not applicable (navigator outside the index, the rest prose); the change
  check is `make mods`, `make bundles`, `make validate`. Task 3.5 runs after the release.
- **D-35** Stage 3 is a LARGE small stage under the installed method (3.21.0): the reviewed
  surface is navigator code with tests, workflow data and prose, well under the `small_stage`
  limit (count in the PR body); review set two grouped runs, L1+L2 and L3+L4+L5; the tester runs
  (code changed, the installed rule, not yet the opt-in rule this stage ships); one checker.
  Builder A's upstream findings enter the fix pass as accepted items: the retrospective's
  `MARK_RE` in `session_digest.py` must accept `risk=recorded`, and the five stale mentions of
  the five-lens default (agent-template.md, workflows.md, navigator.md, test-strategy
  software.md, stage-loop.md line 111) are brought in line.
- **D-36** Stage 3's first full gates run failed (exit 2): the skill inventory drifted after the
  review descriptions changed, and `test_distilling_in_epic_delivery` reads the tester's ledger
  row by its label, which builder B had renamed. Both closed by the lead as light chores
  (`make skill-inventory`, the opt-in note moved to the row's Moment column; `lead-fixed:` in the
  commit bodies); a lesson for the briefs: a builder that changes a description runs
  `make skill-inventory`, and the ledger's first column is read by a test.
- **D-37** Stage 3 reviews. Accepted from L1+L2: C1 the mark line's one definition
  (`team-and-briefs.md`) gains `[ risk=recorded]`; C2 and W4 the code-reviewer feature scenarios
  use a non-group pair (L1+L4) for the "no decision" case and drop the appetite-reading step;
  W1 re-labelled Critical (a small stage keeps the grouped runs with no `D-n`, as the spec
  scenario says); W2 the stale-mention list of D-35 extended (README.md:115, docs/development
  README.md:132, team-and-briefs.md:17, setup.md:94, mcp-setup.md:15, compatibility.md:123,
  software.md:19, hooks.md:38, the AGENTS.md GitNexus block and its template); W3 re-labelled
  Critical (the validator's lens-group check has no rejection test) with S3's two validator
  rules (`risk_reviewers >= reviewers`; a lens group accepted only where the appetite's set
  names it, in the agent body); S1 the mark fixture gains the risk lines beside the `MARK_RE`
  fix; S2 done by the lead (`rules.py confirm`). The red `opencode-installer` CI job is an
  expectation of the old implementer tool list in the installer's tests; it is updated in the
  same pass. Under the floor: L3+L4+L5 W2 (`small_stage` retirement, stage 4), W3 to W6 and
  S1 to S7 (W1 is C1); all candidates for stage 4's navigator work or the docs stage.
- **D-38** Stage 3 tester (36 tests, 14 failed first, one of them a test error). Accepted, all in
  the validator or the mark revive: T2/T3 `risk_reviewers` below `reviewers` or 0 rejected (S3);
  T4 to T7 empty group, empty list, duplicate lens, lens outside L1 to L5 rejected (W3); T8/T9
  `reviewers` (and `small_stage.reviewers`) must equal the group count; T10 `risk_reviewers` is
  rejected below LARGE (D-4); T11/T12 a revived mark with a non-boolean `risk` or no `change`
  never records a risk. Under the floor: T1 one mark per session, not per change (one EPIC per
  session is the rule; a per-change map is stage 4's), T13 the `+`, `1.`, `>` list markers
  (pre-existing regex class), T14 the tester's own over-strict backtick assertion (deleted), the
  two upstream notes (a mark that fails to parse leaves the previous in force, by design; the
  over-spawn count keeps its first text). The failed-first tests of accepted items are kept and
  moved into `workflow.test.ts`, `mark.test.ts` and `dispatch.test.ts`; the others deleted.
- **D-39** The fix pass changed the GitNexus block of `AGENTS.md`, its template and `hooks.yaml`
  to the two points (D-7); the living spec `catalogue-governance` "Code checks run once per task"
  said per task, so this change gains a MODIFIED delta for it (`specs/catalogue-governance/`),
  keeping its three scenarios and adding "A stage ends". The code-reviewer keeps its appetite
  check (the fixer's call on C2/W4), so a lens group is accepted only where the appetite's review
  set names it.
- **D-40** Stage 3 checker (pass, two Warnings), closed by the lead as light chores: F-1 the MEDIUM
  scenarios' "risk named as a focus" sentence added to `meaningfy-code-review` and `epic-delivery`;
  F-2 the `AGENTS.md` GitNexus block and its template name the index at both points, as the
  `catalogue-governance` delta says (`lead-fixed:` in the commit body); one more full gates run.
- **D-41** Stage 4 ships the designed variant of D-3 (one preload per role, no `Skill` tool, exact
  MCP tool names) without the interactive A/B of 1.4, which needs a fresh session the owner's
  autonomy grant (D-19) does not provide: today's traces give the measured floor in this
  repository, `implementer` and `code-reviewer` about 53 k tokens at their first call,
  general-purpose about 35 k; 4.7 measures the shipped variant against it, and RISK-8's fallback
  (the floor target to the owner) applies if it is not under 40 k.
- **D-42** Stage 4 on branch `feature/spi-stage-4`, three builders on disjoint files: A owns
  `tools/repo_lint`, `tests/test_repo_lint.py`, `skills/guardrails/assets/model-matrix.json`,
  `skills/clarity-gate/`, the `tasks.md` template (4.1's lint and asset, 4.4); B owns `agents/`,
  `skills/stage-check/` (new), `bundles.yaml`, `facets.yaml` if needed, `tests/features/agents/`,
  `tests/trigger_probes.yaml`, the workflow JSON `roles` block (4.2, 4.3, the agent side of 4.1
  and 4.6); C owns `skills/epic-delivery/assets/templates/`, `references/team-and-briefs.md`,
  `skills/guardrails/references/activity-tools.md`, `skills/rulebook/` and its tests (4.5, the
  script side of 4.6). GitNexus impact: `tools/repo_lint` and `skills/rulebook/scripts` are in
  the index, so the lead ran impact on `lint.py` `prose_budget` and `rules.py` `cmd_load` before
  the briefs: both UNKNOWN, the index (last at cf32e0a) does not hold them; the changes are
  additive (a new check function appended to `ALL_CHECKS`, a new flag on `load`), the re-index runs
  in the background for the change check before the stage's last commit.
- **D-43** Stage 4 is a LARGE small stage under the installed method (3.21.0): code in
  `tools/repo_lint` and `rules.py` with tests, agent frontmatter, one new skill and agent, and
  prose; review set two grouped runs, L1+L2 and L3+L4+L5; the tester runs (code changed; the
  opt-in rule of stage 3 is not yet the installed method); the checker is a general-purpose
  subagent, since the new `checker` agent is not installed in this session. Light chores by the
  lead: the `test-strategy` inventory row CHK-60 and the agent template's skills row follow the
  new checklist and the one-preload rule (builders A and B found them outside their files).
  The PR adds 628 lines outside the spine and the generated files, 380 without the tests, so it
  passes the installed `small_stage` limit only without its tests; the two grouped runs stand as
  the LARGE default this EPIC merged in stage 3 (D-4), one release ahead of the installed method.
  The first full gates run was red in the navigator suite: the `roles.matrix` block of the
  workflow JSON was not known to the workflow validator (builder B ran `make bundles` and `make
  lint`, not `make mods`); a fixer teaches the validator the key, test-first, before the PR's
  gate report is written (a build defect, outside the one fix pass for findings).
- **D-44** Stage 4 review L1+L2. Accepted: W1 re-labelled Critical (a grouped run is the
  `reviewer-merged` role on the large model, D-2: the workflow's `roles.matrix` maps grouped runs
  to `reviewer-merged` and `team-and-briefs.md` says the lead passes that model when it spawns a
  grouped run); W2 re-labelled Critical (`technical-writer` is a lead agent that spawns the cold
  reader, role `lead`, model `opus`, feature file aligned); W4 the unparseable-appetite error names
  the paragraph it read; W5 the Serena rows for rename, safe delete and diagnostics return to the
  activity-tools table for the lead, and `team-lead` names those Serena tools exactly (S6 with it);
  W6 em dashes removed from the three agent bodies; S1 "first paragraph" in the epic-shape delta
  and D-9; S2 the four missing budget tests; S3 a malformed matrix file is one lint error, not a
  crash; S4 the card's rules pointed to, the history paragraph dropped; S5 the rules-first delta
  writes `load --brief --activity <a>`. Decided, not fixed: W3 the one-preload rule applies in this
  stage to the delivery workers (`implementer`, `code-reviewer`, `checker`); the bundle-specific
  workers (`infra-reviewer`, `proposal-writer`, `ops-watch`, `sales-agent`) keep their preloads
  and `Skill` until their floors are measured (4.7 lists them), and D-41 is read so.
- **D-45** Stage 4 review L3+L4+L5. C1 is the `roles.matrix` gate defect, closed by the gate fixer;
  the key stays under `roles` (validated, and typed in `types.d.ts` in the fix pass), mapping the
  single-lens default; a grouped run is the `reviewer-merged` role by the brief (D-44 W1).
  Accepted: W2 the appetite budgets leave `lint.py` for a `clarity-gate` asset
  (`assets/design-budgets.json`) the lint reads, with the appetite names from the workflow file;
  W3 the VERY LARGE row and no pointer to `repo_lint` in the checklist; W4 the owner-consent
  condition stated inline instead of "R-0005"; W5, W6 `stage-check` points to `team-and-briefs`
  for the result line and the cold-reader rule; W7, W8 one Edits line and one fixer line, in the
  card, pointed to from `team-and-briefs`; W9 the history paragraph dropped (also D-44 S4); W10 a
  guarded `_model_matrix(repo)` (also D-44 S3); S11 the Serena essentials in the card only, the
  table points; S12 one "Read `stage-check`" sentence; S13 the docstring; S15 the matrix values
  checked against `model_rank`; S16b "the lead pastes `load --brief`" said once, in
  `team-and-briefs`. Under the floor: S14 the test file split; S16a the commands.md rewording (it
  paid the prose budget).
- **D-46** Stage 4 tester (60 tests, 8 failed first, 6 defects). Accepted: T1 malformed matrix
  JSON or a top-level list crashes the lint (one error line instead; with D-44 S3, D-45 W10); T2 a
  list-typed `metadata.role` crashes both matrix checks (reported, never raised); T4 a matrix value
  that is not a model alias is an error (D-45 S15); T6 the allowlist read strips a UTF-8 BOM.
  Under the floor: T3 an agent model alias in the wrong case is `bundle_gates`' report, not the
  matrix check's (its test is deleted); T5 `VERY  LARGE` with two spaces reads as LARGE, the same
  as the navigator's `appetiteOf` (one rule for both; the test is deleted). The kept tests move
  into `tests/test_repo_lint_budget.py` and `tests/test_rulebook.py`; the adversarial files go.
  The fix pass runs as two fixers on disjoint files, code and prose, in one batch.
- **D-47** The change check before the stage's last commit (`detect_changes`, compare with
  develop) reports 131 touched symbols and 22 affected flows, rated critical by count: the
  navigator's workflow validator (`workflowError`), the rulebook's `cmd_load` and the lint's
  `main`. Each is a flow this stage changed on purpose and each has its suite green (navigator
  739 + 137, rulebook 578 with the lint tests, installer 36). Under D-19 the result is recorded
  here instead of being brought as a question; the owner can read it in this PR.

## Open Questions

- Whether `/context` output is machine-readable for 1.4, or read by hand (either is acceptable).
- The price list for 1.1 comes from the `claude-api` skill when the task runs.
- Whether the Langfuse hook can read the installed skillery version (the plugin cache path carries
  it); if not, 1.6 tags with the worked repository's `VERSION`.
