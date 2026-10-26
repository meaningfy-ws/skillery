# Seed scenarios and the inventory gap map (2026-10-27)

**Status:** SECONDARY input. **Renamed later the same day:** these scenarios are White use cases;
`S<n>` becomes `UC-W<n>` in the catalogue (design D-14). The owner's use-case scenarios as stated in the reshaping session
(lightly edited for spelling), and the gap map drawn against the catalogue as it stood on
2026-10-27 (`bundles.yaml`, v3.2.0 plus Phase 1 of this EPIC). The scenario catalogue this EPIC
builds (design D-14) is seeded from this file; once it exists, this file is history.

*(Superseded: the kinds below were a session reading; the catalogue uses the agent template's
`type` instead, design D-17.)* Scenario kinds are the agent kinds seen across the list (design D-17): **partner** (thinks with
you), **producer** (interviews you, then delivers a document), **operator** (acts on systems, often
in the background), **lead** (runs a team of agents).

## Seed scenarios

| # | Area | Scenario (owner's words, condensed) | Kind | What exists |
|---|---|---|---|---|
| S1 | personal | **Vault work**, renamed structure ("not projects but works/tasks"), colleagues' local variations anchored in one shared spine | operator | `vault-assistant` (9 skills); no per-vault config |
| S2 | personal | **Life coach and personal-growth assistant**: "I will provide many ideas and objectives, and will need him to help me organise and realise them … quite an important one" | partner | nothing |
| S3 | personal | **Secretary**: organises calendar and tasks, personal and business life | operator | nothing (calendar connector available) |
| S4 | personal | **Planning across horizons**: daily grooming, weekly, monthly, quarterly, life planner "including how I want to die" | producer | `vault-planning`, `vault-daily` (day and week) |
| S5 | personal | **Quick companion on the go**: at a conference, pick a type of companion, get tasks done, save results to one or more memories, or a quick note to the vault | any | `vault-capture` (vault only) |
| S6 | operations | **DevOps engineer**: the Meaningfy way of infrastructure, CI/CD, monitoring, daily reviews, interventions; also developing, testing, operationalising and monitoring new infrastructure stacks. "I need this badly." Materials exist outside the repo | operator | `ci-cd-delivery`, `meaningfy-release`; change `add-devops-bundle` drafted |
| S7 | selling | **Sales assistant**: groom the CRM, keep accounts, write customised emails in a predefined style; "keeping track of what to tell whom". Skills defined outside the repo | operator | change `add-sales-bundle` drafted |
| S8 | selling | **Proposals and formal offers** from client requirements, standard or bespoke: an assistant that asks the right questions and leads to a sendable PDF in company style, or a simpler proposal email | producer | `proposal-writing`, `estimation`, `decision-package`, `executive-communication`; no agent |
| S9 | selling | **Qualify leads and partnerships**: who deserves our attention and who does not; which partnerships to pursue | partner | nothing |
| S10 | selling | **Qualify a prospect in a sales conversation**: against a commercial structure, the domain and readiness to buy | partner | nothing |
| S11 | commercial design | **Market research**: identify a target market and its buyers, so commercial structures can target them | producer | nothing |
| S12 | commercial design | **Commercial structure and offer**: a complete, clear commercial structure, then an irresistible proposition (Hormozi, Tony Robbins or other frameworks; reference materials exist elsewhere) | producer | nothing |
| S13 | business | **Negotiation thinking partner** for difficult commercial and business situations (Chris Voss, Robert Greene, Sun Tzu and other relevant authors) | partner | nothing |
| S14 | business | **Business coach and strategic/tactical partner**: becoming a successful businessman, out of cash-flow issues, then scaling; business and lean canvases, business plans for grant schemes, angel and VC pitches. "Less is more"; specific pitch skills later | partner | `semantic-consulting-coach` (client-facing only) |
| S15 | business | **Internal communication, a people's person**: monthly executive briefings; weekly or daily messages based on the employee handbook, current projects, victories and achievements (much is in Odoo) | operator | nothing |
| S16 | legal | **Contracts and NDAs** in LaTeX on Overleaf | producer | nothing (Overleaf connector available) |
| S17 | design | **Graphic designer**: consistently beautiful graphics in Meaningfy style, fitted to the purpose (LinkedIn and blog posts, generated pictures, documentation diagrams, concept/commercial/explanatory slides, brochures, offer and pitch visuals) in draw.io, Miro, Canva, Mermaid | producer | nothing in the catalogue |
| S18 | engineering | **Programming partner and team lead** of developers, architects, designers, product developers and modellers, using all Meaningfy conventions, SDLC steps and roles | lead | `meaningfy-building` (9 skills, 3 agents); the most developed area |
| S19 | engineering | **System architect**: design a new system first; use cases, architectural decisions, system diagrams | partner | `architecture` skill; no agent |
| S20 | engineering | **Conceptual modeller / ontology engineer**, LLM-assisted, model-driven, data-centric; the owner has new ideas from recent talks | partner | `conceptual-modelling`, `modelling-conventions`, `linkml-engineering`; no agent |
| S21 | pre-sales | **Demo builder**: quick demos in Neo4j, GraphWise or others, synthetic data on a demo domain, interaction shown through metaphacts, Linkurious and AI agents | producer | nothing |

**The commercial chain** (owner confirmed): market → commercial structure → qualification → proposal
→ negotiation → contract (S11 → S12 → S9/S10 → S8 → S13 → S16). The commercial structure is the
central artefact the others read.

## Patterns seen (to be decided in the PLAN, not here)

- **Qualification appears three times** (S9 leads, S9 partnerships, S10 prospects): one method with
  three variants, not three agents.
- **Planning is one loop at five horizons** (S4): each longer horizon sets direction for the shorter
  ones, and the shorter ones report back up. Personal and business are labels on one plan, not two systems.
- **The coach and the secretary are different roles** (S2, S3), joined by the planning method.
- **Aspects cut across all scenarios:** memory (Odoo, Confluence, vault, cognee), connectors (MCP),
  house style (voice, visual identity, templates), runtime (interactive or background), local
  customisation, and the model-driven, data-centric principle.
- **Author frameworks** (Voss, Greene, Sun Tzu, Hormozi, Robbins) are stated in our own words with a
  citation; the source materials go to the owning change's `inputs/`.

## Gap map by area

| Area | Covered | Partly | Missing |
|---|---|---|---|
| personal | S1 | S4, S5 | S2, S3 |
| operations | — | S6 (drafted change) | — |
| selling | — | S7 (drafted change), S8 (skills, no agent) | S9, S10 |
| commercial design | — | — | S11, S12 |
| business | — | S14 (adjacent coach only) | S13, S15 |
| legal | — | — | S16 |
| design | — | — | S17 |
| engineering | S18 | S19, S20 (skills, no agent) | — |
| pre-sales | — | — | S21 |

## How to add a scenario

Until the catalogue exists, append a row above with the next `S<n>`. Afterwards, add one file to the
scenario catalogue (design D-14); this table is not updated.
