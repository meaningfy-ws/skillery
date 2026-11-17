# Deviations from the EPIC at archive (2026-11-17)

What was built differs from `proposal.md` in these ways. Each has its decision.

| Deviation | Reason | Decision |
|---|---|---|
| Stage 2 (UI suites) not delivered | No trial repository named, and the UI rules have no owner (issue #230) | D-43 |
| Stage 3 (checks that are not code) not delivered; its requirement, its cross-cutting matrix row and its trigger are dropped | Owner: "skip stage 3, enough improvements for now" | D-73 |
| The rule-11 sentence (one assert per idea applies to unit and feature tests) not built | It belonged to stage 2 | D-73 |
| The trial ran as the trial repository's own change, with one pull request, not as task 1.11's separate pull requests | That repository delivered the audit and its proposals as one change | D-64 |
| The owner waived the sample check of the map in the trial | Owner's choice; the skill now has a path for a waived sample | D-64, D-66 |
| Slow tests still run in CI on every pull request; no scheduled run is added | Owner's confirmation of OQ-3 | D-10, `evidence/acceptance.md` |
| The trial's feedback (issues #307 to #319) was added to stage 1 as tasks 1.14 to 1.16 | Owner: "consider them in these next phases" | D-66 |
| The programme's closing check is not run here | Handed over to `harden-checks-and-tests` | D-45 |
