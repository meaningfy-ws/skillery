# Skillery — Repo Operating Manual

This file is a **Binding**: it mandates and routes. It carries no reusable knowledge.
Every substantive topic lives in the skill or doc it points to.

## What this repo is

A company-wide Claude Code skills/agents/docs catalogue. Every artifact is exactly one of four
types (defined in [`spec/skill-repo-governance.md`](spec/skill-repo-governance.md)):

| Type | Home | Rule |
|------|------|------|
| **Skill** | `skills/` | Reusable knowledge; single source of authority per fact |
| **Agent** | `agents/` | Thin wrapper — role + model + tools + skill list; no inlined knowledge |
| **Doc** | `docs/` | Human canon; narrates and points, never restates skill rules |
| **Binding** | `prompts/` + root agentic files | Mandates and routes; never carries the standard (this file is a root Binding) |

**Single-source-of-authority rule:** if a fact belongs to a skill, it lives there and nowhere else.
See [`spec/skill-repo-governance.md`](spec/skill-repo-governance.md) for placement rules.

## How to maintain / extend the catalogue

- **Adding a new skill** — follow [`spec/CREATING_SKILLS.md`](spec/CREATING_SKILLS.md).
- **Assigning to a bundle** — bundles are declared in [`.claude-plugin/marketplace.json`](.claude-plugin/marketplace.json).
- **Boundary / related-skills** — every skill's frontmatter must declare its `boundary` and list
  any `related_skills`. This keeps triggers crisp and prevents collisions with external neighbours.

## How to validate

`make validate` is the guardrail. Run it before every PR; CI runs it too. See
[`spec/skill-repo-governance.md`](spec/skill-repo-governance.md) for what the validator enforces.

## Common Meaningfy practices

- **Architecture** — align on cosmic-python layering (see the
  [`skills/cosmic-python`](skills/cosmic-python) skill when designing non-trivial additions).
- **Commits** — conventional commits are mandatory; see the
  [`skills/meaningfy-git-workflow`](skills/meaningfy-git-workflow) skill for the full standard.
- **Spine / OpenSpec conventions** — the durable spec spine lives in [`spine/`](spine/) (docs) and [`openspec/`](openspec/) (the live OpenSpec instance + the forked `meaningfy` schema). See [`spine/README.md`](spine/README.md).
- **External method skills land in the spine (binding).** `superpowers` (brainstorming, writing-plans, executing-plans, TDD, …) provides *disciplines*, not a parallel spec system. In a spine-wired repo, their artifacts MUST land in the spine, never in a `docs/superpowers/` tree: a **brainstorming** design feeds the **EPIC** (`openspec/changes/<id>/proposal.md`); **writing-plans is SUPERSEDED** by the **PLAN** (`design.md` + `tasks.md`, gated by `clarity-gate`); execution uses `superpowers:test-driven-development` / `subagent-driven-development`, tracked via `/opsx:apply`. The verb↔artifact map is in [`spine/workflows.md`](spine/workflows.md#superpowers--spine). skillery **dogfoods this**: its own non-trivial changes are `openspec/changes/` EPICs.

<!-- ===== GitNexus (harness-maintained, do not hand-edit) ===== -->
<!-- gitnexus:start -->
# GitNexus — Code Intelligence

This project is indexed by GitNexus as **skillery** (2334 symbols, 2730 relationships, 13 execution flows). Use the GitNexus MCP tools to understand code, assess impact, and navigate safely.

> Index stale? Run `node .gitnexus/run.cjs analyze` from the project root — it auto-selects an available runner. No `.gitnexus/run.cjs` yet? `npx gitnexus analyze` (npm 11 crash → `npm i -g gitnexus`; #1939).

## Always Do

- **MUST run impact analysis before editing any symbol.** Before modifying a function, class, or method, run `impact({target: "symbolName", direction: "upstream"})` and report the blast radius (direct callers, affected processes, risk level) to the user.
- **MUST run `detect_changes()` before committing** to verify your changes only affect expected symbols and execution flows. For regression review, compare against the default branch: `detect_changes({scope: "compare", base_ref: "main"})`.
- **MUST warn the user** if impact analysis returns HIGH or CRITICAL risk before proceeding with edits.
- When exploring unfamiliar code, use `query({query: "concept"})` to find execution flows instead of grepping. It returns process-grouped results ranked by relevance.
- When you need full context on a specific symbol — callers, callees, which execution flows it participates in — use `context({name: "symbolName"})`.

## Never Do

- NEVER edit a function, class, or method without first running `impact` on it.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis.
- NEVER rename symbols with find-and-replace — use `rename` which understands the call graph.
- NEVER commit changes without running `detect_changes()` to check affected scope.

## Resources

| Resource | Use for |
|----------|---------|
| `gitnexus://repo/skillery/context` | Codebase overview, check index freshness |
| `gitnexus://repo/skillery/clusters` | All functional areas |
| `gitnexus://repo/skillery/processes` | All execution flows |
| `gitnexus://repo/skillery/process/{name}` | Step-by-step execution trace |

## CLI

| Task | Read this skill file |
|------|---------------------|
| Understand architecture / "How does X work?" | `.claude/skills/gitnexus/gitnexus-exploring/SKILL.md` |
| Blast radius / "What breaks if I change X?" | `.claude/skills/gitnexus/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?" | `.claude/skills/gitnexus/gitnexus-debugging/SKILL.md` |
| Rename / extract / split / refactor | `.claude/skills/gitnexus/gitnexus-refactoring/SKILL.md` |
| Tools, resources, schema reference | `.claude/skills/gitnexus/gitnexus-guide/SKILL.md` |
| Index, status, clean, wiki CLI commands | `.claude/skills/gitnexus/gitnexus-cli/SKILL.md` |

<!-- gitnexus:end -->
