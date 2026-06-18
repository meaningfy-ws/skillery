# The `meaningfy-spine` meta-bundle (contents)

This file **defines** the `meaningfy-spine` meta-bundle. EPIC-04 (PLAN-04 T3) is
the **sole editor** of [`../.claude-plugin/marketplace.json`](../.claude-plugin/marketplace.json)
and folds this bundle into the single re-cut — this EPIC does not edit that file
(avoids the one-commit-ownership clash).

## Purpose

A meta-bundle that installs the spine: the durable-spec backbone plus the skills
that drive its lifecycle. It is the "reliable product development as a thread"
distribution — the keystone deliverable, not more islands.

## Contents

The `meaningfy-spine` bundle bundles (by reference):

- **The spine assets** (this `spine/` directory + the `openspec/schemas/meaningfy/`
  fork + `openspec/config.yaml`) — projected into target repos by `project-setup`
  (EPIC-09), not installed as a skill.
- **The lifecycle-driving skills** already in other phase bundles, surfaced here
  as the spine's working set:
  - [`epic-planning`](../skills/ai-coding/epic-planning) — shapes the EPIC + derives the PLAN
  - [`clarity-gate`](../skills/ai-coding/clarity-gate) — the semantic gate on the PLAN
  - [`bdd-gherkin`](../skills/ai-coding/bdd-gherkin) — executable acceptance off the specs
  - [`meaningfy-code-review`](../skills/ai-coding/meaningfy-code-review) — the verify step
  - [`cosmic-python`](../skills/engineering/cosmic-python) — layering for `apply`

## Note for EPIC-04

- A skill may appear in both its phase bundle and the `meaningfy-spine`
  meta-bundle. The validator's `EXPECTED_BUNDLES` placement check must allow the
  meta-bundle to reference skills owned by phase bundles (i.e. treat
  `meaningfy-spine` as a curated overlay, not an exclusive owner). Resolve this
  when re-cutting `EXPECTED_BUNDLES` in `tools/repo_lint/lint.py`.
- External dependency: **OpenSpec becomes mandatory** — flag the
  `docs/environment-setup.md` dependency row and the install command for the
  pinned version in [`openspec-version.txt`](openspec-version.txt).
