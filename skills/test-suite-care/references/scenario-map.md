# The scenario map

One file in the audited repository, `tests/audit/scenario-map.csv`, one row per test function (not
per parametrised case):

```
test,level,capability,requirement,scenario,confidence,evidence
tests/unit/session/test_store.py::test_remove_unregisters,scenario,aggregate-store,Removing an aggregate,the aggregate was removed,high,name+covered code
tests/unit/services/test_dump.py::test_dump_deterministic,requirement,tenancy,A tenant can be dumped,,medium,module docstring
tests/unit/adapters/test_mapper.py::test_generated_context,none,,,,none,
```

- `level`: `scenario`, `requirement`, `capability` or `none`.
- `confidence`: `high` needs two of three pieces of evidence: the test's name or docstring says
  it; the code it covers (`overlap.py --files`) implements it; a feature file or a spec id names
  it. `medium` has one; `none` has none and goes with level `none`.
- A feature test takes its scenario from its `.feature` file: level `scenario`, confidence `high`.
- A test that serves a scenario in part (a lower tier proving one step of it) is mapped to that
  scenario with `part` in its evidence. *Scenarios with no test* counts every tier, parts
  included, before it reports a gap.
- Build it file by file: the test, its module docstring, the files it covers, the specs. A
  scenario of a change not yet archived is mapped from its delta spec, with evidence `open
  change`.
- A repository with no specs maps to its `.feature` scenarios; with neither, every row is `none`
  and the proposals are limited to class 1, class 2 and W-6.
- **Many test folders.** The lead writes one brief file every mapping subagent reads, and prepares
  each chunk's inputs (its rows of `files.json` and `overlap.json`); a chunk is 300 to 500 test
  functions. Subagents are read-only and write only their rows and their findings; the lead
  merges the rows and checks the count.
- **The owner's sample.** Before any proposal is discussed, the owner checks ten rows of each
  confidence, drawn at random. One wrong `high` row sends that test file back to be mapped again,
  and a new sample of `high` rows is drawn, before any class 3 proposal.
- **A waived sample.** The owner may waive it. The report's header and *Decisions* say so, and a
  class 3 proposal then goes ahead only with W-8's pair evidence or a survivor at `high` that the
  lead has read again.
- Check the count: the rows match the node ids of `pytest --collect-only -q`, with the `[...]`
  suffix removed, each once.
- **Keep it in step.** After each landed proposal, and before a later audit, run
  `<skill>/scripts/refresh_map.py --map tests/audit/scenario-map.csv --collect <collect output>`:
  it removes the rows of tests that are gone, lists the new ones to map, and leaves the map
  untouched when the collection failed or would remove more than a fifth of the rows. A renamed
  test is mapped again.
