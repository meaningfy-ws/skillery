---
id: UC-W14
title: Business coach and strategic partner
primary_actor: the owner
trigger: a strategic or tactical business question comes up, or a pitch or plan is due
success_guarantee: the owner has a decision or artefact for the question (canvas, business plan, pitch) that follows "less is more"
area: business
served_by:
  agents: []
  skills:
  - semantic-consulting-coach
status: partial
change: add-business-partners
---

# UC-W14 Business coach and strategic partner

## Brief Description

Business coach and strategic/tactical partner: becoming a successful businessman, out of cash-flow issues, then scaling; business and lean canvases, business plans for grant schemes, angel and VC pitches. "Less is more"; specific pitch skills later. Only a client-facing coach exists.

## Stakeholders and Interests

- **The owner:** clear decisions on cash flow, growth and funding, and artefacts that win support.
- **The company and its people:** a business that pays its way and then grows.
- **Funders (grant schemes, angels, VCs):** a plan or pitch that is short, honest and complete.

## Preconditions

The owner states the question or the artefact due. For a grant plan or a pitch, the scheme's or the
investor's requirements are in hand.

## Minimal Guarantees

The coach does not decide for the owner and does not draft before the thinking is ready unless asked.
Every figure it did not receive is marked as an assumption.

## Main Success Scenario

1. The owner brings a question or an artefact that is due (a canvas, a business plan, a pitch).
2. The coach names the layer the question sits in and asks before proposing (exploration mode).
3. The owner answers; the coach reflects back the situation and the decision it implies.
4. The coach and the owner align on the option to pursue and its risks (alignment mode).
5. **[human]** The owner asks for the artefact.
6. The coach drafts it, "less is more": a decision note, a business or lean canvas, a plan section or
   a pitch outline, structured with `executive-communication`.
7. The coach returns the draft with its assumptions and open risks.
8. **[human]** The owner decides and uses it.

## Extensions

- 1a. The question is about Meaningfy's own semantic consulting business (service design, pricing,
  partnering, engagement process): `semantic-consulting-coach` serves it as it stands.
- 1b. The question is generic business (cash flow, scaling, funding): outside that skill's domain;
  planned for the `business-coach` agent.
- 2a. The owner asks for an answer at once: the coach names what it does not yet know and asks the one
  question that matters most before answering.
- 6a. A grant scheme or an investor prescribes a template: the coach follows it; without one, it
  returns the question.

## Out of Scope

Negotiation (UC-W13), commercial structure and offer (UC-W12), market research (UC-W11), client-facing
advisory (UC-W22), proposals (UC-W8), personal growth (UC-W2), and pitch visuals (UC-W17).

## Artefacts

- The coaching conversation and, on request, the synthesis (Markdown) in the owner's working folder.
- Planned: canvases, business-plan sections and pitch outlines, and where they are kept
  (`add-business-partners`).

## Evidence

- `tests/trigger_probes.yaml`: the `semantic-consulting-coach` probe.
- Planned: `tests/features/agents/business-coach.feature` (`add-business-partners`) and an outcome
  suite under `tests/evals/` (`evaluate-catalogue`).

## Feedback Loop

A session where the coach drafted too early or asked the wrong question becomes a Defect issue; it
ends as a row in the coach's defection table or question bank. Pitches and plans the owner used are
kept as examples for the pitch slice.

## Slices

1. Coaching on Meaningfy's own consulting business decisions: released (`semantic-consulting-coach`
   in `meaningfy-consulting`).
2. General business coaching, canvases and grant business plans: planned (`add-business-partners`).
3. Angel and VC pitches: planned, later (`add-business-partners`).

## Open Points

**Confidence:** medium. Slice 1 restates a released skill; slices 2 and 3 extrapolate from the brief.

- Should `business-coach` reuse `semantic-consulting-coach`'s method and modes, or be a separate
  coach with its own?
- Which grant schemes and pitch examples are the first material?
- Where do the owner's business decisions live: the vault, Odoo or Confluence?
