# Acceptance record: harden-checks-and-tests

## Scenario sign-off (task 1.0)

- **What was signed off:** the spec scenarios of this change, in `specs/quality-checks`,
  `specs/code-principles-governance`, `specs/catalogue-governance`, `specs/epic-delivery`,
  `specs/pr-review-modes` and `specs/test-strategy`, as merged into `develop` with the gated PLAN
  (PR #220, commit f966528).
- **Who:** the developer (the repository owner).
- **When:** 2026-11-14.
- **Verdict, in the developer's words:** "yes i accept everything", in answer to the lead's note
  that task 1.0 needed the sign-off of these scenarios.

Delivery had not started when this was recorded; it starts at task 1.1.

## The two open proposals of task 1.0

- **When:** 2026-11-15, at the start of the stage 1 tool side.
- **D-26:** confirmed, with the type named "Quality check" (design D-36).
- **D-24:** confirmed: stage 3 runs the old and the new tester brief once each and compares them.

## Re-sign-off after the tool side (PR #253)

- **When:** 2026-11-15, after the tool side merged (PR #246).
- **What:** the requirement renamed *A quality check is an executable rule and carries no rule
  text* (`catalogue-governance`), and five new scenarios of `quality-checks`: a `.yml` rule file;
  an external-source entry that would write outside its folder; a file-wide `noqa` without a
  reason; a network call in a unit test; the same call in an integration test.
- **Verdict:** the developer chose "Sign off all".
