# PLAN — tasks: `meaningfy-release` skill

> Parent EPIC: `release-lifecycle/proposal.md`. Design: `release-lifecycle/design.md`.

## Roadmap

Author the skill (SKILL.md + 3 references) → wire it into the catalogue (cross-links + bundle) →
project the library release templates in `project-setup` (DEC-10) → capture behaviour as BDD + an
integration test → validate.

## Tasks

### T1 — SKILL.md (the lifecycle) — owns DEC-1,3,4,6,8  ✅
- [x] Frontmatter: `name`, description (release triggers), `license`, `metadata.category: engineering`; `Boundary & Related Skills` footer naming `meaningfy-git-workflow`, `ci-cd-delivery`, `project-setup`.
- [x] Sections 1–7 + decision matrix per design (versioning → branches → changelog → release-please → publishing → supply-chain → governance).
- [x] Error/decision matrix (6 rows) + cite-don't-restate throughout.
- [x] ≤ ~200 lines; detail pushed to references.
- **Acceptance**: every neighbour-owned fact is a link; matrix present; footer declared. ✅

### T2 — references/gitflow-release-runbook.md  ✅
- [x] `release/X.Y.Z` lifecycle (cut, stabilise-only, tag on merge, back-merge).
- [x] `hotfix/X.Y.Z` off a released tag, patch, tag, back-merge; pre-release promotion; tag/branch protection.
- [x] Cites `meaningfy-git-workflow` for branch mechanics — not restated.

### T3 — references/pypi-publishing.md — owns DEC-5  ✅
- [x] Trusted Publishing setup, `id-token: write`, `pypa/gh-action-pypi-publish`, TestPyPI gate, `release` env.
- [x] "No API tokens" + cross-link to `ci-cd-delivery` secrets boundary; anti-pattern table.

### T4 — references/supply-chain.md — owns DEC-7 (opt-in)  ✅
- [x] Attestations → signing → SLSA L2 → SBOM, in adoption order; recommended-not-required.

### T5 — Catalogue wiring (cross-links + bundle)  ✅
- [x] `meaningfy-release` added to `meaningfy-building` in `marketplace.json`, `EXPECTED_BUNDLES`, README, trigger probe.
- [x] Reciprocal pointer lines in `meaningfy-git-workflow` and `ci-cd-delivery` footers.

### T6 — project-setup projection — owns DEC-9 + DEC-10  ✅
- [x] Real templates: `assets/templates/ci/release.yml.tmpl` (release-please + PyPI Trusted Publishing + TestPyPI gate) and `assets/templates/root/SECURITY.md.tmpl`.
- [x] `scaffold.sh`: **library** → `release.yml` + `SECURITY.md`; **product** → `SECURITY.md` (+ deploy stub); **doc-only** → neither.
- [x] `project-setup` SKILL.md release seam points at the rendered templates.

### T8 — BDD + integration verification  ✅
- [x] `tests/features/release_projection.feature` — Scenario Outline over archetype → projected release files (bdd-gherkin).
- [x] `tests/test_release_projection.py` — runs `scaffold.sh` per archetype, asserts the right files render (plain pytest; no pytest_bdd dependency so `make test` stays green).
- **Acceptance**: scenarios cover library/product/doc-only; the test passes under `make test`.

### T7 — Validate  ✅
- [x] `make validate` (lint + tests) green; `make validate-spine` green (3/3).
- [x] Self-check: no restated GHCR/commit-convention prose in the new skill (validator assist clean).

## Layering / dependency note

T1 is the spine; T2–T6 hang off it; T8 verifies the projection; T7 is the barrier. Catalogue +
scaffold artifact (`scaffold.sh` is the only executable surface) — `cosmic-python` N/A.
