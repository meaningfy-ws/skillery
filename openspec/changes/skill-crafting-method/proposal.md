# EPIC: Skill-crafting method — research the published methods, decide what skillery should stop doing

> **Golden thread.** Parents: [`inputs/2026-10-25-reference-dossier.md`](inputs/2026-10-25-reference-dossier.md)
> (the published methods for authoring and maintaining skills and agents, as found and read on
> 2026-10-25, with what each covers and does not) and the working method written the same day,
> [`docs/development-method.md`](../../../docs/development-method.md), which this EPIC treats as the
> **hypothesis to test**, not the answer.
> **Human's framing (verbatim):** "maybe skillery does too much, and we shall separate how that is done."
> **Siblings, as of 2026-10-26:** the three changes this EPIC was meant to feed have shipped without
> it: `single-source-distribution` and `agent-authoring-standard` in v3.0.0,
> `fix-accumulated-skill-defects` in v3.1.0 (all archived). Their decisions are now **inputs to the
> comparison**, not outputs of it (see the re-shape below).

## Appetite

**Small for the research, medium for whatever it decides — in two gated halves.** Half one is a
reading-and-comparison spike with a written decision (one to two weeks of part-time attention). Half
two implements that decision and is sized when the decision exists. If half one cannot reach a
decision, the EPIC closes with a recorded "not yet" rather than growing.

## Why

Skillery today is five things in one repo: a **catalogue** of skills and agents, the **method** for
writing them, the **tooling** that enforces the method (`repo_lint`, probes, ownership, inventory,
dual-CLI generation), the **spine** (OpenSpec instance + forked schema), and the **docs** written
for people (`docs/`). The method half was written in-house, before the ecosystem published its own: Anthropic's
authoring guidance and `skill-creator`, superpowers' `writing-skills` (TDD for skills), Basecamp's
`skill-crafting` and `agents-md`, the agentskills.io specification, Vercel's `skills` CLI, OWASP's
Agentic Skills Top 10, and a 2026 paper framing skills as software artefacts.

Two consequences follow. First, part of what skillery maintains may now be a dependency rather than
a possession — the same "reference, don't copy" rule it applies to superpowers for coding
disciplines. Second, the method that *is* Meaningfy's own (one owner per fact, bundles by role,
dual-CLI parity, the issue loop, the Definition of Done) is a reusable product in its own right:
other repos and other teams could install "how to run a clean catalogue" without installing the
catalogue. Today it is prose in `docs/`, usable only by reading.

Why now: `docs/development-method.md` was just written from a one-day reading. Before the three
new bundles are built *to* it, it should be checked against the published methods, and the
catalogue/method separation decided, so the bundles are built against the method we will keep.

## Solution outline

**Half one — research and decide.**

1. Read each method in the dossier in full (not the directory summaries): Anthropic's authoring
   guidance and `skill-creator`'s eval loop; superpowers `writing-skills`; Basecamp `skill-crafting`
   and `agents-md`; the agentskills.io spec; the paper. Record, per method, what it prescribes for:
   deciding a skill exists, descriptions/triggers, body structure and size, testing/evals,
   maintenance, repository organisation, agents, security.
2. Build a **coverage matrix**: rows = the sections of `docs/development-method.md`; columns = the
   methods; cells = *covers / partially / silent / contradicts*. Mark what only skillery has.
3. Decide, per row: **adopt** (cite the external method, delete our prose), **extend** (external base
   + Meaningfy delta, stated as a delta), or **own** (nothing external covers it). Decide the
   **separation**: whether the owned method becomes an installable skill/bundle, a second repo, or
   stays as docs inside skillery — against the criteria in DEC-4.
4. Write the decision as a `design.md` for half two and update the dossier.

**Half two — implement the decision** (sized after half one): typically a `skill-crafting` skill or
small bundle that any repo can install, the method doc reduced to Meaningfy deltas plus citations,
`skill-creator`/`writing-skills` declared as dependencies where adopted, and the lint/tooling that
belongs to the method moved to travel with it.

## Key decisions

- **DEC-1: The in-house method is a hypothesis, not a standard, until compared.**
  `docs/development-method.md` stays in force as the working rule meanwhile (siblings may build to
  it) but carries a status line pointing here.
- **DEC-2: "Reference, don't copy" applies to the method itself.** Where a published method covers a
  section as well as or better than ours, we cite it and delete our text. Owning prose is a cost
  (drift, review, teaching), not an asset.
- **DEC-3: Comparison is per section, not wholesale.** No method in the dossier covers repo-level
  governance (ownership, bundles, dual-CLI, issue loop, DoD); several cover authoring better than we
  do. The outcome is expected to be mixed, and the matrix makes that visible.
- **DEC-4: Separation criteria.** The owned method is separated from the catalogue when **all** hold:
  it has a second consumer (a repo or team that is not skillery); it can be installed without the
  catalogue; its tooling can run without skillery's tree layout; and it changes on a different
  cadence than the catalogue. If any fails, it stays as docs inside skillery and the EPIC says
  so.
- **DEC-5: Security guidance is adopted, not written.** OWASP's Agentic Skills Top 10 is the
  reference for supply-chain rules; skillery keeps only the operational line (read in full, hash-pin,
  provenance note, least privilege) and cites the rest.
- **DEC-6: Tooling follows the method it enforces.** If a lint rule exists only to enforce a method
  section, it moves with that section (into the method skill, or out when the section is adopted
  from outside and the external tool covers it). Tooling that enforces the *catalogue* (bundle
  membership, dual-CLI parity, inventory freshness) stays.
- **DEC-7: Agents are in scope for the research, out of scope for the decision.** The matrix has an
  agents row because the published methods are thin there; the agent standard itself is
  `agent-authoring-standard`'s decision, informed by this EPIC's findings.
- **DEC-8: The research is done by reading primary files, not directory listings.** Several
  directory sites paraphrase skills loosely; the dossier records where a summary could not be
  verified against the source and half one closes those gaps first.

### Re-shape of 2026-10-26 (logged event)

The siblings shipped first, so their outcomes enter the comparison as part of what skillery has:

- **DEC-9: The shipped method additions are rows of the matrix.** The agent authoring standard
  (`spec/agent-template.md`, the `agent_*` lint checks), the reuse-or-precision posture rule (R / C /
  P, in `docs/development-method.md` §3), near-miss trigger probes (`near_miss_of`), the vault
  `skill-change` note as defect intake, and the "AGENTS.md canonical, CLAUDE.md a pointer, never a
  symlink" rule are compared like every other section.
- **DEC-10: Dossier question 2 is answered.** Skillery now renders a `bundles/` symlink tree per
  bundle (`single-source-distribution`), the layout Basecamp uses; half one records the comparison
  and does not reopen it.
- **DEC-12 (2026-10-26, half-two PLAN): two scoped exceptions to the no-gos.** (a) Three catalogue
  skills move a top-level `version:` key under `metadata` (`design.md` H-9), because the adopted
  specification rejects the top-level key. (b) The owner chose an on-demand `claude plugin eval`
  workflow with a seed suite under `evals/` (D-3). It configures the documented tool and builds no
  harness of our own.
- **DEC-11: Half one writes `design.md` only.** It holds the matrix, the decisions and the separation
  verdict; `tasks.md` and the spec deltas come when half two is sized.

## Rabbit-holes

- **Do not adopt a framework wholesale** (BMAD, OpenAgents Control, a "skills operating system").
  The question is which *sections* to adopt, not which brand.
- **Do not rewrite `docs/development-method.md` during half one.** It is the thing being measured;
  changing it mid-comparison invalidates the matrix.
- **Do not build evals infrastructure.** If `skill-creator`'s eval loop is adopted, it is used as is;
  a Meaningfy eval harness is a separate, later decision. The on-demand workflow of DEC-12 (b) only
  configures `claude plugin eval`.
- **Do not generalise beyond skills and agents** into "how Meaningfy runs any repo"; the engineering
  standards have their own home (`docs/engineering-standards/`).
- **Do not settle the second-repo question by taste.** DEC-4's four criteria decide it; record each.

## No-gos

- **No changes to catalogue skills or agents**, except the three `version:` keys (DEC-12 a). The new
  bundles and description rewrites are their own changes.
- **No new method text in half one** beyond the status line and the dossier.
- **No tooling changes in half one.**
- **No adoption of a skill from a directory without reading it in full** (DEC-8, DEC-5).
- **No `tasks.md` and no spec deltas in half one** (DEC-11); `design.md` is half one's output.

---

## What Changes

**Half one (this round):**
- `inputs/2026-10-25-reference-dossier.md` becomes the living research record (sources, what each
  covers, verification status).
- `docs/development-method.md` gains a one-line status pointing to this change.
- Output: a `design.md` holding the coverage matrix, the per-section adopt/extend/own decision, and
  the separation verdict against DEC-4.

**Half two (sized by `design.md`), expected shape:**
- A `skill-crafting` skill (or small bundle) carrying the owned method as installable, with its
  lint/probes travelling with it; or, if separation fails DEC-4, the same content kept as docs.
- `docs/development-method.md` reduced to Meaningfy deltas + citations.
- Declared dependencies on the adopted external methods (`skill-creator`, superpowers
  `writing-skills`, OWASP AST10) in `docs/environment/`.
- Possible removal of in-house prose/tooling superseded by an adopted method (each removal recorded
  as a REMOVED delta with Migration).
- *(Inherited 2026-10-26 from `single-source-distribution` R3:)* decide the merge of
  `CONTRIBUTING.md` + `spec/CREATING_SKILLS.md` into one authoring guide.

## Capabilities

### New Capabilities

- `skill-crafting-method`: the normative statement of which parts of the skill/agent development
  method are owned, which are adopted by reference, and how the owned part is distributed.

### Modified Capabilities

- `catalogue-governance`: once half two lands, the governance doc cites the method rather than
  carrying authoring rules.
- Possibly `agent-authoring` (via `agent-authoring-standard`), fed by the matrix's agents row.

## Impact

- **Half one:** `openspec/changes/skill-crafting-method/`, one line in `docs/development-method.md`.
- **Half two:** `skills/` (+1), `spec/`, `docs/development-method.md`, `docs/environment/`,
  `tools/repo_lint` (moved or removed rules), `bundles.yaml`/`marketplace.json`, README.
- **Siblings:** none blocked; the three siblings have shipped (DEC-9). `add-devops-bundle` and
  `add-sales-bundle` are built to whichever method half one keeps.
- **Risk named:** the comparison concludes that most authoring guidance is better taken from outside,
  which would make several in-house `spec/` files redundant. That is the intended outcome if true,
  and it is a removal, not a rewrite.
