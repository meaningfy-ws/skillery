> Derived from EPIC `fix-desktop-marketplace-install` (proposal.md); procedure in design.md

## 1. Spike

- [x] 1.1 Build `spike/desktop-c` (symlinks + plugin.json) from `develop@e493af2`; local CLI checks; push
- [x] 1.2 Human (on `develop`, per DEC-7): Desktop sync + install + chat check on C; record in `inputs/spike-results.md`
- [x] 1.3 ~~If C fails~~ not needed — C passed; was: If C fails: build + push `spike/desktop-a` (copies + plugin.json); human test; record
- [x] 1.4 ~~If A fails~~ not needed — C passed; was: If A fails: build + push `spike/desktop-b` (2.10 root layout); human test; record
- [x] 1.5 ~~If all fail~~ not needed — C passed; was: If all fail: H on the best layout; then escalate per design error matrix
- [x] 1.6 Pick the winner from the design decision table; note it in `spike-results.md`

## 2. Spec

- [x] 2.1 Write `specs/dual-cli-distribution/spec.md` delta per the decision table (DEC-6), with scenarios
- [x] 2.2 Dropped: no agent behaviour changed (Gherkin is for agent changes); the layout is covered by `tests/test_bundle_gen.py` and the spec scenarios. Was: Gherkin scenario under `tests/features/` for "marketplace layout passes Desktop constraints" (static checks only)

## 3. Generator

- [x] 3.1 Test-first: `tests/test_bundle_gen.py` cases for the winning layout (plugin.json content per D-2, or root entries, or symlinks)
- [x] 3.2 Implement in `tools/bundle_gen/gen.py` (`render` / `write` / `_link_errors`); `make bundles`
- [x] 3.3 `make validate`, `make validate-spine`, `npm run test:opencode-installer` green; CLI add + install from a clean config

## 4. Docs & release

- [x] 4.1 `docs/environment/dual-cli/` + `docs/development/releasing.md`: the Desktop constraint and how to verify it
- [x] 4.2 CHANGELOG line for installers; PR into `develop`
- [x] 4.3 Release v3.4.0 (minor, owner's call) via `meaningfy-release`; human re-adds `meaningfy-ws/skillery` in Desktop from `releases`
- [x] 4.4 Delete spike branches and any throwaway repo

## Roadmap

- [x] 1.1 · [x] 1.2 · [x] 1.3 · [x] 1.4 · [x] 1.5 · [x] 1.6 · [x] 2.1 · [x] 2.2 · [x] 3.1 · [x] 3.2 · [x] 3.3 · [x] 4.1 · [x] 4.2 · [x] 4.3 · [x] 4.4

## Verification

Desktop adds `meaningfy-ws/skillery` from `releases` and installs `meaningfy-core` with its skills
visible; `make validate` green; CLI install from a clean config passes.
