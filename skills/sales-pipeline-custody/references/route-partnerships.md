# Route: Partnerships

The partner relationship from first contact to the first client signed together. One pipeline for every partner type, told apart by tags: *Partnership - Vendor* (tool vendors, such as graph-database or knowledge-graph platforms), *Partnership - Consulting/Subcontractor* (consultancies using us as subcontractor, from boutiques to the large audit firms), *Partnership - Introducer* (business development partners who bring clients). A partnership is a success **only when a client is signed together**; that client deal lives in Consulting via Partner or Calls & Tenders.

| Stage | Typical agent work |
|---|---|
| Identified | type, why them, a contact; draft the first conversation request |
| Fit & contact | mutual value: who has our clients, what they need from us; a champion on their side |
| NDA & enablement | NDA; vendors: who on our team takes which training or certification; service providers: capability statement, CVs, supplier registration |
| Agreement | partnership, teaming or referral agreement |
| Co-selling | joint target accounts, introductions, joint events; each joint opportunity is a deal in its own pipeline |
| Won – first joint client | keep co-selling |

Days to rot per stage: [`../assets/pipelines.yaml`](../assets/pipelines.yaml).

## Partner value

A partner is worth the clients it can bring us, not how easy it is to get in. Score each criterion 0–2 (total 0–8) in the dossier's *Attention score*, one line each with its source; the stars follow (`SKILL.md`, *Stars*: 6–8 ★★★, 4–5 ★★, 0–3 ★).

| Criterion | 0 | 1 | 2 |
|---|---|---|---|
| **Reach**: partner size and the clients it serves | small, few clients | mid-size, regional | large, with an installed base of big clients |
| **Client wealth**: what those clients can spend | small budgets | mid-market | large enterprises, banks, pharma |
| **Tool maturity**: is the product established in production? | early | used, still growing | established, widely deployed |
| **Complementarity**: do we complete or compete with their services? | we compete | we partly overlap | we complement: they need what we do |

The owner's own ratings of named partners live in `partner_notes` of `sales-config.yaml`, never here; they calibrate the score, they do not replace it. Difficulty of getting in is not scored: it shows in the stage and in how long the record stays there. The ★★★ partners are the priority partners. The *Deals by partner* view in Consulting via Partner feeds *Reach*: a partner that actually brings deals moves up.

**Specifics**
- All standard commercial models are accepted (referral fee paid or received, subcontracting, licence resale, co-delivery); record the one in play.
- Priority partners are the ★★★ partners; the owner's list is in `partner_notes` of `sales-config.yaml` (read only).
- No joint deal within the dormancy period after the agreement (see `sales-operations` (goal loop, *Terms*)): propose an activation step (joint target list, co-selling call, updated capability statement).
