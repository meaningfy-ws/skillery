> Derives from: EPIC `navigator-workflows` (`proposal.md`); design `design.md` (D-1..D-8, *Review findings*).

## 1. Engine: a passed file gate advances the phase

- [x] 1.1 `Advance.file`, the file-gate match in `advanceOn` (`lib/phase.ts`), and `FileTouched` calling `navigate` (`lib/state.ts`) (D-1). Tests in `phase.test.ts`, using a test workflow: a matching write in the gate's phase advances; a write matching a later gate skips forward with the skipped phases' gate warnings; no backward move; a file never selects a workflow

## 2. Workflow files

- [x] 2.1a Build-tier data (`skills/epic-delivery/assets/workflows/build-tier.workflow.json`): the phases, gates, variants and `activate.skills` of the design table (D-2); `exploratory` removed. Update the tests that name `shape`, `plan` or `exploratory` (`edge-cases.test.ts` around lines 161–163, 172–175, 607; `phase.test.ts` around lines 144–150), and every test that loads `clarity-gate` or `openspec-update-change` in `apply` or goes `epic-planning` → `epic-delivery` in one session (`phase.test.ts` around lines 76–82, rewritten to start from a delivery session; `lean.test.ts` around line 92; `edge-cases.test.ts` around lines 221–225). Some of these still pass with the new data: update each for meaning (e.g. edge-cases 172–175 checks `propose`, not `shape`), not only until green; `make mods` green
- [x] 2.1b Build-tier tests: the *Shaping* (no warnings), *Delivery, next session* (each of its four steps) and *Reconcile mid-delivery* examples, and the error-matrix rows *another change is open* and *tasks.md before design.md*
- [x] 2.2 Architecting data in `skills/architecture/assets/workflows/architecting.workflow.json` (DEC-3, D-3, D-6), plus a test of the *Architecture to modelling* example up to **Next step** returning `conceptual-modelling`, and a test that reloading `architecture` keeps the phase
- [x] 2.3 Modelling: new `skills/conceptual-modelling/assets/workflows/modelling.workflow.json` (DEC-4), added to the default lists in `phase.test.ts` (around line 15), `edge-cases.test.ts` (around line 19) and TC-16 in `workflow.test.ts` (around lines 85–87); test the rest of the *Architecture to modelling* example
- [x] 2.4 Release: new `skills/meaningfy-release/assets/workflows/release.workflow.json` (DEC-5, D-4, D-5), added to the same three default lists. Test the *Release* example; test that `git tag v1.0.0` and `git push -u origin release/1.0.0` without the skill activate nothing; test that `make validate` in `branch` skips to `merge` with the `branch:cut` and `bump:bumped` gate warnings
- [x] 2.5 Run `make bundles`. Add one line naming the workflow file to `architecture`, `conceptual-modelling` and `meaningfy-release`. `make validate` green

## 3. Docs and close

- [x] 3.1 Docs:
  - `docs/environment/navigator.md`: the six workflows, the new phase names, how a file moves a phase, and how a repo overrides a glob with `extends`;
  - `docs/development/workflows.md`: the *Exploratory* section (around line 55) becomes *Work shaping*; the workflow table (around lines 76–77) gets the variants `work-shaping, brownfield`, the *Architecture* row in place of *Architecting and modelling*, and new *Conceptual modelling* and *Release* rows;
  - the band sample in `docs/environment/navigator.md` (around line 56) uses the new phase names;
  - CHANGELOG, with a BREAKING line for `shape`, `plan` and `exploratory`
- [x] 3.2 Check the spec delta against what was built, and add the MODIFIED delta of *Default workflow files live in their host skills* (six files, modelling moved; DEC-8 — `navigator` is now archived); `openspec validate navigator-workflows --strict` and `make validate-spine` green
- [ ] 3.3 One review pass (L2 spec and tests, L3 structure); record the accepted findings in `design.md` (done: *Review findings*, fixed by 4.2–4.4); after section 4, open a PR into `develop`; merge on green CI. Archiving waits for `navigator` (DEC-8; `navigator` is archived, so it may follow)

## 4. Re-shape (`inputs/qa.md` round 5) and review fixes

- [x] 4.1 Split (D-2, D-7, D-8): `git mv skills/epic-delivery/assets/workflows/build-tier.workflow.json skills/epic-delivery/assets/workflows/epic-delivery.workflow.json`, then id `epic-delivery`, title "EPIC delivery", phases ready, apply, verify, archive, `brownfield` = apply, archive, no `work-shaping`, `activate.skills` epic-delivery, openspec-apply-change and spec-stewardship. New `skills/epic-planning/assets/workflows/epic-shaping.workflow.json` per the EPIC shaping table. Add it to the default lists (`phase.test.ts`, `edge-cases.test.ts`, TC-16 in `workflow.test.ts`: seven files) and rename every `build-tier` path or id in `mods/navigator/lib/*.test.ts`. Update for meaning the tests 2.1a/2.1b added or changed: *Shaping* (band shows exactly the six, S1), *Delivery, next session* (`ready`, D-7), *Reconcile mid-delivery*, *another change is open* (both cases of its error-matrix row), *tasks.md before design.md* (now `design`, per its row), and the strict and lean tests that name build-tier. Add tests: a proposal-only change in a fresh session lands in `ready`; `openspec-apply-change` in epic-shaping `revise` switches back to epic-delivery; the status line in epic-shaping shows `epic-shaping · <phase>` with no change id (Context). `make mods` green
- [x] 4.2 Release regexes (D-5, W3–W5): `published` and `back` in `skills/meaningfy-release/assets/workflows/release.workflow.json` exactly as the design's Gates list; one test per listed passing and non-passing case; the *Release* example step 6 uses `git push origin v3.11.0`
- [x] 4.3 Test gaps (W1, S2, S3): an old use case edited in architecting's `decide` stays in `decide`; the ADR write asserts `gates.adr` ok; with an open change, `git tag v1.0.0` and `git push -u origin release/1.0.0` do not select release
- [x] 4.4 Docs and comments (W2, W6, S6, S7, D-8): `docs/environment/navigator.md` (seven workflows, `ready`, the `epic-delivery` name in the strict and `extends` examples, the copy-`gates` line); `docs/development/workflows.md` (*Work shaping* ends at the clarity gate and points to `epic-planning`; table rows EPIC shaping and EPIC delivery); every other doc or skill that names the build-tier *workflow file or id* (not the tier): `skills/epic-delivery/SKILL.md`, `references/stage-loop.md`, `references/team-and-briefs.md`, `skills/meaningfy-code-review/SKILL.md`, `docs/development/mods.md`, `docs/practice/ai-coding/working-with-agents.md`, `docs/practice/ai-coding/dod-quality-gates.md`; one line in `skills/epic-planning/SKILL.md` naming its workflow file; doc comments of `Advance`, `advanceOn`, `navigate` (`mods/navigator/lib/phase.ts`) and the build-tier comments in `phase.ts`, `change.ts`, `lean.ts`, `io.ts`; CHANGELOG per W6
- [x] 4.5 `make bundles`, `make validate`, `openspec validate navigator-workflows --strict`, `make validate-spine` green; `git grep -n "build-tier.workflow"` outside `openspec/changes/archive/` and this change returns nothing; MODIFIED deltas for `epic-delivery` and `catalogue-architecture` (they named the build-tier workflow file; found in 4.4)

## Roadmap

- [x] 1.1 · [x] 2.1a · [x] 2.1b · [x] 2.2 · [x] 2.3 · [x] 2.4 · [x] 2.5 · [x] 3.1 · [x] 3.2 · [ ] 3.3 · [x] 4.1 · [x] 4.2 · [x] 4.3 · [x] 4.4 · [x] 4.5

## Verification

`make validate` (navigator tests including the four worked examples, the workflow-file parser,
TC-16's name check), `make validate-spine`, `openspec validate navigator-workflows --strict`.
