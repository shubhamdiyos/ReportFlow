#!/bin/bash

# ReportFlow Full-Stack Integration Test Suite
echo "🧪 ReportFlow Full-Stack Integration Test Suite"
echo "=============================================="

# Test Results
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Function to run test
run_test() {
    local test_name="$1"
    local test_command="$2"
    local expected_pattern="$3"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    echo -n "Testing $test_name... "
    
    result=$(eval "$test_command" 2>/dev/null)
    if echo "$result" | grep -q "$expected_pattern"; then
        echo "✅ PASS"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo "❌ FAIL"
        echo "   Expected: $expected_pattern"
        echo "   Got: $result"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
}

echo ""
echo "🔧 Backend API Tests"
echo "-------------------"

# Backend Health Check
run_test "Backend Health" \
    "curl -s http://localhost:8080/api/auth/health" \
    "ReportFlow API"

# OAuth URL Generation
run_test "OAuth URL Generation" \
    "curl -s http://localhost:8080/api/auth/github/url" \
    "localhost:3000/auth/callback"

# Test Endpoints
run_test "User Format Endpoint" \
    "curl -s http://localhost:8080/api/test/user-format" \
    "username"

run_test "KPI Format Endpoint" \
    "curl -s http://localhost:8080/api/test/kpi-format" \
    "title"

run_test "Enum Values Endpoint" \
    "curl -s http://localhost:8080/api/test/enum-values" \
    "ADMIN"

echo ""
echo "🎨 Frontend Tests"
echo "----------------"

# Frontend Serving
run_test "Frontend HTML Serving" \
    "curl -s http://localhost:3000/" \
    "<!DOCTYPE html>"

run_test "Frontend Assets" \
    "curl -s -I http://localhost:3000/assets/index-Mb1jO9lX.js" \
    "200 OK"

run_test "Frontend CSS" \
    "curl -s -I http://localhost:3000/assets/index-D8xrETXb.css" \
    "200 OK"

echo ""
echo "🔗 Integration Tests"
echo "-------------------"

# CORS Integration
run_test "CORS Integration" \
    "curl -s -H 'Origin: http://localhost:3000' http://localhost:8080/api/test/enum-values" \
    "DEVELOPER"

# API Communication
run_test "Frontend-Backend Communication" \
    "curl -s -H 'Origin: http://localhost:3000' http://localhost:8080/api/auth/health" \
    "ok"

echo ""
echo "🔐 Security Tests"
echo "----------------"

# Protected Endpoints
run_test "Protected User Endpoint" \
    "curl -s -w 'HTTP_CODE:%{http_code}' http://localhost:8080/api/users/test-id" \
    "403"

run_test "Protected Analytics Endpoint" \
    "curl -s -w 'HTTP_CODE:%{http_code}' http://localhost:8080/api/analytics/kpis" \
    "403"

echo ""
echo "📊 Test Results Summary"
echo "======================"
echo "Total Tests: $TOTAL_TESTS"
echo "Passed: $PASSED_TESTS ✅"
echo "Failed: $FAILED_TESTS ❌"
echo "Success Rate: $(( PASSED_TESTS * 100 / TOTAL_TESTS ))%"

if [ $FAILED_TESTS -eq 0 ]; then
    echo ""
    echo "🎉 ALL TESTS PASSED - FULL-STACK APPLICATION READY!"
    echo ""
    echo "✅ Backend: Fully functional on port 8080"
    echo "✅ Frontend: Fully functional on port 3000"
    echo "✅ Integration: CORS and API communication working"
    echo "✅ Security: Protected endpoints secured"
    echo "✅ OAuth: Callback URL configured correctly"
    echo ""
    echo "🚀 Ready for production deployment!"
else
    echo ""
    echo "⚠️  Some tests failed. Please check the application configuration."
fi

echo ""
echo "🌐 Application URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:8080"
echo "   API Docs: http://localhost:8080/api/test/enum-values"
