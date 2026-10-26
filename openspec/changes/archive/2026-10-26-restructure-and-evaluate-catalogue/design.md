<!-- PLAN (design half). PLAN = this file + tasks.md. Document type: Implementation. Revision 5
     (2026-10-27: YAGNI cuts; use cases replace scenarios; model rev. 2; earlier the same day, reshaped: architecture track added, Haiku record model, D-13 adopted, agent evals run
     their Gherkin). Revision 3 scored 8.9/10, its gaps were closed and it was accepted (task 0.1); revision 5 scored 8.5/10 by an independent reviewer, gaps closed, re-scored 9.1/10 (task 0.4). -->

> Parent: EPIC `restructure-and-evaluate-catalogue` ([`proposal.md`](proposal.md), DEC-1…DEC-14).
> Golden thread: the baseline audit
> ([`../archive/2026-10-26-skill-crafting-method/inputs/baseline-audit.md`](../archive/2026-10-26-skill-crafting-method/inputs/baseline-audit.md))
> and the seed use cases ([`inputs/2026-10-27-scenarios.md`](inputs/2026-10-27-scenarios.md)).
> Owner answers: [`inputs/2026-10-26-shaping-qa.md`](inputs/2026-10-26-shaping-qa.md),
> [`inputs/2026-10-27-reshaping-qa.md`](inputs/2026-10-27-reshaping-qa.md). The owner's diagram:
> [`inputs/2026-10-27-catalogue-model.md`](inputs/2026-10-27-catalogue-model.md).
> Acceptance criteria are the deltas under [`specs/`](specs/).

## Context

v3.2.0 ships the method (`skill-crafting-method`) and the catalogue model (`define-catalogue-model`):
every skill and agent records its posture and six facets (`facets.yaml`), bundles declare `requires:`,
and the checks report the audit's findings on every `make validate`.

Phase 1 of the first shape is mostly done: batch D (#72, with `evals/README.md` and the evidence
template), batch E (#73) and the docs re-check (#74). Batch C is paused: `skill-creator`'s
`run_eval.py` cannot register skills in Claude Code 2.1.310, so its "before" was invalid
(`inputs/evidence/C.md`); D-13 replaces it.

On 2026-10-27 the owner reshaped the EPIC (`inputs/2026-10-27-reshaping-qa.md`): 21 seed use cases,
foundation skills for shared resources, a conceptual model of the catalogue, Haiku as the record
model, and agent evals that run the agents' Gherkin. This revision adds the architecture track
(D-14…D-20) and revises the evaluation decisions that changed (D-2, D-3, D-4, D-5, D-13).

Measured unit costs (2026-10-27, `inputs/approvals.md`): one trigger query is $0.0038 on `haiku`
(`claude-haiku-5-5`) and $0.0295 on `sonnet`. One short outcome run was $0.04 on Sonnet (2026-10-26);
on Haiku it is estimated at about $0.006 by the same ratio, until measured.

## Goals / Non-Goals

**Goals:**
- Organise the catalogue around use cases: a use-case catalogue, a published conceptual model, an
  inventory and gap map, foundation skills, three documentation doors, and an approved target
  structure and roadmap.
- Close audit batches A–E with evidence, on Haiku.
- Give every bundle an outcome suite, and run each agent's Gherkin as eval cases.
- Keep each batch's spend within the amount the owner approves for it.

**Non-Goals:** the proposal's no-gos: no new method skills or agents, no re-bundling beyond placing
foundation skills, no CI runs on push, PR or release, no third-party platform, no MCP registry, no
opencode runner.

## Decisions — evaluation track (D-1…D-13)

- **D-1. One evidence file per batch**, `inputs/evidence/<batch>.md`, one row per item, with exactly
  this ten-column header:

  ```
  | Item | Posture | Change | Eval | Model | Runs | Before | After | Cost | Verdict |
  ```

  *Model* is the id the CLI reports for the run. *Cost* is measured where the tool reports it and
  otherwise estimated as runs × measured unit cost (D-12), marked "est.". *Verdict* is kept, reverted
  or handed off. An item whose "after" is not better than its "before" is reverted or kept with a
  written reason.
- **D-2. Trigger sets** live in `evals/triggers/<skill>.json`, in the `{query, should_trigger}`
  format: 20 queries, 10 that should trigger and 10 near-misses, seeded from the skill's probes in
  `tests/trigger_probes.yaml`.
  - **Measurement:** by D-13. "Before" runs the current description, "after" the candidate.
  - **Pass:** at least 90% of should-trigger queries fire at a rate of 0.5 or more, at most 10% of
    near-misses do, and the score is not worse than "before".
  - **Location:** the sets sit outside the skills, so they do not ship to installers. Collisions
    with real neighbours are measured by the bundle suites (D-3).
- **D-3. Outcome suites** live in `evals/<bundle>/<case>/` (`prompt.md` plus `graders/`), as the
  seed suite does. Each skill case has one `llm` grader for the outcome and one `tool_used` grader for
  the skill firing.
  - **Size:** one case per key skill, at most 4 skill cases per bundle in the first pass. "Key skill"
    is chosen by the owner when approving the batch (default: task 4.1).
  - **Agent cases run the agent's Gherkin** (DEC-11). Each case lives in
    `evals/meaningfy-building/<agent>-<scenario-slug>/` and its `prompt.md` opens with
    `<!-- runs: tests/features/agents/<agent>.feature — Scenario: <name> -->`. The `.feature` is the one
    source; the case only makes it runnable. Per agent, two cases: one that grades a **return**
    (needs + returns) and one that grades a **refusal**. Graders:
    - dispatch: `tool_used` on `Agent` with the namespaced subagent, `min: 1`;
    - contract: an `llm` grader quoting the Gherkin `Then` steps;
    - **least privilege:** `tool_used` with `max: 0` on each tool outside the agent's `tools:` that
      the case could tempt (for `code-reviewer`: `Edit`, `Write`), and **side effects**: an `llm`
      grader on the files changed, matching the contract's side-effects list.
  - **Failure-first for agents:** the "before" is the current agent version. A failing case is the
    recorded failure. The fix goes first to the skill that owns the behaviour (agents are thin); the
    agent body changes only for its contract or glue. The fix is a row in the batch's evidence.
  - **Flags and plugins:** cases that let an agent write (`implementer`) run with
    `--allow-tools Write Edit Bash`; vault cases that seed a scratch vault run with `--scaffold`. The
    temporary plugin includes the skills of every bundle the tested bundle `requires:`. Vault cases do
    not depend on the external obsidian CLI.
- **D-4. Models** (owner, R3).
  - **The record model is Haiku** (alias `haiku`), for trigger sets, outcome suites and baselines,
    before and after. The evidence row records the id the CLI reports.
  - **Never compare across models:** a "before" and "after" use the same model and the same set.
  - **A Sonnet spot-check** of final results is a later decision, approved and recorded on its own.
- **D-5. Order, and approval per batch** (DEC-5). Structural work first, and **no eval runs until the
  architecture track (phase 2) is done** (owner, 2026-10-27), so batch C runs after phase 2 although
  it keeps its phase-1 label. Every batch that uses model runs is approved on its own estimate (Haiku
  unit costs from D-12):

  | Phase | Batch | Model runs | Estimate |
  |---|---|---|---|
  | 1 | D, E, docs re-check | none | $0 (done) |
  | 1 | C `executive-communication`: before + after (120) + Haiku drafts (≤ 120) + seed case | ≈ 240 | ≈ $1 |
  | 2 | architecture track (D-14…D-20) | none | $0 |
  | 3 | suites "before" (5 bundles, ≤ 4 skill cases + 6 agent cases, 3 runs) | ≈ 80 outcome | ≈ $1–2 |
  | 4 | A1–A4, one sub-batch at a time | 600–720 trigger + drafts each | ≈ $3–5 each |
  | 5 | B baselines (2 skills × 3 scenarios × 5 reps × 2) + suites "after" | ≈ 140 outcome | ≈ $2 |

  The full evaluation scope is about $15–25. Every figure is re-checked against the calibration
  before the batch is approved.
- **D-6. A batch is one PR** (DEC-4): its evidence file, its edits and the regenerated catalogue map.
  Phase 4 runs one PR per sub-batch. Phase 2 runs one PR per task group (task 3.x).
- **D-7. Revisions follow the recorded posture** (DEC-6), read from `metadata.posture`. A `reusable`
  skill gains no domain wording; a `profiled` skill names its switch; a `precise` skill keeps its
  guardrails.
- **D-8. Body restructures (batch B) move detail, never meaning.** Sections move into `references/`
  with a pointer at the point of use; the baseline proves no scenario got worse.
- **D-9. Batch E rule** (done). For each one-way Related pair, add the return link or turn the link
  into a "see also" sentence in the source's Boundary section.
- **D-10. The docs and structure re-check** (done) read every hand-written register row against the
  method; small findings fixed, the rest handed off.
- **D-11. `evals/README.md`** is the one place that says how to run both kinds of eval. It is updated
  for D-4 and D-13 (task 2.4).
- **D-12. Spend is capped by run count and cost ceiling.** Before a batch, one calibration query per
  model gives the unit cost (`claude -p --output-format json`, `total_cost_usd`); approved amount ÷
  unit cost is the maximum run count, draft runs included. `claude plugin eval` also takes
  `--max-cost-usd`, set to the approved amount.
- **D-13 (adopted 2026-10-27). Trigger sets run through `claude plugin eval`.** A short converter
  (`evals/triggers/to_cases.py`) turns `evals/triggers/<skill>.json` into one case per query in a
  temporary plugin that holds only the skill under test; for the "after", the candidate description
  is written into the copy:
  - a should-trigger query gets a `tool_used` grader on `Skill` with `min: 1`;
  - a near-miss gets `min: 0, max: 0`;
  - 3 runs each, `--ablation none`, `--model haiku`, `--max-cost-usd` set to the approval.

  `claude plugin eval` loads none of the owner's settings, plugins, `CLAUDE.md` or skills, so the
  isolation the first shape built by hand (a `/tmp` directory and a fresh `CLAUDE_CONFIG_DIR`) is
  built in. The converter has an assert-based self-check on one fixture set.

## Decisions — architecture track (D-14…D-20)

- **D-14. The use-case catalogue** (DEC-8) is one Markdown file per use case,
  `use-cases/<id>-<slug>.md` (`UC-W1-vault-work.md`). It reuses the `architecture` skill's Cockburn
  convention (`references/use-cases-cockburn.md`) rather than a new format: catalogue entries are
  **White** use cases (the black-box contract: value and guarantees), numbered `UC-W<n>`, written in
  Markdown instead of AsciiDoc. Its Primary Actor, Trigger and Success Guarantee are lifted into
  frontmatter so a check can read them; they appear **only** there. Level is always White and Scope is
  always the catalogue, so neither is written. A **Blue**
  realisation, if one is needed, belongs to the follow-on change that builds the agent. The seed ids
  map one to one: `S<n>` in `inputs/2026-10-27-scenarios.md` becomes `UC-W<n>`. Frontmatter:

  | Field | Value | Checked |
  |---|---|---|
  | `id`, `title` | `UC-W<n>`, the use-case name | unique; `id` matches the file name |
  | `primary_actor` | who pursues the goal | present |
  | `trigger` | the initiating event | present |
  | `success_guarantee` | what holds when it succeeds (the "done when") | present |
  | `area` | a term of the `area` facet | in `facets.yaml` |
  | `served_by` | `{agents: [...], skills: [...]}`, names in the catalogue | exist |
  | `status` | `covered` · `partial` · `missing` | in list |
  | `change` | the follow-on change that closes it (D-19) | optional |

  The body carries the convention's other sections that have content, in its order (never Trigger or
  Success Guarantee); at least the **Brief Description** (the goal in the owner's words).

  **Status** is defined by `served_by`: `covered` when the agents and skills named there do the whole
  job; `partial` when they do part of it, or when a drafted change already holds its materials
  (UC-W6, UC-W7: `served_by` names only what exists, `change` names the draft); `missing` when
  nothing in the catalogue serves it. Seeding takes each status from the seed gap map; afterwards the
  owner decides when a use case becomes `covered`. **Seed area mapping** (to D-20 terms): personal → `personal`;
  operations → `operations`; selling, commercial design, pre-sales → `sales`; business →
  `business`; legal → `legal`; design → `design`; engineering → `coding`. The convention's derivation rule applies unchanged:
  the follow-on change projects the success guarantee into its agent's `.feature` (`Then` steps),
  and the agent eval cases run that `.feature` (DEC-11). So one thread runs from the use case to the
  Gherkin to the eval case.

  A new lint check (`use_case_catalogue`) enforces the "Checked" column. The catalogue map generator
  (`make skill-inventory`) also renders `docs/use-cases.md`: one table by area with status and change,
  which is the gap map. That generated view replaces hand-kept gap tables.
- **D-15. Foundation skills** (DEC-9; model rev. 2, M1–M2). The model's skill `kind` stays
  conceptual: no frontmatter field marks it until a second non-method kind needs to be read by a
  check or a view (YAGNI, owner 2026-10-27).
  - **Resources:** every file in a skill folder besides `SKILL.md` is a resource; its kind follows its
    folder (`references/`, `assets/`, `scripts/`), and its scope is private unless it sits in a
    foundation skill. Nothing new is declared for this; the model names what exists.
  - **Foundation shape:** recognised by its job (a resource, no method); posture `precise`; a short `SKILL.md` saying
    what the resource is and when to load it; the resource in `references/` or `assets/`. Its
    description is written so it loads when a skill names it, with a positive and a near-miss probe.
  - **Placement:** in a bundle that every bundle using it contains or `requires:`. In practice, one
    used across bundles goes to `meaningfy-core`, and each bundle whose skills cite it declares
    `requires: [meaningfy-core]` (today only `meaningfy-building` declares any `requires:`).
  - **The rule of two:** a resource moves into a foundation skill when a second skill needs it.
  - **The check:** a new lint error, `cross_skill_paths`, rejects any link from `skills/<a>/` that
    resolves into `skills/<b>/`. Skills name another skill; they never path into it.
  - **The first:** `meaningfy-voice`, holding `company-voice.md` (moved from
    `executive-communication/references/`), placed in `meaningfy-core`. `executive-communication` and
    `explanatory-writing` cite it by name. The task also resolves every other cross-skill path the
    check finds, by the rule of two or by a name citation.
- **D-16. The conceptual model** (DEC-10) is revision 2 of the owner's model. Its **class view**,
  from `inputs/2026-10-27-catalogue-model.class.puml`, is published in `docs/catalogue-architecture.md`
  (Develop door) as the `.puml` source with a rendered SVG committed beside it (GitHub does not render
  PlantUML); rendering is a manual step until a renderer is approved. Each class names the file or
  check that holds it. The **object view** stays in `inputs/` as a dated snapshot and is not
  maintained: `docs/use-cases.md` is the live gap map. A register row is added. The model has no
  machine-readable source (Q-1 closed: no LinkML).
- **D-17. Agents in the roster** (DEC-12, DEC-14). The roster (D-19) has one row per agent,
  existing and planned: agent, `type` (`delegated`, `lead`, `scheduled`, or `partner`, Q-2), use
  cases, bundle, change. `mode` (primary, subagent or both) stays derived from `type`, as it is today
  in `tools/opencode-agent-map.json` `agentModes`; that map has no `partner` entry, so Q-2 also
  decides its mode. The aspects of the model (runtime, memory stores, external
  dependencies, tool policy) are decided by each agent's follow-on change, not here.
- **D-18. Three documentation doors** (owner, answer 10). The README's documentation section becomes
  three doors: **Install** (setup per CLI), **Use** (`docs/use-cases.md` → the agent or skill → its
  Quick Start; the `ai-*` domain docs of `define-ai-domains` linked, not restated), **Develop** (the
  method, `docs/catalogue-architecture.md`, the governance spec). Only that section changes; the
  README findings handed to `define-ai-domains` stay with it.
- **D-19. The target structure and roadmap** live in `docs/catalogue-architecture.md`, after the
  model, and are approved by the owner before Phase 2 closes:
  - **target bundles by activity**, one row per bundle: its areas, skills, agents and `requires:`;
  - **the agent roster**, one row per agent (D-17), existing and planned, each with its use cases;
  - **the roadmap**, one ordered list of follow-on changes grouped in waves; each use case points
    to its change (D-14), so the gap map shows what each change closes. Starting proposal from this
    month's priorities: wave 0 this EPIC; wave 1 `add-sales-bundle` (UC-W7) and engineering agents
    (UC-W18–20); wave 2 `add-devops-bundle` (UC-W6) and the commercial chain (UC-W8–13); wave 3 the
    personal planner, secretary and coach (UC-W2–5) with the vault local config (UC-W1, DEC-13);
    wave 4 visual design (UC-W17), business partners (UC-W14, 15), legal (UC-W16), demos (UC-W21).
  - **infrastructure changes**, named: the re-bundling by activity; the agent-template change
    (the aspects of each agent, Q-2); an **external dependency register** (one structured entry per plugin,
    skill, CLI tool, MCP server, service or framework, with source, pin, provenance, install check and
    CLI support, becoming the source of the tables in `docs/environment/dual-cli/compatibility.md`
    and `mcp-setup.md`; model rev. 2, M5); an Odoo memory skill (how to store and find things in Odoo); config items (rules,
    settings) that a bundle or project may ship (M9, later).
- **D-20. Area terms added.** `area` in `facets.yaml` gains `operations`, `business`, `legal`,
  `design`, one line each with its definition, as the `catalogue-model` spec already allows; no other
  vocabulary is added. The seed areas map to these terms as listed in D-14. The areas are reconciled
  with `define-ai-domains`' three domains (coding, selling, advising) by naming the mapping in
  `docs/catalogue-architecture.md`.

## Algorithm / approach

**Evaluation batch** (each in order):
1. **Estimate and ask.** Runs, model, cost; the owner's yes (D-5). No yes, no run.
2. **Measure before** on the current text; fill the "before" column.
3. **Revise** following the posture (D-7) and the method's description rule.
4. **Measure after** with the same set, model and run count.
5. **Decide**: keep, revert or hand off; fill the evidence row with the cost.
6. **Ship**: regenerate the map, `make validate`, open the PR (D-6).

**Architecture task group** (each in order): write the check or generator first, with a failing
fixture → seed the data → regenerate views → `make validate` → PR.

*Worked example, evaluation (batch C; the numbers are illustrative).* The set
`evals/triggers/executive-communication.json` has 10 should-trigger queries ("write the cover email
for this quotation", …) and 10 near-misses ("write the SoW for the decision phase" →
`proposal-writing`, …). `to_cases.py` makes 20 cases; Haiku, 3 runs: before 6/10 and 1/10. The
candidate adds "cover messages for quotations, SoWs and tenders", ≤ 600 characters, keeps the bind
switch; after 9/10 and 0/10. The seed case `quotation-bind` passes. Evidence: about $1, "kept".

*Worked example, architecture (UC-W8).* `use-cases/UC-W8-proposals-and-offers.md`:
`title: Write a proposal or formal offer`, `primary_actor: owner or account lead`,
`trigger: a client's requirements arrive`, `success_guarantee: a PDF in house style, or a proposal
email, that the owner would send without edits`, `area: sales`, `served_by: {agents: [], skills: [proposal-writing, estimation,
decision-package, executive-communication]}`, `status: partial`, `change: add-offer-agent`.
Body: a Brief Description in the owner's words (standard or bespoke offers; asks the right
questions first). `docs/use-cases.md` shows it under sales as partial, closed by `add-offer-agent`. Later, `add-offer-agent`
projects the success guarantee into `tests/features/agents/offer-writer.feature`.

**Idempotency:** sets, suites, use cases and generated views are files; regenerating gives the same
output, and a rerun of a set reproduces its measurement within noise (3 runs per query).

### Anti-patterns

- ❌ Running a batch without the owner's yes on its estimate.
- ❌ Changing a description and its trigger set in the same step; the set is fixed before "before".
- ❌ Comparing a Haiku number with a Sonnet number.
- ❌ An agent eval case with no `runs:` line, or one that restates the Gherkin instead of citing it.
- ❌ Fixing an agent failure in the agent body when a skill owns the behaviour.
- ❌ A foundation skill created for a resource only one skill uses.
- ❌ A `../other-skill/` link, or a hand-kept gap or roadmap table next to the generated view.
- ❌ Designing a planned agent's full contract here; that is its follow-on change.
- ❌ Moving meaning into `references/` in batch B, or deleting content.

## Error matrix

| Failure mode | Expected handling |
|---|---|
| A batch would exceed the approved amount | `--max-cost-usd` stops it; trigger batches never exceed the D-12 run count; the rest waits for a new approval |
| `claude plugin eval` cannot see the skill in the temporary plugin | Stop; check the plugin layout against the seed suite; record in the evidence, no score |
| "After" is worse than "before" | Revert; the row says "reverted" with both scores |
| A rewritten description fires on a near-miss | A failed "after": adjust or revert; never delete the near-miss |
| An agent case fails because the agent overstepped its tools | Recorded failure; fix the agent's `tools:` or the owning skill; the least-privilege grader stays |
| A `.feature` changes after its eval case was written | The case follows the `.feature`; the `runs:` line names the scenario, so a stale case is found by name |
| `cross_skill_paths` finds a link to a resource only one skill uses | Turn it into a name citation of the owning skill ("see skill X") and keep the resource there; a resource two skills use moves to a foundation skill |
| A use case names a skill or agent that does not exist | Lint error; planned agents go in `served_by` only once built; until then the field is empty and `status` says so |
| A new area is needed | One line in `facets.yaml` in the same PR (D-20) |
| The owner does not approve the target structure | Phase 2 closes at the model and gap map (3.1–3.4, 3.6); 3.5 is re-shaped in a new change; evals stay deferred until the owner says the catalogue is systematised enough (D-5) |
| A docs finding sits in a file another change owns | Hand off to that change's `inputs/` |
| The `ANTHROPIC_API_KEY` secret arrives mid-EPIC | Later batches may run through `plugin-eval`; the row names where it ran |

## Risks / Trade-offs

- [Haiku triggers differently from the models people use] → pinned and recorded; a Sonnet
  spot-check is a named later decision (D-4).
- [Small samples (3 runs) are noisy] → thresholds and "not worse than before", not exact scores.
- [The use-case catalogue rots like any hand list] → it is checked (D-14) and every view is
  generated; a use case without a success guarantee fails the check.
- [The architecture track turns into building agents] → DEC-14 and the no-gos; a planned agent is
  one roster row.
- [Overlap with `define-ai-domains`] → that change owns the domain docs; this one owns use cases,
  the model and the roadmap; the mapping is written once (D-20).
- [A foundation skill over-triggers] → probes like any skill, and a description that names its
  loading skills.

## Open Questions

- **Q-1. Source of the model: closed** (YAGNI, 2026-10-27). The class view is a picture; no LinkML.
- **Q-2. The `partner` kind:** a fourth agent template `type`, or `delegated` with an interactive
  note? Default: decided in the follow-on agent-template change; the roster records the kind only.
- Phase approvals happen at run time (D-5); none blocks the PLAN.
