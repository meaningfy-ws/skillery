# Alerting

An alert is a request for a person to act. If nobody needs to act, it is not an alert; if somebody
must act now, it must reach them, not only a channel they may not read that day.

## The rule

| Rule | Level | Why | Minimum version |
|---|---|---|---|
| **Two alert tiers, page and ticket, and every alert links a runbook** | MUST | One flat channel trains people to ignore it; an alert without a runbook leaves a non-specialist with no first step. | Every rule carries a `tier` label (`page` or `ticket`), a `severity` label (`critical`, `serious`, `warning` or `info`), and `owner` and `runbook_url` annotations. Start from [`assets/templates/alert-rule.yml`](../assets/templates/alert-rule.yml). |

## The two tiers

| Tier | Fires for | Goes to | Severity |
|---|---|---|---|
| **page** | what users feel or are about to feel: a service down, a high error rate, a certificate expiring within 7 days, a disk full within 24 hours, a backup that failed or went stale | `#infra-alerts` **and** a phone push to the person on duty ([incident-response.md](incident-response.md), *Duty*) | `critical` or `serious` |
| **ticket** | everything else worth a look in working hours | `#infra-alerts` | `warning` |
| **info** | worth knowing, nothing to do | the daily check-up report only; no incident | `info` |

Every page and ticket alert is notified in `#infra-alerts`. The `severity` label becomes the
incident's severity label; an alert without one opens a `warning` incident.

## Writing a good alert

- Alert on the **symptom** (the probe fails), not on a cause (CPU is high). Causes belong on a
  dashboard.
- Give it a `for:` duration, so one failed scrape does not wake anyone.
- The summary names the service and the symptom in words; it becomes the incident title
  (`<symptom> — <service>`).
- The runbook is a page in the stacks repository, next to the stack it covers; how to write one is in
  `infrastructure-operations`.
- **Delete or fix an alert that fired and was ignored twice.** It is teaching people to ignore the
  channel.

## Not now

Paging on CPU or memory, dozens of alerts per service, multi-burn-rate alerts, and a paid paging
product.
