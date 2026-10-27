<!-- Use when writing the runbook of a recurring operation on one system; it lives in that system's repo, never in skillery. -->
# Runbook: <operation>

<Scope: what this operation does, on which systems, and what it does not cover.>

> **Status:** written from the first real run: <YYYY-MM-DD>, change `<change-id>` (see its `execution-log.md`).

## Every run

1. **Re-check** the facts against the live state. Docs drift.
2. **Announce** in the operations channel at least 30 minutes before any downtime:
   > **<service>** maintenance **<start>–<end> <timezone>**: <what>. Impact: <who or what is down>. Ref: <change-id>.
3. **Irreversible step** (delete a server, volume, snapshot or data): the Infra owner's explicit go-ahead first.
4. **Code first:** the change is a PR in the repo that owns it, never the console alone.
5. **Plan gate:** the plan shows only the expected changes and nothing destroyed, unless destroying is the point. Otherwise stop.
6. **Report** "done", or "rolled back: <why>", in the announcement thread.

## Steps

1. <step>. **Verify:** <how you know it worked>.
2. ⛔ <irreversible step>. **Verify:** <how>.
3. <step>. **Verify:** <how>.

## Rollback

- **<what failed>:** <what to do, in order>.

## When it goes wrong

| Symptom | Cause | What to do |
|---|---|---|
| <symptom> | <cause> | <action> |
