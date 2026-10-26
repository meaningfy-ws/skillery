# PLAN (design half) — Catalogue UX, role-bundle reorg & docs onboarding

> Parent: EPIC "Catalogue UX, role-bundle reorg & docs onboarding" (proposal.md in this change)

## Context

Post-Skillery-v2 front-door clean-up. Brainstormed (see git history of this branch); the original
`superpowers` design/plan in `docs/superpowers/` are superseded by this change (the dogfood
relocation).

## Goals / Non-Goals

**Goals:** legible role bundles, no overlay; a flat skill layout; an onboarding README; spine glossed;
superpowers bound to the spine.

**Non-Goals:** the AsciiDoc/Pages migration (deferred); re-litigating skill content.

## Decisions

See proposal.md DEC-1…DEC-8. The duplication risk of role bundles is removed by extracting
cross-cutting skills to `meaningfy-core` (so 1:1 ownership survives — the validator stays simple).

## Algorithm / approach

Role map: core{technical-writing, meaningfy-git-workflow, guardrails} · consulting{coach,
decision-package, proposal-writing, estimation, executive-communication} · architecture{architecture,
conceptual-modelling} · building{epic-planning, spec-stewardship, clarity-gate, bdd-gherkin,
meaningfy-code-review, cosmic-python, project-setup, ci-cd-delivery}.

### Anti-patterns
- ❌ A persona "overlay" bundle re-listing other bundles' skills (the old meaningfy-spine smell).
- ❌ A parallel `docs/superpowers/` spec/plan tree beside the spine.
- ❌ Renaming "spine" repo-wide (gloss instead).

## Error matrix

| Failure mode | Expected handling |
|---|---|
| flatten breaks inter-skill / skill→root links | depth-aware sed; `make validate` broken_links must be 0 |
| a skill lands in two bundles | validator `expected_bundle_membership` flags it |

## Risks / Trade-offs

- [Binding is soft enforcement] → Mitigation: documented in 3 entry points; fork is the recorded fallback.

## Open Questions

- HQ-UX.1 (AsciiDoc/Antora/Pages migration) — parked in `.claude/HARD-QUESTIONS.md`.
