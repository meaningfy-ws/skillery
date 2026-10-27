# Lifecycle procedures

The steps for each thing that happens to a VM or a service in its life, and the traps each one
hides. Every procedure runs inside the [safe-change protocol](safe-change-protocol.md); the steps
here are what goes into its plan. The runbook of one system, written from its first real run, lives
in that system's repo ([`runbook.md`](../assets/templates/runbook.md) is its shape).

Common to all: **announce** in the operations channel at least 30 minutes before any downtime;
**irreversible** steps (deleting a server, volume, snapshot or data, cancelling a contract) need the
Infra owner's explicit go-ahead, recorded; **code first**, never the cloud console alone.

## Create

1. Terraform: a module block from [`vm-module-block.tf`](../assets/templates/vm-module-block.tf),
   DNS records, PR. The plan only adds.
2. Apply the saved plan from `main` ([terraform-practice](terraform-practice.md)); verify DNS.
3. Ansible: the inventory group, its variables from [`group-vars.yml`](../assets/templates/group-vars.yml),
   a playbook from [`docker-host-playbook.yml`](../assets/templates/docker-host-playbook.yml), its
   import in the site playbook. `--check --diff`, then the run.
4. Monitoring registration (`service-reliability`), then the stack (`stack-operations`).

## Change

Any edit to a VM block, a firewall, DNS or a role. The dry run must show only what the plan names.

**MUST: a temporary rule carries `expires: YYYY-MM-DD` in a comment** on the rule itself (a firewall
source, an allow-list entry, a sleeping VM, a conformance exception). *Why:* a "temporary" exception
written only in prose is never removed; the dated tag is read by the daily check-up
(`service-reliability`), which reports it when passed or within 14 days.

## Resize

Change the server type in place.

1. **The target fits:** same CPU architecture, disk at least the current disk. With
   `keep_disk = true` the disk is not grown, so a later downsize stays possible.
2. **Memory:** check the services' use against the target's RAM. A JVM's default heap scales with
   RAM, so a smaller server can starve it.
3. **Restart policies:** the resize powers the server off. A container without a restart policy stays
   down afterwards. List them first and set `unless-stopped`.
4. **Capacity:** a type the provider "supports" in a location may have no capacity there. If unsure,
   create and delete a throwaway server of that type in that location first.
5. Plan: only the server type changes, updated in place, `0 to add, 0 to destroy`. Apply: about one
   or two minutes down.
6. Verify: the new type, every container up and healthy, the URLs answer, `plan` shows No changes.

**Trap:** a failed apply leaves the server **off, on the old type**. Power it on at once, then revert
the type in code immediately: a pending resize left in code powers the server off on anyone's next
apply.

## Rebuild

Replace a VM (to shrink its disk, change image, or recover), keeping its role, private address and
data.

1. **Data first:** dump each database off the server, check the dump, record its checksum; find data
   outside the databases (bind mounts, named volumes, uploads).
2. **Baseline:** URLs with their status codes, exact row counts per table.
3. **Snapshot** the server, delete-protected.
4. **Capacity:** `-replace` destroys the old server **before** creating the new one. If the target has
   no capacity, the service is down with no server. Check first, or have a fallback type ready.
5. Apply 1: lift delete protection. Apply 2: the new settings with protection back on,
   `terraform apply -replace=<address>`. The plan shows the server replaced and nothing else.
6. The host key changed: `ssh-keygen -R <address>`. Then the playbook, then the deploy.
7. Restore, compare the counts with the baseline, verify as in the baseline.

Rollback: a create that failed after the destroy is re-applied at once with an available type, or the
server is created from the snapshot with the same private address.

## Sleep and wake

Sleeping deletes the server to save cost and keeps what is needed to bring it back. The module's
`sleeping` switch sets the server's `count` to 0 and keeps the volume and the firewall; DNS records
follow the module's `sleeping` output. The block's comment records the date, the owner's approval,
the snapshot name, the wake sequence and `expires: YYYY-MM-DD` (when to decide: wake or retire).

| Variant | When | Sleep | Wake |
|---|---|---|---|
| **A. Data on the volume** | all persistent data is on the attached volume | `sleeping = true`, apply | `sleeping = false`, apply a fresh server, run the playbook, redeploy the stacks in their stated order |
| **B. Data on the root disk** | some data lives only on the root disk | archive the root-disk data to the volume, snapshot the server (delete-protected), then `sleeping = true` | set `image` to the snapshot, `sleeping = false`, apply; new host keys (`ssh-keygen -R`); playbook; redeploy |

The root disk is lost on sleep unless it is snapshotted. In variant B, do not change `image` again
while the server lives: a change of image replaces the server.

## Retire

1. Snapshot, delete-protected, with a keep-until date.
2. Announce; tell the consumers of any shared service it provided.
3. Capture the host before it goes: a redacted record under the repo's decommission folder (what ran,
   which secrets by name and whether each is in the password manager, a data decision per store, the
   retirement checklist), then a grep of both repos for residue.
4. Decouple: monitoring targets and alerts (`service-reliability`), firewall sources, DNS, secrets
   and accounts (`infrastructure-security`).
5. Remove the code, in two applies: lift protection, then remove.
6. Update the three audiences ([documentation](documentation.md)).

**MUST: the code of a retired system is removed, and a tombstone is left where it was.** *Why:* dead
code kept live is copied, applied and reasoned about as if it ran; the tombstone keeps the one fact
still needed (where the final snapshot is, until when). Use [`tombstone.txt`](../assets/templates/tombstone.txt).
After the keep-until date, the snapshot is deleted (irreversible: owner's go-ahead) and the tombstone
with it.
