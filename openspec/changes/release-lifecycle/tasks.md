# PLAN — tasks: `meaningfy-release` skill

> Parent EPIC: `release-lifecycle/proposal.md`. Design: `release-lifecycle/design.md`.

## Roadmap

Author the skill (SKILL.md + 3 references) → wire it into the catalogue (cross-links + bundle) →
add the projection stub in `project-setup` → validate. Doc/config only; no runtime code.

## Tasks

### T1 — SKILL.md (the lifecycle) — owns DEC-1,3,4,6,8
- [ ] Frontmatter: `name: meaningfy-release`, description (triggers: "cut a release", "publish to PyPI", "version bump", "release notes", "gitflow release branch", "yank a release"), `license`, `metadata.category: engineering`, **`boundary`** + **`related_skills`** (`meaningfy-git-workflow`, `ci-cd-delivery`, `project-setup`).
- [ ] Sections 1–9 per design (Overview+authority boundary → Versioning → Release branches → Changelog/notes → release-please engine → Publishing → Supply-chain → Governance → Boundary footer).
- [ ] Include the 4 worked examples + the error/decision matrix.
- [ ] ≤ ~200 lines; push detail to references.
- **Acceptance**: every fact owned elsewhere is a link, not a restatement; the 5 matrix rows present; boundary frontmatter declared.
- **Depends on**: —

### T2 — references/gitflow-release-runbook.md — owns release/hotfix lifecycle
- [ ] `release/x.y.z` cut from `develop`/`main`, stabilise-only commits, tag on merge, back-merge.
- [ ] `hotfix/x.y.z` off a tag, patch, tag, back-merge to both lines.
- [ ] Cite `meaningfy-git-workflow` for branch *mechanics* (rebase/merge/force-push etiquette) — do not restate.
- **Acceptance**: runnable by a dev without re-deriving; no restated commit/branch-mechanics rules.
- **Depends on**: T1 (link target).

### T3 — references/pypi-publishing.md — owns DEC-5
- [ ] Trusted Publishing setup (PyPI side: repo + workflow + `release` env).
- [ ] `release.yml` shape: `id-token: write`, build (`python -m build`/`poetry build`), `pypa/gh-action-pypi-publish`.
- [ ] TestPyPI dry-run gate; GitHub `release` environment approval (free-tier note).
- [ ] Explicit "no API tokens" + Vaultwarden/C2 cross-link to `ci-cd-delivery` secrets model.
- **Acceptance**: a library maintainer can publish following only this file; zero tokens anywhere.
- **Depends on**: T1.

### T4 — references/supply-chain.md — owns DEC-7 (opt-in)
- [ ] PyPI attestations, Sigstore/cosign signing, SLSA L2 provenance, SBOM (Syft) on the Release.
- [ ] Marked **recommended-not-required**, per-repo incremental adoption; nothing blocks a release.
- **Acceptance**: clearly labelled opt-in; target = SLSA L2; no mandate language.
- **Depends on**: T1.

### T5 — Catalogue wiring (cross-links + bundle)
- [ ] Add reciprocal `related_skills` / pointer lines in `meaningfy-git-workflow`, `ci-cd-delivery` (one line each: "release lifecycle → meaningfy-release").
- [ ] Add `meaningfy-release` to the correct role bundle in `.claude-plugin/marketplace.json` (engineering/building).
- **Acceptance**: links resolve both ways; bundle membership exactly one home.
- **Depends on**: T1.

### T6 — project-setup projection stub — owns DEC-9 seam
- [ ] In `project-setup`, add a clearly-marked stub + pointer: library archetype → project `release.yml` + `SECURITY.md`; product → cite `ci-cd-delivery`; doc-only → none.
- [ ] No full re-projection in this change (scope guard) — stub + link only.
- **Acceptance**: seam documented; no scope creep into a full template render.
- **Depends on**: T1, T3.

### T7 — Validate
- [ ] `make validate` green.
- [ ] Grep self-check: no restated GHCR/commit-convention prose in the new skill.
- **Acceptance**: validator passes; single-source self-check clean.
- **Depends on**: T1–T6.

## Layering / dependency note

T1 is the spine; T2–T6 hang off it and are mutually independent (parallelisable); T7 is the barrier.
No code layers involved (catalogue artifact, not a Python service) — `cosmic-python` N/A here.
