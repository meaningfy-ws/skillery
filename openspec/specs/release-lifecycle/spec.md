# release-lifecycle Specification

## Purpose
Define the catalogue's release lifecycle: a single skill (`meaningfy-release`) that owns semantic
versioning, the GitFlow release/hotfix runbook, changelog + release notes, the release engine, library
publishing to PyPI via Trusted Publishing, opt-in supply-chain hardening, and release governance —
projected per archetype by `project-setup`, citing (not restating) its neighbour skills.

## Requirements
### Requirement: A single skill owns the release lifecycle

The catalogue SHALL provide one skill, `meaningfy-release`, that is the single source of authority for
the release lifecycle — semantic-versioning policy, the GitFlow release/hotfix branch lifecycle,
changelog and GitHub release notes, the release engine, library publishing, opt-in supply-chain
hardening, and release governance. It SHALL cite (not restate) `meaningfy-git-workflow` for commit/branch
mechanics, `ci-cd-delivery` for the GHCR image flow, and `project-setup` for CI and projection.

#### Scenario: The skill is registered and self-consistent

- **WHEN** `make validate` runs over the repository
- **THEN** `meaningfy-release` is registered in exactly the `meaningfy-building` bundle, its frontmatter
  carries `name` and `description`, and the validator reports the repository self-consistent

#### Scenario: A neighbour's fact is cited, not restated

- **WHEN** the skill needs a fact owned by another skill (GHCR image build, commit conventions)
- **THEN** it links to the owning skill rather than re-specifying the fact, keeping single ownership

### Requirement: Libraries publish to PyPI without long-lived tokens

The release lifecycle SHALL prescribe publishing Python libraries to PyPI via Trusted Publishing
(OIDC), with no API tokens stored in the repository or GitHub Secrets, gated by a TestPyPI dry run.

#### Scenario: A library release is published

- **WHEN** a maintainer follows the PyPI publishing reference to release a library
- **THEN** the workflow authenticates via the OIDC `id-token` exchange with `pypa/gh-action-pypi-publish`,
  runs a TestPyPI dry run before the production upload, and stores no PyPI API token anywhere

### Requirement: Releases are semantically versioned with a recovery path

The lifecycle SHALL define MAJOR/MINOR/PATCH and `-rc.N` pre-release semantics against a declared public
API, and SHALL prescribe yanking (not deleting) a bad release plus a deprecation cycle before a MAJOR
removal.

#### Scenario: A broken release is recovered

- **WHEN** a published release is found to be broken
- **THEN** the guidance is to yank it and ship a PATCH, never to delete it (which would break pinned
  installs)

