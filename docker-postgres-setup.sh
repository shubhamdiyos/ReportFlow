#!/bin/bash

# Docker PostgreSQL Setup for ReportFlow on EC2
# Run this script on your EC2 instance

set -e

echo "🐘 Setting up PostgreSQL with Docker for ReportFlow..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "📦 Installing Docker..."
    sudo yum update -y
    sudo yum install -y docker
    sudo systemctl start docker
    sudo systemctl enable docker
    sudo usermod -a -G docker ec2-user
    echo "✅ Docker installed successfully"
else
    echo "✅ Docker is already installed"
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "📦 Installing Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    echo "✅ Docker Compose installed successfully"
else
    echo "✅ Docker Compose is already installed"
fi

# Create application directory
mkdir -p ~/reportflow
cd ~/reportflow

# Create docker-compose.yml for PostgreSQL
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: reportflow-postgres
    environment:
      POSTGRES_DB: reportflow
      POSTGRES_USER: reportflow_user
      POSTGRES_PASSWORD: reportflow_password
      POSTGRES_INITDB_ARGS: "--encoding=UTF-8"
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - reportflow-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U reportflow_user -d reportflow"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:

networks:
  reportflow-network:
    driver: bridge
EOF

# Create init.sql file
cat > init.sql << 'EOF'
-- Initialize PostgreSQL database for ReportFlow
-- This script runs automatically when the PostgreSQL container starts

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Set up default schema
-- The actual tables will be created automatically by Spring Boot JPA
-- due to the ddl-auto=update setting

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE reportflow TO reportflow_user;
EOF

echo "🚀 Starting PostgreSQL container..."

# Start PostgreSQL container
docker-compose up -d postgres

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 10

# Check if PostgreSQL is running
if docker-compose ps postgres | grep -q "Up"; then
    echo "✅ PostgreSQL is running successfully!"
    echo ""
    echo "📋 Database Details:"
    echo "   Host: localhost"
    echo "   Port: 5432"
    echo "   Database: reportflow"
    echo "   Username: reportflow_user"
    echo "   Password: reportflow_password"
    echo ""
    echo "🔗 Connection URL: jdbc:postgresql://localhost:5432/reportflow"
    echo ""
    echo "🧪 Test connection:"
    echo "   docker exec -it reportflow-postgres psql -U reportflow_user -d reportflow"
    echo ""
    echo "📊 Check logs:"
    echo "   docker-compose logs postgres"
    echo ""
    echo "🛑 Stop database:"
    echo "   docker-compose down"
else
    echo "❌ PostgreSQL failed to start"
    echo "📊 Check logs: docker-compose logs postgres"
    exit 1
fi

echo "🎉 PostgreSQL setup completed!"
echo ""
echo "📝 Next steps:"
echo "1. Update your application to use this database"
echo "2. Restart your Spring Boot application"
echo "3. Test the connection"
