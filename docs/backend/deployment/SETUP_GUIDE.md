# 🚀 Production Setup Guide - PostgreSQL & GitHub OAuth

## 📋 **Prerequisites Setup Checklist**

### **1. PostgreSQL Database Setup** 🐘

#### **Step 1: Install PostgreSQL (if not installed)**
```bash
# macOS (using Homebrew)
brew install postgresql
brew services start postgresql

# Verify installation
psql --version
```

#### **Step 2: Create Database and User**
```sql
-- Connect to PostgreSQL as superuser
psql postgres

-- Create database
CREATE DATABASE reportflow;

-- Create user with password
CREATE USER reportflow_user WITH PASSWORD 'reportflow_password';

-- Grant all privileges
GRANT ALL PRIVILEGES ON DATABASE reportflow TO reportflow_user;

-- Grant schema privileges (PostgreSQL 15+)
\c reportflow
GRANT ALL ON SCHEMA public TO reportflow_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO reportflow_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO reportflow_user;

-- Exit psql
\q
```

#### **Step 3: Verify Database Connection**
```bash
# Test connection with our user
psql -h localhost -U reportflow_user -d reportflow

# Should connect successfully
# Exit with \q
```

### **2. GitHub OAuth Application Setup** 🔐

#### **Step 1: Create GitHub OAuth App**
1. Go to GitHub Settings: https://github.com/settings/developers
2. Click "OAuth Apps" → "New OAuth App"
3. Fill in the details:
   ```
   Application name: ReportFlow Development
   Homepage URL: http://localhost:3000
   Application description: GitHub reporting and analytics platform
   Authorization callback URL: http://localhost:8080/api/auth/github/callback
   ```
4. Click "Register application"
5. **Save the Client ID and Client Secret**

#### **Step 2: Configure Environment Variables**
```bash
# Add to your shell profile (~/.zshrc, ~/.bashrc, etc.)
export GITHUB_CLIENT_ID="your_actual_client_id_here"
export GITHUB_CLIENT_SECRET="your_actual_client_secret_here"

# Reload your shell
source ~/.zshrc  # or source ~/.bashrc
```

#### **Step 3: Verify Environment Variables**
```bash
echo $GITHUB_CLIENT_ID
echo $GITHUB_CLIENT_SECRET
# Both should display your actual values
```

### **3. Application Configuration Update** ⚙️

#### **Update application.properties (if needed)**
The application is already configured to use environment variables, but verify:
```properties
# These should already be in your application.properties
spring.datasource.url=jdbc:postgresql://localhost:5432/reportflow
spring.datasource.username=reportflow_user
spring.datasource.password=reportflow_password

spring.security.oauth2.client.registration.github.client-id=${GITHUB_CLIENT_ID:your-github-client-id}
spring.security.oauth2.client.registration.github.client-secret=${GITHUB_CLIENT_SECRET:your-github-client-secret}
```

## 🧪 **Testing Setup Verification**

### **Step 1: Start the Application**
```bash
cd /Users/shubhamkumar/Documents/windsurf1
mvn spring-boot:run
```

### **Step 2: Verify Database Connection**
Check the application logs for:
```
✅ SUCCESS: Started ReportFlowApplication
✅ SUCCESS: Tomcat started on port(s): 8080
✅ SUCCESS: HikariPool-1 - Start completed
```

### **Step 3: Test Basic Endpoints**
```bash
# Health check
curl http://localhost:8080/api/auth/health

# GitHub OAuth URL (should include your client ID)
curl http://localhost:8080/api/auth/github/url

# Test format endpoints
curl http://localhost:8080/api/test/user-format
```

## 🔄 **Complete OAuth Flow Testing**

### **Step 1: Get OAuth URL**
```bash
OAUTH_URL=$(curl -s http://localhost:8080/api/auth/github/url | jq -r '.url')
echo "Open this URL in browser: $OAUTH_URL"
```

### **Step 2: Manual Browser Authorization**
1. Copy the OAuth URL from Step 1
2. Open in browser
3. Authorize the application
4. Copy the `code` parameter from the callback URL
   ```
   Example callback: http://localhost:8080/api/auth/github/callback?code=ABC123XYZ&state=...
   Copy: ABC123XYZ
   ```

### **Step 3: Complete OAuth Flow**
```bash
# Replace YOUR_CODE_HERE with the actual code from GitHub
OAUTH_CODE="YOUR_CODE_HERE"

# Test OAuth callback
RESPONSE=$(curl -s -X POST http://localhost:8080/api/auth/github/callback \
  -H "Content-Type: application/json" \
  -d "{\"code\":\"$OAUTH_CODE\"}")

echo "OAuth Response: $RESPONSE"

# Extract JWT token for further testing
JWT_TOKEN=$(echo $RESPONSE | jq -r '.token')
USER_ID=$(echo $RESPONSE | jq -r '.user.id')

echo "JWT Token: $JWT_TOKEN"
echo "User ID: $USER_ID"
```

### **Step 4: Test Authenticated Endpoints**
```bash
# Test user profile
curl -X GET "http://localhost:8080/api/users/$USER_ID" \
  -H "Authorization: Bearer $JWT_TOKEN"

# Test user organizations
curl -X GET "http://localhost:8080/api/organizations/user/$USER_ID" \
  -H "Authorization: Bearer $JWT_TOKEN"
```

## 🚨 **Troubleshooting Common Issues**

### **PostgreSQL Connection Issues**
```bash
# Check if PostgreSQL is running
brew services list | grep postgresql

# Start PostgreSQL if not running
brew services start postgresql

# Check connection
psql -h localhost -U reportflow_user -d reportflow -c "SELECT version();"
```

### **GitHub OAuth Issues**
```bash
# Verify environment variables are set
env | grep GITHUB

# Check if OAuth URL contains your client ID
curl -s http://localhost:8080/api/auth/github/url | jq '.url'
```

### **Application Startup Issues**
```bash
# Check for port conflicts
lsof -i :8080

# Kill any process using port 8080
kill -9 $(lsof -t -i:8080)

# Clean and restart
mvn clean spring-boot:run
```

## ✅ **Setup Verification Checklist**

### **Database Setup**
- [ ] PostgreSQL installed and running
- [ ] `reportflow` database created
- [ ] `reportflow_user` created with correct password
- [ ] Database connection successful
- [ ] Application connects to database without errors

### **GitHub OAuth Setup**
- [ ] GitHub OAuth app created
- [ ] Client ID and Client Secret obtained
- [ ] Environment variables set correctly
- [ ] OAuth URL generation working
- [ ] Callback URL configured correctly

### **Application Setup**
- [ ] Application starts without errors
- [ ] Health check responds (200 OK)
- [ ] Test endpoints working
- [ ] OAuth flow completes successfully
- [ ] JWT tokens generated correctly
- [ ] Authenticated endpoints accessible

## 🎯 **Next Steps After Setup**

1. **Run Complete Test Suite**
   ```bash
   ./test_api.sh
   ```

2. **Test Frontend Integration**
   - Update frontend API base URL to `http://localhost:8080/api`
   - Test authentication flow
   - Verify all API endpoints

3. **Production Deployment**
   - Update OAuth callback URL for production domain
   - Configure production database
   - Set production environment variables
   - Enable HTTPS/SSL

---

**📅 Setup Guide Created**: 2025-09-29T21:19:29+05:30
**🎯 Status**: Ready for database and OAuth configuration
**🔄 Next Action**: Follow the steps above to complete setup
