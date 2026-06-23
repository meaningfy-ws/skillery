# Changelog

All notable changes to the Meaningfy Skillery catalogue are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/), and the
catalogue version is the `metadata.version` in
[`.claude-plugin/marketplace.json`](.claude-plugin/marketplace.json). The version
of record for a release is the git tag `vX.Y.Z`.

Versions at or below `2.4.0` predate this changelog; see the git history and the
`v2.3.0` tag for earlier detail.

## [2.5.1] - 2026-06-23

### Fixed

- **Spine lifecycle validator hardened against three mechanical flakes** found by
  driving the spine end-to-end:
  - **Archive link depth** — `openspec archive` copied a delta's relative links
    into `specs/` verbatim, leaving over-deep `../` links. Added
    `normalize_spec_links` (a `--fix` mode + `make fix-spec-links`) that recomputes
    depth from the file's location; `broken_links` remains the safety net.
  - **`EXPECTED_BUNDLES` duplication** — bundle membership is now read from
    `marketplace.json` (single source of truth) instead of a hand-kept copy in the
    validator; only the four role names are pinned. Adding a skill no longer edits
    the validator. Placement invariants kept: known role, single home, every skill
    dir registered.
  - **Un-groomed spec `Purpose`** — `make validate` now fails on a `TBD - created
    by archiving` placeholder.

### Changed

- `spec-stewardship` documents the post-archive `make fix-spec-links` step.

## [2.5.0] - 2026-06-23

### Added

- **`explanatory-writing` skill** (`meaningfy-core`) — the craft that makes
  Diátaxis Explanation-quadrant prose read clearly: controlling metaphor,
  concrete-beside-abstract, self-answered question pivots, an 8-axis voice schema,
  positive-default knobs cross-linked to the existing house voice
  (`company-voice.md`, inherited not forked), and variant-batch validation.
- **Writing reference discipline** — writing knowledge lives only in the
  writing-skill family; `technical-writing`, `executive-communication`, and
  `epic-planning` gain by-reference hooks. No bundle reorg.

### Changed

- Archived the `voice-extension-and-enhancement` and `catalogue-ux-and-docs`
  changes, merging their spec deltas into `openspec/specs/`.
