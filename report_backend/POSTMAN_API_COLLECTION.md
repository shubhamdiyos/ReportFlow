# 🚀 ReportFlow API Flow & Postman Collection

## 📋 **API Flow Overview**

```
1. Health Check → 2. GitHub OAuth → 3. User Management → 4. Organization Management → 5. Repository Management → 6. Analytics
```

## 🔄 **Complete API Flow**

### **Phase 1: System Health & Authentication**
1. **Health Check** → Get GitHub OAuth URL → Handle OAuth Callback → Get JWT Token

### **Phase 2: User & Organization Management**
2. **User Profile** → Get Organizations → Switch Organization Context

### **Phase 3: Repository & Analytics**
3. **Repository Management** → Sync Data → View Analytics

---

## 📝 **Postman Collection - ReportFlow API**

### **Environment Variables**
```json
{
  "baseUrl": "http://localhost:8080/api",
  "jwtToken": "{{jwt_token_from_auth}}",
  "userId": "{{user_id_from_auth}}",
  "organizationId": "{{org_id_from_response}}"
}
```

---

## 🔐 **1. AUTHENTICATION FLOW**

### **1.1 Health Check**
```http
GET {{baseUrl}}/auth/health
```
**Headers:** None required
**Expected Response:**
```json
{
  "status": "ok",
  "service": "ReportFlow API"
}
```

### **1.2 Get GitHub OAuth URL**
```http
GET {{baseUrl}}/auth/github/url
```
**Headers:** None required
**Expected Response:**
```json
{
  "url": "https://github.com/login/oauth/authorize?client_id=xxx&redirect_uri=xxx&scope=read:user,user:email,read:org,repo"
}
```

### **1.3 GitHub OAuth Callback** ⭐
```http
POST {{baseUrl}}/auth/github/callback
Content-Type: application/json

{
  "code": "github_oauth_code_here",
  "state": "optional_state"
}
```
**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": "user-123",
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "avatar": "https://github.com/johndoe.png",
    "role": "DEVELOPER",
    "githubId": "github123",
    "isOnboarded": true,
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "message": "Authentication successful"
}
```

**📝 Save to Environment:**
- `jwtToken` = response.token
- `userId` = response.user.id

---

## 👤 **2. USER MANAGEMENT**

### **2.1 Get User Profile**
```http
GET {{baseUrl}}/users/{{userId}}
Authorization: Bearer {{jwtToken}}
```
**Expected Response:**
```json
{
  "id": "user-123",
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "avatar": "https://github.com/johndoe.png",
  "role": "DEVELOPER",
  "githubId": "github123",
  "isOnboarded": true,
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### **2.2 Create User (Admin Only)**
```http
POST {{baseUrl}}/users
Authorization: Bearer {{jwtToken}}
Content-Type: application/json

{
  "username": "newuser",
  "name": "New User",
  "email": "newuser@example.com"
}
```

---

## 🏢 **3. ORGANIZATION MANAGEMENT**

### **3.1 Get User Organizations** ⭐
```http
GET {{baseUrl}}/organizations/user/{{userId}}
Authorization: Bearer {{jwtToken}}
```
**Expected Response:**
```json
[
  {
    "id": "org-123",
    "name": "Test Organization",
    "domain": "testorg.com",
    "logo": "https://example.com/logo.png",
    "type": "ORGANIZATION",
    "role": "DEVELOPER",
    "joinedAt": "2024-01-15T10:30:00Z",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

**📝 Save to Environment:**
- `organizationId` = response[0].id

### **3.2 Switch Organization Context**
```http
POST {{baseUrl}}/organizations/{{organizationId}}/switch
Authorization: Bearer {{jwtToken}}
```
**Expected Response:**
```json
{
  "organizationId": "org-123",
  "organizationName": "Test Organization",
  "message": "Tenant switched successfully"
}
```

### **3.3 Get Organization Details**
```http
GET {{baseUrl}}/organizations/{{organizationId}}
Authorization: Bearer {{jwtToken}}
```

---

## 📊 **4. ANALYTICS ENDPOINTS**

### **4.1 Get KPI Metrics** ⭐
```http
GET {{baseUrl}}/analytics/kpis?organizationId={{organizationId}}&userRole=DEVELOPER
Authorization: Bearer {{jwtToken}}
```
**Expected Response:**
```json
[
  {
    "id": "total_commits",
    "title": "Total Commits",
    "value": 1250,
    "change": "+12%",
    "changeType": "positive",
    "icon": "git-commit",
    "color": "#10b981"
  },
  {
    "id": "total_developers",
    "title": "Active Developers",
    "value": 8,
    "change": "+3",
    "changeType": "positive",
    "icon": "users",
    "color": "#3b82f6"
  }
]
```

### **4.2 Get Chart Data** ⭐
```http
GET {{baseUrl}}/analytics/charts/commits?organizationId={{organizationId}}&dateRange=last30days
Authorization: Bearer {{jwtToken}}
```
**Expected Response:**
```json
[
  {
    "name": "Week 1",
    "value": 45,
    "trend": "up",
    "color": "#10b981"
  },
  {
    "name": "Week 2",
    "value": 52,
    "trend": "up",
    "color": "#10b981"
  }
]
```

**Chart Types Available:**
- `commits` - Commit activity over time
- `prs` - Pull request statistics
- `velocity` - Team velocity metrics

---

## 📁 **5. REPOSITORY MANAGEMENT**

### **5.1 List Repositories**
```http
GET {{baseUrl}}/repositories?organizationId={{organizationId}}&status=SUCCESS&search=react
Authorization: Bearer {{jwtToken}}
```

**Query Parameters:**
- `organizationId` (required)
- `status` (optional): SUCCESS, FAILED, PENDING
- `search` (optional): Search term

### **5.2 Add Repository**
```http
POST {{baseUrl}}/repositories
Authorization: Bearer {{jwtToken}}
Content-Type: application/json

{
  "name": "my-awesome-repo",
  "githubUrl": "https://github.com/username/my-awesome-repo",
  "organizationId": "{{organizationId}}",
  "description": "An awesome repository"
}
```

### **5.3 Sync Repository**
```http
POST {{baseUrl}}/repositories/repo-123/sync
Authorization: Bearer {{jwtToken}}
```
**Expected Response:**
```json
{
  "repositoryId": "repo-123",
  "status": "SUCCESS",
  "message": "Repository synced successfully",
  "syncTime": "2024-01-15T10:30:00Z"
}
```

### **5.4 Toggle Repository**
```http
PATCH {{baseUrl}}/repositories/repo-123/toggle
Authorization: Bearer {{jwtToken}}
```

---

## 🧪 **6. TEST ENDPOINTS (Development Only)**

### **6.1 Test User Format**
```http
GET {{baseUrl}}/test/user-format
```

### **6.2 Test Organization Format**
```http
GET {{baseUrl}}/test/organization-membership-format
```

### **6.3 Test KPI Format**
```http
GET {{baseUrl}}/test/kpi-format
```

### **6.4 Test Chart Format**
```http
GET {{baseUrl}}/test/chart-format
```

### **6.5 Test Enum Values**
```http
GET {{baseUrl}}/test/enum-values
```

---

## 🔄 **Complete Testing Flow**

### **Step-by-Step Testing Sequence:**

1. **Start Backend**
   ```bash
   mvn spring-boot:run
   ```

2. **Test Health Check**
   ```http
   GET http://localhost:8080/api/auth/health
   ```

3. **Get GitHub OAuth URL**
   ```http
   GET http://localhost:8080/api/auth/github/url
   ```

4. **Manual OAuth Flow**
   - Copy the GitHub URL from step 3
   - Open in browser and authorize
   - Get the `code` parameter from callback URL
   - Use it in the callback endpoint

5. **Test Authentication**
   ```http
   POST http://localhost:8080/api/auth/github/callback
   {
     "code": "your_oauth_code_here"
   }
   ```

6. **Save JWT Token** from response and use in subsequent requests

7. **Test User Profile**
   ```http
   GET http://localhost:8080/api/users/{userId}
   Authorization: Bearer {your_jwt_token}
   ```

8. **Test Organizations**
   ```http
   GET http://localhost:8080/api/organizations/user/{userId}
   Authorization: Bearer {your_jwt_token}
   ```

9. **Test Analytics**
   ```http
   GET http://localhost:8080/api/analytics/kpis?organizationId={orgId}&userRole=DEVELOPER
   Authorization: Bearer {your_jwt_token}
   ```

---

## 🚨 **Common Error Responses**

### **401 Unauthorized**
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "status": 401,
  "error": "Unauthorized",
  "message": "JWT token expired",
  "path": "/api/users/123"
}
```

### **403 Forbidden**
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "status": 403,
  "error": "Forbidden",
  "message": "Access denied",
  "path": "/api/users"
}
```

### **400 Bad Request**
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "path": "/api/repositories"
}
```

---

## 📋 **Postman Environment Setup**

Create a new Postman environment with these variables:

```json
{
  "baseUrl": "http://localhost:8080/api",
  "jwtToken": "",
  "userId": "",
  "organizationId": "",
  "repositoryId": ""
}
```

## 🎯 **Testing Priorities**

1. **Authentication Flow** (Critical)
2. **User Management** (High)
3. **Organization Context** (High)
4. **Analytics Endpoints** (Medium)
5. **Repository Management** (Medium)

## 🔧 **Setup Requirements**

1. **Backend Running**: `mvn spring-boot:run`
2. **Database**: PostgreSQL running with ReportFlow database
3. **GitHub OAuth**: Valid CLIENT_ID and CLIENT_SECRET
4. **Environment Variables**: Set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET

**Status: Ready for API Testing** ✅
