---
kind: rule
id: R-0002
type: default-with-exception
strength: default
status: active
scope:
  - activity:writing
  - audience:us-client
when: writing for a US client
do: use American spelling
slot: spelling
value: american
exception_of: R-0001
because: the owner said so in a session
source: "2026-09-01 session, owner: 'use American spelling'"
added: 2026-09-01
approved: 2026-09-01
last_confirmed: 2026-09-01
private: true
---
