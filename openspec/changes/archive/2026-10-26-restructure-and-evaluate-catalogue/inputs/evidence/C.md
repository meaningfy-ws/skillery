# Evidence: batch C (`executive-communication` trigger gap) — IN PROGRESS

**Batch:** C · **Approved:** up to $5 (2026-10-27, see `../approvals.md`) · **Environment:** isolated
`/tmp/skillery-trigger` + fresh `CLAUDE_CONFIG_DIR`, copied login (removed after the run) · **Model
ids reported:** `claude-sonnet-5-5`, `claude-haiku-5-5`

| Item | Posture | Change | Eval | Model | Runs | Before | After | Cost | Verdict |
|---|---|---|---|---|---|---|---|---|---|
| `executive-communication` | profiled | none yet | `run_eval.py` on `evals/triggers/executive-communication.json` | claude-sonnet-5-5 | 60 | **invalid**: 10/20 (0/30 should-trigger runs fired; 0/30 near-miss runs fired) | — | ≈ $1.77 est. | pending: measurement discarded |

**Why the "before" is invalid.** `run_eval.py` registers the skill under test as a command file in
`.claude/commands/`. In Claude Code 2.1.310 such a file loads as a slash command only; it does not
appear in the session's skill list, so the model cannot choose it, and every should-trigger query
scores 0 by construction. Checked: a test command file appeared in `slash_commands` but not in
`skills`; a test `.claude/skills/<name>/SKILL.md` appeared in `skills`. Fix: design D-13.
