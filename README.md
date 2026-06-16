# Meaningfy Agent Skills

The company-wide home for working with LLM agents **consistently**: reusable Claude Code
**skills**, thin **agents**, human **methodology & standards** docs, and the **binding
templates** that wire them into any project.

## What this is

A curated, self-validating catalog. Skills carry the reusable knowledge; agents are thin
execution wrappers; `docs/` is the human canon (methodology, engineering standards, philosophy);
`prompts/` holds the CLAUDE.md/AGENTS.md templates that bind it all into a repo. External skills
(superpowers, stream-coding, …) are **referenced, not copied** — see
[`docs/environment-setup.md`](docs/environment-setup.md).

## Who it's for

- **Developers & tech leads** building clean, layered, well-tested Python with AI assistance.
- **Consultants** doing advisory work (semantic technologies, executive communication).
- **Anyone** standardising how their team uses Claude Code across projects.

## What's inside

| Bundle | Skill | Purpose |
|--------|-------|---------|
| `meaningfy-engineering` | **project-setup** | Scaffold a new Meaningfy-standard Python repo (or modernise an existing one) — layout, tooling, tests, agentic files, Antora docs, CI |
| | **cosmic-python** | Clean, layered Python (models/adapters/services/entrypoints), SOLID, testing, CI |
| | **architecture** | System design — C4, ArchiMate/UML, ADRs, contracts |
| | **meaningfy-git-workflow** | Conventional commits, branching, PRs, dev-environment hygiene |
| `meaningfy-ai-coding` | **clarity-gate** | Pre-implementation spec quality gate (≥9/10) |
| | **epic-planning** | Work Shape → implementation-ready EPIC.md |
| | **bdd-gherkin** | BDD Gherkin features + test data from a spec |
| | **meaningfy-code-review** | Pre-PR review checklist & criteria |
| | **technical-writing** | Docs, explanations, summaries, docstrings |
| `meaningfy-consulting` | **semantic-consulting-coach** | Coaching for a semantic-tech / data consulting business |
| | **executive-communication** | McKinsey-style executive messaging (SCQA, Minto, MECE) |

Thin agent wrappers live in [`agents/`](agents/) (`implementer`, `code-reviewer`,
`epic-planner`) — they pin a model / tools and load the skills above.

## Getting started

```
/plugin marketplace add meaningfy-ws/skillery
/plugin install meaningfy-engineering
/plugin install meaningfy-ai-coding
/plugin install meaningfy-consulting
```

Then scaffold a repo with the **`project-setup`** skill (interview-driven full scaffold, also
modernises existing repos) — or, for just the agentic binding files, run the minimal
`scripts/init-meaningfy-project.sh` (writes `CLAUDE.md`/`AGENTS.md`, creates the `.claude/` layout,
prints external-dependency install commands). Full setup and the mandatory/optional external
dependencies are in [`docs/environment-setup.md`](docs/environment-setup.md).

## How to use it

| You want to… | Go to |
|--------------|-------|
| Install/curate skills | the bundles above + `scripts/init-meaningfy-project.sh` |
| Learn the AI-coding method | [`docs/ai-coding/`](docs/ai-coding/) |
| Apply engineering standards | [`docs/engineering-standards/`](docs/engineering-standards/) + [`prompts/`](prompts/) |
| Understand the mindset | [`docs/philosophy/`](docs/philosophy/) |
| Contribute a skill | [`spec/`](spec/) + [`template/`](template/) |

## Repository structure

```
skillery/
├── skills/        # the catalog (knowledge)
├── agents/        # three thin wrappers (no knowledge)
├── docs/          # ai-coding/ · engineering-standards/ · philosophy/ · environment-setup.md
├── prompts/       # CLAUDE.md / AGENTS.md / global-prompt templates
├── scripts/       # init-meaningfy-project.sh (projection)
├── spec/          # authoring spec + skill-repo governance
├── template/      # skill template
├── tools/ + tests/# the self-consistency validator (make validate)
└── .claude-plugin/# marketplace (3 bundles)
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) and the [Creating Skills guide](spec/CREATING_SKILLS.md).
Run `make validate` before opening a PR; CI runs it too. The governance method is in
[`spec/skill-repo-governance.md`](spec/skill-repo-governance.md).

## Licensing

Apache 2.0 (see [LICENSE](LICENSE)); individual skills may carry their own `LICENSE.txt`. External
dependencies are attributed in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

## Support

Open an issue, or contact the maintainers at info@meaningfy.ws.
