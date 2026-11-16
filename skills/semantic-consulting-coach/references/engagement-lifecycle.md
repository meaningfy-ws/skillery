# Discovery & Onboarding

Meaningfy's commercial engagement model: company fact, decided, not a draft. This file states the
stages, maps each to its owning skill and states the boundary that protects it. The coaching frame
for the stages is in [`engagement-model.md`](engagement-model.md).

## The free→paid boundary

**Presale is the only free stage**: everything that produces a deliverable is sold. Presale
answers *"are we even relevant to each other?"*; the moment talk shifts to *"what should we do?"*
or *"build this for us"*, a paid stage has been reached.

## Presale (free, no deliverable)

**Question:** "Is this even relevant to us?" · **Commercial:** free, precisely because it produces
no deliverable.

Mutual recognition. Teach generously but never deeply customise. At the boundary the next step is
Discovery & Onboarding or direct-to-build, not more free discussion.

- **Owner:** [`semantic-consulting-coach`](../SKILL.md) holds the free→paid line and coaches which
  paid path fits.

## Discovery & Onboarding (paid, two depths)

A client's first paid purchase is a **single package sold at two depths**, not two products: a
**discovery workshop** and a **Proof of Value**. Both answer "what should we do, and why?" at a
depth the client chooses.

| Tier | Duration | Best for |
|---|---|---|
| **Discovery workshop** | A 1–2 day workshop | a fast, expert read on the client's situation |
| **Proof of Value** | 4–6 weeks, calendar-boxed | a safe, informed decision about what to build next |

Formerly called the Light and Deep tiers. The step after a Proof of Value is **Scaling**: the build engagement it hands off to.

Both tiers run a gap analysis of where the client is today against its strategic ambition. The
discovery workshop turns it into a fast, expert read and a strategic roadmap. The Proof of Value
turns it into the **Decision Package** (`decision-package`): a recommendation, in/out scope, a
pilot-to-scale roadmap and a buy/build/defer call. This gap analysis is distinct from a formal
semantic and data maturity assessment, a separate, separately sellable service.

**Duration (Proof of Value):** the 4–6 weeks is **calendar-based, not effort-based**, at a fixed
price and fixed duration. Say so beside the number, because the number alone reads as an effort
estimate; the Proof of Value is not priced by a man-day count or a rate card.

**Safeguards:** if, for reasons outside Meaningfy's control (stakeholder availability, information
access, late decision-makers, reorganisations), the agreed outcomes cannot reasonably be reached
within the agreed duration, Meaningfy signals this explicitly and proposes one of exactly three
options: **a scope reduction, a short extension, or a formal stop with partial delivery**, never a
silent overrun.

The skills behind it: `semantic-consulting-coach` coaches which depth fits and holds the
free→paid line; `proposal-writing` is the **entry skill** for the Proof of Value (the offer as a
fixed frame, the **proposal + SoW** with an explicit in/out scope); `estimation` gives it the
numbers; `decision-package` **produces** the deliverable, including the ready-to-contract execution
brief that hands off to a build contract.

**Boundary:** execution is *always* a separate engagement. Discovery & Onboarding earns the right
to say *"from here, we can execute, or you can take this and execute with someone else."*

### Direct-to-build

**Question:** "We know what we want: build it." · **Commercial:** paid, separately scoped.

A client who already knows what they want can buy a build contract directly, skipping Discovery &
Onboarding. Its precondition is an **input condition**, not a gate: the requirements and use-case
elicitation Discovery & Onboarding would have supplied is done, at depth, at the start of the
build contract.

That is not the sales elicitation of presale (pains, fears, values: input to a proposal); it
produces `architecture`'s UC White and UC Blue specifications, and at the business level at most a
sketchy UC White. What follows is the PROJECT and Epic tiers of
`docs/practice/ai-coding/build-lifecycle.md`.

## The outcome: Semantic Layer adoption

Whichever path a client takes, Meaningfy engagements lead to **Semantic Layer adoption**. A
Semantic Layer is not an off-the-shelf deliverable; it is modelled, connected and operated the way
that specific organisation needs, not a generic template dropped in place.

The Semantic Layer decomposes into **building blocks**:

- Modelling / ontology
- Software development
- Data mappings & integration
- Analytics / BI connections
- Agentic framework development
- Training & capability building

A commercial project scopes against **one** block, **several**, or the **whole** Semantic Layer,
always in a controlled, scoped way. The blocks are composable, not fixed contract types in an
order: a client buys exactly the blocks it needs today and may add more later. Each block is
catalogued as a sellable line in `docs/practice/ai-sales/semantic-layer-services.md`.

The hand-off into a build contract is the Decision Package's ready-to-contract execution brief,
which becomes the parent of the first architecture and requirement artefacts; direct-to-build hands
off through its own start-of-contract elicitation.

## Repeat clients

A client who has closed **two or more contracts** is a repeat client, stated as a plain fact, not
a capitalised status label ("Partner") and not a numbered phase. No status is awarded, recorded or
expires.

The relationship work that follows (governance support, semantic operations, capability building,
sustaining and evolving what was built) is **relationship work**, not phase work. **Sales/Presales
leads the repeat-client relationship**, drawing on `executive-communication` for client-facing
messaging and board-level framing.

### Hand-off into the relationship

Once the contract-conformance check (Meaningfy's delivery Definition of Done) closes a contract,
the **Solution Shipper** informs Sales/Presales, who takes the relationship from there
(`docs/practice/roles-and-raci.md` holds the accountability cells). The relationship has no
closing condition; it continues for as long as the relationship does.

## Known gaps

The wider commercial mechanics of the front of the funnel are **not decided yet and must not be
invented here**: qualification criteria for a paid stage, the pre-sale cadence, closing mechanics
around `proposal-writing`, marketing, CRM and lead communication, and fit-for-market (B2B vs B2G
motion). The numbered list of named gaps is the **Known gaps** table of the
`define-blc-engagement-model` proposal, the single place to check.
