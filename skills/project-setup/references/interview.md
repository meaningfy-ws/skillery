# Interview

One grouped question call per group, in order. No silent assumptions: each answer picks templates
and pillars. A `library` skips datastores, framework and `model/`; a `doc-only` runs Q2.2 and skips
groups 3 to 5.

| Group | Ask (recommended first) |
|---|---|
| 1 Identity | name; slug (kebab-case of the name); package (snake_case of the slug; one more per deployable unit, e.g. `<pkg>_dags`) |
| 2 Archetype | Q2.1 product, library or doc-only: no default, it gates every later group |
| 3 Runtime | Python 3.12, 3.11, 3.13 |
| 4 Product | flavour service, pipeline or cli (the old answers of those names are all product); FastAPI, Starlette, Flask; Airflow, Prefect, none; Typer, Click, argparse; model source LinkML, model2owl, other, never defaulted silently; UI tool: Playwright, Cypress, none |
| 5 Datastores (product) | MongoDB, PostgreSQL, Redis, Neo4j (with LinkML: `--neo4j`), none; external systems |
| 6 Pillars | docs yes (library: reference only); infra yes for service and pipeline; CI always; deployable no (product only); tiers no, start single |
| 7 Governance | Apache-2.0; GitHub org; branch `develop` |

**Q2.2, doc-only, mandatory.** Ask its purpose (knowledge base, doc site, ADR log, spec corpus,
glossary), the elements it needs (docs buckets, `openspec/`, a published site) and what "good"
means (which link, build and structure checks become its gates).

**Echo back** the resolved profile (every answer, the gate profile with the clarity gate marked
"human/agent, not CI", the pinned spine) and the file tree. Write only on an explicit yes; on an
adjustment, re-echo.
