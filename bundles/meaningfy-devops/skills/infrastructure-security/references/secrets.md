# Secrets

Where a secret lives, how it reaches a service, how it is used in a command, and when it changes.

## The rule

| Rule | Level | Minimum version | Why |
|---|---|---|---|
| **Vaultwarden is the source of truth, and every secret operation goes through `bw`** | MUST | every secret has a Vaultwarden item before it is used anywhere; adding, reading, updating, renaming and deleting a secret value is done in Vaultwarden with `bw`, whenever needed, and every other place holds a copy made from it | A secret that exists only on a server or a laptop is lost with it, and nobody can rotate what they cannot find. |
| **Vaultwarden is the inventory, with owner and last-rotated date** | MUST | each item records, in its notes or fields, where it is used, its owner and when it was last rotated; a stack's README or `SECRETS.md` lists names only, each with its item name | Rotation needs to know what exists, who answers for it, and how old it is; one place to look keeps it true. |
| **Rotation on leave, on exposure, yearly for high-value** | MUST | see [Rotation](#rotation) | A secret someone could read after leaving, or that was shown once, is no longer secret. |

No credentials on wiki or documentation pages, in issues, in chat, or in git. Documentation names a
secret; it never holds the value.

Out of scope at this size: HashiCorp Vault or OpenBao clusters.

## The secret flow

One direction only: **Vaultwarden → GitHub secret → the deploy workflow's `env:` → the `.env` file on
the server (mode 600) → the container.** Each step is a copy of the one before.

- Item names follow `<Service> — <instance> — <purpose>`, in the service's collection.
- The GitHub copy is an Environment secret (`<stack>-<instance>`) for production values
  ([supply-chain](supply-chain.md)).
- The deploy workflow writes the `.env` file (`stack-operations` owns the workflow). The `.env` is
  never edited by hand on the server.
- `.env.example` and the stack's secrets table carry names only, each with the item it comes from.

The commands for each step, values never shown, are in
[`secret-flow.md`](../assets/templates/secret-flow.md).

## Using a secret in a command

An agent uses the Vaultwarden session (`bw`, the Bitwarden CLI) of the person running it, unlocked
by that person in their own terminal. The agent may use any credential an operation needs, but
it never sees one: the value goes from `bw` straight into the command that uses it, and nowhere else.
It is never printed, echoed, written to a file, committed, reported, or pasted into chat.

**Safe shapes:**

```bash
# stdin: the command reads the value from its standard input
bw get password '<item>' | docker login <registry> -u <user> --password-stdin
bw get password '<item>' | gh secret set <NAME> --env <stack>-<instance>

# process substitution: the command reads a file that exists only for its run
ansible-playbook <playbook>.yml --vault-password-file <(bw get password '<item>')

# environment of one command only
PGPASSWORD="$(bw get password '<item>')" psql -h 127.0.0.1 -U <user> -d <database> -c '<query>'

# remote: the value travels on stdin, never on the remote command line
bw get password '<item>' | ssh <host> \
  'IFS= read -r PGPASSWORD || true; export PGPASSWORD; docker exec -i -e PGPASSWORD <container> psql -U <user> -d <database> -c "<query>"'
```

**Unsafe shapes**, and why:

| Shape | What goes wrong |
|---|---|
| `bw get password '<item>'` alone | prints the value into the terminal and the transcript |
| `echo "$PW"`, `printenv`, `set -x` | prints it |
| `export PW="$(bw get password '<item>')"` | stays in the shell for every later command and child process |
| `mysql -p"$(bw get password '<item>')"`, `--password=…` | the value is on the command line, visible to anyone who lists processes |
| `bw get password '<item>' > pw.txt` | a copy on disk that outlives the task |
| `ssh <host> "… $(bw get password '<item>') …"` | the value is in the remote command line and the remote logs |
| `bw create item …` without `>/dev/null` | `bw` echoes the whole item back, password included |
| `cat .env`, `docker inspect`, `docker compose config` | print every interpolated value |

**When `bw` is locked or the item is missing:** stop and ask the person to unlock their session in
their own terminal, or to name the item. Never ask for the value, and never handle the session key
either.

## Checking a value without seeing it

Compare, do not display. The answer is "same" or "different":

```bash
cmp -s <(bw get password '<item>') \
       <(ssh <host> "sed -n 's/^<VAR>=//p' <stack-dir>/.env" | tr -d '\n') \
  && echo same || echo different
```

For a length check, `bw get password '<item>' | wc -c` prints a number only.

## Rotation

| Trigger | What is rotated | When |
|---|---|---|
| A person leaves | every secret in the collections they could read, and every token they created | the leaving day, with the [offboarding checklist](../assets/templates/offboarding-checklist.md) |
| Exposure: a value printed in a log, chat, issue, transcript or wiki page, committed to git, or on a lost device | that secret | at once; treat it as a security incident (`service-reliability`) |
| Yearly | high-value secrets: cloud API tokens, registry tokens, DNS tokens, database admin passwords, backup storage credentials | on the anniversary of *last rotated* |

A rotation is the secret flow run again, then the old value revoked where the service holds it, then
the *last rotated* date updated in the inventory. The steps are in
[`secret-flow.md`](../assets/templates/secret-flow.md#rotate).

**Found outside Vaultwarden** (on a server only, on a laptop, on a wiki page): create the item, point
the flow at it, remove the stray copy. If it was on a page or in git, history keeps it, so rotate.
