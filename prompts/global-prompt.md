<!-- meaningfy-template-version: 3.0.0 -->
# Meaningfy engineering policy (personal global default)

Paste into `~/.claude/CLAUDE.md`. This is the thin, always-on routing policy —
not the full standard (that lives in the skills and `docs/engineering-standards/`).

Use the installed skills; they are the authoritative, tested standards. Do not improvise
what a skill already knows.

- Python structure → **meaningfy-engineering:cosmic-python**; design → **meaningfy-engineering:architecture**
- Feature/bugfix → **superpowers:test-driven-development** first; debugging → **superpowers:systematic-debugging**
- Planning → **meaningfy-ai-coding:epic-planning**; spec readiness → **meaningfy-ai-coding:clarity-gate**
- Commits/PRs → **meaningfy-engineering:meaningfy-git-workflow**; pre-PR review → **meaningfy-ai-coding:meaningfy-code-review**

Non-negotiables: tests first; review before merge; human owns the PR. Flag conflicts before proceeding.

Full constitution: `docs/engineering-standards/coding-prompt.md`
