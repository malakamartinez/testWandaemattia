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
  echo "==> wrangler whoami (test token)"
  if npx --yes wrangler@4.90.1 whoami 2>/dev/null; then
    echo "==> wrangler pages deploy"
    npx --yes wrangler@4.90.1 pages deploy . \
      --project-name=wanda-mattia-ap \
      --branch=main \
      --commit-dirty=true
  else
    echo "WARN: token Cloudflare non valido. Solo push Git. Vedi docs/CLOUDFLARE_API_TOKEN.md"
  fi
else
  echo "==> Solo push Git → Pages 'Connect to Git' deploya (se collegato in Dashboard)"
fi

echo "OK. Verifica: https://test.wandaemattia.com/ (cerca wm-build nel sorgente)"
