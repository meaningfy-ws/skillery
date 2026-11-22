# Acceptance: skillery-performance-improvement

Appetite LARGE: the demo is mandatory (`epic-delivery`, `references/verification-validation.md`).
The lead ran it on 2026-11-22 on `develop` at `c24a7ff` (PR #332 merged, stages 1 to 5 complete).
**The verdict is the developer's and is still owed:** this record holds what was shown; the
developer accepts it, or names what is wrong (a rejection is a `D-n` in `design.md` and a fix
stage before the docs stage).

## What was shown

Each row is one use case the EPIC changes (proposal, *What Changes*), run in the repository or in
a scratch scaffold, and what came out.

| Use case | Run | Result |
|---|---|---|
| A noisy tool form is warned, never denied (DEC-14, stage 5) | `quiet-tools.mjs` with `sed -n 1,40p … && pytest -v tests` | one `additionalContext` warning naming the Read tool; `make lint` passes through silently, exit 0 |
| Session hygiene decides in tokens (stage 2) | `guardrails/assets/session-thresholds.json` | `fresh_offer_min_tokens` 90 000, `compact_offer_tokens` 150 000, `context_warn_tokens` 250 000, `fixer_max_red_runs` 3; the percent keys stay as the fallback |
| The review set is the appetite's (DEC-3, stage 3) | `epic-delivery.workflow.json` `reviews` | TINY/SMALL one pass (L2, L3); MEDIUM+ two grouped runs `[[L1,L2],[L3,L4,L5]]`; LARGE+ `risk_reviewers: 5` and a `small_stage` at 600 added lines; `roles.matrix` maps reviewer, checker and tester to matrix roles |
| One model per role (DEC-15, stage 4) | `guardrails/assets/model-matrix.json`; `model:` of the 15 agents | every agent's model is its role's (`code-reviewer`, `checker`, `infra-reviewer` sonnet; leads and planners opus); `make lint` enforces it (the four unused roles print as `?`, informational) |
| Workers start lighter (stage 4) | `tools:` and `skills:` of `implementer`, `code-reviewer`, `checker`, `epic-planner` | exact Serena tool names, no `Skill` tool on the workers; the checker has Read, Grep, Glob, Bash only; `epic-planner` without `stream-coding`; first-call floors measured in stage 4: implementer ≈ 53 k, general-purpose ≈ 35 k (D-41) |
| A `design.md` budget and a short checklist (DEC-9) | `clarity-gate/assets/design-budgets.json`; `wc -c` | LARGE 16 384 bytes; this change's `design.md` is 44.5 KB and sits on the exempt allowlist (D-9, it predates the budget); the checklist is 3 303 bytes |
| The rules reach a builder without the playbook (stage 4) | `rules.py load --activity release --brief` | four rule lines and `-- end --`, no playbook text |
| A scaffolded repository is quiet and thin (DEC-13, stage 5) | `scaffold.sh -p orders -n "Order Processing" -a product` in a scratch folder | `pytest.ini` `-q -rfE --strict-markers --tb=short`; `AGENTS.md` 5 787 bytes with the gate table; `CLAUDE.md` 634 bytes; `.serena/project.yml` lists `python`; `make check-bindings` passes ("CLAUDE.md carries no GitNexus block") |
| The usage report is a comparable series (DEC-6, stage 1) | `docs/practice/ai-coding/usage-reports/` | the 2026-11-22 baseline, the 2026-11-09 comparison and one machine's inventory; `session-retrospective/references/langfuse-report.md` holds the eight queries |

## Against the success measure (DEC-2)

The four numbers (−40 % tokens per turn, median main-thread context under 120 k, subagent floor
under 40 k, no gate dropped) are measured on the traces tagged with the release that ships the
stages (tasks 2.5, 3.5, 4.7, 5.5 within seven days; 6.1 after fourteen), so the demo shows the
mechanisms, not the numbers. What can be read today: the subagent floors above (implementer ≈ 53 k
is still over the 40 k target; D-41 records the remaining cost, the harness's own preload) and no
gate dropped (every stage's full gates, review set and CI are in the PR bodies #328 to #332).

## Verdict

Owed to the developer. Record here: accepted or rejected, by whom, the date, and what was wrong
if rejected.
