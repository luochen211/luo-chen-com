# Cloudflare Pages Deployment

This site deploys to Cloudflare Pages project `luo-chen-com`.

## GitHub Actions

Pushes to `main` run `.github/workflows/deploy.yml`:

1. `npm ci`
2. `npm run lint`
3. `npm run build`
4. `wrangler pages deploy dist --project-name=luo-chen-com --branch=main`

## Required GitHub Secret

Add this repository secret before relying on automatic deployments:

- `CLOUDFLARE_API_TOKEN`

The token should have Cloudflare Pages edit/deploy permission for account:

```text
564049c624e2d4ee91f3145898386024
```

Project:

```text
luo-chen-com
```

## Manual Fallback

If automatic deployment is unavailable, run:

```bash
npm run build
npx wrangler pages deploy dist --project-name=luo-chen-com --branch=main
```
