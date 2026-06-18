# Delivery model — the three-repo separation

Meaningfy's deploy architecture is intentionally decoupled across three repositories. Knowing which
repo owns what is the whole mental model: it tells you where a change belongs and which boundary you
must not cross.

## The three repos

### 1. `cloud-infrastructure` — provision & configure (DevOps-manual)

- **Terraform** — the Hetzner VM fleet and the AWS sandbox.
- **Ansible** — VM configuration and bastion user management.
- Runs **once** per VM lifecycle, by DevOps, via `terraform apply` / `ansible-playbook`.
- **Out of this skill's automation scope.** This skill documents the boundary only: app repos assume
  VMs already exist and are configured; they never run Terraform/Ansible.

### 2. `infrastructure-stacks` — deploy the stacks (GitHub Actions)

- One directory per **Docker Compose stack**.
- Deployed to VMs by GitHub Actions: **assemble `.env` from GitHub Secrets → rsync to the VM → `docker compose up -d`.**
- **No git-pull on the VM. No interactive SSH for routine deploys.** The Action is the single
  auditable deploy path.
- This skill documents the **contract** an application repo calls into; it does not own this repo.

### 3. Application repos — build, test, and trigger deploy (the side this skill OWNS)

Examples: `ted-rdf-conversion-pipeline`, `entity-resolution-service`.

- **CI** (build, test, lint, coverage, architecture, docs) — owned by
  [`project-setup`](../../project-setup/SKILL.md), not here.
- **CD** (release the artifact + trigger the deploy) — owned by this skill.

## The gap this skill closes

The app-repo side is currently **inconsistent**. Three observed facts:

1. **Three divergent deploy-trigger patterns:**
   - **push-on-path against shared stacks** — *legacy, migrate.*
   - **in-repo self-hosted runner** — *legacy, migrate.*
   - **cross-repo `workflow_dispatch`** — closest to the recommended standard.
2. **The SSH/bastion/rsync/`.env` block is duplicated ~7×.** A `devops-toolkit` reusable
   `op-delivery.yml` already exists and `ted-rdf-conversion-pipeline` consumes it — proof the
   reusable pattern works and should be the single source of truth.
3. **No repo pushes a versioned image to a registry** — all build on the VM from source, so there is
   no pinned, rollback-able artifact and no shared release/versioning convention.

## The contract direction (must hold)

```
application repo  ──trigger──▶  infrastructure-stacks  ──rsync/up──▶  VM
        │                                                              ▲
        └── assumes VMs provisioned/configured by ──────────  cloud-infrastructure
```

Application repos depend on the infra repos, never the reverse. The recommended trigger and the
reusable mechanism are **pending DevOps §6 ratification** (see [SKILL.md](../SKILL.md) §6).
