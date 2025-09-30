#!/bin/bash

# 🔐 GitHub OAuth Setup Script for ReportFlow

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

print_step() {
    echo -e "\n${BLUE}Step $1:${NC} $2"
}

print_header "GitHub OAuth Setup for ReportFlow"

print_info "This script will guide you through setting up GitHub OAuth credentials."

print_step "1" "Create GitHub OAuth Application"
echo "1. Open your browser and go to: https://github.com/settings/developers"
echo "2. Click 'OAuth Apps' → 'New OAuth App'"
echo "3. Fill in the application details:"
echo ""
echo "   Application name: ReportFlow Development"
echo "   Homepage URL: http://localhost:3000"
echo "   Application description: GitHub reporting and analytics platform"
echo "   Authorization callback URL: http://localhost:8080/api/auth/github/callback"
echo ""
echo "4. Click 'Register application'"
echo "5. Copy the Client ID and Client Secret"

echo ""
read -p "Press Enter when you have created the OAuth app and have the credentials..."

print_step "2" "Enter OAuth Credentials"

# Get Client ID
while true; do
    echo ""
    read -p "Enter your GitHub Client ID: " GITHUB_CLIENT_ID
    if [[ -n "$GITHUB_CLIENT_ID" ]]; then
        break
    else
        print_error "Client ID cannot be empty. Please enter a valid Client ID."
    fi
done

# Get Client Secret
while true; do
    echo ""
    read -s -p "Enter your GitHub Client Secret (hidden): " GITHUB_CLIENT_SECRET
    echo ""
    if [[ -n "$GITHUB_CLIENT_SECRET" ]]; then
        break
    else
        print_error "Client Secret cannot be empty. Please enter a valid Client Secret."
    fi
done

print_step "3" "Configure Environment Variables"

# Determine shell configuration file
SHELL_CONFIG=""
if [[ "$SHELL" == *"zsh"* ]]; then
    SHELL_CONFIG="$HOME/.zshrc"
elif [[ "$SHELL" == *"bash"* ]]; then
    SHELL_CONFIG="$HOME/.bashrc"
else
    SHELL_CONFIG="$HOME/.profile"
fi

print_info "Detected shell configuration file: $SHELL_CONFIG"

# Backup existing config
if [[ -f "$SHELL_CONFIG" ]]; then
    cp "$SHELL_CONFIG" "$SHELL_CONFIG.backup.$(date +%Y%m%d_%H%M%S)"
    print_success "Backed up existing shell configuration"
fi

# Add environment variables
echo "" >> "$SHELL_CONFIG"
echo "# ReportFlow GitHub OAuth Configuration" >> "$SHELL_CONFIG"
echo "export GITHUB_CLIENT_ID=\"$GITHUB_CLIENT_ID\"" >> "$SHELL_CONFIG"
echo "export GITHUB_CLIENT_SECRET=\"$GITHUB_CLIENT_SECRET\"" >> "$SHELL_CONFIG"

print_success "Environment variables added to $SHELL_CONFIG"

print_step "4" "Load Environment Variables"

# Export for current session
export GITHUB_CLIENT_ID="$GITHUB_CLIENT_ID"
export GITHUB_CLIENT_SECRET="$GITHUB_CLIENT_SECRET"

print_success "Environment variables loaded for current session"

print_step "5" "Verify Configuration"

# Test environment variables
if [[ -n "$GITHUB_CLIENT_ID" && -n "$GITHUB_CLIENT_SECRET" ]]; then
    print_success "GitHub OAuth credentials configured successfully"
    echo ""
    echo "Client ID: $GITHUB_CLIENT_ID"
    echo "Client Secret: ${GITHUB_CLIENT_SECRET:0:8}..." # Show only first 8 characters
else
    print_error "Failed to configure environment variables"
    exit 1
fi

print_header "OAuth Setup Complete"

echo -e "${GREEN}Configuration Summary:${NC}"
echo "✅ GitHub OAuth app created"
echo "✅ Environment variables configured"
echo "✅ Shell configuration updated"

echo -e "\n${YELLOW}Important Notes:${NC}"
echo "• Environment variables are active in current session"
echo "• New terminal sessions will automatically load the variables"
echo "• Backup of shell config saved with timestamp"

echo -e "\n${BLUE}Next Steps:${NC}"
echo "1. Start the ReportFlow application:"
echo "   mvn spring-boot:run"
echo ""
echo "2. Test the OAuth flow:"
echo "   curl http://localhost:8080/api/auth/github/url"
echo ""
echo "3. Run the complete test suite:"
echo "   ./test_api.sh"

echo -e "\n${GREEN}For new terminal sessions, run:${NC}"
echo "source $SHELL_CONFIG"

print_success "GitHub OAuth setup completed successfully!"

# Optional: Test OAuth URL generation
echo ""
read -p "Would you like to test OAuth URL generation now? (y/n): " test_oauth
if [[ "$test_oauth" =~ ^[Yy]$ ]]; then
    print_info "Testing OAuth URL generation..."
    
    # Start application in background for testing
    echo "Starting application for testing..."
    mvn spring-boot:run > /dev/null 2>&1 &
    APP_PID=$!
    
    # Wait for application to start
    sleep 10
    
    # Test OAuth URL
    OAUTH_URL=$(curl -s http://localhost:8080/api/auth/github/url 2>/dev/null | grep -o 'https://github.com/login/oauth/authorize[^"]*' || echo "")
    
    if [[ -n "$OAUTH_URL" ]]; then
        print_success "OAuth URL generation working!"
        echo "OAuth URL: $OAUTH_URL"
    else
        print_error "OAuth URL generation failed. Check application logs."
    fi
    
    # Stop test application
    kill $APP_PID 2>/dev/null
    
    print_info "Test completed. You can now start the application normally."
fi
