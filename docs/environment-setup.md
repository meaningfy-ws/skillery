# Environment Setup — External Dependencies & Projection

**Audience:** anyone installing the Meaningfy skill catalog into their own machine or project.

Meaningfy skills are deliberately small and **reference** external skills rather than copying
them. This page is the single source for what to install and how to wire a project.

## 1. Install the Meaningfy bundles

From the marketplace (`.claude-plugin/marketplace.json`) — **five bundles**:

```
/plugin marketplace add meaningfy-ws/skillery
/plugin install meaningfy-consulting        # semantic-consulting-coach
/plugin install meaningfy-communication     # executive-communication, technical-writing
/plugin install meaningfy-engineering       # project-setup, cosmic-python, architecture, meaningfy-git-workflow
/plugin install meaningfy-ai-coding         # epic-planning, clarity-gate, bdd-gherkin, meaningfy-code-review
/plugin install meaningfy-spine             # meta-bundle: epic-planning, clarity-gate, bdd-gherkin, meaningfy-code-review, cosmic-python
```

Install only the bundles you need (engineering for Python repos; ai-coding for the
spec-driven workflow; consulting/communication for advisory work). The `meaningfy-spine`
meta-bundle is a curated overlay that installs the lifecycle-driving working set; the durable
spine **assets** (`openspec/` + the forked schema, and `spine/` docs) are projected into a repo
by `project-setup`, not installed as a skill — see [`../spine/meaningfy-spine-bundle.md`](../spine/meaningfy-spine-bundle.md).

## 2. External dependencies

Meaningfy skills reference these by name. They are **not** vendored here.

### Mandatory

| Component | Why Meaningfy uses it | Install |
|-----------|----------------------|---------|
| `superpowers` | TDD, systematic debugging, verification-before-completion, brainstorming — the universal disciplines our skills point to instead of restating | `/plugin install superpowers@claude-plugins-official` |
| `stream-coding` | The documentation-first delivery method (Work Shape → spec → generate-verify-integrate) | install the external `stream-coding` skill |
| `ponytail` | YAGNI / minimal-code discipline — the routing target for "keep the code minimal, avoid over-engineering" (pairs with `cosmic-python`; wired into `project-setup`'s scaffolded `CLAUDE.md`). Ships `/ponytail`, `/ponytail-review`, `/ponytail-audit`, `/ponytail-debt` | `/plugin marketplace add DietrichGebert/ponytail && /plugin install ponytail@ponytail` |
| `@fission-ai/openspec` | **The spec-spine engine.** OpenSpec is the artifact-lifecycle engine the Meaningfy spine is built on — it provides the `/opsx:*` slash-commands (`propose`, `explore`, `apply`, `sync`, `archive` on the core profile) and the change → durable-spec store. A repo wires it with `openspec init`. Pinned version in [`../spine/openspec-version.txt`](../spine/openspec-version.txt) (currently `1.4.1`). See [`../spine/README.md`](../spine/README.md) and [`../spine/workflows.md`](../spine/workflows.md) | `npm install -g @fission-ai/openspec@1.4.1` (or run via `npx @fission-ai/openspec@1.4.1`) |

### Optional / recommended

| Component | Why | Install |
|-----------|-----|---------|
| `commit-commands` | Standardised commit / push / PR mechanics (`meaningfy-git-workflow` delegates here) | `/plugin install commit-commands@claude-plugins-official` |
| `code-review` | Read-only PR review *run* (pairs with the `meaningfy-code-review` checklist skill) | `/plugin install code-review@claude-plugins-official` |
| `gitnexus-*` | Code intelligence / impact analysis (used by the `implementer` and `code-reviewer` wrappers) | external plugin |
| `context7` | Up-to-date library documentation via MCP | external MCP plugin |

> **Drift warning:** the repo validator **cannot detect** when an external skill is renamed
> or removed upstream — Meaningfy skills reference them by name only. If a referenced skill
> stops resolving, check this table against the current upstream names. Treat the *Mandatory*
> set as a release gate when adopting the bundles.

## 3. User level vs project level

Installation splits across two scopes. Put each thing where it belongs and avoid duplication.

| | **User / machine level** (install once) | **Project / repo level** (per repo) |
|---|---|---|
| **Skills** | Install the bundles + external skills (superpowers, stream-coding, ponytail, OpenSpec; optional commit-commands / code-review / gitnexus / context7) globally via `/plugin`, so every repo can reach them | Pin the bundles a given project actually uses; wire the `openspec/` instance via `project-setup` |
| **CLAUDE.md** | The global `~/.claude/CLAUDE.md` holds the durable coding prompt — engineering standards, layering rules, the *constitution* that applies everywhere | The repo `./CLAUDE.md` holds the repo operating manual + routing (what this repo is, how to maintain/validate it), complementing — not restating — the global file |

**Why this split.** Skills are machine-wide tooling, so they live once at user level and propagate
through `/plugin update`; per-project pinning only records which of them a repo relies on. The
constitution (durable standards) is the same across all your work, so it belongs in the global
prompt; the repo file carries only what is specific and local, so the two compose without drift.

> **CLAUDE-canonical.** `CLAUDE.md` is the canonical agentic file (Claude Code loads it); the
> repo-root `AGENTS.md` is a symlink → `CLAUDE.md` for AGENTS-reading tools. Templates live in
> [`../prompts/`](../prompts/) (`CLAUDE.md.template`, `global-prompt.md`) — there is no
> `AGENTS.md.template`.

## 4. Project projection (bootstrap)

Skills propagate through the marketplace (`/plugin update`). To project the agentic files
(`CLAUDE.md`, with `AGENTS.md` as a symlink to it), the `.claude/` layout, and the spine assets
(`openspec/` + the forked schema) into a repo, use the **`project-setup`** skill (in
`meaningfy-engineering`):

- It is an interview-driven scaffolder that creates the whole Meaningfy-standard repo (layout,
  root tool configs, tests, agentic files, the `openspec/` spine wiring, Antora docs, CI).
- It also runs in **brownfield mode** to gap-check and modernise an existing repo.
- Projection is via this skill **only** — there is no init script.

## 6. CI/CD external boundary (deployable repos)

For **deployable** application repos, delivery is split:

- **CI** (test / lint / guardrail / docs-publish) is owned by **`project-setup`** and scaffolded with
  the repo.
- **CD + release + the delivery contract** is owned by the **`ci-cd-delivery`** skill (app-repo side:
  versioned GHCR image, one reusable deploy mechanism, the deploy-trigger contract).

These are **DevOps-owned and out of the skill's automation scope** — documented as a boundary only:

- **`cloud-infrastructure`** — Terraform + Ansible VM provisioning/config (DevOps-manual; not automated here).
- **`infrastructure-stacks`** — Docker Compose stack deploys (rsync + `.env`-from-Secrets to VMs).
- **Vaultwarden** — secret source-of-truth (GitHub Secrets are the deployment copy); **bastion/SSH**
  is the break-glass path.

The CD building blocks and the DevOps decisions to ratify are in the
[`ci-cd-delivery`](../skills/engineering/ci-cd-delivery/SKILL.md) skill.

## 5. Agents → skills migration note

Earlier versions of this repo shipped five sub-agents. The catalog now ships the **knowledge
as skills** plus **three thin wrappers** (`implementer`, `code-reviewer`, `epic-planner`).
The `docs/ai-coding/` runbook predates this change and still names the older agents; map them
as follows when reading it:

| Old agent | Now |
|-----------|-----|
| `gherkin-writer` | the `bdd-gherkin` skill |
| `documenter` | the `technical-writing` skill |
| `code-reviewer` | thin wrapper loading `meaningfy-code-review` (read-only, opus) |
| `epic-planner` | thin wrapper loading `epic-planning` + `clarity-gate` |
| `implementer` | thin wrapper loading `cosmic-python` + external `stream-coding` + `superpowers` TDD |
