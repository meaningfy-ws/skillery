<!-- Use when a stack needs a new secret, or an existing one is rotated: copy the steps, fill the <placeholders>, run them in order. -->

# Secret flow: `<Service> — <instance> — <purpose>`

Every value moves through pipes. Nothing below prints, stores or shows a secret. The rule behind each
step is in `references/secrets.md` of the `infrastructure-security` skill.

## 0. Before you start

```bash
bw status | grep -q '"status":"unlocked"' || echo "bw is locked: ask the person to unlock it"
bw sync >/dev/null
```

## 1. Create the item in Vaultwarden (generated, never seen)

```bash
bw generate -ulns --length 40 \
  | jq -n --rawfile pw /dev/stdin \
      --arg name '<Service> — <instance> — <purpose>' \
      --arg user '<user>' \
      --arg org '<organisation-id>' \
      --arg col '<collection-id>' \
      '{type: 1, name: $name, organizationId: $org, collectionIds: [$col],
        login: {username: $user, password: ($pw | rtrimstr("\n"))}}' \
  | bw encode | bw create item >/dev/null
```

`>/dev/null` matters: `bw create item` echoes the whole item back, password included.

## 2. Copy it to GitHub

```bash
bw get password '<Service> — <instance> — <purpose>' \
  | gh secret set <NAME> --repo <owner>/<stacks-repo> --env <stack>-<instance>
```

## 3. Hand it to the service

Add the variable to the deploy workflow's `env:` and to the stack's `.env.example`, name only:

```dotenv
<NAME>=  # Vaultwarden: <Service> — <instance> — <purpose>
```

In `docker-compose.yml`, reference it with no fallback: `${<NAME>:?<NAME> is not set}`.

## 4. Record it in the inventory

Vaultwarden is the inventory: write *Used by*, *Owner* and *Last rotated* in the item's notes, with
`bw` like any other edit of the item. The stack's secrets table lists names only:

| Vaultwarden item | Used by |
|---|---|
| `<Service> — <instance> — <purpose>` | `<service>` (`<NAME>`) |

## 5. Deploy, then verify without seeing

```bash
cmp -s <(bw get password '<Service> — <instance> — <purpose>') \
       <(ssh <host> "sed -n 's/^<NAME>=//p' <stack-dir>/.env" | tr -d '\n') \
  && echo same || echo different
```

## Rotate

1. Generate the new value into the existing item:

   ```bash
   bw get item '<Service> — <instance> — <purpose>' \
     | jq --rawfile pw <(bw generate -ulns --length 40) '.login.password = ($pw | rtrimstr("\n"))' \
     | bw encode | bw edit item "$(bw get item '<Service> — <instance> — <purpose>' | jq -r .id)" >/dev/null
   ```

2. Apply it where the service holds it (the database user, the admin account), by stdin or the
   environment of one command, never on a command line.
3. Run steps 2, 5 and the deploy again.
4. Check the old value no longer works.
5. Update *Last rotated* in the item's notes.
