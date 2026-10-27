# Seed — the sales agent as the human has decided it (for `add-sales-bundle`)

**Status:** SECONDARY input. Preserved verbatim, **never groomed, never deleted**. §1 restates
decisions the human stated in earlier sessions (Oct 2026) about the Sales Agent project; the package
itself is primary.

**Provenance:** Claude Cowork sessions with the owner, Oct 2026; catalogue facts from the
2026-10-25 repo read at v2.11.0.

## §1. Decisions already taken for the sales agent (as stated by the human)

- Purpose: daily grooming of Meaningfy's sales pipelines in Odoo CRM — pipeline custodian,
  researcher, groomer, drafter; tracks companies, people, deal descriptions; scouts extra info;
  tracks which propositions are irresistible.
- Runtime: pilot runs in **Claude Desktop** using the vault, the Meaningfy memory and the human's
  mail; **no Meaningfy servers in play for now**; OpenClaw runs on the server but needs configuration.
- Odoo is the knowledge base and memory for deals; the agent is custodian of all Odoo teams/pipelines
  (one pipeline per sales team).
- Writes: many Odoo writes, no modes, "may access everything as long as it does nothing risky or
  irreversible"; **no bulk imports** — one record at a time (plan, execute, audit, report); always
  search for an existing record before creating.
- Steering: the human writes into the agent's daily grooming-session notes, which the agent re-reads;
  session notes live in the vault at `04 Daily/crm-grooming-session/`.
- Lead vs opportunity: cold = lead; a meeting or positive interaction = deal; explicit refusal or no
  interest after chasing = lost.
- Qualification: BioTechX five-P score (Pain, Priority, Power, Plan, Fit; derived from MEDDPICC)
  returns into the skills (planned `meaningfy-sales` 0.4.0); Odoo stars mirror the five-P band;
  **no deal without a next activity**; pipeline worked through Odoo filters.
- Method: Challenger (teach, tailor, take control); customer success built in; 48 Laws / MICE not
  adopted beyond reading motives.
- Outreach: invite to book via the human's Koalendar link, propose a slot, or say when to re-contact;
  whoever sends (the owner or the second sender), the other is in cc; outreach points to the general brochure and,
  where apt, the Mapping Workbench brochure.
- **Tests belong in the skillery repository, not inside a skill; Gherkin with Scenario Outlines and
  Examples tables, values in the tables, variables in the step text.** Moving the tests to skillery
  is part of 0.4.0.
- "The skills are the operational truth; integration with the Meaningfy skillery comes later."
- Sales materials do not exist yet (separate offering/proposal project); tender watching exists
  elsewhere; no LinkedIn Sales Navigator licence.

## §2. Catalogue ground (v2.11.0)

- `meaningfy-consulting` bundle: `semantic-consulting-coach`, `decision-package`, `proposal-writing`,
  `estimation`, `executive-communication`.
- `docs/ai-sales/`: engagement lifecycle, sales runbook and DoD, services catalogue (one page per
  Semantic Layer building block or named gap).
- `docs/roles-and-raci.md`: Sales/Presales is one of six roles; account nurture is its activity.
- No sales skill, no sales agent, no `scheduled` agent type exists in the catalogue today.

## §3. Open questions for PLAN time (not decided in session)

- Whether the package is one agent with modes or several single-job agents (standard says one job
  per agent; the pilot's "custodian, researcher, groomer, drafter" may be one role with four jobs or
  four delegated agents under one lead).
- Which Odoo safety rules are enforceable as `guardrails` (skill) vs stated in the dispatch contract.
