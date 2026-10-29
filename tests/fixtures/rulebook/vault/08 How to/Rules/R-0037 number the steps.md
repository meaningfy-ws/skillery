---
kind: rule
id: R-0037
type: default-with-exception
strength: default
status: active
scope:
  - activity:cycles
when: listing steps
do: number the steps
slot: steps
value: numbered
exception_of: R-0038
because: the owner said so in a session
source: "2026-09-01 session, owner: 'number the steps'"
added: 2026-09-01
approved: 2026-09-01
last_confirmed: 2026-09-01
private: true
---
