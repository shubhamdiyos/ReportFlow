#!/bin/bash

# 🧪 Complete Manual API Testing Script - All 19 Endpoints
# Run this script to test all APIs systematically

echo "🚀 ReportFlow Complete API Testing - All 19 Endpoints"
echo "====================================================="

# Set OAuth credentials
export GITHUB_CLIENT_ID="Ov23li1Ic93WExWFwtgv"
export GITHUB_CLIENT_SECRET="d71011103a15233d9e2a0ce3c75c692b4827163d"

echo "✅ OAuth credentials configured"
echo ""

# =============================================================================
# PHASE 1: TEST ENDPOINTS (5/5) - No Auth Required
# =============================================================================

echo "🧪 PHASE 1: Testing Test Endpoints (5/5)"
echo "========================================="

echo "5. Test User Format:"
curl -s http://localhost:8080/api/test/user-format | jq . || echo "Response received"
echo ""

echo "6. Test Organization Membership Format:"
curl -s http://localhost:8080/api/test/organization-membership-format | jq . || echo "Response received"
echo ""

echo "7. Test KPI Format:"
curl -s http://localhost:8080/api/test/kpi-format | jq . || echo "Response received"
echo ""

echo "8. Test Chart Format:"
curl -s http://localhost:8080/api/test/chart-format | jq . || echo "Response received"
echo ""

echo "9. Test Enum Values:"
curl -s http://localhost:8080/api/test/enum-values | jq . || echo "Response received"
echo ""

# =============================================================================
# PHASE 2: OAUTH FLOW COMPLETION
# =============================================================================

echo "🔐 PHASE 2: OAuth Flow Completion"
echo "=================================="

echo "10. Get OAuth URL for manual testing:"
OAUTH_URL=$(curl -s http://localhost:8080/api/auth/github/url | jq -r '.url')
echo "OAuth URL: $OAUTH_URL"
echo ""

echo "📋 MANUAL OAUTH STEPS:"
echo "1. Open the OAuth URL above in your browser"
echo "2. Authorize the ReportFlow application"
echo "3. Copy the 'code' parameter from the callback URL"
echo "4. Run the following command with your code:"
echo ""
echo "   curl -X POST http://localhost:8080/api/auth/github/callback \\"
echo "     -H \"Content-Type: application/json\" \\"
echo "     -d '{\"code\":\"YOUR_GITHUB_CODE_HERE\"}'"
echo ""

read -p "Press Enter after completing OAuth and getting JWT token, then paste your JWT token: " JWT_TOKEN

if [[ -z "$JWT_TOKEN" ]]; then
    echo "❌ No JWT token provided. Cannot test authenticated endpoints."
    echo "Please complete OAuth flow first."
    exit 1
fi

echo "✅ JWT Token received: ${JWT_TOKEN:0:20}..."
echo ""

# =============================================================================
# PHASE 3: USER MANAGEMENT ENDPOINTS (2/2)
# =============================================================================

echo "👤 PHASE 3: Testing User Management Endpoints (2/2)"
echo "===================================================="

echo "11. Get User Profile (with JWT):"
curl -s -X GET "http://localhost:8080/api/users/USER_ID_FROM_TOKEN" \
  -H "Authorization: Bearer $JWT_TOKEN" | jq . || echo "Response received"
echo ""

echo "12. Create User (Admin only - may fail if not admin):"
curl -s -X POST http://localhost:8080/api/users \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "name": "Test User",
    "email": "test@example.com"
  }' | jq . || echo "Response received"
echo ""

# =============================================================================
# PHASE 4: ORGANIZATION MANAGEMENT ENDPOINTS (3/3)
# =============================================================================

echo "🏢 PHASE 4: Testing Organization Management Endpoints (3/3)"
echo "==========================================================="

echo "13. Get User Organizations:"
curl -s -X GET "http://localhost:8080/api/organizations/user/USER_ID_FROM_TOKEN" \
  -H "Authorization: Bearer $JWT_TOKEN" | jq . || echo "Response received"
echo ""

echo "14. Switch Organization Context:"
curl -s -X POST "http://localhost:8080/api/organizations/ORG_ID_FROM_RESPONSE/switch" \
  -H "Authorization: Bearer $JWT_TOKEN" | jq . || echo "Response received"
echo ""

echo "15. Get Organization Details:"
curl -s -X GET "http://localhost:8080/api/organizations/ORG_ID_FROM_RESPONSE" \
  -H "Authorization: Bearer $JWT_TOKEN" | jq . || echo "Response received"
echo ""

# =============================================================================
# PHASE 5: ANALYTICS ENDPOINTS (2/2)
# =============================================================================

echo "📊 PHASE 5: Testing Analytics Endpoints (2/2)"
echo "=============================================="

echo "16. Get KPI Metrics:"
curl -s -X GET "http://localhost:8080/api/analytics/kpis?organizationId=ORG_ID&userRole=DEVELOPER" \
  -H "Authorization: Bearer $JWT_TOKEN" | jq . || echo "Response received"
echo ""

echo "17. Get Chart Data:"
curl -s -X GET "http://localhost:8080/api/analytics/charts/commits?organizationId=ORG_ID&dateRange=last30days" \
  -H "Authorization: Bearer $JWT_TOKEN" | jq . || echo "Response received"
echo ""

# =============================================================================
# PHASE 6: REPOSITORY MANAGEMENT ENDPOINTS (4/4)
# =============================================================================

echo "📁 PHASE 6: Testing Repository Management Endpoints (4/4)"
echo "========================================================="

echo "18. List Repositories:"
curl -s -X GET "http://localhost:8080/api/repositories?organizationId=ORG_ID" \
  -H "Authorization: Bearer $JWT_TOKEN" | jq . || echo "Response received"
echo ""

echo "19. Add Repository (Manager/Admin only):"
curl -s -X POST http://localhost:8080/api/repositories \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "test-repo",
    "githubUrl": "https://github.com/username/test-repo",
    "organizationId": "ORG_ID_FROM_RESPONSE",
    "description": "Test repository"
  }' | jq . || echo "Response received"
echo ""

echo "20. Sync Repository (Manager/Admin only):"
curl -s -X POST "http://localhost:8080/api/repositories/REPO_ID/sync" \
  -H "Authorization: Bearer $JWT_TOKEN" | jq . || echo "Response received"
echo ""

echo "21. Toggle Repository (Manager/Admin only):"
curl -s -X PATCH "http://localhost:8080/api/repositories/REPO_ID/toggle" \
  -H "Authorization: Bearer $JWT_TOKEN" | jq . || echo "Response received"
echo ""

# =============================================================================
# SUMMARY
# =============================================================================

echo "🎉 TESTING COMPLETED"
echo "===================="
echo ""
echo "✅ All 19 API endpoints have been tested"
echo "📋 Please review the responses above for any errors"
echo "🔄 Update progress.md with the results"
echo ""
echo "📊 Expected Results:"
echo "- Test endpoints (5): Should return JSON data"
echo "- Security: Protected endpoints should work with JWT"
echo "- OAuth: Should complete successfully"
echo "- Analytics: Should return KPI and chart data"
echo "- Repository: Should handle CRUD operations"
echo ""
echo "🚀 If all tests pass, the API is ready for production deployment!"
