# Binding templates

The thin "always-on" layer that wires skills into a project. Two tiers:

| File | Tier | Goes where | Purpose |
|------|------|-----------|---------|
| `global-prompt.md` | Personal default | `~/.claude/CLAUDE.md` | per-developer routing + non-negotiables |
| `AGENTS.md.template` | Committed project binding | `<repo>/AGENTS.md` | company-wide, team-shared binding for a repo |

`AGENTS.md.template` is the **single canonical binding template**. It fills the repo's `AGENTS.md`,
the canonical, CLI-agnostic file; `CLAUDE.md` is only a pointer to it.

## Rules

- A binding **routes and mandates**; it never carries the standard (standards live in skills and `docs/`).
- **Single source of authority**: fill in `AGENTS.md` and keep it as the one source; do not duplicate
  policy across multiple agentic files.
- Each template carries a `meaningfy-template-version` stamp so a consuming repo can tell when it is
  behind. Refresh with `scripts/init-meaningfy-project.sh` (see `docs/environment/setup.md`).

## AGENTS.md canonical, CLAUDE.md a pointer

opencode and other AGENTS.md-reading tools load `AGENTS.md`; Claude Code loads `CLAUDE.md`. Serve
both from one source: `AGENTS.md` holds the binding, and `CLAUDE.md` is a short regular file that
says "read `AGENTS.md`", imports it with a line `@AGENTS.md`, and adds only Claude Code-specific
guidance:

```markdown
**Read `AGENTS.md` first.** This file adds only Claude Code-specific guidance.

@AGENTS.md
```

**Never symlink** one file to the other, in either direction, and never keep two copies in sync with
a hook. This repo follows the same rule (see the root `CLAUDE.md` and `AGENTS.md`).
