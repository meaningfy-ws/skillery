# The sort of the stage 1 tester's tests (fix pass, D-61 to D-63)

The tester wrote 65 tests (28 on `overlap.py`, 11 on `phase_times.py`, 26 on `changed.py`); 7
failed on their first run. The fix pass's builder sorted them by the rule of `epic-delivery`
(`references/stage-loop.md`, step 4); the lead confirmed both lists.

The tester's file was untracked and deleted in the pass, so the 58 tests that passed first are
listed by what each attacked, as the tester reported them; their exact function names were not
kept. Lesson for the next stage: the builder writes the deleted list with names before deleting.

## Kept (moved to `tests/test_test_suite_care.py`)

| Test | Reason |
|---|---|
| `test_changed_lane_non_ascii_path_is_not_dropped` (2 cases: a changed `pkg/services/café.py`, an untracked `tests/unit/services/test_é.py`) | Failed first; finding accepted (D-61) |
| `test_phase_times_failing_test_is_recorded_and_the_run_continues` | Sole cover of the error-matrix row "a test fails or is flaky during a run" |

## Deleted, under the floor (failed first; finding rejected)

| Test | Finding |
|---|---|
| `test_overlap_missing_data_file_is_an_error_not_a_traceback` | 1: traceback, exit 1 |
| `test_overlap_zero_byte_file_is_the_error_matrix_exit_not_a_traceback` | 2: traceback on a 0-byte file |
| `test_overlap_phases_missing_file_is_an_error_not_a_traceback` | 3: traceback on a missing phases file |
| `test_overlap_phases_line_that_is_not_json_is_an_error_not_a_traceback` | 4: traceback on a non-JSON line |
| `test_compare_a_test_that_gained_no_lines_is_not_reported_as_changed_with_empty_diff` | 5: an empty "changed" row; errs towards rejecting |

## Deleted, not a sole cover of a scenario or error-matrix row (passed first)

Each is an edge case of a clause that T-1 to T-8 already cover, or a second property for a row
that already has one.

| What it attacked | Covered by |
|---|---|
| overlap: a schema with no contexts exits 2; only setup and teardown contexts exit 2; `--compare` with a "before" file without contexts exits 2 | T-5 (same code path) |
| overlap: `\|` inside a parametrised id stays whole | T-3 |
| overlap: three equal tests list the second and third; an equal pair once | T-3 |
| overlap: the container has the fewest lines, then the first node id | T-3 |
| overlap: a test with no lines is never contained nor in `no_lines` | T-3 |
| overlap: one line number in two files does not alias; lines across files are unioned | T-3 |
| overlap: numbits byte `\x80` is line 15; blob padding irrelevant; an empty blob gives no lines | T-3 |
| overlap: line 0 and negative arcs dropped; `has_arcs=1` reads `arc` and ignores `line_bits` | T-4 |
| overlap: empty and blank phases lines; `no_lines` counts only passed calls, each once | T-3 |
| overlap: `--compare` with a test in one file only, identical files, a mixed arcs and lines pair | T-6 |
| overlap: the data file is not modified | T-3 (read-only open) |
| phase_times: without the option it writes nothing and does not fail (twice, once with a failing test) | T-1 |
| phase_times: a fixture that raises gives a failed set-up and its line | the kept failing-test test (same row) |
| phase_times: session and module fixtures give one line each with their scope; a nested fixture is attributed to the test | T-1 |
| phase_times: odd parametrised ids stay valid JSON; skipped and teardown phases recorded; an empty suite gives an empty file; a bad output folder | T-1 |
| changed: no argument, two arguments, outside a git repository exit 2 | T-8 (unknown base) |
| changed: base equal to HEAD, clean and with uncommitted edits; a SHA, `HEAD`, a detached HEAD as base; base commits after branching ignored | T-8 |
| changed: names with spaces, renames, deeper nesting, nested package layers | T-8 rule rows |
| changed: `pkg/services.py`, `tests/unit/helpers.py`, a `test_*.txt` fall back | T-8 rule rows |
| changed: a deleted test folder left out; a deleted layer and its folder fall back; a fallback prints nothing; ignored untracked files; an option-like base exits 2; `git status` unchanged | T-8 |

## Refactoring opportunities the builder saw (report only)

- `_check_overlap` and `_phases_file` serve only T-3 and T-4.
- Rename and space-in-path cases could be rows of `test_changed_lane_rules`.
- A shared conftest fixture for the temporary git repository.
- The widened `_run_phase_times` signature; inline it if no second case appears.
