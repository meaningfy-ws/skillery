# PLAN-10: `ci-cd-delivery` Skill (CI/CD & Release)

> Derived from [EPIC-10](EPIC-10-ci-cd-delivery-skill.md). Clarity-gate before execution.
> **Deps:** PLAN-04 (`engineering/` subfolder + bundle). **Review-gated:** DevOps must ratify the §6
> decisions (EPIC-10) before the skill is adopted.

## Approach (sequence)

**(T1) study the real repos → (T2) model + boundary docs → (T3) secrets/.env + rotation docs →
(T4) standardise the deploy-trigger contract → (T5) reusable deploy mechanism template →
(T6) release + image-to-registry template → (T7) ownership composition → (T8) place + bundle +
validate.** T1 grounds everything; the §6 decisions are confirmed with DevOps during T4–T6.

## Task breakdown

### T1 — Study the real repos (grounding) *(EPIC C3)*
- **Deps:** none. **Steps:** read the actual workflows — `infrastructure-stacks` deploy workflow(s)
  + per-stack layout; `devops-toolkit/.github/workflows/op-delivery.yml` (the reusable workflow TED
  consumes); `ted-rdf-conversion-pipeline` `op-deliver.yml`; `entity-resolution-service`
  deploy/`workflow_dispatch` workflow; skim `cloud-infrastructure` to fix the boundary. Capture the
  rsync/`.env`/bastion block verbatim (the thing duplicated ~7×) as the basis for T5.
- **Acceptance:** a short grounding note in `references/` citing each source workflow + the verbatim
  deploy block; unverified items flagged.

### T2 — Delivery-model & boundary doc *(EPIC R1)*
- **Deps:** T1. **Files:** `skills/engineering/ci-cd-delivery/SKILL.md`,
  `references/delivery-model.md`.
- **Steps:** document the three-repo separation (provision → stack-deploy → app-repo) and the
  precise ownership/boundary split (what the skill owns = app-repo side; what it documents the
  contract to = `infrastructure-stacks`, `cloud-infrastructure`).
- **Acceptance:** an engineer can tell, from the doc, which repo owns each step and which steps this
  skill automates vs only documents.

### T3 — Secrets / `.env` / rotation doc *(EPIC R2, C2)*
- **Deps:** T1. **Files:** `references/secrets-model.md`.
- **Steps:** document Vaultwarden-as-source-of-truth → GitHub Secrets (deployment copy) → `.env`
  assembled in the deploy workflow only → rsync to VM; the rotation procedure; the bastion break-glass
  path **by reference** (link the Confluence runbook, don't duplicate). No secret values anywhere.
- **Acceptance:** the doc states the no-secrets-in-repo rule, the assemble-in-workflow rule, and the
  rotation steps; contains zero real secrets.

### T4 — Standardise the deploy-trigger contract *(EPIC R3, §6.1)*
- **Deps:** T1; **DevOps decision §6.1.** **Files:** `references/deploy-trigger-contract.md`.
- **Steps:** document the chosen standard (recommended: consume the `devops-toolkit` reusable
  workflow) as the app-repo→deploy contract; name the inputs/secrets it expects; mark the other two
  patterns (in-repo self-hosted; ad-hoc `workflow_dispatch`) as **legacy-to-migrate**.
- **Acceptance:** one documented contract; legacy patterns named with a migration note.

### T5 — Reusable deploy mechanism template *(EPIC R4, §6.3)*
- **Deps:** T1, T4; **DevOps decision §6.3.** **Files:** `assets/reusable-deploy/` (composite action
  or reusable-workflow template).
- **Steps:** factor the verbatim rsync + `.env`-from-Secrets + bastion-SSH block (from T1) into **one**
  reusable mechanism with placeholders; name the canonical home (recommended: `devops-toolkit`, all
  repos `uses:` it). The skill ships it as a template; consuming repos migrate off their copies.
- **Acceptance:** one parameterised deploy mechanism that reproduces the real block; placeholders only.

### T6 — Release + image-to-registry template *(EPIC R5, §6.2)*
- **Deps:** T1; **DevOps decision §6.2.** **Files:** `assets/release-image.yml.tmpl`,
  `references/release-and-versioning.md`.
- **Steps:** template a job that builds the Docker image, tags it **semver + git sha**, and **pushes
  to GHCR**; document version source (git tag/release) → image tag → optional changelog; document the
  build-on-VM → registry-pull migration as the recommended improvement.
- **Acceptance:** a runnable release+push template (GHCR) + the versioning convention; the migration
  from build-on-VM is documented as a DevOps-confirmed decision.

### T7 — Ownership composition (no overlap with project-setup) *(EPIC R6)*
- **Deps:** T2–T6. **Files:** `SKILL.md` (Boundary & Related Skills).
- **Steps:** state that **CI test/lint/guardrail/docs-publish workflows are owned by `project-setup`**
  (`ci-and-infra.md`); this skill owns **CD + release + delivery contract**; reference, don't restate.
  Ensure this row is added to the EPIC-05 tooling-ownership map (PLAN-05 T1).
- **Acceptance:** SKILL.md routes CI to `project-setup`; the EPIC-05 map carries the CD/release row.

### T8 — Place + bundle + validate *(EPIC R7, A5)*
- **Deps:** T1–T7, PLAN-04 T3. **Files:** `.claude-plugin/marketplace.json`.
- **Steps:** place under `skills/engineering/ci-cd-delivery/`; add to the `meaningfy-engineering`
  bundle; record trigger probes **in the PR body**; `SKILL.md` ≤500 lines; `make validate`.
- **Acceptance:** bundled under `meaningfy-engineering`; probes (PR body) pass; validate green.

## Anti-patterns
- ❌ Inventing a deploy pattern instead of codifying the real one (ground in T1).
- ❌ Putting any secret value in a template or doc (assemble from GitHub Secrets in-workflow only).
- ❌ Re-stating `project-setup`'s CI test/lint/docs workflows (own only CD/release/delivery).
- ❌ Automating `cloud-infrastructure` (Terraform/Ansible) — document the boundary only.
- ❌ Shipping yet another copy of the rsync/bastion block — provide the single reusable mechanism.

## Verification
- Each building block cites a real source workflow (T1); the secrets doc has zero values; the deploy
  mechanism reproduces the verbatim block behind placeholders; the release template pushes to GHCR
  with semver+sha tags; the EPIC-05 ownership map shows CI (project-setup) vs CD (this skill);
  `make validate` green. The §6 decisions are recorded as DevOps-ratified before adoption.

## Roadmap
- [ ] T1 study repos · [ ] T2 model/boundary · [ ] T3 secrets/rotation · [ ] T4 trigger contract
- [ ] T5 reusable deploy mechanism · [ ] T6 release+image (GHCR) · [ ] T7 ownership · [ ] T8 bundle+validate

## Clarity-gate self-check
Grounded in the real four-repo study (T1 is a precondition, not an assumption); the three genuine
domain decisions are surfaced as **DevOps-owned** (EPIC-10 §6), not hidden; the boundary to
`project-setup` (CI) and `cloud-infrastructure` (provisioning) is explicit, so nothing is authored
twice and nothing out-of-scope is automated.
