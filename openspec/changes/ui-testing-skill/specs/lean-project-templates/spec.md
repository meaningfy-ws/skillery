## ADDED Requirements

### Requirement: A product with a UI records its UI tool
`project-setup` SHALL accept `--ui-tool playwright|cypress|none` for the `product` archetype only;
`playwright` or `cypress` SHALL write the tool's files, one make target that runs or prepares the
UI suite, and the line `UI tests: <tool> (<language>)` in the project's `AGENTS.md`, and `none`
SHALL change nothing (DEC-5, design D-6).

#### Scenario: A Python product chooses Playwright
- **WHEN** a product without `--typescript` or `frontend/` is scaffolded with `--ui-tool playwright`
- **THEN** its `pyproject.toml` test group pins `pytest-playwright` and `axe-playwright-python`, its Makefile has `ui-browsers`, and its `AGENTS.md` says `UI tests: Playwright (Python)`

#### Scenario: A TypeScript product chooses Playwright
- **WHEN** a product with a `frontend/` folder is scaffolded with `--ui-tool playwright`
- **THEN** `frontend/playwright.config.ts` is written, its Makefile has `test-ui`, and its `AGENTS.md` says `UI tests: Playwright (TypeScript)`

#### Scenario: A library asks for a UI tool
- **WHEN** a library is scaffolded with `--ui-tool cypress`
- **THEN** the scaffold exits 2 and says the option needs the product archetype

#### Scenario: Cypress meets an existing package.json
- **WHEN** a product with a `package.json` is scaffolded with `--ui-tool cypress`
- **THEN** the file is left unchanged and a warning names the three dev dependencies to add
