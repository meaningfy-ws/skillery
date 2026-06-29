# Skillery — Repo Operating Manual

This file is the **canonical, CLI-agnostic Binding** for this repo: it mandates and routes.
It carries no reusable knowledge — every substantive topic lives in the skill or doc it points to.
It is consumed natively by **opencode** (`AGENTS.md`) and pointed to by **Claude Code** (`CLAUDE.md`).
CLI-specific guidance lives in that CLI's binding, never here.

## What this repo is

A company-wide skills/agents/docs catalogue for **Claude Code and opencode**. Every artifact is
exactly one of four types (defined in [`spec/skill-repo-governance.md`](spec/skill-repo-governance.md)):

| Type | Home | Rule |
|------|------|------|
| **Skill** | `skills/` | Reusable knowledge; single source of authority per fact |
| **Agent** | `agents/` | Thin wrapper — role + model + tools + skill list; no inlined knowledge |
| **Doc** | `docs/` | Human canon; narrates and points, never restates skill rules |
| **Binding** | `prompts/` + root agentic files (`AGENTS.md`, `CLAUDE.md`) | Mandates and routes; never carries the standard |

**Single-source-of-authority rule:** if a fact belongs to a skill, it lives there and nowhere else.
See [`spec/skill-repo-governance.md`](spec/skill-repo-governance.md) for placement rules.

## Dual-CLI distribution

This catalogue runs on both Claude Code and opencode from one set of sources, with verified parity.
See the durable capability spec [`openspec/specs/dual-cli-distribution`](openspec/specs/dual-cli-distribution/spec.md)
and [`docs/dual-cli/`](docs/dual-cli/README.md) (per-CLI setup + the source→CLI mapping + the
external-dependency compatibility matrix). `AGENTS.md` is canonical; `CLAUDE.md` is a thin pointer
that adds only Claude-specific guidance.

## How to maintain / extend the catalogue

- **Adding a new skill** — follow [`spec/CREATING_SKILLS.md`](spec/CREATING_SKILLS.md).
- **Assigning to a bundle** — bundles are declared in [`.claude-plugin/marketplace.json`](.claude-plugin/marketplace.json).
- **Boundary / related-skills** — every skill's frontmatter must declare its `boundary` and list
  any `related_skills`. This keeps triggers crisp and prevents collisions with external neighbours.
- **Versioning** — the root [`VERSION`](VERSION) file is the single source of version truth; both
  CLI distributions derive their version from it.

## How to validate

`make validate` is the guardrail. Run it before every PR; CI runs it too. See
[`spec/skill-repo-governance.md`](spec/skill-repo-governance.md) for what the validator enforces.

## Common Meaningfy practices

- **Architecture** — align on cosmic-python layering (see the
  [`skills/cosmic-python`](skills/cosmic-python) skill when designing non-trivial additions).
- **Commits** — conventional commits are mandatory; see the
  [`skills/meaningfy-git-workflow`](skills/meaningfy-git-workflow) skill for the full standard.
- **Spine / OpenSpec conventions** — the durable spec spine lives in [`spine/`](spine/) (docs) and [`openspec/`](openspec/) (the live OpenSpec instance + the forked `meaningfy` schema). See [`spine/README.md`](spine/README.md).
- **External method skills land in the spine (binding).** `superpowers` (brainstorming, writing-plans, executing-plans, TDD, …) provides *disciplines*, not a parallel spec system. In a spine-wired repo, their artifacts MUST land in the spine, never in a `docs/superpowers/` tree: a **brainstorming** design feeds the **EPIC** (`openspec/changes/<id>/proposal.md`); **writing-plans is SUPERSEDED** by the **PLAN** (`design.md` + `tasks.md`, gated by `clarity-gate`); execution uses `superpowers:test-driven-development` / `subagent-driven-development`, tracked via the opsx apply command (`/opsx:apply` on Claude, `opsx-apply` on opencode). The verb↔artifact map is in [`spine/workflows.md`](spine/workflows.md#superpowers--spine). skillery **dogfoods this**: its own non-trivial changes are `openspec/changes/` EPICs.
- **Hooks** — hook *intent* is single-sourced in [`hooks/inventory.yaml`](hooks/inventory.yaml) (see [`hooks/README.md`](hooks/README.md)); git-mechanism hooks are shared across CLIs, agent-mechanism hooks are rendered per CLI.
