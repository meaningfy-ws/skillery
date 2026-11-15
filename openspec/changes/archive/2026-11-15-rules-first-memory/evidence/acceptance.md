# Acceptance after the last stage

**Result: passed.** Run by the lead on 2026-11-15 on branch `feature/rules-first-memory-stage-2`
(commit `8f37f52`), after stage 1 merged (#273).

| Check | How | Observed | Pass |
|-------|-----|----------|------|
| The 2026-11-11 failure no longer reproduces | the replay in an empty Claude Code config (task 1.7) | passed on every criterion (`replay.md`) | yes |
| A user who pastes the updated rules line gets `present` | a temporary config folder whose `CLAUDE.md` holds only the rules bullet of `docs/environment/global-prompt.md` (wrapped as in the file); `rules.py where` | `routing policy: present (<tmp>/CLAUDE.md)` | yes |
| Without it, `missing` with the fix | the same folder with no `CLAUDE.md` | `routing policy: missing (add the rules line of docs/environment/global-prompt.md to your global instructions)` | yes |
| The bundled mod prints the block with `present` | `node bundles/meaningfy-core/mods/rules-first/rules-first.mjs` fed a `SessionStart` event, with that `CLAUDE.md` | `Rules (rules-first):`, the store lines, `routing policy: present (…)` and the routing lines | yes |
| The routing sentence has one home | T-8 (`tests/test_rules_first_routing.py`) over `global-prompt.md`, the template, `AGENTS.md` and `POINTER` | green in `make validate` (1468 passed) | yes |

Open for the release check (D-11, D-12): one live deny in a real session and `stats` on that trace;
the review follow-ups in #272.
