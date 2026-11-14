# UI: the matrix

Checks on screens and front ends. Few exist: the accessibility rule sits in the `cosmic-python` testing checklist and the UX lens in `meaningfy-code-review`; the design skills are external plugins and are not in the catalogue. This file names what exists and marks the rest as gaps; it adds no technique. A check that answers two questions has two rows. `gap → C` rows are for the EPIC `activity-test-profiles` to fill or accept, possibly by a pointer to an external design plugin.

| Question | Check | Technique owner | Tool | Moment | Decided by | Status |
|---|---|---|---|---|---|---|
| VAL | CHK-59 UX review lens | `meaningfy-code-review` | UX reviewer subagent | per stage on the PR, LARGE and above, when screens changed | the developer | exists |
| VER | CHK-58 Accessibility check on every page a scenario visits | `cosmic-python` | Gherkin end-to-end scenarios | UI end-to-end tests | the verifier | exists |
| ADQ | whether the UI scenarios would catch a broken screen | none yet | none yet | none yet | the checker | gap → C |
| ROB | CHK-58 Accessibility check on every page a scenario visits | `cosmic-python` | accessibility check in each scenario | UI end-to-end tests | the adversary | exists |
| CLR | CHK-59 UX review lens | `meaningfy-code-review` | UX reviewer subagent | per stage on the PR, LARGE and above, when screens changed | the cold reader | exists |
| RSK | what outside the screens can go wrong (browsers, devices, content) | none yet | none yet | none yet | the adversary | gap → C |
