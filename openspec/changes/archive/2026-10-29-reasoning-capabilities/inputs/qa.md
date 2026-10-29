# Q&A record — reasoning-capabilities

Secondary input, never groomed or deleted. Format per the epic-planning seed-intake reference.

## Q: Where do the brainstorm inputs come from?
- Asked because: the seed set must be enumerated before elicitation.
- Answer (2026-10-28): the owner's own notes (to be pasted), a handover from another chat, and the
  ISWC 2026 notes in the owner's Obsidian vault — `01 Projects/2026-10-16 ISWC 2026/`,
  `03 Resources/ISWC 2026 *.md`, and the adjacent `vault-files/2026-10-16 ISWC 2026/` (papers,
  photos, examples).

## Q: What scope and shape does the work take?
- Asked because: appetite and delivery shape.
- Answer (2026-10-28): a huge EPIC on reasoning and learning, named "reasoning capabilities",
  implemented later through a few subsequent EPIC changes; now, brainstorm systematically and store
  the inputs.
- → DEC-1

## Q: How should the exploration run, and what should it produce?
- Asked because: the owner went AFK and asked for autonomous work.
- Answer (2026-10-28): start from the handover `Reasoning and learning skills.md`; challenge and then
  strengthen its ballpark solutions under KISS and YAGNI (elegant, maintainable, useful); proceed
  without waiting for approval; produce complete research plus a summary of the child EPICs (what,
  how executed, solution or variants, open research questions); be pragmatic; subagents allowed.
- → shapes DEC-2..DEC-7, all *proposed* until the owner confirms (see
  `2026-10-28-research-synthesis.md` §6).

## Q: Do you accept the KISS cut in the research synthesis? (synthesis §6, all six questions)
- Asked because: the synthesis proposed cutting the handover's design down to three children; only
  the owner can approve the cut.
- Answer (2026-10-29), the owner's points, condensed:
  1. The cut is accepted, but each EPIC pitch will be revised and fine-tuned.
  2. **Rule learner:**
     - It learns not only from corrections but from any statement that sounds like a rule, using the
       handover's rule types.
     - It needs solid rule management and classification infrastructure, and rule-usage
       infrastructure, which should be Langfuse.
     - It is a simple, small symbolic rule and preference learner. Rule patterns are specified in the
       skill, and rules are maintained, forgotten and newly learned against them.
     - It needs a proper set of skills that learn, forget, groom, and monitor rule use from Langfuse
       traces and stats. Langfuse must be configured and accessible.
     - Rules are approved per session and revised per week.
     - Not tied to offer creation: reasoning and dialectic are not needed there.
  3. **Playbooks:** they have no home in the vault today. `08 How to/` is a good place for both the
     playbooks and the rules repository, well organised and groomed.
  4. **Reasoners:** how easy clingo, SWI-Prolog or other reasoners are to install is separate from
     how they are used. Keep both, for different types of reasoning, in one reasoning skill in the
     modelling and architecture bundle.
  5. **Elenchus:** also in the architecture bundle, as a new skill marked experimental. Build a
     production-ready trial skill, to be tested later, relying on the requirements and
     specifications of the Elenchus paper and software.
  6. **Langfuse:** a short specification the owner can pass on to the infrastructure stacks repo.
  7. **CQ testing:** the owner asked "how would you test competency questions? why in linkml?"
     Answered in-session: a CQ becomes a query with an expected answer agreed beforehand, run over
     fixture facts. It moves to `formal-reasoning` as a pattern.
- → umbrella DEC-2..DEC-4; rule-learner DEC-1..DEC-6; formal-reasoning DEC-1..DEC-3;
  dialectical-elicitation DEC-1..DEC-3. The synthesis's proposals to drop Prolog, Langfuse and the
  Elenchus skill are **superseded** by these answers. The synthesis is kept as written (secondary
  input).

## Q: What about the Elenchus server and talks the owner found?
- Asked because: the owner pointed to https://github.com/bradleypallen/elenchus-server and two talks
  (`talks/elenchus_aiaa4ke_talk.pdf`, `talks/elenchus_role_talk.pdf`) after the pitches were written.
- Answer (2026-10-29): postpone the Elenchus EPIC and write it down. Now that a server exists, decide
  how to set it up before re-shaping the pitch.
- → umbrella DEC-5; `dialectical-elicitation` marked POSTPONED. Research on the server and talks goes to
  `dialectical-elicitation/inputs/2026-10-29-elenchus-server-and-talks.md`.

## Q: How is elenchus-server set up? (options 1–4 in-session)
- Asked because: the postponed EPIC needed a setup decision before it could be re-shaped.
- Answer (2026-10-29): **option 1 and option 2**.
  - Option 1: the skill re-implements the minimal core ⟨[C : D], T, I⟩ with the host agent as opponent, and the server is a reference specification only.
  - Option 2: one local server trial on the owner's laptop, run before re-shaping.
  - Options 3 (a shared hosted instance) and 4 (the skill as a REST client) are not taken.
- → `dialectical-elicitation` stays postponed until the local trial; runbook in
  `dialectical-elicitation/inputs/2026-10-29-local-server-trial.md`.
