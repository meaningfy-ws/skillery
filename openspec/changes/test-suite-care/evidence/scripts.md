# The two scripts (task 1.2)

T-1 and T-3 to T-6 pass under `make test`. T-2 and T-7 need pytest-xdist, coverage and pytest-cov,
which CI does not install (D-28: now listed in `requirements-quality.txt`, read by `make install`).
Run once by hand on 2026-11-16:

```
uv run --no-project --with pytest==9.1.1 --with pyyaml --with pytest-cov --with pytest-xdist \
  python -m pytest tests/test_test_suite_care.py -v -k "phase or overlap"
platform linux -- Python 3.14.3, pytest-9.1.1, pluggy-1.6.0 -- /home/lps/.cache/uv/builds-v0/.tmpzZcPRF/bin/python
tests/test_test_suite_care.py::test_phase_times_writes_fixture_and_phase_lines PASSED [ 14%]
tests/test_test_suite_care.py::test_phase_times_under_xdist_writes_each_line_once PASSED [ 28%]
tests/test_test_suite_care.py::test_overlap_reads_line_bits PASSED       [ 42%]
tests/test_test_suite_care.py::test_overlap_reads_arcs_under_branch_coverage PASSED [ 57%]
tests/test_test_suite_care.py::test_overlap_without_per_test_contexts_exits_2 PASSED [ 71%]
tests/test_test_suite_care.py::test_overlap_compare_lists_only_the_changed_test PASSED [ 85%]
tests/test_test_suite_care.py::test_overlap_on_a_real_branch_coverage_run PASSED [100%]
======================= 7 passed, 21 deselected in 1.29s =======================
```

Versions: coverage 7.17.3, pytest-cov 7.1.0, pytest-xdist 3.8.0.

**Finding (D-55).** The first run of T-7 failed: on Python 3.14, coverage's default core is
`sysmon`, which records a line once, under the first test that runs it. `test_b` got only line 7,
not the lines of `f` that `test_a` had already run, so no test was "contained". With
`COVERAGE_CORE=ctrace` the per-test lines are complete (checked on Python 3.13 and 3.14). Run B
therefore sets `COVERAGE_CORE=ctrace`; T-7 sets it too.
