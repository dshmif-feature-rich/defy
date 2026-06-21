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
npm run preflight   # validate dist before deploy
```

## Deploy to GitHub Pages

### 1. Create and push the repo

```bash
cd ~/projects/defy
gh auth login
gh repo create defy --private --source=. --remote=origin --push
# Or create the repo in the GitHub UI, then:
# git remote add origin git@github.com:YOUR_USER/defy.git
# git push -u origin main
```

### 2. Enable GitHub Pages

1. Open the repo on GitHub → **Settings → Pages**
2. Under **Build and deployment**, set **Source** to **GitHub Actions**
3. Push to `main` (or re-run the workflow in the **Actions** tab)
4. Wait for the `Deploy to GitHub Pages` workflow to finish

### 3. Custom domain DNS cutover

`public/CNAME` already contains `defyprs.com`.

**At your domain registrar**, replace the current Firebase/Fastly records with GitHub Pages:

| Type | Host | Value |
|------|------|-------|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `YOUR_GITHUB_USERNAME.github.io` |

Then in **Settings → Pages → Custom domain**, enter `defyprs.com` and enable **Enforce HTTPS**.

DNS propagation can take up to 48 hours. Verify with:

```bash
dig +short defyprs.com A
# Should return the 185.199.x.x addresses above
```

### 4. Post-launch verification

```bash
npm run preflight
npm run preview
```

Check in the browser:

- All 8 pages load (Home, About Us, Meet John, Aging, Cancer, Gravity, Services, Contact)
- Legacy `.html` URLs redirect (e.g. `/about-us.html` → `/about-us/`)
- Patient Portal, CareCredit, and PatientFi links open correctly
- Google Maps embed loads on Contact page

Run Lighthouse in Chrome DevTools (Lighthouse tab) against the deployed URL. Targets: **Performance ≥ 90**, **Accessibility 100**.

### 5. Decommission Firebase Hosting

After the new site is verified live on `defyprs.com`:

1. Confirm DNS no longer points to Firebase (`151.101.x.x`)
2. In the Firebase console → Hosting → remove the `defyprs.com` custom domain
3. Optionally delete or archive the old Firebase project

**Keep Firebase live until step 4 passes** to avoid downtime during DNS propagation.

## Project structure

See [PLAN.md](./PLAN.md) for the full reimplementation plan.