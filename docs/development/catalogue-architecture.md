# Catalogue architecture

What the catalogue is made of, where each part lives, and where it is going. The model is the
owner's revision 2 (2026-10-27) from the
[`restructure-and-evaluate-catalogue`](../../openspec/changes/archive/2026-10-26-restructure-and-evaluate-catalogue/proposal.md)
EPIC. The live gap map is [`use-cases.md`](../use-cases.md); this page explains the parts behind it.

## The model

The class view's source is [`catalogue-architecture.class.puml`](catalogue-architecture.class.puml)
(PlantUML; GitHub does not render it, so a rendered SVG is committed beside it by hand whenever the
source changes). It has six lanes: **distribution** (what gets installed), **knowledge** (what agents
know), **action** (what agents do and where), **external** (what it relies on), **intent** (why it
exists) and **assurance and docs** (how we know and tell).

![The catalogue's conceptual model, class view, revision 2](catalogue-architecture.class.svg)

The model has no machine-readable source. The files below are the truth; the picture names them.

### Where each class lives

| Lane | Class | Held by | Checked by |
|---|---|---|---|
| distribution | **Catalogue** | [`VERSION`](../../VERSION), rendered into `.claude-plugin/marketplace.json` and `tools/opencode-catalogue.json` | `bundle_gates` (version sync) |
| distribution | **Bundle** | [`bundles.yaml`](../../bundles.yaml), rendered by `make bundles` | `bundle_gates`, `bundle_requirements`, `expected_bundle_membership` |
| distribution | **Binding** | [`AGENTS.md`](../../AGENTS.md), [`CLAUDE.md`](../../CLAUDE.md), `project-setup`'s agentic templates ([`AGENTS.md.tmpl`](../../skills/project-setup/assets/templates/agentic/AGENTS.md.tmpl)) | `agents_canonical_invariant` |
| distribution | **ConfigItem** | hooks only: [`hooks.yaml`](../../hooks.yaml); commands, rules and settings are planned (change `add-config-items`, later) | `hooks_inventory_shape` |
| knowledge | **Skill** | `skills/<name>/SKILL.md`, its six facets from [`facets.yaml`](../../facets.yaml); `kind` stays conceptual | `frontmatter_*`, `facets_declared`, `boundary_section_present` |
| knowledge | **Resource** | every other file in a skill folder (`references/`, `assets/`, `scripts/`); shared ones sit in a foundation skill such as `meaningfy-voice` | `cross_skill_paths` |
| knowledge | **ToolPolicy** | an agent's `tools` / `disallowedTools`; a skill's optional `allowed-tools` (none declared today) | `agent_conformance`, `frontmatter_keys` |
| action | **Agent** | `agents/<name>.md`, written to [`docs/development/agent-template.md`](agent-template.md); `mode` derived from `type` in `tools/opencode-agent-map.json` | `agent_conformance`, `agent_bundle_membership` |
| action | **DispatchContract** | the dispatch section of each agent body | `agent_conformance` |
| action | **Runtime** | planned (change `extend-agent-template`) | — |
| external | **ExternalDependency** | prose tables in [`compatibility.md`](../environment/dual-cli/compatibility.md) and [`mcp-setup.md`](../environment/dual-cli/mcp-setup.md); a structured register is planned (change `add-external-dependency-register`) | — |
| external | **MemoryStore** | planned (change `add-odoo-memory-skill` for Odoo; the others with the agent that needs them) | — |
| intent | **UseCase** | [`use-cases/`](../../use-cases/), one White use case per file; the view [`use-cases.md`](../use-cases.md) | `use_case_catalogue`, the drift test of `make skill-inventory` |
| assurance | **Test** | probes [`tests/trigger_probes.yaml`](../../tests/trigger_probes.yaml), trigger sets and eval cases in [`tests/evals/`](../../tests/evals/README.md), agent Gherkin in `tests/features/agents/`, lint checks in `tools/repo_lint/` | `make validate` |
| assurance | **Doc** | the register in [§8 of the method](README.md#8-where-things-live); `door` lands with the README's three doors | `doc_register_complete`, `broken_links` |
| assurance | **Change** | an EPIC in [`openspec/changes/`](../../openspec/changes/) | `make validate-spine` |

## Areas and the `ai-*` domains

The `area` facet says which part of Meaningfy's work a skill, agent or use case serves.
[`define-ai-domains`](../../openspec/changes/define-ai-domains/proposal.md) organises the human docs into
three domains. The two lists meet like this:

| `area` | `ai-*` domain |
|---|---|
| `coding` | `ai-coding` (building) |
| `sales` | `ai-sales` (selling) |
| `consulting` | `ai-consulting` (advising) |
| `operations` | none yet; the nearest is `ai-coding` (delivery and operations) |
| `business`, `legal`, `design`, `personal` | none; they serve the company and the owner, not a client process |
| `cross-cutting` | every domain |

A domain is a client-facing process with its lifecycle, runbook and playbooks; an area is a tag. An
area without a domain needs no domain doc until it has a process to describe.

## Target structure

*Approved by the owner, 2026-10-26.* Bundles by activity, existing and planned. The
re-bundling itself is the change `rebundle-by-activity`; moving a skill between bundles happens there,
not here.

| Bundle | Areas | Skills | Agents | Requires |
|---|---|---|---|---|
| `meaningfy-sales` | sales | proposals and estimates; the five sales skills (operations, pipeline custody, accounts, qualification, conversations); the commercial chain | `proposal-writer`, `sales-agent`; planned: `qualifier`, `offer-designer`, `demo-builder` | `meaningfy-consulting` |
| `meaningfy-devops` *(planned)* | operations | the devops package's skills | planned: `devops-engineer` | `meaningfy-building` |
| `meaningfy-business` *(planned)* | business, legal | negotiation, internal communication, contracts | planned: `business-coach`, `negotiation-partner`, `internal-comms`, `contract-drafter` | `meaningfy-consulting` |
| `meaningfy-design` *(planned)* | design | visual identity, diagram and slide styles | planned: `graphic-designer` | — |

## Agent roster

*Approved by the owner, 2026-10-26; the built agents only.* One row per agent; `type` is the agent
template's (a thinking partner is a `lead` agent). The agents still to build are in
[`future-features.md`](../future-features.md).

| Agent | Type | Use cases | Bundle | Change |
|---|---|---|---|---|
| `epic-planner` | delegated | UC-W18 | `meaningfy-building` | exists |
| `implementer` | delegated | UC-W18 | `meaningfy-building` | exists |
| `code-reviewer` | delegated | UC-W18 | `meaningfy-building` | exists |
| `system-architect` | lead | UC-W19 | `meaningfy-architecture` | exists |
| `conceptual-modeller` | lead | UC-W20 | `meaningfy-architecture` | exists |
| `proposal-writer` | delegated | UC-W8 | `meaningfy-sales` | exists |
| `sales-agent` | scheduled | UC-W7 | `meaningfy-sales` | exists |

## Roadmap

The features still to build, with the material each needs and the change that will build it, are in
[`future-features.md`](../future-features.md).
