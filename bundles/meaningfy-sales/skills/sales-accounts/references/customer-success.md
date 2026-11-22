# Customer success: the account after the win

Selling asks "will they buy?". After the signature the question changes: "are they getting the outcome they bought, and what comes next?". This file is how the agent keeps a won client healthy, growing and willing to vouch for us. It applies to every company with at least one won deal in Direct Consulting or Consulting via Partner (a **client account**). For a partner's client, the partner leads the relationship: the agent prepares, the partner decides what reaches the client.

Client accounts are contacts (`res.partner`), not deals, so they carry no stars. Their attention signal is the **account health** below.

## 1. Desired outcome

From Lincoln Murphy's *Desired Outcome*: what the client must achieve, and how they need to achieve it.
- **Required outcome**: the measurable result they bought, in their words, taken from the deal dossier's MEDDPICC (*Metrics*, *Pain*, *Initiative*). Example: "one authoritative definition of batch across the 25 site databases, used by the AI pilot by Q2".
- **Appropriate experience**: how they need to get there: their involvement, governance, reporting, language, pace. Example: "fortnightly 30-minute steering with the head of data; everything in German; no access to production systems".

Written at the win, from the dossier and the kickoff, into the company profile's *Success plan*. Anything not known is OPEN, with the question for the kickoff.

## 2. Success plan

In the company profile (*Success plan*): the desired outcome; three to five milestones with dates and owners on both sides; how progress is measured; risks and the cover for each; the next step on the offer ladder that the outcome opens. Updated after every outcome review and every delivery milestone.

## 3. Account health

Five signals, 0–2 each (0–10), in the company profile (*Account health*), each with its source and date. An unknown signal is OPEN and counts 0, as with the five Ps.

| Signal | 0 | 1 | 2 |
|---|---|---|---|
| **Outcome progress** | off plan, or no plan | behind on a milestone | on plan, or the outcome reached |
| **Champion** | gone, or silent for a dormancy period | there, less engaged | there, engaged, sharing information |
| **Sponsor access** | the economic buyer is unknown or unreachable | reachable through the champion | met within the last dormancy period (`sales-operations`, *Terms*) |
| **Adoption** | what we delivered is not used | used by the core team only | used and extended by their teams |
| **Sentiment** | complaints, escalation | neutral | praise, in their words |

- **Green** 8–10: keep the rhythm; consider expansion and advocacy.
- **Amber** 5–7: one action on the weakest signal, dated, in the run note.
- **Red** 0–4 (with at most one OPEN): a recovery plan as a decision card under *Decisions needed* (the signal that failed, the proposed action, by when), and an activity within 7 days. With two or more OPENs the account is not judged yet: the action is the question.

**Risks to watch** (Taleb: one event can turn an account): the champion leaves or changes role; a reorganisation; a budget freeze; a new platform vendor; silence after a delivery. Every client account has at least two contacts who know our work.

## 4. Outcome reviews

A short review with the champion (and the economic buyer when possible): at the first delivery milestone, then every dormancy period (`sales-operations`, *Terms*). The champion's relationship activity is this review. The agent prepares a one-page review, as a draft for the owner:
1. the desired outcome, and where they stand against it, in their words;
2. what was delivered, and the value they told us about;
3. what is in the way, and what we propose;
4. the next step on the ladder, **only when the outcome is reached or clearly in sight**; otherwise, the next milestone;
5. one question about their next priority.

After the review: rescore the health, update the success plan, set the next review.

## 5. Expansion

The next step on the offer ladder (owned by `sales-pipeline-custody`) is proposed as a new deal when the outcome is reached or in sight, or when the client asks. A new need found in a review (another domain, another team) is a new deal in its own pipeline, with its own dossier. Selling more to an amber or red account is not proposed; fix the account first.

## 6. Advocacy

References, case studies, testimonials and referrals are asked for only:
- after a green review with the outcome reached;
- with the owner's yes (a proposal in the run note), because the ask spends goodwill;
- with the client's consent recorded in the company profile (*Our history*: what they agreed to, when, in writing).

A reference is never named in sales material or drafts without that consent. A client whose contract makes it a reference case has agreed by those terms; the consent is still recorded.

## 7. Writes

Everything here is profile, notes and activities (*do and log*: `odoo-profile`, `odoo-note`, `odoo-activity`), plus new deals for expansion through the normal creation rules. Drafts to the client follow the rules of `sales-conversations`; nothing is sent.
