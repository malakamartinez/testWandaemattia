#!/usr/bin/env bash
# Pubblica su test.wandaemattia.com (Pages production branch main).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "==> Repo: $ROOT"

if [ -n "$(git status --porcelain)" ]; then
  git add -A
  git commit -m "chore: auto-deploy $(date -u +%Y-%m-%dT%H:%M:%SZ)" || true
fi

if git rev-parse --abbrev-ref HEAD | grep -q main; then
  echo "==> git push origin main"
  git push origin main
else
  echo "WARN: non sei su main; push manuale consigliato."
fi

if [ -n "${CLOUDFLARE_API_TOKEN:-}" ] && [ -n "${CLOUDFLARE_ACCOUNT_ID:-}" ]; then
  echo "==> wrangler pages deploy (immediato, non attendere Git)"
  npx --yes wrangler@4.90.1 pages deploy . \
    --project-name=wanda-mattia-ap \
    --branch=main \
    --commit-dirty=true
else
  echo "==> Solo push Git (Pages CI). Per deploy immediato: export CLOUDFLARE_API_TOKEN e CLOUDFLARE_ACCOUNT_ID"
fi

echo "OK. Verifica: https://test.wandaemattia.com/ (cerca wm-build nel sorgente)"
