# Linode Deployment Notes

This site is intended to run as a Dockerized Next.js app behind the existing Linode NGINX server.

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

## NGINX

Copy `deploy/nginx.berkeleydogs.com.conf` to:

```bash
/etc/nginx/sites-available/berkeleydogs.com
```

Enable and reload:

```bash
sudo ln -sf /etc/nginx/sites-available/berkeleydogs.com /etc/nginx/sites-enabled/berkeleydogs.com
sudo nginx -t
sudo systemctl reload nginx
```

Then add or renew TLS with Certbot:

```bash
sudo certbot --nginx -d berkeleydogs.com -d www.berkeleydogs.com
```

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
curl -I http://127.0.0.1:3000
```
