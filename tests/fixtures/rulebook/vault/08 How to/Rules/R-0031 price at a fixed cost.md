---
kind: rule
id: R-0031
type: selection-heuristic
strength: default
status: active
scope:
  - activity:testing
  - client:public
when: pricing for a public client
do: price at a fixed cost
slot: pricing
value: fixed
because: the owner said so in a session
source: "2026-09-01 session, owner: 'price at a fixed cost'"
added: 2026-09-01
approved: 2026-09-01
last_confirmed: 2026-09-01
private: true
---
