# Kinds of waste

Every piece of evidence in a row is required. The class says how much a proposal can lose.
Checklist rules are `cosmic-python`'s testing checklist, cited by number; their sources stand in
its Sources table.

| Id | Waste | Evidence | Class |
|---|---|---|---|
| W-1 | Set-up repeated for every test | A fixture among the ten with the largest summed set-up time; and a reading of the fixture and of every test using it that sorts what it builds into "no test changes it" and "tests change it" | 1 |
| W-2 | A test in a lane its cost does not fit | Set-up plus call over the project's `slow` threshold, with no `slow` marker (rule 20) | 1 |
| W-3 | Parametrised cases that test the same thing | `identical_cases`; the cases expect the same outcome and differ only by values of one equivalence class; none is a case rule 8 or a Scenario Outline's boundary row requires | 2 |
| W-4 | A test contained in another | `contained`; both tests at `high` for the same scenario; every assertion of the test is also made by the survivor | 3 |
| W-5 | One behaviour proven at two tiers | A higher-tier test at `high` for a scenario a lower-tier test serves at `high`; and the higher test runs nothing real that the lower one fakes | 3 |
| W-6 | A test that runs nothing | Listed in `no_lines`, and the code it calls is not under the `omit` setting of the project's coverage configuration (read it) | 3 |
| W-7 | An adversarial test that never found a defect | Its file is named by stage (rule 21), and no fix commit, delivery log or decision names the test | 3 |
| W-8 | A test that kills no mutant of its own | A local mutation run's per-test results; without them, list W-8 under *Not measured* | 3 |

- The project has no `slow` marker: W-2 is not looked for; propose, as class 1, adding the marker
  with a threshold read from run A.
- Tests change everything a costly fixture builds: no W-1 proposal; the report says why.
- A broken checklist rule is not waste: list it under *Broken rules* by its number.
