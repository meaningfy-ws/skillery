---
kind: rule
id: R-0047
type: default-with-exception
strength: default
status: active
scope: [activity:loops]
when: ordering sections
do: put the summary first
slot: order
value: first
exception_of: "R-0049"
because: the owner said so in a session
source: "2026-09-01 session, owner: 'summary first'"
added: 2026-09-01
approved: 2026-09-01
last_confirmed: 2026-09-01
private: true
---
Edited by hand in Obsidian: this exception is wider than its base, which lets "beats" form a cycle.
