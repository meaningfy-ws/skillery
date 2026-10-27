# The deploy workflow

A stack is deployed only by its workflow in the stacks repository, from `main`. The shape is the
template [`assets/templates/deploy-workflow.yml`](../assets/templates/deploy-workflow.yml); this file
says why each part is there.

## Health-gated deploy

The deploy runs `docker compose pull` then `docker compose up -d --wait --wait-timeout <seconds>`.
`--wait` returns only when every service is running and healthy, and fails the job otherwise.
Minimum version: Docker Compose v2.1.1 for `--wait`, v2.17 for `--wait-timeout`. Why: Compose
"succeeds" while a container crash-loops; a `docker ps` after a sleep proves nothing.

A one-shot job (a migration, a seed) exits, so it is not part of `up --wait`: run it first with
`docker compose run --rm <job>`, and give it an S2 exception.

On failure the workflow shows `docker compose ps -a` and a log tail with secret-looking lines
filtered out. It never prints `.env`.

## The parts of the template, and why

| Part | Why |
|---|---|
| A matrix over instances, `fail-fast: false`, one GitHub Environment per instance | One shape for one instance or ten; a single instance is a one-row list. One instance failing does not stop the others. |
| `concurrency: <stack>-<instance>` and `timeout-minutes` | Two deploys of the same instance never overlap; a hung SSH session does not hold the runner. |
| A guard step | An instance with no host yet is skipped with a warning; an empty value or a value containing `$` fails before anything touches the VM. |
| Sparse checkout of the stack only, no persisted credentials | The job sees only what it deploys. |
| `rsync --delete --exclude .env` | The VM holds exactly the repo's files; `.env` is written separately. |
| `.env` written from step `env:` under `umask 077`, mode 600 | Secrets never appear in the script text or in a remote command line. |
| `docker compose config -q` before `up` | A broken file fails the job before any container stops. |
| Remove images beyond the last 3 | Rollback stays possible ([rollback.md](rollback.md)). |
| Actions pinned by SHA, `permissions: contents: read` | The supply-chain rule is owned by `infrastructure-security`; the template already meets it. |

The workflow never builds an image on the VM: it pulls the pins in `compose.yml`
([versions-and-promotion.md](versions-and-promotion.md)).

## One reusable workflow

**Level: SHOULD.** The stacks repository keeps **one** reusable deploy workflow (`workflow_call`)
with the steps above, and each stack's workflow calls it with its stack name and instance list. Why:
copied workflows drift, and a safety step fixed in one copy stays missing in the others. Until the
reusable workflow exists, each stack's workflow starts from the template, never from another stack's
workflow.

## Triggers

Deploy on a push to `main` that touches the stack's folder or its workflow, and on manual dispatch
with an instance choice. Never on a feature branch. A commit that changes only documentation must not
redeploy; how to mark it is in `meaningfy-git-workflow`.
