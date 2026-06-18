# EPIC: Release-lifecycle skill (`meaningfy-release`)

## Appetite

Medium. One new engineering skill + reference files + projection seam into `project-setup`.
No change to existing skill *content*; new authority for a currently-uncovered lifecycle.

## Why

The catalogue covers commits, branching, CI, and image-based CD — but the **release lifecycle is
uncovered**. Concretely: no versioning policy (how to decide MAJOR/MINOR/PATCH and `-rc.N`, where the
version of record lives, who bumps it); GitFlow is *named* but `release/x.y.z` and hotfix branches are
never operated; no changelog/GitHub-release-notes procedure; and — most glaring — **nothing publishes a
library to PyPI**, despite `project-setup` shipping a "library" archetype. Supply-chain hygiene
(signing, provenance, SBOM) is absent entirely. Conventional Commits are mandated but never harvested
to drive a release.

## Solution outline

Add a single **`meaningfy-release`** skill owning the release lifecycle top-to-bottom: versioning
policy → GitFlow release/hotfix branches + back-merge → changelog + GitHub release notes →
**semi-automated release via release-please** (Conventional-commit-driven release PR → tag → GitHub
Release → publish) → **PyPI publish via Trusted Publishing (OIDC)** for libraries → supply-chain
(recommended-not-required) → governance (`SECURITY.md`, yank, deprecation). It **points at**
`ci-cd-delivery` for the GHCR image path (never restates it) and at `meaningfy-git-workflow` for branch
mechanics. `project-setup` projects the tag-triggered release workflow per archetype.

## Key decisions

- **DEC-1**: One skill (`meaningfy-release`), not four micro-skills — the lifecycle is read top-to-bottom; split only if it outgrows ~200 lines. Reference files: `gitflow-release-runbook.md`, `pypi-publishing.md`, `supply-chain.md`.
- **DEC-2**: **Semi-automated** release via **release-please** — bot opens a release PR (version bump + changelog) from Conventional Commits; merge tags + drafts GitHub Release + publishes. Fits GitFlow + four-eyes + free-tier (no draft PRs needed).
- **DEC-3**: SemVer is the contract: MAJOR=break / MINOR=add / PATCH=fix; `-rc.N`/`-beta.N` for pre-releases. The skill **defines what "public API" means** so "breaking" is decidable.
- **DEC-4**: **Version of record = git tag / GitHub Release**, mirrored into `pyproject.toml`; release-please keeps them in sync. One source, no drift.
- **DEC-5**: Library publish = **PyPI Trusted Publishing (OIDC)** — `id-token: write`, dedicated `release` GitHub environment, `pypa/gh-action-pypi-publish`, **TestPyPI dry-run gate** first. **No API tokens** (aligns with `ci-cd-delivery` C2 / Vaultwarden boundary).
- **DEC-6**: Changelog = **Keep a Changelog** format with an `Unreleased` section; auto-generation is the starting point, humans add breaking-change/migration notes. (`project-setup` already ships the `CHANGELOG.md` stub.)
- **DEC-7**: Supply-chain (**Sigstore keyless signing + SLSA L2 provenance + SBOM via Syft + PyPI attestations**) is **recommended-not-required** — documented as the target, opt-in per repo for incremental adoption.
- **DEC-8**: Governance baseline added: `SECURITY.md` + coordinated disclosure (GitHub Security Advisories), a **yank** procedure for bad PyPI releases, and a **deprecation cycle** required before a MAJOR bump.
- **DEC-9**: GHCR/image release stays in `ci-cd-delivery`; this skill **references** it for deployable repos and owns only the *library/source* release + the cross-cutting lifecycle.

## Rabbit-holes

- Fully-automated semantic-release on every merge (rejected — clashes with GitFlow release branches and four-eyes review).
- Mandating signing/provenance/SBOM across all repos day one (rejected — adopt incrementally; DEC-7).
- Re-documenting GHCR/image build here (rejected — `ci-cd-delivery` owns it; point, don't restate).
- A bespoke in-house release tool (rejected — release-please is the boring, maintained default).

## No-gos

- No change to `ci-cd-delivery`, `meaningfy-git-workflow`, or `project-setup` *content* beyond a projection seam + cross-links.
- No runnable second copy of any deploy/CD workflow (that duplication is what `ci-cd-delivery` exists to kill).
- No secrets or tokens in the repo or skill — Trusted Publishing only.

---

## What Changes

- New `skills/meaningfy-release/SKILL.md` + `references/{gitflow-release-runbook,pypi-publishing,supply-chain}.md`.
- `meaningfy-release` added to the appropriate role bundle in `.claude-plugin/marketplace.json`.
- Cross-links: `meaningfy-git-workflow` (release/hotfix branch mechanics ← here), `ci-cd-delivery` (GHCR image path ↔ here), `project-setup` (projects the release workflow + `SECURITY.md` per archetype).
- `project-setup`: library archetype gains a projected `release.yml` (release-please + PyPI OIDC) stub; product archetype points at `ci-cd-delivery`.
- `make validate` passes (boundary/related-skills frontmatter declared; single-source-of-authority respected).

## Capabilities

### New Capabilities

- Release-lifecycle authority: versioning policy, GitFlow release/hotfix runbook, changelog + GitHub release notes, PyPI Trusted Publishing, supply-chain (opt-in), release governance.

### Modified Capabilities

- `project-setup` projection: per-archetype release workflow + `SECURITY.md`.

## Impact

New skill + docs/config + a projection stub in `project-setup`. No runtime behaviour change to existing
skills. Closes the largest standing gap (library → PyPI) and brings releases up to current OSS practice.
