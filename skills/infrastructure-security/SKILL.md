---
name: infrastructure-security
description: "Use this skill when someone joins or leaves, you rotate a password, use a secret in a command, ask whether a port is exposed, pin GitHub actions, make an emergency change or run an access review on Meaningfy infrastructure; it holds the access, secrets, supply-chain and exposure rules with their levels, the four-eyes and break-glass rule, and the Vaultwarden rule that a credential is used without being seen, with the secret-flow, offboarding and bastion-users templates. Not for bounding what an AI agent may do in general (guardrails) or for signing a release and generating its SBOM (meaningfy-release)."
license: Apache 2.0
metadata:
  purpose: devops
  area: operations
  subject: delivery-infra
  posture: precise
  stage: release
  maturity: experimental
---

# Infrastructure Security

Four areas keep Meaningfy's infrastructure safe at the size of a small company: who has access,
where secrets live and how they are used, what the CI pipelines trust, and what the servers expose.
Each rule has a level. **MUST** is the standard now. **SHOULD** is the next tier: the daily check-up
reports it, but it does not block a change. A MUST the repositories do not meet yet is a target, not a
claim; the gap is fixed by that repository's own change.

## Quick Start

**Input:** "Count the rows in the `<table>` table of `<stack>`. The query needs the database
password."

1. Check that the person's Vaultwarden session is open. Only the status is read, never a value:

   ```bash
   bw status | grep -q '"status":"unlocked"' || echo "bw is locked"
   ```

   If it is locked, ask the person to unlock it in their own terminal. Never ask for the password.
2. Pipe the value straight into the one command that uses it:

   ```bash
   PGPASSWORD="$(bw get password '<Service> — <instance> — <purpose>')" \
     psql -h 127.0.0.1 -p <local-tunnel-port> -U <user> -d <database> -c 'select count(*) from <table>'
   ```

3. Report the result (`count = 1234`), and nothing about the password.

**Output:** the answer. The password never appeared on screen, in a file, in the shell history or in
the chat. The safe and unsafe command shapes are in [secrets](references/secrets.md#using-a-secret-in-a-command).

## Workflow

- Read [access](references/access.md) when someone joins or leaves, when an account or SSH key is
  added or removed, for the access review every six months, or when a shared login is found.
- Read [secrets](references/secrets.md) before any command that needs a credential, when a secret is
  created, rotated or found outside Vaultwarden, and when a secret may have been exposed.
- Read [supply-chain](references/supply-chain.md) when writing or reviewing a GitHub Actions
  workflow, a Dependabot file or an image scan.
- Read [exposure](references/exposure.md) when a port is published, a firewall rule changes, or
  someone asks "is this port reachable?", and when reviewing defaults that could leave a service open.
- Start from a template in [`assets/templates/`](assets/templates/), never from another stack's copy:
  - [`secret-flow.md`](assets/templates/secret-flow.md): create, copy, verify and rotate a secret;
  - [`offboarding-checklist.md`](assets/templates/offboarding-checklist.md): the same-day leaver run;
  - [`bastion-users.yml`](assets/templates/bastion-users.yml): one person's SSH access, groups explicit.

## Four-eyes and break-glass

**MUST, practised (not enforced).** Every change to either infrastructure repository gets a second
reading. GitHub's free plan cannot enforce reviews on private repositories, so the second reader is
the `infra-reviewer` subagent, and the rule holds by discipline.

- **When.** On the plan before execution, in the middle of implementation, at the end, or several
  of these. At least once before merge.
- **What it reads.** The plan, conformance to the devops skills, the blast radius and the undo path.
- **Where the report goes.** The caller (the `devops-engineer` agent or the person) posts it on the PR
  as a comment (or a review body) headed `## infra-reviewer report`. The review is a check, not an approval: the author
  still decides.
- **Why.** The author is the only approver; one person reading their own Terraform plan misses what
  a second reading catches.

**Break-glass.** In an incident, waiting for a review can prolong the outage. Then the person on duty
may merge and apply without one, under three conditions:

1. the PR links the incident issue and says "break-glass" in its description;
2. the change is the smallest one that stops the harm;
3. the `infra-reviewer` report is posted on the merged PR **within one working day**, and its
   findings become follow-up issues.

The weekly part of the daily check-up (`service-reliability`) lists infrastructure PRs merged without
the report.

## Gotchas

- **Printing a secret "to check it".** `bw get password <item>` on its own, `echo`, `cat .env`,
  `docker inspect`, `docker compose config` and `set -x` all put the value on screen and in the
  transcript. That counts as an exposure and forces a rotation. Compare values without showing them
  ([secrets](references/secrets.md#checking-a-value-without-seeing-it)).
- **Insecure fallbacks.** A default password in a role, a `${VAR:-changeme}` in a compose file, a
  user role that grants `sudo` when no group is given, an allow-list that defaults to the whole
  internet. Each one leaves a service open the day a value is forgotten. Fail instead
  ([exposure](references/exposure.md#no-insecure-fallbacks)).
- **Docker bypasses the host firewall.** A port published as `"8080:8080"` listens on every
  interface, and Docker's own rules let traffic in before the host firewall sees it. Name the bind
  address ([exposure](references/exposure.md#the-port-rule-as-it-really-works)).
- **Trusting the cloud firewall for private traffic.** The cloud firewall filters traffic from the
  internet only. Traffic over the private network reaches every port that listens on the private
  address.
- **Shared accounts.** A shared admin login, a shared cloud console user or one root key on every
  server makes offboarding impossible: you cannot remove one person without changing it for all.
- **Credentials on wiki pages.** A page keeps its history, so deleting the value is not enough:
  move it to Vaultwarden and rotate it.
- **Asking for the value.** When `bw` is locked or an item is missing, ask the person to unlock it or
  to name the item. Never ask them to paste the value.

## Boundary & Related Skills

**Owns:** access (named accounts, MFA, joiner and leaver, access review, SSH keys and certificates);
secrets (Vaultwarden as the source of truth, the inventory, rotation, the secret flow, using a
credential without seeing it); supply chain (action pinning, token scope, environment secrets,
Dependabot for actions, image scanning); exposure (the port rule, no insecure fallbacks); the
four-eyes rule and break-glass; the secret-flow, offboarding and bastion-users templates.

**Does NOT own:**
- the safe-change protocol, the infrastructure repositories' PR checks (including `gitleaks`,
  `actionlint` and `zizmor`), the `expires:` rule for temporary exceptions, and how an intervention is
  recorded: `infrastructure-operations`;
- the per-stack minimum and its check, including published ports naming their bind address (S7) and
  no literal or default secret in a compose file (S9): `stack-operations`;
- incident severity and response: `service-reliability`. A security incident is a GitHub incident
  issue like any other;
- SBOM generation, signing and provenance of a release: `meaningfy-release`;
- what an AI agent in general may do, output validation and prompt-injection defence: `guardrails`.

**Related:** `infrastructure-operations`, `stack-operations`, `service-reliability`,
`meaningfy-release`, `guardrails`, `ci-cd-delivery` (where the image build and its scan job live).
