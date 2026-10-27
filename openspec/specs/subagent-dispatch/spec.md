# subagent-dispatch Specification

## Purpose
How a coordinating agent uses subagents as cheaply as the work allows, on both CLIs: it spawns
one only when it pays, starts it fresh from a brief, picks the agent and model, takes back the base
report, and has finished work checked by a second, fresh subagent.

## Requirements
### Requirement: The coordinator decides whether a subagent pays
Before dispatching a subagent, the coordinating agent SHALL judge whether the work is independent and
parallel, would flood its own context with reads, or needs an unanchored second read; it SHALL do the
work inline when it is a lookup of a few calls, a step that depends on another in sequence, or a
parallel task that would touch the same files as another (DEC-2). The judgement SHALL count the
setup cost each spawn pays, multiplied by the fan-out.

#### Scenario: A short lookup is not delegated
- **WHEN** the answer needs reading one known file and one search
- **THEN** the coordinator does it inline and spawns no subagent

#### Scenario: Parallel tasks that share files are serialised
- **WHEN** two ready tasks would both edit the same file
- **THEN** the coordinator runs them one after the other, not as parallel subagents

### Requirement: A subagent starts fresh from a brief
A subagent SHALL start from a written brief, not from a copy of the coordinator's conversation; a copy
(a fork, where the CLI offers one) SHALL be used only for a short task whose need is nuance from the
conversation that would cost more to write down (DEC-1). The brief SHALL state the goal and why, the
inputs as paths rather than pasted content, what is already decided or ruled out — including
decisions made only in conversation — the scope and no-gos, and the report expected; where a written
artifact already holds the context, the brief SHALL point to it (DEC-3). No budget, turn limit or stop
rule SHALL be imposed; the task definition bounds the run.

#### Scenario: A decision taken only in chat reaches the subagent
- **WHEN** the owner decided in conversation that a file is out of scope, and the task file does not
  say so
- **THEN** the brief states that decision

#### Scenario: Context already written down is pointed to
- **WHEN** the task, its design and its scenarios are in files
- **THEN** the brief names their paths and does not paste their content

### Requirement: The subagent's agent and model are the cheapest that fit
The coordinator SHALL use a catalogue agent when one fits the task (DEC-7). A subagent SHALL run on
the model its agent definition declares, otherwise on the caller's model; the caller MAY choose a
cheaper model when it judges the task clearly easy (DEC-6).

#### Scenario: A mechanical search runs on a cheaper model
- **WHEN** the task is to list every file that mentions a term
- **THEN** the coordinator may dispatch it on a cheaper model than its own

### Requirement: Every subagent returns the base report, extended per purpose
Every subagent SHALL return a report with: status (`done`, `partly done`, `blocked` or `failed`); the
answer; evidence as pointers (paths, lines, commands), not pasted content; what it did not check;
open questions; side effects; recommendations for actions it was not allowed to take. A report SHALL
add the fields of its purpose (exploring, researching, implementing, authoring, reviewing, verifying,
test-running) as listed in the `guardrails` reference. Material too long for the report SHALL go to a
file, and the report SHALL carry its path and a summary (DEC-4).

#### Scenario: A long crawl returns a pointer
- **WHEN** a research subagent gathers more findings than fit in its report
- **THEN** it writes them to a file and returns the path, a summary and the base fields

#### Scenario: A blocked implementer says so
- **WHEN** an implementing subagent cannot make a test pass without changing the plan
- **THEN** it returns status `blocked`, what it tried, and the question for the coordinator

### Requirement: The work is checked by a second pair of eyes
The coordinator SHALL use a subagent's report to decide what to do next, and SHALL NOT treat it as
proof the work is right. When a coherent unit of work is complete, the coordinator SHALL have it
checked by a fresh subagent that did not do it, against the task's spec and intention, good practice,
known anti-patterns and the other quality concerns that apply; the checker SHALL return the base
report extended for verifying (DEC-5).

#### Scenario: Authored work is checked before it is accepted
- **WHEN** an authoring subagent reports `done` on a skill
- **THEN** a different, fresh subagent checks the skill against its task and the standard before the
  coordinator accepts it

#### Scenario: Checks are not run after every step
- **WHEN** a unit of work is still half done
- **THEN** no checker is dispatched yet

### Requirement: The coordinator meets the discipline at session start
The discipline SHALL live in the `guardrails` skill, name no particular agent, and hold on both
Claude Code and opencode (DEC-8, DEC-11). The repository's `AGENTS.md` and the `AGENTS.md` template of
`project-setup` SHALL each mandate it in one line.

#### Scenario: A project set up from the template carries the mandate
- **WHEN** `project-setup` renders a new project's `AGENTS.md`
- **THEN** it contains the line that points subagent dispatch to `guardrails`

