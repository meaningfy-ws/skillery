# Environments

An environment (production, staging, test, demo) is only real if a mistake in one cannot reach
another. A label alone is a name, not a separation: if every environment shares one state, one
network and one key, one wrong apply or playbook run reaches production.

## Naming and labels

- VMs are named `<slug>-<env>-<role>`.
- Every resource carries four labels: project, environment, `managed_by`, role.
- The `role` label is the join key across the layers: Terraform labels the VM, the Ansible inventory
  groups by it, and the stack directory, its deploy workflow and its secrets use the same name. Where
  a name changes form between layers (kebab-case in one, snake_case in another), the translation is
  written in one place, not repeated by hand.

## Separation

**SHOULD (MUST for a client's production): separate Terraform state and separate credentials per
environment, and every role rehearsed on a non-production host before production.**
*Why:* separate state and credentials stop a fat-fingered apply at the environment boundary; a
rehearsal finds a broken role before users do. Iterating a role against production turns every
attempt into an incident.

- One root module or directory per environment, each with its own state. Terraform workspaces alone
  are not a separation for production: one wrong `select` hits it.
- One Ansible inventory per environment, or at least a group per environment and `--limit` on every
  run.
- Where a separate host does not exist yet, rehearse with `--check --diff` and a throwaway VM from the
  [VM template](../assets/templates/vm-module-block.tf); destroy it after.

A separate cloud account per environment is only for a client whose contract requires it.
