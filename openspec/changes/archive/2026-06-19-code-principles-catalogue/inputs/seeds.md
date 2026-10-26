# Seeds — code-principles-catalogue (SECONDARY; never groomed or deleted)

> The authored EPIC (`proposal.md`) supersedes these but does not replace them.

## Origin

Review of code produced by the Meaningfy skills in the sibling project **eds4jinja2**
(`eds4jinja2/eds4jinja2/adapters/{in_memory_sparql_ds,remote_sparql_ds,local_sparql_ds,file_ds,graph_store}.py`,
`builders/parallel_executor.py`). Planning artifacts (`openspec/changes/{in-memory-sparql-datasource,builtin-graph-store,parallel-report-executor}`) were strong; the implementation reused at module level but not symbol level.

## Objections raised (verbatim intent)

1. **Constants not reused across files.** `HEAD/VARS/RESULTS/BINDINGS/TYPE/VALUE/DATATYPE/XML_LANG/URI/LITERAL/BNODE`
   defined in `in_memory_sparql_ds.py` but not reused by `remote_sparql_ds`, `local_sparql_ds`, `parallel_executor`.
   Code could be reused/refactored into a more compact form. "I need the code to be as compact, always."
2. **Extension / media-type maps not shared.** `graph_store._EXTENSION_TO_MEDIA_TYPE` + `DEFAULT_RDF_FORMAT` vs
   `file_ds.TABULAR_EXTENSIONS/TREE_EXTENSIONS` — common elements, not shared → less maintainable. "Increase maintainability, always."
3. **Literal keys where constants exist.** `parallel_executor` returns `{"head": {"vars": []}, "results": {"bindings": []}}`
   and uses `"with_uri"`-style literals. "Always prefer to define models over dicts. Almost everything must be a Pydantic
   model... those keywords are best lived in a model."
4. **Reusable infra placement.** `SPARQLClientPool` lives in `remote_sparql_ds.py` — could it be generic + reused?
   "Always prefer a proper perspective on existing code, think of good design and possible refactoring, how the new code
   would fit best. Maximise maintainability."
5. **Version single source of truth.** `__version__` in `__init__.py` — is that best? Want one SSOT (VERSION file or
   pyproject), everything else derives. "Never duplicate, always prefer single source of truth." (Note: current state is
   already SSOT — `__init__.py` is the source, `pyproject.toml` reads it via `attr`.)

## Cross-cutting request

- Derive general rules so the mistakes are not repeated: read relevant classes/files before implementing; consider initial
  refactoring; reuse/extend existing code for smooth integration.
- Audit: which skills used (from the openspec specs)? which should have been used? the delta?

## Q&A / decisions taken during elicitation

- **Catalogue home** → cosmic-python `references/` file (skill-owned single source). Chosen over a standalone doc
  (would violate "skills own rules, docs narrate") or inline SKILL.md (bloat).
- **No new skill** — extend cosmic-python (its remit is "HOW to build the code").
- meaningfy-code-review should CITE the catalogue, not restate it.
- Everything in global `~/.claude/CLAUDE.md` must be captured in a skill (the global file routes, never restates).
- project-setup gains a version-SSOT DoD tick.
- All affected skills must fit the OpenSpec/opsx workflow and fire at the right phase.

## Inferred skill usage (from eds4jinja2 openspec artifacts)

Used: epic-planning, spine + spec-stewardship, clarity-gate (anti-patterns + error matrix + ≥9/10), cosmic-python,
ponytail (`# ponytail:` comments), superpowers TDD/brainstorming, meaningfy-git-workflow (conventional commits).
Delta (under-applied): meaningfy-code-review (would have flagged all five; its checklist also exempts adapters), and a
non-existent "survey-before-build" reuse step in cosmic-python.
