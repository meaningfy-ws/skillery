# Incident response

Every incident, security ones included, is a GitHub issue in the stacks repository
(`infrastructure-stacks`): one register, one history.

## The rule

| Rule | Level | Why | Minimum version |
|---|---|---|---|
| **An incident procedure in force** | MUST | A draft procedure is not followed at 3 a.m. | The severities and their clocks below; every incident an issue; one person on duty each week; a client notice within 24 hours; the GDPR clock respected; a postmortem for every `critical` incident and every `serious` one a client noticed. |

## Severities and clocks

| Severity | Means | Respond | Client |
|---|---|---|---|
| **critical** | production down, data lost, or a security breach affecting a client | now (in duty hours; out of hours, best effort) | notified within 24 hours, or the contract's shorter window |
| **serious** | degraded or partly down | the same working day | notified within 24 hours if the client noticed or will notice |
| **warning** | minor, no user impact yet | goes to the backlog | not notified |
| **info** | worth knowing, nothing to do now | no incident issue; listed in the daily check-up report | not notified |

Severities are words, never numbers: a number invites the question which end is worst.

**Personal data.** When personal data may have been exposed, lost or changed, Meaningfy (the
processor) tells the client (the controller) without undue delay, so the client can meet its
**72-hour** GDPR clock to notify its authority. Count the hours from when we became aware, and write
that time in the issue.

**Security incidents** follow this procedure for the record and the clocks; containing them (revoke,
rotate, preserve evidence) is owned by `infrastructure-security`.

## Duty

One named person is on duty each week, the owner or the colleague. The name is written at the top of
the pinned `Daily check-up log` issue and changed there each week. The person on duty receives the
page tier ([alerting.md](alerting.md)) and leads any incident that week. Out of working hours the
response is best effort; contracts must not promise more. At `critical` a second person takes the
client communication if one is available.

## Records

All issues live in the stacks repository. On its first run `ops-watch` creates what is missing,
once, and says so in its report: the labels `incident`, `critical`, `serious`, `warning`,
`ops-parked`, `ops-report`, and the pinned `Daily check-up log` issue, whose first line names the
person on duty. One rule per kind:

| Kind | Record |
|---|---|
| **Incident** (every alert handled, every incident a person opens) | One issue labelled `incident` and `critical`, `serious` or `warning` (from the alert's `severity`; `warning` when absent; `info` opens no issue), titled `<symptom> — <service>`, where the symptom is the alert's `alertname` and the service is the first of its labels `service`, `name` (the container), `instance`. If an open issue has that title, it is reused, never duplicated. An alert with no service, or that cannot be read, opens `<alertname or 'malformed alert'> — unknown` with the raw payload. |
| **Each unattended action** | One comment on the incident: `attempt <n>: <operation> → <result>`. The number of these comments is the `attempts` fact ([unattended-operations.md](unattended-operations.md)). |
| **Resolved** | Verified → the issue is closed with the result. |
| **Parked** | The label `ops-parked` is added and the decision card (owned by `executive-communication`) is a comment. |
| **Check-up finding that needs a human** (no alert) | An issue labelled `ops-parked`. |
| **Daily check-up report** | A comment on the one pinned issue titled `Daily check-up log`. |
| **Slack unreachable** | The post goes to an issue labelled `ops-report`, and is posted on the next run. |

Interactive interventions (a PR, or an `ops-intervention` issue) are recorded as
`infrastructure-operations` says.

**Notify.** Every incident and finding goes to `#infra-alerts`; once work is done on it (agent or
person), a short summary to `#operations`; a notable change, a line on the Confluence change log.

## Working an incident

Open or reuse the issue and notify; set the severity and start the client clock if `critical`, or
`serious` and the client noticed; follow the alert's runbook, writing what you try as timed comments;
fix through the safe-change protocol (`infrastructure-operations`) or, unattended, only within the
policy ([unattended-operations.md](unattended-operations.md)); verify against monitoring, close,
summarise; then the postmortem where the rule asks for one.

## Postmortem

Blameless: it explains how the system let the mistake happen, never who made it. Use
[`assets/postmortem.md`](../assets/postmortem.md), one or two pages, linked from the incident issue,
within five working days. Each action item becomes its own issue with an owner and a due date; the
postmortem is finished only when every action is an issue, and the actions are reviewed in the
monthly look at incidents until closed.

Not now: an incident commander rotation, a 24/7 rota without a contract that pays for it, status-page
automation, formal problem management.
