# Deviations — named-workers-and-legal

What was built differs from the PLAN in these recorded ways; each is a decision in `design.md`
with its reason.

- **D-20** (stage 1): the lead built stage 1 without builder subagents; "(planned)" instead of
  "stage 2" in the *Lead* column; the `corpus-repository` pointer moved to task 3.1; delegation
  scenarios added for the two existing leads.
- **D-21** (stage 1 review): the lead check also reads `disallowedTools`; single homes for the
  activity-skill and lead rules. Not done: scoped `Agent(<type>)`, which opencode cannot render.
- **D-22** (stage 2): `agent_persona` is its own check, so task 2.2's fixture move was not needed;
  UC-W18's guarantee became "nothing without the developer's consent"; the *Candidate roles* rows
  for Work Shaper and documenter were removed.
- **D-23** (stage 2 review): seven lint defects fixed; one primary-skill helper; consent wording for
  `team-lead` and `release-manager`.
- **D-24** (stage 3): no repository command in the `lawyer` body; the Overleaf dependency names no
  package; the *Workers* bullet points to `corpus-repository`.
- **D-25** (stage 3 review): `contract-practice` cites the contract repository's rules instead of
  restating them; "not legal advice". **Accepted residual risk:** Tolic's Odoo and
  send/sign/register refusals are prose where tools cannot enforce them (issue #186).
- **Acceptance** (`evidence/acceptance.md`): accepted by the owner without the walkthrough, the
  lead-band hand check or the live trial; all owed in issue #188.
