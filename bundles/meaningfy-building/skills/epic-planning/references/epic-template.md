# EPIC + PLAN Templates

Specifications-first, two artifacts per unit of work (the EPIC **is** the work shape — Shape Up
style — not a separate upstream input):

- **EPIC.md** — the **shaped bet**: the specification at the right level of abstraction (appetite,
  problem, solution outline, key decisions, rabbit-holes, no-gos). Concrete enough to commit to,
  abstract enough to leave the implementer room. **Frozen once shaped.**
- **PLAN.md** — the **derived executable plan**: the unambiguous, agent-oriented breakdown
  (algorithm, examples, test specs, task breakdown). The **clarity gate scores the PLAN** (≥9/10) —
  gate the plan, not the shape. PLAN Part 1 freezes once gated; Part 2 is the implementation log.

Both live in `.claude/memory/epics/<epic-name>/`.

## EPIC.md — the shaped bet

```markdown
# Epic: <Epic Name>

## Status
- Phase: [Shaping | Shaped | Planned | In Progress | Complete]
- Appetite: [small batch ≈1–2 wks | big batch ≈6 wks]   <!-- time we'll spend, not an estimate -->
- Last updated: yyyy-mm-dd

## Metadata
| Field | Value |
|-------|-------|
| Derived from | <architecture doc / ADR / use case — file path + anchor> |
| Dependencies | <upstream epics> |

## Problem
The raw idea / use case / pain. WHY now, for whom, what breaks if we do nothing.

## Solution outline
The shaped approach at the right abstraction — elements and key flows. Fat-marker over pixel
detail; leave implementation room. (Mermaid diagram where it clarifies.)

## Key decisions
| Decision | Rationale | Rejected alternative |
|----------|-----------|----------------------|
(Shaping-level decisions — boundaries and approach, not implementation minutiae.)

## Glossary
Internal terms / concept definitions for agent use.

## Rabbit holes
Risks, unknowns, places the work could balloon past the appetite — named so the implementer
doesn't fall in.

## No-gos
Explicitly out of scope for this bet.

## Open questions
Resolve before the PLAN is gated.

## References
Deep links only — file path + section anchor.
```

The EPIC freezes once shaped; the PLAN is derived from it.

## PLAN.md — the derived, clarity-gated plan

```markdown
# Plan: <Epic Name>

## Status
- Epic: ./EPIC.md
- Clarity gate: [not scored | <score>/10 on yyyy-mm-dd]   <!-- ≥9/10 before implementation -->
- Phase: [Planning | Ready | In Progress | Complete]

---
# Part 1 — Plan
<!-- Derived from EPIC.md. Frozen once the clarity gate passes. On a design-level failure, fix the
     plan (and re-gate), not the code. -->

## Algorithm / Flow
Concrete algorithm, with a Mermaid diagram where useful.

## Concrete Examples
Real or fabricated examples showing expected inputs and outputs.

## Anti-Patterns (DO NOT)
| Don't | Do Instead | Why |
|-------|-----------|-----|
(Minimum 5 entries)

## Test Case Specifications
| Test ID | Component | Input | Expected Output | Edge Cases |
|---------|-----------|-------|-----------------|------------|
(Minimum 5 entries — these seed the Gherkin features.)

## Error Handling Matrix
| Error Type | Detection | Response | Fallback |
|------------|-----------|----------|----------|

## Task Breakdown
Ordered tasks, each with: description; architectural layers involved (domain, adapters,
services, entrypoints); dependencies; acceptance criteria.

## Roadmap
- [ ] Task 1: ...
- [ ] Task 2: ...

---
<!-- implementation-log -->
---

# Part 2 — Implementation Log
<!-- Written and updated by the implementer. One dated entry per task; outcomes, not logistics.

### yyyy-mm-dd — Task 1: <task title>
- **Outcome:** what was delivered.
- **Decisions:** key choices and rationale.
- **Deviations:** departures from the plan and why (design-level deviations re-gate the plan).
- **Commits:** link(s).
-->
```

The separator `--- <!-- implementation-log --> ---` marks where the frozen plan ends and the
evolving implementation record begins.
