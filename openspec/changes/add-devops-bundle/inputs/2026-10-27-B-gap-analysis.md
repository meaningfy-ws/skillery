# B — Gaps against a reliable devops lifecycle (2026-10-27)

**Status:** SECONDARY input. Preserved, never groomed, never deleted.

**Provenance:** the same 2026-10-27 reconnaissance as file A, compared with the baseline in file C.
**Sanitized (DEC-4):** gaps are stated as **practice gaps**, never tied to a named host, port,
account or page. The specific instances (which stack, which rule, which page) belong to the
infrastructure repositories' own backlog, where the agents find them.

**The headline.** The method is mostly written down, in the repos and in Confluence. What is missing
is anything that makes it **hold** when one person carries it: checks that run without being
remembered, a second pair of eyes, a way back after a bad change, and a way for someone else to take
over. Contradictions between Confluence and the repos resolve toward the repos (owner, D-file).

## §1. By lifecycle stage

| # | Stage | Gap (practice level) | Weight |
|---|---|---|---|
| G-01 | Change | No automated check before merge in either repo (no fmt/validate/lint/plan, no compose or Prometheus config check, no workflow lint, no secret scan); merge to `main` deploys to production | high |
| G-02 | Change | The Terraform plan is read only by the applier, never shown on the PR; review sees code, not resource changes | high |
| G-03 | Change | One approver who is also the author; reviews cannot be enforced on private repos on GitHub Free | high |
| G-04 | Change | No record of what was applied, when, by whom, beyond git and memory; applies run from one laptop with local credentials | high |
| G-05 | Environments | Production, staging, demo share one state, one network, one bastion, one key; "environment" is a label, so Ansible roles are first tested on production | high |
| G-06 | Provision | Remote state without locking | medium |
| G-07 | Provision | Manual hand-offs between layers (ids copied from apply output into Ansible variables, repeated addresses, port rule kept by hand in three places) — "forgotten regularly" | medium |
| G-08 | Deploy | No rollback: images pruned after every deploy (one irreversible loss recorded), images built on the VM are not reproducible, rollback sections of runbooks unwritten | high |
| G-09 | Deploy | Versions change outside git: SHAs held in CI variables, one stack follows an app repo's HEAD, a few floating tags, digest pins rare | high |
| G-10 | Deploy | No promotion path between environments; "promotion" is setting the same SHA by hand | medium |
| G-11 | Deploy | Copy-pasted deploy workflows (12) have drifted: health verification ranges from `docker ps` to strict checks; concurrency guard in a third | medium |
| G-12 | Stack standard | The stated per-stack baseline (healthcheck, resource limits, container hardening, log rotation) is applied unevenly — hardening in a third of stacks, healthchecks missing in a third | medium |
| G-13 | Observe | Host and container metrics only; no HTTP, TLS-expiry or external probe; the monitoring server watches itself; no central logs | high |
| G-14 | Observe | Alerts go to one Slack channel, not tiered; incident detection depends on someone reading it (a 2026 incident's alerts went unanswered ~22 h) | high |
| G-15 | Observe | Prometheus targets and alert rules edited by hand; alert ownership recorded in comments | low |
| G-16 | Respond | Incident procedure is a draft, not in force; two competing incident registers (Odoo, Jira); no severity-to-response mapping in force, no on-duty rule, no client-notification clock | high |
| G-17 | Respond | The one post-incident report still says "remediation in progress"; its actions were never closed | medium |
| G-18 | Protect: backup | Restore runbooks exist for one service; restore drills ad hoc; some stateful stacks without data backup or without a tested restore (open exceptions) | high |
| G-19 | Protect: backup | One provider and mostly one region for servers, backups and the secret store; one backup credential with delete rights; no immutable or off-site copy; backups unencrypted by an earlier decision | medium |
| G-20 | Protect: access | No offboarding or periodic access review (the ratified InfoSec policy requires one); shared identities (a root key on every VM, a shared admin account, shared cloud console users) | high |
| G-21 | Protect: access | Some exposure beyond need recorded as known debt in the repos' bug register; one time-boxed allow-list with no enforced expiry | high |
| G-22 | Protect: secrets | No rotation schedule or inventory with last-rotated dates; some secrets generated on a VM exist nowhere else; credentials found in clear on a few Confluence pages | high |
| G-23 | Protect: supply chain | Actions pinned by tag, not SHA; default token permissions not narrowed; no image scanning or SBOM; Ansible collections and one installer unpinned | medium |
| G-24 | Document | Confluence inventory maintained by hand and out of sync with the repos (missing stacks, a stale space home, pages pointing to retired systems); live status posted as comments | medium |
| G-25 | Document | Two newer rules exist only on paper (pull pinned registry images, never build on the VM) while the workflows still build on the VM | medium |
| G-26 | People | Bus factor one: one person can apply, holds the local credentials and the retired-host archives; the colleague who may operate is not a devops engineer | high |
| G-27 | Skillery | `ci-cd-delivery` wrongly presents `devops-toolkit/op-delivery.yml` as the stack-deploy mechanism | low |

## §2. What already works and must be kept

Spec-first changes with a clarity gate; saved-plan apply; safe module defaults; Vaultwarden as the
source of truth; backups that raise an alert when stale; scripted cutovers with execution logs; the
retirement and sleep/wake procedures; the multi-instance deploy template; thorough `AGENTS.md`
manuals; "the repo wins".

## §3. Consequence for the EPIC

The bundle must carry the **target** practice — the gaps above closed at a size that fits a small
company (file C §12) — and the agents must **check conformance** to it, so hardening is driven by
use rather than by a one-off audit. The concrete fixes in the infrastructure repositories are their
own OpenSpec changes, seeded by the agents' findings; skillery ships the method, the policies, the
checks and the agents.
