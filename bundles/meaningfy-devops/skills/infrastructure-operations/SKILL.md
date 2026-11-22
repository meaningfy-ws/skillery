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

An agent changing infrastructure tends to edit and apply before anyone has read the plan; here no
change is applied before a dry run, a consent card a non-specialist can judge, and a record.

| Layer | Holds | Tool |
|---|---|---|
| Machines | VMs, volumes, cloud firewall, load balancers, DNS, private network | Terraform |
| Configuration | OS hardening, host firewall, Docker, data volume, monitoring agents, timers | Ansible |
| Services | one Compose stack per VM, its deploy workflow | Compose, GitHub Actions (`stack-operations`) |

The layers are joined by one `role` label. This skill owns the first two and the **safe-change
protocol** every operation on any layer follows, written for a person who is not a devops engineer.

## Quick Start

**Input:** "`<stack>` ran out of memory last night and took the server down. Make it not happen again."

1. **Read the state:** the stack's compose file and README in `infrastructure-stacks`, the VM's block
   in `../cloud-infrastructure`, the last week's memory graph in monitoring.
2. **View and plan:** "Two services have no memory limit and no healthcheck. Plan: add both (the
   per-stack minimum of `stack-operations`), one PR, no change to the VM."
3. **Dry run:** `docker compose config` on the branch recreates 2 containers, touches no data.
   `infra-reviewer` reads the branch; its report goes on the PR.
4. **Consent card:** apply now (the page errors for about 30 s, cost unchanged), apply tonight, or do
   nothing (the stack can still exhaust the server's memory); undo = revert the PR and redeploy. The
   filled card is [`assets/consent-card.example.md`](assets/consent-card.example.md).
5. **On "apply now":** merge, deploy, verify (healthchecks green, memory flat), record on the PR.

**Output:** a merged PR with the reviewer's report and the card's answer on it, the deploy verified.

## Workflow

The phases of each kind of operation (intervention, incident, check-up, unattended), as the navigator
mod tracks them, are data in [`assets/workflows/devops.workflow.json`](assets/workflows/devops.workflow.json);
incidents and unattended runs follow `service-reliability`.

1. Read `references/safe-change-protocol.md` before any operation: it adds the seven steps, the
   consent card's facts and how `infra-reviewer` reviews and grades.
2. Read `references/change-shapes.md` when the change may need an OpenSpec change: it adds which
   changes do and the three shapes.
3. Read `references/terraform-practice.md` when touching a VM, volume, firewall, DNS or load
   balancer: it adds plan-review-apply, state, pins and the house idioms.
4. Read `references/ansible-practice.md` when writing a playbook, role or group variables: it adds
   the run rules, the Docker-host skeleton and the role rules.
5. Read `references/environments.md` when naming or separating an environment: it adds the labels
   and the separation rule.
6. Read `references/lifecycle-procedures.md` when you create, change, resize, rebuild, sleep, wake or
   retire a VM or service: it adds the steps and their traps.
7. Read `references/repo-checks.md` when setting up or reading a PR's checks: it adds the required
   checks per repo.
8. Read `references/interventions.md` after the change: it adds the record per kind and the
   notification channels.
9. Read `references/documentation.md` after the change: it adds the three audiences, the runbook
   shape and the handover test.

## Rules

- **Practice here, instance in the repos.** Hosts, stacks, addresses, traps and one system's runbook
  live in `infrastructure-stacks` (stacks, and the `openspec/` spine for every infrastructure change)
  and `cloud-infrastructure` (Terraform, Ansible); read them there.
- **Start in `infrastructure-stacks`;** the provisioning repo is the sibling `../cloud-infrastructure`,
  edited in the same change. If it is missing, report it and stop that part; never guess a location.
- **A repo rule that contradicts a rule of a devops skill** (for example the "three-layer" port rule):
  apply the skill's rule and report the contradiction for the repo's own change.
- **New work starts from a template**, never from another stack's or VM's files; where they differ the
  template wins and the existing file's difference is a conformance gap to report.

| Template | Use it when |
|---|---|
| [`vm-module-block.tf`](assets/templates/vm-module-block.tf) | adding a VM |
| [`group-vars.yml`](assets/templates/group-vars.yml) | adding an inventory group |
| [`docker-host-playbook.yml`](assets/templates/docker-host-playbook.yml) | configuring a VM that runs a stack |
| [`role-contract/`](assets/templates/role-contract/README.md) | writing an in-house Ansible role |
| [`fail-closed-tasks.yml`](assets/templates/fail-closed-tasks.yml) | a service that boots with a default login or an unsafe state |
| [`tombstone.txt`](assets/templates/tombstone.txt) | removing the code of a retired system |
| [`runbook.md`](assets/templates/runbook.md) | the runbook of a recurring operation |
| [`execution-log.md`](assets/templates/execution-log.md) | an operation or migration change; the one log schema |

## Before you hand over

| Question | If not | Action |
|---|---|---|
| Was exactly the shown plan applied, and does a fresh dry run show no changes? | the card is void | back to the dry run and a new card |
| Is the `infra-reviewer` report on the PR? | the change is unreviewed | dispatch it and post the report |
| Is the record written and are the three audiences updated? | the next person cannot see what was done | write them in this change |

## Boundary & Related Skills

**Owns:** the three-layer operating model; the safe-change protocol and its consent-card use; the
OpenSpec change shapes for infrastructure; Terraform and Ansible practice; environments; the create,
change, resize, rebuild, sleep, wake and retire procedures; the required checks of the infrastructure
repos; records of interventions; the three documentation audiences and runbook structure; the
instance/practice split and the sibling layout.

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

Answers `VER, CLR, RSK` in `test-strategy`'s matrix (`references/devops.md`).
