<!-- Secondary, never groomed. The Q&A record of the shaping session, 2026-11-22. Two rounds
     (MEDIUM cap: three). The developer opened it: "yes, create the UI testing skill as an EPIC",
     answering the decision #230 asked for. -->

# Q&A record

## Q: Should a UI testing skill exist, or do the rules get another permanent home?
- Asked because: issue #230 asked for this decision.
- Answer: create the UI testing skill, as an EPIC.
- → DEC-1

## Q: Which UI test tools do the rules cover?
- Asked because: the six parked rules cite both Cypress and Playwright documentation.
- Options offered: Playwright only (recommended); Playwright and Cypress; tool-agnostic.
- Answer: "tool-agnostic and tool neutral, but then each project can choose cypress or playwright
  (so you can add minimal per-tool rows)".
- → DEC-2

## Q: Where does the skill live, and does checklist rule 2 move into it?
- Asked because: rule 2 is the only UI test rule today and it sits in `cosmic-python`.
- Answer: `meaningfy-building`; rule 2 moves, `cosmic-python` keeps a one-line pointer (recommended
  option).
- → DEC-1, DEC-3

## Q: Beyond the six parked rules, what does the first version carry?
- Asked because: the UI matrix has two gaps (ADQ, RSK) and CHK-58 has no how-to.
- Answer: the accessibility check how-to, the browser and device matrix, how to catch a broken
  screen. Visual regression was offered and not chosen.
- → DEC-4; visual regression → No-gos

## Q: What is the skill proved against?
- Asked because: failure-first; the recorded failure becomes the acceptance test.
- Answer: a real Meaningfy project with a UI.
- → DEC-6

## Q: Which real project is the trial?
- Asked because: the developer chose a real project without naming one; two were found locally.
- Answer: `entity-resolution-service-webapp` (recommended; existing Playwright 1.58 suite).
- → DEC-6

## Q: How does a project record its tool choice?
- Asked because: tool-neutral rules with per-tool rows need the agent to know which row applies.
- Options offered: one line in the project's `AGENTS.md`, with detection by config file
  (recommended); `project-setup` scaffolds it.
- Answer: `project-setup` scaffolds it.
- → DEC-5

## Q: The skill's name?
- Answer: `ui-testing` (recommended).
- → DEC-1

## Q: Risks: a trial repository whose suite finds noise, and per-tool rows going stale?
- Answer: mitigate (recommended): the trial measures only the rules of this skill; per-tool rows
  cite their documentation page with a "checked on" date and stay one line each.
- → RISK-1, RISK-2
