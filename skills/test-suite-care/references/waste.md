# Kinds of waste

Every piece of evidence in a row is required. The class says how much a proposal can lose.
Checklist rules are `cosmic-python`'s testing checklist, cited by number; their sources stand in
its Sources table.

| Id | Waste | Evidence | Class |
|---|---|---|---|
| W-1 | Set-up repeated for every test | A fixture among the ten with the largest summed set-up time; a reading of the fixture and of every test using it that sorts what it builds into "no test changes it" and "tests change it"; and the time of each part, measured (a profile or a timer per part), never estimated by reading | 1 |
| W-2 | A test in a lane its cost does not fit | Set-up plus call over the project's `slow` threshold, with no `slow` marker (rule 20), confirmed alone (`measuring.md`) | 1 |
| W-3 | Parametrised cases that test the same thing | `identical_cases`; the cases expect the same outcome and differ only by values of one equivalence class; none is a case rule 8 or a Scenario Outline's boundary row requires | 2 |
| W-4 | A test contained in another | `contained`; both tests at `high` for the same scenario; every assertion of the test is also made by the survivor | 3 |
| W-5 | One behaviour proven at two tiers | A higher-tier test at `high` for a scenario a lower-tier test serves at `high`; and the higher test runs nothing real that the lower one fakes. A test whose outcome is read from the real store, adapter or service is never W-5 | 3 |
| W-6 | A test that runs nothing | Listed in `no_lines`, and the code it calls is not under the `omit` setting of the project's coverage configuration (read it) | 3 |
| W-7 | An adversarial test that never found a defect | Its file is named by stage (rule 21); no commit touched both the test and production code; and its docstring records no defect it found. Without that docstring convention, W-7 also needs W-8's evidence | 3 |
| W-8 | A test that kills no mutant of its own | A mutation run's results by the method of `measuring.md` (*Mutation*); without them, list W-8 under *Not measured* | 3 |

- The project has no `slow` marker: W-2 is not looked for; propose, as class 1, adding the marker
  with a threshold read from run A.
- Tests change everything a costly fixture builds: no W-1 proposal; the report says why.
- **W-1, what saves time:** sharing a whole fixture among tests that only read it saves most of
  its cost; sharing "the unchanging part" saves nothing when the per-test writes dominate. The
  measured parts say which.
- **W-3, identical lines are a hint:** generated validators, one function with several loops and
  two branches of one condition cover the same lines and are different classes. The survivor of a
  group is the case that fails under the group's mutation (a mutation run of the touched module),
  never "the first N". A rule table keeps one negative row per rule and a test that every rule has
  a row. Where a mutation run covers the layer, its unchanged surviving set is the acceptance.
- **W-4, narrow before reading:** read only `contained` pairs that the map already puts at `high`
  on the same scenario; most are refuted on reading. In a layer that mutation covers, prefer W-8's
  evidence.
- **A move keeps the guard.** A class 1 proposal that moves a test to another lane or tier names
  the lane that still runs it in CI and what it still proves. A lane CI does not run guards
  nothing; a rewrite under rule 12 keeps the bound that was the test's point.
- A broken checklist rule is not waste: list it under *Broken rules* by its number, with one
  decided fix.
