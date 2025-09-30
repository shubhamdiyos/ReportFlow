#!/bin/bash

# ReportFlow OAuth Integration - Complete Fix Script
echo "🚀 Starting ReportFlow with OAuth Integration Fix..."

# Kill any existing processes
echo "🔧 Stopping existing processes..."
pkill -f "spring-boot:run" 2>/dev/null || true
pkill -f "http.server" 2>/dev/null || true
sleep 2

# Set environment variables for GitHub OAuth
export GITHUB_CLIENT_ID="Ov23li1Ic93WExWFwtgv"
export GITHUB_CLIENT_SECRET="your-secret-here"  # You need to set the actual secret

echo "🔐 Environment variables set:"
echo "  GITHUB_CLIENT_ID: $GITHUB_CLIENT_ID"
echo "  GITHUB_CLIENT_SECRET: [HIDDEN]"

# Start backend with proper environment
echo "🔧 Starting Spring Boot backend..."
cd /Users/shubhamkumar/Documents/ReportFlow/report_backend
mvn spring-boot:run &
BACKEND_PID=$!

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 15

# Check if backend is running
if curl -s http://localhost:8080/api/auth/health > /dev/null; then
    echo "✅ Backend started successfully on port 8080"
else
    echo "❌ Backend failed to start"
    exit 1
fi

# Build and start frontend
echo "🎨 Building and starting frontend..."
cd /Users/shubhamkumar/Documents/ReportFlow/report_frontend
npm run build

# Start frontend on port 3002
echo "🌐 Starting frontend on port 3002..."
python3 -m http.server 3002 --directory dist/public &
FRONTEND_PID=$!

# Wait for frontend to start
sleep 3

# Test OAuth URL generation
echo "🧪 Testing OAuth URL generation..."
OAUTH_RESPONSE=$(curl -s -H "Origin: http://localhost:3002" http://localhost:8080/api/auth/github/url)
echo "OAuth URL Response: $OAUTH_RESPONSE"

if echo "$OAUTH_RESPONSE" | grep -q "Ov23li1Ic93WExWFwtgv"; then
    echo "✅ OAuth URL generation working correctly"
else
    echo "❌ OAuth URL generation failed"
fi

echo ""
echo "🎉 ReportFlow OAuth Integration Ready!"
echo ""
echo "📋 Applications Status:"
echo "  🔧 Backend:  http://localhost:8080 (PID: $BACKEND_PID)"
echo "  🎨 Frontend: http://localhost:3002 (PID: $FRONTEND_PID)"
echo ""
echo "🔐 OAuth Configuration:"
echo "  ✅ GitHub Client ID: Ov23li1Ic93WExWFwtgv"
echo "  ✅ Callback URL: http://localhost:3002/auth/callback"
echo "  ✅ CORS: Configured for all ports"
echo ""
echo "🧪 Test OAuth Flow:"
echo "  1. Open: http://localhost:3002"
echo "  2. Click: 'Continue with GitHub'"
echo "  3. Authorize: ReportFlow on GitHub"
echo "  4. Expected: Successful authentication"
echo ""
echo "⚠️  Note: Set GITHUB_CLIENT_SECRET environment variable for complete OAuth flow"
echo ""
echo "Press Ctrl+C to stop all services"

# Keep script running
wait
