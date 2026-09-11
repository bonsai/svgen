#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

echo "[svgen] installing dependencies..."
if ! command -v npm >/dev/null 2>&1; then
  echo "[svgen] error: npm is required" >&2
  exit 1
fi

npm install
npm run start -- --type random --seed 42 --size 64 > /tmp/svgen-test.svg

echo "[svgen] ready"
echo "[svgen] generated /tmp/svgen-test.svg"
