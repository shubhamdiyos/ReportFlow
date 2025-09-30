#!/bin/bash

# ReportFlow Full-Stack Application Startup Script
# This script starts both backend and frontend applications

echo "🚀 Starting ReportFlow Full-Stack Application..."

# Kill any existing processes on the required ports
echo "🔧 Cleaning up existing processes..."
lsof -ti:8080 | xargs kill -9 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
sleep 2

# Set GitHub OAuth credentials
export GITHUB_CLIENT_ID="Ov23li1Ic93WExWFwtgv"
export GITHUB_CLIENT_SECRET="a28ba6aa983a3e9b4f2f92abdc370a25418b021e"

echo "✅ GitHub OAuth configured"
echo "   Client ID: $GITHUB_CLIENT_ID"
echo "   Client Secret: ${GITHUB_CLIENT_SECRET:0:8}..."

# Start Backend (Spring Boot)
echo "🔧 Starting Spring Boot Backend on port 8080..."
cd report_backend
mvn spring-boot:run &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "⏳ Waiting for backend to initialize..."
sleep 15

# Check if backend is running
if curl -s http://localhost:8080/api/auth/health > /dev/null; then
    echo "✅ Backend started successfully"
    echo "   URL: http://localhost:8080"
    echo "   Health: $(curl -s http://localhost:8080/api/auth/health)"
else
    echo "❌ Backend failed to start"
    exit 1
fi

# Build Frontend and copy to Spring Boot static resources
echo "🎨 Building React Frontend..."
cd report_frontend
npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Frontend build successful"
else
    echo "❌ Frontend build failed"
    exit 1
fi

# Copy frontend build to Spring Boot static resources
echo "📁 Copying frontend to Spring Boot static resources..."
rm -rf ../report_backend/src/main/resources/static/*
cp -r dist/public/* ../report_backend/src/main/resources/static/
echo "✅ Frontend integrated with Spring Boot"
cd ..

# Test Integration
echo "🧪 Testing Full-Stack Integration..."

# Test Frontend Serving
FRONTEND_TEST=$(curl -s http://localhost:8080/ | head -1)
if echo "$FRONTEND_TEST" | grep -q "<!DOCTYPE html>"; then
    echo "✅ Frontend serving working"
else
    echo "❌ Frontend serving failed"
fi

# Test OAuth Callback Route
CALLBACK_TEST=$(curl -s http://localhost:8080/auth/callback | head -1)
if echo "$CALLBACK_TEST" | grep -q "<!DOCTYPE html>"; then
    echo "✅ OAuth callback route working"
else
    echo "❌ OAuth callback route failed"
fi

# Test OAuth URL
OAUTH_TEST=$(curl -s http://localhost:8080/api/auth/github/url)
if echo "$OAUTH_TEST" | grep -q "localhost:8080"; then
    echo "✅ OAuth callback URL configured correctly"
else
    echo "❌ OAuth callback URL misconfigured"
fi

echo ""
echo "🎉 ReportFlow Java Full-Stack Application Ready!"
echo ""
echo "📋 Application Status:"
echo "  🔧 Backend API:  http://localhost:8080/api (PID: $BACKEND_PID)"
echo "  🎨 Frontend App: http://localhost:8080 (Served by Spring Boot)"
echo ""
echo "🏗️ Pure Java Architecture:"
echo "  ✅ Spring Boot serves both API and React frontend"
echo "  ✅ No Python or Node.js servers needed"
echo "  ✅ Single port (8080) for entire application"
echo ""
echo "🔐 OAuth Configuration:"
echo "  ✅ GitHub Client ID: Ov23li1Ic93WExWFwtgv"
echo "  ✅ Callback URL: http://localhost:8080/auth/callback"
echo "  ✅ Client-side routing handled by Spring Boot"
echo ""
echo "🧪 Test the Application:"
echo "  1. Open: http://localhost:8080"
echo "  2. Navigate to Login page"
echo "  3. Click: 'Continue with GitHub'"
echo "  4. Complete OAuth flow"
echo ""
echo "⚠️  Important: Update GitHub OAuth app callback URL to:"
echo "   http://localhost:8080/auth/callback"
echo ""
echo "Press Ctrl+C to stop all services"

# Keep script running and monitor Spring Boot process
while true; do
    if ! kill -0 $BACKEND_PID 2>/dev/null; then
        echo "❌ Spring Boot process died"
        break
    fi
    sleep 10
done

echo "🛑 Application stopped"
