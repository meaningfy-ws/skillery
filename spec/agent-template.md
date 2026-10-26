# Agent template — the agent authoring standard

The one canonical standard for an `agents/<name>.md` file in this repository. An agent is a **thin
wrapper**: role, job, dispatch contract and glue. Every reusable method lives in a skill (see
[`skill-repo-governance.md`](skill-repo-governance.md) placement rule 2). The validator checks this
standard (`agent_conformance` and `agent_bundle_membership` in `tools/repo_lint/lint.py`); the living
requirement is "Agents conform to the agent authoring standard" in
`openspec/specs/catalogue-governance/spec.md`. The skill counterpart is
[`skill-template.md`](skill-template.md).

## Frontmatter contract

A closed allowlist. Any other field fails the validator.

| Field | Required | Rule |
|---|---|---|
| `name` | yes | equals the filename stem |
| `description` | yes | one job in one sentence, then `Use when …`; may add `Not for …`; no `<example>` blocks; a `lead` or `scheduled` agent also says `Not for delegation` |
| `type` | yes | a key of `agentModes` in `tools/opencode-agent-map.json`: `delegated`, `lead` or `scheduled` (see *Types*) |
| `model` | yes | a family alias, a key of `modelAliases` in the same file (`opus`, `sonnet`, `haiku`); never a pinned model name |
| `tools` | yes | YAML list (`[Read, Grep]`); the comma-string form is rejected so every renderer sees one shape |
| `skills` | yes | non-empty YAML list; the first local skill (no `:`, not external) is the agent's **primary skill** |
| `disallowedTools` | no | YAML list |
| `color` | no | one of `red`, `blue`, `green`, `yellow`, `purple`, `orange`, `pink`, `cyan` |
| `metadata` | in practice yes | the six catalogue facets, as for skills (vocabulary in [`../facets.yaml`](../facets.yaml)); not rendered for opencode. A change to `metadata` only is not behavioural and needs no new Gherkin scenario |
| anything else (`bundle`, `primary`, `permissionMode`, `memory`, `maxTurns`, …) | forbidden | see *Field adoption* |

After any frontmatter edit, run `make bundles` (the opencode catalogue carries the parsed frontmatter).

## Types

One job, three runtimes. The type decides what the dispatch contract must also state. How each type
is rendered on each CLI, and the recorded gaps, live in
[`../docs/environment/dual-cli/mapping.md`](../docs/environment/dual-cli/mapping.md).

| `type` | The dispatch contract must also state |
|---|---|
| `delegated` | the unit of one run; consent-requiring actions are refused (returned as recommendations); open questions are returned, not asked |
| `lead` | which agents it may delegate to (or "none"); its stop condition; `Not for delegation` in the description |
| `scheduled` | its triggers; where it writes its run record; that its writes are logged and reversible; `Not for delegation` in the description |

A `scheduled` agent MAY also be started interactively by a human. It stays one job and one contract:
**Input** lists its triggers (`schedule: …` and, if offered, `human session`); **Output** and **Side
effects** are the same for both; only in a human session may it ask questions directly.

Agent teams are composed at run time from `delegated` and `lead` agents; no team file is shipped.

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

1. Role line: `You are the **<Role>**. <the job>.`
2. `## Skills` — one line per `skills:` entry saying what it is followed for. Never restate a skill:
   on one CLI it is preloaded, on the other loaded on demand; a copy is a second owner.
3. `## Dispatch contract` — the four labels above.
4. `## Glue` (optional) — numbered steps that no skill owns.

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
| `hooks` | yes | Not adoptable | — | ignored in plugins; hook intent lives in `hooks/inventory.yaml` |
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
| Work Shaper | `epic-planner` agent | the shaping role is already this agent's job |
| documenter | `technical-writing` skill (+ `clarity-gate` lightweight) | "update docs from code changes, keep them aligned to features or specs"; suggested model `haiku` |
| gherkin-writer | `bdd-gherkin` skill | the method is owned; an agent only if a dispatched worker is needed |

## Skeleton

```markdown
---
name: <name>
description: >
  <One job in one sentence.> Use when <trigger>. Not for <neighbouring job> (<other agent>).
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

You are the **<Role>**. <the job>.

## Skills
- `<primary-skill>` — <what it is followed for>.
- `<other-skill>` — <what it is followed for>.

## Dispatch contract
- **Input:** <what one run needs>.
- **Output:** <what it returns>.
- **Side effects:** <what it may change, or "none on files">.
- **Refuses:** <what it will not do, and what it returns instead>.

## Glue
1. <a step no skill owns>.
```
