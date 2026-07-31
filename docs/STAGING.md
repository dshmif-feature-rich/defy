# Staging deploy (GitHub Actions)

Staging is a **separate CloudFront site** with `/pay` on and PayPal **sandbox**.  
Production (`www.defyprs.com`) is untouched and keeps `/pay` off.

## What Actions does for you

| Workflow | Repo | What it deploys |
|----------|------|-----------------|
| **Deploy staging infra** | `defy` | S3 + CloudFront for the office site; writes `/defy/staging/*` to SSM |
| **Deploy pay-api (sandbox)** | `defy-pay-api` | Lambda + CloudFront + WAF (sandbox PayPal); writes `/defy/sandbox/pay-api/base-url` to SSM |
| **Deploy staging site** | `defy` | Astro build with pay portal on → sync S3 + invalidate CDN |

Typical order (first time):

1. **Deploy staging infra** (Actions → Run workflow)  
2. **Deploy pay-api (sandbox)** (in `defy-pay-api` repo)  
3. **Deploy staging site** (push `staging` branch or Run workflow)

Day-to-day: push to `staging` (site) or `defy-pay-api` `main` (API). Re-run infra only when `infra/staging-host/**` changes.

---

## What you must do by hand (workflows cannot invent these)

### 1. AWS

- AWS account + CLI-capable IAM user (or keys) with rights to:
  - CloudFormation, S3, CloudFront, SSM, Lambda, IAM (for SAM), WAFv2, CloudWatch Logs  
- Put the same keys on **both** repos (or two users with the same policy):

| Secret name | Where |
|-------------|--------|
| `AWS_ACCESS_KEY_ID` | `defy` Environment **staging** + `defy-pay-api` repo secrets |
| `AWS_SECRET_ACCESS_KEY` | same |

Optional var on `defy` Environment **staging**: `AWS_REGION` = `us-east-1` (default).

### 2. GitHub

**defy** repo:

1. Settings → Environments → create **`staging`**  
2. On that environment, add secrets:

| Secret | Value |
|--------|--------|
| `AWS_ACCESS_KEY_ID` | IAM access key |
| `AWS_SECRET_ACCESS_KEY` | IAM secret |
| `PUBLIC_PAY_API_KEY` | Long random string (see below) — **must match** pay-api `PAY_API_KEY` |

**defy-pay-api** repo (create on GitHub if you have not yet):

```bash
cd ~/projects/defy-pay-api
# if not already a remote:
# gh repo create defy-pay-api --private --source=. --remote=origin --push
```

Repo **Secrets**:

| Secret | Value |
|--------|--------|
| `AWS_ACCESS_KEY_ID` | same AWS key (or deploy-only key) |
| `AWS_SECRET_ACCESS_KEY` | matching secret |
| `PAYPAL_CLIENT_ID` | PayPal **sandbox** REST app client id |
| `PAYPAL_CLIENT_SECRET` | PayPal **sandbox** secret |
| `PAY_API_KEY` | **Same value** as `PUBLIC_PAY_API_KEY` on defy staging |
| `ORIGIN_VERIFY_SECRET` | Different long random string (CloudFront → Lambda only; never in Astro) |

Generate keys:

```bash
openssl rand -hex 24   # PAY_API_KEY / PUBLIC_PAY_API_KEY (same value both places)
openssl rand -hex 32   # ORIGIN_VERIFY_SECRET (pay-api only)
```

### 3. PayPal Developer

1. [developer.paypal.com](https://developer.paypal.com) → create/use a **sandbox** app  
2. Enable **Invoicing**  
3. Copy Client ID + Secret → `PAYPAL_*` secrets above  
4. Create/send a **sandbox invoice** for office testing (not live)

### 4. Push code & run workflows

```bash
# defy-pay-api on GitHub
cd ~/projects/defy-pay-api && git push -u origin main

# defy — ensure staging branch exists
cd ~/projects/defy
git push origin main
git checkout -b staging 2>/dev/null || git checkout staging
git merge main
git push -u origin staging
```

Then in GitHub UI (first time, if auto-runs did not finish in order):

1. **defy** → Actions → **Deploy staging infra** → Run  
2. **defy-pay-api** → Actions → **Deploy pay-api (sandbox)** → Run  
3. **defy** → Actions → **Deploy staging site** → Run  

Open the office URL from the **infra** or **site** workflow summary (yellow **STAGING** banner).

---

## You do **not** need to

- Manually copy CloudFormation outputs into GitHub variables (SSM holds them)  
- Set `STAGING_SITE_URL` / bucket / distribution id by hand (optional overrides only)  
- Set `PUBLIC_PAY_API_BASE` by hand (read from SSM `/defy/sandbox/pay-api/base-url`)  
- Touch production secrets for staging  

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Site workflow: missing SITE_URL / BUCKET | Run **Deploy staging infra** first |
| Site workflow: missing API_BASE | Run **Deploy pay-api (sandbox)** first |
| Site workflow: missing PUBLIC_PAY_API_KEY | Add secret on Environment `staging` |
| CORS errors from staging `/pay` | Re-run **pay-api sandbox** after staging infra exists (picks up site origin) |
| 401 on lookup | `PUBLIC_PAY_API_KEY` ≠ `PAY_API_KEY` |
| WAF / stack errors in us-west-2 | Use **us-east-1** only for these stacks |

---

## Go-live (later, not staging)

Production stays on GitHub Pages with `PUBLIC_PAY_PORTAL_ENABLED=false` until you:

1. Deploy pay-api with `Stage=live` + live PayPal credentials  
2. Set production pay secrets + `PUBLIC_PAY_PORTAL_ENABLED=true` on Environment **production**  
3. Redeploy `main`
