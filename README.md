# Meaningfy Agent Skills

The company-wide home for working with LLM agents **consistently**: reusable Claude Code
**skills**, thin **agents**, human **methodology & standards** docs, and the **binding
templates** that wire them into any project.

## What this is

A curated, self-validating catalog. Skills carry the reusable knowledge; agents are thin
execution wrappers; `docs/` is the human canon (methodology, engineering standards, philosophy);
`prompts/` holds the CLAUDE.md templates (CLAUDE-canonical: `CLAUDE.md` is the agentic file,
`AGENTS.md` is a root symlink to it) that bind it all into a repo. External skills
(superpowers, stream-coding, …) are **referenced, not copied** — see
[`docs/environment-setup.md`](docs/environment-setup.md).

## Who it's for

- **Developers & tech leads** building clean, layered, well-tested Python with AI assistance.
- **Consultants** doing advisory work (semantic technologies, executive communication).
- **Anyone** standardising how their team uses Claude Code across projects.

## What's inside

Skills are nested under `skills/` by phase (`consulting/`, `communication/`, `engineering/`,
`ai-coding/`) and shipped through **five bundles**:

| Bundle | Skill | Purpose |
|--------|-------|---------|
| `meaningfy-consulting` | **semantic-consulting-coach** | Coaching for a semantic-tech / data consulting business (sales/discovery skills land here later) |
| `meaningfy-communication` | **executive-communication** | McKinsey-style executive messaging (SCQA, Minto, MECE) |
| | **technical-writing** | Docs, explanations, summaries, docstrings |
| `meaningfy-engineering` | **project-setup** | Scaffold a new Meaningfy-standard Python repo (or modernise an existing one) — layout, tooling, tests, agentic files, Antora docs, CI |
| | **cosmic-python** | Clean, layered Python (models/adapters/services/entrypoints), SOLID, testing, CI |
| | **architecture** | System design — C4, ArchiMate/UML, ADRs, contracts |
| | **meaningfy-git-workflow** | Conventional commits, branching, PRs, dev-environment hygiene |
| `meaningfy-ai-coding` | **epic-planning** | Shape an EPIC from seeds, then derive its clarity-gated PLAN |
| | **spec-stewardship** | Living-spec lifecycle: archive changes, groom `specs/`, keep the orientation index honest |
| | **clarity-gate** | Pre-implementation spec quality gate (≥9/10) |
| | **bdd-gherkin** | BDD Gherkin features + test data from a spec |
| | **meaningfy-code-review** | Pre-PR review checklist & criteria |
| `meaningfy-spine` | *(meta-bundle)* | Curated overlay installing the spine working set (epic-planning, clarity-gate, bdd-gherkin, meaningfy-code-review, cosmic-python). The durable spine **assets** (`openspec/` + the forked `meaningfy` schema, and `spine/` docs) are projected into a repo by `project-setup`, not installed as a skill — see [`spine/README.md`](spine/README.md) and [`spine/meaningfy-spine-bundle.md`](spine/meaningfy-spine-bundle.md) |

Thin agent wrappers live in [`agents/`](agents/) (`implementer`, `code-reviewer`,
`epic-planner`) — they pin a model / tools and load the skills above.

> The spine reuses OpenSpec-native artifacts: an **EPIC** is the OpenSpec `proposal.md`
> and a **PLAN** is `design.md` + `tasks.md` — there are no standalone `EPIC.md`/`PLAN.md`
> files in a spine-wired repo.

## Getting started

Install happens at two levels. Install the bundles you need:

```
/plugin marketplace add meaningfy-ws/skillery
/plugin install meaningfy-consulting
/plugin install meaningfy-communication
/plugin install meaningfy-engineering
/plugin install meaningfy-ai-coding
/plugin install meaningfy-spine        # meta-bundle: the spec-spine working set
```

**User / machine level (install once).** Install the bundles plus the external skills
(superpowers, stream-coding, ponytail, **OpenSpec**, and optional commit-commands /
code-review / gitnexus / context7) globally via `/plugin`, and keep the durable coding
prompt — your engineering standards, the *constitution* — in the global `~/.claude/CLAUDE.md`.

**Project / repo level (per repo).** Pin the bundles a given project actually uses, wire the
`openspec/` instance with the **`project-setup`** skill (interview-driven full scaffold; also
modernises existing repos), and keep the repo operating manual + routing in the repo `./CLAUDE.md`,
complementing — not duplicating — the global file.

The full mandatory/optional external dependencies and the user-vs-project split are in
[`docs/environment-setup.md`](docs/environment-setup.md).

## How to use it

| You want to… | Go to |
|--------------|-------|
| Install/curate skills | the five bundles above |
| Wire a repo with the spine | the **`project-setup`** skill (projects `openspec/` + agentic files) |
| Learn the AI-coding method | [`docs/ai-coding/`](docs/ai-coding/) |
| Apply engineering standards | [`docs/engineering-standards/`](docs/engineering-standards/) + [`prompts/`](prompts/) |
| Understand the mindset | [`docs/philosophy/`](docs/philosophy/) |
| Contribute a skill | [`spec/`](spec/) (incl. [`skill-template.md`](spec/skill-template.md)) |

## Repository structure

```
skillery/
├── skills/        # nested by phase: consulting/ communication/ engineering/ ai-coding/
├── agents/        # three thin wrappers (no knowledge): implementer, code-reviewer, epic-planner
├── docs/          # ai-coding/ · engineering-standards/ · philosophy/ · environment-setup.md
├── prompts/       # CLAUDE.md.template, global-prompt.md (CLAUDE-canonical; AGENTS.md is a root symlink)
├── spec/          # authoring spec, governance, skill-template.md, CREATING_SKILLS.md
├── spine/         # the OpenSpec spec-spine docs/conventions
├── openspec/      # live OpenSpec instance + forked `meaningfy` schema (skillery dogfoods its own spine)
├── tools/ + tests/# the self-consistency validator (make validate)
└── .claude-plugin/# marketplace (5 bundles incl. meaningfy-spine)
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
