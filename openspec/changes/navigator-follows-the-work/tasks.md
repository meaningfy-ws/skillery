<!-- PLAN (tasks half). PLAN = design.md + this file. -->

> Derives from: EPIC `navigator-follows-the-work` (`proposal.md` § Key decisions, DEC-1..DEC-14);
> design `design.md` (D-1..D-15, § Test cases TC-1..TC-15, § Attack findings A-1..A-12). Every code task is test-first: unit tests in
> `mods/navigator/lib/*.test.ts`, `make mods` green. Gherkin files are walked by hand (repository
> convention); each scenario is also encoded as a unit test.

## 1. Stage 1 — Right data (#185)

- [x] 1.1 Spike, recorded in `evidence/spike-1.1.md`, with a debug log in this mod: (a) `$.session.root()` after EnterWorktree and after a shell `cd`; (b) `$.session.cwd()` inside a subagent's `tool.call`, with and without `isolation: 'worktree'`; (c) whether `skill.prompt` fires between the pre and post of a `Skill` tool call; (d) when a skill preloaded into a subagent fires `skill.prompt` relative to `agent.spawn` and its resolution. Update D-4 if the fallback applies
- [ ] 1.2 Atom and reducer (D-1): `NavState.root`, `lastChangeId`, `mergedBranches`, `skillCalls`, `pendingSpawns`; `Subagent.root`, `skills`; `Change.archived`; signals `RootFollowed`, `AgentRooted`, `SkillCallStarted`/`SkillCallEnded`, `ToolUsed`; `revive` reads an old atom. Tests: each signal's effect and its idempotency
- [ ] 1.2b Test fixtures (DEC-11): a helper in `lib/fixtures.test-helpers.ts` that builds synthetic repositories as data (`ChangeFiles` lists, git outputs for a main checkout, a worktree inside, a worktree beside, another repository, several open changes, an archive)
- [ ] 1.3 Branch matching (D-3) in `lib/change.ts`: bounded match, tie rule, archived only for `lastChangeId`. Delete the tests that assert the mtime fallback (`change.test.ts` around lines 31, 126–134, 146–149) and replace them with TC-1..TC-7 and D-3's matrix rows
- [ ] 1.4 Roots (D-2): pure `lib/root.ts` (decide re-root from toplevel and common; fall back when gone); `io.ts`/`register.tsx` gather the git facts, memoise per directory, re-root before `FileTouched` is computed, take a subagent's root from `session.cwd()` on its first call, make each edit relative to its agent's root, carry `root` across `SESSION_MOVES`, re-read workflows on re-root. Tests with 1.2b fixtures: worked example 1, steps 1–5; a subagent's write in its own worktree passes a file gate relative to it and leaves the lead's change alone
- [ ] 1.5 Accept, validate, archive check, plan drift, `planHash` and the clean-tree check read and write in `state.root`; Accept and Archive check disabled on an archived change. Tests: Accept after a re-root targets the worktree's change
- [ ] 1.6 Skill attribution (D-4, per 1.1): in-flight `Skill` calls, pending spawns, then the lead. Tests: TC-14, TC-14b, TC-14c; none of the subagent cases touch the lead's trail, workflow or gates
- [ ] 1.7 Gherkin `tests/features/navigator-follows-the-work.feature`: the scenarios of `specs/session-navigation/spec.md` § *The navigator follows the worktree being worked* and `specs/drift-detection/spec.md` § *Deviations are recorded in the change*
- [ ] 1.8 Stage gates: `make mods`, `make bundles`, `make validate`; review per the review set; merge into `develop`

## 2. Stage 2 — The phase follows what happens

- [ ] 2.1 Predicates (D-5, D-6): `merged` and `archived` in `lib/change.ts` `holds` and in `CHANGE_PREDICATES` (`lib/workflow.ts`, `types.d.ts`); `archive.enter.change` = `["archived", "merged"]` in `epic-delivery.workflow.json`. Tests: TC-11, TC-12; worked example 2, steps 1–3, including a stage merge with tasks open
- [ ] 2.2 `gh pr view` (D-5): pure `lib/` decision of what to add from its output; `io.ts` runs it at start, after an ok `gh pr merge`, and on re-root or change switch, with a 10 s timeout. Tests: `MERGED`, `OPEN`, another branch's PR, failure, timeout
- [ ] 2.3 Hand-off (D-8) in the `ChangeRead` reducer, using `lastChangeId`. Tests: worked example 2, step 4; change → none (epic-delivery not kept); first read is not a hand-off; a repeated read does not reset twice
- [ ] 2.4 Release by command (D-7): `Activate.commands` and `Trigger.command` in `types.d.ts`, parsed and checked in `lib/workflow.ts`; `select()` in `lib/phase.ts`; the `ToolRan` reducer checks activation before its no-workflow return, then passes the command through the new workflow's gates with no `onLeave` for phases before activation; `activate.commands` in `release.workflow.json`; the missing-skill warning. Replace the tests asserting that a tag or `release/` push activates nothing (`phase.test.ts`, `edge-cases.test.ts`) with: `git switch -c release/1.0.0` lands in `bump`; `gh release create v1.0.0` lands past `publish`'s gate; `git push origin v1.0.0` activates; `git tag v1.0.0`, `git tag -d v1.0.0` and `git push --follow-tags` do not; a release command from no workflow raises no `process:gate:` warning
- [ ] 2.5 Gherkin: `specs/workflow-definitions/spec.md` § *Repository events move the epic-delivery phase*, and its scenarios *Release commands start a release* and *A local tag is not a release*
- [ ] 2.6 Stage gates as 1.8

## 3. Stage 3 — A band you can read at a glance (#188)

- [ ] 3.1 `tierOf` and the warning order (D-10). Tests: TC-13, newest first within a tier. Gherkin for `specs/drift-detection/spec.md` § *Warnings rank by severity*, in `tests/features/navigator-follows-the-work.feature`
- [ ] 3.2 Unused check per agent (D-9): `ToolUsed` from `register.tsx` for every non-`Skill` tool; `turnEvents` per agent; the lead judged and cleared at the main turn end, a subagent at its finish (`lib/dispatch.ts`, `lib/lean.ts`). Tests: two loads then a Read (none unused); a load then another `Skill` call then nothing (unused); a subagent's skill judged at its finish; a background subagent outliving the turn. Gherkin for `specs/drift-detection/spec.md` § *A skill's use is counted per agent*, in `tests/features/navigator-follows-the-work.feature`
- [ ] 3.3 `bandModel` (D-11) in `lib/view.ts`: folded lines; Details rows including gate states and Reconcile EPIC; prefixes and models trimmed; subagents grouped; no `$`. Update `view.test.ts` (the gate-state assertions around lines 57 and 136 move to the phases row). Tests: worked example 3; no change; no workflow; three running subagents (`+1`)
- [ ] 3.4 `register.tsx` draws D-11: folded lines and buttons (Details, Hide), Details with Accept labelled by message, Reconcile EPIC, Less; mode in Details only. Type-check green
- [ ] 3.5 Status line (D-11): `no change for branch <b>`, `no repository`; `● strict` kept. Tests in `view.test.ts`
- [ ] 3.6 #188 lead band (D-14): Gherkin for `specs/workflow-definitions/spec.md` § *A lead session shows its workflow*, one scenario per default workflow naming a lead worker; a unit test per workflow that its lead's primary skill activates it
- [ ] 3.7 Integration check by hand, on the CLI and the desktop app: the band in a worktree session of a scratch repository, against `specs/session-navigation/spec.md` § *The band shows who runs what* and the live `openspec/specs/session-navigation/spec.md` § *Both Claude Code surfaces*; recorded in `evidence/band-check.md`
- [ ] 3.8 Stage gates as 1.8

## 4. Stage 4 — Review sized to the stage (#148) and close

- [ ] 4.1 `small_stage` (D-12): accepted and checked by `reviewError` in `lib/workflow.ts` and typed in `types.d.ts`; set in `epic-delivery.workflow.json` for MEDIUM and above; one `reviewQuota(state)` used by the band, `overspawn` (`lib/dispatch.ts`) and `decideSpawn` (`lib/strict.ts`). Tests: TC-15; a malformed `small_stage`
- [ ] 4.2 `planHash` (D-15): the hash of `design.md` without `## Delivery decisions` replaces `planMtime` for skill-gate staleness (`lib/change.ts`, `gatesAfterPlan`). Correct the stale comment at `lib/change.ts:11`. Tests: a decision added there keeps the clarity gate; an edit elsewhere stales it
- [ ] 4.3 `epic-delivery` SKILL.md and `references/` (stage-loop, team-and-briefs): point to `small_stage` and the `## Delivery decisions` record; no table restating the data
- [ ] 4.4 `meaningfy-code-review` SKILL.md: a combined pass for TINY and SMALL by the review set, and for a small stage by a recorded decision (D-13)
- [ ] 4.5 `agents/code-reviewer.md` (D-13): the brief rule; new description with trigger probes (`tests/trigger_probes.yaml`, one positive, one near-miss); Gherkin in `tests/features/agents/code-reviewer.feature`
- [ ] 4.6 `.github/ISSUE_TEMPLATE/defect.yml`: `labels: ["bug"]`
- [ ] 4.7 Docs: `docs/environment/navigator.md` (the band, worktrees, release by command, a worked example), `docs/development/mods.md` (the state contract: root, agent entries), `docs/development/workflows.md` (`activate.commands`, `small_stage`, `## Delivery decisions`); CHANGELOG with a BREAKING (display) line; `make skill-inventory`
- [ ] 4.8 The lawyer's live trial (#188, D-14): run `tests/features/agents/lawyer.feature`'s scenarios in the contract repository; file what is off through `skillery-feedback`; record the result in `evidence/lawyer-trial.md`
- [ ] 4.9 Check the spec deltas against what was built; `openspec validate navigator-follows-the-work --strict`, `make validate`, `make validate-spine` green; review; PR into `develop`; close #185, #188, #148 on merge

## Roadmap

- [x] 1.1 · [ ] 1.2 · [ ] 1.2b · [ ] 1.3 · [ ] 1.4 · [ ] 1.5 · [ ] 1.6 · [ ] 1.7 · [ ] 1.8
- [ ] 2.1 · [ ] 2.2 · [ ] 2.3 · [ ] 2.4 · [ ] 2.5 · [ ] 2.6
- [ ] 3.1 · [ ] 3.2 · [ ] 3.3 · [ ] 3.4 · [ ] 3.5 · [ ] 3.6 · [ ] 3.7 · [ ] 3.8
- [ ] 4.1 · [ ] 4.2 · [ ] 4.3 · [ ] 4.4 · [ ] 4.5 · [ ] 4.6 · [ ] 4.7 · [ ] 4.8 · [ ] 4.9

## Verification

`make validate` (with `make mods`) green; `openspec validate navigator-follows-the-work --strict`
green; every Gherkin scenario encoded as a unit test and walked by hand; the evidence of 1.1, 3.7
and 4.8 recorded.
