# Q&A record — named-workers-and-legal (secondary, never groomed)

Session of 2026-11-11, owner and Claude.

## Q-1: Where do workers live: in skillery as agents, in a separate roster layer, or in the repo where the work lives?
- Asked because: the owner first leaned to managing workers apart from skills.
- Answer: as agents in skillery, following the existing thin-wrapper standard (option A); the
  material (templates, clauses) lives outside.
- → DEC-1

## Q-2: Where do navigator workflows sit relative to workers?
- Asked because: the owner asked "where would the navigator workflow be?"
- Answer: with the skills, as today (`skills/<owner>/assets/workflows/`). A worker walks a
  workflow; it does not own one. Workflows constrain and direct agent behaviour, together with the
  agent's refusals and tools, and the skills' rules.
- → DEC-2

## Q-3: Manage activity skills and know-how skills separately?
- Asked because: workflows make some skills "activity" skills.
- Answer: no; one Skill type, the distinction named and documented, cheaper (option A).
- → DEC-3

## Q-4: Where does the legal corpus live?
- Answer (round 1): a default Overleaf project with templates and samples that Tolic creates as we
  evolve. Superseded by Q-9.

## Q-5: How does a persona name appear in an agent definition?
- Answer: role file, persona in text: `agents/lawyer.md`, `name: lawyer`; description and role line
  say "Tolic the lawyer".
- → DEC-4

## Q-6: Apply names to the existing agents in this EPIC?
- Answer: all agents now. No diacritics. `ops-watch` is "Petrica the infra operator" ("Petrica is
  not clear what he is watching").
- → DEC-5

## Q-7: What type is Tolic?
- Answer: lead, "and this lead can delegate to subagents, always leads can delegate and spawn
  subagents."
- → DEC-6 (Tolic), DEC-7 (every lead may delegate)

## Q-8: Which actions must Tolic refuse on his own?
- Answer: send to a counterparty; edit a signed contract; present output as final legal advice;
  write outside the corpus; "take any action that would have consequences outside the company".
- → DEC-8

## Q-9: How is the clause library managed?
- Answer: "we will provide a GitHub repo that will have all the rules and instructions on how it
  works provided there." The corpus repo owns its own structure and rules; skillery points to it.
- → DEC-9

## Q-10: How does Tolic read and write Overleaf?
- Answer: both: the Overleaf connector for live edits and the project's git sync.
- → DEC-10

## Q-11: Which workflows without a lead get one?
- Answer: all four: epic shaping, epic delivery, release, documentation. The owner asked whether
  legal work needs its own kind of EPIC. Claude's answer, not contradicted: no; a contract has its
  own workflow, owned by the legal activity skill; the epic workflows stay for software change.
  Post-signature obligation tracking ("later implementation of these contracts") is out of scope.
- → DEC-11, DEC-12

## Q-12: Which skills does Tolic start with?
- Answer: two: one for "the various activity set" (contract work), and one for "reading and working
  with a GitHub repo … the ability to operate based on the instructions and the structure of that
  repo." The owner will paste the repo structure and specs. Luxembourg law is not a separate skill.
- → DEC-13; open until the specs arrive (Rabbit-holes)

## Q-13: What must the EPIC prove at acceptance?
- Answer: Tolic drafts a freelance contract from a mission; revises a counterparty draft; harvest
  grows the corpus; drafts a B2B commercial contract, MoU or NDA from whatever templates the corpus
  repo holds; a cold reader finds the worker answers in the docs.

## Q-14: Biggest risk?
- Answer: wrong legal content (Tolic states Luxembourg law incorrectly and it is trusted).
- → RISK-1

## Q-15: How is the scope cut?
- Answer: one EPIC, three stages: conventions and docs; names and the four new leads; the legal
  bundle once the corpus repo exists.
- → DEC-14

## Q-16: Shaping lead: convert epic-planner or add one?
- Answer: convert `epic-planner` into a lead, "Vasile the planner".
- → DEC-11

## Q-17: Names
- Answer: the proposed list (DEC-5).

## Q-17a: What in the owner's contract-library spec is skill and agent related?
- Asked because: the owner pasted the spec and asked to "analyse and adjust on what is skill and
  agent related".
- Answer (Claude's analysis, folded into the EPIC): the clause model, drafting style, lifecycle,
  `ctr` and lint belong to the corpus repositories (DEC-9); skillery keeps the judgement (DEC-13)
  and the external-effect refusals (DEC-8); git replaces Overleaf as system of record (DEC-10,
  superseding Q-10); building the contract system is a separate software EPIC (DEC-15).

## Q-18: Who leads the Overleaf migration's legal judgement (classify, cluster, review packets)?
- Asked because: it is legal judgement inside a software project.
- Answer: "we will decide this later, this is not a skill related specification right? we will do
  it once … skills must be specific and repeatable on the same type of task."
- → DEC-16

## Q-19: How is stage 3 proven before the contract system exists?
- Asked because: Tolic's live acceptance needs `ctr` and skeletons.
- Answer: "we will not prove him now, we release first set of skills and agent, and later we will
  fix and open issues in skillery if something is off."
- → DEC-17

## Q-20: Corpus skill specific to the contract system, or generic?
- Answer: contracts live in `meaningfy-ws/legal-agreements`; "the skill must really be generic for
  now."
- → DEC-9, DEC-13

## Q-21: May Tolic read Odoo?
- Answer: "let's stick to Overleaf and GitHub for now."
- → DEC-10, DEC-8
