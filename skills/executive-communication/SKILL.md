---
name: executive-communication
description: "Use when turning rough input into a clear, concise, persuasive executive message or analysis: a board paper, proposal, client recommendation, email or Slack note, spoken narrative, slide outline, or a strategic problem to be solved. Triggers include \"structure this\", \"make this persuasive\", \"write this up for a board or client\", \"turn this into a recommendation\", \"tighten this message\", or any request for McKinsey-style, Minto, SCQA, or pyramid communication. Not for casual chat or code."
license: Apache 2.0
metadata:
  version: "1.0.0"
  purpose: content
  area: cross-cutting
  subject: generic
  posture: profiled
  stage: any
  maturity: stable
---

# Executive Communication

**Lead with the answer, then prove it.** This corrects two failures: building up to the
conclusion, and dressing every message in the full apparatus. The tools (Governing Thought, SCQA,
the Minto pyramid) never change; how much of them you deploy matches the artefact.

## Quick Start

Input: "We keep rebuilding bits of our Mapping Workbench on every data-mapping engagement, two
clients asked to license it, but we're a consulting shop. Leadership wants to know whether to
productise it. Write it up for the board."

Diagnosis: the board decides whether to productise; it believes the firm is a consulting business
and fears distraction; recurring revenue plus a small downside would move it. Governing Thought:

> **Productise the Mapping Workbench into a licensed offering by Q4, funded from delivery margin
> and kept as our own accelerator, so it earns recurring revenue without turning us into a
> software vendor.**

The paper: Situation (the Workbench became central to mapping delivery), Complication (we rebuild
it each time and cannot say yes to two licence requests), Question (keep it internal or
productise?), Answer (the Governing Thought). Three MECE subpoints, each with a reason the board can
check: it turns method we own into revenue beyond hours; it holds because the moat is our mapping
method, not the tool; the downside is bounded because we use it regardless. Close: implications
(a product line beside advisory), risks bounded (funded from margin, two reference clients first),
next steps (Immediate: name a product owner; Short-term: define the licensable boundary;
Medium-term: pricing and launch date). Plain words, no em dash.

## Workflow

1. **Diagnose before you structure.** State the register (teach / decide / bind, `meaningfy-voice`),
   then answer: who decides, and what decision do they face (no decision means a status update:
   write it as one and stop)? What do they believe, and what would change their mind? What is the
   one sentence they must remember? That sentence is the Governing Thought; write it first.
2. **If you cannot write that sentence, the thinking is not ready, not the message.** Say what is
   missing, draft the sharpest Governing Thought the input allows, and flag it as a working
   assumption to confirm. Never paper over the gap with structure.
3. **Match the weight to the artefact** (table below).
4. **For an analytical or strategic task**, run McKinsey's six-step problem solving first (define,
   dissect MECE, prioritise levers and flag what is outside our control, work plan, analyse with
   reasoned assumptions where data is absent, synthesise), then pour the result into the structure.
5. **Read it back as the reader** (Before you hand over).

## Rules

| Artefact | What to deploy |
|----------|----------------|
| Slack note, short email, opener | **SCR + Governing Thought.** No pyramid headings, no formal close. Three to five sentences. |
| Proposal, client recommendation | **SCQA + a 3-point pyramid.** Trade-offs and scope boundaries explicit. Short close. |
| Board paper, formal decision | **The full default structure**, with logic checks and the implications / risks / next steps close. |
| One-page canvas | Governing Thought as the title; the MECE subpoints become the sections. |
| Spoken narrative | 30 to 60 seconds: Situation, Complication, then the Governing Thought as the punchline. |
| Slide outline | Roughly one slide per subpoint; each title states the subpoint as a full assertion, not a label. |
| Decision the reader takes later and alone (an approval in a run note, a choose-one email) | **The decision card**: question, deadline, recommendation, options with consequences, graded facts, what "yes" writes. At most 150 words. |

Read `references/decision-request.md` before writing any decision the reader takes later and
alone: it holds the card's exact fields, the rule per field, a before-and-after example and why the
card shows options a persuasive document would suppress.

**The default structure, in this order:** Governing Thought (one actionable sentence, not a topic:
"consolidate the three regional teams into one hub by Q3", not "our team structure") → SCQA, or SCR
for 30-to-60-second and 3-to-5-sentence messages → the Minto pyramid (three MECE subpoints by
default, one topic finished before the next, deductive or inductive within a bucket, never both) →
logic checks (vertical: each subpoint is supported by its evidence and advances the Governing
Thought; horizontal: no overlap, no gap, a deliberate order) → implications, risks with their
mitigations, and 3 to 6 next steps prioritised **Immediate / Short-term / Medium-term**.

**Voice.** The company voice, `meaningfy-voice`, unless the user names another. Register follows
purpose: analytical and example-rich to teach, concise to decide, formal and contractual to bind;
the structure never changes. Concision wins for decisions: never trade answer-first clarity for
texture (the texture of explainers is `explanatory-writing`'s). Hard constraints: British English,
no em dash, plain current vocabulary, honest about trade-offs and unknowns.

**The bland trap.** A structurally perfect message can say nothing. A sentence that could appear in
any consultancy's deck about any client is filler: replace it with the specific number, the real
trade-off or the actual next step. Generic is a defect, not a safe default.

| Mistake | Why it fails | Do instead |
|---|---|---|
| Building up to the conclusion | The reader decides in seconds | Lead with the Governing Thought |
| A topic, not a thought ("our pricing") | Nothing to accept or reject | "Raise list price 8% and grandfather existing clients" |
| SCQA headings and a formal close on a three-line note | Buries the point | Match the weight to the artefact |
| Overlapping or mixed-reasoning buckets | Double-counts, confuses | Re-cut until MECE; one reasoning mode per bucket |
| A board message that stops at the argument | No implications, risks or next steps | Add the close |

## Triggers

- A contractual document (quotation, SoW, tender) → write only its cover message or executive
  summary; its structure belongs to `proposal-writing`.
- Casual conversation, code or a quick factual lookup → do not use this skill.

## Before you hand over

| Question | If not | Action |
|---|---|---|
| Can the reader state the Governing Thought after ten seconds? | The answer is buried or missing | Move it first; sharpen it |
| Does the weight match the artefact? | Over- or under-structured | Use the row of the weight table |
| Does every subpoint survive "why should I believe that?" | Asserted, not supported | Add the evidence or cut the subpoint |
| Could any sentence appear in any consultancy's deck? | Bland filler | Replace with the number, trade-off or next step |
| Is a guessed Governing Thought flagged? | False confidence | Mark it as a working assumption |

## Boundary & Related Skills

**Owns:** the persuasive-communication method — Governing Thought, SCQA, the Minto pyramid, answer-first
structure, the decision card for asynchronous decision requests, and applying the company voice.
**Delegates:** doc prose mechanics → `technical-writing`; the voice profile → `meaningfy-voice`.

See also `clarity-gate` for checking that a spec or EPIC is ready; it judges readiness, not persuasion.

**Related:** `meaningfy-voice`, `proposal-writing`, `sales-operations`, `sales-pipeline-custody`, `sales-accounts`, `sales-conversations` (they ask through the decision card), `decision-package`, `semantic-consulting-coach`, `technical-writing`, `explanatory-writing`, `writing-antipatterns` (Decision/Decision-record genre failure modes).

Answers `VAL, CLR` in `test-strategy`'s matrix (`references/generic-writing.md`).
