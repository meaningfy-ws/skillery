# EPIC: Example spine round-trip

> Canonical worked example for the Meaningfy spine (EPIC-02 A2). It demonstrates
> the full lifecycle — EPIC (this file) → PLAN (design.md + tasks.md) → specs
> deltas → `archive` merges the delta into `openspec/specs/`. Also the
> first-engagement seed referenced downstream as "the PLAN-02 sample".

## Appetite

Small — a teaching artifact, not production scope.

## Why

A new contributor needs one concrete, validatable example of a Meaningfy change
that round-trips through OpenSpec, so the spine's mechanics are legible without
reading the tool's internals.

## Solution outline

Introduce one trivial capability (`example-greeting`) as a spec delta, with the
EPIC/PLAN authored in the Meaningfy shape, so the example exercises every spine
artifact and `openspec validate --strict` + `archive` can be demonstrated on it.

## Key decisions

- **DEC-1**: Keep the capability trivial (a greeting) — the example teaches the
  *lifecycle*, not domain modelling.

## Rabbit-holes

- Do not grow this into a real feature; it must stay a minimal teaching sample.

## No-gos

- No production code. No coupling to skillery's own catalogue logic.

---

## What Changes

- Add a new capability `example-greeting` with one normative requirement.

## Capabilities

### New Capabilities
- `example-greeting`: a minimal capability used to demonstrate the spine round-trip.

### Modified Capabilities

## Impact

Documentation/teaching only. No runtime impact on skillery.
