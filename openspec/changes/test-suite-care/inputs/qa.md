# Q&A record: test suite care (EPIC E)

**Secondary input, never groomed.** The owner's answers of 2026-11-14.

| # | Question | Answer |
|---|---|---|
| Q-1 | How is the work packaged? | A new EPIC E with one skill that owns the audit-and-reduce procedure. Not chosen: a fourth stage of B; checklist rules only. |
| Q-2 | How is a reduction tied to the specified features? | The audit builds the map: each test goes to the spec scenario it serves, or to "serves none", stored as a file; a test is merged or dropped only if its scenario stays covered. Not chosen: tagging every test by hand; coverage and mutation only. |
| Q-3 | What happens to a stage's adversarial tests when the stage ends? | They are distilled: keep the ones that found a defect or are the only cover of a scenario, move them into files named by feature, drop the rest with a recorded reason. Not chosen: keep all and run nightly; leave as is. |
| Q-4 | What is the acceptance proof on `rdf-persistence`? | The owner, in their own words: "well this will require a judgement every time, maybe it will not be possible to cut time, so a judgement and a discussion is required". No time target. |

## Round 2: the owner's answers to the shaper's proposals (2026-11-14)

| # | Proposal | Answer |
|---|---|---|
| Q-5 | The name `test-suite-care`, in `meaningfy-building`. | "okay naming" |
| Q-6 | First version covers pytest suites only. | "lets include also beyond unit tests, lets include gherkin, and integration, and ui tests like cypress, we could also have a test for non-code test-heuristics being assessed how good and reliable it is for the project and for the task?" |
| Q-7 | The skill never deletes on its own; reductions land as small pull requests. | "yes" |
| Q-8 | The proof is on `rdf-persistence`. | "why is rdf-persistence mentioned, it is okay to use this repo as a playground and assess how well this new skill would act upon, but the new skill must be in skillery and stay reusable across any repo" |
| Q-9 | "Best practices" means the testing checklist. | "not only, but also look around, or make up such a list or design patterns or rules, and yes a broken rule is an audit finding" |
| Q-10 | One row for the audit in A's matrix; the lanes named as moments. | "fine" |

## Still the shaper's, not confirmed by the owner

- The appetite moved from LARGE to VERY LARGE, cut into three stages (Python suites; UI suites;
  checks that are not code).
- The lanes of `rdf-persistence` become the catalogue's pattern (DEC-6).
- How a non-code check is assessed: a planted flaw, a repeated run, cost against findings (DEC-11).
- Stage 3 waits for the checks of C or D.
