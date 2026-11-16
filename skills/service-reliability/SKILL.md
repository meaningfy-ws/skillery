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

Left alone, an agent judges for itself whether a night-time fix is safe. Here the policy decides and
every action leaves a record. Each rule has a level (MUST now, SHOULD next), a reason and a minimum
version; one installation's facts (stacks, hosts, runbooks) live in the infrastructure repositories.

## Quick Start

**Input:** at 03:10 an alert says a container of `<stack>` keeps restarting. `ops-watch` is started
with the alert's payload; nobody is awake.

1. Open (or reuse) the issue `<symptom> — <service>`, labelled `incident` and the alert's severity;
   notify `#infra-alerts`.
2. Count the `attempt <n>:` comments on it: none, so `attempts` is 0.
3. Ask the policy, never your own judgement:

   ```
   $ python scripts/decide_action.py --action restart-container --facts '{"attempts": 0}'
   act	listed: restart-container
   ```

4. `act`: start the named operation `ops-restart-container` (a workflow in the stacks repository),
   then comment on the issue: `attempt 1: ops-restart-container → container healthy after 40 s`.
5. Verify against monitoring that the alert cleared; post the result to `#infra-alerts`, close the
   issue, post a two-line summary to `#operations`.

**Output:** a closed issue with one attempt comment, the result in `#infra-alerts`, a summary in
`#operations`. Had the decider said `park`: label `ops-parked`, comment a decision card, change
nothing.

## Workflow

- Read `references/monitoring-standard.md` when deciding what a service must be watched for or adding
  probes or scrape targets: it adds the probe and log rules and how targets change.
- Read `references/alerting.md` when writing or reviewing an alert rule: it adds the tiers, the
  required labels and annotations, and the rule template.
- Read `references/daily-checkup.md` when asked "is everything ok?" or when the scheduled check-up
  runs: it adds the nine checks in their order and the report's shape.
- Read `references/incident-response.md` when an alert fired, something is down, a security event is
  reported or a client must be told: it adds severities, clocks, duty, every record and the postmortem.
- Read `references/backup-restore.md` when a stack needs a backup decision, a backup is added or a
  restore drill is due: it adds the decision rule, RPO and RTO, the backup role and the drill.
- Read `references/unattended-operations.md` before **any** action with nobody watching, or when asked
  "may the agent do this at night?": it adds the tiers, how to state the facts, and what each
  decision obliges.

## Rules

Each rule is stated once, in the rule table of its reference. A MUST is the target, not a claim about
today: the check-up reports the gap, and the fix is a change in the repository that has it.

**Common mistakes**

| Mistake | Why it fails | Do instead |
|---|---|---|
| A new backup called done after setup | One that never succeeded writes no metric, so no alert fires | Check its first run by hand |
| "The agent decides if it is safe" | That is not a policy | Unattended, act only on the decider's `act` |
| SSH when no workflow exists | Unattended hands are the allow-listed workflows only | Park and report the missing operation |
| Acting without the attempt comment | The comments are the attempt count; no third attempt | Comment `attempt <n>:` every time |
| A second issue for one incident | It splits the history and resets the count | Reuse the open issue with that title |

## Before you hand over

**Quick diagnostic**

| Question | If not | Action |
|---|---|---|
| Every action has its incident issue and attempt comment? | The next run miscounts | Add it now |
| The report lists problems, checked and fine, not checked? | A quiet day looks like a failed run | Rewrite it in that shape |
| The result verified against monitoring before closing? | The incident may be live | Reopen and verify |

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

Answers `VER, CLR, RSK` in `test-strategy`'s matrix (`references/devops.md`).
