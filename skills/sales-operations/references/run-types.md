# Run types

All runs record themselves as *run notes* in the **run folder**, the `run_note_folder` of `sales-config.yaml` ([configuration](configuration.md)): daily notes, weekly reviews and session notes. Runs write nowhere else in the vault; other vault notes (an event project, an offer project) are read-only sources. Times are the owner's local time.

**Tables.** Every table a run writes follows the table check of `vault-conventions` (blank lines around it, a separator row, `\|` inside cells). Run notes add two limits: at most five columns, and short cells; anything longer goes in a list under the table, one bullet per record in words with its `(#id)`. A table with no rows is written as "None."

## Start of every run

1. Read the write rules of `sales-pipeline-custody` and `sales-config.yaml`; a missing key stops the run with `HALT: configuration <key> missing` (no writes).
2. **HALT check.** Look in the run notes of the last 14 days for a `HALT:` line that the owner has not cleared (write rules, section 4). If you find one, write nothing in any tier, report the open items, and stop.
3. **The owner's input.** Read every run note of the last 14 days, and any older note that still has an `Answer:` not marked `(applied …)`. **Also read session notes kept elsewhere**: every note in the vault, outside the run folder, whose name contains `grooming session` or `crm import session` and that changed in the last 14 days (an intake or working session the owner asked to keep in another project), and every pointer note in the run folder. Their open proposals, questions and open items count as if they were in the run folder. List everything not yet applied (write rules, section 3).
4. **Since.** Take `last_run:` from the frontmatter of the latest run note. Everything below means "since the last run", so a missed run is caught up by the next one.

## Open day

*Mon–Fri ~09:00. Creates `YYYY-MM-DD grooming session.md` from the template.*

0. **Monday catch-up.** On Monday, if the last ISO week has no weekly review, do the weekly review first.
1. **Carry forward.** Read the previous working day's note: its *Open for tomorrow*, unanswered cards, and *Today's plan* lines not marked `done`. Re-check each in Odoo and mail before carrying it (the activity is done, the stage moved, the mail was sent or answered, the owner answered the card elsewhere): carry only what is still open; log the rest under *Carried forward* as resolved since, with its source. The owner never re-reads finished work.
2. **Objective.** Set the day's objective from the pipeline state: the template's default criteria, plus anything the owner asked for.
3. **Apply the owner's input.** Apply each input: execute what they approved, answer what they asked, and record it under *Applied* with record ids.
4. **Signals since the last run.** Resolve each signal to its records before acting on it (write rules, rule zero; `sales-accounts` identity, section 4).
   - Gmail: threads with contacts of open deals and partners, replies waiting, inbound interest.
   - Calendar: external meetings today and tomorrow, and those since the last run.
   - The vault: meeting notes and event projects that mention clients or partners.
   - Odoo: deals changed by people.
5. **Pipeline scan** through `sales-pipeline-custody`: work the open-day attention filters of `sales-pipeline-custody` in their order (core, then each pipeline) and write the count of each under *Filter counts* in the *Log*. Every hit gets its filter's action. Then exit criteria and dormant partnerships. Groom as you go (do-tier writes): fill fields, set next activities, score and star what is unscored, move stages whose exit is met, keep dossiers current.
6. **Run the loop** (plan, act, verify, decide), by the priorities in `SKILL.md`.
7. **Plan the day.** Rank every item needing attention (P1–P3, `SKILL.md`). Items on the week's focus deals (the latest weekly review's *Next week*) and new P1 items go under *This week*; the rest under *Later*, collapsed, with counts. *Today's plan* takes the owner's actions from *This week*, highest rank first, up to the week's capacity (goal-loop, *Terms*): per deal, whom to talk to, answer or chase, and why now. A new P1 beyond the capacity is planned, and the lowest planned item moves to tomorrow, said so on its line.
8. **Write the note**: *Decisions needed* (decision cards, soonest deadline first), *Today's plan*, *Attention list*, *Done by the agent*, and the collapsed *Log*.

## Close day

*Mon–Fri ~17:30. Continues the same day's note.*

If today's open-day note is missing, create it from the template and say so.

1. Read the owner's input from the day, and from chat if any. Apply it as at open day, under *Applied*. A statement that a deal is won or lost is the owner's yes (write rules, section 3).
2. **Record the day.** For each deal in *Today's plan* and each deal with mail, meetings or meeting notes today, record what happened on the deal in Odoo: a done activity or an internal note (meeting booked or held, mail sent or received, call made), each with its source. Mark each plan line `done`, `carried` (with the reason) or `dropped`.
3. **Infer the changes.** From the day's mail, meetings, meeting notes and the owner's notes, decide what changes on each deal: stage, fields, dossier, stars. Write within the tiers: a forward move with its exit met is *do and log*; won or lost seen only in a third party's mail, a backward move or another pipeline is a decision card.
4. Do the after-meeting work for today's meetings whose notes arrived, through `sales-conversations`. Handle replies that arrived during the day.
5. **No deal left without a next step.** Every deal touched today ends with an open, dated next activity (`sales-pipeline-custody`, *Next actions*). Then work the close-day attention filters (records touched today without a next action; ★★★ due tomorrow and not prepared) and add their counts to *Filter counts*.
6. Refresh the *Attention list* counts. Verify the day's objective again and decide. Write *Open for tomorrow* in the *Log*.

## Weekly review and plan

*Saturday ~10:00 and Sunday ~10:00. The first run that finds no review for the week writes it; the other stops at once. If both are missed, Monday's open day catches up.*

1. Read the week's run notes. Write the review as `YYYY-Www weekly pipeline review.md` (ISO week) in the same folder, from [`weekly-review.md`](../assets/templates/weekly-review.md). Fill in:
   - the pilot measures;
   - the advance-or-close list;
   - the constraint, with one change to try;
   - the objections met, to be added to the objection library;
   - proposed changes to the skills, each a decision card whose yes is "file this as a skillery issue": the run, the record, what went wrong, the file, the before → after text. No run ever edits a skill.
2. **Weekly filters.** Work the weekly attention filters and the weekly hygiene set of `odoo-views.yaml`; the stale-stage filter feeds the advance-or-close list. Fill *Bands* (stars × stage per pipeline), stars differences as cards, and the records whose band fell under *Watch*.
3. **Client accounts.** Work the client-account filters: rescore account health where a signal changed, prepare the outcome reviews due, list the green accounts ready for the next ladder step or a reference ask (`sales-accounts`, customer success). Each account goes on one line under *Watch*; a red one is a decision card.
4. **Sweep.** Read in full the open records not swept within the sweep period (goal-loop), oldest first, within the run's budget, so that every open record is read every 28 days. Ask one open question, "is anything here odd?", for example:
   - the stage contradicts the chatter or the mail;
   - a promise in a mail has no activity;
   - a contact has left the company;
   - a duplicate deal, or a deal in the wrong pipeline;
   - the stars contradict the dossier;
   - someone talked to a partner's client behind the partner;
   - a record kept open only by habit.
   Findings become decision cards. **Record the sweep on the record itself, as an internal note** (`message_post`, subtype `mail.mt_note`, plain text, no `partner_ids`): `Swept YYYY-MM-DD (weekly review YYYY-Www): <finding, or "nothing odd">`. The dossier is not rewritten for the sweep. The date of the last such note is the record's swept date; the weekly review's *Sweep* (in the *Log*) lists the records read. **The filters learn**: a kind of finding seen in two sweeps becomes a proposed new filter or agent check as a proposed change (a decision card).
5. **The offer catalogue** (the `offer_catalogue` note of `sales-config.yaml`): an offer, a commercial structure or a price used in a deal or draft this week but missing from it, or the catalogue unchanged for the dormancy period, becomes a decision card. The agent never edits the catalogue.
6. **Plan next week** under *Next week*: 3–5 sales outcomes, each naming its deals; the focus deals, each with the outcome it serves and the next owner action, ranked as in `SKILL.md`; the capacity, proposed from the owner actions marked `done` per day this week (the default of goal-loop when there is no history). The owner changes any of it with `Owner:` lines; daily runs plan from it. This is the sales part of the week only; the owner's own week plan is `vault-planning`'s.
7. Verify and decide as usual.

## Working session

When the owner asks, including a direct request to one skill that writes to Odoo ("do the homework on X"). The objective is what he states:
1. Restate it with acceptance criteria, and confirm with them if it is unclear.
2. Run the loop.
3. Record the session in a note named `YYYY-MM-DD HHMM grooming session - <topic>.md` in the run folder. **If the owner asks to keep the note in another place** (for example in an event project), write it there and also write a **pointer note** in the run folder, `YYYY-MM-DD HHMM grooming session - pointer <topic>.md`: one line with the link to the real note, its open proposals and questions by reference, and the records it created or changed (counts and the log's location). The next runs read both.

## Intake session

When the owner asks to bring people, companies and deals in from a source: an event (e.g. a conference project in the vault), a list, a set of mails or introductions. **No bulk import**: every record is researched and created or enriched one by one, deliberately. Uses [`intake-session.md`](../assets/templates/intake-session.md), named `YYYY-MM-DD HHMM grooming session - intake <source>.md`, in the run folder; if the owner wants it in the source's project, the pointer note of *Working session* applies.

1. **Scout.** Read the source and count: people, organisations, those already in Odoo (contacts, leads, deals; identity search of `sales-accounts`), and the tiers:
   - **A**: a two-way positive signal (a meeting held or agreed, an interested reply, a conversation with an agreed follow-up) → an opportunity, full profiles, a meeting plan or follow-up draft;
   - **B**: fit our buyer, but no positive signal yet (cold, a handshake, a polite exchange with nothing agreed) → a lead, short profiles (full profiles for anyone we spoke with);
   - **C**: no fit now → left in the source, not entered.
2. **Shared context, once.** What the source is, when, what we pitched, who was there, the vault project; the event tag, source and medium (`sales-pipeline-custody`, lead sources). Every record links to it instead of repeating it: the event tag, plus one line naming the vault project (by note name) in the dossier's *Lead source* and the profile's *How we know them*.
3. **Research, record by record.** Company first, then its people, then the deal: `sales-accounts` for identity and profiles, `sales-qualification` for the deal. Several people in one deal, one person in several deals, several leads in one company are all normal; the plan shows each link.
4. **Plan and report it.** The plan table lists every record in execution order with its tier, the existing id or NEW, the record type, pipeline and stage, tags, why, and any open question. Propose it as one decision card (counts by record type, new tags, the rows the agent is least sure of); ambiguous identities and duplicates are their own cards.
5. **Execute after the owner's yes**, record by record in the plan's order, within the run budget (goal-loop); each write and each identity search logged. the owner's yes on P1 covers the creations it lists, beyond the five-per-run limit, and the new tags it names.
6. **Audit.** Re-read every record from Odoo: exists once, linked, right type, pipeline, stage and tags, profile or dossier sourced and clear, personal details within the rules, next step set; notes and activities internal, on the right record, not duplicated, clear; no fact repeated across person, company and deal. Search again for duplicates. Cross-check the plan against what exists.
7. **Report.** Planned vs done, deviations and why, what is OPEN, what continues in the next session. Then verify with the reviewers and decide as usual.
