# Environment Setup — External Dependencies & Projection

**Audience:** anyone installing the Meaningfy skill catalog into their own machine or project.

Meaningfy skills are deliberately small and **reference** external skills rather than copying
them. This page is the single source for what to install and how to wire a project.

## 1. Install the Meaningfy bundles

From the marketplace (`.claude-plugin/marketplace.json`):

```
/plugin marketplace add meaningfy-ws/agent-skills
/plugin install meaningfy-engineering      # cosmic-python, architecture, meaningfy-git-workflow
/plugin install meaningfy-ai-coding         # clarity-gate, epic-planning, bdd-gherkin, meaningfy-code-review, technical-writing
/plugin install meaningfy-consulting        # semantic-consulting-coach, executive-communication
```

Install only the bundles you need (engineering for Python repos; ai-coding for the
spec-driven workflow; consulting for advisory work).

## 2. External dependencies

Meaningfy skills reference these by name. They are **not** vendored here.

### Mandatory

| Component | Why Meaningfy uses it | Install |
|-----------|----------------------|---------|
| `superpowers` | TDD, systematic debugging, verification-before-completion, brainstorming — the universal disciplines our skills point to instead of restating | `/plugin install superpowers@claude-plugins-official` |
| `stream-coding` | The documentation-first delivery method (Work Shape → spec → generate-verify-integrate) | install the external `stream-coding` skill |

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

## 3. Project projection (bootstrap)

Skills propagate through the marketplace (`/plugin update`). The **binding templates**
(`CLAUDE.md`, `AGENTS.md`) and the `.claude/` layout propagate through an idempotent script:

- Run `scripts/init-meaningfy-project.sh` once in a new repo to scaffold `CLAUDE.md`,
  `AGENTS.md`, and `.claude/memory/`, and to print the install commands above.
- **Re-run it** after this repo changes to refresh the templates — it shows a diff and never
  overwrites local edits without confirmation. Templates carry a `meaningfy-template-version`
  stamp so a project can tell when it is behind.

## 4. Agents → skills migration note

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
