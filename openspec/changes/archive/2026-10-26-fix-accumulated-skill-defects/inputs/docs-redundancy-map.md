# Docs redundancy map (task 7.1, design G, D-13)

Date: 2026-10-26. Line numbers refer to the files **before** this pass.

## 1. Claimed set (recomputed)

A doc is claimed when its path, or its pre-v2.11 path, appears in the `tasks.md` of an open change
other than this one (`openspec/changes/archive/` excluded). `add-devops-bundle`, `add-sales-bundle`
and `skill-crafting-method` have no `tasks.md` and claim nothing.

| Claimed file(s) | Claimed by | Reason |
|---|---|---|
| `README.md` | define-ai-domains, define-blc-engagement-model, define-lifecycle-playbooks, define-meaningfy-lifecycle, define-roles-and-raci | named in their tasks |
| `AGENTS.md` | define-ai-domains | task 7.2 retargets its links |
| `docs/environment/setup.md` | define-ai-domains (6.1), define-meaningfy-lifecycle (5.1, as `docs/environment-setup.md`) | named, old path |
| `docs/environment/openspec-setup-guide.md` | define-ai-domains (6.2), define-meaningfy-lifecycle (as `docs/ai-coding/openspec-setup-guide.md`) | named, old path |
| `docs/environment/dual-cli/compatibility.md` | define-ai-domains (7.4) | named by file |
| `docs/ai-coding/**`, `docs/ai-sales/**`, `docs/ai-consulting/**`, playbooks and service pages | define-ai-domains, define-lifecycle-playbooks, define-meaningfy-lifecycle, define-delivery-release-lifecycle | named, old `docs/how-we-work/**` / `docs/services/**` paths |
| `docs/engagement/**`, `docs/roles-and-raci.md` | define-blc-engagement-model, define-roles-and-raci, define-lifecycle-playbooks | named |
| `docs/skill-inventory.md` | define-blc-engagement-model | named (this change regenerates it only) |
| `spec/*`, `CONTRIBUTING.md` | several | named |

**Difference from the design's list:** none. Two near-claims were checked and left unclaimed:
define-ai-domains 6.3 moves the whole `docs/dual-cli/` folder "contents untouched" (a completed move,
not a content claim; only `compatibility.md` is named by file), and define-roles-and-raci 4.x names
`engineering-standards/ · philosophy/` only as a README directory listing.

## 2. Candidate set and line totals

| File | Before | After |
|---|---:|---:|
| `docs/development-method.md` | 203 | 203 |
| `docs/engineering-standards/architectural-guardrails.md` | 55 | 55 |
| `docs/engineering-standards/coding-prompt.md` | 548 | 197 |
| `docs/engineering-standards/documentation-standard.md` | 51 | 51 |
| `docs/engineering-standards/git-and-collaboration.md` | 38 | 23 |
| `docs/engineering-standards/project-structure.md` | 63 | 53 |
| `docs/engineering-standards/references/strategic-blueprint-checklist.md` | 9 | 9 |
| `docs/engineering-standards/references/stream-coding-notes.md` | 381 | 95 |
| `docs/engineering-standards/testing-standard.md` | 57 | 48 |
| `docs/environment/dual-cli/README.md` | 28 | 26 |
| `docs/environment/dual-cli/mapping.md` | 67 | 66 |
| `docs/environment/dual-cli/mcp-setup.md` | 183 | 180 |
| `docs/environment/dual-cli/setup-claude.md` | 133 | 128 |
| `docs/environment/dual-cli/setup-opencode.md` | 234 | 228 |
| `docs/environment/dual-cli/body-agnosticism-audit.md` | 52 | 49 |
| `docs/environment/vault-assistant.md` | 54 | 56 |
| `docs/philosophy/art-of-coding-with-an-llm.md` | 48 | 48 |
| `CLAUDE.md` | 14 | 14 |
| **Total** (`wc -l`) | **2218** | **1529** |

Task 7.8: the total fell by 689 lines. Task 5.1 adds at most 8 lines to `development-method.md`, so
the total with 5.1's growth stays at or below 1537.

## 3. Findings

Actions: **cut and link** (a restatement becomes a link to its owner), **tighten** (shorter wording,
same facts), **keep** (no change). All candidate rows are closed (applied) unless marked open.

### `docs/engineering-standards/coding-prompt.md` (task 7.2)

> **Reversed by the owner on 2026-10-26 (DEC-13):** the full previous text is restored (524 lines);
> only the header changed. The candidate-set total after the pass is therefore 1529 + 327 = 1856
> lines, still below the 2218 before.

| Fact / section | Owner | Duplicate location | Action | Claimed by |
|---|---|---|---|---|
| Header, authority chain, catalogue pointer | this file | — | keep | none |
| User-level vs repo-level CLAUDE.md (DEC-12) | `docs/environment/setup.md` §3 | coding-prompt.md:27-47 | tighten to 5 lines + link; the "move coding-style rules to the global prompt" rule kept | none (owner claimed) |
| "Art of Coding" guidelines mention | `docs/philosophy/art-of-coding-with-an-llm.md` | coding-prompt.md:53 | made a link | none |
| §0 Role and general behaviour | this file | — | keep | none |
| §1 Root modules, `core`, `tests/` `docs/` `infra/` | `project-setup` (`references/layout.md`), `cosmic-python` `PR-COMPONENT-FIRST`; doc copy in `project-structure.md` | coding-prompt.md:94-133 | cut and link | none |
| §2.1 Sub-modules and `core` rules | `cosmic-python` `PR-COMPONENT-FIRST` | coding-prompt.md:138-171 | cut and link; placement order kept in one line | none |
| §2.2 Layers and dependency direction | `cosmic-python` §1-2 | coding-prompt.md:174-218 | cut and link | none |
| §2.3 Module boundary rules | `cosmic-python:AP-CROSS-VARIANT-IMPORT` | coding-prompt.md:220-238 | cut and link; `.importlinter` line kept | none |
| §2.4 Anti-patterns | catalogue `AP-IO-IN-MODELS`, `AP-LOGIC-IN-EDGES`, `AP-CROSS-VARIANT-IMPORT`, `AP-FREESTR-ANYLAYER`, `AP-DICT-AS-MODEL`, `AP-DUP-VALIDATION`, `BP-COVERAGE-PER-LAYER`; observability in `cosmic-python` | coding-prompt.md:240-300 (free strings stated twice, :268 and :288) | cut and link by id | none |
| §3 Clean Code, SOLID, observability | `cosmic-python` "Core principles" | coding-prompt.md:304-334 | cut and link | none |
| §4.1 Tests per layer, 80 % coverage | `cosmic-python` §3, `BP-COVERAGE-PER-LAYER`, `testing-standard.md`; TDD `superpowers:test-driven-development` | coding-prompt.md:341-379 | cut and link; "suggest tests even for implementation-only asks" kept | none |
| §4.2 BDD / Gherkin | `bdd-gherkin`, `project-setup` `testing-setup.md` | coding-prompt.md:381-398 (its `tests/steps/` disagreed with the scaffold's `tests/feature/`) | cut and link | none |
| §5 Tooling and CI/CD | `project-setup`, `cosmic-python` "Quality assurance & tooling" | coding-prompt.md:401-442 (its `pylint` disagreed with the scaffold's `ruff`) | cut and link | none |
| §5.1 Schema-based code generation | `conceptual-modelling`, `linkml-engineering` | coding-prompt.md:444-460 | cut and link; "never hand-edit generated code" kept | none |
| §5.2 Developer workflow (`make` targets) | `cosmic-python` "Typical Makefile Pattern", `project-setup` | coding-prompt.md:462-483 | cut and link | none |
| §6 Epics, Work Shape, Jira | Work Shape content: `epic-planning`; assistant behaviour: this file | coding-prompt.md:486-515 (two scope-flag bullets said the same thing) | tighten + link | none |
| §7 Security, privacy, licences | `guardrails`, `cosmic-python:AP-VERBATIM-EXTERNAL` | coding-prompt.md:518-533 | cut and link | none |
| §8 "Used well / used blindly" close | `docs/philosophy/art-of-coding-with-an-llm.md` | coding-prompt.md:546-547 | cut and link; reminder list kept | none |

### `docs/engineering-standards/references/stream-coding-notes.md` (task 7.3)

| Fact / section | Owner | Duplicate location | Action | Claimed by |
|---|---|---|---|---|
| 40/40/20 split, why it works | external `stream-coding` skill | :13-28 | cut and link | none |
| Phase 1: audit, 7 Questions, blueprint, exit criteria | external `stream-coding`; blueprint → `decision-package` | :32-81 | cut and link | none |
| Phase 2: four mandatory sections | external `stream-coding` | :85-178 | cut and link | none |
| 13-item gate and 6-criterion score | `clarity-gate` skill | :182-227 | cut and link | none |
| Phase 3 loop, golden rule | external `stream-coding` | :231-254 (golden rule also at :11) | cut and link; one-line rule kept | none |
| Phase 4 divergence, Day 2 | external `stream-coding` | :258-285 | cut and link | none |
| Integration with Cosmic Python | this file (Meaningfy mapping) | — | keep | none |
| Stream Coding Contract checklist | the phases above | :311-349 (internal repeat) | cut and link | none |
| Key differences table | external `stream-coding` | :353-363 | cut and link | none |
| Summary | this file | :367-381 (repeats the intro) | tighten | none |

### Remaining `docs/engineering-standards/**` (task 7.4)

| Fact / section | Owner | Duplicate location | Action | Claimed by |
|---|---|---|---|---|
| Tooling ADR (import-linter, CodeQL) | `architectural-guardrails.md` | — | keep (no finding) | none |
| Split by churn | `documentation-standard.md` | — | keep (no finding) | none |
| Commits, branches, workflow, PRs, free tier | `meaningfy-git-workflow` | git-and-collaboration.md:12-26 | cut and link | none |
| Dev environment (RDF, WSL, notifications) | `meaningfy-git-workflow/references/dev-environment.md` | git-and-collaboration.md:28-34 | cut and link | none |
| Layer table, dependency direction, canonical vocabulary | `cosmic-python` | project-structure.md:11-12, 23-36 | cut and link | none |
| entrypoints taxonomy, tests, key files, four patterns | `project-structure.md` | — | keep | none |
| "Which layer gets which test" / "layout owned by project-setup" | the Authorities list at testing-standard.md:6-12 | testing-standard.md:27-30, 41-43 | tighten (repeats removed) | none |
| Superseded blueprint pointer | `decision-package` | — | keep (no finding) | none |

### `docs/environment/dual-cli/*` and `vault-assistant.md` (task 7.5)

| Fact / section | Owner | Duplicate location | Action | Claimed by |
|---|---|---|---|---|
| AGENTS.md canonical, CLAUDE.md pointer, VERSION | `AGENTS.md` / `dual-cli-distribution` spec | dual-cli/README.md:26-28 | cut and link (link to AGENTS.md kept) | none |
| Mapping intro | `mapping.md` | mapping.md:8-12 | tighten | none |
| Agent gaps G-1…G-6, tables | `mapping.md` | — | keep | none |
| "No new Claude-isms" lint rule | Allowlist section of the same file | body-agnosticism-audit.md:19-21 | tighten (repeat removed) | none |
| MCP intro; "keep secrets in env vars" said three times | `mcp-setup.md` Step 2 | mcp-setup.md:3-7, :181-183 | tighten | none |
| Projecting the `meaningfy` schema | `project-setup` `references/spine-projection.md` | setup-claude.md:94-103, setup-opencode.md:252-260 | tighten in both + link | none |
| Per-dependency install notes in Step 4 intro | the 4a-4d sub-steps below it | setup-opencode.md:194-200 | tighten | none |
| Bundle "Install if you…" table | `README.md` "What's inside" | setup-claude.md:34-40, setup-opencode.md:162-168 | keep: each runbook is followed alone, by design | none (owner claimed) |
| Prerequisites, skills by moment | `vault-assistant.md` | — | keep | none |
| Moving and deleting pointer | `vault-conventions` § Moving and deleting | (missing) | added one-line pointer | none |
| README asset pointer | `vault-setup` | (missing) | added in Start step 2 | none |
| Agents never edit skills; `skill-change` note | `vault-conventions` § Staging | vault-assistant.md:53-54 | cut and link | none |

### `development-method.md`, `philosophy/*`, `CLAUDE.md` (task 7.6)

| Fact / section | Owner | Duplicate location | Action | Claimed by |
|---|---|---|---|---|
| Method (principles, lifecycles, loop, DoD) | `development-method.md` | `AGENTS.md` (see hand-off) | keep | none (duplicate claimed) |
| Agent types delegated / lead / scheduled | `spec/agent-template.md` | development-method.md:75-78 | keep: one-line narration that points to the spec | none |
| Mindset; "used well / used blindly" | `philosophy/art-of-coding-with-an-llm.md` | coding-prompt.md:546-547 (cut there) | keep | none |
| `CLAUDE.md` | itself (lint-guarded import of AGENTS.md) | — | keep (no finding) | none |

### Findings in claimed files (handed off, task 7.7, not edited here)

| Fact | Owner | Duplicate location | Suggested action | Claimed by |
|---|---|---|---|---|
| Change path (EPIC vs direct PR) and the method bullets | `docs/development-method.md` §2-§3, §7, §9 | `AGENTS.md` "Skills and agents development method" (says "it does not restate it", then restates) | cut to one-line mandates with section links | define-ai-domains |
| AGENTS.md canonical / CLAUDE.md pointer / no symlink | `openspec/specs/dual-cli-distribution` + `AGENTS.md` | `README.md` "What this is"; `setup.md` §3 blockquote and §4 | state once, link elsewhere | define-ai-domains (README also: four other changes) |
| `project-setup` projects "AGENTS.md canonical + thin CLAUDE.md pointer, no symlink" | `project-setup` skill | `setup.md` §4, which contradicts the skill's own "CLAUDE.md canonical; AGENTS.md optional symlink" | reconcile (the conflict, not only the copy) | define-ai-domains, define-meaningfy-lifecycle |
| User vs project level split | `setup.md` §3 | `coding-prompt.md` DEC-12 (now a link) | none left in the candidate set; keep §3 as owner | define-ai-domains, define-meaningfy-lifecycle |

Not audited for redundancy: the claimed `docs/ai-*/**`, `docs/engagement/**`, `roles-and-raci.md`,
`compatibility.md`, `openspec-setup-guide.md`, `spec/*`, `CONTRIBUTING.md` (their changes are
rewriting them).
