---
kind: rule
id: R-0014
type: default-with-exception
strength: default
status: dropped
scope:
  - activity:writing
when: writing any text
do: use Canadian spelling
slot: spelling
value: canadian
because: the owner said so in a session
source: "2026-09-01 session, owner: 'use Canadian spelling'"
added: 2026-09-01
approved: 2026-09-01
last_confirmed: 2026-09-01
retired: 2026-09-15
retired_reason: the owner changed his mind
private: true
---
