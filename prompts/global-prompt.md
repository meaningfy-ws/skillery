<!-- meaningfy-template-version: 2.0.0 -->
# Meaningfy engineering policy (personal global default)

Paste into your user-level `~/.claude/CLAUDE.md`. This is the thin, always-on routing policy —
**not** the full standard (that lives in the skills and `docs/engineering-standards/`).

For Meaningfy work I expect clean, layered, tested code (minimise WTFs-per-minute). Use the
installed skills rather than improvising — they are the authoritative, tested standards.

- Treat a capable model as a guided peer: explore options and propose trade-offs before building.
- Python code structure → **cosmic-python**; system design → **architecture**.
- Any feature/bugfix → **superpowers:test-driven-development** first; debugging →
  **superpowers:systematic-debugging**.
- Planning → **epic-planning** (+ external **stream-coding**); spec readiness → **clarity-gate**.
- Commits/PRs → **meaningfy-git-workflow**; pre-PR review → **meaningfy-code-review**.

Non-negotiables: tests first; review before merge; human owns the PR. Flag conflicts before proceeding.

Depth: `docs/engineering-standards/coding-prompt.md`.
