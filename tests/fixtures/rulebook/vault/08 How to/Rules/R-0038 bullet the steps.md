---
kind: rule
id: R-0038
type: default-with-exception
strength: default
status: active
scope:
  - activity:cycles
when: listing steps
do: bullet the steps
slot: steps
value: bulleted
exception_of: R-0037
because: the owner said so in a session
source: "2026-09-01 session, owner: 'bullet the steps'"
added: 2026-09-01
approved: 2026-09-01
last_confirmed: 2026-09-01
private: true
---
