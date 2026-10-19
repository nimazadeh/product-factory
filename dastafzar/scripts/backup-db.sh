#!/usr/bin/env bash
# Database backup: run on the server (cron daily suggested)
# Usage: ./scripts/backup-db.sh [output-dir]
set -euo pipefail
DIR="${1:-./backups}"
mkdir -p "$DIR"
STAMP=$(date +%Y%m%d-%H%M)
docker compose exec -T db pg_dump -U postgres dastafzar > "$DIR/dastafzar-$STAMP.sql"
find "$DIR" -name "dastafzar-*.sql" -mtime +14 -delete
echo "Backup written: $DIR/dastafzar-$STAMP.sql (backups older than 14 days deleted)"
