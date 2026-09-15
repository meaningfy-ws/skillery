# vault-assistant

**Audience:** a Meaningfy colleague who keeps, or wants to keep, a personal Obsidian vault with an AI
assistant in it.

## Useful only with its prerequisites

`vault-assistant` is a **workflow bundle**, not a role bundle: its nine skills maintain one personal
vault and run a small daily routine. Without these, the skills have nothing to work on:

1. **A vault of the Meaningfy shape**, created by the `vault-setup` skill (the layout, templates, an
   `AGENTS.md` with the owner profile and write rules, and permission settings).
2. **The external plugin `obsidian@obsidian-skills`** and Obsidian 1.12.7 or later with its command line
   registered: notes are moved only through the Obsidian CLI, which keeps links intact.
3. **The company memory's MCP server**, configured for the user (never inside the vault), and the mail
   and calendar connectors for the morning note.

Opting in to the nightly ingestion of chosen notes into the company memory is optional, and done with
the infrastructure owner.

## Start

1. Install the bundle: [`dual-cli/setup-claude.md`](dual-cli/setup-claude.md) or
   [`dual-cli/setup-opencode.md`](dual-cli/setup-opencode.md), Step 3.
2. From your owner folder (`obsidian/<you>/`, not inside the vault), run `vault-setup` and follow it to
   its final check.
3. Open Obsidian on the `vault/` folder, and start sessions at the vault root.

## The skills, by moment

| Moment | Skill |
|---|---|
| once | `vault-setup` |
| a new piece of work | `vault-project new <name>` (only with a done a third person could check) |
| starting a session on it | `vault-resume <project>` |
| ending it, or filing call notes | `vault-capture <project>` |
| the work is over | `vault-project close <project>` |
| an agent staged a note | `vault-promote <note>` |
| the vault needs order | `vault-tidy` (a plan first, nothing moves without your yes) |
| the week, month, quarter, year | `vault-planning plan <horizon>`, or `review <horizon>` |
| every morning | `vault-daily` |

`vault-conventions` is used by all of them whenever a note is written.

## On opencode

The skills work, with two recorded gaps: skills have no slash form, so ask for `vault-setup`,
`vault-promote`, `vault-tidy` or `vault-daily` by name; and the vault's permission settings on opencode
are unverified. See [`dual-cli/compatibility.md`](dual-cli/compatibility.md).

## Changing the method

Agents never edit these skills. When something is wrong, the agent (or you) writes a `kind:
skill-change` note in `00 Inbox/proposed/`, and a person opens a pull request here.
