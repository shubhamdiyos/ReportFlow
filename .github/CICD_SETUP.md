# CI/CD Setup Guide

This document explains the automated workflows set up for the ReportFlow project.

## 🚀 Workflows Overview

### 1. **CI - Continuous Integration** (`ci.yml`)
- **Triggers:** Pull requests and pushes to `main` or `develop` branches
- **Jobs:**
  - **Build and Type Check:** Validates TypeScript types and builds the project
  - **Lint Check:** Checks for package vulnerabilities and ensures package-lock.json is up-to-date
- **Purpose:** Ensures code quality before merging

### 2. **CD - Deploy to Netlify** (`deploy.yml`)
- **Triggers:** Pushes to `main` branch (also manual via workflow_dispatch)
- **Jobs:**
  - Builds the production app
  - Deploys to Netlify production
- **Purpose:** Automatic deployment when code is merged to main

### 3. **PR Check - Preview Deployment** (`pr-check.yml`)
- **Triggers:** Pull requests opened/updated targeting `main`
- **Jobs:**
  - Type checks and builds
  - Creates preview deployment on Netlify
  - Comments on PR with preview URL
- **Purpose:** Preview changes before merging

## 🔐 Required GitHub Secrets

To enable automated Netlify deployments, add these secrets to your GitHub repository:

### Setting up secrets:
1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add the following secrets:

| Secret Name | Description | How to Get |
|------------|-------------|------------|
| `NETLIFY_AUTH_TOKEN` | Your Netlify personal access token | 1. Go to [Netlify](https://app.netlify.com)<br>2. User Settings → Applications → Personal access tokens<br>3. Click "New access token"<br>4. Copy the token |
| `NETLIFY_SITE_ID` | Your Netlify site ID | 1. Go to your Netlify site<br>2. Site settings → General → Site details<br>3. Copy "Site ID" (or "API ID") |

### Getting Netlify Credentials:

#### Netlify Auth Token:
```bash
# Via Netlify CLI (if authenticated)
npx netlify-cli status
# Or create manually in Netlify UI
```

#### Netlify Site ID:
```bash
# Via Netlify CLI
npx netlify-cli sites:list
# Or find in Netlify dashboard: Site settings → General
```

## ✅ What Gets Checked

### On Every Pull Request:
- ✅ TypeScript type checking (`npm run check`)
- ✅ Project builds successfully (`npm run build`)
- ✅ Package security audit
- ✅ package-lock.json consistency
- ✅ Preview deployment created

### On Merge to Main:
- ✅ Production build
- ✅ Automatic deployment to Netlify
- ✅ Deployment status notification

## 🎯 Best Practices

1. **Never merge if CI fails** - All checks must pass
2. **Review preview deployments** - Check the preview URL before merging PRs
3. **Keep dependencies updated** - Monitor security audit warnings
4. **Test locally first** - Run `npm run build` and `npm run check` before pushing

## 🔧 Local Testing

Before pushing, run these commands locally:

```bash
cd report_frontend

# Install dependencies
npm install

# Type check
npm run check

# Build
npm run build

# Verify build output
ls -la dist/public
```

## 📝 Workflow Triggers Summary

| Workflow | Trigger | Branch | Purpose |
|----------|---------|--------|---------|
| CI | PR + Push | main, develop | Quality checks |
| Deploy | Push | main | Production deployment |
| PR Check | PR opened/updated | → main | Preview deployment |

## 🐛 Troubleshooting

### Build fails in CI but works locally
- Ensure `package-lock.json` is committed
- Check Node.js version matches (20.x)
- Verify environment variables aren't missing

### Deployment fails
- Verify Netlify secrets are set correctly
- Check Netlify site ID is correct
- Ensure `netlify.toml` configuration is correct

### Type check fails
- Run `npm run check` locally
- Fix TypeScript errors before pushing
- Ensure all types are properly defined

## 🎉 Success Indicators

When everything works:
- ✅ Green checkmarks on all PR checks
- ✅ Preview deployment URL in PR comments
- ✅ Automatic production deployment after merge
- ✅ No manual deployment needed

## 🔄 Manual Deployment Override

If you need to manually trigger deployment:
1. Go to **Actions** tab in GitHub
2. Select **CD - Deploy to Netlify** workflow
3. Click **Run workflow**
4. Select `main` branch
5. Click **Run workflow** button
