# EPIC: Restructure and evaluate the catalogue — use-case-driven architecture, measured revision

> **Golden thread.** Parents: the baseline audit of 2026-10-26,
> `openspec/changes/archive/2026-10-26-skill-crafting-method/inputs/baseline-audit.md` (cite it by
> name; it is archived), and the owner's use cases,
> [`inputs/2026-10-27-scenarios.md`](inputs/2026-10-27-scenarios.md). Shaping records:
> [`inputs/2026-10-26-shaping-qa.md`](inputs/2026-10-26-shaping-qa.md) (first shape) and
> [`inputs/2026-10-27-reshaping-qa.md`](inputs/2026-10-27-reshaping-qa.md) (this reshape). The owner's
> diagram: [`inputs/2026-10-27-catalogue-model.md`](inputs/2026-10-27-catalogue-model.md).
> **Roadmap position:** step 4 of 5 (`skill-crafting-method` `design.md` §8), now **absorbing the
> design half of step 5**: this EPIC decides the target bundles, agents and roadmap; carrying out the
> re-bundling and building the new agents are follow-on changes it names.
> **Siblings (cited, never restated):** `define-ai-domains` (the `ai-*` domain docs template),
> `add-devops-bundle`, `add-sales-bundle`.

> **Split, 2026-10-26 (owner).** The evaluation still to do (batch C, the outcome suites, batches A
> and B) moved to the parked change `evaluate-catalogue`, with the `catalogue-evaluation` spec delta.
> This change closes with the architecture track and the evaluation already done (D, E, the docs
> re-check). The sections below are kept as shaped; where they describe the moved work, that change
> now owns it.

> **Status, 2026-10-27 (reshaped).** Phase 1 is three-quarters done: batches D, E and the docs
> re-check are merged (#72, #73, #74); batch C is paused and resumes on Haiku with D-13, after the architecture
> track: no evals run until the catalogue is systematised (owner, 2026-10-27). See `tasks.md`, "Current state".

## Appetite

**Large, in gated phases: about six to eight weeks part time, over several PRs.** Each phase ends in
a PR the owner can stop after. The evaluation track keeps its batch-per-PR rhythm and per-batch spend
approval (DEC-5). The architecture track uses no model runs. If the architecture work turns into
building new agents, stop: those are follow-on changes.

## Why

The catalogue grew skill by skill. It now has five bundles, 32 skills and 3 agents (v3.2.0), and it is already
showing two kinds of strain.

**It is not measured.** The baseline audit found 21 descriptions over the target, 2 oversized skills,
2 skills without probes, 19 one-way Related links and a measured trigger gap, and no skill has
behavioural evidence. Fixing these by edit alone would repeat what the method was written to stop:
changes judged by opinion.

**It is not organised around what people do.** The owner listed 21 use cases in which the owner or a
colleague needs an agent (UC-W1–UC-W21). They range from vault work, a secretary and a life coach, through
devops, sales and the commercial chain (market → commercial structure → qualification → proposal →
negotiation → contract), to architecture, conceptual modelling and demo building. About half are
uncovered, and the rest are covered by skills that were grouped by who wrote them, not by the work.
Shared house resources already break across bundles: `explanatory-writing` (core) links into
`executive-communication`'s folder (consulting), so a core-only install has a broken link. Without
an architecture, every new use case adds to an "usine à gaz".

Why now: this month's priority is to make skillery maintainable, before the sales and devops
agents land on it.

## Solution outline

**Track A: architecture (no model runs).**
1. **A use-case catalogue,** open-ended: one short file per use case, at the White (contract) level of
   the `architecture` skill's Cockburn convention (actor, trigger, success guarantee, who serves it). Adding a use case is adding a file. Seeded with UC-W1–UC-W21.
2. **The conceptual model of the catalogue,** published from the owner's diagram (revision 2): use cases,
   skills (one class, an open `kind`), resources, tool policies, agents (type and mode) with their
   runtime, external dependencies (plugins, CLI tools, MCP servers, services, memory stores), tests,
   docs, bundles and config items.
3. **The inventory and gap map,** derived: each use case names the agents and skills that serve
   it;
   what is left is the gap.
4. **Foundation skills** for shared house resources (voice, visual identity, templates), required by
   name, never by a `../other-skill/` path, with a lint check. The first one fixes the company-voice
   link.
5. **Docs by intention:** three doors, Install, Use (use case → companion → skills) and Develop (the
   method).
6. **The target structure and the roadmap:** the bundle map by activity, the agent roster, and the
   follow-on changes in waves, approved by the owner.

**Track E: evaluation (model runs approved per batch, on Haiku).**
1. **Audit batches A–E,** each a PR with the method's proportionate test. D and E are done; C resumes;
   A and B run on the target structure, so no description is polished twice.
2. **A behavioural eval suite per bundle** under `evals/<bundle>/`, run on demand.
3. **Agents evaluated through their Gherkin:** each agent eval case is the runnable form of one
   scenario in `tests/features/agents/*.feature`, and grades all four lists of the dispatch contract.
4. **A record per item:** a before/after entry in `inputs/evidence/` for every revised skill or agent.

## Key decisions

- **DEC-1: Measurement before and after every revision.** No skill or agent is revised in the
  evaluation track without a recorded "before" from the same suite or probes that judge the "after".
- **DEC-2: Rigour is the method default** (owner, Q2): the agentskills.io trigger method for
  description changes, baselines with at least 5 repetitions for body restructures, one pinned model
  per run. **The record model is Haiku** (owner, R3, 2026-10-27); a Sonnet spot-check of final
  results is a later, separately approved decision.
- **DEC-3: Evals stay on demand, under human control** (owner, Q3). Nothing runs on push, pull
  request or release.
- **DEC-4: One batch, one PR, one evidence file.** A batch is the unit of review and of stopping.
- **DEC-5: Budget is approved per batch.** The owner's starting figure is $5. On Haiku the full
  evaluation scope is provisionally about $15–25 (design D-5), re-measured by calibration (D-12).
- **DEC-6: Revisions respect the posture** recorded by `define-catalogue-model`.
- **DEC-7: No new eval platform.** `claude plugin eval` is the tool. Observability for Meaningfy's own
  agents and apps is a separate decision.
- **DEC-8: Use cases are the anchor** (owner, 2026-10-27). Skills, agents, tests and the "Use" docs
  trace to use cases. They follow the existing Cockburn convention of the `architecture` skill (White
  level), not a new format; Gherkin is projected from them as that convention requires. The catalogue
  is open: a new area is one line in `facets.yaml` and a new use case is one file.
- **DEC-9: Shared house resources live in foundation skills** (owner, R4): skills that hold a
  resource and no method, placed in a bundle that every bundle using them contains or requires,
  cited by name. A resource
  moves into one the second time another skill needs it (the rule of two).
- **DEC-10: The catalogue has one conceptual model,** started from the owner's diagram (R5): a
  PlantUML class view, a picture for understanding, with no machine-readable source (YAGNI).
- **DEC-11: Agent tests are Gherkin; evals run them** (owner, R1). The `.feature` scenario is the one
  source; each agent eval case names the scenario it runs.
- **DEC-12: Agents carry the aspects; skills stay agnostic.** Runtime (interactive or background,
  with trigger, evidence log and result home), memory stores and external dependencies belong to the
  agent, not to skills. Each agent's follow-on change declares them; this EPIC does not.
- **DEC-13: Local customisation is configuration, not forks.** Colleagues share the same skills; a
  vault carries a small local config (for example "works/tasks" for "projects"). The vault change is
  a follow-on.
- **DEC-14: This EPIC designs the new agents; it does not build them.** The roster and waves are its
  output; each new agent or domain skill is a follow-on change, starting from its use cases.

## Rabbit-holes

- **Do not tune a description until it games the grader.** A grader that passes a weak answer is
  rewritten, not satisfied.
- **Do not chase scores across models.** Haiku is the record; Sonnet is a deliberate, budgeted extra.
- **Do not let eval suites grow without limit.** A few cases per key skill.
- **Do not over-model (YAGNI).** A field, vocabulary or view is added only when a check, a
  generated view or a person reads it. Cut on 2026-10-27: a skill `kind` field, memory and frequency
  on use cases, waves on use cases, an agent `mode` field, a maintained object view, LinkML.
- **Do not design every agent in detail.** The roster gives each agent one row (type, use cases, bundle,
  change); its aspects and full contract are the follow-on change's job.
- **Do not build a foundation skill speculatively.** Only a resource that two skills already use
  moves (DEC-9).

## No-gos

- No new method skills and no new agents; the only new skills are foundation skills extracted from
  existing resources (DEC-9, DEC-14).
- No bundle moves beyond placing foundation skills. The re-bundling is a follow-on change.
- No eval runs in CI on push, pull request or release (DEC-3).
- No model spend beyond what the owner approved for the batch (DEC-5).
- No third-party eval or observability platform (DEC-7); no MCP connector registry (named for the
  roadmap).
- No opencode eval runner. It stays a recorded gap.

---

## What Changes

- **New:** a use-case catalogue seeded with UC-W1–UC-W21 and its check; the published conceptual model;
  the inventory and gap map; foundation skills for shared resources (the first: the company voice)
  and a lint check against cross-skill paths; the three-door docs entry; the target structure and
  roadmap document.
- **Revised:** descriptions, bodies and Boundary sections of the skills in audit batches A–C (on the
  target structure); `facets.yaml` gains the areas the use cases need.
- **Evaluation:** suites under `evals/<bundle>/`; agent cases traced to `tests/features/agents/`;
  probes in `tests/trigger_probes.yaml`; `inputs/evidence/` per batch.

No breaking change for installers. A skill that moves to a foundation skill keeps its content; a
bundle that now needs a foundation skill gets it through `requires:` or by containing it.

## Capabilities

### New Capabilities

- `catalogue-evaluation`: how the catalogue's skills and agents are evaluated (suites per bundle,
  agent cases that run their Gherkin, the before/after record, on-demand runs, per-batch budget).
- `catalogue-architecture`: the use-case catalogue, foundation skills and the rule against
  cross-skill paths, and the three documentation doors.

### Modified Capabilities

None. New `area` terms are one line each in `facets.yaml`, which the `catalogue-model` spec already
allows.

## Impact

- **Files:** `use-cases/` (new), `docs/` (the model, the gap map, the roadmap, the doors in
  `README.md`), `skills/*` (foundation skills, descriptions, bodies), `facets.yaml`, `bundles.yaml`
  (foundation placement only), `tools/repo_lint/` (use-case and cross-path checks), `evals/`,
  `tests/`, `docs/skill-inventory.md` (regenerated), `CHANGELOG.md`.
- **Cost:** model runs on the owner's account, approved per batch (DEC-5).
- **Siblings:** `define-ai-domains` owns the `ai-*` domain docs; the "Use" door links to it and the
  activity areas are reconciled with its three domains in the PLAN. `add-devops-bundle` and
  `add-sales-bundle` become wave-1 entries of the roadmap and read the target structure.
