# Seed — align skillery with the sibling repos' delivery practice

**Secondary input. Never groomed or deleted.** The EPIC (`../proposal.md`) supersedes it.

## The owner's request (2026-11-08)

> check the practice of instructing and organising software development specified in the sibling
> projects rdf-persistence and mapping-workbench-v2, look at the architecture docs. I like what is
> done there. How far are the related skills in this repo? What needs to be done to align the
> practice? Shape a skillery update epic change.

## Sources read

`../mapping-workbench-v2` (MWB2) is the most developed version; rdf-persistence (rp) is its earlier
form (same sessions, roles, brief, stage loop and gates; no verification-and-validation layer, no
scenario sign-off, no acceptance demo, no traceability check).

| Source | What it holds |
|---|---|
| MWB2 `AGENTS.md` (334 lines) | The short form agents load: skill routing, spine, the strict upstream rule, sessions/roles/stage loop, authority, commit body, conventions |
| MWB2 `docs/modules/ROOT/pages/develop/index.adoc` | Developer runbook: model-driven method, where code goes, how work is organised, **verification and validation** (V-model table, validation activities, evidence), quality tiers, before-a-PR, durations table |
| MWB2 `develop/agents.adoc` | Shaping / epic / validation-review sessions; leader + members; 13 roles in 4 groups mapped to catalogue agents; the brief; the 13-step loop of a stage; gates; authority; habits |
| MWB2 `develop/testing.adoc` | 18-rule testing checklist every builder/deep-tester brief points to |
| MWB2 `develop/rdf-persistence.adoc`, `develop/mssdk.adoc` | Building on a co-developed dependency; "no workarounds, ever"; issue shape |
| MWB2 `architecture/index.adoc` + `decisions/l1…l3/` + `use-cases/` + `model.adoc` + `glossary.adoc` + `deployment.adoc` | Architecture v1: summary, scope, drivers DR-n (each with "Shapes: ADR-n"), C4 L1–L3 in Mermaid, key flows, decision table with Accepted / Partly accepted / Proposed and who decided, ADRs by C4 level with Confirmation, White/Blue use cases, generated model page |
| MWB2 `openspec/changes/archive/2026-11-05-architecture-v1/` | The architecture as a change: `inputs/seed-brief.md`, `evidence/{dry-run,spike-generation,hand-over}.md` |
| rp `architecture/index.adoc` | Consumer needs N-n in generic terms; the consumer's architecture maps its ADRs/use cases onto them |
| rp `architecture/open-decisions.adoc` | A dated decisions page: question, options weighed, decision, status |

## Gap analysis — practice element → skillery today

Legend: ✅ covered · ◐ partial · ✗ absent.

| # | Practice element (MWB2) | skillery today | |
|---|---|---|---|
| 1 | **Sessions**: shaping (one per initiative) / epic (one per EPIC) / validation review (one per iteration), each with what it leaves behind | `docs/practice/ai-coding/build-lifecycle.md` has PROJECT tier / EPIC tier; no session concept, no iteration review | ◐ |
| 2 | **Leader + members**: leader alone talks to the developer, decides, runs impact, re-runs gates, commits, files upstream issues, keeps the spine; members never commit, never talk to the developer | `guardrails` §5 subagent dispatch (brief, base report, four eyes); nothing on who commits or re-runs gates | ◐ |
| 3 | **Agent-team roles** (PM, architect, planner, UX, domain expert = person; modeller, builder/fixer, deep tester, tech writer; reviewer, verifier, cold reader; steward), each mapped to a catalogue agent + skill | `docs/practice/roles-and-raci.md` has the *human* roles (Work Shaper, Builder, Shipper…) and leaves "agent wrappers" as an open question | ◐ |
| 4 | **The brief**: change id + task, files, decisions made, out of scope, standing rules, report with make-target time + test count + *upstream findings*; "no brief possible → task not ready" | `guardrails` §5 + `references/subagent-reports.md` cover most; no standing-rules slot, no upstream-findings field, no "not ready" rule | ◐ |
| 5 | **Loop of a stage** (stage = tasks ending in one PR): upstream check → scenario sign-off → impact → build → check & commit → deep test → 5-lens review → decide (Rule of Divergence) → fix in batches → verify → document → accept → merge | `build-lifecycle.md` EPIC tier is a 7-step line (shape → plan → gate → BDD → TDD → review → archive); no stage, no decide/fix/verify/accept steps; no skill owns *execution* of a PLAN | ✗ |
| 6 | **Verification vs validation**: V-model table per artefact (EPIC, architecture, model, scenarios, code, docs, iteration); "agents verify, people validate" | Not stated anywhere; `dod-quality-gates.md` has gates only | ✗ |
| 7 | **Validation activities**: architecture walkthrough, spike, model validation (example instances + competency questions + domain-expert review), scenario sign-off, acceptance demo, cold reader, validation review | None as named activities; `formal-reasoning` mentions competency questions in another sense | ✗ |
| 8 | **`evidence/` in a change** (`walkthrough.md`, `spike-<topic>.md`, `acceptance-<stage>.md`) | `meaningfy` schema has `inputs/` only | ✗ |
| 9 | **Traceability check**: every spec scenario has a test; every feature test names its scenario | Golden thread (`epic-planning/references/golden-thread.md`) and `bdd-gherkin` trace to use cases; no verifier check | ◐ |
| 10 | **Co-developed upstream dependency rule**: no workarounds; stop → reproduce → search → file issue in a fixed shape (generic terms) → `blocked by <repo>#n` in tasks.md → resume after upstream merge + lock refresh; sibling clone read-only, work in a worktree; one repo per commit | Absent | ✗ |
| 11 | **Authority**: commit on consent by default; per-epic grant with fixed limits; another agent session is never approval | `guardrails` §1 decision bounds (generic) | ◐ |
| 12 | **Questions to the developer**: explain each term in one plain sentence, options, one recommended with reason; "choose what is best" → leader decides and records | `epic-planning` question rounds; no format rule | ◐ |
| 13 | **Testing checklist** handed to every builder (doubles, builders not dicts, isomorphic RDF asserts, parametrised rule tables, Hypothesis derandomised, no sleeps, containers once per session, traceability) | `cosmic-python` testing contract + `example-testing-patterns.md` cover much; no short checklist a brief can point to | ◐ |
| 14 | **Review**: 5 code lenses + UX lens + architecture-conformance lens that checks each ADR's Confirmation and hunts upstream workarounds | `meaningfy-code-review` L1–L5; L3 is cosmic-python structure only, not ADR conformance; no UX lens | ◐ |
| 15 | **Commit body**: Why / What (bullets, files) / Trace (`Refs: <change-id> <task>`) | `meaningfy-git-workflow`: body explains *why, not what*; no trace line | ◐ (conflict) |
| 16 | **Architecture docs**: index with summary, scope, drivers DR-n → ADRs, C4 L1–L3, key flows, decision table with status and who decided, references; ADRs by C4 level with Confirmation; White/Blue use cases; generated model page; glossary; deployment view | `architecture` skill has ADRs by C4 level, Confirmation, White/Blue use cases, glossary, deployment; drivers exist. Missing: the architecture index page shape, "Partly accepted" + who-decided status, driver→ADR "shapes" column, consumer-needs (N-n) mapping across co-developed repos, the walkthrough | ◐ |
| 17 | **Project docs layout**: `architecture/` + `develop/` (runbook index, agents, testing, one page per co-developed dependency); every page opens with common questions; durations table | `project-setup` templates: Diátaxis tree (`tutorials/ how-to/ reference/ adr/ requirements/`), one `system-context.adoc`; no runbook | ✗ |
| 18 | **AGENTS.md short form**: routing + spine + sessions/roles/stage loop + upstream rule + authority + commit body + project specifics | `project-setup` `AGENTS.md.tmpl` has routing + spine + subagent line | ◐ |
| 19 | **Habits**: GitNexus re-index, durations table from ordinary runs, `temp/` for temp files, docs open with questions | Partly in skillery's own AGENTS.md; not in templates | ◐ |

Summary: the *shaping* half (EPIC, PLAN, clarity gate, Gherkin, ADRs, use cases) is in good shape.
The *delivery* half — how a leader agent runs a team of members through a PLAN to a merged,
validated change — and the whole *validation* layer exist only in the two sibling repos.

## Already-settled facts not to re-litigate

- `roles-and-raci.md` left the agent-wrapper question open (archived `define-roles-and-raci`);
  this change answers it for the build plane only.
- "SDLC" names the EPIC-tier loop only (archived `define-meaningfy-lifecycle`).
- Bodies stay CLI-agnostic (`body_agnosticism` check).
