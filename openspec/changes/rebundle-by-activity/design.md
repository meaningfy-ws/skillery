<!-- PLAN (design half). PLAN = this file + tasks.md. Document type: Implementation. Revision 3
     (2026-10-26). Clarity gate: 7.5 → 8.8 → 9.2/10 (revision 3), task 0.2. The clarity gate scores the pair (≥ 9/10). -->

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
  | UC-W24 | Content creation for LinkedIn and blogs | `business` | `technical-writing`, `explanatory-writing`, `writing-antipatterns`, `meaningfy-voice` | `partial` (no channel profiles, no agent) | `add-content-creation` |

  UC-W24's area is `business`: general communication about what Meaningfy does and why is the
  company speaking for itself, like UC-W15, not selling a given offer.

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
  also" sentences, so the requirement graph stays acyclic. **Mechanics:** the inventory parser reads
  edges from the `**Delegates:**` / `**This skill DELEGATES:**` paragraph (`_DELEGATES` in
  `tools/skill_inventory.py`) up to the first blank line, so the edit removes the backticked target
  from that paragraph and puts the see-also in its own paragraph of the Boundary section, after a blank
  line. This is the rule already used for four hand-offs in task 3.3 of the restructure change
  (`inputs/evidence/foundation.md` there), which extended its
  [D-9 rule](../archive/2026-10-26-restructure-and-evaluate-catalogue/design.md#decisions--evaluation-track-d-1d-13) from Related pairs to delegations.
  `bundle_requirements` proves the result.
- **D-5. The three agents** (DEC-5, DEC-6), each to [`spec/agent-template.md`](../../../docs/development/agent-template.md),
  with a `tests/features/agents/<name>.feature` holding a `Background` that names every skill, and at
  least one return and one refusal Scenario Outline with `Examples:` (written with `bdd-gherkin` before
  the agent file):

  | Agent | Type | Model | Skills (primary first) | Tools | Delegates to | Bundle | Use case |
  |---|---|---|---|---|---|---|---|
  | `system-architect` | `lead` | `opus` | `architecture`, `modelling-conventions`, `conceptual-modelling` | Read, Grep, Glob, Write, Edit, Skill | none | `meaningfy-architecture` | UC-W19 |
  | `conceptual-modeller` | `lead` | `opus` | `conceptual-modelling`, `modelling-conventions`, `linkml-engineering` | Read, Grep, Glob, Write, Edit, Skill | none | `meaningfy-architecture` | UC-W20 |
  | `proposal-writer` | `delegated` | `sonnet` | `proposal-writing`, `estimation`, `executive-communication` | Read, Grep, Glob, Write, Skill | — | `meaningfy-sales` | UC-W8 |

  Facets (`metadata`), copied from each agent's primary skill except `purpose` (D-3):

  | Agent | purpose | area | subject | posture | stage | maturity |
  |---|---|---|---|---|---|---|
  | `system-architect` | `modelling` | `coding` | `modelling` | `reusable` | `design` | `experimental` |
  | `conceptual-modeller` | `modelling` | `coding` | `modelling` | `precise` | `design` | `experimental` |
  | `proposal-writer` | `proposals` | `sales` | `semantic-data` | `profiled` | `sell` | `experimental` |

  Draft descriptions (the template's form; a lead also says `Not for delegation`):
  - `system-architect`: "Designs a new system with the user before code: use cases, architectural
    decisions and system diagrams, stating its view and plan briefly before each step. Use when
    starting or reshaping a system's architecture. Not for delegation; not for code (implementer)."
  - `conceptual-modeller`: "Builds and evolves a domain's conceptual model with the user, model-driven
    and data-centric, choosing the model source and rendering. Use when modelling a domain or evolving
    an ontology. Not for delegation; not for system architecture (system-architect)."
  - `proposal-writer`: "Writes a sendable proposal or offer email from client requirements, asking the
    questions it needs through its output, with estimate and executive framing. Use when a client asks
    for an offer. Not for pricing strategy alone (estimation)."

  A lead's Glue states the thinking-partner posture once: state the view and the plan in a few lines,
  ask before deciding, then act. Its stop condition is the artefact the use case's success guarantee
  names (the architecture's use cases, decisions and diagrams; the conceptual model). **Models:** the
  two leads are `opus` because they hold a long, judgement-heavy conversation with the user, as
  `epic-planner` and `code-reviewer` (both `opus`) do for planning and review; `proposal-writer` is
  `sonnet`, like `implementer`, because it executes one bounded document job. The owner's "no Opus"
  is about eval runs, not agent models. `maturity` is `experimental` until `evaluate-catalogue` gives
  evidence. The three names are added to `ALL_AGENT_NAMES` in `tools/repo_lint/lint.py`, so
  `orphan_agent_references` protects them.
- **D-6. `docs/future-features.md`** (DEC-7), hand-written, with a register row in
  [§8 of the method](../../../docs/development/README.md#8-where-things-live).
  One table: `Feature | Use cases | Bundle | Agents to build | Skills to build | Material needed |
  Material in hand? | Change`. `docs/catalogue-architecture.md`'s Roadmap section is replaced by a
  two-line pointer to it; its Agent roster keeps the built agents and links the file for the rest.
  Starting rows: the sales agents and CRM (UC-W7, `add-sales-bundle`, in hand outside the repo), the
  devops agent (UC-W6, `add-devops-bundle`, in hand outside the repo), the commercial chain (UC-W9–13),
  the demo builder (UC-W21), the personal assistants (UC-W2–5), the vault local config (UC-W1), visual
  design (UC-W17), the business partners (UC-W14–15), legal documents (UC-W16), the advisory agent
  (UC-W22), delivery management (UC-W23), content creation with the voice channel profiles (UC-W24),
  the deeper engineering agents (UC-W19, UC-W20 while `partial`, `add-engineering-agents`),
  the Odoo memory skill, config items, the agent aspects (runtime, memory), and the evaluation
  (`evaluate-catalogue`). Every use case's `change` names the change in its feature's row; the check
  is D-12. A use case the owner marks `covered` in task 4.3 may drop its `change`.
- **D-7. The external dependency register** (DEC-9): root `dependencies.yaml`, one entry per
  dependency. Fields, and the table column each renders into:

  | Field | Required | Renders into |
  |---|---|---|
  | `name` | yes | the first column of every table (bold) |
  | `kind` | yes: `plugin` · `skill` · `cli-tool` · `mcp-server` · `service` · `framework` | which table the entry lands in (`mcp-server` → the MCP tables; the rest → "External skill-packs / plugins") |
  | `summary` | no | the parenthesis after the name (today's "(doc-first method)") |
  | `source`, `pin`, `provenance` | yes (`pin` may be `unpinned: <reason>`; `provenance` may be `not reviewed`) | not rendered yet (new facts) |
  | `used_by` | yes, free text | compatibility "Used by" |
  | `opencode_status` | yes, free text that starts with `native`, `claude-compat`, `unsupported` or `unverified` | compatibility "opencode status" (the qualifier after the keyword is kept verbatim) |
  | `claude_install`, `opencode_install` | yes, free Markdown | compatibility "Claude install" and "opencode install / gap" |
  | `transport` | MCP only, free text | compatibility "Transport" |
  | `notes` | MCP only | compatibility MCP "Notes" |
  | `why`, `hosting` | MCP only | `mcp-setup.md` Step 1 "Why" and "Local package or hosted?" |

  Free-text fields hold today's cell text unchanged, so the first render reproduces today's rows.
  `make skill-inventory` renders the three tables between `<!-- GENERATED:dependencies:<table> -->`
  and `<!-- /GENERATED -->` markers; the prose around them stays hand-written. Drift fails
  `tests/test_skill_inventory.py`. A `dependencies_register` lint check rejects an unknown key, an
  unknown `kind`, an `opencode_status` that starts with none of the four keywords, and a missing
  required field.
- **D-8. Bundles as metadata, route B** (DEC-8, the spike). A workflow `.github/workflows/dist.yml`,
  `on: push: branches: [develop]` only (one trigger, so nothing races), with `permissions: contents:
  write`: check out `develop`, run `python -m tools.bundle_gen generate` (CI has no `.venv`, which
  the `make bundles` target activates), then fetch `dist` (created on the first run) and
  add **one new commit** on top of it whose tree is `develop`'s tree plus `bundles/`, with the message
  `dist: <develop sha>`; push without force. `dist` is never edited by hand and has no branch-protection rule (the
  workflow's `GITHUB_TOKEN` must be able to push it). Because history is only appended, installed marketplaces update with
  `/plugin marketplace update` as they do today. Install becomes `/plugin marketplace add
  meaningfy-ws/skillery#dist`. Two PRs, in this order:
  1. add the workflow while `bundles/` is still committed; after it has published `dist` once and an
     install from `#dist` is verified,
  2. add `bundles/` to `.gitignore` and delete the tree; switch every install line to `#dist`; add a
     link check to the `validate` job of `.github/workflows/validate.yml`, **after**
     `python -m tools.repo_lint` (so a stale committed rendering still fails `bundle_gates` first):
     `python -m tools.bundle_gen generate`, then `git diff --exit-code -- .claude-plugin
     tools/opencode-catalogue.json package.json` (generation changed no committed file), then
     `python -m tools.bundle_gen check` (the links); `plugin-eval.yml` runs `python -m
     tools.bundle_gen generate` before it copies a bundle; locally, `bundle_gates` checks the links
     only when `bundles/` exists; write the migration note.

  An optional route-A re-test on a GitHub-hosted test branch runs before (1), only with the owner's
  approval (it pushes a branch); if it passes, D-8 switches to route A.

  **Revised 2026-10-26 (owner): `dist` is published on release only.** The trigger becomes `on: push:
  tags: ["v*", "!v*-dist"]` (plus `workflow_dispatch` to re-publish a tag); each run checks out the
  release tag, appends one commit `dist: <tag> (<sha>)` to `dist` and pushes the tag `<tag>-dist` on
  it (an unchanged tree is only tagged). `dist` stays a branch because `/plugin marketplace update`
  re-fetches the installed ref and a tag never moves; the `-dist` tag lets anyone pin a release. The
  `dist` commits never enter `develop`; the source tag `vX.Y.Z` stays where the release flow puts it.
  DEC-8's "the release flow publishing" is met literally. The install check from `#dist` moves to the
  release (owner, 2026-10-26), so PR (2) merges at the first release, after that check.
- **D-9. Moves are announced** (EPIC "No silent moves"): the CHANGELOG's Unreleased "Action needed
  (users)" names each moved skill, its new bundle and both CLIs' install commands; the README bundle
  table and `docs/environment/dual-cli/setup-claude.md` / `setup-opencode.md` follow `bundles.yaml`.
- **D-10. Voice channel placeholders** (DEC-10): `skills/meaningfy-voice/references/channels/`
  `linkedin.md`, `blog.md`, `offer.md`, `internal-message.md`, each three lines: "Planned; until it is
  written, follow the default profile in `../company-voice.md`; see `docs/future-features.md`."
  `meaningfy-voice`'s SKILL.md names the folder in one sentence.
- **D-11. One PR per task group**, from a branch `arch/<group>` off `develop`, in the order of
  `tasks.md`.
- **D-12. Use-case changes are on the register**: a lint check `use_case_changes_registered` in
  `tools/repo_lint/lint.py` (in `ALL_CHECKS`; silent without `use-cases/` or without
  `docs/future-features.md`) reports, for each use case whose `status` is `partial` or `missing`, a
  `change` that is empty or appears nowhere in `docs/future-features.md`:
  `use-cases/UC-W17-graphic-designer.md: change 'add-visual-design' is not in docs/future-features.md`.

- **D-13. Folder restructure** (owner R3/R4 and the group-9 brief, 2026-10-26,
  [`inputs/2026-10-26-release-and-folders-qa.md`](inputs/2026-10-26-release-and-folders-qa.md)). The
  top level keeps only `skills/`, `agents/`, `use-cases/`, `openspec/`, `docs/`, `tools/`, `tests/`,
  `.github/` and `.claude-plugin/` (plus root files). Every move is a `git mv` followed by path fixes;
  no file is rewritten. The skillery development method has **one home, `docs/development/`**: how to
  build skills and agents, governance, the catalogue model and how to work in this repo. `AGENTS.md`,
  the README's Develop door and `CONTRIBUTING.md` point to `docs/development/README.md` and restate
  nothing; it is not a skill, is in no bundle and is never installed.

  | From | To |
  |---|---|
  | `docs/development-method.md` | `docs/development/README.md` |
  | `docs/catalogue-architecture.{md,class.puml,class.svg}` | `docs/development/` |
  | `spec/CREATING_SKILLS.md`, `skill-repo-governance.md`, `agent-template.md`, `skill-template.md`, `agent-skills-spec.md` | `docs/development/creating-skills.md`, `governance.md`, `agent-template.md`, `skill-template.md`, `agent-skills-spec.md` |
  | `spine/golden-thread.md` | `skills/epic-planning/references/golden-thread.md` (its repo links become name citations) |
  | `spine/openspec-version.txt` | `openspec/openspec-version.txt` (Makefile, `validate.yml`, the `scaffold.sh` comment) |
  | `spine/README.md`, every other `spine/*.md` | `docs/development/spine.md`, `docs/development/<same name>` |
  | `hooks/inventory.yaml` | `hooks.yaml` (root, beside `bundles.yaml`, `facets.yaml`, `dependencies.yaml`) |
  | `hooks/README.md`, `hooks/bindings.md` | `docs/development/hooks.md`, `docs/development/hook-bindings.md` |
  | `prompts/AGENTS.md.template` | deleted: `skills/project-setup/assets/templates/agentic/AGENTS.md.tmpl` already holds all of it (stamp, routing, implementation loop, project specifics); its only extra, the `.claude/memory` convention, is the one the `.tmpl` retired |
  | `prompts/global-prompt.md` | `docs/environment/global-prompt.md`; `prompts/README.md` deleted |
  | `evals/` | `tests/evals/` |
  | `docs/{ai-coding,ai-consulting,ai-sales,engineering-standards,philosophy}/`, `docs/roles-and-raci.md` | `docs/practice/` |
  | `tools/linkml_neo4j/` | `skills/linkml-engineering/scripts/linkml_neo4j/` (owner, 2026-10-26); `scaffold.sh` takes the generators' folder from `--linkml-generators` or `LINKML_NEO4J_DIR`, falling back to the sibling skill in a source checkout |
  | `.claude/HARD-QUESTIONS.md` | `inputs/hard-questions-v2.md` of this change; the two answered items become `docs/future-features.md` rows |
  | the `eval/C-exec-comm` worktree's uncommitted `tools/trigger_cases.py`, its test and approvals line | `openspec/changes/evaluate-catalogue/inputs/batch-c-worktree/`; both leftover worktrees pruned |

  **An installed skill links nothing outside its own folder.** `cross_skill_paths` widens from "no
  link into another skill" to "no link outside the skill's own folder"; each of today's links out
  (about 70: into `spine/`, `docs/`, `spec/`, `openspec/`, and five already broken) is deleted where
  the skill already states the fact, or becomes one sentence or a citation of the owning skill by name
  (golden thread → `epic-planning`; OpenSpec pin → `scaffold.sh`'s `OPENSPEC_PIN`; `/opsx` verbs →
  OpenSpec). `AGENTS.md`'s Binding row and `governance.md` read "root agentic files + project-setup's
  agentic templates". A lint check `top_level_folders` allows only the folders above. Living-spec
  paths change through MODIFIED deltas (`catalogue-governance`, `skill-crafting-method`,
  `linkml-engineering`); archived changes are not touched. `scaffold.sh`'s schema copy from
  `../../../openspec/` has the same installed-path gap as the generators; it is recorded in
  `docs/future-features.md`, not fixed here.

  **Follow-up (owner, 2026-10-27):** "what is that scaffold.sh for? … if so then fix it"; "fix the
  links if we need them if not then remove them". `scaffold.sh` is `project-setup`'s executable and
  stays; the skill now owns the schema it projects (`git mv openspec/schemas/meaningfy` →
  `skills/project-setup/assets/openspec-schema/meaningfy`, with `openspec/schemas/meaningfy` a
  relative symlink to it), so the copy works installed; the old path went one folder too far and
  never worked. The engagement lifecycle is needed at run time by `semantic-consulting-coach` (its
  references cite it and do not restate it), so it moves into that skill
  (`references/engagement-lifecycle.md`); the people docs link to it there and `decision-package`
  names the coach. Mentions of skillery docs that only attribute a fact the skill already states are
  removed.
- **D-14. Only released items are installable** (owner, 2026-10-27, a hard rule: "only the features
  (skills or agents or bundles/plugins) that have been released are visible and installable in
  claude or opencode"). The one marker is `bundles.yaml`: a skill or agent listed in a bundle is
  released; one listed in none is work in progress (WIP), allowed on `develop` and shown under
  "Unreleased (WIP)" in the catalogue map. No second marker in the skill (it would be a second source
  that can disagree). Enforcement:
  - lint: `unregistered_skill_dirs` and the agent "in no bundle" error go; a new `wip_isolation`
    check fails a released skill whose Delegates names a WIP skill, and a released agent whose
    `skills:` lists a WIP skill. `use_case_coverage` still applies to WIP items.
  - `python -m tools.bundle_gen unreleased` prints the WIP paths (`skills/<name>`,
    `agents/<name>.md`); `dist.yml` drops them from the published tree, so the release holds only
    released items.
  - every install route reads `#dist`: the Claude marketplace (7.3), the opencode installer
    (`git+…skillery.git#dist`) and `npx skills add meaningfy-ws/skillery#dist`.
  - a `dual-cli-distribution` delta states the rule.
- **D-15. Use cases written for an agent catalogue** (owner, 2026-10-27: "we might want to be a bit
  more explicit? e.g. on feedback loops? on expected artefacts/evidence?"; "update all the UCs …
  indicate which ones you are confident about and which need human extension"). The Cockburn White
  core stays; Use-Case 2.0 slices and three agent-catalogue sections are added: Artefacts, Evidence,
  Feedback Loop; human decision steps are marked **[human]**; Open Points opens with a confidence
  rating. The template is `docs/development/use-case-template.md`; `use_case_catalogue` requires its
  twelve sections. All 24 use cases are rewritten to it from the seed scenarios and the catalogue;
  the sections the owner approved for UC-W8, W19 and W20 are kept.

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
    summary: "`obsidian@obsidian-skills`: obsidian-markdown, obsidian-bases, obsidian-cli; MIT, [kepano/obsidian-skills](https://github.com/kepano/obsidian-skills)"
    source: kepano/obsidian-skills
    pin: "unpinned: installed from the marketplace head"
    provenance: MIT, not reviewed
    used_by: "every `vault-*` skill (mandatory for `vault-assistant`)"
    opencode_status: "unverified (plain `SKILL.md` files)"
    claude_install: "`/plugin marketplace add kepano/obsidian-skills` + `/plugin install obsidian@obsidian-skills`"
    opencode_install: "clone into the user's global opencode skills folder, never into a vault. ..."
  ```

  (`opencode_install` is shortened here only; the register holds today's full cell.) The renderer
  shows each status keyword in today's form: `native` → native, `claude-compat` → `` `.claude/`-compat ``,
  `unsupported` → unsupported, `unverified` → **UNVERIFIED**; the qualifier after the keyword is kept.
  Free-text cells hold their Markdown as written (so "**gap (optional)**" stays bold); the renderer adds
  bold only to `name`.

### Anti-patterns

| Don't | Do instead | Why |
|---|---|---|
| ❌ add an empty bundle to "reserve" a planned one | keep it as a `docs/future-features.md` row | an empty plugin installs nothing (DEC-1) |
| ❌ break a requirement cycle with `requires` both ways | turn one direction into a see-also (D-4) | `bundle_requirements` rejects cycles |
| ❌ re-describe a skill while re-tagging `purpose` | change `metadata.purpose` only | descriptions are measured in `evaluate-catalogue` |
| ❌ delete `bundles/` before `dist` is published and verified | the two-PR order of D-8 | installs clone `develop` until then |
| ❌ write a thin agent over a missing skill | a register row instead | DEC-6 |
| ❌ write voice rules into the placeholders | point to the default profile | no material yet (DEC-10) |
| ❌ force-push `dist` | append one commit per `develop` push | installed marketplaces must update cleanly |

#### Test cases

| Check | Input | Expected |
|---|---|---|
| `use_case_coverage` | a skill no use case names | `skills/<s>: serves no use case (add it to a use case's served_by)` |
| `use_case_coverage` | an agent no use case names | `agents/<a>: serves no use case (...)` |
| `use_case_coverage` | no `use-cases/` directory | no error |
| `use_case_changes_registered` | a `missing` use case whose `change` is absent from the file | the D-12 message |
| `use_case_changes_registered` | a `covered` use case with no `change` | no error |
| `dependencies_register` | `kind: library` | `dependencies.yaml: '<name>' kind 'library'; allowed: ...` |
| `dependencies_register` | no `pin` | `dependencies.yaml: '<name>' missing 'pin'` |
| `dependencies_register` | `opencode_status: maybe` | `dependencies.yaml: '<name>' opencode_status must start with native, claude-compat, unsupported or unverified` |
| render drift | `dependencies.yaml` edited, docs not regenerated | the drift test fails naming `make skill-inventory` |

## Error matrix

| Failure | Detected by | Handling |
|---|---|---|
| A new skill or agent serves no use case | `use_case_coverage` | add the name to a use case's `served_by`, or write the use case |
| A cycle or an undeclared cross-bundle edge | `bundle_requirements` | apply D-4's mechanics to the edge from the bundle that must not require the other |
| A re-tag uses a value not in `facets.yaml` | `facets_declared` | fix the value; the vocabulary changes only with the owner's approval |
| A new agent breaks the template | `agent_conformance` | fix the agent file; never relax the check |
| A partial or missing use case points nowhere | `use_case_changes_registered` (D-12) | add the row to `docs/future-features.md` or fix the `change` |
| The `dist` workflow fails or cannot push | the workflow run, red | `bundles/` stays committed; the switch PR does not open |
| A colleague's install from `develop` breaks after the switch | the colleague, then the migration note | `/plugin marketplace remove meaningfy-skillery`, then add `meaningfy-ws/skillery#dist` and reinstall |
| The first register render changes a visible cell | the PR diff inside the markers | fix the seed text until the diff is empty, or list the change in the PR for the owner |
| A rendered table is edited by hand | the drift test | regenerate |
| A link under `bundles/` is wrong after the switch | `bundle_gates` in CI (after `make bundles`) | fix `bundles.yaml` or the generator |

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
