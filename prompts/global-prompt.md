<!-- meaningfy-template-version: 3.0.0 -->
# Meaningfy engineering policy (personal global default)

Paste into `~/.claude/CLAUDE.md`. This is the thin, always-on routing policy —
not the full standard (that lives in the skills and `docs/engineering-standards/`).

Use the installed skills; they are the authoritative, tested standards. Do not improvise
what a skill already knows.

- Python structure + code principles/anti-patterns **catalogue** (single source) → **meaningfy-building:cosmic-python**; design → **meaningfy-architecture:architecture**
- Feature/bugfix → **superpowers:test-driven-development** first; debugging → **superpowers:systematic-debugging**
- Planning → **meaningfy-building:epic-planning**; spec readiness → **meaningfy-building:clarity-gate**
- Commits/PRs → **meaningfy-core:meaningfy-git-workflow**; pre-PR review → **meaningfy-building:meaningfy-code-review**

In a **spine repo**, `superpowers` artifacts land in the spine, never a `docs/superpowers/` tree:
brainstorming → the EPIC (`openspec/changes/<id>/proposal.md`); writing-plans is **superseded** by the
PLAN (`design.md`+`tasks.md`, clarity-gated); execution via superpowers TDD, tracked by `/opsx:apply`.

Non-negotiables: tests first; review before merge; human owns the PR. Flag conflicts before proceeding.

Full constitution: `docs/engineering-standards/coding-prompt.md`
