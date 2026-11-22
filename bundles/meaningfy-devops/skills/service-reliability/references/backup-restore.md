# Backup and restore

## The rules

| Rule | Level | Why | Minimum version |
|---|---|---|---|
| **A backup decision per stack, stated with its reason** | MUST | Some data is rebuildable and needs no backup; the rest must not be lost by omission. | The stack's README (or spec) says "backed up" or "not backed up", and why. The Monday check-up lists stacks without a decision. |
| **Where backed up: a freshness alert, a restore drill every 90 days, RPO and RTO stated** | MUST | A backup nobody restored is a hope. | A last-success metric with a stale-backup alert; a timed restore into a scratch place at least every 90 days; RPO and RTO in the README. |
| **The last restore test is recorded in the README, and a new backup's first run is checked by hand** | MUST | The freshness alert compares against the last success: a backup that **never** succeeded writes no metric, so it raises no alert. | The README's *Restore test* block filled after every drill; the first run's object seen in storage, and its metric seen in Prometheus, before the service is called backed up. |

**Not required:** encryption (a key is one more secret that can be lost, and a backup nobody can
open is no backup; the drill proves it can be reached and restored), a second provider, an immutable
copy. Keep backups in the EU.

## Deciding

Back up what cannot be rebuilt: databases and stores (with the application's own dump, never a raw
copy of live files), uploaded files, data entered by people. Not what the repositories rebuild
(images, configuration, code). The reason is one line ("rebuildable from the source data", "client
records, not rebuildable").

Default targets, unless a contract says otherwise: **RPO 24 hours** (nightly), **RTO one working
day**. The drill's measured time is the real RTO; write it down.

## Making a backup

Use the one generic role, [`assets/templates/backup-role/`](../assets/templates/backup-role/), with the
service's parameters; never copy another service's role. Its freshness metric is written **last** and
atomically, so any failure before it leaves the metric stale and the alert fires. Each service gets
its own storage credential and configuration, so one leak or one mistake does not reach every backup.

The stale-backup alert fires when the last success is older than 26 hours for a nightly backup; it is
in [`assets/templates/alert-rule.yml`](../assets/templates/alert-rule.yml). Test the alert once by
backdating the metric.

## The restore drill

Restore the newest backup **from storage** (not from the server) into a scratch database or
container, never over production; prove real content with a query (row counts, a known record); time
it from start to usable data; clean up; record it in the README's *Restore test* block (the
template's README shows it) and in the check-up's next report.

A restore into production touches data: it always goes through the safe-change protocol with consent
(`infrastructure-operations`), and unattended it is never taken.

Not now: tape, multi-cloud failover, yearly full disaster-recovery exercises, sub-hour RPO everywhere.
