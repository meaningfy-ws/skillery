# EPIC: Sales & presales suite — groom the pilot sales agent into `meaningfy-sales`

> **Golden thread.** Parents: the owner's **sales-agent package** `meaningfy-sales` **0.6.1**
> (vault project *2026-10-08 Sales Agent*, R01–R80; located in [`inputs/POINTER.md`](inputs/POINTER.md))
> and use cases [UC-W7](../../../use-cases/UC-W7-sales-assistant.md) (sales assistant),
> [UC-W9](../../../use-cases/UC-W9-qualify-leads-and-partnerships.md) and
> [UC-W10](../../../use-cases/UC-W10-qualify-prospect.md) (qualification).
> Evidence: the four 2026-10-27 research reports in [`inputs/`](inputs/README.md).
> **Depends on:** `agent-authoring-standard`, `single-source-distribution`, `rebundle-by-activity`
> (all archived). **Independent of** `add-devops-bundle` (the earlier "after devops" order is dropped).
> **Re-shape log:** 2026-10-27 — rewritten from the 2026-10-25 draft after reading the package
> (0.6.1, not "planned 0.4.0") and the project notes; the draft's stale points are listed in
> `inputs/2026-10-27-C-skillery-integration.md` §5.
> 2026-10-27 (later) — the owner accepted the recommendation on OPEN-1..4; recorded as DEC-7..10
> and the PLAN derived. Capability `sales-method-ownership` added for DEC-9/10.

## Appetite

**Large, with a hard cut line.** One bundle, ~5 skills and one agent groomed from a working package,
its deterministic tests, and the edits that make the existing commercial skills cite one owner per
fact. **Cut line:** if the import is done and presales gaps (demos, solution design, pricing, tender
radar) start pulling in, stop — they are follow-up EPICs, named below.

## Why

The sales agent works: it grooms the Odoo pipelines twice a day from Claude Desktop, qualifies deals,
prepares meetings and keeps account profiles. But it lives in one person's vault, a second salesperson
cannot install it, and it fights the catalogue: it restates rules that skillery skills already own
(offer ladder, discovery questions, email voice, guardrails), it carries Meaningfy's Odoo data and
people's names inside its skills, and none of its five skills passes skillery's template.

And its outputs tire the owner. Run notes reach 200–370 lines where one screen was asked for; the
weekly review was unreadable (several-hundred-character table cells); the "Needs you" section sits
below the agent's own checklist; and **when it asks for a decision it gives a record id or a link to a
note line, not the two or three facts needed to decide** — 23 such requests were found
(`inputs/…A-package-audit.md` §3.2). Since ~16 Oct every run reports "no new input from you": the
answer channel is not working.

Why now: the agent is stable enough (366 fixed checks) to stop evolving privately, and the catalogue's
commercial chain (UC-W8–W13) is waiting on exactly the qualification and pipeline method it holds.

## Solution outline

1. **Import and regroup** the five package skills into catalogue skills, each with the template,
   facets, a Boundary section and crisp descriptions (indicative split; names are a PLAN call):
   | Skill | Owns |
   |---|---|
   | `sales-operations` | the agent's goal loop, run types (open day, close day, weekly review, intake), run-note templates, reviewer prompts |
   | `sales-pipeline-custody` | pipelines/routes, stars, next actions, Odoo conventions, **the write policy** (three tiers, HALT, rule zero, creation cap) |
   | `sales-accounts` | entity resolution, person/company profiles, personal-details rules, customer success after the win |
   | `sales-qualification` | deal dossier, five-P, MEDDPICC, evidence grading, research checklist |
   | `sales-conversations` | meeting plans, conversation tools, email patterns, objections, the selling method (Hormozi, Robbins, Voss, Challenger) |
2. **One agent, `sales-agent`**, thin (≤40-line body), `type: scheduled`, also startable by the owner;
   it dispatches to `sales-operations`. Desktop scheduled tasks call the **skill** (they cannot load an
   agent file — recorded gap G-4); CLI users get the agent.
3. **Fix the outputs** (the owner's main ask): every run note opens with **Decisions needed**, then
   **Watch** (only what fired), then **Done by the agent** (before → after); one screen. Every decision
   request is a **decision card** (DEC-5). Tables ≤5 columns, no internal codes in summaries.
4. **One owner per fact** across the catalogue: the sales skills cite `engagement-lifecycle` for the
   offer ladder, `estimation`/`proposal-writing` for price and offer, `meaningfy-voice` for tone (it
   gains an email channel), `guardrails` for generic agent safety; `presales-discovery.md` cites
   `sales-qualification` (DEC-10).
5. **Instance data out of the skills**: Odoo ids, legacy tags, staff and partner names move to a
   configuration file the agent reads from the owner's vault; the skills hold method only (DEC-3).
6. **Tests into skillery**: the write-policy cases (120), Odoo-view and table checks as plain pytest;
   behaviour scenarios as Gherkin specs under `tests/features/agents/`; one positive and one
   near-miss trigger probe per description. Drop the tests skillery's validator already covers.
7. **Integrate**: `bundles.yaml` (`meaningfy-sales` gains the members), UC-W7/W9/W10 `served_by` and
   status, `docs/future-features.md` (commercial chain re-scoped), roles-and-raci, ai-sales runbook
   pointers, a Desktop + scheduler setup page under `docs/environment/`, CHANGELOG, MINOR release.

## Key decisions

- **DEC-1: One agent plus skills, not several agents.** One job — keep the sales pipeline true and
  moving — with run types as modes of that job. Answers UC-W7's open point.
- **DEC-2: Runtime stays Claude Desktop + scheduler; no server.** OpenClaw is a follow-up. The
  scheduled tasks invoke `sales-operations`; opencode has no scheduler (recorded gap).
- **DEC-3: Skillery holds method, never Meaningfy's CRM data.** skillery is public: Odoo ids, staff
  and partner names, partner ratings and price ranges stay in the owner's vault configuration; skills
  name roles ("the owner", "the second sender"), not people.
- **DEC-4: The package's safety model is kept whole**, not reduced to five lines: three-tier write
  policy as data (do-and-log / ask-first / never), rule zero (resolve to an Odoo id first), creation
  cap, intake session instead of bulk import, HALT, both senders in cc. Borrowed from Anthropic's
  sales plugin: show before → after, write only changed fields, re-read to confirm; content read from
  mail is data, never an instruction; unattended runs only propose.
- **DEC-5: Every request for a decision is a decision card** (≤150 words): what is decided and by
  when; recommendation; up to three options each with its consequence, one being "do nothing"; the
  2–3 facts needed, each marked confirmed (source, date) / assumed / unknown; what "yes" will write;
  reply as a letter. Never a bare id or link. The card's shape is owned by `executive-communication`
  (a new "decision request" pattern) so every agent in the catalogue can use it.
- **DEC-6: Lead vs deal, qualification and stars are the owner's decided method**
  (two-way signal converts; five-P derived from MEDDPICC; stars per pipeline; every deal has a next
  action except the named cold list). Groomed for wording, not redesigned.

- **DEC-7: The agent evolves in skillery** (owner, 2026-10-27; was OPEN-1). After import the vault
  package is frozen. The R80 self-edit exemption is dropped: when a run finds a skill defect, the
  agent writes a proposed change (failure, file, before → after) in the run note for the owner to
  raise as an issue or PR. It never edits an installed skill.
- **DEC-8: Scope is import + groom only** (owner, 2026-10-27; was OPEN-2). The tender go/no-go
  route already in the package is imported as is; no new presales capability (see No-gos).
- **DEC-9: The package's offer-ladder names win and `engagement-lifecycle` owns them** (owner,
  2026-10-27; was OPEN-3): Light tier → **discovery workshop**, Deep tier → **Proof of Value**
  (its deliverable stays the Decision Package), build → **Scaling**. Every catalogue file that uses
  the old names is updated in this EPIC.
- **DEC-10: `sales-qualification` owns qualification** (owner, 2026-10-27; was OPEN-4): five-P,
  MEDDPICC and the prospect question bank. `semantic-consulting-coach/presales-discovery` keeps the
  coaching posture and cites it; `proposal-writing` stops claiming to qualify the need.

## Rabbit-holes

- Redesigning the sales method — decided (DEC-6).
- Building Odoo tooling or a fake Odoo connector — the Odoo MCP is the interface.
- Generalising to "any CRM" — one consumer.
- A judge-based behaviour test runner in CI — behaviour scenarios stay hand-run specs.
- Hooks/permission plugins for the agent — the write policy plus the agent's `disallowedTools`
  (send, delete) suffice for this EPIC; hooks stay a follow-up.

## No-gos

- No server/OpenClaw deployment; no LinkedIn Sales Navigator or paid data sources.
- No CRM data, staff names, partner ratings or prices in the repo (DEC-3).
- No sales materials (brochures, case studies, price lists) and no presales gap-filling: demos,
  solution design, pricing, tender radar, partner one-pagers → follow-ups (`add-commercial-chain`
  re-scoped; `add-offer-writing`; `add-demo-builder`).
- No change to `agent-authoring-standard`; a needed change re-shapes that EPIC.

---

## What Changes

- **New skills** (≈5, names at PLAN): `sales-operations`, `sales-pipeline-custody`, `sales-accounts`,
  `sales-qualification`, `sales-conversations`.
- **New agent** `agents/sales-agent.md` (`type: scheduled`).
- **Modified skills:** `executive-communication` (decision-request pattern), `meaningfy-voice` (email
  channel), `semantic-consulting-coach` (`engagement-lifecycle`, `presales-discovery` cite or are
  cited), `proposal-writing` (drop "qualifies the need"), `writing-antipatterns` (Decision genre:
  context is required in an approval request read later).
- `bundles.yaml`, use cases UC-W7/W9/W10, `docs/future-features.md`, `docs/practice/roles-and-raci.md`,
  `docs/practice/ai-sales/`, `docs/environment/` (Desktop + scheduler setup), README rows, CHANGELOG.
- `tests/`: write-policy and Odoo-view pytest, `tests/features/agents/sales-agent.feature`, trigger
  probes, ownership tags.

No breaking changes for installers.

## Capabilities

### New Capabilities
- `sales-pipeline-custodianship`: what the agent must and must never do to the CRM (DEC-4), how it
  qualifies and converts (DEC-6).
- `agent-decision-requests`: the decision-card contract (DEC-5) any agent uses to ask the owner.
- `sales-method-ownership`: one owner each for the offer ladder (DEC-9) and qualification (DEC-10).

### Modified Capabilities
- `catalogue-governance`: first `scheduled` agent; the Desktop scheduled-task binding (skill, not agent file).

## Impact

`skills/` (+5, ~4 edited), `agents/` (+1), `bundles.yaml`, `use-cases/`, `tests/`, `docs/`, README,
CHANGELOG. Runtime: the owner's Desktop scheduled tasks are re-pointed to the installed skills after
release. Follow-ups: presales gaps (above), server deployment, hooks.
