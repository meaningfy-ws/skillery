---
kind: rule
id: R-0034
type: default-with-exception
strength: default
status: active
scope:
  - activity:testing
  - channel:call
when: laying out a page for a call
do: use narrow margins
slot: margin
value: narrow
exception_of: R-0033
because: the owner said so in a session
source: "2026-09-01 session, owner: 'use narrow margins'"
added: 2026-09-01
approved: 2026-09-01
last_confirmed: 2026-09-01
private: true
---
