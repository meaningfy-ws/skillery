---
kind: assessment
date: 2026-10-22
subject: The Claude Code project structure (CLAUDE.md, rules, commands, skills, agents, hooks, settings, .mcp.json) and what it means for the skillery, the sales agent and a modelling agent
verdict: The structure is native Claude Code, not a custom convention. The skillery is already ahead of it on governance. Its gaps are deterministic enforcement (hooks, permissions), the newer skill frontmatter, and leaks in how the bundles install.
tags: [draft]
related: ["[[Sales Agent - design]]", "[[D3 as a tool for an ontology-development agent]]", "[[2026-10-08 Sales Agent]]", "[[2026-10-20 Competency Question Bank]]", "[[Sales Agent - lessons from graph MCP and agent-learning sources]]", "[[Kurt Cagle on graph data MCPs, holons and knowledge graphs]]", "[[2026-10-22]]"]
---
# Claude Code project structure: what it means for skills, the skillery and our agents

Analysis prepared with Claude on 2026-10-22, starting from a GenAI.works infographic, "Claude Code
project structure". I read the skillery repo (`agent-skills`, branch
`feat/vault-setup-readme-and-vault-first`, v2.11.0) and its worktree `skillery-infrastructure-operations`
(branch `feature/infrastructure-operations-skill`, still at v2.9.0), and checked the current Claude Code docs.

## 1. Is it custom or native?

It is native. Claude Code reads every element in the picture, with three corrections and several
omissions.

| Element | Native? | What it really is | Correction or nuance |
|---|---|---|---|
| `CLAUDE.md` | yes | Always-on context, loaded at session start. Nested `CLAUDE.md` files in subfolders load lazily. `@path` imports work. | Keep it under about 200 lines. It routes; it does not teach. |
| `CLAUDE.local.md` | yes | Personal, gitignored layer, concatenated with `CLAUDE.md`. | The picture calls it "overrides". It is appended, not merged by precedence. |
| `.mcp.json` | yes | Project-scoped MCP servers, shared through git. | Secrets go in env vars, never in the file. |
| `.claude/settings.json` / `.local.json` | yes | Permissions (allow/ask/deny), model, env, **hook registration**. | Settings are also the cheapest guardrail: a `deny` rule beats any prose rule. |
| `.claude/rules/*.md` | yes (newer) | Modular always-on instructions. With `paths:` globs in frontmatter, a rule attaches only when Claude touches matching files. | Path-scoped rules are the one really new idea in the picture (see §3). |
| `.claude/commands/` | legacy | **Commands have been merged into skills.** `commands/deploy.md` and `skills/deploy/SKILL.md` both create `/deploy`. | The `/project:<name>` form in the picture is outdated; it is `/name` now. Write skills, not commands. |
| `.claude/skills/<name>/SKILL.md` | yes | On-demand knowledge: the description is always listed, the body loads only when triggered, `references/` and `scripts/` load lazily. | Follows the open **Agent Skills** standard (agentskills.io); Claude Code extends it (see §2). |
| `.claude/agents/*.md` | yes | Subagents: own context, tool allowlist, model, `skills:` preloaded in full, `permissionMode`, `memory`, `hooks`, `mcpServers`, `isolation: worktree`, `maxTurns`. | Much richer than the picture suggests. |
| `.claude/hooks/` | **no** | Only a folder convention for hook *scripts*. Claude Code runs a hook only when it is registered in `settings.json` (or a plugin's `hooks.json`, or a skill's or agent's `hooks:` frontmatter). | Placing a script there does nothing on its own. |

What the picture leaves out, and what matters most to us:

- **Plugins and marketplaces.** This is the *distribution* unit: one plugin carries skills, agents,
  hooks, MCP servers and commands. The skillery already ships this way (`.claude-plugin/marketplace.json`).
  The picture describes one repo; we run a catalogue.
- **Scopes.** Enterprise (managed), personal (`~/.claude/`), project, nested folder, plugin, and the
  claude.ai account (which is how Cowork sees our skills). The same structure exists at every scope.
- **Output styles, auto-memory, agent memory** (`memory: user|project|local` on a subagent).

## 2. What it means for creating skills

The underlying model has three axes. **When it loads:** always (CLAUDE.md, rules), on demand (skills),
or on an event (hooks). **Who triggers it:** the harness, the model, or the user. **Where it runs:**
the main context, or an isolated one (subagents, or a skill with `context: fork`).

| Need | Right mechanism | Why |
|---|---|---|
| A fact or method the model applies with judgement | **skill** | Costs only its description until it is used |
| A short MUST that is true in every session | `CLAUDE.md` / `AGENTS.md` binding | Always loaded, so keep it tiny |
| A convention tied to file types or folders | skill with `paths:`, or a path-scoped rule | Loads only where it applies |
| A workflow that only a person should start | skill with `disable-model-invocation: true` | No accidental runs |
| Delegated work in a clean context | subagent, or skill with `context: fork` + `agent:` | Isolation, fresh judgement |
| An invariant that must never be broken | **hook or permission**, never prose | Deterministic; the model can't talk itself out of it |

The rule of thumb I'd adopt: **judgement goes in prompts, invariants go in hooks, and blast radius
goes in permissions.** Most of our hard rules (the vault's "recall only", the sales agent's "never
sends, never deletes") are currently written as prose. Those are exactly the ones that should become
deterministic.

The second implication is that **the skill is now the universal unit.** The current skill
frontmatter adds `disable-model-invocation`, `user-invocable`, `allowed-tools`, `disallowed-tools`,
`model`, `effort`, `context: fork` + `agent`, `hooks`, `paths` and `arguments`. A skill can now pin
a model, restrict tools and run isolated. Those were the three reasons the skillery's governance gives
for keeping an agent file (`spec/skill-repo-governance.md`, rule 2). After this change, an agent file
is justified only by what a skill still can't give: persistent `memory`, scoped `mcpServers`, a
`permissionMode`, `isolation: worktree`, `maxTurns`, or being a named worker that other skills spawn.

There is a portability catch. Outside Claude Code (claude.ai uploads and the Skills API) only six
frontmatter fields are accepted: `name`, `description`, `license`, `compatibility`, `metadata` and
`allowed-tools`. Any other field is a hard error on upload. Plugin installs seem more tolerant: in this
Cowork session, `vault-resume` (which uses `argument-hint`) loads fine. But the skillery already
treats opencode as a second target, and the Agent Skills core is effectively a third one. Every
Claude-only field we adopt has to go through the same mapping-and-gap discipline the opencode
generator uses.

## 3. Impact on the skillery

**What it already does better than the picture.** Four artefact types with one owner per fact; thin
agents that preload skills; `AGENTS.md` as the canonical binding with `CLAUDE.md` as a pointer
(Claude Code doesn't read `AGENTS.md` natively, so the pointer is the right pattern); dual-CLI
generation with a parity gate; and above all `hooks/inventory.yaml`. It holds 56 hook *intents*, each
classified by mechanism (git / ci / agent), and it is a cleaner design than anything in the picture.
The picture shows a hooks folder; the skillery has a hooks *ontology*.

**The gaps, from most to least important:**

1. **Bundles leak in the installed plugins.** In this Cowork session, every one of the five bundles
   (`meaningfy-core`, `-consulting`, `-architecture`, `-building`, `vault-assistant`) exposes *all*
   28 model-invocable skills and all three agents. So `code-reviewer` exists five times and
   `cosmic-python` five times. The likely cause: every plugin has `"source": "./"` and `"strict":
   false`, so each plugin root contains the whole `skills/` and `agents/` tree, and the per-plugin
   `skills` array doesn't fence it. The effects: five times the description tokens in every session,
   trigger collisions, and "install core plus your role" stops meaning anything. **Fix first:** give
   each bundle its own source folder, or declare `agents` and `skills` explicitly so nothing is
   auto-discovered, and add a validator check that installs each bundle and counts what it exposes.
   (The four `vault-*` skills missing from the listing are not part of this bug: `vault-daily`,
   `vault-tidy`, `vault-setup` and `vault-promote` set `disable-model-invocation: true`, so they are
   hidden from the model by design.)
2. **The hook intents are not shipped where they matter.** `project-setup` projects them into code
   repos, but the agent-mechanism hooks could ship *inside the plugins* (plugins can carry hooks and
   MCP config). `vault-assistant` is the obvious first case: its hard rules are prose today and could
   be enforced deterministically:
   - a permission `deny` on `meaningfy-memory` `remember`/`forget` ("recall only");
   - a `PreToolUse` guard on Write/Edit that blocks paths outside the allowed folders for agent runs
     (`00 Inbox/proposed/`, `04 Daily/`, `05 To Do/`, `sessions.md`), and blocks writing the `memory:`
     property;
   - a `Stop` check that a run note was written.

   Caveat: Cowork and Claude desktop scheduled tasks don't necessarily honour project
   `settings.json` the way the Claude Code CLI does. Verify this per runtime before relying on it, and
   keep the prose rule as a fallback.
3. **Governance spec rule 2 is now stale** (see §2). Rewrite the skill-vs-agent rule around what
   agents still uniquely give, and add a third leg, *"deterministic before prose"*, saying when an
   intent must become a hook or permission instead of a sentence.
4. **New skill frontmatter is unused, apart from `disable-model-invocation` and `argument-hint`.** Good
   candidates:
   - `paths:` for `bdd-gherkin` (`**/*.feature`), `linkml-engineering` (`**/*.linkml.yaml`, `schema/**`)
     and `cosmic-python` (`src/**/*.py`);
   - `context: fork` for `meaningfy-code-review`, which could then replace the `code-reviewer` agent
     unless that agent gets `memory`;
   - `allowed-tools` for read-only skills such as `vault-resume`.

   Each one needs a row in `docs/environment/dual-cli/mapping.md` and a gap note for opencode and for
   the Agent Skills core.
5. **Rules (`.claude/rules/`) are a trap for a single-source catalogue.** They are always-on prose,
   so they invite restating skill content. Prefer `paths:` on the skill itself. Use a rule only for a
   three-line MUST that points to a skill. If `project-setup` ever projects rules, generate them from
   skill metadata; never hand-write them.
6. **Commands.** `.claude/commands/opsx/` is the legacy form. It is generated by OpenSpec, so leave it,
   but author nothing new there. `prompts/README.md` still recommends `ln -s CLAUDE.md AGENTS.md`,
   which contradicts the `AGENTS.md`-canonical rule in the root `AGENTS.md`. That is a small doc drift
   to fix.
7. **Agent memory vs our memory.** `implementer` hand-writes `.claude/memory/epics/...`, and native
   `memory: project` now exists. Decide which one owns agent learning, or the two will drift. For
   vault-facing agents, the answer stays "the vault"; for build agents, native agent memory is
   reasonable.
8. **Hygiene.** The skillery's own `.claude/settings.local.json` runs `defaultMode:
   bypassPermissions` with `Bash(rm:*)` allowed. That's fine for a solo maintainer, but it is the
   opposite of what the catalogue preaches.
9. **The worktree.** `skillery-infrastructure-operations` is the same repo on
   `feature/infrastructure-operations-skill`, at v2.9.0 (no `vault-assistant` bundle) and with no
   infra-ops skill committed yet. Rebase it on the current line before continuing. Infra-ops is the
   textbook case for the new mechanics: `disable-model-invocation: true`, `context: fork`, a
   `permissionMode` of `default`, and `PreToolUse` hooks that block destructive commands
   (`docker volume rm`, `terraform destroy`, prod contexts) unless a person approves.

## 4. Impact on the sales agent

Today: `meaningfy-sales` 0.5.0 lives in `vault-files/`, laid out like the skillery, and runs as Claude
desktop scheduled tasks. There's no agent file ("scheduled tasks load skills, not agents"). The
independent reviewers are subagents "if available". Its write policy (logged, reversible writes; never
send, never delete; won/lost needs Eugen's yes) is prose in `sales-pipelines`.

When it moves into the skillery (planned) or onto Claude Code / OpenClaw, ship it as a **complete
plugin**, not only skills:

- **Skills.** As now. Set `sales-agent` to `disable-model-invocation: true` so grooming starts only
  from a schedule or from Eugen, and make `sales-pipelines` the base skill. Use the skills' own
  `allowed-tools` for the Odoo read tools.
- **Agents.** `sales-agent.md` with an explicit tool allowlist that has *no* send or delete tools.
  This is the capability the design already said only an agent can give. Add `goal-verifier.md` and
  `rule-auditor.md`: read-only, fresh context, preloaded with the owning skill. They turn the design's
  "independent reviewers" from "if available" into a guarantee.
- **Hooks and permissions.** `deny` on Gmail send and on `odoo unlink`. `ask` on writes to stage
  won/lost and on configuration models. A `PostToolUse` hook on every Odoo write appends the record,
  field, old value and new value to the run note, so "logged, reversible" is guaranteed rather than
  hoped for. A `Stop` hook refuses to end a run without the run note's *Verification* section.
- **`.mcp.json`.** `odoo` and `meaningfy-memory`, so the plugin is self-contained on any machine.

This also makes the pilot's measures more trustworthy: the audit trail comes from hooks, not from the
agent's self-report.

## 5. Impact on a modelling agent

The pieces exist but are scattered: the `conceptual-modelling`, `modelling-conventions` and
`linkml-engineering` skills; the D3 idea ([[D3 as a tool for an ontology-development agent]]); the
Competency Question Bank; and model2owl. The structure in the picture gives the missing *feedback
loop*:

- **Path-scoped skills.** Modelling conventions load when Claude touches `*.linkml.yaml`, `*.ttl`,
  `*.owl` or `*.feature`.
- **`PostToolUse` validation hooks** after every schema edit: `linkml-lint`, the generators, SHACL
  validation and a reasoner consistency check, with the errors fed straight back. Ontology work
  improves most when the model gets deterministic feedback on every step. Hooks provide that; a skill
  can only ask for it.
- **Subagents.** An *ontology critic* (read-only; runs the competency questions as SPARQL against the
  generated graph and reports pass/fail per question) and an *upper-ontology aligner* (calls D3 as an
  MCP tool for every new class and records the decision path).
- **`.mcp.json`.** The triple store (GraphDB/Neo4j), D3, and the company memory for recall.
- **Agent memory** (`memory: project`) for recurring modelling mistakes. The *decisions* themselves
  still go to ADRs and the conceptual model.

This is a credible demo for the "semantic layer that makes AI traceable" positioning: an agent whose
every modelling step is validated and justified.

## 6. Other agents, briefly

- **Vault assistant.** Enforce its hard rules with hooks and permissions (§3, gap 2). This is the
  highest value for the least work.
- **Proposal / offer agent.** `proposal-writing`, `estimation` and `executive-communication` exist. Add
  a forked reviewer that checks claims against `meaningfy-track-record`, so no unverified credential
  reaches a client.
- **Delivery agents** (ERS-MDR, Brainframe MCP). Use per-repo `.claude/` from `project-setup`, with the
  build-loop agents. The useful new piece is `isolation: worktree` on `implementer`, for parallel tasks.

## 7. Recommended order

1. Fix the bundle leakage, and add an install-and-count check to `make validate`. *(TINY)*
2. Rewrite governance rule 2 and add "deterministic before prose". *(TINY, a doc change)*
3. Add a frontmatter portability map (Claude Code / opencode / Agent Skills core) to the dual-CLI
   gate. *(SMALL)*
4. Ship `vault-assistant` hooks and permissions inside the plugin, after checking which runtimes
   honour them. *(SMALL)*
5. Move `meaningfy-sales` into the skillery as a full plugin: agents, reviewers, audit hooks,
   `.mcp.json`. *(MEDIUM, fits the planned move)*
6. Modelling agent: start with the validation hooks and the CQ critic; add D3 after that. *(MEDIUM,
   could become a project)*

Changes to the skillery itself should go in as `skill-change` notes in `00 Inbox/proposed/`, then as a
pull request, as the vault rules require.

## Sources

- Claude Code docs, Skills: https://code.claude.com/docs/en/skills (scopes, commands merged into
  skills, frontmatter, Agent Skills standard and the six-field upload limit)
- Claude directory map (CLAUDE.md, rules with `paths`, hooks in settings):
  https://mer.vin/2026/05/claude-code-claude-directory-claude-md-rules-hooks-and-skills-map/
- Subagent frontmatter summary:
  https://mintlify.wiki/shanraisshan/claude-code-best-practice/best-practices/subagents
- Skillery: `README.md`, `AGENTS.md`, `spec/skill-repo-governance.md`, `hooks/README.md`,
  `hooks/bindings.md`, `.claude-plugin/marketplace.json`, `agents/implementer.md`, `prompts/README.md`
- [[Sales Agent - design]], [[2026-10-08 Sales Agent]]
