# Skillery — Repo Operating Manual

This file is the **canonical, CLI-agnostic Binding** for this repo: it mandates and routes.
It carries no reusable knowledge — every substantive topic lives in the skill or doc it points to.
It is consumed natively by **opencode** (`AGENTS.md`) and pointed to by **Claude Code** (`CLAUDE.md`).
CLI-specific guidance lives in that CLI's binding, never here.

## What this repo is

A company-wide skills/agents/docs catalogue for **Claude Code and opencode**. Every artifact is
exactly one of six types (defined in [`docs/development/governance.md`](docs/development/governance.md)):

| Type | Home | Rule |
|------|------|------|
| **Skill** | `skills/` | Reusable knowledge; single source of authority per fact |
| **Agent** | `agents/` | Thin wrapper — see [`docs/development/agent-template.md`](docs/development/agent-template.md) |
| **Doc** | `docs/` | Written for people; narrates and points, never restates skill rules |
| **Binding** | root agentic files (`AGENTS.md`, `CLAUDE.md`) + `project-setup`'s agentic templates | Mandates and routes; never carries the standard |
| **Mod** | `mods/` | Claude Code hooks module; observes, displays, runs commands or denies a command; carries no method |
| **Quality check** | `quality/` | Executable checks (rule files, configurations) that projects run and skillery tests; no rule text, the owning skill holds it |

**Single-source-of-authority rule:** if a fact belongs to a skill, it lives there and nowhere else.
See [`docs/development/governance.md`](docs/development/governance.md) for placement rules.

## Dual-CLI distribution

This catalogue runs on both Claude Code and opencode from one set of sources, with verified parity.
See the durable capability spec [`openspec/specs/dual-cli-distribution`](openspec/specs/dual-cli-distribution/spec.md)
and [`docs/environment/dual-cli/`](docs/environment/dual-cli/README.md) (per-CLI setup + the source→CLI mapping + the
external-dependency compatibility matrix). `AGENTS.md` is canonical; `CLAUDE.md` is a thin pointer
that adds only Claude-specific guidance. **Both CLIs install only from the `releases` branch**
(`meaningfy-ws/skillery#releases`), the one branch that holds the release tags and the bundles as
real files; `.github/workflows/releases.yml` publishes it when a release lands on `main`. The
convention and the release steps are in [`docs/development/releasing.md`](docs/development/releasing.md).

## Skills and agents development method

The method is defined in [`docs/development/README.md`](docs/development/README.md) — principles,
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
  near-miss); every behavioural agent change ships with a Gherkin scenario under `tests/features/`.
- **One owner, one bundle.** A fact lives in one skill; a skill and an agent each live in exactly one
  bundle; agents carry no method in their body.
- **User-facing docs are part of the change.** Quick Start with a worked example, README entry-point
  row where relevant, CHANGELOG line written for the installer.
- **Issues drive improvement.** Defects and requests come in through the templates in
  [`.github/ISSUE_TEMPLATE/`](.github/ISSUE_TEMPLATE/) and leave as a probe, a fix in the owning
  skill, an EPIC, or a written decline.
- **Done** means the checklist in [§9 of the method](docs/development/README.md#9-definition-of-done)
  is true and `make validate` is green.

## How to maintain / extend the catalogue

- **Adding or changing a skill** — follow the **Skills and agents development method** above; the structural detail is in [`docs/development/creating-skills.md`](docs/development/creating-skills.md). After any
  add, rename, re-bundle, re-describe or facet change, run `make skill-inventory` to regenerate the
  catalogue map [`docs/skill-inventory.md`](docs/skill-inventory.md) (drift is caught by
  `tests/test_skill_inventory.py` in `make validate`); every skill and agent declares the six facets
  of [`facets.yaml`](facets.yaml) under `metadata`.
- **Adding or changing a mod** — the Mod type and its structure are in
  [`docs/development/mods.md`](docs/development/mods.md); a mod is declared in one bundle under `mods:`
  and checked by `make mods` (inside `make validate`).
- **Assigning to a bundle** — every skill and every agent is declared in exactly one bundle of
  [`bundles.yaml`](bundles.yaml), the one bundle definition. Then run `make bundles`, which renders
  `.claude-plugin/marketplace.json`, the committed `bundles/` tree (symlinks into skills/agents plus one
  `.claude-plugin/plugin.json` per bundle), the `openspec/schemas/meaningfy` copy and
  `tools/opencode-catalogue.json`. **Never write into `bundles/` (or those two files) by hand —
  always regenerate them with `make bundles` and commit the result;** `make validate` and CI fail on
  any difference.
- **Boundary / related-skills** — every skill's body carries a `## Boundary & Related Skills`
  section (a body section, not frontmatter) that states its boundary and names its related skills.
  This keeps triggers crisp and prevents collisions with external neighbours.
- **Versioning** — the root [`VERSION`](VERSION) file is the single source of version truth; both
  CLI distributions derive their version from it.
- **Dual-CLI parity** — anything you add or change must work on **both** CLIs; the rules are below.

### Dual-CLI authoring rules

Skills and agents, bodies, commands, versions and hooks must work on both CLIs. The rules are in
[`docs/environment/dual-cli/`](docs/environment/dual-cli/README.md) and the
[`dual-cli-distribution`](openspec/specs/dual-cli-distribution/spec.md) spec; `make validate` gates
enforce them.

## How to validate

**Narrow checks** (while editing, before the first full run): `make lint` (line caps, frontmatter,
links) and `make skill-inventory` (it rewrites `docs/skill-inventory.md`; commit any change), plus
`make bundles` after a skill or agent edit and `make mods` after a mod edit. They are cheap and catch
what turned first full runs red in lean-delivery (finding F-1).

`make validate` is the guardrail. Run it before every PR; CI runs it too (without the reasoning
engines and the LinkML toolchain, whose tests run only locally), plus the
`validate-spine` job (`make validate-spine`) and the `opencode-installer` job (`npm run test:opencode-installer`, the node tests of the opencode installer
and agent renderer). See
[`docs/development/governance.md`](docs/development/governance.md) for what the validator enforces.

## Working conventions

- Never poll: run one background command and wait for its notice.
- Edit files with the edit tool, never a shell or script (`sed`, a `python` heredoc).
- Read a range, not the whole file, when the range is known.
- Read several known files in one call.
- Tools for each activity: the table in `guardrails` (`references/activity-tools.md`).

## Common Meaningfy practices

- **Architecture** — align on cosmic-python layering (see the
  [`skills/cosmic-python`](skills/cosmic-python) skill when designing non-trivial additions).
- **Commits** — conventional commits are mandatory; see the
  [`skills/meaningfy-git-workflow`](skills/meaningfy-git-workflow) skill for the full standard.
- **Spine / OpenSpec conventions** — the durable spec spine lives in [`openspec/`](openspec/) (the live OpenSpec instance + the forked `meaningfy` schema); how this repo runs it is in [`docs/development/spine.md`](docs/development/spine.md).
- **External method skills land in the spine (binding).** `superpowers` (brainstorming, writing-plans, executing-plans, TDD, …) provides *disciplines*, not a parallel spec system. In a spine-wired repo, their artifacts MUST land in the spine, never in a `docs/superpowers/` tree: a **brainstorming** design feeds the **EPIC** (`openspec/changes/<id>/proposal.md`); **writing-plans is SUPERSEDED** by the **PLAN** (`design.md` + `tasks.md`, gated by `clarity-gate`); execution uses `superpowers:test-driven-development` / `subagent-driven-development`, tracked via the opsx apply command (`/opsx:apply` on Claude, `opsx-apply` on opencode). The verb↔artifact map is in [`docs/development/workflows.md`](docs/development/workflows.md#superpowers--spine). skillery **dogfoods this**: its own non-trivial changes are `openspec/changes/` EPICs.
- **Subagents** — before spawning one, follow *Subagent dispatch* in the `guardrails` skill: spawn
  only when it pays, brief it fresh, take the base report back, and have finished work checked by a
  second subagent.
- **Context** — follow *Session hygiene* in the `guardrails` skill: a fresh session at a task
  boundary, compact at a phase boundary right after a commit, never mid-step.
- **Success and failure first** — for every activity, state how the work succeeds and how it fails
  before you start it. The method is the [`test-strategy`](skills/test-strategy) skill.
- **Hooks** — hook *intent* is single-sourced in [`hooks.yaml`](hooks.yaml) (see [`docs/development/hooks.md`](docs/development/hooks.md)); git-mechanism hooks are shared across CLIs, agent-mechanism hooks are rendered per CLI.

GitNexus scope in this repo: the code in `tools/`, `tests/` and skills' `scripts/`. This block lives here only (not in
`CLAUDE.md`, a lint check enforces it); re-index with `npx gitnexus analyze --skip-agents-md`, which
leaves both files untouched.

<!-- gitnexus:start -->
# GitNexus — Code Intelligence

This project is indexed by GitNexus as **skillery**. The lead runs it once per task:

- `impact({target, direction: "upstream"})` before the brief, on the task's symbols; a HIGH or CRITICAL result goes to the developer before the brief.
- `detect_changes()` once before the task's commit.
- Re-index with `npx gitnexus analyze --skip-agents-md`; it leaves this block untouched.
- Never rename with find-and-replace; use `rename`.

Resources, tools and CLI guides: `.claude/skills/gitnexus/`.

<!-- gitnexus:end -->

- **Rules:** this repository's rules for agents are in `docs/rules/`. At the start of an activity, load them with the rulebook skill; change them only through it, by pull request.
