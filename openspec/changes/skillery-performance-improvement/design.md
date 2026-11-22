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
  Appetite parsed as the navigator's `appetiteOf` (workflow names, longest first, first line under
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
  and the stage takes the small review set (two grouped runs) as a low-risk stage; the added-line
  count is recorded in the PR body.
- **D-23** Task 1.4's interactive half (the `/context` composition of a fresh session, an
  implementer and a reviewer, and the three variants) cannot run inside a running session; it is
  the first step of the next session, named in the hand-over note, and stage 4 depends on it, not
  stage 2. The Langfuse-derived floors are on the baseline page now.
- **D-22** Inventory (task 1.5): the three lists and the exact disable commands are written to the
  inventory page; nothing is disabled until the owner approves the list (DEC-17).

## Open Questions

- Whether `/context` output is machine-readable for 1.4, or read by hand (either is acceptable).
- The price list for 1.1 comes from the `claude-api` skill when the task runs.
- Whether the Langfuse hook can read the installed skillery version (the plugin cache path carries
  it); if not, 1.6 tags with the worked repository's `VERSION`.
