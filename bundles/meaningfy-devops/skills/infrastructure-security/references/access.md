# Access

Who can reach what, and how that changes when people join and leave. The aim: every action on the
infrastructure is done by one named person, and removing a person removes all of their access the
same day.

## The rules

| Rule | Level | Minimum version | Why |
|---|---|---|---|
| **MFA on every admin surface** | MUST | 2FA enforced in the GitHub organisation setting; MFA on the cloud console, the image registry, Vaultwarden, email and every web admin interface of a stack | A stolen password alone is the most common way in. |
| **Named accounts** | MUST | one personal account per person on every surface; no shared admin login, no shared cloud console user, no shared root key; SSH as yourself, `PermitRootLogin no`, `PasswordAuthentication no` | A shared account cannot be removed for one person, and its actions cannot be traced to one. |
| **Same-day offboarding** | MUST | the [offboarding checklist](../assets/templates/offboarding-checklist.md), run on the leaving day, completion recorded | Access left open after someone leaves is a door nobody watches. |
| **Access review every 6 months** | MUST | the review below, recorded | Accounts accumulate; a review is the only time unused ones are found. |
| **SSH certificates instead of key fan-out** | SHOULD | short-lived user certificates signed by one CA key kept in Vaultwarden; servers trust the CA, not individual keys | Offboarding stops being "remove a key from every server". |

Out of scope at this size: SSO for GitHub (needs a paid plan), session-recording bastions,
just-in-time access brokers and identity-governance tools.

## How SSH access is kept

- Personal Ed25519 keys only. One list in git holds every person's key and groups; Ansible applies it
  with `exclusive` keys, so a key not in the list is removed. Start from
  [`bastion-users.yml`](../assets/templates/bastion-users.yml).
- **Groups are always explicit.** No entry grants `sudo` by default; admin rights are written next to
  the person, with a reason.
- Removing a person: set `state: absent`, run the play, check the account is gone, then delete the
  entry.

## Least privilege

- GitHub organisation: base permission *read*; write access through teams; two organisation owners,
  no more.
- Production access only for the people who operate it.
- Vaultwarden: one collection per service; a person sees the collections they operate.

## Joiner

On the first day, before any access to production:

1. Personal accounts on GitHub (team membership, not individual grants), the cloud console,
   Vaultwarden (only the collections needed), Slack and the documentation space. MFA on each before
   first use.
2. SSH key added through `bastion-users.yml`, explicit groups, by a PR reviewed like any other change.
3. Read access first; write and production access when the person operates.
4. Record the grants as an intervention (how: `infrastructure-operations`), so the next access review
   and the eventual offboarding start from a list.

## Leaver

Run [`offboarding-checklist.md`](../assets/templates/offboarding-checklist.md) on the leaving day.
It includes rotating every secret the person could read ([secrets](secrets.md#rotation)).

## Access review (every 6 months)

1. For each surface (GitHub organisation and teams, cloud console, registry, Vaultwarden
   organisation and collections, the bastion user list, each stack's admin interface), list the
   accounts.
2. Mark each one: a current person who needs it, or remove.
3. Check MFA is on for every remaining account.
4. Look for shared logins and keys that belong to nobody; each is a finding.
5. Record the date, who reviewed, and what was removed. The next review is due six months later.
