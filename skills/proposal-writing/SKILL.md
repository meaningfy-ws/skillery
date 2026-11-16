---
name: proposal-writing
description: "Produce the proposal + Statement of Work (SoW) that frames the paid Proof of Value offer — with an explicit in/out scope boundary, priced as a fixed frame. It frames the Proof of Value offer for a qualified need (qualification is `sales-qualification`), prices it (delegating the numbers to `estimation`), and writes the proposal + SoW. It OWNS proposal/SoW production and the scope-boundary discipline; it DELEGATES pricing/effort to `estimation`, executive framing to `executive-communication`, and the Proof of Value deliverable definition to `decision-package`. Triggers — \"write a proposal\", \"draft the SoW / Statement of Work\", \"scope boundary for this engagement\", \"fixed-cost proposal\", \"frame the Proof of Value offer\". Not for producing the Decision Package itself (that is `decision-package`), not for free presale (that is `semantic-consulting-coach`)."
license: Apache 2.0
metadata:
  purpose: proposals
  area: sales
  subject: semantic-data
  posture: profiled
  stage: sell
  maturity: stable
---

# Proposal Writing

A proposal drifts into open-ended discovery at a day rate with a vague "out" list; this skill
holds it to a bounded Proof of Value, an explicit in/out scope boundary and a fixed-frame price.
It is provisional until the first paid engagement is sold and delivered: refine it then.

## Quick Start

Input: a deal `sales-qualification` handed over; the agency's data lead asks "which vocabulary do
we adopt first, and why?". `estimation` returns 9.17 person-days plus 1.57 contingency, a fixed
frame of 11 person-days, excluding implementation and data migration.

Output: a proposal in SCQA form whose recommendation is "run the Proof of Value", whose deliverable
is the Decision Package, and whose price is the 11-day fixed frame; and a SoW whose section 4 (out)
lists Scaling, implementation and data migration (the estimate's exclusions, word for word), whose
section 8 holds the stop/extend mechanics, and whose section 9 names the clean handover.

## Workflow

**Inputs:** presale notes and prospect context (the qualification signals the coach surfaced).
**Output:** a proposal + SoW with an explicit in/out scope boundary, priced as a fixed frame.

1. **Qualify the need.** Confirm the prospect has crossed the free→paid boundary — they are asking
   *"what do we do first, and why?"*, not *"is this relevant?"*. If they have not, this is still
   presale; do **not** write a paid Proof of Value proposal yet (see the boundary discipline in
   `semantic-consulting-coach`: engagement model). Capture the
   problem, the deciding persona, the measurable outcome, and the constraints.
2. **Frame the Proof of Value offer.** State what the Proof of Value delivers — the Decision Package (recommendation,
   in/out scope, pilot→scale roadmap, buy/build/defer, ready-to-contract execution brief; see
   `decision-package`). Frame it answer-first as the offer that makes
   committing safe, not as open-ended discovery.
3. **Price it as a fixed frame** — via `estimation`. Hand `estimation` the
   work breakdown the offer implies; take back the effort range, the contingency, and the
   assumptions/exclusions. The SoW scope boundary and the estimate's exclusions are the **same list**
   — keep them in lock-step (the first rule below).
4. **Write the proposal + SoW.** Copy the templates
   [`assets/proposal-template.md`](assets/proposal-template.md) and
   [`assets/sow-template.md`](assets/sow-template.md). Write the proposal in the executive
   voice (`executive-communication`);
   write the SoW as the contractual companion that pins scope, deliverables, price, and exclusions.

## Rules

The **explicit in/out scope boundary** is the discipline this skill owns. The "out" list is not
filler: it protects the boundary with the build tier (Scaling is *always a separate engagement*)
and pre-empts scope creep on a fixed-frame price.

- **The SoW "out of scope" list = the estimate's exclusions.** They are one list in two documents.
  If `estimation` excluded it from the number, the SoW must exclude it from the commitment.
- **Name the clean handover.** State that Scaling is separately scoped and priced — the proposal
  earns the right to say *"from here, we can execute, or you can take this and execute with someone
  else."*
- **Price as a fixed frame**, a bounded commitment, not an open day-rate. The price comes from
  `estimation` (PERT-weighted effort + contingency); this skill wraps it with the **stop/extend
  mechanics** so the frame stays honest: if agreed outcomes cannot be reached for reasons outside
  our control, the SoW already names the option to reduce scope, take a short extension, or stop
  cleanly with partial delivery — never silent overwork (the boundary safeguard of the engagement
  model in `semantic-consulting-coach`).
- **Voice.** British English. The proposal is an executive artefact: answer-first, concise, every
  claim load-bearing; scope boundaries and trade-offs explicit, never hedged; the engagement's
  executive voice (`executive-communication`), not consultancy-bland. The SoW is its contractual
  companion: precise, enumerated, no marketing prose.

## Before you hand over

Read `references/scope-boundary-checklist.md` before the proposal and SoW ship: it holds the
in-scope, out-of-scope, fixed-frame and handover checks, and the one invariant they serve.

| Question | If not | Action |
|---|---|---|
| Has the prospect asked "what do we do first, and why?" | it is still presale | stop; coach with `semantic-consulting-coach` |
| Does the proposal open with the recommendation? | the reader hunts for the offer | rewrite answer-first (`executive-communication`) |
| Is every price traced to an `estimation` worksheet? | the frame is a guess | run `estimation` first |

## Boundary & Related Skills

**This skill OWNS:** producing the **proposal + SoW**, and the **scope-boundary (in/out)
discipline** — including the fixed-frame framing and the stop/extend mechanics that keep the frame
honest.

**This skill DELEGATES:**
- Pricing / effort / contingency numbers → `estimation` (the entry flow
  invokes it; it also stands alone).
- Executive framing and voice (SCQA, Minto pyramid, answer-first) →
  `executive-communication`.
- The Proof of Value deliverable definition (what it actually produces) →
  `decision-package`.
- Coaching whether/how to run the Proof of Value and holding the free→paid boundary →
  `semantic-consulting-coach`.

**Related:** `estimation`, `decision-package`, `sales-qualification` (hands over the qualified deal and its dossier), `sales-conversations`, `executive-communication`, `semantic-consulting-coach`, `writing-antipatterns` (Contract/specification genre failure modes for the SoW half of this skill's output), `contract-practice` (the contract that follows an accepted offer).

Answers `VER, RSK` in `test-strategy`'s matrix (`references/generic-writing.md`).
