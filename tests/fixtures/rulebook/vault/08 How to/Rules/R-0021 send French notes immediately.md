---
kind: rule
id: R-0021
type: trigger
strength: default
status: active
scope:
  - activity:testing
  - lang:fr
when: a French test report is ready
do: send French notes immediately
slot: send
value: immediately
because: the owner said so in a session
source: "2026-09-01 session, owner: 'send French notes immediately'"
added: 2026-09-01
approved: 2026-09-01
last_confirmed: 2026-09-01
private: true
---
