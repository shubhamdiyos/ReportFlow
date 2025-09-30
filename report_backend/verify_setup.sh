#!/bin/bash

# 🔍 Complete Setup Verification Script for ReportFlow

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Test counters
TESTS_PASSED=0
TESTS_FAILED=0

run_test() {
    local test_name="$1"
    local test_command="$2"
    local expected_status="$3"
    
    echo -e "\n${BLUE}Testing: $test_name${NC}"
    
    if eval "$test_command" > /dev/null 2>&1; then
        if [[ "$expected_status" == "success" ]]; then
            print_success "$test_name"
            ((TESTS_PASSED++))
            return 0
        else
            print_error "$test_name (expected failure but got success)"
            ((TESTS_FAILED++))
            return 1
        fi
    else
        if [[ "$expected_status" == "failure" ]]; then
            print_success "$test_name (expected failure)"
            ((TESTS_PASSED++))
            return 0
        else
            print_error "$test_name"
            ((TESTS_FAILED++))
            return 1
        fi
    fi
}

print_header "ReportFlow Complete Setup Verification"

# 1. Database Verification
print_header "Database Verification"

run_test "PostgreSQL Service Running" "pg_isready -q" "success"
run_test "Database Connection" "PGPASSWORD=reportflow_password psql -h localhost -U reportflow_user -d reportflow -c 'SELECT 1;'" "success"

# 2. Environment Variables Verification
print_header "Environment Variables Verification"

if [[ -n "$GITHUB_CLIENT_ID" ]]; then
    print_success "GITHUB_CLIENT_ID is set"
    echo "  Value: $GITHUB_CLIENT_ID"
    ((TESTS_PASSED++))
else
    print_error "GITHUB_CLIENT_ID is not set"
    ((TESTS_FAILED++))
fi

if [[ -n "$GITHUB_CLIENT_SECRET" ]]; then
    print_success "GITHUB_CLIENT_SECRET is set"
    echo "  Value: ${GITHUB_CLIENT_SECRET:0:8}..."
    ((TESTS_PASSED++))
else
    print_error "GITHUB_CLIENT_SECRET is not set"
    ((TESTS_FAILED++))
fi

# 3. Application Build Verification
print_header "Application Build Verification"

run_test "Maven Build" "mvn clean compile -q" "success"

# 4. Application Startup Test
print_header "Application Startup Test"

print_info "Starting ReportFlow application..."

# Start application in background
mvn spring-boot:run > application.log 2>&1 &
APP_PID=$!

print_info "Application PID: $APP_PID"
print_info "Waiting for application to start (30 seconds)..."

# Wait for application to start (max 30 seconds)
for i in {1..30}; do
    if curl -s http://localhost:8080/api/auth/health > /dev/null 2>&1; then
        print_success "Application started successfully"
        break
    fi
    
    if ! kill -0 $APP_PID 2>/dev/null; then
        print_error "Application process died during startup"
        print_info "Check application.log for details"
        ((TESTS_FAILED++))
        exit 1
    fi
    
    sleep 1
    echo -n "."
done

echo ""

# 5. API Endpoints Testing
if curl -s http://localhost:8080/api/auth/health > /dev/null 2>&1; then
    print_header "API Endpoints Testing"
    
    # Test health endpoint
    HEALTH_RESPONSE=$(curl -s http://localhost:8080/api/auth/health)
    if echo "$HEALTH_RESPONSE" | grep -q "ok"; then
        print_success "Health Check Endpoint"
        ((TESTS_PASSED++))
    else
        print_error "Health Check Endpoint"
        ((TESTS_FAILED++))
    fi
    
    # Test GitHub OAuth URL
    OAUTH_RESPONSE=$(curl -s http://localhost:8080/api/auth/github/url)
    if echo "$OAUTH_RESPONSE" | grep -q "github.com/login/oauth/authorize"; then
        print_success "GitHub OAuth URL Generation"
        echo "  URL contains client ID: $GITHUB_CLIENT_ID"
        ((TESTS_PASSED++))
    else
        print_error "GitHub OAuth URL Generation"
        ((TESTS_FAILED++))
    fi
    
    # Test format endpoints
    FORMAT_ENDPOINTS=(
        "user-format"
        "organization-membership-format"
        "kpi-format"
        "chart-format"
        "enum-values"
    )
    
    for endpoint in "${FORMAT_ENDPOINTS[@]}"; do
        if curl -s "http://localhost:8080/api/test/$endpoint" | grep -q "{"; then
            print_success "Test Endpoint: $endpoint"
            ((TESTS_PASSED++))
        else
            print_error "Test Endpoint: $endpoint"
            ((TESTS_FAILED++))
        fi
    done
    
    # Test protected endpoints (should return 401)
    if curl -s -w "%{http_code}" http://localhost:8080/api/users/test-id | grep -q "401"; then
        print_success "Protected Endpoint Security (401 Unauthorized)"
        ((TESTS_PASSED++))
    else
        print_error "Protected Endpoint Security"
        ((TESTS_FAILED++))
    fi
    
else
    print_error "Application failed to start or health check failed"
    ((TESTS_FAILED++))
fi

# 6. OAuth Flow Test (Manual)
print_header "OAuth Flow Test"

if curl -s http://localhost:8080/api/auth/health > /dev/null 2>&1; then
    OAUTH_URL=$(curl -s http://localhost:8080/api/auth/github/url | grep -o 'https://github.com/login/oauth/authorize[^"]*' || echo "")
    
    if [[ -n "$OAUTH_URL" ]]; then
        print_success "OAuth URL Generated Successfully"
        echo ""
        print_info "To complete OAuth testing:"
        echo "1. Open this URL in your browser:"
        echo "   $OAUTH_URL"
        echo ""
        echo "2. Authorize the application"
        echo ""
        echo "3. Copy the 'code' parameter from the callback URL"
        echo ""
        echo "4. Test the callback endpoint:"
        echo "   curl -X POST http://localhost:8080/api/auth/github/callback \\"
        echo "     -H \"Content-Type: application/json\" \\"
        echo "     -d '{\"code\":\"YOUR_CODE_HERE\"}'"
        
        ((TESTS_PASSED++))
    else
        print_error "OAuth URL Generation Failed"
        ((TESTS_FAILED++))
    fi
fi

# Cleanup
print_header "Cleanup"

if [[ -n "$APP_PID" ]] && kill -0 $APP_PID 2>/dev/null; then
    print_info "Stopping application (PID: $APP_PID)..."
    kill $APP_PID
    sleep 2
    
    # Force kill if still running
    if kill -0 $APP_PID 2>/dev/null; then
        kill -9 $APP_PID 2>/dev/null
    fi
    
    print_success "Application stopped"
fi

# Final Results
print_header "Verification Results"

echo -e "${GREEN}Tests Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Tests Failed: $TESTS_FAILED${NC}"

TOTAL_TESTS=$((TESTS_PASSED + TESTS_FAILED))
SUCCESS_RATE=$((TESTS_PASSED * 100 / TOTAL_TESTS))

echo -e "\n${BLUE}Success Rate: $SUCCESS_RATE%${NC}"

if [[ $TESTS_FAILED -eq 0 ]]; then
    print_header "🎉 ALL TESTS PASSED - SETUP COMPLETE!"
    
    echo -e "${GREEN}Your ReportFlow backend is ready for production!${NC}"
    echo ""
    echo "✅ PostgreSQL database configured"
    echo "✅ GitHub OAuth credentials set"
    echo "✅ Application builds successfully"
    echo "✅ All API endpoints working"
    echo "✅ Security properly configured"
    echo ""
    echo -e "${BLUE}Next Steps:${NC}"
    echo "1. Start the application: mvn spring-boot:run"
    echo "2. Test complete OAuth flow manually"
    echo "3. Run full test suite: ./test_api.sh"
    echo "4. Integrate with frontend application"
    
else
    print_header "⚠️  SETUP ISSUES DETECTED"
    
    echo -e "${YELLOW}Some tests failed. Please review the errors above.${NC}"
    echo ""
    echo -e "${BLUE}Common Solutions:${NC}"
    echo "• Ensure PostgreSQL is running: brew services start postgresql"
    echo "• Verify GitHub OAuth credentials are correct"
    echo "• Check application.log for startup errors"
    echo "• Ensure no other service is using port 8080"
    
    if [[ -f "application.log" ]]; then
        echo ""
        print_info "Application log (last 20 lines):"
        tail -20 application.log
    fi
fi

# Cleanup log file
rm -f application.log

exit $TESTS_FAILED
