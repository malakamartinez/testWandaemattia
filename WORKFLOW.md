# Flusso deploy (unica fonte di verità)

- **Repo:** `~/testWandaemattia`
- **Sito statico:** `public/` (`public/index.html`, `public/assets/`, …)
- **Pages:** progetto Cloudflare `wanda-mattia-ap`, output `./public`
- **Produzione:** push su `main` → auto-deploy → `test.wandaemattia.com`

## Cursor / agent

Modificare **solo** file sotto `~/testWandaemattia/public/` (e `functions/` alla root se serve API).

**Non** usare `.cursor/projects/.../wanda-mattia-wedding` (cartella interna Cursor): non è collegata al deploy.

## Deploy automatico

```bash
cd ~/testWandaemattia
npm run deploy
```

Fa `git push origin main` e, se hai `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` in shell, anche `wrangler pages deploy .` (produzione `main`).

**Importante:** il deploy deve partire dalla **root del repo** (`.`), non solo da `./public`, altrimenti le **Functions** (`/api/live`, upload R2) non vengono pubblicate.

Hook Cursor (opzionale): `.cursor/hooks.json` esegue `scripts/deploy.sh` a fine task agente.

## Dominio: usa Pages, non Worker vuoto

Lo screenshot “Domains & Routes” su un **Worker** non basta. Il sito deve essere il progetto **Pages** `wanda-mattia-ap` con custom domain `test.wandaemattia.com` (Workers & Pages → **Pages** → progetto → Custom domains).

## Verifica

Sorgente di https://test.wandaemattia.com/ → `wm-build` = `2026-05-15-deploy-root` e `hero-logo.svg` caricato.

## Album live (foto/video tra dispositivi)

- Upload: `POST /api/media/upload` → file su **R2**, indice su **KV**
- Lista: `GET /api/live` → elenco con URL `/api/media/file/{id}`
- Polling ogni ~1,8 s sul client

### Setup R2 (una tantum, obbligatorio per l’album)

1. Dashboard Cloudflare → **R2** → **Create bucket** → nome `wanda-mattia-media`
2. Progetto **Pages** `wanda-mattia-ap` → **Settings** → **Functions** → **R2 bucket bindings** → variabile **`MEDIA`** → bucket `wanda-mattia-media`
3. In repo, `wrangler.toml` ha già `[[r2_buckets]] binding = "MEDIA"` (allineare al bucket creato)
4. Dopo push su `main`, prova upload: in fondo pagina *«album condiviso»* e messaggio *«Album live: foto visibili su tutti i dispositivi»*

Se vedi *«album cloud in configurazione (R2)»*, il binding R2 non è attivo sul deploy.
