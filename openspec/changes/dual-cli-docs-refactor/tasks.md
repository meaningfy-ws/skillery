> Derived from EPIC dual-cli-docs-refactor (docs grooming under dual-cli-distribution)

## 1. Install canon → dual-CLI

- [x] 1.1 `docs/environment-setup.md` §1: add the "choose your CLI" fork (Claude `/plugin` + opencode path), each linking its per-CLI runbook; add a header pointer to the per-CLI pages + reference annex
- [x] 1.2 `docs/environment-setup.md`: add a one-line pointer to the AGENTS.md "Dual-CLI authoring rules" (no restatement)

## 2. Reference annex reframed

- [x] 2.1 `docs/dual-cli/README.md`: state install starts at `environment-setup.md`; present the folder as the reference annex (setup runbooks + mapping + compatibility + mcp-setup + body-agnosticism)

## 3. Single-sourced authoring rule

- [x] 3.1 `AGENTS.md`: promote the lone "Regenerating the opencode tree" bullet into a "Dual-CLI authoring rules" subsection covering skills/agents/commands/specs (regenerate, CLI-agnostic bodies, per-CLI command registration, gate enforcement)
- [x] 3.2 `spec/CREATING_SKILLS.md`: add a "Dual-CLI obligation" note pointing to the AGENTS.md rule
- [x] 3.3 `README.md`: reframe the dual-cli docs row as the reference annex; surface the authoring rule

## 4. Verify

- [x] 4.1 `make validate` green (repo_lint links/consistency + tests); body-agnosticism allow-list unchanged
- [x] 4.2 `openspec validate dual-cli-docs-refactor --strict` passes with the single ADDED delta on `dual-cli-distribution`

## Roadmap

- [x] 1.1 · [x] 1.2 · [x] 2.1 · [x] 3.1 · [x] 3.2 · [x] 3.3 · [x] 4.1 · [x] 4.2

## Verification

`make validate` passes, no file moved or deleted, the dual-CLI authoring rule has exactly one home
(`AGENTS.md`) with everything else linking it, and the install hierarchy README → environment-setup →
per-CLI runbook is stated in each touched file.
