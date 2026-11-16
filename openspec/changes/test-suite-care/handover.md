# Hand-over: test-suite-care, after the stage 1 build

## Done
Stage 1 tasks 1.0 to 1.10, PR #298 (merged by the watch-and-merge command after this note): the
`test-suite-care` skill with its two scripts and report template, testing checklist rules 17 to
21 and the Sources table, the `bdd-gherkin` box, `CHK-145`, the developer lanes in
`project-setup`, the distilling in `epic-delivery`. Owner sign-off of OQ-3: "Confirm"
(`evidence/acceptance.md`). Probes 3/3 positive, 0/3 near-misses (`evidence/triggers.md`).

## Decided since the PLAN
D-55 to D-63 (design.md, end of Delivery decisions), for the owner's validation. Most important:
D-55, run B needs `COVERAGE_CORE=ctrace` (on Python 3.14 the default core loses per-test lines
silently); D-61 to D-63, the three findings the lead re-labelled Critical and fixed.

## Open
- The checker's one unmet item, the deleted tests named in the PR, was met afterwards by
  `evidence/tester-sort.md`; 58 of them are listed by what they attacked, not by name (the
  untracked file was deleted first). Next time the builder writes the list before deleting.
- Under the floor, candidates for the trial's follow-up PR (task 1.13): `overlap.py` printing the
  ten costliest files and fixtures (L5 S6); clear errors on a missing or malformed data or phases
  file (tester 1 to 4); `make test-changed` splitting a path with a space (L1 W1); the audited
  command's own report files (`coverage.xml`) landing in the repository during run B (L1 W2); the
  fixture bullet of `SKILL.md` restating checklist rule 6 (L3 W1, L5 W1).
- At archive: the `code-principles-governance` delta's sentence on rule 11 belongs to deferred
  stage 2 (L2 W3).
- checkmake was not run on the new Makefile targets (no local binary).
- The "write tests for this function" probe loaded no skill in 3 runs (`cosmic-python`'s trigger).

## Paused (2026-11-16)
Released in 3.19.0 (PR #300, back-merge #301); the how-to is
`docs/practice/ai-coding/test-suite-audit.md` (PR #299). The owner keeps the change open: no
split, no archive. The trial waits until the owner says work on `rdf-persistence` is finished;
start nothing in it before then. Stage 3 still waits for wave 4.

## Next
Task 1.11, the trial on the trial repository named in D-14, then 1.12 (the acceptance demo with
the owner) and 1.13. Read first: tasks.md 1.11 to 1.13, design.md D-2, D-5 to D-7, D-14, D-55,
`skills/test-suite-care/` (all of it). Run A and run B on an idle machine; build the map with one
subagent per test folder; open the pull request there with the map and the report.

## Prompt
Act as the team lead. Deliver tasks 1.11 to 1.13 of openspec/changes/test-suite-care (the trial
on the trial repository of D-14, the acceptance demo with me, the approved proposals) from
handover.md. New worktree in the trial repository off its develop; merge only on green CI.
