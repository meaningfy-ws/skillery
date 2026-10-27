# Releasing skillery

How this repository releases, and where people install from. The general release method (SemVer,
GitFlow release branches, changelog) is the `meaningfy-release` skill's; this page is skillery's own
convention on top of it.

## The convention

| Branch | Holds | Who writes it | Installable? |
|---|---|---|---|
| `develop` | the sources: `skills/`, `agents/`, `bundles.yaml`, docs, tools; work in progress included | feature PRs | **no** |
| `release/X.Y.Z` | the release being stabilised (version bump, dated CHANGELOG) | the maintainer | no |
| `main` | the released sources, one merge per release | release PRs | no |
| **`releases`** | each released tree with its generated `bundles/`, minus work in progress; one commit per release, tagged `vX.Y.Z` | only `.github/workflows/releases.yml` | **yes, the only install source** |

- **Install only from `releases`.** Claude Code, the opencode installer and `npx skills add` all read
  `meaningfy-ws/skillery#releases`. A marketplace added without `#releases` tracks `develop` and
  picks up unreleased work: re-add it. claude.ai (Claude Desktop) has no branch field and reads the
  default branch, `develop`, so `develop` must always carry a valid `bundles/` tree.
- **`bundles/` is committed everywhere and never hand-edited.** `make bundles` generates it as
  relative symlinks into `skills/` and `agents/` plus one `.claude-plugin/plugin.json` per bundle
  (claude.ai's sync, used by Claude Desktop, needs the `plugin.json`); commit the result.
- **Release tags live on `releases`.** `vX.Y.Z` points at the release commit on `releases`, the tree
  people install, so `meaningfy-ws/skillery#vX.Y.Z` pins one exact release. The workflow creates the
  tag; nobody tags by hand. (Releases up to `v3.3.0` were tagged on `main`.)
- **Only released items ship.** A skill or agent listed in no bundle is work in progress and is
  left out of the `releases` tree (`python -m tools.bundle_gen unreleased`).
- **The version is visible.** Each bundle's `plugin.json` carries `VERSION`, so `/plugin` shows the
  release number, and a release is a new version for every installed bundle.
- **`releases` is append-only.** Never edit, rebase or force-push it; installed marketplaces update
  with `/plugin marketplace update`.

## Cutting a release

1. From an up-to-date `develop`, branch `release/X.Y.Z` (MINOR for additions, MAJOR when users must
   act, PATCH for fixes).
2. Set `VERSION` to `X.Y.Z`, set `version:` in `hooks.yaml` to match, run `make bundles` (it writes
   the version into `.claude-plugin/marketplace.json`, `tools/opencode-catalogue.json` and
   `package.json`), and turn `## [Unreleased]` into `## [X.Y.Z] - <date>` under a fresh empty
   `## [Unreleased]`.
3. `make validate`; open the PR `release/X.Y.Z` → `main`; merge it when CI is green.
4. The merge runs `releases.yml`: it appends the release commit to `releases`, tags it `vX.Y.Z` and
   publishes the GitHub Release from the CHANGELOG section. Check the run is green.
5. Check the install: in a scratch `CLAUDE_CONFIG_DIR`, `claude plugin marketplace add
   meaningfy-ws/skillery#releases`, install each bundle, and `claude plugin details` lists exactly
   its `bundles.yaml` members.
6. Back-merge `main` → `develop` by PR; delete `release/X.Y.Z`.

If the workflow fails, fix the cause on `main` and re-run it by hand (`workflow_dispatch`); it skips
a version whose tag already exists.

## Testing unreleased work

Run `make bundles`, push a throwaway branch, install it with `#<branch>` in a scratch config, then delete
the branch. Never install from a local path: a local marketplace does not load the bundles' agents.
