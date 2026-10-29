---
kind: rule
id: R-0023
type: default-with-exception
strength: default
status: active
scope:
  - activity:testing
when: delivering a report
do: deliver reports as DOCX
slot: format
value: docx
exception_of: R-0022
because: the owner said so in a session
source: "2026-09-01 session, owner: 'deliver reports as DOCX'"
added: 2026-09-01
approved: 2026-09-01
last_confirmed: 2026-09-01
private: true
---
