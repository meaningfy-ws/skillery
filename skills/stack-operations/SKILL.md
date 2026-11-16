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

A Compose stack that "starts" can still crash-loop, fill the disk or change version without a commit;
this skill holds the minimum every stack meets and how it is deployed, pinned, promoted, rolled back,
created, upgraded or moved. A stack is one folder of the stacks repository: a `compose.yml` (or
`docker-compose.yml`), its `.env.example` (SHOULD, when the stack reads variables), a README and a
deploy workflow, run on one VM per instance.

## Quick Start

**Input:** "Is `<stack>/compose.yml` ok?"

1. Run the conformance check from the skill folder: `python scripts/check_stack.py <stack>/compose.yml`
2. Read the table, one row per service and rule:

   ```
   stack     service     rule  status     detail
   <stack>   <service>   S4    missing    no log rotation
   <stack>   <service>   S7    missing    no private bind address: 8080:80
   <stack>   <service>   S2    excepted
   ```

   The command exits 1 because two rules are `missing`; `excepted` still counts as a known gap.
3. Fix each `missing` row: add `logging:` with `max-size` and `max-file`, and change the port to
   `"127.0.0.1:8080:80"`. Read `references/stack-standard.md` when a row is unclear or an exception
   is needed: it adds each rule S1-S9 with its reason, the exception syntax and the S4 daemon trap.
4. Where a rule truly does not apply, comment inside the service's block,
   `# conformance-exception: S<n> <reason>`, and say why in the PR. Run the check until it exits 0.

**Output:** a PR on the stacks repository whose compose file passes the check, every exception
written and reasoned. Merging it deploys the stack health-gated.

## Workflow

1. Work in the stacks repository, on a branch, through the safe-change protocol
   (`infrastructure-operations`). Read the stack's README and `compose.yml` first.
2. Read `references/deploy-workflow.md` when writing a deploy workflow, or when a deploy
   "succeeded" while broken: it adds the health gate, the template's parts and the triggers.
3. Read `references/versions-and-promotion.md` when changing an image version or promoting: it adds
   the pin-by-digest rule and promotion as a PR.
4. Read `references/rollback.md` when a deploy went wrong: it adds the revert steps and keep-3-images.
5. Read `references/new-stack.md` when creating a stack or adding a service: it adds the anatomy,
   the steps and the README's required sections.
6. Read `references/upgrades-with-data.md` before a database major version or a data-rewriting
   migration: it adds the steps and the PostgreSQL paths.
7. Read `references/cutover.md` when moving a running stack's data to a new layout or VM: it adds
   the steps and why each is there.
8. Read `references/shared-services.md` when other stacks use a stack: it adds the provider's
   contract.
9. Read `references/acceptance-tests.md` when proving a stack works before and after a change: it
   adds their shape and when they run.
10. Start new files from [`assets/templates/`](assets/templates/), never from another stack:
    `stack/` (compose, `.env.example`, README), `deploy-workflow.yml`, `cutover.sh`, `acceptance.feature`.

## Rules

**Common mistakes**

| Mistake | Why it fails | Do instead |
|---|---|---|
| Copying another stack or the old single-instance workflow | it brings a missing guard, a non-failing verify and another service's values | start from the templates; the template wins, the difference is a gap to report |
| Addresses and secret tables kept by hand in several files | they drift | name each fact once; `.env.example` lists secret names, never values |
| The same status in the stack README, the root README and a wiki | they contradict | the stack README holds it; the others point there |
| `check_stack.py`, `docker compose config` or the smoke scenarios run only by hand | unrun checks decay | wire them into the stacks repo's PR checks |
| Leftovers from experiments: a feature-branch deploy, a `${VAR:-changeme}` | an untested deploy, a known password | deploy from `main` only; S9 fails the default |

## Before you hand over

| Question | If not | Action |
|---|---|---|
| Does `check_stack.py` pass and is `docker compose config -q` clean? | the PR breaks the minimum | fix, or write a reasoned exception |
| After the merge, did `up --wait` and the smoke scenarios pass, and do the README's consumers still work? | the deploy is unverified | roll back by revert |
| Is the change recorded (`infrastructure-operations`)? | no one can see what was done | record it |

## Boundary & Related Skills

**Owns:** the stacks repository from a deploy request onward: the per-stack minimum S1–S9 and
`scripts/check_stack.py`; the deploy workflow (health-gated, one reusable workflow); versions pinned
in git, promotion, rollback and the keep-3-images rule; new stack, upgrades with data, cutover,
shared-service consumers and stack acceptance tests; the stack templates.

**Does NOT own:**
- building, tagging and publishing an application image, and requesting a deploy → `ci-cd-delivery`;
- VMs, Terraform, Ansible (including the Docker daemon defaults), the safe-change protocol, the
  consent card, change shapes, records and the execution-log template → `infrastructure-operations`;
- monitoring, alerts, backups (the one parameterised backup role) and restore tests, incidents and
  the unattended-action policy → `service-reliability`;
- secrets, exposure (the two-layer port rule behind S7), action pinning and token scope, image
  scanning → `infrastructure-security`;
- version numbers, release notes and SBOMs → `meaningfy-release`.

**Related:** `infrastructure-operations`, `service-reliability`, `infrastructure-security` and
`ci-cd-delivery` for the jobs above; `bdd-gherkin` for writing the acceptance features;
`meaningfy-git-workflow` for commit and branch conventions in the stacks repository.

Answers `VAL, VER, ROB, RSK` in `test-strategy`'s matrix (`references/devops.md`).
