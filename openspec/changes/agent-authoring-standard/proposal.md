# EPIC: Agent authoring standard — what an agent is here, how it is written, where it lives

> **Golden thread.** Parents: [`inputs/2026-10-25-session-findings.md`](inputs/2026-10-25-session-findings.md)
> (the human's own agent-design notes from opencode 2.0 tutorials, verbatim, plus the facts gathered on
> Claude Code subagents/agent teams and opencode agents), the human's **external agent-refinement
> notes** [`inputs/2026-03-16-agent-refinement-notes/`](inputs/2026-03-16-agent-refinement-notes/)
> and the vault assessment
> [`inputs/2026-10-22-claude-code-project-structure-impact.md`](inputs/2026-10-22-claude-code-project-structure-impact.md)
> (both landed 2026-10-26; see [`inputs/README.md`](inputs/README.md)). The existing precedent is the
> three thin wrappers in `agents/` and the `Agent` row of the four-artefact table in `AGENTS.md`.
> **PLAN:** [`design.md`](design.md) + [`tasks.md`](tasks.md); deltas under [`specs/`](specs/).
> **Depends on:** `single-source-distribution` DEC-3 (an agent belongs to exactly one bundle).
> **Consumed by:** `add-devops-bundle`, `add-sales-bundle` — their agents are the first written to this
> standard; `fix-accumulated-skill-defects` is independent.

## Appetite

**Small-to-medium.** One template, one governance section, one lint rule, three agents brought into
conformance. If it produces a fourth agent or a framework (BMAD-style role packs), the bet was
mis-shaped.

## Why

Skillery has a **skill** authoring standard (`spec/skill-template.md`, `spec/CREATING_SKILLS.md`,
`CONTRIBUTING.md`) and none for **agents**. The only rule is one table cell: "thin wrapper — role +
model + tools + skill list; no inlined knowledge". The three existing agents honour it unevenly (the
`code-reviewer` body carries a dispatch protocol; `implementer` carries none), nothing checks
thinness, and nothing says which bundle an agent belongs to, what input it expects, or what it returns.

Why now: two packages of new agents (devops, sales) are queued, and the human has refinement notes
for the existing three. Writing five or more agents without a standard produces five styles; the
sales agents additionally run in a different runtime (Claude Desktop / scheduler) that the current
"CLI subagent" assumption does not cover.

## Solution outline

1. **`spec/agent-template.md` (the one canonical home of the standard) + a short "Agents" section in
   the governance doc that points to it**: the frontmatter contract (name, description-as-trigger,
   model, tools, skills, type), a body limit, and the mandatory **dispatch contract** — what the agent
   expects as input, what it returns, and what it never does.
2. **A three-type taxonomy**, because the runtimes differ: *delegated* (a subagent spawned for one
   job, returns a result), *lead* (a primary agent that plans, delegates and synthesises), and
   *scheduled* (runs unattended on a trigger, reports to a note or channel). Each type names its
   Claude and opencode rendering, or records that one CLI has no equivalent.
3. **A lint rule** (`tools/repo_lint`) enforcing frontmatter completeness, body length, one-bundle
   membership, and that every skill an agent lists exists.
4. **The three existing agents re-cut to the template**, applying the human's refinement notes
   through it — the test that the standard fits real agents before new ones are written.

## Key decisions

- **DEC-1: Agents are thin and skills are thick — enforced, not advised.** An agent body states role,
  job, dispatch contract and glue only; any reusable method moves to a skill. Body length is capped
  (the number set in the template; the current longest body is the ceiling, not the target).
- **DEC-2: One job per agent.** An agent's description names one job in one sentence. "Review" is a
  job; "review and fix" is two agents (`code-reviewer` and `implementer`), which is already how the
  roster works. From the human's notes: "one job per agent, keep it focused".
- **DEC-3: Three agent types, declared in frontmatter: `delegated` | `lead` | `scheduled`.**
  Rendering: delegated → Claude subagent / opencode `mode: subagent`; lead → Claude primary session
  or agent-team lead / opencode `mode: primary`; scheduled → Claude scheduler or Cowork routine /
  opencode: no native equivalent, recorded as a gap. The type decides which runtime facts the
  dispatch contract must state.
  *Refined in PLAN (design.md D-8, D-9, D-17):* the scheduled trigger is external on both CLIs
  (`claude -p --agent`, `opencode run --agent`); Desktop/Cowork scheduled tasks load skills, not agent
  files; a scheduled agent may also be started interactively under the same contract.
- **DEC-4: Every agent carries a dispatch contract** (input it needs, output it returns, side effects
  it may have, what it refuses). Rationale: the `code-reviewer`'s "exactly one lens per run" rule is a
  dispatch contract hidden in prose; making it a section makes fan-out and chaining designable.
- **DEC-5 (re-shaped 2026-10-26): `bundles.yaml` is the only declaration of an agent's bundle; the
  agent's frontmatter carries no `bundle:` field.** The bundle is chosen by rule: an agent lives in
  the bundle that owns its **primary skill** (the first local skill in its `skills:` list). Lint fails
  when an agent is in zero or several bundles, or in a bundle that does not hold its primary skill.
  *Re-shape record:* the original DEC-5 ("names its bundle in frontmatter and `bundles.yaml` must
  agree") stated one fact in two places, which the single-source-of-authority rule forbids; once
  `single-source-distribution` DEC-2/DEC-3 made `bundles.yaml` the single bundle definition, the
  frontmatter field became a second copy. The bet (one bundle per agent, enforced) is unchanged.
- **DEC-6: Agent teams are not a packaging concern.** A team is composed at run time from agents of
  type `delegated`/`lead`; skillery ships roles, not team configs. Rationale: Claude agent teams are
  experimental, opencode has no equivalent, and a committed team file would be a third runtime surface.
- **DEC-7: The human's 10-role team list is a backlog, not a roster.** Roles are added only when a
  real job needs one, through this standard. The two roles with existing near-counterparts are
  recorded as the first candidates: *Work Shaper* (→ `epic-planner`, per `define-roles-and-raci`
  DEC-2R) and *documenter* (per the human's note: "update docs based on code changes, keep alignment
  to features or specs").
- **DEC-8: Agent tests live in skillery, in Gherkin** (Scenario Outlines with Examples tables),
  consistent with the human's decision for the sales agent; the template names where they go.

## Rabbit-holes

- **Do not adopt BMAD or OpenAgents Control as the standard.** Both were reviewed (inputs §4): BMAD
  overlaps Shape Up + OpenSpec + clarity-gate and has been redesigned repeatedly; OAC targets opencode
  v1 and announces a major overhaul. Borrow the approval-gate and context-scout *ideas* only.
- **Do not write an "agent builder".** Both CLIs already generate an agent from a description
  (`/agents`, `opencode agent create`); the standard is what the generated file must conform to.
- **Do not encode model names as truth.** Frontmatter uses family aliases (`opus`, `sonnet`, `haiku`);
  the opencode mapper resolves them, as today.
- **Do not model agent permissions beyond tools.** opencode's ordered permission rules have no Claude
  equivalent; record as a mapping gap, do not invent a neutral permission language.

## No-gos

- **No new agents.** The devops and sales agents are their own EPICs.
- **No skill changes** beyond moving inlined knowledge out of an agent body into the skill that owns
  it, if conformance requires.
- **No team orchestration tooling, no run-time configs.**
- **No adoption of further Claude-only agent fields** (`permissionMode`, `maxTurns`, `isolation`,
  `memory`, `hooks`, `mcpServers`, `background`, `effort`) in this change. Each is recorded in the
  template's field-adoption table with its opencode mapping or gap, ready for the first agent that
  needs it (design.md D-5).

---

## What Changes

- Add `spec/agent-template.md` (canonical standard); add a pointer-only **Agents** section to
  `spec/skill-repo-governance.md` and rewrite its placement rule 2; point
  `docs/development-method.md` §4/§5/§8 at the template instead of restating it.
- Add one `agent_conformance` check to `tools/repo_lint` (plus a primary-skill clause in the sibling's
  agent-membership check), with one negative test per message.
- Re-cut `agents/epic-planner.md`, `agents/implementer.md`, `agents/code-reviewer.md` to the template,
  applying the external refinement notes; move displaced knowledge into its owning skill (one line
  into `meaningfy-code-review`).
- Update the opencode agent renderer (`renderAgent` + `tools/opencode-agent-map.json`, per the sibling's
  Cross-EPIC contract) for `type`, and correct its `skills`/`color` output.
- Gherkin scenarios for the three agents under `tests/features/agents/`.
- One README paragraph under "Getting started" linking the agent standard next to the skill one.

No breaking install changes. Three behaviour changes users notice (CHANGELOG): `implementer` no longer
commits (the caller does); `code-reviewer` needs one lens per dispatch; `epic-planner` stays delegated
and returns question rounds to the caller (`lead` is its recorded target, design.md D-8).

## Capabilities

### New Capabilities

- None. The proposal's `agent-authoring` capability is folded into `catalogue-governance` as one
  requirement (design.md D-1: the smaller option; the standard's text lives in `spec/agent-template.md`).

### Modified Capabilities

- `catalogue-governance`: ADDED requirement "Agents conform to the agent authoring standard".
- `dual-cli-generation`: ADDED requirement "Agent type is rendered per CLI"; `scheduled` is a recorded
  opencode gap.

## Impact

- **Files:** `spec/`, `agents/` (3), `tools/repo_lint`, `tests/`, the opencode mapper, README.
- **Siblings:** `add-devops-bundle` and `add-sales-bundle` are blocked until this ships.
- **Vault:** the agentic pilot (subagents on a real repo; one agent-team run of the five-lens review)
  is an experiment recorded in the human's vault project, not in this repo; only a decision would
  come back as a change.
