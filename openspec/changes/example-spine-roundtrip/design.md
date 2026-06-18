# PLAN (design half) — Example spine round-trip

> Parent: EPIC "Example spine round-trip" (proposal.md in this change)

## Context

This is the design half of the PLAN. Together with `tasks.md` it forms the PLAN
that the clarity gate scores (≥9/10) before `apply`. The change is a teaching
sample, so the design is intentionally minimal.

## Goals / Non-Goals

**Goals:** demonstrate that a Meaningfy change validates and archives cleanly.

**Non-Goals:** any real behaviour, performance, or persistence concerns.

## Decisions

- The greeting is a pure function of a name — no I/O, no state — so the example
  stays in the `models` layer of cosmic-python terms.

## Algorithm / approach

`greet(name) -> "Hello, {name}!"`. A single deterministic mapping.

### Anti-patterns
- ❌ Adding configuration, localisation, or persistence — scope creep on a sample.

## Error matrix

| Failure mode | Expected handling |
|---|---|
| empty name | return `"Hello, there!"` (no crash) |

## Risks / Trade-offs

- [Risk: readers copy this as a real pattern] → Mitigation: the No-gos and this
  note make its teaching-only status explicit.

## Open Questions

None.
