#!/bin/bash

# Quick OAuth Test Script
echo "🔐 Setting up GitHub OAuth credentials..."

# Your provided secret key
GITHUB_CLIENT_SECRET="d71011103a15233d9e2a0ce3c75c692b4827163d"

# Need Client ID from user
echo "Please provide your GitHub Client ID:"
read -p "Client ID: " GITHUB_CLIENT_ID

# Export environment variables
export GITHUB_CLIENT_ID="$GITHUB_CLIENT_ID"
export GITHUB_CLIENT_SECRET="$GITHUB_CLIENT_SECRET"

echo "✅ Credentials set!"
echo "Client ID: $GITHUB_CLIENT_ID"
echo "Secret: ${GITHUB_CLIENT_SECRET:0:8}..."

# Test OAuth URL generation
echo -e "\n🧪 Testing OAuth URL generation..."
OAUTH_URL=$(curl -s http://localhost:8080/api/auth/github/url | grep -o 'https://github.com/login/oauth/authorize[^"]*')

if [[ -n "$OAUTH_URL" ]]; then
    echo "✅ OAuth URL generated successfully!"
    echo "URL: $OAUTH_URL"
    echo -e "\n📋 Next steps:"
    echo "1. Open the URL above in your browser"
    echo "2. Authorize the application"
    echo "3. Copy the 'code' parameter from callback URL"
    echo "4. Test the callback endpoint"
else
    echo "❌ OAuth URL generation failed"
fi
