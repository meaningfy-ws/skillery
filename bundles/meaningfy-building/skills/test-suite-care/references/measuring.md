# Measuring a suite

Two runs of the project's own test command, for each lane it has. Take the lanes from the
project's `make` targets and its CI, not from its test folders: a folder that no target selects
(a `tests/perf/` outside every marker expression) is a lane nobody runs; list it under *Not
measured*. Flags go in `PYTEST_ADDOPTS`, so the command is not edited; output goes to `<out>`, a
folder outside the repository. `<skill>` is this skill's folder.

```
# run A: time per phase and per fixture, without coverage
PYTHONPATH=<skill>/scripts PYTEST_ADDOPTS="-p phase_times --phase-times-out=<out>/phases.jsonl --no-cov" <test command>
# run B: the lines each test covers
COVERAGE_CORE=ctrace COVERAGE_FILE=<out>/.coverage PYTEST_ADDOPTS="--cov-context=test" <test command>
python <skill>/scripts/overlap.py <out>/.coverage --phases <out>/phases.jsonl > <out>/overlap.json
python <skill>/scripts/overlap.py <out>/.coverage --files > <out>/files.json
```

- `--no-cov` only when the project has pytest-cov; run B adds `--cov=<package>` only when the
  command does not already measure coverage. Without pytest-cov, skip run B and write under *Not
  measured* that only W-1, W-2 and the broken rules were looked for.
- `COVERAGE_CORE=ctrace` is required: the `sysmon` core, the default from Python 3.14, records a
  line once, under the first test that runs it, so later tests lose lines silently.
- Per-test contexts come from `--cov-context=test`, never `dynamic_context` in the coverage
  configuration: that fails under xdist and merges parametrised cases.
- Run B may fail on the command's coverage floor (flags on the command line beat
  `PYTEST_ADDOPTS`); its data file is complete and is used. Report files the command writes
  (`coverage.xml`, an HTML folder) land in the repository: delete them, never commit them.
- Timings come from run A only. On a loaded machine, report shares, not seconds.
- `phases.jsonl` holds the phase lines; fixture lines go to `phases.jsonl.fixtures`, or to
  `phases.jsonl.<worker>` under xdist: read them all. Give each run a fresh `<out>` folder, so no
  file of an earlier run is read.
- Under xdist a session or module fixture is built once per worker: a saving from widening a scope
  is per worker, not per suite.
- A test that fails or flakes in either run goes under *Not measured* and into no proposal.

## Confirming a slow test alone (W-2)

Run A under xdist inflates times: a test can look slow because its worker was busy. Before
proposing a `slow` marker or its removal, run each candidate alone, one node id per process, on an
idle machine, with run A's flags and without xdist (`-n 0` when the project's options turn it on,
else `-p no:xdist`), and report only the confirmed ones. A run alone
pays for process start (about 0.7 s): set the threshold for removing a marker above it.

## Mutation (W-8)

Line coverage says what ran, not what a test would notice; a mutation run says it. When its
evidence is required is in `waste.md`; how to get it is here.

- Run it per layer, with that layer's own tests first (a domain layer in about a minute); widen to
  more tests only for the mutants that survive. The whole suite under one run is slow (the tool's
  statistics phase is serial) and its baseline can fail on parametrised ids with control
  characters; fall back to per-layer results.
- Most mutation tools stop at the first test that kills a mutant, so there is no per-test matrix.
  For a drop, use a pair: mutate the code the dropped test covers, run the survivor alone, and
  require it to kill every mutant the dropped test kills.
- Compare like with like: a test moved to another tier leaves the layer's selection, and its
  mutants turn "untested". The acceptance check of a merge is an unchanged set of surviving
  mutants on the same selection.
- A mutant that changes only the text of a problem response's message is equivalent: rule 9 asserts
  status and `type`, not the text. Any other message mutant counts.
- Copy the files outside the package that the tests read (documents, fixtures) into the mutation
  tool's working copy.
