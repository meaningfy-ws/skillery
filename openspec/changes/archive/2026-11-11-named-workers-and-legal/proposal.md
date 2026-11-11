# EPIC: Named workers, one lead per workflow, and a legal bundle with Tolic the lawyer

## Appetite

VERY LARGE, delivered in three stages (DEC-14). It touches every agent, adds four and turns one
into a lead, adds a bundle and moves the agent standard.

## Why

Meaningfy wants to work with its agents as colleagues: a named worker who owns an activity, follows
the house method and knows where the house material is. Skillery already has the parts: thin
agents, skills, navigator workflows. But it never named how they fit together, half the workflows
have no lead worker, and there is no legal worker. Meaningfy is moving its contracts from Overleaf
into a git-based contract system (a clause library and an instances repository, with a `ctr`
command line); it needs a worker who drafts, revises and aligns contracts inside that system.

## Solution outline

A **worker** is an agent in skillery, under the existing agent standard, with three additions: a
persona name, a primary skill that is an **activity skill**, and, where its work needs house
material, a pointer to repositories outside skillery that hold that material **and its own rules**.
Four layers, each with one home:

| Layer | Holds | Home |
|---|---|---|
| Worker | who: persona, type, tools, refusals | `agents/` |
| Workflow | the path through the activity, its gates | the activity skill's `assets/workflows/` |
| Skills | how the activity is done: the method and judgement | `skills/` |
| Corpus | the material and its mechanics: clauses, skeletons, drafting style, clause model, lifecycle, `ctr`, lint | the corpus repositories, their `AGENTS.md` and docs |

For legal work the split is concrete. The contract repository (`meaningfy-ws/legal-agreements`)
owns the clause model, the drafting style, which variant applies when, the contract lifecycle,
the commands that move it and the contracts themselves. Skillery owns what no
repository can hold: how Tolic interviews the owner for a new contract, judges whether a contract is
aligned with its parent and with the contract it mirrors, sorts a counterparty's changes into
deviations of legal effect versus wording, and writes every proposal with its sources and reasons.

Outcomes, by stage:

1. **The rules are written down.** A reader of the developer and user docs can answer: what a
   worker is; activity skill versus know-how skill; that every workflow has exactly one lead
   worker; that every lead may delegate; how persona names are formed; where house material lives
   and that a worker follows its repository's own rules. The stale strict-mode line in
   `docs/development/workflows.md` is fixed.
2. **Every workflow has its lead, and every agent has a name.** The ten agents get persona names;
   `epic-planner` becomes a lead; three new leads walk epic delivery, release and documentation.
3. **Tolic the lawyer ships.** A `meaningfy-legal` bundle with a lead `lawyer` agent and his
   legal activity skill, plus a generic corpus skill. In a session in the contracts repository,
   Tolic creates a contract from a skeleton, fills its values (`\tbc{}` where unknown), drafts the
   mission terms, checks it against its parent and back-to-back contract, revises a counterparty
   draft into overrides, and proposes new clause versions or variants from repeated overrides, each
   through a PR the owner approves. He is released without a live trial; defects found in real use
   come back as skillery issues (DEC-17).

## Key decisions

- **DEC-1**: Workers are agents in skillery under `docs/development/agent-template.md`; their
  material lives in external repositories. Rejected: a separate roster repo or layer (a second
  release and parity path); declaring the worker in the material repo (the method would leave the
  catalogue).
- **DEC-2**: Workflows stay assets of their activity skill; a worker walks a workflow and never
  owns one. Workflows, the agent's refusals and tools, and the skills' rules together constrain a
  worker. Rejected: workflows inside agents.
- **DEC-3**: One Skill type. A skill that ships `assets/workflows/` is an **activity skill**; any
  other is a **know-how skill**. A lead's primary skill is the activity skill whose workflow it
  leads. Rejected: workflows as a sixth artifact type; activity skills in a separate repo.
- **DEC-4**: The persona name lives in the text, not the dispatch name: `agents/lawyer.md`,
  `name: lawyer`; the description opens and the role line reads "Tolic the lawyer". No diacritics.
  Skill names stay precise and purpose-named, never personas. Rejected: `name: tolic`,
  `name: tolic-lawyer`.
- **DEC-5**: Names: Vasile the planner (`epic-planner`), Radu the team lead (`team-lead`, design D-5), Nelu
  the release manager (`release-manager`), Viorica the technical writer (`technical-writer`), Ionut
  the implementer (`implementer`), Mircea the reviewer (`code-reviewer`), Ana the architect
  (`system-architect`), Doina the modeller (`conceptual-modeller`), Sandu the devops engineer
  (`devops-engineer`), Petrica the infra operator (`ops-watch`), Lilia the infrastructure reviewer
  (`infra-reviewer`), Mariana the proposal writer (`proposal-writer`), Costel the sales agent
  (`sales-agent`), Tolic the lawyer (`lawyer`).
- **DEC-6**: Tolic is a `lead`: he works with the owner in a session and asks directly.
  Rejected: delegated (cannot ask); scheduled (a later form at most, e.g. `ctr due`).
- **DEC-7**: Every `lead` agent may delegate and spawn subagents; the agent standard drops the
  "or none" option for leads, and leads without the `Agent` tool today (`system-architect`,
  `conceptual-modeller`) gain it. Delegation follows `guardrails`, *Subagent dispatch*.
- **DEC-8**: Tolic's own refusals are those with effect outside the company or outside his remit:
  sending, signing or registering a contract (`ctr send`, `ctr sign`, `ctr register`) unless the
  owner confirms that one action; any Odoo access (DEC-10); editing an Overleaf project other than
  the current contract's; working on HR contracts unless asked, or copying HR content anywhere
  else; presenting output as
  final legal advice; any other action with consequences outside the company. The repository rules
  (released versions and signed instances are immutable, no personal data in the library, one
  clause, bundle or instance per PR, flag rather than guess) are the corpus's and are followed from
  its `AGENTS.md`, not restated. Tool restrictions enforce what they can.
- **DEC-9**: The corpus is the owner's contract system, starting with the private repository
  `meaningfy-ws/legal-agreements`; it may later split into a library and instance repositories
  (the owner's spec). Tolic works in a session started in that repository (design D-9: no
  configuration file) and follows its `AGENTS.md` and docs; it never restates the clause model, drafting style, lifecycle or lint
  rules, and never hard-codes the repository's layout. Rejected: clauses or house conventions as
  skills; clauses as `rulebook` rules; an Overleaf project as the corpus.
- **DEC-10**: Tolic works through GitHub and Overleaf only, for now: git (the corpus repository, a
  branch and PR per contract) is the system of record, and Overleaf is reached through its
  connector and git sync. No Odoo, read or write, in this EPIC. Supersedes Q-10.
- **DEC-11**: Every workflow has exactly one lead worker. `epic-planner` becomes a lead (Vasile);
  new leads `team-lead` (primary `epic-delivery`), `release-manager` (primary
  `meaningfy-release`) and `technical-writer` (primary `technical-writing`). Rejected: a shaping
  lead beside a delegated planner.
- **DEC-12**: Legal work has its own **contract** workflow, owned by the legal activity skill, whose
  phases follow the instance lifecycle (intake → draft → align → review → negotiate, which
  includes sending → sign, which includes registering → harvest; design D-10). The default
  workflow has no gates; the contract repository adds its own gates (its files and tags) and may
  turn strict with its own workflow file. The epic workflows stay for software change.
- **DEC-13**: Tolic has two skills. The **legal activity skill** owns the contract workflow and the
  judgement no repository can hold: the intake interview, skeleton and variant choice by reading
  the library, semantic alignment with `\Parent` and `\BackToBack` contracts, sorting counterparty
  changes (legal effect → variant or override; wording → version), proposals with sources and
  reasons, and when to call for a qualified lawyer. The **corpus skill** is **generic**: how any
  worker operates an external material repository by that repository's own instructions — work in
  the repository the session runs in or one the person names (design D-9), read its `AGENTS.md` and docs before acting, use its own commands, stop on its
  checks, never edit what it declares immutable. It names no contract specifics and lives in
  `meaningfy-core` (Claude's call: a generic skill belongs to the bundle everyone installs). Final
  names are set in the PLAN, purpose-named per DEC-4. Luxembourg law is not a separate skill.
- **DEC-14**: One EPIC, three stages: (1) conventions, docs and the stale fix; (2) persona names and
  the four leads; (3) the legal bundle.
- **DEC-15**: Building the contract system (the class, `ctr`, lint, CI, Antora docs, the
  repositories' `AGENTS.md`) is a software EPIC in the contract repository, delivered there by the
  software workers (Vasile, Radu, Ionut, Mircea) under its own spine. It is not part of this EPIC.
- **DEC-16**: A skill covers a specific, repeatable kind of task. One-off work, such as the Overleaf
  migration, is not a skill: it is planned in the repository where it happens, and who leads it is
  decided there. Rejected: a migration skill or workflow.
- **DEC-17**: Stage 3 is released without a live trial. It is done when `make validate` is green and
  its probes and Gherkin scenarios exist; the acceptance scenarios (Q-13) are run in real use, and
  what is off comes back as skillery issues through `skillery-feedback`. Rejected: a fabricated
  contract fixture; waiting for the contract system.

## Rabbit-holes

- **Tolic ships ahead of his corpus.** The contract system is still being built, so the legal skill
  must describe the activity, not the commands of a repository that may change; the corpus skill
  reads whatever the repository says today (DEC-9, DEC-13).
- **Expertise versus "the agent never decides legal content".** The owner's spec forbids the agent
  deciding legal content; the brief calls Tolic an expert. Resolved as: Tolic proposes and argues
  with sources, the owner decides through a PR, and points needing a qualified Luxembourg lawyer are
  flagged. Guarded by RISK-1.
- **Duplicated rules.** The contract repositories' `AGENTS.md` will carry agent operating rules; the
  `lawyer` agent and the skills must cite them, not copy them (DEC-8, DEC-9).
- **Odoo later.** When Tolic gains Odoo, `ctr register` becomes a second Odoo writer beside
  `sales-agent` (`sales-pipeline-custody`); that boundary is a later change, not this one.
- **Renaming is not a rename.** DEC-4 keeps every dispatch name. Converting `epic-planner` to a lead
  does change how it is invoked: every caller that dispatches it must be found and changed.
- **One lead per workflow vs scheduled agents.** The lead worker is the agent whose primary skill
  owns the workflow: a `lead`, or a `scheduled` agent that also runs human sessions (`sales-agent`
  leads sales). `devops` has both a lead and a scheduled agent; only `devops-engineer` owns its
  workflow, so it is the one lead (design D-3).
- **A lead is the main session.** Navigator activates a workflow when a skill is loaded or a
  subagent is spawned, not when a lead starts, so every lead loads its primary skill first (design
  D-15).
- **opencode.** Navigator is Claude Code only; on opencode a worker has skills and refusals but no
  workflow gates. Recorded, not solved.
- **Public repository.** Skillery is public: no clause text, counterparty name, contract or the
  owner's spec goes into it; tests and examples use fabricated contracts.

## No-gos

- No separate worker roster, repo or artifact type; no sixth artifact type for workflows.
- No renaming of agent files or dispatch names.
- No clause text, skeleton, contract, counterparty name or restated corpus rule in skillery.
- No building of `ctr`, the LaTeX class or the contract repositories in this EPIC (DEC-15).
- No Luxembourg-law skill, no coding skills in the legal bundle.
- No send, sign or register without the owner confirming that one action; no Odoo access at all.
- No migration skill or workflow (DEC-16); no live trial or contract fixture for Tolic (DEC-17).
- No contract specifics in the corpus skill.
- No post-signature obligation tracking beyond what `ctr due` already reports; a later workflow.
- No running contracts through the epic-shaping or epic-delivery workflows.
- No new agent types, no per-agent memory, no hard-coded repository layout in a skill.

---

## What Changes

- Developer and user docs: the worker concept, activity vs know-how skills, one lead per workflow,
  leads may delegate, persona names, external corpus repositories with their own rules; README
  marks workflow-carrying skills and tells a *workflow bundle* apart from a workflow file; the
  stale strict-mode line is fixed.
- Agent standard (`docs/development/agent-template.md`) and three new lint checks: persona name in
  description and role line; every lead lists `Agent`; every default workflow has exactly one lead
  worker, and a lead's primary skill hosts a workflow.
- All ten agents gain persona names; `system-architect` and `conceptual-modeller` gain `Agent`;
  every lead loads its primary skill first.
- **BREAKING**: `epic-planner` changes from `delegated` to `lead` on both CLIs (a primary agent on
  opencode); callers that dispatch it change.
- New lead agents `team-lead`, `release-manager`, `technical-writer`, each named in its
  workflow's `activate`.
- New bundle `meaningfy-legal`: the `lawyer` agent (Tolic), the `contract-practice` skill with the
  `contract` workflow; the generic `corpus-repository` skill in `meaningfy-core`; two `purpose`
  facet values; Overleaf registered as an external dependency; trigger probes, Gherkin scenarios,
  use cases, Quick Starts and README rows.
- UC-W16 *Contracts and NDAs* and the roadmap re-pointed from the planned `contract-drafter` to
  `lawyer` and `meaningfy-legal`.

## Capabilities

### New Capabilities
- `legal-contract-practice`: Tolic and the contract workflow: drafting, revising, aligning with
  parent and back-to-back contracts and proposing clause versions, under the refusals of DEC-8.
- `corpus-repository`: a worker operates external material repositories by their own
  instructions, structure and command line.

### Modified Capabilities
- `catalogue-governance`: agents conform to the standard (persona names, every lead may delegate, a
  lead's primary skill is an activity skill); the activity/know-how distinction within Skill.
- `workflow-definitions`: every workflow names exactly one lead worker; the contract workflow.
- `build-lifecycle`: the build-loop agents named in the lifecycle doc include the new leads.

## Impact

- `agents/*.md` (all ten), four new agent files, `tests/features/agents/*.feature`.
- `skills/*/assets/workflows/*.workflow.json` (`activate.agents`), a new contract workflow,
  `mods/navigator/lib/workflow.test.ts` (TC-16's list).
- `bundles.yaml`, `make bundles` outputs, `facets.yaml` (two `purpose` values), `dependencies.yaml`
  (Overleaf), `tests/trigger_probes.yaml`, `docs/skill-inventory.md` and `docs/use-cases.md`
  (regenerated).
- `docs/development/` (agent-template, governance, workflows, creating-skills, skill-template,
  catalogue-architecture), `docs/environment/navigator.md`, `docs/practice/` pages naming
  `epic-planner`, `docs/future-features.md`, `README.md`, `use-cases/UC-W16`, `UC-W18`, `UC-W19`,
  `CHANGELOG.md`.
- `tools/repo_lint/lint.py` (three checks, `ALL_AGENT_NAMES`), `tests/test_repo_lint_negative.py`.
- External: `meaningfy-ws/legal-agreements` (private), Overleaf access on the user's machine.

### Golden-thread parents
`openspec/specs/catalogue-governance` (Agents conform to the agent authoring standard),
`openspec/specs/workflow-definitions` (Workflows are data that cite their owning skills),
`openspec/specs/subagent-dispatch` (The coordinator decides whether a subagent pays).
