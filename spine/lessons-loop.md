# The lessons-learned → skill-evolution loop

The spine is only as good as its ability to **learn from each engagement**. This
loop turns delivery experience back into the catalogue, so skillery compounds.

## The loop

1. **Run the spine** on an engagement (or an internal EPIC). Deliver the work.
2. **Retro** — at the EPIC boundary, write a short *"what we'd encode
   differently"* note: what the schema, the PLAN shape, the golden thread, or a
   skill made harder than it should have been; what a skill should have known.
3. **Open a PR against the relevant skill** (or the spine schema/docs) encoding
   that lesson — small, reviewable, single-fact (one skill = one source of
   authority, per [`../CLAUDE.md`](../CLAUDE.md)).
4. **Gate it** — `make validate` must pass; the change is reviewed like any
   other catalogue change.
5. **Archive the note** with the engagement's change inputs for traceability.

## Where notes live

- Engagement-local: `changes/<id>/inputs/lessons.md` (preserved, never groomed).
- Cross-engagement themes that recur graduate into a skill edit or a new skill
  (following [`../spec/CREATING_SKILLS.md`](../spec/CREATING_SKILLS.md)).

## Running the loop on ourselves

Running the spine on **this very series** (skillery's own EPICs) *is* the loop
the method applied to itself — the internal reference run (EPIC-00 §6, Q0.3=C). The first real
client engagement then stress-tests the consulting tier. Hard questions raised
mid-flight are parked in [`../.claude/HARD-QUESTIONS.md`](../.claude/HARD-QUESTIONS.md)
and a PLAN's `design.md` Open Questions, not guessed.
