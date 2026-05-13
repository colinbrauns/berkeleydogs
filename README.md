# berkeleydogs.com

Next.js site for Berkeley Dogs, deployed on Linode behind NGINX.

## Current stack

- Next.js App Router
- Docker for the production app process
- Nginx Proxy Manager on Linode as the public reverse proxy
- GitHub Actions for deploys from `main`

The canonical app lives in `app/`, `data/`, and `public/`. Older root-level static files are still in the repo for reference, but new site work should happen in the Next.js app.

## Local development

```bash
npm install
npm run dev
```

Then visit `http://localhost:3000`.

Before shipping changes:

```bash
npm run build
npm audit --audit-level=moderate
```

## Production deployment

Pushing to `main` runs `.github/workflows/deploy-linode.yml`.

The workflow:

1. Installs dependencies with `npm ci`.
2. Builds the Next.js app.
3. Rsyncs the repository to Linode.
4. Runs `docker compose -f docker-compose.prod.yml up -d --build --remove-orphans` on the server.

Required GitHub Actions secrets:

- `SSH_PRIVATE_KEY`: private deploy key accepted by the Linode deploy user
- `REMOTE_HOST`: Linode IP address or hostname
- `REMOTE_USER`: SSH user, usually `deploy`
- `REMOTE_PORT`: SSH port, defaults to `2222` if omitted
- `REMOTE_TARGET`: deploy directory, defaults to `/var/www/berkeleydogs.com` if omitted

## Linode server expectations

The Linode host should have:

- Docker and Docker Compose installed
- A deploy user that can write to `/var/www/berkeleydogs.com`
- That deploy user added to the `docker` group, or otherwise able to run `docker compose`
- Nginx Proxy Manager proxying `berkeleydogs.com` to `app-berkeleydogs:3000`

The app joins the existing external Docker networks `proxy` and `infra_default` so Nginx Proxy Manager can reach it by container name.

## Content to finish

- Keep the Berkeley Dog Guide listings current in `data/guideListings.js`.
- Add real PDFs for `/flyer.pdf`, `/talking-points.pdf`, and `/solutions-brief.pdf`, or remove those download buttons until the files exist.
- Decide whether the legacy static files should be deleted after confirming NGINX serves the Next.js container.
- Add analytics once there is a clear success metric, such as forum joins, flyer downloads, or volunteer emails.
