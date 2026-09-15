# The scheduled daily run (optional)

A scheduler entry on the owner's own workstation starts the CLI at the vault root and invokes
`vault-daily`. It is the owner invoking the skill: it runs under the vault's permission settings, with
the owner's connectors, and nothing leaves the workstation. The machine must be on at that time;
otherwise the owner runs the skill by hand.

> **Claude Code:** connectors answer in a headless run (checked 2026-09-15 with a calendar read at a
> vault root). Still test once by hand with the command below; if the note says a connector could not
> be reached, remove the entry and keep `vault-daily` on demand.

The run log goes to the owner folder, outside the vault, so it is never synced as a note.

## Linux (cron)

`crontab -e`. cron starts with a minimal `PATH`, so set it first to include where `claude` lives
(`command -v claude` shows it); then one line (working days, 07:30):

```
PATH=<folder of claude>:/usr/local/bin:/usr/bin:/bin
30 7 * * 1-5 cd "<vault path>" && claude -p "/vault-daily" >> "<owner folder>/vault-daily.log" 2>&1
```

## Windows (Task Scheduler)

Put the command in `vault-daily.cmd` in the owner folder (outside the vault), so the task line stays
short and free of nested quotes:

```
@echo off
cd /d "<vault path>"
claude -p /vault-daily >> "<owner folder>\vault-daily.log" 2>&1
```

Then, in `cmd`:

```
schtasks /create /tn "vault-daily" /sc weekly /d MON,TUE,WED,THU,FRI /st 07:30 /tr "\"<owner folder>\vault-daily.cmd\""
```

## opencode

opencode has no slash invocation for skills; use `opencode run "run the vault-daily skill"` in the same
entry. **UNVERIFIED.**

## Check

Run the command by hand once; today's note appears in `04 Daily/`, and the log shows no permission
prompt left waiting.
