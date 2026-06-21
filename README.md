# DEFY PRS

Modern static site for [defyprs.com](https://defyprs.com), built with Astro and Tailwind CSS.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:4321](http://localhost:4321).

## Build

```bash
npm run build
npm run preview
```

## Deploy (GitHub Pages)

1. Push this repo to GitHub.
2. In repo **Settings → Pages**, set source to **GitHub Actions**.
3. Push to `main` — the workflow in `.github/workflows/deploy.yml` builds and deploys automatically.
4. For the custom domain, `public/CNAME` already contains `defyprs.com`. Point DNS to GitHub Pages and enable HTTPS.

## Project structure

See [PLAN.md](./PLAN.md) for the full reimplementation plan.