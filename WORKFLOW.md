# Flusso deploy (unica fonte di verità)

- **Repo:** `~/testWandaemattia`
- **Sito statico:** `public/` (`public/index.html`, `public/assets/`, …)
- **Pages:** progetto Cloudflare `wanda-mattia-ap`, output `./public`
- **Produzione:** push su `main` → auto-deploy → `test.wandaemattia.com`

## Cursor / agent

Modificare **solo** file sotto `~/testWandaemattia/public/` (e `functions/` alla root se serve API).

**Non** usare `.cursor/projects/.../wanda-mattia-wedding` (cartella interna Cursor): non è collegata al deploy.

## Dopo ogni modifica

```bash
cd ~/testWandaemattia
git status
git add -A
git commit -m "descrizione"
git push origin main
```

Verifica online: sorgente pagina contiene `wm-build` e hero con `hero-logo.svg`.

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
