# Upgrades that touch data

Most version bumps are a pin change and a deploy. Some change the data on disk, and a revert alone
does not undo them: a database major version, a search index or triplestore format, an application
migration that rewrites its schema. These are a data change: the safe-change protocol and its consent
apply (`infrastructure-operations`), and an unattended agent never does it.

## Before

1. Read the vendor's upgrade notes for every version you skip. Note what is one-way.
2. Take a fresh backup and confirm it reached its storage. If the stack has no backup, take a copy
   by hand and record where it is and its checksum.
3. Keep the previous image: it must still be on the VM (keep-3 rule, [rollback.md](rollback.md)) or
   saved as a tarball (`docker save`) beside the stack.
4. Write the rollback before the upgrade: which backup, which image, which commands, how long.
5. Run the acceptance feature now, so you have a baseline to compare with.

## PostgreSQL major versions

Changing only the image tag fails: the new server refuses the old data directory. Use one of:

- **Dump and restore** (simplest, needs downtime): `pg_dumpall` from the old container, start the new
  version on an empty directory under `/opt/data/<stack>/`, restore, compare row counts.
- **`pg_upgrade`** (faster for large data): run it with both versions' binaries, from a
  dedicated upgrade image, against a copy of the directory.

Keep the old data directory untouched until the new one is verified and the rollback window has
passed. Minor versions (16.3 to 16.4) are a pin change.

## Application schema migrations

Expand, then contract (the rule in [rollback.md](rollback.md)), so rollback stays a revert.

## After

Verify the version reported by the service, the data counts against the baseline, the consumers in
the README, and the acceptance feature. Record the result, and when the vendor licence expires if it
has one, in the stack's README.
