# B — Shaping Q&A (2026-10-27)

## Seed (owner)

> Can we add some rules on how subagents shall be spawned? Do subagents get spawned with the master
> agent context or not? If the master context is large, subagents inheriting it increases costs.
> What methods exist to spawn subagents with minimised context — only what is relevant to the task?

Trigger: in the add-devops-bundle session the cost grew from about 30 to 46 USD once four
implementation agents started (file A).

## Answers so far

- **Goal** — loose, generic principles that apply to *all* subagents, not only implementers. "We
  want them, but they shall be as cheap as they can be." Encourage subagents in a controlled way and
  at the right time.
- **Forks** — to be discouraged (owner's leaning, confirmed in principle).
- **Brief** — the coordinator gives each subagent enough context at start, and states how the output
  is provided and organised, specific to the task and purpose.
- **Report** — a standard basic structure, extended per task, goal, intention or agent type. Owner's
  caution: controlling the output of an implementer is tricky. Shaping answer: control the *report*,
  not the *work* — the work product is on disk and is verified by the caller.
- **CLIs** — both Claude Code and opencode.
- **Form** — a new EPIC change.

## Open (to be asked before the PLAN)

See the EPIC's *Open questions*.

## Owner review of the first draft (2026-10-27)

- **Appetite** — in the same change, stop expressing an EPIC's appetite in days or weeks (that suits
  people only). Use a qualitative scale of 4–6 named sizes (the team's range is 1–6 weeks); the
  appetite decides, approximately, how deep and extensive the solution should be.
- **Generic, not agent-bound** — the rules are generic principles for any subagent; the first draft
  named a specific agent. Nuance per agent, if needed, goes in that agent's definition; the main
  agent is taught how to think and decide about spawning.
- **Model** — a subagent runs as the caller's model, or something cheaper if the task is really
  easy. An agent may declare its model in frontmatter; otherwise default to the caller's. No tiers.
- **No stop rules, no budgets** — a subagent may go as far as needed; the task definition controls
  it. Stop rules may be counterproductive; a budget is too rigid.
- **Checking** — the first draft's DEC-5 contradicted itself. The caller checks the report; the work
  is checked by another subagent at the right time (four eyes): against the task spec, the intention,
  best practice, anti-patterns and other quality concerns.
- **Agent definitions** — every agent definition gets a new section on how it reports back and what
  matters in its report.
- **Home** — no new agent; at most a skill. The `guardrails` skill in `meaningfy-core` is the right
  place; no new skill. It must be picked up when the main agent starts working.
- **No measurement script** — an agent monitoring system will be deployed separately.
