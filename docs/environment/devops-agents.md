# devops agents

**Audience:** the Infra owner or a colleague who wants to operate Meaningfy's infrastructure with an
agent, and whoever sets up the unattended watch.

The `meaningfy-devops` bundle ships three agents and four skills. The skills hold the practice; the
facts of the installation (servers, stacks, runbooks) stay in the two infrastructure repositories.

| Agent | Type | Use it to |
|---|---|---|
| `devops-engineer` | lead | change, deploy, fix, resize or retire something, with you deciding |
| `ops-watch` | scheduled | run the daily check-up and answer alerts with no one present |
| `infra-reviewer` | delegated | give an infrastructure change its second reading before it runs or merges |

## Where to start a session

Always in a checkout of `infrastructure-stacks`, with `cloud-infrastructure` checked out beside it:

```text
<workspace>/
├── infrastructure-stacks/    ← start the agent here (its openspec/ holds the changes)
└── cloud-infrastructure/     ← read and changed as the sibling, ../cloud-infrastructure
```

If the sibling is missing, the agents say so and skip the work that needs it; they never guess
another location.

## Interactive sessions: devops-engineer

1. Install the bundle: [`dual-cli/setup-claude.md`](dual-cli/setup-claude.md) or
   [`dual-cli/setup-opencode.md`](dual-cli/setup-opencode.md), Step 3.
2. Unlock your Vaultwarden session in the terminal you start the agent from (`bw unlock`, then export
   the session as `bw` tells you). The agent uses **your** session: it pipes each credential from
   `bw` straight into the command that needs it, and never prints, stores, commits or reports a
   value. The rule and the safe command shapes are in the `infrastructure-security` skill
   (`references/secrets.md`).
3. In Claude Code: `claude --agent meaningfy-devops:devops-engineer` and say what you need, in your
   own words. In opencode: `opencode --agent devops-engineer`.
4. Before anything is applied, you get a consent card: what changes, who notices, for how long, at
   what cost, how it is undone. Nothing is applied until you answer yes.
5. For a non-trivial change the agent has `infra-reviewer` read the plan, and again on the branch; it
   posts the report, headed `## infra-reviewer report`, on the PR before you decide to merge.

## The unattended watch: ops-watch

The host is not decided yet: a dedicated server, a Claude scheduled task, or another agent runner.
Whichever runs it must meet this contract:

| The runtime must | Why |
|---|---|
| start `ops-watch` in a checkout of `infrastructure-stacks` with `../cloud-infrastructure` beside it | the agent reads the instance facts there |
| pass the trigger: `schedule: daily check-up`, or `alert: <payload>` from Alertmanager | the run's input |
| give read access to the Prometheus API through a dedicated read-only credential the runtime holds (from Vaultwarden, never shown to the agent) | the check-up and alert verification read it; without it every action is parked |
| give write access to the `#infra-alerts` and `#operations` Slack channels | every run reports there |
| allow creating issues and comments in `infrastructure-stacks`, and `workflow_dispatch` of the allow-listed operations only | the agent's only hands |
| run one `ops-watch` at a time; a second trigger waits for the first | no two runs act on one incident |
| give **no SSH key and no cloud token** | unattended, the agent acts only through named operations |

The allow-listed operations are workflows in `infrastructure-stacks`, one per *act* entry of the
policy in the `service-reliability` skill (`assets/unattended-actions.yaml`), each idempotent and
logged. Until a workflow exists, the agent parks that action and reports the missing operation.

To run the check-up by hand: `claude --agent meaningfy-devops:ops-watch "daily check-up"` (or
`opencode run --agent ops-watch "daily check-up"`). Claude Desktop scheduled tasks load skills, not
agent files (gap G-4 in [`dual-cli/mapping.md`](dual-cli/mapping.md)); opencode has no scheduler
(gap G-5).

## Where the agents report

- **Slack:** every alert and finding in `#infra-alerts`; a summary of work done in `#operations`.
  When Slack is unreachable, the report goes to a GitHub issue labelled `ops-report` and is posted on
  the next run.
- **GitHub issues in `infrastructure-stacks`:** incidents (security ones included), parked actions,
  and the pinned `Daily check-up log`. The labels and rules are in the `service-reliability` skill
  (`references/incident-response.md`).
- **Confluence:** notable changes add a line to the change log page; a page that disagrees with the
  repository is reported and groomed, never the repository changed to match it.

## Before you rely on it

The agents' behaviour is checked by hand (`tests/features/agents/devops-engineer.feature`,
`ops-watch.feature`, `infra-reviewer.feature`). Run one check-up by hand and one small change with
`devops-engineer` before scheduling the watch.
