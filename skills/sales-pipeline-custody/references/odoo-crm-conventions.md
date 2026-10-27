# Odoo CRM conventions

How every `meaningfy-sales` skill reads and writes Odoo CRM through the Odoo MCP tools. **Which** writes are allowed is decided by [write-rules](write-rules.md) and [`../assets/write-policy.yaml`](../assets/write-policy.yaml). This file is the how-to.

## Models and fields used

| Purpose | Model | Fields |
|---|---|---|
| Deals (leads and opportunities) | `crm.lead` | `name`, `type` (`lead` / `opportunity`), `team_id` (pipeline), `stage_id`, `user_id`, `partner_id`, `contact_name`, `partner_name`, `email_from`, `phone`, `website`, `description` (the deal dossier, HTML), `tag_ids`, `expected_revenue`, `probability`, `date_deadline` (expected closing: last open stage only, a stated date), `priority` (the stars), `date_last_stage_update`, `activity_ids`, `activity_date_deadline`, `campaign_id`, `source_id`, `medium_id`, `active`, `write_date` |
| Pipelines | `crm.team` | `name`, `user_id`, `member_ids`, `active` |
| Stages | `crm.stage` | `name`, `sequence`, `team_ids`, `is_won`, `fold`, `requirements`, `rotting_threshold_days` |
| Tags | `crm.tag` | `name` |
| Companies and people | `res.partner` | `name`, `is_company`, `parent_id`, `function`, `email`, `phone`, `mobile`, `website`, `vat`, `comment` (the profile), `category_id` |
| Saved filters | `ir.filters` (`model_id` = `crm.lead`, shared) | `name`, `domain`, `context`, `sort`, `is_default`, `user_id` empty for shared; configuration, *ask first* |
| Activity types | `mail.activity.type` | `name` (*Deadline* among them); configuration, *ask first* |
| Next steps | `mail.activity` | `res_model` = `crm.lead` or `res.partner`, `res_id`, `activity_type_id`, `summary`, `note`, `date_deadline`, `user_id` |
| Notes | `message_post` on `crm.lead` or `res.partner` | see below |
| Field history | `mail.tracking.value` | `field_id`, `old_value_*`, `new_value_*`, `create_date` (dormancy check) |
| Lead sources | `utm.campaign`, `utm.source`, `utm.medium` | `name` |

Read with explicit fields and small pages; prefer counts before wide reads. Include archived records (`active` in [true, false]) when checking for duplicates.

**Read the whole chatter**: `mail.message` on the deal with `message_type` in `comment`, `email` **and `notification`**. Activity feedback ("To-Do done — Feedback: …") is stored as a notification and often holds the key facts (e.g. "the next step is for her to send us the NDA").

## How to write

- **Dossier**: write the template from `sales-qualification` into `crm.lead.description`. Keep the existing text under *Previous notes* at the end.
- **Internal note**: `message_post` with `message_type` = `comment` and `subtype_xmlid` = `mail.mt_note`. Never pass `partner_ids`; never write `@name` in the body. Anything that notifies a person is a send. **Write the body as plain text**: the Odoo connector escapes HTML, so tags would show as text. Separate items with ` · ` or numbers. Rich formatting belongs in the dossier (`description` accepts HTML).
- **Profiles**: the company and person profiles of `sales-accounts` go into the contact's `comment` (HTML allowed). Text the agent did not write is kept under *Previous notes*; the agent's own sections are updated in place.
- **Next activity**: `mail.activity` on the deal (or on the contact, for relationship work not tied to a deal), assigned to the owner, with a summary and a date. Mark one done with `action_feedback` and a short feedback text citing the evidence, then create the next one in the same step. To re-date an overdue activity, write the reason into its `note` in the same call as the new `date_deadline`. Hard deadlines use the activity type *Deadline*.
- **Stars**: write `priority` ('0'–'3') with the score in the log line's source (`dossier attention score of YYYY-MM-DD: 6/10, nurture`). Before writing, find who set the current value: the field's tracking if Odoo tracks it, otherwise the *Done* logs of the run notes. A non-zero value the agent did not set is the owner's: do not write; report the difference.
- **Attention filters**: run the domains of `assets/odoo-views.yaml` with `search_count`, then `search_read` on the hits with explicit fields. Agent checks read the chatter or the dossier of the records the domain narrows to.
- **Team and stage together**: write `stage_id` and `team_id` in the same call. Odoo otherwise recomputes the missing one and can move the deal to the wrong pipeline (seen during the Odoo setup, when changing the salesperson moved two deals). Re-read the record after any write touching `user_id`, `team_id` or `stage_id`.
- **Old values**: read the fields before writing them, so the log line carries old → new.
- **Entity resolution before any write** (hard rules, rule zero), and before a create the search of `sales-accounts` (`references/identity.md`): leads and contacts, archived ones included, by email, web domain, phone, VAT and name. One match that agrees on two keys is enriched instead of creating; otherwise follow `identity.md` section 2 (ambiguous matches are questions); duplicate pairs are merge proposals for the owner (the agent never merges).
- **Lead → opportunity**: write `type` = opportunity, `team_id` and the first `stage_id` in one call; never use the conversion wizard (it can merge and create partners).
- **Won and lost**: after the owner's yes, use `action_set_won` or `action_set_lost`. **After `action_set_won`, re-read the stage**: Odoo moves the deal to the first won stage it finds, which can belong to another pipeline (seen on 10 Oct 2026: Partnerships deals landed in *Won – awarded & signed* of Calls & Tenders); if so, write the pipeline's own won stage and the team together. For lost, pick the closest existing `crm.lost.reason` and quote the owner's own reason in an internal note; propose a new reason separately (configuration) without holding the approved action. Log line: stage at close · `active` true → false (lost) or stage → won stage · lost reason · the owner's yes (P ref).

## Logging

Every write gets one line in the iteration's *Done* block (format in write-rules, section 2). The guardrail auditor compares Odoo's `write_date` and chatter with these lines.
