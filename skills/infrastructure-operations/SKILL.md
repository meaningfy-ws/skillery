---
name: infrastructure-operations
description: "Use this skill when you change a server or the infrastructure under the stacks: add a VM, resize, rebuild, sleep or wake one, retire a service, read a terraform plan, write an ansible role or playbook, set the checks of an infrastructure repo, or record and document an operation; it gives the safe-change protocol with its consent card, the provisioning and configuration rules, the lifecycle procedures, the records an operation leaves and the standard templates to start from."
license: Apache 2.0
metadata:
  purpose: devops
  area: operations
  subject: delivery-infra
  posture: precise
  stage: release
  maturity: experimental
---

# Infrastructure Operations

Infrastructure has three layers, joined by one `role` label:

| Layer | Holds | Tool |
|---|---|---|
| Machines | VMs, volumes, cloud firewall, load balancers, DNS, private network | Terraform |
| Configuration | OS hardening, host firewall, Docker, data volume, monitoring agents, timers | Ansible |
| Services | one Compose stack per VM, its deploy workflow | Compose, GitHub Actions (`stack-operations`) |

This skill owns the first two layers and the **safe-change protocol** that every operation on any
layer follows. It is written for a person who is not a devops engineer: each rule says why.

## Where things live

- **Practice here, instance in the repos.** This skill holds how to operate. The facts of one
  installation (hosts, stacks, addresses, known traps, the runbook of one system) live in the two
  infrastructure repositories, and you read them there: `infrastructure-stacks` (stacks, and the
  `openspec/` spine for every infrastructure change) and `cloud-infrastructure` (Terraform and
  Ansible).
- **Start in `infrastructure-stacks`.** The provisioning repo is its sibling checkout,
  `../cloud-infrastructure`, edited in the same change. If the sibling is missing, report it and stop
  that part of the work; never guess another location.
- **A repo rule that contradicts a rule of this skill** (for example the "three-layer" port rule):
  apply the skill's rule and report the contradiction for the repo's own change.

## Quick Start

**Input:** "`<stack>` ran out of memory last night and took the server down. Make it not happen again."

1. **Read the state.** The stack's compose file and README in `infrastructure-stacks`, the VM's block
   in `../cloud-infrastructure`, the memory graph of the last week in monitoring.
2. **State the view and the plan.** "Two services have no memory limit and no healthcheck. Plan: add
   both (the per-stack minimum of `stack-operations`), one PR, no change to the VM."
3. **Dry run.** `docker compose config` on the branch; the plan recreates 2 containers, touches no
   data. `infra-reviewer` reads the branch; its report goes on the PR.
4. **Consent card**, in the decision-card shape of `executive-communication`, written for someone
   who is not a devops engineer: apply now (the page errors for about 30 s, cost unchanged), apply
   tonight, or do nothing (the stack can still exhaust the server's memory); undo = revert the PR
   and redeploy. The filled card is [`assets/consent-card.example.md`](assets/consent-card.example.md).
5. **On "apply now":** merge, deploy, verify (healthchecks green, memory flat), record on the PR.

**Output:** a merged PR with the reviewer's report and the card's answer on it, the deploy verified,
and the record of [interventions](references/interventions.md).

## Workflow

1. **Every operation** follows the [safe-change protocol](references/safe-change-protocol.md): read,
   plan, dry run, card, apply exactly what was shown, verify, record. Load it first.
2. **Is it a non-trivial change?** Read [change-shapes](references/change-shapes.md) to pick the
   OpenSpec shape (feature or stack, operation or migration, bug sweep).
3. **Machines** (VM, volume, firewall, DNS, load balancer): read
   [terraform-practice](references/terraform-practice.md).
4. **Configuration** (playbook, role, group variables): read
   [ansible-practice](references/ansible-practice.md).
5. **Which environment, and how separated:** read [environments](references/environments.md).
6. **Create, change, resize, rebuild, sleep, wake or retire a VM or service:** read
   [lifecycle-procedures](references/lifecycle-procedures.md) for the steps and their traps.
7. **Setting up or reading the checks a PR must pass:** read [repo-checks](references/repo-checks.md).
8. **After the change:** write the records of [interventions](references/interventions.md) and update
   the three audiences of [documentation](references/documentation.md).

**Start new work from a template, never from another stack's or VM's files** (the template wins for
new work; the existing file's difference is a conformance gap to report):

| Template | Use it when |
|---|---|
| [`vm-module-block.tf`](assets/templates/vm-module-block.tf) | adding a VM |
| [`group-vars.yml`](assets/templates/group-vars.yml) | adding an inventory group |
| [`docker-host-playbook.yml`](assets/templates/docker-host-playbook.yml) | configuring a VM that runs a stack |
| [`role-contract/`](assets/templates/role-contract/README.md) | writing an in-house Ansible role |
| [`fail-closed-tasks.yml`](assets/templates/fail-closed-tasks.yml) | a service that boots with a default login or an unsafe state |
| [`tombstone.txt`](assets/templates/tombstone.txt) | removing the code of a retired system |
| [`runbook.md`](assets/templates/runbook.md) | writing the runbook of a recurring operation |
| [`execution-log.md`](assets/templates/execution-log.md) | an operation or migration change |
| [`consent-card.example.md`](assets/consent-card.example.md) | the worked consent card |

## Gotchas

Common anti-patterns, and the rule or template that replaces each.

- **Copying a block instead of sharing it.** The third copy of a variable block or a role becomes a
  shared group or one parameterised role ([ansible-practice](references/ansible-practice.md)).
- **Facts copied by hand between layers.** A volume id or an address pasted from apply output into
  Ansible variables is forgotten or goes stale; generate it ([terraform-practice](references/terraform-practice.md)).
- **Role defaults carrying another service's values.** A generic role whose defaults belong to one
  application changes other hosts on every run; defaults name nothing foreign and a generic role
  touches only what its caller lists ([ansible-practice](references/ansible-practice.md)).
- **Insecure fallbacks:** a default password, default sudo, a world-open default allow-list. Fail
  closed instead ([`fail-closed-tasks.yml`](assets/templates/fail-closed-tasks.yml)); the rule is
  owned by `infrastructure-security`.
- **Dead code kept live.** Code of a retired system is removed, with a tombstone
  ([lifecycle-procedures](references/lifecycle-procedures.md)).
- **Coupling to a third-party role's internals.** Set only a vetted role's documented variables;
  never its internal files or task names.
- **Docs that restate code.** They rot; docs point to the file and say why
  ([documentation](references/documentation.md)).
- **Fetch-and-run installs at "current".** Pin every collection, role and installer to an exact
  version.
- **"Temporary" exceptions written only in a comment.** They carry `expires: YYYY-MM-DD`, which the
  daily check-up reads ([lifecycle-procedures](references/lifecycle-procedures.md)).
- **Iterating against production.** A role is rehearsed on a non-production host first
  ([environments](references/environments.md)).
- **One credential and one config path shared by every backup.** Use the parameterised backup role
  of `service-reliability`, one credential per service.
- **One log schema per change.** Every execution log uses the one
  [template](assets/templates/execution-log.md); a runbook left as a skeleton is not done.
- **Trusting the cloud firewall for private ports.** It filters public traffic only, and Docker
  bypasses the host firewall; the port rule as it really works is owned by `infrastructure-security`.

## Boundary & Related Skills

**Owns:** the three-layer operating model; the safe-change protocol and its consent-card use; the
OpenSpec change shapes for infrastructure; Terraform and Ansible practice; environments; the
create, change, resize, rebuild, sleep, wake and retire procedures; the required checks of the
infrastructure repos; records of interventions; the three documentation audiences and runbook
structure; the instance/practice split and the sibling layout.

**Does NOT own:**
- Compose stacks, the per-stack minimum, deploy, version pins, promotion, rollback, cutovers:
  `stack-operations`.
- Monitoring, alerts, the daily check-up, incidents, backups and restores, the unattended-action
  policy: `service-reliability`.
- Access, MFA, offboarding, secrets and the `bw` piping rule, supply chain, exposure and the
  two-layer port rule, four-eyes and break-glass: `infrastructure-security`.
- The application repository up to a published image and a deploy request: `ci-cd-delivery`.
- Commit messages, commit scope and branches: `meaningfy-git-workflow`.
- The decision card's fields and rules: `executive-communication`
  (`references/decision-request.md`).
- Writing and archiving an OpenSpec EPIC: `epic-planning`, `spec-stewardship`.

**Related:** `stack-operations`, `service-reliability`, `infrastructure-security`,
`ci-cd-delivery`, `meaningfy-git-workflow`, `executive-communication`, `epic-planning`,
`spec-stewardship`, `clarity-gate`.
