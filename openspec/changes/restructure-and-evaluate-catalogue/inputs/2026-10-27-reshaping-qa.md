# Owner answers during the reshaping session (2026-10-27)

**Status:** SECONDARY input, the Q&A record of the session that reshaped this EPIC from "evaluate the
catalogue" into "restructure the catalogue around scenarios, and evaluate it". Never groomed, never
deleted. The scenarios themselves are in [`2026-10-27-scenarios.md`](2026-10-27-scenarios.md); the
owner's diagram is in [`2026-10-27-catalogue-model.md`](2026-10-27-catalogue-model.md). The earlier
shaping record, [`2026-10-26-shaping-qa.md`](2026-10-26-shaping-qa.md), still stands where this one
does not override it.

## Decisions taken

| # | Question | Owner's answer |
|---|---|---|
| R1 | How do agent evals relate to the method's Gherkin tests (`tests/features/agents/*.feature`)? | **The Gherkin scenario is the spec; the eval case is its runnable form**, traced by name. The `.feature` stays the one source. |
| R2 | How to apply the agent-eval revision? | Update all the change's artifacts coherently, on a branch, one PR. |
| R3 | Which model records the evals? | Verbatim: "indeed lets use haiku for all evals, what do you think? later we decide if we need a better model". Haiku is the record model for trigger sets and outcome suites; a Sonnet spot-check is a later, separately approved decision. |
| R4 | Where do shared house resources (voice, visual identity, templates) live? | **Foundation skills**: small skills that hold a resource and no method, installed like any skill, required by name. |
| R5 | Should the repo's architecture have a conceptual model? | Yes, in PlantUML or Mermaid. The owner's diagram is the Mermaid draft in `2026-10-27-catalogue-model.md`. Whether it becomes a LinkML source was open; closed by R8 (no LinkML). |
| R6 | Redesign this EPIC or start a new one? | Verbatim: "capture all these details into the restructuring epic both input materials and proposal, and design, and plan … redesign it completely taking into consideration what was done already". |
| R7 | Rename scenarios? | Verbatim: "yes rename to UseCase (feel free to reuse whatever specs we have on use cases when implementing)". The catalogue uses the `architecture` skill's Cockburn White-level convention, ids `UC-W<n>`. |
| R8 | YAGNI: is the plan over-conceptualised? | Owner approved the proposed cuts ("yes apply the cuts"): see `2026-10-27-catalogue-model.md`, "YAGNI trim". |
| R9 | When do evals resume? | Verbatim: "I think we shall not test anything yet, until systematisation is ready". The architecture track runs first; batch C and the suites wait. |

## Agent-evaluation findings that led to R1

The first pitch's "agents evaluated too" did not follow the agent lifecycle (`docs/development-method.md` §4):
1. the existing `tests/features/agents/*.feature` are only shape-checked and run by hand, and the pitch
   added a second, unconnected description of each agent (eval cases);
2. no failure case or "before" was defined for agents;
3. batches A–E covered skills only; a failing agent case had no revision path;
4. the dispatch contract has four lists (needs, returns, side effects, refuses); the pitch graded three;
5. least privilege (method principle 4, AST03/AST10) was not checked, though `implementer` cases run
   with write tools.

## The owner's answers on the dimensions to explore

Lightly edited for spelling; meaning unchanged.

1. **Scenarios:** the list given in the session is the start (see `2026-10-27-scenarios.md`).
2. **Who installs:** "me, my colleagues in Meaningfy primarily". All scenarios shall work for
   colleagues: "I don't think there is something that is mine today and cannot be used by my colleague".
3. **Where agents run:** "some agents I want in Claude Desktop, or Claude CLI, some agents I want
   running on some server (e.g. openclaw) so that they do things in the background and provide
   evidence of their actions and of course concrete results (somewhere, TBD per agent); it could also
   be just simple naive cron runs on the local machine, but better project those agents running on a
   server somewhere (TBD)".
4. **Memory:** what each agent reads depends on what it needs. Memory types: Odoo, Confluence, the
   personal vault (a local folder synchronised to Google Drive, Karpathy-style), several cognee
   brains (vector RAG and Neo4j knowledge graphs). "We have tons of MCPs (which by the way need
   management too)". Odoo may be used as an internal memory: "feel free to store there projects,
   contacts, events, notes, tasks"; "this could be an orthogonal specification, or an aspect listed on
   each agent, not sure".
5. **House style:** it lives in the resources of a communication skill (found:
   `skills/executive-communication/references/company-voice.md`). These "are not really a skill but
   some sort of shared resources that shall be accessed by a skill (propose a way to manage and
   deploy/install these)" → R4.
6. **Local customisation:** per vault. "Each person installs locally the vault and then customises it,
   its structure and conventions, but the skills are the same". Example: "it is not projects folder
   but works/tasks".
7. **Reference materials:** "scattered everywhere in the skills folders (e.g. project-setup has a ton
   of examples and resources for how some files shall be)".
8. **This month's pain, in order:** make skillery maintainable; software development; the sales agent
   and "keeping track of what to tell whom"; then the rest.
9. **The shared foundation:** "something that will eventually grow as we add and extend skills … a set
   of multiple micro-skills or specs that are reused by one or more skills; not sure how this is best
   organised and managed" → R4 and its rule of two (design D-15).
10. **Documentation by intention:** "either install the skillery, or use the skillery and need to know
    how to (e.g. how we develop software), and each task or scenario, a catalogue of skills for
    orientation, and as a developer how to develop".
11. **How the owner works:** "usually I work on projects, but often, for example at a conference, I
    have various tasks that I want done quickly, so I want to only select the type of agent/companion
    to work with me and then save the results somewhere (in one or several memories, if at all) … a
    quick note is also handy to then save it in the vault."
12. **Principle:** "model-driven ontology development, model-driven software development, model-driven
    agent development, model-driven everything; and we are very, very much data-centric".
13. **The aim:** "make an inventory of what already exists, what is missing, create a roadmap, and a
    plan to cleanly organise the architecture of this skill set so it grows organically but not
    chaotically … to avoid ending up like a usine-à-gaz".

## Defect found during the session

`skills/explanatory-writing` (bundle `meaningfy-core`) links to
`../executive-communication/references/company-voice.md` (bundle `meaningfy-consulting`). A colleague
who installs only `meaningfy-core` gets a broken link. It is the first case for the foundation-skill
rule (design D-15) and its lint check.
