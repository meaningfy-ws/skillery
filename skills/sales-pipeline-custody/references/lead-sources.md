# Lead sources

Where a lead came from carries most of its context ("met at the FAIR data booth in Basel", "introduced by a tool vendor"). Odoo's fields and tags hold the origin; the vault holds the story once.

| What | Odoo | Values |
|---|---|---|
| **Source** (`source_id`) | the kind of origin | existing: Conference/Event, Referral, LinkedIn, Search engine, Newsletter…; candidates to propose: Partner introduction, Member directory, Tender portal, Cold research, Inbound, Warm network |
| **Medium** (`medium_id`) | how we first talked | in person, email, LinkedIn, phone, introduction (create the missing ones on the owner's yes) |
| **Event tag** (`tag_ids`) | groups everything from one event | `Event: <name> <year>`, e.g. one tag per conference attended |
| Campaign (`campaign_id`) | not used for now | kept empty unless the owner decides to use campaigns |

**Context lives in the vault, once.** The event's vault project (attendee lists, the pitch, day reviews) is the context. The deal dossier's *Lead source* line and the person profile's *How we know them* link it; nothing is copied.

**Rules**
- Every new lead or deal gets source, medium and, for events, the event tag, when known; unknown stays empty, never guessed.
- Setting existing values and adding existing tags is *do and log*. New sources, media and tags are *ask first* (configuration); an approved intake plan can include them.
- In the triage, propose source and event tag for existing deals whose origin is clear from their history.
