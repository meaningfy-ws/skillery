---
kind: rule
id: P-0005
type: constraint
strength: default
status: active
scope:
  - activity:skill-authoring
when: relying on a skill kept outside skillery
do: give it a pointer that says for which goal to use it, when and how; without one it is not adopted
because: an installed external skill is useful only if something tells the agent where to use it
source: 2026-11-15 'they are useful only if they are bundleed and instructed where to use, so we need an anchor/call/pointer to these skills, and when to ue and how'
added: 2026-11-15
approved: 2026-11-15
last_confirmed: 2026-11-15
private: false
---
