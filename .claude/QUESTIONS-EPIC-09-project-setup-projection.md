# Open Questions — EPIC-09: `project-setup` Projection

> Questions for [EPIC-09](EPIC-09-project-setup-projection.md) · [PLAN-09](PLAN-09-project-setup-projection.md). Answer inline on the **Answer:** lines.

### Q9.1 — How is the pinned `meaningfy` schema *refreshed* in an existing scaffolded repo?
R2/C1 copy a **pinned** schema into the target repo and say "re-run `project-setup` to pick up a newer
pinned schema; show a diff, never clobber." But a project that has authored real specs against schema
vN faces a genuine migration when skillery ships vN+1 — the diff-and-don't-clobber rule doesn't say how
existing artifacts migrate.
- **A) ★** Pin + provide a `project-setup --upgrade-schema` mode that diffs schema versions and emits a migration checklist for affected artifacts, but never auto-rewrites authored specs. — Makes refresh real and safe; respects "never clobber" while owning the migration story.
- **B)** Pin and treat schema upgrades as a manual, documented chore per repo. — Lowest tooling cost; migration burden on each project.
- **C)** Don't pin per-repo at all — reference skillery's schema by version range so repos float forward. — No stale copies, but reintroduces the drift RISK-3 the pin exists to prevent.

**Answer:** A or perhaps B,hoever not sure how this will be used; safer to apply YAGNI here

### Q9.2 — Brownfield (R9): gap-fill in slices vs scaffold-then-reconcile?
R9 keeps brownfield mode, filling gaps "in safe slices, never big-bang," landing large repos as a
shaped EPIC+PLAN. Open: does the tool *detect and patch* gaps in place, or scaffold a clean target and
guide reconciliation? The two imply very different scaffolder designs.
- **A) ★** Detect-and-patch: gap-check reports missing pieces (spine, CLAUDE-canonical, doc layout) and writes only those, idempotently, never touching existing files. — Matches R9's "fill gaps, never clobber" literally; safest for live repos.
- **B)** Scaffold-to-side: generate the ideal layout in a scratch dir and produce a reconciliation diff for the human to apply. — Clearest picture of the target, but more manual reconciliation.
- **C)** Hybrid: auto-patch the trivially-safe gaps (docs, symlinks, `.claude/`), and emit an EPIC+PLAN for the structural ones (layout, layers). — Pragmatic split by risk; most logic to build.

**Answer:** B) we shall run an audit of what is, imagine what would be ideal for this project based on the ideal project setup, as appropriate for the current one, and then propose a plan to upgrade as a clear EPIC specificatiopn and plan/task (whatever terminology openSpec uses)

### Q9.3 — Doc-only/non-product repos: how far does "skip the Python gates" go (R5/R8)?
R5/R8 skip `model/`, importlinter, and coverage gates for non-product repos. But the boundary is
fuzzy — a "doc-only" repo may still ship a small script, and skipping *all* code gates may under-guard
it; conversely scaffolding them annoys a pure-prose repo.
- **A) ★** Three explicit project archetypes in the interview — product / library / doc-only — each with a fixed gate profile, rather than a binary product-vs-not branch. — Removes the fuzzy boundary; each archetype gets exactly the gates it warrants.
- **B)** Binary product-vs-non-product as written; a doc repo that grows code re-runs `project-setup`. — Simplest; defers the edge case.
- **C)** Always scaffold all gates but mark code gates `allow-empty` so they pass trivially until code appears. — One path, self-activating gates, but ships inert config into prose repos.

**Answer:** well, non product and non code projects must be undergoing a propert scuitiny and intention elicitation interview: we must know what is the purpose and what elemants are needed before setting those im place. Regardless some basic principles of automatig "almost" evertuthing and TDD must be preserved.  
