# Seed: activity test profiles (EPIC C)

**Secondary input, never groomed.** Seeded 2026-11-13; parked until A (`test-strategy`) and B
(`harden-checks-and-tests`) are delivered. Source: the owner's conversation recorded in
`../../test-strategy/inputs/seed.md` and `../../harden-checks-and-tests/inputs/qa.md`.

## Intent

Fill the `test-strategy` matrix for the activity families other than software: for each, how the
work succeeds and how it fails, which question each check answers, the technique, the tool, the
moment and the owner. Gaps found by A's inventory are the input.

## Families and the candidates raised so far

| Family | Candidates (not decided) |
|---|---|
| Documentation | **Vale** with hand-picked external styles (moved here from B, Q-16); ls-lint for docs folder and file names; cold reader and docs gate already exist |
| DevOps | ls-lint and checkmake on the stacks repositories' layout and Makefiles; plan review by `infra-reviewer` already exists |
| UI design | accessibility checks (the testing checklist names one per scenario page); design critique |
| Shaping | the test-scenario interview also asks **which invariants must hold** (they become the tester's Hypothesis properties); the PLAN's error matrix becomes the tester's targets |
| Modelling | competency questions and validated examples already act as tests; LinkML quality gates |
| Architecture | ADR Confirmation as fitness functions; the walkthrough; formal methods (TLA+, Alloy) as parked, design-time options |

## Open

- One EPIC or one per family (may exceed LARGE).
- Whether Vale's external styles are picked here or in a docs-only EPIC.
