#!/usr/bin/env bash
# Dopo ogni task dell'agente: push + deploy se ci sono modifiche al sito.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

# Solo se toccati file del sito o API
if git diff --quiet HEAD -- public functions wrangler.toml .github/workflows 2>/dev/null \
  && [ -z "$(git status --porcelain -- public functions wrangler.toml .github/workflows 2>/dev/null)" ]; then
  exit 0
fi

exec "$ROOT/scripts/deploy.sh"
