# activity-tools Specification

## Purpose
Give every agent one table that names, per activity, the tools to use and a fallback, by names the
CLI actually exposes to that agent, so that agents reach for the right tool without each skill or
agent restating it. A lint check (`activity_tools_table`) keeps the table honest.

## Requirements

### Requirement: One table recommends the tools for each activity
The catalogue SHALL hold one table, in `guardrails`, that names the recommended tools for each
activity and a fallback for each. It SHALL name a tool only by a name the CLI exposes to the agent.
Agents, delivery briefs and the instruction template SHALL point to the table and SHALL NOT carry
their own tool rules (proposal DEC-8). A worker's side-effect limit, such as the reviewer's
read-only use of a code tool, is not a tool rule and stays in the agent (D-29).

#### Scenario: An agent looks up the tools for code work
- **WHEN** an agent starts a task that reads or changes code
- **THEN** the table gives it the recommended tools for that activity under names it can call, and the fallback when one is absent

#### Scenario: The table names a tool an agent cannot call
- **WHEN** a row's Claude Code cell names a tool that an agent named in that row's Agents cell does not carry in its `tools:` list, globs included
- **THEN** the lint check `activity_tools_table` fails and names the row and the agent

#### Scenario: The lead row
- **WHEN** a row's Agents cell says `lead`
- **THEN** the check maps it to the agent `team-lead` and compares that agent's `tools:` list

#### Scenario: The opencode column is not checked
- **WHEN** a row's opencode cell names a tool
- **THEN** the check does not compare it with any agent's tool list, because there the list does not restrict (gap G-6 in `docs/environment/dual-cli/mapping.md`)

### Requirement: Serena is encouraged for everything it supports
The table SHALL recommend Serena for every code operation it supports (symbol and reference search,
file overviews, symbol-level edits, rename, safe delete, diagnostics) and SHALL say how to reach
those operations on each CLI (proposal DEC-9). A subagent SHALL receive the five Serena essentials
(`get_symbols_overview`, `find_symbol`, `find_referencing_symbols`, `replace_symbol_body`,
`insert_after_symbol`) in the builder card of its brief and SHALL NOT call `initial_instructions`;
the `activity-tools.md` Serena row SHALL say so (D-15, D-3).

#### Scenario: Finding the callers of a function
- **WHEN** an agent needs the references to a symbol in a repository where Serena is connected
- **THEN** the guidance leads it to Serena's reference search, not to a text search over the files

#### Scenario: A builder starts from its card
- **WHEN** an implementer is spawned with the builder card for a task in a repository where Serena is connected
- **THEN** the card names the five essentials, and the implementer finds the symbol with `find_symbol` and its callers with `find_referencing_symbols` without a call to `initial_instructions`

#### Scenario: The table's Serena row
- **WHEN** an agent reads the Serena row of `references/activity-tools.md`
- **THEN** the row points a subagent to the five essentials in its brief and names `initial_instructions` as a read the lead makes once per session, if at all

### Requirement: A tool call returns a result, not a log
Every agent SHALL ask a tool for its result, not its log: the quiet form of the command
(`pytest -q -rfE`, `git diff --stat`, `openspec validate` piped through `tail`, a `make` target
without `-v`), long output sent to a file under `$TMPDIR` with only the lines that decide the next
step read back, and never a file printed to read it (Read with offset and limit, Grep and Serena
read files). `guardrails` SHALL carry the principle in §Session hygiene and in the header of
`references/activity-tools.md`; every brief template SHALL carry it in one line. The `quiet-tools`
mod (PreToolUse on Bash) SHALL warn, and never deny, on `sed -n`, `head`, `tail` or `cat` with a
file argument, `grep` on a path, `pytest -v` and `--verbose`; the warning SHALL name the quiet form
(DEC-14, D-10).

#### Scenario: A gate run named in a brief
- **WHEN** a builder's brief names the gate command `make test`
- **THEN** the brief carries the one-line principle, and the gate prints the failures-and-errors summary, not one line per passing test

#### Scenario: A file read through the shell
- **WHEN** an agent runs `sed -n '40,80p' tools/repo_lint.py` or `cat AGENTS.md` through Bash
- **THEN** the `quiet-tools` mod shows a warning that names Read with offset and limit as the quiet form, and the command still runs

#### Scenario: A verbose test run
- **WHEN** an agent runs `pytest -v tests/` or `uv run pytest --verbose`
- **THEN** the mod warns and names `pytest -q -rfE`; the command is not denied

#### Scenario: Long output
- **WHEN** a command would print more than the lines that decide the next step, such as a 400-line test log
- **THEN** the agent sends the output to a file under `$TMPDIR` and reads back only the failing lines
- **AND** a `grep` that filters a command's output through a pipe raises no warning
