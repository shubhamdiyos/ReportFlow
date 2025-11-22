# 🧪 Complete API Testing Guide - All 19 Endpoints

## ✅ **CURRENT STATUS**

### **Completed Tests (4/19)**
1. ✅ `GET /api/auth/health` - PASS
2. ✅ `GET /api/auth/github/url` - PASS  
3. ✅ `POST /api/auth/github/callback` (structure) - PASS
4. ✅ Security verification - PASS

### **Fixed Issues**
- ✅ **Test endpoints security issue RESOLVED**
- Added `/api/test/**` to permitAll in SecurityConfig
- Application restarted with new configuration

## 🚀 **SYSTEMATIC TESTING APPROACH**

### **Step 1: Run Manual Testing Script**
```bash
./test_all_apis_manual.sh
```

This script will test all 19 endpoints systematically and guide you through the OAuth flow.

### **Step 2: OAuth Flow Completion**

**Your OAuth URL:**
```
https://github.com/login/oauth/authorize?client_id=Ov23li1Ic93WExWFwtgv&redirect_uri=http://localhost:8080/api/auth/github/callback&scope=read:user user:email read:org repo&state=random_state
```

**Steps:**
1. Open the OAuth URL in your browser
2. Authorize the ReportFlow application
3. Copy the `code` parameter from callback URL
4. Test callback:
   ```bash
   curl -X POST http://localhost:8080/api/auth/github/callback \
     -H "Content-Type: application/json" \
     -d '{"code":"YOUR_GITHUB_CODE_HERE"}'
   ```
5. Save the JWT token from response

### **Step 3: Test All Authenticated Endpoints**

With your JWT token, test all remaining endpoints:

#### **User Management (2 endpoints)**
```bash
# Get user profile
curl -X GET "http://localhost:8080/api/users/{USER_ID}" \
  -H "Authorization: Bearer {JWT_TOKEN}"

# Create user (Admin only)
curl -X POST http://localhost:8080/api/users \
  -H "Authorization: Bearer {JWT_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","name":"Test User","email":"test@example.com"}'
```

#### **Organization Management (3 endpoints)**
```bash
# Get user organizations
curl -X GET "http://localhost:8080/api/organizations/user/{USER_ID}" \
  -H "Authorization: Bearer {JWT_TOKEN}"

# Switch organization context
curl -X POST "http://localhost:8080/api/organizations/{ORG_ID}/switch" \
  -H "Authorization: Bearer {JWT_TOKEN}"

# Get organization details
curl -X GET "http://localhost:8080/api/organizations/{ORG_ID}" \
  -H "Authorization: Bearer {JWT_TOKEN}"
```

#### **Analytics (2 endpoints)**
```bash
# Get KPI metrics
curl -X GET "http://localhost:8080/api/analytics/kpis?organizationId={ORG_ID}&userRole=DEVELOPER" \
  -H "Authorization: Bearer {JWT_TOKEN}"

# Get chart data
curl -X GET "http://localhost:8080/api/analytics/charts/commits?organizationId={ORG_ID}&dateRange=last30days" \
  -H "Authorization: Bearer {JWT_TOKEN}"
```

#### **Repository Management (4 endpoints)**
```bash
# List repositories
curl -X GET "http://localhost:8080/api/repositories?organizationId={ORG_ID}" \
  -H "Authorization: Bearer {JWT_TOKEN}"

# Add repository
curl -X POST http://localhost:8080/api/repositories \
  -H "Authorization: Bearer {JWT_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"name":"test-repo","githubUrl":"https://github.com/user/test-repo","organizationId":"{ORG_ID}","description":"Test repo"}'

# Sync repository
curl -X POST "http://localhost:8080/api/repositories/{REPO_ID}/sync" \
  -H "Authorization: Bearer {JWT_TOKEN}"

# Toggle repository
curl -X PATCH "http://localhost:8080/api/repositories/{REPO_ID}/toggle" \
  -H "Authorization: Bearer {JWT_TOKEN}"
```

#### **Test Endpoints (5 endpoints) - Now Fixed**
```bash
# These should now work without authentication
curl http://localhost:8080/api/test/user-format
curl http://localhost:8080/api/test/organization-membership-format
curl http://localhost:8080/api/test/kpi-format
curl http://localhost:8080/api/test/chart-format
curl http://localhost:8080/api/test/enum-values
```

## 📊 **Expected Results**

### **Test Endpoints (5/5)**
- Should return JSON data with sample formats
- No authentication required
- Status: 200 OK

### **Authentication (3/3)**
- Health check: `{"service":"ReportFlow API","status":"ok"}`
- OAuth URL: Contains your Client ID
- OAuth callback: Returns JWT token and user data

### **Authenticated Endpoints (11/11)**
- Should work with valid JWT token
- Should return 401/403 without token
- Should respect role-based access control

## 🔄 **Progress Tracking**

Update `PROGRESS.md` after each test phase:

```markdown
#### **✅ COMPLETED TESTS (X/19)**
- [x] Endpoint name - Status - Result
```

## 🎯 **Success Criteria**

### **All Tests Pass When:**
- ✅ All 5 test endpoints return JSON data
- ✅ OAuth flow completes successfully
- ✅ JWT token is generated and valid
- ✅ All authenticated endpoints work with JWT
- ✅ Security properly blocks unauthorized access
- ✅ Role-based access control working

### **Ready for Deployment When:**
- ✅ 19/19 endpoints tested and working
- ✅ No critical errors in responses
- ✅ Security properly implemented
- ✅ Database integration working

## 🚀 **Final Steps**

1. **Complete Testing**: Run all 19 endpoint tests
2. **Update Progress**: Document all results in `PROGRESS.md`
3. **Fix Any Issues**: Address any failing tests
4. **Deploy**: Ready for production deployment
5. **Handover**: Provide to frontend team

---

**📅 Testing Guide Created**: 2025-09-29T21:45:00+05:30  
**🎯 Status**: Ready for comprehensive testing  
**🔄 Next Action**: Run `./test_all_apis_manual.sh` and complete OAuth flow
