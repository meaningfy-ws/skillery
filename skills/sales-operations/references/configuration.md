# Configuration: `sales-config.yaml`

The sales skills hold method only. What belongs to one installation (people's names, where the run
notes live, the owner's view of named partners, approved prices) lives in one file the owner keeps
in their vault, `sales-config.yaml`, never in the skills. Every run reads it first. A missing key
stops the run before any write: `HALT: configuration <key> missing`.

| Key | Holds | Used by |
|---|---|---|
| `owner` | name and mail of the person the agent works for | every run (whose yes counts, whose drafts) |
| `second_sender` | name and mail of the colleague always in cc | `sales-conversations` (cc rule), the guardrail auditor |
| `run_note_folder` | the vault folder of the run notes | every run; `sales-pipeline-custody` write rules |
| `objection_library` | the vault note holding objections met | `sales-conversations`, weekly review |
| `partner_notes` | per named partner: the owner's rating and a one-line note | `sales-pipeline-custody` (Partnerships route) |
| `price_ranges` | per offer: minimum and maximum the owner approved; empty means every price is *ask first* | `sales-pipeline-custody` write rules, `sales-conversations` |

Odoo ids are not configuration: they are read live from Odoo by name. The connectors and their
server names are installation, described in the catalogue's runtime page, not here.

A filled example with placeholders: [`../assets/sales-config.example.yaml`](../assets/sales-config.example.yaml).
