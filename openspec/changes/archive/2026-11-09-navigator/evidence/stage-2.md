# Stage 2 — evidence

Gates at merge: `make validate` green (132 mod tests, lint, Python tests), `openspec validate
navigator --strict` valid, `claude plugin validate bundles/meaningfy-navigator` passed.

Challenge (DD-33's set again): reviewer A (L1+L2), reviewer B (L3–L5), adversarial tester (39 mod
tests, 11 failing; 8 lint tests, 4 failing), then a fresh checker (41 items met; three doc
imprecisions fixed before merge). Every finding accepted or rejected in DD-38. A folder-structure
walkthrough kept the layout and added three tidy-ups (DD-38.9).

Open, by hand: task 2.11 (desktop rerun, scenario 3); H-6 (a button's command appears in the
transcript as typed, which confirms `$.prompt.submit` over `$.command.run`); the stage-1 checks of
tasks 1.7, 1.9 and 1.11. Deferred by the PLAN to stage 3: the *Reconcile EPIC* and *Review* actions
(task 3.7) that two scenarios of *Actions are commands* name.
