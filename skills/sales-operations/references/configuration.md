# Configuration: `sales-config.yaml`

The sales skills hold method only. What belongs to one installation lives in one file the owner
keeps in their vault, `sales-config.yaml`, never in the skills. Every run reads it first. A missing
key stops the run before any write: `HALT: configuration <key> missing`.

| Key | Holds |
|---|---|
| `owner` | name and mail of the person the agent works for (whose yes counts, whose drafts) |
| `second_sender` | name and mail of the colleague always in cc |
| `run_note_folder` | the vault folder of the run notes |
| `objection_library` | the vault note holding objections met |
| `partner_notes` | per named partner: the owner's rating and a one-line note |
| `booking_link` | the owner's meeting-booking URL, put in drafts that propose a meeting |
| `offer_catalogue` | the vault note, kept by the owner, holding the current offerings, the commercial structures and the approved price ranges; a price it does not list is *ask first* |

Odoo ids are not configuration: they are read live from Odoo by name. The connectors and their
server names are installation, described in the catalogue's runtime page, not here.

A filled example with placeholders: [`../assets/sales-config.example.yaml`](../assets/sales-config.example.yaml).
The shape of the offer catalogue note: [`../assets/offer-catalogue.example.md`](../assets/offer-catalogue.example.md).
The catalogue holds what this installation sells and at what price (the ladder itself is
`semantic-consulting-coach`'s); the agent never edits it.
