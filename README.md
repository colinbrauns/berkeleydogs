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

## Community forum (Discourse)

- This site links to and can embed a Discourse forum.
- Steps:
  1. Provision a Discourse instance (e.g., on a small VPS or using Discourse hosting). Set base URL, e.g., `https://forum.berkeleydogs.com`.
  2. Configure CORS/embedding: in Discourse admin, add `https://berkeleydogs.com` as an allowed embed origin.
  3. In `index.html`, ensure the Forum button points to your forum URL and the embed script `discourseUrl` matches it.
  4. Optionally map DNS: create CNAME `forum.berkeleydogs.com` to your Discourse host.
