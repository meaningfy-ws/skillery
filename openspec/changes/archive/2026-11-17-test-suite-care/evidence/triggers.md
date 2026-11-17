# Trigger probes (task 1.5, D-16)

Each probe asked three times, each as the first message of a fresh headless Claude Code session in
this repository (`claude -p "<probe>" --plugin-dir bundles/meaningfy-building`, the branch's
bundle; the owner's installed bundles at 3.17.1 also loaded), 2026-11-16. Recorded: every skill the
session loaded through the Skill tool.

| Probe | Expects | Run 1 | Run 2 | Run 3 | `test-suite-care` loaded |
|---|---|---|---|---|---|
| "our test suite takes too long, find what to cut" | `test-suite-care` | `test-suite-care` | `test-suite-care` | `test-suite-care`, `rulebook` | 3 of 3 |
| "write tests for this function" (near-miss) | `cosmic-python` | none | none | none | 0 of 3 |
| "which checks does this activity need" (near-miss) | `test-strategy` | `test-strategy` | `test-strategy` | `test-strategy` | 0 of 3 |

Acceptance met: the positive loads the skill three times of three, each near-miss at most once of
three (here never). The "write tests" sessions loaded no skill (no function was named); that is
`cosmic-python`'s trigger, not this skill's, and is noted for its owner.

The orchestrator near-miss (D-41) is not added: no orchestrator is on `develop` (D-57).
