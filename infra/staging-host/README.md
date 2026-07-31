# Staging host + CI

See **[docs/STAGING.md](../../docs/STAGING.md)** for the full GitHub Actions guide (what you set by hand vs what workflows deploy).

## Manual CloudFormation (optional)

If you prefer the CLI over Actions:

```bash
cd ~/projects/defy/infra/staging-host
export AWS_DEFAULT_REGION=us-east-1

aws cloudformation deploy \
  --template-file template.yaml \
  --stack-name defy-staging-host \
  --parameter-overrides ProjectName=defy-staging
```

Outputs and SSM `/defy/staging/*` are equivalent to the **Deploy staging infra** workflow.
