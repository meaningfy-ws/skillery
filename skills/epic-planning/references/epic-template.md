# EPIC.md Template

Two-part structure. **Part 1** is written during planning and frozen once complete (the contract
the implementer works against). **Part 2** is a running log written during implementation.

```markdown
# Epic: <Epic Name>

## Status
- Phase: [Planning | Ready | In Progress | Complete]
- Last updated: yyyy-mm-dd

---
# Part 1 — Specification
<!-- Written during planning (Phases 1–2). Do not modify during implementation. -->

## Description
High-level description of the functionality chunk.

## Glossary
Internal terms and concept definitions for agent use (operational, not necessarily business).

## Algorithm / Flow
High-level algorithm with a Mermaid diagram where useful.

## Concrete Examples
Real or fabricated examples showing expected inputs and outputs.

## Anti-Patterns (DO NOT)
| Don't | Do Instead | Why |
|-------|-----------|-----|
(Minimum 5 entries)

## Test Case Specifications
| Test ID | Component | Input | Expected Output | Edge Cases |
|---------|-----------|-------|-----------------|------------|
(Minimum 5 entries)

## Error Handling Matrix
| Error Type | Detection | Response | Fallback |
|------------|-----------|----------|----------|

## Task Breakdown
Ordered tasks, each with: description; architectural layers involved (models, adapters,
services, entrypoints); dependencies; acceptance criteria.

## Roadmap
- [ ] Task 1: ...
- [ ] Task 2: ...

## References
Deep links only — file path + section anchor. No vague references.

---
<!-- implementation-log -->
---

# Part 2 — Implementation Log
<!-- Written and updated by the implementer during Phase 3. One dated entry per task. -->

<!-- Example entry:
### yyyy-mm-dd — Task 1: <task title>
- **Outcome:** what was delivered.
- **Decisions:** key choices and rationale.
- **Deviations:** departures from the spec and why.
- **Commits:** link(s).
-->
```

The separator `--- <!-- implementation-log --> ---` marks where the authoritative spec ends and
the evolving implementation record begins.
