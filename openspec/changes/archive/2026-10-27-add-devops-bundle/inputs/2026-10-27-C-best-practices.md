# C — DevOps best-practice baseline for a small EU public-sector vendor (2026-10-27)

**Status:** SECONDARY input. Preserved, never groomed, never deleted.

**Provenance:** web research by a research agent on 2026-10-27 (primary sources linked per section; four facts re-checked online and marked *[verified 2026-10]*). Copied verbatim below the rule from the session scratchpad.

---

# DevOps best-practice baseline for a small EU public-sector software vendor (2025-2026)

**Profile assumed:** 10-20 people, a few engineers who handle ops part-time, no SRE team, EU-based, builds
data and semantic-web software for EU institutions and other public bodies. **Stack:** Terraform and
Ansible for provisioning, Docker Compose stacks in a separate repo, GitHub with GitHub Actions on the
**Free** plan, three repos per product (the app repo builds the image, the stacks repo deploys it, plus the
infra repo), Prometheus for monitoring, GitFlow and semver for releases.

**How to read this.** Every section gives the practice, why it matters, a minimum-viable version (MVP),
what counts as overkill at this size, and sources. Section 12 holds the prioritised list. Each claim is
marked by how sure it is: *[verified 2026-10]* means I checked it against a source during this research;
everything else is established practice I know from the primary sources listed but did not re-check for
this report.

**Key constraint that shapes everything: GitHub Free on private repos.** On the Free plan, branch
protection, rulesets and environment required-reviewers are **not enforced on private repositories**.
Required reviewers on private-repo environments need Enterprise, and branch protection or rulesets need
Team or above *[verified 2026-10, secondary sources plus GitHub plan docs, re-check github.com/pricing]*.
So on private repos "four-eyes" and "deploy approval" are **conventions** unless the company pays for Team
(about $4 per user per month). That is the single cheapest upgrade in this document, and several MVPs below
assume it or name the workaround.

---

## 1. IaC discipline (Terraform)

| Practice | Why it matters | MVP (small co.) | Overkill now |
|---|---|---|---|
| **Remote state with locking** | Local state gets lost, diverges between laptops, and holds secrets in plaintext. Without a lock, two concurrent applies corrupt the state. | Remote backend with encryption at rest and versioning turned on. On S3 or S3-compatible storage use `use_lockfile = true`: S3-native locking replaces DynamoDB, which is now **deprecated** *[verified 2026-10, HashiCorp S3 backend docs]*. Alternatives: the Postgres `pg` backend, HCP Terraform free tier, or OpenTofu with client-side state encryption. Use **one state per environment per stack**. | Terragrunt or Terraform Cloud Business. A dedicated state-management platform. |
| **Pin versions** | An unpinned provider or module silently changes the plan. | `required_version` and `required_providers` with `~>` constraints. **Commit `.terraform.lock.hcl`.** Pin modules to a git tag or a registry version, never `main`. | A private module registry. |
| **Module versioning** | Shared modules change under consumers. | Keep modules in-repo (`modules/`) until two products really share one. Then give it its own repo, tag it with semver, and have consumers pin to the tag. | One repo per module from day one. |
| **Plan in PR** | Reviewing the *plan* catches destructive changes (`-/+ replace`) that a code diff hides. | A CI job on each PR runs `fmt -check`, `validate`, `tflint` and `plan`, and posts the plan summary as a PR comment. `apply` runs only from the main branch, by a person or a manual-dispatch workflow. | Atlantis or Spacelift for a handful of stacks. |
| **Drift detection** | Hand changes in the console or on the host make the next apply surprising. | Scheduled weekly workflow runs `terraform plan -detailed-exitcode` and opens an issue or sends a chat message when the exit code is 2. | Continuous drift remediation. |
| **Env separation** | A fat-fingered apply against prod. | Separate directory or root module per env (`envs/staging`, `envs/prod`) with separate state and separate credentials. Avoid Terraform *workspaces* as the only separation for prod: one wrong `select` hits prod. | A separate cloud account per env per product (do it per *client* only if the contract requires it). |
| **Policy-as-code** | Mechanically enforces rules like "no public bucket" or "encryption on". | **Not yet.** A free static scanner covers 80% of the value: `trivy config` or `checkov` in the PR job. | OPA/Conftest/Sentinel custom policy libraries. Worth it only after 3 or more people write Terraform and a rule keeps being broken. |

Sources:
- HashiCorp, Terraform recommended practices: https://developer.hashicorp.com/terraform/cloud-docs/recommended-practices
- HashiCorp, S3 backend docs (use_lockfile, DynamoDB deprecation): https://developer.hashicorp.com/terraform/language/backend/s3
- HashiCorp, dependency lock file: https://developer.hashicorp.com/terraform/language/files/dependency-lock
- HashiCorp, drift detection concept: https://developer.hashicorp.com/terraform/tutorials/state/resource-drift
- OpenTofu state encryption: https://opentofu.org/docs/language/state/encryption/

## 2. Configuration management (Ansible)

| Practice | Why | MVP | Overkill |
|---|---|---|---|
| **Idempotence** | Re-running a playbook must be safe. That is what makes it a convergence tool and not a script. | Use modules instead of `shell`/`command`. Where `shell` is unavoidable, add `creates:`/`changed_when:`. Every playbook must show `changed=0` on a second run, and CI checks this. | — |
| **Inventories** | Mixing envs in one inventory leads to prod runs by accident. | One inventory per env (`inventories/staging`, `inventories/prod`) with `group_vars`/`host_vars`. Use a dynamic inventory plugin only if hosts churn. | A CMDB-backed dynamic inventory. |
| **Roles and collections pinned** | Galaxy content drifts. | `requirements.yml` with exact versions. Write roles small and single-purpose. | A private Automation Hub. |
| **Secrets** | Plaintext in git is permanent. | `ansible-vault` encrypted vars files (`vault_*` prefix convention), with the vault password from a password manager or a script, never committed. Alternatively SOPS (section 4) plus the `community.sops` lookup. | HashiCorp Vault lookup plugin. |
| **Lint and test** | Catches deprecated syntax and non-idempotent tasks early. | `ansible-lint` (production profile) and `yamllint` in CI on every PR. **Molecule** only for the 2-3 roles that matter most (base hardening, docker host), using the Docker or Podman driver, including its idempotence step. | Molecule for every role. Testinfra suites on trivial roles. |
| **Check mode / diff** | Shows the change before it is made. | `--check --diff` against prod before a real run. Record it in the PR for prod-affecting changes. | — |
| **AWX/Semaphore** | Central run log and RBAC. | Not yet. Running from a laptop or CI with a run log (CI output) is enough. | AWX/AAP at this size. |

Sources:
- Ansible good practices: https://docs.ansible.com/ansible/latest/tips_tricks/ansible_tips_tricks.html
- ansible-lint profiles: https://ansible.readthedocs.io/projects/lint/profiles/
- Molecule: https://ansible.readthedocs.io/projects/molecule/
- Ansible Vault: https://docs.ansible.com/ansible/latest/vault_guide/index.html

## 3. Deployment (images, Compose hosts, promotion, rollback)

| Practice | Why | MVP | Overkill |
|---|---|---|---|
| **Immutable images, built once** | "Works in staging" is meaningful only if prod runs the *same bytes*. | The app repo builds **one** image per commit or tag and pushes it to GHCR. Tag it `vX.Y.Z` plus `sha-<short>`. Never rebuild for prod. Config comes in through env/12-factor, never baked per env. | Per-env images. |
| **Digest pinning in the stacks repo** | Tags are mutable. A re-pushed `:1.4.0` silently changes prod. | The stacks repo references `image: ghcr.io/org/app:1.4.0@sha256:...`. Renovate or a release workflow bumps it through a PR. | Signature verification at pull (cosign policy). Add it only when a client asks. |
| **Promotion** | Prod should get only what staging has validated. | Promotion = a PR in the stacks repo that copies the staging digest into the prod file. The PR is the change record (section 10). | Automated progressive delivery (Argo Rollouts, Flagger). |
| **Push vs pull (GitOps)** | OpenGitOps: declarative, versioned and immutable, pulled automatically, continuously reconciled. Pull removes CI-held SSH keys to prod. | For Compose, **push is fine**: a GitHub Actions job with an environment-scoped SSH key, or an Ansible play running `docker compose pull && up -d --wait`. The stacks repo is the source of truth either way. Have a host-side reconciler (cron `git pull` plus compose up, or a tool like Komodo or Portainer GitOps) on the list for when CI-to-prod network access is a concern. | Kubernetes plus Argo CD or Flux just to get GitOps. |
| **Health-gated deploys** | Compose happily "succeeds" with a crashing container. | Every service has a `healthcheck`. Deploy with `docker compose up -d --wait`. Set `restart: unless-stopped` and log rotation (`json-file` `max-size`). | — |
| **Rollback** | MTTR beats MTBF for small teams (DORA: failed-deployment recovery time). | Rollback = revert the stacks-repo PR (the previous digest) and redeploy. **Database migrations must be backward-compatible across one release** (expand/contract), or rollback is fiction. Rehearse it once. | Automated rollback on SLO burn. |
| **Blue/green-lite on a Compose host** | Removes downtime and gives instant rollback for stateless services. | Use a reverse proxy (Traefik or Caddy) in front. Run `app-blue` and `app-green` as two compose projects and switch the proxy label or upstream after the new one is healthy. **Only for the stateless front services that clients notice.** Brief planned downtime with a notice is acceptable for the rest. | Blue/green for stateful stores (triplestores, Postgres). Canary analysis. |
| **Deploy freezes** | Avoids risky changes when nobody is around. | A written rule: no prod deploys Friday afternoon, during holidays, or in the week before a client milestone or demo, unless it is a hotfix. A calendar entry is enough. | Tooling-enforced freeze windows. |

Sources:
- The Twelve-Factor App (build, release, run; config): https://12factor.net/
- OpenGitOps principles: https://opengitops.dev/
- Docker Compose in production: https://docs.docker.com/compose/how-tos/production/
- Compose `up --wait` and healthcheck: https://docs.docker.com/reference/cli/docker/compose/up/
- DORA metrics (incl. failed-deployment recovery time): https://dora.dev/guides/dora-metrics-four-keys/
- DORA 2025 report (AI amplifies existing delivery practices; stability concerns): https://cloud.google.com/blog/products/ai-machine-learning/announcing-the-2025-dora-report

## 4. Secrets management sized for small teams

| Option | Fit | Notes |
|---|---|---|
| **GitHub Actions secrets + environments** | CI-time secrets only. | Scope them to **environments** (staging/prod), not the repo, so a PR workflow cannot read prod secrets. On private repos on Free there is no required-reviewer gate, but environment *secrets* still work. |
| **GitHub OIDC to the cloud** | Removes long-lived cloud keys from CI. | Works with AWS, Azure, GCP and HCP. Many EU hosters (Hetzner, OVH, Scaleway) do **not** support OIDC federation, so there a scoped API token in an environment secret is the realistic option. |
| **SOPS + age** | **Recommended default** for config-in-git (stacks repo `.env` files, Terraform tfvars). | Encrypt values, keep keys readable, review diffs. Use one age key per env and per person, listed in `.sops.yaml`. Revocation = remove the recipient, run `sops updatekeys`, **and rotate the secrets** (old ciphertext is in git history). SOPS is a CNCF project. |
| **Ansible Vault** | Already in use for Ansible. Fine. | Weakness: a single shared password that is hard to rotate. Don't spread it beyond Ansible. Long-term, consolidate on SOPS. |
| **Bitwarden Secrets Manager / Infisical** | When there are more than about 30 runtime secrets or several consumers. | Both have EU hosting and self-hosted options. Bitwarden SM fits if the company already uses Bitwarden for passwords. |
| **HashiCorp Vault / OpenBao** | **Overkill** at this size. | High operational cost (unseal, HA, upgrades). Revisit only for dynamic DB credentials at scale. |

**Rotation MVP:** keep an inventory (a table: secret, where used, owner, last rotated). Rotate **on
offboarding and on suspected exposure, always**, plus yearly for high-value ones (registry tokens, cloud
API tokens, DB admin). Turn on GitHub secret scanning and **push protection** (free on public repos;
GitHub's 2025 product split sells "Secret Protection" for private repos, so check what applies). Run
`gitleaks` in CI as a free fallback.

Sources:
- GitHub, using secrets in Actions: https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions
- GitHub, OIDC: https://docs.github.com/en/actions/security-for-github-actions/security-hardening-your-deployments/about-security-hardening-with-openid-connect
- SOPS: https://getsops.io/
- age: https://github.com/FiloSottile/age
- OWASP Secrets Management Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html
- gitleaks: https://github.com/gitleaks/gitleaks

## 5. Supply chain & CI hardening (GitHub Actions)

The motivating incident is **tj-actions/changed-files (CVE-2025-30066), March 2025**. The attacker
repointed *all version tags* to malicious code that dumped secrets into build logs, and about 23k repos
were exposed. CISA added it to the Known Exploited Vulnerabilities (KEV) catalogue *[verified 2026-10]*.
Repos pinned to a commit SHA were not affected.

| Practice | MVP | Overkill |
|---|---|---|
| **Pin third-party actions by full commit SHA** (`uses: x/y@<40-hex> # v4.2.1`) | Do it everywhere for non-GitHub-owned actions. Since Aug 2025 GitHub's Actions policy can **enforce SHA pinning and block specific actions** at org or repo level *[verified 2026-10, GitHub changelog 2025-08-15]*. Use `pinact` or `zizmor --fix` to convert. | Self-hosting forks of every action. |
| **Keep pins fresh** | Dependabot `package-ecosystem: github-actions` (understands SHA plus comment), or Renovate `helpers:pinGitHubActionDigests`. | — |
| **Least-privilege `GITHUB_TOKEN`** | Set the org default to **read-only**. Put `permissions: {}` or `contents: read` at the workflow top and widen per job (`packages: write` only in the publish job). | — |
| **Dangerous triggers** | Never check out PR code under `pull_request_target`. Never interpolate `${{ github.event.* }}` into `run:` (script injection); pass it via `env:`. | — |
| **Workflow linting** | `zizmor` (static analysis for Actions) in CI. It catches the two issues above plus unpinned actions. | Harden-Runner egress blocking (nice, optional). |
| **OIDC instead of long-lived keys** | Where the target supports it (section 4). | — |
| **Dependency updates** | Dependabot or Renovate for app dependencies, Dockerfiles, compose digests and Terraform providers. Group minor and patch updates to cut PR noise. | Auto-merge without tests. |
| **Image scanning** | `trivy image` in the build job. **Fail on CRITICAL with a fix available**, report the rest. Rescan prod images weekly on a schedule (new CVEs appear after the build). | Commercial container security platforms. |
| **SBOM** | Generate an SPDX or CycloneDX SBOM per release image (`syft`, or `docker buildx --sbom=true`) and attach it to the GitHub release. Cheap now, and **the CRA and public-sector buyers increasingly ask for it**. | SBOM management platforms (Dependency-Track is optional, useful once there are more than 5 products). |
| **Provenance / SLSA** | `actions/attest-build-provenance` (free for public repos; private repos need Enterprise for artifact attestations, so check) or `docker buildx --provenance=true` gives roughly SLSA Build L2. | Chasing SLSA Build L3, hermetic builds. |
| **OpenSSF Scorecard** | Run it once on the public repos as a **checklist**. Its checks (Token-Permissions, Pinned-Dependencies, Branch-Protection, Dangerous-Workflow, SAST, Security-Policy) match this section. | Gating on a score. |
| **SECURITY.md + private vulnerability reporting** | In every public repo. | — |

Sources:
- GitHub, security hardening for Actions: https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions
- GitHub changelog, policy for SHA pinning and blocking actions (2025-08-15): https://github.blog/changelog/2025-08-15-github-actions-policy-now-supports-blocking-and-sha-pinning-actions/
- CISA alert, CVE-2025-30066: https://www.cisa.gov/news-events/alerts/2025/03/18/supply-chain-compromise-third-party-github-action-cve-2025-30066
- OpenSSF Scorecard checks: https://github.com/ossf/scorecard/blob/main/docs/checks.md
- SLSA v1.0/1.1 levels: https://slsa.dev/spec/v1.1/levels
- zizmor: https://docs.zizmor.sh/
- NIST SSDF SP 800-218: https://csrc.nist.gov/pubs/sp/800/218/final
- Trivy: https://trivy.dev/

## 6. Observability

| Practice | Why | MVP | Overkill |
|---|---|---|---|
| **Black-box uptime checks** | The client's view, and the cheapest high-value signal. | Prometheus **blackbox_exporter** probes (HTTP 2xx, TLS cert expiry less than 14 days, SPARQL endpoint answers a trivial query), *plus* one external check from outside your own infra (Uptime Kuma on a separate VM or provider, or a SaaS free tier). If Prometheus dies, you must still find out. | Multi-region synthetic monitoring. |
| **Metrics** | Capacity and diagnosis. | node_exporter, cAdvisor, and app `/metrics` where cheap. Retain 15-30 days. | Long-term storage (Thanos/Mimir) before anyone needs a year of history. |
| **Logs** | Debugging and audit. | Ship container logs to **Loki** (with Grafana) or at least keep rotated local logs with a defined retention (30-90 days, GDPR-aware). Structured JSON logs in the app. | ELK/OpenSearch clusters. A full tracing rollout (OpenTelemetry tracing is worth it only for multi-service request paths). |
| **Alerting philosophy** | SRE book: page on **symptoms** (users affected), not causes. Every page must be actionable and urgent. | Alertmanager routes to **two tiers**: *page* (site down, error rate high, cert expiring less than 7d, disk full less than 24h out, backup job failed) goes to phone push; *ticket* (everything else) goes to a chat channel or issue. Each alert links a runbook. Delete any alert that fires and gets ignored twice. | Paging on CPU or memory. Dozens of alerts per service. |
| **SLOs-lite** | Shared definition of "good enough", and a basis for client SLAs. | Per client-facing service, write **one availability SLO** (for example 99.5% monthly, measured by the blackbox probe) and optionally one latency SLO. Review it monthly in a 15-minute ops review. Match it to the contract SLA, with the SLO stricter than the SLA. | Multi-window multi-burn-rate alerting, error-budget policies with release freezes. Adopt from the SRE workbook only when a contract demands it. |
| **Dashboards** | Fast orientation during incidents. | One "service overview" per product (RED: rate, errors, duration, plus probe status) and one host dashboard (USE). Dashboards as code (JSON in git, Grafana provisioning). | Per-team dashboard sprawl. |

Sources:
- Google SRE book, Monitoring Distributed Systems: https://sre.google/sre-book/monitoring-distributed-systems/
- Google SRE workbook, Alerting on SLOs: https://sre.google/workbook/alerting-on-slos/
- SRE workbook, Implementing SLOs: https://sre.google/workbook/implementing-slos/
- Prometheus alerting practices: https://prometheus.io/docs/practices/alerting/
- Rob Ewaschuk, "My Philosophy on Alerting": https://docs.google.com/document/d/199PqyG3UsyXlwieHaqbGiWVa8eMWi8zzAn0YfcApr8Q

## 7. Incident management & postmortems (small)

- **Severity levels (3 are enough):**
  - **SEV1:** prod down, data loss or security breach for a client. Respond now; notify the client within the contracted window. Check NIS2/GDPR clocks: 72h for GDPR personal-data breaches; under NIS2 *your client* has 24h/72h, so they will want to hear from you fast.
  - **SEV2:** degraded or partial. Same business day.
  - **SEV3:** minor. Goes to the backlog.
- **On-call without a rota team:** an explicit **business-hours "ops duty" weekly rotation** among 3-4 engineers, plus **best-effort out-of-hours** unless a contract pays for 24/7. Write that limit into contracts and SLAs, which is the honest and common small-vendor position. Phone push for SEV1 alerts goes to the duty person and a backup. Compensate out-of-hours time.
- **Incident roles collapse into one person** (incident lead = comms = fixer) up to SEV1, where a second person takes **client comms**.
- **Runbooks:** one short markdown page per alert and per routine procedure (restore, rotate key, redeploy, renew cert), stored **in the stacks/ops repo** next to the code and linked from the alert annotation.
- **Blameless postmortem** for every SEV1 and any SEV2 a client noticed. Template: summary; impact (who, how long); timeline; root and contributing causes; what went well; what went badly; where we got lucky; action items (owner and due date, tracked as issues). Aim for 1-2 pages. Review in the monthly ops review.
- **Security incident path:** a one-page plan naming who decides, who calls the client, the GDPR DPO contact, and evidence preservation. This is what client security questionnaires ask for.

Overkill: an incident commander rotation, PagerDuty enterprise tiers, status-page automation (a manual status
page or a client email is fine), formal problem management.

Sources:
- Google SRE book, Managing Incidents: https://sre.google/sre-book/managing-incidents/
- Google SRE book, Postmortem Culture: https://sre.google/sre-book/postmortem-culture/
- SRE workbook, postmortem example: https://sre.google/workbook/postmortem-culture/
- PagerDuty incident response docs (open source): https://response.pagerduty.com/
- NIST SP 800-61r3 (Incident Response, 2025): https://csrc.nist.gov/pubs/sp/800/61/r3/final

## 8. Backup/restore & DR

| Practice | MVP | Overkill |
|---|---|---|
| **3-2-1 (or 3-2-1-1-0)** | 3 copies, 2 media or providers, 1 off-site. Add **1 immutable or offline copy** (object-lock bucket or append-only restic/borg repository credentials) against ransomware and against a compromised admin. | Tape. Multi-cloud active-active. |
| **What to back up** | Data volumes (triplestore dumps or native backups, Postgres `pg_dump` or WAL), **plus** what rebuilds the system: Terraform state, the stacks repo (in GitHub, but mirror it), secrets keys (age/vault keys in a sealed password manager), container registry images for running versions. | — |
| **Consistency** | Use app-native dumps or snapshots, not raw file copies of a live database. | — |
| **Restore testing** | The "0" in 3-2-1-1-0 means zero errors on a verified restore. **Quarterly scheduled restore drill** of one service into a scratch environment, timed, and the measured time recorded as the real RTO. Automated weekly "restore and run a sanity query" for the most critical dataset if cheap. | Full DR failover exercises yearly per client. |
| **RPO/RTO** | Write them down per service and per contract. Typical small-vendor default: RPO 24h (nightly), RTO 1 business day. Tighter only if the contract pays for it. | Sub-hour RPO everywhere. |
| **Monitoring backups** | Backup job success emits a metric (Pushgateway or textfile collector, timestamp of last success). Alert if it is older than 26h. Failed backups are a **page**-tier alert. | — |
| **Encryption and location** | Encrypt backups (restic/borg do this natively) and keep them in the **EU** (public-sector data-residency clauses). | — |

Sources:
- CISA, 3-2-1 backup guidance: https://www.cisa.gov/sites/default/files/publications/data_backup_options.pdf
- NIST SP 800-34 Rev 1 (Contingency Planning): https://csrc.nist.gov/pubs/sp/800/34/r1/upd1/final
- restic: https://restic.net/
- ENISA / NIS2 Art. 21(2)(c) business continuity and backup management (see section 11)

## 9. Access management

| Practice | MVP | Overkill |
|---|---|---|
| **MFA everywhere** | **Enforce 2FA in the GitHub org** (org setting), the cloud consoles, the registry, the password manager and email. Prefer passkeys or FIDO2 keys for admins. | Hardware keys for every employee (nice, cheap-ish, optional). |
| **SSH** | Ed25519 keys, **no passwords, no root login** (`PermitRootLogin no`, `PasswordAuthentication no`), keys distributed **by Ansible from one authorized-keys list in git**. Offboarding = remove the line and run the play. Next step up: **SSH certificates** with short validity (step-ca, or a simple CA signing key in the password manager), so offboarding stops being a fan-out. | Teleport or a bastion with session recording, unless a client demands session audit. |
| **Least privilege** | Per-env access: not every engineer needs prod. Use named personal accounts, **no shared logins**. Use `sudo` with logging. Give the GitHub org **base permission read**, write access via teams, and 2 org owners. | Just-in-time access brokers. |
| **Offboarding** | A **checklist** run the same day: GitHub org, cloud IAM, SSH keys list, VPN, password manager shares, SOPS recipients (+ rotate the secrets they could read), registry tokens, client portals. Record completion. | Identity governance tooling. |
| **Audit trail** | GitHub org audit log (reduced retention on Free, so export periodically if needed), cloud audit logs on, `auth.log`/journald shipped to central logs, git history of the authorized-keys list. | SIEM. |
| **SSO** | Use one IdP (Google Workspace or Entra) for everything that supports it. GitHub SAML SSO needs Enterprise, so for now use 2FA plus the offboarding checklist. | GitHub Enterprise just for SSO. |

Sources:
- CIS Benchmarks (Ubuntu/Debian, Docker): https://www.cisecurity.org/cis-benchmarks
- CIS Controls v8.1 (IG1 = small-org baseline): https://www.cisecurity.org/controls/implementation-groups/ig1
- GitHub, requiring 2FA in an org: https://docs.github.com/en/organizations/keeping-your-organization-secure/managing-two-factor-authentication-for-your-organization/requiring-two-factor-authentication-in-your-organization
- OpenSSH certificates (ssh-keygen CERTIFICATES section): https://man.openbsd.org/ssh-keygen#CERTIFICATES
- Smallstep SSH certs: https://smallstep.com/docs/ssh/

## 10. Change management & documentation

- **Every prod change goes through git.** The PR in the infra or stacks repo *is* the change record: who,
  what, when, why, and the reviewer. No ticketing CAB needed. DORA's research finds heavyweight external
  change approval correlates with *worse* performance, while peer review in the delivery flow works
  better.
- **Four-eyes when the team is tiny:**
  - Prod-affecting PRs (stacks/infra) need **one reviewer other than the author**.
  - Allow a documented **break-glass**: an emergency change merged solo, with retroactive review within one business day.
  - On GitHub Free private repos this cannot be enforced, so either buy Team (enforced branch rulesets) or run a weekly check that lists PRs merged without approval.
- **ADRs** (Nygard format, `docs/adr/NNNN-title.md`) for decisions that are hard to reverse: hosting provider, secrets approach, backup design, auth. Ten ADRs a year is healthy.
- **Runbook-as-code:** runbooks in markdown next to the stacks. Where practical make them executable (Ansible play, `make restore SERVICE=x`) so docs and actions don't drift.
- **Changelog:** a user-facing CHANGELOG per app (keep-a-changelog plus semver, already done via GitFlow). For ops, the stacks-repo git log plus release tags is the deployment log. Optionally post a deploy marker (a Grafana annotation) on each deploy.
- **Release-flow note:** GitFlow is heavier than DORA's trunk-based recommendation. For versioned deliverables to public-sector clients with acceptance phases it is defensible. Keep release branches short-lived.

Sources:
- DORA capability, Streamlining change approval: https://dora.dev/capabilities/streamlining-change-approval/
- DORA capability, Trunk-based development: https://dora.dev/capabilities/trunk-based-development/
- Michael Nygard, Documenting Architecture Decisions: https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions
- adr.github.io: https://adr.github.io/
- Keep a Changelog: https://keepachangelog.com/

## 11. Compliance pressure for EU public-sector suppliers

**What applies directly versus what flows down.**

- **NIS2 (Directive 2022/2555)** applies directly to "essential/important entities". A 10-20 person company is
  usually **below the size threshold** (medium = 50+ staff or more than €10M turnover). Some digital-infrastructure
  categories (DNS, trust services) are covered regardless of size, and managed service providers are covered
  from medium size. *Public administrations are covered*, and **Art. 21(2)(d) obliges them to manage
  supply-chain security with their direct suppliers**. Implementing Regulation (EU) 2024/2690 details supplier
  policies, contract clauses (security requirements, incident notification, audit rights) and supplier
  assessments *[verified 2026-10, secondary legal commentary]*. ENISA's Technical Implementation Guidance (v1.0,
  June 2025) is non-binding but is what client security teams copy into questionnaires. EU institutions themselves fall
  under **Regulation (EU) 2023/2841** (cybersecurity for Union entities), with CERT-EU guidance, which also
  pushes requirements onto contractors.
- **Cyber Resilience Act (Regulation 2024/2847)**: if the company **places software products on the EU market**
  (versus pure bespoke services), manufacturer **vulnerability and incident reporting applies from 11 September
  2026** (24h early warning, 72h notification to ENISA/CSIRTs), and the full essential requirements (secure by
  design, SBOM, vulnerability handling, CE marking) apply from **11 December 2027** *[verified 2026-10, multiple
  secondary sources; check against EUR-Lex]*. Bespoke development under a public contract is generally not a "product
  placed on the market", but **published OSS releases and packaged products may be**. This needs a legal check.
  Open-source steward obligations are lighter.
- **GDPR**: as a processor for client data, a DPA, breach notification to the controller "without undue delay",
  EU data residency, and records of processing.

**What a small vendor actually gets asked** (typical tender and contract security annexes and questionnaires):

1. An information-security policy and named responsible person.
2. ISO 27001 certificate, *or* evidence of equivalent controls. Smaller lots usually accept "aligned with", larger framework contracts increasingly want the certificate.
3. Access control: MFA, least privilege, joiner/mover/leaver process.
4. Vulnerability and patch management with timelines, plus dependency/SBOM practice.
5. Secure development: code review, SAST and dependency scanning, secrets handling.
6. Incident response plan and **notification commitment to the client (often 24h)**.
7. Backup and BCP with tested restores, RPO/RTO.
8. Data location in the EU, subprocessors list, encryption at rest and in transit.
9. Logging and audit-trail retention.
10. Subcontractor management, plus right-to-audit acceptance.
11. Security awareness training for staff.

**ISO 27001-lite recommendation:**
- Build a **small ISMS skeleton aligned with ISO 27001:2022 Annex A**:
  - a risk register;
  - a Statement of Applicability for the relevant controls;
  - about 10 short policies (access, crypto/secrets, backup, incident, change, supplier, secure development, logging, acceptable use, BCP);
  - evidence that each one runs (the git history and the drills above *are* evidence).
- Certify only when a tender or framework demands it; 6-12 months of evidence first makes the audit cheap.
- **CIS Controls v8.1 IG1** (56 safeguards) is a good free "lite" baseline to map against.
- Cyber Essentials (UK) and the BSI IT-Grundschutz "Basis-Absicherung" are other recognised lite frameworks.

Sources:
- NIS2 Directive text (EUR-Lex): https://eur-lex.europa.eu/eli/dir/2022/2555/oj
- Implementing Regulation (EU) 2024/2690: https://eur-lex.europa.eu/eli/reg_impl/2024/2690/oj
- ENISA NIS2 Technical Implementation Guidance (June 2025): https://www.enisa.europa.eu/publications/nis2-technical-implementation-guidance
- DLA Piper, NIS2 explained part 3 (supply chain): https://www.dlapiper.com/en/insights/publications/2025/12/nis2-directive-explained-part-3-supply-chain-security
- Regulation (EU) 2023/2841 (Union entities): https://eur-lex.europa.eu/eli/reg/2023/2841/oj
- Cyber Resilience Act (Regulation 2024/2847): https://eur-lex.europa.eu/eli/reg/2024/2847/oj
- CRA reporting from 11 Sep 2026 (secondary): https://www.techtarget.com/cybersecurity/feature/EU-Cyber-Resilience-Act-reporting-What-CISOs-need-to-know
- OpenSSF CRA steward guidance: https://policy.openssf.org/CRA/stewards-one-pager.html
- ISO/IEC 27001:2022: https://www.iso.org/standard/27001
- CIS Controls IG1: https://www.cisecurity.org/controls/implementation-groups/ig1

## 12. Prioritised minimum hardening set (top 10)

Ordered by risk reduced per hour spent for this specific profile.

1. **MFA enforced on the GitHub org, cloud, registry, password manager and email, plus a same-day offboarding checklist** (including SOPS recipients, SSH keys list, tokens, and rotating what the leaver could read). This closes the most common real-world breach path.
2. **Harden GitHub Actions:**
   - pin third-party actions by SHA, enforced by the org SHA-pinning policy;
   - set the default `GITHUB_TOKEN` to read-only, with per-job `permissions:`;
   - make prod secrets environment-scoped;
   - run `zizmor` in CI;
   - keep pins current with Dependabot or Renovate.

   This is a direct response to tj-actions, and it costs hours, not days.
3. **No plaintext secrets in git:**
   - SOPS + age for the stacks and infra repos (keep Ansible Vault for existing Ansible use);
   - gitleaks or push protection;
   - a secrets inventory with an owner and a last-rotated date.
4. **Backups that are proven:**
   - 3-2-1 with one immutable off-site copy in the EU;
   - a backup-freshness alert;
   - a **quarterly timed restore drill** that records the measured RTO, with RPO/RTO written per service.
5. **Immutable, digest-pinned deploys:**
   - build once in the app repo;
   - the stacks repo pins `tag@sha256`;
   - promotion and rollback = a PR or revert in the stacks repo;
   - `healthcheck` plus `up --wait`;
   - migrations backward-compatible across one release.
6. **Terraform state hygiene:**
   - remote encrypted versioned state with locking (`use_lockfile`), one state per env;
   - commit `.terraform.lock.hcl`, pin providers and modules;
   - `plan` posted on PRs, apply only from main;
   - a weekly drift-check workflow.
7. **Symptom-based alerting with two tiers:**
   - external uptime and TLS-expiry probes, including one check outside your own infra;
   - page only on user-visible failure, backup failure and imminent disk or cert exhaustion;
   - every alert links a runbook;
   - one written availability SLO per client-facing service.
8. **Image and dependency scanning plus SBOM:** Trivy in CI (fail on fixable CRITICAL), a weekly rescan of running images, an SBOM attached to every release. This answers tender questionnaires and prepares for the CRA.
9. **Four-eyes on prod-affecting changes, with a documented break-glass rule.** Buy GitHub Team so branch rulesets are actually enforced on private repos; otherwise run a weekly audit of unreviewed merges.
10. **Incident basics:**
    - 3 severity levels;
    - a business-hours ops-duty rotation, with best-effort out-of-hours written into contracts;
    - a one-page security-incident and client-notification plan (24h client notice, GDPR 72h);
    - a blameless postmortem template for SEV1 and client-visible SEV2.

**Next tier (do in the following 6-12 months):**
- SSH certificates instead of key fan-out.
- Molecule on the 2-3 critical roles.
- Centralised logs (Loki).
- An ISO 27001-aligned ISMS skeleton (risk register, SoA, about 10 policies) built from the evidence above.
- Build provenance attestations.
- An ADR habit.
- A legal check of CRA "manufacturer" status for published products and OSS.

## "Do not bother yet" list

- **Kubernetes, Argo CD or Flux** to "get GitOps". The stacks repo plus a push deploy (or a simple host-side reconciler) gives most of the benefit.
- **HashiCorp Vault/OpenBao** clusters. SOPS + age plus GitHub env secrets (plus Bitwarden SM or Infisical if runtime secrets grow).
- **Policy-as-code with custom OPA/Sentinel libraries.** Trivy or checkov misconfiguration scanning first.
- **Terragrunt, Atlantis, Spacelift or Terraform Cloud paid tiers** for a handful of stacks.
- **Full SRE error-budget machinery** (multi-burn-rate alerts, budget-driven freezes). One SLO per service, reviewed monthly.
- **Distributed tracing everywhere, ELK/OpenSearch, SIEM.** Prometheus, Loki and Grafana is plenty.
- **A 24/7 on-call rota** without a contract that pays for it.
- **SLSA Build L3, hermetic builds, cosign admission policies.** SBOM plus basic provenance is enough until a client asks.
- **AWX/AAP, Teleport, JIT access brokers, identity governance tools.**
- **Blue/green for stateful services** (triplestores, databases). Planned maintenance windows with notice.
- **A formal CAB or ITIL change management.** The PR is the change record.
- **ISO 27001 certification before a tender demands it.** Run the controls and gather evidence first.
