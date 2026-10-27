# Configuration: `sales-config.yaml`

The sales skills hold method only. What belongs to one installation (people's names, where the run
notes live, the owner's view of named partners, the booking link, the offer catalogue) lives in one file the owner keeps
in their vault, `sales-config.yaml`, never in the skills. Every run reads it first. A missing key
stops the run before any write: `HALT: configuration <key> missing`.

| Key | Holds | Used by |
|---|---|---|
| `owner` | name and mail of the person the agent works for | every run (whose yes counts, whose drafts) |
| `second_sender` | name and mail of the colleague always in cc | `sales-conversations` (cc rule), the guardrail auditor |
| `run_note_folder` | the vault folder of the run notes | every run; `sales-pipeline-custody` write rules |
| `objection_library` | the vault note holding objections met | `sales-conversations`, weekly review |
| `partner_notes` | per named partner: the owner's rating and a one-line note | `sales-pipeline-custody` (Partnerships route) |
| `booking_link` | the owner's meeting-booking URL, put in drafts that propose a meeting | `sales-conversations` (email patterns) |
| `offer_catalogue` | the vault note, kept by the owner, holding the current offerings, the commercial structures and the approved price ranges; a price it does not list is *ask first* | `sales-pipeline-custody` write rules, `sales-conversations`, weekly review |

Odoo ids are not configuration: they are read live from Odoo by name. The connectors and their
server names are installation, described in the catalogue's runtime page, not here.

A filled example with placeholders: [`../assets/sales-config.example.yaml`](../assets/sales-config.example.yaml).
The shape of the offer catalogue note: [`../assets/offer-catalogue.example.md`](../assets/offer-catalogue.example.md).
The offer ladder itself (the steps and what each is for) is method, owned by `semantic-consulting-coach`
(`engagement-lifecycle`); the catalogue holds what this installation sells and at what price. The
agent reads the catalogue and never edits it; the weekly review raises what is missing from it.
