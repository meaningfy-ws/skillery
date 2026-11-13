---
kind: rule
id: P-0002
type: constraint
strength: default
status: active
scope:
  - activity:*
when: starting any activity
do: state how the work succeeds and how it fails, and how that will be checked, before doing it (TDD/BDD across all activities)
because: the owner treats test-first as the core of every activity
source: 2026-11-13 'Lets agree that TDD/BDD philosophy is core across all activities we do, and for each activity we execute we shall know, when/how we fail and how we succeed'
added: 2026-11-13
approved: 2026-11-13
last_confirmed: 2026-11-13
private: false
---
