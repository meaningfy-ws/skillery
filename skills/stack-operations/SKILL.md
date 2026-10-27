---
name: stack-operations
description: "Use this skill when deploying or changing a Docker Compose stack in the stacks repository (\"deploy a stack\", \"add a new service\", \"roll back\", \"upgrade postgres\", \"is this compose file ok\", \"pin the image\", promote a version, cut over data); it holds the per-stack minimum S1-S9 and its conformance check, the health-gated deploy workflow, versions pinned in git, promotion, rollback, and the templates for a new stack, a cutover and its acceptance tests. Not for building, tagging or publishing an application image, or for requesting a deploy from an application repository (ci-cd-delivery)."
license: Apache 2.0
metadata:
  purpose: devops
  area: operations
  subject: delivery-infra
  posture: precise
  stage: release
  maturity: experimental
---

# Stack Operations

A stack is one folder of the stacks repository: a `compose.yml` (or `docker-compose.yml`), its
`.env.example` (SHOULD, when the stack reads variables), a README and a
deploy workflow, run on one VM per instance. This skill is the standard for that folder and
everything that happens to it after a deploy is requested: what every service must have, how it is
deployed, where its version lives, how it is promoted and rolled back, and how a stack is created,
upgraded or moved.

## Quick Start

**Input:** "Is `<stack>/compose.yml` ok?"

1. Run the conformance check from the skill folder:
   `python scripts/check_stack.py <stack>/compose.yml`
2. Read the table. One row per service and rule:

   ```
   stack     service     rule  status     detail
   <stack>   <service>   S4    missing    no log rotation
   <stack>   <service>   S7    missing    no private bind address: 8080:80
   <stack>   <service>   S2    excepted
   ```

   The command exits 1 because two rules are `missing`. `excepted` still counts as a known gap.
3. Fix each `missing` row as [stack-standard](references/stack-standard.md) says. Here: add
   `logging:` with `max-size` and `max-file`, and change the port to `"127.0.0.1:8080:80"`.
4. Where a rule truly does not apply, add a comment inside the service's block,
   `# conformance-exception: S<n> <reason>`, and say why in the PR.
5. Run the check again until it exits 0.

**Output:** a PR on the stacks repository whose compose file passes the check, with every exception
written and reasoned. Merging it deploys the stack health-gated.

## Workflow

1. Work in the stacks repository, on a branch, through the safe-change protocol
   (`infrastructure-operations`).
2. Read the stack's README and `compose.yml` first, then pick the reference:
   - Checking or fixing a compose file, or an exception: [stack-standard](references/stack-standard.md).
   - Writing or fixing a deploy workflow, or a deploy that "succeeded" while broken:
     [deploy-workflow](references/deploy-workflow.md).
   - Changing an image version, or promoting from staging: [versions-and-promotion](references/versions-and-promotion.md).
   - A deploy went wrong: [rollback](references/rollback.md).
   - Creating a stack or adding a service: [new-stack](references/new-stack.md).
   - A database major version or a migration that rewrites data: [upgrades-with-data](references/upgrades-with-data.md).
   - Moving a running stack's data to a new layout or VM: [cutover](references/cutover.md).
   - A stack that other stacks use: [shared-services](references/shared-services.md).
   - Proving a stack still works before and after a change: [acceptance-tests](references/acceptance-tests.md).
3. Start new files from [`assets/templates/`](assets/templates/), never from another stack:
   `stack/` (compose, `.env.example`, README), `deploy-workflow.yml`, `cutover.sh`, `acceptance.feature`.
4. Before the PR: `check_stack.py` passes and `docker compose config -q` is clean.
5. After the merge: the workflow's `up --wait` passed, the smoke scenarios pass, the consumers in the
   README still work. Record the change (`infrastructure-operations`).

## Gotchas

- **Copying another stack or the old single-instance workflow.** It brings a missing guard, a
  non-failing verify and another service's values. Start from the templates.
- **Publishing a port on all interfaces and trusting the host firewall.** Docker bypasses it. Bind a
  private address or `127.0.0.1` (S7).
- **`docker system prune -af` after a deploy.** It deletes the image you would roll back to. Keep the
  last 3 ([rollback](references/rollback.md)).
- **The version held in a CI variable, a dispatch input or `.env`.** None of them is in git. A tag
  read from `.env` (`image: <image>:${TAG}`) fails S1; the pin belongs in `compose.yml`.
- **Addresses and secret tables kept by hand in several files.** They drift. Name each fact once;
  `.env.example` lists secret names, never values.
- **Secrets pasted into a script or a remote command line, or `.env` edited on the VM.** Values pass
  through step `env:`; `.env` is rewritten by every deploy.
- **The same status written in several places** (stack README, root README, wiki). They contradict;
  the stack README holds it, others point there.
- **Skeleton docs never completed**, a spec purpose left "TBD". An empty section is a finding.
- **Each change inventing its own log format.** Use the execution-log template of
  `infrastructure-operations`.
- **Leftovers from experiments:** a deploy triggered by a feature branch, a `${VAR:-changeme}`
  default. Deploy from `main` only; S9 fails the default.
- **A backup set up by copying another stack's backup role.** Backups use the one parameterised role
  of `service-reliability`.
- **Tests and config checks that do not run in CI.** `check_stack.py`, `docker compose config` and
  the smoke scenarios belong in the stacks repo's PR checks.
- **Marking S4 excepted when the VM's Docker daemon has no default log rotation.** The disk still
  fills; check the configuration code first.
- **Changing only the image tag for a database major version.** The new server refuses the old data
  ([upgrades-with-data](references/upgrades-with-data.md)).

## Boundary & Related Skills

**Owns:** the stacks repository from a deploy request onward: the per-stack minimum S1–S9 and
`scripts/check_stack.py`; the deploy workflow (health-gated, one reusable workflow); versions pinned
in git, promotion, rollback and the keep-3-images rule; new stack, upgrades with data, cutover,
shared-service consumers and stack acceptance tests; the stack templates.

**Does NOT own:**
- building, tagging and publishing an application image, and requesting a deploy → `ci-cd-delivery`;
- VMs, Terraform, Ansible (including the Docker daemon defaults), the safe-change protocol, the
  consent card, change shapes and records → `infrastructure-operations`;
- monitoring, alerts, backups and restore tests, incidents and the unattended-action policy →
  `service-reliability`;
- secrets, exposure (the two-layer port rule behind S7), action pinning and token scope, image
  scanning → `infrastructure-security`;
- version numbers, release notes and SBOMs → `meaningfy-release`.

**Related:** `infrastructure-operations`, `service-reliability`, `infrastructure-security` and
`ci-cd-delivery` for the jobs above; `bdd-gherkin` for writing the acceptance features;
`meaningfy-git-workflow` for commit and branch conventions in the stacks repository.
