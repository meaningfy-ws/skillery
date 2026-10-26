<!-- PLAN (design half). PLAN = this file + tasks.md. Document type: Implementation. Revision 1
     (2026-10-26). The clarity gate scores the pair (≥ 9/10). -->

> Derived from EPIC: rebundle-by-activity (`proposal.md`, DEC-1…DEC-11). Decisions below are D-n,
> the PLAN's own; DEC-n are cited, never restated.

## Context

At `81763ed` the catalogue has 5 bundles, 33 skills and 3 agents, 21 use cases (`use-cases/`), the
`use_case_catalogue` and `cross_skill_paths` checks, and the approved target structure in
`docs/catalogue-architecture.md`. `bundles/` is a committed symlink tree that the marketplace entries
point at (`"source": "./bundles/<name>"`). The default branch is `develop`, so `/plugin marketplace add
meaningfy-ws/skillery` clones `develop`. Six skills serve no use case: `technical-writing`,
`explanatory-writing`, `writing-antipatterns`, `meaningfy-voice`, `meaningfy-git-workflow`,
`guardrails`. The route-A spike ([`inputs/2026-10-26-spike-root-source.md`](inputs/2026-10-26-spike-root-source.md))
showed that a marketplace entry's `agents` list has no effect on Claude Code 2.1.310.

Prerequisite: PRs #77 and #78 and the split (`docs/split-evaluation`) are merged, and
`restructure-and-evaluate-catalogue` is archived, so `catalogue-architecture` is a living spec this
change can modify.

## Goals / Non-Goals

**Goals:** the EPIC's solution outline, items 1 to 7, each provable by `make validate` or by a dated
owner approval.

**Non-goals:** the EPIC's no-gos; also no change to `area`, to the opencode installer's behaviour, or
to any skill body beyond the hand-off sentences of D-4 and the voice placeholders of D-10.

## Decisions

- **D-1. New use cases** (DEC-3). Three files, seeded like UC-W1–UC-W21 (frontmatter, Brief
  Description, Notes):

  | Id | Title | Area | Served by | Status | Change |
  |---|---|---|---|---|---|
  | UC-W22 | Advisory engagement | `consulting` | `semantic-consulting-coach`, `decision-package`, `executive-communication` | `partial` (no agent) | `add-advisory-agent` |
  | UC-W23 | Client delivery and project management | `consulting` | — | `missing` | `add-delivery-management` |
  | UC-W24 | Content creation for LinkedIn and blogs | `sales` | `technical-writing`, `explanatory-writing`, `writing-antipatterns`, `meaningfy-voice` | `partial` (no channel profiles, no agent) | `add-content-creation` |

  UC-W18 gains `meaningfy-git-workflow`, `guardrails` and `technical-writing` in `served_by.skills`.
  After D-1 no skill or agent is an orphan.
- **D-2. The coverage check** `use_case_coverage` (a lint error): every `skills/<name>` and every
  `agents/<name>.md` appears in the `served_by` of at least one use case. Silent where the repo has no
  `use-cases/` (so the method checks still hold in other repos). It is added to `ALL_CHECKS`, not to
  `METHOD_CHECKS`.
- **D-3. The `purpose` vocabulary** (DEC-4) becomes, in this order:

  | Value | One line | Members after this change |
  |---|---|---|
  | `software-development` | build software with agents: plan, build, test, review, version | `epic-planning`, `spec-stewardship`, `clarity-gate`, `bdd-gherkin`, `meaningfy-code-review`, `cosmic-python`, `project-setup`, `meaningfy-git-workflow`, `guardrails`, `epic-planner`, `implementer`, `code-reviewer` |
  | `modelling` | ontology, conceptual and system modelling | `architecture`, `conceptual-modelling`, `modelling-conventions`, `linkml-engineering`, `system-architect`, `conceptual-modeller` |
  | `client-delivery` | deliver to a client and manage the project | — |
  | `advising` | coach a client's decisions | `semantic-consulting-coach`, `decision-package` |
  | `content` | write and explain for people: docs, posts, blogs, messages | `technical-writing`, `explanatory-writing`, `writing-antipatterns`, `meaningfy-voice`, `executive-communication` |
  | `offers` | commercial offers, packaging, pitch and pricing | `estimation` |
  | `proposals` | proposal and offer documents | `proposal-writing`, `proposal-writer` |
  | `crm` | create, manage and groom deals and contacts | — |
  | `devops` | environments, CI/CD, releases and operations | `ci-cd-delivery`, `meaningfy-release` |
  | `knowledge` | the owner's personal notes, plans and rhythm | the nine `vault-*` skills |

  `advising` and `knowledge` are not on the owner's list; they keep two existing groups that the list
  does not name. The owner approves the table (task 2.1) before any re-tag. Values with no member stay
  (the facet table shows "—"). The inventory's purpose colours already cycle (`% len(_PURPOSE_FILLS)`),
  so ten values need no code change.
- **D-4. `meaningfy-sales`** (DEC-2): `skills: [proposal-writing, estimation]`, `agents:
  [proposal-writer]`, `requires: [meaningfy-consulting]`, placed after `meaningfy-consulting` in
  `bundles.yaml`. `meaningfy-consulting` keeps `semantic-consulting-coach`, `decision-package` and
  `executive-communication`. Sales depends on consulting in four places (`proposal-writing` →
  `decision-package`, `executive-communication`, `semantic-consulting-coach`; `estimation` →
  `decision-package`). Consulting's three hand-offs into sales (`decision-package` →
  `proposal-writing`; `semantic-consulting-coach` → `proposal-writing`, `estimation`) become "see
  also" sentences in each source's Boundary section, by the D-9 rule of the restructure change, so the
  requirement graph stays acyclic. `bundle_requirements` proves it.
- **D-5. The three agents** (DEC-5, DEC-6), each to `spec/agent-template.md`, with a
  `tests/features/agents/<name>.feature` holding at least one return and one refusal Scenario
  Outline (written with `bdd-gherkin` before the agent file):

  | Agent | Type | Model | Skills (primary first) | Tools | Delegates to | Bundle | Use case |
  |---|---|---|---|---|---|---|---|
  | `system-architect` | `lead` | `opus` | `architecture`, `modelling-conventions`, `conceptual-modelling` | Read, Grep, Glob, Write, Edit, Skill | none | `meaningfy-architecture` | UC-W19 |
  | `conceptual-modeller` | `lead` | `opus` | `conceptual-modelling`, `modelling-conventions`, `linkml-engineering` | Read, Grep, Glob, Write, Edit, Skill | none | `meaningfy-architecture` | UC-W20 |
  | `proposal-writer` | `delegated` | `sonnet` | `proposal-writing`, `estimation`, `executive-communication` | Read, Grep, Glob, Write, Skill | — | `meaningfy-sales` | UC-W8 |

  A lead's Glue states the thinking-partner posture once: state the view and the plan in a few lines,
  ask before deciding, then act. Its stop condition is the artefact the use case's success guarantee
  names (the architecture's use cases, decisions and diagrams; the conceptual model). `opus` follows
  the three existing agents; the "no Opus" rule of the owner is about eval runs, not agent models.
- **D-6. `docs/future-features.md`** (DEC-7), hand-written, with a register row in §8 of the method.
  One table: `Feature | Use cases | Bundle | Agents to build | Skills to build | Material needed |
  Material in hand? | Change`. `docs/catalogue-architecture.md`'s Roadmap section is replaced by a
  two-line pointer to it; its Agent roster keeps the built agents and links the file for the rest.
  Starting rows: the sales agents and CRM (UC-W7, `add-sales-bundle`, in hand outside the repo), the
  devops agent (UC-W6, `add-devops-bundle`, in hand outside the repo), the commercial chain (UC-W9–13),
  the demo builder (UC-W21), the personal assistants (UC-W2–5), the vault local config (UC-W1), visual
  design (UC-W17), the business partners (UC-W14–15), legal documents (UC-W16), the advisory agent
  (UC-W22), delivery management (UC-W23), content creation with the voice channel profiles (UC-W24),
  the Odoo memory skill, config items, the agent aspects (runtime, memory), and the evaluation
  (`evaluate-catalogue`). Every use case's `change` names the change in its feature's row.
- **D-7. The external dependency register** (DEC-9): root `dependencies.yaml`, one entry per
  dependency: `name`, `kind` (`plugin` · `skill` · `cli-tool` · `mcp-server` · `service` ·
  `framework`), `source`, `pin` (a version, commit or hash, or `unpinned: <reason>`), `provenance`
  (`<licence>, reviewed <date> by <who>` or `not reviewed`), `used_by`, `claude` and `opencode`
  (each `{status, install}`; status `native` · `claude-compat` · `unsupported` · `unverified`), and for
  MCP servers `transport`. `make skill-inventory` renders, between `<!-- GENERATED:dependencies -->`
  markers, the "External skill-packs / plugins" and "MCP servers" tables of `compatibility.md` and the
  Step 1 table of `mcp-setup.md`; the prose around them stays hand-written. Drift fails
  `tests/test_skill_inventory.py`. A `dependencies_register` lint check validates the keys and
  values. Seeded from today's tables, so the first render changes no visible row (proved by a diff
  in the PR).
- **D-8. Bundles as metadata, route B** (DEC-8, the spike). A workflow `.github/workflows/dist.yml`
  runs on push to `develop` and on a `v*` tag: checkout, `make bundles`, then publish the tree to a
  `dist` branch (an orphan commit of the generated working tree with `bundles/`, force-pushed by the
  workflow's `GITHUB_TOKEN`). Install becomes `/plugin marketplace add meaningfy-ws/skillery#dist`.
  Two PRs, in this order: (1) add the workflow while `bundles/` is still committed; after it has
  published `dist` once and an install from `#dist` is verified, (2) add `bundles/` to `.gitignore`,
  delete the tree, switch every install line to `#dist`, make the `bundle_gates` link check run only
  when `bundles/` exists, have the `plugin-eval` workflow run `make bundles` first, and write the
  migration note. An optional route-A re-test on a GitHub-hosted test branch runs before (1), only
  with the owner's approval (it pushes a branch); if it passes, D-8 switches to route A.
- **D-9. Moves are announced** (EPIC "No silent moves"): the CHANGELOG's Unreleased "Action needed
  (users)" names each moved skill, its new bundle and both CLIs' install commands; the README bundle
  table and `docs/environment/dual-cli/setup-claude.md` / `setup-opencode.md` follow `bundles.yaml`.
- **D-10. Voice channel placeholders** (DEC-10): `skills/meaningfy-voice/references/channels/`
  `linkedin.md`, `blog.md`, `offer.md`, `internal-message.md`, each three lines: "Planned; until it is
  written, follow the default profile in `../company-voice.md`; see `docs/future-features.md`."
  `meaningfy-voice`'s SKILL.md names the folder in one sentence.
- **D-11. One PR per task group**, from a branch `arch/<group>` off `develop`, in the order of
  `tasks.md`.

## Algorithm / approach

Each task group: write the check or generator test first and see it fail; make the change; run the
generators; `make validate` green; open the PR. Worked examples:

- **Coverage.** Before D-1, `use_case_coverage` returns six errors, one per orphan, for example
  `skills/guardrails: serves no use case (add it to a use case's served_by)`. After D-1 it returns none.
- **A move.** `bundles.yaml` lists `proposal-writing` under `meaningfy-sales`; `make bundles` renders
  the new marketplace entry; `bundle_requirements` reports
  `'decision-package' (meaningfy-consulting) delegates to 'proposal-writing' (meaningfy-sales), but
  'meaningfy-consulting' does not require 'meaningfy-sales'` until D-4's see-also edit lands.
- **A register entry.**

  ```yaml
  - name: obsidian-skills
    kind: plugin
    source: kepano/obsidian-skills
    pin: "unpinned: installed from the marketplace head"
    provenance: MIT, not reviewed
    used_by: [vault-assistant]
    claude: {status: native, install: "/plugin marketplace add kepano/obsidian-skills"}
    opencode: {status: unverified, install: "clone into the global opencode skills folder"}
  ```

### Anti-patterns

- ❌ An empty bundle in `bundles.yaml` to "reserve" a planned bundle (DEC-1).
- ❌ Breaking a requirement cycle by adding `requires` both ways.
- ❌ Re-describing a skill while re-tagging its `purpose` (the descriptions are `evaluate-catalogue`'s).
- ❌ Deleting `bundles/` before `dist` is published and an install from it is verified.
- ❌ A thin agent over a skill that does not exist (DEC-6).
- ❌ Voice rules written into the placeholders.

## Error matrix

| Failure | Handling |
|---|---|
| `use_case_coverage` fails after a new skill or agent | add the name to a use case's `served_by`, or write the use case |
| `bundle_requirements` reports a cycle or an undeclared edge | apply D-4's see-also rule to the edge from the bundle that must not require the other |
| A re-tag uses a value not in `facets.yaml` | `facets_declared` fails, naming the value; fix the value, never the vocabulary, unless the owner approved it |
| `agent_conformance` fails for a new agent | fix the agent file to the template; never relax the check |
| The `dist` workflow fails or cannot push | `bundles/` stays committed; the switch PR does not open |
| A colleague's install from `develop` breaks after the switch | the migration note: `/plugin marketplace remove meaningfy-skillery`, then add `meaningfy-ws/skillery#dist` and reinstall |
| The first register render changes a visible row | fix the seed data until the diff of the rendered tables is empty |
| A rendered doc is edited by hand inside the markers | the drift test fails; regenerate |

## Risks / Trade-offs

- [Colleagues on `develop` lose their install at the switch] → the migration note in the CHANGELOG
  and README, and the switch PR is merged only after `#dist` is verified.
- [A `dist` branch is one more moving part] → it is generated only by the workflow, never edited, and
  the route-A re-test can remove it.
- [Ten `purpose` values with two empty] → empty values show the planned activities; they cost one
  line each.
- [Lead agents with `Write`/`Edit` change files during a conversation] → they ask before deciding
  (D-5 Glue) and write only the artefacts the use case names.

## Open Questions

None blocking. The owner approves D-3's table (task 2.1) and, optionally, the route-A re-test (task
7.1).
