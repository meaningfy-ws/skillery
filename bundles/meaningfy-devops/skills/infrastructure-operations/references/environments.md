# Environments

An environment (production, staging, test, demo) is real only if a mistake in one cannot reach
another; a label is a name, not a separation.

## Naming and labels

- VMs are named `<slug>-<env>-<role>`.
- Every resource carries four labels: project, environment, `managed_by`, role.
- The `role` label is the join key across the layers: Terraform labels the VM, the Ansible inventory
  groups by it, and the stack directory, its deploy workflow and its secrets use the same name. Where
  the form changes between layers (kebab-case, snake_case), the translation is written in one place.

## Separation

**SHOULD (MUST for a client's production): separate Terraform state and separate credentials per
environment, and every role rehearsed on a non-production host before production.** *Why:* they stop
a fat-fingered apply at the environment boundary, and iterating a role against production turns every
attempt into an incident.

- One root module or directory per environment, each with its own state; workspaces alone are not a
  separation for production.
- One Ansible inventory per environment, or at least a group per environment and `--limit` on every run.
- Without a separate host, rehearse with `--check --diff` and a throwaway VM from the
  [VM template](../assets/templates/vm-module-block.tf), destroyed after.

A separate cloud account per environment is only for a client whose contract requires it.
