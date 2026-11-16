# Acceptance: lean-skills

**Verdict: accepted** by the developer (owner), 2026-11-16, in the delivery session.

Appetite VERY LARGE, so the demo was mandatory. What was shown, measured on `develop` plus the
closing branch against the EPIC's four success checks (DEC-9):

1. **Budget enforced.** 52 skills; 47 within 24 KB, 5 under a recorded `over_budget` exception
   (`test-strategy` 87 KB, `sales-pipeline-custody` 37, `epic-delivery` 33,
   `infrastructure-operations` 32, `semantic-consulting-coach` 32). The 48 budget and pointer tests
   of `tests/test_repo_lint_negative.py` pass; `make validate` fails a skill over budget without an
   exception.
2. **Second reader.** Every rewritten skill has an assessment record in `evidence/` with a fresh
   reader's verdict; eight lost rules were found and restored (design D-16, D-22 to D-24).
3. **Gates green.** `make validate`, `make validate-spine` and CI green at every merge (#249, #271,
   #278, #284, #288, #289); no description changed.
4. **Total prose** of `skills/` 0.89 MiB, under 1 MB, from 1.30 MiB
   ([`size-after-stage-5.md`](size-after-stage-5.md)).

The lead's decisions taken alone on the owner's instruction (D-17, D-18, D-22 to D-25) stand with
this acceptance.
