# Records of interventions

Every operation leaves one record, in one place, so the next person (or agent) can see what was done,
why, and how it was checked. All GitHub issues live in `infrastructure-stacks`.

## One rule per kind

| Kind | Record |
|---|---|
| **Interactive intervention** | A **PR** when code changed; otherwise an issue labelled `ops-intervention` stating what, why and how it was verified. A non-trivial change also keeps the OpenSpec `execution-log.md` ([template](../assets/templates/execution-log.md)). |
| **Incident** (every alert an agent handles, and every incident a person opens, security ones included) | A GitHub issue in `infrastructure-stacks`; its title, labels, attempt comments and closing rule are owned by `service-reliability` (`references/incident-response.md`, *Records*). |
| **Check-up finding that needs a human** (no alert) | An issue labelled `ops-parked`. |
| **Daily check-up report** | A comment on one pinned issue titled `Daily check-up log`; the previous comment is "yesterday". |
| **Slack unreachable** | The post goes to an issue labelled `ops-report`, posted on the next run. |

## Notification

Every opening is notified in `#infra-alerts`. When work is done, a summary of what was done goes to
`#operations`. A notable change adds a line to the Confluence change-log page
([documentation](documentation.md)).

What an incident's severity means, its clocks and its postmortem are owned by `service-reliability`.
