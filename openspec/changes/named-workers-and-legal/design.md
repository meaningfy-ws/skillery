> Derives from: EPIC `named-workers-and-legal` (`proposal.md`, DEC-1..DEC-17). Decisions declared
> there are cited, not restated. New planning decisions are D-1..D-18.

## Context

Skillery has ten agents under one standard (`docs/development/agent-template.md`, checked by
`agent_conformance` in `tools/repo_lint/lint.py`) and eight default navigator workflows, each in a
host skill (`openspec/specs/workflow-definitions`). Facts that shape the plan:

| Fact | Where | Consequence |
|---|---|---|
| Leads: `system-architect`, `conceptual-modeller`, `devops-engineer`; only the last has `Agent` | `agents/*.md` | DEC-7 adds `Agent` to two leads |
| `epic-planner` is `delegated`; the epic-delivery lead dispatches it as the Planner | `skills/epic-delivery/references/team-and-briefs.md:15` | the Planner row changes when it becomes a lead (D-6) |
| Workflows with no lead or scheduled agent of their host skill: epic-shaping, epic-delivery, release, documentation | `skills/*/assets/workflows/*.json` `activate` | four leads (DEC-11) |
| `sales` is led by `sales-agent` (`scheduled`, primary `sales-operations`, offers a human session) | `agents/sales-agent.md` | the lead rule must count it (D-3) |
| `build-lifecycle` spec names only `epic-planner`, `implementer`, `code-reviewer` in the responsibility table | `openspec/specs/build-lifecycle/spec.md` | MODIFIED delta |
| "The eight default workflow files" | `openspec/specs/workflow-definitions` | MODIFIED delta: nine |
| Every skill and agent must appear in a use case's `served_by` | `use_case_coverage` | new agents and skills go into a use case (D-11) |
| UC-W16 *Contracts and NDAs* exists: `missing`, planned `contract-drafter` in a planned `meaningfy-business`, templates as skill assets, change `add-legal-documents` | `use-cases/UC-W16-contracts-and-ndas.md`, `docs/future-features.md`, `docs/development/catalogue-architecture.md:69` | re-pointed to this EPIC (D-12) |
| UC-W23 plans "a delivery lead agent" for client delivery | `docs/future-features.md` | the epic-delivery lead is named `team-lead`, not `delivery-lead` (D-5) |
| `make bundles` copies every `*/assets/workflows/*.workflow.json` into navigator's data | `tools/bundle_gen/gen.py` `MOD_DATA` | the contract workflow reaches navigator with no generator change |
| TC-16 lists the eight default workflow files and checks every name they use exists | `mods/navigator/lib/workflow.test.ts:87-88` | a ninth file is added to that list |
| `ALL_AGENT_NAMES` feeds `orphan_agent_references` (dropped-agent check); it already omits the three devops agents | `tools/repo_lint/lint.py:40` | the four new names are added; the existing omissions are out of scope |
| "workflow bundle" for `vault-assistant` appears in two specs, the inventory generator, `bundles.yaml` and six docs | `README.md:6,30,224`, `bundles.yaml:76`, `tools/skill_inventory.py:370`, `openspec/specs/{catalogue-governance,dual-cli-generation}` | D-13 keeps it |
| A lead's skills are preloaded from frontmatter; navigator activates a workflow only on a `SkillLoaded` (Skill tool) or a `SubagentSpawned` event | `mods/navigator/lib/state.ts:65,163` | a lead loads its primary skill first (D-15) |
| Every workflow phase must have an `enter` object | `mods/navigator/lib/workflow.ts:134` | D-10 gives `enter: {}` |
| `purpose` facet has no legal or material-repository value; every skill and agent needs one | `facets.yaml`, `facets_declared` (`lint.py:274`) | two values added (D-16) |
| Lint fixtures use `You are the **X**` and exact-equality asserts; a lead fixture has `tools: [Read, Grep]` | `tests/test_repo_lint_negative.py:403-487` | fixtures updated with D-1 and D-2 |
| `agent_skill_alignment` checks only that a skill exists, not that it is reachable from the agent's bundle | `lint.py:921` | D-7's reachability is a review item |
| A Boundary "Delegates" to another bundle's skill forces a bundle requirement | `bundle_requirements` (`lint.py:543`) | new skills name neighbours as *Related* only |
| Odoo and Google Workspace are registered external dependencies; Overleaf is not | `dependencies.yaml` | Overleaf entry added in stage 3 |
| skillery is public; `meaningfy-ws/legal-agreements` is private | `gh repo view` | no contract material in skillery (proposal Rabbit-holes) |

## Goals / Non-Goals

**Goals:** the three stage outcomes of the EPIC, each checked by `make validate`.
**Non-Goals:** the EPIC's No-gos; no navigator engine change; no change to how agents render on
opencode beyond the `Agent` → `task` permission already mapped.

## Decisions

- **D-1 — Persona form, checked.** The role line is `You are **<Persona> the <role>**.` and the
  description starts with the same `<Persona> the <role>` phrase. `<Persona>` is one capitalised
  ASCII word (`[A-Z][a-z]+`). A new lint check `agent_persona` enforces it (stage 2). Why: DEC-4 and
  "no diacritics" are cheap to check and easy to drift.
- **D-2 — Leads may delegate, checked.** A `lead` agent's `tools` list contains `Agent`; the
  "(or none)" in the template's `lead` row goes; the **Refuses** line may still name whom it
  delegates to. Check added to `_agent_frontmatter_errors` (stage 1). Why: DEC-7.
- **D-3 — Lead worker of a workflow.** The lead worker of a default workflow is the one agent whose
  primary skill is the workflow's host skill (its `owner`) and whose type is `lead`, or `scheduled`
  when its **Input** offers a `human session`. Each default workflow has exactly one, and it is named
  in the workflow's top-level `activate.agents` (a variant's `activate` does not count). Check `workflow_lead` (stage 2). A `type: lead` agent's primary skill must
  host a workflow (activity skill, DEC-3), same check. Why: makes DEC-11 testable without a new
  workflow field; counts `sales-agent` honestly.
- **D-4 — No new workflow field.** "Lead" is derived (D-3), not declared in the JSON. Why: no
  navigator schema change, no second statement of the agent's type. Rejected: `"lead": "<agent>"`.
D-5, D-9 and D-10 refine EPIC decisions; the proposal was amended to match (DEC-5, DEC-9, DEC-12,
DEC-13). The owner checks the calls listed under *Open Questions* before stage 1.

- **D-5 — `team-lead`, not `delivery-lead`.** The epic-delivery lead's file and dispatch name is
  `team-lead` (persona Radu the team lead, as approved). Why: UC-W23 already plans a client
  "delivery lead"; one word, two meanings, is the clash this EPIC removes elsewhere. Claude's call.
- **D-6 — `epic-planner` as a lead.** Type `lead`, `Agent` added, description says "Not for
  delegation", **Input** is the person's seeds in a session, **Output** the change files and the
  gate scorecard, and it asks its questions directly (one round at a time, per `epic-planning`).
  The epic-delivery Planner row becomes "the lead loads `epic-planning`, or dispatches a
  general-purpose subagent with it" (it no longer names `epic-planner`). Every reference listed in
  task 2.3 is updated in stage 2. **BREAKING** line in CHANGELOG with the replacement.
- **D-7 — The three new leads.**

  | Agent | Persona | Primary skill | Other skills | Delegates to | Bundle (from primary) |
  |---|---|---|---|---|---|
  | `team-lead` | Radu the team lead | `epic-delivery` | `guardrails`, `meaningfy-code-review`, `spec-stewardship`, `meaningfy-git-workflow` | `implementer`, `code-reviewer`, general-purpose subagents per `epic-delivery` | `meaningfy-building` |
  | `release-manager` | Nelu the release manager | `meaningfy-release` | `meaningfy-git-workflow` | a checker subagent per `guardrails` | `meaningfy-building` |
  | `technical-writer` | Viorica the technical writer | `technical-writing` | `explanatory-writing`, `writing-antipatterns`, `meaningfy-voice` | a cold-reader subagent | `meaningfy-core` |

  Each body cites its skills and adds no method (agent standard). Every skill listed is in the
  agent's bundle or a bundle it requires (`clarity-gate`, in `meaningfy-building`, is therefore not
  given to `technical-writer`; the cold read is `technical-writing`'s own step).
- **D-8 — Skill names.** Legal activity skill: `contract-practice` (bundle `meaningfy-legal`).
  Generic corpus skill: `corpus-repository` (bundle `meaningfy-core`, DEC-13). Both purpose-named.
- **D-9 — No configuration file (refines DEC-9).** Tolic works in a session started in the contract
  repository, like `devops-engineer` in its repository; `corpus-repository` reads the repository the
  session runs in, or one the person names. `meaningfy-ws/legal-agreements` is named in the
  `lawyer` agent's **Input** and in UC-W16, not in a config file. Why: a fixed convention beats a
  config key (owner's YAGNI rule); DEC-9's "one configuration file" was a means, not an outcome.
- **D-10 — The contract workflow.** `skills/contract-practice/assets/workflows/contract.workflow.json`,
  `"name": "contract"`, `"title": "Contract"`, `"provisional": true`, owner `contract-practice`, `activate.skills: ["contract-practice"]`,
  `activate.agents: ["lawyer"]`, phases `intake, draft, align, review, negotiate, sign, harvest`,
  each owned by `contract-practice`, `allow: ["corpus-repository"]`, `expect: []`, `enter: {}`,
  and **no gates**. With no gates the band stays at `intake` until the repository adds its own file;
  that is accepted (Risks).
  The repository adds its gates and strict mode with its own `docs/navigator/contract.workflow.json`
  (`extends`). Why: gates would name the repository's commands and paths, which skillery must not
  hard-code (DEC-9); `send` folds into `negotiate`, `register` into `sign` (DEC-12's names, fewer
  phases: send/register are single commands, not stages of work).
- **D-11 — Use cases.** `team-lead`, `release-manager`, `technical-writer` → UC-W18
  `served_by.agents` (the docs stage is part of the build loop; UC-W24 is LinkedIn and blog
  content); `lawyer`,
  `contract-practice` → UC-W16; `corpus-repository` → UC-W16 too (its first consumer). Why: the
  coverage check needs one home each; no new use case.
- **D-12 — UC-W16 and the roadmap re-pointed.** UC-W16: `status: partial` (released, no live
  trial, DEC-17), `change: named-workers-and-legal`, preconditions and artefacts name the contract
  repository instead of skill-held templates and Overleaf-only output, slices updated.
  `docs/future-features.md` *Legal documents* row: bundle `meaningfy-legal`, agent done `lawyer`,
  left: the live trial and Odoo; change `named-workers-and-legal`. `catalogue-architecture.md`:
  `meaningfy-business` loses legal and `contract-drafter`; a `meaningfy-legal` row is added; the agent
  roster gains a *Persona* column and the five new rows.
- **D-13 — "Workflow bundle" kept, both terms defined.** Renaming it would reach two durable specs
  (`catalogue-governance` Purpose and "Skills are organised…", `dual-cli-generation` "Bundle
  grouping preserved"), the inventory generator (`tools/skill_inventory.py:370`) and six docs, for a
  word. Instead `docs/development/workflows.md` § *Workflow files* and README's *Workers* paragraph
  each say in one line that a *workflow bundle* is a bundle that serves one personal routine
  (`vault-assistant`) and is unrelated to navigator workflow files. Claude's call; rejected: the
  rename (cost out of proportion to the confusion). Why: a
  workflow is now a defined term.
- **D-14 — Where the worker rules live (single home each).**

  | Fact | Home | Pointed to from |
  |---|---|---|
  | worker = agent + persona + activity primary skill + external material | `agent-template.md` § *Workers* | `governance.md` Agent row, README *Workers* |
  | activity vs know-how skill | `governance.md` Skill row + `creating-skills.md` § *Activity skills* | `skill-template.md`, `workflows.md` |
  | one lead per workflow (D-3) | `workflows.md` § *Workflow files*, table gains a *Lead* column | `navigator.md` |
  | persona form (D-1), leads delegate (D-2) | `agent-template.md` | — |
  | material repositories and their own rules | `corpus-repository` skill | `agent-template.md` § *Workers* |
  | persona names roster | `catalogue-architecture.md` roster | README |
  | a lead loads its primary skill first (D-15) | `agent-template.md` § *Workers* | each lead's `## Glue` |

- **D-15 — A lead loads its primary skill first.** Every `lead` agent's body has a `## Glue` step 1:
  "Load `<primary skill>` with the Skill tool before anything else, so the session's workflow is
  shown." Applied to the seven leads of stage 2 and to `lawyer` in stage 3. Why: preloaded frontmatter skills emit no
  `SkillLoaded`, and a lead is the main session, so `activate.agents` never fires for it; the
  `activate.agents` entry of D-3 stays as the declared link, not the trigger. The CLI-agnostic body
  rule holds: "the Skill tool" exists on both CLIs.
- **D-16 — Two `purpose` values.** `facets.yaml` `purpose` gains `contracts` ("draft, revise and
  align contracts and other legal agreements") for `contract-practice` and `lawyer`, and
  `house-material` ("work from a repository of house material by its own rules") for
  `corpus-repository`. Why: `facets_declared` needs one and none fits.
- **D-18 — Facets of the new artifacts** (vocabulary in `facets.yaml`; agents follow their primary
  skill except where noted):

  | Artifact | purpose | area | subject | posture | stage | maturity |
  |---|---|---|---|---|---|---|
  | `team-lead` | software-development | coding | spec-driven | precise | build | experimental |
  | `release-manager` | devops | coding | git-release | precise | release | experimental |
  | `technical-writer` | content | cross-cutting | generic | reusable | any | experimental |
  | `corpus-repository` | house-material | cross-cutting | generic | reusable | any | experimental |
  | `contract-practice` | contracts | legal | generic | precise | any | experimental |
  | `lawyer` | contracts | legal | generic | precise | any | experimental |

- **D-17 — Neighbours are *Related*, never *Delegates*, across bundles.** `corpus-repository` (core)
  names `rulebook`, `project-setup` and `technical-writing` as related; `contract-practice` (legal)
  names `proposal-writing`, `sales-conversations` and `corpus-repository` as related. Why: a delegation makes `bundle_requirements` demand the
  other bundle.

## Algorithm / approach

Three stages, one PR each into `develop`; the gates are skillery's (`make bundles` when a skill,
agent, bundle or mod changes, then `make validate`; `make validate-spine` when `openspec/` changes;
`make mods` when navigator data or tests change; `npm run test:opencode-installer` when `tools/`
changes). Lint code edits follow the repo's GitNexus rule: impact before editing a symbol.

**Stage 1 — rules written down.** Docs per D-14; the stale line fixed; D-2 check and the two leads
gain `Agent`. Worked example of the check:

```
agents/system-architect.md: a lead agent's tools must include 'Agent' (docs/development/agent-template.md)
```

**Stage 2 — names and leads.** Persona lines in ten agents; D-1 check; `epic-planner` → lead (D-6);
three new agents (D-7) with features; D-3 check; workflow `activate.agents` updated; references and
specs. Worked example, `agents/release-manager.md` head:

```yaml
name: release-manager
description: >
  Nelu the release manager cuts and publishes a release with the developer: … Use when a release
  or hotfix is due. Not for delegation; not for feature work (team-lead).
type: lead
tools: [Read, Grep, Glob, Edit, Write, Bash, Skill, Agent]
skills: [meaningfy-release, meaningfy-git-workflow]
```

Role line: `You are **Nelu the release manager**. …` D-3 then finds, for `release.workflow.json`
(owner `meaningfy-release`), exactly one agent: `release-manager`.

**Stage 3 — Tolic.** `meaningfy-legal` in `bundles.yaml` (requires none beyond core, which every
bundle has), facets `area: legal`; `contract-practice` and `corpus-repository` skills with Boundary
sections, Quick Starts and probes; `lawyer` agent; contract workflow (D-10); UC-W16, roadmap,
catalogue docs (D-11, D-12); navigator default-file test lists gain the ninth file.

`agents/lawyer.md` contract (the body cites DEC-8, it never copies the repository's rules):

- **Input:** the need in the person's words, in a session started in the contract repository
  (`meaningfy-ws/legal-agreements` today).
- **Output:** a contract, revision, alignment note or clause proposal on a branch with a PR, each
  open point marked to be confirmed; a list of points for a qualified lawyer.
- **Side effects:** branches, commits and PRs in the contract repository; edits in the current
  contract's Overleaf project.
- **Refuses:** DEC-8, as one list; follows the repository's `AGENTS.md` for everything else.

`contract-practice` owns (DEC-13): the intake interview, choosing skeleton and variant by reading the
library's own guidance, alignment with parent and back-to-back contracts, sorting counterparty
changes (legal effect → variant or override; same effect, better wording → version), proposals with
sources and reasons, the lawyer-review flag, and the contract workflow. `corpus-repository` owns
(generic): find the repository, read its `AGENTS.md` and docs before acting, use its commands, stop on
its checks, never edit what it declares immutable, report what its instructions left unclear.

### Concrete examples

- *Alignment:* a freelance mission contract states 60 days at a daily rate; its back-to-back client
  addendum states 40 days. Tolic reports the mismatch in the PR as an open point; he does not change
  either number.
- *Counterparty revision:* the counterparty removes the liability cap. That changes legal effect:
  Tolic proposes the library's capped variant or an override and explains which, citing the clause.
- *Harvest:* the same clause was overridden in three contracts; Tolic opens a PR proposing a new
  version with the three sources; the owner merges or closes it.
- *Refusal:* asked "send it to the client", Tolic answers that sending needs the owner's
  confirmation of that one action, and states the command the repository uses.

### Anti-patterns

| Don't | Do instead | Why |
|---|---|---|
| Copy the contract repository's rules, layout or commands into a skill or the agent | cite its `AGENTS.md` and docs | the copy drifts when the repository changes (RISK-2) |
| Put clause text, counterparty names or real contract excerpts in skillery | fabricated examples | skillery is public (RISK-5) |
| Put a persona in a skill name or a dispatch name | persona in the role line and description (D-1) | callers, tests and workflows keep working when a persona changes |
| Declare a workflow's lead in its JSON | derive it from type and primary skill (D-3, D-4) | the agent's type would be stated twice |
| Restate a skill's method in a lead body to explain delegation | cite the skill; the body names whom it delegates to | an agent carries no method; a copy is a second owner |

## Error matrix

| Failure | Detected by | Handling |
|---|---|---|
| A lead lacks `Agent` | D-2 check | add it |
| Role line or description lacks the persona form, or has a diacritic | `agent_persona` (D-1) | fix the line |
| A workflow has zero or two lead workers | `workflow_lead` (D-3), naming the file and agents | add or retype an agent |
| A lead's primary skill hosts no workflow | `workflow_lead` | change the primary skill or the type |
| `epic-planner` still dispatched as a subagent somewhere | stage 2 grep over the *Context* list + `rg 'epic-planner'` review | rewrite per D-6 |
| A new skill or agent serves no use case | `use_case_coverage` | add to `served_by` (D-11) |
| UC-W16 `partial` without a registered change | `use_case_changes_registered` | D-12 row |
| An agent lists a skill its bundle cannot reach | not checked (`agent_skill_alignment` only checks existence); review lens L3 | drop the skill (D-7) |
| A lead session never shows its workflow | hand check in acceptance A.1 (start a lead, see the band) | D-15's Glue step |
| A new skill or agent has no `purpose` facet | `facets_declared` | D-16 |
| A Boundary delegates across bundles | `bundle_requirements` | reword as related (D-17) |
| D-2 rejects `Agent(implementer)` or flags a lead with no `tools` list | D-2 pytest cases | match the `Agent` prefix; a lead without `tools` already fails the existing no-tools rule |
| D-3 misses "human session" on a wrapped **Input** line | D-3 pytest case on `sales-agent`'s two-line bullet | read the whole bullet |
| Contract workflow names an unknown skill or agent | TC-16 in `mods/navigator/lib/workflow.test.ts`, run by `make mods` | fix the name |
| TC-16 still lists eight defaults | `make mods` | add `contract.workflow.json` to its list |
| A real clause or counterparty name lands in skillery | review lens L1 + the stage 3 checker | remove before merge; never in history |
| Generated files stale | `make validate` (bundle gates, skill inventory) | `make bundles`, `make skill-inventory` |
| opencode renders a lead without `task` | `npm run test:opencode-installer` | the existing `Agent` → `task` map; a gap if it fails |

## Risks / Trade-offs

- **RISK-1 — wrong legal content trusted** (likely, high). Mitigation: every output is a draft
  (DEC-8); proposals cite sources; points needing a qualified lawyer are listed; changes enter only
  through the owner's PR.
- **RISK-2 — the contract repository changes under Tolic** (likely, medium; it is being built).
  Mitigation: `contract-practice` names no command or path; `corpus-repository` reads the repository
  each session; issues through `skillery-feedback`.
- **RISK-3 — renaming churn breaks a caller** (medium, medium). Mitigation: dispatch names unchanged
  (DEC-4); only `epic-planner`'s type changes, with a BREAKING line and the grep.
- **RISK-4 — the D-3 rule misfires on a future workflow with two human-run agents** (low, low).
  Accepted: the check names the file; the rule is changed then.
- **RISK-5 — public-repo leak** (low, high). Mitigation: fabricated examples only; the checker of
  stage 3 searches for real names given by the owner.
- **RISK-6 — a lead's workflow never activates** (likely without D-15, medium). Mitigation: D-15;
  checked by hand at A.1.
- **RISK-7 — `epic-planner` becomes a primary agent on opencode too** (certain, low): `lead` renders
  as `mode: primary`. Mitigation: the BREAKING line names both CLIs.
- Trade-off: no gates in the default contract workflow (D-10) means the band stays at `intake` until
  the contract repository adds its own `docs/navigator/contract.workflow.json`.

## Open Questions

None. The owner confirmed D-5 (`team-lead`), D-8 (skill names), D-9 (no config file), D-10 (seven
phases, no default gates) and D-13 (no rename) on 2026-11-11.

- **D-20 — Stage 1 as built (lead's calls, 2026-11-11).** (a) The lead wrote stage 1 itself, no
  builder subagents: docs and one small lint check, cheaper than five briefs; the review set and
  checker still run. (b) The four leads not yet built are marked "(planned)" in `workflows.md`'s
  *Lead* column, not "stage 2": a durable doc should not name a stage of a change. (c) The pointer
  from `agent-template.md` § *Workers* to `corpus-repository` lands with that skill in task 3.1, so
  no doc names a skill that does not exist yet. (d) Task 1.4's agent change is behavioural, so
  `system-architect.feature` and `conceptual-modeller.feature` each gain a delegation scenario.
- **D-21 — Stage 1 review decisions (lead's calls, 2026-11-11).** Accepted: (a) D-2 also fails a
  lead that denies `Agent` in `disallowedTools`; a lead with no `tools` list and `Agent` not denied
  inherits it (helper `_grants_agent`, constants `AGENT_TOOL`, `LEAD_TYPE` for stage 2's checks);
  the error-matrix row on "a lead with no `tools`" is corrected by this. (b) Single homes: the
  activity/know-how definition lives only in `creating-skills.md` (D-14's governance row becomes a
  link); "a lead's primary skill is an activity skill" lives only in `agent-template.md` § *Workers*.
  (c) L4's wording fixes in `workflows.md` and `agent-template.md`. Rejected: (d) scoping leads to
  `Agent(<type>)` (L1): `renderAgent` maps only bare `Agent` to `task`, so a scoped entry drops
  delegation on opencode; the bodies name a read-only subagent instead, and the residual risk (a
  subagent is not bound by the lead's `tools`; it runs under the session's permissions with the
  person present) is accepted. (e) A sentence that existing agents adopt the persona form "in the
  next release" (L2): it would go stale; instead no release is cut between stage 1 and stage 2.
- **D-22 — Stage 2 as built (lead's calls, 2026-11-11).** (a) `agent_persona` is its own check in
  `ALL_CHECKS`, as D-1 names it, not a branch of `agent_conformance`; the conformance fixtures keep
  their shape, so task 2.2's fixture move is not needed. (b) `workflow_lead` reads agent files
  directly (`_frontmatter`, the **Input** bullet) rather than `bundle_gen.agent_frontmatter`, so it
  needs no agent map in its tests. (c) One builder wrote the three new agents and their features
  (task 2.4's new files); the lead wrote the rest. (d) UC-W18's guarantee "nothing committed by an
  agent" becomes "nothing without the developer's consent; no delegated agent commits", since
  `team-lead` commits under `epic-delivery`'s authority rule. (e) The *Candidate roles* rows for Work
  Shaper and documenter are removed: both are now agents.
- **D-23 — Stage 2 review decisions (lead's calls, 2026-11-11).** Accepted: the tester's seven
  defects (role line is the first line only; the description's persona phrase ends on a word;
  wrong-shape and unreadable workflow files neither crash nor orphan their lead, whose host is the
  skill folder; `activate.agents` must be a list; the **Input** bullet ends at the next bullet,
  heading or blank line); one `_primary_skill` helper for `_primary_skill_errors` and
  `_lead_workers`, which now reads frontmatter through `bundle_gen.agent_frontmatter` (L3, L5);
  constants `SCHEDULED_TYPE`, `HUMAN_SESSION` (L4); consent on commit, push and merge for
  `team-lead` and `release-manager`, a merge to `main` counting as a publish (L1); `technical-writer`
  refuses non-docstring code edits and reports to the person, not `team-lead`, since `meaningfy-core`
  stands alone (L1, L3); `guardrails` listed by all three new leads (L3); a delegation scenario for
  `epic-planner` (L2). Rejected: splitting `workflow_lead` into two checks (L4) — the host set is
  now from paths, the second rule is one comprehension; dropping the empty "()" from the zero-lead
  message (L4) — tests pin it; checking the *Lead* column against the derived lead (L5) — it is a
  hand-kept summary and says so.
- **D-19 — PLAN accepted below the gate.** Four independent clarity-gate runs scored 8.5, 8.6, 8.7
  and 8.5; each found new wording or fact slips, all fixed in the PLAN (the last scorer estimated
  about 9.5 after its fixes; there was no fifth run). Owner's answer (2026-11-11): accept and
  record; stage 1 may start.
