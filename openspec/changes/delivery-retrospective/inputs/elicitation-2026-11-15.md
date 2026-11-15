# Elicitation — retrospective tooling, 2026-11-15

**Status:** secondary input, never groomed. The question round of the shaping session for this
EPIC. The scope came from the owner's session brief: a new skill holding the two scripts in its
`scripts/` folder, and phase and stage recorded in the traces; the result line is
`delivery-process-and-tools` DEC-18, not this EPIC's (reassessment S-8).

## Read before asking

The four seeds and both scripts in this folder; `delivery-process-and-tools` (proposal, handover)
and its `inputs/reassessment-2026-11-15.md`; the lean standard in
`docs/development/creating-skills.md`; `docs/environment/langfuse-setup.md`; the navigator's events
(`docs/development/mods.md`, *Events and signals*).

## Questions and answers

| # | Question | Options offered (recommended first) | Answer |
|---|---|---|---|
| 1 | Appetite | MEDIUM: the lean skill, tests, docs, the mark written by two skills, the scripts read the mark and the result line · SMALL: move the scripts only, phase from what exists · LARGE: also a Langfuse reader, opencode sessions, a run at every archive | MEDIUM |
| 2 | What must the EPIC prove (test-scenario interview) | Script tests in `make validate` on synthetic transcripts · the marker beats the guess, with a "guessed" label and its share of cost · one real run over 14 days, under a minute, totals within a tolerance of the 2026-11-14 findings, evidence without transcript text · an agent scenario for the mark | All four |
| 3 | Risks to mitigate (unpicked = accepted) | Private text leaks (skillery is public) · transcript format drift · agents skip the mark (a navigator warning) · owner-specific paths in `repo_of` | All four mitigated |
| 4 | How phase and stage reach the traces | A plain mark line written by the lead, like the result line · a script command (its own Bash span) · derived only from the hand-over prompt and branch · the navigator writes it | A plain mark line |

## What the agent decided without asking, for the owner to see in the EPIC

- The skill's name `session-retrospective`, in the `meaningfy-building` bundle.
- The mark's form lives beside the result line in `epic-delivery`; `epic-planning` cites it.
- Archive and release write no mark: their skills are distinct enough for the guess, which stays
  labelled. Fewer skills edited.
