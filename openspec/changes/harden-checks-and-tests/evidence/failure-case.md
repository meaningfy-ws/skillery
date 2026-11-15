# Failure case: harden-checks-and-tests

The two failures this change is written against (task 1.2, design D-13). Each is the acceptance
test of the part that fixes it.

## 1. The adversarial tester has no method

- **Seen by:** the owner, answering Q-2 on 2026-11-13 ([`inputs/qa.md`](../inputs/qa.md)).
- **In the owner's words:** "i have noticed something being called adversarial testing but it was
  just an implementer with extra prompts, so we shall keep that one, but we need support that one
  with additional proper methods".
- **Why it happens:** the tester brief in `epic-delivery` (`references/team-and-briefs.md`,
  *Adversarial tester*) names targets ("edge cases, bad input, failures, limits") and no method,
  and its report asks for no properties.
- **Fixed by:** stage 2 (the brief, its report and checklist item 10). **Shown fixed by:** proof 2
  of DEC-15, the stage 3 tester report, with the comparison of the old and the new brief (D-24,
  confirmed in D-36).

## 2. A catalogued rule passed review unflagged

- **Where:** `skills/service-reliability/scripts/decide_action.py`, the `except Exception` in
  `main`, added in commit 33211bd and merged with PR #112 (the `meaningfy-devops` bundle), which
  went through the pre-PR review.
- **What:** a blind `except Exception`. The rule is in the catalogue's hygiene cases (issue #215,
  DEC-3), but nothing checks it: Ruff's `BLE001` is not in the template's selection, and no
  reviewer flagged it. The same shape is in `skills/stack-operations/scripts/check_stack.py`
  (line 150).
- **Note:** the line carries a comment giving its reason ("unreadable policy or facts: the
  caller parks"). A blind catch can be right; the failure is that nothing asked for the reason. With
  `BLE001` selected and the suppression rule of D-6, the line must read
  `# noqa: BLE001 -- <reason>` or be narrowed.
- **Reproduce:** `ruff check --isolated --select BLE001 skills/service-reliability/scripts/` with
  Ruff 0.17.5 prints `decide_action.py:56:12: BLE001 Do not catch blind exception: Exception`.
- **Fixed by:** stage 1 (the Ruff selection of D-2 and the suppression rule of D-6), in projects
  scaffolded by `project-setup`. skillery's own code is not checked (proposal No-gos), so these
  two lines stay as they are.
- **Shown fixed by:** proof 1 of DEC-15 (`tests/test_quality.py`, TC-13 on the Ruff fixtures) and
  IT-04 on a scaffold.
