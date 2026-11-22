# Consent card: worked example

The card's shape and rules are owned by `executive-communication` (its `decision-request`
reference);
this is one operation written in that shape. For an operation the FACTS answer what a person who is
not a devops engineer needs: the service, who notices, for how long, what it costs, how it is undone.
The raw plan is evidence, never the facts.

```
DECIDE: Apply the plan that adds a memory limit and a healthcheck to <stack>?   [<stack> on <vm>]
BY: today (it ran out of memory last night; if no answer: nothing is applied)
RECOMMEND: A, because the change is small, the dry run shows no data touched, and one revert undoes it.
OPTIONS:
  A. Apply now → the <stack> page shows an error for about 30 s while 2 containers restart; cost unchanged.
  B. Apply tonight → same effect while nobody works; the risk stays until then.
  C. Do nothing → the stack can still exhaust the server's memory and stop the other services on it.
FACTS:
  - The plan changes 1 file and recreates 2 containers; no data touched [confirmed: dry run, <date>]
  - Undo: revert the PR and redeploy, about 2 minutes [confirmed: deploy workflow, <date>]
YES WRITES: merge PR <number>; run the <stack> deploy; check both healthchecks pass; record on the PR.
REPLY: A / B / C / edit: …
Evidence: PR <number> · dry-run output · infra-reviewer report on the PR
```
