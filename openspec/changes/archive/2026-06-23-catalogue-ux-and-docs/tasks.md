# PLAN (tasks half) — Catalogue UX, role-bundle reorg & docs onboarding

> Derived from EPIC "Catalogue UX, role-bundle reorg & docs onboarding"

## 1. Bundle reorg

- [x] 1.1 Flatten `skills/<skill>/`; re-cut marketplace to 4 role bundles (v2.2.0)
- [x] 1.2 Validator: `EXPECTED_BUNDLES` = 4 roles; remove `META_BUNDLES`; fix tests
- [x] 1.3 Fix inter-skill / skill→root / docs→skill link depths after the flatten

## 2. Terminology

- [x] 2.1 Gloss "spine" at entry points; replace "dogfood" jargon in published docs

## 3. README + ripple

- [x] 3.1 Rewrite README (install, getting-started + epic-loop, uninstall/conflicts, docs map)
- [x] 3.2 Update environment-setup / CONTRIBUTING / global-prompt / scaffold to 4 bundles
- [x] 3.3 Rewrite `spine/meaningfy-spine.md` (spine = capability + assets, not a bundle)

## 4. superpowers ↔ spine binding (A+B)

- [x] 4.1 Binding in root CLAUDE.md + global-prompt + project-setup scaffold
- [x] 4.2 `spine/workflows.md` verb↔artifact map
- [x] 4.3 Self-dogfood: relocate the `docs/superpowers/` design+plan into this change

## 5. Deferred / archive

- [x] 5.1 Log AsciiDoc+Antora+Pages migration as HQ-UX.1
- [x] 5.2 Archive the `.claude/` Skillery-v2 planning record into the spine

## Roadmap

- [x] 1.1 · [x] 1.2 · [x] 1.3 · [x] 2.1 · [x] 3.1 · [x] 3.2 · [x] 3.3 · [x] 4.1 · [x] 4.2 · [x] 4.3 · [x] 5.1 · [x] 5.2

## Verification

`make validate` + `make validate-spine` green; README lists every skill; no `docs/superpowers/`
parallel tree; the `.claude/` planning record lives under `openspec/changes/archive/`.
