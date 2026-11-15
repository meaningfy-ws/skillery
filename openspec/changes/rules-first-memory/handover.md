# Hand-over: rules-first-memory, after stage 1

## Done
Stage 1 (tasks 1.1 to 1.8): the `rules-first` mod in `meaningfy-core` (session block and the deny
of `feedback`/`user` memory notes), several plain mods per bundle, `rules.py where` reports the
routing policy, `rules.py stats` counts rules written and memory writes denied, docs and the
opencode gap. Hook spike: all four yes (`evidence/hook-spike.md`). Replay of 2026-11-11: passed
(`evidence/replay.md`). Gates on `d6db453`: `make validate` exit 0 (pytest 1463 passed, mods 681 +
87 passed), `make validate-spine` 55/55. Merged by the watch-and-merge command after this note.

## Decided since the PLAN
D-9 to D-12 (design.md, Delivery decisions).

## Open
- **Release hold** (D-12): stage 1 is not released without stage 2; until then `where` says
  `routing policy: missing` to everyone.
- Review findings under the floor (D-12), one follow-up issue filed with the PR: the type match
  (hyphen, first `type:` only, case), the real-path compare, `types`/`userConfig` from any mod in
  `plugin_manifests`, the deny data held in the mod, the 5 s `where` timeout under load, and
  `rules written` reading only the first `rules.py` call.
- D-11: the live deny path and a hook's stderr reaching Langfuse are unverified; the release check
  triggers one deny and runs `stats` on that trace.
- #268: the flaky `no-poll-loops` timing test (failed once here under load).

## Next
1. Stage 2, task 2.1: the routing sentence (line 3 of `skills/rulebook/assets/routing.md`) appended
   to the rules bullet of `docs/environment/global-prompt.md`; one new last paragraph of the
   `.claude/` section of `skills/project-setup/assets/templates/agentic/AGENTS.md.tmpl`; `POINTER`
   in `rules.py` extended with it and this repository's `- **Rules:**` line set to the new
   `POINTER`; T-8 in `tests/test_rules_first_routing.py`; `binding_size` stays green. Then 2.2.
2. After the last stage: the acceptance demo, the docs-owed decision, archive, release.
Read first: tasks.md §2, design.md D-1, D-2, D-12.

## Prompt
Act as the team lead. Continue openspec/changes/rules-first-memory in skillery from its
handover.md: stage 2 (task 2.1), then the close. Commit, push and merge without asking; merge only
on green CI.
