# Unattended operations

What an agent may do when nobody is watching: at night after an alert, or during the daily check-up.
The answer is written down as data, in
[`assets/unattended-actions.yaml`](../assets/unattended-actions.yaml), and decided by a script,
[`scripts/decide_action.py`](../scripts/decide_action.py). The agent never judges it alone.

## The three tiers, in the owner's words

> "If it is just a restart or actions that resolve the issue without consequences then just do it,
> but if the consequences have impact, for significantly increased costs or blocking something for
> a long time, then park it until someone intervenes."

| Tier | Means | Examples |
|---|---|---|
| **act and report** | reversible, without consequence | restart a container, re-run a failed backup, free disk from logs or old images, renew a certificate, redeploy the same version |
| **park and notify** | anything with consequences: significantly more cost, blocking something for long, a risk of losing critical data, touching data, applying infrastructure code, changing security | resize a server, restore a backup |
| **never** | destroy, delete data, print or move a secret, open something to the internet | delete a volume |

An action the policy does not list is parked. The exact list, the thresholds that read
"significantly" and "for long", and the triggers are in the YAML; the owner edits them there, and
every edit ships with a test case.

## How a decision is made

1. Name the action by its `id` in the YAML.
2. State the facts of this action, honestly. A fact left out counts as false. When unsure, set it
   true: a doubt must fail towards parking, never towards acting.
   - `attempts`: the number of `attempt <n>:` comments already on this incident's issue
     ([incident-response.md](incident-response.md), *Records*).
   - Cost and blocking facts: the expected extra cost a month and the minutes of downtime.
   - The yes/no facts (data, infrastructure code, security, destruction, secrets, exposure): true if
     the action could do it, not only if it is meant to.
   - `monitoring_unreadable`: true when the Prometheus API could not be read in this run; the action
     could not be verified, so the decider parks it.
3. Run `python scripts/decide_action.py --action <id> --facts '<json>'`. It prints
   `<decision><TAB><rule>`; the decision is `act`, `park`, `never` or `escalate`.
4. Do what the decision says, and nothing else.

The order the script applies is in the YAML's header: a never trigger first, then the attempt limit
(escalate), then the park triggers, then the action's listed tier, and an unlisted action parks.

| Decision | Do |
|---|---|
| `act` | Invoke the action's named `operation`, comment `attempt <n>: <operation> → <result>` on the incident, wait, verify against monitoring. Cleared: post the result to `#infra-alerts`, close the issue, summary to `#operations`. Not cleared: leave it; the next run counts the attempt. |
| `park` | Label the issue `ops-parked`, comment a decision card (owned by `executive-communication`), notify `#infra-alerts`. Change nothing. |
| `never`, `escalate` | Comment why, naming every attempt; notify `#infra-alerts` that a human is needed. Change nothing. |
| exit code 2 (policy or facts unreadable) | Treat every action as `park`. |

## Unattended hands are named operations

Unattended, the agent acts **only** by starting a named workflow in the stacks repository: the
`operation` of an `act` entry, run by `workflow_dispatch`. Each one is idempotent (running it twice
does no harm), logged, and allow-listed. If the stacks repository has no workflow with that name, the
agent parks the action with a decision card (what it would have done, and what a person can do
instead) and reports the missing operation; that is not an attempt. The daily check-up lists every
missing operation as a standing finding until the stacks repository defines it. A failed or
timed-out workflow still counts as an attempt.

## The runtime contract, in short

Where the unattended agent runs is not decided (a dedicated server, a scheduled agent task, or
another agent host). Whichever it is, the runtime:

- starts the agent in a checkout of the stacks repository, with the provisioning repository beside it;
- passes the trigger: the schedule, or the alert's payload;
- gives read access to the Prometheus API through a dedicated read-only credential the runtime holds
  and passes to its requests (from Vaultwarden, never shown to the agent, never a shared admin
  credential), posting to `#infra-alerts` and `#operations`, creating
  issues and comments, and `workflow_dispatch` on the allow-listed operations only;
- runs one agent at a time; a second trigger waits and then re-reads the state;
- gives **no SSH key and no cloud token**.

The full contract is the devops setup page in skillery's `docs/environment/`.

## When things are missing

| Situation | Do |
|---|---|
| Monitoring cannot be read | No unattended action on state that cannot be verified; report "monitoring unreadable"; label the open incident `ops-parked`. |
| Slack cannot be reached | Write the post to an `ops-report` issue; post it on the next run. |
| Two triggers at once | The second waits for the first, then re-reads the state. |
