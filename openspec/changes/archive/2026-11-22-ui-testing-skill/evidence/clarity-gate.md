# Clarity gate log

Inline by the lead (P-0006, MEDIUM), over `design.md` + `tasks.md`.

- run 1, 2026-11-22, 8/10, fail. Gaps: (1) CHK-147/148 may collide with ids minted by the open
  `activity-test-profiles` change; (2) the accepted-findings file had no fixed extension
  (`a11y-accepted.*`); (3) task 1.5 named no test file.
- run 2, 2026-11-22, 9/10, pass. Read only the three gaps: D-7 now takes the next free ids on a
  collision; D-5 fixes `tests/e2e/a11y-accepted.json`; task 1.5 names `tests/test_ui_testing_rows.py`.

No gap accepted; no `DEC-` added for the gate.

Scenario sign-off: the developer, 2026-11-22, "Signed off". At sign-off the developer changed D-6:
the Playwright language follows the project ("this depends on the project if it is python or TS").
D-6, RISK-3, task 2.1 and the `lean-project-templates` delta were revised to match. The change is
scoped to D-6 and was not gated again.
