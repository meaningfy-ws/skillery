<!-- Use this README when a service's backup decision is "backed up": copy the role once into the provisioning repository and keep this record per service. -->
# Backup role

One generic role backs up every service that needs it. A service is added by passing its
parameters, never by copying the role.

What it does, in order: a staggered systemd timer → the service's own dump command → a check that the
dump is not empty → a daily, weekly or monthly tier → a copy to object storage → expiry per tier →
the freshness metric `backup_last_success_timestamp_seconds`, written last and atomically, which the
`BackupStale` alert reads.

## Parameters

| Parameter | Required | Default | Meaning |
|---|---|---|---|
| `backup_service` | yes | — | The service's name: unit names, metric label, file names. |
| `backup_dump_command` | yes | — | A command that writes a consistent, application-native dump to standard output (for example `docker exec <container> pg_dump -U <user> <database>`). |
| `backup_remote` | yes | — | The storage path, `<remote>:<bucket>/<service>`. |
| `backup_rclone_config` | yes | — | This service's own storage configuration file, written from the password manager by the secret flow. One per service: never share one credential across every backup. |
| `backup_schedule` | no | `*-*-* 02:00:00` | systemd `OnCalendar`; stagger services on one host. |
| `backup_random_delay_sec` | no | `300` | Random delay added to the schedule. |
| `backup_local_dir` | no | `/opt/data/<service>/backups` | Local staging; files older than a day are removed. |
| `backup_textfile_dir` | no | `/var/lib/node_exporter` | The node exporter's textfile collector directory. |
| `backup_retention_daily` / `_weekly` / `_monthly` | no | `7` / `4` / `3` | How many of each tier to keep. |

Preconditions: `rclone` installed at a pinned version by the host playbook; the storage configuration
file present. The role stops if either is missing.

## Before calling the service backed up

1. Run the role, then start the first backup by hand: `systemctl start <service>-backup.service`.
2. See the object in storage and the metric in Prometheus. A backup that never succeeded writes no
   metric, so it raises no alert.
3. Add the `BackupStale` rule for the service (the alert-rule template), and test it once by
   backdating the metric.
4. Write RPO and RTO and the restore steps below, then run the first restore test.

## Restore

<The steps to restore <service> from the newest backup into a scratch place, and into production.>

RPO: <24 hours> · RTO: <one working day, or the measured drill time>

## Restore test

Last restore test: <YYYY-MM-DD>, <passed | failed> — backup <object name>, <size>, restored into
<scratch place>, checked by <query and result, e.g. row counts>, took <minutes>, scratch copy removed.
By: <name>. Next drill due: <date + 90 days>.
