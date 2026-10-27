# Exposure

What a server lets in, and what a service does when a value is missing.

## The rules

| Rule | Level | Minimum version | Why |
|---|---|---|---|
| **Private ports bind a private address or 127.0.0.1** | MUST | every published container port names its bind address, except the proxy's 80 and 443 | The cloud firewall ignores private-network traffic, and Docker bypasses the host firewall. The bind address is the only control left. |
| **No insecure fallbacks** | MUST | no default passwords, no `${VAR:-changeme}`, no default `sudo`, no world-open default allow-list | A forgotten value must stop the service, not open it. |

## The port rule as it really works

A port belongs to one of three classes:

- **public**: only the reverse proxy, on 80 and 443;
- **restricted**: public, but only from a listed set of source addresses;
- **private**: reached by other servers over the private network, or by the same host only.

Each port is written in three places: the cloud firewall, the host firewall, and the compose
`ports:` entry. Keeping the three in step is a provisioning task (`infrastructure-operations`).
But the three places do not all filter all traffic:

| Traffic | What actually filters it |
|---|---|
| From the internet to a public or restricted port | the cloud firewall, then the host firewall |
| From the internet to a Docker-published port | the cloud firewall only: Docker inserts its own rules ahead of the host firewall |
| Over the private network | **not** the cloud firewall, which filters public traffic only. The host firewall for host services; nothing for a Docker-published port |

So for private traffic the rule has two layers, not three: the host firewall for services that run
on the host, and **the bind address** for containers. Hence:

- a port that only the same host needs binds `127.0.0.1:<port>:<port>`;
- a port that other servers reach over the private network binds `<private-address>:<port>:<port>`;
- a port that only containers of the same stack need is not published at all; they share the stack
  network;
- `"<port>:<port>"` with no address listens on every interface: refuse it.

The per-stack check (`stack-operations`, rule S7) reports any published port without a bind address.

Keep the cloud-firewall entries anyway: they filter traffic from the internet and they document
intent.

**Is this port exposed?** Check from the facts, not from the firewall files:

```bash
# on the host: what listens, and on which address (0.0.0.0 or [::] means every interface)
ss -tlnp
docker ps --format '{{.Names}}\t{{.Ports}}'

# from outside the private network: should fail for every port except 80 and 443
nc -zv -w 3 <public-address> <port>
```

A restricted allow-list that is meant to be temporary carries an expiry date, as every temporary rule
does (`infrastructure-operations`).

## The Docker socket

Mounting `/var/run/docker.sock` into a container gives it root on the host, read-only or not. Only
the proxy that discovers services may have it, read-only, and its admin dashboard stays off or behind
authentication; any other mount of the socket needs a written reason in the stack's README.

## No insecure fallbacks

A missing value must fail loudly. Replace each fallback with a failure:

| Insecure fallback | Instead |
|---|---|
| A role default that holds a credential (`changeme`, a vendor default) | no default; the role's first task asserts the value is set |
| `${<SECRET>:-changeme}` in a compose file | `${<SECRET>:?<SECRET> is not set}` |
| A user role that adds `sudo` when no group is given | groups required for every user ([`bastion-users.yml`](../assets/templates/bastion-users.yml)) |
| An allow-list whose default is `0.0.0.0/0` | an empty default, which denies |
| A service that starts with its vendor's default admin login | the fail-closed pattern: keep it stopped until the real credential is set, and verify from outside (template in `infrastructure-operations`) |

Old experiments are the usual source, such as a `:-changeme` left in a compose file. Remove them
when found.
