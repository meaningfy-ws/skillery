---
kind: rule
id: R-0032
type: selection-heuristic
strength: default
status: active
scope:
  - activity:testing
  - channel:tender
when: pricing a tender
do: price on time and materials
slot: pricing
value: time-and-materials
because: the owner said so in a session
source: "2026-09-01 session, owner: 'price on time and materials'"
added: 2026-09-01
approved: 2026-09-01
last_confirmed: 2026-09-01
private: true
---
