# Seed — navigator workflows for the skills that have none (secondary, never groomed)

Captured 2026-11-09 from the owner's conversation, after navigator v3.10.0 shipped with four
workflow files (build-tier, architecting, devops, sales).

1. "does the band apply only to test driven development? can we have a variant for epic planning
   too?"
2. "can we have a version for architecting too? and for modelling?"
3. "okay so it is more generic?" (answered: yes; workflows are data shipped by their owning skill)
4. "please add/recommend workflows for the ones that do not have now, what do you think?"
5. The owner's shape of two of them:
   - **Architecture:** "drivers elicitation, use cases elicitation/exploration, then the c4, then
     decide, so we have the adr, ucs and the c4, and we need also the initial domain model, which
     shall be like a handover to modelling".
   - **Planning:** "we better stick to the terminology work shaping, and it is indeed explore, see
     variants, decide, propose, design, revise".
6. "go ahead and shape a small epic".

## What exists (read 2026-11-09)

- `skills/epic-delivery/assets/workflows/build-tier.workflow.json`: phases explore, shape, plan,
  apply, verify, archive; variants `exploratory` (explore, shape, plan; on `openspec-explore`) and
  `brownfield`.
- `skills/architecture/assets/workflows/architecting.workflow.json`: explore, elicit (modelling),
  decide (ADR file gate); starts on architecture or conceptual-modelling.
- `skills/infrastructure-operations/.../devops.workflow.json`: nine phases, four variants; phases
  with an empty `enter` advance when a command gate passes (`advanceOn`, `mods/navigator/lib/phase.ts`).
- `skills/sales-operations/.../sales.workflow.json`: research, meet, offer, pipeline.
- A phase enters only on `skills`, `agents` or a `change` state; a file gate does not advance a phase.
- The `navigator` change (which holds the `workflow-definitions` delta) is not archived yet: the
  owner's hand checks (4.1) and acceptance trial (4.3) are open.
