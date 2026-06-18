---
name: ci-cd-delivery
description: Standardise the application-repo Continuous Delivery side of Meaningfy systems — the deploy trigger, the reusable deploy mechanism, and the release/image standard. Use to set up a CD/deploy workflow, release and push a versioned Docker image to a registry (recommended GHCR, tagged by semver + git sha), standardise or migrate the deploy trigger, kill the duplicated SSH/bastion/rsync/.env deploy block by consuming the canonical reusable workflow, or understand the three-repo deploy model. CI (build, test, lint, coverage, architecture, docs publish) is NOT here — that is owned by project-setup; this skill owns only CD + release + the delivery contract. Trigger on "set up CD / deploy workflow", "release and push a versioned image", "GHCR image build", "standardise the deploy trigger", "migrate the duplicated deploy block", "how do we deploy this repo".
license: Apache 2.0
metadata:
  category: engineering
---

# CI/CD Delivery

## Overview

Meaningfy's deploy architecture is **decoupled across three repos**. This skill standardises the
**application-repo side** of Continuous Delivery — the only side teams own day to day — and
documents the *contract* to the two infrastructure repos without restating their runbooks.

It carries the **delivery contract** (how an app repo asks for a deploy and ships a release), a
**reusable-mechanism pointer + illustrative template**, and a **release/image standard**. It owns
**CD only**. Everything CI — build, unit/integration tests, lint, coverage, architecture
guardrails, docs publish — is owned by [`project-setup`](../project-setup/SKILL.md). The two never
overlap.

> **C1 — review with DevOps before adoption.** The §6 decisions below are DevOps's to ratify. Do
> not contradict `cloud-infrastructure` / `infrastructure-stacks` runbooks, Vaultwarden, or the
> bastion procedure — treat them as the authoritative boundary.
> **C2 — never put secrets in the repo or this skill.** Every template carries placeholders only.

## The three-repo model

Full detail in [`references/delivery-model.md`](references/delivery-model.md). The mental model:

| Repo | What it does | Automation | This skill |
|------|--------------|-----------|------------|
| **`cloud-infrastructure`** | Terraform (Hetzner fleet, AWS sandbox) + Ansible (VM config, bastion users). Provisions/configures VMs **once**. | DevOps-manual (`terraform apply`, `ansible-playbook`) | **Documents the boundary only** — out of automation scope |
| **`infrastructure-stacks`** | Docker Compose stacks (one dir per stack), deployed to VMs by GitHub Actions: assemble `.env` from Secrets, **rsync** to the VM, `docker compose up -d`. | GitHub Actions | **Documents the contract** the app repo calls into |
| **Application repos** (e.g. `ted-rdf-conversion-pipeline`, `entity-resolution-service`) | Build/test the app **and trigger its deployment**. | GitHub Actions | **OWNS and standardises this side** |

Routine deploys use **rsync, not git-pull and not interactive SSH**. The deploy workflow is the
single auditable place where `.env` is assembled and the stack is brought up.

## The secrets model

Full flow, rotation, and break-glass in [`references/secrets-model.md`](references/secrets-model.md).
The invariants:

- **Secrets never live in the repo** (C2) — not in code, not in this skill, not in committed files.
- **Vaultwarden is the source of truth.** **GitHub Secrets are the deployment copy** of those
  values, scoped to the repo/environment that deploys.
- The **deploy workflow is the only place** `.env` is assembled (from GitHub Secrets) and rsync'd to
  the VM. Explicit, auditable, no git-pull, no secret-bearing files in the repo.
- **Rotation:** rotate in Vaultwarden → update the matching GitHub Secret → re-trigger the deploy.
- **Break-glass** (bastion / SSH) is owned by the DevOps runbook — referenced, never duplicated here.

## The application-repo CD standard

This is what the skill prescribes for the app-repo side. Three parts: the trigger contract, the
reusable mechanism, and the release/image standard.

### 1. Deploy-trigger contract (R3)

Today three divergent patterns exist across repos (push-on-path to shared stacks; an in-repo
self-hosted runner; cross-repo `workflow_dispatch`). **One standard, the rest are legacy-to-migrate.**

- **Recommended default (pending DevOps §6 ratification):** an app repo triggers a deploy by a
  cross-repo `workflow_dispatch` / `repository_dispatch` into `infrastructure-stacks`, **or** by
  consuming the `devops-toolkit` reusable workflow. It does **not** carry its own bespoke deploy
  glue.
- **Legacy to migrate:** push-on-path against shared stacks, and the in-repo self-hosted runner.
  Both are named in [`references/delivery-model.md`](references/delivery-model.md) with their
  migration target.

### 2. Reusable deploy mechanism (R4)

The SSH/bastion/rsync/`.env` block is currently copy-pasted ~7× across repos. A `devops-toolkit`
reusable `op-delivery.yml` already exists and **`ted-rdf-conversion-pipeline` uses it** — proof the
pattern works.

- The **single runnable source of truth is the `devops-toolkit` reusable workflow.** App repos
  `uses:` it. Skillery **never hosts a second runnable copy** — that is exactly the duplication this
  skill exists to kill.
- The template in [`references/deploy-workflow-template.md`](references/deploy-workflow-template.md)
  is **illustrative / teaching only**: it shows the shape of the caller and how inputs/secrets map,
  and points at the canonical `devops-toolkit` source.

### 3. Release + image standard (R5)

Today no repo pushes a versioned image to a registry — all build on the VM from source, so there is
no pinned, rollback-able artifact. The standard (template in
[`references/release-image-template.md`](references/release-image-template.md)):

- Build a **Docker image**, **tag by semver + git sha**, **push to a registry (recommended GHCR)**.
- **Version source** = git tag / GitHub release → **image tag** → optional changelog.
- Stacks then **pull a pinned versioned image** instead of building on the VM — giving repeatable,
  rollback-able deploys.

## §6 — DevOps decisions to confirm (NOT yet ratified)

These are recommendations to present to DevOps, **not settled policy**. Mark them as such wherever
you act on them.

1. **Deploy-trigger standard** — recommended: the `devops-toolkit` reusable workflow (already
   exists; removes the duplication centrally).
2. **Registry-pushed versioned images** — recommended: adopt **GHCR + semver/sha**. Biggest current
   gap; it is what makes deploys rollback-able.
3. **Home of the reusable deploy mechanism** — recommended: centralise in **`devops-toolkit`**; all
   repos `uses:` it.

Until DevOps ratifies these, treat the recommendations as proposals: a deployable repo gets a
clearly-marked TODO stub plus the boundary docs, not a rendered runnable deploy workflow.

## Migration runbook

A concrete per-repo PR recipe lives in
[`references/migration-runbook.md`](references/migration-runbook.md): replace the inline ~7×
rsync/bastion block with `uses:` the reusable mechanism, map inputs/secrets, verify. A team can
execute it without re-deriving the pattern.

## Projection seam (→ project-setup, EPIC-09)

[`project-setup`](../project-setup/SKILL.md) scaffolds these CD/release templates **only for a
deployable project**, and **only renders the chosen template after DevOps ratifies §6**. Until then
a deployable repo receives a clearly-marked **TODO stub** plus the boundary docs — never a
half-guessed runnable deploy workflow. This skill owns the *content* of those templates;
`project-setup` owns *when and into what repo* they are projected.

## Boundary & Related Skills

**Owns:** the **application-repo CD side** — the deploy-trigger contract, the reusable-mechanism
pointer + illustrative template, the release/image standard (semver + git sha → GHCR), and the
per-repo migration runbook.
**Delegates:** CI (build, test, lint, coverage, architecture guardrails, docs publish) →
[`project-setup`](../project-setup/SKILL.md); code layering / structure →
[`cosmic-python`](../cosmic-python/SKILL.md).
**Documents-only (authoritative boundary, never automated or duplicated here):**
`cloud-infrastructure` (Terraform/Ansible), `infrastructure-stacks` (Compose stacks + deploy
Actions), **Vaultwarden** (secret source of truth), and the **bastion/SSH** break-glass procedure.
**Related:** [`project-setup`](../project-setup/SKILL.md), [`cosmic-python`](../cosmic-python/SKILL.md),
[`meaningfy-release`](../meaningfy-release/SKILL.md) — the release *lifecycle* (versioning, release
notes, PyPI publish, the release/hotfix runbook); it cites this skill for the GHCR image path and does
not restate it.
