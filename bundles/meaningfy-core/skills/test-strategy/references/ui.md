# UI: the matrix

Checks on screens and front ends. Few exist: the design skills are external plugins, not in the catalogue. The UI test checks are owned by `ui-testing`.

| Question | Check | Technique owner | Tool | Moment | Decided by | Status |
|---|---|---|---|---|---|---|
| VAL | CHK-59 UX review lens | `meaningfy-code-review` | UX reviewer subagent | per stage on the PR, LARGE and above, when screens changed | the developer | exists |
| VER | CHK-58 Accessibility check on every page a scenario visits | `ui-testing` | Gherkin end-to-end scenarios | UI end-to-end tests | the verifier | exists |
| ADQ | CHK-148 Broken-screen check on each new UI scenario | `ui-testing` | break the screen twice, confirm the scenario fails | when a UI scenario is added | the tester | exists |
| ROB | CHK-58 Accessibility check on every page a scenario visits | `ui-testing` | accessibility check in each scenario | UI end-to-end tests | the adversary | exists |
| CLR | CHK-59 UX review lens | `meaningfy-code-review` | UX reviewer subagent | per stage on the PR, LARGE and above, when screens changed | the cold reader | exists |
| RSK | CHK-147 Browser and device matrix | `ui-testing` | one browser per PR, the full matrix in the release gate | each PR and the release gate | the adversary | exists |
