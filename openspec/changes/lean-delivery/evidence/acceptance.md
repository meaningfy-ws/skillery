# Acceptance demo (task A.1) — lean-delivery

Date: 2026-11-10. Appetite LARGE, so the demo is mandatory (D-16). Run by the lead from the epic
session's own record (stages 1–4 delivered in one session, 2026-11-09/10).

**Who validated.** The developer delegated the EPIC's decisions to the lead on 2026-11-09 ("do not
ask, just proceed with commits, push, and prs, and merge"; "take decisions as appropriate"). The
verdict below is the lead's under that grant. Validation ends with a person: the developer's own
confirmation is owed and is asked for in the release report. A rejection then becomes a decision in
`design.md` and a fix stage (D-8).

## Success measure, counted

Per stage, beyond one task-gate run per task: full gates locally at most twice (before the PR, after
the fix round), plus CI; no sleep-polling call; every lead re-run names its trigger.

| Stage | Task-gate runs (builder) | Stage-level local full-gates runs | Lead re-runs and trigger | Polling calls |
|---|---|---|---|---|
| 1 (PR #168, prose) | 3 builders: 1 `make lint` each; 1 full run (1.9) | 1 (fixer, T3) + 0 (pre-PR skipped: 1.9's run was on the head content) | T3, named in the commit body | 0 |
| 2 (PR #170) | 2 (first red: a skill's line cap) | 3: fixer 2 (first red: stale `docs/skill-inventory.md`), lead 1 after the rebase onto stage 4 | T2/T3, named in the PR comment | 0 |
| 3 (PR #171) | 1 | 4: lead 1 pre-PR (after rebase), fixer 2 (first red: a type error), lead 1 | T1 (report put the navigator count in the pytest row), named in the PR comment | 0 |
| 4 (PR #169) | 2 (first red: stale inventory) | 2: lead 1 pre-PR, fixer 1 (T3) | none needed | 0 |

- **Waiting:** every CI wait was one blocking `gh pr checks --watch`; no sleep loop ran, and the
  hook never had to deny one in this session.
- **The hook live:** `evidence/hook-load-check.md` — a Claude Code session loading the branch's
  `meaningfy-core` denied `for i in 1 2; do echo $i; sleep 1; done` with the D-5 message; `sleep 1`
  ran.
- **The band through apply → accept → documentation → archive:** shown by the engine tests merged
  in stages 2–3 (`mods/navigator/lib/epic-delivery-workflow.test.ts`, `phase.test.ts`,
  `documentation-workflow.test.ts`). The installed navigator (3.11.0) still shows the old phases
  until this release is installed.

## Verdict

**Accepted, with one finding for the next shaping session.**

- Met: no polling; every lead re-run named its trigger; stage 4 held the ≤ 2 bound; reviewers read
  the gate report and never re-ran a suite; every check of the old loop still ran (five lenses,
  tester, checker per stage).
- Not met: stages 2 and 3 ran the full gates 3 and 4 times. Every extra run was a red first run
  on a cheap repo check (a line cap, a generated inventory, a type check) that the builder's narrow
  checks did not include. Finding F-1: a project's narrow checks should include its cheap static
  checks (lint, generated-file freshness, type check) so the first full run is green. It belongs
  in each repo's *Checks* block (D-12), not in the method; skillery's `AGENTS.md` can name
  `make lint` and `make skill-inventory` as narrow checks.
- Rebases between parallel stages caused two of the extra runs (T2): stages built in parallel
  should merge in dependency order before the next stage's full run.
