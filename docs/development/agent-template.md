# Agent template — the agent authoring standard

The one canonical standard for an `agents/<name>.md` file in this repository. An agent is a **thin
wrapper**: role, job, dispatch contract and glue. Every reusable method lives in a skill (see
[`skill-repo-governance.md`](governance.md) placement rule 2). The validator checks this
standard (`agent_conformance` and `agent_bundle_membership` in `tools/repo_lint/lint.py`); the living
requirement is "Agents conform to the agent authoring standard" in
`openspec/specs/catalogue-governance/spec.md`. The skill counterpart is
[`skill-template.md`](skill-template.md).

## Frontmatter contract

A closed allowlist. Any other field fails the validator.

| Field | Required | Rule |
|---|---|---|
| `name` | yes | equals the filename stem |
| `description` | yes | starts with the persona phrase `<Persona> the <role>` (see *Workers*); one job in one sentence, then `Use when …`; may add `Not for …`; no `<example>` blocks; a `lead` or `scheduled` agent also says `Not for delegation` |
| `type` | yes | a key of `agentModes` in `tools/opencode-agent-map.json`: `delegated`, `lead` or `scheduled` (see *Types*) |
| `model` | yes | a family alias, a key of `modelAliases` in the same file (`opus`, `sonnet`, `haiku`); never a pinned model name |
| `skills` | yes | non-empty YAML list; the first local skill (no `:`, not external) is the agent's **primary skill** |
| `tools` | no | YAML list (`[Read, Grep]`); the comma-string form is rejected so every renderer sees one shape. Omitted, the agent uses the session's tools, MCP included (`implementer`, `code-reviewer`); allowed only when `disallowedTools` contains `Agent`, so inheriting is always a written choice and the agent cannot fan out |
| `disallowedTools` | no | YAML list |
| `color` | no | one of `red`, `blue`, `green`, `yellow`, `purple`, `orange`, `pink`, `cyan` |
| `metadata` | in practice yes | the six catalogue facets, as for skills (vocabulary in [`../facets.yaml`](../../facets.yaml)); not rendered for opencode. A change to `metadata` only is not behavioural and needs no new Gherkin scenario |
| anything else (`bundle`, `primary`, `permissionMode`, `memory`, `maxTurns`, …) | forbidden | see *Field adoption* |

After any frontmatter edit, run `make bundles` (the opencode catalogue carries the parsed frontmatter).

## Types

One job, three runtimes. The type decides what the dispatch contract must also state. How each type
is rendered on each CLI, and the recorded gaps, live in
[`../docs/environment/dual-cli/mapping.md`](../environment/dual-cli/mapping.md).

| `type` | The dispatch contract must also state |
|---|---|
| `delegated` | the unit of one run; consent-requiring actions are refused (returned as recommendations); open questions are returned, not asked |
| `lead` | which agents it delegates to (see *Workers*); its stop condition; `Not for delegation` in the description |
| `scheduled` | its triggers; where it writes its run record; that its writes are logged and reversible; `Not for delegation` in the description |

A `scheduled` agent MAY also be started interactively by a human. It stays one job and one contract:
**Input** lists its triggers (`schedule: …` and, if offered, `human session`); **Output** and **Side
effects** are the same for both; only in a human session may it ask questions directly.

Agent teams are composed at run time from `delegated` and `lead` agents; no team file is shipped.

## Workers

A **worker** is an agent of this catalogue with a persona name, a primary skill and, when its work
needs one, material kept in a repository outside skillery. There is no separate worker layer: the
agent file under this standard is the worker.

- **Persona form.** The role line is `You are **<Persona> the <role>**.` and the description starts
  with the same `<Persona> the <role>` phrase, for example "Tolic the lawyer". `<Persona>` is one
  capitalised ASCII word, without diacritics. The persona lives only in the text: the file and
  dispatch name stay the role (`agents/lawyer.md`, `name: lawyer`), and skill names never carry a
  persona. The agents are listed in the roster of
  [`catalogue-architecture.md`](catalogue-architecture.md#agent-roster).
- **A lead's primary skill is an activity skill**
  ([`creating-skills.md` § *Activity skills*](creating-skills.md#activity-skills)).
- **Workflows.** A workflow is an asset of its activity skill. A worker walks a workflow and never
  owns one: the workflow, the agent's tools and refusals, and its skills' rules together constrain
  it. Each workflow has exactly one lead worker
  ([`workflows.md` § *Workflow files*](workflows.md#workflow-files)).
- **Leads delegate.** Every agent of type `lead` may spawn subagents, so its `tools` include `Agent`
  and its `disallowedTools` do not deny it; it follows `guardrails`, *Subagent dispatch*. Its
  **Refuses** line names whom it delegates a job to, preferring a read-only subagent for a survey or
  a check. `Agent` stays unscoped: the opencode renderer has no analogue for `Agent(<type>)` and
  would drop the tool.
- **A lead loads its primary skill first.** A lead is the main session, and preloaded skills emit no
  load event, so its `## Glue` step 1 is: "Load `<primary skill>` with the Skill tool before anything
  else, so the session's workflow is shown."
- **Material lives outside.** Material a worker works from (contracts, infrastructure definitions)
  stays in its own repository, with its own rules in that repository's `AGENTS.md` and docs; how a
  worker operates such a repository is the [`corpus-repository`](../../skills/corpus-repository/SKILL.md)
  skill. Neither the agent file nor its skills copy the repository's rules. No configuration file
  names the repository: the agent's **Input** does.

## Dispatch contract

Every agent body has a `## Dispatch contract` section with these four bold labels, in this order:

- **Input:** what the caller must pass for one run.
- **Output:** what the agent returns — the only thing the caller sees.
- **Side effects:** what it may change (files, commands run); "none on files" when read-only.
- **Refuses:** what it will not do, and what it returns instead.

A `delegated` run returns once and has no channel to ask the human or obtain consent. So an action
that needs consent (committing, pushing, publishing) is a **refusal** returned as a recommendation,
and an open question is **returned** in the Output, never asked mid-run.

## Body

Sections in this order:

1. Role line: `You are **<Persona> the <role>**. <the job>.`
2. `## Skills` — one line per `skills:` entry saying what it is followed for. Never restate a skill:
   on one CLI it is preloaded, on the other loaded on demand; a copy is a second owner.
3. `## Dispatch contract` — the four labels above.
4. `## Report` — how the agent reports back: the base report of the `guardrails` skill plus the
   fields of its purpose, and what matters most in its report. It cites the base, never restates it.
5. `## Glue` (optional) — numbered steps that no skill owns. A `lead` has one, and its step 1 loads
   its primary skill (see *Workers*).

The body is the text after the frontmatter, leading and trailing blank lines stripped. Its length cap
is `MAX_AGENT_BODY_LINES` in `tools/repo_lint/lint.py`. The body is CLI-agnostic: no slash-command or
CLI config-directory paths (the same guard as skill bodies).

## Which bundle

`bundles.yaml` is the only declaration of an agent's bundle; the agent file carries no `bundle:`
field. An agent lives in exactly one bundle — the bundle that lists its **primary skill**. The
validator fails an agent in zero or several bundles, in a bundle without its primary skill, or with
no local skill at all.

## Deterministic before prose

A refusal that a tool restriction can enforce SHALL be enforced in `tools` / `disallowedTools`;
**Refuses** then states it. A refusal no field can enforce (for example, a read-only agent that keeps
`Bash` to run `git diff` and tests) is stated in **Refuses** and recorded as a residual risk.

## Tests

Each agent has `tests/features/agents/<name>.feature` (Gherkin, per the `bdd-gherkin` skill) with:

- a Background line ``Given the <name> agent is installed with skills `a`, `b`, …`` naming every
  `skills:` entry, backtick-delimited;
- at least one `Scenario Outline:` with `Examples:` — values in the table, variables in the steps.

The validator checks the shape. The scenarios are run by hand on each CLI when an agent changes and at
release.

## Field adoption

The decision record for agent fields beyond the contract. "Plugin-ignored" means Claude Code ignores
the field when the agent loads from a plugin, which is the only way this repository ships agents.

| Field | Plugin-ignored | Decision | opencode | Reason |
|---|---|---|---|---|
| `<example>` blocks in `description` | no | Not adopted | — | always in context; examples live in the `.feature` Examples tables and README invocations |
| `disallowedTools` | no | Adopted | `permission: deny`; some tools gapped | deterministic before prose; a specifier still removes the whole tool |
| `color` | no | Adopted, optional | mapped to a theme colour | cosmetic |
| `permissionMode` | yes | Not adoptable | — | ignored in plugins |
| `hooks` | yes | Not adoptable | — | ignored in plugins; hook intent lives in `hooks.yaml` |
| `mcpServers` | yes | Not adoptable | `opencode.json` `mcp` | ignored in plugins; MCP is an install concern |
| `maxTurns` | no | Recorded, not adopted | `steps` | no current agent needs a turn cap |
| `isolation: worktree` | no | Recorded, not adopted | no analogue | one task per dispatch; parallel runs are not shipped |
| `memory` | no | Deferred, deliberately | no analogue | Claude-only, so a convention learned on one CLI is invisible on the other; a stable convention belongs in the target project's `AGENTS.md` or a skill fix. The agent reports "conventions noticed" for the caller to promote instead. Revisit when the same convention is re-discovered in two or more recorded runs |
| `background`, `effort`, `autoCompactWindow`, `initialPrompt` | `initialPrompt`: yes | Not adopted | — | no current need |
| `skills:` preloaded in full | no | Fact | not an opencode field; rendered as a load-skills body line | why a body must not restate a skill |

A field moves to the contract only through a change that edits this table and the validator together.

## Candidate roles

A backlog, not a roster: a role is added only when a real job needs it, through this standard.

| Candidate | Nearest owner today | Note |
|---|---|---|
| gherkin-writer | `bdd-gherkin` skill | the method is owned; an agent only if a dispatched worker is needed |

## Skeleton

```markdown
---
name: <name>
description: >
  <Persona> the <role> <does one job, in one sentence>. Use when <trigger>. Not for <neighbouring job> (<other agent>).
type: delegated
model: sonnet
color: blue
tools: [Read, Grep, Glob]
skills:
  - <primary-skill>
  - <other-skill>
metadata:
  purpose: <purpose>
  area: <area>
  subject: <subject>
  posture: <posture>
  stage: <stage>
  maturity: <maturity>
---

You are **<Persona> the <role>**. <the job>.

## Skills
- `<primary-skill>` — <what it is followed for>.
- `<other-skill>` — <what it is followed for>.

## Dispatch contract
- **Input:** <what one run needs>.
- **Output:** <what it returns>.
- **Side effects:** <what it may change, or "none on files">.
- **Refuses:** <what it will not do, and what it returns instead>.

## Report
Returns the base report of `guardrails` (`references/subagent-reports.md`) plus the <purpose>
fields. What matters most: <what this agent's caller needs first>.

## Glue
1. (a `lead`) Load `<primary-skill>` with the Skill tool before anything else, so the session's
   workflow is shown.
2. <a step no skill owns>.
```
