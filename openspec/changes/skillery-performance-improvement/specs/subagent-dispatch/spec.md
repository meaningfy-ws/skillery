## MODIFIED Requirements

### Requirement: A subagent starts fresh from a brief
A subagent SHALL start from a written brief, not from a copy of the coordinator's conversation; a copy
(a fork, where the CLI offers one) SHALL be used only for a short task whose need is nuance from the
conversation that would cost more to write down (DEC-1). The brief SHALL state the goal and why, the
inputs as paths rather than pasted content, what is already decided or ruled out — including
decisions made only in conversation — the scope and no-gos, and the report expected; where a written
artifact already holds the context, the brief SHALL point to it. A catalogue agent SHALL preload
one skill its role needs under `skills:` in its definition: builder `cosmic-python`, reviewer
`meaningfy-code-review`, checker `stage-check`. Whether the agent lists the `Skill` tool, and
whether its MCP tools are named exactly or by wildcard, SHALL follow the variant task 1.4 selects,
the one measured under 40 k tokens at start (D-3); when the exact-name variant is selected, builder
and fixer name the five Serena essentials `serena.get_symbols_overview`, `find_symbol`,
`find_referencing_symbols`, `replace_symbol_body`, `insert_after_symbol` and `ast-grep.find_code`;
reviewers the Serena read tools only. GitNexus tools SHALL be on the lead only. `ToolSearch` stays
for the rare tool outside the list. A read-only catalogue agent `checker` (Read, Grep, Glob, Bash;
role `checker`; `stage-check` preloaded) SHALL check finished work. Builder and fixer briefs SHALL
use the builder card
`epic-delivery/assets/templates/builder-brief.md` (at most 2 KB: task, design anchor, scenario
file, gate command, worktree path, rules, report shape), cite `cosmic-python` principles by id, and
carry Serena's five essential tool names; a subagent SHALL NOT call `initial_instructions`. No
budget, turn limit or stop rule SHALL be imposed; the task definition bounds the run (DEC-3, DEC-5,
DEC-13, D-3, D-15).

#### Scenario: A decision taken only in chat reaches the subagent
- **WHEN** the owner decided in conversation that a file is out of scope, and the task file does not
  say so
- **THEN** the brief states that decision

#### Scenario: Context already written down is pointed to
- **WHEN** the task, its design and its scenarios are in files
- **THEN** the brief names their paths and does not paste their content

#### Scenario: The implementer's definition
- **WHEN** `agents/implementer.md` is read
- **THEN** `skills:` lists `cosmic-python`; when 1.4 selected the no-Skill variant, `tools:` holds no `Skill`; when 1.4 selected exact names, `tools:` holds no `mcp__serena__*` and the five Serena essentials and `ast-grep.find_code` are named one by one

#### Scenario: A fixer brief
- **WHEN** the lead briefs a fixer for finding F-3
- **THEN** the brief follows the builder card, cites `PR-SRP` by id rather than the catalogue, names Serena's five essentials, and the fixer calls no `initial_instructions`

#### Scenario: The checker is read-only
- **WHEN** a `checker` agent is dispatched on a finished task
- **THEN** it has Read, Grep, Glob and Bash only and edits no file

### Requirement: The subagent's agent and model are the cheapest that fit
The coordinator SHALL use a catalogue agent when one fits the task (DEC-7). The model per role SHALL
be stated once, in `skills/guardrails/assets/model-matrix.json`, for the roles `lead`, `planner`,
`builder`, `fixer`, `reviewer-single`, `reviewer-merged`, `checker`, `cold-reader`, `explorer`,
`attack`, `gate-run-1`, `gate-run-2` and `spec-delta`: lead, planner, reviewer-merged, attack and
gate-run-1 on the large model; builder, fixer, reviewer-single, checker, cold-reader, gate-run-2 and
spec-delta on the mid model; explorer on the small model. Every catalogue agent SHALL declare
`metadata.role`, and its `model:` SHALL equal the matrix's model for that role; `make lint` SHALL
fail on a mismatch. Workflow definitions and briefs SHALL name roles, not models; `model_rank` stays
for the "one model up" rule. The owner MAY override a model for a session (DEC-5, DEC-6, DEC-15,
D-2).

#### Scenario: The implementer's model
- **WHEN** `agents/implementer.md` declares `metadata.role: builder`
- **THEN** its `model:` is the mid model the matrix names for `builder`

#### Scenario: A mismatch is caught
- **WHEN** an agent with role `checker` declares the large model
- **THEN** `make lint` fails naming the agent, the role and the matrix's model

#### Scenario: A workflow names a role
- **WHEN** the epic-delivery workflow file states who runs the attack
- **THEN** it names the role `attack` and no model

#### Scenario: A mechanical search runs on a cheaper model
- **WHEN** the task is to list every file that mentions a term
- **THEN** the coordinator dispatches an `explorer`, which the matrix puts on the small model

### Requirement: Dispatch and hygiene thresholds are data
The thresholds that make the subagent and session-hygiene rules checkable SHALL be stated once, as
data, in `skills/guardrails/assets/session-thresholds.json`: `fresh_offer_min_tokens` (90000),
`compact_offer_tokens` (150000) and `context_warn_tokens` (250000) in absolute tokens, with the
`*_percent` keys kept as the fallback when the CLI reports no token count; the idle time that makes
a free reset, the longest base report, the most tool calls a spawn may make and still count as a
lookup, the order of models from cheapest, and which events make a safe point, a task boundary and
a free idle reset. The navigator SHALL read `usage.context.tokens` first, the percent second, and
SHALL print the number it used. `guardrails` session hygiene SHALL name each key and point to the
file; no other file SHALL hold the numbers (D-1).

#### Scenario: A tool reads a threshold
- **WHEN** navigator decides whether to offer a compaction
- **THEN** it reads `compact_offer_tokens` from the guardrails data file and holds no number of its own

#### Scenario: A compaction offer in tokens
- **WHEN** the CLI reports a main-thread context of 160000 tokens
- **THEN** navigator offers a compaction at the next safe point, printing 160000 against `compact_offer_tokens`

#### Scenario: No token count
- **WHEN** the CLI reports no `usage.context.tokens`
- **THEN** navigator falls back to the percent key and its warning says that it did

#### Scenario: One file holds the numbers
- **WHEN** a contributor searches the skills for `150000`
- **THEN** it occurs in `session-thresholds.json` only

### Requirement: A stage boundary is a fresh session
At a stage boundary of a long epic session the coordinator SHALL end the session from a hand-over
note and the developer SHALL start the next stage in a fresh session; the coordinator SHALL NOT
compact between stages. Session hygiene SHALL win over a conflicting repository rule: a rule in
`docs/rules/` or the vault that keeps a session past a stage boundary SHALL NOT be followed, and the
lead SHALL note the conflict in the hand-over note. `rule-learner` SHALL flag a candidate rule that
conflicts with session hygiene on its approval card before the owner decides. `guardrails` session
hygiene SHALL point to the note's template in `epic-delivery` and SHALL NOT restate it (DEC-1,
DEC-4, D-1).

#### Scenario: A stage is merged
- **WHEN** a stage of an epic session is merged
- **THEN** the guidance is a hand-over note and a fresh session, not a compaction

#### Scenario: A question between stages
- **WHEN** the coordinator is asked whether to compact between stages
- **THEN** it answers by pointing to the hand-over note and the fresh session

#### Scenario: A repository rule keeps the session
- **WHEN** a rule in `docs/rules/` says that one session delivers the whole EPIC
- **THEN** the lead ends the session at the stage boundary anyway and notes the conflict under Open in `handover.md`

#### Scenario: A conflicting candidate rule
- **WHEN** the owner says "keep the same session for every stage" and `rule-learner` drafts it
- **THEN** the approval card flags the candidate as conflicting with session hygiene before the owner decides
