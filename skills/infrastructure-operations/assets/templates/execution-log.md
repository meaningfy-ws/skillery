<!-- Use in an operation or migration change (shape B): one log per change, append-only, this schema only. -->
# Execution log: <change-id>

Times in UTC. Append only: a correction is a new row that names the row it corrects. **IRREVERSIBLE**
marks an action that cannot be undone. No secret value, ever: name a secret, never show it.

| When | Task | Actor | Target | Action | Result | Rollback |
|---|---|---|---|---|---|---|
| <YYYY-MM-DD HH:MM> | <task id> | <person or agent> | <stack, VM or resource> | <what was done, with the command or PR> | <what was observed; how verified> | <how to undo, or IRREVERSIBLE (go-ahead: <who, when>)> |
