#!/bin/bash

# Deploy ReportFlow using Docker with Nginx isolation
# This script deploys ReportFlow on the same EC2 instance as existing projects

set -e

echo "🚀 Deploying ReportFlow with Docker isolation..."

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

# Create ReportFlow directory
mkdir -p ~/reportflow
cd ~/reportflow

# Stop any existing ReportFlow containers
echo "🛑 Stopping existing ReportFlow containers..."
docker-compose -f docker-compose-reportflow.yml down 2>/dev/null || true

# Clean up old containers
docker rm reportflow-postgres reportflow-backend reportflow-nginx 2>/dev/null || true

# Copy files from local (these should be copied via SCP first)
echo "📋 Setting up configuration files..."

# Create init.sql
cat > init.sql << 'EOF'
-- Initialize PostgreSQL database for ReportFlow
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
GRANT ALL PRIVILEGES ON DATABASE reportflow TO reportflow_user;
EOF

# Create environment file
cat > .env << EOF
# GitHub OAuth Configuration (replace with your actual values)
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here

# Database Configuration
DATABASE_URL=jdbc:postgresql://reportflow-postgres:5432/reportflow
DB_USERNAME=reportflow_user
DB_PASSWORD=reportflow_password

# JWT Configuration
JWT_SECRET=2YrMZR3BqiU6N18gcgfRX23cIiDiusL4TRbAq912uf5+lPiTPWW6y+vu7WD8Uex7GN5aRIPYsKvpsAvAbi1qxg==

# Application URLs
AWS_BACKEND_URL=http://13.232.117.123:8080
FRONTEND_URL=http://13.232.117.123:3000

# Port Configuration
PORT=8080
EOF

echo "🐳 Starting ReportFlow containers..."

# Start the services
docker-compose -f docker-compose-reportflow.yml up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 15

# Check service status
echo "📊 Checking service status..."
docker-compose -f docker-compose-reportflow.yml ps

# Wait for database to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
until docker exec reportflow-postgres pg_isready -U reportflow_user -d reportflow; do
    echo "Waiting for PostgreSQL..."
    sleep 2
done

# Wait for application to be ready
echo "⏳ Waiting for ReportFlow backend to be ready..."
until curl -s http://localhost:8080/actuator/health | grep -q "UP\|DOWN"; do
    echo "Waiting for ReportFlow backend..."
    sleep 5
done

echo ""
echo "✅ ReportFlow deployment completed!"
echo ""
echo "📋 Service URLs:"
echo "   🐘 PostgreSQL: localhost:5433 (direct access)"
echo "   🔧 Backend API: http://13.232.117.123:8080"
echo "   🌐 Nginx Proxy: http://13.232.117.123:8081"
echo ""
echo "🧪 Test commands:"
echo "   docker-compose -f docker-compose-reportflow.yml logs reportflow-backend"
echo "   curl http://13.232.117.123:8080/actuator/health"
echo "   curl http://13.232.117.123:8081/actuator/health"
echo ""
echo "📊 Management:"
echo "   Stop: docker-compose -f docker-compose-reportflow.yml down"
echo "   Restart: docker-compose -f docker-compose-reportflow.yml restart"
echo "   Logs: docker-compose -f docker-compose-reportflow.yml logs -f"
echo ""
echo "🔧 Next steps:"
echo "1. Update GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in ~/reportflow/.env"
echo "2. Restart: docker-compose -f docker-compose-reportflow.yml restart reportflow-backend"
echo "3. Update GitHub OAuth callback URL to: http://13.232.117.123:8080/api/auth/github/callback"
