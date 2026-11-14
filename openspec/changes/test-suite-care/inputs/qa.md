# Q&A record: test suite care (EPIC E)

**Secondary input, never groomed.** The owner's answers of 2026-11-14.

| # | Question | Answer |
|---|---|---|
| Q-1 | How is the work packaged? | A new EPIC E with one skill that owns the audit-and-reduce procedure. Not chosen: a fourth stage of B; checklist rules only. |
| Q-2 | How is a reduction tied to the specified features? | The audit builds the map: each test goes to the spec scenario it serves, or to "serves none", stored as a file; a test is merged or dropped only if its scenario stays covered. Not chosen: tagging every test by hand; coverage and mutation only. |
| Q-3 | What happens to a stage's adversarial tests when the stage ends? | They are distilled: keep the ones that found a defect or are the only cover of a scenario, move them into files named by feature, drop the rest with a recorded reason. Not chosen: keep all and run nightly; leave as is. |
| Q-4 | What is the acceptance proof on `rdf-persistence`? | The owner, in their own words: "well this will require a judgement every time, maybe it will not be possible to cut time, so a judgement and a discussion is required". No time target. |

## Proposed by the shaper, not yet confirmed by the owner

- The skill's name, `test-suite-care`, and its bundle, `meaningfy-building`.
- The first version covers Python suites run by pytest. The owner said "tests (of all sorts)";
  front-end suites and the non-code checks of EPICs C and D are left out (No-gos).
- The lanes of `rdf-persistence` become the catalogue's pattern (DEC-6).
- Reductions land as small pull requests the owner reviews; the skill deletes nothing itself (DEC-5).
- The proof on `rdf-persistence` (DEC-8), the row and the order against B (DEC-9), and reading
  "best practices of test creation" as the testing checklist (DEC-10).
