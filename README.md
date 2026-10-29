# Meaningfy Agent Skills (Skillery)

The company-wide home for working with LLM agents **consistently**: reusable agent **skills**, thin
**agents**, human **methodology & standards** docs, and the **binding templates** that wire them into
any project. Runs identically on **Claude Code** and **opencode** from one set of sources — see
[`docs/environment/dual-cli/`](docs/environment/dual-cli/README.md).

## What this is

A curated, self-validating catalogue. **Skills** carry reusable knowledge; **agents** are thin
execution wrappers; `docs/` is written for people (the development method, company practice, setup);
`project-setup` ships the agentic-file templates. The root binding is **`AGENTS.md`-canonical**:
`AGENTS.md` is the CLI-agnostic operating manual (read natively by opencode) and `CLAUDE.md` is a
thin pointer that adds only Claude-specific guidance (no symlink between them). It also carries the
**spine** — *the durable, traceable spec backbone*
(an [OpenSpec](https://github.com/Fission-AI/OpenSpec) instance + a forked `meaningfy` schema under
[`openspec/`](openspec) and [`docs/development/spine.md`](docs/development/spine.md)) — that threads a requirement all the way to a commit.
External skills (superpowers, stream-coding, …) are **referenced, not copied**.

## Who it's for

Bundles are organised by the **role (hat) you wear** — install `meaningfy-core` plus your role(s):

- **Builders / developers** — clean, layered, well-tested Python driven through an AI build loop.
- **Architects / modellers** — system design and the living conceptual (domain) model.
- **Consultants** — advisory work: semantic-tech coaching, decision packages, proposals, estimation.

## What's inside

43 skills in **6 role bundles and 1 workflow bundle** — every skill and every agent lives in exactly one bundle (no duplication); the
table below is bundle-level only. For the per-skill picture — purpose, which cross-cutting concern
each one serves, and which skills depend on which — see
[`docs/skill-inventory.md`](docs/skill-inventory.md) (a generated map + tables, not hand-maintained).

| Bundle | Skills | Install if you… |
|--------|--------|-----------------|
| **meaningfy-core** | **technical-writing** · **explanatory-writing** · **writing-antipatterns** · **meaningfy-voice** · **meaningfy-git-workflow** · **guardrails** · **skillery-feedback** | …do anything (cross-cutting basics) |
| **meaningfy-consulting** | **semantic-consulting-coach** · **decision-package** · **executive-communication** | …do advisory work |
| **meaningfy-sales** | **proposal-writing** · **estimation** · **sales-operations** · **sales-pipeline-custody** · **sales-accounts** · **sales-qualification** · **sales-conversations** | …write proposals and offers, estimate work, run the daily sales grooming of the Odoo pipelines, qualify a deal, or prepare a meeting and its follow-up (agent setup: [`docs/environment/sales-agent.md`](docs/environment/sales-agent.md)); requires `meaningfy-consulting` |
| **meaningfy-architecture** | **architecture** · **conceptual-modelling** · **modelling-conventions** · **linkml-engineering** · **formal-reasoning** | …design systems or model a domain |
| **meaningfy-building** | **epic-planning** · **spec-stewardship** · **clarity-gate** · **bdd-gherkin** · **meaningfy-code-review** · **cosmic-python** · **project-setup** · **ci-cd-delivery** · **meaningfy-release** | …build software with the spine |
| **meaningfy-devops** | **infrastructure-operations** · **stack-operations** · **service-reliability** · **infrastructure-security** | …operate servers and stacks, run the daily check-up, answer alerts or review an infrastructure change (agent setup: [`docs/environment/devops-agents.md`](docs/environment/devops-agents.md)); requires `meaningfy-consulting` |
| **vault-assistant** *(workflow)* | **vault-setup** · **vault-conventions** · **vault-project** · **vault-resume** · **vault-capture** · **vault-promote** · **vault-tidy** · **vault-planning** · **vault-daily** · **rulebook** · **rule-learner** · **rule-steward** | …keep a personal Obsidian vault and the owner's rules; needs a vault, the external `obsidian@obsidian-skills` plugin and the company memory (see [`docs/environment/vault-assistant.md`](docs/environment/vault-assistant.md)) |

Thin **agent** wrappers live in [`agents/`](agents/) — they pin a model + tools and load the skills
above, and ship with the bundle of their primary skill: `epic-planner`, `implementer` and
`code-reviewer` with **`meaningfy-building`**; `system-architect` and `conceptual-modeller` with
**`meaningfy-architecture`**; `proposal-writer` and `sales-agent` with **`meaningfy-sales`**; `devops-engineer`, `ops-watch` and
`infra-reviewer` with **`meaningfy-devops`**. `meaningfy-building` requires
`meaningfy-architecture` (install both); every bundle's requirements are in the
[catalogue map](docs/skill-inventory.md).

> **Moved:** `proposal-writing` and `estimation` left `meaningfy-consulting` for the new
> **`meaningfy-sales`** bundle. Install it with `/plugin install meaningfy-sales@meaningfy-skillery`
> (Claude Code) or `skillery-opencode install meaningfy-sales` (opencode).

> **The spine is a *capability*, not a bundle.** `meaningfy-building` carries the skills that drive
> it; the durable spine **assets** (`openspec/` + the forked schema + `docs/development/` docs) are *projected*
> into your repo by the `project-setup` skill. A spine repo reuses OpenSpec-native artifacts: an
> **EPIC** is the OpenSpec `proposal.md`; a **PLAN** is `design.md` + `tasks.md`.

## Installation

Runs on **Claude Code** and **opencode**, from the same sources, with gate-verified parity — pick
either, you don't need both.

**Start here:** [`docs/environment/setup.md`](docs/environment/setup.md). It's the canonical,
CLI-agnostic entry point — what to install and why — and links you into your CLI's literal,
copy-paste step-by-step (bundles, mandatory deps, root binding, spine commands, an MCP server if you
want one, and a verify step) from there. You shouldn't need to go looking for any other doc to get
installed.

**Always install from the `releases` branch** — it holds only released skills and agents and moves
only at a release ([the convention](docs/development/releasing.md)). `develop` is for contributors
and is not installable.

```bash
# Claude Code
/plugin marketplace add meaningfy-ws/skillery#releases
/plugin install meaningfy-core@meaningfy-skillery        # then the bundles for your role

# opencode
npm exec --yes --package='git+https://github.com/meaningfy-ws/skillery.git#releases' \
  -- skillery-opencode install meaningfy-core --global
```

Pin one exact release with `#vX.Y.Z` instead of `#releases` (from the release after 3.3.0).

> **Added the marketplace from `meaningfy-ws/skillery`, `#develop` or `#dist`?** It does not follow
> releases. Re-add it once: `/plugin marketplace remove meaningfy-skillery`, then
> `/plugin marketplace add meaningfy-ws/skillery#releases`, and reinstall your bundles.

## Getting started

**Skill or agent? The rule of thumb.**
- A **skill** is *on-demand knowledge / method* loaded into your **current** chat — "guide me through
  X". You keep the wheel.
- An **agent** is a *delegated worker* by default, in its **own fresh context** with a fixed role,
  model, and tools — "go do X and report back". It keeps your main context clean. Each agent declares
  a type: `delegated`, `lead` or `scheduled`.
- **skill = teach / guide me; agent = delegate a whole task.** The Meaningfy agents
  (`epic-planner`, `implementer`, `code-reviewer`) each just load the relevant skills and run them in
  isolation. How an agent is written: [`docs/development/agent-template.md`](docs/development/agent-template.md), next to the
  skill template [`docs/development/skill-template.md`](docs/development/skill-template.md).
- Example invocations: "use the code-reviewer agent with lens L3 on this diff" (a full review is five,
  one per lens); "use the implementer agent on task 2.1 of change `<id>`" (it reports, you commit);
  "use the epic-planner agent on these seeds; answer its question round".

**What do I reach for?**

| I want to… | Reach for (in order) |
|---|---|
| Know the code rules (principles, anti-patterns, naming, exceptions, config, layering) | the **[code-principles catalogue](skills/cosmic-python/references/principles-and-anti-patterns.md)** — owned by `cosmic-python`, the single source; every skill/doc cites its `PR-`/`BP-`/`AP-` ids |
| Stand up a new repo | `project-setup` skill → scaffolds layout, tooling, tests, docs, CI, and the spine |
| Build one epic | the loop below (epic-planner → bdd-gherkin → implementer → code-reviewer) |
| Groom the Odoo sales pipeline every day | `sales-agent` (scheduled; setup in [`docs/environment/sales-agent.md`](docs/environment/sales-agent.md)) → `sales-operations` |
| Qualify a lead or score a deal | `sales-qualification` (dossier, five Ps, MEDDPICC) → `sales-accounts` (who they are) |
| Prepare a sales meeting and its follow-up | `sales-conversations` (meeting plan, drafts) |
| Win / scope a client engagement | `semantic-consulting-coach` (think it through) → `decision-package` (produce it) → `proposal-writing` + `estimation` |
| Model a domain | `conceptual-modelling` (the living model + source decision) · `modelling-conventions` (shared craft) |
| Author LinkML / generate typed artefacts | `linkml-engineering` (LinkML → Pydantic/OWL/SHACL, custom templates, gates) |
| Design a system | `architecture` (C4, ADRs, contracts) |
| Write a board paper / client note | `executive-communication` |
| Write docs / a README | `technical-writing` |
| Write a clear explainer / blog-style explanation | `explanatory-writing` |
| Understand what the voice and writing skills cover, or add a register, channel or genre | [`docs/environment/communication.md`](docs/environment/communication.md) |
| Keep your rules for agents: load them, learn new ones, review them weekly | `rulebook` · `rule-learner` · `rule-steward` (how they work: [`docs/environment/rules.md`](docs/environment/rules.md); settings in [`docs/environment/setup.md`](docs/environment/setup.md); the Langfuse deployment they need: [`docs/environment/langfuse-deployment-spec.md`](docs/environment/langfuse-deployment-spec.md)) |
| Ship a service | `ci-cd-delivery` (deploy contract) |
| Change, deploy, resize or retire a server or stack | `devops-engineer` (consent card before anything is applied) → `infrastructure-operations`, `stack-operations` |
| Check the fleet every day, answer alerts at night | `ops-watch` (scheduled; setup in [`docs/environment/devops-agents.md`](docs/environment/devops-agents.md)) → `service-reliability` |
| Review an infrastructure PR or plan | `infra-reviewer` (read-only; you post its report on the PR) |
| Report a skill or agent that did not work, or ask for a new one | `skillery-feedback` (drafts the issue on `meaningfy-ws/skillery`, you approve) |
| Cut / publish a release | `meaningfy-release` (versioning, release branches, PyPI, release notes) |

**The build loop, step by step** (one epic). Drives the OpenSpec `/opsx` verbs — full map in
[`docs/development/workflows.md`](docs/development/workflows.md):

| # | Step | `/opsx` verb | Driven by |
|---|------|-------------|-----------|
| 1 | Gather seeds + elicit (incl. test-scenario interview) | `explore` | **epic-planner** agent (returns question rounds) ◦ `epic-planning` (+ `superpowers:brainstorming`) |
| 2 | Shape the EPIC (= `proposal.md`) | `propose` | **epic-planner** agent (returns question rounds) ◦ `epic-planning` |
| 3 | Derive the PLAN (`design.md` + `tasks.md`) **+ author `.feature` scenarios** (design-phase artifact) | — | **epic-planner** agent (returns question rounds) ◦ `epic-planning` **+ `bdd-gherkin`** |
| 4 | Gate the PLAN (≥9/10, **incl. scenario coverage**) | — | `clarity-gate` skill |
| 5 | Implement: **step definitions + code** (TDD, layered) | `apply` | **implementer** agent ◦ `cosmic-python` + `superpowers:test-driven-development` |
| 6 | Verify / review | `verify` | **code-reviewer** agent ◦ `meaningfy-code-review` |
| 7 | Merge deltas into the living specs | `sync` / `archive` | `spec-stewardship` skill |

> BDD scenario authoring is a **design-phase** activity (the `.feature` files are a PLAN artifact the
> clarity gate scores for coverage); only **step definitions** are written at implement time.

## Uninstall & conflicts

Skillery is additive — it rarely *conflicts*, but it can **overlap** with plugins you already have.

**Check what you have:** on **Claude Code**, open the `/plugin` menu (or inspect `enabledPlugins` in
`~/.claude/settings.json`); on **opencode**, list installed plugins via its plugin manager (or inspect
`opencode.json`). The overlaps below are **Claude-plugin** overlaps (`feature-dev`, `code-review` are
`@claude-plugins-official`); on opencode they simply don't apply — the catalogue's skills are loaded
natively instead.

| Situation | What it is | What to do |
|---|---|---|
| Upgrading from ≤ 2.11 | 3.0.0 changed the install layout (agents only in `meaningfy-building`; per-bundle plugin roots; opencode installs agents) | **Follow the action list** in the [CHANGELOG migration note](CHANGELOG.md#300---2026-10-26). |
| `feature-dev@claude-plugins-official` | official agents (code-architect/explorer/reviewer) overlapping `epic-planner`/`implementer`/`code-reviewer` | **Redundant, not breaking.** Optionally disable `feature-dev` to avoid two voices on the same task. |
| `code-review@claude-plugins-official` | a read-only review *runner* | **Keep** — complementary: it *runs*, `meaningfy-code-review` is the *checklist*. |
| `commit-commands@claude-plugins-official` | commit/push/PR mechanics | **Keep** — `meaningfy-git-workflow` delegates to it. |
| No `stream-coding` / `ponytail` | mandatory external disciplines | **Install them** (see [`setup.md` §2](docs/environment/setup.md#2-external-dependencies)). |

## Documentation

Three doors, by what you came to do.

### Install

Set up the catalogue on your machine, for Claude Code or opencode.

| Where | What | Read it when… |
|---|---|---|
| [`docs/environment/`](docs/environment/setup.md) | machine/tooling setup: external deps, the dual-CLI reference annex, the `openspec/` setup guide | you're installing or extending the catalogue |
| [`docs/environment/dual-cli/`](docs/environment/dual-cli/README.md) | per-CLI setup, the source→CLI mapping and the external-dependency compatibility matrix | you're installing on one CLI or checking what works on both |

### Use

Find the agent or skill that does your job, then its Quick Start.

| Where | What | Read it when… |
|---|---|---|
| [`docs/use-cases.md`](docs/use-cases.md) | every use case the catalogue serves, by area, with the agents and skills that serve it and what is still missing | you want to know what the catalogue can do for you |
| [`docs/practice/ai-coding/`](docs/practice/ai-coding/) | the build-plane lifecycle + the `/opsx` runbook + DoD/quality gates + role playbooks | you're learning how we build with agents |
| [`docs/practice/ai-sales/`](docs/practice/ai-sales/sales-runbook.md) | the sales runbook and DoD (the commercial [engagement lifecycle](skills/semantic-consulting-coach/references/engagement-lifecycle.md) ships with `semantic-consulting-coach`), and the sellable services catalogue (one page per Semantic Layer building block, or a named gap) | you're scoping or describing a commercial offering to a client |
| [`docs/practice/ai-consulting/`](docs/practice/ai-consulting/advisory-runbook.md) | the Deep-tier advisory runbook, the consulting DoD, and the method docs (gap analysis, and four named-but-unowned technique stubs) | you're running or reviewing a Discovery & Onboarding Deep-tier engagement |
| [`docs/practice/roles-and-raci.md`](docs/practice/roles-and-raci.md) | the six project roles and the RACI matrix, cited by every domain's playbooks | you want to know who is accountable for what |
| [`docs/practice/philosophy/`](docs/practice/philosophy/) | the mindset behind it all | you want the *why* |

### Develop

Change the catalogue itself: add or fix a skill, an agent or a bundle.

| Where | What | Read it when… |
|---|---|---|
| [`docs/development/README.md`](docs/development/README.md) | the skillery development method, its one home: how skills and agents are conceived, documented, tested, installed, improved and retired, the authoring guide and templates, governance, the catalogue model, and how to work in this repo | you're writing, changing, reviewing or reporting on a skill or agent, or deciding where something belongs |
| [`docs/future-features.md`](docs/future-features.md) | the features still to build, the material each needs, and the change that will build it | you want to know what is coming, or have material for a feature |
| [`openspec/specs/catalogue-governance/`](openspec/specs/catalogue-governance/spec.md) | the governance contract the validator enforces | you need the rule behind a `make validate` failure |
| [`docs/practice/engineering-standards/`](docs/practice/engineering-standards/) | testing standard, project structure, coding prompt — these **narrate**; the operational rules are the [code-principles catalogue](skills/cosmic-python/references/principles-and-anti-patterns.md) | you want the full engineering standards |

> **Coming:** the durable docs (`engineering-standards/`, `philosophy/`, architecture/ADRs) will be
> published to **GitHub Pages** via AsciiDoc + Antora — skillery applying its own documentation
> standard to itself. Tracked in [`docs/future-features.md`](docs/future-features.md).

## Repository structure

```
skillery/
├── skills/        # flat: skills/<skill>/  (bundles group them in bundles.yaml)
├── agents/        # thin wrappers (no knowledge), each shipped with its primary skill's bundle
├── docs/          # development/ (the method's one home) · practice/ (company practice) · environment/ · use cases, catalogue map, future features
├── use-cases/     # one White use case per file: what the catalogue serves (the golden thread's root)
├── openspec/      # live OpenSpec instance + forked `meaningfy` schema (skillery runs the spine on itself)
├── tools/ + tests/# the validator (make validate), the bundle renderer (make bundles), the opencode installer
├── bundles.yaml   # the one bundle definition: each skill and agent in exactly one bundle
├── bundles/       # GENERATED per-bundle plugin roots (committed copies; never hand-edit, run make bundles)
├── tools/opencode-catalogue.json  # RENDERED opencode catalogue (membership + agent frontmatter); make bundles — never hand-edit
└── .claude-plugin/# RENDERED marketplace (6 role bundles + 1 workflow bundle); make bundles — never hand-edit
```

## Contributing

How skills and agents are conceived, documented, tested, installed, improved and retired:
[`docs/development/README.md`](docs/development/README.md) (mandated by `AGENTS.md`). Report a defect or
ask for a skill/agent through the [issue templates](.github/ISSUE_TEMPLATE/).
Structural detail: [CONTRIBUTING.md](CONTRIBUTING.md) and the [Creating Skills guide](docs/development/creating-skills.md).
Run `make validate` before opening a PR; CI runs it too. The governance method is in
[`docs/development/governance.md`](docs/development/governance.md).

## Licensing

Apache 2.0 (see [LICENSE](LICENSE)); individual skills may carry their own `LICENSE.txt`. External
dependencies are attributed in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

## Support

Open an issue, or contact the maintainers at info@meaningfy.ws.
