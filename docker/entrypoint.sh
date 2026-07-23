#!/bin/sh
set -e
# Migrations are applied by Payload prodMigrations on first request/init.
# Keep this entrypoint for future pre-start hooks (health wait, etc.).
exec "$@"
