---
kind: rule
id: R-0012
type: preference
strength: default
status: active
scope:
  - activity:writing
  - channel:email
when: writing an email
do: greet by first name
slot: greeting
value: first-name
because: the owner said so in a session
source: "2026-09-01 session, owner: 'greet by first name'"
added: 2026-09-01
approved: 2026-09-01
last_confirmed: 2026-06-01
private: true
---
