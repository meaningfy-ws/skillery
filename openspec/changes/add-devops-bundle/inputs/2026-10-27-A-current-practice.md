# A — How Meaningfy runs infrastructure today (2026-10-27)

**Status:** SECONDARY input. Preserved, never groomed, never deleted.

**Provenance:** read-only reconnaissance on 2026-10-27 of the two private infrastructure repositories
(`cloud-infrastructure`, `infrastructure-stacks`) and of all 71 pages of the Confluence space MSC,
by four research agents in a Claude Code session with the owner. This file is the **sanitized,
method-level** digest of their reports. skillery is public:
no host, address, port, account, secret location or open weakness tied to a named system appears here
(DEC-4).

## §1. The three layers

| Layer | Repository | Tooling | Who applies |
|---|---|---|---|
| Machines: VMs, volumes, cloud firewall, load balancers, DNS, private network, bastion | `cloud-infrastructure/meaningfy-terraform` | Terraform, Hetzner provider, S3-compatible remote state | the Infra owner, by hand, from a saved plan |
| Configuration: OS hardening, host firewall, Docker, volume mount, monitoring agents, backup timers, non-Docker services (Odoo), bastion users | `cloud-infrastructure/meaningfy-ansible` | Ansible, dynamic inventory grouped by the `role` label, Ansible Vault | the Infra owner, `--check --diff` first |
| Services: one Docker Compose stack per VM, its own Traefik, deploy workflow per stack | `infrastructure-stacks` | Docker Compose, GitHub Actions (push to `main` or manual dispatch), rsync over SSH through the bastion | GitHub Actions on merge |

The `role` label joins the layers: Terraform labels the VM, Ansible groups by it, the stack directory,
its workflow, its `<STACK>_HOST` variable and its `<STACK>_*` secrets share the name.

Two client-specific delivery exceptions exist; the owner states they are **exceptions,
likely dropped soon**, and out of the method (shaping Q&A, D-file).

## §2. The lifecycle as practised

1. **Specify.** Every new business service, and every non-trivial infra change, starts as an
   OpenSpec change in `infrastructure-stacks/openspec/` (EPIC, design, tasks), clarity gate ≥ 9/10,
   approved by the Infra owner. Big moves keep an `execution-log.md`. A 4-page Confluence checklist
   ("How to create a new business service", phases 0–6) is copied into the change's `tasks.md`.
2. **Provision.** Copy a VM module block, add DNS, PR, merge; the owner runs `plan -out`, reads it
   (no replace, no destroy), applies the saved plan, verifies DNS.
3. **Configure.** A second PR copies the new volume id into Ansible variables and adds the inventory
   group, the playbook and its import; `--check --diff`, then the real run.
4. **Secrets.** Created in Vaultwarden first (the source of truth), then copied to GitHub Secrets /
   Environments, Ansible Vault or local tfvars. Never printed; agents write secrets only through
   pipes.
5. **Deploy.** Add the stack directory and copy an existing deploy workflow; merge is the first
   deploy. The workflow writes `.env` from GitHub Secrets, rsyncs, pulls or builds, recreates the
   containers, prints `docker ps`, and prunes images. Multi-instance stacks use a workflow matrix over
   GitHub Environments with a SHA guard and one-deploy-at-a-time concurrency (the best template).
6. **Operate.** Prometheus targets and alert rules added by hand; Grafana, Alertmanager to Slack
   `#infra-alerts`; a backup role (nightly app-native dump → object storage, 7 daily / 4 weekly /
   3 monthly, a last-success metric and a `BackupStale` alert at 26 h); one dated restore test.
7. **Change.** Ports follow the **three-layer rule** (cloud firewall, host firewall, compose); a
   missed layer blocks silently. Resize keeps the disk; disruptive changes are announced in Slack
   `#operations` ≥ 30 minutes ahead.
8. **Sleep / wake.** A `sleeping` switch deletes the server and keeps the disk, firewall and a
   snapshot, to save cost; waking is apply, playbook, redeploy.
9. **Retire.** Snapshot (delete-protected, keep-until date), announce, decouple monitoring and
   firewall and DNS, remove the code, two applies, record the host in a redacted capture under
   `docs/decommissioned/`, move it in the Confluence inventory.

## §3. Conventions worth keeping

- Spec-first; decisions cited in code comments (`DEC-n`, change id); Conventional Commits scoped by
  stack or VM; `[skip ci]` on doc-only commits so they do not redeploy.
- Safe module defaults: delete and rebuild protection, volume protection, keep-disk on resize.
- Apply only a saved, read plan; stop on any replace or destroy that was not intended.
- Names `meaningfy-<env>-<role>`; four labels on every resource (project, environment,
  managed_by, role).
- "Never `:latest`"; images pinned by version.
- Data on an attached volume under `/opt/data/<service>`; `restart: unless-stopped`.
- Private by default; admin UIs behind auth or an allow-list; a dedicated least-privilege account for
  each consumer of a shared service.
- Backups follow data value (rebuildable data is not backed up, by decision).
- Each repo has a thorough `AGENTS.md`: hard rules, a "where to change what" table, known traps, a
  security baseline (A1–A9); "the repo wins over Confluence".
- Confluence MSC summarises and points to repo runbooks; inventory pages (VMs, backups, DNS,
  decommissioned, change log) are kept by hand.

## §4. People and channels

- One **Infra owner** approves and runs every apply and playbook; the incident procedure is a draft.
- Slack: `#infra-alerts` (Alertmanager), `#operations` (announcements), a requests channel.
- Jira OPS project for devops sprints (Jan–Mar 2026), then the cadence stopped.

## §5. Documentation today

| Audience | Where | State |
|---|---|---|
| Machines (agents) | OpenSpec specs and changes in `infrastructure-stacks/openspec/`; each repo's `AGENTS.md` | current, strong |
| People, in the repo | READMEs, `docs/runbooks/` (new VM, new stack, resize, rebuild, decommission, client Odoo) | mostly current; the new-stack runbook is a skeleton; some tables stale |
| People, in Confluence | MSC: inventory, runbook summaries, reference pages, one post-incident report, a draft incident procedure | mixed: October pages current, many June and older pages stale; live status often posted as comments |

`infrastructure-stacks/AGENTS.md` already points to skillery and expects a skill named
`infrastructure-operations` from a change it calls `add-infrastructure-operations-skill` (the change
in skillery is this one, `add-devops-bundle`). It also records that `ci-cd-delivery`'s claim that
`devops-toolkit/op-delivery.yml` is a stack-deploy mechanism is wrong.
