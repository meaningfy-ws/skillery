## ADDED Requirements

### Requirement: Test gates print results, not logs
`project-setup`'s `assets/templates/root/pytest.ini` SHALL set `addopts = -q -rfE --strict-markers
--tb=short`, and the Makefile template's `COV_FLAGS` SHALL write coverage to `coverage.xml` only,
without `--cov-report=term-missing`; `--cov-fail-under=80` stays (D-13).

#### Scenario: A green run
- **WHEN** `make test` runs in a scaffolded repository with 120 passing tests
- **THEN** the output is one summary line (`120 passed in 3.2s`) and `coverage.xml` is written; no per-test line and no coverage table print

#### Scenario: A red run
- **WHEN** two tests fail and one errors
- **THEN** the output shows the three with their short tracebacks and the `-rfE` summary lines, and nothing about the passing tests

#### Scenario: Coverage below the gate
- **WHEN** coverage falls to 74 %
- **THEN** `make test` fails with the one `--cov-fail-under` line, and the per-file numbers are in `coverage.xml`

### Requirement: The AGENTS template carries only what is specific to the repository
`assets/templates/agentic/AGENTS.md.tmpl` SHALL keep only the sections that depend on the
repository (the project header, *Skill routing*, *The spine*, *Project specifics* with its checks,
libraries and GitNexus repo name, the working conventions that name the repository's layers, and
the note that `.claude/` is a regenerable index) and SHALL point to the owning skill for the rest in one line each
(`guardrails` for session hygiene, dispatch and the tools table; `epic-delivery` for how work runs;
`test-strategy` for success and failure first). `CLAUDE.md.tmpl` SHALL carry no GitNexus block;
`project-setup` SHALL ship the "no GitNexus block in `CLAUDE.md`" check as a Makefile target
(`check-bindings`, run by the quality gate; it needs no network and no pin bump, which a shared
`quality/` module would), and the Makefile template's re-index target SHALL run
`npx gitnexus analyze --skip-agents-md` (D-13, D-49).

#### Scenario: A scaffolded AGENTS.md
- **WHEN** `scripts/scaffold.sh -p orders -n "Order Processing" -a product` writes `AGENTS.md`
- **THEN** the file holds the project header, *Skill routing*, *The spine* and *Project specifics*, and no sentence restates a `guardrails` rule (a fresh session at a task boundary, the base report): the pointer stands in its place

#### Scenario: A GitNexus block lands in CLAUDE.md
- **WHEN** a repository's `CLAUDE.md` contains the `# GitNexus — Code Intelligence` heading
- **THEN** `make check-quality` fails naming the check and the file, and the same block in `AGENTS.md` passes

#### Scenario: Re-indexing
- **WHEN** a developer runs the Makefile's re-index target
- **THEN** it runs `npx gitnexus analyze --skip-agents-md`, and `AGENTS.md` and `CLAUDE.md` are unchanged afterwards

### Requirement: Code intelligence works where the agents work
`project-setup` SHALL ship a `.serena/project.yml` template whose `language_servers` lists every
language the interview resolved for the archetype (`python` first), and a note in it that a
worktree is activated as its own Serena project at the worktree's path (D-13).

#### Scenario: A repository with two languages
- **WHEN** a product archetype with a Python package and a TypeScript front end is scaffolded
- **THEN** `.serena/project.yml` lists `python` and `typescript` under `language_servers`, and `find_symbol` resolves symbols in both trees

#### Scenario: A builder in a worktree
- **WHEN** a builder works in `../orders-tenant-dump`, a worktree of the repository
- **THEN** the note tells it to activate that path as its own project, and symbol search runs against the worktree's files, not the main checkout's

### Requirement: Polling is denied and gates have one owner
The polling denial SHALL be the `no-poll-loops` mod of `meaningfy-core`, which every Claude Code
session with the plugin runs; `project-setup` SHALL ship no second hook and `AGENTS.md.tmpl` SHALL
name that mod and `quiet-tools` as the hooks the session runs (D-49). `AGENTS.md.tmpl`
§Project specifics SHALL ship the gate-shape table of `epic-delivery`'s stage loop: narrow checks,
task gate, full gates, docs gate, each with its one moment and one owner (D-13).

#### Scenario: A polling command
- **WHEN** an agent runs `sleep 30 && tail -n 5 $TMPDIR/validate.log` in a scaffolded repository
- **THEN** the hook denies it and the message says to run the command once in the background and wait for its notice

#### Scenario: A background command
- **WHEN** an agent runs `make check-all` with `run_in_background`
- **THEN** the hook lets it run and nothing is denied

#### Scenario: The gate table
- **WHEN** a developer fills *Project specifics* of a scaffolded `AGENTS.md`
- **THEN** the table has five rows (narrow checks by the builder per edit, task gate once per task by the builder, full gates once per stage by the lead, docs gate, code intelligence by the lead at the two points) and a `make` target per row that has one

### Requirement: A scaffolded repository passes its own validate
A probe SHALL scaffold a product repository with `scripts/scaffold.sh` into a temporary directory
and run `make validate` there (where `validate` is `check-all` plus `openspec validate --strict`);
the probe SHALL pass before the templates ship (D-13).

#### Scenario: The probe is green
- **WHEN** the probe scaffolds `-p orders -n "Order Processing" -a product` and runs `make validate`
- **THEN** it exits 0 with the quiet summary, `coverage.xml` is written, and the `CLAUDE.md` lint and `openspec validate --strict` pass

#### Scenario: A template misfires
- **WHEN** a template change makes the scaffolded `pytest.ini` reject `--strict-markers`
- **THEN** the probe fails on `make validate` in skillery's test run, and the template is fixed; no scaffolded repository is patched by hand
