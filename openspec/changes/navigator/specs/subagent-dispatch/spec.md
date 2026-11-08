## ADDED Requirements

### Requirement: Dispatch and hygiene thresholds are data
The thresholds that make the subagent and session-hygiene rules checkable — the context use at
which a compaction is offered at a safe point, the context use that warns mid-step, the least
context worth a fresh session, the idle time that makes a free reset, the longest base report, and
the most tool calls a spawn may make and still count as a lookup, the order of models from
cheapest, and which events make a safe point, a task boundary and a free idle reset — SHALL be stated once, as data, in
`skills/guardrails/assets/session-thresholds.json`. Sections 5 and 6 of `guardrails` SHALL name each
key and point to the file; no other file SHALL hold the numbers.

#### Scenario: A tool reads a threshold
- **WHEN** navigator decides whether to offer a compaction
- **THEN** it reads the compact key from the guardrails data file and holds no number of its own

## MODIFIED Requirements

### Requirement: Every subagent returns the base report, extended per purpose
Every subagent SHALL return a report with: status (`done`, `partly done`, `blocked` or `failed`); the
answer; evidence as pointers (paths, lines, commands), not pasted content; what it did not check;
open questions; side effects; recommendations for actions it was not allowed to take. A report SHALL
add the fields of its purpose (exploring, researching, implementing, authoring, reviewing, verifying,
test-running) as listed in the `guardrails` reference. Material too long for the report SHALL go to a
file, and the report SHALL carry its path and a summary (DEC-4). A report longer than the
report-length key of the guardrails data file is oversized.

#### Scenario: A long crawl returns a pointer
- **WHEN** a research subagent gathers more findings than fit in its report
- **THEN** it writes them to a file and returns the path, a summary and the base fields

#### Scenario: A blocked implementer says so
- **WHEN** an implementing subagent cannot make a test pass without changing the plan
- **THEN** it returns status `blocked`, what it tried, and the question for the coordinator

#### Scenario: An oversized report is flagged
- **WHEN** a subagent's report runs past the report-length key
- **THEN** navigator shows an oversized-report warning naming the subagent
