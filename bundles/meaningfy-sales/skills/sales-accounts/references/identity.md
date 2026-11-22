# Entity resolution

Sales is full of look-alikes: two Anna Schmidts in pharma, a group and its diagnostics subsidiary, three deals with the same client, a lost deal and its revival, a colleague and a client who share a first name. A decision taken about the wrong record is worse than no decision. So every run resolves what it is talking about **before** it decides, assumes or writes anything (write rules, rule zero). This file is the procedure.

## 1. Three kinds of things

| Kind | What | Resolved to | Rule |
|---|---|---|---|
| **Entities** (decisions are about them) | person, company, lead or deal, task | the Odoo id: `res.partner` (person or company), `crm.lead` (a lead and the deal it becomes keep one id), `mail.activity` | resolve before any decision or write; an ambiguous match is a question |
| **Evidence** (decisions are made from it) | mail thread, calendar event, vault note or project, Drive file, Confluence page, Odoo message | its own system's id: Gmail thread id, event id, note name, file id, page id, message id | cite by id; never copy into Odoo; the Meaningfy memory has no ids, so a recall is a hint to verify, not evidence |
| **Groupings** (records are filed under them) | pipeline, stage, tag (`Event: …`, `Offer: …`), source, medium | the existing Odoo record | match to what exists; a new one is configuration (*ask first*) |

Events and conferences have no Odoo object: the event tag groups the records and the event's vault project is the full record. A tender or call is a deal in Calls & Tenders, keyed by its official reference.

People include Meaningfy's own team (Odoo users) and partners' staff. A first name shared by a colleague and a client is resolved like any other.

## 2. Keys

A name alone is never enough: every match needs at least one other key that agrees.

| Entity | Keys |
|---|---|
| Person | exact email (any of their emails), employer, role, phone (digits only, country code), location, the deals and threads they appear in |
| Company | web domain (of the website and of people's emails), legal name and short name with the legal form and accents stripped, VAT or register number, switchboard, parent group |
| Lead or deal | company and main contact, pipeline, the offer or ladder step, an official reference (tender number, contract number), dates (created, expected closing), amounts, the mail threads and events tied to it |

Search **contacts and leads**, archived records included (`active` in [true, false]), with `ilike` on names and exact match on emails and references.

**Keys line.** Odoo has no field for many keys (other emails, former employers, tender references, the threads that belong to a deal). The person and company profiles and the deal dossier each carry a *Keys* line listing them. Read it first when resolving; add to it whenever a new key is learned.

## 3. Decide

| Result | Action |
|---|---|
| One match, at least two keys agree, none disagrees | Use that record. Enrich it if needed; never create a second one. |
| No match on any key | Create (contacts: the company first, then the person with `parent_id`; deals: placed by `sales-pipeline-custody`), within the creation limit or an approved intake plan. |
| A lead matches but no contact | Create the contact, then link the lead's `partner_id` to it. |
| Several plausible matches, or keys disagree | **Stop that item.** Disambiguate with the other keys. If one candidate is clearly right, use it and say why in the log. Otherwise raise a decision card: per candidate its name, employer and role in words with `(#id)`, the key that agrees and the one that disagrees; your best guess as the recommendation; what is blocked until the answer. Continue with other items. |
| A person moved to another employer | Do not create a second contact. Propose (ask first, a decision card) moving the contact (`parent_id`, `function`): old and new employer, the evidence of the move, and what happens to their open deals. The old employer goes to *Keys* and *How we know them*. |
| Two records are the same entity | Propose a merge (section 5). Work on the record to keep meanwhile. |

## 4. Tying evidence to records

Before acting on a mail, an event, a meeting note or a vault line, decide which records it is about:
- **Mail thread**: the participants' emails resolve the people; their domains the companies; the deal is the open deal of that company and contact whose subject, offer or reference matches. A thread already cited in a deal's *Keys* or *Sources* belongs to that deal.
- **Calendar event**: the guests' emails, then as for a mail.
- **Meeting note or vault line**: the names in it are resolved like any name, with the note's project and date as extra keys.

If a mail could belong to two deals of the same company (two ladder steps, a lost deal and a new one), it is a question, not a guess. **A better fit is not a resolution**: unless a key ties the mail to one deal (the thread already in its *Keys*, its contact, its reference), write nothing about the mail on either deal (no note, activity, stage or field change, no draft) until the owner answers; prepare the answer in the run note only. Once resolved, add the thread or event id to the deal's *Keys*.

## 5. Duplicates and merges

The agent never merges: a merge in Odoo deletes one record and cannot be undone. It proposes, and the owner merges in Odoo (*Contacts* or *CRM* › select both › *Action* › *Merge*).

A merge proposal is a decision card in the run note; its facts are:
- the records, as `name (#id)`;
- the evidence that they are the same (keys that agree, and any that disagree);
- which record to keep and why (more history, more deals, the right employer);
- what Odoo will move to the kept record (deals, activities, chatter) and anything to fix by hand afterwards;
- the reply: "merged", "not the same", or a correction.

After the owner writes "merged", the next run re-reads the kept record, checks that the deals and chatter moved, and updates the profile.

## 6. Writing it down

- **Every record is named with its id** wherever the agent writes about it: `name (#id)` in Done lines, decision cards, drafts waiting, notes and reports. An id alone is not enough either: next to it, say what the record is in words (company, role, offer, stage), because the owner decides from the card, not from Odoo.
- **Every resolution that leads to a create or a match by disambiguation** gets one Done line: the keys searched, the candidates (`#id`), the decision and why.
- One company, one contact; one person, one contact; one deal per contract.
