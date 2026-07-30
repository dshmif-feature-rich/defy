# DEFY staging host (S3 + CloudFront)

Dedicated HTTPS host for **office testing** of the payment portal against **PayPal sandbox**.

Production (`www.defyprs.com` on GitHub Pages) stays separate and should use live PayPal only when you go live.

## One-time setup

### 1. Deploy this stack

```bash
cd ~/projects/defy/infra/staging-host
export AWS_DEFAULT_REGION=us-east-1

aws cloudformation deploy \
  --template-file template.yaml \
  --stack-name defy-staging-host \
  --parameter-overrides ProjectName=defy-staging

aws cloudformation describe-stacks \
  --stack-name defy-staging-host \
  --query "Stacks[0].Outputs" \
  --output table
```

Copy:

| Output | Use |
|--------|-----|
| `StagingSiteUrl` | Office bookmark + GitHub variable `STAGING_SITE_URL` |
| `StagingBucketName` | GitHub secret / variable `STAGING_S3_BUCKET` |
| `StagingDistributionId` | GitHub secret / variable `STAGING_CLOUDFRONT_DISTRIBUTION_ID` |

### 2. Deploy sandbox pay-api

In `~/projects/defy-pay-api`, deploy with sandbox PayPal credentials. Include the staging origin in CORS:

```text
CorsAllowOrigins=http://localhost:4321,https://www.defyprs.com,https://defyprs.com,https://dXXXX.cloudfront.net
```

(Use the real `StagingSiteUrl` host.)

### 3. GitHub Environment `staging`

Repo → **Settings → Environments → New environment → `staging`**

**Variables** (or secrets — either works; vars are fine for non-secret IDs):

| Name | Value |
|------|--------|
| `STAGING_SITE_URL` | `https://dXXXX.cloudfront.net` (no trailing slash) |
| `STAGING_S3_BUCKET` | stack output `StagingBucketName` |
| `STAGING_CLOUDFRONT_DISTRIBUTION_ID` | stack output `StagingDistributionId` |
| `AWS_REGION` | `us-east-1` |

**Secrets:**

| Name | Value |
|------|--------|
| `PUBLIC_PAY_API_BASE` | Sandbox pay-api CloudFront URL |
| `PUBLIC_PAY_API_KEY` | Sandbox `PayApiKey` |
| `AWS_ACCESS_KEY_ID` | IAM user/role key with s3:PutObject + cloudfront:CreateInvalidation |
| `AWS_SECRET_ACCESS_KEY` | Matching secret |

Minimal IAM policy sketch:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:DeleteObject", "s3:ListBucket", "s3:GetObject"],
      "Resource": [
        "arn:aws:s3:::BUCKET_NAME",
        "arn:aws:s3:::BUCKET_NAME/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": ["cloudfront:CreateInvalidation"],
      "Resource": "arn:aws:cloudfront::ACCOUNT:distribution/DISTRIBUTION_ID"
    }
  ]
}
```

### 4. Deploy the site to staging

```bash
git checkout -b staging
git push -u origin staging
```

Or **Actions → Deploy staging → Run workflow**.

Office opens **StagingSiteUrl** (yellow **STAGING** banner at top). Use PayPal **sandbox** invoice numbers and buyer accounts.

## Optional: `staging.defyprs.com`

1. Request ACM cert in `us-east-1` for `staging.defyprs.com`
2. Add cert + alias to the CloudFront distribution (update template or console)
3. DNS CNAME `staging` → CloudFront domain
4. Set `STAGING_SITE_URL=https://staging.defyprs.com` and redeploy the site workflow
