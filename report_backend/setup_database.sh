#!/bin/bash

# 🐘 PostgreSQL Database Setup Script for ReportFlow

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

print_header "ReportFlow Database Setup"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    print_error "PostgreSQL is not installed"
    print_info "Install PostgreSQL first:"
    echo "  macOS: brew install postgresql"
    echo "  Ubuntu: sudo apt-get install postgresql postgresql-contrib"
    exit 1
fi

print_success "PostgreSQL is installed"

# Check if PostgreSQL is running
if ! pg_isready -q; then
    print_info "Starting PostgreSQL service..."
    if command -v brew &> /dev/null; then
        brew services start postgresql
    else
        sudo systemctl start postgresql
    fi
    
    # Wait a moment for service to start
    sleep 2
    
    if ! pg_isready -q; then
        print_error "Failed to start PostgreSQL service"
        exit 1
    fi
fi

print_success "PostgreSQL service is running"

# Database configuration
DB_NAME="reportflow"
DB_USER="reportflow_user"
DB_PASSWORD="reportflow_password"

print_info "Creating database and user..."

# Create database and user
psql postgres << EOF
-- Drop database if exists (for clean setup)
DROP DATABASE IF EXISTS ${DB_NAME};
DROP USER IF EXISTS ${DB_USER};

-- Create database
CREATE DATABASE ${DB_NAME};

-- Create user with password
CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASSWORD}';

-- Grant all privileges on database
GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};

-- Connect to the new database and grant schema privileges
\c ${DB_NAME}
GRANT ALL ON SCHEMA public TO ${DB_USER};
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO ${DB_USER};
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO ${DB_USER};

-- Grant default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ${DB_USER};
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO ${DB_USER};

EOF

if [ $? -eq 0 ]; then
    print_success "Database '${DB_NAME}' created successfully"
    print_success "User '${DB_USER}' created with all privileges"
else
    print_error "Failed to create database or user"
    exit 1
fi

# Test database connection
print_info "Testing database connection..."

PGPASSWORD=${DB_PASSWORD} psql -h localhost -U ${DB_USER} -d ${DB_NAME} -c "SELECT version();" > /dev/null 2>&1

if [ $? -eq 0 ]; then
    print_success "Database connection test successful"
else
    print_error "Database connection test failed"
    exit 1
fi

print_header "Database Setup Complete"

echo -e "${GREEN}Database Configuration:${NC}"
echo "  Database: ${DB_NAME}"
echo "  Username: ${DB_USER}"
echo "  Password: ${DB_PASSWORD}"
echo "  Host: localhost"
echo "  Port: 5432"

echo -e "\n${YELLOW}Connection String:${NC}"
echo "  jdbc:postgresql://localhost:5432/${DB_NAME}"

echo -e "\n${BLUE}Next Steps:${NC}"
echo "1. Set up GitHub OAuth credentials"
echo "2. Set environment variables:"
echo "   export GITHUB_CLIENT_ID=\"your_client_id\""
echo "   export GITHUB_CLIENT_SECRET=\"your_client_secret\""
echo "3. Start the application: mvn spring-boot:run"

print_success "Database setup completed successfully!"
