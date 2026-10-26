<!-- PLAN (design half). PLAN = this file + tasks.md. The clarity gate scores the pair (≥9/10).
     Document type: Implementation. Revision 2 (2026-10-26): folds in review-hardening.md and the
     team-lead's binding decisions; see "Review disposition" at the end. -->

> Parent: [`openspec/changes/agent-authoring-standard/proposal.md`](proposal.md) (EPIC, DEC-1…DEC-8).
> Binding interface: the **Cross-EPIC contract** of `single-source-distribution`
> ([`review-hardening.md` §Cross-EPIC contract](../single-source-distribution/review-hardening.md#cross-epic-contract),
> carried into [its `design.md`](../single-source-distribution/design.md)). Review folded in:
> [`review-hardening.md`](review-hardening.md).

## Context

Verified by direct read on 2026-10-26 (branch `feat/single-source-and-agent-standard`):

| Fact | Where | Value |
|---|---|---|
| Agent bodies (text after the frontmatter, leading/trailing blank lines stripped) | `agents/*.md` | `implementer` 40 lines; `code-reviewer` 33; `epic-planner` 22 |
| Primary skill of each agent → bundle | `marketplace.json` today, `bundles.yaml` after the sibling | `meaningfy-code-review`, `cosmic-python`, `epic-planning` are all in `meaningfy-building` |
| Agent checks today | `tools/repo_lint/lint.py` | `agent_skill_alignment`, `orphan_agent_references` (uses `ALL_AGENT_NAMES`, which still lists `documenter`, `gherkin-writer`) |
| Check shape | `tools/repo_lint/lint.py` docstring | pure `(repo: Path) -> list[str]` in `ALL_CHECKS`, reported as `<fn>: <message>` |
| Negative tests | `tests/test_repo_lint_negative.py` | synthetic repo in `tmp_path` per check |
| Gherkin home | `tests/features/` | `release_projection.feature`, mirrored by plain pytest (no `pytest-bdd`) |
| Reviewer procedure owner | `skills/meaningfy-code-review/SKILL.md` §Dispatch contract, §Review procedure, §Output format | covers all `code-reviewer` *Process* steps except "run the test suite for L2"; step 4: "If gitnexus is unavailable, warn and proceed" |
| `docs/development-method.md` | untracked (`git status` `??`), the human's draft; also measured by `skill-crafting-method` | §4, §5 agent bullet, §8 are this change's edit zone (Cross-EPIC contract item 6) |

**Verified vendor facts** (docs read 2026-10-26 by the reviewer, quoted in review-hardening.md §A, §6–§8):

| # | Fact | Source |
|---|---|---|
| V-1 | `claude --agent <name>` starts a session "where the main thread itself takes on that subagent's tool restrictions and model"; persistent form `"agent": "<name>"` in settings | <https://code.claude.com/docs/en/sub-agents> ("Run the whole session as a subagent"); <https://code.claude.com/docs/en/cli-reference> (`--agent`) |
| V-2 | "Claude Code ignores a field it doesn't recognize without reporting an error" — `type:` loads | sub-agents page, frontmatter reference |
| V-3 | Subagents lose `AskUserQuestion` even when listed in `tools` | sub-agents page ("The first filter removes these tools…") |
| V-4 | "plugin subagents don't support the `hooks`, `mcpServers`, or `permissionMode` frontmatter fields. These fields are ignored when loading agents from a plugin" | sub-agents page |
| V-5 | A `disallowedTools` entry with a specifier "still removes the whole tool" | sub-agents page |
| V-6 | opencode agent options: description, temperature, steps, disable, prompt, model, tools (deprecated), permission, mode, hidden, task permissions, color; others pass to the provider. **No `skills` field.** `color` = hex or theme colour (`primary`, `secondary`, `accent`, `success`, `warning`, `error`, `info`) | <https://opencode.ai/docs/agents/> |
| V-7 | Claude agent `color` closed set: `red, blue, green, yellow, purple, orange, pink, cyan` | sub-agents page |

**Cross-EPIC contract (binding, replaces revision 1's A-1).** After `single-source-distribution`:
`bundles.yaml` (top level `name`, `owner`, `description`, `bundles`; each bundle `name`, `description`,
`skills`, `agents` as bare stems; no `bundle:` frontmatter); `tools.bundle_gen.gen.load(repo)` is the
only Python parser; `tools/opencode_gen` is deleted; the mapping tables live only in
`tools/opencode-agent-map.json` (`modelAliases`, `toolNames`, `toolPermission`, + this change's
`agentModes`), rendered by `renderAgent(text) -> {content, gaps}` in `tools/opencode-bundle-lib.mjs`,
tested in `tests/opencode-bundle-installer.test.mjs`; the sibling's `agent_bundle_membership` lint
owns "exactly one bundle / listed agent has a file", this change adds only the primary-skill clause;
Claude agent loading is tested from a pushed branch only. **Contract amendment** (sibling design.md
§Cross-EPIC contract, lead decision 7): agent frontmatter is parsed once, strictly, in Python by
`bundle_gen.agent_frontmatter` (which also checks the model alias) and written to
`tools/opencode-catalogue.json` `agents.<stem>`; `renderAgent(frontmatter, body, map)` reads
`frontmatter.type`; `make bundles` runs after any agent frontmatter edit. Task 0.1 verifies each item.

## Goals / Non-Goals

**Goals:**
- One canonical agent standard (`spec/agent-template.md`); the living spec requires conformance to it;
  every doc points to it.
- One lint function (`agent_conformance`) plus the primary-skill clause in the sibling's membership
  check, so a non-conforming agent fails `make validate`.
- The three agents re-cut to the standard, each ≤ 30 body lines, displaced facts landing in their
  owning skill.
- `type` rendered per CLI by `renderAgent`, and the false opencode facts (`skills`, `color`) corrected.

**Non-Goals:**
- New agents (documenter, gherkin-writer, Work Shaper stay backlog — D-13).
- An LLM harness executing agent `.feature` files.
- Claude-only agent fields beyond the contract (D-5); team, scheduler or run-time configs (DEC-6).
- Moving `epic-planner` to `lead` now (D-8).

## Decisions

Settled in the EPIC — cited, not re-argued: DEC-1 · DEC-2 · DEC-3 · DEC-4 · DEC-5 re-shaped · DEC-6 ·
DEC-7 · DEC-8.

**D-1. No new capability.** `catalogue-governance` gets one ADDED requirement ("Agents conform to the
agent authoring standard"); `dual-cli-generation` gets one ADDED requirement ("Agent type is rendered
per CLI"), worded against the opencode agent renderer (Cross-EPIC contract item 5). The one-bundle rule
is the sibling's requirement; this change cites it and adds only the primary-skill clause.

**D-2. One home per fact.**

| Home | Holds | Must not hold |
|---|---|---|
| `openspec/specs/catalogue-governance/spec.md` (living, after archive) | "every agent SHALL conform to `spec/agent-template.md`; the validator rejects non-conformance" + concrete scenarios | field lists, the cap number, rendering |
| `spec/agent-template.md` | the normative standard: frontmatter contract, types + per-type contract extras, dispatch contract, body skeleton, bundle rule, deterministic before prose, tests, field adoption, candidate roles | the cap **number** (it names the constant); per-CLI rendering columns |
| `tools/repo_lint/lint.py` `MAX_AGENT_BODY_LINES` | the cap number (40) | — |
| `tools/opencode-agent-map.json` | every Claude→opencode value table (aliases, tools, permissions, `agentModes`, `colors`) | rules |
| `docs/environment/dual-cli/mapping.md` | per-CLI rendering of contract fields and the recorded gaps (G-1…G-5) | which fields are allowed, or why |
| `spec/skill-repo-governance.md`, `AGENTS.md` | the Agent row and rule 2: "Thin wrapper — see `spec/agent-template.md`" (+ rule 2's justification sentence in governance only) | the standard |
| `docs/development-method.md` | the agent lifecycle (§4) | — its other restatements (§2.2, §4 bullets, §5, §9) are accepted derivations until `skill-crafting-method` half two reduces the doc (that EPIC's No-go protects the draft) |

**D-3. The frontmatter contract (closed allowlist).**

| Field | Required | Rule |
|---|---|---|
| `name` | yes | equals the filename stem |
| `description` | yes | one job in one sentence, then `Use when …`; may add `Not for …`; no `<example>` blocks; a `lead` or `scheduled` agent also says `Not for delegation` |
| `type` | yes | a key of `agentModes` in `tools/opencode-agent-map.json` (`delegated`, `lead`, `scheduled`) |
| `model` | yes | a key of `modelAliases` (`opus`, `sonnet`, `haiku`) — checked by the sibling's `bundle_gen.agent_frontmatter`, not re-checked here |
| `tools` | yes | YAML list (the comma-string form Claude also accepts is rejected, so every renderer sees one shape) |
| `skills` | yes | non-empty YAML list; the first local skill is the **primary skill** |
| `disallowedTools` | no | YAML list |
| `color` | no | one of V-7 |
| anything else (incl. `bundle`, `primary`, `permissionMode`, `memory`, `maxTurns`) | forbidden | — |

Python reads `tools/opencode-agent-map.json` with `json.load` for the `agentModes` key set — never
imports or parses the `.mjs` (Cross-EPIC contract item 3). Frontmatter is read through
`bundle_gen.agent_frontmatter` (one strict parser), not lint's tolerant `_frontmatter`.

**D-4. Bundle rule.** Membership comes from `tools.bundle_gen.gen.load(repo)["bundles"]`. Primary skill
= the first `skills:` entry with no `:` and not in `EXTERNAL_SKILLS`. The clause lives in the sibling's
`agent_bundle_membership`: the agent's one bundle must list its primary skill.

**D-5. Claude-only fields from the refinement notes — the decision record** (the template's
*Field adoption* table is the normative copy):

| Field (source) | Plugin-ignored (V-4) | Decision | opencode | Reason |
|---|---|---|---|---|
| `<example>` blocks in `description` (all three notes) | no | Not adopted | — | always in context; examples live in the `.feature` Examples tables and README invocations |
| `disallowedTools` (code-reviewer note) | no | Adopted (in use) | `permission: deny`; `NotebookEdit` gapped | deterministic before prose; specifiers remove the whole tool (V-5) |
| `color` (all notes) | no | Adopted, optional, V-7 set | `colors` table → theme colour | cosmetic; raw names are invalid on opencode (V-6) |
| `permissionMode` (vault §3.9, infra-ops) | **yes** | Not adoptable | — | skillery ships agents only as plugins, where it is ignored |
| `hooks` | **yes** | Not adoptable | — | ignored in plugins; hook intent is single-sourced in `hooks/inventory.yaml` |
| `mcpServers` | **yes** | Not adoptable | `opencode.json` `mcp` (documented) | ignored in plugins; MCP is an install concern |
| `maxTurns` | no | Recorded, not adopted | `steps` | no current agent needs a turn cap |
| `isolation: worktree` (vault §6, implementer) | no | Recorded, not adopted | no analogue | `implementer` runs one task per dispatch; parallel runs are the vault pilot |
| `memory: project` (vault §3.7, implementer note "Update MEMORY.md") | no | **Deferred, deliberately** — see D-14 | no analogue | — |
| `background`, `effort`, `autoCompactWindow`, `initialPrompt` | `initialPrompt`: yes | Not adopted | — | no current need |
| `skills:` preloaded in full | no | Fact | **not supported** (V-6) → rendered as a body line (D-15) | why a body must not restate a skill |

**D-6. Deterministic before prose.** A refusal that a tool restriction can enforce SHALL be enforced in
`tools`/`disallowedTools`; **Refuses** then states it. One home: the template; governance rule 2 links
to it (the vault asked for a governance "third leg"; a link keeps one copy). Not linted. Residual risk
recorded: `code-reviewer` keeps `Bash` (its procedure runs `git diff`, tests, impact queries), and no
plugin-honoured field can make `Bash` read-only (V-4, V-5).

**D-7. Delegated agents have no consent channel and cannot ask.** A delegated run returns once and has
no `AskUserQuestion` (V-3). So consent-requiring actions are **refusals** returned as recommendations,
and open questions are **returned**, not asked. Consequences: `implementer` stops committing (the caller
commits per `meaningfy-git-workflow`); `epic-planner` returns question rounds (D-8); `code-reviewer`
refuses a no-lens dispatch (D-16).

**D-8. `epic-planner` stays `delegated`; `lead` is its recorded target.** Evidence against `lead` now:
- G-1: Claude has no per-file guard; the main thread still auto-delegates a `lead` agent by its
  description, where it loses `AskUserQuestion` (V-3) — the failure `lead` was meant to fix.
- G-2: under `--agent` the agent's `tools` restrict the human's whole session (V-1); the `/opsx`
  commands need `Bash(openspec:*)` and more, so the list would have to cover every flow the human runs.
- G-3: skill preload under `--agent` was reported broken (Claude Code 2.1.63 issue, closed 2026-04-16
  with no documented outcome); unverified.
What works today on both CLIs: delegated, with **question rounds returned to the caller**. Output is
either a question round (numbered questions grouped by concern, each with options and a recommended
answer) or the artefacts plus the scorecard; the caller relays the human's answers and re-dispatches
with the same change id. This keeps `epic-planning` step 2 ("one concern at a time", "summarise and
confirm") working through the caller. `AskUserQuestion` leaves its `tools` (filtered anyway, V-3);
`Edit` (refining an existing change), `Bash` (`openspec validate --strict`) and `Skill`
(`superpowers:brainstorming`, used by `epic-planning` step 2) join. Revisit `lead` when G-1…G-3 close.

**D-9. Types: contract extras (template) and rendering (mapping.md only).**

| `type` | Dispatch contract must also state | Claude rendering | opencode rendering (`agentModes`) |
|---|---|---|---|
| `delegated` | the unit of one run; consent actions refused; questions returned (D-7) | subagent spawned by the caller | `subagent` |
| `lead` | which agents it may delegate to (or "none"); its stop condition; `Not for delegation` in the description | `claude --agent meaningfy-<bundle>:<name>` (V-1); gaps G-1, G-2 | `primary` |
| `scheduled` | its triggers (D-17); where it writes its run record; that writes are logged and reversible; `Not for delegation` | external scheduler (cron, CI schedule) runs `claude -p --agent meaningfy-<bundle>:<name> "<trigger prompt>"`; gap G-4: Claude Desktop / Cowork scheduled tasks load skills, not agent files (vault §4) | `subagent` + per-agent gap "type 'scheduled': opencode has no scheduler; run `opencode run --agent <name>` from an external scheduler" (G-5) |

`type` is never emitted into the opencode file.

**D-10. Body skeleton; the cap.** Sections in order: role line (`You are the **<Role>**. <the job>.`);
`## Skills` (one line per skill: what it is followed for); `## Dispatch contract` (bold labels
`**Input:**`, `**Output:**`, `**Side effects:**`, `**Refuses:**`); optional `## Glue` (numbered steps no
skill owns). Cap: `MAX_AGENT_BODY_LINES = 40`, measured as `len(body.strip("\n").splitlines())`. Kept at
40 (not the ≤ 30 re-cut target) for one named consumer: a `scheduled` composite contract (two triggers,
run record, reversibility) for `add-sales-bundle`.

**D-11. Agent tests.** `tests/features/agents/<agent>.feature`, with ≥ 1 `Scenario Outline:` +
`Examples:` and a Background line ``Given the <agent> agent is installed with skills `a`, `b`, …``
naming every `skills:` entry backtick-delimited. Lint checks the shape; the scenarios are run by hand
per CLI in task 6.2 and at release (method §9).

**D-12. CLI-agnostic agent bodies.** `agent_conformance` applies the existing `_CLI_ISM` regex to agent
bodies; no allowlist. The re-cut removes `implementer`'s `.claude/memory/epics/…`.

**D-13. documenter / gherkin-writer = DEC-7 backlog.** Their method is already owned: documenter →
`technical-writing` (+ `clarity-gate` lightweight); gherkin-writer → `bdd-gherkin`. Listed in the
template's *Candidate roles* (documenter: note suggests `haiku`; Work Shaper → `epic-planner`). Because
DEC-7 brings the names back, they leave `ALL_AGENT_NAMES` (they are candidates, not retired names);
otherwise `orphan_agent_references` fires on the template.

**D-14. Agent memory: deliberate deferral, diverging from vault §3.7.** The vault assessment says "for
build agents, native agent memory is reasonable". Deferred because: (a) `memory` is Claude-only, so a
convention learned on Claude is invisible on opencode, against "both CLIs, one source"; (b) a stable
convention's durable home is the target project's binding (`AGENTS.md`) or a skill fix through the
issue loop, both reviewable. The note's job ("record stable patterns") is kept, not dropped:
`implementer`'s **Output** carries "conventions noticed", which the caller promotes. Revisit trigger:
the vault agentic pilot records the same convention re-discovered in ≥ 2 runs.

**D-15. opencode rendering corrections (extend `renderAgent` + the JSON).** Stop emitting `skills`
(V-6); append to the rendered body one line `Load these skills first with the skill tool: \`a\`, \`b\`.`
(mapped, not gapped: the skills still load, on demand). Add `toolNames.Skill = "skill"`. Add
`colors = {red: error, blue: info, green: success, yellow: warning, purple: secondary, orange: warning,
pink: accent, cyan: primary}`. `AskUserQuestion` is used by no re-cut agent; its gap row stays as is.

**D-16. `code-reviewer` trigger.** A dispatch with no lens or several lenses is refused with
"one lens required (L1–L5)"; the main thread follows `meaningfy-code-review` §Dispatch contract to fan
out five. User-visible (CHANGELOG + README example).

**D-17. `scheduled` composite (sales).** A `scheduled` agent MAY also be started interactively by the
human (Claude `claude --agent …`; opencode `opencode --agent <name>`). It stays one job and one
contract: **Input** lists its triggers (`schedule: …` and, if offered, `human session`), **Output** and
**Side effects** are the same for both; only in a human session may it ask questions directly. This is
what `add-sales-bundle` DEC-2 needs ("type `scheduled` … with a `lead`-style interactive mode"); no
type list, no second agent.

## Algorithm / approach

### `agent_conformance(repo)` (`tools/repo_lint/lint.py`)

Returns [] when `agents/` is absent. Constants: `MAX_AGENT_BODY_LINES = 40`, `AGENT_REQUIRED_FIELDS`
(`name, description, type, model, tools, skills`, in this order), `AGENT_OPTIONAL_FIELDS`
(`disallowedTools, color`), `CLAUDE_AGENT_COLORS` (V-7). Helper `_agent_map(repo)` = `json.load` of
`tools/opencode-agent-map.json`. Per `agents/<f>.md`, in this order (M5 is intentionally absent: the alias check is the sibling's):

| # | Fails when | Message | Negative test (`tests/test_repo_lint_negative.py`) |
|---|---|---|---|
| M1 | a required field is absent (one message per field) | `agents/<f>: missing required frontmatter field '<field>'` | `test_agent_missing_field_is_flagged` |
| M2 | a field outside D-3 | `agents/<f>: frontmatter field '<k>' is not in the agent contract (spec/agent-template.md)` | `test_agent_bundle_field_is_flagged` |
| M3 | `name` ≠ stem | `agents/<f>: name '<n>' does not match the filename` | `test_agent_name_mismatch_is_flagged` |
| M4 | `type` not in `agentModes` | `agents/<f>: type '<v>' is not one of <sorted keys>` | `test_agent_bad_type_is_flagged` |
| M6 | `tools`, `skills` or `disallowedTools` not a list | `agents/<f>: '<k>' must be a YAML list` | `test_agent_tools_string_is_flagged` |
| M7 | `color` not in V-7 | `agents/<f>: color '<v>' is not a Claude agent colour` | `test_agent_bad_color_is_flagged` (`magenta`) |
| M8 | description lacks `use when` (case-insensitive) | `agents/<f>: description must say when to use the agent ('Use when …')` | `test_agent_description_without_use_when_is_flagged` |
| M9 | description contains `<example>` | `agents/<f>: description carries <example> blocks; examples belong in tests/features/agents/<name>.feature` | `test_agent_description_example_block_is_flagged` |
| M10 | `type` is `lead`/`scheduled` and description lacks `not for delegation` | `agents/<f>: a <type> agent's description must say 'Not for delegation'` | `test_lead_without_not_for_delegation_is_flagged` |
| M11 | body lines > `MAX_AGENT_BODY_LINES` | `agents/<f>: body is <n> lines (> <cap>)` | `test_agent_body_over_cap_is_flagged` (cap + 1; and cap lines passes) |
| M12 | no `## Dispatch contract` heading | `agents/<f>: no '## Dispatch contract' section` | `test_agent_without_dispatch_contract_is_flagged` |
| M13 | a label missing inside that section (up to the next `## `) | `agents/<f>: dispatch contract has no '**<Label>:**'` | `test_agent_contract_missing_refuses_is_flagged` |
| M14 | body matches `_CLI_ISM` | `agents/<f>: body has a CLI-specific (/opsx: or .claude/) reference` | `test_agent_body_cli_ism_is_flagged` |
| M15 | no `tests/features/agents/<name>.feature` | `agents/<f>: no tests/features/agents/<name>.feature` | `test_agent_without_feature_is_flagged` |
| M16 | feature lacks `Scenario Outline:` or `Examples:` | `tests/features/agents/<name>.feature has no Scenario Outline with Examples` | `test_agent_feature_without_outline_is_flagged` |
| M17 | the Background `installed with skills` line lacks `` `<s>` `` for a `skills:` entry | `tests/features/agents/<name>.feature Background does not name skill '<s>'` | `test_agent_feature_missing_skill_is_flagged` |

Primary-skill clause, added to the sibling's `agent_bundle_membership` (D-4):

| # | Fails when | Message | Negative test |
|---|---|---|---|
| P1 | the agent's bundle does not list its primary skill | `agent '<a>' is in bundle '<b>' but its primary skill '<s>' is not` | `test_agent_primary_skill_in_other_bundle_is_flagged` |
| P2 | no local skill in `skills:` | `agent '<a>' has no local primary skill` | `test_agent_without_local_skill_is_flagged` |

`agent_conformance` goes into `ALL_CHECKS` after `agent_skill_alignment`. `tests/test_repo_lint.py`
gains `test_agents_conform_to_standard` (real repo → []). Worked example: `agents/x.md` with
`name: x / description: Reviews. / model: opus / tools: Read, Grep / skills: [cosmic-python] /
bundle: b` and no body yields, in order: M1 `type`; M2 `bundle`; M6 `tools`; M8; M12; M15. (`model: gpt`
would be reported by the sibling's `agent_frontmatter` alias check.)

### `renderAgent(frontmatter, body, map)` (`tools/opencode-bundle-lib.mjs`) + `tools/opencode-agent-map.json`

Ensure `bundle_gen` carries `type` into `tools/opencode-catalogue.json` `agents.<stem>` (extend its field
list if it whitelists fields). Add `agentModes = {"delegated": "subagent", "lead": "primary", "scheduled": "subagent"}` and `colors`
(D-15); `toolNames.Skill = "skill"`. In `renderAgent`: `mode = agentModes[frontmatter.type]`; missing/unknown `type`
throws `Error("agent '<name>': unknown or missing type '<v>'")`, so the installer aborts before writing;
`scheduled` pushes the G-5 gap; drop the `primary` read; map `color` via `colors`; stop emitting
`skills`, append the D-15 body line. Output stays deterministic.

### The three re-cuts — target files (written verbatim by the builder)

**`agents/code-reviewer.md`** (17 body lines)

```markdown
---
name: code-reviewer
description: >
  Reviews a change through exactly one review lens (L1–L5) and reports prioritised findings; read-only.
  Use when a caller fans out a pre-PR review, one code-reviewer per lens (a full review is five
  dispatches, per meaningfy-code-review). Not for fixing code (implementer) or discussing findings.
type: delegated
model: opus
color: yellow
tools: [Read, Grep, Glob, Bash]
disallowedTools: [Write, Edit, NotebookEdit]
skills:
  - meaningfy-code-review
  - cosmic-python
---

You are the **Code Reviewer**. You review one change through one lens and report; you never change it.

## Skills
- `meaningfy-code-review` — follow its *Review procedure* and *Output format* for your lens; its
  *Dispatch contract* defines the five-lens fan-out you are one unit of.
- `cosmic-python` — your lens's region of it is your full checklist; traverse it in full.

## Dispatch contract
- **Input:** one lens id (`L1`–`L5`) and the review context: the diff or base ref, the change's
  specs, the covering Gherkin. Never the implementation session history.
- **Output:** that lens's findings only, by priority (Critical / Warnings / Suggestions), each with
  file:line, lens, entry id, why and fix; HIGH/CRITICAL blast-radius symbols flagged.
- **Side effects:** none on files. It reads, runs `git diff`, impact queries and (L2) the test suite.
- **Refuses:** a dispatch naming no lens or several lenses — it returns "one lens required (L1–L5)"
  without reviewing; editing files, committing, opening PRs; approving its own suggestions.
```

Moves: *Process* steps 1–3, 5–6 → already in `meaningfy-code-review` §Review procedure (deleted); step 4
"run the test suite (L2)" → **added** to that procedure's step 2: "L2 also runs the project's test suite
(`make test` / `pytest`) and reports failures." Note's checklist and output format → skill §Lenses,
§Output format. "No lens → ask or default" → Refuses (D-16).

**`agents/epic-planner.md`** (22 body lines)

```markdown
---
name: epic-planner
description: >
  Shapes an EPIC from human seeds and derives its clarity-gated PLAN (≥9/10) as an OpenSpec change,
  returning question rounds to the caller until no decision is open. Use when starting or refining an
  epic. Not for archiving or grooming living specs (spec-stewardship) or for writing code (implementer).
type: delegated
model: opus
color: cyan
tools: [Read, Write, Edit, Grep, Glob, Bash, Skill]
skills:
  - epic-planning
  - clarity-gate
  - bdd-gherkin
  - stream-coding
---

You are the **Epic Planner**. You turn human seeds into a shaped EPIC and a gated PLAN.

## Skills
- `epic-planning` — follow its procedure end to end: seed intake, elicitation, EPIC, readiness check, PLAN.
- `clarity-gate` — score the PLAN; below 9/10, revise it.
- `bdd-gherkin` — author the design-phase `.feature` coverage the PLAN references.
- `stream-coding` — the documentation-first method around both.

## Dispatch contract
- **Input:** a change id or topic; the human's seeds (notes, ADRs, sample data, or an existing change
  to refine); the human's answers to the previous question round, if any.
- **Output:** either a question round — numbered questions grouped by concern, each with options and a
  recommended answer — while any decision is open; or `proposal.md`, `design.md`, `tasks.md` and spec
  deltas in `openspec/changes/<id>/`, seeds and the Q&A record in its `inputs/`, and the clarity-gate
  scorecard with open gaps.
- **Side effects:** writes only in `openspec/changes/<id>/` and the `.feature` files the PLAN names;
  runs `openspec validate --strict`.
- **Refuses:** writing code or step definitions; committing; archiving or grooming living specs;
  choosing an architectural option alone (it returns options and trade-offs); assuming past an open
  question (it returns the question instead).
```

Moves: "never assume / summarise and confirm / read all inputs / cite golden-thread parents / present
the score" → `epic-planning` steps 1–2, 4, 7 (deleted). "Read `openspec/config.yaml`" → dropped:
OpenSpec injects `context:` (`spec-stewardship` §orientation index). Note's `EPIC.md` template →
superseded by the spine artefacts. Note's "group related questions" vs the skill's "one concern at a
time" → the round groups questions *by concern*; the skill wins on order. Note's "update the epic
status" → no spine equivalent (status is the change's lifecycle, `spec-stewardship`); dropped.

**`agents/implementer.md`** (27 body lines)

```markdown
---
name: implementer
description: >
  Implements one ready task of an OpenSpec change as tested production code, test-first.
  Use when a task in tasks.md is ready (PLAN gated ≥9/10, Gherkin written). Not for planning
  (epic-planner), reviewing (code-reviewer) or committing.
type: delegated
model: sonnet
color: blue
tools: [Read, Edit, Write, Glob, Grep, Bash, Skill]
skills:
  - cosmic-python
  - stream-coding
  - superpowers:test-driven-development
  - superpowers:systematic-debugging
  - superpowers:verification-before-completion
---

You are the **Implementer**. You turn one ready task into tested production code that matches its spec.

## Skills
- `cosmic-python` — layering, what to test per layer, architecture validation, survey and reuse
  before writing (`PR-SURVEY-FIRST`).
- `stream-coding` — the generate-verify-integrate loop and the Rule of Divergence.
- `superpowers:test-driven-development` — red, green, refactor.
- `superpowers:systematic-debugging` — on a failing test.
- `superpowers:verification-before-completion` — before reporting done.

## Dispatch contract
- **Input:** a change id and one task id from its `tasks.md`; the task's specs, `design.md` and
  covering `.feature` files are read from the change.
- **Output:** a report: files changed, tests added and their result, the impact summary per modified
  symbol (or "no impact check ran"), any spec divergence with a proposed spec fix for the caller or
  `epic-planner` to apply, and conventions noticed for the caller to promote.
- **Side effects:** edits source, test and step-definition files for that task; ticks its `tasks.md`
  checkbox once its tests are green.
- **Refuses:** committing, pushing or opening PRs (the caller commits, per `meaningfy-git-workflow`);
  editing a symbol whose upstream impact is HIGH or CRITICAL (it stops and returns the impact report);
  patching code to hide a design-level failure; editing the PLAN beyond ticking `tasks.md`
  checkboxes, or `.feature` files.

## Glue
1. Before editing a symbol, run the project's GitNexus impact check (upstream; re-index first if
   stale). If GitNexus is unavailable, warn, proceed, and say so in the Output.
```

Moves: "Survey & reuse" + its anti-pattern ids → `cosmic-python` (`PR-SURVEY-FIRST`, `AP-DUP-CONST`,
`AP-DICT-AS-MODEL`, `AP-FREESTR-ANYLAYER`); note's "run architectural validation (importlinter)" →
`cosmic-python` (its import-linter guidance); "the loop" → `stream-coding` + TDD skill. "On completion"
(`.claude/memory/epics/` task file, EPIC.md Part 2) → ticking `tasks.md` + the Output report; `MEMORY.md`
→ "conventions noticed" (D-14). Commit on consent → Refuses (D-7). GitNexus "unavailable" policy →
aligned with `meaningfy-code-review` step 4 (warn and proceed).

### Gherkin scenarios (`tests/features/agents/`)

Each file opens with the D-11 Background line. Values in Examples tables, variables in step text.

| File | Scenario Outline (Examples columns → rows) | Plain scenarios |
|---|---|---|
| `code-reviewer.feature` | "One dispatch reviews one lens": `lens` → L1…L5; every finding tagged `<lens>`, no file changes | "No lens is refused"; "Two lenses are refused"; "L2 runs the test suite" |
| `epic-planner.feature` | "Open decisions come back as a question round": `open_decisions`, `output` → 0 / artefacts and scorecard; 1 / a question round; 3 / one question round grouped by concern | "The PLAN below 9/10 is revised, not reported Ready"; "Code is never written" |
| `implementer.feature` | "Impact decides whether editing proceeds": `risk`, `outcome` → LOW / edits; MEDIUM / edits; HIGH / stops and returns the report; CRITICAL / stops and returns the report; unavailable / edits and reports that no check ran | "The task is ticked only when green"; "A commit request is refused"; "A design-level failure returns a spec fix" |

### Anti-patterns

| ❌ Don't | ✅ Do instead | Why |
|---|---|---|
| Add `bundle:` to agent frontmatter | List the agent only in `bundles.yaml`; M2 rejects the field | Two declarations of one fact drift (DEC-5) |
| Parse `opencode-bundle-lib.mjs` or hard-code `{"opus","sonnet","haiku"}` in Python | `json.load` `tools/opencode-agent-map.json` | One table home (Cross-EPIC contract item 3) |
| Write `40` into the template or spec | Name `MAX_AGENT_BODY_LINES` | D-2 single home for the number |
| Copy `meaningfy-code-review`'s procedure into `code-reviewer.md` | One `## Skills` line per skill | Preloaded skill (Claude) or loaded on demand (opencode); a copy is a second owner |
| Keep "ask the human" or "commit on consent" in a delegated agent | Return the question / refuse and recommend | Delegated runs cannot ask or obtain consent (V-3, D-7) |
| Emit `skills:` or raw `color:` into opencode files | Body line + `colors` table (D-15) | Not opencode fields (V-6) |
| Add `permissionMode`/`hooks`/`mcpServers` to an agent | Record in Field adoption as plugin-ignored | Ignored in plugins (V-4) |
| Wire `agent_conformance` before the re-cut | Wire it in the same task as the re-cut (task 5) | `make validate` stays green between commits |

## Error matrix

| Failure mode | Expected handling |
|---|---|
| Any Cross-EPIC contract item missing at task 0.1 | Stop; report which item to the team lead; do not re-implement the sibling's side |
| `tools/opencode-agent-map.json` lacks `modelAliases` | `agent_conformance` reports `tools/opencode-agent-map.json has no 'modelAliases'` once and skips M4/M5 |
| `bundle_gen.load` raises (invalid manifest) | The sibling's gate reports it; P1/P2 return [] for that run |
| Agent frontmatter YAML unparsable | `bundle_gen.agent_frontmatter` raises (strict, sibling); `agent_conformance` reports `agents/<f>: frontmatter does not parse` and skips that file |
| `opencode run --agent` refuses a `subagent`-mode agent (D-17, opencode side) | Not exercised here (no scheduled agent ships); `add-sales-bundle` verifies on first use and changes `agentModes.scheduled` in its own delta |
| Claude loads a re-cut agent without its skills from the pushed branch | Task 6.2 fails; fix in the agent or record in mapping.md before 9.x |
| Re-running lint or the renderer | Pure / deterministic; safe to repeat |

## Test case specifications

| ID | Component | Input | Expected | Edge |
|---|---|---|---|---|
| TC-01 | M1 | agent without `type` | one message, `type` | other fields valid |
| TC-02 | M2 | `bundle: meaningfy-building` | not-in-contract message | `primary: true` same |
| TC-03 | M6 | `tools: Read, Grep` | must-be-a-list message | list form passes |
| TC-04 | M11 | body of cap+1 / cap lines | flagged / clean | leading blank lines not counted |
| TC-05 | M13 | contract without `**Refuses:**` | missing-label message | label outside the section does not count |
| TC-06 | M17 | Background names `clarity-gate-lite` only | missing `clarity-gate` | prefix does not count (backtick-delimited) |
| TC-07 | P1 | primary skill in another bundle | primary-skill message | namespaced first skill skipped |
| TC-08 | `renderAgent` | `type: lead` | `mode: primary`, no gap | — |
| TC-09 | `renderAgent` | `type: scheduled` | `mode: subagent` + G-5 gap | — |
| TC-10 | `renderAgent` | no `type` | throws naming the agent; nothing written | — |
| TC-11 | `renderAgent` | `skills: [a, b]`, `color: yellow` | no `skills` key; body ends with the D-15 line; `color: warning` | — |
| TC-12 | real repo | `make validate` + node tests | green | after re-cut |

## Risks / Trade-offs

- [`.feature` files are not executed automatically] → shape linted; run by hand in task 6.2 and at release.
- [`code-reviewer` `Bash` can write] → recorded residual risk (D-6); no plugin-honoured fix exists.
- [`epic-planner` question rounds cost a round-trip per round] → accepted until G-1…G-3 allow `lead`.
- [`renderAgent` is created by the sibling; GitNexus has not indexed it yet] → run `impact` on it at
  task 3.1 (CLAUDE.md rule) and report the blast radius before editing.
- [Two EPICs edit `docs/development-method.md`, `mapping.md`, README, CHANGELOG] → disjoint zones per
  Cross-EPIC contract item 6.

## Open Questions

None blocking.

## Coordination items (not edited here)

| With | Item |
|---|---|
| `add-sales-bundle` | Its DEC-2 composite is allowed by D-17 (no change needed); its "Modified capabilities" line cites `agent-authoring`, which D-1 folded into `catalogue-governance` — one-line fix in task 8.2 |
| `single-source-distribution` | Its `design.md` Non-goals line "The agent `bundle:` frontmatter field and its lint are `agent-authoring-standard`'s (its DEC-5)" is stale against DEC-5 re-shaped; sent to its architect (review-hardening.md finding 26) |

## Review disposition ([`review-hardening.md`](review-hardening.md))

| # | Sev. | Disposition |
|---|---|---|
| 0 | info | Accepted: V-1, V-2 recorded as verified; fallback rows deleted; task 0.2 replaced by the pushed-branch load test (task 6.2) |
| 1 | BLOCKER | Accepted: A-1 replaced by the Cross-EPIC contract; tables in `tools/opencode-agent-map.json`, renderer `renderAgent`, node tests; lint reads the JSON (option b of the finding, as ruled by the lead) |
| 2 | BLOCKER | Accepted, option (a): `documenter`, `gherkin-writer` leave `ALL_AGENT_NAMES` (D-13, task 1.3) |
| 3 | BLOCKER | Accepted in substance, different remedy: `epic-planner` stays delegated (D-8); `Bash, Edit, Skill` added; lead's session-wide tool effect recorded as G-2 |
| 4 | BLOCKER | Accepted: only P1/P2 added to the sibling's check; membership read via `bundle_gen.load`; bundle scenario dropped from the delta |
| 5 | BLOCKER | Accepted: `scheduled` renders via `claude -p --agent` / `opencode run --agent` from an external scheduler (D-9); composite allowed (D-17); sales coordination (task 8.2) |
| 6 | MAJOR | Accepted: plugin-ignored column (D-5); `permissionMode` candidate withdrawn; residual-risk wording (D-6) |
| 7 | MAJOR | Accepted: no opencode `skills` (body line), `colors` table, `Skill → skill`, M7 colour lint, task 6.2 checks skills loaded on opencode; `AskUserQuestion → question` not added (no re-cut agent uses it) |
| 8 | MAJOR | Accepted: `lead` row states G-1; M10 requires "Not for delegation"; moot for `epic-planner` (stays delegated) |
| 9 | MAJOR | Accepted: warn and proceed, stated in Output; HIGH/CRITICAL still stops. Not moved into a skill (one glue line; a skill edit would widen scope) |
| 10 | MAJOR | Accepted: deliberate deferral recorded against vault §3.7 with revisit trigger; pattern capture kept as "conventions noticed" (D-14) |
| 11 | MAJOR | Accepted: one `agent_conformance` + P1/P2 in the sibling's function; one negative test per message; the alias check is left to the sibling's strict parser (no duplicate) |
| 12 | MAJOR | Accepted, option (a): the spec requires conformance to the template; D-2 lists the spec; number only in the lint constant |
| 13 | MAJOR | Accepted: task 7.3 reduced to three pointer edits with grep acceptance; other restatements recorded as accepted derivations (D-2) |
| 14 | MAJOR | Accepted: worded against "the opencode agent renderer"; kept as ADDED per Cross-EPIC contract item 5 |
| 15 | MAJOR | Accepted: tasks 7.2 (README block + build-loop cells), 7.5 (`setup.md` row, `build-lifecycle.md` lines 143 and 256); implementer Output says who applies the spec fix |
| 16 | MAJOR | Accepted: literal commands in CHANGELOG and README, taken from task 6.2's verified form |
| 17 | MAJOR | Accepted: D-16, CHANGELOG line, README invocation example per agent (task 7.2) |
| 18 | MINOR | Accepted: 40 kept, justified by the `scheduled` composite consumer (D-10) |
| 19 | MINOR | Accepted: Background line, backtick-delimited (D-11, M17) |
| 20 | MINOR | Accepted: string form rejected (M6) |
| 21 | MINOR | Accepted: task 7.4 acceptance = `broken_links` clean + row contains the link |
| 22 | MINOR | Accepted: both rows say only "Thin wrapper — see `spec/agent-template.md`" |
| 23 | MINOR | Accepted: one home in the template, governance rule 2 links to it (D-6) |
| 24 | MINOR | Accepted: epic status and importlinter recorded in Moves; step definitions in implementer Side effects |
| 25 | MINOR | Accepted: rendering columns only in mapping.md; the template carries types and contract extras (D-2, D-9) |
| 26 | MINOR | Accepted as coordination item (not ours to edit) |

## Clarity-gate scorecard (revision 2, PLAN = this file + tasks.md), 2026-10-26

| # | Check | Result |
|---|---|---|
| 1–7 | Actionable · Current · Single source · Decision not wish · Prompt-ready · No future state · No fluff | pass — vendor facts verified (V-1…V-7); sibling interface bound by contract |
| 8 | Type identified | pass (Implementation) |
| 9–11 | Anti-patterns (8) · Test cases (12) · Error matrix (7) | pass |
| 12 | Deep links | pass |
| 13 | No duplication | pass — D-2 one home per fact; D-5 marked as decision record of the template table |

| Criterion | Weight | Score | Note |
|---|---|---|---|
| Actionability | 25% | 9.5 | every task targets code that exists after the sibling |
| Specificity | 20% | 9 | messages, tables, literal commands; the `--agent` plugin-scoped literal is confirmed in task 6.2 |
| Consistency | 15% | 9 | aligned with the Cross-EPIC contract and `add-sales-bundle` DEC-2 |
| Structure | 15% | 9.5 | — |
| Disambiguation | 15% | 9 | types MECE; delegated/lead/scheduled behaviours and gaps G-1…G-5 explicit |
| Reference clarity | 10% | 9 | — |
| **Weighted** | | **9.2 / 10 — Ready** | |

## Implementation notes

Applied 2026-10-26 on `feat/single-source-and-agent-standard`, working tree only (no commit, push or
tag), on top of the uncommitted `single-source-distribution` tree. Task 0.1 found every Cross-EPIC
contract item present.

**Gates at the end (9.1).**
- `make validate`: lint OK, 129 passed (baseline: 110).
- `npm run test:opencode-installer`: 24/24 (baseline: 20).
- `make bundles` run twice: identical output.
- `openspec validate agent-authoring-standard --strict`: valid.
- `make validate-spine`: 25 passed, 4 failed, the same four shaping-only siblings as before
  (`add-devops-bundle`, `add-sales-bundle`, `fix-accumulated-skill-defects`, `skill-crafting-method`).
  That is why 9.1 stays unticked.

**Deviations (each the smallest correct option):**
1. **1.1 had hidden consumers.** `test_orphan_agent_reference_is_flagged` and
   `test_claude_dir_excluded_from_prose_checks` used `documenter`/`gherkin-writer` as their orphan
   names. They now use `implementer`/`code-reviewer`, which are absent from their `tmp_path`.
2. **1.3 wording.** Rule 2 is the task's literal text, which names skill-level `model`. The "no field
   name from D-3" acceptance is read as "no field table or cap number", and both hold.
3. **P1/P2 run only when `skills:` is a YAML list and the agent is in exactly one bundle.** A missing
   or string `skills:` is reported by `agent_conformance` (M1/M6), and unparsable frontmatter by
   `bundle_gates`. Neither is reported twice, and the sibling's exact-equality membership tests stay
   unchanged.
4. **Error-matrix wording.**
   - A map without `agentModes` gives one `tools/opencode-agent-map.json has no 'agentModes'` and
     skips M4. The matrix row said `modelAliases`/M5, but M5 is the sibling's.
   - A frontmatter that `bundle_gen.agent_frontmatter` rejects gives
     `agents/<f>.md: frontmatter is rejected (<its message>)`, not "does not parse", because the same
     `ValueError` also covers an unknown model alias.
   - Messages name the file with its `.md`.
5. **`bundle_gen` needed no change.** It already writes the whole parsed frontmatter into
   `tools/opencode-catalogue.json`, so `type` arrives there automatically.
6. **Node tests.**
   - TC-14's unmapped-tool example is now `AskUserQuestion`, because `Skill` maps since D-15.
   - TC-21's expected gap row is now `NotebookEdit`.
   - TC-10 also runs the CLI and shows that nothing is written.
   - `renderAgent` turns a colour missing from `colors` into a gap instead of emitting it raw.
     M7 prevents this case in the repo.
7. **Body sizes** (D-10 formula): `code-reviewer` 15, `epic-planner` 20, `implementer` 25 lines. The
   design's 17/22/27 counted the closing fence. The pre-re-cut sizes were 33/22/40.
8. **7.3 link text has no backticks** (link text `spec/agent-template.md`, target `../spec/agent-template.md`), so the
   acceptance grep matches. `diff` against the pre-edit copy shows exactly the three hunks.
9. **CHANGELOG.** The line went under the sibling's `## [3.0.0]` "Changed" list, not `[Unreleased]`,
   by lead instruction (one release). VERSION was not bumped. A second line records the opencode
   rendering change (`type` → `mode`, the skills body line, theme colour).
10. **Sibling review finding 7 fixed here, test-first.**
    - The skill "multiple bundles" message now prints `a, b` in file order, like the agent message.
    - A skill dir in no bundle is reported once, by `unregistered_skill_dirs`;
      `expected_bundle_membership` no longer repeats it.
11. **6.1/6.2 are deferred (needs push) and were approximated locally** with the spike-dec5 method:
    a scratch commit of the working tree, served over local smart-HTTP git, with a fresh
    `CLAUDE_CONFIG_DIR` and `HOME`.
    - **Claude Code 2.1.310.** `plugin details meaningfy-building` lists `Agents (3) code-reviewer,
      implementer, epic-planner` once, with 9 skills.
    - **The headless dispatch was not run.** `claude -p --agent meaningfy-building:code-reviewer`
      returns "Not logged in" in a scratch config, and the real one is off limits. The
      plugin-scoped literal `meaningfy-building:<agent>` is the form the installed 2.11 plugin
      registers today.
    - **opencode.** The installer (`npm exec --package=git+http://…#feat-aas -- skillery-opencode
      install meaningfy-building --global`, scratch `HOME`) wrote three agents with `mode:
      "subagent"`, no `skills` key, the D-15 body line and theme colours `warning`/`primary`/`info`.
      Its one gap was `disallowedTools 'NotebookEdit'`. The `opencode` binary is not installed, so
      skill loading there is unverified.
    - **Open question for 6.2:** `code-reviewer`'s rendered `tools` map does not list `skill`. Its
      Claude `tools` has no `Skill`, because skills are preloaded on Claude. Check on opencode that
      the skill tool stays enabled when it is unlisted.

**GitNexus.**
- Re-indexed with `--skip-agents-md`; `AGENTS.md` and `CLAUDE.md` were left as the sibling had them.
- `impact(renderAgent, upstream)` was **HIGH**: 1 direct caller (`renderBundleAgents`) and the
  `commandInstall`, `commandReport` and `main` flows. This is expected, since it is the one renderer.
  The node tests cover it.
- `agent_bundle_membership` and `expected_bundle_membership` were LOW.
- `detect_changes(compare, develop)` lists this change's code symbols only in
  `tools/repo_lint/lint.py`, `tools/opencode-bundle-lib.mjs` and the tests. Everything else in that
  report is the sibling's.
