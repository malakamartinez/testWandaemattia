# Istruzioni per l'agente Cursor

## Cartella di lavoro (obbligatoria)

Usa **solo** questo repository:

```
~/testWandaemattia
```

- Sito statico: `public/` (es. `public/index.html`)
- API Pages Functions: `functions/` (es. `functions/api/live.js`)
- Config deploy: `wrangler.toml` (`pages_build_output_dir = "./public"`)

**Non** modificare `.cursor/projects/.../wanda-mattia-wedding` o altre copie: non sono collegate al deploy.

## Pubblicare su test.wandaemattia.com

Dopo modifiche a `public/` o `functions/`:

```bash
cd ~/testWandaemattia
npm run deploy
```

Oppure: `git push origin main` (se GitHub Actions / Pages Git è collegato).

Deploy Wrangler corretto (include Functions + binding da `wrangler.toml`):

```bash
npx wrangler pages deploy . --project-name=wanda-mattia-ap --branch=main
```

**Non** usare `pages deploy ./public` da solo: carica solo HTML e **non** le Functions.

## Verifica deploy

Nel sorgente di https://test.wandaemattia.com/ deve comparire:

- `meta name="wm-build"` (valore aggiornato in `public/index.html`)
- `GET /api/live` → JSON con `"ok":true` e `"hasR2":true` se R2 è configurato

## Dominio: Pages, non Worker standalone

`test.wandaemattia.com` deve essere su **Cloudflare Pages** (progetto `wanda-mattia-ap`), non solo su un Worker vuoto con custom domain. Vedi `WORKFLOW.md`.
