#!/bin/bash

# Complete API Test with Real OAuth Credentials
echo "🚀 ReportFlow Complete API Testing"
echo "=================================="

# Set OAuth credentials
export GITHUB_CLIENT_ID="Ov23li1Ic93WExWFwtgv"
export GITHUB_CLIENT_SECRET="d71011103a15233d9e2a0ce3c75c692b4827163d"

echo "✅ OAuth credentials configured"
echo "Client ID: $GITHUB_CLIENT_ID"
echo "Secret: ${GITHUB_CLIENT_SECRET:0:8}..."

echo -e "\n🧪 Testing API Endpoints..."

# Test 1: Health Check
echo -e "\n1. Health Check:"
curl -s http://localhost:8080/api/auth/health | jq .

# Test 2: GitHub OAuth URL
echo -e "\n2. GitHub OAuth URL:"
OAUTH_RESPONSE=$(curl -s http://localhost:8080/api/auth/github/url)
echo $OAUTH_RESPONSE | jq .
OAUTH_URL=$(echo $OAUTH_RESPONSE | jq -r '.url')

# Test 3: Test Endpoints (No Auth Required)
echo -e "\n3. Test Endpoints:"

echo "   - User Format:"
curl -s http://localhost:8080/api/test/user-format | jq . || echo "   Response received"

echo "   - Organization Format:"
curl -s http://localhost:8080/api/test/organization-membership-format | jq . || echo "   Response received"

echo "   - KPI Format:"
curl -s http://localhost:8080/api/test/kpi-format | jq . || echo "   Response received"

echo "   - Chart Format:"
curl -s http://localhost:8080/api/test/chart-format | jq . || echo "   Response received"

echo "   - Enum Values:"
curl -s http://localhost:8080/api/test/enum-values | jq . || echo "   Response received"

# Test 4: Protected Endpoints (Should return 401)
echo -e "\n4. Security Test (Should return 401):"
echo "   - User Profile (no auth):"
curl -s -w "Status: %{http_code}\n" http://localhost:8080/api/users/test-id -o /dev/null

echo "   - Organizations (no auth):"
curl -s -w "Status: %{http_code}\n" http://localhost:8080/api/organizations/user/test-id -o /dev/null

# Test 5: OAuth Flow Instructions
echo -e "\n5. OAuth Flow Testing:"
echo "   OAuth URL for manual testing:"
echo "   $OAUTH_URL"
echo ""
echo "   📋 To complete OAuth testing:"
echo "   1. Open the URL above in your browser"
echo "   2. Authorize the ReportFlow application"
echo "   3. Copy the 'code' parameter from the callback URL"
echo "   4. Run this command with your code:"
echo ""
echo "   curl -X POST http://localhost:8080/api/auth/github/callback \\"
echo "     -H \"Content-Type: application/json\" \\"
echo "     -d '{\"code\":\"YOUR_CODE_HERE\"}'"

echo -e "\n✅ Basic API testing completed!"
echo "🔐 OAuth flow ready for manual testing"
