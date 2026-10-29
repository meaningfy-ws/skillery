---
kind: rule
id: R-0003
type: default-with-exception
strength: default
status: active
scope:
  - activity:writing
  - audience:us-client
  - channel:tender
when: writing an EU tender for a US client
do: use British spelling in EU tenders
slot: spelling
value: british
exception_of: R-0002
because: the owner said so in a session
source: "2026-09-01 session, owner: 'use British spelling in EU tenders'"
added: 2026-09-01
approved: 2026-09-01
last_confirmed: 2026-09-01
private: true
---
