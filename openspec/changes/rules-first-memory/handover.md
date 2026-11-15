# Hand-over: rules-first-memory, after stage 2 (all build stages)

## Done
- Stage 1, PR #273 (merged): the `rules-first` mod in `meaningfy-core`, several plain mods per
  bundle, `rules.py where` (routing policy) and `stats` (rules written, memory writes denied), docs,
  the hook spike and the passed replay of 2026-11-11.
- Stage 2 (this PR, merged by the watch-and-merge command after this note): the routing sentence in
  `docs/environment/global-prompt.md`, the `.claude/` section of `project-setup`'s `AGENTS.md.tmpl`,
  `POINTER` (and its copy in `rule-model.md`, D-13) and this repository's Rules line; T-8. Gates on
  `8f37f52`: `make validate` exit 0 (pytest 1468 passed, mods 681 + 87), `make validate-spine` 55/55.
  Review: L1+L2 and L3+L4+L5 (D-14), 0 Critical, 0 Important.
- Acceptance: passed (`evidence/acceptance.md`). Docs owed: one paragraph in
  `docs/environment/setup.md` saying how to clear "routing policy missing" (the routing text points
  there); nothing else owed.

## Decided since the PLAN
D-9 to D-14 (design.md, Delivery decisions).

## Open
- Follow-ups under the floor: #272 (stage 1 Important findings, stage 2 Minor findings).
- D-11: one live deny in a real session and `stats` on that trace, at the release check.
- #268: the flaky `no-poll-loops` timing test.
- The owner's own `~/.claude/CLAUDE.md` holds an older rules bullet, so `where` reports `missing`
  there until it is replaced with the bullet of `global-prompt.md`.

## Next
1. Archive the change (sync the spec deltas into `openspec/specs/`), by PR.
2. Release per `meaningfy-release`; the stage 1 release hold (D-12) is lifted by this merge.

## Prompt
Act as the team lead. Archive openspec/changes/rules-first-memory in skillery from its handover.md,
then hand it to the release manager. Commit, push and merge without asking; merge only on green CI.
