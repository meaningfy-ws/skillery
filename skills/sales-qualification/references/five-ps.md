# Five Ps: the qualification verdict

MEDDPICC ([meddpicc](meddpicc.md)) is the depth: what we know and what to ask next. The five Ps are the **verdict derived from it**: is this deal worth pursuing now? They are not a second questionnaire. Every P is read from the dossier, so the two can never disagree.

**Where it applies:**
- Direct Consulting: in full.
- Consulting via Partner: on the end client. The partner is qualified separately, in the dossier's *Partner* block.
- Not in Calls & Tenders (the go/no-go score applies), Partnerships (partner value applies) or FWC Execution (not scored). The stars of every pipeline are owned by `sales-pipeline-custody`.

## The rubric

Each P scores 0, 1 or 2, so the total is 0–10.

| P | Read from (dossier) | 0 | 1 | 2 |
|---|---|---|---|---|
| **Pain** | MEDDPICC *Pain* | none named | general ("data silos") | a concrete broken term, failed integration or failed AI pilot, in their words |
| **Priority** | MEDDPICC *Initiative*, plus *Metrics* | no initiative | planned, unfunded | a named, funded programme (FAIR, data platform, AI, regulation) with a date |
| **Power** | *Economic buyer* + *Champion* | unknown | champion, buyer unknown | champion and a named economic buyer, or the buyer themselves |
| **Plan** | *Decision process* | "some day", or unknown | next fiscal year | this quarter or next |
| **Fit** | *Offer*, the disqualifiers below, *Competition* | a disqualifier applies | partly | one domain, several systems, standards-minded; fits the discovery workshop |

## Scoring rules

1. **Every P cites its source**: a mail, meeting note, Odoo record or page. Inferences are marked as inferences and score at most 1.
2. **Unknown scores 0 and is OPEN.** The score always shows how many Ps are OPEN, in this form: `5/10 (Pa2 Pr0 Po1 Pl1 Fi1; 2 OPEN)`. A low score with OPENs means "we do not know yet". The next action is then the question that closes the weakest OPEN P, never a close.
3. **An explicit ask** from the client puts the deal in the pursue band, whatever the score. Examples: "send us a proposal", "introduce us to our head of data". Quote the ask.
4. **Leads get a provisional score** from the short dossier, marked *provisional*. On conversion to an opportunity the score is redone with the new evidence.
5. **Rescore** after every meeting, every reply that changes a P, and in every sweep (`sales-operations`, *Terms*). A band that falls is reported in the run note with the P that dropped and its evidence.

## Disqualifiers

Any one of these sets Fit to 0 and leads to a close-or-redirect decision card (*ask first*, as every lost):
- they want free consulting or a free pilot;
- they need deep domain-standard delivery we cannot staff yet (for example CDISC, IDMP, Allotrope); offer a partner or a later conversation instead;
- they want a product licence or a body shop, not an outcome;
- the only contact is procurement, with no access to the programme.

## Bands

| Band | Score | Meaning | What the agent does |
|---|---|---|---|
| **Pursue** | 7–10, or an explicit ask | worth full attention now | full dossier; a dated next step towards Discovery; first in the open-day plan |
| **Nurture** | 4–6 | real, not ready | one useful touch every 6–8 weeks within the cadence of `sales-conversations`; each touch aims at the weakest P |
| **Not now** | 0–3, at most one OPEN, after a held meeting | not worth pursuing now | a decision card: lost or nurture, with the reasons (*ask first*) |

A deal at 0–3 with two or more OPENs is not judged yet: it stays unstarred and its next action is the question.

Conversion does not depend on the score: a lead becomes an opportunity on a cited two-way signal (`sales-pipeline-custody`, *Leads and opportunities*). The band decides what happens next.

The band is mirrored in the deal's Odoo stars by `sales-pipeline-custody` (*Stars*).

## In the dossier

```
## Five Ps
Score: 6/10 (Pa2 Pr1 Po1 Pl1 Fi1; 1 OPEN) · band: nurture · scored YYYY-MM-DD
- Pain 2: "<their words>" (mail of <date>, thread <id>)
- Priority 1: AI programme planned for next year, budget not confirmed (call of <date>)
- Power 1: champion <name (#id)>; economic buyer OPEN: "Whose budget would this come from?"
- Plan 1: next fiscal year (call of <date>)
- Fit 1: two domains named, no standards discussed yet (inference)
Explicit ask: none
```
