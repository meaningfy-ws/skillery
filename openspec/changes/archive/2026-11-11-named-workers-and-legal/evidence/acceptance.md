# Acceptance (task A.1) — named-workers-and-legal

Date: 2026-11-11. Appetite VERY LARGE, so acceptance is mandatory. DEC-17: no live trial of contract
work.

**Verdict: accepted by the owner** ("i accept, just conclude this epic", 2026-11-11), after the
three stages merged:

| Stage | PR | Review set run | Checker |
|---|---|---|---|
| 1 — the rules written down | #181 | five lenses + adversarial tester (one lint gap found, fixed) | met |
| 2 — names and leads | #183 | five lenses + adversarial tester (seven lint defects found, fixed) | one leftover, fixed |
| 3 — Tolic the lawyer | #184 | five lenses + adversarial tester (no defects; 18 tests added) | met; three wording points fixed |

Decisions taken during delivery are D-20 to D-25 in `design.md`.

**Not done at acceptance, and owed:**

- The walkthrough of Tolic's agent, skills and workflow against DEC-8 and DEC-13: the owner
  accepted without it.
- The hand check that a lead session shows its workflow on navigator's band (D-15, RISK-6). The
  engine side is covered by tests (`mods/navigator/lib/contract-workflow.test.ts`: spawning `lawyer`
  or loading `contract-practice` activates the `contract` workflow).
- The live trial in the contract repository (DEC-17).

All three are tracked in skillery issue #188. Related: #185 (navigator reads the session's own
checkout, not a worktree), #186 (Tolic's prose-only refusals, D-25), #187 (`devops-engineer` and
`corpus-repository`).
