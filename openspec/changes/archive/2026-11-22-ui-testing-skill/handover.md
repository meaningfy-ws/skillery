# Hand-over: after stage 2

- **Done:** stage 1 (#355): the `ui-testing` skill, checklist rule 2 moved, the UI matrix without
  gaps. Stage 2: `project-setup --ui-tool playwright|cypress|none`; Playwright follows the project
  (TypeScript with `--typescript` or `frontend/`, else Python); Gherkin and axe wired for each tool.
- **Smoke evidence (stage 2):** Python Playwright: `uv sync` and `playwright install chromium`
  exit 0. TypeScript Playwright: `npm install`, `npx bddgen`, `playwright test --list` lists the
  feature's scenario. Cypress: `npm install` exit 0, the config loads with `setupNodeEvents`. No
  browser run (no binary download in the sandbox).
- **Next:** stage 3, the trial on `entity-resolution-service-webapp` (read only; design D-8,
  tasks 3.1–3.5), then the close.
- **Decisions in delivery:** design D-1 to D-3 under `## Delivery decisions`.
- **Under the floor:**
  - stage 1: device names in the suite matrix; the accepted-findings path for `frontend/` projects;
    the rows test's table parsing; the CHK-58 wording; the Quick Start repeating the axe threshold.
  - stage 2: a `render` helper for the placeholders; a named `IS_TS` instead of `SERENA_EXTRA`;
    a test helper for the repeated scaffold calls; `--dry-run` and `--minimal` with `--ui-tool`;
    `.features-gen` not in the scaffold's `.gitignore`; no unit test of the conftest's accepted
    matching; `per-tool.md` checked against Cypress 16 while the scaffold pins 15.21.2 (D-3).
