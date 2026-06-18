# Open Questions — EPIC-10: `ci-cd-delivery` Skill

> Questions for [EPIC-10](EPIC-10-ci-cd-delivery-skill.md) · [PLAN-10](PLAN-10-ci-cd-delivery-skill.md). Answer inline on the **Answer:** lines.

> The three genuinely deep CD decisions (deploy-trigger standard, registry-pushed images, home of the
> reusable deploy mechanism) are **already surfaced and owned by DevOps** in EPIC-10 §6 with
> recommendations — so they are *not* re-asked here. The open questions below are the ones §6 does
> *not* cover.

### Q10.1 — Does the skill ship *executable* reusable workflow assets, or only templates?
R4/T5 provide "one reusable deploy mechanism" and recommend centralising it in `devops-toolkit` so all
repos `uses:` it. But the skill lives in skillery, not `devops-toolkit`. Open: does skillery ship a
runnable reusable workflow (that must then be kept in sync with the real one in `devops-toolkit`), or
only a template/pointer?
- **A) ★** Ship a *template + a pointer* to the canonical `devops-toolkit` workflow as the source of truth; skillery never hosts a second runnable copy. — Avoids two divergent runnable workflows (the exact duplication the skill exists to kill); single source stays in DevOps' repo.
- **B)** Ship a runnable reusable workflow in skillery and have `devops-toolkit` consume *it*. — Centralises in the skill, but inverts DevOps ownership of their domain (C1 warns against contradicting their runbooks).
- **C)** Ship both a runnable copy and a sync-check. — Convenient, but reintroduces a drift surface.

**Answer:** A) 

### Q10.2 — EPIC-10 is not dogfood-gated but EPIC-09 scaffolds its templates — what if DevOps hasn't ratified §6 when EPIC-09 lands?
The build order lands EPIC-10 "before/with projection" (EPIC-09), but EPIC-10's core decisions (§6) are
DevOps-ratification-gated (C1). If projection arrives before DevOps signs off, EPIC-09's CD seam (T8b)
has nothing stable to render.
- **A) ★** Make EPIC-09's CD seam render the chosen template only *after* §6 ratification; until then the deployable-repo branch scaffolds a clearly-marked TODO stub + the boundary docs. — Keeps projection unblocked without freezing un-ratified CD logic into new repos.
- **B)** Block EPIC-09's deployable branch entirely until §6 is ratified. — Safest correctness, but couples projection to a DevOps meeting.
- **C)** Render the *recommended* §6 defaults now and migrate repos if DevOps later diverges. — Keeps momentum, but may scaffold a pattern DevOps rejects into real repos.

**Answer:** A) 

### Q10.3 — Migrating the ~7× duplicated deploy blocks — in scope to start, or pure documentation?
The "Deleted" row says the ~7× duplicated blocks are migrated "by consuming repos over time (out of
this repo's scope; documented as the migration target)." Open: does the skill at least ship a migration
*runbook/PR recipe*, or only name the target?
- **A) ★** Ship a concrete migration runbook (per-repo PR recipe: replace the inline block with `uses:` the reusable mechanism, map inputs/secrets, verify) — documentation, but actionable, so the migration actually happens. — Turns "documented as the target" into something a team can execute without re-deriving each time; stays within the skill's documentation scope.
- **B)** Name the migration target only, as written; each repo figures out its own migration. — Strictly minimal; risks the duplication never actually getting removed.
- **C) (scope-expanding — only if you want to re-shape)** Have the skill (or an agent) open migration PRs against consuming repos. — Real teeth, but pulls cross-repo automation into scope the EPIC explicitly excludes.

**Answer:** A) 
