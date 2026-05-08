# Deploy continuo su test.wandaemattia.com

Questo progetto e' configurato per deploy automatico su Cloudflare Pages tramite GitHub Actions.

## 1) Prerequisiti (una sola volta)

- Repo GitHub collegata a questa cartella.
- Progetto Cloudflare Pages gia' creato.
- Dominio custom `test.wandaemattia.com` gia' assegnato al progetto Pages.

## 2) Aggiungi questi 3 GitHub Secrets (Repository -> Settings -> Secrets and variables -> Actions)

- `CLOUDFLARE_API_TOKEN`
  - Token API Cloudflare con permessi Pages edit + account read.
- `CLOUDFLARE_ACCOUNT_ID`
  - ID account Cloudflare.
- `CLOUDFLARE_PAGES_PROJECT`
  - Nome progetto Pages (esempio: `wanda-mattia-wedding`).

## 3) Flusso operativo

Ogni push su `main` pubblica automaticamente il contenuto della cartella root su Cloudflare Pages.

Quindi:

1. modifica file
2. commit
3. push su `main`
4. deploy automatico su `test.wandaemattia.com`

## Nota

Se vuoi usare un branch diverso per preview, puoi cambiare `--branch=main` nel workflow.
