# Routes: what each pipeline adds

The stages, their *In this stage / Exit when* text and days to rot are in
[`../assets/pipelines.yaml`](../assets/pipelines.yaml) and in Odoo. This file holds only what each
route adds on top: etiquette, scores and specifics.

## Route: Direct Consulting

- The first contract is usually the discovery workshop; a Proof of Value and scaling follow as new deals.
- B2G direct procurement belongs here; once a formal tender is published, propose moving the deal to Calls & Tenders.
- The free → paid line (what we may give away before a paid step) is owned by `semantic-consulting-coach` (`engagement-lifecycle`); anything beyond it is *ask first*.

## Route: Consulting via Partner

**Our buyer is the partner as much as the client.**

- **The partner reviews client text first.** Any client-facing text goes to the partner contact for review unless the partner has agreed to direct contact. Never contact the partner's client behind the partner.
- **The partner's frame and branding lead.** We are the specialist inside their story.
- **Never quote below the partner.** Never quote the client below the partner's price, and never discuss our rates with the partner's client.
- **Give partners what they ask for.** Partners often need sizes and price ranges to sell us. Give the approved ranges (`offer_catalogue` in `sales-config.yaml`); anything else is *ask first*.
- **Register the deal** if the partner has a deal-registration process.
- **Every draft answers one question:** how does this make the partner's account manager look good?
- **Whose turn.** When the partner asked us for something (an offer, CVs, a credentials table), the next move is ours: deliver it before anything else.
- At the get-to-know meeting, clarify the commercial model (subcontract, referral, co-delivery) and who pays the workshop.
- The end client is qualified with the five Ps (`sales-qualification`), as far as the partner shares it; the stars follow. The partner is qualified in the *Partner* block.
- The dossier's *Partner* block is mandatory here: partner, role, partner contacts and their stake, commercial model, what the partner needs from us (CVs, references, price, availability), and who talks to the client.
- Link the deal to the partner's record in Partnerships with an internal note on both. A won deal here can make that partnership *Won – first joint client*; that move is *ask first*.

## Route: Calls & Tenders

Deadline-driven: the procurement rules or the funder set the pace. Our role (prime, consortium member, subcontractor, coordinator) goes in the deal name or the dossier.

**Tender etiquette** (from publication to award):
- **Contacting the contracting authority.** Only through the call's official clarification channel, in writing. Never draft outreach to the authority's staff about the call. Meetings, market consultations and information days held before publication are fair game.
- **Writing the bid.** Write to the scoring grid: one section per award criterion, with evidence for each; check the submission criterion by criterion against the call's requirements.
- **Before a consortium or subcontracting draft.** Check the call's rules on taking part in several bids, on subcontracting shares and on conflicts of interest. If unclear, ask the owner.
- **Persuasion.** No sales techniques: no scarcity, urgency, bonuses or guarantees. The value proof lives inside the call's rules. Hormozi and Voss tactics are not used here (`sales-conversations`, selling method).

**Go/no-go score.** Written as a scorecard for the owner's decision within 3 days. Each criterion 0–2 (total 0–8), in the dossier's *Attention score*, one line each with its source; the stars follow (`SKILL.md`, *Stars*). Eligibility of our role is a gate, not a score: if we are not eligible, it is a no-go. A no-go is proposed as lost (*ask first*), not starred.

| Criterion | 0 | 1 | 2 |
|---|---|---|---|
| **Fit** with our services and references | weak | partial | strong, with a reference per main criterion |
| **Chance to win** | low (incumbent, price-driven) | open | good (known buyer, criteria that favour quality) |
| **Effort** (inverted: lower effort scores higher) | heavy for the value | moderate | light for the value |
| **Partners needed** | missing and hard to find | identified, not confirmed | none needed, or confirmed |

**Specifics**
- The submission deadline is an activity of type *Deadline*, due on that date; every run checks deadlines in the next 14 days first. The result date, once the authority states it, is the deal's expected closing date (stage *Submitted, awaiting result*).
- The tender-watch mechanism lives elsewhere; this route starts when a call reaches Odoo.
- MEDDPICC maps onto the call documents: the paper process is the call, the economic buyer is the authority or funder, and the competition is the other bidders.

## Route: FWC Execution

- Every order is with a partner (the framework's lead or consortium); the framework itself was won in Calls & Tenders.
- The reply date of a request for offer is an activity of type *Deadline*. Orders here are not starred: every request for offer under a won framework matters.
- Name the framework in the dossier; the request for offer is the paper process.
- A deal here with no request for offer for a long time may really be a prospect for a framework: propose moving it.

## Route: Partnerships

One pipeline for every partner type, told apart by tags: *Partnership - Vendor* (tool vendors, such as graph-database or knowledge-graph platforms), *Partnership - Consulting/Subcontractor* (consultancies using us as subcontractor, from boutiques to the large audit firms), *Partnership - Introducer* (business development partners who bring clients). A partnership is a success **only when a client is signed together**; that client deal lives in Consulting via Partner or Calls & Tenders.

**Partner value.** A partner is worth the clients it can bring us, not how easy it is to get in. Each criterion 0–2 (total 0–8) in the dossier's *Attention score*, one line each with its source; the stars follow (`SKILL.md`, *Stars*).

| Criterion | 0 | 1 | 2 |
|---|---|---|---|
| **Reach**: partner size and the clients it serves | small, few clients | mid-size, regional | large, with an installed base of big clients |
| **Client wealth**: what those clients can spend | small budgets | mid-market | large enterprises, banks, pharma |
| **Tool maturity**: is the product established in production? | early | used, still growing | established, widely deployed |
| **Complementarity**: do we complete or compete with their services? | we compete | we partly overlap | we complement: they need what we do |

The owner's own ratings of named partners live in `partner_notes` of `sales-config.yaml` (read only), never here; they calibrate the score, they do not replace it. Difficulty of getting in is not scored: it shows in the stage and in how long the record stays there. The ★★★ partners are the priority partners. The *Deals by partner* view in Consulting via Partner feeds *Reach*: a partner that actually brings deals moves up.

**Specifics**
- All standard commercial models are accepted (referral fee paid or received, subcontracting, licence resale, co-delivery); record the one in play.
- No joint deal within the dormancy period after the agreement (`sales-operations`, *Terms*): propose an activation step (joint target list, co-selling call, updated capability statement).
