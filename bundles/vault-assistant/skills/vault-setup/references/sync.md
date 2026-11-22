# Sync

The vault is plain folders on a cloud drive, synced to each workstation; one machine is in use at a
time, so the sync client's conflict handling is enough. There is no git inside the vault, and no
Obsidian Sync, LiveSync or Syncthing.

The owner folder (`obsidian/<person>/`) sits wherever the company's runbook says; ask the owner for
its local path. Never write that path into a note or a template.

## Google Drive with Insync (Linux or Windows)

1. Install Insync and sign in with the work account.
2. Sync the owner folder `obsidian/<person>/` (both `vault/` and `vault-files/`).
3. Insync → the account → **Ignore rules**: add `.obsidian/workspace*.json` and `.trash/`.
4. Check: create a note on one machine; after Insync reports "synced", it opens on the other.

## OneDrive (Windows)

1. Sign in to OneDrive with the work account; the owner folder must be inside the synced tree.
2. On the owner folder: **Always keep on this device**, so the CLI and agents read real files, not
   placeholders.
3. OneDrive cannot ignore files by pattern; Obsidian's `workspace*.json` files will sync. They are
   harmless but may show as conflicts; delete the conflict copies, never the originals.

## Binaries

`vault-files/` syncs with the vault. Whether a sync client's ignore rules can keep binaries out of
`vault/` itself is **UNVERIFIED**; the conventions keep them out by habit instead.

## Web links for `resources.md`

A file's web link comes from the drive, not from the agent: Insync → right-click → **Copy link**, or the
drive's web page → Share → Copy link. Paste it where `resources.md` says `ASK OWNER`.
