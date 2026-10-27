# Terraform practice

Terraform holds the machines: VMs, volumes, cloud firewalls, load balancers, DNS, the private
network. A VM is one module block; start from [`vm-module-block.tf`](../assets/templates/vm-module-block.tf).

## Plan, review, apply

**MUST: the plan is posted on the PR, and only a saved plan from merged `main` is applied.**
*Why:* a code diff hides what Terraform will do; the plan shows a replace (`-/+`) or a destroy that
the diff does not. Applying from a branch or without a saved plan applies something nobody read.

1. On the branch: `terraform fmt -check`, `terraform validate`, `terraform plan -out=<name>.tfplan`.
2. Post the plan summary (counts to add, change, destroy, and every replaced or destroyed address)
   on the PR. Expect `0 to destroy` unless destroying is the point.
3. After merge, on `main`: plan again with `-out`, check it matches, then
   `terraform apply <name>.tfplan`. The commit that records the apply says `(applied)`
   (commit form: `meaningfy-git-workflow`).
4. Verify: `terraform plan` shows **No changes**.

A pending change left in code is applied by the next person who runs `apply` for something else.
Never leave one: revert it if the apply failed (see the resize trap in
[lifecycle-procedures](lifecycle-procedures.md)).

## State and pins

**MUST: remote state with locking, the lock file committed, providers pinned with `~>`, Ansible
collections and roles pinned to an exact version.**
*Why:* without a lock two applies corrupt the state; an unpinned provider or collection silently
changes the plan or the run.

- S3-compatible state: `use_lockfile = true` in the backend (Terraform ≥ 1.11; it replaces the
  DynamoDB lock, which is deprecated). Encryption at rest and versioning on the bucket.
- `required_version` and `required_providers` with `~>` constraints; commit `.terraform.lock.hcl`.
- Modules from git are pinned to a tag, never a branch.
- Ansible: `requirements.yml` with exact versions (`version: "1.2.3"`, never `>=`).

**SHOULD: a weekly drift check.** A scheduled workflow runs `terraform plan -detailed-exitcode`;
exit code 2 opens an issue. *Why:* a hand change in the console makes the next apply surprising.

## Hand-offs between layers

**SHOULD: facts that cross layers are generated, never pasted.** A volume id or an address that
Ansible needs comes from a Terraform output, an inventory fact (labels, the cloud inventory plugin)
or a generated vars file. *Why:* the hand step "copy the id from the apply output into group
variables" is the one that is forgotten, and a pasted address goes stale silently.

The `role` label is the join key: Terraform labels the VM, the Ansible inventory groups by it, and
the stack directory, workflow and secrets carry the same name ([environments](environments.md)).

## Firewalls

A VM block lists its ports in three classes: public (the proxy only), private app ports, and
restricted ports with source lists, each commented. The cloud firewall filters **public** traffic
only: private-network traffic does not pass through it. How a private port is really protected (the
two-layer rule, bind addresses) is owned by `infrastructure-security` (exposure). A temporary rule
carries `expires:` ([lifecycle-procedures](lifecycle-procedures.md)).

## Idioms

| Need | Idiom | Why |
|---|---|---|
| Add `count` or rename a resource | a `moved {}` block (Terraform ≥ 1.1) | without it the plan destroys and recreates |
| Adopt something made by hand | an `import {}` block (Terraform ≥ 1.5), reviewed in the plan like any change | the hand-made record enters code without being recreated |
| A load balancer certificate | name it with a hash of its domains and `create_before_destroy` | a domain change creates the new certificate before removing the old one |
| A single-target load balancer | relaxed health check (interval, retries) | one slow answer would otherwise take the only target out |
| DNS behind a load balancer | short TTL | a change or a rollback takes effect in minutes |
| Cutover of one name under a wildcard | a specific record that overrides the wildcard; deleting it is the rollback | one small apply each way, nothing else moves |
| A VM's safety | delete and rebuild protection on, volume protection on, `keep_disk = true` | a typo cannot delete a server or its data, and a resize never grows the disk past a later downsize |
| Remove a protected resource | two steps: lift protection and apply, then remove and apply | the first plan shows exactly what will go |

## No-gos

Terragrunt, Atlantis, paid Terraform Cloud tiers, and custom OPA or Sentinel policy libraries are not
used at this size; a free static scanner in the PR checks covers most of the value.
