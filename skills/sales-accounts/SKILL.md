---
name: sales-accounts
description: "Use this skill when a company or person Meaningfy deals with must be found, added, researched or profiled in Odoo, before any contact is created, or when a won client's health and outcome need care (\"is this person already in our Odoo\", \"update the profile of X\", \"find duplicate contacts\", \"how healthy is our client X\"); it resolves people, companies and deals to one record, keeps company and person profiles and the personal-details rules, and runs customer success after the win. Not for scoring a deal (sales-qualification)."
license: Apache 2.0
metadata:
  purpose: crm
  area: sales
  subject: generic
  posture: profiled
  stage: sell
  maturity: experimental
---

# Sales Accounts

Deals come and go; companies and people stay. This skill keeps the **accounts**: every company and every person Meaningfy deals with, as Odoo contacts with a profile that outlives any single deal. The deal dossier says what is happening in one deal; the profiles say who these people and organisations are, so every deal, meeting and message starts from a person, not a record.

It owns:
- entity resolution: people, companies, leads and deals to their Odoo ids before any decision, evidence to its own ids, search before create, duplicate and merge proposals ([identity](references/identity.md));
- the company profile and the person profile ([templates](assets/templates/));
- the rules for personal details ([personal-details](references/personal-details.md));
- notes and tasks on companies and people;
- the account after the deal: customer success ([customer-success](references/customer-success.md)).

**Called by**:
- `sales-operations`, in intake sessions and runs that meet a new name;
- `sales-qualification`, to make sure every stakeholder is a contact with a current profile;
- `sales-conversations`, before a meeting (how they decide, how to talk to them, personal touches) and after it (what they shared);
- the owner, directly.

**Calls** `sales-pipeline-custody` for the write rules and every Odoo write.

## Quick Start

**Input:** "Add Anna Schmidt, head of data at Acme Pharma, whom we met at the data summit."

1. Search Odoo contacts and leads, archived included, by email, web domain and name
   ([identity](references/identity.md)): one contact "Anna Schmidt" at Acme Pharma Diagnostics,
   email domain differs. Two keys disagree, so this is not a match yet.
2. The diagnostics firm is a subsidiary of Acme Pharma with its own domain; her badge says
   Acme Pharma. Not clearly the same person: raise a decision card with both candidates in words.
3. Meanwhile, write nothing about her.

**Output:** one decision card ("Is the Anna Schmidt we met the one at Acme Pharma Diagnostics?"),
recommendation, the agreeing and disagreeing keys, and what "yes" writes (enrich that contact,
add the summit to *How we know them*).

## Write rules

Before any write, read the write rules of `sales-pipeline-custody`. In short, for this skill:
- **Never create a contact without searching first** ([identity](references/identity.md)). An ambiguous match is a decision card, never a guess.
- **Never merge, archive or delete a contact.** Duplicates are decision cards for the owner, who merges in Odoo.
- Writing a profile into the contact's *Notes* (`comment`), keeping the earlier text, is *do and log* (`odoo-profile`). So are internal notes and activities on contacts.
- Personal details follow the three rules in [personal-details](references/personal-details.md); breaking them is *never*.

## Odoo shape

| What | Odoo | Rule |
|---|---|---|
| Company | `res.partner`, `is_company` = true | one per legal entity; subsidiaries are their own company with `parent_id` to the group |
| Person | `res.partner`, `is_company` = false, `parent_id` = employer | one contact per person, under their current employer |
| Company profile | the company's `comment` (Notes tab) | template [company-profile](assets/templates/company-profile.md) |
| Person profile | the person's `comment` (Notes tab) | template [person-profile](assets/templates/person-profile.md) |
| Events in the relationship | internal notes (`message_post`, note subtype) on the contact | plain text, dated, sourced |
| Tasks about the person or company | `mail.activity` on the contact, assigned to the owner | for relationship work not tied to a deal (a congratulation, a quarterly check-in) |
| Deals | `crm.lead` with `partner_id` = the main contact | other people in the deal are listed in the dossier's *Stakeholders* by contact id |

One company can have many people and many deals; one person can be in several deals. Each deal links its main contact; the dossier links the others. Profiles are never copied into the deal.

## Workflow

1. **Objective.** "Company X and person Y exist once in Odoo, linked, with current profiles", or narrower ("the profile of Y has how they decide").
2. **Resolve** with [identity](references/identity.md): search, then use or enrich the match, create when nothing matches, or ask when it is ambiguous. Read and extend the *Keys* line.
3. **Read what exists**: the contact and its chatter, its deals, mail and calendar with the person, the vault (event projects, meeting notes), the Meaningfy memory (recall by name), Drive and Confluence.
4. **Research the gaps**: the company first, then the person, with `sales-qualification`'s research checklist and the personal-details rules.
5. **Write the profile** from the template into `comment`. Text the agent did not write goes under *Previous notes*, unchanged; the agent's own sections from an earlier run are updated in place, never nested. Fill empty fields (website, function, email, phone, VAT) only from a source. Log every write.
6. **Hand back** to the verifier: the profile, its sources, what is OPEN, any duplicate proposal.

## Profiles

**Company profile: the company's DNA.** What it does and where it stands; strategy and priorities; challenges; how it works (workflows, data landscape, tools and vendors in place); how it buys (procurement route, policies, who must agree, budget cycle, what burned it before); regulatory pressure; culture; our history with it; where Meaningfy fits. Everything specific to one deal goes to that deal's dossier instead.

**Person profile: a person, not a record.** Who they are in their organisation; how we know them; what they care about professionally; how they decide (what they fear being blamed for, what gives them status, what they compare us with, how much risk they can carry); personal touches they shared; how to talk to them. The decision lens comes from `sales-conversations` (selling method) (Sutherland, Taleb).

**Depth.** A cold lead's contact gets a short profile (*Who*, *How we know them*, one line of *What they care about*, *Sources*). Anyone we have spoken with gets the full profile.

**Keep them current.** After every meeting or meaningful exchange, add what was learned, dated, to the right profile. A profile older than the last contact is stale.

## The account after the deal

A won client stays an account; the method (desired outcome, success plan, account health, outcome
reviews, expansion, advocacy) is in [customer-success](references/customer-success.md). Two habits
outside it:
- each won client's champion gets a relationship activity, set at the win and due one dormancy
  period later (`sales-operations`, *Terms*), renewed each time it is done;
- an occasion a person shared (a birthday, a promotion, a launch) becomes an activity for the owner
  on the day; the agent drafts, the owner sends.

## Acceptance criteria (checked by the goal verifier)

**Identity:**
- The search covered email, web domain, phone, VAT and name, archived records and leads included, and is logged.
- No contact was created when a plausible match existed; ambiguous matches are decision cards in the note.
- Every person has a `parent_id` to their current employer when it is known.
- Duplicate pairs found are proposed with evidence and the record to keep; nothing was merged.

**Client accounts:**
- Every won client has a desired outcome and a success plan, each element sourced or OPEN.
- The account health is scored with its sources, its OPEN count and its colour; the next outcome review is a dated activity.
- No expansion proposed on an amber or red account; no reference used without recorded consent.

**Profiles:**
- Every section the depth requires is present; unknowns are OPEN with the question that would close them.
- Every fact has a source and a date; inferences are marked.
- Every personal detail meets [personal-details](references/personal-details.md): shared by the person or published by them, dated, with where it was said.
- Earlier text is kept; the write is logged.

## Gotchas

- **A name is never a match.** Two keys must agree and none disagree; a better fit is not a resolution.
- **The agent never merges.** A merge in Odoo deletes a record; it is a decision card for the owner.
- **An id is not context.** Every record named in a card says what it is in words beside its id.
- **Personal details only as shared or published** by the person; never researched, never special
  categories.

## Boundary & Related Skills

**Owns:** entity resolution; company and person profiles; the personal-details rules; notes and
activities on contacts; customer success after the win.

**Does NOT own:** the write rules and Odoo conventions (`sales-pipeline-custody`); deal-level
homework and scoring (`sales-qualification`); how personal touches are used in a message
(`sales-conversations`); the decision card (`executive-communication`).

**Related:** `sales-pipeline-custody`, `sales-qualification`, `sales-conversations`,
`sales-operations`, `executive-communication`.
