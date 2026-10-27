> Derives from: the EPIC [`proposal.md`](proposal.md) (`subagent-dispatch`), decisions DEC-1…DEC-13.

## Context

Three things exist today:

- `guardrails` (in `meaningfy-core`) owns how far an agent may act, how its output is validated, and
  how untrusted input is handled. It says nothing about the coordinator's side of a subagent: when to
  spawn, what to give it, what it returns, who checks the work.
- Every catalogue agent has a `## Dispatch contract` with **Input / Output / Side effects / Refuses**,
  checked by `_agent_body_errors` in `tools/repo_lint/lint.py`. **Output** names *what* comes back,
  in one line; nothing says *how* it is structured.
- The EPIC and PLAN templates are the `meaningfy` OpenSpec schema: source in
  `skills/project-setup/assets/openspec-schema/meaningfy/` (`schema.yaml`, `templates/proposal.md`,
  `design.md`, `tasks.md`, `spec.md`), copied to `openspec/schemas/meaningfy/` by `make bundles`, and
  projected into every project `project-setup` sets up. Their guidance comments use method jargon
  ("golden thread", "altitude", "the bet", acronym lists) and give the appetite as
  "small / medium / large" or in weeks. `skills/epic-planning/references/epic-template.md` is a
  second, older template (`EPIC.md` / `PLAN.md` under a CLI folder) that nothing links to.

Measured motivation: [`inputs/A`](inputs/2026-10-27-A-session-usage.md).

## Goals / Non-Goals

**Goals:**
- A coordinator on either CLI meets the dispatch discipline at session start and applies it to any
  subagent (DEC-1…8, DEC-11).
- Every catalogue agent states how it reports back; the validator enforces it (DEC-9).
- An EPIC's appetite is a named size defined by depth and extent (DEC-10).
- The templates every project receives read in plain, precise language; one template remains
  (DEC-12, DEC-13).

**Non-Goals:** the EPIC's no-gos, unchanged — in particular no budgets or stop rules, no model tier
table, no script, no enforcement hook, no edits to archived EPICs, no heading or file renames in the
templates.

## Decisions

New choices made while planning (the EPIC's DEC-n are cited, not repeated):

- **D-1: Where the rules sit in `guardrails`.** A new section `### 5. Subagent dispatch` after the
  four guardrail types, in the same shape: one **Rule** list holding DEC-1…7 as seven short bullets,
  then a single shared **Enforced by** line. The base report and the per-purpose fields go in a new reference
  `skills/guardrails/references/subagent-reports.md`, so the skill body stays short. *Enforced by:*
  the binding mandate (session start), each agent's `## Report` section, and the validator check
  (D-3). Rejected: a separate skill (owner, DEC-8); putting the report fields in the skill body
  (too long for a section).
- **D-2: `guardrails` description and boundary.** The description gains one sentence and two
  triggers: "Also owns subagent dispatch: when to spawn, the brief, the model, the report back and
  the second check." Triggers: "should I spawn a subagent", "brief this subagent". The Boundary
  section names the external neighbours `superpowers:dispatching-parallel-agents` and
  `superpowers:subagent-driven-development`: they are execution harnesses; `guardrails` owns the
  dispatch rules they should follow. The "model tier" wording in *Decision bounds* and *How to use
  it* becomes "model (the agent's declared one, else the caller's)" (DEC-6). "A bounded budget" is
  removed from the *Decision bounds* rule (it contradicts the no-budgets no-go); spending money stays
  among the actions that need human confirmation, which the rule already lists. The heading "The
  three guardrail types" becomes "The guardrail types" (it already lists four). The description stays
  under 1024 characters.
- **D-2b: A Quick Start in `guardrails`.** The Definition of Done requires a Quick Start with one
  worked example; `guardrails` has none. A short `## Quick Start` is added: the worked brief below
  and the base report it gets back.
- **D-3: The agent `## Report` section.** Placed directly after `## Dispatch contract`. It lists
  only what is specific to the agent — which purpose extension applies and what matters most in its
  report — and cites the base report in `guardrails`; it does not restate the base fields. The
  dispatch contract's **Output** line stays as is (what is returned). The validator adds one check in
  `_agent_body_errors`: no `^## Report` heading outside fenced blocks → `"{rel}: no '## Report'
  section"`. Current agent bodies are 16–27 lines against a cap of 40, so a 3–5 line section fits.
- **D-4: The binding line.** In `AGENTS.md` (*Common Meaningfy practices*) and in
  `skills/project-setup/assets/templates/agentic/AGENTS.md.tmpl` (*Working conventions*):
  "**Subagents** — before spawning one, follow *Subagent dispatch* in the `guardrails` skill: spawn
  only when it pays, brief it fresh, take the base report back, and have finished work checked by a
  second subagent." `CLAUDE.md` is untouched (it imports `AGENTS.md`).
- **D-5: The appetite scale lives in `epic-planning`**, as a short section *Appetite* in `SKILL.md`
  (the table below). The schema instruction and the proposal template name the six sizes and point
  to the skill; they do not copy the definitions.
- **D-6: The plain-language rewrite is a word map**, applied to the comments and instructions only
  (table below). Headings, file names, `DEC-n` ids and the `- [ ]` task syntax stay.
- **D-7: Gherkin for the agents.** Adding `## Report` changes what each agent returns, which the
  method's rule on behavioural agent changes covers. The lightest form: one extra `Then` line in each
  agent's existing Scenario Outline in `tests/features/agents/<name>.feature` ("the run ends with
  the base report and the <purpose> fields"). No new scenario, no new step vocabulary.
- **D-9: Port the good parts of `epic-template.md`, then remove it** (DEC-13). Three of its
  practices enrich the schema templates, as guidance and table columns only (headings unchanged):
  each key decision in `proposal.md` states its rationale **and the alternative rejected**;
  `design.md`'s *Anti-patterns* becomes a `Don't | Do instead | Why` table; its *Error matrix* gains a
  *How it is detected* column. Its test-case table is not ported: scenarios live in the spec deltas.
- **D-10: The external dependency register.** `superpowers` is already registered in
  `dependencies.yaml` with `guardrails` among its users. The register's `summary` gains
  `dispatching-parallel-agents, subagent-driven-development`. The dispatch rules do not require
  `superpowers`; naming it as a neighbour adds no dependency.
- **D-8: Probes.** `tests/trigger_probes.yaml` gains a positive probe "should I spawn subagents for
  these four tasks, and what should each brief contain" → `guardrails`, and a near-miss "review this
  diff before I open the PR" → `meaningfy-code-review`, `near_miss_of: guardrails`.

## Algorithm / approach

### The appetite scale (D-5)

| Size | How deep and how extensive the solution may be |
|---|---|
| `TINY` | One concern in one place: sharpen a rule, fix a flaw. No new concept. |
| `SMALL` | One capability touched in a few places; existing structure reused as is. |
| `MEDIUM` | One new capability (a skill section, an agent, a check) with its tests and docs; neighbours touched lightly. |
| `LARGE` | Several related capabilities, or a new bundle; boundaries move between owners; existing artifacts migrate. |
| `VERY LARGE` | Cuts across the catalogue or the method; many artifacts migrate; delivered in stages. |
| `HUGE` | Reshapes the system or the method itself. Split into several EPICs before planning. |

The size is a judgement; the examples illustrate it. The appetite decides how far the solution goes:
when the work outgrows it, the shaper cuts scope or re-shapes the EPIC, never silently grows it.

### The base report (D-1, DEC-4)

```text
Status: done | partly done | blocked | failed
Answer: <the conclusion to what was asked, 1–3 sentences>
Evidence: <paths:lines, commands run — pointers, not content>
Not checked: <what was skipped; how sure it is>
Open questions: <decisions the coordinator must take>
Side effects: <files changed, commands with effects — or "none">
Recommendations: <actions it was not allowed to take>
```

Per-purpose fields, added below the base:

| Purpose | Adds |
|---|---|
| exploring | where the thing is, ranked; where it is *not* |
| researching | findings with sources and dates; a file path when long |
| implementing | tests run and their result; departures from the plan |
| authoring | files written; checks run (`make validate` or the project's); choices made that were not asked |
| reviewing | findings by severity with location and the rule they break; a verdict |
| verifying | the criteria checked; pass or fail per criterion; the gaps |
| test-running | per scenario or assertion: pass or fail; where the run's output is |

### A worked brief (DEC-3)

> Goal: implement task 3.2 of `openspec/changes/x/tasks.md` (why: the import fails on empty files).
> Read: `tasks.md` §3, `design.md` D-2, `tests/features/import.feature`. Already decided: the owner
> ruled out a new config key in chat today. Out of scope: the export path. Report: the base report
> plus the implementing fields.

### The plain-language word map (D-6)

| Jargon in the templates today | Plain wording |
|---|---|
| golden thread / "cite your parent" | name the EPIC (or requirement) this derives from |
| the bet / the shaped bet | the EPIC: the problem, the approach chosen, and its limits |
| ALTITUDE — … | "What belongs here: …" |
| Shape-Up sections / work shape / "Shape-Up EPIC" | the shaping sections / the EPIC |
| spine | the project's OpenSpec folder (`openspec/`) |
| unshaped | not ready to plan |
| "Inherited disciplines (SOLID, KISS/DRY, RFC-2119, SDD, TDD/BDD/GWT, SSOT) live in their skills" | "General engineering rules live in their own skills; cite them, do not repeat them." |
| GWT scenarios | scenarios written as *when … then …* |
| small / medium / large (appetite) | one of the six sizes in `epic-planning` |

## Anti-patterns

| Don't | Do instead | Why |
|---|---|---|
| ❌ Restate the base report in every agent's `## Report` | Cite it; list only the agent's own fields | One owner per fact |
| ❌ Name `code-reviewer` or any agent in the `guardrails` rules | Speak of "a subagent", "a checker" | Generic rules (owner) |
| ❌ Add a turn limit "just for implementers" | Sharpen the task definition | No budgets (owner) |
| ❌ Copy the appetite table into the templates | Name the sizes, point to `epic-planning` | One owner per fact |
| ❌ Rename template headings while de-jargoning | Change comments and instructions only | Headings are what OpenSpec and readers rely on |
| ❌ Edit `openspec/schemas/meaningfy/` by hand | Edit the `project-setup` source, run `make bundles` | It is a rendered copy; the gate fails on drift |
| ❌ Touch archived EPICs | Leave them | Archives are history (owner) |

## Error matrix

| Failure mode | Expected handling |
|---|---|
| An agent lacks `## Report` | `make validate` fails naming the agent |
| `## Report` appears only inside a fenced example | Not counted; the check strips fenced blocks first, as the dispatch-contract check does |
| The rendered schema copy differs from the source | `make validate` (`bundle_gates`) fails; run `make bundles` |
| The new `guardrails` description exceeds 1024 characters or breaks strict YAML | The frontmatter check fails; shorten or quote |
| A body CLI-ism ("fork" phrased as a Claude command, a `.claude/` path) | `body_agnosticism` fails; phrase neutrally ("where the CLI offers one") |
| An agent body passes 40 lines | The body cap fails; shorten the `## Report` section |
| A trigger probe names a skill that does not exist | The probe check fails |

All steps are file edits plus regeneration; each is safe to repeat.

## Risks / Trade-offs

- [The binding line is ignored when the coordinator never reads `guardrails`] → the line is in the
  always-loaded binding and the description triggers on spawning; accepted as advisory (no hook).
- [A ten-line report is too much for a tiny lookup] → the rule is "don't spawn" for tiny lookups.
- [The plain-language rewrite loses a precise meaning] → the word map keeps each meaning; the
  four-eyes check (task 6.2) compares old and new templates.
- [Removing `epic-template.md` loses content] → D-9 ports its good parts first; the rest is dropped
  on purpose: *Metadata* (the "Derives from" line names the parent), *Implementation log* (the
  `tasks.md` checkboxes and git history record it), *Glossary* (domain terms belong to the project's
  conceptual model, not to each EPIC), the *Status* block (OpenSpec tracks a change's state).

## Open Questions

None.
