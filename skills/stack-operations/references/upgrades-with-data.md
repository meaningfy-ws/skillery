# Upgrades that touch data

Most version bumps are a pin change and a deploy ([versions-and-promotion.md](versions-and-promotion.md)).
Some change the data on disk, and then a revert alone does not undo them: a database major version
(PostgreSQL 15 to 16, for example), a search index or triplestore format, an application release
whose migration rewrites its schema. Treat these as a data change: the safe-change protocol and its
consent apply (`infrastructure-operations`), and an unattended agent never does it.

## Before

1. Read the vendor's upgrade notes for every version you skip. Note what is one-way.
2. Take a fresh backup and confirm it reached its storage. If the stack has no backup, take a copy
   by hand and record where it is and its checksum.
3. Keep the previous image: it must still be on the VM (keep-3 rule, [rollback.md](rollback.md)) or
   saved as a tarball (`docker save`) beside the stack.
4. Write the rollback before the upgrade: which backup, which image, which commands, how long.
5. Run the acceptance feature now, so you have a baseline to compare with.

## PostgreSQL major versions

A major upgrade cannot just change the image tag: the new server refuses the old data directory.
Use one of:

- **Dump and restore** (simplest, needs downtime): `pg_dumpall` from the old container, start the new
  version on an empty directory under `/opt/data/<stack>/`, restore, compare row counts.
- **`pg_upgrade`** (faster for large data): run it with both versions' binaries, from a
  dedicated upgrade image, against a copy of the directory.

Keep the old data directory untouched until the new one is verified and the rollback window has
passed. Minor versions (16.3 to 16.4) are a pin change.

## Application schema migrations

Keep migrations backward-compatible across one release: add first, remove in a later release
(expand, then contract). Then the previous image still runs on the new schema, and rollback is a
revert.

## After

Verify the version reported by the service, the data counts against the baseline, the consumers in
the README, and the acceptance feature. Record the result, and when the vendor licence expires if it
has one, in the stack's README.
