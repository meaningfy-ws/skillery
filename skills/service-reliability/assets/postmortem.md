<!-- Use this for every `critical` incident and every `serious` one a client noticed; link it from the incident issue within five working days. -->
# Postmortem: <symptom> — <service>, <YYYY-MM-DD>

Incident issue: <link> · Severity: <critical | serious> · Written by: <name> · Reviewed: <date>

Blameless: describe what the system allowed, not who slipped.

## Summary

<Two or three sentences: what happened, how long, what fixed it.>

## Impact

- Who was affected: <clients, users, internal teams>
- How long: <start> to <end> (<duration>)
- Data: <none lost | what was lost or exposed>
- Client notified: <date and time, by whom | not needed, because …>
- Personal data involved: <no | yes: client told at <time>, <hours> after we became aware>

## Timeline

All times <timezone>.

| Time | What happened |
|---|---|
| <hh:mm> | <first signal: alert, probe, a person reporting> |
| <hh:mm> | <each action taken, and its result> |
| <hh:mm> | <service restored, verified by …> |

## Causes

- Root cause: <the condition without which this would not have happened>
- Contributing: <what made it worse or slower to find>

## What went well

- <…>

## What went badly

- <…>

## Where we got lucky

- <…>

## Actions

Each action is its own issue, with an owner and a due date. The postmortem is finished when every
row has an issue.

| Action | Issue | Owner | Due |
|---|---|---|---|
| <prevent it, detect it sooner, or recover faster> | <link> | <name> | <date> |
