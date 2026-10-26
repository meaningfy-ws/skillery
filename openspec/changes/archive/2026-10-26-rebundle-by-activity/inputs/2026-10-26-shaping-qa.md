# Seeds and shaping Q&A (2026-10-26)

**Status:** SECONDARY input, never groomed. The EPIC (`../proposal.md`) supersedes it.

## Seeds read

1. The owner's request, 2026-10-26 (verbatim, spelling as typed): "yes, do the split and start
   rebundle-by-activity; note that we want to create all the usecases, and put in place all teh skilsl
   and agents we can do, and what is not yet specified today, mark as future implementation roadmap,
   and list what "features" shall be implemented to this repo (e.g. the sales agents, the dev ops
   agents, etc ... ) we will do evaluation later (so indeed park it in a new epic change)".
2. The owner's activity list of 2026-10-26, in the archived `define-catalogue-model` change,
   `inputs/2026-10-26-plan-confirmation.md` ("Seed for a later change"): software development;
   ontology and conceptual modelling; client delivery and communication including project
   management; content creation (LinkedIn, blogs); commercial offer creation, packaging, pitch and
   pricing ("Hormozi-style irresistible offer"); proposal and offer writing; CRM agents; devops
   (Terraform, Ansible); "and so on".
3. The approved target structure, agent roster and roadmap in `docs/catalogue-architecture.md`
   (approved 2026-10-26, `restructure-and-evaluate-catalogue` `inputs/approvals.md`).
4. The use-case catalogue `use-cases/` (UC-W1–UC-W21) and its gap map `docs/use-cases.md`.
5. The drafted siblings `add-sales-bundle` and `add-devops-bundle` (their packages live outside the
   repo and are not yet in their `inputs/`).
6. The symlink decision of the archived `single-source-distribution` change (design D3, alternative
   "d" rejected) and the current Claude Code plugin manifest reference (2026-10-26): a marketplace
   entry whose source is the root and which lists `skills` loads only those; `agents` replaces the
   default scan.
7. The owner's voice question, 2026-10-26: the voice should sound right per audience (clients,
   internal people) and per channel (LinkedIn posts, blogs, offers, other text).

## Answers

| # | Question | Owner's answer |
|---|---|---|
| Q1 | "Create all the use cases": which? | Fill the gaps (advisory engagement, client delivery and project management, content creation, and any the activity list implies) **and** a check that every skill and agent serves at least one use case. |
| Q2 | Which agents to build now? | `system-architect`, `conceptual-modeller` (UC-W19, UC-W20) and `proposal-writer` (UC-W8). |
| Q3 | Create `meaningfy-sales` now? | "create the sales bundle, BUT, know that there are already some shapened skills elsewhere that will be integrated" (the sales package, `add-sales-bundle`). |
| Q4 | How to record future features? | A feature register, with a parked change stub only when its material is in hand. |
| Q5 | Revise facets? | `purpose` only, to the activities; `stage` stays. |
| Q6 | A `partner` agent type? | The owner: "well this is the same as primary no? the main agent that can easily call subagents, tools and skills? and that helps me think and tell me briefly what he thinks and plans?" Agreed: no new type; the architect and the modeller are `lead` agents. Q-2 of the restructure change closes. |
| Q7 | What must the EPIC prove? | Coverage; installs on both CLIs (core-only resources intact); new agents behave (Gherkin return and refusal, `agent_conformance`); no silent moves (CHANGELOG "Action needed"). |
| Q8 | Appetite? | Large, about six weeks: also the symlink re-test, the external dependency register and the voice channel profiles. |
| Q9 | (owner, after the EPIC was shaped) | "lets then create bundles only on demand, not commit them, lets organise bundles in a file and then generate them with a command, especially that it is only useful for human review and claudecode; so in development phase delete them and groom only the bundles files, as they are the same as claude plugins; channel profiles will be added later, put placeholders for now, and add them to future features file; proceed". Folded into DEC-7, DEC-8 and DEC-10; the default-branch constraint (installs clone `develop`) added by the agent. |
