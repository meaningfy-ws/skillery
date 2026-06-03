---
name: executive-communication
description: Use when turning rough input into a clear, concise, persuasive executive message or analysis — a board paper, proposal, client recommendation, email/Slack note, spoken narrative, slide outline, or a strategic problem to be solved. Triggers include "structure this", "make this persuasive", "write this up for a board/client", "turn this into a recommendation", "tighten this message", or any request for McKinsey-style / Minto / SCQA / pyramid communication. Not for casual chat or code.
license: Apache 2.0
version: 1.0.0
---

# Executive Communication

## Overview

Transform any input into a clear, concise, persuasive message using McKinsey-
style thinking and structure. **Core principle: lead with the answer, then prove
it.** Busy readers decide in seconds — give them the takeaway first and let the
logic support it, never the reverse.

This is a **reference + technique** skill: apply the default structure below to
every message unless told otherwise.

## When to use

- Drafting or tightening a board paper, proposal, client recommendation, memo, email, or Slack note.
- Preparing a spoken narrative or a slide outline.
- Solving an analytical / strategic problem and turning the findings into a recommendation.

## When NOT to use

- Casual conversation, code, or a quick factual lookup.
- When the thinking isn't ready — if you cannot state the Governing Thought in
  one sentence, the message isn't ready to write. Sharpen the thinking first.

## Default structure (apply unless told otherwise)

Order: **Governing Thought → SCQA/SCR → Minto Pyramid → logic checks →
implications / risks / next steps.**

### A. Governing Thought (the key takeaway)
A single, concise, **actionable** sentence summarising the whole message. Assume
the audience has 10 seconds; if they remember only this, the message still
succeeds.

- ❌ Topic: "Our regional team structure."
- ✅ Governing Thought: "Consolidate the three regional teams into one shared-services hub by Q3."

### B. Introduction — SCQA (or SCR for short messages)
Frame *why the audience should care* before the answer.

| Element | SCQA | What it does |
|---------|------|--------------|
| **S**ituation | Neutral, factual, indisputable context | Establishes common ground |
| **C**omplication | The tension / obstacle creating urgency | Creates the need to act |
| **Q**uestion | The natural "so what?" | Names the decision |
| **A**nswer | A brief restatement of the Governing Thought | Resolves it; sets up the body |

**SCR** (Situation → Complication → **Resolution**) is the compressed form for
30–60-second or 3–5-sentence messages — the answer lands at the end.

### C. Body — Minto Pyramid
```
            Governing Thought (the answer)
           /            |              \
   Subpoint 1       Subpoint 2       Subpoint 3      (Level 2: MECE buckets)
   /     \          /     \          /     \
 evidence evidence ...    ...      evidence evidence  (Level 3: data, logic, examples)
```
- **Rule of 3:** default to three subpoints unless a different number is clearly superior.
- Each subpoint **complete, distinct, non-overlapping** (MECE).
- **Thematic grouping:** finish one topic before the next — no topic-switching.
- Within a bucket use **either** deductive (general → specific) **or** inductive
  (specific → general) reasoning — **never mix** the two inside one bucket.

### D. Logic checks (run both before delivering)
- **Vertical:** every detail supports the subpoint above it; every subpoint supports the Governing Thought.
- **Horizontal:** subpoints are MECE and in a deliberate order (importance, sequence, cause → effect).

### E. Implications, risks, next steps (always close with these)
1. **Implications** — what this means for the key stakeholders, teams, clients, or organisation.
2. **Risks / assumptions & mitigations** — name the constraints and uncertainties explicitly, and how each is bounded.
3. **Recommended next steps** — 3–6 actionable steps, prioritised **Immediate / Short-term / Medium-term**.

## Problem-Solving Mode (activate for analytical / strategic tasks)

When the task is analysis, not just messaging, run the McKinsey 6-step process,
then convert the result into the default structure above.

1. **Define the problem** — root causes vs. symptoms; constraints; time horizon.
2. **Dissect it** — break into parts with a MECE logic tree / pyramid.
3. **Prioritise levers** — greatest impact; flag what is outside our control.
4. **Work plan** — workstreams, analyses to run, stakeholders, data needed.
5. **Analyse** — present findings, or reasoned assumptions where data is absent.
6. **Synthesise → recommendations** — Governing Thought + Pyramid + SCQA.

## Voice

Write in the **company voice**, not corporate-bland. The default profile is in
`references/company-voice.md` (Meaningfy's voice, grounded in its SMILE values);
apply it unless the user names another voice. Two rules matter most here:

1. **Register follows purpose.** Teaching something technical? Use the analytical,
   example-rich register. Driving a decision? Use the concise executive register.
   Either way the **structure never changes** (Governing Thought, SCQA, pyramid).
2. **Concision wins for decisions.** The technical register's longer sentences
   suit explainers, not board papers. Never trade answer-first clarity for texture.

Hard constraints: British English; no em dash; plain, current vocabulary; honest
about trade-offs and unknowns. Full guidance and examples in `company-voice.md`.

## Optional formats (only if explicitly requested)

| Request | Produce |
|---------|---------|
| Spoken version | 30–60-second narrative |
| Slide-ready | Outline, ~1 slide per major subpoint |
| Email / Slack | Shortened SCR + Governing Thought |
| Long-form | Full report version |

## Format selection (quick reference)

| Audience / artefact | Recommended frame |
|---------------------|-------------------|
| Board / executive decision | Governing Thought + SCQA + 3-line Minto + implications/risks/next steps |
| Proposal | SCQA + Minto; trade-offs and scope boundaries explicit |
| Email / Slack / opener | SCR + Governing Thought only |
| One-page canvas | Governing Thought as title; MECE subpoints as sections |

## Common mistakes

- **Burying the answer** — building up to the conclusion instead of leading with it. Lead with the Governing Thought.
- **A topic, not a thought** — "our pricing" is a topic; "raise list price 8% and grandfather existing clients" is a Governing Thought.
- **Overlapping buckets** — subpoints that double-count. Re-cut until MECE.
- **Mixed reasoning in one bucket** — deductive and inductive jumbled. Pick one per bucket.
- **No close** — stopping at the argument without implications, risks, and next steps.
