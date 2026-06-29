# Hooks

Hook **intent** is single-sourced in [`inventory.yaml`](inventory.yaml) — the machine-readable SSOT.
This README is the human-readable index; it summarises and points, it does not restate every entry.

## Model

Each hook intent has one or more **bindings**, classified on two axes:

- **mechanism** — `git` (CLI-agnostic, one shared implementation via a git-hook manager),
  `ci` (shared PR/Actions check), or `agent` (same intent, rendered into each CLI's native binding:
  Claude settings hooks vs opencode plugin hooks).
- **phase** — `quality` (fires on commit/push) or `phase-gate` (fires on workflow transitions:
  pre-apply, pre-PR, archive).

A single intent may carry several bindings (e.g. "clarity ≥9" as both a `ci` PR-check and an
`agent` pre-apply gate). **Provenance** is a source skill *or* an imperative MUST/NEVER rule in a
binding (`AGENTS.md`/`CLAUDE.md`).

## Adoption at setup

`project-setup` projects the inventory into a repo: the shared git/CI config once, and the
agent-hook bindings for each targeted CLI. How each `mechanism` becomes a concrete, projectable
artifact — the shared pre-commit/CI config and the per-CLI Claude/opencode agent bindings — is the
[binding reference](bindings.md).

## Catalogue (56 intents, 66 bindings — full detail in [`inventory.yaml`](inventory.yaml))

| Group | Intents | Mechanism (mostly) | Source skills |
|-------|--------:|--------------------|---------------|
| git / quality | 10 | git | meaningfy-git-workflow, guardrails, spec-stewardship, project-setup, epic-planning |
| dual-CLI distribution | 7 | git · agent | this change (drift/parity/version/secret/AGENTS/body-agnosticism) |
| writing / quality | 6 | git · ci | technical-writing, proposal-writing, executive-communication |
| architecture / cosmic-python | 4 | git · ci | cosmic-python, architecture |
| conceptual-modelling / LinkML | 3 | git · agent | conceptual-modelling |
| architecture (ADRs, contracts) | 4 | ci · git | architecture, meaningfy-release |
| GitNexus (MUST/NEVER) | 3 | agent · git | CLAUDE.md GitNexus rules |
| spine phase-gates | 6 | agent · ci | clarity-gate, bdd-gherkin, epic-planning, spec-stewardship, superpowers:brainstorming |
| code-review phase-gates | 5 | agent · ci | meaningfy-code-review, guardrails, superpowers:receiving-code-review |
| meta / agent discipline | 8 | agent | superpowers (using/verification), memory-systems, guardrails, meaningfy-git-workflow |

Highest-leverage: `skill-first-discipline` (load the process skill before build/write/review),
`clarity-gate-before-apply`, `regenerate-no-drift`, `impact-before-edit`, `import-linter-contracts`.
