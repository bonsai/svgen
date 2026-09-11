#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

echo "[svgen] installing dependencies..."
if command -v bun >/dev/null 2>&1; then
  bun install
  echo "[svgen] Bun ready"
elif command -v npm >/dev/null 2>&1; then
  npm install
  echo "[svgen] npm ready"
else
  echo "[svgen] error: bun or npm is required" >&2
  exit 1
fi

echo "[svgen] test:"
if command -v bun >/dev/null 2>&1; then
  bun src/cli.js --type random --seed 42 --size 64 > /tmp/svgen-test.svg
else
  node src/cli.js --type random --seed 42 --size 64 > /tmp/svgen-test.svg
fi

echo "[svgen] generated /tmp/svgen-test.svg"
