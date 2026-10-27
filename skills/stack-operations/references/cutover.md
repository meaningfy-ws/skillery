# Cutover: moving a running stack's data

A cutover moves a running stack to a new layout or a new VM: named volumes to `/opt/data/`, one
project name to another, an old VM to a new one. It is an operation change: its execution log and
scripts live in the change (the change shape and the log schema are owned by
`infrastructure-operations`).

Start from [`assets/templates/cutover.sh`](../assets/templates/cutover.sh) and write `rollback.sh`
beside it before the day.

## The steps, and why

| Step | Why |
|---|---|
| Pre-flight: refuse to start if renamed old containers already exist | A half-finished earlier attempt is never silently overwritten. |
| Preconditions: data mount present, new images pulled, no job running | Downtime starts only when everything else is ready. |
| Disable the old deployer | Nothing redeploys the old layout halfway through. |
| Stop the applications, then the databases | No writes arrive while the data is copied. |
| Copy with `rsync -aHAX --numeric-ids` | Owners, links and attributes survive. |
| Dry-run `rsync -anci` must list nothing | Proof that the copy is equal, not a hope. |
| Rename old containers to `<name>-old`, do not delete | Rollback is renaming them back. |
| `up --wait`, then compare counts | Healthy is not the same as complete. |
| Delete the old containers and data only on the owner's go-ahead | After the rollback window, never in the same run. |

For a DNS switch between VMs, issue the certificate on the new VM before the switch, test with
`curl --resolve <host>:443:<new address>`, and keep the record's TTL short for the day. The DNS side
is owned by `infrastructure-operations`.
