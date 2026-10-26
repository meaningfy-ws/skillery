# vault-daily Specification

## Purpose
The morning note from live sources, the master to-do list, and reply drafts that are never sent.
## Requirements
### Requirement: The morning note is written from live sources

The `vault-daily` skill SHALL, when run at the vault root, write `04 Daily/YYYY-MM-DD.md` with
`kind: daily`, `private: true` and the sections: calendar, needs a reply (with drafts), FYI, to-do
(Urgent, In progress, Waiting, Waiting on replies, Meeting prep), plans (this week's objectives from
`05 To Do/Objectives YYYY.md`) and notes. It SHALL read the mail and calendar connectors and the time
zone from the owner profile, and SHALL refuse to run, naming what is missing, when the profile is
absent. It SHALL NOT fetch weather or use any web tool.

#### Scenario: The note is written

- **WHEN** the owner runs `vault-daily` with every source reachable
- **THEN** today's note exists with every section and `private: true`

#### Scenario: One skill serves a Gmail and an Outlook user

- **WHEN** the profile names the Outlook connectors
- **THEN** mail and calendar are read through those connectors and the same sections are written

#### Scenario: No owner profile

- **WHEN** the vault's agent instructions carry no owner profile
- **THEN** no note is written, and the missing fields and `vault-setup` are named

### Requirement: The mail window has no log

The inbox SHALL be read from the previous daily note's date (24 hours back when there is none), at most
72 hours; sent mail from the previous note's date and at least 10 days back. Promotions, Social and Spam
SHALL be excluded, and beyond 50 inbox messages the rest SHALL be reported as a count. The previous
note's date SHALL be the only checkpoint; no processed-mail log SHALL be kept.

#### Scenario: Window after a weekend

- **WHEN** the skill runs on Monday and the previous note is from Friday
- **THEN** the inbox is read from Friday, and no file other than the note and the to-do list changes

### Requirement: The master to-do list stays one line per item

`05 To Do/To-Do.md` SHALL be the master list with the to-do sections of the note. Each run SHALL remove
items ticked in the previous daily note, add an action item only when no open item covers it
(otherwise extend that item), and copy the open items into today's note. Waiting on replies SHALL hold
one item per question the owner asked in sent mail, removed when answered. Each item SHALL be one line
ending in a link. When a tick cannot be matched to an item with confidence, the item stays and the
notes say so.

#### Scenario: A tick flows back

- **WHEN** an item was ticked in yesterday's note
- **THEN** it is gone from `To-Do.md` and from today's note

#### Scenario: An answered question leaves the list

- **WHEN** a counterpart answers a question listed under Waiting on replies
- **THEN** the next run removes it and says so in the notes

### Requirement: Drafts only, in an attentive voice

The skill SHALL NOT send, reply to, forward, trash, label or mark as spam any message, write to the
calendar, send a chat message, or use the Drive connector. Replies SHALL be created as drafts, only for
threads that have none, in the company voice: neutral and factual, briefly acknowledging attitude,
implication or emotion where the message carries it. The note, not the draft, SHALL tell the owner what
the tone of a message signals.

#### Scenario: A reply is drafted, not sent

- **WHEN** a message needs a reply
- **THEN** a draft exists in the mailbox and the sent folder is unchanged

#### Scenario: A frustrated message

- **WHEN** a client writes that a delay is unacceptable
- **THEN** the draft acknowledges the frustration in one sentence and answers factually, and the
  note flags the tone for the owner

### Requirement: Re-runs are safe and failures visible

A second run on the same day SHALL skip threads that already have a draft and append an
`Update HH:MM` section, never rewriting the owner's edits. A source that cannot be reached SHALL leave
one line in the notes, and the rest of the note SHALL still be written. Recalls SHALL follow the limits
in `vault-conventions`.

#### Scenario: Second run the same day

- **WHEN** the owner edited today's note and runs the skill again
- **THEN** the edits remain and an update section is appended

#### Scenario: A connector is signed out

- **WHEN** the mail connector is unavailable
- **THEN** the note is written with its calendar and to-do sections and one line naming the missing
  source

