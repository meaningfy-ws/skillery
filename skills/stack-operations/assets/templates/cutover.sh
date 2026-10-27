#!/usr/bin/env bash
# Use this outline for a cutover that moves a running stack's data to a new layout or VM (references/cutover.md).
# Run it from the change's scripts/ folder; every step appends a row to the change's execution log.
# Nothing here deletes the old containers or data: that waits for the owner's go-ahead, after the rollback window.
set -euo pipefail

STACK="<stack>"
OLD_PROJECT="<old-compose-project>"
SRC="<old-data-path>"          # e.g. a named volume's mountpoint
DST="/opt/data/<stack>/<service>"

step() { printf '\n== %s\n' "$*"; }

step "1. Pre-flight: refuse to start if a previous attempt left renamed containers"
if docker ps -a --format '{{.Names}}' | grep -q -- '-old$'; then echo "old containers exist: stop"; exit 1; fi

step "2. Preconditions: data mount, new images pulled, no running jobs"
findmnt -n /opt/data >/dev/null
( cd /opt/stacks/$STACK && docker compose config -q && docker compose pull )
# <check that no backup or batch job is running now>

step "3. Disable the old deployer so nothing redeploys the old layout"
# <disable the old workflow or runner>

step "4. Stop the applications first, then the databases"
docker compose -p "$OLD_PROJECT" stop "<app-services>"
docker compose -p "$OLD_PROJECT" stop "<db-services>"

step "5. Copy the data"
mkdir -p "$DST"
rsync -aHAX --numeric-ids --delete "$SRC"/ "$DST"/

step "6. Prove the copy: a dry run must list no difference"
diff_out=$(rsync -anciHAX --delete "$SRC"/ "$DST"/)
[ -z "$diff_out" ] || { echo "copy differs:"; echo "$diff_out"; exit 1; }

step "7. Rename the old containers aside (kept for rollback)"
for c in $(docker ps -a --filter "label=com.docker.compose.project=$OLD_PROJECT" --format '{{.Names}}'); do
  docker rename "$c" "$c-old"
done

step "8. Start the new stack, health-gated"
( cd /opt/stacks/$STACK && docker compose up -d --wait --wait-timeout 300 )

step "9. Compare counts between old and new"
# <the counts the change named, e.g. rows per table, objects per bucket>; a mismatch -> run rollback.sh

echo "Cutover done. Old containers kept as *-old until the owner says delete."
# rollback.sh (beside this file): stop the new stack, rename *-old back, start them, re-enable the old deployer.
