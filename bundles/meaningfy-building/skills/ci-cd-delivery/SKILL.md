---
name: ci-cd-delivery
description: Standardise the application-repo Continuous Delivery side of Meaningfy systems — the deploy request and the release/image standard. Use to set up a CD/deploy workflow, release and push a versioned Docker image to a registry (recommended GHCR, tagged by semver + git sha), standardise or migrate the deploy trigger, or understand the three-repo deploy model. CI (build, test, lint, coverage, architecture, docs publish) is NOT here — that is owned by project-setup; this skill owns only CD + release + the delivery contract. Trigger on "set up CD / deploy workflow", "release and push a versioned image", "GHCR image build", "standardise the deploy trigger", "migrate the duplicated deploy block", "how do we deploy this repo".
license: Apache 2.0
metadata:
  purpose: devops
  area: coding
  subject: delivery-infra
  posture: precise
  stage: release
  maturity: stable
---

# CI/CD Delivery

An application repo at Meaningfy does not deploy itself: it releases a pinned image and asks
`infrastructure-stacks` to deploy it. The usual mistake is to copy an SSH, bastion, rsync and `.env`
block into the app repo's workflow and build on the VM from source.

> **C1: review with DevOps before adoption.** The §6 decisions are DevOps's to ratify. Never
> contradict the `cloud-infrastructure` or `infrastructure-stacks` runbooks, Vaultwarden, or the
> bastion procedure; they are the authoritative boundary.
> **C2: never put secrets in the repo or this skill.** Every template carries placeholders only.

## Quick Start

`ted-rdf-conversion-pipeline` deploys today with an inline rsync-over-bastion job and builds on the
VM. After the standard:

1. Merging release `v2.3.0` runs the release job: it builds the image on a GitHub-hosted runner and
   pushes `ghcr.io/meaningfy-ws/ted-rdf-conversion-pipeline:2.3.0` and `:sha-4f1c2ab`.
2. The request job opens a PR in `infrastructure-stacks` that changes the stack's image line to
   `…:2.3.0@sha256:<digest>`. Merging that PR deploys; reverting it rolls back.
3. The inline deploy block and its SSH secrets are gone from the app repo.

## Workflow

1. Place the change. Read `references/delivery-model.md` when deciding which repo a change
   belongs to: it adds the three repos, the three gaps on the app side, and the contract direction.
2. Release the image. Read `references/release-image-template.md` when writing a repo's release
   job: it adds the illustrative GHCR job and the outputs the deploy request pins.
3. Request the deploy. Read `references/deploy-workflow-template.md` when writing the request job:
   it adds the two request shapes and an illustrative job.
4. Migrate an existing repo. Read `references/migration-runbook.md` when a repo still carries an
   inline deploy block: it adds the per-repo PR recipe and how to verify it.

## Rules

### The three repos

| Repo | Does | Here |
|---|---|---|
| `cloud-infrastructure` | Terraform and Ansible; provisions and configures VMs once, by DevOps by hand | boundary only, never automated |
| `infrastructure-stacks` | one Compose stack per directory, deployed by GitHub Actions: `.env` from Secrets, rsync, `docker compose up -d` | the contract the app repo calls into; owned by `stack-operations` |
| application repos | build, test, release the image, request the deploy | owned and standardised here |

Routine deploys use rsync from the stacks repository's workflow: no git-pull on the VM, no
interactive SSH.

### Secrets

Vaultwarden is the source of truth; GitHub Secrets are the deployment copy, scoped to the repo or
environment that deploys; the deploy workflow is the only place `.env` is assembled. Read
`references/secrets-model.md` when rotating a secret or tracing where a value comes from: it adds
the flow, the rotation steps and where break-glass lives.

### Deploy trigger

One standard: the app repo requests a deploy from `infrastructure-stacks`, by a PR that bumps the
stack's pinned `tag@sha256` (preferred) or by a dispatch the stacks repository defines. It carries no
deploy glue of its own. Push-on-path against shared stacks and the in-repo self-hosted runner are
legacy to migrate. How the stacks repository deploys, rolls back and health-gates is
`stack-operations`'s.

### Release and image

Build a Docker image on a GitHub-hosted runner, tag it by semver and git sha, push it to a registry
(recommended GHCR). The git tag or GitHub release is the version source (`meaningfy-release` owns the
versioning). Stacks pull the pinned image, never `latest` and never a build on the VM.

### §6: DevOps decisions to confirm (not yet ratified)

Recommendations to present to DevOps, not settled policy; mark them as such wherever you act on them.

1. **Deploy-request shape:** a PR in `infrastructure-stacks` that bumps the pinned image; a dispatch
   where the stacks repository defines one.
2. **Registry-pushed versioned images:** GHCR with semver and sha. The biggest current gap: it is
   what makes deploys rollback-able.

Until DevOps ratifies them, a deployable repo gets a clearly marked TODO stub plus the boundary docs,
never a rendered, runnable deploy workflow. This skill owns the content of the CD templates;
`project-setup` owns when and into which repo they are projected.

### Common mistakes

| Mistake | Why it fails | Do instead |
|---|---|---|
| Copy the SSH, bastion, rsync and `.env` block into the app repo | the mechanism drifts across repos and secrets spread | request a deploy from `infrastructure-stacks` |
| Build the image on the VM from source | no pinned, rollback-able artifact | push a semver and sha tagged image to GHCR |
| Pin a stack to `latest` | a deploy is not repeatable | pin `tag@sha256` |
| Edit `.env` on the VM | the next deploy overwrites it | change Vaultwarden, then the GitHub Secret, then redeploy |
| Render a runnable deploy workflow before §6 is ratified | DevOps has not agreed the shape | a marked TODO stub |

## Triggers

- When a workflow in an app repo holds `ssh`, a bastion host or `rsync`, propose the migration runbook.
- When someone asks to deploy a repo, check the stack exists in `infrastructure-stacks` before
  writing a request job.
- When a fact is about VMs, Terraform or Ansible, stop at the boundary and point to DevOps.

## Before you hand over

| Question | If not | Action |
|---|---|---|
| Does every template carry placeholders only (C2)? | a secret is in the repo | remove it, rotate it in Vaultwarden |
| Does the app repo carry no deploy glue? | the duplication remains | replace it with a request job |
| Does the request pin `tag@sha256`? | rollback is guesswork | pin the digest the release job outputs |
| Is each §6 recommendation marked as not ratified? | a proposal reads as policy | mark it |

## Boundary & Related Skills

**Owns:** the application-repo CD side: the deploy-trigger contract, the deploy request and its
illustrative template, the release and image standard (semver and git sha, GHCR), and the per-repo
migration runbook.
**Delegates:** CI (build, test, lint, coverage, architecture guardrails, docs publish) to
`project-setup`; code layering to `cosmic-python`.
**Documents only (authoritative boundary, never automated or duplicated here):**
`cloud-infrastructure` (Terraform, Ansible), `infrastructure-stacks` (Compose stacks and deploy
Actions), Vaultwarden (secret source of truth), and the bastion and SSH break-glass procedure.
**Related:** `stack-operations` (everything from the deploy request onward: deploy workflow,
rollback, per-stack minimum); `infrastructure-security` (access and secrets on the infrastructure
side); `meaningfy-release` (the release lifecycle: versioning, release notes, PyPI publish, the
release and hotfix runbook; it cites this skill for the GHCR image path); `project-setup`,
`cosmic-python`.

Answers `VER, RSK` in `test-strategy`'s matrix (`references/devops.md`).
