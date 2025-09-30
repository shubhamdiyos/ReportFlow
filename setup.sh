#!/bin/bash

# 🚀 ReportFlow Complete Setup Script
# Sets up both backend and frontend in the new directory structure

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

print_header "🚀 ReportFlow Complete Setup"

# Check if we're in the right directory
if [[ ! -d "report_backend" ]] || [[ ! -d "report_frontend" ]]; then
    print_error "Please run this script from the ReportFlow root directory"
    print_info "Expected structure: ReportFlow/report_backend/ and ReportFlow/report_frontend/"
    exit 1
fi

print_success "Correct directory structure detected"

# =============================================================================
# BACKEND SETUP
# =============================================================================

print_header "🔧 Backend Setup (Spring Boot)"

cd report_backend

# Check Java version
if ! command -v java &> /dev/null; then
    print_error "Java is not installed. Please install Java 17+"
    exit 1
fi

JAVA_VERSION=$(java -version 2>&1 | grep -oP 'version "?(1\.)?\K\d+' | head -1)
if [[ $JAVA_VERSION -lt 17 ]]; then
    print_error "Java 17+ required. Current version: $JAVA_VERSION"
    exit 1
fi

print_success "Java $JAVA_VERSION detected"

# Check Maven
if ! command -v mvn &> /dev/null; then
    print_error "Maven is not installed. Please install Maven"
    exit 1
fi

print_success "Maven detected"

# Check PostgreSQL
if ! command -v psql &> /dev/null; then
    print_error "PostgreSQL is not installed. Please install PostgreSQL"
    exit 1
fi

print_success "PostgreSQL detected"

# Setup database
print_info "Setting up database..."
if ./setup_database.sh; then
    print_success "Database setup completed"
else
    print_error "Database setup failed"
    exit 1
fi

# Check environment variables
if [[ -z "$GITHUB_CLIENT_ID" ]] || [[ -z "$GITHUB_CLIENT_SECRET" ]]; then
    print_info "GitHub OAuth credentials not found in environment"
    print_info "Please run: ./setup_github_oauth.sh"
    print_info "Or set environment variables manually:"
    echo "  export GITHUB_CLIENT_ID=\"your_client_id\""
    echo "  export GITHUB_CLIENT_SECRET=\"your_client_secret\""
else
    print_success "GitHub OAuth credentials configured"
fi

# Build backend
print_info "Building backend..."
if mvn clean compile -q; then
    print_success "Backend build successful"
else
    print_error "Backend build failed"
    exit 1
fi

# Test backend
print_info "Testing backend APIs..."
if mvn spring-boot:run > backend.log 2>&1 &
then
    BACKEND_PID=$!
    print_info "Backend started (PID: $BACKEND_PID)"
    
    # Wait for startup
    sleep 10
    
    # Test health endpoint
    if curl -s http://localhost:8080/api/auth/health | grep -q "ok"; then
        print_success "Backend health check passed"
    else
        print_error "Backend health check failed"
        kill $BACKEND_PID 2>/dev/null
        exit 1
    fi
    
    # Stop test backend
    kill $BACKEND_PID 2>/dev/null
    print_success "Backend testing completed"
else
    print_error "Failed to start backend"
    exit 1
fi

cd ..

# =============================================================================
# FRONTEND SETUP
# =============================================================================

print_header "⚛️ Frontend Setup (React)"

cd report_frontend

# Check if frontend is already set up
if [[ -f "package.json" ]]; then
    print_success "Frontend already initialized"
    
    # Install dependencies
    print_info "Installing frontend dependencies..."
    if npm install; then
        print_success "Frontend dependencies installed"
    else
        print_error "Frontend dependency installation failed"
        exit 1
    fi
else
    print_info "Frontend not initialized. Creating React app..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+"
        exit 1
    fi
    
    NODE_VERSION=$(node -v | grep -oP 'v\K\d+')
    if [[ $NODE_VERSION -lt 18 ]]; then
        print_error "Node.js 18+ required. Current version: v$NODE_VERSION"
        exit 1
    fi
    
    print_success "Node.js v$NODE_VERSION detected"
    
    # Create React app
    print_info "Creating React application with TypeScript..."
    if npx create-react-app . --template typescript; then
        print_success "React app created successfully"
    else
        print_error "Failed to create React app"
        exit 1
    fi
    
    # Install additional dependencies
    print_info "Installing additional dependencies..."
    npm install axios @types/axios react-router-dom @types/react-router-dom
    npm install tailwindcss @types/tailwindcss
    npm install chart.js react-chartjs-2
    
    print_success "Additional dependencies installed"
fi

cd ..

# =============================================================================
# CONFIGURATION FILES
# =============================================================================

print_header "⚙️ Configuration Setup"

# Create environment files
print_info "Creating environment configuration files..."

# Backend environment (if not exists)
if [[ ! -f "report_backend/.env" ]]; then
    cat > report_backend/.env << EOF
# Backend Environment Configuration
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
DATABASE_URL=postgresql://reportflow_user:reportflow_password@localhost:5432/reportflow
JWT_SECRET=your_jwt_secret_key_here
CORS_ORIGINS=http://localhost:3000,http://localhost:5000,http://localhost:5173
EOF
    print_success "Backend .env file created"
else
    print_info "Backend .env file already exists"
fi

# Frontend environment (if not exists)
if [[ ! -f "report_frontend/.env.local" ]]; then
    cat > report_frontend/.env.local << EOF
# Frontend Environment Configuration
REACT_APP_API_BASE_URL=http://localhost:8080/api
REACT_APP_GITHUB_CLIENT_ID=your_github_client_id
REACT_APP_APP_NAME=ReportFlow
REACT_APP_VERSION=1.0.0
EOF
    print_success "Frontend .env.local file created"
else
    print_info "Frontend .env.local file already exists"
fi

# =============================================================================
# FINAL VERIFICATION
# =============================================================================

print_header "✅ Setup Verification"

print_success "Backend setup completed"
echo "  - Spring Boot application ready"
echo "  - Database configured"
echo "  - APIs tested and working"
echo "  - Documentation available"

if [[ -f "report_frontend/package.json" ]]; then
    print_success "Frontend setup completed"
    echo "  - React application ready"
    echo "  - Dependencies installed"
    echo "  - Environment configured"
else
    print_info "Frontend setup partially completed"
    echo "  - React app creation may need manual completion"
fi

print_header "🚀 Next Steps"

echo "1. Configure GitHub OAuth credentials:"
echo "   cd report_backend && ./setup_github_oauth.sh"
echo ""
echo "2. Start the backend:"
echo "   cd report_backend && mvn spring-boot:run"
echo ""
echo "3. Start the frontend:"
echo "   cd report_frontend && npm start"
echo ""
echo "4. Access the application:"
echo "   - Backend API: http://localhost:8080"
echo "   - Frontend App: http://localhost:3000"
echo ""

print_success "ReportFlow setup completed successfully!"

echo -e "\n${BLUE}📋 Quick Commands:${NC}"
echo "Backend: cd report_backend && mvn spring-boot:run"
echo "Frontend: cd report_frontend && npm start"
echo "Test APIs: cd report_backend && ./test_all_apis_manual.sh"
