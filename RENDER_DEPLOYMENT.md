# 🚀 Deploy ReportFlow Backend to Render

## Prerequisites
- GitHub account with ReportFlow repository
- Render account (free tier available)
- GitHub OAuth App configured

---

## Step 1: Prepare GitHub OAuth App

1. Go to: https://github.com/settings/developers
2. Click on your `report_flow` OAuth App
3. Update the **Authorization callback URL** to:
   ```
   https://reportflow-backend.onrender.com/api/auth/github/callback
   ```
   (Replace `reportflow-backend` with your actual Render service name)
4. Keep your Client ID and Secret ready

---

## Step 2: Deploy to Render

### Option A: Using Render Dashboard (Recommended)

1. **Go to Render Dashboard**: https://dashboard.render.com/
2. **Click "New +" → "Web Service"**
3. **Connect GitHub Repository**:
   - Select your `ReportFlow` repository
   - Click "Connect"

4. **Configure Service**:
   - **Name**: `reportflow-backend`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `report_backend`
   - **Runtime**: `Java`
   - **Build Command**:
     ```bash
     mvn clean package -DskipTests
     ```
   - **Start Command**:
     ```bash
     java -jar target/reportflow-backend-1.0.0.jar
     ```

5. **Set Environment Variables**:
   Click "Advanced" → "Add Environment Variable":
   
   ```
   GITHUB_CLIENT_ID=Ov23li1Ic93WExWFwtgv
   GITHUB_CLIENT_SECRET=f1127d9dcc600ee089b4bd9be8d95ae8928b9960
   SPRING_PROFILES_ACTIVE=prod
   ```

6. **Create PostgreSQL Database**:
   - Click "New +" → "PostgreSQL"
   - Name: `reportflow-db`
   - Plan: Free
   - Click "Create Database"
   - Copy the **Internal Database URL**

7. **Add Database URL to Web Service**:
   - Go back to your web service
   - Add environment variable:
     ```
     DATABASE_URL=<paste-internal-database-url>
     ```

8. **Deploy**:
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)

---

### Option B: Using render.yaml (Infrastructure as Code)

1. The `render.yaml` file is already in the repository
2. Go to Render Dashboard → "New +" → "Blueprint"
3. Connect your GitHub repository
4. Render will automatically detect `render.yaml`
5. Set the environment variables manually in the dashboard
6. Click "Apply"

---

## Step 3: Verify Deployment

1. **Check Health Endpoint**:
   ```bash
   curl https://reportflow-backend.onrender.com/api/auth/health
   ```
   Should return:
   ```json
   {"status":"ok","service":"ReportFlow API"}
   ```

2. **Test OAuth URL Generation**:
   ```bash
   curl https://reportflow-backend.onrender.com/api/auth/github/url
   ```

3. **Check Logs**:
   - Go to Render Dashboard → Your Service → "Logs"
   - Verify no errors

---

## Step 4: Update Frontend Configuration

Once backend is deployed, update your frontend to use the production API:

1. **Update Frontend API Config**:
   In `report_frontend/client/src/lib/config.ts`:
   ```typescript
   export const API_CONFIG = {
     BASE_URL: 'https://reportflow-backend.onrender.com',
     // ... rest of config
   };
   ```

2. **Update GitHub OAuth Callback**:
   - Update your GitHub OAuth app callback URL
   - Update CORS in backend to allow your frontend domain

---

## Step 5: Test OAuth Flow

1. Visit your deployed backend URL
2. Test the OAuth flow:
   ```
   https://reportflow-backend.onrender.com/api/auth/github/url
   ```
3. Complete GitHub authorization
4. Verify successful authentication

---

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `GITHUB_CLIENT_ID` | GitHub OAuth App Client ID | `Ov23li1Ic93WExWFwtgv` |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth App Client Secret | `f1127d9dcc600ee089b4bd9be8d95ae8928b9960` |
| `DATABASE_URL` | PostgreSQL connection string | Provided by Render |
| `SPRING_PROFILES_ACTIVE` | Spring profile to use | `prod` |
| `FRONTEND_URL` | Frontend URL for CORS | `https://your-frontend.com` |
| `PORT` | Server port | `8080` (auto-set by Render) |

---

## Troubleshooting

### Build Fails
- Check Maven build logs in Render dashboard
- Verify Java version (should be 17+)
- Ensure `pom.xml` is correct

### Database Connection Fails
- Verify `DATABASE_URL` is set correctly
- Check database is in same region as web service
- Use Internal Database URL (not External)

### OAuth Not Working
- Verify GitHub OAuth callback URL matches Render URL
- Check `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`
- Ensure CORS is configured for your frontend domain

### Application Crashes
- Check logs in Render dashboard
- Verify all environment variables are set
- Check memory usage (free tier has limits)

---

## Free Tier Limitations

Render Free Tier includes:
- ✅ 750 hours/month of runtime
- ✅ Automatic HTTPS
- ✅ Auto-deploy from GitHub
- ⚠️ Spins down after 15 minutes of inactivity
- ⚠️ 512MB RAM limit
- ⚠️ Shared CPU

**Note**: First request after spin-down may take 30-60 seconds.

---

## Next Steps

After successful deployment:

1. **Deploy Frontend**: Deploy React frontend to Vercel/Netlify
2. **Update OAuth URLs**: Update all URLs to production domains
3. **Configure CORS**: Update CORS to allow your frontend domain
4. **Monitor**: Set up monitoring and alerts
5. **Custom Domain**: Add custom domain (optional)

---

## Useful Commands

```bash
# Check backend health
curl https://reportflow-backend.onrender.com/api/auth/health

# Test OAuth URL
curl https://reportflow-backend.onrender.com/api/auth/github/url

# View logs
# Go to Render Dashboard → Service → Logs

# Trigger manual deploy
# Go to Render Dashboard → Service → Manual Deploy
```

---

## Support

- **Render Docs**: https://render.com/docs
- **GitHub Issues**: https://github.com/imshubhy/ReportFlow/issues
- **Progress Documentation**: See `report_backend/PROGRESS.md`

---

**Your ReportFlow backend is now ready for production deployment on Render! 🎉**
