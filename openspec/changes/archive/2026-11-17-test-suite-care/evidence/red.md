# Red run (task 1.1)

`tests/test_test_suite_care.py` before any implementation: 10 failed, 16 errors, 2 skipped.

| Test | Fails because |
|---|---|
| T-1 `test_phase_times_writes_fixture_and_phase_lines` | `-p phase_times`: the plugin module does not exist |
| T-2 `test_phase_times_under_xdist_writes_each_line_once` | skipped: xdist not installed (runs once by hand, task 1.2) |
| T-3 to T-6 `test_overlap_*` | `overlap.py` does not exist (exit 2 from Python, no JSON) |
| T-7 `test_overlap_on_a_real_branch_coverage_run` | skipped: coverage not installed (runs once by hand, task 1.2) |
| T-8 `test_changed_lane_*` (16 cases) | error in the fixture: `assets/templates/tests/changed.py` does not exist |
| T-9 `test_scaffold_has_the_lanes` | the scaffold renders no `tests/changed.py` |
| T-10 `test_skill_names_no_repository_path_or_pin` | `skills/test-suite-care/SKILL.md` does not exist |
| T-11 `test_waste_rows_checklist_rules_and_cited_numbers` | `references/waste.md` does not exist; the checklist has 16 rules |
| T-12 `test_distilling_in_epic_delivery` | the tester brief names neither report field |
| T-15 `test_strategy_rows_rule_count_and_gherkin_box` | no `ADQ` row owned by `test-suite-care`; "rules 1-16" stands |
