# Scope-boundary checklist (in/out)

The discipline `proposal-writing` owns. The **out-of-scope list is load-bearing**: it protects the
boundary with the build tier (P2 Execution is always a separate engagement) and pre-empts scope creep
on a fixed-frame price. Run this before the proposal + SoW ship.

## The one invariant

> **The SoW "out of scope" list = the [`estimation`](../../estimation/SKILL.md) worksheet's
> exclusions.** One list, two documents. If `estimation` excluded it from the number, the SoW must
> exclude it from the commitment, and vice versa.

## In-scope checks

- [ ] Every in-scope item maps to a deliverable in the SoW (Section 2) and a leaf in the work
      breakdown the estimate decomposed against.
- [ ] The Decision Package is named as the primary deliverable (per
      [`decision-package`](../../decision-package/SKILL.md)).
- [ ] Each in-scope item has a stated boundary — where it stops, not just that it is included.

## Out-of-scope checks

- [ ] **Implementation / build (P2)** is explicitly out, named as a separate engagement.
- [ ] Every assumption in the estimate that could fail has a matching exclusion or a stop/extend trigger.
- [ ] Each exclusion says *when it might return* (as a future engagement), not just that it is out.
- [ ] No exclusion in the estimate worksheet is missing from the SoW (the invariant above).

## Fixed-frame checks

- [ ] The price covers only the in-scope list — nothing implied beyond it.
- [ ] **Stop/extend mechanics** are present: scope reduction, short extension, or clean stop with
      partial delivery if outcomes can't be reached for reasons outside our control. Never silent
      overwork (the boundary safeguard from
      [`engagement-model.md`](../../semantic-consulting-coach/references/engagement-model.md)).

## Handover check

- [ ] The clean-handover clause is present: P2 Execution is separately scoped and priced, so the
      proposal can say *"from here, we can execute, or you can take this and execute with someone
      else."*
