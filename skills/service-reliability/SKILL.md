---
name: service-reliability
description: "Use this skill when someone asks \"is everything ok\" about Meaningfy's servers or services, runs the daily check-up, says an alert fired or the site is down, opens or works an incident, writes a postmortem, decides or checks a backup or a restore test, or asks \"may the agent do this at night\"; it holds the monitoring and alerting standard, the daily check-up, incident severities, clocks and records, backup and restore practice, and the unattended-action policy with its decider script."
license: Apache 2.0
metadata:
  purpose: devops
  area: operations
  subject: delivery-infra
  posture: precise
  stage: release
  maturity: experimental
---

# Service Reliability

Observe and respond. This skill says what Meaningfy's services must be watched for, how an alert
reaches a person, what the daily check-up looks at, how an incident is run and recorded, how backups
are decided and proven, and what an agent may do alone when nobody is watching. It states each rule
with its level (MUST now, SHOULD next), its reason and its minimum version. The facts of one
installation (which stacks, which hosts, which runbook) live in the infrastructure repositories; the
agents read them there.

## Quick Start

**Input:** at 03:10 an alert says a container of `<stack>` keeps restarting. `ops-watch` is started
with the alert's payload; nobody is awake.

1. Open the incident issue `<symptom> — <service>`, labelled `incident` and the alert's severity
   (or reuse the open one with that title), and notify `#infra-alerts`.
2. Count the `attempt <n>:` comments on the issue: none yet, so `attempts` is 0.
3. Ask the policy, never your own judgement:

   ```
   $ python scripts/decide_action.py --action restart-container --facts '{"attempts": 0}'
   act	listed: restart-container
   ```

4. `act`: start the named operation `ops-restart-container` (a workflow in the stacks repository),
   then comment on the issue: `attempt 1: ops-restart-container → container healthy after 40 s`.
5. Verify against monitoring that the alert cleared. It did: post the result to `#infra-alerts`,
   close the issue.
6. Post a two-line summary of what was done to `#operations`.

**Output:** a closed incident issue holding one attempt comment, the alert and its result in
`#infra-alerts`, a summary in `#operations`. Had the decider said `park`, the agent would have
labelled the issue `ops-parked`, commented a decision card and changed nothing.

## Workflow

- Read [`references/monitoring-standard.md`](references/monitoring-standard.md) when deciding what a
  service must be watched for, adding probes or targets, or asking whether logs are central.
- Read [`references/alerting.md`](references/alerting.md) when writing or reviewing an alert rule;
  start from [`assets/templates/alert-rule.yml`](assets/templates/alert-rule.yml).
- Read [`references/daily-checkup.md`](references/daily-checkup.md) when asked "is everything ok?" or
  when running the scheduled check-up. Run the nine checks in its order.
- Read [`references/incident-response.md`](references/incident-response.md) when an alert fired,
  something is down, a security event is reported, or a client must be told. It holds the
  severities, the clocks, the duty rule and every record (issue titles, labels, the pinned log).
  Write the postmortem from [`assets/postmortem.md`](assets/postmortem.md).
- Read [`references/backup-restore.md`](references/backup-restore.md) when a stack needs a backup
  decision, a backup is added, or a restore drill is due; start from
  [`assets/templates/backup-role/`](assets/templates/backup-role/).
- Read [`references/unattended-operations.md`](references/unattended-operations.md) before **any**
  action with nobody watching, and when asked "may the agent do this at night?". The policy is
  [`assets/unattended-actions.yaml`](assets/unattended-actions.yaml); the decision is always
  [`scripts/decide_action.py`](scripts/decide_action.py).

Each rule is stated once, in the *The rule* table of its reference. A MUST is the target, not a claim about today. The check-up reports what is not met yet; each fix is
a change in the repository that has the gap.

## Gotchas

- **A backup that never succeeded raises no alert.** The freshness alert compares against the last
  success; a backup that never ran writes no metric at all. Check every new backup's first run by
  hand before calling the service backed up.
- **"The agent decides if it is safe" is not a policy.** Unattended, every action goes through
  `decide_action.py`; an action it does not return `act` for is not taken, however obvious it looks.
- **No unattended action through SSH.** With nobody watching, the agent's only hands are the named,
  allow-listed workflows. A missing workflow means park and report, never a shell instead.
- **No third attempt.** After two failed attempts on one incident the decider says `escalate`; the
  attempt count is the comments on the issue, so never act without writing the comment.
- **One incident, one issue.** Reuse the open issue with the same title; a duplicate splits the
  history and resets the attempt count.
- **Copying another service's backup role** spreads its paths and its one shared credential. Use the
  one generic role with this service's parameters.
- **An alert with no runbook** leaves a non-specialist at 3 a.m. with nothing to do. No runbook, no
  alert.
- **A quiet check-up still posts.** "Nothing wrong" without the list of what was checked cannot be
  told apart from a check-up that did not run.
- **A postmortem whose actions are not issues** stays "in progress" forever.
- **Unreadable monitoring is a finding**, not a reason to skip: report it, and take no unattended
  action on state you cannot verify.

## Boundary & Related Skills

**Owns:** the monitoring standard; alert tiers and the alert-rule shape; the daily check-up and its
order; incident severities, clocks, the duty rule, client and GDPR notice, incident records and
postmortems; backup decisions, the generic backup role, restore drills and their record; the
unattended-action policy, its decider and the runtime contract's summary.

**Does NOT own:**
- the safe-change protocol, interactive interventions and their records, runbook structure, the
  infrastructure repositories' PR checks — `infrastructure-operations`;
- the per-stack minimum, deploy, version pins, promotion and rollback, `check_stack.py` —
  `stack-operations`;
- containing a security incident (revoke, rotate, preserve evidence), secrets and access —
  `infrastructure-security`;
- the decision card's fields and rules — `executive-communication` (`decision-request`);
- releases — `meaningfy-release`, relevant here only for the SBOM attached to a release.

**Related:** `infrastructure-operations`, `stack-operations`, `infrastructure-security`,
`executive-communication`.
