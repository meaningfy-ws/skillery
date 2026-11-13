<!-- PLAN (tasks half). PLAN = design.md + this file. -->

> Derives from: EPIC `navigator-follows-the-work` (`proposal.md`); design `design.md` (D-1..D-14).
> Every code task is test-first (unit tests in `mods/navigator/lib/*.test.ts`, `make mods` green).

## 1. Stage 1 — Right data (#185)

- [ ] 1.1 Spike, recorded in `evidence/spike-1.1.md`: in a throwaway mod or a debug log of this one, show (a) `$.session.root()` after EnterWorktree and after a shell `cd`; (b) `$.session.cwd()` inside a subagent's `tool.call` with and without `isolation: 'worktree'`; (c) whether `skill.prompt` fires between the pre and post of the `Skill` tool call. Pick D-4's path; update D-4 if the fallback applies
- [ ] 1.2 Types and reducer (D-1): `NavState.root`, `Subagent.root/skills`, `Change.archived/merged`, `NavState.merged`, `unmatchedBranch`; new signals `RootFollowed`, `AgentRooted`, `SkillCallStarted`/`SkillCallEnded`; `revive` keeps old atoms readable. Unit tests: each signal's effect and its idempotency
- [ ] 1.3 Branch matching (D-3) in `lib/change.ts`: segment-bounded match, longest wins, archived fallback, no mtime fallback. Tests: every example and the tie rule of D-3 and the error matrix
- [ ] 1.4 Roots in `io.ts`/`register.tsx` (D-2): `repoRoot()` replaced by the lead's `state.root` (start: `session.root()` + `git rev-parse`); re-root on the lead's writes by `--git-common-dir`; a subagent's root from `session.cwd()` on its first call; edits made relative to the writing agent's root. Tests through a fake `$`: worked example 1, steps 1–4
- [ ] 1.5 Accept, validate, archive check, plan drift and the clean-tree check all read and write in the lead's root; Accept writes `deviations.md` of the followed change. Tests: Accept after a re-root writes into the worktree
- [ ] 1.6 Subagent skill attribution (D-4, per 1.1): a subagent's load lands in its own entry and activates nothing. Tests: a subagent loading `test-driven-development` leaves the lead's trail, workflow and gates unchanged
- [ ] 1.7 Gherkin `tests/features/navigator-follows-the-work.feature`: scenarios of requirement *The navigator follows the worktree being worked* (synthetic repositories: a worktree inside, one beside, several open changes; DEC-11)
- [ ] 1.8 Stage gates: `make mods`, `make bundles`, `make validate`; review per D-12 (this stage's size); merge into `develop`

## 2. Stage 2 — The phase follows what happens

- [ ] 2.1 `archived` and `merged` predicates (D-5, D-6) in `lib/change.ts`; `epic-delivery.workflow.json` `archive.enter.change` = `["archived", "merged"]`. Tests: worked example 2, steps 1–3
- [ ] 2.2 The `gh pr view` read in `io.ts` at start, after an ok `gh pr merge`, and on a change switch (D-5). Tests through a fake `$`: `MERGED`, `OPEN`, another branch's PR, `gh` failing
- [ ] 2.3 Hand-off (D-8) in the `ChangeRead` reducer. Tests: worked example 2, step 4; first read is not a hand-off; a repeated read does not reset twice
- [ ] 2.4 Release by command (D-7): `Activate.commands` in `types.d.ts` and `lib/workflow.ts` (parse, validate), `select()` trigger in `lib/phase.ts`, `activate.commands` in `release.workflow.json`, the missing-skill warning. Replace the tests that assert *a tag or a `release/` push activates nothing* with: `git switch -c release/1.0.0`, `gh release create v1.0.0` and `git push origin v1.0.0` activate; `git tag v1.0.0` alone and `git tag -d v1.0.0` do not
- [ ] 2.5 Gherkin: the scenarios of *Repository events move the epic-delivery phase* and the modified release scenario
- [ ] 2.6 Stage gates as 1.8

## 3. Stage 3 — A band you can read at a glance (#188)

- [ ] 3.1 `tierOf` and the warning order (D-10) in `lib/view.ts`. Tests: one key per tier, unknown prefix, newest first within a tier
- [ ] 3.2 Unused check per agent (D-9) in `lib/dispatch.ts`/`lib/lean.ts`. Tests: the false alarms of the seed (two loads then a tool call: none unused); a subagent's skill judged at its finish; a background agent outliving the turn
- [ ] 3.3 `bandModel` rewritten to the folded and Details shape (D-11) in `lib/view.ts`; plugin prefixes and models trimmed; subagents grouped; `$` dropped. Tests: worked example 3; no change; no workflow; three running subagents (`+1`)
- [ ] 3.4 `register.tsx` draws D-11: folded lines and buttons, Details with Accept labelled by message, Less; mode row in Details only. Type-check green
- [ ] 3.5 Status line (D-11): `no change for branch <b>`; `● strict` kept. Tests in `view.test.ts`
- [ ] 3.6 #188 lead band (D-14): Gherkin, one scenario per default workflow with a lead worker; a unit test per workflow that its lead's primary skill activates it
- [ ] 3.7 Hand check on the CLI and the desktop app of the band in a worktree session of a synthetic repository, recorded in `evidence/band-check.md` (the `session-navigation` requirement *Both Claude Code surfaces*)
- [ ] 3.8 Stage gates as 1.8

## 4. Stage 4 — Review sized to the stage (#148) and close

- [ ] 4.1 `small_stage` in `epic-delivery.workflow.json` (D-12); the navigator's reviewer quota from the plan read's added lines. Tests: at, under and over 600
- [ ] 4.2 `epic-delivery` SKILL.md and `references/` (stage-loop, team-and-briefs): point to `small_stage`, the lead's recorded `DD-`; no table restating the data
- [ ] 4.3 `meaningfy-code-review` SKILL.md: a combined pass beyond TINY and SMALL when a recorded decision names it (D-13)
- [ ] 4.4 `agents/code-reviewer.md` (D-13): accepts several lenses with a cited, recorded decision; new description with trigger probes (`tests/trigger_probes.yaml`, one positive, one near-miss); Gherkin in `tests/features/agents/code-reviewer.feature`
- [ ] 4.5 `.github/ISSUE_TEMPLATE/defect.yml`: `labels: ["bug"]`
- [ ] 4.6 Docs: `docs/environment/navigator.md` (the new band, worktrees, release by command, a worked example), the developer guide (`docs/development/mods.md` state contract: root, agent entries), `docs/development/workflows.md` (`activate.commands`, `small_stage`); CHANGELOG with a BREAKING (display) line; `make skill-inventory`
- [ ] 4.7 The lawyer's live trial (#188, D-14): run `tests/features/agents/lawyer.feature`'s scenarios in the contract repository; file what is off through `skillery-feedback`; note the result in `evidence/lawyer-trial.md`
- [ ] 4.8 Check the spec deltas against what was built; `openspec validate navigator-follows-the-work --strict`, `make validate`, `make validate-spine` green; review; PR into `develop`; close #185, #188, #148 on merge

## Roadmap

- [ ] 1.1 · [ ] 1.2 · [ ] 1.3 · [ ] 1.4 · [ ] 1.5 · [ ] 1.6 · [ ] 1.7 · [ ] 1.8
- [ ] 2.1 · [ ] 2.2 · [ ] 2.3 · [ ] 2.4 · [ ] 2.5 · [ ] 2.6
- [ ] 3.1 · [ ] 3.2 · [ ] 3.3 · [ ] 3.4 · [ ] 3.5 · [ ] 3.6 · [ ] 3.7 · [ ] 3.8
- [ ] 4.1 · [ ] 4.2 · [ ] 4.3 · [ ] 4.4 · [ ] 4.5 · [ ] 4.6 · [ ] 4.7 · [ ] 4.8

## Verification

`make validate` (with `make mods`) green, `openspec validate navigator-follows-the-work --strict`
green, the Gherkin scenarios pass, the evidence files of 1.1, 3.7 and 4.7 recorded.
