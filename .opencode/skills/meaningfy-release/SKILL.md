---
name: meaningfy-release
description: The Meaningfy release lifecycle — semantic versioning policy (MAJOR/MINOR/PATCH + -rc.N pre-releases), GitFlow release/hotfix branches, changelog + GitHub release notes, semi-automated releases via release-please, publishing Python libraries to PyPI with Trusted Publishing (OIDC, no tokens), opt-in supply-chain hardening (signing/provenance/SBOM), and release governance (SECURITY.md, yanking, deprecation). Use when cutting, versioning, publishing, or documenting a release. Trigger on "cut a release", "bump the version", "publish to PyPI", "write release notes", "release branch / hotfix", "yank a bad release", "how do we version this", "set up the release workflow".
license: Apache 2.0
metadata:
  category: engineering
---

# Meaningfy Release Lifecycle

## Overview

How a Meaningfy artifact goes from merged commits to a versioned, published, documented release.
This skill owns the **release lifecycle**; it cites the neighbours that already own their slice and
never restates them.

| Concern | Authority | Here |
|---------|-----------|------|
| Commit/branch/PR conventions | [`meaningfy-git-workflow`](../meaningfy-git-workflow/SKILL.md) | cite; add only the release/hotfix branch *lifecycle* |
| GHCR image build/tag/push, deploy, secrets/Vaultwarden | [`ci-cd-delivery`](../ci-cd-delivery/SKILL.md) | cite for deployable repos; never restate the image flow |
| CI + scaffolding/projection | [`project-setup`](../project-setup/SKILL.md) | cite; it projects the release workflow + `SECURITY.md` |
| **Versioning, changelog, release notes, PyPI publish, supply-chain, yank/deprecation** | **this skill** | **own** |

## 1. Versioning policy

- **SemVer is a contract**, not a vibe: **MAJOR** = backward-incompatible change to the public API;
  **MINOR** = backward-compatible addition; **PATCH** = backward-compatible fix. See [semver.org](https://semver.org/).
- **Public API** = what a consumer can import/call without reaching into a private name (leading `_`)
  or an undocumented internal module. If it's public, changing it incompatibly is a MAJOR. Decide and
  document a module's public surface so "breaking" is decidable, not arguable.
- **Pre-releases** use dotted identifiers: `1.5.0-rc.1`, `1.5.0-rc.2`, `1.5.0` (final). Use `-rc.N` for
  release candidates, `-beta.N`/`-alpha.N` earlier. A pre-release sorts *below* its final.
- **Version of record = the git tag** (`vX.Y.Z`), mirrored into `pyproject.toml`. One bumper keeps them
  in sync (§5) — never hand-edit both.

## 2. Release & hotfix branches

GitFlow for public/client repos (a simpler flow internally — that policy lives in
[`meaningfy-git-workflow`](../meaningfy-git-workflow/SKILL.md)). The branch *mechanics* (rebase/merge,
force-push etiquette) are owned there; the *release-specific lifecycle* is owned here and detailed in
[`references/gitflow-release-runbook.md`](references/gitflow-release-runbook.md):

- `release/X.Y.Z` — cut from the integration branch; **stabilisation-only** commits; tag on merge.
- `hotfix/X.Y.Z` — cut **from the released tag**, patch, tag, then back-merge to all long-lived lines.

## 3. Changelog & release notes

- Maintain `CHANGELOG.md` in **[Keep a Changelog](https://keepachangelog.com/)** format with an
  `Unreleased` section that fills as commits land (`project-setup` ships the stub).
- **Auto-generation is the starting point, not the product.** The release engine drafts the entry from
  Conventional Commits; a human adds breaking-change callouts and migration steps.
- **CHANGELOG vs GitHub Release body:** the CHANGELOG is the durable in-repo history; the GitHub Release
  body is the published announcement for that tag (link back to the CHANGELOG section).

## 4. The release engine — release-please (semi-automated)

We **don't release by hand and we don't auto-release on every merge.** Conventional Commits drive a
release *proposal* that a human approves:

```
feat:/fix: commits land on the release line
        │
        ▼
release-please opens a "release PR"  →  version bump + CHANGELOG generated
        │  (human reviews — four-eyes; free-tier needs no draft PR)
        ▼  merge the release PR
tag vX.Y.Z  →  GitHub Release drafted  →  publish job runs (§5)
```

This honours GitFlow + four-eyes and is free-tier-safe (no draft PRs needed — see the GitHub
constraints in [`meaningfy-git-workflow`](../meaningfy-git-workflow/SKILL.md#free-tier-github-constraints)).

## 5. Publishing

- **Library → PyPI** via **Trusted Publishing (OIDC), no API tokens.** Full setup in
  [`references/pypi-publishing.md`](references/pypi-publishing.md): a `release` GitHub environment,
  `id-token: write`, `pypa/gh-action-pypi-publish`, and a **TestPyPI dry-run gate** before the real
  upload.
- **Deployable service → GHCR image** — owned by [`ci-cd-delivery`](../ci-cd-delivery/SKILL.md#3-release--image-standard-r5)
  (semver + git sha → registry). This skill does not restate it; the tag from §4 is its version source.

## 6. Supply-chain hardening (recommended, not required)

Documented target, adopted per-repo and incrementally — **no repo is blocked from releasing without it.**
Detail in [`references/supply-chain.md`](references/supply-chain.md): PyPI **attestations**,
**Sigstore/cosign** keyless signing, **SLSA Level 2** provenance, and an **SBOM** (Syft) attached to the
GitHub Release.

## 7. Governance

- **`SECURITY.md` + coordinated disclosure** via GitHub Security Advisories (private report → fix → CVE
  → publish). Required for public repos; projected by [`project-setup`](../project-setup/SKILL.md).
- **Yank, don't delete.** A broken release already on PyPI is **yanked** (stays installable for existing
  pins, hidden from new resolves) and superseded by a PATCH. Deleting breaks downstream pinned installs.
- **Deprecate before you break.** A MAJOR bump that removes public API is preceded by a deprecation
  cycle (warn in a MINOR, remove in the next MAJOR), recorded in the CHANGELOG.

## Error / decision matrix

| Situation | ❌ Wrong move | ✅ Right move |
|-----------|--------------|-------------|
| Backward-incompatible change | ship it in a MINOR/PATCH | bump MAJOR; run a deprecation cycle first (§7) |
| Bad release already on PyPI | delete the release | **yank** + ship a PATCH (delete breaks pinned installs) |
| Authenticating the PyPI upload | store an API token in GitHub Secrets | Trusted Publishing OIDC, **no token** (§5) |
| Tag and `pyproject.toml` disagree | hand-edit both to match | let release-please be the single bumper (§1, §4) |
| Releasing a deployable service | publish a PyPI package | GHCR image via `ci-cd-delivery` (§5) |
| Pre-release going to production | ship `-rc.N` as the final | promote: drop the pre-release identifier to `X.Y.Z` (§1) |

## Boundary & Related Skills

**Owns:** the release lifecycle — versioning policy, the release/hotfix branch lifecycle, changelog +
GitHub release notes, the release-please engine, PyPI Trusted Publishing, opt-in supply-chain, and
release governance (`SECURITY.md`, yank, deprecation).
**Does NOT own:** commit/branch/PR mechanics ([`meaningfy-git-workflow`](../meaningfy-git-workflow/SKILL.md)),
the GHCR image + deploy + secrets flow ([`ci-cd-delivery`](../ci-cd-delivery/SKILL.md)), or CI +
scaffolding/projection ([`project-setup`](../project-setup/SKILL.md)).
**Related:** [`meaningfy-git-workflow`](../meaningfy-git-workflow/SKILL.md),
[`ci-cd-delivery`](../ci-cd-delivery/SKILL.md), [`project-setup`](../project-setup/SKILL.md).
