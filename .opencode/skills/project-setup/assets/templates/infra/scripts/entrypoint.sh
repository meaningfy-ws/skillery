#!/usr/bin/env bash
# Container entrypoint for <<PROJECT_NAME>>.
# Runs an optional seed step, then execs the app process (PID 1, so signals
# reach it cleanly). Keep this generic — adjust APP_CMD to your entrypoint.
set -euo pipefail

# --- Optional dev-only seeding ---------------------------------------------
# Enable by setting SEED_DB=true in infra/.env. The seed script is included
# only in development images; in production this branch is a no-op.
if [ "${SEED_DB:-false}" = "true" ]; then
  if [ -f /app/<<PACKAGE>>/scripts/seed_db.py ]; then
    echo "Seeding database..."
    python /app/<<PACKAGE>>/scripts/seed_db.py
  else
    echo "SEED_DB=true but no seed script found (production image); skipping." >&2
  fi
fi

# --- Launch the application -------------------------------------------------
# Replace with your real entrypoint. Two common shapes:
#
# 1) ASGI service (FastAPI/Starlette) via uvicorn:
#    exec uvicorn "<<PACKAGE>>.entrypoints.api.app:create_app" \
#        --factory \
#        --host "${APP_HOST:-0.0.0.0}" \
#        --port "${APP_PORT:-8000}" \
#        --workers "${APP_WORKERS:-1}"
#
# 2) CLI / worker module:
#    exec python -m <<PACKAGE>> "$@"

APP_CMD=(python -m <<PACKAGE>>)
exec "${APP_CMD[@]}" "$@"
