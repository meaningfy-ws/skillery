# Changelog

All notable changes to the Meaningfy Skillery catalogue are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/), and the
catalogue version is the `metadata.version` in
[`.claude-plugin/marketplace.json`](.claude-plugin/marketplace.json). The version
of record for a release is the git tag `vX.Y.Z`.

Versions at or below `2.4.0` predate this changelog; see the git history and the
`v2.3.0` tag for earlier detail.

## [2.6.1] - 2026-06-25

### Fixed

- **PR review now fans out five subagents in parallel, one per lens.** The
  standalone mode gained an explicit *Dispatch contract* — a single combined
  subagent is called out as a defect — fixing the case where only one subagent ran.
- **The review checklist is now catalogue-complete.** The curated subset of ids is
  replaced by a methodical per-lens procedure scoped to a region of the
  `cosmic-python` standard: each lens traverses **every** `PR-*`/`BP-*`/`AP-*` in
  its region plus the matching SKILL sections, so coverage is complete by
  construction and survives catalogue growth. The `code-reviewer` agent is hardened
  to run exactly one lens and refuse a combined pass.

## [2.6.0] - 2026-06-25

### Added

- **Two-mode, five-lens PR review.** `meaningfy-code-review` now defines two
  review modes — **standalone** (the read-only analysis, run as five single-lens
  subagent passes and aggregated) and **interactive** (a thinking-partner protocol
  in the main thread, entered when the developer discusses the PR) — with an
  always-subagent isolation rule that keeps review reasoning out of the
  implementation context.
- **Five review lenses**, one subagent run each, as MECE views over the existing
  checklist: L1 Security & safety, L2 Spec-correctness & tests, L3 Architecture
  conformance, L4 Principles & clean code, L5 Fit, elegance & refactoring. Lenses
  anchor to existing `cosmic-python` catalogue ids — no new ids minted.
- **Fit & refactoring investigation** (lens L5, recommendations-only): assesses how
  new code and the existing code it touches could be refactored for a crisper fit,
  with `gitnexus` blast radius on each candidate.
- New `pr-review-modes` capability spec synced into `openspec/specs/`.

### Changed

- `code-reviewer` agent scoped to **one lens per subagent run** (lens input;
  default dispatches all five), staying read-only and isolated from implementation
  context.

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
