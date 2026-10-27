# sales-agent

**Audience:** a Meaningfy salesperson who wants the sales agent to groom their Odoo pipelines every
day, and whoever sets it up for them.

## Useful only with its prerequisites

The `meaningfy-sales` bundle ships the `sales-agent` agent and five skills (`sales-operations`,
`sales-pipeline-custody`, `sales-accounts`, `sales-qualification`, `sales-conversations`). They need:

1. **Odoo CRM** with the five sales teams and their stages (the skills hold the expected stages),
   reached through the Odoo MCP server named **`odoo`** ([`dual-cli/mcp-setup.md`](dual-cli/mcp-setup.md),
   Step 3d). The agent acts as your Odoo user.
2. **Google Workspace** (mail and calendar) through the server named **`google-workspace`**
   (Step 3c), or the CLI's built-in connectors.
3. **A vault folder for the run notes** and the company memory, as for
   [`vault-assistant`](vault-assistant.md).
4. **Your `sales-config.yaml`**, kept in your vault, never in skillery. Its six keys and a filled
   example with placeholders are in the `sales-operations` skill (`references/configuration.md`,
   `assets/sales-config.example.yaml`). Without it, every run stops before writing.

Keep the server names `odoo` and `google-workspace`: the agent's tool rules name them.

## Start

1. Install the bundle: [`dual-cli/setup-claude.md`](dual-cli/setup-claude.md) or
   [`dual-cli/setup-opencode.md`](dual-cli/setup-opencode.md), Step 3.
2. Write `sales-config.yaml` from the example.
3. Run one close day by hand, read-only first: in Claude Code, `claude --agent meaningfy-sales:sales-agent`
   and say "close day"; check that the run note opens with the decisions it needs from you.
4. Schedule the runs (below).

## Scheduling the runs

| Run | When | Prompt |
|---|---|---|
| Open day | Mon–Fri, morning | `Run sales-operations, run type open day.` |
| Close day | Mon–Fri, late afternoon | `Run sales-operations, run type close day.` |
| Weekly review | Saturday and Sunday, morning (the first that runs writes it) | `Run sales-operations, run type weekly review.` |

- **Claude Desktop or Cowork scheduled tasks** load skills, not agent files (gap G-4 in
  [`dual-cli/mapping.md`](dual-cli/mapping.md)): paste the prompt above into the task; the skill
  carries the same contract as the agent.
- **Claude Code from a scheduler** (cron, launchd): `claude -p --agent meaningfy-sales:sales-agent
  "close day"`, following the scheduler pattern of the `vault-setup` skill
  (`references/scheduler.md`).
- **opencode** has no scheduler (gap G-5): run `opencode run --agent sales-agent "close day"` from an
  external scheduler.

## Answering the agent

Each run note opens with **Decisions needed**: one decision card per question, soonest deadline
first. Write your answer after the card's `Answer:` (the option letter, `yes`, or `edit: …`). Lines
starting `Owner:` are read too; `Owner: resume` clears a HALT. The next run applies your answers and
marks them applied.

## What it will not do, and the risks that remain

The agent never sends mail, deletes or merges records, marks a deal won or lost, or imports in bulk:
each comes to you as a card. It never edits a skill; a rule that went wrong comes to you as issue
text to file in skillery.

- **Enforced by the tools:** Odoo `unlink` and `import_records` are denied to the agent on Claude Code.
- **Enforced by the rules only:** mail send and delete (the Google Workspace tool names are not
  fixed), and everything on opencode, where MCP allow and deny entries have no analogue. The write
  policy's never-tier and the auditor's HALT cover them.
- **Accepted:** the agent uses your own accounts, so a change it did not log cannot be told from
  yours (it is listed as "unattributed"); your answers in a run note are unauthenticated text.
