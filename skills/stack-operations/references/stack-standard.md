# The per-stack minimum (S1–S9)

**Level: MUST** for every stack, and every stack is deployed health-gated (how:
[deploy-workflow.md](deploy-workflow.md)). Why: a stack that misses one of these fails in a way
nobody sees until it is an outage — a full disk, a crash loop, a silent version change.

`scripts/check_stack.py` checks each rule per service. It reads YAML only (no Docker, no network),
needs Python 3.8+ with `pyyaml`, prints one row per stack, service and rule, and exits 1 when any
rule is `missing` or a file is `unreadable`. The same command runs in a session and as a CI step.

## The rules

| Rule | What the service must have | Why |
|---|---|---|
| **S1** | An image pinned to a version tag: no `latest`, no bare major (`postgres:16`). Add the digest (`:<version>@sha256:<digest>`) when the image is ours or changes often. | A moving tag changes production without a commit; you cannot roll back to "whatever `latest` was". |
| **S2** | A `healthcheck` on every long-running service. | Without it Docker reports "running" for a crashed app, and the deploy cannot wait for health. |
| **S3** | A memory limit (`mem_limit` or `deploy.resources.limits.memory`), sized from a measured peak noted in a comment; when the peak cannot be measured, a conservative estimate marked as such in the comment. A JVM without `-Xmx` takes a quarter of the limit as heap, so set the heap with the limit, at about two-thirds of it (the rest is for the JVM's own memory). | One leaking container otherwise takes the whole VM, and every stack on it, down. |
| **S4** | Log rotation: `logging:` with `options` `max-size` and `max-file`. | Docker keeps logs forever by default; an unrotated log fills the disk and stops the VM. |
| **S5** | `restart: unless-stopped`. | The service comes back after a crash or a reboot, but stays down when someone stopped it on purpose. |
| **S6** | `security_opt: ["no-new-privileges:true"]`. | A compromised process cannot gain root through a setuid binary. Add `read_only`, `cap_drop: [ALL]` and `user` where the image allows. |
| **S7** | Every published `ports:` entry names its bind address: a private address or `127.0.0.1`. Only the proxy's 80 and 443 may publish on all interfaces. | Docker-published ports bypass the host firewall. The full exposure rule is owned by `infrastructure-security` (exposure). |
| **S8** | Persistent data in a bind mount under `/opt/data/`. Read-only config mounts from the repo are fine. Data that is re-issued on start (a certificate store, a cache) may stay in a named volume with an S8 exception saying so. | Named volumes sit on the root disk, outside the data volume and its backups; the data dies with the VM. |
| **S9** | No literal secret in `environment:`; a secret-looking variable is `${VAR}` or `${VAR:?message}`, never `${VAR:-default}`. | A default value turns a missing secret into a known password in production. |

## Exceptions

When a rule truly does not apply, write a comment inside the service's block:

```yaml
  migrate:
    # conformance-exception: S2 one-shot migration job, exits after running
```

Syntax: `# conformance-exception: S<n> <reason or decision id>`. A reason is required; an exception
without one counts as `missing`. Put it on the line of the key it excuses, or on the line above it.

A service with `build:` fails S1: its image is built on the VM, so the same tag can be different
bytes on each deploy. Build it once off the VM and pull it pinned (`versions-and-promotion.md`), or
write an S1 exception naming the follow-up.

**Excepted is not met.** The check reports `excepted` and still exits 0, but the stack carries a
known gap; review the exceptions each time the stack changes and remove the ones that no longer hold.

## S4 and the Docker daemon default

S4 may also be met for the whole VM by the Docker daemon's default log options, set by the
configuration layer (Ansible). Then each service carries:

```yaml
    logging:
      driver: json-file  # conformance-exception: S4 daemon default
```

Use this only when the daemon default **is** set by the configuration code on that VM. Check it
there before writing the comment. Two traps: marking S4 excepted on a VM whose daemon has no default
(the disk still fills, and the check hides it), and forgetting that a daemon default applies only to
containers created after the daemon restarted, so recreate the containers once.
