#!/usr/bin/env bash
# Usage: restore-product.sh _archive/<product>-v<version>.zip
set -euo pipefail
cd /home/user; unzip -q -o "$1" -d /home/user
NAME=$(basename "$1" | sed 's/-v[0-9.]*\.zip//')
echo "Restored: $NAME/"
[ -f "/home/user/$NAME/package.json" ] && echo "Next: cd $NAME && npm install --legacy-peer-deps && npm run dev"
