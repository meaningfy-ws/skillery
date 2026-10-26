# Batch E: one-way Related links

Task 2.2, rule D-9. The `reciprocal_related_report` advisory of `python -m tools.repo_lint` listed
20 one-way `**Related:**` pairs at the start of the batch. Each pair "A → B" means A lists B as
Related and B does not list A back. Each was resolved in the `## Boundary & Related Skills` section
only: either B gained A on its `**Related:**` line, or A's mention moved out of its `**Related:**`
paragraph into a "see also" sentence (or an existing Owns/Delegates sentence already said it), which
keeps the link one-way by design. No name was added to a `**Delegates:**` line.

After the edits the advisory lists no pairs: 9 pairs are now reciprocal, 11 are one-way by design.
No model was run.

| Item | Posture | Change | Eval | Model | Runs | Before | After | Cost | Verdict |
|------|---------|--------|------|-------|------|--------|-------|------|---------|
| bdd-gherkin → architecture | reusable | return link added to architecture | reciprocal_related_report | none | 0 | one-way | reciprocal | $0 | kept |
| ci-cd-delivery → project-setup | precise | return link added to project-setup | reciprocal_related_report | none | 0 | one-way | reciprocal | $0 | kept |
| conceptual-modelling → architecture | precise | return link added to architecture | reciprocal_related_report | none | 0 | one-way | reciprocal | $0 | kept |
| decision-package → architecture | profiled | one-way kept: architecture is a downstream hand-off, and a reusable skill gains no consulting wording; "see also" sentence in decision-package | reciprocal_related_report | none | 0 | one-way | one-way (justified) | $0 | kept |
| decision-package → conceptual-modelling | profiled | one-way kept: the model sketch is a hand-off; a product modeller does not need the consulting deliverable; "see also" sentence in decision-package | reciprocal_related_report | none | 0 | one-way | one-way (justified) | $0 | kept |
| epic-planning → explanatory-writing | reusable | one-way kept: an explainer writer does not need EPIC authoring; the existing Delegates sentence in epic-planning already names it for texture | reciprocal_related_report | none | 0 | one-way | one-way (justified) | $0 | kept |
| estimation → decision-package | reusable | return link added to decision-package | reciprocal_related_report | none | 0 | one-way | reciprocal | $0 | kept |
| estimation → epic-planning | reusable | one-way kept: shaping an EPIC needs no estimate; "see also" sentence in estimation | reciprocal_related_report | none | 0 | one-way | one-way (justified) | $0 | kept |
| executive-communication → clarity-gate | profiled | one-way kept: the gate judges readiness, not persuasion; "see also" sentence in executive-communication | reciprocal_related_report | none | 0 | one-way | one-way (justified) | $0 | kept |
| executive-communication → technical-writing | profiled | return link added to technical-writing | reciprocal_related_report | none | 0 | one-way | reciprocal | $0 | kept |
| explanatory-writing → clarity-gate | reusable | one-way kept: the gate does not need prose texture; the existing "Does NOT own" sentence in explanatory-writing already names it | reciprocal_related_report | none | 0 | one-way | one-way (justified) | $0 | kept |
| linkml-engineering → architecture | precise | return link added to architecture | reciprocal_related_report | none | 0 | one-way | reciprocal | $0 | kept |
| linkml-engineering → project-setup | precise | return link added to project-setup | reciprocal_related_report | none | 0 | one-way | reciprocal | $0 | kept |
| meaningfy-release → project-setup | precise | return link added to project-setup | reciprocal_related_report | none | 0 | one-way | reciprocal | $0 | kept |
| modelling-conventions → architecture | reusable | one-way kept: architecture works at system level, above a domain model; "see also" sentence in modelling-conventions | reciprocal_related_report | none | 0 | one-way | one-way (justified) | $0 | kept |
| modelling-conventions → cosmic-python | reusable | one-way kept: an analogy (same reuse-layer pattern), not a shared task; "see also" sentence in modelling-conventions | reciprocal_related_report | none | 0 | one-way | one-way (justified) | $0 | kept |
| proposal-writing → decision-package | profiled | return link added to decision-package | reciprocal_related_report | none | 0 | one-way | reciprocal | $0 | kept |
| semantic-consulting-coach → estimation | precise | one-way kept: an estimator does not need the coaching frame; the existing Delegates sentence in the coach already names it | reciprocal_related_report | none | 0 | one-way | one-way (justified) | $0 | kept |
| vault-project → epic-planning | precise | one-way kept: a disambiguation (a software EPIC is not a vault project); "see also" sentence in vault-project | reciprocal_related_report | none | 0 | one-way | one-way (justified) | $0 | kept |
| vault-setup → project-setup | precise | one-way kept: a disambiguation (a vault is not a code repository); "see also" sentence in vault-setup | reciprocal_related_report | none | 0 | one-way | one-way (justified) | $0 | kept |
