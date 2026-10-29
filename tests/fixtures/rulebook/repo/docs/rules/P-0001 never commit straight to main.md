---
kind: rule
id: P-0001
type: constraint
strength: hard
status: active
scope:
  - activity:coding
when: committing in this repository
do: never commit straight to main
because: main is protected and reviewed
source: "2026-10-29 session, owner: 'never commit straight to main'"
added: 2026-10-29
approved: 2026-10-29
last_confirmed: 2026-10-29
private: false
---
