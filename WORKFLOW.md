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
