# EPIC-10: `ci-cd-delivery` Skill (CI/CD & Release)

> Part of the Skillery v2 series. See [EPIC-00](EPIC-00-master-index.md). **Tier:** new skill
> (engineering). **Depends on:** EPIC-04 (the `engineering/` subfolder + bundle). **Relates to:**
> EPIC-09 (project-setup scaffolds the workflows this skill defines), EPIC-05 (the gate/ownership map).

## 1. Purpose & goals (the shaped bet)

**Appetite:** medium. Codify Meaningfy's *real* delivery model and standardise the app-repo side of
it — which is today inconsistent — into one reusable skill, **reviewed with DevOps** (it touches
their domain).

**Problem (grounded in the real repos).** Meaningfy's deploy architecture is sound and decoupled:
- **`cloud-infrastructure`** — Terraform (Hetzner fleet, AWS sandbox) + Ansible (VM config, bastion
  users). Provisions/configures VMs **once**; DevOps-manual (`terraform apply`, `ansible-playbook`).
- **`infrastructure-stacks`** — Docker Compose stacks (one dir per stack), deployed to VMs via
  GitHub Actions: assemble `.env` from GitHub Secrets, **rsync** to the VM (no git-pull, no SSH for
  routine deploys), `docker compose up -d`. Vaultwarden is the secret source-of-truth; GitHub
  Secrets are the deployment copy.
- **Application repos** (`ted-rdf-conversion-pipeline`, `entity-resolution-service`, …) build/test
  and trigger deployment.

But the **application-repo side is unstandardised** (the gap a skill closes):
1. **Three divergent deploy patterns** across repos (push-on-path shared stacks; in-repo
   self-hosted runner; cross-repo `workflow_dispatch` API). No single contract.
2. The **SSH/bastion/rsync/.env block is duplicated ~7×** with no shared composite action /
   reusable workflow (a `devops-toolkit` reusable `op-delivery.yml` exists and TED uses it — proof
   the pattern works, but it is not the norm).
3. **No repo pushes a versioned image to a registry** — all build on the VM/runner from source. No
   shared **release/versioning** convention (semver tag → image tag → changelog).

**Solution outline.** A `ci-cd-delivery` skill that (a) **documents** the Meaningfy delivery model
and its boundaries, and (b) provides **standardised, reusable building blocks** for an application
repo: a release + image-build-and-push job, one reusable deploy mechanism (replacing the ~7×
duplication), the app-repo→`infrastructure-stacks` deploy-trigger **contract**, and the secrets/`.env`
convention. It **composes with** `project-setup` (which already owns the CI test/lint/docs workflows)
— this skill owns **CD + release + the delivery contract**, not the CI test lane.

**Non-goals.** Automating VM provisioning or Ansible (`cloud-infrastructure` stays DevOps-manual);
owning the stack definitions (`infrastructure-stacks` owns those); the CI **test/lint/docs-publish**
workflows (owned by `project-setup` `ci-and-infra.md`, EPIC-09); client redelivery/invoicing
(higher tier, out of scope per the series).

---

## 2. Requirements

### 2.1 Document the delivery model & boundaries

- **R1** Document the **three-repo separation** as the skill's mental model: `cloud-infrastructure`
  (provision/configure — DevOps-manual, Terraform+Ansible) → `infrastructure-stacks` (stack deploy
  via GHA, rsync + `.env`-from-Secrets) → **application repo** (build/test/release + trigger deploy).
  State precisely **what the skill owns** (the app-repo side) vs what it only **documents the
  contract to** (the other two).
- **R2** Document the **secrets model**: secrets never in the repo; **Vaultwarden is source-of-truth**;
  GitHub Secrets are the deployment copy; the deploy workflow is the **only** place `.env` is
  assembled (from Secrets) and is rsync'd to the VM — explicit, auditable, no git-pull. Include the
  rotation procedure (Vaultwarden → GitHub Secret → re-trigger workflow) and the bastion/SSH
  break-glass path by reference (not duplicated).

### 2.2 Standardise the app-repo CD (close the divergence)

- **R3** Pick **one** app-repo→deploy **trigger contract** and make it the standard (the skill
  documents the others as legacy to migrate). **Decision to confirm with DevOps** (see §6): the
  recommended default is **cross-repo `workflow_dispatch`/`repository_dispatch`** from the app repo
  to `infrastructure-stacks` (the ERS pattern), OR consuming the shared **`devops-toolkit` reusable
  workflow** (the TED `op-delivery.yml` pattern) — choose the one DevOps wants as the norm.
- **R4** Provide **one reusable deploy mechanism** — a composite action or reusable workflow that
  encapsulates the rsync + `.env`-from-Secrets + bastion-SSH step **once**, replacing the ~7×
  duplication. The skill ships it as a template and points to the canonical home (recommended:
  centralise in `devops-toolkit` so all repos `uses:` it, rather than copy-paste).
- **R5** Define the **release + image standard** (closes the no-registry gap): build a Docker image,
  **tag it by semver + git sha**, and **push to a registry** (recommended **GHCR**), so stacks pull a
  pinned, versioned image instead of building on the VM from source. Define the version source
  (git tag / release) → image tag → optional changelog. **Decision to confirm with DevOps** (adopt
  registry-pushed images vs keep build-on-VM) — flag as an explicit improvement over current state.

### 2.3 Compose, don't duplicate (ownership)

- **R6** The skill **references** `project-setup`/`ci-and-infra.md` for the CI **test/lint/guardrail/
  docs-publish** workflows (already owned there) — it does not restate them. It owns **only** CD +
  release + the delivery contract. This boundary is recorded in the EPIC-05 tooling-ownership map
  (EPIC-05 R7 / this EPIC's R-DOCS).
- **R7** Place in `skills/engineering/ci-cd-delivery/`; add to the `meaningfy-engineering` bundle.

### 2.4 Projection seam

- **R8** Define the seam to **EPIC-09**: `project-setup` scaffolds the CD/release workflow templates
  this skill provides **only for a deployable project** (the interview asks; a library or doc repo
  gets no deploy workflow). The templates live with this skill; `project-setup` renders them.

---

## 3. Constraints

- **C1** **Review with DevOps before adoption** — this skill encodes their domain; R3/R5 decisions
  are theirs to confirm. Treat the *Mandatory* dependency boundary (Vaultwarden, bastion, the two
  infra repos) as authoritative; do not contradict the Confluence runbooks.
- **C2** **Never put secrets in the repo or the skill** — `.env` is assembled from GitHub Secrets in
  the workflow only; templates carry placeholders, never values.
- **C3** Ground every building block in the **real repos** (`infrastructure-stacks` deploy workflow,
  `devops-toolkit/op-delivery.yml`, the two app repos) — reference, don't invent.
- **C4** Do **not** automate `cloud-infrastructure` (Terraform/Ansible) — document the boundary only.
- **C5** `SKILL.md` ≤500 lines; workflow templates + the deploy action live in `references/`/assets.

---

## 4. Acceptance criteria

- **A1** The skill documents the three-repo model, the ownership/boundary split, and the secrets +
  rotation + bastion model by reference (R1–R2).
- **A2** A single standardised **deploy-trigger contract** is chosen and documented; the other two
  patterns are named as legacy-to-migrate (R3).
- **A3** One **reusable deploy mechanism** (composite action / reusable workflow) is provided,
  replacing the ~7× rsync/bastion duplication, with its canonical home named (R4).
- **A4** A **release + image-to-registry** standard (semver+sha tag, GHCR push) is specified, with
  the build-on-VM→registry migration flagged as a DevOps-confirmed decision (R5).
- **A5** The CI/CD ownership split (`project-setup` = CI test/lint/docs; this skill = CD/release/
  delivery contract) is in the EPIC-05 map; skill is in `engineering/` + bundle; `make validate`
  passes (R6–R8).

---

## 5. Added / changed / deleted

| Action | Artifact |
|---|---|
| **Added** | `skills/engineering/ci-cd-delivery/` (SKILL.md + references: delivery-model, secrets-model, the reusable deploy action/workflow template, the release+image-build-push template, the deploy-trigger contract); bundle entry in `meaningfy-engineering` |
| **Changed** | EPIC-05 tooling-ownership map (CD/release ownership row); `project-setup` (EPIC-09) gains the conditional deploy/release scaffolding seam; `docs/environment-setup.md` (CD external boundary: the two infra repos + Vaultwarden + bastion) |
| **Deleted** | nothing — the ~7× duplicated deploy blocks are migrated to the reusable mechanism by consuming repos over time (out of this repo's scope; documented as the migration target) |

**R-DOCS (cross-cutting):** add the CI/CD boundary to `docs/environment-setup.md` (external infra
deps) and the methodology's "Epic delivered" step; record the CI-vs-CD ownership split in EPIC-05's
map.

---

## 6. Decisions to confirm with DevOps (explicit, owned)

These are genuine domain decisions for DevOps to ratify during skill authoring — not hidden
assumptions:

1. **Deploy-trigger standard** (R3): cross-repo `workflow_dispatch`/`repository_dispatch` vs the
   shared `devops-toolkit` reusable workflow. *Recommended: the `devops-toolkit` reusable workflow,
   since it already exists and removes duplication centrally.*
2. **Registry-pushed versioned images** (R5): adopt GHCR + semver/sha tags (stacks pull a pinned
   image) vs keep build-on-VM-from-source. *Recommended: adopt the registry — it is the largest gap
   and gives reproducible, rollback-able deploys.*
3. **Home of the reusable deploy mechanism** (R4): centralise in `devops-toolkit` (all repos `uses:`)
   vs ship a composite action per repo. *Recommended: centralise in `devops-toolkit`.*
