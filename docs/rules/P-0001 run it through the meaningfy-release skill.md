---
kind: rule
id: P-0001
type: constraint
strength: hard
status: active
scope:
  - activity:release
when: doing release work (cutting, versioning, tagging or publishing a release)
do: run it through the meaningfy-release skill and its release workflow, whoever starts it
because: "the owner's rule: release is always done the Meaningfy way"
source: "2026-11-13 owner: 'meaningfy release must always be triggered on release'"
added: 2026-11-13
approved: 2026-11-13
last_confirmed: 2026-11-13
private: false
---
