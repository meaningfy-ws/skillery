# Interview Script

The grouped questions to ask before scaffolding. Use `AskUserQuestion` — one tool call per
group, batching the questions inside it. Make **no silent assumptions**; every answer below
drives which templates and pillars get applied. End by echoing back the resolved profile for
explicit confirmation (Plan phase, SKILL.md step 2).

Order matters: identity → archetype → runtime → frameworks → datastores → pillars → governance.
Later groups can be **pre-filtered by the archetype** (e.g. a `library` skips the datastore and
web-framework questions).

---

## Group 1 — Identity

**Q1.1 Project name (human-readable).**
- Free text. Drives `<<PROJECT_NAME>>` in `AGENTS.md`, `MEMORY.md`, docs, `pyproject.toml`
  description.

**Q1.2 Distribution slug / repo name.**
- Free text; default = kebab-case of the name (e.g. `My Project` → `my-project`).
- Drives `<<PROJECT_SLUG>>` (Poetry `name`, sonar key, repo URL).

**Q1.3 Import package name.**
- Free text; default = snake_case of the slug (`my-project` → `my_project`).
- Drives `<<PACKAGE>>` — the **top-level package** (no `/src`; decision D1). Multiple
  deployable units → confirm extra package names (e.g. `<<PACKAGE>>_dags`).

---

## Group 2 — Archetype (the pivotal question)

**Q2.1 What kind of project is this?** (from the decisions.md archetypes table)

| Option | Description | Drives |
|--------|-------------|--------|
| **service** (recommended for APIs) | REST/HTTP service with ≥1 entrypoint | full 4 layers; Antora **yes**; infra **yes** (db+api); fastapi/uvicorn |
| **library** | Importable/publishable package, no process | `domain` (+`adapters`); reference-only docs; **no** infra |
| **pipeline** | Batch / Airflow / worker flows | `domain`+`adapters`+`services`, dags entrypoint; Antora yes; infra yes (workers) |
| **cli tool** | Command-line application | `domain`+`services`, cli entrypoint; tutorials+how-to docs; infra optional |
| **docs-only** | Documentation repository | Antora **only** (the whole repo); no Python pillars |

- **Default/recommendation:** none — must be answered explicitly; it gates every later group.
- A `docs-only` answer short-circuits Groups 3–5 (skip to Group 6 docs + Group 7).

---

## Group 3 — Runtime

**Q3.1 Minimum Python version.**
- Options: `3.12` (recommended), `3.11`, `3.13`.
- Drives `<<PYTHON_VERSION>>` in `pyproject.toml`, `ruff.toml` `target-version`, `mypy.ini`,
  CI matrix. Skip for `docs-only`.

---

## Group 4 — Frameworks (archetype-filtered)

**Q4.1 Web framework?** (ask for `service`)
- Options: **FastAPI** (recommended), Starlette, Flask, *none*.
- Drives runtime deps, the `entrypoints/` API skeleton, OTel FastAPI wiring, CI smoke test.

**Q4.2 Orchestrator?** (ask for `pipeline`)
- Options: **Airflow** (recommended for batch), Prefect, *plain workers / none*.
- Drives a `<<PACKAGE>>_dags` top-level package, infra worker services.

**Q4.3 CLI library?** (ask for `cli tool`)
- Options: **Typer** (recommended), Click, argparse.
- Drives the `entrypoints/` CLI skeleton and console-script entry point.

---

## Group 5 — Datastores (skip for `library`/`docs-only`)

**Q5.1 Primary datastore(s)?** (multi-select)
- Options: **MongoDB** (motor), **PostgreSQL** (SQLAlchemy/asyncpg), **Redis** (cache/streams),
  *none / in-memory*.
- Drives runtime deps, the `adapters/` repository skeleton, `infra/compose.yaml` services,
  `infra/.env.example`, integration-test markers (`tests/integration/`), and the
  `Datastores / external systems` bullet in `AGENTS.md`.

**Q5.2 External systems / APIs to integrate?**
- Free text (e.g. "an OpenAPI client to engine X", "an S3 bucket").
- Drives `adapters/` gateway stubs and the "external systems" note in `AGENTS.md`.

---

## Group 6 — Pillars (which optional halves to include)

Each is a yes/no with a recommended default keyed off the archetype.

**Q6.1 Antora documentation?**
- Default: **yes** (no for `library` → reference-only). Drives the `docs/` Antora skeleton,
  `make build-docs`, and `docs.yaml` CI.

**Q6.2 Docker / infra?**
- Default: **yes** for `service`/`pipeline`, **no** for `library`/`cli`. Drives `infra/`
  (compose, Dockerfile, entrypoint, `.env.example`, co-located dockerignore — D11).

**Q6.3 CI workflows?**
- Default: **yes** (always recommended). Drives `.github/workflows/ci.yaml` (calls `make`
  targets — D12) and, if docs selected, `docs.yaml`.

**Q6.4 Multi-component tiers?**
- Default: **no** (single component). Yes when several business components exist → adds the
  tier hierarchy in `.importlinter` and the multi-component layout (see `layout.md`,
  `architecture-guardrails.md`). Start single; promote to tiers only when warranted.

---

## Group 7 — Governance

**Q7.1 License.**
- Options: **Apache-2.0** (recommended), MIT, proprietary/none.
- Drives `LICENSE`, `pyproject.toml` `license`, file headers.

**Q7.2 GitHub org / owner.**
- Free text. Drives `<<GITHUB_ORG>>` in repo URLs, CI, Sonar, docs site base.

**Q7.3 Default branch.**
- Options: **develop** (recommended at Meaningfy), `main`.
- Drives `<<DEFAULT_BRANCH>>` in `AGENTS.md`, CI triggers, branch-protection guidance.

---

## Resolved-profile echo-back

Before writing any files, render this filled-in block and ask the developer to confirm:

```
Resolved profile
─────────────────
Project name      : <<PROJECT_NAME>>
Slug / repo       : <<PROJECT_SLUG>>
Package(s)        : <<PACKAGE>>[, <<PACKAGE>>_dags]
Archetype         : service | library | pipeline | cli tool | docs-only
Python            : <<PYTHON_VERSION>>
Web framework     : FastAPI | … | none
Orchestrator      : Airflow | … | none
CLI library       : Typer | … | n/a
Datastores        : MongoDB, Redis | … | none
External systems  : <free text>
Pillars           : docs[y/n]  infra[y/n]  CI[y/n]  multi-component-tiers[y/n]
License           : Apache-2.0 | …
GitHub org        : <<GITHUB_ORG>>
Default branch    : <<DEFAULT_BRANCH>>

→ Will create: <file tree from layout.md, scoped to the pillars above>
Proceed? (yes / adjust)
```

Only on an explicit "yes" move to the scaffold phase (SKILL.md step 3). If the developer
adjusts, update the profile and re-echo — never start writing from an unconfirmed profile.
