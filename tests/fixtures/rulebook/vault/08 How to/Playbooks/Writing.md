---
kind: playbook
activity: writing
vocabulary:
  - audience:client|internal|us-client
  - channel:email|tender
golden:
  - 03 Resources/Good memo.md
  - 03 Resources/Bad memo.md
  - 03 Resources/Client memo.md | audience=client
  - 03 Resources/Client memo.md | audience=client
private: true
---
# Writing

1. Load the rules for the audience and the channel.
2. Draft.
3. Run `check` on the draft before handing it over.
