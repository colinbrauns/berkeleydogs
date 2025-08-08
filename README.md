# berkeleydogs.com

Static site for Berkeley Dog Park Advocates.

## Local development

- Open `index.html` directly in your browser, or serve the folder:

```bash
pwsh -NoLogo -NoProfile -Command "cd ./berkeleydogs.com; python -m http.server 5500" # then visit http://localhost:5500
```

## Replace placeholders

- Update petition, calendar, and download links in `index.html`:
  - `[LINK_TO_YOUR_ONLINE_PETITION_HERE]`
  - `[LINK_TO_YOUR_GOOGLE_CALENDAR_HERE]`
  - `[LINK_TO_YOUR_TALKING_POINTS_PDF]`
  - `[LINK_TO_YOUR_PROPOSED_SOLUTIONS_BRIEF_PDF]`
  - Social links: `[YOUR_FACEBOOK_PAGE_LINK]`, `[YOUR_INSTAGRAM_PAGE_LINK]`, `[YOUR_TWITTER_PAGE_LINK]`
- Replace contact email in the Contact section.

## Images

- Hero uses `images/hero-dog-park.jpg`. Swap with your preferred 1500x800+ image; keep filename or update CSS `.hero` background URL.

## Accessibility & SEO

- Includes skip link, visible focus styles, ARIA current states, reduced motion support, and meta tags for social previews.

## Deployment

- Hosted via GitHub Pages. Ensure `CNAME` is `berkeleydogs.com`.
- Commit changes and push to `main`. In repository settings enable Pages for the root.

### CI/CD to Linode (GitHub Actions)

This repo includes `.github/workflows/deploy.yml` to sync the repo to a Linode server on every push to `main` using rsync over SSH.

1) On Linode
- Create a non-root user (e.g., `deploy`) and ensure SSH access.
- Create the target dir (e.g., `/var/www/berkeleydogs.com`) and configure your web server (nginx) to serve that directory.

2) In GitHub repo Settings → Secrets and variables → Actions, add:
- `SSH_PRIVATE_KEY`: Private key matching the public key added to the Linode user's `~/.ssh/authorized_keys`.
- `REMOTE_HOST`: Your Linode IP or hostname.
- `REMOTE_USER`: The SSH username (e.g., `deploy`).
- `REMOTE_PORT`: SSH port (usually `22`).
- `REMOTE_TARGET`: Absolute path to deploy to (e.g., `/var/www/berkeleydogs.com`).

3) Push to `main` and the workflow will rsync files to the server and optionally reload nginx.

### Auto-sync from local to GitHub

For automatic local push (Windows PowerShell 7), you can run a simple background loop during active development:

```powershell
while ($true) {
  git add -A
  if (-not [string]::IsNullOrWhiteSpace((git status --porcelain))) {
    git commit -m "auto: save"
    git push origin main
  }
  Start-Sleep -Seconds 30
}
```

Stop the loop with Ctrl+C when done.

## Community forum (Discourse)

- This site links to and can embed a Discourse forum.
- Steps:
  1. Provision a Discourse instance (e.g., on a small VPS or using Discourse hosting). Set base URL, e.g., `https://forum.berkeleydogs.com`.
  2. Configure CORS/embedding: in Discourse admin, add `https://berkeleydogs.com` as an allowed embed origin.
  3. In `index.html`, ensure the Forum button points to your forum URL and the embed script `discourseUrl` matches it.
  4. Optionally map DNS: create CNAME `forum.berkeleydogs.com` to your Discourse host.
