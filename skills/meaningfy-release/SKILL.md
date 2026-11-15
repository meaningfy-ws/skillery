---
name: meaningfy-release
description: The Meaningfy release lifecycle — semantic versioning policy (MAJOR/MINOR/PATCH + -rc.N pre-releases), GitFlow release/hotfix branches, changelog + GitHub release notes, semi-automated releases via release-please, publishing Python libraries to PyPI with Trusted Publishing (OIDC, no tokens), opt-in supply-chain hardening (signing/provenance/SBOM), and release governance (SECURITY.md, yanking, deprecation). Use when cutting, versioning, publishing, or documenting a release. Trigger on "cut a release", "bump the version", "publish to PyPI", "write release notes", "release branch / hotfix", "yank a bad release", "how do we version this", "set up the release workflow".
license: Apache 2.0
metadata:
  purpose: devops
  area: coding
  subject: git-release
  posture: precise
  stage: release
  maturity: stable
---

# Meaningfy Release Lifecycle

A release is not a hand-edited version number and a tag pushed from a laptop: at Meaningfy a human
approves a release PR that the engine proposes from Conventional Commits, the tag is the version of
record, and a library reaches PyPI with no token stored anywhere.

## Quick Start

A library at `v1.4.2` has two merged commits on `develop`: `feat: add RML validation` and
`fix: handle an empty mapping`.

1. Cut `release/1.5.0` from `develop` (a `feat:` makes a MINOR).
2. release-please opens the release PR: `pyproject.toml` goes to `1.5.0`, `CHANGELOG.md` gets a
   `## [1.5.0]` section drafted from the two commits. A human adds what the commits do not say
   (here: "validation now rejects mappings without a subject map") and reviews.
3. The project's full gates pass on the release branch; the PR is merged after the review.
4. The merge tags `v1.5.0` and drafts the GitHub Release, whose body announces the release and links
   the `1.5.0` CHANGELOG section. The publish job uploads to TestPyPI, then to PyPI through Trusted
   Publishing.
5. `release/1.5.0` is merged back into `main` and `develop`.

## Workflow

The navigator mod tracks these phases and their gates from
[`assets/workflows/release.workflow.json`](assets/workflows/release.workflow.json).

1. **Branch** (gate `cut`). Read `references/gitflow-release-runbook.md` when cutting a release or
   hotfix branch: it adds the stabilisation-only rule, the hotfix base, the back-merge, pre-release
   promotion and tag protection.
2. **Bump** (`bumped`). The engine bumps the version file(s) and writes the CHANGELOG section; both
   name the same version.
3. **Validate** (`validated`). The project's full gates run on the release branch before the merge,
   and their saved output shows them passing.
4. **Merge** (`merged`). A human reviews the release PR (four-eyes); it is never merged with red gates.
5. **Publish** (`published`). The tag `vX.Y.Z` points at the merge commit and the publish job runs
   green.
6. **Back-merge** (`back`) into every long-lived line.

## Rules

### Versioning

- **Public API** is what a consumer can import or call without reaching into a private name (leading
  `_`) or an undocumented internal module. Changing it incompatibly is a MAJOR. Decide and document a
  module's public surface so "breaking" is decidable, not arguable.
- **Pre-releases** use dotted identifiers: `1.5.0-rc.1`, `1.5.0-rc.2`, then `1.5.0`; `-beta.N` and
  `-alpha.N` earlier.
- **The version of record is the git tag** `vX.Y.Z`, mirrored into `pyproject.toml` by one bumper,
  the release engine. Never hand-edit both.

### Branches

GitFlow `release/X.Y.Z` and `hotfix/X.Y.Z` branches for public and client repos; the simpler
internal flow and the branch mechanics (naming, rebase or merge, force-push) are
`meaningfy-git-workflow`'s.

### Changelog and release notes

- `CHANGELOG.md` in [Keep a Changelog](https://keepachangelog.com/) format, with an `Unreleased`
  section that fills as commits land (`project-setup` ships the stub).
- The generated entry is the starting point, not the product: a human adds breaking-change callouts
  and migration steps.
- The CHANGELOG is the durable in-repo history; the GitHub Release body is the announcement for that
  tag and links back to its CHANGELOG section.

### The release engine: release-please

No release by hand, no automatic release on every merge. Conventional Commits drive a release PR
(version bump and CHANGELOG) that a human reviews and merges; the merge tags `vX.Y.Z`, drafts the
GitHub Release and runs the publish job. It needs no draft PR, so it works on the free tier (GitHub
constraints in `meaningfy-git-workflow`).

### Publishing

- **Library → PyPI** through Trusted Publishing (OIDC), no API token, behind a TestPyPI dry run.
  Read `references/pypi-publishing.md` when setting up or changing a library's publish job: it adds
  the one-time PyPI and GitHub setup, the job's invariants and its mistakes.
- **Deployable service → a GHCR image**, owned by `ci-cd-delivery`; the tag from the release engine
  is its version source.

### Supply-chain hardening (recommended, not required)

Adopted per repo and incrementally; no repo is blocked from releasing without it. Read
`references/supply-chain.md` when a repo adopts signing, provenance or an SBOM: it adds the four
layers in adoption order and the rung each kind of repo should reach.

### Governance

- **`SECURITY.md` and coordinated disclosure** through GitHub Security Advisories (private report →
  fix → CVE → publish). Required for public repos; projected by `project-setup`.
- **Yank, don't delete.** A broken release on PyPI is yanked (still installable for existing pins,
  hidden from new resolves) and superseded by a PATCH.
- **Deprecate before you break.** Public API is deprecated with a warning in a MINOR and removed in
  the next MAJOR, both recorded in the CHANGELOG.

### Common mistakes

| Mistake | Why it fails | Do instead |
|---|---|---|
| Ship a backward-incompatible change in a MINOR or PATCH | consumers break without warning | bump MAJOR after a deprecation cycle |
| Delete a bad release from PyPI | pinned installs downstream break | yank it and ship a PATCH |
| Store a PyPI API token in GitHub Secrets | a standing secret to leak | Trusted Publishing, no token |
| Hand-edit the tag and `pyproject.toml` to match | two bumpers drift | release-please is the single bumper |
| Publish a deployable service as a PyPI package | wrong artifact | GHCR image via `ci-cd-delivery` |
| Ship `-rc.N` as the final | a pre-release sorts below its final | promote: drop the identifier to `X.Y.Z` |

## Triggers

- When someone asks to "bump the version" by editing files, route the bump through the release PR.
- When a released version needs a fix while `develop` holds unreleased work, cut a hotfix from the tag.
- When a library release is about to go to PyPI, check the Trusted Publisher binding and the
  `release` environment before the tag.

## Before you hand over

| Question | If not | Action |
|---|---|---|
| Do the tag, the version file(s) and the CHANGELOG section name one version? | the release is ambiguous | fix it in the release PR, never by hand on the tag |
| Did a human review the release PR, with the gates green? | four-eyes is broken | hold the merge |
| Does the GitHub Release body link its CHANGELOG section and carry the breaking-change callouts? | readers miss the migration steps | edit the release notes |
| Did TestPyPI succeed before PyPI? | a bad upload can only be yanked | run the dry-run job first |
| Is the release merged back into every long-lived line? | the next release regresses | back-merge now |

## Boundary & Related Skills

**Owns:** the release lifecycle: versioning policy, the release and hotfix branch lifecycle,
changelog and GitHub release notes, the release-please engine, PyPI Trusted Publishing, opt-in
supply-chain hardening, and release governance (`SECURITY.md`, yank, deprecation).
**Does not own:** commit, branch and PR mechanics (`meaningfy-git-workflow`); the GHCR image,
deploy and secrets flow (`ci-cd-delivery`); CI, scaffolding and the projection of the release
workflow and `SECURITY.md` (`project-setup`).
**Related:** `meaningfy-git-workflow`, `ci-cd-delivery`, `project-setup`.

Answers `VER, RSK` in `test-strategy`'s matrix (`references/devops.md`).
