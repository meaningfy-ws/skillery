# The skills, one by one (seed input, 2026-09-14)

Each section is a starting point for the skill's spec and `SKILL.md`, not the final text. "Upstream"
means the private requirements listed in `README.md`. The reference vault's skills of the same name
(private, in the upstream `inputs/sources/`) show proven wording and edge cases. Take their method,
and leave their platform specifics: desktop-app tools, per-machine links, a mirrored folder tree.

## `vault-conventions`

- **Owns:** the `kind` values and the template for each; property names and their vocabularies
  (`status`, `memory`, `private`, the project charter fields); link style (wikilinks by note name,
  never paths); tag use; where binaries go and how they are linked; machine-neutral paths; the
  staging area. It is the one place these are defined (`tests/ownership.yaml`).
- **Delegates:** Obsidian syntax to `obsidian@obsidian-skills`; the owner profile and write rules
  to the vault's `AGENTS.md`.
- **Triggers:** writing or editing any note in a vault; "what properties does a meeting note need".
- **Must never:** restate the owner profile; set `memory`.
- **Scenario:** WHEN an agent writes a meeting note THEN it carries `kind` and the properties the
  conventions list for that kind, and no `memory` property.

## `create-project`

- **Does:**
  1. Confirms the name.
  2. Asks the five impact-filter questions.
  3. Creates `01 Projects/YYYY-MM-DD Name/` with the five files from the conventions, and
     `vault-files/<project folder>/` only when the first binary arrives.
- **Refuses:** without a falsifiable "done". It then offers a note in `02 Ideas/` and creates
  nothing else.
- **Must never:** create any other folder; guess a name; paste instructions into some
  per-project app setting (the reference vault's chore, found missing on 15 of 16 projects).
- **Scenarios:**
  - WHEN it finishes THEN the folder holds the five files and `index.md` answers all five questions.
  - WHEN done can't be stated THEN no folder exists afterwards.

## `capture-notes`

- **Does:** reads raw notes for signal, not transcript. It files them into the named project's
  `sessions.md` (extending today's entry if one exists), `tasks.md`, `decisions.md` (only if
  something was decided), `index.md` (status, people) and `resources.md`.
- **Keeps the owner's hedges:** an undecided point is filed as undecided. Relative dates become a
  concrete range.
- **Asks** when the project is ambiguous; offers `create-project` when none exists.
- **Must never:** invent substance; create a project as a side effect; restructure files.
- **Scenario:** WHEN notes say a decision is still open THEN `decisions.md` gains no row and
  `sessions.md` records it as open.

## `close-project`

- **Does:** an end-of-session checklist over the five files. It touches only what is stale, asks
  for a summary of anything done outside the conversation, and reports what it changed and what
  needs the owner.
- **Must never:** archive, change `status`, or reorganise; fabricate a session summary.
- **Scenario:** WHEN a session decided X and rejected Y THEN `decisions.md` has both, with
  rationale, and `sessions.md` has one new dated entry.

## `promote`

- **Does:** moves a note from `00 Inbox/proposed/` into `01 Projects/` or `03 Resources/`, after
  checking `kind` and that kind's required properties.
- **Refuses:** when a field is missing, and names it.
- **Must never:** set `memory` or remove `private`.
- **Scenario:** WHEN the note has no `kind` THEN nothing moves and the missing field is named.

## `tidy` (cut first if the appetite runs short)

- **Does:** proposes a plan (moves, merges, renames, and every wikilink it will rewrite), waits for
  an explicit yes, applies it, and rewrites the links, because moves made with file tools don't
  update wikilinks.
- **Must never:** act without the yes; delete a note's content during a merge without keeping it in
  the merged note; move a note out of a shared folder without saying that it leaves the company
  memory at the next run.
- **Scenario:** WHEN the owner declines the plan THEN nothing moves.

## `daily` (upstream: `add-daily-assistant`, DEC-1 to DEC-10)

- **Runs:** on demand, in a session at the vault root. No schedule, server or cloud routine.
- **Reads:**
  - the owner profile;
  - the previous daily note, for ticks;
  - `05 To Do/To-Do.md`;
  - active projects and objectives;
  - the calendar, today and tomorrow;
  - the inbox since the previous note (24 h if none, capped at 72 h, Promotions, Social and Spam
    excluded, beyond 50 messages the rest reported as a count);
  - sent mail since the previous note, and at least 10 days back.
- **Writes:**
  - `04 Daily/YYYY-MM-DD.md` with `private: true` and the sections: calendar, needs a reply (with
    drafts), FYI, to-do (Urgent, In progress, Waiting, Waiting on replies, Meeting prep),
    objectives, notes;
  - `To-Do.md`: removes ticked items; adds an action item only when no open item covers it; keeps
    each item to one line with a link;
  - mail drafts, only for threads that have none.
- **Memory:** at most one recall per needs-reply sender and one per project, search type `CHUNKS`,
  the query holding only a name, an address or a project name.
- **Re-runs and failures:** a second run the same day appends "Update HH:MM" and never rewrites the
  owner's edits. A source it can't reach leaves one line, and the rest is still written.
- **Must never:** send, reply, forward, trash, label or mark spam; write to the calendar or Slack;
  use the Drive connector; call `remember` or `forget`; keep a processed-mail log (the previous
  note's date is the checkpoint).
- **Scenarios:** see the upstream `daily-assistant` spec (a tick flows back; an answered question
  leaves Waiting on replies; a second run keeps edits; a signed-out connector).

## `session-start <project>`

- **Does:** reads that project's `index.md`, recent `sessions.md` entries and `decisions.md`, and
  makes one recall naming the project. Reads no other project.
- **Scenario:** WHEN run for a project THEN the summary covers only that project's status, open
  tasks and recent decisions.

## `weekly-review` (only if `daily` leaves room)

- **Does:** reads the week's daily notes and writes `04 Daily/weekly/<week>.md`. It may note
  friction as a skill-change proposal in `00 Inbox/proposed/` (the evolution loop in `brief.md`
  §3).
