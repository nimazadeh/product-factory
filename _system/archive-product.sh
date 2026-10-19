#!/usr/bin/env bash
# Usage: archive-product.sh <product-dir> <version> [--delete]
# RULE (2026-10-18): exactly ONE zip per product — _archive/<product>-latest.zip
# The new zip REPLACES the previous one. Old version zips are deleted automatically.
set -euo pipefail
PROD="${1:?product dir}"; VER="${2:?version}"; NAME=$(basename "$PROD")
OUT="/home/user/_archive/${NAME}-latest.zip"
cd "/home/user"
[ -d "$NAME" ] || { echo "ERROR: folder $NAME not found"; exit 1; }
printf '%s\n' "$VER" > "$NAME/VERSION.txt"
rm -f "/home/user/_archive/${NAME}-v"*.zip "$OUT"
zip -qr "$OUT" "$NAME" -x "$NAME/node_modules/*" "$NAME/dist/*" "$NAME/build/*" "$NAME/.git/*" "$NAME/.next/*" "$NAME/.venv/*" "$NAME/__pycache__/*" "$NAME/verification-*.png" "$NAME/test-results/*"
SHA=$(sha256sum "$OUT" | cut -d' ' -f1); SIZE=$(du -h "$OUT" | cut -f1)
# Replace the product's row in the registry (one row per product)
grep -v "| ${NAME} " /home/user/PRODUCTS.md > /tmp/products.tmp || true; mv /tmp/products.tmp /home/user/PRODUCTS.md
printf '| %s | v%s | %s | %s | `%s` | zipped — ready to download (`_archive/%s-latest.zip`) |\n' "$NAME" "$VER" "$(date +%F)" "$SIZE" "$SHA" "${NAME}" >> /home/user/PRODUCTS.md
echo "Archived (replaces any previous): $OUT ($SIZE) v$VER sha256=$SHA"
if [ "${3:-}" = "--delete" ]; then rm -rf "/home/user/$NAME"; echo "Deleted source: $NAME/ (restore: _system/restore-product.sh $OUT)"; fi
