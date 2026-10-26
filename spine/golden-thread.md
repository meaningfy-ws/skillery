# The golden thread (traceability)

The golden thread answers **"why does this code exist?"** in one hop — each
artifact cites its parent, so any commit traces up to the requirement that
justifies it. This matters for explainability positioning (DORA, the EU AI Act).

## Status: deliberately coarse and provisional

> **This chain is intentionally vague for now** (Q2.3). An over-specified thread
> is dangerous: ADRs and model-entities are only *parts* of architecture, and
> much of the architecture documentation (use cases, C4/ArchiMate views,
> scenarios, contracts) is not yet specified. Pinning a rigid chain now would
> bake in an incomplete model. We refine it once the architecture documentation
> standard is fully shaped (a [HARD question](../.claude/HARD-QUESTIONS.md)).

## The chain (coarse form)

```
Decision Package      (consulting-tier root — openspec/decisions/<id>.md; the paid P1 deliverable)
  → product / requirement specification
    → architecture     (scenarios, ADRs, use cases, C4 + ArchiMate views, contracts, …)
      → EPIC / change   (the work shape; see the note on conflation below)
        → task          (PLAN tasks.md breakdown)
          → test        (specs scenarios → .feature acceptance)
            → commit    (Conventional Commit referencing the change)
```

The **Decision Package** (owned by the [`decision-package`](../skills/decision-package/SKILL.md)
skill, EPIC-07) is the consulting-tier **root** when an engagement starts there: it is a durable
*executive narrative* artifact (recommendation, scope, buy/build/defer, execution brief), so it lives
at `openspec/decisions/<id>.md` — **not** in `openspec/specs/` (which are RFC-2119 behaviour
contracts). The first requirement/architecture entries cite it as their parent. For repos that do not
begin with a consulting engagement, the root is simply the requirement specification.

> **Convention, not yet a schema type.** `openspec/decisions/` is the *intended* home; the forked
> `meaningfy` schema does not yet define a `decisions` artifact type, so `openspec validate --strict`
> does not validate it. Until it does, this is a documented convention (a plain Markdown artifact),
> hardened alongside the golden-thread refinement (see [HARD-QUESTIONS](../.claude/HARD-QUESTIONS.md)).

Each layer **cites the one above it** ("cite your parent").

### Note: EPIC vs change

The "EPIC" and the OpenSpec "change" are currently **one artifact** with two
faces: the EPIC text is a Shape-Up *work shape*, while a plain OpenSpec change
may carry other structure. The spine reconciles them by mapping the EPIC onto
the change's `proposal.md` (see
[`epic-change-memory-mapping.md`](epic-change-memory-mapping.md)) — one artifact,
no proliferation. Whether they should ever diverge is left open on purpose.

## IDs: human-readable, minted at authoring time (Q2.3=A)

- Structured, human-readable prefixes already in use across this series:
  `DEC-`, `EPIC-`, `ADR-`, `RISK-`, plus `R<n>` for requirements and `T<n>` for
  tasks within a PLAN. IDs are **minted by the author** when the artifact is
  written — no auto-minting, no content hashes, no path-derived IDs (those break
  on moves and across repos).
- "Cite your parent" is enforced:
  - as a **thin schema rule** today — `openspec/config.yaml` requires the PLAN
    (`tasks.md`) to cite its parent EPIC on the first line;
  - as a **validator check** later — EPIC-04 extends `tools/repo_lint` to flag
    artifacts missing a parent ID where the link is structural.

## What is NOT yet enforced

Cross-repo IDs (e.g. a conceptual model living in its own repo, EPIC-06) and the
upper rungs (requirement → architecture) are convention-only for now. Hardening
them waits on the architecture-documentation standard and the first-engagement gate.
