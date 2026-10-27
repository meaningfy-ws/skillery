# Backup and restore

A backup is only as good as the last time someone restored it. The practice has two halves: decide,
per stack, whether there is anything worth backing up; and where there is, prove the backup works.

## The rules

| Rule | Level | Why | Minimum version |
|---|---|---|---|
| **A backup decision per stack, stated with its reason** | MUST | Some data is rebuildable and needs no backup; the rest must not be lost by omission. | The stack's README (or spec) says "backed up" or "not backed up", and why. The Monday check-up lists stacks without a decision. |
| **Where backed up: a freshness alert, a restore drill every 90 days, RPO and RTO stated** | MUST | A backup nobody restored is a hope. | A last-success metric with a stale-backup alert; a timed restore into a scratch place at least every 90 days; RPO and RTO in the README. |
| **The last restore test is recorded in the README, and a new backup's first run is checked by hand** | MUST | The freshness alert compares against the last success: a backup that **never** succeeded writes no metric, so it raises no alert. | The README's *Restore test* block filled after every drill; the first run's object seen in storage, and its metric seen in Prometheus, before the service is called backed up. |

## What is not required

Backups are **not encrypted** by this standard: an encryption key is one more secret that can be
lost, and a backup nobody can open is no backup. What matters is that it can be reached and
restored, and the restore drill proves that. A second provider and an immutable copy are not
required either. Keep backups in
the EU.

## Deciding

Back up what cannot be rebuilt: databases and stores (with the application's own dump, never a raw
copy of live files), uploaded files, and data entered by people. Do not back up what the repositories
rebuild: images, configuration, code. Write the reason in one line ("rebuildable from the source
data", "client records, not rebuildable").

Default targets, unless a contract says otherwise: **RPO 24 hours** (a nightly backup), **RTO one
working day**. The drill's measured time is the real RTO; write it down.

## Making a backup

Use the one generic role, [`assets/templates/backup-role/`](../assets/templates/backup-role/), with the
service's parameters. Never copy another service's backup role. It does, in order: a staggered timer
→ a consistent application-native dump → a check that the dump is not empty → a daily, weekly or
monthly tier → a copy to object storage → expiry per tier → the freshness metric, written **last**
and atomically, so any failure before it leaves the metric stale and the alert fires. Each service
gets its own storage credential and configuration, so one leak or one mistake does not reach every
backup.

The stale-backup alert fires when the last success is older than 26 hours for a nightly backup; it is
in [`assets/templates/alert-rule.yml`](../assets/templates/alert-rule.yml). Test the alert once by
backdating the metric.

## The restore drill

1. Pick the newest backup from storage, not from the server.
2. Restore it into a scratch place (a scratch database or container), never over production.
3. Check it with a query that proves real content (row counts, a known record).
4. Time it from start to usable data.
5. Clean up the scratch copy.
6. Record it in the README's *Restore test* block (the template's README shows it) and in the
   check-up's next report.

A restore into production is a different thing: it touches data, so it always goes through the
safe-change protocol with consent (`infrastructure-operations`), and unattended it is never taken.

## Not now

Tape, multi-cloud failover, yearly full disaster-recovery exercises, sub-hour RPO everywhere.
