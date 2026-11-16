# Measuring a suite

Two runs of the project's own test command, for each tier it has (unit, feature, integration, end
to end). Flags go in `PYTEST_ADDOPTS`, so the command is not edited; output goes to `<out>`, a
folder outside the repository. `<skill>` is this skill's folder.

```
# run A: time per phase and per fixture, without coverage
PYTHONPATH=<skill>/scripts PYTEST_ADDOPTS="-p phase_times --phase-times-out=<out>/phases.jsonl --no-cov" <test command>
# run B: the lines each test covers
COVERAGE_CORE=ctrace COVERAGE_FILE=<out>/.coverage PYTEST_ADDOPTS="--cov-context=test" <test command>
python <skill>/scripts/overlap.py <out>/.coverage --phases <out>/phases.jsonl > <out>/overlap.json
```

- `--no-cov` only when the project has pytest-cov; run B adds `--cov=<package>` only when the
  command does not already measure coverage. Without pytest-cov, skip run B and write under *Not
  measured* that only W-1, W-2 and the broken rules were looked for.
- `COVERAGE_CORE=ctrace` is required: the `sysmon` core, the default from Python 3.14, records a
  line once, under the first test that runs it, so later tests lose lines silently.
- Per-test contexts come from `--cov-context=test`, never `dynamic_context` in the coverage
  configuration: that fails under xdist and merges parametrised cases.
- Run B may fail on the command's coverage floor (flags on the command line beat
  `PYTEST_ADDOPTS`); its data file is complete and is used.
- Timings come from run A only. On a loaded machine, report shares, not seconds.
- Under xdist, workers write their fixture lines to `<out>/phases.jsonl.<worker>`: read them all.
- A test that fails or flakes in either run goes under *Not measured* and into no proposal.
