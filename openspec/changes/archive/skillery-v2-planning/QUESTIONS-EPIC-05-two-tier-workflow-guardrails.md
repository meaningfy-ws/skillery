# Open Questions — EPIC-05: Two-Tier Workflow & Guardrails

> Questions for [EPIC-05](EPIC-05-two-tier-workflow-guardrails.md) · [PLAN-05](PLAN-05-two-tier-workflow-guardrails.md). Answer inline on the **Answer:** lines.

### Q5.1 — Superseding frozen `docs/ai-coding/` — rewrite in place, or version it?
RISK-6 + C1 make EPIC-05 the *only* sanctioned supersession of frozen content, with each superseded
section marked. Open question: do we overwrite the methodology in place (with pointers) or keep the
old version addressable for engagements still mid-flight under the old model?
- **A) ★** Rewrite in place with explicit "superseded — see two-tier model" markers at each changed section; git history preserves the old version. — Single current source; history is the archive; matches the marking discipline already specified.
- **B)** Move the old docs to `docs/ai-coding/archive/v1/` and write the new model fresh. — Keeps the old model addressable for in-flight work, but two methodologies now coexist on disk.
- **C)** Keep both live behind a version banner until the dogfood engagement closes, then delete v1. — Safest for transitions, most maintenance.

**Answer:** C) 

### Q5.2 — Is the single-owner ownership table a doc, or something the validator can enforce?
R7/T1 author an authoritative ownership table so no behaviour is specified twice (RISK-4). But it is a
prose table; nothing prevents a future skill edit from re-specifying, say, TDD or planning that the
table assigns elsewhere. The "no double-ownership" guarantee is only as strong as reviewer vigilance.
- **A)** Keep it as human canon cross-checked at review — as planned. — Lowest cost; relies on review.
- **B) ★** Keep the prose table but give each owned capability a stable tag and have the validator flag when a non-owner skill's text claims an owned tag (lightweight keyword check). — Turns the anti-double-spec rule into a cheap automated tripwire without semantic analysis.
- **C)** Generate the ownership table from per-skill `owns:`/`defers-to:` frontmatter so it cannot drift from the skills. — Strongest single-source guarantee, most schema work.

**Answer:** B

### Q5.3 — Guardrails (R5) — documented concern only, or do they need an enforcement surface?
R5 documents guardrails (decision bounds, output validation, prompt-injection defence) as a
cross-cutting *concern*, distinct from clarity-gate/tests/review which validate content. But "documented
concern" with no enforcement surface risks being aspirational — agents won't apply bounds they only
read about.
- **A) ★** Document guardrails as a concern *and* point each guardrail type to its concrete enforcement home that already exists (decision bounds → agent wrapper `tools:`/permissions; output validation → tests + clarity-gate; injection → harness/permission settings). — Keeps EPIC-05 scope (documentation) but makes each guardrail land on a real mechanism, not prose.
- **B)** Document the concern only, as written; enforcement is each downstream skill's job. — Matches the shaped scope strictly; weakest teeth.
- **C) (scope-expanding — only if you want to re-shape)** Add a guardrails *skill* or reusable checklist agents must run. — Real teeth, but new scope beyond this EPIC's bet.

**Answer:** C) develop a skill for this purpose, but it must be clear (like for any skill) what it is for, how to use it or run/automate it
