> Derives from: EPIC `navigator-workflows` (`proposal.md`); design `design.md` (D-1..D-6).

## 1. Engine: a passed file gate advances the phase

- [x] 1.1 `Advance.file`, the file-gate match in `advanceOn` (`lib/phase.ts`), and `FileTouched` calling `navigate` (`lib/state.ts`) (D-1). Tests in `phase.test.ts`, using a test workflow: a matching write in the gate's phase advances; a write matching a later gate skips forward with the skipped phases' gate warnings; no backward move; a file never selects a workflow

## 2. Workflow files

- [x] 2.1a Build-tier data: the phases, gates, variants and `activate.skills` of the design table (D-2); `exploratory` removed. Update the tests that name `shape`, `plan` or `exploratory` (`edge-cases.test.ts` around lines 161–163, 172–175, 607; `phase.test.ts` around lines 144–150), and every test that loads `clarity-gate` or `openspec-update-change` in `apply` or goes `epic-planning` → `epic-delivery` in one session (`phase.test.ts` around lines 76–82, rewritten to start from a delivery session; `lean.test.ts` around line 92; `edge-cases.test.ts` around lines 221–225). Some of these still pass with the new data: update each for meaning (e.g. edge-cases 172–175 checks `propose`, not `shape`), not only until green; `make mods` green
- [x] 2.1b Build-tier tests: the *Shaping* (no warnings), *Delivery, next session* (each of its four steps) and *Reconcile mid-delivery* examples, and the error-matrix rows *another change is open* and *tasks.md before design.md*
- [x] 2.2 Architecting data (DEC-3, D-3, D-6), plus a test of the *Architecture to modelling* example up to **Next step** returning `conceptual-modelling`, and a test that reloading `architecture` keeps the phase
- [x] 2.3 Modelling: new `skills/conceptual-modelling/assets/workflows/modelling.workflow.json` (DEC-4), added to the default lists in `phase.test.ts` (around line 15), `edge-cases.test.ts` (around line 19) and TC-16 in `workflow.test.ts` (around lines 85–87); test the rest of the *Architecture to modelling* example
- [x] 2.4 Release: new `skills/meaningfy-release/assets/workflows/release.workflow.json` (DEC-5, D-4, D-5), added to the same three default lists. Test the *Release* example; test that `git tag v1.0.0` and `git push -u origin release/1.0.0` without the skill activate nothing; test that `make validate` in `branch` skips to `merge` with the `branch:cut` and `bump:bumped` gate warnings
- [x] 2.5 Run `make bundles`. Add one line naming the workflow file to `architecture`, `conceptual-modelling` and `meaningfy-release`. `make validate` green

## 3. Docs and close

- [ ] 3.1 Docs:
  - `docs/environment/navigator.md`: the six workflows, the new phase names, how a file moves a phase, and how a repo overrides a glob with `extends`;
  - `docs/development/workflows.md`: the *Exploratory* section (around line 55) becomes *Work shaping*; the workflow table (around lines 76–77) gets the variants `work-shaping, brownfield`, the *Architecture* row in place of *Architecting and modelling*, and new *Conceptual modelling* and *Release* rows;
  - the band sample in `docs/environment/navigator.md` (around line 56) uses the new phase names;
  - CHANGELOG, with a BREAKING line for `shape`, `plan` and `exploratory`
- [ ] 3.2 Check the spec delta against what was built, and add the MODIFIED delta of *Default workflow files live in their host skills* (six files, modelling moved; DEC-8 — `navigator` is now archived); `openspec validate navigator-workflows --strict` and `make validate-spine` green
- [ ] 3.3 One review pass (L2 spec and tests, L3 structure); record the accepted findings in `design.md`; open a PR into `develop`; merge on green CI. Archiving waits for `navigator` (DEC-8)

## Roadmap

- [x] 1.1 · [x] 2.1a · [x] 2.1b · [x] 2.2 · [x] 2.3 · [x] 2.4 · [x] 2.5 · [ ] 3.1 · [ ] 3.2 · [ ] 3.3

## Verification

`make validate` (navigator tests including the four worked examples, the workflow-file parser,
TC-16's name check), `make validate-spine`, `openspec validate navigator-workflows --strict`.
