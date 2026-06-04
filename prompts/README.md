# Binding templates

The thin "always-on" layer that wires the skills into a project. Three tiers:

| File | Tier | Goes where | Purpose |
|------|------|-----------|---------|
| `global-prompt.md` | Personal default | your `~/.claude/CLAUDE.md` | per-developer routing + non-negotiables (≤~40 lines) |
| `CLAUDE.md.template` | Committed project binding | `<repo>/CLAUDE.md` | the company-wide, team-shared binding for a repo |
| `AGENTS.md.template` | Cross-tool mirror | `<repo>/AGENTS.md` | tool-neutral mirror of the same policy (Copilot, etc.) |

**Rules**
- The binding **routes and mandates**; it never carries the standard (that lives in skills + `docs/`).
- `CLAUDE.md` and `AGENTS.md` are a **single source** — keep their policy sections identical
  (the repo validator's `templates_mirrored` check enforces the skill set matches).
- Each template carries a `meaningfy-template-version` stamp so a consuming repo can tell when it
  is behind. Refresh with `scripts/init-meaningfy-project.sh` (see `docs/environment-setup.md`).
