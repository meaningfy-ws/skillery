---
kind: rule
id: R-0036
type: default-with-exception
strength: soft
status: active
scope:
  - activity:testing
  - lang:pt
when: writing a Portuguese test step
do: allow the passive voice
slot: voice
value: passive
exception_of: R-0035
because: the owner said so in a session
source: "2026-09-01 session, owner: 'allow the passive voice'"
added: 2026-09-01
approved: 2026-09-01
last_confirmed: 2026-09-01
private: true
---
