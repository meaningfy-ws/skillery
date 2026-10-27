# Monitoring standard

What must be watched, and from where. Monitoring answers one question first: **can the client use the
service?** Host and container metrics explain why something broke; they do not tell you that it did.

## The rules

| Rule | Level | Why | Minimum version |
|---|---|---|---|
| **External uptime and TLS-expiry probes, one of them from outside the fleet** | MUST | Host metrics miss a service that is up but unreachable, and a monitoring server cannot report its own death. | Every client-facing endpoint has a black-box HTTP probe (expects a 2xx) and a TLS-expiry probe, run by the monitoring stack. In addition, **one check runs from outside our own servers** (a small uptime checker on another provider, or a free external service) and watches at least the monitoring server and the main public endpoints. |
| **Central logs** | SHOULD | Debugging an incident across several containers and hosts is slow without one place to search. | A log store (Loki with Grafana) receiving container logs, with a stated retention of 30 to 90 days. Until then, the rotated local logs required by `stack-operations` are the floor. |

The check-up reports a missing SHOULD as a finding; it does not block anything.

## What else the monitoring stack holds

- **Host and container metrics** (node exporter, cAdvisor) on every Docker host, with 15 to 30 days of
  retention. They feed the disk forecast of the daily check-up.
- **A last-success metric for every backup** (see [backup-restore.md](backup-restore.md)).
- **One availability target per client-facing service**, written down (for example 99.5% a month,
  measured by the probe) and stricter than any contract SLA. It is reviewed in the monthly look at
  incidents, not enforced by machinery.

## How targets and rules change

Scrape targets and alert rules live in git, in the stacks repository's monitoring stack, and change
only by PR. A new exporter is registered in the same PR that installs it, with labels that name the
stack and the service; a retired system's targets are removed and its alerts silenced in the
retirement PR. Each rule names its owner and its runbook in annotations, never in a comment
([alerting.md](alerting.md)). The PR checks that validate the configuration (`promtool check`) are
owned by `infrastructure-operations`.

## Not now

Multi-region synthetic monitoring, long-term metric storage, distributed tracing, ELK or a SIEM, and
error-budget machinery are out of scope for a team this size.
