# Repository Sync Debugging Guide

## Current Status
- ✅ Backend deployed to production: https://reportflow-c6lz.onrender.com/api
- ✅ Frontend running locally: http://localhost:5173
- ⚠️ Repositories not showing in onboarding flow

## Debug Steps

### Step 1: Check Browser Console Logs
1. Open your browser at http://localhost:5173
2. Open Developer Tools (F12 or Cmd+Option+I)
3. Go to the Console tab
4. Navigate to the repositories page in onboarding
5. Look for these log messages:
   - "Syncing repositories from GitHub for user: [username]"
   - "User has GitHub token: true/false"
   - "Sync result: {...}"
   - "Total repositories synced: X"

### Step 2: Check Network Tab
1. In Developer Tools, go to the Network tab
2. Filter by "Fetch/XHR"
3. Look for these API calls:
   - `/api/repositories/sync/all` - Should return 200 OK
   - `/api/organizations/user/{userId}` - Should return organizations list
   - `/api/repositories?organizationId={id}` - Should return repositories

### Step 3: Check Authentication
1. In Console, type: `localStorage.getItem('jwt_token')`
2. Should return a JWT token string
3. In Console, type: `localStorage.getItem('user')`
4. Should return user object with `githubAccessToken` field

### Step 4: Test Backend Directly
Open a new terminal and run:

```bash
# Get your JWT token from browser console
TOKEN="your-jwt-token-here"

# Test health endpoint
curl https://reportflow-c6lz.onrender.com/api/auth/health

# Test user profile (replace TOKEN)
curl -H "Authorization: Bearer $TOKEN" \
     https://reportflow-c6lz.onrender.com/api/users/me

# Test organization sync
curl -X POST \
     -H "Authorization: Bearer $TOKEN" \
     https://reportflow-c6lz.onrender.com/api/organizations/sync

# Test repository sync
curl -X POST \
     -H "Authorization: Bearer $TOKEN" \
     https://reportflow-c6lz.onrender.com/api/repositories/sync/all
```

## Common Issues and Solutions

### Issue 1: "No GitHub access token"
**Symptoms:** Console shows "User has GitHub token: false"
**Solution:** User needs to re-authenticate via GitHub OAuth
1. Log out
2. Log in again via GitHub
3. Ensure GitHub authorization is granted

### Issue 2: "No organizations found"
**Symptoms:** Sync returns 0 organizations
**Solution:** Sync organizations first
1. Click "Start Setup" on welcome page
2. This triggers `/api/organizations/sync`
3. Then navigate to repositories page

### Issue 3: "CORS Error"
**Symptoms:** Network tab shows CORS policy error
**Solution:** Check CORS configuration in backend
- Backend should allow http://localhost:5173

### Issue 4: "401 Unauthorized"
**Symptoms:** API calls return 401
**Solution:** JWT token expired or invalid
1. Log out and log in again
2. Check token in localStorage

### Issue 5: "Empty repository list"
**Symptoms:** Sync succeeds but no repositories shown
**Solution:** Check organization membership
1. Verify user belongs to organizations
2. Check organization IDs match
3. Verify `@PreAuthorize` checks pass

## What to Report

If issues persist, please provide:
1. **Console logs** - All messages from repositories page
2. **Network requests** - Status codes and responses
3. **User object** - From localStorage (remove sensitive data)
4. **Error messages** - Any red errors in console
5. **Backend logs** - If you have access to Render logs

## Quick Fix: Manual Sync

On the repositories page, click the **"Sync from GitHub"** button in the header. This will:
1. Trigger a fresh sync from GitHub API
2. Fetch organizations and repositories
3. Display any errors in the UI
4. Show detailed logs in console
