#!/bin/bash

# 🧪 Comprehensive API Testing - All 19 Endpoints
# Testing every single API endpoint systematically

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Test counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# OAuth credentials
export GITHUB_CLIENT_ID="Ov23li1Ic93WExWFwtgv"
export GITHUB_CLIENT_SECRET="d71011103a15233d9e2a0ce3c75c692b4827163d"

print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
}

print_test() {
    echo -e "\n${CYAN}🧪 Testing: $1${NC}"
    ((TOTAL_TESTS++))
}

print_success() {
    echo -e "${GREEN}✅ PASS: $1${NC}"
    ((PASSED_TESTS++))
}

print_fail() {
    echo -e "${RED}❌ FAIL: $1${NC}"
    ((FAILED_TESTS++))
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# Test function with detailed validation
test_endpoint() {
    local test_name="$1"
    local method="$2"
    local endpoint="$3"
    local data="$4"
    local headers="$5"
    local expected_status="$6"
    local validation_check="$7"
    
    print_test "$test_name"
    
    # Build curl command
    local curl_cmd="curl -s -w '%{http_code}' -X $method"
    
    if [[ -n "$headers" ]]; then
        curl_cmd="$curl_cmd -H '$headers'"
    fi
    
    if [[ -n "$data" ]]; then
        curl_cmd="$curl_cmd -d '$data'"
    fi
    
    curl_cmd="$curl_cmd http://localhost:8080$endpoint"
    
    # Execute request
    local response=$(eval $curl_cmd)
    local status_code="${response: -3}"
    local body="${response%???}"
    
    echo "   Request: $method $endpoint"
    echo "   Status: $status_code (expected: $expected_status)"
    
    if [[ "$status_code" == "$expected_status" ]]; then
        if [[ -n "$validation_check" ]]; then
            if echo "$body" | grep -q "$validation_check"; then
                print_success "$test_name - Status and content valid"
                echo "   Response: ${body:0:100}..."
            else
                print_fail "$test_name - Status OK but content invalid"
                echo "   Response: $body"
            fi
        else
            print_success "$test_name - Status code correct"
            echo "   Response: ${body:0:100}..."
        fi
    else
        print_fail "$test_name - Wrong status code"
        echo "   Response: $body"
    fi
}

print_header "🚀 ReportFlow Complete API Testing Suite"
print_info "Testing all 19 API endpoints systematically..."
print_info "OAuth Client ID: $GITHUB_CLIENT_ID"

# Check if application is running
if ! curl -s http://localhost:8080/api/auth/health > /dev/null 2>&1; then
    echo -e "${RED}❌ Application is not running on port 8080${NC}"
    echo "Please start the application first: mvn spring-boot:run"
    exit 1
fi

print_info "✅ Application is running on port 8080"

# =============================================================================
# PHASE 1: AUTHENTICATION ENDPOINTS (3/3)
# =============================================================================

print_header "🔐 Phase 1: Authentication Endpoints (3/3)"

# Test 1: Health Check
test_endpoint \
    "Health Check" \
    "GET" \
    "/api/auth/health" \
    "" \
    "" \
    "200" \
    "ReportFlow API"

# Test 2: GitHub OAuth URL Generation
test_endpoint \
    "GitHub OAuth URL Generation" \
    "GET" \
    "/api/auth/github/url" \
    "" \
    "" \
    "200" \
    "github.com/login/oauth/authorize"

# Test 3: GitHub OAuth Callback (with mock data - will fail but tests structure)
test_endpoint \
    "GitHub OAuth Callback Structure" \
    "POST" \
    "/api/auth/github/callback" \
    '{"code":"mock_code_for_testing","state":"test_state"}' \
    "Content-Type: application/json" \
    "400" \
    ""

# =============================================================================
# PHASE 2: TEST ENDPOINTS - NO AUTH REQUIRED (5/5)
# =============================================================================

print_header "🧪 Phase 2: Test Endpoints - No Auth Required (5/5)"

# Test 4: User Format
test_endpoint \
    "Test User Format" \
    "GET" \
    "/api/test/user-format" \
    "" \
    "" \
    "200" \
    "test-user-id"

# Test 5: Organization Membership Format
test_endpoint \
    "Test Organization Membership Format" \
    "GET" \
    "/api/test/organization-membership-format" \
    "" \
    "" \
    "200" \
    "org-123"

# Test 6: KPI Format
test_endpoint \
    "Test KPI Format" \
    "GET" \
    "/api/test/kpi-format" \
    "" \
    "" \
    "200" \
    "total_commits"

# Test 7: Chart Format
test_endpoint \
    "Test Chart Format" \
    "GET" \
    "/api/test/chart-format" \
    "" \
    "" \
    "200" \
    "Week 1"

# Test 8: Enum Values
test_endpoint \
    "Test Enum Values" \
    "GET" \
    "/api/test/enum-values" \
    "" \
    "" \
    "200" \
    "DEVELOPER"

# =============================================================================
# PHASE 3: SECURITY TESTING - PROTECTED ENDPOINTS (6/6)
# =============================================================================

print_header "🔒 Phase 3: Security Testing - Protected Endpoints (6/6)"

# Test 9: User Profile (No Auth - Should return 401/403)
test_endpoint \
    "User Profile Security (No Auth)" \
    "GET" \
    "/api/users/test-user-id" \
    "" \
    "" \
    "403" \
    ""

# Test 10: Create User (No Auth - Should return 401/403)
test_endpoint \
    "Create User Security (No Auth)" \
    "POST" \
    "/api/users" \
    '{"username":"testuser","name":"Test User","email":"test@example.com"}' \
    "Content-Type: application/json" \
    "403" \
    ""

# Test 11: User Organizations (No Auth - Should return 401/403)
test_endpoint \
    "User Organizations Security (No Auth)" \
    "GET" \
    "/api/organizations/user/test-user-id" \
    "" \
    "" \
    "403" \
    ""

# Test 12: Switch Organization (No Auth - Should return 401/403)
test_endpoint \
    "Switch Organization Security (No Auth)" \
    "POST" \
    "/api/organizations/test-org-id/switch" \
    "" \
    "" \
    "403" \
    ""

# Test 13: Analytics KPIs (No Auth - Should return 401/403)
test_endpoint \
    "Analytics KPIs Security (No Auth)" \
    "GET" \
    "/api/analytics/kpis?organizationId=test-org&userRole=DEVELOPER" \
    "" \
    "" \
    "403" \
    ""

# Test 14: Repository List (No Auth - Should return 401/403)
test_endpoint \
    "Repository List Security (No Auth)" \
    "GET" \
    "/api/repositories?organizationId=test-org" \
    "" \
    "" \
    "403" \
    ""

# =============================================================================
# PHASE 4: REQUEST VALIDATION TESTING (5/5)
# =============================================================================

print_header "✅ Phase 4: Request Validation Testing (5/5)"

# Test 15: Invalid JSON
test_endpoint \
    "Invalid JSON Handling" \
    "POST" \
    "/api/auth/github/callback" \
    '{"invalid": json}' \
    "Content-Type: application/json" \
    "400" \
    ""

# Test 16: Missing Required Fields
test_endpoint \
    "Missing Required Fields" \
    "POST" \
    "/api/auth/github/callback" \
    '{}' \
    "Content-Type: application/json" \
    "400" \
    ""

# Test 17: Invalid Content Type
test_endpoint \
    "Invalid Content Type" \
    "POST" \
    "/api/auth/github/callback" \
    '{"code":"test"}' \
    "Content-Type: text/plain" \
    "415" \
    ""

# Test 18: Invalid HTTP Method
test_endpoint \
    "Invalid HTTP Method" \
    "PUT" \
    "/api/auth/health" \
    "" \
    "" \
    "405" \
    ""

# Test 19: Non-existent Endpoint
test_endpoint \
    "Non-existent Endpoint" \
    "GET" \
    "/api/nonexistent/endpoint" \
    "" \
    "" \
    "404" \
    ""

# =============================================================================
# RESULTS SUMMARY
# =============================================================================

print_header "📊 Test Results Summary"

echo -e "${BLUE}Total Tests Run: $TOTAL_TESTS${NC}"
echo -e "${GREEN}Tests Passed: $PASSED_TESTS${NC}"
echo -e "${RED}Tests Failed: $FAILED_TESTS${NC}"

if [[ $TOTAL_TESTS -gt 0 ]]; then
    SUCCESS_RATE=$((PASSED_TESTS * 100 / TOTAL_TESTS))
    echo -e "${CYAN}Success Rate: $SUCCESS_RATE%${NC}"
fi

echo ""

if [[ $FAILED_TESTS -eq 0 ]]; then
    print_header "🎉 ALL TESTS PASSED - API READY FOR DEPLOYMENT!"
    
    echo -e "${GREEN}✅ Authentication endpoints working${NC}"
    echo -e "${GREEN}✅ Test endpoints providing correct formats${NC}"
    echo -e "${GREEN}✅ Security properly configured${NC}"
    echo -e "${GREEN}✅ Request validation working${NC}"
    echo -e "${GREEN}✅ Error handling implemented${NC}"
    
    echo ""
    echo -e "${BLUE}🚀 Next Steps:${NC}"
    echo "1. Complete OAuth flow with real GitHub authorization"
    echo "2. Test authenticated endpoints with JWT tokens"
    echo "3. Deploy to production server"
    echo "4. Handover to frontend team"
    
    echo ""
    echo -e "${YELLOW}📋 OAuth Testing Instructions:${NC}"
    OAUTH_URL=$(curl -s http://localhost:8080/api/auth/github/url | grep -o 'https://github.com/login/oauth/authorize[^"]*')
    echo "1. Open: $OAUTH_URL"
    echo "2. Authorize application and copy the 'code' parameter"
    echo "3. Test callback:"
    echo "   curl -X POST http://localhost:8080/api/auth/github/callback \\"
    echo "     -H \"Content-Type: application/json\" \\"
    echo "     -d '{\"code\":\"YOUR_CODE_HERE\"}'"
    
else
    print_header "⚠️  SOME TESTS FAILED - REVIEW REQUIRED"
    
    echo -e "${YELLOW}Please review the failed tests above and fix any issues.${NC}"
    echo ""
    echo -e "${BLUE}Common Issues:${NC}"
    echo "• Application not running on port 8080"
    echo "• Database connection issues"
    echo "• Missing environment variables"
    echo "• Incorrect endpoint implementations"
fi

echo ""
echo -e "${BLUE}Test completed at: $(date)${NC}"

exit $FAILED_TESTS
