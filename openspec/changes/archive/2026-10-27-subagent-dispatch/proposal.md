# EPIC: Subagent dispatch and a qualitative appetite

> **Derives from:** the owner's seed and answers ([`inputs/B`](inputs/2026-10-27-B-shaping-qa.md))
> and the measured token usage of the add-devops-bundle session ([`inputs/A`](inputs/2026-10-27-A-session-usage.md)).
> Builds on the `guardrails` skill (decision bounds, output validation), the agent dispatch contract
> in [`docs/development/agent-template.md`](../../../docs/development/agent-template.md), and the
> `epic-planning` skill (the EPIC's appetite).
> **Status:** shaped; PLAN derived (`design.md`, `tasks.md`).
> **Re-shape log:** 2026-10-27 — owner review of the first draft: no budgets or stop rules, no
> model tiers, no new skill (the rules go into `guardrails`), no measurement script, generic
> principles not bound to any named agent, every agent gets a report section, the four-eyes check
> of the work is a separate subagent; the qualitative appetite scale joins this change.
> 2026-10-27 (later) — the owner: the EPIC template is the generic one every project receives, and
> it must speak plain, precise language instead of method jargon (DEC-12); drop the weeks from the
> vault's work-shape too; leave archived EPICs as written; the setup-cost note is out of scope.
> OPEN-1…3 closed.

## Appetite

**MEDIUM** (scale defined by DEC-10): one new section in an existing skill, one new scale in
another, a report section added to every catalogue agent with its lint check, and small edits to
the binding and templates. No new skill, agent or tool.

## Why

Subagents are worth having: they work in parallel and keep file dumps out of the coordinator's
context. But nothing in the catalogue tells the coordinator *when* to spawn one, *what* to give it,
*which* agent and model to pick, *what to send back*, or *how the work gets checked*. In the
add-devops-bundle session all 17 subagents were `general-purpose` on the most expensive model with
default tools, each paid ~50k tokens of setup before doing any work, and the open-ended "read
everything" agents grew to 300k+ context (file A). None inherited the coordinator's context — the
cost came from defaults and loosely defined tasks, not from forking.

Separately, the EPIC's appetite is written in weeks ("≈1–2 wks"). That measures a person's time; it
says little to an agent, which needs to know how deep and extensive the solution should be.

## Solution outline

**Part 1 — a dispatch discipline in `guardrails`.** Generic principles the coordinator applies to
any subagent, so each one costs as little as it can while still doing the job:

- **When** — a short spawn-or-not judgement before every dispatch.
- **How it starts** — fresh, from a written brief that is the subagent's whole world.
- **What it runs as** — the agent's declared model, else the caller's; something cheaper only when
  the task is clearly easy.
- **How far it goes** — as far as the task needs; the task definition, not a budget, bounds it.
- **What comes back** — a base report every subagent returns, extended per purpose.
- **How the work is checked** — by a second, independent subagent, when a unit of work is complete.

Each catalogue agent states, in its own definition, how it reports back; agent-specific nuance lives
there, not in the generic rules. The binding mandates the discipline, so the coordinator meets it at
the start of every session, in skillery and in projects set up by `project-setup`.

**Part 2 — a qualitative appetite.** The EPIC's appetite is one of six named sizes that say how deep
and extensive the solution should be, not how many days it takes.

Outcome: the same work with fewer, better-briefed, cheaper subagents; a coordinator whose context
grows by short reports, not transcripts; work checked by a second pair of eyes; EPICs sized in terms
an agent can act on.

## Key decisions

- **DEC-1: Fresh by default; fork only by exception.** A subagent starts from a brief, never a copy
  of the conversation. A fork (where the CLI offers one) is for a short task whose need is nuance
  from the conversation that would cost more to write down.
- **DEC-2: Spawn when it pays.** Spawn when the work is independent and can run in parallel, when it
  would flood the coordinator's context with reads, or when an unanchored second read is the point.
  Do the work inline when it is a lookup of a few calls, when steps depend on each other in sequence,
  or when parallel tasks would touch the same files. Every spawn pays a setup cost, so a fan-out of N
  pays it N times.
- **DEC-3: The brief is the subagent's whole world.** Goal and why; inputs as paths, not pasted
  content; what is already decided or ruled out — above all decisions made only in conversation;
  scope and no-gos; the report expected. When a written artifact already holds the context (a task,
  a design, a scenario), the brief points to it. A well-defined task is what keeps the subagent on
  course; there is no separate budget or stop rule.
- **DEC-4: One base report, extended per purpose.** Every subagent returns the same base: status
  (done / partly done / blocked / failed), the answer, evidence as pointers, what it did not check,
  open questions, side effects, recommendations for actions it was not allowed to take. Each purpose
  adds its own fields (exploring, researching, implementing, authoring, reviewing, verifying,
  test-running). Long material goes to a file; the report carries the path and a summary.
- **DEC-5: Four eyes on the work.** The coordinator reads the report to steer — it decides what to
  do next from it. The work itself is checked by a separate, fresh subagent that did not do it, once
  a coherent unit of work is complete (not after every step): against the task's spec and intention,
  best practice, known anti-patterns and the other quality concerns that apply. The checker reports
  in the same base report, extended for verifying.
- **DEC-6: Model.** A subagent runs on the model its agent definition declares; otherwise on the
  caller's model. The caller may choose a cheaper one when it judges the task clearly easy
  (mechanical, search). No tier table.
- **DEC-7: Prefer a fitting catalogue agent.** When a catalogue agent fits the task, use it — its
  tools, model and report are already set — rather than a general-purpose agent with defaults.
- **DEC-8: Home and reach.** The discipline is a new section of `guardrails` (it governs agent
  behaviour: what a subagent is given and what it may return), not a new skill and not an agent.
  `AGENTS.md` and the `AGENTS.md` template of `project-setup` mandate it in one line, so the
  coordinator meets it at session start. The rules name no particular agent.
- **DEC-9: Every agent says how it reports back.** Each catalogue agent carries a report section in
  its definition: the base report plus what matters for its job. The agent authoring standard
  requires the section and the lint check that already checks the dispatch contract checks it too.
- **DEC-10: The appetite is a named size, never a duration.** Six sizes, the same names the vault's
  work-shape already uses — TINY, SMALL, MEDIUM, LARGE, VERY LARGE, HUGE — each defined by how deep
  and how extensive the solution may be. The scale lives in `epic-planning`; the proposal templates
  cite it. A HUGE bet is split into several EPICs before it is planned. The vault's `work-shape`
  keeps the names and drops its week mapping. Archived EPICs stay as written.
- **DEC-12: The EPIC and PLAN templates speak plain language.** The templates and the schema
  instructions every project receives say what they mean in common, precise words: "cite the
  EPIC this derives from" rather than "golden thread", "the plan's reasoning" rather than
  "altitude", no lists of acronyms. The structure of the files and their headings do not change.
- **DEC-13: One EPIC template.** `epic-planning/references/epic-template.md` describes a retired
  layout (`EPIC.md` / `PLAN.md` under a CLI folder) that contradicts the skill and is linked from
  nowhere. Its good parts are ported into the schema's templates, then it is removed. The schema's
  templates are the one EPIC and PLAN template.
- **DEC-11: Both CLIs.** The rules are phrased so they hold on Claude Code and opencode; a mechanism
  one CLI lacks (a fork) is named through the dual-CLI mapping, not in the skill body.

## Rabbit-holes

- Token or dollar thresholds: models and prices change; the rules speak in behaviours (setup cost
  per spawn, context that grows with every read), not numbers.
- A report so detailed that writing it costs more than the work. The base must fit in about ten
  lines.
- Defining the six sizes by counting artifacts: a size is a judgement about depth and extent; examples
  illustrate it, they do not define it.
- Treating file A as a benchmark — it is one session.

## No-gos

- No new skill, agent or tool; no measurement script (agent monitoring is a separate system).
- No budgets, turn limits or stop rules for subagents.
- No model tier table and no new configuration keys.
- No runtime enforcement: no hook that blocks forks or rejects a brief.
- No change to either CLI's harness.
- No rules that name or special-case a particular agent; nuance lives in that agent's own definition.
- No durations in an EPIC's appetite.
- No edits to archived EPICs.
- No advice on trimming installed plugins to cut the setup cost.
- No renaming of headings or files in the templates; no rewrite of skill bodies beyond the sections
  named in *What Changes*.

## Open questions

None open. OPEN-1 (vault weeks: dropped), OPEN-2 (archives: untouched), OPEN-3 (setup-cost advice:
out of scope) were answered by the owner on 2026-10-27.

---

## What Changes

- `guardrails`: a new section, *Subagent dispatch* (DEC-1…7), with a reference file for the base
  report and its per-purpose extensions; description updated so it triggers when spawning
  subagents; the decision-bounds wording on "model tier" aligned with DEC-6.
- `epic-planning`: the appetite scale (DEC-10); `references/epic-template.md` removed (DEC-13).
- The `meaningfy` schema (source in `project-setup/assets/openspec-schema/`, rendered copy in
  `openspec/schemas/`): `schema.yaml` instructions and the `proposal`, `design`, `tasks` templates
  rewritten in plain language (DEC-12); the Appetite guidance cites the scale.
- `vault-conventions` (`references/kinds.md`) and the vault `work-shape` template: the appetite
  names without weeks.
- `docs/development/agent-template.md`: the report section joins the agent body layout (DEC-9).
- `agents/*.md`: each of the ten agents gains its report section.
- `tools/repo_lint`: the agent conformance check requires the report section; a test for it.
- `AGENTS.md` and `project-setup`'s `AGENTS.md` template: the one-line mandate.
- Trigger probes for the changed `guardrails` description; regenerated bundles and skill inventory;
  CHANGELOG.

## Capabilities

### New Capabilities
- `subagent-dispatch`: how a coordinator decides to spawn, briefs, picks the model for, receives the
  report of, and gets independent checking for any subagent, on both CLIs.

- `epic-shape`: the EPIC's appetite scale and the plain language of the EPIC and PLAN templates.

### Modified Capabilities
- `catalogue-governance`: an agent body also carries a `## Report` section, and the validator
  rejects one that does not.

## Impact

Skills `guardrails`, `epic-planning`, `project-setup` (schema and `AGENTS.md` template),
`vault-conventions`, `vault-setup`; all ten agents; docs `agent-template.md`; binding `AGENTS.md`;
`tools/repo_lint` (one check, its tests); bundles regenerated.
