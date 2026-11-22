---
kind: rule
id: P-0006
type: preference
strength: default
status: active
scope:
  - activity:planning
when: deriving or gating a PLAN
do: lead subagents for the attack and gate run 1 (one subagent) and for the spec deltas (one subagent) only at LARGE and above; at TINY to MEDIUM do deltas, attack and gate inline; gate run 2 is always inline and reads only the listed gaps; keep the decisions and the owner's questions yourself
because: the owner wants planning to move faster
source: 2026-11-15 'act as an leader of subagents to move faster'; 2026-11-22 DEC-3 of skillery-performance-improvement, the owner's answer 'Scale by appetite/risk'
added: 2026-11-15
approved: 2026-11-15
last_confirmed: 2026-11-22
private: false
---
