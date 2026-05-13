# Linode Deployment Notes

This site runs as a Dockerized Next.js app behind the existing Linode Nginx Proxy Manager container.

## Server setup

Install Docker and make sure the deploy user can run it:

```bash
sudo apt update
sudo apt install -y docker.io docker-compose-plugin
sudo usermod -aG docker deploy
```

The deploy user may need to log out and back in before group membership takes effect.

Create the app directory:

```bash
sudo mkdir -p /var/www/berkeleydogs.com
sudo chown deploy:deploy /var/www/berkeleydogs.com
```

## Nginx Proxy Manager

The app container joins the existing Docker networks used by the proxy manager:

```bash
proxy
infra_default
```

In Nginx Proxy Manager, configure the Proxy Host for `berkeleydogs.com` and `www.berkeleydogs.com` to:

- Scheme: `http`
- Forward Hostname / IP: `app-berkeleydogs`
- Forward Port: `3000`

Do not run the system `nginx.service` on this server while Nginx Proxy Manager owns public ports `80` and `443`.

If the public site returns `502` while `app-berkeleydogs` is healthy, check that the Proxy Host target above is attached to the same Docker network as `infra-nginx-proxy-manager-1`.

## GitHub Actions secrets

Add these in GitHub repository settings:

- `SSH_PRIVATE_KEY`
- `REMOTE_HOST`
- `REMOTE_USER`
- `REMOTE_PORT`
- `REMOTE_TARGET`

`REMOTE_USER`, `REMOTE_PORT`, and `REMOTE_TARGET` can be omitted if the server uses `deploy`, port `2222`, and `/var/www/berkeleydogs.com`.

## Manual deploy fallback

From the server:

```bash
cd /var/www/berkeleydogs.com
docker compose -f docker-compose.prod.yml up -d --build --remove-orphans
```

Useful checks:

```bash
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs --tail=100 berkeleydogs
docker compose -f docker-compose.prod.yml exec -T berkeleydogs wget -qO- http://127.0.0.1:3000/guide >/dev/null
```
