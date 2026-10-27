# E — Patterns and anti-patterns in the two infra repositories (2026-10-27)

**Status:** SECONDARY input. Preserved, never groomed, never deleted.

**Provenance:** two exhaustive read-only passes on 2026-10-27, one per repository, every
non-vendored, non-generated file read: `cloud-infrastructure` (394 tracked files, 232 of them vendored
Galaxy roles) and `infrastructure-stacks` (705 tracked files, 254 of them generated decommission
captures). The owner asked for the patterns in depth. **Sanitized (DEC-4):** shapes and verdicts only; no host,
address, volume id, bucket, account, or statement of the repositories' current state. The full reports are in the
stacks repository under `docs/assessments/2026-10-27/`.

Legend: **T** = good enough to become a skill's standard template; **T\*** = template once the noted
drift is fixed; **anti** = do not copy.

## §1. Provisioning (`cloud-infrastructure`)

| Id | Pattern | Shape (what repeats) | Verdict |
|---|---|---|---|
| C-P1 | VM module block | banner comment (name, env, purpose, `openspec change:`) → `module "<role>_<env>"` with sections Naming / Server config (type with a why-comment, image, location, backups with its DEC, protection, `keep_disk`) / Network (pinned private address) / Firewall (public, app, restricted, each commented) / Volume (size and why, `volume_format = null`, `volume_automount = false`) / Labels | T, with `keep_disk = true` mandatory; some blocks lack it |
| C-P2 | Role label as the join key | `role` label → inventory group (`hcloud_labels.role == …`) → `group_vars/<group>.yml` → `<role>.yml` playbook → `site.yml` import → stack directory, workflow and secrets of the same name; load-balancer targets select by label | T; the kebab/snake translation and the group map are hand-written |
| C-P3 | Per-VM firewall, three exposure classes | private app ports, public ports (80/443 by policy), restricted ports with source lists; mirrored in the host firewall list and in compose `ports:` | T, **but** the cloud firewall filters public traffic only, and Docker-published ports bypass the host firewall: private ports must bind a private address or 127.0.0.1. The rule is stated as two layers for private ports |
| C-P4 | Terraform → Ansible hand-off | apply → read an id from the output → a second PR pastes it into group variables | **anti** as practised; template only when generated (inventory facts or a generated vars file) |
| C-P5 | group_vars file | header → SSH proxy → security overrides → host firewall ports → Docker → data volume → agents | T\* once the six sections repeated in every file move to a shared group |
| C-P6 | Playbook role order | security → firewall → data volume → Docker → CI tools → node exporter → cAdvisor → Portainer agent → backup | T as one Docker-host skeleton with optional slots |
| C-P7 | In-house role contract | role-prefixed `defaults/` with a header citing the decision; `tasks/main.yml` opens with `assert` on required inputs; split task files; templates marked "Managed by Ansible"; handlers flushed before timers are enabled; a post-run self-check; `no_log` on secret tasks; a README stating the contract | T (the newer roles); only two roles have READMEs |
| C-P8 | Fail-closed configuration | stop the service before the unsafe window; `block`; `rescue` stops it again and fails with a named error; every run re-verifies the security property from outside | T for any service that boots with default credentials |
| C-P9 | Backup role | timer (staggered, `Persistent`, randomised delay) → `set -euo pipefail` script → app-native consistent dump → non-empty check → calendar tier → copy to object storage → per-tier expiry → freshness metric written **last**, atomically, to the node-exporter textfile directory → `BackupStale` alert | T as **one** parameterised role |
| C-P10 | OS hardening baseline | two vetted Galaxy roles first in every play; per-group overrides | T, with the open choices named as decisions (fail2ban, reboot policy, auditd, sysctl, Docker daemon) |
| C-P11 | Bastion users | one dict, exclusive single key, `state: absent` then delete, dedicated playbook | T with no default privilege (explicit groups required) |
| C-P12 | Tombstone comments | `# <name> retired <date> (<change>; <reason>). Final snapshot <id> (delete-protected, keep until <date>).` where the block was | T, plus a rule for deleting the tombstone after keep-until |
| C-P13 | Decision citations in code | `# openspec change: …` banners; inline `(<change> DEC-n)`, `(task n.m)`; dated owner quotes; dated measurement notes | T |
| C-P14 | Recorded verification in docs | "Last restore test: <date>, passed" with artifact, size, counts, cleanup; "Fixed <date>" notes | T for every backed-up service |
| C-P15 | Sleep switch | module `sleeping` → server `count = 0`, volume and firewall kept, DNS follows; block comment with snapshot, approval, wake steps | T |
| C-P16 | Safe defaults, two-step removal | delete and rebuild protection on, volume protection on; removal = lift protection and apply, then remove and apply | T, with `keep_disk = true` as the module default |
| C-P17 | Config surface vs secrets | a tracked file holds every routine operator knob with docs; a git-ignored file holds secrets and machine paths only; a doc says where a new value goes | T (principle; from a client exception) |
| C-P18 | Commits and PRs | one small PR per step; Conventional Commits, scope = the service or VM; change id and task in parentheses; `(applied)` when a commit records an apply | T, folded into `meaningfy-git-workflow` |

Terraform idioms worth stating: `moved {}` whenever `count` is introduced; `import {}` to adopt
hand-made records; certificate names that hash their domains with `create_before_destroy`; relaxed
health checks for single-target load balancers; DNS TTL short behind load balancers; a specific record
overriding a wildcard for a cutover, deleting it is the rollback.

**Anti-patterns:** copy-paste instead of shared variables and roles (C-A1); cross-layer facts copied
by hand (C-A2); **role defaults carrying another service's values** (C-A3); insecure fallbacks (C-A4); dead code kept live (C-A5); coupling to a third-party role's internals (C-A6); docs
that restate code and rot (C-A7); fetch-and-run installs at "current" (C-A8); "temporary" exceptions
recorded only in comments (C-A9); iterating against production (C-A10); shared backup credentials and configuration (C-A11).

## §2. Stacks (`infrastructure-stacks`)

| Id | Pattern | Shape | Verdict |
|---|---|---|---|
| S-P1 | Stack anatomy | `<stack>/{docker-compose.yml, .env.example, README.md, config/ \| scripts/ \| <svc>/Dockerfile}` + `deploy-<stack>.yml` + host variable or Environment `<stack>-<instance>` + VM `meaningfy-<env>-<role>` + `/opt/stacks/<stack>`, `/opt/data/<svc>` | T |
| S-P2 | Compose service shape | pinned image with a comment on pin and patch cadence; `container_name`; `restart: unless-stopped`; memory limit with a measured comment; `no-new-privileges`; `read_only` / `cap_drop: [ALL]` / `user` where possible; bind mount under `/opt/data`; healthcheck; `depends_on: service_healthy`; proxy labels; one stack network; ports bound to a private address or 127.0.0.1 | T, with log rotation required (S4) |
| S-P3 | Proxy edge per stack | identical Traefik command block; providers with `exposedbydefault=false`; per-router host rule, TLS resolver; middlewares (basic auth, forward auth, security headers, allow-list) | T; resolver names and challenge types vary (DNS-01 single and wildcard, HTTP-01, TLS-ALPN) |
| S-P4 | Single-instance deploy workflow (the older "reference") | push + dispatch → SSH → rsync → `.env` heredoc with secrets pasted → pull ignoring failures → force-recreate → `docker ps` → prune all | **anti**: no guard, no concurrency, non-failing verify, secrets in scripts |
| S-P5 | Matrix deploy workflow | instances job → matrix with `fail-fast: false`, `environment: <stack>-<i>`, `concurrency: <stack>-<i>`, timeout → **guard** (empty host → skip; every value non-empty; SHA 40-hex; no `$`) → sparse checkout → app checkout at the SHA without persisted credentials → preconditions on the VM → `rsync --delete --exclude .env` → `.env` from `env:` under `umask 077`, mode 600 → build → `up -d` → **verify** (health wait, every service running, filtered log tail on failure) → scoped prune | T — the standard deploy workflow |
| S-P6 | Secret flow | generate → pipe into `bw create` (`<Service> — <instance> — <purpose>`, per-service collection) → pipe into `gh secret set` → workflow `env:` → `.env` 600 or secret files → names-only docs → masked verification (length, equality, hash prefix) | T |
| S-P7 | Backup + freshness | as C-P9, plus: a backup that never succeeded emits no metric and so no alert (the first run is checked by hand); the alert is tested by backdating the metric; pin a service only after its first backup reached storage | T |
| S-P8 | Monitoring registration | exporters by Ansible → targets with labels in two jobs → PR (redeploys monitoring) → verify targets; removal reverses and silences | T\*, with generated addresses and HTTP/TLS probes |
| S-P9 | OpenSpec change shapes | **A** feature or stack: proposal (Appetite, Why, DECs, Rabbit-holes, No-gos) + design (D-n, anti-patterns table, error matrix, phase table with an "idempotent?" column, clarity self-score) + tasks + spec delta + inputs. **B** operation or migration: A + append-only `execution-log.md` (When, Task, Actor, Target, Action, Result, Rollback) + `scripts/` (cutover, rollback, copy check, counts). **C** bug sweep: proposal + one hypothesis file per bug with "How to verify" + triage + a small delta | T; two execution-log schemas exist; an independent reviewer agent rescoring the plan and a baseline acceptance run (failures expected) before the change are practised |
| S-P10 | Cutover with rename-aside | pre-flight refusing to start while old names exist → preconditions → disable the old deployer → stop apps, then databases → copy volumes → dry-run equality check → rename old `<n>-old` → up → health wait → compare counts → rollback script → delete old only on the owner's go-ahead | T |
| S-P11 | Runbook structure | title, scope, status "written from first real run: <date>, change <id>", an "every run" block (re-check live, announce, irreversible go-ahead, code first, plan gate 0 destroyed, report in thread), numbered steps with ⛔ irreversible markers and a verify each, Rollback, a "when it goes wrong" symptom table | T (two runbooks still skeletons) |
| S-P12 | Acceptance feature structure | `tests/<stack>/features/<capability>.feature`, tag per stack, header citing spec, change and required settings; Scenario Outlines with an Examples row per instance; tags smoke / negative / e2e / manual; missing setting → skip (strict mode fails); data marked and cleaned; VM checks over the bastion that skip without access | T (not run in CI; five stacks covered) |
| S-P13 | Commits | as C-P18; `[skip ci]` on doc and spine commits so they do not redeploy | T |
| S-P14 | Sleep / wake | A: data on the volume, wake = fresh server + playbook + redeploy. B: root-disk data archived to the volume, wake from the snapshot image (new host keys) | T |
| S-P15 | Decommission capture | capture script → `docs/decommissioned/<host>/` → grep for keys and tokens → secrets-by-name table ("in Vaultwarden?") → data decision table → retirement checklist → residue grep | T |
| S-P16 | Shared-service consumer contract | provider README lists consumers; a least-privilege account per consumer; private-only port; the consumer points at the private address; provider deploy checks its consumers recover | T |
| S-P17 | Vendor upgrade with rollback material | backup → keep the previous image tarball → bump the pin → verify version and data → licence expiry recorded | T |

Resize and rebuild traps worth stating: "supported" type is not "has capacity"; `-replace` destroys
first; containers without a restart policy stay down; JVM heaps scale with RAM; a pending resize left
in code powers the server off on anyone's next apply.

**Anti-patterns:** copying the reference workflow (S-A1); publishing ports on all interfaces trusting
the host firewall (S-A2); `docker system prune -af` after a deploy (S-A3); versions held only in CI
variables or dispatch inputs (S-A4); hand-kept duplicate addresses and secret tables (S-A5); secrets
outside the secret flow (S-A6); status recorded in
several places (S-A7); skeleton docs never completed, spec Purpose left "TBD" (S-A8); per-change ad-hoc
log schemas (S-A9); experiment leftovers (S-A10); tests and config checks not wired to CI (S-A12).

## §3. What this changes in the PLAN

- The standard templates of the skills come from the **T** patterns above (design D-2, D-16).
- The per-stack minimum gains log rotation as a blocker and binds ports explicitly (D-4).
- The port rule is restated truthfully (C-P3).
- New expectations: no foreign defaults in a role, no insecure fallbacks, cross-layer facts generated
  rather than copied, temporary exceptions machine-checkable, every backup role with a recorded
  restore test, one generic backup role (D-3).
- The repo's practice of an independent plan rescoring and a baseline acceptance run before a change
  becomes part of the safe-change protocol for non-trivial changes (DEC-6, DEC-8).
