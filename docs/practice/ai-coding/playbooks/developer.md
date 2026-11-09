# Developer: playbook (working with the lead)

> *Developer* is not a seventh role. It is the seat in the agent team held by whichever role decides
> at that point: the Work Shaper while shaping, the Solution Builder in an epic session. See
> [`roles-and-raci.md`](../../roles-and-raci.md#agent-wrappers-answered-for-the-build-plane).

You work with one agent: the **lead**, your main session. It asks you the questions, briefs the
other agents, checks their work and commits. The picture is in
[`working-with-agents.md`](../working-with-agents.md); the rules are in
[`epic-delivery`](../../../../skills/epic-delivery/SKILL.md).

## Your stages

- **Shaping session**: you decide the why, the appetite and the success measure, and each key
  decision the lead puts to you. See
  [`build-lifecycle.md`](../build-lifecycle.md#epic-tier-one-epic-at-a-time-the-sdlc-loop).
- **At the PLAN gate**: you sign off the EPIC's scenarios, once. You re-sign only a scenario that
  changes.
- **During the stages**: you answer the questions the PLAN did not settle, and decide how to handle
  a gap in an external library. A gap in one of our own libraries is never worked around; the lead
  reports it upstream.
- **After the last stage**: when the EPIC delivers or changes a use case, you accept it at the
  acceptance demo, or name what is wrong.
- **End of an iteration**: you decide what the validation review changes.

## Working with the lead

- Every question comes with its terms explained, the options, and one option recommended with a
  reason. Pick one, or say "choose what is best" and the lead records its choice, which you can
  overrule later.
- The lead commits only with your consent. To let it run an EPIC on its own, grant it by name, for
  example "commit, push and merge for this EPIC without asking". The grant ends with the EPIC.
- Only you, or a domain expert for the model, can validate. The lead prepares the evidence and
  recommends; it never accepts on your behalf.

## Skills behind it

- [`epic-delivery`](../../../../skills/epic-delivery/SKILL.md): sessions, the team, the loop,
  authority, our libraries.
- [`epic-planning`](../../../../skills/epic-planning/SKILL.md): the EPIC and the PLAN you approve.
- [`bdd-gherkin`](../../../../skills/bdd-gherkin/SKILL.md): the scenarios you sign off.

## Your done

The EPIC is accepted (at the acceptance demo when it delivers or changes a use case), its docs are current, and it is archived. See
[`dod-quality-gates.md`](../dod-quality-gates.md#delivery--release).
