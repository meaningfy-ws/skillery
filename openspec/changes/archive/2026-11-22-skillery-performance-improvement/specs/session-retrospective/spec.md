## ADDED Requirements

### Requirement: A Langfuse usage report is reproducible
The skill `session-retrospective` SHALL hold `references/langfuse-report.md`, a procedure with the
eight queries of the window report: totals; usage by observation type; usage by model with p50 and
p90 context; usage per day with cost; top sessions; tool invocations; latency per observation
name; tags to skills loaded. Each query SHALL give its `queryMetrics` arguments and how to read the
result, and SHALL pin the fields it depends on. When a pinned field is missing from the project,
the report SHALL be marked "not comparable" and the owner told. The Langfuse project SHALL have a
price set for every model id of the window, so the per-day query shows a non-zero cost. The
procedure SHALL be read-only on the traces (D-11, DEC-6).

#### Scenario: The report is re-run on the same window
- **WHEN** a second person runs the eight queries over 2026-11-08 to 2026-11-22 from the reference
- **THEN** the totals, the per-model table and the top sessions equal the baseline page's numbers

#### Scenario: A pinned field disappears
- **WHEN** the usage-by-type query returns no `observation.type` field
- **THEN** the page is headed "not comparable", names the field, and RISK-1 is raised to the owner

#### Scenario: Cost shows after prices are set
- **WHEN** the four model ids of the window have a price in the Langfuse project
- **THEN** the per-day query returns a cost greater than 0 for each day with traffic

### Requirement: Usage reports form a comparable series
Every usage report SHALL be a dated page `docs/practice/ai-coding/usage-reports/<date>.md`, produced
by the reference procedure, with a `README.md` in the folder that names the series and how to add a
page. The first two pages SHALL be `2026-11-22.md` from this change's seed and `2026-11-09.md`
linking the `lean-delivery` evidence, not copying it. A page SHALL state its window and work mix
(sessions, repositories, appetites) and SHALL hold numbers only, never prompts, reports or
commands. For stages 2 to 5 of this change, a page taken within seven days of the stage's release,
over the traces tagged `skillery:<version>` with that release's version, SHALL carry a `§Stage n`
section comparing the stage's proxy (D-17) and the gates passed with the baseline; only the stage-6
page SHALL be taken after fourteen days and SHALL carry the four numbers of DEC-2 and the gates
passed (D-11, D-17, DEC-2, DEC-6, DEC-7).

#### Scenario: The series starts
- **WHEN** stage 1 is merged
- **THEN** `usage-reports/` holds `README.md`, `2026-11-09.md` and `2026-11-22.md`, and the 2026-11-09 page links the archived evidence file

#### Scenario: A stage is measured
- **WHEN** stage 2 has been released as version `v` and seven days or fewer have passed since that release
- **THEN** a new dated page carries `§Stage 2` with the median main-thread context over the traces tagged `skillery:v` and the gates passed, next to the baseline's 199 k

#### Scenario: The stage-6 page
- **WHEN** fourteen days have passed since the stage-5 release
- **THEN** a new dated page carries `§Stage 6` with the four numbers of DEC-2 and the gates passed, next to the baseline

#### Scenario: Gates passed drop
- **WHEN** a stage page shows fewer gates passed than the baseline
- **THEN** the stage's PR is reverted and the stage re-planned with one question round

#### Scenario: A page with a prompt in it
- **WHEN** a draft page quotes a prompt or a subagent report
- **THEN** the pre-PR review rejects it until only numbers remain

### Requirement: An inventory separates used from unused
`references/langfuse-report.md` SHALL hold a `§Inventory` procedure, not a tool: list the installed
plugins and skills (`claude plugin list`, the `SKILL.md` count) and the MCP servers of the user
config; compare them with the `skill:` and `subagent-skill:` tags of the window and the tool names
called; write `usage-reports/inventory-<host>-<date>.md` with three lists: used, unused, undecided.
The owner SHALL approve the disable list before anything is disabled, and disabling SHALL use the
CLI's plugin and MCP commands. The procedure SHALL run per machine (D-12, DEC-17).

#### Scenario: The inventory of one machine
- **WHEN** the procedure runs on a machine with about 370 skills installed and 36 seen in the window's tags
- **THEN** `inventory-<host>-2026-11.md` lists the 36 as used, the rest as unused or undecided, and nothing is disabled yet

#### Scenario: The owner approves
- **WHEN** the owner marks a subset of the unused list for disabling
- **THEN** only that subset is disabled, with the CLI's commands, and the page records what was disabled

#### Scenario: A second machine
- **WHEN** the procedure runs on a second host
- **THEN** it writes its own `inventory-<host>-<date>.md` and does not edit the first machine's page
