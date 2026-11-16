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
  it; the code it covers (run B) implements it; a feature file or a spec id names it. `medium` has
  one; `none` has none and goes with level `none`.
- A feature test takes its scenario from its `.feature` file: level `scenario`, confidence `high`.
- Build it file by file: the test, its module docstring, the files it covers, the specs. A
  scenario of a change not yet archived is mapped from its delta spec, with evidence `open
  change`.
- A repository with no specs maps to its `.feature` scenarios; with neither, every row is `none`
  and the proposals are limited to class 1, class 2 and W-6.
- **The owner's sample.** Before any proposal is discussed, the owner checks ten rows of each
  confidence, drawn at random. One wrong `high` row sends that test file back to be mapped again,
  and a new sample of `high` rows is drawn, before any class 3 proposal.
- Check the count: the rows match the node ids of `pytest --collect-only -q`, with the `[...]`
  suffix removed, each once.
- A later audit maps again only the tests added or changed since the map's commit; a row whose
  test is gone is removed, a renamed test is mapped again.
