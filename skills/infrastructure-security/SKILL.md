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

An agent handed a credential tends to print it "to check it", and trusts the firewall files to say
what is exposed. Here a credential is used without being seen, and exposure is read from the facts.
Four areas: access, secrets, the CI supply chain, exposure. **MUST** is the standard now; **SHOULD**
is the next tier, reported by the daily check-up, never blocking. A MUST a repository does not meet
yet is a target, fixed by that repository's own change.

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
the chat.

## Workflow

- Read `references/access.md` when someone joins or leaves, an account or SSH key is added or
  removed, the six-monthly access review is due, or a shared login is found: it adds the access
  rules, the joiner and leaver steps and the review.
- Read `references/secrets.md` before any command that needs a credential, or when a secret is
  created, rotated, found outside Vaultwarden or possibly exposed: it adds the secret flow, the safe
  and unsafe command shapes, comparing a value without seeing it, and rotation.
- Read `references/supply-chain.md` when writing or reviewing a GitHub Actions workflow, a Dependabot
  file or an image scan: it adds the pinning, token, Environment and scan rules.
- Read `references/exposure.md` when a port is published, a firewall rule changes, someone asks "is
  this port reachable?", or defaults could leave a service open: it adds the port rule as it really
  works, the exposure check and the fail-closed replacements.
- Start from a template in [`assets/templates/`](assets/templates/) (secret flow, offboarding,
  bastion users), never from another stack's copy.

## Rules

### Four-eyes and break-glass

**MUST, practised (not enforced).** Every change to either infrastructure repository gets a second
reading. GitHub's free plan cannot enforce reviews on private repositories, so the second reader is
the `infra-reviewer` subagent, and the rule holds by discipline.

- **When.** On the plan before execution, in the middle of implementation, at the end, or several
  of these. At least once before merge.
- **What it reads.** The plan, conformance to the devops skills, the blast radius and the undo path.
- **Where the report goes.** The caller (the `devops-engineer` agent or the person) posts it on the PR
  as a comment (or a review body) headed `## infra-reviewer report`. The review is a check, not an
  approval: the author still decides.

**Break-glass.** In an incident, waiting for a review can prolong the outage. Then the person on duty
may merge and apply without one, under three conditions:

1. the PR links the incident issue and says "break-glass" in its description;
2. the change is the smallest one that stops the harm;
3. the `infra-reviewer` report is posted on the merged PR **within one working day**, and its
   findings become follow-up issues.

The weekly part of the daily check-up (`service-reliability`) lists infrastructure PRs merged without
the report.

### Common mistakes

| Mistake | Why it fails | Do instead |
|---|---|---|
| Printing a secret "to check it" (`bw get` alone, `echo`, `cat .env`, `docker inspect`, `docker compose config`, `set -x`) | The value lands on screen and in the transcript: an exposure that forces a rotation | Compare values without showing them |
| Insecure fallbacks (`${VAR:-changeme}`, a default `sudo`, a world-open allow-list) | The day a value is forgotten, the service is open | Fail instead |
| `"8080:8080"` with no bind address | Docker's rules let traffic in before the host firewall sees it | Name the bind address |
| Trusting the cloud firewall for private traffic | It filters internet traffic only | A private bind address for a Docker port; the host firewall for a host service |
| A shared admin login, console user or root key | One person cannot be removed without changing it for all | Named accounts |
| Deleting a credential from a wiki page | The page keeps its history | Move it to Vaultwarden and rotate |
| Asking the person to paste a value | The value enters the chat | Ask them to unlock `bw` or name the item |

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

Answers `RSK` in `test-strategy`'s matrix (`references/devops.md`).
