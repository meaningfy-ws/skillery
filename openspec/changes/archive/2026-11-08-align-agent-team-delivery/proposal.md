<!-- STATUS: EPIC shaped 2026-11-08 from the owner's request (inputs/seed.md, gap table G-1..G-19)
     and the owner's answers of the same day (inputs/qa.md); Q-1..Q-4 defaults accepted by the owner
     (round 2). Frozen. PLAN: design.md + tasks.md. -->

# EPIC: A lean agent team that delivers and validates an EPIC

**Parents:** the owner's request and answers of 2026-11-08 (`inputs/seed.md`, `inputs/qa.md`); the
practice in `mapping-workbench-v2` (`AGENTS.md`, `docs/.../develop/{index,agents,testing}.adoc`,
`docs/.../architecture/`) and its earlier, exercised form in `rdf-persistence`; the archived EPICs
`define-meaningfy-lifecycle` and `define-roles-and-raci`, whose open agent-wrapper question this
change answers for the build plane.

## Appetite

**LARGE.** One new capability (running an EPIC with a lean agent team and validating it) plus
several owners touched: `guardrails`, `bdd-gherkin`, `meaningfy-code-review`, `architecture`,
`conceptual-modelling`, `technical-writing`, `meaningfy-git-workflow`, `project-setup`, the
`meaningfy` schema and the build-plane docs. If the work adds catalogue agents beyond DEC-5, builds
tooling for traceability or evidence, or rewrites the shaping half (EPIC, PLAN, clarity gate), it
has overrun this appetite.

## Why

The sibling repos run a practice the owner likes and skillery does not carry: an agent leads a team
through each stage of a PLAN, work is *verified* by agents and *validated* by a person, and our own
co-developed libraries are never worked around. It exists only as two hand-written runbooks, so a
third project would copy and drift. Read critically (`inputs/qa.md`), the source is also heavier
than it needs to be: 13 roles that are about five agents, three overlapping assurance passes, up to
seven reviewers and two human interruptions on every stage whatever its size. skillery should carry
the practice once, leaner, with the same effect.

## Solution outline

**The team: two people, one lead, five working roles.**

| Who | Does | Plays it |
|---|---|---|
| **Developer** (person) | Product manager and owner: sets direction, decides, signs off scenarios, accepts the EPIC | — |
| **Domain expert** (person, when the model changes) | Validates the model | — |
| **Lead** (the main session) | The developer's assistant and the only one who talks to them: walks them through the process and each decision (options + a recommendation), records decisions, plans the stages, writes briefs, re-runs the gates, reads every diff, commits, files upstream issues, keeps the spine and the docs current, archives the change, runs the iteration review. Merges MWB2's leader, steward, product-owner and project-manager roles | main session |
| **Architect** (shaping) | C4, ADRs, use cases, the walkthrough | `system-architect` |
| **Planner** (shaping) | EPIC and PLAN to the clarity gate | `epic-planner` |
| **Builder** | One task, test-first: model, code, the docs it changed, an accepted fix, a spike | `implementer` |
| **Reviewer** | Read-only findings, lenses scaled to size (DEC-7) | `code-reviewer` |
| **Checker** | One fresh second pair of eyes per stage: brief and decisions met, traceability (the cold reader is a separate fresh agent, design DD-1) | fresh general-purpose |

Conditional briefs, not standing roles: an **adversarial tester** (a builder brief that writes only
tests; LARGE and up) and a **UX designer** (when screens change).

**The loop, six steps, scaled by appetite.**

1. **Prepare** — dependencies ready (DEC-8), impact checked; scenarios signed off once for the
   whole EPIC at the PLAN gate, re-signed only when they change.
2. **Build** — task by task; after each, the lead re-runs the gates, reads the diff and commits.
3. **Challenge** — reviewers (and the adversarial tester when in scope) in parallel.
4. **Decide and fix** — the lead records accepted findings in `design.md` first (Rule of
   Divergence), builders fix, the lead re-runs the gates.
5. **Check** — the checker's single pass.
6. **Merge** on green CI.

After the last stage: the **acceptance demo** (per EPIC, when it delivers or changes a use case),
then the lead archives. At the end of an iteration: the **validation review**.

| Appetite | Challenge | Check | Tester |
|---|---|---|---|
| TINY / SMALL | one review pass (L2 spec + tests, L3 structure incl. ADR conformance) | folded into the lead's re-run | — |
| MEDIUM | five lenses, read-only, parallel | checker | — |
| LARGE and up | five lenses (+ UX when screens changed) | checker | adversarial tester |

**Verification and validation.** "Agents verify, people validate" is stated once, with a V-model
table per artefact; each validation activity is owned by the skill of its artefact (DEC-3) and its
evidence goes to `evidence/` in the change.

**Neighbours sharpened, docs revised, projects projected.** The skills in *What Changes* gain only
what the loop calls on them for; `project-setup` renders a `develop/` runbook, the architecture
layout and a short `AGENTS.md`; the build-plane docs tell the session-and-stage story and point to
the owners.

**Proven on the source.** Acceptance: MWB2's `AGENTS.md` and `develop/agents.adoc` could be cut down
to MWB2 specifics plus pointers to skillery with nothing of the method lost, and the leaner loop
covers every check the 13-step loop made (a mapping table in the design).

## Key decisions

- **DEC-1**: a new skill, `epic-delivery` (bundle `meaningfy-building`), owns delivery: sessions,
  the team, the loop and its scaling, the brief's standing rules, authority, the question format,
  verification vs validation, the upstream rule. Reason: no skill owns executing a PLAN; rejected:
  splitting it over `guardrails` + `spec-stewardship`, or a doc only (docs carry no rules).
- **DEC-2**: MWB2 terms are generalised: "toolkit" → *our library*; "developer" stays *the
  developer*; make targets → *the project's gates*.
- **DEC-3**: one owner per validation activity — walkthrough and spike → `architecture`; model
  validation (example instances, competency questions, expert review) → `conceptual-modelling`;
  scenario sign-off and the traceability check → `bdd-gherkin`; cold reader → `technical-writing`;
  acceptance demo and validation review → `epic-delivery`.
- **DEC-4**: the `meaningfy` schema gains an optional `evidence/` folder, archived with the change;
  no new artifact type.
- **DEC-5**: no new catalogue agents. The lead is the main session; checker and tester are briefs
  whose shape lives in `epic-delivery`. Reason: the roles differ by brief, not by tools or model.
- **DEC-6**: projects own their habits and exceptions: AI attribution, the durations table, pages
  that open with questions, gate names. The templates leave a slot; the skills do not mandate them.
- **DEC-7**: the loop and the review fan-out scale with the EPIC's appetite (table above). The
  owner's answer (1), (4).
- **DEC-8**: dependencies split by ownership.
  - **Our libraries** (meaningfy-ws): no workarounds, ever. Stop the task, reproduce with the
    library alone, search issues, file one in the fixed shape (generic terms), mark the task
    `blocked by <repo>#n`, resume after the upstream merge and the lock refresh. Work in a worktree
    of the sibling clone; one repository per commit.
  - **External libraries**: a recorded decision in `design.md`, one of three: *contribute upstream*
    (a PR to the foreign project), *fork and release from the Meaningfy GitHub*, or *work around*
    locally — isolated in one adapter, marked as a shortcut with its limit, with an issue to remove
    it. The lead recommends; the developer decides; speed is a legitimate reason.
- **DEC-9**: the steps MWB2 added without running them (scenario sign-off, acceptance demo,
  validation review) ship marked **provisional**; their first real run (MWB2's first stage) is
  recorded and either confirms them or reshapes them.
- **DEC-10**: one second check per stage, not per member: the checker replaces MWB2's per-fixer
  verifier and satisfies `guardrails`' four-eyes rule. The lead's own re-run of the gates after
  every task stays (cheap, catches what reports claim).

## Owner-confirmed defaults (Q-1..Q-4, accepted 2026-11-08)

- **Q-1** commit body: adopt *Why / What / Trace* (`Refs: <change-id> <task>`) in
  `meaningfy-git-workflow`. *Default: adopt.*
- **Q-2** project docs: product archetype gets `architecture/` + `develop/`; the Diátaxis
  tutorials/how-to/reference pages stay for the user-facing docs. *Default: both, split by audience.*
- **Q-3** UX lens: optional, only when screens changed, LARGE and up. *Default: as in DEC-7.*
- **Q-4** skillery dogfoods the loop for its own EPICs. *Revised by the owner 2026-11-08 (design DD-9): in full, with a trial-run acceptance instead of a demo.*

## Rabbit-holes

- Rewriting the shaping half. EPIC, PLAN and clarity gate already match; add pointers only.
- Copying MWB2 prose. The skill states each rule once; explanation lives in the docs.
- Making the lead a catalogue agent. It is the main session; a file for it would duplicate the
  binding.
- Renaming the human roles in `roles-and-raci.md`. Map them to the team; do not rename them.

## No-gos

- No change to MWB2 or rdf-persistence here; aligning their `AGENTS.md` is their own follow-up.
- No new catalogue agents (DEC-5), no hooks, no CI tooling for traceability or evidence.
- No change to the sales, consulting or engagement planes.
- No mandate of project habits (DEC-6).

---

## What Changes

**Skills**
- New `skills/epic-delivery/` in `meaningfy-building`: SKILL.md (sessions, team, loop, scaling,
  authority, questions, V&V) + references: `team-and-briefs.md` (roles, brief templates for builder,
  tester, reviewer, checker), `stage-loop.md` (six steps, scaling table, mapping from MWB2's 13),
  `dependencies.md` (DEC-8, the issue shape), `verification-validation.md` (V-model table, evidence).
- `guardrails` §5: the brief's standing-rules slot and the upstream-findings report field; "no brief
  → task not ready"; the checker as the four-eyes pass.
- `bdd-gherkin`: scenario sign-off (once per EPIC) and the traceability check.
- `meaningfy-code-review`: L3 checks each ADR's Confirmation; the scaling hook (one combined pass
  for TINY/SMALL); optional UX lens.
- `cosmic-python`: `references/testing-checklist.md`, the short list a brief points to.
- `architecture`: the architecture index-page shape (summary, scope, drivers → ADRs, C4 L1–L3,
  key flows, decision table with status and who decided), the consumer-needs mapping between a
  library and its consumer, the walkthrough and the spike.
- `conceptual-modelling`: model validation (example instances, competency questions, expert review,
  kept as tests).
- `technical-writing`: the cold reader for how-to and tutorial pages.
- `meaningfy-git-workflow`: the commit body (Q-1).
- `project-setup`: `develop/` runbook templates (`index`, `agents`, `testing`, one page per
  co-developed library), the `architecture/` layout (Q-2), `AGENTS.md.tmpl` short form routing to
  `epic-delivery`.
- `openspec/schemas/meaningfy`: optional `evidence/` (DEC-4).
- Trigger probes for every description change; Gherkin under `tests/features/` for the
  agent-facing behaviour (team, scaling, upstream decision).

**Docs**
- New `docs/practice/ai-coding/working-with-agents.md`: the people's page — sessions, the team, the
  loop, what the developer decides and when; narrates, points to `epic-delivery`.
- `docs/practice/ai-coding/build-lifecycle.md`: EPIC tier retold as sessions and stages; diagram
  updated.
- `docs/practice/ai-coding/dod-quality-gates.md`: gates by appetite; validation points.
- `docs/practice/ai-coding/opsx-runbook.md`: where the loop sits among the `/opsx` verbs.
- `docs/practice/ai-coding/playbooks/`: work-shaper, architect, builder and shipper playbooks point
  to their place in the team; a developer playbook ("working with the lead") added.
- `docs/practice/roles-and-raci.md`: the agent-wrapper open question answered with the team table.
- `docs/development/workflows.md`: the build-tier pattern links the loop.
- Root `README.md` entry-point row; `CHANGELOG.md` line; `bundles.yaml`, `make bundles`,
  `make skill-inventory`.

## Capabilities

### New Capabilities
- `epic-delivery`: running a gated PLAN with a lean agent team to a merged, validated, archived
  change; scaling by appetite; verification vs validation; the dependency rule.

### Modified Capabilities
- The `meaningfy` schema (optional `evidence/`), and the capability specs of the skills above where
  they exist in `openspec/specs/`.

## Impact

- One new skill; nine skills, one schema and nine docs edited. MINOR release.
- New projects get the runbook and the short `AGENTS.md`; MWB2 and rdf-persistence can route to the
  skill and drop their copies.
- Per-stage cost drops for small work: a SMALL EPIC runs one build, one review pass and one human
  touch at each end, instead of the full loop.
