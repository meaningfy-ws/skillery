---
kind: playbook
activity:
vocabulary:
  - audience:client|internal
golden:
private: true
---
# {{title}}

1. Load the rules for this activity and its context.
2. Do the work.
3. Run `check` on the output before handing it over.

Golden examples: list vault paths under `golden:`. When an example belongs to a context, add its
tags after a `|`, for example `03 Resources/Client memo.md | audience=client`.
