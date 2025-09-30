# 🧪 Manual API Testing Guide - ReportFlow

## 🚀 **Quick Test Commands**

### **Prerequisites**
```bash
# 1. Start the backend
mvn spring-boot:run

# 2. Verify backend is running
curl http://localhost:8080/api/auth/health
```

---

## 🔍 **Basic API Tests (No Authentication Required)**

### **1. Health Check**
```bash
curl -X GET http://localhost:8080/api/auth/health
```
**Expected Response:**
```json
{
  "status": "ok",
  "service": "ReportFlow API"
}
```

### **2. GitHub OAuth URL Generation**
```bash
curl -X GET http://localhost:8080/api/auth/github/url
```
**Expected Response:**
```json
{
  "url": "https://github.com/login/oauth/authorize?client_id=xxx&redirect_uri=xxx&scope=read:user,user:email,read:org,repo"
}
```

### **3. Test Response Formats**
```bash
# User format
curl -X GET http://localhost:8080/api/test/user-format

# Organization format
curl -X GET http://localhost:8080/api/test/organization-membership-format

# KPI format
curl -X GET http://localhost:8080/api/test/kpi-format

# Chart format
curl -X GET http://localhost:8080/api/test/chart-format

# Enum values
curl -X GET http://localhost:8080/api/test/enum-values
```

---

## 🔐 **Authentication Flow Testing**

### **Step 1: Get GitHub OAuth URL**
```bash
OAUTH_URL=$(curl -s http://localhost:8080/api/auth/github/url | jq -r '.url')
echo "OAuth URL: $OAUTH_URL"
```

### **Step 2: Manual OAuth (Browser)**
1. Copy the OAuth URL from Step 1
2. Open in browser and authorize the application
3. Copy the `code` parameter from the callback URL

### **Step 3: Test OAuth Callback**
```bash
# Replace 'YOUR_OAUTH_CODE' with the actual code from GitHub
curl -X POST http://localhost:8080/api/auth/github/callback \
  -H "Content-Type: application/json" \
  -d '{"code":"YOUR_OAUTH_CODE"}'
```

### **Step 4: Save JWT Token**
```bash
# Save the token from the response
JWT_TOKEN="eyJhbGciOiJIUzI1NiJ9..."  # Replace with actual token
USER_ID="user-123"  # Replace with actual user ID from response
```

---

## 🔒 **Protected Endpoints Testing**

### **User Management**
```bash
# Get user profile
curl -X GET http://localhost:8080/api/users/$USER_ID \
  -H "Authorization: Bearer $JWT_TOKEN"

# Create user (Admin only)
curl -X POST http://localhost:8080/api/users \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "name": "Test User",
    "email": "test@example.com"
  }'
```

### **Organization Management**
```bash
# Get user organizations
curl -X GET http://localhost:8080/api/organizations/user/$USER_ID \
  -H "Authorization: Bearer $JWT_TOKEN"

# Switch organization context
ORGANIZATION_ID="org-123"  # Replace with actual org ID
curl -X POST http://localhost:8080/api/organizations/$ORGANIZATION_ID/switch \
  -H "Authorization: Bearer $JWT_TOKEN"

# Get organization details
curl -X GET http://localhost:8080/api/organizations/$ORGANIZATION_ID \
  -H "Authorization: Bearer $JWT_TOKEN"
```

### **Analytics Endpoints**
```bash
# Get KPI metrics
curl -X GET "http://localhost:8080/api/analytics/kpis?organizationId=$ORGANIZATION_ID&userRole=DEVELOPER" \
  -H "Authorization: Bearer $JWT_TOKEN"

# Get chart data
curl -X GET "http://localhost:8080/api/analytics/charts/commits?organizationId=$ORGANIZATION_ID&dateRange=last30days" \
  -H "Authorization: Bearer $JWT_TOKEN"
```

### **Repository Management**
```bash
# List repositories
curl -X GET "http://localhost:8080/api/repositories?organizationId=$ORGANIZATION_ID" \
  -H "Authorization: Bearer $JWT_TOKEN"

# Add repository
curl -X POST http://localhost:8080/api/repositories \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "test-repo",
    "githubUrl": "https://github.com/username/test-repo",
    "organizationId": "'$ORGANIZATION_ID'",
    "description": "Test repository"
  }'

# Sync repository (replace REPO_ID with actual repository ID)
REPO_ID="repo-123"
curl -X POST http://localhost:8080/api/repositories/$REPO_ID/sync \
  -H "Authorization: Bearer $JWT_TOKEN"

# Toggle repository
curl -X PATCH http://localhost:8080/api/repositories/$REPO_ID/toggle \
  -H "Authorization: Bearer $JWT_TOKEN"
```

---

## 🚨 **Security Testing**

### **Test Without Authentication (Should Return 401)**
```bash
# These should all return 401 Unauthorized
curl -X GET http://localhost:8080/api/users/test-user-id
curl -X GET http://localhost:8080/api/organizations/user/test-user-id
curl -X GET "http://localhost:8080/api/analytics/kpis?organizationId=test-org&userRole=DEVELOPER"
```

### **Test with Invalid JWT (Should Return 401)**
```bash
INVALID_JWT="invalid.jwt.token"
curl -X GET http://localhost:8080/api/users/test-user-id \
  -H "Authorization: Bearer $INVALID_JWT"
```

### **Test CORS Headers**
```bash
curl -I -X OPTIONS \
  -H "Origin: http://localhost:5000" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Authorization" \
  http://localhost:8080/api/auth/health
```

---

## 🔧 **Error Testing**

### **Test Invalid JSON**
```bash
curl -X POST http://localhost:8080/api/auth/github/callback \
  -H "Content-Type: application/json" \
  -d '{"invalid": json}'
```

### **Test Missing Required Fields**
```bash
curl -X POST http://localhost:8080/api/auth/github/callback \
  -H "Content-Type: application/json" \
  -d '{}'
```

### **Test Invalid Parameters**
```bash
curl -X GET "http://localhost:8080/api/analytics/kpis?organizationId=&userRole=INVALID_ROLE" \
  -H "Authorization: Bearer $JWT_TOKEN"
```

---

## 📊 **Expected Response Codes**

| Endpoint | Method | Auth Required | Success Code | Error Codes |
|----------|--------|---------------|--------------|-------------|
| `/auth/health` | GET | No | 200 | - |
| `/auth/github/url` | GET | No | 200 | - |
| `/auth/github/callback` | POST | No | 200 | 400, 401 |
| `/users/{id}` | GET | Yes | 200 | 401, 403, 404 |
| `/users` | POST | Yes (Admin) | 200 | 400, 401, 403 |
| `/organizations/user/{id}` | GET | Yes | 200 | 401, 403 |
| `/analytics/kpis` | GET | Yes | 200 | 400, 401, 403 |
| `/repositories` | GET | Yes | 200 | 401, 403 |
| `/test/*` | GET | No | 200 | - |

---

## 🎯 **Automated Testing Script**

Run the comprehensive test suite:
```bash
# Make script executable (if not already)
chmod +x test_api.sh

# Run all tests
./test_api.sh
```

---

## ✅ **Testing Checklist**

### **Basic Functionality**
- [ ] Backend starts without errors
- [ ] Health check returns 200
- [ ] GitHub OAuth URL generation works
- [ ] Test endpoints return proper formats
- [ ] CORS headers are present

### **Authentication & Security**
- [ ] Protected endpoints return 401 without auth
- [ ] Invalid JWT tokens are rejected
- [ ] OAuth callback endpoint structure is correct
- [ ] Request validation works properly

### **API Structure**
- [ ] All endpoints follow REST conventions
- [ ] Response formats match frontend expectations
- [ ] Error responses include proper status codes
- [ ] JSON serialization works correctly

### **Database Integration**
- [ ] Database connection is established
- [ ] JPA entities are properly configured
- [ ] Hibernate DDL updates work

---

## 🚀 **Production Readiness Checklist**

### **Before Deployment**
- [ ] All tests pass locally
- [ ] GitHub OAuth credentials are configured
- [ ] Database is set up and accessible
- [ ] Environment variables are set
- [ ] CORS is configured for production domains
- [ ] JWT secret is changed from default
- [ ] Logging levels are appropriate for production

### **Post-Deployment Verification**
- [ ] Health check responds on production URL
- [ ] GitHub OAuth flow works end-to-end
- [ ] Frontend can authenticate users
- [ ] Analytics data is accessible
- [ ] Repository management functions work

**Status: Ready for Production Testing** ✅
