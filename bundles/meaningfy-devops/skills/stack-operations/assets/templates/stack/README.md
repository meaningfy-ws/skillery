<!-- Use this as <stack>/README.md: fill every section; a section you cannot fill yet is a finding, not a "TBD". -->
# <stack>: <one line on what it serves>

Spec: `<spec or change id>`. Deployed by `.github/workflows/deploy-<stack>.yml` to `/opt/stacks/<stack>`
on the VM of role `<role>`; data under `/opt/data/<stack>/`.

## Services

| Service | Image (pinned in `compose.yml`) | Reached at | Data |
|---|---|---|---|
| `proxy` | `traefik` | public 80/443 | `/opt/data/<stack>/acme` |
| `<service>` | `<registry>/<image>` | `https://<service>.<domain>` | `/opt/data/<stack>/<service>` |
| `<service>-db` | `postgres` | stack network only | `/opt/data/<stack>/<service>-db` |

## Consumers

Who depends on this stack, and how they reach it. Write "none" if nobody does.

| Consumer | Reaches | Account | Checked after a deploy by |
|---|---|---|---|
| `<consumer stack or person>` | `<service>` on the private address | `<least-privilege account name>` | `<scenario or command>` |

## Backup decision

**Backed up: <yes / no>.** Reason: <why; for example "rebuilt from source in minutes, no user data"
or "holds client data that cannot be recreated">.

If yes: backup job `<name>`, freshness alert `<alert name>`, RPO `<hours>`, RTO `<hours>`.
Last restore test: `<date>`, `<passed / failed>`, `<what was compared>`.

## Deploy, roll back, upgrade

- Deploy: merge a PR that changes `<stack>/`; the workflow waits for every healthcheck.
- Roll back: revert that PR and let it redeploy.
- Upgrade with data: follow the skill's `upgrades-with-data` steps; record the result here.

## Sleep and wake

Status: <running / asleep since <date>>.

Wake steps, in order:
1. <bring the VM back, per the infrastructure repo's sleep/wake procedure>
2. <re-enable monitoring targets>
3. Run the deploy workflow; check the healthchecks and the Consumers column above.

## Troubleshooting

| Symptom | Likely cause | What to do |
|---|---|---|
| `<symptom>` | `<cause>` | `<step>` |
