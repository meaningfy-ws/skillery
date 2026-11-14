# EPIC: One orchestrator — Meaningfy's framework, pointing to skills kept elsewhere

## Appetite

LARGE, the owner's choice. The whole-catalogue reach (DEC-3) fits it only because the orchestrator
routes and cuts nothing outside the sales text of DEC-9. If its rows for the engineering skills
need more than routing, that part goes to `lean-skills`, not into a larger appetite here.

## Why

A second source of skills, `wondelai/skills`, covers ground skillery lacks: negotiation, offers,
positioning, customer discovery, marketing, strategy and management. An installed skill is only
useful if something tells the agent for which goal to use it, when, and which Meaningfy preference
stands above it. Today nothing does, for this source or for the book rule sets. The owner wants
skillery to stay the framework (preferences, workflows, guardrails and checks) and to point to
skills kept elsewhere, each used for a purpose. The study of the source is in
[`inputs/findings-wondelai-skills-2026-11-14.md`](inputs/findings-wondelai-skills-2026-11-14.md);
the questions and answers are in
[`inputs/elicitation-2026-11-14.md`](inputs/elicitation-2026-11-14.md).

Golden-thread parents: the living specs `external-dependency-register`, `catalogue-architecture`
and `sales-method-ownership`.

## Solution outline

1. **One orchestrator skill.** For a goal ("prepare a negotiation", "position a product", "review
   this strategy", "refactor untested code") it names the Meaningfy skill that owns the work, the
   external skill that helps, when to use it and how, and the Meaningfy preference that overrides
   it. It covers the whole catalogue: every Meaningfy skill, the eight book rule sets, and the
   skills adopted from the second source.
2. **A second dependency.** Sixteen skills are taken from a Meaningfy fork of `wondelai/skills`,
   one by one, and installed with the bundle whose role uses them.
3. **Overrides stated and proven.** Where an external skill is known to conflict with a Meaningfy
   rule, the orchestrator says which rule wins, and a scenario proves it.
4. **Less of our own restated text.** The sales skills stop restating the two authors the second
   source covers, and point instead.

**It succeeds when** for each named goal an agent reaches the right skill through the orchestrator
and says what to install when it is missing; when on each known conflict the Meaningfy rule still
wins with the external skill loaded; and when the trigger probes show our sales and coaching
skills still fire on their own prompts with the external skills installed.

**It fails when** the orchestrator is a second copy of what each skill's description already says
and the two drift apart; when it is loaded on every task; when an agent follows an external skill
against a Meaningfy rule (a discount, a value-based price, a guarantee without the owner's yes);
or when it names a skill that is not installed and says nothing.

## Key decisions

- **DEC-1**: External skills complete, extend and strengthen skillery; they are not rivals of each
  other or of ours. Skillery keeps the framework and points to them for a purpose. The owner's
  words: "we keep the meaningfy framework and point to skills elsewhere to be used for a purpose to
  achieve some goals". Rejected: sorting the second source against the book rule sets as
  competitors, which the study did.
- **DEC-2**: The pointers live in one central orchestrator skill. Rejected: a table in each owning
  skill (the agent's recommendation); one routing skill per bundle.
- **DEC-3**: When this EPIC is done the orchestrator covers the whole catalogue, engineering
  included. It routes only. Rejected: commercial goals now and engineering later; a commercial
  orchestrator for good.
- **DEC-4**: An agent reaches the orchestrator from a one-line pointer in the Meaningfy skills and
  agents that have external help, and through its own description. Rejected: an instruction in
  `AGENTS.md` for every session; preloading it in the commercial agents.
- **DEC-5**: Skillery depends on a Meaningfy fork of `wondelai/skills`, as it does for the book
  rule sets. The owner creates the fork. Skills are installed one by one, never as a collection and
  never a composite. Rejected: upstream at a pinned commit; upstream head.
- **DEC-6**: Sixteen skills are adopted. Sales and positioning: `negotiation`,
  `hundred-million-offers`, `mom-test`, `obviously-awesome`, `jobs-to-be-done`,
  `influence-psychology`, `predictable-revenue`, `monetizing-innovation`. Marketing and messaging:
  `storybrand-messaging`, `one-page-marketing`, `made-to-stick`, `crossing-the-chasm`,
  `scorecard-marketing`. Strategy and management: `good-strategy-bad-strategy`,
  `high-output-management`. Documentation: `technical-documentation`. Rejected: only the two that
  overlap our sales text; stopping at sales and positioning.
- **DEC-7**: A Meaningfy preference always wins. The known conflicts each get a stated override:
  no discount, over their concessions and fast-action discount; the effort-based price frame of
  `estimation`, over value-based pricing; our qualification scheme and outreach rules, over theirs;
  a guarantee only after the owner's yes; British spelling, no em dash and no contractions in
  binding text, over their documentation style. Rejected: leaving out every skill that conflicts.
- **DEC-8**: Their fourteen composite skills are not installed. They keep their own tracker files
  and ask at every decision point, against the spine and the single question round; skillery's own
  workflows do that job. Rejected: installing them beside ours.
- **DEC-9**: The sales skills stop restating the two authors that `negotiation` and
  `hundred-million-offers` cover (about 3 to 4 KB) and point to them. Nothing else of ours is cut
  here.
- **DEC-10**: Marketing and management get no new Meaningfy skill. The orchestrator is their home
  until Meaningfy has rules of its own for them. The agent's proposal. Rejected: a thin marketing
  skill and a thin management skill that would hold only pointers.
- **DEC-11**: The orchestrator obeys the lean budget: 24 KB of prose at most, references included,
  with a body near 6 KB and one reference per domain, opened only for that domain. Rejected: one
  growing table.
- **DEC-12**: Two practices of the second source are used: every pointer to a reference says when
  to open it and what it adds; every named external skill has a fallback sentence that offers the
  install command and, if declined, says the agent works without it. Rejected: bare links; silence
  when a dependency is missing.
- **DEC-13**: An external skill is registered against the bundle whose role uses it and installed
  with that bundle, not for everyone. Each installed skill costs its description in every call.
  Rejected: all sixteen in every repository.
- **DEC-14**: Proof of done is the three checks under "It succeeds when". The install on opencode
  is not a proof item; until it is tried, it is a recorded gap in the dual-CLI documents.
- **DEC-15**: The other skills of the second source (product, UX, visual design, consumer growth)
  are not adopted here. They are sorted again under DEC-1 when a role needs them.
- **DEC-16**: Before the PLAN is derived, the overlap with `lean-skills` is settled by the owner
  from the side-by-side in the elicitation record. Both EPICs route to the book rule sets today.

## Rabbit-holes

- **A second inventory.** `docs/skill-inventory.md` is generated from the skills' own frontmatter.
  An orchestrator that lists every skill by hand is a second copy that drifts. Whether its
  catalogue rows are generated, and only the goals, the external pointers and the overrides are
  written, is left to the PLAN.
- **A description that fires on everything.** A skill whose job is "which skill for this goal" can
  claim every prompt. Its description needs probes against every neighbour.
- **Reading depth.** The study read most external skills by headings only. A row is written only
  after the skill and its references were read in full; a conflict found then becomes an override
  or drops the skill.
- **The name.** "Navigator" is a mod here. The skill's name is left to the PLAN.
- **Overrides in one line against a 20 KB body.** A loaded external skill can outweigh a short
  override. The owner accepted this risk; the scenarios of DEC-7 show whether it bites.
- **No Meaningfy preference yet** for marketing and management. The orchestrator must not invent
  one; it points, and says no house rule exists.
- **The fork does not exist yet.** Until it does, nothing can be registered or installed.
- Left vague on purpose: the goal list, the row format, the reference split by domain, and how a
  bundle declares its external skills.

## No-gos

- No external text copied into skillery.
- No collection, plugin or composite of the second source installed (DEC-5, DEC-8).
- No new skill besides the orchestrator, and no new agent (DEC-10).
- No shrinking of any skill beyond DEC-9, and no change to the lean standard; both are
  `lean-skills`.
- No change to which book rule sets are relied on.
- No change to what a sales skill owns, and no change to Meaningfy's sales rules.
- No rule in `AGENTS.md` that makes every session load the orchestrator (DEC-4).
- No hook, no mod, no change to the navigator.
- No fork created by an agent; no legal review of the book summaries (accepted risk).

---

## What Changes

- A new skill, the orchestrator, in the `meaningfy-core` bundle, with its references by domain,
  trigger probes and Quick Start.
- `dependencies.yaml` registers the Meaningfy fork of `wondelai/skills` with the sixteen skills of
  DEC-6, each against a bundle; the setup documents for both CLIs gain the install steps.
- The Meaningfy skills and agents that have external help gain a one-line pointer to the
  orchestrator.
- `sales-conversations` and `sales-qualification` lose their restatement of the two authors
  (DEC-9).
- `technical-writing` routes to `technical-documentation` with its three overrides.
- Agent scenarios under `tests/features/` for routing and for each override.

## Capabilities

### New Capabilities

- `skill-orchestration`: the routing of a goal to the Meaningfy skill and the external skill that
  serve it, the stated overrides, and the behaviour when a dependency is missing.

### Modified Capabilities

- `external-dependency-register`: a second registered source, installed per skill from a Meaningfy
  fork and tied to a bundle.
- `sales-method-ownership`: the sales skills point to external method skills instead of restating
  them. To confirm when the PLAN is derived, together with `catalogue-architecture`.

## Impact

- One new skill; `dependencies.yaml`; `bundles.yaml` if a bundle must declare its external skills;
  the generated `bundles/` tree, inventory and dependency tables.
- Skills `sales-conversations`, `sales-qualification`, `technical-writing`, and each skill and
  agent that gains the pointer.
- Every installer gains install steps for the external skills of its bundles, on both CLIs.
- A new repository to keep: the Meaningfy fork of `wondelai/skills`.
- `lean-skills` (PR #236, not merged): its routing of agents to the book rule sets overlaps
  DEC-3.
