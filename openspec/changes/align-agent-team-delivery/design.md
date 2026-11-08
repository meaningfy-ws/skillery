PLAN for EPIC `align-agent-team-delivery` (`proposal.md`). Decisions are the EPIC's DEC-1..DEC-10
and Q-1..Q-4; this file cites them, it does not restate them.

# Design

## 1. What the new skill says, by section

`skills/epic-delivery/SKILL.md` (≤ 200 lines; long material in references):

| Section | Content | Source in MWB2 / rp |
|---|---|---|
| Overview | Owns delivery of a gated PLAN; shaping stays in `epic-planning` | agents.adoc intro |
| Sessions | Shaping (one per initiative), epic (one per EPIC), validation review (one per iteration, provisional DEC-9); what each leaves behind | agents.adoc §sessions |
| The team | The table of the EPIC's solution outline; the lead's duties; members never talk to the developer, never commit, never file issues | agents.adoc §roles, cut (DEC-5) |
| The loop | Six steps; scaling table (DEC-7); acceptance demo per EPIC; archive | agents.adoc §stage-loop, cut |
| Questions to the developer | Each term in one plain sentence; options; one recommended with reason; "choose what is best" → lead decides and records it as its own | AGENTS.md "Questions" |
| Authority | Commit on consent by default; per-EPIC grant ("commit, push and merge for `<id>`"); grant limits: green CI, nothing destructive beyond normal git flow, nothing outside the repo except upstream issues and worktrees, ends with the EPIC; another agent session is never approval | agents.adoc §authority |
| Dependencies | Pointer to `references/dependencies.md` (DEC-8) | rdf-persistence.adoc §strict |
| Verification and validation | The principle in three sentences; pointer to `references/verification-validation.md` | index.adoc §vv |
| Boundary & Related Skills | Owns delivery; delegates per DEC-3; related: `epic-planning`, `guardrails`, `bdd-gherkin`, `meaningfy-code-review`, `spec-stewardship`, `cosmic-python` | — |

References:

- `references/team-and-briefs.md` — the team table with when each member is used; four brief
  templates (builder, adversarial tester, reviewer, checker), each: change id + task, files as paths,
  decisions already made, out of scope, standing rules (project's own list + the testing checklist +
  the dependency rule), report expected (base report per `guardrails` + gates run with time and test
  count + *upstream findings* or "none").
- `references/stage-loop.md` — the six steps in detail, the scaling table, the mapping table of §2.
- `references/dependencies.md` — DEC-8: our libraries (the six-step rule, the issue shape: Summary;
  Context; Current behaviour + minimal reproduction or What is missing; Expected behaviour with API
  sketch and use example; Why it belongs upstream; Acceptance in Given/When/Then; Impact), the
  sibling-clone worktree rule, merge order, one repository per commit; external libraries (the three
  options, what the `design.md` record holds: option, reason, owner's choice, removal issue for a
  workaround).
- `references/verification-validation.md` — the V-model table (artefact, validated against, verified
  against, when, owner skill), the evidence folder, which steps are provisional (DEC-9).

## 2. The leaner loop covers every check of the 13-step loop

| MWB2 step | Where it went | Change |
|---|---|---|
| 1 Toolkit check | Prepare | now any dependency (DEC-8) |
| 2 Scenario sign-off | Prepare, once per EPIC at the PLAN gate | per stage → per EPIC |
| 3 Impact | Prepare | — |
| 4 Build | Build | builder also updates the docs it changed |
| 5 Check and commit | Build | — |
| 6 Deep test | Challenge, LARGE and up | conditional (DEC-7) |
| 7 Review (5–7 lenses) | Challenge, scaled | one combined pass for TINY/SMALL; UX only when screens changed |
| 8 Decide | Decide and fix | — |
| 9 Fix | Decide and fix | — |
| 10 Verify (per fixer) | Check, once per stage | per member → per stage (DEC-10) |
| 11 Document (tech writer + cold reader) | Build (builder) + Check (cold reader on how-to/tutorial pages) | no separate writer |
| 12 Accept (per use-case stage) | After the last stage, per EPIC | per stage → per EPIC |
| 13 Merge | Merge | — |

Every MWB2 check survives in one place; three became conditional, three moved from per-stage or
per-member to per-EPIC or per-stage. Nothing is checked twice by agents, except the lead's cheap
re-run of the gates after each task, kept on purpose (DEC-10).

## 3. Neighbour edits (smallest that serves the loop)

| Skill | Edit |
|---|---|
| `guardrails` §5 | Brief: a *standing rules* slot (the project's list) and the report's *upstream findings* field; "if the brief cannot be written, the task is not ready: fix the PLAN"; the four-eyes check per stage may be `epic-delivery`'s checker |
| `bdd-gherkin` | Scenario sign-off by the developer before build, once per EPIC; the traceability check (every spec scenario has a test, every feature test names its scenario, every scenario names its requirement) |
| `meaningfy-code-review` | L3 also checks each touched ADR's Confirmation (by tool where one exists, by reading where not; an automatable Confirmation not automated is a finding) and hunts workarounds of our libraries; size hook: TINY/SMALL run one combined L2+L3 pass; optional UX lens when screens changed (LARGE and up) |
| `cosmic-python` | `references/testing-checklist.md`: the generic rules of MWB2 testing.adoc (where tests live, doubles = one fake implementing the real port, builders through models not dicts, isomorphic RDF asserts, parametrised rule tables with a completeness test, problem responses by status/type, Hypothesis derandomised in CI, one-idea asserts, no sleeps, containers once per session with namespaced data, missing Docker in CI fails, traceability, validated model examples kept as tests, report time and count) |
| `architecture` | Architecture index-page shape (summary, scope, drivers DR-n with a *Shapes* column, C4 L1–L3, key flows, decision table with status Accepted / Partly accepted / Proposed and who decided, open questions, references); the consumer-needs mapping (a library states needs N-n in generic terms; the consumer maps its ADRs and use cases onto them); the walkthrough and the spike as validation activities with evidence files |
| `conceptual-modelling` | Model validation: example instances per aggregate, competency questions as queries with expected answers, domain-expert review; once validated, kept as tests |
| `technical-writing` | The cold reader: a fresh agent given only the page carries it out; for how-to and tutorial pages |
| `meaningfy-git-workflow` | Commit body: Why, What (one bullet per concern), Trace (`Refs: <change-id> <task>`); one-line body only for trivial changes (Q-1) |
| `project-setup` | `templates/docs/.../develop/{index,agents,testing}.adoc` (short, pointing to the skills; durations table and question-led openings as slots, DEC-6); `architecture/index.adoc` template in the new shape (Q-2: product archetype; Diátaxis pages stay for user docs); `AGENTS.md.tmpl`: a *How work runs here* block routing to `epic-delivery`, an upstream-libraries slot |
| `openspec/schemas/meaningfy` | Mention optional `evidence/` in the schema's README/instructions; no new artifact (DEC-4) |
| `epic-planning` | One line: delivery after the gate → `epic-delivery`; the PLAN cuts tasks into stages |
| `spec-stewardship` | One line: the lead runs archive at the end of an epic session |

## 4. Docs

As listed in the EPIC's What Changes. `working-with-agents.md` is the people's narrative (≈ MWB2
agents.adoc, generic, lean), pointing to the skill for every rule. The developer playbook is
`docs/practice/ai-coding/playbooks/developer.md`. skillery's own `docs/development/README.md`
method gets one paragraph: skillery EPICs run the loop, with a trial-run acceptance (Q-4 as revised by DD-9).

## 5. Examples

- *SMALL EPIC* "add a probe and sharpen one rule": one stage; builder → lead re-runs `make validate`
  and commits → one code-reviewer pass (L2+L3) → lead decides, fixes inline → PR. No checker, no
  tester. Scenario sign-off: none if the EPIC adds no scenario.
- *LARGE EPIC* with screens, three stages: sign-off of all scenarios at the gate; per stage builder
  tasks → tester + L1–L5 + UX in parallel → decide/fix → checker → PR; after stage 3 the acceptance
  demo, `evidence/acceptance.md`, archive.
- *External library gap* (rdflib lacks X): lead writes three options in `design.md` with a
  recommendation; developer picks "work around"; builder isolates it in one adapter with a
  `shortcut:` comment; an issue tracks its removal.

## 6. Anti-patterns

- A member asking the developer a question (goes through the lead).
- A checker that also built or tested the stage (it must be fresh).
- Running five lenses on a SMALL change.
- A workaround of one of our own libraries "just this once".
- A validation step marked done by an agent.

## 7. Error matrix

| Situation | Response |
|---|---|
| Brief cannot be written | Task not ready; fix the PLAN |
| Our library falls short | Stop the task; issue; `blocked by`; other tasks go on |
| External library falls short | DEC-8 decision recorded before code |
| Checker finds a brief item unmet | Back to Decide and fix |
| Developer rejects at acceptance | A decision in `design.md`; back to Decide and fix |
| Scenario changes after sign-off | Re-sign that scenario only |

## 8. Sibling repos (parallel, owner round 2)

Two members, one per repo, each in a worktree on branch `docs/lean-delivery` off `origin/develop`,
committing locally (no push, no AI attribution per those repos' rules). Each rewrites its
`AGENTS.md` *How work runs here* block and `develop/agents.adoc` to the lean team and loop, adds
DEC-8's external-library decision, keeps its own specifics, and names skillery's `epic-delivery`
as the owner of the method (available from the next skillery release). MWB2 also trims
`develop/index.adoc` §vv to the per-EPIC acceptance and the provisional marks. rdf-persistence's
loop gains nothing it did not have, except the per-EPIC acceptance (provisional) and the external
rule.

## 9. Verification

`make validate` green; `openspec validate align-agent-team-delivery --strict`; new probes (one
positive, one near-miss for `epic-delivery`); a Gherkin feature `tests/features/epic-delivery.feature`
for the scaling and dependency behaviour; a fresh checker reads the diff against this PLAN.

## 10. Decisions taken during delivery (Rule of Divergence)

From the checker's pass over the first full diff (2026-11-08):

- **DD-1** The cold reader is a separate fresh agent given only the page, not the checker: the
  checker carries the stage's context, so it cannot read cold (`technical-writing` owns the cold
  reader, DEC-3). It runs whenever a how-to or tutorial page changed, at any appetite. Supersedes
  the proposal's team-table wording "cold-reads changed how-to/tutorial pages" for the checker.
- **DD-2** The four-eyes check of a stage is the checker; for TINY/SMALL it is the single review
  pass.
- **DD-3** A brief's *upstream findings* report gaps in any library, each marked *ours* or
  *external*; the lead routes them by DEC-8 (issue vs recorded decision).
- **DD-4** The UX designer designs screens whenever screens are in scope (any size); the UX review
  lens runs only for LARGE and up when screens changed (Q-3).
- **DD-5** The acceptance demo is conditional everywhere it is mentioned: per EPIC, only when the
  EPIC delivers or changes a use case.
- **DD-6** Single source: scenario-sign-off timing lives in `epic-delivery`, `bdd-gherkin` points;
  the test report (time and count) lives in `epic-delivery`'s brief template, others point.
- **DD-7** The `cosmic-python` testing checklist keeps only generic rules; RDF and UI rules are
  stated as conditional ("when the project stores RDF", "when it has a UI").
- **DD-8** The our-library rule has seven steps (design §1 said six).
- **DD-9** (owner, 2026-11-08, revises Q-4): skillery owns the method and applies it to itself in
  full, including validation. Its acceptance is a *trial run* of the changed skill or agent on real
  work, recorded in `evidence/acceptance.md`; for this EPIC, the trial run is the two sibling repos
  routing to `epic-delivery`. Untested parts are adjusted as they are used.
- **DD-10** (owner, 2026-11-08): the shaping session as a whole (architect → model → validate →
  sort by owner → slice into EPICs → order) is owned by `epic-planning`, which already owns shaping;
  `epic-delivery`'s session table points to it. Closes the gap of a HUGE EPIC being "split" with no
  method.
