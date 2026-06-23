# EPIC: Catalogue UX, role-bundle reorg & docs onboarding

> Dogfood record — skillery shaped this change through its own spine (the design/plan that the
> `superpowers` flow first wrote to `docs/superpowers/` were relocated here). Supersedes those files.

## Appetite

Small–medium. A front-door / governance clean-up, not new capability.

## Why

The catalogue's front door was hard to read: a confusing `meaningfy-spine` meta-bundle, blurred
`ai-coding`/`engineering` bundles, and a README with no installation, getting-started, conflict, or
docs guidance. Root cause: bundles served two axes at once (phase map vs install persona).

## Solution outline

Reorganise bundles by **role** with a small `core` so every skill has exactly one home; flatten the
disk layout; rewrite the README onboarding; gloss "spine" / drop "dogfood"; and bind the external
`superpowers` method skills to the spine instead of a parallel spec tree. Publish the durable canon
to AsciiDoc/Pages later (deferred).

## Key decisions

- **DEC-1**: Bundles are organised by **role** (`core`/`consulting`/`architecture`/`building`), not phase.
- **DEC-2**: A small `meaningfy-core` holds cross-cutting skills → every skill in exactly one bundle (no overlays).
- **DEC-3**: Remove `meaningfy-spine` + `meaningfy-communication`; the spine is a *capability + projected assets*, not a bundle.
- **DEC-4**: Flat `skills/<skill>/` layout; bundles group only in `marketplace.json`.
- **DEC-5**: Keep "spine" + gloss it; drop "dogfood" jargon from published docs.
- **DEC-6**: README gains Installation, Getting-started (agents-vs-skills + epic-loop walkthrough), Uninstall & conflicts, Documentation map.
- **DEC-7**: AsciiDoc + Antora + GitHub Pages migration of the durable canon → deferred follow-up EPIC.
- **DEC-8**: Bind `superpowers` artifacts to the spine (A+B), fork only as fallback; skillery dogfoods its own spine.

## Rabbit-holes

- Forking superpowers wholesale (rejected — maintenance tax; binding first).
- Renaming "spine" everywhere (rejected — gloss instead).

## No-gos

- No change to the EPIC-02…10 skill *content* (only bundle membership + paths move).
- No AsciiDoc/Pages migration in this change (deferred).
- No parallel `docs/superpowers/` spec/plan tree.

---

## What Changes

- `marketplace.json` re-cut to 4 role bundles (version 2.2.0); `skills/` flattened.
- Validator `EXPECTED_BUNDLES` = 4 roles, `META_BUNDLES` removed.
- README rewritten; `environment-setup`/`CONTRIBUTING`/`global-prompt`/scaffold updated.
- "spine" glossed, "dogfood" dropped; `spine/meaningfy-spine.md` rewritten (spine = capability+assets).
- Binding: `superpowers` artifacts land in the spine; `spine/workflows.md` gains the verb↔artifact map.

## Capabilities

### New Capabilities

### Modified Capabilities

## Impact

Docs/config/validator only — no runtime behaviour. The golden thread now covers skillery's own
catalogue-governance changes.
