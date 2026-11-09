> Derives from: EPIC `navigator-workflows` (`proposal.md`); design `design.md` (D-1..D-6).

## 1. Engine: a passed file gate advances the phase

- [ ] 1.1 `Advance.file`, the file-gate match in `advanceOn` (`lib/phase.ts`), and `FileTouched` calling `navigate` (`lib/state.ts`) (D-1). Tests in `phase.test.ts`, using a test workflow: a matching write in the gate's phase advances; a write matching a later gate skips forward with the skipped phases' gate warnings; no backward move; a file never selects a workflow

## 2. Workflow files

- [ ] 2.1a Build-tier data: the phases, gates and variants of the design table; `exploratory` removed. Update the fixtures that name `shape`, `plan` or `exploratory`: `edge-cases.test.ts` (around lines 162, 172–175, 607) and `phase.test.ts` (around line 149); `make mods` green
- [ ] 2.1b Build-tier tests: the *Shaping* and *Reconcile mid-delivery* examples, including the precondition row of the error matrix (another more recent open change)
- [ ] 2.2 Architecting data (DEC-3, D-3, D-6), plus a test of the *Architecture to modelling* example up to **Next step** returning `conceptual-modelling`, and a test that reloading `architecture` keeps the phase
- [ ] 2.3 Modelling: new `skills/conceptual-modelling/assets/workflows/modelling.workflow.json` (DEC-4); test the rest of the *Architecture to modelling* example
- [ ] 2.4 Release: new `skills/meaningfy-release/assets/workflows/release.workflow.json` (DEC-5, D-4, D-5). Test the *Release* example; test that `git tag v1.0.0` without the skill activates nothing; test that `make validate` in `branch` skips to `merge` with `bump`'s gate warning
- [ ] 2.5 Add the two new files to the default lists in `workflow.test.ts` (TC-16, around lines 85–87), `phase.test.ts` (around line 15) and `edge-cases.test.ts` (around line 19). Run `make bundles`. Add one line naming the workflow file to `architecture`, `conceptual-modelling` and `meaningfy-release`. `make validate` green

## 3. Docs and close

- [ ] 3.1 Docs:
  - `docs/environment/navigator.md`: the six workflows, the new phase names, how a file moves a phase, and how a repo overrides a glob with `extends`;
  - `docs/development/workflows.md`: shape/plan renamed;
  - CHANGELOG, with a BREAKING line for `shape`, `plan` and `exploratory`
- [ ] 3.2 Check the spec delta against what was built; `openspec validate navigator-workflows --strict` and `make validate-spine` green
- [ ] 3.3 One review pass (L2 spec and tests, L3 structure); record the accepted findings in `design.md`; open a PR into `develop`; merge on green CI. Archiving waits for `navigator` (DEC-8)

## Roadmap

- [ ] 1.1 · [ ] 2.1a · [ ] 2.1b · [ ] 2.2 · [ ] 2.3 · [ ] 2.4 · [ ] 2.5 · [ ] 3.1 · [ ] 3.2 · [ ] 3.3

## Verification

`make validate` (navigator tests including the four worked examples, the workflow-file parser,
TC-16's name check), `make validate-spine`, `openspec validate navigator-workflows --strict`.
