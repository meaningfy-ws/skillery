# Lifecycle procedures

The steps for each event in a VM's or a service's life, and its traps. Every procedure runs inside the
safe-change protocol; these steps go into its plan. One system's runbook lives in its repo
([`runbook.md`](../assets/templates/runbook.md) is the shape).

Common to all: **announce** in the operations channel at least 30 minutes before any downtime;
**irreversible** steps (deleting a server, volume, snapshot or data, cancelling a contract) need the
Infra owner's explicit go-ahead, recorded; **code first**, never the cloud console alone.

## Create

1. Terraform: a block from [`vm-module-block.tf`](../assets/templates/vm-module-block.tf), DNS
   records, PR. The plan only adds. Apply the saved plan from `main`; verify DNS.
2. Ansible: the inventory group, its variables from [`group-vars.yml`](../assets/templates/group-vars.yml),
   a playbook from [`docker-host-playbook.yml`](../assets/templates/docker-host-playbook.yml), its
   import in the site playbook. `--check --diff`, then the run.
3. Monitoring registration (`service-reliability`), then the stack (`stack-operations`).

## Change

Any edit to a VM block, a firewall, DNS or a role; the dry run shows only what the plan names.

**MUST: a temporary rule carries `expires: YYYY-MM-DD` in a comment on the rule itself** (a firewall
source, an allow-list entry, a sleeping VM, a conformance exception). *Why:* a "temporary" exception
in prose is never removed; the daily check-up (`service-reliability`) reads the tag and reports it
when passed or within 14 days.

## Resize

Change the server type in place.

1. **The target fits:** same CPU architecture, disk at least the current one, memory for the
   services' use (a JVM's default heap scales with RAM).
2. **Restart policies:** the resize powers the server off; set `unless-stopped` where missing.
3. **Capacity:** a type the provider "supports" in a location may have none there; if unsure, create
   and delete a throwaway server of that type there first.
4. Plan: only the server type changes, in place, `0 to add, 0 to destroy`; one or two minutes down.
   Verify: the new type, every container healthy, the URLs answer, `plan` shows No changes.

**Trap:** a failed apply leaves the server **off, on the old type**. Power it on at once, then revert
the type in code immediately: a pending resize powers the server off on anyone's next apply.

## Rebuild

Replace a VM (shrink its disk, change image, recover), keeping its role, private address and data.

1. **Before:** dump each database off the server, check it, record its checksum; find data outside
   the databases (bind mounts, named volumes, uploads); baseline URLs with status codes and exact row
   counts per table; a delete-protected snapshot.
2. **Capacity:** `-replace` destroys the old server **before** creating the new one; check the target
   has capacity, or have a fallback type ready.
3. Apply 1: lift delete protection. Apply 2: `terraform apply -replace=<address>` with protection back
   on; the plan shows the server replaced and nothing else.
4. `ssh-keygen -R <address>`, the playbook, the deploy; restore, compare counts with the baseline.

Rollback: re-apply at once with an available type, or create the server from the snapshot with the
same private address.

## Sleep and wake

Sleeping deletes the server to save cost: the module's `sleeping` switch sets its `count` to 0 and
keeps the volume and the firewall; DNS follows the module's `sleeping` output. The block's comment
records the date, the owner's approval, the snapshot name, the wake sequence and
`expires: YYYY-MM-DD` (when to decide: wake or retire).

| Variant | When | Sleep | Wake |
|---|---|---|---|
| **A. Data on the volume** | all persistent data is on the volume | `sleeping = true`, apply | `sleeping = false`, apply, run the playbook, redeploy the stacks in their stated order |
| **B. Data on the root disk** | some data only on the root disk | archive it to the volume, snapshot the server (delete-protected), `sleeping = true` | `image` = the snapshot, `sleeping = false`, apply; `ssh-keygen -R`; playbook; redeploy |

The root disk is lost on sleep unless snapshotted. In variant B, do not change `image` again while the
server lives: that replaces it.

## Retire

1. Snapshot, delete-protected, with a keep-until date.
2. Announce; tell the consumers of any shared service it provided.
3. Capture the host first: a redacted record under the repo's decommission folder (what ran, which
   secrets by name and whether each is in the password manager, a data decision per store, the
   retirement checklist), then grep both repos for residue.
4. Decouple: monitoring targets and alerts (`service-reliability`), firewall sources, DNS, secrets
   and accounts (`infrastructure-security`).
5. Remove the code in two applies: lift protection, then remove.
6. Update the three audiences (`documentation.md`).

**MUST: the code of a retired system is removed, and a tombstone is left where it was**
([`tombstone.txt`](../assets/templates/tombstone.txt)). *Why:* dead code is copied, applied and
reasoned about as if it ran; the tombstone keeps where the final snapshot is, until when. After the
keep-until date the snapshot is deleted (owner's go-ahead) and the tombstone with it.
