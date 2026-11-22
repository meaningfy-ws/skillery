<!-- Use on the day a person leaves or loses a role: copy into the intervention record, tick each line, note who did it and when. -->

# Offboarding: `<person>` — `<YYYY-MM-DD>`

Run it the same day. A line that does not apply is marked "n/a", never deleted.

## Accounts

- [ ] GitHub: removed from the organisation (or from the infrastructure teams, if they stay)
- [ ] GitHub: personal access tokens, deploy keys and apps they created on our repositories revoked
- [ ] Cloud console: user removed; API tokens they created revoked
- [ ] Image registry: account and tokens removed
- [ ] Vaultwarden: removed from the organisation and every collection
- [ ] Email, Slack, documentation space, issue tracker: disabled or downgraded
- [ ] Every stack's admin interface: personal account removed
- [ ] Client portals and VPNs they used for us: access withdrawn, client told where needed

## SSH

- [ ] `bastion-users.yml`: entry set to `state: absent`, play run, account gone on the bastion
- [ ] Entry deleted from the list after the run
- [ ] No server still trusts their key (search every `authorized_keys` the play does not manage)
- [ ] With SSH certificates: no new certificate issued; existing ones expire within their validity

## Secrets

- [ ] Every secret in the collections they could read listed from the inventory
- [ ] Each one rotated (the secret flow, *Rotate*), *Last rotated* updated
- [ ] Shared secrets they knew outside Vaultwarden (if any were found): moved in and rotated

## Close

- [ ] Ownership of their secrets, stacks and open issues moved to a named person
- [ ] Record completed: date, who ran it, anything left open as an issue
