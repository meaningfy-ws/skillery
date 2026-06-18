# GitFlow release & hotfix runbook

The release-specific branch lifecycle. Branch *mechanics* — rebase vs merge, force-push etiquette,
branch-name shape — are owned by [`meaningfy-git-workflow`](../../meaningfy-git-workflow/SKILL.md);
follow it for those. This file covers only what is release-specific.

## Release branch — `release/X.Y.Z`

1. **Cut** `release/X.Y.Z` from the integration branch once the scope for the version is feature-complete.
2. **Stabilise only.** On a release branch you commit bug fixes, docs, and version metadata — **no new
   features.** New features wait for the next release line.
3. Let **release-please** (see [`pypi-publishing.md`](pypi-publishing.md) and SKILL §4) bump the version
   and assemble the CHANGELOG via its release PR.
4. **Tag on merge.** Merging the release PR produces the annotated tag `vX.Y.Z`, the GitHub Release, and
   the publish job.
5. **Back-merge** the release branch into every long-lived line (e.g. `main` and `develop`) so the
   version bump and any stabilisation fixes are not lost.

## Hotfix branch — `hotfix/X.Y.Z`

A production bug on an already-released version, fixed without dragging in unreleased work:

1. **Cut `hotfix/X.Y.Z` from the released tag** `vX.Y.(Z-1)` — *not* from the integration branch (that
   would smuggle in unreleased changes).
2. Commit the fix as a `fix:` (so the engine resolves it to a PATCH bump).
3. Tag `vX.Y.Z` and publish, same path as a normal release.
4. **Back-merge to all long-lived lines** so the fix is not regressed by the next release.

## Pre-release promotion

`X.Y.Z-rc.1` → test → if green, the **final** is `X.Y.Z` (the pre-release identifier is dropped, the
core version is unchanged). If a fix is needed mid-RC, cut `X.Y.Z-rc.2`. Never ship an `-rc.N` as the
final — promote it.

## Tag & branch protection

Protect `release/*` and tag refs so a published version cannot be force-rewritten — a published tag is
immutable history that downstream pins depend on.
