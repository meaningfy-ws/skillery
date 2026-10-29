---
kind: rule
id: R-0020
type: constraint
strength: hard
status: active
scope:
  - activity:testing
when: sending a test report
do: send only after approval
slot: send
value: after-approval
because: the owner said so in a session
source: "2026-09-01 session, owner: 'send only after approval'"
added: 2026-09-01
approved: 2026-09-01
last_confirmed: 2026-09-01
private: true
---
