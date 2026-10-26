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
| **Agent** | `agents/` | Thin wrapper — see [`spec/agent-template.md`](spec/agent-template.md) |
| **Doc** | `docs/` | Human canon; narrates and points, never restates skill rules |
| **Binding** | `prompts/` + root agentic files (`AGENTS.md`, `CLAUDE.md`) | Mandates and routes; never carries the standard |

**Single-source-of-authority rule:** if a fact belongs to a skill, it lives there and nowhere else.
See [`spec/skill-repo-governance.md`](spec/skill-repo-governance.md) for placement rules.

## Dual-CLI distribution

This catalogue runs on both Claude Code and opencode from one set of sources, with verified parity.
See the durable capability spec [`openspec/specs/dual-cli-distribution`](openspec/specs/dual-cli-distribution/spec.md)
and [`docs/environment/dual-cli/`](docs/environment/dual-cli/README.md) (per-CLI setup + the source→CLI mapping + the
external-dependency compatibility matrix). `AGENTS.md` is canonical; `CLAUDE.md` is a thin pointer
that adds only Claude-specific guidance.

## Skills and agents development method

The method is canon in [`docs/development-method.md`](docs/development-method.md) — principles,
the skill and agent lifecycles, the documentation standard, installability, the issue-driven
improvement loop and the Definition of Done. This binding mandates it; it does not restate it.

- **Change path.** New skill or agent, rename, boundary move, retirement → an EPIC in
  `openspec/changes/`. Wording, link, probe or description tweak that moves no boundary → a direct PR
  from a feature branch. When unsure, EPIC.
- **Branch flow.** A feature branch off `develop`, a PR into `develop`; release and hotfix branches
  follow the [`meaningfy-release`](skills/meaningfy-release) skill. Branch naming and PR mechanics
  are owned by [`meaningfy-git-workflow`](skills/meaningfy-git-workflow).
- **Failure-first.** No skill or agent is written or changed without a recorded failure case; it
  becomes the acceptance test.
- **Proven triggers.** Every description change ships with trigger probes (one positive, one
  near-miss); every agent change ships with a Gherkin scenario under `tests/features/`.
- **One owner, one bundle.** A fact lives in one skill; a skill and an agent each live in exactly one
  bundle; agents carry no method in their body.
- **User-facing docs are part of the change.** Quick Start with a worked example, README entry-point
  row where relevant, CHANGELOG line written for the installer.
- **Issues drive improvement.** Defects and requests come in through the templates in
  [`.github/ISSUE_TEMPLATE/`](.github/ISSUE_TEMPLATE/) and leave as a probe, a fix in the owning
  skill, an EPIC, or a written decline.
- **Done** means the checklist in [§9 of the method](docs/development-method.md#9-definition-of-done)
  is true and `make validate` is green.

## How to maintain / extend the catalogue

- **Adding or changing a skill** — follow the **Skills and agents development method** above; the structural detail is in [`spec/CREATING_SKILLS.md`](spec/CREATING_SKILLS.md). After any
  add, rename, re-bundle, re-describe or re-categorise, run `make skill-inventory` to regenerate
  [`docs/skill-inventory.md`](docs/skill-inventory.md) (drift is caught by
  `tests/test_skill_inventory.py` in `make validate`); a new skill also needs a `PURPOSE_OF` entry in
  [`tools/skill_inventory.py`](tools/skill_inventory.py).
- **Assigning to a bundle** — every skill and every agent is declared in exactly one bundle of
  [`bundles.yaml`](bundles.yaml), the one bundle definition. Then run `make bundles`, which renders
  `.claude-plugin/marketplace.json`, the `bundles/` symlink tree and `tools/opencode-catalogue.json`;
  never hand-edit those.
- **Boundary / related-skills** — every skill's frontmatter must declare its `boundary` and list
  any `related_skills`. This keeps triggers crisp and prevents collisions with external neighbours.
- **Versioning** — the root [`VERSION`](VERSION) file is the single source of version truth; both
  CLI distributions derive their version from it.
- **Dual-CLI parity** — anything you add or change must work on **both** CLIs; the rules are below.

### Dual-CLI authoring rules

The catalogue ships to Claude Code **and** opencode from one set of sources (the
[`dual-cli-distribution`](openspec/specs/dual-cli-distribution/spec.md) contract). When you add or
update an artifact, keep both CLIs working — the gates in `make validate` enforce it:

- **Skills, agents, bundles** — author `skills/`, `agents/` and [`bundles.yaml`](bundles.yaml); they
  are the only sources. Both CLIs install skills straight from `skills/`; opencode agents are
  rendered at install time. A skill **content** edit needs no regeneration. A membership change or an
  agent-frontmatter change needs `make bundles` (the `bundle_gates` check names it when stale). The
  frontmatter map is the contract in [`docs/environment/dual-cli/mapping.md`](docs/environment/dual-cli/mapping.md)
  and its tables live only in `tools/opencode-agent-map.json`; an unmappable field becomes a
  recorded gap (`make opencode-report`), not a silent drop. Frontmatter must be strict YAML — quote a
  `description` that contains `: `.
- **Skill/agent bodies stay CLI-agnostic** — no `/opsx:`-style command forms or `.claude/` paths in a
  body unless it is on the recorded allow-list (the `body_agnosticism` check fails otherwise). Phrase
  operationally-neutral; record an unavoidable CLI-ism as a cosmetic gap in
  [`docs/environment/dual-cli/body-agnosticism-audit.md`](docs/environment/dual-cli/body-agnosticism-audit.md).
- **Commands** — only *content/templates* are shared; registration is **tool-native** (`/opsx:<id>`
  on Claude, `opsx-<id>` on opencode). Don't try to generate one registration form for both.
- **Specs & versions** — `make bundles` writes the root `VERSION` into its three rendered files:
  `.claude-plugin/marketplace.json`, `tools/opencode-catalogue.json` and `package.json`; the
  version-sync gate fails on any mismatch. Hook *intent* is single-sourced in
  [`hooks/inventory.yaml`](hooks/inventory.yaml) and rendered per CLI (see
  [`hooks/bindings.md`](hooks/bindings.md)).

Full per-CLI setup and the compatibility matrix: [`docs/environment/dual-cli/`](docs/environment/dual-cli/README.md).

## How to validate

`make validate` is the guardrail. Run it before every PR; CI runs it too, plus the
`validate-spine` job (`make validate-spine`) and the `opencode-installer` job (`npm run test:opencode-installer`, the node tests of the opencode installer
and agent renderer). See
[`spec/skill-repo-governance.md`](spec/skill-repo-governance.md) for what the validator enforces.

## Common Meaningfy practices

- **Architecture** — align on cosmic-python layering (see the
  [`skills/cosmic-python`](skills/cosmic-python) skill when designing non-trivial additions).
- **Commits** — conventional commits are mandatory; see the
  [`skills/meaningfy-git-workflow`](skills/meaningfy-git-workflow) skill for the full standard.
- **Spine / OpenSpec conventions** — the durable spec spine lives in [`spine/`](spine/) (docs) and [`openspec/`](openspec/) (the live OpenSpec instance + the forked `meaningfy` schema). See [`spine/README.md`](spine/README.md).
- **External method skills land in the spine (binding).** `superpowers` (brainstorming, writing-plans, executing-plans, TDD, …) provides *disciplines*, not a parallel spec system. In a spine-wired repo, their artifacts MUST land in the spine, never in a `docs/superpowers/` tree: a **brainstorming** design feeds the **EPIC** (`openspec/changes/<id>/proposal.md`); **writing-plans is SUPERSEDED** by the **PLAN** (`design.md` + `tasks.md`, gated by `clarity-gate`); execution uses `superpowers:test-driven-development` / `subagent-driven-development`, tracked via the opsx apply command (`/opsx:apply` on Claude, `opsx-apply` on opencode). The verb↔artifact map is in [`spine/workflows.md`](spine/workflows.md#superpowers--spine). skillery **dogfoods this**: its own non-trivial changes are `openspec/changes/` EPICs.
- **Hooks** — hook *intent* is single-sourced in [`hooks/inventory.yaml`](hooks/inventory.yaml) (see [`hooks/README.md`](hooks/README.md)); git-mechanism hooks are shared across CLIs, agent-mechanism hooks are rendered per CLI.

GitNexus scope in this repo: the code in `tools/` and `tests/`. This block lives here only (not in
`CLAUDE.md`, a lint check enforces it); re-index with `npx gitnexus analyze --skip-agents-md`, which
leaves both files untouched.

<!-- gitnexus:start -->
# GitNexus — Code Intelligence

This project is indexed by GitNexus as **skillery** (4607 symbols, 5842 relationships, 76 execution flows). Use the GitNexus MCP tools to understand code, assess impact, and navigate safely.

> Index stale? Run `node .gitnexus/run.cjs analyze` from the project root — it auto-selects an available runner. No `.gitnexus/run.cjs` yet? `npx gitnexus analyze` (npm 11 crash → `npm i -g gitnexus`; #1939).

## Always Do

- **MUST run impact analysis before editing any symbol.** Before modifying a function, class, or method, run `impact({target: "symbolName", direction: "upstream"})` and report the blast radius (direct callers, affected processes, risk level) to the user.
- **MUST run `detect_changes()` before committing** to verify your changes only affect expected symbols and execution flows. For regression review, compare against the default branch: `detect_changes({scope: "compare", base_ref: "develop"})`.
- **MUST warn the user** if impact analysis returns HIGH or CRITICAL risk before proceeding with edits.
- When exploring unfamiliar code, use `query({search_query: "concept"})` to find execution flows instead of grepping. It returns process-grouped results ranked by relevance.
- When you need full context on a specific symbol — callers, callees, which execution flows it participates in — use `context({name: "symbolName"})`.
- For security review, `explain({target: "fileOrSymbol"})` lists taint findings (source→sink flows; needs `analyze --pdg`).

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
