# Evals: how to run them

Two kinds of eval, both started by a person and never in CI on push, pull request or release. Every
run that uses a model is approved first, with its estimate (the `catalogue-evaluation` spec; until
it is archived, the `restructure-and-evaluate-catalogue` change's design, D-5 and D-12).

| Kind | Measures | Lives in | Tool |
|---|---|---|---|
| Trigger set | whether a skill's description fires on the right requests and stays quiet on near-misses | `tests/evals/triggers/<skill>.json` | `skill-creator`'s `scripts/run_eval.py` |
| Outcome suite | whether a skill or agent, once fired, produces the right result | `tests/evals/<bundle>/<case>/` (`prompt.md` + `graders/`) | `claude plugin eval` |

## Trigger sets

A set is a JSON list of `{"query": "...", "should_trigger": true|false}`: 10 queries that should
fire the skill and 10 near-misses that belong to a neighbour. Seed it from the skill's probes in
[`../tests/trigger_probes.yaml`](../trigger_probes.yaml). Fix the set before the first run; do
not change it between "before" and "after".

**Isolate the run.** `run_eval.py` writes a temporary command into the nearest `.claude/commands/`
and counts only that name. Where the skillery plugin is installed, the real skill fires under its own
name and scores as a miss. So:

```bash
SCRATCH=/tmp/skillery-trigger && rm -rf "$SCRATCH" && mkdir -p "$SCRATCH/.claude"   # outside $HOME
export CLAUDE_CONFIG_DIR="$SCRATCH/config" && mkdir -p "$CLAUDE_CONFIG_DIR"         # no plugins
cp ~/.claude/.credentials.json "$CLAUDE_CONFIG_DIR/"   # or set ANTHROPIC_API_KEY instead
cd "$SCRATCH"
python <skill-creator>/scripts/run_eval.py \
  --eval-set <repo>/evals/triggers/<skill>.json --skill-path <repo>/skills/<skill> \
  --runs-per-query 3 --model sonnet [--description "<candidate>"]
rm -f "$CLAUDE_CONFIG_DIR/.credentials.json"           # remove the copied login afterwards
```

`<skill-creator>` is the installed copy read on 2026-10-26
(`~/.claude/plugins/marketplaces/claude-plugins-official/plugins/skill-creator/skills/skill-creator`).
Run "before" without `--description` and "after" with the candidate. The record model is `sonnet` on
both sides; `haiku` is only for iterating drafts. **Pass:** at least 90% of the should-trigger queries
fire at a rate of 0.5 or more, at most 10% of the near-misses do, and the result is not worse than
before.

**Cost cap.** `run_eval.py` has no cost ceiling and runs queries in parallel. Before a batch, run one
calibration query per model (`claude -p "<query>" --model sonnet --output-format json`, read
`total_cost_usd`); the approved amount ÷ that unit cost is the maximum number of runs, drafts
included.

## Outcome suites

A case is `tests/evals/<bundle>/<case>/prompt.md` (frontmatter: `max_turns`, `allowed_tools`; body: the
request as a user would type it) plus `graders/`: one `llm` grader for the outcome and one
`tool_used` grader for the skill or agent firing. See the
[`claude plugin eval` docs](https://code.claude.com/docs/en/plugin-evals).

**Locally.** `bundles/<bundle>` has no plugin manifest, so assemble a temporary plugin:

```bash
P=$(mktemp -d)/plugin && mkdir -p "$P/.claude-plugin"
cp -rL bundles/<bundle>/. "$P/"           # add the skills of every bundle it requires: (building → architecture)
printf '{"name":"<bundle>","version":"%s"}\n' "$(cat VERSION)" > "$P/.claude-plugin/plugin.json"
cp -r tests/evals/<bundle> "$P/evals"
claude plugin eval "$P" --trust-plugin --no-publish --model sonnet --runs 3 \
  --ablation none --max-cost-usd <approved amount> [--case <glob>] [--scaffold] [--allow-tools Write Edit Bash]
```

Use `--scaffold` for cases that seed a scratch vault (`case.yaml` `scaffold_script`), and
`--allow-tools` for agent cases that write (`implementer`).

**In CI, on demand.** Actions → `plugin-eval` → Run workflow, with the bundle, case glob, runs, cost
ceiling, model and ablation. It needs the `ANTHROPIC_API_KEY` repository secret.

## Recording results

Each batch writes `openspec/changes/<change>/inputs/evidence/<batch>.md` with the ten-column header:
`| Item | Posture | Change | Eval | Model | Runs | Before | After | Cost | Verdict |`.
