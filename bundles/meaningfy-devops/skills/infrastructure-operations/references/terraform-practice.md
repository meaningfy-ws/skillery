# Terraform practice

A VM is one module block; start from [`vm-module-block.tf`](../assets/templates/vm-module-block.tf).

## Plan, review, apply

**MUST: the plan is posted on the PR, and only a saved plan from merged `main` is applied.**
*Why:* a code diff hides a replace (`-/+`) or a destroy; applying from a branch or without a saved
plan applies something nobody read.

1. On the branch: `terraform fmt -check`, `terraform validate`, `terraform plan -out=<name>.tfplan`.
2. Post the plan summary (counts to add, change, destroy, and every replaced or destroyed address) on
   the PR. Expect `0 to destroy` unless destroying is the point.
3. After merge, on `main`: plan again with `-out`, check it matches, `terraform apply <name>.tfplan`.
   The commit that records the apply says `(applied)` (commit form: `meaningfy-git-workflow`).
4. Verify: `terraform plan` shows **No changes**.

Never leave a pending change in code: the next person's `apply` for something else applies it.
Revert it if the apply failed (the resize trap in `lifecycle-procedures.md`).

## State and pins

**MUST: remote state with locking, the lock file committed, providers pinned with `~>`, Ansible
collections and roles pinned to an exact version.** *Why:* without a lock two applies corrupt the
state; an unpinned provider or collection silently changes the plan or the run.

- S3-compatible state with `use_lockfile = true` (Terraform ≥ 1.11, not the deprecated DynamoDB lock);
  encryption at rest and versioning on the bucket.
- `required_version` and `required_providers` with `~>`; commit `.terraform.lock.hcl`; git modules
  pinned to a tag, never a branch.
- Ansible `requirements.yml` with exact versions (`version: "1.2.3"`, never `>=`).

**SHOULD: a weekly drift check.** A scheduled `terraform plan -detailed-exitcode`; exit code 2 opens
an issue, because a hand change in the console makes the next apply surprising.

## Hand-offs between layers

**SHOULD: facts that cross layers are generated, never pasted.** A volume id or an address Ansible
needs comes from a Terraform output, an inventory fact (labels, the cloud inventory plugin) or a
generated vars file; the hand copy is the step that is forgotten or goes stale. The `role` label is
the join key (`environments.md`).

## Firewalls

A VM block lists its ports in three classes, each commented: public (the proxy only), private app
ports, and restricted ports with source lists. The cloud firewall filters **public** traffic only;
how a private port is really protected is `infrastructure-security`'s (exposure). A temporary rule
carries `expires:` (`lifecycle-procedures.md`).

## House idioms

| Need | Idiom |
|---|---|
| A load balancer certificate | name it with a hash of its domains and `create_before_destroy`, so a domain change creates the new one first |
| A single-target load balancer | relaxed health check (interval, retries): one slow answer would take the only target out |
| Cutover of one name under a wildcard | a specific record that overrides the wildcard; deleting it is the rollback |
| A VM's safety | delete and rebuild protection on, volume protection on, `keep_disk = true` (a resize never grows the disk, so a later downsize stays possible) |
| Remove a protected resource | two applies: lift protection, then remove |

## No-gos

Terragrunt, Atlantis, paid Terraform Cloud tiers, and custom OPA or Sentinel policy libraries are not
used at this size; a free static scanner in the PR checks covers most of the value.
