<!-- PLAN (tasks half). PLAN = design.md + this file. No rationale here; see design.md. -->

> Derives from: EPIC `navigator` (`proposal.md`). Appetite VERY LARGE, three stages, one PR per
> stage from `feature/navigator-<n>` into `develop`. Layer tags: **[mod]** `mods/navigator`,
> **[dist]** `bundles.yaml`/`tools/bundle_gen`, **[lint]** `tools/repo_lint`, **[skill]**,
> **[spec]** `hooks.yaml`, **[doc]**, **[ci]**. ✂ = cut-line task (EPIC *Cut line*): drop in this
> order if the stage runs over — Board, Copy status, Report to skillery, then desktop polish.

## 1. Stage 1 — See it

- [ ] 1.1 [mod] Spike (DD-29): in a throwaway plugin folder in the session scratch directory, outside git, with its own `.claude-plugin/plugin.json` (`name`, `version`, `hooks: ["./hooks.json"]`) — since `bundles/meaningfy-navigator` exists only after 1.4/1.5 — a minimal mod (`hooks.json`, `register.tsx` drawing one band row and one `$.ui.status` line, `lib/view.ts` imported with a `.ts` specifier) loads with `claude --plugin-dir <scratch folder>`; nothing of the folder is committed; record the result and the Claude Code version in `openspec/changes/navigator/evidence/stage-1.md`. Deps: none. Acceptance: design §11 H-0 passes, or the DD-7 fallback is chosen and recorded.
- [ ] 1.2 [doc] `docs/development/governance.md`: the Mod type row and its rule; `AGENTS.md` type table row and one line in *How to maintain*. Deps: none. Acceptance: spec `catalogue-governance` *A mod observes, displays and calls commands*.
- [ ] 1.3 [lint] `TOP_LEVEL_FOLDERS` gains `mods`; negative test. Deps: none. Acceptance: spec `catalogue-governance` *Only the agreed top-level folders exist*.
- [ ] 1.4 [dist] `tools/bundle_gen`: optional `mods` key, mod folder checks, mod link, `data/` links (design §2), `plugin.json` `hooks`/`types`/`userConfig`, `unreleased()` covers mods, opencode catalogue omits mod-only bundles (DD-6); `tests/test_bundle_gen.py` cases. Deps: 1.3. Acceptance: specs `catalogue-governance` *Skills are organised…*, `dual-cli-distribution` *A Claude-only artifact type is a recorded gap*.
- [ ] 1.5 [dist] `bundles.yaml` bundle `meaningfy-navigator` (DD-4); `make bundles`; `make skill-inventory` with mods listed per bundle (`tools/skill_inventory.py`). Deps: 1.4. Acceptance: spec `catalogue-model` *The catalogue map…*; `make validate` green.
- [ ] 1.6 [mod] `lib/state.ts` (contract, `reduce`, idempotency), `lib/change.ts`, `lib/view.ts` line and band models; TC-01 (on a fixture state), TC-02, TC-03, TC-10, TC-11, TC-17, TC-18; until 2.2 ships the build-tier `reviews` keys the live line shows `?` for appetite (§6.1). Deps: 1.1. Acceptance: spec `session-navigation` scenarios 1 (partial: change, appetite, progress, mode; the phase arrives with 2.6), 2, 8, 9.
- [ ] 1.7 [mod] `register.tsx`: events of design §5 for start/end/clear, `skill.prompt`, `agent.spawn`, `turn.complete`, `tool.call`; status line; band folded/unfolded with who-runs-what (subagents, skill trail, gate glyphs); `/navigator band|line` commands; `config.json` (DD-25); `types.d.ts`; stacking under `next(e)`. Deps: 1.6. Acceptance: H-1, H-3.
- [ ] 1.8 [ci] `make mods` (node test + tsc, design §11), `validate: lint test mods`; `package.json` `devDependencies.typescript` pinned exactly, `engines.node` `>=22.6`, committed `package-lock.json`, `make install` runs `npm ci`; CI `validate` job node 22 + `npm ci` + `make mods`. Deps: 1.6. Acceptance: `make validate` runs the mod tests; spec `code-principles-governance` *The validator enforces…*.
- [ ] 1.9 [mod] Desktop proof: a placeholder data file `skills/guardrails/assets/session-thresholds.json` (`{}`; filled in 3.1) linked by `make bundles` so the link check runs in stage 1; install from the working-copy marketplace, check line, band, `data/` links; write `openspec/changes/navigator/evidence/desktop-proof.md`; apply DD-19 if the line does not draw. Deps: 1.7. Acceptance: H-2; spec `session-navigation` *Both Claude Code surfaces*.
- [ ] 1.10 [doc] `docs/environment/dual-cli/compatibility.md`: navigator as a Claude-only gap row (hand-written section); `docs/environment/dual-cli/mapping.md` one line: mods are not mapped. Deps: 1.4. Acceptance: spec `dual-cli-distribution` *A Claude-only artifact type is a recorded gap*.
- [ ] 1.11 [doc] User guide `docs/environment/navigator.md` stage-1 part: install (CLI and desktop), what the line and band show, show/hide commands, settings, disable/uninstall, the tested Claude Code version; developer guide `docs/development/mods.md` stage-1 part: the Mod type, `mods/navigator` structure, state contract, bundling, hand checks on both surfaces; register rows in `docs/development/README.md` §8; README entry-point row. Deps: 1.7, 1.9. Acceptance: doc register check green; a cold reader installs from the guide alone.
- [ ] 1.12 [doc] CHANGELOG `[Unreleased]` line for the installer. Deps: 1.11.

## 2. Stage 2 — Follow the workflow

- [ ] 2.0 [lint] `dependencies.yaml` optional `skills:` key (DD-28, design §4.1): add it to `_DEP_OPTIONAL`, the checks in `dependencies_register` (kebab names, one entry per name, no `skills/` clash, and the inline `skills: [a, b]` form only, which TC-16's line reader needs), the lists for `superpowers` and `OpenSpec`; negative tests in `tests/test_repo_lint_negative.py`. Deps: none. Acceptance: spec `code-principles-governance` *A malformed dependency skills list fails CI*.
- [ ] 2.1 [mod] `lib/workflow.ts`: schema of design §4.1, `resolveWorkflows` §4.3; TC-09, TC-16 (reads `skills:` from `dependencies.yaml`). Deps: 1.6, 2.0. Acceptance: spec `workflow-definitions` all scenarios.
- [ ] 2.2 [skill] `skills/epic-delivery/assets/workflows/build-tier.workflow.json` (design §4.2), its `reviews` carrying the scaling table's wording for every appetite (`tester` as its wording, UX once per entry). Then apply every disposition of the DD-21 table: reduce the mapping to a pointer where it says *pointer*, repoint the two doc links, leave worked examples, the description and the Gherkin examples as they are. Deps: 2.1. Acceptance: TC-16; every DD-21 row done as stated; in `skills/` and `docs/`, no table row or rule sentence pairs an appetite name with a review set except the workflow file and the rows marked *keep*; spec `epic-delivery` *The loop scales with the appetite*, *The build-tier workflow is data*.
- [ ] 2.3 [skill] `skills/architecture/assets/workflows/architecting.workflow.json`; one pointer line in `SKILL.md`. Deps: 2.1. Acceptance: TC-16.
- [ ] 2.4 [skill] `skills/infrastructure-operations/assets/workflows/devops.workflow.json`; one pointer line. Deps: 2.1. Acceptance: TC-16; spec `operations-practice` *The DevOps workflow is data*.
- [ ] 2.5 [skill] `skills/sales-operations/assets/workflows/sales.workflow.json` (provisional); one pointer line. Deps: 2.1. Acceptance: TC-16; spec `sales-method-ownership` *The sales workflow is simple and provisional*.
- [ ] 2.6 [mod] `lib/phase.ts` (design §6.2) and `lib/process-drift.ts` PD-1..PD-5; TC-04 (a), TC-12, TC-13. Deps: 2.1. Acceptance: spec `drift-detection` *Process drift*.
- [ ] 2.7 [mod] `lib/actions.ts` Next step, Back on track, Validate, Fold/Hide; `register.tsx` phase and progress in the line, phases row in the band, the buttons. Deps: 2.6. Acceptance: TC-15 (partial); spec `session-navigation` *Actions are commands*.
- [ ] 2.8 [doc] `docs/development/workflows.md`: points to the four files and explains repo overrides (no restated phases); `docs/development/mods.md`: workflow-file schema, repo overrides, adding a check or an action; user guide: workflows, phases, process drift, Next step and Back on track. Deps: 2.7. Acceptance: spec `workflow-definitions` *Repo workflow files override*; doc register green.
- [ ] 2.11 [mod] H-2 re-run on the desktop for scenario 3 (process drift at commit); append to `openspec/changes/navigator/evidence/desktop-proof.md`. Deps: 2.6, 2.7. Acceptance: H-2 stage-2 part.
- [ ] 2.9 [skill] Review whether the four host skills (DEC-13) were right; record the verdict in `design.md` §14 as a DD. Deps: 2.2–2.5.
- [ ] 2.10 [doc] CHANGELOG line; `make bundles`; `make skill-inventory`. Deps: 2.8.

## 3. Stage 3 — Stay on plan and lean

- [ ] 3.1 [skill] `skills/guardrails/assets/session-thresholds.json` (fills the 1.9 placeholder; DD-9 incl. `model_rank`; DD-30 `safe_point`, `task_boundary`, `idle_reset`; owner-decided starting values). In `guardrails`: §5 and §6 name each key and point to the file; §5 "No hook blocks a spawn" becomes "no hook blocks a spawn, except navigator's strict mode (`hooks.yaml` `navigator-strict-spawn`)"; §6 *Enforced by* adds navigator as a signal beside the lead's own judgement; §6 states the safe-point, task-boundary and idle rules in prose that points to the data keys; `references/subagent-reports.md` "about ten to twenty lines" points to `subagent_report_max_lines` instead of a number. Deps: none. Acceptance: spec `subagent-dispatch` *Dispatch and hygiene thresholds are data*; the number 40 appears only in the data file.
- [ ] 3.2 [mod] `lib/dispatch.ts` PD-6..PD-10 and unused-skill, the UX allowance read from the review entry; `lib/hygiene.ts` (design §6.5) reading `safe_point`, `task_boundary`, `idle_reset` with provenance (DD-30); TC-06, TC-07, TC-08, TC-19. Deps: 3.1, 2.6. Acceptance: spec `drift-detection` *Subagent rules*, *Hygiene*.
- [ ] 3.3 [mod] `lib/plan-drift.ts` PL-1..PL-3, `lib/deviations.ts`; TC-05, TC-20. Deps: 2.6. Acceptance: spec `drift-detection` *Plan drift*.
- [ ] 3.4 [skill] `skills/spec-stewardship/SKILL.md`: archive requires no open plan drift, or each deviation recorded in `deviations.md`. Deps: 3.3. Acceptance: spec `build-lifecycle` *EPIC-tier steps each name exactly one owner* (archive step).
- [ ] 3.5 [spec] `hooks.yaml`: four `navigator-strict-*` intents, mechanism `mod`; `_VALID_MECHANISM` gains `mod`; lint `mod_bindings_match`; `docs/development/hooks.md` table and count; `docs/development/hook-bindings.md` `mod` section. Deps: 3.6. Acceptance: spec `dual-cli-distribution` *Hook intent inventory…*.
- [ ] 3.6 [mod] `lib/strict.ts` (design §7), strict hooks in `register.tsx`, drop to loose; TC-04 (b, c), TC-14. Deps: 2.6, 3.3. Acceptance: spec `drift-detection` *Strict mode*; H-4.
- [ ] 3.7 [mod] Actions Reconcile EPIC (DD-16), Archive check, Accept deviation, Compact now / Fresh session, Review, Mode; TC-15 (rest). Deps: 3.3, 3.6. Acceptance: spec `session-navigation` scenario 13; H-6.
- [ ] 3.8 ✂ [mod] Board (design §10). Deps: 3.7.
- [ ] 3.9 ✂ [mod] Copy status. Deps: 3.7.
- [ ] 3.10 ✂ [mod] Report to skillery. Deps: 3.7. Acceptance: H-6; spec `session-navigation` *Report to skillery* (cut line).
- [ ] 3.11 ✂ [mod] Desktop polish: SVG rows on desktop as ponytail does; widths. Deps: 1.9.
- [ ] 3.12 [doc] User guide complete: modes, every action, a worked example of a plan drift caught and fixed (design §6.4); developer guide complete: adding a strict rule (hooks.yaml + `strict.ts`), the event→signal map; `statusline.sh` snippet documented (DD-20). Deps: 3.7. Acceptance: spec `session-navigation` *Documented for two audiences*; cold reader.
- [ ] 3.13 [doc] CHANGELOG line; `make bundles`; `make skill-inventory`. Deps: 3.12.

## 4. Close

- [ ] 4.1 `make validate`, `openspec validate navigator --strict`, hand checks H-1..H-6 recorded in `openspec/changes/navigator/evidence/`.
- [ ] 4.2 Fresh checker over the full diff against this PLAN; findings become DD-n before any fix.
- [ ] 4.3 Acceptance trial run: one real EPIC session in skillery with navigator loose, one scratch repo strict; verdict in `openspec/changes/navigator/evidence/acceptance.md`.
- [ ] 4.4 Archive per `spec-stewardship` (navigator's own Archive check passes).

## Roadmap

- [ ] 1.1 · [ ] 1.2 · [ ] 1.3 · [ ] 1.4 · [ ] 1.5 · [ ] 1.6 · [ ] 1.8 · [ ] 1.7 · [ ] 1.9 · [ ] 1.10 · [ ] 1.11 · [ ] 1.12
- [ ] 2.0 · [ ] 2.1 · [ ] 2.2 · [ ] 2.3 · [ ] 2.4 · [ ] 2.5 · [ ] 2.6 · [ ] 2.7 · [ ] 2.8 · [ ] 2.11 · [ ] 2.9 · [ ] 2.10
- [ ] 3.1 · [ ] 3.2 · [ ] 3.3 · [ ] 3.4 · [ ] 3.6 · [ ] 3.5 · [ ] 3.7 · [ ] 3.12 · [ ] 3.13 · [ ] 3.8 · [ ] 3.9 · [ ] 3.10 · [ ] 3.11
- [ ] 4.1 · [ ] 4.2 · [ ] 4.3 · [ ] 4.4

## Verification

`make validate` (lint, pytest, `make mods`) green; `openspec validate navigator --strict`; hand checks
H-1..H-6 (design §11) recorded in `openspec/changes/navigator/evidence/`; fresh checker per stage; clarity gate on this PLAN ≥ 9/10.
