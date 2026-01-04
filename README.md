
# Meaningfy Agent Skills

A curated collection of specialized Agent Skills for Claude Code. Skills extend Claude's capabilities with domain-specific knowledge, tools, and workflows.

## What are Agent Skills?

Agent Skills are self-contained, reusable packages that extend Claude's capabilities in specific domains. Each skill provides focused knowledge, tools, and workflows that Claude can activate when needed.

## Installation

### Via Claude Code CLI

Install the entire skills collection:

```bash
claude code install https://github.com/meaningfy-ws/agent-skills
```

Or install locally from a cloned repository:

```bash
claude code install ./path/to/agent-skills
```

### Via Plugin Marketplace

Install individual skills directly from the marketplace:

```bash
/plugin marketplace add architecture-skills
/plugin marketplace add python-architecture-skills
```

### Accessing Skills

Once installed, the skills are automatically available to Claude. Skills are discovered and activated based on their descriptions when they're relevant to your task.

## Skills Inventory

The following skills are available in this repository:

| Skill Name | Description | Location |
|------------|-------------|----------|
| **architecture** | System-level design, C4 models, ArchiMate, UML diagrams, ADRs, and architecture documentation | [`skills/architecture/`](skills/architecture/) |
| **cosmic-python** | Clean Architecture and Cosmic Python guidance for well-tested, layered Python systems with SOLID principles, testing strategies, and CI/CD setup | [`skills/cosmic-python/`](skills/cosmic-python/) |

To see all available skills, browse the [`skills/`](skills/) directory.

## Quick Links

- **[Creating Skills](spec/CREATING_SKILLS.md)** - Complete guide to building new skills
- **[Contributing](CONTRIBUTING.md)** - How to contribute skills to this repository
- **[Specification](spec/agent-skills-spec.md)** - Formal Agent Skills specification
- **[Template](template/SKILL.md)** - Template for new skills

## Repository Structure

```
agent-skills/
├── .claude-plugin/              # Plugin configuration
├── skills/                      # Individual skills
├── spec/                        # Specification & docs
├── template/                    # Skill template
├── CREATING_SKILLS.md          # How to create skills
├── CONTRIBUTING.md             # Contribution guidelines
└── README.md                   # This file
```

## License

This repository is licensed under Apache 2.0 unless otherwise specified.
Individual skills may have their own licenses - see LICENSE.txt in each skill directory.

See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for attribution of dependencies.
