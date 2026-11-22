# UI: the matrix

Checks on screens and front ends. Few exist: the design skills are external plugins, not in the catalogue, so a `gap → C` row may be filled by a pointer to one.

| Question | Check | Technique owner | Tool | Moment | Decided by | Status |
|---|---|---|---|---|---|---|
| VAL | CHK-59 UX review lens | `meaningfy-code-review` | UX reviewer subagent | per stage on the PR, LARGE and above, when screens changed | the developer | exists |
| VER | CHK-58 Accessibility check on every page a scenario visits | `cosmic-python` | Gherkin end-to-end scenarios | UI end-to-end tests | the verifier | exists |
| ADQ | whether the UI scenarios would catch a broken screen | none yet | none yet | none yet | the checker | gap → C |
| ROB | CHK-58 Accessibility check on every page a scenario visits | `cosmic-python` | accessibility check in each scenario | UI end-to-end tests | the adversary | exists |
| CLR | CHK-59 UX review lens | `meaningfy-code-review` | UX reviewer subagent | per stage on the PR, LARGE and above, when screens changed | the cold reader | exists |
| RSK | what outside the screens can go wrong (browsers, devices, content) | none yet | none yet | none yet | the adversary | gap → C |
