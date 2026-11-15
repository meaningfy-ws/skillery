# Replay of 2026-11-11 (task 1.7, T-11)

**Result: passed.** Run by the owner on 2026-11-15 in an interactive Claude Code 2.1.325 session, on
branch `feature/rules-first-memory-stage-1` at commit `23ed41f`. The lead checked the session
transcript against each criterion.

## Setup

- A fresh scratch git repository with one file, `hello.txt` (`hello`), and one commit.
- An empty `CLAUDE_CONFIG_DIR`: no global instructions, no memory, no marketplace plugins. Its
  `settings.json` holds only `"autoMemoryEnabled": true`. The owner logged in once.
- `MEANINGFY_VAULT` unset.
- `claude --plugin-dir bundles/meaningfy-core` (this branch), so the only hooks were `no-poll-loops`
  and `rules-first`.

Prompts, in order: `What is in this repo?`; `in this repo never ask for commit, pr, or merge, just
do these actions`; `Add a line "bye" to hello.txt.`; `approve the rule, yes i accept`; `/exit`.

## Criteria

| Criterion | Observed | Pass |
|-----------|----------|------|
| The block shows at session start | the context held `Rules (rules-first):` with `vault: none`, `default store: repository`, `routing policy: missing (…)` and the five routing lines | yes |
| The first reply names the missing vault and routing policy once | the first reply ended with "One setup note from the session startup check: the rules routing policy is missing, and no vault is configured", with the fix | yes |
| Later replies do not repeat it | no later reply repeated the setup note; one card line said there was no vault to search for an existing rule, which is the card's own check | yes |
| The statement becomes a card row before the final summary | `rule-learner` loaded on the statement; the card was shown, and the reply after the change ended by asking for the card's approval before closing | yes |
| On approval, the rule is written to the repository | `rules.py` wrote `docs/rules/P-0001 do it without asking the owner.md` (constraint, hard, `activity:coding`, the owner's words as source) | yes |
| No new memory note of any type | `find <config>/projects -path '*/memory/*' -type f` found nothing; the agent never tried a memory write, so the deny did not fire (no `[rules-first: memory write denied]` in the transcript) | yes |

The agent also followed the new rule within the session: it committed the change (`63a0256`) and
the rule (`0c4a3a4`) without asking, and said it could not open a PR because the repository has no
remote.

## Notes

- `rules.py add` also created `AGENTS.md` with the rules pointer, as it does in a repository that has
  none. That is existing behaviour, outside this EPIC.
- The deny itself is covered by the unit tests in `mods/rules-first/rules-first.test.mjs` and by the
  hook spike (`hook-spike.md`, Q3). In this replay the routing text alone kept the agent away from
  memory.
