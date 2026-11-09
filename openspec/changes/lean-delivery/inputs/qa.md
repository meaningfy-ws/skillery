# lean-delivery — questions and answers (secondary; never groomed)

Rounds 1–2 of session skillery-8f (D-a, D-b) are in `seed.md`. This file starts at the planner's
round 1 (2026-11-09). Each question: terms explained, options, one recommended with its reason.

Owner constraint (2026-11-09): every rule is repository-independent; skillery and rdf-persistence
(targets, hooks, DEC numbers, tool choices) are evidence only.

## Round 1 (asked 2026-11-09; answers below the questions)

**Scope**

- **Q-1 Docs split.** "Docs the change makes false" are pages a change contradicts; the
  "documentation workflow" is writing architecture pages and user, install and developer manuals,
  validated by a cold reader (a fresh agent that only gets the page). (a) This EPIC: builder fixes
  false docs, L2 checks agreement; the documentation workflow is a sibling EPIC owned by
  `technical-writing`. (b) Both here (LARGE). (c) Agreement only, no sibling. **Recommended (a)**:
  the recorded failure (FC-7) is agreement; the workflow is a new capability with its own owner.
- **Q-7 Appetite.** (a) MEDIUM, one EPIC, docs workflow as sibling. (b) LARGE, one EPIC with the
  docs workflow. (c) Split into "check once" (DEC-3..DEC-7, DEC-12) and "validation step + agent
  tools" (DEC-8, DEC-11). **Recommended (a)**: one capability (the cost of delivery); a split would
  edit the same four `epic-delivery` files twice.

**Delivery loop**

- **Q-10 Lead's per-task re-run.** (a) Nothing per task; diff + report only, re-run on the named
  triggers (D-b). (b) The project's fast quality gate (~45 s in rdf-persistence) plus the diff
  (rdf-persistence DEC-6). **Recommended (a)**: the fast gate is the part a builder's report can
  least plausibly fake (exit codes are in the report), the full gates and CI at the stage PR bound
  the risk, and (b) keeps a per-task double run the evidence counts as waste. Choose (b) if a
  wrong report already slipped through in practice.
- **Q-8 Review set at TINY/SMALL.** D-a fixes the cadence (once per stage PR). (a) Keep the
  appetite's set: TINY/SMALL one combined pass (L2+L3), MEDIUM+ five lenses. (b) Five lenses at
  every appetite. **Recommended (a)**: D-a was about when, not how many; (b) raises cost for small work.
- **Q-6 The `verify` phase.** A phase is a step navigator shows; `verify` today re-asks the code
  review the stage loop already ran and re-runs the full gates. (a) Replace it with `accept`: the
  acceptance demo or its recorded skip (gate: `evidence/acceptance.md`); phases ready, apply,
  accept, archive. (b) Keep `verify`, drop its gate and review. (c) Keep as is. **Recommended
  (a)**: removes a repeat (FC-6) and gives validation its step (FC-8). BREAKING for a repo file
  naming `verify`; navigator tests change.
- **Q-2 "(provisional)".** Provisional means defined but never run. (a) Keep both provisional.
  (b) The acceptance demo loses it once this EPIC's own trial run (on the next real EPIC) is
  recorded; the validation review stays provisional until an iteration ends. (c) Drop both now.
  **Recommended (b)**: the method itself says a first recorded run confirms a step.

**Tools and hygiene**

- **Q-3 Home of the no-polling hook** (DEC-12 fixes its behaviour). (a) A small agent hook
  rendered per CLI from `hooks.yaml`, like `generated-tree-guard`. (b) In the navigator mod.
  (c) Rule only, no hook. **Recommended (a)**: enforcement without method in a mod; navigator stays
  method-free. Claude Code already blocks a foreground `sleep`; the loop in the background is the gap.
- **Q-4 Code-index refresh.** The project's code index (its code-intelligence tool, when it has
  one) answers impact questions; refreshing costs
  minutes and fails at times. (a) After every commit (today). (b) Once at Prepare and once before
  Challenge, in the background; a failure warns and the step falls back to reading. (c) A
  post-commit background hook. **Recommended (b)**: those are the two moments that read it.
- **Q-5 Flaky-test policy.** A flaky test passes or fails on the same code. (a) In the
  `cosmic-python` testing checklist: quarantine (mark, own task or issue), never chase seeds inside
  a stage; `epic-delivery` points to it. (b) In `epic-delivery`. **Recommended (a)**: a testing
  rule belongs to the testing checklist's owner.
- **Q-9 Success measure** (proposal, *Solution outline*): ≤ 2 local full-suite runs per stage plus
  CI, no sleep-polling call, every lead re-run names its trigger, TINY/SMALL gate in ≤ 2 runs.
  (a) Accept. (b) Add a wall-clock target. **Recommended (a)**: counts transfer across repos;
  durations do not.
- **Q-11 Gate names in the default workflow file.** Its `validate` gate runs `make validate`,
  skillery's own target (FC-10). (a) A neutral gate id (`full-gates`) whose command each repo sets
  with `extends` in its own workflow file. (b) Leave it. **Recommended (a)**: DEC-2. skillery's own
  override would then be a flagged consistency edit, not part of the method.

- **Q-12 How the agents reach optional code-intelligence tools.** Agent frontmatter lists the
  tools an agent may call; MCP tools are those a project's servers add (names like
  `mcp__<server>__<tool>`). Today `implementer` and `code-reviewer` have fixed lists, so no MCP
  tool reaches them. On opencode, MCP entries in a tool list have no analogue today (the
  `sales-agent` gaps in `make opencode-report`). (a) Wildcard entries per server
  (`mcp__<server>__*`), inert where absent: works now, but the frontmatter names products and
  grows with each one. (b) No allow-list: both agents inherit the session's tools, whatever the
  project installed; `code-reviewer` stays read-only through `disallowedTools` (Edit, Write) and
  its brief. (c) The repo binding grants them: a project-level agent file that overrides ours,
  i.e. a copy of the agent per repo. (d) No tool change: the lead runs code intelligence and puts
  the results in the brief. **Recommended (b)**: product-neutral, nothing to maintain per product,
  and it is closest to opencode's default (agents inherit tools), so parity improves rather than
  adds gaps. Cost, to accept as a risk: a reviewer could reach an MCP *edit* tool; the read-only
  rule and the lead's diff reading catch it. (d) is the fallback if (b) is rejected; it does not
  give builders symbol editing.

**Risks to confirm** (become `RISK-` in the PLAN): RISK-1 a wrong builder report reaches the stage
PR (accepted, D-b); RISK-2 fewer local runs miss an order-dependent failure (CI catches it);
RISK-3 the `verify` rename breaks repo overrides (CHANGELOG BREAKING line); RISK-4 a repo with no
narrow targets in `AGENTS.md` (the brief cannot be written; the lead asks); RISK-5 the deny hook
false-positives (loops only, fail open); RISK-6 (if Q-12 (b)) a reviewer reaches an MCP edit tool.

### Round 1 answers (owner, in the epic session, relayed by the lead, 2026-11-09)

| Q | Answer | Lands in |
|---|---|---|
| Q-1 | (b) Both in this EPIC: false docs fixed in the build + L2 agreement, AND the documentation workflow (owned by `technical-writing`; manuals and architecture pages; cold reader) | DEC-9 |
| Q-7 | (b) LARGE, one EPIC incl. the docs workflow; LARGE's review set (five lenses per stage PR, checker, adversarial tester); demo mandatory | Appetite |
| Q-10 | (a) The lead re-runs nothing per task; diff + report; re-runs only on the named triggers (D-b stands) | DEC-4 |
| Q-8 | (a) One combined L2+L3 pass at TINY/SMALL; five lenses from MEDIUM | DEC-3 |
| Q-6 | (a) `verify` replaced by `accept`: ready, apply, accept, archive. BREAKING | DEC-13 |
| Q-2 | (b) The demo loses "(provisional)" after its first recorded real run; the validation review stays provisional until an iteration ends | DEC-8 |
| Q-3 | (a) An agent hook rendered from `hooks.yaml` | DEC-12 |
| Q-4 | (b) Refresh the code index at Prepare and before review, in the background; a failure only warns | DEC-14 |
| Q-5 | (a) Flaky-test policy in the `cosmic-python` testing checklist; `epic-delivery` points to it | DEC-15 |
| Q-9 | (a) Counts only | Success measure |
| Q-11 | (a) Neutral gate id `full-gates`; each repo sets its command via `extends`; skillery's override is a flagged repo edit | DEC-16 |
| Q-12 | (b) Both agents inherit the session's tools; `code-reviewer` read-only (Edit/Write disallowed + brief). RISK-6 added; a PLAN test that opencode passes MCP tools to an agent with no tool list | DEC-11 |

Risks RISK-1..RISK-6 confirmed by the answers above.

## Round 2 (asked 2026-11-09) — the documentation workflow (DEC-9)

Round 1 put the documentation workflow in scope but left its shape open. Its timing, its documents,
its phases and the cold reader's scope are bet-level: the PLAN cannot be written without them.

- **Q-13 When it runs.** A *session* is one sitting with one workflow on the band. (a) Its own
  documentation session, started after an EPIC's accept when the EPIC changed a use case, the
  architecture, installation or user-facing behaviour; the epic session records "docs owed" as one
  line in `tasks.md` (or an issue) before archive, and the docs session ends in its own PR; also
  on demand. (b) A last stage inside the epic session, before archive. (c) Once per release.
  **Recommended (a)**: it keeps the build lean (the owner's position 3), the owed line stops the
  debt being forgotten, and one docs session can serve several EPICs.
- **Q-14 Which documents it owns.** (a) Manuals (user, installation, developer) and the
  reader-facing architecture overview pages, which narrate and link the C4 views and ADRs;
  `architecture` keeps authoring C4 and ADRs in shaping. (b) It also writes C4 and ADRs.
  **Recommended (a)**: ADRs and C4 are decisions owned by `architecture`; a doc narrates and
  points, it does not restate (the repo's single-source rule).
- **Q-15 Its phases** (a workflow file `documentation.workflow.json` in `technical-writing`, shown
  by navigator). (a) inventory (pages owed: missing, false, stale) → write → verify (snippets run,
  the project's docs gate) → cold-read → publish (PR). (b) write → cold-read → publish.
  **Recommended (a)**: verify and cold-read are two different checks (built right vs usable), and
  the inventory is what makes "docs owed" actionable.
- **Q-16 The cold reader's scope.** The cold reader is a fresh agent given only the page, which
  carries it out. Today it runs in a stage on any changed how-to or tutorial page. (a) Keep that
  in the build, and in the docs workflow run it on every task-oriented page it writes (how-to,
  tutorial, every manual page); explanation and reference pages get the lightweight clarity check.
  (b) Move every cold read to the docs workflow. **Recommended (a)**: each page is cold-read once
  per change, where it changed; (b) would leave a how-to fixed in the build unvalidated until a docs
  session runs.

### Round 2 answers (owner, relayed by the lead, 2026-11-09)

| Q | Answer | Lead's reading (recorded with the answer) |
|---|---|---|
| Q-13 | (b) The documentation workflow runs as the last stage of the epic session, before archive | It runs only when the EPIC changed a use case, the architecture, installation or user-facing behaviour; otherwise the lead records "no docs owed" in one line. A normal stage: one PR, the appetite's review set. The planner's risk (docs work in every epic) becomes a RISK with that condition as mitigation |
| Q-14 | (b) It also covers C4 views and ADRs | The docs stage brings C4 views and ADRs up to date as built, using `architecture`'s method; the documentation workflow names `architecture` for those pages and copies none of its method; new decisions are made in shaping or architecture, never at docs time. Conflicts are flagged, not decided |
| Q-15 | (a) inventory → write → verify (snippets run, the project's docs gate) → cold-read → publish | — |
| Q-16 | (a) Cold-read where the page changed: a how-to or tutorial changed in a build stage, and every task-oriented page the docs stage writes; explanation and reference pages get the lightweight clarity check | — |

Left to the design (lead's lean, not an owner decision): own workflow file in `technical-writing`,
entered by loading that skill in the last stage, so it can also run on demand. Decided in
`design.md` D-6.

Flagged by the planner, for the owner (not decided): `architecture` says an ADR becomes Accepted
only after the walkthrough passes it and *Accepted* means the developer took the decision
(`skills/architecture/references/architecture-index-page.md`). The docs stage therefore never
changes an ADR's status; it records as-built facts only (`design.md` D-7).

## Round 3 (owner, relayed by the lead, 2026-11-09) — the planner's two flags

| Id | Decision | Lands in |
|---|---|---|
| R3-1 | The docs stage records as-built facts only and never changes an ADR's status. A contradiction goes to the lead as a finding, and the developer decides | DEC-9, design D-7 |
| R3-2 | The builder runs the project's task gate per task, named in the project's `AGENTS.md`: the full gates by default, a narrower gate where the project says so. The full gates run once at the stage PR, plus CI | DEC-4, design D-4 |
| R3-3 | (after the independent gate, 8.35) The no-polling hook ships as a plugin-level hook in a bundle every Meaningfy session installs (e.g. `meaningfy-core`), the way navigator ships `hooks.json`; not a `project-setup` template. It needs an opencode equivalent through the existing opencode plugin, or a recorded gap; `docs/development/hook-bindings.md` is corrected; the result is checked against LARGE's re-shape rule | DEC-12 (amended), design D-5, *Appetite* |
