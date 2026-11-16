# Unattended operations

What an agent may do when nobody is watching: at night after an alert, or during the daily check-up.
The answer is data, [`assets/unattended-actions.yaml`](../assets/unattended-actions.yaml), decided by
[`scripts/decide_action.py`](../scripts/decide_action.py); the agent never judges it alone.

## The three tiers, in the owner's words

> "If it is just a restart or actions that resolve the issue without consequences then just do it,
> but if the consequences have impact, for significantly increased costs or blocking something for
> a long time, then park it until someone intervenes."

| Tier | Means |
|---|---|
| **act and report** | reversible, without consequence (restart a container, re-run a failed backup, renew a certificate) |
| **park and notify** | anything with consequences: significantly more cost, blocking something for long, a risk of losing critical data, touching data, applying infrastructure code, changing security |
| **never** | destroy, delete data, print or move a secret, open something to the internet |

An action the policy does not list is parked. The exact list, the thresholds that read
"significantly" and "for long", the triggers and their order are in the YAML; the owner edits them
there, and every edit ships with a test case.

## How a decision is made

1. Name the action by its `id` in the YAML.
2. State the facts of this action, honestly. A fact left out counts as false. When unsure, set it
   true: a doubt must fail towards parking, never towards acting.
   - `attempts`: the number of `attempt <n>:` comments already on this incident's issue
     ([incident-response.md](incident-response.md), *Records*).
   - Cost and blocking facts: the expected extra cost a month and the minutes of downtime.
   - The yes/no facts (data, infrastructure code, security, destruction, secrets, exposure): true if
     the action could do it, not only if it is meant to.
   - `monitoring_unreadable`: true when the Prometheus API could not be read in this run; report
     "monitoring unreadable" and label the open incident `ops-parked`.
3. Run `python scripts/decide_action.py --action <id> --facts '<json>'`. It prints
   `<decision><TAB><rule>`; the decision is `act`, `park`, `never` or `escalate`.
4. Do what the decision says, and nothing else.

| Decision | Do |
|---|---|
| `act` | Invoke the action's named `operation`, comment `attempt <n>: <operation> → <result>` on the incident, wait, verify against monitoring. Cleared: post the result to `#infra-alerts`, close the issue, summary to `#operations`. Not cleared: leave it; the next run counts the attempt. |
| `park` | Label the issue `ops-parked`, comment a decision card (owned by `executive-communication`), notify `#infra-alerts`. Change nothing. |
| `never`, `escalate` | Comment why, naming every attempt; notify `#infra-alerts` that a human is needed. Change nothing. |
| exit code 2 (policy or facts unreadable) | Treat every action as `park`. |

## Unattended hands are named operations

Unattended, the agent acts **only** by starting a named workflow in the stacks repository: the
`operation` of an `act` entry, run by `workflow_dispatch`; each is idempotent, logged and
allow-listed. If no workflow has that name, the agent parks with a decision card (what it would have
done, what a person can do instead) and reports the missing operation; that is not an attempt. A
failed or timed-out workflow is one.

## The runtime contract, in short

Wherever the agent runs, the runtime starts it in a checkout of the stacks repository with the
provisioning repository beside it, passes the trigger (schedule or alert payload), runs one agent at
a time (a second trigger waits, then re-reads the state), and grants only: Prometheus reads through a
dedicated read-only credential it holds itself (from Vaultwarden, never shown to the agent, never a
shared admin credential), posts to `#infra-alerts` and `#operations`, issues and comments, and
`workflow_dispatch` on the allow-listed operations. **No SSH key and no cloud token.** The full
contract is the devops setup page in skillery's `docs/environment/`.
