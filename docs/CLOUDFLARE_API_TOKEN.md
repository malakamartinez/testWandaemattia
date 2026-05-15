# Token API per deploy GitHub Actions (Wrangler → Pages)

Errore tipico in CI:

```
Authentication error [code: 10000]
Authentication failed (status: 400) [code: 9106]  (/memberships)
```

Il token in **GitHub → Settings → Secrets → `CLOUDFLARE_API_TOKEN`** non ha permessi sufficienti o è scaduto.

## Crea un token nuovo (consigliato)

1. Apri [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens)
2. **Create Token** → **Create Custom Token**
3. Permessi **Account** (tutti sul tuo account `Mattia.elef@gmail.com's Account`):

| Risorsa | Permesso |
|---------|----------|
| Account Settings | Read |
| Cloudflare Pages | **Edit** |
| Workers KV Storage | **Edit** |
| Workers R2 Storage | **Edit** |
| Workers Scripts | Read (opzionale ma utile) |

4. **Account Resources** → Include → il tuo account
5. Crea il token e copialo **una sola volta**

## Secret GitHub (repo `testWandaemattia`)

| Secret | Valore |
|--------|--------|
| `CLOUDFLARE_API_TOKEN` | Il token appena creato (nessuno spazio prima/dopo) |
| `CLOUDFLARE_ACCOUNT_ID` | Account ID da Dashboard → Workers & Pages (colonna destra) |

Non serve più `CLOUDFLARE_KV_LIVE_ID` in CI: l’ID KV è già in `wrangler.toml`.

## Test locale

```bash
export CLOUDFLARE_API_TOKEN="..."
export CLOUDFLARE_ACCOUNT_ID="..."
cd ~/testWandaemattia
npx wrangler@4.90.1 whoami
npx wrangler@4.90.1 pages deploy . --project-name=wanda-mattia-ap --branch=main
```

Se `whoami` fallisce con 9106, il token è ancora sbagliato.

## Alternativa senza token in GitHub

Collega **Pages → Connect to Git** al repo `malakamartinez/testWandaemattia`, branch `main`, output `public/`.

Poi basta `git push origin main`: Cloudflare deploya senza Wrangler in Actions (workflow `pages-git-only.yml`).
